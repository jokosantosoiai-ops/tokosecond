import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // Import komponen Script dari Next.js
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Update Metadata agar lebih profesional untuk SEO
export const metadata: Metadata = {
  title: "TokoSecond - Bekasnya Kamu, Rezekinya Orang",
  description: "Marketplace barang bekas terpercaya dengan sistem Rekening Bersama (Escrow) yang aman dan berkah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id" // Ubah ke "id" karena target pasar Indonesia
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Memasukkan SDK Midtrans Snap secara Global. 
          Gunakan URL Sandbox untuk tahap testing/pengembangan.
        */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer Sederhana & Bersih */}
        <footer className="py-6 text-center text-xs text-gray-400 border-t bg-white">
          © {new Date().getFullYear()} TokoSecond.com — Klik, Jual, Berkah!
        </footer>
      </body>
    </html>
  );
}