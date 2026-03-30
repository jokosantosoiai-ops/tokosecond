'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image' // Import komponen Image Next.js

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
      .eq('status', 'active') // Hanya tampilkan barang yang statusnya active
      .order('created_at', { ascending: false })

    if (minPrice) query = query.gte('price', Number(minPrice))
    if (maxPrice) query = query.lte('price', Number(maxPrice))
    if (city) query = query.ilike('location_city', `%${city}%`)
    if (selectedCategory) query = query.eq('category', selectedCategory)

    const { data } = await query
    setListings(data || [])
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      
      {/* 1. HEADER PREMIUM DENGAN LOGO BARU */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* BAGIAN LOGO & NAMA */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-full border border-gray-100 shadow-inner bg-gray-50 flex items-center justify-center p-1">
              {/* MASUKKAN LOGO "THE BLESSING HARVEST" DI SINI */}
              {/* Asumsi Bapak menyimpan file logo di: public/images/logo-tokosecond.png */}
              <Image 
                src="/images/logo-tokosecond.png" // Path file logo Bapak
                alt="Logo TokoSecond.com - The Blessing Harvest"
                width={48}
                height={48}
                className="object-contain transition-transform group-hover:scale-110" // Efek hover halus
                priority // Load logo lebih cepat
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold text-gray-950 tracking-tighter">
                Toko<span className="text-[#EE4D2D]">Second</span>.com
              </h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider -mt-1 uppercase">Klik, Jual, Berkah!</p>
            </div>
          </Link>

          {/* Navigasi Kanan (Opsional, misal Jual) */}
          <div className="flex items-center gap-3">
             <Link href="/jual">
                <button className="bg-[#EE4D2D] hover:bg-[#d73d1f] text-white text-sm font-bold px-6 py-3 rounded-full shadow-md transition-all flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Mulai Jual Barang
                </button>
             </Link>
             {/* Bapak bisa tambahkan tombol Login/Register di sini nanti */}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION - MOTO (Disederhanakan karena moto sudah ada di logo) */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <p className="text-xl md:text-2xl text-gray-600 italic font-medium max-w-2xl mx-auto">
            "Bekasnya Kamu, Rezekinya Orang — <span className="text-[#EE4D2D]"> Circular Economy yang Aman & Berkah.</span>"
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider text-left">Filter Pencarian</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-400 text-sm">Rp</span>
              <input
                placeholder="Min Harga"
                type="number"
                className="w-full border border-gray-200 p-3.5 pl-10 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none transition bg-gray-50/50"
                onChange={e => setMinPrice(e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-400 text-sm">Rp</span>
              <input
                placeholder="Max Harga"
                type="number"
                className="w-full border border-gray-200 p-3.5 pl-10 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none transition bg-gray-50/50"
                onChange={e => setMaxPrice(e.target.value)}
              />
            </div>
            <input
              placeholder="Cari Kota..."
              className="border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none transition bg-gray-50/50"
              onChange={e => setCity(e.target.value)}
            />
            <button
              onClick={fetchListings}
              className="bg-black hover:bg-gray-800 text-white font-bold p-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Terapkan Filter
            </button>
          </div>
        </div>

        {/* LISTINGS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <div key={item.id} className="group bg-white border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative flex flex-col">
              <Link href={`/listing/${item.id}`} className="flex-grow text-left">
                {/* Gambar dengan Overlay Hover */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" // Efek zoom halus
                      alt={item.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  
                  {/* Badge Kategori Kecil */}
                  {item.category && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-[10px] text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      {item.category}
                    </div>
                  )}
                </div>

                {/* Konten Card */}
                <div className="p-5 flex-grow">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-[#EE4D2D] transition-colors h-12">
                    {item.title}
                  </h3>
                  <p className="text-[#EE4D2D] font-extrabold text-xl">
                    Rp {item.price?.toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-gray-500 text-xs text-left border-t pt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {item.location_city}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {listings.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 mt-8">
            <div className="text-5xl mb-5 text-gray-200 animate-pulse">🔍</div>
            <p className="text-gray-600 font-bold text-lg">Belum ada barang di kategori ini.</p>
            <p className="text-gray-400 text-sm italic mt-1">"Bekasnya Kamu, Rezekinya Orang — Klik, Jual, Berkah!"</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="py-8 text-center text-xs text-gray-400 border-t bg-white mt-12">
          © {new Date().getFullYear()} TokoSecond.com — Platform Circular Economy Terpercaya & Berkah.
      </footer>
    </div>
  )
}