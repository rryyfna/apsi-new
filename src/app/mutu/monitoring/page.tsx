'use client';

import { useState } from 'react';
import { Target, Search, Download } from 'lucide-react';
import PrintPDFButton from '@/app/components/PrintPDFButton';

export default function MonitoringCplPage() {
  const [angkatan, setAngkatan] = useState('2024');
  
  // Dummy data
  const students = [
    { nim: 'M0524001', name: 'Andi Saputra', cpl1: 85, cpl2: 78, cpl3: 82, cpl4: 88, status: 'Aman' },
    { nim: 'M0524002', name: 'Budi Santoso', cpl1: 65, cpl2: 60, cpl3: 70, cpl4: 68, status: 'Peringatan' },
    { nim: 'M0524003', name: 'Citra Dewi', cpl1: 90, cpl2: 85, cpl3: 88, cpl4: 92, status: 'Aman' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Monitoring CPL</h1>
          <p className="text-gray-500">Pantau Capaian Pembelajaran Lulusan (CPL) mahasiswa secara keseluruhan.</p>
        </div>
        <PrintPDFButton targetId="cpl-monitoring" fileName={`Monitoring_CPL_${angkatan}`} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="w-1/3">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Angkatan</label>
          <select 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={angkatan}
            onChange={(e) => setAngkatan(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Cari Mahasiswa</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="NIM atau Nama..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div id="cpl-monitoring" className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-blue-600 text-white">
          <h3 className="text-lg font-bold">Data CPL Angkatan {angkatan}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Mahasiswa</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">CPL-1 (Sikap)</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">CPL-2 (Pengetahuan)</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">CPL-3 (KU)</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">CPL-4 (KK)</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((std, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                    <div className="text-sm font-bold text-gray-900">{std.nim}</div>
                    <div className="text-sm text-gray-500">{std.name}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-semibold">{std.cpl1}%</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-semibold">{std.cpl2}%</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-semibold">{std.cpl3}%</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-semibold border-r border-gray-200">{std.cpl4}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                      std.status === 'Aman' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {std.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
