'use client';

import { useState, useEffect } from 'react';
import { getAllKelas, getKelasWithEnrollmentsAdmin } from '@/app/actions/admin-nilai';
import { AlertCircle } from 'lucide-react';
import PrintPDFButton from '@/app/components/PrintPDFButton';

export default function InputNilaiPage() {
  const [kelas, setKelas] = useState<any[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{type: 'error'|'success', text: string} | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setIsLoading(true);
    try {
      const data = await getAllKelas();
      setKelas(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectKelas(kelasId: string) {
    setIsLoading(true);
    setMessage(null);
    try {
      const detail = await getKelasWithEnrollmentsAdmin(kelasId);
      if (detail) {
        setSelectedKelas(detail);
        setEnrollments(detail.enrollments);
      } else {
        setMessage({ type: 'error', text: 'Detail kelas tidak ditemukan.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Gagal memuat detail kelas.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manajemen Nilai (Read-Only)</h1>

      {message && (
        <div className={`p-4 rounded-lg flex items-center border ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          <AlertCircle className="w-5 h-5 mr-3" />
          {message.text}
        </div>
      )}

      {/* Pilih Kelas */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Kelas</label>
        <select 
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            if (e.target.value) handleSelectKelas(e.target.value);
            else { setSelectedKelas(null); setEnrollments([]); }
          }}
          defaultValue=""
        >
          <option value="" disabled>-- Pilih Kelas --</option>
          {kelas.map(k => (
            <option key={k.id} value={k.id}>{k.mataKuliah.kodeMk} - {k.mataKuliah.namaMk} (Kelas {k.namaKelas})</option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-gray-500">Memuat data...</p>}

      {/* Tabel Nilai */}
      {!isLoading && selectedKelas && (
        <div id="class-report" className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-blue-600 text-white flex justify-between items-center rounded-t-lg">
            <div>
              <h3 className="text-lg font-bold">Laporan Nilai: {selectedKelas.mataKuliah.namaMk} (Kelas {selectedKelas.namaKelas})</h3>
              <p className="text-blue-100 text-sm">
                Bobot: Tugas {selectedKelas.bobotTugas ?? 20}%, UTS {selectedKelas.bobotUts ?? 30}%, UAS {selectedKelas.bobotUas ?? 30}%, Partisipasi {selectedKelas.bobotPartisipasi ?? 10}%, Proyek {selectedKelas.bobotProyek ?? 10}%
              </p>
            </div>
            <div className="flex-shrink-0">
               <PrintPDFButton targetId="class-report" fileName={`Nilai_${selectedKelas.mataKuliah.kodeMk}_Kls_${selectedKelas.namaKelas}`} />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Mahasiswa</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Tugas</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">UTS</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">UAS</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Partisipasi</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Proyek</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Akhir</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">Huruf</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.map((en) => (
                  <tr key={en.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{en.mahasiswa.nim}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{en.mahasiswa.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm">{en.nilaiTugas ?? '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm">{en.nilaiUts ?? '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm">{en.nilaiUas ?? '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm">{en.nilaiPartisipasi ?? '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm">{en.nilaiProyek ?? '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-700">{en.nilaiAkhir ?? '-'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-extrabold text-blue-600">{en.huruf ?? '-'}</td>
                  </tr>
                ))}
                {enrollments.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">Belum ada mahasiswa terdaftar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
