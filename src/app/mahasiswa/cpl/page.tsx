import { Target, CheckCircle, AlertCircle, TrendingUp, BookOpen, Award, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import PrintPDFButton from '@/app/components/PrintPDFButton';
import { getStudentCplReport } from '@/app/actions/mahasiswa';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  const validReports = report.filter(r => r.score > 0);
  const tercapaiCount = report.filter(r => r.score >= targetMinimal).length;
  
  const totalScore = validReports.reduce((sum, r) => sum + r.score, 0);
  const averageScore = validReports.length > 0 ? Math.round(totalScore / validReports.length) : 0;
  
  // Find Highest and Lowest CPL
  let highestCpl = { kode: '-', score: 0 };
  let lowestCpl = { kode: '-', score: 100 };
  
  if (validReports.length > 0) {
    highestCpl = validReports.reduce((max, r) => r.score > max.score ? r : max, validReports[0]);
    lowestCpl = validReports.reduce((min, r) => r.score < min.score ? r : min, validReports[0]);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Simple Header matching app theme */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Capaian Pembelajaran Lulusan (CPL)</h1>
          <p className="text-gray-500 text-sm mt-1">
            Matriks pencapaian kompetensi untuk {mahasiswa.name} ({mahasiswa.nim})
          </p>
        </div>
        <PrintPDFButton targetId="cpl-report" fileName={`Laporan_CPL_${mahasiswa.nim}`} />
      </div>

      {/* Analytical Summary Cards (Clean Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Rata-rata */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Rata-rata Capaian</p>
            <div className="flex items-baseline space-x-1 mt-1">
              <p className="text-2xl font-bold text-gray-900">{averageScore > 0 ? averageScore : '-'}</p>
              {averageScore > 0 && <p className="text-sm font-medium text-gray-500">%</p>}
            </div>
          </div>
        </div>

        {/* Card 2: Status Pemenuhan */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">CPL Terpenuhi</p>
            <div className="flex items-baseline space-x-1 mt-1">
              <p className="text-2xl font-bold text-gray-900">{tercapaiCount}</p>
              <p className="text-sm font-medium text-gray-500">/ {report.length}</p>
            </div>
          </div>
        </div>

        {/* Card 3: CPL Tertinggi */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="bg-amber-50 p-3 rounded-lg">
            <Award className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Capaian Tertinggi</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <p className="text-xl font-bold text-gray-900">{highestCpl.kode}</p>
              {highestCpl.score > 0 && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">{highestCpl.score}%</span>}
            </div>
          </div>
        </div>

        {/* Card 4: Perlu Peningkatan */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="bg-red-50 p-3 rounded-lg">
            <ArrowDownRight className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Perlu Peningkatan</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <p className="text-xl font-bold text-gray-900">{lowestCpl.kode}</p>
              {lowestCpl.score < 100 && lowestCpl.score > 0 && <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">{lowestCpl.score}%</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Progress CPL List (Clean Theme) */}
      <div id="cpl-report" className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 bg-gray-50/80 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-bold text-gray-800">Rincian Progress CPL</h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {report.map((cpl) => {
            const desc = dummyDescriptions[cpl.kode] || cpl.nama;
            const isPassed = cpl.score >= targetMinimal;
            const hasData = cpl.score > 0;
            
            return (
              <div key={cpl.kode} className="flex flex-col lg:flex-row items-start lg:items-center p-5 hover:bg-gray-50 transition-colors">
                
                {/* Left Section: Badge & Description */}
                <div className="flex flex-col sm:flex-row items-start lg:items-center flex-grow pr-0 lg:pr-8 w-full">
                  <div className="bg-blue-50 border border-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded text-xs w-20 text-center shrink-0 mb-3 sm:mb-0">
                    {cpl.kode}
                  </div>
                  
                  <div className="text-sm text-gray-600 sm:ml-4 leading-relaxed">
                    {desc}
                  </div>
                </div>
                
                {/* Right Section: Score Only (Simplified) */}
                <div className="shrink-0 mt-4 lg:mt-0 flex items-center space-x-3 w-full lg:w-auto border-t lg:border-t-0 border-gray-100 pt-3 lg:pt-0">
                  <span className="hidden lg:inline text-gray-300 font-medium">—</span>
                  
                  <div className="flex-1 lg:flex-none flex justify-end">
                    {hasData ? (
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                        isPassed 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {cpl.score}%
                      </span>
                    ) : (
                      <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-full text-xs font-semibold">
                        Belum Ada Data
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
