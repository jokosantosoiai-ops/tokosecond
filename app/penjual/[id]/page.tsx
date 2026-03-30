'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ProfilPenjual() {
  const { id } = useParams()
  const [penjual, setPenjual] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    setLoading(true)
    // 1. Ambil info penjual dari salah satu listingnya (karena kita belum pakai sistem Auth User)
    // Kita ambil data account_name dan phone_number sebagai identitas
    const { data: listings } = await supabase
      .from('listings')
      .select('*')
      .eq('phone_number', id) // Kita asumsikan ID di URL adalah nomor HP penjual
      .eq('status', 'active')

    if (listings && listings.length > 0) {
      setPenjual({
        nama: listings[0].account_name,
        phone: listings[0].phone_number,
        lokasi: listings[0].location_city
      })
      setItems(listings)
    }
    setLoading(false)
  }

  if (loading) return <div className="text-center py-20 animate-pulse font-bold text-gray-400">Memuat Profil Berkah...</div>

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HEADER PROFIL */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar Inisial */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#EE4D2D] to-orange-400 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-lg">
              {penjual?.nama?.charAt(0).toUpperCase()}
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
                {penjual?.nama}
                <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-black">Verified Penjual</span>
              </h1>
              <p className="text-gray-500 font-medium">📍 {penjual?.lokasi} • 📱 {penjual?.phone}</p>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                <div className="bg-gray-50 border px-4 py-2 rounded-xl text-center">
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Total Iklan</p>
                   <p className="font-bold text-gray-800">{items.length} Barang</p>
                </div>
                <div className="bg-gray-50 border px-4 py-2 rounded-xl text-center">
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Reputasi</p>
                   <p className="font-bold text-green-600">⭐⭐⭐⭐⭐</p>
                </div>
              </div>
            </div>

            <a 
              href={`https://wa.me/${penjual?.phone}`}
              target="_blank"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all transform active:scale-95"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* DAFTAR BARANG LAINNYA */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tighter italic border-l-4 border-[#EE4D2D] pl-4">
          Etalase Barang Penjual Ini
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link href={`/listing/${item.id}`} key={item.id} className="group bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img src={item.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 h-10 mb-1">{item.title}</h3>
                <p className="text-[#EE4D2D] font-black">Rp {item.price?.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-gray-400 mt-2">📍 {item.location_city}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}