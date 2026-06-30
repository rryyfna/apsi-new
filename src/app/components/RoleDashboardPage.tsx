import Link from 'next/link';

/**
 * Shared dashboard page for roles that manage academic quality (Kaprodi, Mutu).
 * 
 * Each role gets the same two cards (CPMK management + CPL monitoring)
 * with role-specific URLs and titles injected via props.
 */

interface RoleDashboardPageProps {
  title: string;
  description: string;
  cpmkLink: string;
  monitoringLink: string;
}

export default function RoleDashboardPage({
  title,
  description,
  cpmkLink,
  monitoringLink,
}: RoleDashboardPageProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
      <p className="text-gray-600 mb-8">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Pengaturan CPMK</h2>
          <p className="text-gray-600 mb-4 flex-1">
            Atur dan petakan Capaian Pembelajaran Mata Kuliah (CPMK) untuk seluruh mata kuliah yang ada di prodi Anda.
          </p>
          <Link
            href={cpmkLink}
            className="inline-block text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Kelola CPMK
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Monitoring CPL</h2>
          <p className="text-gray-600 mb-4 flex-1">
            Pantau Capaian Pembelajaran Lulusan (CPL) dari setiap mahasiswa atau secara agregat untuk melihat efektivitas pembelajaran.
          </p>
          <Link
            href={monitoringLink}
            className="inline-block text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Lihat Monitoring
          </Link>
        </div>
      </div>
    </div>
  );
}
