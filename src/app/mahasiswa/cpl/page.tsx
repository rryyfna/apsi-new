import { Target, CheckCircle, AlertCircle, XCircle, TrendingUp, BookOpen, Award, Zap } from 'lucide-react';
import PrintPDFButton from '@/app/components/PrintPDFButton';
import { getStudentCplReport } from '@/app/actions/mahasiswa';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MahasiswaCPLPage() {
  const { success, report, mahasiswa, error } = await getStudentCplReport();

  if (!success || !report || !mahasiswa) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 shadow-sm animate-pulse">
        <AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-400" />
        <p className="font-medium text-lg">{error || 'Gagal memuat data CPL'}</p>
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
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 p-8 rounded-2xl shadow-xl border border-indigo-700/50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 mb-4">
              <Award className="w-4 h-4 text-blue-300" />
              <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">Capaian Akademik</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Hasil Capaian Lulusan</h1>
            <p className="text-blue-200 text-sm md:text-base mt-2 max-w-xl leading-relaxed">
              Pantau detail kemajuan akademik Anda secara langsung. Matriks ini dihitung secara real-time berdasarkan nilai mata kuliah yang terintegrasi.
            </p>
          </div>
          <div className="shrink-0 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
            <PrintPDFButton targetId="cpl-report" fileName={`Laporan_CPL_${mahasiswa.nim}`} />
          </div>
        </div>
      </div>

      {/* Premium Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center space-x-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
          <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-4 rounded-xl shadow-lg shadow-green-200 group-hover:scale-110 transition-transform duration-300">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">CPL Tercapai</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-3xl font-extrabold text-gray-900">{tercapaiCount}</p>
              <p className="text-sm font-medium text-gray-400">/ {report.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center space-x-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
          <div className="bg-gradient-to-br from-red-400 to-rose-600 p-4 rounded-xl shadow-lg shadow-red-200 group-hover:scale-110 transition-transform duration-300">
            <XCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Belum Tercapai</p>
            <p className="text-3xl font-extrabold text-gray-900">{tidakTercapaiCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center space-x-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
          <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-4 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Rata-rata Nilai</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-3xl font-extrabold text-gray-900">{averageScore > 0 ? averageScore : '-'}</p>
              <p className="text-sm font-medium text-gray-400">%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center space-x-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-xl shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Target Minimal</p>
            <p className="text-3xl font-extrabold text-gray-900">{targetMinimal}</p>
          </div>
        </div>
      </div>

      {/* Progress CPL List */}
      <div id="cpl-report" className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-2 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <BookOpen className="w-5 h-5 text-blue-700" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">Rincian Progress CPL</h2>
          </div>
          <div className="hidden sm:flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider space-x-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Real-time Sync</span>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {report.map((cpl, index) => {
            const desc = dummyDescriptions[cpl.kode] || cpl.nama;
            const isPassed = cpl.score >= targetMinimal;
            const hasData = cpl.score > 0;
            
            // Generate a delay for staggered animation
            const delay = `${index * 50}ms`;
            
            return (
              <div 
                key={cpl.kode} 
                className="group flex flex-col lg:flex-row items-start lg:items-center p-6 hover:bg-blue-50/30 transition-colors duration-300 animate-in fade-in slide-in-from-right-4"
                style={{ animationDelay: delay, animationFillMode: 'both' }}
              >
                {/* Left Section: Badge & Description */}
                <div className="flex flex-col sm:flex-row items-start lg:items-center flex-grow pr-0 lg:pr-8 w-full">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 text-gray-700 font-extrabold px-4 py-2 rounded-lg text-sm w-20 text-center shrink-0 mb-4 sm:mb-0 shadow-sm group-hover:border-blue-300 group-hover:text-blue-700 transition-colors">
                    {cpl.kode}
                  </div>
                  
                  <div className="text-sm text-gray-600 sm:ml-5 leading-relaxed font-medium">
                    {desc}
                  </div>
                </div>
                
                {/* Right Section: Progress Bar & Score */}
                <div className="shrink-0 w-full lg:w-64 mt-6 lg:mt-0 flex flex-col justify-center border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pencapaian</span>
                    {hasData ? (
                      <span className={`text-lg font-black ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                        {cpl.score}%
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        Belum Ada Data
                      </span>
                    )}
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    {hasData && (
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                          isPassed ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-rose-500'
                        }`}
                        style={{ width: `${cpl.score}%` }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                      </div>
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
