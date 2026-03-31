'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Home() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // State Filter
  const [filterCity, setFilterCity] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    setLoading(true)
    let query = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (filterCity) query = query.ilike('location_city', `%${filterCity}%`)
    if (minPrice) query = query.gte('price', parseInt(minPrice))
    if (maxPrice) query = query.lte('price', parseInt(maxPrice))

    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* NAVBAR / HEADER */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#EE4D2D] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-gray-900 uppercase">
              Toko<span className="text-[#EE4D2D]">Second</span>
            </h1>
          </div>

          <Link 
            href="/jual" 
            className="bg-[#EE4D2D] hover:bg-[#d73d1f] text-white text-[11px] font-black px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all transform active:scale-95 tracking-widest uppercase"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Jual Barang
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* FILTER BOX */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-10">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Pencarian Cerdas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              suppressHydrationWarning
              placeholder="Min Harga (Rp)"
              type="number"
              className="w-full border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold transition-all"
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              suppressHydrationWarning
              placeholder="Max Harga (Rp)"
              type="number"
              className="w-full border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold transition-all"
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <input
              suppressHydrationWarning
              placeholder="Cari Kota..."
              className="w-full border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold transition-all"
              onChange={(e) => setFilterCity(e.target.value)}
            />
            <button
              onClick={fetchListings}
              className="bg-black hover:bg-gray-800 text-white font-black p-4 rounded-2xl transition-all active:scale-95 uppercase text-[10px] tracking-widest shadow-xl"
            >
              Terapkan Filter
            </button>
          </div>
        </div>

        {/* LISTING GRID */}
        {loading ? (
          <div className="text-center py-20 font-black text-gray-300 animate-pulse tracking-widest text-xs uppercase">
            Memuat Koleksi Berkah...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="group">
                <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter shadow-sm">
                        📍 {item.location_city}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter truncate mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[#EE4D2D] font-black text-lg tracking-tighter">
                      Rp {item.price?.toLocaleString('id-ID')}
                    </p>
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Detail Produk</span>
                      <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-[#EE4D2D] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Maaf, barang tidak ditemukan.</p>
          </div>
        )}
      </main>
    </div>
  )
}