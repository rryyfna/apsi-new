'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash, Save, AlertCircle } from 'lucide-react';
import { savePresetBobot, getPresetBobot } from '@/app/actions/penilaian-khusus';

interface Criteria {
  id: string;
  name: string;
  weight: number;
}

const CATEGORIES = ['KP', 'SKRIPSI', 'CAPSTONE', 'MBKM'];

export default function PresetPenilaianPage() {
  const [presetCategory, setPresetCategory] = useState(CATEGORIES[0]);
  const [presetCriteria, setPresetCriteria] = useState<Criteria[]>([
    { id: '1', name: 'Nilai Pembimbing', weight: 60 },
    { id: '2', name: 'Nilai Penguji', weight: 40 }
  ]);
  const [presetMessage, setPresetMessage] = useState<{type: 'error'|'success', text: string} | null>(null);
  const [isSavingPreset, setIsSavingPreset] = useState(false);

  // Auto load preset when category changes
  useEffect(() => {
    handleLoadPresetToEdit();
  }, [presetCategory]);

  const handleLoadPresetToEdit = async () => {
    const res = await getPresetBobot(presetCategory);
    if (res.success && res.components && res.components.length > 0) {
      setPresetCriteria(res.components.map(c => ({
        id: c.id,
        name: c.namaKriteria,
        weight: c.bobot
      })));
      setPresetMessage(null); // Clear message on successful load
    } else {
      setPresetCriteria([{ id: Math.random().toString(), name: 'Kriteria Baru', weight: 100 }]);
      setPresetMessage({ type: 'success', text: `Preset ${presetCategory} belum ada. Silakan buat baru.` });
    }
  };

  const addPresetCriteria = () => {
    setPresetCriteria([...presetCriteria, { id: Math.random().toString(), name: '', weight: 0 }]);
  };

  const removePresetCriteria = (id: string) => {
    setPresetCriteria(presetCriteria.filter(c => c.id !== id));
  };

  const updatePresetCriteria = (id: string, field: keyof Criteria, value: string | number) => {
    setPresetCriteria(presetCriteria.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSavePreset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPreset(true);
    setPresetMessage(null);
    
    if (presetCriteria.some(c => !c.name.trim())) {
      setPresetMessage({ type: 'error', text: 'Nama kriteria tidak boleh kosong!' });
      setIsSavingPreset(false);
      return;
    }

    const res = await savePresetBobot(presetCategory, presetCriteria.map(c => ({ name: c.name, weight: c.weight })));
    
    if (res.success) {
      setPresetMessage({ type: 'success', text: `Preset Bobot untuk ${presetCategory} berhasil disimpan!` });
    } else {
      setPresetMessage({ type: 'error', text: res.error || 'Terjadi kesalahan' });
    }
    setIsSavingPreset(false);
  };

  const presetTotalWeight = presetCriteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Preset Bobot Penilaian Khusus</h1>
        <p className="text-gray-500 mt-1">Atur kriteria dan bobot default yang akan berlaku untuk input nilai KP, Skripsi, MBKM, dll.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Konfigurasi Kriteria</h2>
          <p className="text-sm text-gray-500">Pilih kategori dan tentukan komponen penilaiannya.</p>
        </div>
        
        <div className="p-6">
          {presetMessage && (
            <div className={`p-4 mb-6 rounded-lg flex items-center border ${presetMessage.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
              {presetMessage.text}
            </div>
          )}

          <form onSubmit={handleSavePreset} className="space-y-6">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori Penilaian</label>
                <select 
                  value={presetCategory} 
                  onChange={(e) => setPresetCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button 
                type="button" 
                onClick={handleLoadPresetToEdit}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors h-[42px]"
              >
                Muat Ulang
              </button>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Daftar Kriteria & Bobot</h3>
                <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                  Total Bobot: {presetTotalWeight}
                </span>
              </div>
              
              <div className="space-y-3">
                {presetCriteria.map((c, idx) => (
                  <div key={c.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="text-gray-500 font-medium w-6">{idx + 1}.</span>
                    <input 
                      type="text" 
                      value={c.name}
                      onChange={(e) => updatePresetCriteria(c.id, 'name', e.target.value)}
                      placeholder="Nama Kriteria (mis: Nilai Seminar)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                      required
                    />
                    <input 
                      type="number" 
                      value={c.weight}
                      onChange={(e) => updatePresetCriteria(c.id, 'weight', parseFloat(e.target.value))}
                      placeholder="Bobot"
                      className="w-24 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                      required min="1"
                    />
                    <span className="text-sm text-gray-500 font-medium">Bobot</span>
                    {presetCriteria.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removePresetCriteria(c.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button 
                type="button" 
                onClick={addPresetCriteria}
                className="mt-4 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4 mr-1" /> Tambah Kriteria
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={isSavingPreset}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" /> {isSavingPreset ? 'Menyimpan...' : 'Simpan Preset'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
