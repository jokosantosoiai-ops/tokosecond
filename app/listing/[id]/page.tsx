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
    alert("Sistem akan mengarahkan Anda ke Pembayaran. Setelah lunas, nomor HP penjual akan muncul otomatis.")
    window.open(`https://wa.me/6281227127543?text=Saya%20ingin%20beli%20${encodeURIComponent(listing.title)}%20ID:%20${id}`, '_blank')
  }

  if (loading) return <div className="text-center py-20 font-bold text-gray-400 animate-pulse">Memuat Detail Berkah...</div>
  if (!listing) return <div className="text-center py-20 text-gray-500">Produk tidak ditemukan.</div>

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
              
              <div className="space-y-4 mb-10">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-2">Deskripsi Barang</p>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap italic">
                  "{listing.description}"
                </p>
              </div>

              {/* 3. INFORMASI PENJUAL (PENYAMBUNG STRUKTUR) */}
              <div className="mt-auto pt-8 border-t border-dashed border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Profil Penjual Berkah</p>
                
                <Link href={`/penjual/${listing.phone_number}`} className="group block">
                  <div className="flex items-center justify-between bg-gray-50 p-5 rounded-3xl border border-transparent group-hover:border-[#EE4D2D] group-hover:bg-orange-50/30 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      {/* Avatar Inisial */}
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transform group-hover:rotate-6 transition-transform">
                        {listing.account_name?.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <h4 className="font-black text-gray-900 group-hover:text-[#EE4D2D] transition-colors flex items-center gap-1.5 uppercase tracking-tighter">
                          {listing.account_name}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 fill-current" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </h4>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter mt-1 animate-pulse">
                          Lihat Etalase Lengkap →
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* 4. AREA KONTAK & PEMBAYARAN */}
              <div className="mt-6">
                {!isPaid ? (
                  <div className="bg-gray-900 p-6 rounded-3xl text-center shadow-xl">
                    <p className="text-[10px] text-gray-400 font-bold mb-4 uppercase tracking-[0.2em]">
                      🔒 Transaksi Escrow Aman
                    </p>
                    <button 
                      onClick={checkPaymentStatus}
                      className="w-full bg-[#EE4D2D] hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Beli Sekarang (Dana Diproteksi)
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 p-6 rounded-3xl border-2 border-green-200">
                    <p className="text-[10px] text-green-600 font-black mb-2 uppercase tracking-[0.2em]">✅ Pembayaran Terverifikasi</p>
                    <p className="text-xl font-black text-gray-900 mb-4">WHATSAPP: {listing.phone_number}</p>
                    <a 
                      href={`https://wa.me/${listing.phone_number}`}
                      target="_blank"
                      className="block text-center bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl shadow-md transition-all uppercase text-xs tracking-widest"
                    >
                      Chat Penjual Langsung
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 5. DATA REKENING (HIDDEN UNTIL PAID) */}
        {isPaid && (
          <div className="mt-8 bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-sm">
            <h3 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-xs border-l-4 border-[#EE4D2D] pl-4">
              Rekening Tujuan Pencairan (Internal Admin)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Bank Penerima</p>
                <p className="font-black text-gray-800">{listing.bank_name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Nomor Rekening</p>
                <p className="font-black text-gray-800 font-mono text-lg">{listing.account_number}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Atas Nama</p>
                <p className="font-black text-gray-800 uppercase">{listing.account_name}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}