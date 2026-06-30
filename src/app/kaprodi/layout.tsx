import RoleDashboardLayout from '@/app/components/RoleDashboardLayout';
import { Home, Database, Target } from 'lucide-react';

export default async function KaprodiLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: 'Beranda', href: '/kaprodi', icon: <Home className="w-5 h-5" /> },
    { label: 'Master Data', href: '/kaprodi/master', icon: <Database className="w-5 h-5" /> },
    { label: 'Monitoring CPL', href: '/kaprodi/monitoring', icon: <Target className="w-5 h-5" /> },
  ];

  return (
    <RoleDashboardLayout
      navItems={navItems}
      roleTitle="Ketua Program Studi"
      fallbackName="Kaprodi"
    >
      {children}
    </RoleDashboardLayout>
  );
}
