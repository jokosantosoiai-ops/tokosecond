'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Detail() {
  const { id } = useParams()
  const [item, setItem] = useState<any>(null)

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  async function fetchData() {
    const { data } = await supabase
     .from('listings')
     .select('*')
     .eq('id', id)
     .single()

    setItem(data)
  }

  if (!item) return <p>Loading...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      {item.image_url && (
        <img
          src={item.image_url}
          className="w-full h-60 object-cover mb-4 rounded"
          alt={item.title}
        />
      )}

      <h1 className="text-2xl font-bold">{item.title}</h1>
      <h2 className="text-xl text-orange-500 font-semibold">
        Rp {item.price?.toLocaleString('id-ID')}
      </h2>

      {item.location_city && (
        <p className="text-sm text-gray-500 mb-2">{item.location_city}</p>
      )}

      <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>

      <a
        href={`https://wa.me/${item.seller_wa || '628123456789'}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded w-full">
          Chat Seller
        </button>
      </a>
    </div>
  )
}