'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Home() {
  const [listings, setListings] = useState<any[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [city, setCity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Daftar Kategori sesuai kesepakatan
  const categories = [
    { name: "Elektronik & Gadget", icon: "📱" },
    { name: "Fashion & Aksesoris", icon: "👕" },
    { name: "Furnitur & Perlengkapan Rumah", icon: "🏠" },
    { name: "Hobi & Olahraga", icon: "🎸" },
    { name: "Sisa Material Konstruksi", icon: "🏗️" }
  ]

  useEffect(() => {
    fetchListings()
  }, [selectedCategory]) // Refresh otomatis saat kategori diklik

  async function fetchListings() {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'active') // LANGKAH 3: Hanya tampilkan barang yang statusnya active
      .order('created_at', { ascending: false })

    if (minPrice) query = query.gte('price', Number(minPrice))
    if (maxPrice) query = query.lte('price', Number(maxPrice))
    if (city) query = query.ilike('location_city', `%${city}%`)
    if (selectedCategory) query = query.eq('category', selectedCategory)

    const { data } = await query
    setListings(data || [])
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO SECTION - MOTO & CTA */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Toko<span className="text-[#EE4D2D]">Second</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 italic font-medium">
            "Bekasnya Kamu, Rezekinya Orang — <span className="text-[#EE4D2D]">Klik, Jual, Berkah!</span>"
          </p>
          <Link href="/jual">
            <button className="bg-[#EE4D2D] hover:bg-[#d73d1f] text-white text-lg font-bold px-10 py-4 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center mx-auto gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Mulai Jual Barang
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        
        {/* TAB FILTER KATEGORI (SCROLLABLE) */}
        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm border ${!selectedCategory ? 'bg-[#EE4D2D] text-white border-[#EE4D2D]' : 'bg-white text-gray-600 hover:border-orange-300'}`}
          >
            Semua Barang
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm border flex items-center gap-2 ${selectedCategory === cat.name ? 'bg-[#EE4D2D] text-white border-[#EE4D2D]' : 'bg-white text-gray-600 hover:border-orange-300'}`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* UI FILTER PENCARIAN & HARGA */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider text-left">Filter Pencarian</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              placeholder="Min Harga (Rp)"
              type="number"
              className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#EE4D2D] outline-none transition"
              onChange={e => setMinPrice(e.target.value)}
            />
            <input
              placeholder="Max Harga (Rp)"
              type="number"
              className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#EE4D2D] outline-none transition"
              onChange={e => setMaxPrice(e.target.value)}
            />
            <input
              placeholder="Cari Kota..."
              className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#EE4D2D] outline-none transition"
              onChange={e => setCity(e.target.value)}
            />
            <button
              onClick={fetchListings}
              className="bg-black hover:bg-gray-800 text-white font-bold p-3 rounded-lg transition shadow-md"
            >
              Terapkan Filter
            </button>
          </div>
        </div>

        {/* LISTINGS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <div key={item.id} className="group bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 relative flex flex-col">
              <Link href={`/listing/${item.id}`} className="flex-grow text-left">
                {/* Gambar dengan Overlay Hover */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={item.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  
                  {/* Badge Kategori Kecil */}
                  {item.category && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-1 rounded">
                      {item.category}
                    </div>
                  )}

                  {/* Badge Featured */}
                  {item.is_featured && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                      ⭐ Star
                    </div>
                  )}
                </div>

                {/* Konten Card */}
                <div className="p-4">
                  <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-[#EE4D2D] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#EE4D2D] font-bold text-lg">
                    Rp {item.price?.toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {item.location_city}
                  </div>
                </div>
              </Link>

              {/* Footer Card - Upgrade Button */}
              <div className="p-3 bg-gray-50 border-t">
                <a
                  href={`https://wa.me/6281227127543?text=Halo%20Admin%2C%20saya%20mau%20upgrade%20iklan%20"${encodeURIComponent(item.title)}"%20menjadi%20FEATURED`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-tighter"
                >
                  🚀 Sundul Jadi Featured
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {listings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed mt-6">
            <div className="text-4xl mb-4 text-gray-300">🔍</div>
            <p className="text-gray-500 font-medium text-lg">Belum ada barang di kategori ini.</p>
            <p className="text-gray-400 text-sm italic">"Bekasnya Kamu, Rezekinya Orang — Klik, Jual, Berkah!"</p>
          </div>
        )}
      </div>
    </div>
  )
}