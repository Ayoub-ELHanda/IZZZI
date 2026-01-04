'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  
  // Hide header and footer on authenticated pages (account, dashboard, classes, subjects, questionnaires)
  const authenticatedRoutes = ['/account', '/dashboard', '/classes', '/subjects', '/questionnaires'];
  const shouldHideLayout = authenticatedRoutes.some(route => pathname?.startsWith(route));
  
  // For pricing pages, hide header/footer only if user is authenticated
  const isPricingPage = pathname?.startsWith('/pricing');
  const shouldHideLayoutForPricing = isPricingPage && isAuthenticated;

  if (shouldHideLayout || shouldHideLayoutForPricing) {
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
