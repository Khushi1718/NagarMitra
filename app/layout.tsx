import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InteractiveMenu } from "@/components/ui/modern-mobile-menu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nagar Mitra",
  description: "Smart City Solutions Platform",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nagar Mitra'
  },
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mobile-optimized`}
      >
        <div className="app-container">
          <main className="main-content">
            {children}
          </main>
          <div className="mobile-menu-container">
            <InteractiveMenu />
          </div>
        </div>
      </body>
    </html>
  );
}
