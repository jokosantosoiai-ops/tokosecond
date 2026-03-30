'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [listings, setListings] = useState<any[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [city, setCity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = [
    { name: "Elektronik & Gadget", icon: "📱" },
    { name: "Fashion & Aksesoris", icon: "👕" },
    { name: "Furnitur & Perlengkapan Rumah", icon: "🏠" },
    { name: "Hobi & Olahraga", icon: "🎸" },
    { name: "Sisa Material Konstruksi", icon: "🏗️" }
  ]

  useEffect(() => {
    fetchListings()
  }, [selectedCategory])

  async function fetchListings() {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (minPrice) query = query.gte('price', Number(minPrice))
    if (maxPrice) query = query.lte('price', Number(maxPrice))
    if (city) query = query.ilike('location_city', `%${city}%`)
    if (selectedCategory) query = query.eq('category', selectedCategory)

    const { data } = await query
    setListings(data || [])
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 flex flex-col">
      
      {/* HEADER WITH LOGO */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-full border border-orange-100 bg-white flex items-center justify-center p-1 shadow-sm">
              {/* Logo "The Blessing Harvest" */}
              <Image 
                src="/images/logo-tokosecond.png" 
                alt="Logo TokoSecond"
                width={48}
                height={48}
                className="object-contain"
                priority 
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-gray-900 tracking-tighter">
                Toko<span className="text-[#EE4D2D]">Second</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest -mt-1 uppercase">Klik, Jual, Berkah!</p>
            </div>
          </Link>

          <Link href="/jual">
            <button className="bg-[#EE4D2D] hover:bg-[#d73d1f] text-white text-sm font-bold px-6 py-3 rounded-full shadow-md transition-all flex items-center gap-2 transform active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Mulai Jual Barang
            </button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION - MOTO ASLI */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <p className="text-2xl md:text-3xl text-gray-700 italic font-semibold leading-relaxed">
            "Bekasnya Kamu, Rezekinya Orang — <span className="text-[#EE4D2D]">Klik, Jual, Berkah!</span>"
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 flex-grow w-full">
        
        {/* CATEGORY PILLS */}
        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${!selectedCategory ? 'bg-[#EE4D2D] text-white border-[#EE4D2D] shadow-md' : 'bg-white text-gray-500 hover:border-orange-200'}`}
          >
            Semua Barang
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${selectedCategory === cat.name ? 'bg-[#EE4D2D] text-white border-[#EE4D2D] shadow-md' : 'bg-white text-gray-500 hover:border-orange-200'}`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* SEARCH & FILTER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
          <h2 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-[0.2em]">Filter Pencarian</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              placeholder="Min Harga (Rp)"
              type="number"
              className="w-full border border-gray-100 p-3.5 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none transition bg-gray-50"
              onChange={e => setMinPrice(e.target.value)}
            />
            <input
              placeholder="Max Harga (Rp)"
              type="number"
              className="w-full border border-gray-100 p-3.5 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none transition bg-gray-50"
              onChange={e => setMaxPrice(e.target.value)}
            />
            <input
              placeholder="Cari Kota..."
              className="border border-gray-100 p-3.5 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none transition bg-gray-50"
              onChange={e => setCity(e.target.value)}
            />
            <button
              onClick={fetchListings}
              className="bg-black hover:bg-gray-800 text-white font-bold p-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              Terapkan Filter
            </button>
          </div>
        </div>

        {/* LISTINGS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <div key={item.id} className="group bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              <Link href={`/listing/${item.id}`} className="flex-grow">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt={item.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                  )}
                  {item.category && (
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-[9px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest">
                      {item.category}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-[#EE4D2D] transition-colors h-12 text-left">
                    {item.title}
                  </h3>
                  <p className="text-[#EE4D2D] font-black text-xl text-left">
                    Rp {item.price?.toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-gray-400 text-[10px] font-bold uppercase border-t pt-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {item.location_city}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {listings.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 mt-8">
            <p className="text-gray-400 font-bold">Belum ada barang di kategori ini.</p>
          </div>
        )}
      </main>

      {/* FOOTER WITH QURAN QUOTE */}
      <footer className="py-12 bg-white border-t mt-auto">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-800 font-medium italic text-lg mb-2">
            “Allah akan menyuburkan (memberkahi) sedekah.”
          </p>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-8">
            (QS. Al-Baqarah 2:276)
          </p>
          <div className="h-px w-20 bg-gray-100 mx-auto mb-8"></div>
          <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} TokoSecond.com — Berkah Dalam Setiap Transaksi
          </p>
        </div>
      </footer>
    </div>
  )
}