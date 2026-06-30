import Link from 'next/link';
import { Database, FileSpreadsheet, Settings, Target, Users } from 'lucide-react';

export default function KaprodiMasterDataPage() {
  const menus = [
    { title: 'Pengaturan CPMK', description: 'Lihat Capaian Pembelajaran Mata Kuliah.', href: '/kaprodi/cpmk', icon: <Settings className="w-8 h-8 text-blue-500" /> },
    { title: 'Peta Kurikulum', description: 'Lihat pemetaan CPMK ke CPL.', href: '/kaprodi/pemetaan', icon: <FileSpreadsheet className="w-8 h-8 text-green-500" /> },
    { title: 'Monitoring CPL', description: 'Pantau capaian CPL.', href: '/kaprodi/monitoring', icon: <Target className="w-8 h-8 text-purple-500" /> },
    { title: 'Lihat Kuota', description: 'Daftar kapasitas kelas.', href: '/kaprodi/kelas', icon: <Users className="w-8 h-8 text-orange-500" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Database className="w-6 h-6 mr-3 text-blue-600" />
          Master Data Akademik (Kaprodi)
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menus.map((menu, idx) => (
          <Link key={idx} href={menu.href} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className="mb-4 bg-gray-50 p-4 rounded-full">
              {menu.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800">{menu.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{menu.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
