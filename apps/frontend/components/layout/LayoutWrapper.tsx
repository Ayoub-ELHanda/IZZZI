"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AuthProvider } from "../providers/AuthProvider";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isClassesPage = pathname?.startsWith("/classes") || pathname?.startsWith("/create-class");

  if (isAuthPage) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <Header />
      <main className="flex-1">{children}</main>
      {!isClassesPage && <Footer />}
    </AuthProvider>
  );
}
