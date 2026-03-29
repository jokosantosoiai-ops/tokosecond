'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Jual() {
  const [form, setForm] = useState<any>({})

  async function handleSubmit(e: any) {
    e.preventDefault()

    await supabase.from('listings').insert([
      {
        ...form,
        price: Number(form.price)
      }
    ])

    alert('Berhasil dipost!')
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Jual Barang</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input placeholder="Judul" className="w-full border p-2" onChange={e => setForm({ ...form, title: e.target.value })} />

        <input placeholder="Harga" className="w-full border p-2" onChange={e => setForm({ ...form, price: e.target.value })} />

        <select className="w-full border p-2" onChange={e => setForm({ ...form, category: e.target.value })}>
          <option>Kategori</option>
          <option>Elektronik</option>
          <option>Furniture</option>
          <option>Kendaraan</option>
        </select>

        <select className="w-full border p-2" onChange={e => setForm({ ...form, condition: e.target.value })}>
          <option>Kondisi</option>
          <option>Seperti Baru</option>
          <option>Sangat Baik</option>
          <option>Layak Pakai</option>
        </select>

        <input placeholder="Kota" className="w-full border p-2" onChange={e => setForm({ ...form, location_city: e.target.value })} />

        <textarea placeholder="Deskripsi" className="w-full border p-2" onChange={e => setForm({ ...form, description: e.target.value })} />

        <button className="bg-orange-500 text-white px-4 py-2 rounded w-full">
          Posting
        </button>
      </form>
    </div>
  )
}