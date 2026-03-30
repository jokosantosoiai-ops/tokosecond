'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'listings'>('transactions')
  const [transactions, setTransactions] = useState<any[]>([])
  const [allListings, setAllListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshData()
  }, [activeTab])

  async function refreshData() {
    setLoading(true)
    if (activeTab === 'transactions') {
      const { data } = await supabase.from('transactions').select('*, listings(*)').order('created_at', { ascending: false })
      setTransactions(data || [])
    } else {
      const { data } = await supabase.from('listings').select('*').order('created_at', { ascending: false })
      setAllListings(data || [])
    }
    setLoading(false)
  }

  // FUNGSI MENGUBAH STATUS (LAKU/HAPUS)
  async function updateStatus(id: string, newStatus: string) {
    const confirmAction = confirm(`Apakah Anda yakin ingin mengubah status barang ini menjadi ${newStatus}?`)
    if (!confirmAction) return

    const { error } = await supabase
      .from('listings')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      alert(`Status berhasil diperbarui ke: ${newStatus}`)
      refreshData()
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-800">COMMAND <span className="text-[#EE4D2D]">CENTER</span></h1>
          <p className="text-gray-500 italic">Halo Ar. jOkOsantOsO, selamat mengelola berkah hari ini.</p>
        </div>

        {/* TAB NAVIGASI */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'transactions' ? 'bg-[#EE4D2D] text-white shadow-lg' : 'bg-white text-gray-400 border'}`}
          >
            💰 Transaksi Masuk
          </button>
          <button 
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'listings' ? 'bg-[#EE4D2D] text-white shadow-lg' : 'bg-white text-gray-400 border'}`}
          >
            📦 Kelola Barang (Inventory)
          </button>
        </div>

        {loading ? (
          <p className="text-center py-20 animate-pulse font-bold text-gray-400">Menghubungkan ke Server...</p>
        ) : (
          <div className="space-y-4">
            {/* VIEW TRANSAKSI (Sama seperti sebelumnya) */}
            {activeTab === 'transactions' && transactions.map((trx) => (
              <div key={trx.id} className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-center">
                 <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">TRX ID: {trx.order_id}</p>
                    <h3 className="font-bold text-gray-800 text-lg">{trx.listings?.title}</h3>
                    <p className="text-[#EE4D2D] font-black text-xl">Rp {trx.total_bill?.toLocaleString('id-ID')}</p>
                 </div>
                 <div className="text-right">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">PAID</span>
                    <p className="text-[10px] text-gray-400 mt-2">{new Date(trx.created_at).toLocaleString()}</p>
                 </div>
              </div>
            ))}

            {/* VIEW KELOLA BARANG (FITUR BARU) */}
            {activeTab === 'listings' && allListings.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <img src={item.image_url} className="w-16 h-16 object-cover rounded-lg border" alt="" />
                   <div>
                      <h3 className="font-bold text-gray-800">{item.title}</h3>
                      <p className="text-xs text-gray-400">{item.category} • {item.location_city}</p>
                      <div className="mt-1 flex gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${item.status === 'sold' ? 'bg-orange-100 text-orange-600' : item.status === 'archived' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                          {item.status || 'active'}
                        </span>
                      </div>
                   </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto justify-end">
                   {item.status !== 'sold' && (
                     <button 
                       onClick={() => updateStatus(item.id, 'sold')}
                       className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-4 py-2 rounded-lg transition"
                     >
                       Tandai Laku
                     </button>
                   )}
                   <button 
                     onClick={() => updateStatus(item.id, 'archived')}
                     className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-bold px-4 py-2 rounded-lg transition"
                   >
                     Arsipkan/Hapus
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}