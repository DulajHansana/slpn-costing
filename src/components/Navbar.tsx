'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-brand">
          <div className="brand-logo">SP</div>
          <div>
            <div className="brand-name">SLPN Printers</div>
            <div className="brand-tagline">Costing System</div>
          </div>
        </Link>
        <div className="navbar-actions">
          {pathname !== '/costing/new' && (
            <Link href="/costing/new" className="btn btn-gold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              New Costing
            </Link>
          )}
          {pathname !== '/' && (
            <Link href="/" className="btn btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
