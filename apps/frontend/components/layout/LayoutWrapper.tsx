"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AuthProvider } from "../providers/AuthProvider";
import { useAuth } from "@/hooks/useAuth";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  
  const isAuthPage = pathname?.startsWith("/auth") ?? false;
  const isClassesPage = (pathname?.startsWith("/classes") || pathname?.startsWith("/create-class")) ?? false;
  const isAccountPage = pathname?.startsWith("/account") ?? false;
  const isDashboardPage = pathname?.startsWith("/dashboard") ?? false;
  const isRetoursPage = pathname?.startsWith("/retours") ?? false;
  const isPricingPage = pathname?.startsWith("/pricing") ?? false;
  const isCheckoutPage = pathname?.startsWith("/checkout") ?? false;
  
  // Pages où le footer doit être masqué
  const shouldHideFooter = isAuthPage || isClassesPage || isAccountPage || isDashboardPage || isRetoursPage || (isPricingPage && isAuthenticated) || isCheckoutPage;

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      {!shouldHideFooter && <Footer />}
    </>
  );
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
