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

  // 5 Kategori Utama Sesuai Brief (Elektronik, Furniture, Fashion, Hobi, SisaKonstruksi)
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
      
      {/* NAVBAR: BRANDING IDENTITY */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <img 
              src="/images/logo-tokosecond.png" 
              alt="Logo TokoSecond" 
              className="h-14 w-auto object-contain transition-transform group-hover:scale-105" 
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

          {/* CTA UTAMA: Pintu Menuju Form Jual */}
          <Link 
            href="/jual" 
            suppressHydrationWarning 
            className="bg-[#EE4D2D] hover:bg-[#d73d1f] text-white text-[11px] font-black px-8 py-4 rounded-full flex items-center gap-2 shadow-2xl shadow-orange-200 transition-all transform active:scale-95 tracking-[0.2em] uppercase"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            + Jual Barang Berkah
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow w-full">
        
        {/* HERO SECTION */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-tight">
            "Dari yang terpakai, <br className="md:hidden" /> menjadi bernilai & berkah"
          </h2>
          <div className="h-1 w-24 bg-[#EE4D2D] mx-auto rounded-full"></div>
        </div>

        {/* 5 KATEGORI UTAMA (HORIZONAL SCROLL) */}
        <div className="mb-12">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 text-center">Telusuri Kategori</p>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth justify-start md:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                suppressHydrationWarning
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3.5 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all uppercase tracking-widest border-2 ${
                  activeCategory === cat 
                  ? 'bg-black border-black text-white shadow-2xl -translate-y-1' 
                  : 'bg-white border-gray-100 text-gray-400 hover:border-[#EE4D2D] hover:text-[#EE4D2D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FILTER BOX (LOGIC PRO) */}
        <div className="bg-white p-8 md:p-10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 mb-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#EE4D2D]"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Harga Minimum</label>
              <input suppressHydrationWarning placeholder="Rp 0" type="number" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold" onChange={(e) => setMinPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Harga Maksimum</label>
              <input suppressHydrationWarning placeholder="Tanpa Batas" type="number" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold" onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Lokasi Kota</label>
              <input suppressHydrationWarning placeholder="Seluruh Indonesia" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold" onChange={(e) => setFilterCity(e.target.value)} />
            </div>
            <div className="flex items-end">
              <button 
                suppressHydrationWarning 
                onClick={fetchListings} 
                className="w-full bg-black hover:bg-gray-800 text-white font-black p-4 rounded-2xl transition-all active:scale-95 uppercase text-[11px] tracking-widest shadow-lg h-[52px]"
              >
                Cari Berkah
              </button>
            </div>
          </div>
        </div>

        {/* GRID LISTING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-[#EE4D2D]/20 border-t-[#EE4D2D] rounded-full animate-spin"></div>
            <p className="font-black text-gray-300 tracking-[0.3em] text-[10px] uppercase">Menjemput Data Rezeki...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {listings.map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="group">
                <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-50 shadow-sm hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-4 flex flex-col h-full">
                  <div className="aspect-square relative overflow-hidden bg-gray-50">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute top-5 left-5">
                      <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[9px] font-black uppercase border border-white tracking-tighter shadow-sm text-gray-800">
                        📍 {item.location_city}
                      </span>
                    </div>
                  </div>
                  <div className="p-7 flex flex-col flex-grow">
                    <p className="text-[9px] font-black text-[#EE4D2D] uppercase tracking-[0.2em] mb-2">📦 {item.category}</p>
                    <h3 className="font-black text-gray-900 text-sm md:text-base uppercase tracking-tighter leading-tight mb-3 group-hover:text-[#EE4D2D] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-gray-50">
                      <p className="text-[#EE4D2D] font-black text-xl tracking-tighter">
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

      {/* FOOTER BERKAH & REGULASI */}
      <footer className="bg-white border-t-8 border-[#EE4D2D] py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <img src="/images/logo-tokosecond.png" alt="Logo" className="h-14 w-auto" />
                <span className="font-black text-3xl uppercase tracking-tighter text-gray-900 italic">TokoSecond</span>
              </div>
              <div className="bg-orange-50 p-8 rounded-[2.5rem] border-l-8 border-[#EE4D2D] shadow-inner">
                <p className="text-[13px] font-bold text-orange-950 leading-relaxed italic">
                  QS Al-Baqarah: 254 <br/> 
                  “Infakkanlah sebagian dari rezeki yang telah Kami berikan…”
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#EE4D2D]">Filosofi Transaksi</h4>
              <p className="text-lg font-black text-gray-900 leading-tight uppercase tracking-tighter italic">
                [Dari yang terpakai, menjadi bernilai & berkah]
              </p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
                Membangun ekosistem sirkular ekonomi yang berlandaskan keberkahan dan transparansi.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-900">Akses Cepat</h4>
              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-xs font-black text-gray-400 hover:text-[#EE4D2D] uppercase tracking-[0.3em] transition-all hover:translate-x-2">Beranda Utama</Link>
                <Link href="/jual" className="text-xs font-black text-gray-400 hover:text-[#EE4D2D] uppercase tracking-[0.3em] transition-all hover:translate-x-2">Mulai Jual Barang</Link>
                <Link href="#" className="text-xs font-black text-gray-400 hover:text-[#EE4D2D] uppercase tracking-[0.3em] transition-all hover:translate-x-2">Hubungi Admin</Link>
              </nav>
            </div>
          </div>

          <div className="text-center pt-10 border-t border-gray-100">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em]">
              © 2026 TokoSecond - Rezeki Mengalir, Barang Menjadi Amal
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}