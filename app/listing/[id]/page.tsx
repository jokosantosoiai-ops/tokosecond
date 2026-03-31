'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ListingDetail() {
  const { id } = useParams()
  const [listing, setListing] = useState<any>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [loading, setLoading] = useState(true)
  const [shippingMethod, setShippingMethod] = useState('')
  
  // State untuk Kalkulasi Jarak & Ongkir Otomatis
  const [distance, setDistance] = useState<number | null>(null)
  const [shippingEstimate, setShippingEstimate] = useState<number>(0)

  useEffect(() => {
    fetchDetail()
  }, [id])

  // Fungsi Haversine: Hitung jarak lurus antara dua koordinat (KM)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius Bumi dalam KM
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  async function fetchDetail() {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()
    
    setListing(data)
    setLoading(false)

    // Deteksi Lokasi Pembeli untuk hitung Jarak Otomatis
    if (data?.latitude && data?.longitude && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const d = calculateDistance(
          data.latitude, data.longitude,
          position.coords.latitude, position.coords.longitude
        )
        setDistance(d)
        
        // Logika Ongkir: Misal Rp 5.000 per KM untuk Kargo/Material
        // Bapak bisa sesuaikan angka 5000 di bawah ini
        setShippingEstimate(Math.round(d * 5000))
      }, (err) => console.error("Izin lokasi ditolak pembeli", err))
    }
  }

  async function checkPaymentStatus() {
    if (!shippingMethod) {
      alert("Silakan pilih metode pengiriman untuk melanjutkan.");
      return;
    }
    
    const msg = `Halo Admin, saya ingin beli ${listing.title} (ID: ${id}). %0AMetode Kirim: ${shippingMethod} %0AEstimasi Jarak: ${distance?.toFixed(1)} KM %0AEstimasi Ongkir: Rp ${shippingEstimate.toLocaleString('id-ID')}`
    window.open(`https://wa.me/6281227127543?text=${msg}`, '_blank')
  }

  if (loading) return <div className="text-center py-20 font-bold text-gray-400 animate-pulse uppercase tracking-widest text-xs">Menghitung Jarak Berkah...</div>
  if (!listing) return <div className="text-center py-20 text-gray-500 font-bold">Produk tidak ditemukan.</div>

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        
        <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#EE4D2D] mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          KEMBALI KE BERANDA
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            <div className="aspect-square bg-gray-50 relative group">
              <img src={listing.image_url} className="w-full h-full object-cover" alt={listing.title} />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-sm">
                <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest italic">📦 {listing.category}</p>
              </div>
            </div>

            <div className="p-8 md:p-10 flex flex-col">
              <div className="mb-4">
                <span className="text-[10px] font-black text-[#EE4D2D] bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest border border-orange-100">
                  📍 {listing.location_city}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2 uppercase tracking-tighter">
                {listing.title}
              </h1>
              
              <p className="text-3xl font-black text-[#EE4D2D] mb-8">
                Rp {listing.price?.toLocaleString('id-ID')}
              </p>

              {/* UI KALKULATOR JARAK & ONGKIR OTOMATIS */}
              {distance && (
                <div className="bg-orange-50 p-5 rounded-3xl border border-orange-200 mb-6 shadow-sm animate-in fade-in zoom-in duration-500">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Estimasi Logistik Otomatis</p>
                    <span className="bg-orange-600 text-white text-[8px] px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE GPS</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{distance.toFixed(1)} KM</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Jarak dari lokasi Anda</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-[#EE4D2D] leading-none">
                        + Rp {shippingEstimate.toLocaleString('id-ID')}
                      </p>
                      <p className="text-[9px] text-gray-400 font-medium italic">Est. Ongkir Kargo</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 mb-8 flex-grow">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-2">Deskripsi Barang</p>
                <p className="text-gray-600 leading-relaxed text-sm italic italic">"{listing.description}"</p>
              </div>

              {/* OPSI PENGIRIMAN */}
              <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 mb-6">
                <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-3">Konfirmasi Pengiriman</p>
                <select 
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full bg-white border border-blue-200 p-3 rounded-xl text-xs font-bold text-gray-700 outline-none appearance-none cursor-pointer"
                >
                  <option value="">-- Pilih Metode Kirim --</option>
                  <option value="Kargo Material (Otomatis)">Gunakan Estimasi Ongkir Kargo di Atas</option>
                  <option value="Paket Regular">Paket Regular (JNE/J&T)</option>
                  <option value="Self-Pickup">Ambil Sendiri di Lokasi Penjual</option>
                </select>
              </div>

              {/* INFO PENJUAL */}
              <div className="pt-6 border-t border-dashed border-gray-200 mb-6">
                <Link href={`/penjual/${listing.phone_number}`} className="group block">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-transparent group-hover:border-[#EE4D2D] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-sm">
                        {listing.account_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-xs uppercase tracking-tighter leading-none group-hover:text-[#EE4D2D]">{listing.account_name}</h4>
                        <p className="text-[9px] text-blue-600 font-black uppercase mt-1">Cek Etalase Penjual →</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* PEMBAYARAN */}
              <div className="bg-gray-900 p-6 rounded-3xl text-center shadow-xl">
                <button 
                  onClick={checkPaymentStatus}
                  className="w-full bg-[#EE4D2D] hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                  🛒 Beli & Amankan Dana
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}