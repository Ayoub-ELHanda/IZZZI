'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide header and footer on authenticated pages (account, dashboard, classes, subjects, questionnaires)
  const authenticatedRoutes = ['/account', '/dashboard', '/classes', '/subjects', '/questionnaires'];
  const shouldHideLayout = authenticatedRoutes.some(route => pathname?.startsWith(route));

  if (shouldHideLayout) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

