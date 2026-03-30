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
        phone: listings[0].phone_number,
        lokasi: listings[0].location_city
      })
      setItems(listings)
    }
    setLoading(false)
  }

  if (loading) return <div className="text-center py-20 font-black text-gray-400 animate-pulse uppercase tracking-widest">Memuat Profil Berkah...</div>

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* HEADER PROFIL BERWIBAWA */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row items-center gap-10">
            
            {/* Avatar Inisial Arsitektural */}
            <div className="w-28 h-28 bg-gray-900 rounded-[2rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              {penjual?.nama?.charAt(0).toUpperCase() || "T"}
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
                  {penjual?.nama || "Penjual Berkah"}
                </h1>
                <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black shadow-sm">
                  Verified Seller
                </span>
              </div>
              
              <p className="text-gray-500 font-bold tracking-widest uppercase text-sm mb-6">
                📍 {penjual?.lokasi} • 📱 {penjual?.phone}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-white border-2 border-gray-100 px-6 py-3 rounded-2xl shadow-sm text-center">
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Iklan</p>
                   <p className="font-black text-2xl text-gray-800 leading-none">{items.length}</p>
                </div>
                <div className="bg-[#EE4D2D] px-6 py-3 rounded-2xl shadow-lg shadow-orange-100 text-center">
                   <p className="text-[10px] text-orange-100 font-black uppercase tracking-widest mb-1">Reputasi</p>
                   <p className="font-black text-2xl text-white leading-none">⭐⭐⭐⭐⭐</p>
                </div>
              </div>
            </div>

            <a 
              href={`https://wa.me/${penjual?.phone}`}
              target="_blank"
              className="bg-green-500 hover:bg-green-600 text-white font-black px-10 py-5 rounded-3xl shadow-xl transition-all transform active:scale-95 uppercase text-xs tracking-[0.2em] flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.89 4.44-9.894 9.888-.002 2.225.584 3.859 1.578 5.577l-.998 3.642 3.914-.925z" />
              </svg>
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* DAFTAR BARANG LAINNYA */}
      <div className="max-w-6xl mx-auto p-6 mt-12">
        <h2 className="text-sm font-black text-gray-400 mb-10 uppercase tracking-[0.3em] border-l-4 border-[#EE4D2D] pl-6 italic">
          Etalase Barang Penjual Ini
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item) => (
            <Link href={`/listing/${item.id}`} key={item.id} className="group bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col p-2">
              <div className="aspect-square relative overflow-hidden rounded-[2rem] bg-gray-50">
                <img src={item.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[8px] text-white px-2 py-1 rounded-full font-black uppercase tracking-widest">
                  {item.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-black text-gray-800 line-clamp-2 h-10 mb-2 uppercase tracking-tighter leading-tight group-hover:text-[#EE4D2D] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#EE4D2D] font-black text-xl tracking-tighter">
                  Rp {item.price?.toLocaleString('id-ID')}
                </p>
                <div className="mt-4 flex items-center gap-1 text-[9px] text-gray-400 font-black uppercase tracking-widest border-t pt-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {item.location_city}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3.5rem] border-2 border-dashed border-gray-100 mt-10">
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Belum ada barang aktif di etalase ini.</p>
          </div>
        )}
      </div>
    </div>
  )
}