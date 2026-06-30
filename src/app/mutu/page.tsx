import RoleDashboardPage from '@/app/components/RoleDashboardPage';

export default function MutuDashboard() {
  return (
    <RoleDashboardPage
      title="Dashboard Gugus Mutu"
      description="Selamat datang di portal Gugus Mutu. Gunakan menu di sebelah kiri untuk mengatur CPMK dan memantau capaian CPL."
      cpmkLink="/mutu/master/cpmk"
      monitoringLink="/mutu/monitoring"
    />
  );
}
