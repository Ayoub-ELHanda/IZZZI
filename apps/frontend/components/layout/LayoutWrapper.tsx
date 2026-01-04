"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AuthProvider } from "../providers/AuthProvider";
import { useAuth } from "@/hooks/useAuth";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  
  const isAuthPage = pathname?.startsWith("/auth");
  const isClassesPage = pathname?.startsWith("/classes") || pathname?.startsWith("/create-class");
  const isPricingPage = pathname?.startsWith("/pricing");
  
  // Hide footer on classes pages and pricing pages when authenticated
  const shouldHideFooter = isClassesPage || (isPricingPage && isAuthenticated);

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
