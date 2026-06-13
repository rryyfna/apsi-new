export default function KaprodiDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Kaprodi</h1>
      <p className="text-gray-600 mb-8">
        Selamat datang di portal Ketua Program Studi. Gunakan menu di sebelah kiri untuk mengatur CPMK dan memantau capaian CPL.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Pengaturan CPMK</h2>
          <p className="text-gray-600 mb-4 flex-1">
            Atur dan petakan Capaian Pembelajaran Mata Kuliah (CPMK) untuk seluruh mata kuliah yang ada di prodi Anda.
          </p>
          <a href="/kaprodi/cpmk" className="inline-block text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Kelola CPMK
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Monitoring CPL</h2>
          <p className="text-gray-600 mb-4 flex-1">
            Pantau Capaian Pembelajaran Lulusan (CPL) dari setiap mahasiswa atau secara agregat untuk melihat efektivitas pembelajaran.
          </p>
          <a href="/kaprodi/monitoring" className="inline-block text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Lihat Monitoring
          </a>
        </div>
      </div>
    </div>
  );
}
