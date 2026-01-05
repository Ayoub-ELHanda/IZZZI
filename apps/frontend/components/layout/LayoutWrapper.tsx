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
  const isPricingPage = pathname?.startsWith("/pricing") ?? false;
  const isCheckoutPage = pathname?.startsWith("/checkout") ?? false;
  
  // Hide footer on classes pages, pricing pages when authenticated, and all checkout pages
  const shouldHideFooter = isClassesPage || (isPricingPage && isAuthenticated) || isCheckoutPage;

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
