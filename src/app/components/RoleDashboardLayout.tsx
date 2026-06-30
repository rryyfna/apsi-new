import { headers } from 'next/headers';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import { db } from '@/lib/db';

/**
 * Shared layout for role-based dashboards (Kaprodi, Mutu, etc.)
 * 
 * Why this exists: Kaprodi and Mutu had 100% identical layout code
 * with only navItems and roleTitle differing. This shared component
 * eliminates that duplication while keeping the directory-based routing
 * Next.js requires.
 */

interface RoleDashboardLayoutProps {
  children: React.ReactNode;
  navItems: {
    label: string;
    href: string;
    icon: React.ReactNode;
  }[];
  roleTitle: string;
  fallbackName: string;
}

export default async function RoleDashboardLayout({
  children,
  navItems,
  roleTitle,
  fallbackName,
}: RoleDashboardLayoutProps) {
  const headersList = await headers();
  const userId = headersList.get('x-user-id') || '';

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        navItems={navItems}
        roleTitle={roleTitle}
        userName={user?.name || fallbackName}
      />
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <Topbar />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
