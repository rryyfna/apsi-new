'use client';

import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function PengaturanCpmkPage() {
  const [mataKuliah, setMataKuliah] = useState([
    { id: '1', kodeMk: 'IF101', namaMk: 'Algoritma dan Pemrograman', sks: 3 },
    { id: '2', kodeMk: 'IF102', namaMk: 'Struktur Data', sks: 3 },
  ]);
  
  const [selectedMk, setSelectedMk] = useState<string>('');
  const [cpmks, setCpmks] = useState<{ id: string, kode: string, deskripsi: string }[]>([
    { id: 'c1', kode: 'CPMK-1', deskripsi: 'Mampu menjelaskan konsep dasar pemrograman.' },
    { id: 'c2', kode: 'CPMK-2', deskripsi: 'Mampu mengimplementasikan algoritma sorting.' },
  ]);

  const handleAddCpmk = () => {
    setCpmks([...cpmks, { id: Date.now().toString(), kode: `CPMK-${cpmks.length + 1}`, deskripsi: '' }]);
  };

  const handleRemoveCpmk = (id: string) => {
    setCpmks(cpmks.filter(c => c.id !== id));
  };

  const handleChange = (id: string, field: 'kode' | 'deskripsi', value: string) => {
    setCpmks(cpmks.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = () => {
    alert('Pengaturan CPMK berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Pengaturan CPMK</h1>
      <p className="text-gray-500">Atur Capaian Pembelajaran Mata Kuliah (CPMK) untuk masing-masing Mata Kuliah.</p>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Mata Kuliah</label>
        <select 
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          value={selectedMk}
          onChange={(e) => setSelectedMk(e.target.value)}
        >
          <option value="" disabled>-- Pilih Mata Kuliah --</option>
          {mataKuliah.map(mk => (
            <option key={mk.id} value={mk.id}>{mk.kodeMk} - {mk.namaMk}</option>
          ))}
        </select>
      </div>

      {selectedMk && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Daftar CPMK</h3>
            <button 
              onClick={handleAddCpmk}
              className="flex items-center text-sm bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded text-gray-700 font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah CPMK
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {cpmks.map((cpmk, index) => (
              <div key={cpmk.id} className="flex space-x-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="w-32">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kode</label>
                  <input 
                    type="text" 
                    value={cpmk.kode}
                    onChange={(e) => handleChange(cpmk.id, 'kode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Deskripsi CPMK</label>
                  <textarea 
                    value={cpmk.deskripsi}
                    onChange={(e) => handleChange(cpmk.id, 'deskripsi', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[80px]"
                    placeholder="Masukkan deskripsi..."
                  />
                </div>
                <div className="pt-6">
                  <button 
                    onClick={() => handleRemoveCpmk(cpmk.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Hapus CPMK"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            
            {cpmks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Belum ada CPMK untuk Mata Kuliah ini.
              </div>
            )}
            
            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center shadow-sm transition-colors"
              >
                <Save className="w-5 h-5 mr-2" /> Simpan Pengaturan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
