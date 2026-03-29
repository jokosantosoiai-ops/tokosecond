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
      <h1>{item.title}</h1>
      <h2>Rp {item.price}</h2>
      <p>{item.description}</p>

      <a href="https://wa.me/628123456789">
        <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded">
          Chat Seller
        </button>
      </a>
    </div>
  )
}