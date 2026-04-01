'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

interface Listing {
  id: string
  title: string
  price: number
  location_city: string
  image_url: string
  category: string
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Semua')
  
  const [filterCity, setFilterCity] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const categories = ['Semua', 'Elektronik-Gadget', 'Furniture-RumahTangga', 'Fashion', 'Hobi-Kendaraan-Olahraga', 'SisaKonstruksi']

  useEffect(() => { fetchListings() }, [activeCategory])

  async function fetchListings() {
    setLoading(true)
    let query = supabase.from('listings').select('*').order('created_at', { ascending: false })
    if (activeCategory !== 'Semua') query = query.eq('category', activeCategory)
    if (filterCity) query = query.ilike('location_city', `%${filterCity}%`)
    if (minPrice) query = query.gte('price', parseInt(minPrice))
    if (maxPrice) query = query.lte('price', parseInt(maxPrice))
    const { data, error } = await query
    if (!error) setListings(data || [])
    setLoading(false)
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen flex flex-col font-sans selection:bg-[#EE4D2D]">
      
      {/* NAVBAR: HEADER & MOTO (TETAP ADA & PROPORSIAL) */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm px-3 md:px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 md:gap-4 group">
              <img src="/images/logo-tokosecond.png" alt="Logo" className="h-10 md:h-14 w-auto object-contain" />
              <div>
                <h1 className="text-lg md:text-2xl font-black tracking-tighter text-gray-900 uppercase leading-none">
                  Toko<span className="text-[#EE4D2D]">Second</span>
                </h1>
              </div>
            </Link>
            <Link href="/jual" className="bg-[#EE4D2D] text-white text-[10px] md:text-xs font-black px-4 py-2.5 rounded-full shadow-lg uppercase tracking-tighter active:scale-95 transition-transform">
              + Jual Berkah
            </Link>
          </div>
          {/* MOTO DIBAWAH LOGO (SLIM) */}
          <p className="text-[8px] md:text-[10px] font-black text-[#EE4D2D] tracking-widest uppercase italic border-t border-orange-50 pt-1">
            Bekasnya Kamu, Rezeki Orang Lain - Klik, Jual, Berkah!
          </p>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 md:px-4 py-4 flex-grow w-full">
        
        {/* HERO SLOGAN (COMPACT) */}
        <div className="text-center mb-6">
          <p className="text-[10px] md:text-sm font-bold text-gray-400 italic">"Dari yang terpakai, menjadi bernilai & berkah"</p>
        </div>

        {/* TABEL PENCARIAN 1 BARIS (ULTRA COMPACT) */}
        <div className="bg-white p-2 rounded-2xl shadow-md border border-gray-100 mb-6 sticky top-[105px] z-40">
          <div className="flex items-center gap-1">
            <input 
              placeholder="Min" 
              type="number" 
              className="flex-1 bg-gray-50 border-none p-2 rounded-lg outline-none text-[10px] font-bold" 
              onChange={(e) => setMinPrice(e.target.value)} 
            />
            <input 
              placeholder="Max" 
              type="number" 
              className="flex-1 bg-gray-50 border-none p-2 rounded-lg outline-none text-[10px] font-bold" 
              onChange={(e) => setMaxPrice(e.target.value)} 
            />
            <input 
              placeholder="Kota" 
              className="flex-1 bg-gray-50 border-none p-2 rounded-lg outline-none text-[10px] font-bold" 
              onChange={(e) => setFilterCity(e.target.value)} 
            />
            <button 
              onClick={fetchListings} 
              className="bg-black text-white p-2 rounded-lg active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* KATEGORI SCROLL (SLIM) */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black whitespace-nowrap transition-all uppercase tracking-tighter border-2 ${
                activeCategory === cat ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LISTING GRID */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#EE4D2D] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {listings.map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="bg-white rounded-2xl overflow-hidden border border-gray-50 shadow-sm flex flex-col">
                <div className="aspect-square relative bg-gray-50">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[7px] font-black uppercase border border-white">📍 {item.location_city}</div>
                </div>
                <div className="p-3 flex-grow">
                  <p className="text-[7px] font-black text-[#EE4D2D] uppercase mb-1">📦 {item.category}</p>
                  <h3 className="font-black text-gray-900 text-[10px] uppercase leading-tight line-clamp-1 mb-2">{item.title}</h3>
                  <div className="pt-2 border-t border-gray-50">
                    <p className="text-[#EE4D2D] font-black text-xs tracking-tighter">Rp {item.price?.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER BERKAH (QS AL-BAQARAH DIKUNCI) */}
      <footer className="bg-white border-t-4 border-[#EE4D2D] py-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex items-center gap-3">
            <img src="/images/logo-tokosecond.png" alt="Logo" className="h-10 w-auto" />
            <span className="font-black text-xl uppercase tracking-tighter text-gray-900 italic">TokoSecond</span>
          </div>
          
          <div className="bg-orange-50 p-6 rounded-2xl border-l-4 border-[#EE4D2D]">
            <p className="text-xs font-bold text-orange-900 leading-relaxed italic mb-1">
              QS. Al-Baqarah ayat 254
            </p>
            <p className="text-[11px] font-medium text-orange-800 leading-relaxed italic">
              “Infakkanlah sebagian dari rezeki yang telah Kami berikan…”
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <h4 className="text-[9px] font-black uppercase text-[#EE4D2D]">Filosofi</h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase">[Dari yang terpakai, menjadi bernilai & berkah]</p>
            </div>
            <div className="space-y-2 text-right">
              <h4 className="text-[9px] font-black uppercase text-gray-900 tracking-widest">Navigasi</h4>
              <nav className="flex flex-col gap-1 text-[9px] font-black text-gray-400 uppercase">
                <Link href="/">Beranda</Link>
                <Link href="/jual">Jual</Link>
              </nav>
            </div>
          </div>
          
          <p className="text-center text-[8px] font-black text-gray-300 uppercase tracking-widest pt-8 border-t border-gray-50">
            © 2026 TokoSecond - Rezeki Mengalir, Barang Menjadi Amal
          </p>
        </div>
      </footer>
    </div>
  )
}