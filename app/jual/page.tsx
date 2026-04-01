'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    latitude: null,
    longitude: null
  })
  
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [locLoading, setLocLoading] = useState(false)
  const router = useRouter()

  // 5 KATEGORI UTAMA (Wajib Sinkron dengan app/page.tsx)
  const categories = [
    'Elektronik-Gadget', 
    'Furniture-RumahTangga', 
    'Fashion', 
    'Hobi-Kendaraan-Olahraga', 
    'SisaKonstruksi'
  ]

  // LOGIC PRO: DETEKSI KOORDINAT GPS
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
        alert("📍 LOKASI BERHASIL DIKUNCI!\nSekarang pembeli bisa menghitung ongkir otomatis ke lokasi Anda.")
      },
      (error) => {
        console.error(error)
        alert("Gagal mengambil lokasi. Pastikan izin GPS aktif di browser Anda.")
        setLocLoading(false)
      },
      { enableHighAccuracy: true }
    )
  }

  // LOGIC PRO: KOMPRESI GAMBAR (Hemat Storage & Load Cepat)
  const handleImageChange = (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event: any) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 1080 
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
        }, 'image/jpeg', 0.8)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    
    // VALIDASI KRUSIAL
    if (!form.latitude || !form.longitude) {
      alert("⚠️ PENTING: Mohon klik 'Deteksi Lokasi Saya' agar sistem logistik otomatis bisa bekerja.");
      return;
    }

    if (!image) {
      alert("⚠️ Mohon upload foto produk Anda.");
      return;
    }

    setLoading(true)
    let imageUrl = ''

    try {
      // 1. Upload Gambar ke Supabase Storage
      const fileName = `${Date.now()}-${image.name.replace(/\s/g, '_')}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, image)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl

      // 2. Insert Data ke Table Listings
      const { error: insertError } = await supabase.from('listings').insert([
        {
          ...form,
          price: Number(form.price),
          image_url: imageUrl,
          created_at: new Date()
        }
      ])

      if (insertError) throw insertError

      alert('Alhamdulillah, Barang Anda berhasil diposting!\nSemoga menjadi rezeki yang berkah.')
      router.push('/')
      router.refresh()

    } catch (err: any) {
      alert('Maaf, terjadi kesalahan: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">
      {/* NAVBAR MINIMALIS */}
      <nav className="bg-white border-b border-gray-100 mb-8 shadow-sm">
        <div className="max-w-xl mx-auto h-20 px-6 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-[#EE4D2D] transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest">Kembali</span>
          </Link>
          <div className="text-right">
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tighter italic leading-none">TokoSecond</h1>
            <p className="text-[8px] font-bold text-[#EE4D2D] uppercase tracking-widest mt-1 italic">Klik, Jual, Berkah!</p>
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6">
        <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 overflow-hidden">
          
          {/* HEADER FORM */}
          <div className="bg-black p-8 text-center">
             <h2 className="text-xl font-black text-white uppercase tracking-widest italic">Mulai Jual Berkah</h2>
             <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-2 italic">Pastikan data yang Anda masukkan jujur & amanah</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* UPLOAD FOTO SECTION */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Foto Produk (Wajib)</label>
              <label className="relative flex flex-col items-center justify-center w-full h-80 border-4 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50 hover:bg-gray-100 hover:border-[#EE4D2D]/30 cursor-pointer overflow-hidden transition-all group">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Preview" />
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <span className="text-3xl">📸</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest leading-none">Ambil Foto / Pilih File</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            {/* GPS LOCATION SECTION */}
            <div className="bg-orange-50/50 p-6 rounded-[2.5rem] border border-orange-100 space-y-4">
              <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-black text-[#EE4D2D] uppercase tracking-widest">Titik Koordinat Toko/Gudang</label>
                {form.latitude && <span className="text-[9px] bg-green-500 text-white px-3 py-1 rounded-full font-black animate-pulse uppercase">GPS Lock</span>}
              </div>
              <button 
                type="button"
                onClick={handleGetLocation}
                disabled={locLoading}
                className={`w-full py-5 rounded-2xl border-2 border-dashed shadow-sm transition-all flex items-center justify-center gap-4 ${form.latitude ? 'border-green-400 bg-white' : 'border-[#EE4D2D] bg-white hover:bg-orange-50'}`}
              >
                {locLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mencari Koordinat...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{form.latitude ? '📍' : '🎯'}</span>
                    <span className="text-xs font-black text-gray-800 uppercase tracking-widest">
                      {form.latitude ? 'Lokasi Berhasil Dikunci' : 'Deteksi Lokasi Saya'}
                    </span>
                  </div>
                )}
              </button>
              <p className="text-[9px] text-center text-gray-400 font-bold uppercase leading-relaxed px-4">
                Wajib diklik agar pembeli tahu estimasi ongkir kargo ke lokasi Anda secara otomatis.
              </p>
            </div>

            {/* DATA PRODUK */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Kategori Barang</label>
                <select 
                  required
                  className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-black appearance-none cursor-pointer"
                  onChange={e => setForm({...form, category: e.target.value })}
                  value={form.category}
                >
                  <option value="">-- PILIH KATEGORI --</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.replace('-', ' & ')}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Informasi Barang</label>
                <input required placeholder="Apa nama barang yang Anda jual?" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold" onChange={e => setForm({...form, title: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest italic font-mono">Harga (Rp)</label>
                   <input required type="number" placeholder="Contoh: 500000" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold" onChange={e => setForm({...form, price: e.target.value })} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest italic font-mono">Lokasi Kota</label>
                   <input required placeholder="Contoh: Jakarta" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-bold uppercase" onChange={e => setForm({...form, location_city: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">No. WhatsApp Aktif (628...)</label>
                <input required placeholder="Contoh: 6281227127543" className="w-full bg-orange-50/50 border border-orange-100 p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-black text-orange-900" onChange={e => setForm({...form, phone_number: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Deskripsi Barang</label>
                <textarea required placeholder="Jelaskan kondisi barang, kelengkapan, dll..." rows={4} className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EE4D2D] outline-none text-xs font-medium italic" onChange={e => setForm({...form, description: e.target.value })} />
              </div>
            </div>

            {/* DATA PEMBAYARAN ESCROW */}
            <div className="bg-gray-900 p-8 rounded-[2.5rem] space-y-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">🏦</div>
              <h3 className="text-[10px] font-black text-[#EE4D2D] uppercase tracking-[0.3em] mb-2 italic">Keamanan Rekening (Escrow)</h3>
              <p className="text-[9px] text-gray-400 font-medium leading-relaxed mb-4 italic">Dana pembeli akan ditahan oleh sistem dan baru dikirim ke rekening Anda setelah barang dikonfirmasi sampai.</p>
              
              <div className="space-y-4">
                <input required placeholder="Nama Bank (BCA, Mandiri, BRI, dll)" className="w-full bg-gray-800 border-none text-white p-4 rounded-xl outline-none text-xs font-bold placeholder:text-gray-600" onChange={e => setForm({...form, bank_name: e.target.value })} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Nomor Rekening" className="w-full bg-gray-800 border-none text-white p-4 rounded-xl outline-none text-xs font-bold placeholder:text-gray-600" onChange={e => setForm({...form, account_number: e.target.value })} />
                  <input required placeholder="Nama Pemilik Rekening" className="w-full bg-gray-800 border-none text-white p-4 rounded-xl outline-none text-xs font-bold placeholder:text-gray-600 uppercase" onChange={e => setForm({...form, account_name: e.target.value })} />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs transition-all shadow-2xl ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#EE4D2D] hover:bg-[#d73d1f] text-white active:scale-95 shadow-orange-200'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                   <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                   <span>Sedang Memproses Keberkahan...</span>
                </div>
              ) : '🚀 Posting Barang Berkah'}
            </button>
          </form>
        </div>

        {/* FOOTER KECIL */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">TokoSecond - Jual Beli Amanah</p>
          <p className="text-[11px] font-bold text-gray-400 italic">"Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain."</p>
        </div>
      </div>
    </div>
  )
}