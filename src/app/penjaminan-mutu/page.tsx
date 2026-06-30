import RoleDashboardPage from '@/app/components/RoleDashboardPage';

export default function PenjaminanMutuDashboard() {
  return (
    <RoleDashboardPage
      title="Dashboard Penjaminan Mutu"
      description="Selamat datang di portal Tim Penjaminan Mutu. Gunakan menu di sebelah kiri untuk mengatur CPMK dan memantau capaian CPL."
      cpmkLink="/penjaminan-mutu/master/cpmk"
      monitoringLink="/penjaminan-mutu/monitoring"
    />
  );
}
