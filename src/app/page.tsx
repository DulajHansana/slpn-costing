'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Costing {
  _id: string;
  date: string;
  itemName: string;
  quantity: number;
  printMachine: string;
  artworkImage: string;
  grandTotal: number;
  cost: number;
  createdAt: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function DashboardPage() {
  const [costings, setCostings] = useState<Costing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/costings')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCostings(d.data); else setError('Failed to load records'); })
      .catch(() => setError('Connection error — check MongoDB config'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = costings.filter((c) =>
    c.itemName.toLowerCase().includes(search.toLowerCase()) ||
    c.printMachine.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = costings.reduce((s, c) => s + c.grandTotal, 0);

  return (
    <div className="container">
      {/* Hero */}
      <section className="hero-section">
        <h1 className="hero-title">
          Print Job <span className="gradient-text">Costings</span>
        </h1>
        <p className="hero-subtitle">
          Manage all your print job cost estimates for SLPN Printers. Create, track and export professional quotes.
        </p>
      </section>

      {/* Stats */}
      {!loading && !error && (
        <div className="stats-strip">
          <div className="stat-card">
            <span className="stat-card-label">Total Records</span>
            <span className="stat-card-value blue">{costings.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Total Revenue</span>
            <span className="stat-card-value gold">{fmt(totalRevenue)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Avg. Job Cost</span>
            <span className="stat-card-value green">
              {costings.length ? fmt(totalRevenue / costings.length) : '0.00'}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Latest Entry</span>
            <span className="stat-card-value" style={{ fontSize: '1rem', paddingTop: 4 }}>
              {costings[0] ? formatDate(costings[0].createdAt) : '—'}
            </span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="page-header">
        <div className="page-header-left">
          <h2 className="page-title">All Costings</h2>
          <p className="page-subtitle">{filtered.length} records found</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="form-input"
              placeholder="Search costings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.2rem', width: '240px' }}
            />
          </div>
          <Link href="/costing/new" className="btn btn-gold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            New Costing
          </Link>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading costings from database…</p>
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 'var(--radius-md)', padding: '1.5rem', color: 'var(--accent-red)',
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
          <div>
            <strong>Database Error</strong><br/>
            <span style={{ fontSize: '0.875rem', color: 'rgba(239,68,68,0.8)' }}>{error}</span><br/>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
              Make sure you&apos;ve set MONGODB_URI with the correct password in <code>.env.local</code>
            </span>
          </div>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🖨️</div>
          <h3 className="empty-state-title">No costings yet</h3>
          <p className="empty-state-text">
            {search ? 'No results match your search.' : 'Create your first print job costing to get started.'}
          </p>
          {!search && (
            <Link href="/costing/new" className="btn btn-gold btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Create First Costing
            </Link>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="dashboard-grid">
          {filtered.map((c) => (
            <CostingCard key={c._id} costing={c} onDelete={(id) => setCostings((prev) => prev.filter((x) => x._id !== id))} />
          ))}
        </div>
      )}
    </div>
  );
}

function CostingCard({ costing, onDelete }: { costing: Costing; onDelete: (id: string) => void }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm(`Delete costing for "${costing.itemName}"?`)) return;
    setDeleting(true);
    await fetch(`/api/costings/${costing._id}`, { method: 'DELETE' });
    onDelete(costing._id);
  };

  return (
    <Link href={`/costing/${costing._id}`} className="costing-card" style={{ opacity: deleting ? 0.5 : 1 }}>
      <div className="costing-card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="costing-card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {costing.itemName}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(costing.createdAt)}</div>
        </div>
        {costing.artworkImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={costing.artworkImage} alt="Artwork" className="costing-card-artwork" />
        ) : (
          <div className="costing-card-artwork-placeholder">🖼️</div>
        )}
      </div>

      <div className="costing-card-body">
        <div className="costing-card-meta">
          <span className="badge badge-blue">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
            {costing.printMachine}
          </span>
          <span className="badge badge-green">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/></svg>
            Qty: {costing.quantity.toLocaleString()}
          </span>
          <span className="badge badge-gold">📅 {costing.date}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Material Cost</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--accent-blue)' }}>
              {fmt(costing.cost)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Grand Total</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--accent-gold)' }}>
              {fmt(costing.grandTotal)}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        padding: '0.75rem 1.5rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
      }}>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          disabled={deleting}
          style={{ zIndex: 1 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6m5 0V4h4v2"/></svg>
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
        <span className="btn btn-ghost btn-sm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          View
        </span>
      </div>
    </Link>
  );
}
