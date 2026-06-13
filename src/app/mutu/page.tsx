export default function MutuDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Gugus Mutu</h1>
      <p className="text-gray-600 mb-8">
        Selamat datang di portal Gugus Kendali Mutu. Gunakan menu di sebelah kiri untuk memantau capaian CPL fakultas/universitas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Monitoring CPL</h2>
          <p className="text-gray-600 mb-4 flex-1">
            Pantau ketercapaian Capaian Pembelajaran Lulusan (CPL) untuk mengevaluasi mutu pendidikan secara menyeluruh.
          </p>
          <a href="/mutu/monitoring" className="inline-block text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Lihat Monitoring
          </a>
        </div>
      </div>
    </div>
  );
}
