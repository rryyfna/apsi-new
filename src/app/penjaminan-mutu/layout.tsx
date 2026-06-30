import RoleDashboardLayout from '@/app/components/RoleDashboardLayout';
import { Home, Database, Target } from 'lucide-react';

export default async function PenjaminanMutuLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: 'Beranda', href: '/penjaminan-mutu', icon: <Home className="w-5 h-5" /> },
    { label: 'Master Data', href: '/penjaminan-mutu/master', icon: <Database className="w-5 h-5" /> },
    { label: 'Monitoring CPL', href: '/penjaminan-mutu/monitoring', icon: <Target className="w-5 h-5" /> },
  ];

  return (
    <RoleDashboardLayout
      navItems={navItems}
      roleTitle="Tim Penjaminan Mutu"
      fallbackName="Penjaminan Mutu"
    >
      {children}
    </RoleDashboardLayout>
  );
}
