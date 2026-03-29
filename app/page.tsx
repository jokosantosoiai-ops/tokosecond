'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Home() {
  const [listings, setListings] = useState<any[]>([])

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

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

      <div className="grid grid-cols-2 gap-4 mt-6">
        {listings.map((item) => (
          <Link key={item.id} href={`/listing/${item.id}`}>
            <div className="border rounded p-3 hover:shadow cursor-pointer">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-orange-500 font-bold">Rp {item.price}</p>
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
