'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Home() {
  const [listings, setListings] = useState<any[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    let query = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (minPrice) query = query.gte('price', Number(minPrice))
    if (maxPrice) query = query.lte('price', Number(maxPrice))
    if (city) query = query.ilike('location_city', `%${city}%`)

    const { data } = await query
    setListings(data || [])
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">TokoSecond</h1>

      <Link href="/jual">
        <button className="bg-orange-500 text-white px-4 py-2 rounded">
          + Jual Barang
        </button>
      </Link>

      {/* UI Filter */}
      <div className="flex gap-2 mt-4 flex-wrap">
        <input
          placeholder="Min Harga"
          type="number"
          className="border p-2"
          onChange={e => setMinPrice(e.target.value)}
        />

        <input
          placeholder="Max Harga"
          type="number"
          className="border p-2"
          onChange={e => setMaxPrice(e.target.value)}
        />

        <input
          placeholder="Kota"
          className="border p-2"
          onChange={e => setCity(e.target.value)}
        />

        <button
          onClick={fetchListings}
          className="bg-black text-white px-3 rounded"
        >
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {listings.map((item) => (
          <Link key={item.id} href={`/listing/${item.id}`}>
            <div className="border rounded p-3 hover:shadow cursor-pointer">
              {/* Gambar */}
              {item.image_url && (
                <img
                  src={item.image_url}
                  className="w-full h-40 object-cover mb-2 rounded"
                  alt={item.title}
                />
              )}

              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-orange-500 font-bold">
                Rp {item.price?.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-gray-500">{item.location_city}</p>

              {item.is_featured && (
                <span className="text-xs bg-yellow-300 px-2 py-1 rounded">
                  ⭐ Featured
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}