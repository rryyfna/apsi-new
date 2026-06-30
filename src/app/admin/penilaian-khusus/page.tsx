'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash, Save, AlertCircle, Search, Calculator, Table, Edit2, Activity, Clock, CheckCircle2, X } from 'lucide-react';
import { savePresetBobot, getPresetBobot, saveNilaiKhusus, getNilaiKhususPreview, deleteNilaiKhusus, searchMahasiswa } from '@/app/actions/penilaian-khusus';

interface Criteria {
  id: string;
  name: string;
  weight: number;
}

interface ScoreInput {
  componentId: string;
  namaKriteria: string;
  bobot: number;
  nilai: number;
}

const CATEGORIES = ['KP', 'SKRIPSI', 'CAPSTONE', 'MBKM'];

export default function PenilaianKhususPage() {
  // Panel 1: Input Nilai States
  const [studentNim, setStudentNim] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [studentPreview, setStudentPreview] = useState<{name: string, angkatan: string, nim: string} | null>(null);
  const [inputCategory, setInputCategory] = useState(CATEGORIES[0]);
  const [inputScores, setInputScores] = useState<ScoreInput[]>([]);
  const [inputMessage, setInputMessage] = useState<{type: 'error'|'success', text: string} | null>(null);
  const [isSavingNilai, setIsSavingNilai] = useState(false);

  // Panel 3: Preview States
  const [previews, setPreviews] = useState<any[]>([]);
  const [previewCategory, setPreviewCategory] = useState<string>('SEMUA');

  // Auto load student preview via search
  useEffect(() => {
    const fetchStudent = async () => {
      if (searchQuery.trim().length >= 3) {
        setIsSearching(true);
        const res = await searchMahasiswa(searchQuery);
        if (res.success && res.mahasiswa) {
          setSearchResults(res.mahasiswa);
        } else {
          setSearchResults([]);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    };
    
    const timeoutId = setTimeout(fetchStudent, 300); // debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Auto load preset when input category changes
  useEffect(() => {
    async function loadPreset() {
      const res = await getPresetBobot(inputCategory);
      if (res.success && res.components) {
        setInputScores(res.components.map(c => ({
          componentId: c.id,
          namaKriteria: c.namaKriteria,
          bobot: c.bobot,
          nilai: 0
        })));
      } else {
        setInputScores([]);
      }
    }
    loadPreset();
  }, [inputCategory]);

  // Auto load previews on mount
  const loadPreviews = async () => {
    const res = await getNilaiKhususPreview();
    if (res.success && res.enrollments) {
      setPreviews(res.enrollments);
    }
  };

  useEffect(() => {
    loadPreviews();
  }, []);

  let inputTotalWeight = 0;
  let inputTotalScore = 0;
  inputScores.forEach(s => {
    inputTotalWeight += s.bobot;
    inputTotalScore += (s.nilai || 0) * s.bobot;
  });
  const finalScore = inputTotalWeight > 0 ? (inputTotalScore / inputTotalWeight).toFixed(2) : '0.00';

  // --- INPUT NILai HANDLERS ---
  const handleScoreChange = (componentId: string, value: string) => {
    const numValue = parseFloat(value);
    setInputScores(inputScores.map(s => s.componentId === componentId ? { ...s, nilai: isNaN(numValue) ? 0 : numValue } : s));
  };

  const handleSaveNilai = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNim.trim()) {
      setInputMessage({ type: 'error', text: 'NIM Mahasiswa wajib diisi!' });
      return;
    }

    if (inputScores.length === 0) {
      setInputMessage({ type: 'error', text: `Belum ada kriteria penilaian untuk ${inputCategory}. Harap atur Preset terlebih dahulu!` });
      return;
    }

    // KONFIRMASI POPUP
    const confirmMsg = `Anda akan menyimpan Nilai Akhir: ${finalScore}\nUntuk NIM: ${studentNim.toUpperCase()}${studentPreview ? ` (${studentPreview.name})` : ''}\nKategori: ${inputCategory}\n\nLanjutkan?`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    setIsSavingNilai(true);
    setInputMessage(null);

    const scoresToSave = inputScores.map(s => ({ componentId: s.componentId, nilai: s.nilai }));
    const res = await saveNilaiKhusus(studentNim.toUpperCase(), inputCategory, scoresToSave);

    if (res.success) {
      setInputMessage({ type: 'success', text: `Nilai berhasil disimpan! Nilai Akhir: ${res.finalScore?.toFixed(2)}` });
      setStudentNim('');
      setInputScores(inputScores.map(s => ({ ...s, nilai: 0 }))); // Reset skor
      loadPreviews(); // Refresh preview
    } else {
      setInputMessage({ type: 'error', text: res.error || 'Terjadi kesalahan saat menyimpan nilai' });
    }
    setIsSavingNilai(false);
  };

  const handleDeleteNilai = async (id: string) => {
    if (confirm('Yakin ingin menghapus nilai ini?')) {
      const res = await deleteNilaiKhusus(id);
      if (res.success) {
        loadPreviews();
      } else {
        alert(res.error || 'Gagal menghapus nilai');
      }
    }
  };

  const handleEditNilai = async (enrollment: any) => {
    setStudentNim(enrollment.mahasiswa.nim);
    const category = enrollment.nonTeachingTemplate?.nama || CATEGORIES[0];
    setInputCategory(category);
    
    // Smooth scroll to panel 2
    window.scrollTo({ top: 400, behavior: 'smooth' });
    setInputMessage(null);

    // Wait slightly to let the inputCategory effect run and load components,
    // then overwrite them with actual scores. We can also just load directly.
    const res = await getPresetBobot(category);
    if (res.success && res.components) {
      const existingScores = enrollment.nonTeachingScores || [];
      setInputScores(res.components.map(c => {
        const found = existingScores.find((s: any) => s.componentId === c.id);
        return {
          componentId: c.id,
          namaKriteria: c.namaKriteria,
          bobot: c.bobot,
          nilai: found ? found.nilai : 0
        };
      }));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Penilaian Khusus (Non-Pengajaran)</h1>
        <p className="text-gray-500 mt-1">Input nilai khusus (KP, Skripsi, MBKM, dll) berdasarkan preset kriteria yang telah diatur.</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* PANEL 2: INPUT NILAI */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
          <h2 className="text-lg font-bold text-blue-900">2. Input Nilai Mahasiswa</h2>
          <p className="text-sm text-blue-700">Pilih kategori untuk memuat preset secara otomatis, lalu masukkan nilai untuk mahasiswa bersangkutan.</p>
        </div>

        <div className="p-6">
          {inputMessage && (
            <div className={`p-4 mb-6 rounded-lg flex items-center border ${inputMessage.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
              {inputMessage.text}
            </div>
          )}

          <form onSubmit={handleSaveNilai} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cari Mahasiswa</label>
                {!studentPreview ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setStudentNim(e.target.value);
                      }} 
                      placeholder="Ketik NIM atau Nama..." 
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" 
                      autoComplete="off"
                    />
                    
                    {/* Dropdown Results */}
                    {searchQuery.length >= 3 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                        {isSearching ? (
                          <div className="p-3 text-sm text-gray-500 text-center">Mencari...</div>
                        ) : searchResults.length > 0 ? (
                          <ul className="py-1">
                            {searchResults.map((m: any) => (
                              <li 
                                key={m.nim}
                                onClick={() => {
                                  setStudentPreview(m);
                                  setStudentNim(m.nim);
                                  setSearchQuery('');
                                  setSearchResults([]);
                                }}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0"
                              >
                                <div className="font-semibold text-gray-800">{m.name}</div>
                                <div className="text-xs text-gray-500">{m.nim} - Angkatan {m.angkatan}</div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-3 text-sm text-gray-500 text-center">Mahasiswa tidak ditemukan</div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center text-sm text-blue-900">
                      <CheckCircle2 className="w-5 h-5 mr-3 text-blue-600 shrink-0" />
                      <div>
                        <span className="font-bold block">{studentPreview.name}</span>
                        <span className="text-xs text-blue-700">{studentPreview.nim} - Angkatan {studentPreview.angkatan}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentPreview(null);
                        setStudentNim('');
                        setSearchQuery('');
                      }}
                      className="p-1.5 hover:bg-blue-100 rounded text-blue-700 transition-colors"
                      title="Ganti Mahasiswa"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori (Memuat Preset)</label>
                <select 
                  value={inputCategory} 
                  onChange={(e) => setInputCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              {inputScores.length > 0 ? (
                <>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-blue-600" /> Rincian Nilai ({inputCategory})
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    {inputScores.map((score, idx) => (
                      <div key={score.componentId} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="text-gray-500 font-medium w-6">{idx + 1}.</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{score.namaKriteria}</p>
                          <p className="text-xs text-gray-500">Bobot: {score.bobot}</p>
                        </div>
                        <div className="w-32">
                          <label className="text-xs text-gray-500 mb-1 block">Input Nilai</label>
                          <input 
                            type="number" 
                            value={score.nilai || ''} 
                            onChange={(e) => handleScoreChange(score.componentId, e.target.value)} 
                            className="w-full px-3 py-1.5 border border-gray-300 rounded outline-none focus:border-blue-500 bg-white" 
                            min="0" max="100" step="any"
                            placeholder="0-100"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-600 text-white p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Kalkulasi Otomatis (Σ(Nilai × Bobot) / ΣBobot)</p>
                      <h4 className="text-2xl font-bold">Rata-rata Nilai Akhir</h4>
                    </div>
                    <div className="text-4xl font-black">
                      {finalScore}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isSavingNilai}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center transition-colors disabled:opacity-50 text-lg shadow-lg shadow-green-200"
                    >
                      <Save className="w-6 h-6 mr-2" /> {isSavingNilai ? 'Menyimpan...' : 'Simpan Nilai'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                  <p className="text-gray-500">Preset Kriteria untuk <strong>{inputCategory}</strong> belum diatur.</p>
                  <p className="text-sm text-gray-400 mt-1">Silakan atur dan simpan preset di Panel 1 terlebih dahulu.</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PANEL 3: PREVIEW NILAI KHUSUS */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center justify-between">
          <div className="flex items-center">
            <Table className="w-5 h-5 text-green-700 mr-2" />
            <div>
              <h2 className="text-lg font-bold text-green-900">3. Preview Nilai Khusus Terinput</h2>
              <p className="text-sm text-green-700">Daftar mahasiswa yang telah mendapatkan nilai non-pengajaran terbaru.</p>
            </div>
          </div>
          <div>
            <select 
              value={previewCategory} 
              onChange={(e) => setPreviewCategory(e.target.value)}
              className="px-3 py-1.5 border border-green-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none text-green-800 font-medium"
            >
              <option value="SEMUA">Semua Kategori</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mahasiswa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai Akhir</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Huruf</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previews.filter(p => previewCategory === 'SEMUA' || p.nonTeachingTemplate?.nama === previewCategory).map((enrollment: any) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{enrollment.mahasiswa.name}</div>
                    <div className="text-xs text-gray-500">{enrollment.mahasiswa.nim}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {enrollment.nonTeachingTemplate?.nama || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900 font-bold">{enrollment.nilaiAkhir?.toFixed(2) || '0.00'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-sm leading-5 font-bold rounded ${
                      enrollment.huruf === 'A' ? 'text-green-700 bg-green-100' : 
                      enrollment.huruf === 'E' ? 'text-red-700 bg-red-100' : 'text-yellow-700 bg-yellow-100'
                    }`}>
                      {enrollment.huruf || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button 
                      type="button"
                      onClick={() => handleEditNilai(enrollment)}
                      className="text-blue-600 hover:text-blue-900 p-1 mr-2"
                      title="Edit Nilai"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDeleteNilai(enrollment.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Hapus Nilai"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {previews.filter(p => previewCategory === 'SEMUA' || p.nonTeachingTemplate?.nama === previewCategory).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data nilai khusus yang diinputkan untuk kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>

        {/* PANEL 4: AKTIVITAS TERAKHIR */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center">
            <Activity className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-bold text-gray-800">Aktivitas Terakhir</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {previews.slice(0, 5).map((log: any, i: number) => (
                <div key={log.id} className="relative pl-6 border-l-2 border-blue-100 last:border-0 pb-6 last:pb-0">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                  <div className="mb-1 text-sm font-semibold text-gray-800">
                    {log.mahasiswa.name} <span className="text-gray-400 font-normal">({log.mahasiswa.nim})</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Dinilai <span className="font-semibold">{log.nonTeachingTemplate?.nama}</span> dengan hasil akhir <span className="font-bold text-blue-600">{log.nilaiAkhir?.toFixed(2)}</span> (Huruf: <span className="font-bold">{log.huruf}</span>).
                  </div>
                  <div className="mt-1 flex items-center text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(log.updatedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
              ))}
              
              {previews.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Belum ada aktivitas penilaian khusus.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
