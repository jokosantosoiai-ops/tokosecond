'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// KONFIGURASI LOGISTIK (Gampang diubah di satu tempat)
const COST_PER_KM = 5000;
const MINIMUM_SHIPPING_FEE = 25000; // Biaya minimum kargo

export default function ListingDetail() {
  const { id } = useParams()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [shippingMethod, setShippingMethod] = useState('')
  
  // State Kalkulasi Jarak & Ongkir
  const [distance, setDistance] = useState<number | null>(null)
  const [shippingEstimate, setShippingEstimate] = useState<number>(0)
  const [locationError, setLocationError] = useState(false)

  // Fungsi Haversine: Hitung jarak lurus (KM)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius Bumi KM
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

      // PRO LOGIC: Hitung Jarak & Ongkir Otomatis jika data koordinat tersedia
      if (data?.latitude && data?.longitude && typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const d = calculateDistance(
              data.latitude, 
              data.longitude,
              position.coords.latitude, 
              position.coords.longitude
            );
            
            setDistance(d);
            
            // Logika Biaya: Jarak x Biaya/KM, minimal biaya dasar
            const totalOngkir = Math.max(MINIMUM_SHIPPING_FEE, Math.round(d * COST_PER_KM));
            setShippingEstimate(totalOngkir);
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
    
    const totalHarga = (listing.price || 0) + (shippingMethod === "Kargo Material (Otomatis)" ? shippingEstimate : 0);
    
    const msg = `Halo Admin, saya ingin order:
---------------------------
📦 Item: ${listing.title}
💰 Harga: Rp ${listing.price?.toLocaleString('id-ID')}
🚚 Kurir: ${shippingMethod}
📍 Jarak: ${distance ? distance.toFixed(1) + ' KM' : 'Tidak terdeteksi'}
🚛 Ongkir: Rp ${shippingMethod === "Kargo Material (Otomatis)" ? shippingEstimate.toLocaleString('id-ID') : 'Dihitung kurir'}
---------------------------
🔥 Total Estimasi: Rp ${totalHarga.toLocaleString('id-ID')}

Tolong diproses ya min!`;

    window.open(`https://wa.me/6281227127543?text=${encodeURIComponent(msg)}`, '_blank');
  }

  if (loading) return <div className="text-center py-20 font-black text-gray-400 animate-pulse uppercase tracking-widest text-xs">Menghitung Jarak Berkah...</div>
  if (!listing) return <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-tighter">Produk tidak ditemukan.</div>

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        
        <Link href="/" className="inline-flex items-center text-[10px] font-black text-gray-400 hover:text-[#EE4D2D] mb-6 transition-colors tracking-widest">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          KEMBALI KE ETALASE
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Sisi Kiri: Gambar */}
            <div className="aspect-square bg-gray-100 relative group">
              <img src={listing.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={listing.title} />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-5 py-2 rounded-full shadow-sm border border-white">
                <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] italic">📦 {listing.category}</p>
              </div>
            </div>

            {/* Sisi Kanan: Konten & Logic */}
            <div className="p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <span className="text-[10px] font-black text-[#EE4D2D] bg-orange-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-orange-100">
                    📍 {listing.location_city}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-3 uppercase tracking-tighter">
                  {listing.title}
                </h1>
                
                <p className="text-4xl font-black text-[#EE4D2D] mb-8 tracking-tighter">
                  Rp {listing.price?.toLocaleString('id-ID')}
                </p>

                {/* UI Kalkulator Logistik Otomatis */}
                {distance ? (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-[2rem] border border-orange-200 mb-8 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[10px] font-black text-orange-700 uppercase tracking-[0.2em]">Logistik Presisi Otomatis</p>
                      <span className="bg-orange-600 text-white text-[8px] px-3 py-1 rounded-full font-bold animate-pulse">LIVE GPS OK</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{distance.toFixed(1)} KM</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-2">Jarak Pengiriman</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-[#EE4D2D] leading-none">
                          + Rp {shippingEstimate.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 italic">Estimasi Ongkir</p>
                      </div>
                    </div>
                  </div>
                ) : !locationError ? (
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-dashed border-gray-200 mb-8 flex items-center justify-center">
                    <p className="text-[10px] font-bold text-gray-400 animate-pulse italic uppercase tracking-widest">Memindai Koordinat Lokasi Anda...</p>
                  </div>
                ) : (
                  <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 mb-8">
                     <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest leading-relaxed">Gagal deteksi lokasi. Pastikan GPS aktif untuk hitung ongkir otomatis.</p>
                  </div>
                )}
                
                <div className="space-y-4 mb-10">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">Informasi Detail Produk</p>
                  <p className="text-gray-600 leading-relaxed text-sm italic font-medium">"{listing.description}"</p>
                </div>

                {/* Dropdown Metode Pengiriman */}
                <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 mb-10 transition-all hover:border-blue-300">
                  <label className="block text-[10px] font-black text-blue-700 uppercase tracking-widest mb-4">Pilih Jalur Pengiriman</label>
                  <div className="relative">
                    <select 
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-full bg-white border border-blue-200 p-4 rounded-2xl text-[11px] font-black text-gray-700 outline-none appearance-none cursor-pointer shadow-sm focus:ring-2 ring-blue-400"
                    >
                      <option value="">-- PILIH METODE KIRIM --</option>
                      <option value="Kargo Material (Otomatis)">Gunakan Estimasi Logistik GPS (Kargo)</option>
                      <option value="Paket Regular">Paket Regular (JNE/J&T/Sicepat)</option>
                      <option value="Self-Pickup">Ambil di Lokasi (Free Ongkir)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                       <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link href={`/penjual/${listing.phone_number}`} className="group block mb-4">
                  <div className="flex items-center justify-between bg-gray-50 p-5 rounded-2xl border border-transparent group-hover:border-gray-300 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {listing.account_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-xs uppercase tracking-tighter leading-none group-hover:text-[#EE4D2D]">{listing.account_name}</h4>
                        <p className="text-[9px] text-blue-600 font-black uppercase mt-1.5 tracking-widest">Kunjungi Toko →</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <button 
                  onClick={checkPaymentStatus}
                  className="w-full bg-[#EE4D2D] hover:bg-[#d44124] text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-orange-200 transition-all transform active:scale-[0.97] flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs"
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