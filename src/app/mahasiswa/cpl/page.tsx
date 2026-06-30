import { Target, CheckCircle, AlertCircle, XCircle, TrendingUp, BookOpen } from 'lucide-react';
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

  // Dummy descriptions from the screenshot
  const dummyDescriptions: Record<string, string> = {
    'CPL-1': 'P1: Kemampuan untuk menerapkan pengetahuan matematika, ilmu pengetahuan alam dan/atau material, teknologi informasi, dan teknik untuk memperoleh pemahaman yang komprehensif tentang prinsip-prinsip rekayasa (CPL1/K24).',
    'CPL-2': 'KK1: Kemampuan untuk merancang sistem terintegrasi untuk memenuhi kebutuhan yang diinginkan dalam batasan-batasan yang realistis dalam berbagai aspek seperti teknis, standar, hukum, ekonomi, lingkungan, sosial, politik, kesehatan dan keselamatan, keberlanjutan, serta melibatkan pemangku kepentingan yang relevan, mengenali dan/atau memanfaatkan potensi sumber daya lokal dan nasional dengan perspektif global (CPL2/K24).',
    'CPL-3': 'KK2: Kemampuan untuk merancang dan melakukan eksperimen laboratorium dan/atau lapangan serta menganalisis dan menginterpretasikan data untuk mendukung proses pengambilan keputusan di bidang teknik industri (CPL3/K24).',
    'CPL-4': 'KK3: Kemampuan untuk mengidentifikasi, memformulasikan, menganalisis, dan memecahkan masalah-masalah teknik yang kompleks dalam sebuah sistem yang terintegrasi (CPL4/K24).',
    'CPL-5': 'KK4: Kemampuan untuk menerapkan metode, keterampilan, dan alat teknik modern yang diperlukan untuk praktik teknik industri (CPL5/K24).',
    'CPL-6': 'KU1: Kemampuan untuk berkomunikasi secara efektif dengan berbagai audiens dan situasi (CPL6/K24).',
    'CPL-7': 'KU2: Kemampuan untuk merencanakan, menyelesaikan, dan mengevaluasi tugas-tugas di bawah batasan-batasan tertentu (CPL7/K24).',
    'CPL-8': 'KU3: Kemampuan untuk bekerja dalam tim multidisiplin dan multikultural (CPL8/K24).',
    'CPL-9': 'S1: Kemampuan untuk bertanggung jawab kepada masyarakat dan mematuhi etika profesi dalam menyelesaikan masalah-masalah teknik industri (CPL9/K24).',
    'CPL-10': 'S2: Kemampuan untuk mengambil inisiatif dalam pembelajaran sepanjang hayat, termasuk akses ke pengetahuan yang relevan dalam isu-isu kontemporer (CPL10/K24).'
  };

  const targetMinimal = 70;
  const tercapaiCount = report.filter(r => r.score >= targetMinimal).length;
  const tidakTercapaiCount = report.filter(r => r.score > 0 && r.score < targetMinimal).length;
  const totalScore = report.reduce((sum, r) => sum + r.score, 0);
  const averageScore = report.length > 0 ? Math.round(totalScore / report.length) : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hasil Capaian Pembelajaran Lulusan (CPL)</h1>
          <p className="text-gray-500 text-sm mt-1">Detail pencapaian CPL Anda berdasarkan nilai yang telah diinput</p>
        </div>
        <PrintPDFButton targetId="cpl-report" fileName={`Laporan_CPL_${mahasiswa.nim}`} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">CPL Tercapai</p>
            <p className="text-2xl font-bold text-gray-900">{tercapaiCount}/{report.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-red-100 p-3 rounded-full">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tidak Tercapai</p>
            <p className="text-2xl font-bold text-gray-900">{tidakTercapaiCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Rata-rata Nilai</p>
            <p className="text-2xl font-bold text-gray-900">{averageScore > 0 ? averageScore : '-'}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Target className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Target Minimal</p>
            <p className="text-2xl font-bold text-gray-900">{targetMinimal}</p>
          </div>
        </div>
      </div>

      {/* Progress CPL List */}
      <div id="cpl-report" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <BookOpen className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-bold text-gray-800">Progress CPL</h2>
        </div>

        <div className="space-y-4">
          {report.map((cpl) => {
            // Sort custom as per screenshot (1, 10, 2, 3...)
            const desc = dummyDescriptions[cpl.kode] || cpl.nama;
            
            return (
              <div key={cpl.kode} className="flex flex-col md:flex-row items-start md:items-center py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-2">
                <div className="bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-md text-xs w-16 text-center shrink-0 mb-3 md:mb-0">
                  {cpl.kode}
                </div>
                
                <div className="text-sm text-gray-600 md:ml-4 flex-grow pr-4">
                  {desc}
                </div>
                
                <div className="shrink-0 mt-3 md:mt-0 md:ml-4 flex items-center space-x-2">
                  <span className="text-gray-400 font-medium">—</span>
                  {cpl.score === 0 ? (
                    <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 rounded text-xs font-semibold">
                      Belum Ada Data
                    </span>
                  ) : (
                    <span className={`px-3 py-1 rounded text-xs font-semibold border ${
                      cpl.score >= targetMinimal 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {cpl.score}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
