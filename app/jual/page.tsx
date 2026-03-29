'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Jual() {
  const [form, setForm] = useState<any>({})
  const [image, setImage] = useState<File | null>(null)

  async function handleSubmit(e: any) {
    e.preventDefault()

    let imageUrl = ''

    // upload image
    if (image) {
      const fileName = `${Date.now()}-${image.name}`

      const { data, error } = await supabase.storage
       .from('listing-images')
       .upload(fileName, image)

      if (!error) {
        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${fileName}`
      }
    }

    await supabase.from('listings').insert([
      {
       ...form,
        price: Number(form.price),
        image_url: imageUrl
      }
    ])

    alert('Berhasil dipost!')
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Jual Barang</h1>

      <form onSubmit={handleSubmit} className="space-y-3">

        <label className="block border p-4 text-center cursor-pointer bg-gray-100 rounded">
          📷 Upload Foto
          <input
            type="file"
            className="hidden"
            onChange={(e: any) => setImage(e.target.files[0])}
          />
        </label>

        <input placeholder="Judul" className="w-full border p-2"
          onChange={e => setForm({...form, title: e.target.value })} />

        <input placeholder="Harga" className="w-full border p-2"
          onChange={e => setForm({...form, price: e.target.value })} />

        <input placeholder="Kota" className="w-full border p-2"
          onChange={e => setForm({...form, location_city: e.target.value })} />

        <textarea placeholder="Deskripsi" className="w-full border p-2"
          onChange={e => setForm({...form, description: e.target.value })} />

        <button className="bg-orange-500 text-white px-4 py-2 rounded w-full">
          Posting
        </button>
      </form>
    </div>
  )
}