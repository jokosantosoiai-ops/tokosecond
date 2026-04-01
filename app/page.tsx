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

  const categories = [
    'Semua', 
    'Elektronik-Gadget', 
    'Furniture-RumahTangga', 
    'Fashion', 
    'Hobi-Kendaraan-Olahraga', 
    'SisaKonstruksi'
  ]

  useEffect(() => {
    fetchListings()
  }, [activeCategory])

  async function fetchListings() {
    setLoading(true)
    let query = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (activeCategory !== 'Semua') {
      query = query.eq('category', activeCategory)
    }
    if (filterCity) query = query.ilike('location_city', `%${filterCity}%`)
    if (minPrice) query = query.gte('price', parseInt(minPrice))
    if (maxPrice) query = query.lte('price', parseInt(maxPrice))

    const { data, error } = await query
    if (!error) setListings(data || [])
    setLoading(false)
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen flex flex-col font-sans selection:bg-[#EE4D2D] selection:text-white">
      
      {/* NAVBAR: RINGKAS UNTUK HP */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-4 group">
            <img 
              src="/images/logo-tokosecond.png" 
              alt="Logo" 
              className="h-8 md:h-14 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <div className="hidden sm:block">
              <h1 className="text-sm md:text-2xl font-black tracking-tighter text-gray-900 uppercase leading-none">
                Toko<span className="text-[#EE4D2D]">Second</span>
              </h1>
              <p className="text-[7px] md:text-[10px] font-black text-[#EE4D2D] tracking-widest uppercase mt-1">
                Bekasnya Kamu, Rezeki Orang Lain!
              </p>
            </div>
          </Link>

          <Link 
            href="/jual" 
            suppressHydrationWarning 
            className="bg-[#EE4D2D] hover:bg-[#d73d1f] text-white text-[9px] md:text-[11px] font-black px-4 md:px-8 py-2.5 md:py-4 rounded-full flex items-center gap-1.5 md:gap-2 shadow-lg transition-all transform active:scale-95 tracking-tight md:tracking-[0.2em] uppercase"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Jual Berkah
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-10 flex-grow w-full">
        
        {/* HERO SECTION: LEBIH KECIL DI HP */}
        <div className="text-center mb-8 md:mb-16 space-y-2 md:space-y-4">
          <h2 className="text-2xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-tight">
            "Dari yang terpakai, <br /> menjadi bernilai"
          </h2>
          <div className="h-0.5 md:h-1 w-16 md:w-24 bg-[#EE4D2D] mx-auto rounded-full"></div>
        </div>

        {/* 5 KATEGORI: COMPACT SCROLL */}
        <div className="mb-8 md:mb-12">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 md:px-8 py-2 md:py-3.5 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-black whitespace-nowrap transition-all uppercase tracking-wider border-2 ${
                  activeCategory === cat 
                  ? 'bg-black border-black text-white shadow-md' 
                  : 'bg-white border-gray-100 text-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FILTER BOX: SLIM & GRID OPTIMIZED */}
        <div className="bg-white p-5 md:p-10 rounded-[2rem] md:rounded-[3.5rem] shadow-sm border border-gray-100 mb-10 md:mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <div className="space-y-1">
              <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">Min Harga</label>
              <input placeholder="Rp 0" type="number" className="w-full bg-gray-50 border-none p-3 md:p-4 rounded-xl md:rounded-2xl focus:ring-1 focus:ring-[#EE4D2D] outline-none text-[10px] md:text-xs font-bold" onChange={(e) => setMinPrice(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">Max Harga</label>
              <input placeholder="Limit" type="number" className="w-full bg-gray-50 border-none p-3 md:p-4 rounded-xl md:rounded-2xl focus:ring-1 focus:ring-[#EE4D2D] outline-none text-[10px] md:text-xs font-bold" onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">Lokasi</label>
              <input placeholder="Cari Kota..." className="w-full bg-gray-50 border-none p-3 md:p-4 rounded-xl md:rounded-2xl focus:ring-1 focus:ring-[#EE4D2D] outline-none text-[10px] md:text-xs font-bold" onChange={(e) => setFilterCity(e.target.value)} />
            </div>
            <div className="flex items-end col-span-2 md:col-span-1">
              <button 
                onClick={fetchListings} 
                className="w-full bg-black hover:bg-gray-800 text-white font-black p-3 md:p-4 rounded-xl md:rounded-2xl transition-all active:scale-95 uppercase text-[10px] md:text-[11px] tracking-widest h-11 md:h-[52px]"
              >
                Cari Berkah
              </button>
            </div>
          </div>
        </div>

        {/* GRID LISTING: PROPORSIONAL HP */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-3 border-[#EE4D2D]/20 border-t-[#EE4D2D] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-10">
            {listings.map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="group">
                <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border border-gray-50 shadow-sm flex flex-col h-full">
                  <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2 md:top-5 left-2 md:left-5">
                      <span className="bg-white/90 backdrop-blur px-2 md:px-4 py-1 rounded-full text-[7px] md:text-[9px] font-black uppercase border border-white tracking-tighter text-gray-800">
                        📍 {item.location_city}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 md:p-7 flex flex-col flex-grow">
                    <p className="text-[7px] md:text-[9px] font-black text-[#EE4D2D] uppercase tracking-wider mb-1">📦 {item.category}</p>
                    <h3 className="font-black text-gray-900 text-[10px] md:text-base uppercase tracking-tighter leading-tight mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="mt-auto pt-2 border-t border-gray-50">
                      <p className="text-[#EE4D2D] font-black text-sm md:text-xl tracking-tighter">
                        Rp {item.price?.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER: RINGKAS UNTUK HP */}
      <footer className="bg-white border-t-4 border-[#EE4D2D] py-10 md:py-20 mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/images/logo-tokosecond.png" alt="Logo" className="h-8 md:h-14 w-auto" />
                <span className="font-black text-lg md:text-3xl uppercase tracking-tighter text-gray-900 italic">TokoSecond</span>
              </div>
              <div className="bg-orange-50 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-l-4 border-[#EE4D2D]">
                <p className="text-[10px] md:text-[13px] font-bold text-orange-950 leading-relaxed italic">
                  “Infakkanlah sebagian dari rezeki yang telah Kami berikan…”
                </p>
              </div>
            </div>
            
            <div className="hidden md:block space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#EE4D2D]">Filosofi</h4>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
                Membangun ekosistem sirkular ekonomi yang berlandaskan keberkahan.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-gray-900">Akses</h4>
              <nav className="flex flex-row md:flex-col gap-4 md:gap-4 text-[9px] md:text-xs font-black text-gray-400 uppercase">
                <Link href="/" className="hover:text-[#EE4D2D]">Beranda</Link>
                <Link href="/jual" className="hover:text-[#EE4D2D]">Jual</Link>
                <Link href="#" className="hover:text-[#EE4D2D]">Kontak</Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}