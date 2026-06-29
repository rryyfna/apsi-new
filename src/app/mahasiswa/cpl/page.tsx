import { Target, CheckCircle, AlertCircle } from 'lucide-react';
import PrintPDFButton from '@/app/components/PrintPDFButton';
import { getStudentCplReport } from '@/app/actions/mahasiswa';

export default async function MahasiswaCPLPage() {
  const { success, report, mahasiswa, error } = await getStudentCplReport();

  if (!success || !report || !mahasiswa) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p>{error || 'Gagal memuat data CPL'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Monitoring Capaian Pembelajaran Lulusan (CPL)</h1>
          <p className="text-gray-500 text-sm mt-1">Status pemenuhan seluruh Capaian Pembelajaran Lulusan program studi Anda.</p>
        </div>
        <PrintPDFButton targetId="cpl-report" fileName={`Laporan_CPL_${mahasiswa.nim}`} />
      </div>

      <div id="cpl-report" className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center text-gray-700 font-semibold">
            <Target className="w-5 h-5 mr-2 text-blue-600" /> Matriks Pencapaian CPL - {mahasiswa.name} ({mahasiswa.nim})
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Kode CPL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi Capaian Pembelajaran Lulusan</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-32">Pencapaian (%)</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-32">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {report.map((cpl) => (
                <tr key={cpl.kode} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 align-top">{cpl.kode}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 align-top pr-10">{cpl.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center align-top">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      cpl.score >= 80 ? 'bg-green-100 text-green-800 border border-green-200' :
                      cpl.score >= 70 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      cpl.score >= 60 ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                      'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {cpl.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center align-top">
                    {cpl.isPassed ? (
                      <span className="flex items-center justify-center text-green-600 font-medium text-sm">
                        <CheckCircle className="w-5 h-5 mr-1" /> Terpenuhi
                      </span>
                    ) : (
                      <span className="flex items-center justify-center text-red-500 font-medium text-sm">
                        <AlertCircle className="w-5 h-5 mr-1" /> Belum
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {report.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data CPL yang tersedia.
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
