'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Jual() {
  const [form, setForm] = useState<any>({
    title: '',
    price: '',
    location_city: '',
    category: '', 
    description: '',
    phone_number: '',
    bank_name: '',
    account_number: '',
    account_name: ''
  })
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Fungsi Kompresi Gambar
  const handleImageChange = (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event: any) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800 
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_WIDTH) {
            width *= MAX_WIDTH / height
            height = MAX_WIDTH
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, { type: 'image/jpeg' })
            setImage(compressedFile)
            setPreview(URL.createObjectURL(compressedFile))
          }
        }, 'image/jpeg', 0.7)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)

    let imageUrl = ''

    if (image) {
      const fileName = `${Date.now()}-${image.name.replace(/\s/g, '_')}` // Hilangkan spasi di nama file agar URL bersih
      
      // 1. Upload file ke Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, image)

      if (uploadError) {
        console.error('Upload Error:', uploadError)
        alert('Gagal mengupload gambar. Pastikan Bucket Policy sudah Public.')
        setLoading(false)
        return
      }

      // 2. Ambil Public URL dengan Opsi Teraman (getPublicUrl)
      const { data: publicUrlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl
    }

    // 3. Insert data ke Database dengan URL yang sudah didapat
    const { error: insertError } = await supabase.from('listings').insert([
      {
        ...form,
        price: Number(form.price),
        image_url: imageUrl,
        created_at: new Date()
      }
    ])

    if (!insertError) {
      alert('Alhamdulillah, Berhasil dipost!')
      router.push('/')
    } else {
      alert('Terjadi kesalahan saat menyimpan data.')
      console.error('Insert Error:', insertError)
    }
    setLoading(false)
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 text-gray-900">
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Jual Barang</h1>
              <p className="text-sm text-gray-500 font-medium">Isi detail barang untuk menjemput berkah.</p>
            </div>
            <span className="text-2xl animate-pulse">🏗️</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* INPUT FOTO */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Foto Produk</label>
              <label className="relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden transition group">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Preview" />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-4xl text-gray-300 group-hover:text-[#EE4D2D] transition-colors">📷</span>
                    <p className="mt-2 text-sm text-gray-500 font-medium">Klik untuk Ambil Foto / Upload</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* DROPDOWN KATEGORI */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kategori</label>
              <select 
                required
                className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none bg-white transition cursor-pointer appearance-none"
                onChange={e => setForm({...form, category: e.target.value })}
                value={form.category}
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Elektronik & Gadget">📱 Elektronik & Gadget</option>
                <option value="Fashion & Aksesoris">👕 Fashion & Aksesoris</option>
                <option value="Furnitur & Perlengkapan Rumah">🏠 Furnitur & Perlengkapan Rumah</option>
                <option value="Hobi & Olahraga">🎸 Hobi & Olahraga</option>
                <option value="Sisa Material Konstruksi">🏗️ Sisa Material Konstruksi</option>
              </select>
            </div>

            {/* INFORMASI PRODUK */}
            <div className="space-y-4">
              <input 
                required
                placeholder="Judul Barang (Contoh: Sisa Marmer Ujung Pandang)" 
                className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none transition"
                onChange={e => setForm({...form, title: e.target.value })} 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-gray-400 text-sm">Rp</span>
                  <input 
                    required
                    type="number"
                    placeholder="Harga" 
                    className="w-full border border-gray-200 p-3.5 pl-10 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none transition"
                    onChange={e => setForm({...form, price: e.target.value })} 
                  />
                </div>
                <input 
                  required
                  placeholder="Lokasi Kota" 
                  className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none transition"
                  onChange={e => setForm({...form, location_city: e.target.value })} 
                />
              </div>

              <input 
                required
                type="text"
                placeholder="Nomor WhatsApp (Contoh: 0812...)" 
                className="w-full border border-orange-100 p-3.5 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none bg-orange-50/30 font-semibold"
                onChange={e => setForm({...form, phone_number: e.target.value })} 
              />

              <textarea 
                required
                placeholder="Jelaskan kondisi barang dan sisa material Anda secara detail..." 
                rows={4}
                className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none transition"
                onChange={e => setForm({...form, description: e.target.value })} 
              />
            </div>

            <hr className="my-4 border-gray-100" />

            {/* INFORMASI REKENING */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                🏦 Rekening Penjual (Escrow Payout)
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <input 
                  required
                  placeholder="Nama Bank (Misal: BCA)" 
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none bg-white transition"
                  onChange={e => setForm({...form, bank_name: e.target.value })} 
                />
                <input 
                  required
                  placeholder="Nomor Rekening" 
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none bg-white transition"
                  onChange={e => setForm({...form, account_number: e.target.value })} 
                />
                <input 
                  required
                  placeholder="Atas Nama" 
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#EE4D2D] outline-none bg-white transition"
                  onChange={e => setForm({...form, account_name: e.target.value })} 
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className={`w-full ${loading ? 'bg-gray-300' : 'bg-[#EE4D2D] hover:bg-[#d73d1f] hover:shadow-orange-200'} text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mt-4`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan Produk...
                </>
              ) : (
                <>
                  <span>🚀 Posting Sekarang</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}