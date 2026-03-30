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
    const { data: listings } = await supabase
      .from('listings')
      .select('*')
      .eq('phone_number', id) 
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (listings && listings.length > 0) {
      setPenjual({
        nama: listings[0].account_name,
        // SENSOR NOMOR HP: Hanya tampilkan 4 angka awal demi keamanan Escrow
        phone: listings[0].phone_number.substring(0, 4) + "-XXXX-XXXX",
        lokasi: listings[0].location_city
      })
      setItems(listings)
    }
    setLoading(false)
  }

  if (loading) return <div className="text-center py-20 font-black text-gray-400 animate-pulse uppercase">Memvalidasi Profil...</div>

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* HEADER PROFIL DENGAN PROTEKSI DATA */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row items-center gap-10">
            
            <div className="w-28 h-28 bg-gray-900 rounded-[2rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl rotate-3">
              {penjual?.nama?.charAt(0).toUpperCase()}
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
                  {penjual?.nama}
                </h1>
                <span className="bg-orange-100 text-[#EE4D2D] text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black border border-orange-200">
                  🛡️ Escrow Protected
                </span>
              </div>
              
              <p className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-6 italic">
                📍 {penjual?.lokasi} • 📱 {penjual?.phone} (Terproteksi)
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-gray-50 border px-6 py-3 rounded-2xl">
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Barang Tersedia</p>
                   <p className="font-black text-2xl text-gray-800">{items.length}</p>
                </div>
              </div>
            </div>

            {/* TOMBOL EDUKASI: Mengarahkan user untuk transaksi lewat sistem */}
            <div className="max-w-xs text-center md:text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-2 leading-tight">
                Ingin menghubungi penjual? <br/> Silakan pilih barang dan lakukan pembayaran Escrow.
              </p>
              <div className="bg-blue-50 text-blue-700 text-[10px] p-3 rounded-xl border border-blue-100 font-medium">
                Sistem TokoSecond melindungi dana Anda hingga barang diterima.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DAFTAR BARANG (ETALASE) */}
      <div className="max-w-6xl mx-auto p-6 mt-12">
        <h2 className="text-sm font-black text-gray-400 mb-10 uppercase tracking-[0.3em] border-l-4 border-[#EE4D2D] pl-6">
          Pilih Barang Untuk Lihat Kontak
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item) => (
            <Link href={`/listing/${item.id}`} key={item.id} className="group bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col p-2">
              <div className="aspect-square relative overflow-hidden rounded-[2rem] bg-gray-50">
                <img src={item.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-[8px] text-white px-3 py-1.5 rounded-full font-black uppercase tracking-widest">
                  Lihat Detail
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-black text-gray-800 line-clamp-2 h-10 mb-2 uppercase tracking-tighter leading-tight">{item.title}</h3>
                <p className="text-[#EE4D2D] font-black text-xl">Rp {item.price?.toLocaleString('id-ID')}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}