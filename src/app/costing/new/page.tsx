'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArtworkUploader from '@/components/ArtworkUploader';
import CostingTable, { RowData } from '@/components/CostingTable';
import CostingSummary from '@/components/CostingSummary';
import { createDefaultRows, PRINT_MACHINES } from '@/lib/costingData';

function today() {
  return new Date().toISOString().split('T')[0];
}

export default function NewCostingPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Header fields
  const [date, setDate] = useState(today());
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [printMachine, setPrintMachine] = useState('');

  // Artwork
  const [artworkImage, setArtworkImage] = useState('');

  // Material rows
  const [rows, setRows] = useState<RowData[]>(createDefaultRows());

  // Additional cost
  const [secondCost, setSecondCost] = useState(0);

  const cost = rows.reduce((s, r) => s + r.total, 0);
  const grandTotal = cost + secondCost;

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    if (!itemName.trim()) { showToast('error', 'Please enter an Item Name'); return; }
    if (!quantity) { showToast('error', 'Please enter a Quantity'); return; }
    if (!printMachine) { showToast('error', 'Please select a Print Machine'); return; }

    setSaving(true);
    try {
      const res = await fetch('/api/costings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date, itemName, quantity: Number(quantity), printMachine,
          artworkImage, rows, cost, secondCost, grandTotal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Costing saved successfully!');
        setTimeout(() => router.push(`/costing/${data.data._id}`), 1200);
      } else {
        showToast('error', data.error || 'Failed to save');
      }
    } catch {
      showToast('error', 'Network error — check your connection');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header mt-3">
        <div className="page-header-left">
          <h1 className="page-title">New Costing Sheet</h1>
          <p className="page-subtitle">Fill in the details below to create a new print job cost estimate</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-ghost" onClick={() => router.push('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
            Cancel
          </button>
          <button className="btn btn-gold btn-lg" onClick={handleSave} disabled={saving}>
            {saving ? (
              <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Costing</>
            )}
          </button>
        </div>
      </div>

      {/* Header Info Card */}
      <div className="card mb-3">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-blue)' }}>Job Information</h3>
        </div>

        <div className="grid-4">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Item Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Business Card, Brochure A4..."
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Quantity *</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 2000"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
              min="1"
            />
          </div>
        </div>

        <div className="grid-2 mt-2">
          <div className="form-group">
            <label className="form-label">Print Machine *</label>
            <select className="form-select" value={printMachine} onChange={(e) => setPrintMachine(e.target.value)}>
              <option value="">— Select machine —</option>
              {PRINT_MACHINES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Artwork / Design File</label>
            <ArtworkUploader value={artworkImage} onChange={setArtworkImage} />
          </div>
        </div>
      </div>

      {/* Costing Table */}
      <div className="card mb-3">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)' }}>Material Cost Breakdown</h3>
          <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Enter prices manually for each applicable material
          </span>
        </div>
        <CostingTable rows={rows} onChange={setRows} />
      </div>

      {/* Summary */}
      <CostingSummary rows={rows} secondCost={secondCost} onSecondCostChange={setSecondCost} />

      {/* Save button bottom */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', paddingBottom: '2rem' }}>
        <button className="btn btn-ghost" onClick={() => router.push('/')}>Cancel</button>
        <button className="btn btn-gold btn-lg" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : '💾 Save Costing'}
        </button>
      </div>

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
