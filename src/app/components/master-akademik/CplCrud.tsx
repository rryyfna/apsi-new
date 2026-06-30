"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Link } from 'lucide-react';

type CPMK = {
  id: string;
  kode: string;
  deskripsi: string;
  mataKuliah: { kodeMk: string; namaMk: string };
};

type IK = {
  id: string;
  kode: string;
  deskripsi: string;
  bobot: number;
};

type CPL = {
  id: string;
  kode: string;
  deskripsi: string;
  deskripsiEn: string | null;
  ik: IK[];
};

export default function CplManager() {
  const [cpls, setCpls] = useState<CPL[]>([]);
  const [allIk, setAllIk] = useState<IK[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    kode: '',
    deskripsi: '',
    deskripsiEn: '',
    ikMappings: [] as { ikId: string; bobot: number }[]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cplRes, ikRes] = await Promise.all([
        fetch('/api/cpl'),
        fetch('/api/ik')
      ]);
      
      if (cplRes.ok) setCpls(await cplRes.json());
      if (ikRes.ok) setAllIk(await ikRes.json());
    } catch (error) {
      console.error('Failed to fetch', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (cpl?: CPL) => {
    if (cpl) {
      setEditingId(cpl.id);
      setFormData({
        kode: cpl.kode,
        deskripsi: cpl.deskripsi,
        deskripsiEn: cpl.deskripsiEn || '',
        ikMappings: cpl.ik.map(i => ({ ikId: i.id, bobot: i.bobot }))
      });
    } else {
      setEditingId(null);
      setFormData({
        kode: '',
        deskripsi: '',
        deskripsiEn: '',
        ikMappings: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleAddMapping = () => {
    setFormData(prev => ({
      ...prev,
      ikMappings: [...prev.ikMappings, { ikId: '', bobot: 0 }]
    }));
  };

  const handleRemoveMapping = (index: number) => {
    setFormData(prev => {
      const newMappings = [...prev.ikMappings];
      newMappings.splice(index, 1);
      return { ...prev, ikMappings: newMappings };
    });
  };

  const handleMappingChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newMappings = [...prev.ikMappings];
      newMappings[index] = { ...newMappings[index], [field]: value };
      return { ...prev, ikMappings: newMappings };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/cpl/${editingId}` : '/api/cpl';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        await fetchData();
        closeModal();
      } else {
        const error = await res.json();
        alert(error.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error saving', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus CPL ini?')) {
      try {
        const res = await fetch(`/api/cpl/${id}`, { method: 'DELETE' });
        if (res.ok) await fetchData();
      } catch (error) {
        console.error('Error deleting', error);
      }
    }
  };

  const filteredData = cpls.filter(cpl => 
    cpl.kode.toLowerCase().includes(search.toLowerCase()) ||
    cpl.deskripsi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Manajemen Capaian Pembelajaran Lulusan (CPL)</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="Cari CPL..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">IK Terhubung</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">Memuat data...</td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">Belum ada data CPL.</td>
              </tr>
            ) : (
              filteredData.map((cpl) => (
                <tr key={cpl.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cpl.kode}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{cpl.deskripsi}</td>
                  <td className="px-6 py-4 text-sm text-center font-bold text-green-600">
                    {cpl.ik?.length || 0} IK
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(cpl)} className="text-blue-600 hover:text-blue-900 mr-3" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(cpl.id)} className="text-red-600 hover:text-red-900" title="Hapus">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit CPL & Pemetaan IK' : 'Tambah Capaian Pembelajaran Lulusan'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kode CPL</label>
                    <input
                      type="text"
                      required
                      value={formData.kode}
                      onChange={e => setFormData({...formData, kode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: CPL-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi CPL</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.deskripsi}
                    onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <hr className="my-6 border-gray-200" />
                
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Pemetaan IK ke CPL
                  </h4>
                  <button 
                    type="button" 
                    onClick={handleAddMapping}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    + Tambah IK
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.ikMappings.length === 0 && (
                    <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm">
                      Belum ada IK yang dipetakan ke CPL ini.
                    </div>
                  )}
                  {formData.ikMappings.map((mapping, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex-1 w-full">
                        <select 
                          required
                          value={mapping.ikId}
                          onChange={(e) => handleMappingChange(index, 'ikId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="" disabled>Pilih IK...</option>
                          {allIk.map(i => (
                            <option key={i.id} value={i.id}>
                              {i.kode} - {i.deskripsi.substring(0, 50)}...
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full sm:w-32">
                        <input
                          type="number"
                          required
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="Bobot %"
                          value={mapping.bobot}
                          onChange={(e) => handleMappingChange(index, 'bobot', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleRemoveMapping(index)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.ikMappings.length > 0 && (
                    <div className="text-right text-xs font-semibold text-gray-500 mt-2">
                      Total Bobot: {formData.ikMappings.reduce((sum, m) => sum + m.bobot, 0)}%
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
