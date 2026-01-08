import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Mochiy_Pop_One } from "next/font/google";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const mochiyPopOne = Mochiy_Pop_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mochiy",
  display: "swap",
  fallback: ["cursive", "sans-serif"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-poppins",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "IZZZI - Plateforme de recueil d'avis étudiants",
  description: "Collectez et analysez les retours de vos étudiants en temps réel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Mochiy+Pop+One&family=Poppins:wght@400;500;600;700&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${mochiyPopOne.variable} ${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
        <div className="flex flex-col min-h-screen">
          <LayoutWrapper>{children}</LayoutWrapper>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
