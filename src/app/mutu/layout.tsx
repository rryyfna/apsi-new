import RoleDashboardLayout from '@/app/components/RoleDashboardLayout';
import { Home, Database, Target } from 'lucide-react';

export default async function MutuLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: 'Beranda', href: '/mutu', icon: <Home className="w-5 h-5" /> },
    { label: 'Master Data', href: '/mutu/master', icon: <Database className="w-5 h-5" /> },
    { label: 'Monitoring CPL', href: '/mutu/monitoring', icon: <Target className="w-5 h-5" /> },
  ];

  return (
    <RoleDashboardLayout
      navItems={navItems}
      roleTitle="Gugus Mutu"
      fallbackName="Mutu"
    >
      {children}
    </RoleDashboardLayout>
  );
}
