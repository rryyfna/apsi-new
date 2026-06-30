"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

type MataKuliah = {
  id: string;
  kodeMk: string;
  namaMk: string;
  sks: number;
  semester: number | null;
  isNonTeaching: boolean;
};

export default function MataKuliahManager() {
  const [mataKuliahs, setMataKuliahs] = useState<MataKuliah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    kodeMk: '',
    namaMk: '',
    sks: 1,
    semester: 1,
    isNonTeaching: false,
  });

  const fetchMataKuliah = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mata-kuliah');
      if (res.ok) {
        const data = await res.json();
        setMataKuliahs(data);
      }
    } catch (error) {
      console.error('Failed to fetch mata kuliah', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMataKuliah();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const openModal = (mk?: MataKuliah) => {
    if (mk) {
      setEditingId(mk.id);
      setFormData({
        kodeMk: mk.kodeMk,
        namaMk: mk.namaMk,
        sks: mk.sks,
        semester: mk.semester || 1,
        isNonTeaching: mk.isNonTeaching,
      });
    } else {
      setEditingId(null);
      setFormData({
        kodeMk: '',
        namaMk: '',
        sks: 1,
        semester: 1,
        isNonTeaching: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/mata-kuliah/${editingId}` : '/api/mata-kuliah';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        await fetchMataKuliah();
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
    if (confirm('Apakah Anda yakin ingin menghapus Mata Kuliah ini?')) {
      try {
        const res = await fetch(`/api/mata-kuliah/${id}`, { method: 'DELETE' });
        if (res.ok) {
          await fetchMataKuliah();
        }
      } catch (error) {
        console.error('Error deleting', error);
      }
    }
  };

  const filteredData = mataKuliahs.filter(mk => 
    mk.kodeMk.toLowerCase().includes(search.toLowerCase()) ||
    mk.namaMk.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Manajemen Mata Kuliah</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="Cari mata kuliah..." 
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Kuliah</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SKS</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Memuat data...</td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Belum ada data mata kuliah.</td>
              </tr>
            ) : (
              filteredData.map((mk) => (
                <tr key={mk.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mk.kodeMk}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{mk.namaMk}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{mk.sks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{mk.semester || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {mk.isNonTeaching ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Non-Teaching</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Reguler</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(mk)} className="text-blue-600 hover:text-blue-900 mr-3" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(mk.id)} className="text-red-600 hover:text-red-900" title="Hapus">
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Mata Kuliah</label>
                  <input
                    type="text"
                    name="kodeMk"
                    required
                    value={formData.kodeMk}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: CS101"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Kuliah</label>
                  <input
                    type="text"
                    name="namaMk"
                    required
                    value={formData.namaMk}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Algoritma dan Pemrograman"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKS</label>
                    <input
                      type="number"
                      name="sks"
                      required
                      min="1"
                      value={formData.sks}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <input
                      type="number"
                      name="semester"
                      min="1"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="isNonTeaching"
                    name="isNonTeaching"
                    checked={formData.isNonTeaching}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isNonTeaching" className="ml-2 block text-sm text-gray-900">
                    Mata Kuliah Non-Teaching (Skripsi, KP, dll)
                  </label>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
