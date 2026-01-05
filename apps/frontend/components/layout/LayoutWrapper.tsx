"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AuthProvider } from "../providers/AuthProvider";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth") ?? false;
  const isClassesPage = (pathname?.startsWith("/classes") || pathname?.startsWith("/create-class")) ?? false;
  const isAccountPage = pathname?.startsWith("/account") ?? false;
  const isDashboardPage = pathname?.startsWith("/dashboard") ?? false;
  const isRetoursPage = pathname?.startsWith("/retours") ?? false;

  // Pages où le footer doit être masqué
  const shouldHideFooter = isAuthPage || isClassesPage || isAccountPage || isDashboardPage || isRetoursPage;

  if (isAuthPage) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <Header />
      <main className="flex-1">{children}</main>
      {!shouldHideFooter && <Footer />}
    </AuthProvider>
  );
}
