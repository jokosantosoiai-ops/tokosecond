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
    account_name: '',
    latitude: null, // Kolom baru koordinat
    longitude: null // Kolom baru koordinat
  })
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [locLoading, setLocLoading] = useState(false) // Loading khusus GPS
  const router = useRouter()

  // FUNGSI DETEKSI LOKASI (KOORDINAT)
  const handleGetLocation = () => {
    setLocLoading(true)
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung deteksi lokasi.")
      setLocLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm({
          ...form,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLocLoading(false)
        alert("📍 Lokasi Berhasil Dikunci! Jarak pengiriman akan dihitung otomatis.")
      },
      (error) => {
        console.error(error)
        alert("Gagal mengambil lokasi. Pastikan izin GPS aktif.")
        setLocLoading(false)
      },
      { enableHighAccuracy: true }
    )
  }

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
    
    // Validasi Koordinat sebelum submit
    if (!form.latitude || !form.longitude) {
      alert("PENTING: Silakan klik 'Deteksi Lokasi Saya' terlebih dahulu agar ongkir bisa dihitung.")
      return
    }

    setLoading(true)
    let imageUrl = ''

    if (image) {
      const fileName = `${Date.now()}-${image.name.replace(/\s/g, '_')}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, image)

      if (uploadError) {
        alert('Gagal mengupload gambar.')
        setLoading(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl
    }

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
      alert('Gagal menyimpan data.')
      console.error(insertError)
    }
    setLoading(false)
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 text-gray-900">
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-white rounded-[2rem] shadow-sm border p-8">
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Jual Barang</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Lengkapi data untuk menjemput berkah</p>
            </div>
            <span className="text-3xl">🏗️</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* INPUT FOTO */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Foto Produk</label>
              <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden transition-all group">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Preview" />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-5xl mb-2 block opacity-20 group-hover:opacity-100 transition-opacity">📷</span>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Ambil Foto / Upload</p>
                  </div>
                )}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            {/* DETEKSI LOKASI (FITUR MATANG) */}
            <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-[#EE4D2D] uppercase tracking-widest">Koordinat Lokasi Penjual</label>
                {form.latitude && <span className="text-[9px] text-green-600 font-bold">✅ TERKUNCI</span>}
              </div>
              <button 
                type="button"
                onClick={handleGetLocation}
                disabled={locLoading}
                className={`w-full py-4 rounded-2xl border-2 border-dashed ${form.latitude ? 'border-green-500 bg-green-50' : 'border-[#EE4D2D] bg-white'} transition-all flex items-center justify-center gap-3`}
              >
                {locLoading ? (
                  <span className="text-xs font-bold animate-pulse text-gray-500 uppercase">Mencari Satelit...</span>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-black text-gray-800 uppercase tracking-tighter">
                      {form.latitude ? 'Lokasi Berhasil Dikunci' : '📍 Deteksi Lokasi Saya'}
                    </span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Wajib untuk hitung ongkir otomatis</p>
                  </div>
                )}
              </button>
              {form.latitude && (
                <p className="text-[9px] text-center text-gray-400 font-mono">
                  LAT: {form.latitude.toFixed(6)} | LNG: {form.longitude.toFixed(6)}
                </p>
              )}
            </div>

            {/* INPUT FORM LAINNYA */}
            <div className="space-y-4">
              <select 
                required
                className="w-full border border-gray-200 p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none bg-white text-sm font-bold appearance-none cursor-pointer"
                onChange={e => setForm({...form, category: e.target.value })}
                value={form.category}
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Sisa Material Konstruksi">🏗️ Sisa Material Konstruksi</option>
                <option value="Elektronik & Gadget">📱 Elektronik & Gadget</option>
                <option value="Fashion & Aksesoris">👕 Fashion & Aksesoris</option>
                <option value="Furnitur">🏠 Furnitur</option>
                <option value="Hobi">🎸 Hobi</option>
              </select>

              <input required placeholder="Judul Barang" className="w-full border border-gray-200 p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none font-bold" onChange={e => setForm({...form, title: e.target.value })} />
              
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Harga (Rp)" className="w-full border border-gray-200 p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none font-bold" onChange={e => setForm({...form, price: e.target.value })} />
                <input required placeholder="Kota" className="w-full border border-gray-200 p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none font-bold uppercase" onChange={e => setForm({...form, location_city: e.target.value })} />
              </div>

              <input required placeholder="Nomor WhatsApp (Aktif)" className="w-full border border-[#EE4D2D] p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none font-black text-gray-900 bg-orange-50/20" onChange={e => setForm({...form, phone_number: e.target.value })} />

              <textarea required placeholder="Deskripsi Detail Barang..." rows={4} className="w-full border border-gray-200 p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none italic text-sm" onChange={e => setForm({...form, description: e.target.value })} />
            </div>

            {/* DATA REKENING */}
            <div className="bg-gray-900 p-6 rounded-3xl space-y-4 shadow-xl">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">🏦 Data Rekening Escrow</h3>
              <input required placeholder="Bank (BCA/Mandiri/dsb)" className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded-xl outline-none text-xs" onChange={e => setForm({...form, bank_name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="No. Rekening" className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded-xl outline-none text-xs" onChange={e => setForm({...form, account_number: e.target.value })} />
                <input required placeholder="Atas Nama" className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded-xl outline-none text-xs uppercase" onChange={e => setForm({...form, account_name: e.target.value })} />
              </div>
            </div>

            <button 
              disabled={loading}
              className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${loading ? 'bg-gray-300' : 'bg-[#EE4D2D] hover:bg-orange-600 text-white active:scale-95'}`}
            >
              {loading ? 'Siklus Berkah Sedang Berjalan...' : '🚀 Posting Barang Sekarang'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}