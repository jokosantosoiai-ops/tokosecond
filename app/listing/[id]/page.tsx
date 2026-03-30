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

  useEffect(() => {
    fetchDetail()
  }, [id])

  async function fetchDetail() {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()
    
    setListing(data)
    setLoading(false)
  }

  // Fungsi Pembayaran (Midtrans / WA Admin)
  async function checkPaymentStatus() {
    if (!shippingMethod) {
      alert("Silakan pilih metode pengiriman terlebih dahulu untuk estimasi biaya.");
      return;
    }
    
    alert(`Metode: ${shippingMethod}. Sistem akan mengarahkan Anda ke Pembayaran. Setelah lunas, nomor HP penjual akan muncul otomatis.`);
    window.open(`https://wa.me/6281227127543?text=Saya%20ingin%20beli%20${encodeURIComponent(listing.title)}%20ID:%20${id}%20Metode%20Kirim:%20${shippingMethod}`, '_blank')
  }

  if (loading) return <div className="text-center py-20 font-bold text-gray-400 animate-pulse uppercase tracking-widest">Memuat Detail Berkah...</div>
  if (!listing) return <div className="text-center py-20 text-gray-500 font-bold">Produk tidak ditemukan.</div>

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        
        {/* TOMBOL KEMBALI */}
        <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#EE4D2D] mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          KEMBALI KE BERANDA
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* 1. FOTO PRODUK */}
            <div className="aspect-square bg-gray-50 relative group">
              <img 
                src={listing.image_url} 
                className="w-full h-full object-cover" 
                alt={listing.title} 
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-sm">
                <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest italic">
                  📦 {listing.category}
                </p>
              </div>
            </div>

            {/* 2. DETAIL PRODUK */}
            <div className="p-8 md:p-10 flex flex-col">
              <div className="flex justify-between items-start mb-4">
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
              
              <div className="space-y-4 mb-10 flex-grow">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-2">Deskripsi Barang</p>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap italic">
                  "{listing.description}"
                </p>
              </div>

              {/* 3. SIMULASI PILIHAN ONGKIR (UPGRADE CERDAS) */}
              <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Opsi Pengiriman</p>
                </div>
                <select 
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full bg-white border border-blue-200 p-3 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                >
                  <option value="">-- Pilih Metode Kirim --</option>
                  <option value="Paket Regular (JNE/J&T)">Paket Regular (JNE/J&T/Sicepat)</option>
                  <option value="Instan (Grab/Gojek)">Instan (Grab/Gojek - Khusus Dalam Kota)</option>
                  <option value="Kargo / Lalamove">Kargo (Material/Barang Besar - Cek Biaya)</option>
                  <option value="Self-Pickup">Ambil Sendiri di Lokasi Penjual</option>
                </select>
                <p className="text-[9px] text-blue-500 mt-2 font-medium italic">*Estimasi biaya ongkir akan dikonfirmasi Admin setelah klik beli.</p>
              </div>

              {/* 4. INFORMASI PENJUAL */}
              <div className="pt-6 border-t border-dashed border-gray-200 mb-6">
                <Link href={`/penjual/${listing.phone_number}`} className="group block">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-transparent group-hover:border-[#EE4D2D] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-sm">
                        {listing.account_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-xs group-hover:text-[#EE4D2D] uppercase tracking-tighter leading-none">
                          {listing.account_name}
                        </h4>
                        <p className="text-[9px] text-blue-600 font-black uppercase mt-1">Etalase Penjual →</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* 5. AREA KONTAK & PEMBAYARAN */}
              <div>
                {!isPaid ? (
                  <div className="bg-gray-900 p-6 rounded-3xl text-center shadow-xl">
                    <p className="text-[10px] text-gray-400 font-bold mb-4 uppercase tracking-[0.2em]">
                      🔒 Transaksi Escrow Aman
                    </p>
                    <button 
                      onClick={checkPaymentStatus}
                      className="w-full bg-[#EE4D2D] hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                    >
                      Beli Sekarang (Dana Diproteksi)
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 p-6 rounded-3xl border-2 border-green-200 text-center">
                    <p className="text-[10px] text-green-600 font-black mb-2 uppercase tracking-[0.2em]">✅ Pembayaran Terverifikasi</p>
                    <p className="text-xl font-black text-gray-900 mb-4 tracking-tighter">WHATSAPP: {listing.phone_number}</p>
                    <a 
                      href={`https://wa.me/${listing.phone_number}`}
                      target="_blank"
                      className="block text-center bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest"
                    >
                      Hubungi Penjual
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 6. DATA REKENING (INTERNAL) */}
        {isPaid && (
          <div className="mt-8 bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-[10px] border-l-4 border-[#EE4D2D] pl-4">
              Data Pencairan Dana (Internal)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Bank</p>
                <p className="font-black text-gray-800 text-xs">{listing.bank_name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">No. Rekening</p>
                <p className="font-black text-gray-800 text-xs font-mono">{listing.account_number}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Pemilik</p>
                <p className="font-black text-gray-800 text-xs uppercase">{listing.account_name}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}