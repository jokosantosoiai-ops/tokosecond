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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* 1. NAVBAR - LOGO & MOTO KEMBALI */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo Asli Bapak */}
            <img 
              src="/images/logo-tokosecond.png" 
              alt="Logo TokoSecond" 
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <div className="hidden md:block">
              <h1 className="text-lg font-black tracking-tighter text-gray-900 uppercase leading-none">
                Toko<span className="text-[#EE4D2D]">Second</span>
              </h1>
              <p className="text-[9px] font-bold text-gray-400 tracking-[0.3em] uppercase mt-1">
                Barang Bekas, Kualitas Berkelas
              </p>
            </div>
          </Link>

          {/* Link Jual Tanpa Button di Dalamnya (Solusi Hydration Error) */}
          <Link 
            href="/jual" 
            suppressHydrationWarning
            className="bg-[#EE4D2D] hover:bg-[#d73d1f] text-white text-[10px] font-black px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-orange-100 transition-all transform active:scale-95 tracking-widest uppercase"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Mulai Jual
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow">
        {/* 2. HERO SECTION - MOTO UTAMA */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase mb-3">
            Cari Barang <span className="text-[#EE4D2D]">Impianmu</span>
          </h2>
          <p className="text-sm font-medium text-gray-400 italic">"Menghubungkan barang berkualitas dengan pemilik baru yang tepat."</p>
        </div>

        {/* 3. FILTER BOX - ANTI HYDRATION ISSUES */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              suppressHydrationWarning
              placeholder="Harga Minimum"
              type="number"
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold transition-all"
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              suppressHydrationWarning
              placeholder="Harga Maksimum"
              type="number"
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold transition-all"
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <input
              suppressHydrationWarning
              placeholder="Cari Lokasi Kota..."
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold transition-all"
              onChange={(e) => setFilterCity(e.target.value)}
            />
            <button
              suppressHydrationWarning
              onClick={fetchListings}
              className="bg-black hover:bg-gray-800 text-white font-black p-4 rounded-2xl transition-all active:scale-95 uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-gray-300"
            >
              Cari Sekarang
            </button>
          </div>
        </div>

        {/* 4. LISTING GRID */}
        {loading ? (
          <div className="text-center py-20 font-black text-gray-300 animate-pulse tracking-widest text-xs uppercase">
            Sinkronisasi Data Berkah...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {listings.map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="group shadow-none hover:shadow-none bg-transparent">
                <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter shadow-sm border border-white">
                        📍 {item.location_city}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter truncate mb-1 group-hover:text-[#EE4D2D] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[#EE4D2D] font-black text-lg tracking-tighter">
                      Rp {item.price?.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* 5. FOOTER KEMBALI */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo-tokosecond.png" alt="Logo" className="h-8 w-auto" />
              <span className="font-black uppercase tracking-tighter text-gray-900">TokoSecond</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">Platform jual beli barang bekas terpercaya dengan sistem keamanan transaksi dan logistik presisi.</p>
          </div>
          <div className="flex flex-col gap-3 px-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">Navigasi</h4>
            <Link href="/" className="text-xs font-bold text-gray-400 hover:text-[#EE4D2D]">Beranda</Link>
            <Link href="/jual" className="text-xs font-bold text-gray-400 hover:text-[#EE4D2D]">Mulai Jual</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">Bantuan</h4>
            <p className="text-xs font-bold text-gray-400 cursor-pointer hover:text-[#EE4D2D]">Syarat & Ketentuan</p>
            <p className="text-xs font-bold text-gray-400 cursor-pointer hover:text-[#EE4D2D]">Kontak Admin</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">© 2026 TokoSecond - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  )
}