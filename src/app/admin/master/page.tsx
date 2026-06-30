import Link from 'next/link';
import { Database, FileSpreadsheet, Settings, Target, BookOpen, Activity, Map } from 'lucide-react';

export default function MasterDataPage() {
  const menus = [
    { title: 'Mata Kuliah', description: 'Kelola data Mata Kuliah.', href: '/admin/master/mata-kuliah', icon: <BookOpen className="w-8 h-8 text-blue-500" /> },
    { title: 'CPL', description: 'Kelola Capaian Pembelajaran Lulusan.', href: '/admin/master/cpl', icon: <Target className="w-8 h-8 text-green-500" /> },
    { title: 'CPMK', description: 'Kelola Capaian Pembelajaran Mata Kuliah.', href: '/admin/master/cpmk', icon: <Settings className="w-8 h-8 text-purple-500" /> },
    { title: 'IK (Indikator Kinerja)', description: 'Kelola Indikator Kinerja.', href: '/admin/master/ik', icon: <Activity className="w-8 h-8 text-orange-500" /> },
    { title: 'Pemetaan', description: 'Pemetaan Mata Kuliah ke CPL, CPMK, dan IK.', href: '/admin/master/pemetaan', icon: <Map className="w-8 h-8 text-teal-500" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Database className="w-6 h-6 mr-3 text-blue-600" />
          Master Data Akademik
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
