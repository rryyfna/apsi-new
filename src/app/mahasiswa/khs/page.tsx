import { getStudentKhs } from '@/app/actions/mahasiswa';
import { AlertCircle, GraduationCap, TrendingUp, BookOpen, Award, FileText } from 'lucide-react';
import PrintPDFButton from '@/app/components/PrintPDFButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function KhsPage() {
  const data = await getStudentKhs();

  if ('error' in data || !data.success) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p>{'error' in data ? data.error : 'Gagal memuat data KHS'}</p>
      </div>
    );
  }

  const { profile, ipk, totalSks, semesters } = data;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kartu Hasil Studi (KHS)</h1>
          <p className="text-gray-500 text-sm mt-1">
            Transkrip nilai untuk {profile.name} ({profile.nim})
          </p>
        </div>
        <PrintPDFButton targetId="khs-report" fileName={`KHS_${profile.nim}`} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">IPK</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{ipk}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <GraduationCap className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total SKS Lulus</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalSks}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="bg-purple-50 p-3 rounded-lg">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Jumlah Semester</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{semesters.length}</p>
          </div>
        </div>
      </div>

      {/* Transcript per Semester */}
      <div id="khs-report" className="space-y-6">
        {semesters.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Belum ada data nilai.</p>
            <p className="text-sm mt-1">Anda perlu mengambil mata kuliah terlebih dahulu melalui KRS.</p>
          </div>
        ) : (
          semesters.map((sem) => (
            <div key={sem.name} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-800">{sem.name}</h2>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-500">SKS: <span className="font-bold text-gray-700">{sem.totalSks}</span></span>
                  <span className="text-gray-500">IPS: <span className="font-bold text-blue-700">{sem.ips}</span></span>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bobot</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sem.courses.map((c, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.kodeMk}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.namaMk}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.sks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.namaKelas}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.dosen}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {c.huruf ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              c.bobot >= 3.0 ? 'bg-green-100 text-green-800' :
                              c.bobot >= 2.0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {c.huruf}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                              Proses
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                          {c.huruf ? c.bobot.toFixed(1) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
