import RoleDashboardPage from '@/app/components/RoleDashboardPage';

export default function KaprodiDashboard() {
  return (
    <RoleDashboardPage
      title="Dashboard Kaprodi"
      description="Selamat datang di portal Ketua Program Studi. Gunakan menu di sebelah kiri untuk mengatur CPMK dan memantau capaian CPL."
      cpmkLink="/kaprodi/master/cpmk"
      monitoringLink="/kaprodi/monitoring"
    />
  );
}
