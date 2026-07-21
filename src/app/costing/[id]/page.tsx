'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CostingTable, { RowData } from '@/components/CostingTable';
import CostingSummary from '@/components/CostingSummary';
import ArtworkUploader from '@/components/ArtworkUploader';
import { PRINT_MACHINES } from '@/lib/costingData';

interface CostingData {
  _id: string;
  date: string;
  itemName: string;
  quantity: number;
  printMachine: string;
  artworkImage: string;
  rows: RowData[];
  cost: number;
  secondCost: number;
  grandTotal: number;
  createdAt: string;
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function CostingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [costing, setCosting] = useState<CostingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Edit state
  const [date, setDate] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [printMachine, setPrintMachine] = useState('');
  const [artworkImage, setArtworkImage] = useState('');
  const [rows, setRows] = useState<RowData[]>([]);
  const [secondCost, setSecondCost] = useState(0);

  useEffect(() => {
    fetch(`/api/costings/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setCosting(d.data);
          loadIntoEdit(d.data);
        } else setError('Record not found');
      })
      .catch(() => setError('Failed to load costing'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function loadIntoEdit(c: CostingData) {
    setDate(c.date);
    setItemName(c.itemName);
    setQuantity(c.quantity);
    setPrintMachine(c.printMachine);
    setArtworkImage(c.artworkImage);
    setRows(c.rows);
    setSecondCost(c.secondCost);
  }

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    const cost = rows.reduce((s, r) => s + r.total, 0);
    const grandTotal = cost + secondCost;
    try {
      const res = await fetch(`/api/costings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, itemName, quantity, printMachine, artworkImage, rows, cost, secondCost, grandTotal }),
      });
      const data = await res.json();
      if (data.success) {
        setCosting(data.data);
        setEditing(false);
        showToast('success', 'Costing updated successfully!');
      } else {
        showToast('error', data.error || 'Update failed');
      }
    } catch {
      showToast('error', 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Permanently delete costing for "${costing?.itemName}"?`)) return;
    await fetch(`/api/costings/${id}`, { method: 'DELETE' });
    router.push('/');
  };

  const handlePrint = () => window.print();

  const handleCancelEdit = () => {
    if (costing) loadIntoEdit(costing);
    setEditing(false);
  };

  if (loading) return (
    <div className="container">
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading costing record…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-4">
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
        <h3 style={{ color: 'var(--accent-red)', marginBottom: '0.5rem' }}>Not Found</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
        <button className="btn btn-ghost" onClick={() => router.push('/')}>← Back to Dashboard</button>
      </div>
    </div>
  );

  if (!costing) return null;

  const displayCost = editing ? rows.reduce((s, r) => s + r.total, 0) : costing.cost;
  const displayGrand = editing ? displayCost + secondCost : costing.grandTotal;

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header mt-3">
        <div className="page-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => router.push('/')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
              Dashboard
            </button>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Costing Detail</span>
          </div>
          <h1 className="page-title">{editing ? itemName || 'Editing…' : costing.itemName}</h1>
          <p className="page-subtitle">Created {formatDate(costing.createdAt)}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {!editing ? (
            <>
              <button className="btn btn-ghost" onClick={handlePrint}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6m5 0V4h4v2"/></svg>
                Delete
              </button>
              <button className="btn btn-primary" onClick={() => setEditing(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={handleCancelEdit}>Cancel</button>
              <button className="btn btn-gold btn-lg" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : '💾 Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Job Info Card */}
      <div className="card mb-3">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-blue)' }}>Job Information</h3>
          {!editing && <span className="badge badge-green" style={{ marginLeft: 'auto' }}>✓ Saved</span>}
        </div>

        {editing ? (
          <>
            <div className="grid-4">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Item Name</label>
                <input type="text" className="form-input" value={itemName} onChange={(e) => setItemName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input type="number" className="form-input" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
              </div>
            </div>
            <div className="grid-2 mt-2">
              <div className="form-group">
                <label className="form-label">Print Machine</label>
                <select className="form-select" value={printMachine} onChange={(e) => setPrintMachine(e.target.value)}>
                  {PRINT_MACHINES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Artwork</label>
                <ArtworkUploader value={artworkImage} onChange={setArtworkImage} />
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
            {/* Details */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div className="grid-2" style={{ gap: '1rem' }}>
                {[
                  { label: 'Date', value: costing.date },
                  { label: 'Quantity', value: costing.quantity.toLocaleString() },
                  { label: 'Print Machine', value: costing.printMachine },
                  { label: 'Material Cost', value: fmt(costing.cost) },
                  { label: 'Additional Cost', value: fmt(costing.secondCost) },
                  { label: 'Grand Total', value: fmt(costing.grandTotal) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="form-label">{label}</div>
                    <div style={{ fontWeight: 600, color: label.includes('Total') || label.includes('Cost') ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Artwork */}
            {costing.artworkImage && (
              <div style={{ flexShrink: 0 }}>
                <div className="form-label mb-2" style={{ marginBottom: '0.5rem' }}>Artwork</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={costing.artworkImage} alt="Artwork" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', objectFit: 'contain' }} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Costing Table */}
      <div className="card mb-3">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)' }}>Material Cost Breakdown</h3>
        </div>
        <CostingTable
          rows={editing ? rows : costing.rows}
          onChange={setRows}
          readOnly={!editing}
        />
      </div>

      {/* Summary */}
      <CostingSummary
        rows={editing ? rows : costing.rows}
        secondCost={editing ? secondCost : costing.secondCost}
        onSecondCostChange={setSecondCost}
        readOnly={!editing}
      />

      <div style={{ height: '3rem' }} />

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
