'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { enrollClass } from '@/app/actions/mahasiswa';
import { BookOpen, Users, Search, CheckCircle, AlertCircle, ClipboardList, GraduationCap } from 'lucide-react';

interface AvailableClass {
  id: string;
  namaKelas: string;
  tahunAkademik: string | null;
  kuotaReguler: number;
  jumlahAmbilReguler: number;
  mataKuliah: {
    kodeMk: string;
    namaMk: string;
    sks: number;
    semester: number | null;
  };
  dosen: {
    name: string;
  };
  _count: {
    enrollments: number;
  };
}

interface EnrolledClass {
  id: string;
  kelasId: string;
  kodeMk: string;
  namaMk: string;
  sks: number;
  namaKelas: string;
  dosenName: string;
  huruf: string | null;
  tahunAkademik: string | null;
}

interface KrsClientPageProps {
  availableClasses: AvailableClass[];
  enrolledClasses: EnrolledClass[];
  mahasiswaName: string;
  mahasiswaNim: string;
}

export default function KrsClientPage({ availableClasses, enrolledClasses, mahasiswaName, mahasiswaNim }: KrsClientPageProps) {
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const enrolledKelasIds = new Set(enrolledClasses.map(c => c.kelasId));
  const totalSksAktif = enrolledClasses.filter(c => !c.huruf).reduce((acc, c) => acc + c.sks, 0);

  const filteredClasses = availableClasses.filter(k => {
    const q = search.toLowerCase();
    return (
      k.mataKuliah.kodeMk.toLowerCase().includes(q) ||
      k.mataKuliah.namaMk.toLowerCase().includes(q) ||
      k.dosen.name.toLowerCase().includes(q)
    );
  });

  async function handleEnroll(kelasId: string) {
    setMessage(null);
    startTransition(async () => {
      const result = await enrollClass(kelasId);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Berhasil mengambil kelas!' });
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kartu Rencana Studi (KRS)</h1>
          <p className="text-gray-500 text-sm mt-1">
            {mahasiswaName} ({mahasiswaNim}) — SKS Aktif: <span className="font-bold text-blue-600">{totalSksAktif}</span>
          </p>
        </div>
      </div>

      {/* Feedback */}
      {message && (
        <div className={`p-4 rounded-lg border flex items-center space-x-3 ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Enrolled Classes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center">
          <ClipboardList className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-bold text-gray-800">Mata Kuliah yang Sudah Diambil</h2>
          <span className="ml-auto text-sm text-gray-500 font-medium">{enrolledClasses.length} MK</span>
        </div>

        {enrolledClasses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode MK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Kuliah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrolledClasses.map((mk) => (
                  <tr key={mk.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mk.kodeMk}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{mk.namaMk}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mk.sks}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mk.namaKelas}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mk.dosenName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {mk.huruf ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          Lulus ({mk.huruf})
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                          Aktif
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Belum ada mata kuliah yang diambil.</p>
            <p className="text-sm mt-1">Pilih kelas dari daftar di bawah untuk mengisi KRS Anda.</p>
          </div>
        )}
      </div>

      {/* Available Classes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-lg font-bold text-gray-800">Daftar Kelas Tersedia</h2>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kode MK, nama, atau dosen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all w-full sm:w-72"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode MK</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Kuliah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kuota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.map((k) => {
                const isEnrolled = enrolledKelasIds.has(k.id);
                const isFull = k.kuotaReguler > 0 && k.jumlahAmbilReguler >= k.kuotaReguler;

                return (
                  <tr key={k.id} className={`transition-colors ${isEnrolled ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{k.mataKuliah.kodeMk}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{k.mataKuliah.namaMk}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{k.mataKuliah.sks}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{k.namaKelas}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{k.dosen.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className={`font-medium ${isFull ? 'text-red-600' : 'text-gray-600'}`}>
                          {k.jumlahAmbilReguler}/{k.kuotaReguler || '∞'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEnrolled ? (
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                          Sudah Diambil
                        </span>
                      ) : isFull ? (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                          Penuh
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEnroll(k.id)}
                          disabled={isPending}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                            isPending
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                          }`}
                        >
                          {isPending ? 'Proses...' : 'Ambil Kelas'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredClasses.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-sm">
                    {search ? 'Tidak ditemukan kelas yang cocok dengan pencarian.' : 'Belum ada kelas yang tersedia.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
