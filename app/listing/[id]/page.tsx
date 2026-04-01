'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// --- KONFIGURASI LOGISTIK PRO (BISA DIUBAH DI SINI) ---
const KARGO_COST_PER_KM = 5000;
const KARGO_MINIMUM_FEE = 25000;

// Konstanta untuk Metode REGULER (Simulasi Zona)
const REGULER_PRICE_PER_KG_ZONA = 15000; // Contoh harga rata-rata per kg
const REGULER_MARGIN = 0.1; // Margin 10%
const DEFAULT_WEIGHT_KG = 1; // Berat default jika data berat di DB kosong

export default function ListingDetail() {
  const { id } = useParams()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [shippingMethod, setShippingMethod] = useState('')
  
  // State Kalkulasi (Hidden dari UI muka sesuai instruksi)
  const [distance, setDistance] = useState<number | null>(null)
  const [kargoEstimate, setKargoEstimate] = useState<number>(0)
  const [regulerEstimate, setRegulerEstimate] = useState<number>(0)
  const [locationError, setLocationError] = useState(false)

  // Fungsi Haversine: Hitung jarak lurus (KM)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    if (id) fetchDetail()
  }, [id])

  async function fetchDetail() {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error;
      setListing(data)

      // PRO LOGIC: Hitung semua estimasi di balik layar
      if (data?.latitude && data?.longitude && typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const d = calculateDistance(
              data.latitude, data.longitude,
              position.coords.latitude, position.coords.longitude
            );
            setDistance(d);
            
            // 1. Hitung Estimasi KARGO
            const estKargo = Math.max(KARGO_MINIMUM_FEE, Math.round(d * KARGO_COST_PER_KM));
            setKargoEstimate(estKargo);

            // 2. Hitung Estimasi REGULER (Formula: ceil(berat) * harga_zona * (1 + margin))
            const berat = data.weight || DEFAULT_WEIGHT_KG;
            const estReguler = Math.ceil(berat) * REGULER_PRICE_PER_KG_ZONA * (1 + REGULER_MARGIN);
            setRegulerEstimate(Math.round(estReguler));
          },
          (err) => {
            console.warn("Akses lokasi ditolak", err);
            setLocationError(true);
          },
          { enableHighAccuracy: true }
        );
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false)
    }
  }

  async function checkPaymentStatus() {
    if (!shippingMethod) {
      alert("⚠️ Silakan pilih metode pengiriman untuk melanjutkan.");
      return;
    }
    
    // Tentukan ongkir berdasarkan pilihan yang dipilih user
    let finalShippingFee = 0;
    if (shippingMethod === "Kargo Material (Otomatis)") finalShippingFee = kargoEstimate;
    if (shippingMethod === "Paket Regular") finalShippingFee = regulerEstimate;

    const totalHarga = (listing.price || 0) + finalShippingFee;
    
    const msg = `Halo Admin, saya ingin order:
---------------------------
📦 Item: ${listing.title}
💰 Harga: Rp ${listing.price?.toLocaleString('id-ID')}
🚚 Kurir: ${shippingMethod}
📍 Jarak: ${distance ? distance.toFixed(1) + ' KM' : 'Tidak terdeteksi'}
🚛 Ongkir: Rp ${finalShippingFee > 0 ? finalShippingFee.toLocaleString('id-ID') : '0 / Dihitung kurir'}
---------------------------
🔥 Total Estimasi: Rp ${totalHarga.toLocaleString('id-ID')}

Tolong diproses ya min!`;

    window.open(`https://wa.me/6281227127543?text=${encodeURIComponent(msg)}`, '_blank');
  }

  if (loading) return <div className="text-center py-20 font-black text-gray-400 animate-pulse uppercase tracking-widest text-xs">Menghitung Jarak Berkah...</div>
  if (!listing) return <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-tighter">Produk tidak ditemukan.</div>

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        
        <Link href="/" className="inline-flex items-center text-[10px] font-black text-gray-400 hover:text-[#EE4D2D] mb-8 transition-colors tracking-widest uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Etalase
        </Link>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Sisi Kiri: Gambar */}
            <div className="aspect-square bg-gray-50 relative group">
              <img src={listing.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={listing.title} />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-5 py-2 rounded-full shadow-sm border border-white">
                <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest italic">📦 {listing.category}</p>
              </div>
            </div>

            {/* Sisi Kanan: Konten & Logic */}
            <div className="p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <span className="text-[10px] font-black text-[#EE4D2D] bg-orange-50 px-4 py-2 rounded-full uppercase tracking-widest border border-orange-100">
                    📍 {listing.location_city}
                  </span>
                </div>
                
                <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2 uppercase tracking-tighter">
                  {listing.title}
                </h1>
                
                <p className="text-4xl font-black text-[#EE4D2D] mb-10 tracking-tighter">
                  Rp {listing.price?.toLocaleString('id-ID')}
                </p>

                <div className="space-y-4 mb-10">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] border-b pb-2">Informasi Detail Produk</p>
                  <p className="text-gray-600 leading-relaxed text-sm italic font-medium">"{listing.description}"</p>
                </div>

                {/* Dropdown Metode Pengiriman (UI Tetap Clean) */}
                <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 mb-10">
                  <label className="block text-[10px] font-black text-blue-700 uppercase tracking-widest mb-4 px-2">Pilih Jalur Pengiriman</label>
                  <div className="relative">
                    <select 
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-full bg-white border border-blue-200 p-4 rounded-2xl text-[11px] font-black text-gray-700 outline-none appearance-none cursor-pointer shadow-sm focus:ring-2 ring-blue-400"
                    >
                      <option value="">-- PILIH METODE --</option>
                      <option value="Instan (Gojek/Grab)">⚡ Instan (Gojek/Grab)</option>
                      <option value="Kargo Material (Otomatis)">🚛 Kargo Material (Otomatis)</option>
                      <option value="Paket Regular">📦 Paket Regular (Formula Zona)</option>
                      <option value="Self-Pickup">🏠 Ambil di Lokasi (Free)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                       <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-sm uppercase">
                    {listing.account_name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-[11px] uppercase tracking-tighter leading-none">{listing.account_name}</h4>
                    <p className="text-[9px] text-blue-600 font-black uppercase mt-1 tracking-widest">Penjual Terverifikasi</p>
                  </div>
                </div>

                <button 
                  onClick={checkPaymentStatus}
                  className="w-full bg-[#EE4D2D] hover:bg-[#d73d1f] text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-orange-100 transition-all transform active:scale-[0.97] flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs"
                >
                  🛒 Beli & Amankan Dana (Rekber)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}