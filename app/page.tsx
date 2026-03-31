'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

// Logic PRO: Interface untuk Type-Safety
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
  
  // State Filter
  const [filterCity, setFilterCity] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  // 5 Kategori Utama Sesuai Brief
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
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans selection:bg-[#EE4D2D] selection:text-white">
      {/* NAVBAR: BRANDING IDENTITY */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <img src="/images/logo-tokosecond.png" alt="Logo TokoSecond" className="h-14 w-auto object-contain transition-transform group-hover:scale-105" />
            <div className="hidden md:block">
              <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase leading-none">
                Toko<span className="text-[#EE4D2D]">Second</span>
              </h1>
              <p className="text-[10px] font-black text-[#EE4D2D] tracking-widest uppercase mt-1">
                Bekasnya Kamu, Rezeki Orang Lain - 
                      Klik, Jual, Berkah!
              </p>
            </div>
          </Link>

          <Link 
            href="/jual" 
            suppressHydrationWarning 
            className="bg-[#EE4D2D] hover:bg-[#d73d1f] text-white text-[11px] font-black px-8 py-3.5 rounded-full flex items-center gap-2 shadow-xl shadow-orange-100 transition-all transform active:scale-95 tracking-widest uppercase"
          >
            Mulai Jual Berkah
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow">
        {/* 5 KATEGORI UTAMA (SCROLLABLE) */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              suppressHydrationWarning
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-[11px] font-black whitespace-nowrap transition-all uppercase tracking-widest border-2 ${
                activeCategory === cat 
                ? 'bg-black border-black text-white shadow-xl scale-105' 
                : 'bg-white border-gray-100 text-gray-400 hover:border-[#EE4D2D] hover:text-[#EE4D2D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* HERO SLOGAN */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase mb-3 italic">
            "Dari yang terpakai, 
          menjadi bernilai & berkah"
          </h2>
        </div>

        {/* LOGIC PRO FILTER BOX */}
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-white mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input suppressHydrationWarning placeholder="Harga Min (Rp)" type="number" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold" onChange={(e) => setMinPrice(e.target.value)} />
            <input suppressHydrationWarning placeholder="Harga Max (Rp)" type="number" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold" onChange={(e) => setMaxPrice(e.target.value)} />
            <input suppressHydrationWarning placeholder="Cari Kota..." className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold" onChange={(e) => setFilterCity(e.target.value)} />
            <button suppressHydrationWarning onClick={fetchListings} className="bg-black hover:bg-gray-800 text-white font-black p-4 rounded-2xl transition-all active:scale-95 uppercase text-[10px] tracking-widest">
              Filter Produk
            </button>
          </div>
        </div>

        {/* GRID LISTING */}
        {loading ? (
          <div className="text-center py-20 font-black text-gray-300 animate-pulse tracking-widest text-[10px] uppercase">Menjemput Data Rezeki...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {listings.map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="group">
                <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase border border-white">📍 {item.location_city}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter truncate mb-2 group-hover:text-[#EE4D2D] transition-colors">{item.title}</h3>
                    <p className="text-[#EE4D2D] font-black text-xl tracking-tighter">Rp {item.price?.toLocaleString('id-ID')}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-3 tracking-widest">📦 {item.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER BERKAH & REGULASI */}
      <footer className="bg-white border-t-4 border-[#EE4D2D] py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/images/logo-tokosecond.png" alt="Logo" className="h-12 w-auto" />
              <span className="font-black text-2xl uppercase tracking-tighter text-gray-900 italic">TokoSecond</span>
            </div>
            <div className="bg-orange-50 p-6 rounded-[2rem] border-l-4 border-[#EE4D2D]">
              <p className="text-[12px] font-bold text-orange-900 leading-relaxed italic">
                QS Al-Baqarah: 254 <br/> “Infakkanlah sebagian dari rezeki yang telah Kami berikan…”
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EE4D2D] mb-4">Filosofi</h4>
            <p className="text-sm font-black text-gray-900 leading-relaxed uppercase tracking-tighter mb-2">[Dari yang terpakai, menjadi bernilai & berkah]</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Menghubungkan kebaikan melalui barang yang masih layak manfaat.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 mb-2">Navigasi Berkah</h4>
            <Link href="/" className="text-xs font-black text-gray-400 hover:text-[#EE4D2D] uppercase tracking-widest">Beranda</Link>
            <Link href="/jual" className="text-xs font-black text-gray-400 hover:text-[#EE4D2D] uppercase tracking-widest">Mulai Jual</Link>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-gray-50 text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
          © 2026 TokoSecond - Rezeki Mengalir, Barang Menjadi Amal
        </div>
      </footer>
    </div>
  )
}