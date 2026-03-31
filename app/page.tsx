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
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      {/* HEADER & NAV */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <img 
              src="/images/logo-tokosecond.png" 
              alt="Logo" 
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <div className="hidden md:block">
              <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase leading-none">
                Toko<span className="text-[#EE4D2D]">Second</span>
              </h1>
              <p className="text-[10px] font-black text-[#EE4D2D] tracking-widest uppercase mt-1">
                Bekasnya Kamu, Rezeki Orang Lain - Klik, Jual, Berkah!
              </p>
            </div>
          </Link>

          <Link 
            href="/jual" 
            suppressHydrationWarning
            className="bg-[#EE4D2D] hover:bg-[#d73d1f] text-white text-[11px] font-black px-8 py-3.5 rounded-full flex items-center gap-2 shadow-xl shadow-orange-100 transition-all transform active:scale-95 tracking-widest uppercase"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Mulai Jual Berkah
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12 flex-grow">
        {/* HERO MOTO */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase mb-4">
            Cari Barang <span className="text-[#EE4D2D]">Second</span> Berkualitas
          </h2>
          <p className="text-sm font-bold text-gray-400 italic tracking-wide">
            "Dari yang terpakai, menjadi bernilai & berkah"
          </p>
        </div>

        {/* FILTER BOX (ANTI-HYDRATION) */}
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-white mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <input
              suppressHydrationWarning
              placeholder="Harga Min (Rp)"
              type="number"
              className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:bg-white focus:border-[#EE4D2D] outline-none text-xs font-bold transition-all"
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              suppressHydrationWarning
              placeholder="Harga Max (Rp)"
              type="number"
              className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:bg-white focus:border-[#EE4D2D] outline-none text-xs font-bold transition-all"
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <input
              suppressHydrationWarning
              placeholder="Cari Kota / Lokasi..."
              className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl focus:bg-white focus:border-[#EE4D2D] outline-none text-xs font-bold transition-all"
              onChange={(e) => setFilterCity(e.target.value)}
            />
            <button
              suppressHydrationWarning
              onClick={fetchListings}
              className="bg-black hover:bg-gray-800 text-white font-black p-4 rounded-2xl transition-all active:scale-95 uppercase text-[10px] tracking-[0.2em] shadow-xl"
            >
              Cari Sekarang
            </button>
          </div>
        </div>

        {/* LISTING GRID */}
        {loading ? (
          <div className="text-center py-20 font-black text-gray-300 animate-pulse tracking-[0.3em] text-[10px] uppercase">
            Menjemput Data Rezeki...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {listings.map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="group">
                <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
                  <div className="aspect-square relative overflow-hidden bg-gray-50">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border border-white">
                        📍 {item.location_city}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter truncate mb-2 group-hover:text-[#EE4D2D] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[#EE4D2D] font-black text-xl tracking-tighter">
                      Rp {item.price?.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER BERKAH */}
      <footer className="bg-white border-t-4 border-[#EE4D2D] py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img src="/images/logo-tokosecond.png" alt="Logo" className="h-10 w-auto" />
                <span className="font-black text-xl uppercase tracking-tighter text-gray-900">TokoSecond</span>
              </div>
              <div className="bg-orange-50 p-6 rounded-[2rem] border-l-4 border-[#EE4D2D]">
                <p className="text-[11px] font-bold text-orange-900 leading-relaxed italic">
                  QS Al-Baqarah: 254 <br/>
                  “Infakkanlah sebagian dari rezeki yang telah Kami berikan…”
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EE4D2D]">Visi Kami</h4>
              <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-tighter">
                [Dari yang terpakai, menjadi bernilai & berkah]
              </p>
              <p className="text-[10px] font-medium text-gray-400">
                Kami percaya setiap barang bekas memiliki cerita dan potensi untuk menjadi awal rezeki bagi orang lain.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Navigasi Berkah</h4>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="text-xs font-black text-gray-400 hover:text-[#EE4D2D] transition-colors uppercase tracking-widest">Beranda</Link>
                <Link href="/jual" className="text-xs font-black text-gray-400 hover:text-[#EE4D2D] transition-colors uppercase tracking-widest">Mulai Jual</Link>
                <Link href="#" className="text-xs font-black text-gray-400 hover:text-[#EE4D2D] transition-colors uppercase tracking-widest">Kontak Admin</Link>
              </nav>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
              © 2026 TokoSecond - Rezeki Mengalir, Barang Menjadi Amal
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}