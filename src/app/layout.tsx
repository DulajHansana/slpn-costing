import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SLPN Printers — Costing System',
  description: 'Professional print job costing system for SLPN Printers. Calculate material costs, impressions, lamination, finishing and more.',
  keywords: 'printing, costing, SLPN Printers, print job cost calculator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="page-wrapper">
          <Navbar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
