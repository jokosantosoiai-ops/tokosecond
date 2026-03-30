'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'

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

  // Simulasi cek status pembayaran (Nanti bisa dihubungkan ke Payment Gateway)
  async function checkPaymentStatus() {
    // Logika: Cek ke tabel 'transactions' apakah id ini sudah lunas
    alert("Sistem akan mengarahkan Anda ke Pembayaran. Setelah lunas, nomor HP penjual akan muncul otomatis.")
    // Di sini Anda bisa arahkan ke WhatsApp Admin untuk konfirmasi bayar atau ke Payment Gateway
    window.open(`https://wa.me/6281227127543?text=Saya%20ingin%20beli%20${encodeURIComponent(listing.title)}%20ID:%20${id}`, '_blank')
  }

  if (loading) return <div className="text-center py-20 font-bold">Memuat Detail...</div>
  if (!listing) return <div className="text-center py-20">Produk tidak ditemukan.</div>

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Foto Produk */}
            <div className="aspect-square bg-gray-200">
              <img 
                src={listing.image_url} 
                className="w-full h-full object-cover" 
                alt={listing.title} 
              />
            </div>

            {/* Detail Produk */}
            <div className="p-6 md:p-8 flex flex-col">
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full w-fit mb-4">
                {listing.location_city}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <p className="text-2xl font-extrabold text-[#EE4D2D] mb-6">
                Rp {listing.price?.toLocaleString('id-ID')}
              </p>
              
              <div className="prose prose-sm text-gray-600 mb-8">
                <p className="font-semibold text-gray-800">Deskripsi:</p>
                <p>{listing.description}</p>
              </div>

              {/* AREA KONTAK TERKUNCI */}
              <div className="mt-auto border-t pt-6">
                {!isPaid ? (
                  <div className="bg-gray-100 p-4 rounded-2xl text-center">
                    <p className="text-sm text-gray-500 mb-3 italic">
                      🔒 Nomor telepon penjual disembunyikan demi keamanan.
                    </p>
                    <button 
                      onClick={checkPaymentStatus}
                      className="w-full bg-[#EE4D2D] hover:bg-[#d73d1f] text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      💳 Bayar Sekarang untuk Lihat Kontak
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
                    <p className="text-xs text-green-600 font-bold mb-1 uppercase tracking-wider">✅ Pembayaran Terverifikasi</p>
                    <p className="text-lg font-bold text-gray-800 mb-2">WhatsApp: {listing.phone_number}</p>
                    <a 
                      href={`https://wa.me/${listing.phone_number}`}
                      className="block text-center bg-green-500 text-white font-bold py-2 rounded-lg"
                    >
                      Chat Penjual Sekarang
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* INFO REKENING PENJUAL (HANYA MUNCUL JIKA SUDAH BAYAR / UNTUK ADMIN) */}
        {isPaid && (
          <div className="mt-6 bg-white p-6 rounded-2xl border border-orange-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 italic">Data Rekening Tujuan (Escrow):</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-gray-500">Bank</p><p className="font-bold">{listing.bank_name}</p></div>
              <div><p className="text-gray-500">No. Rekening</p><p className="font-bold">{listing.account_number}</p></div>
              <div><p className="text-gray-500">Atas Nama</p><p className="font-bold">{listing.account_name}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}