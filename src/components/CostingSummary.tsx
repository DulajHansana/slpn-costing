'use client';

interface CostingSummaryProps {
  rows: { total: number }[];
  secondCost: number;
  onSecondCostChange?: (val: number) => void;
  readOnly?: boolean;
}

export default function CostingSummary({ rows, secondCost, onSecondCostChange, readOnly = false }: CostingSummaryProps) {
  const cost = rows.reduce((sum, r) => sum + r.total, 0);
  const grandTotal = cost + secondCost;

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{
      background: 'linear-gradient(135deg, #04080f, #08112a)',
      border: '1px solid rgba(59,130,246,0.2)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginTop: '1.5rem',
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(59,130,246,0.08)',
        borderBottom: '1px solid rgba(59,130,246,0.15)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Cost Summary
        </span>
      </div>

      {/* Summary rows */}
      <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Material Cost */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Material Cost</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sum of all material rows</div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.6rem', color: 'var(--accent-blue)' }}>
            {fmt(cost)}
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--border)' }} />

        {/* Second Cost */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Additional Cost</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overhead / extra charges</div>
          </div>
          {readOnly ? (
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--text-secondary)' }}>
              {fmt(secondCost)}
            </div>
          ) : (
            <input
              type="number"
              value={secondCost === 0 ? '' : secondCost}
              onChange={(e) => onSecondCostChange?.(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
              style={{
                width: '160px',
                textAlign: 'right',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 600,
                padding: '0.5rem 0.75rem',
                outline: 'none',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--border-active)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          )}
        </div>

        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)' }} />

        {/* Grand Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Grand Total</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Material cost + additional cost</div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--accent-gold)', textShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
            {fmt(grandTotal)}
          </div>
        </div>

        {/* Per unit */}
        {grandTotal > 0 && (
          <div style={{
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.15)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.6rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ℹ️ Grand total displayed above</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-gold)' }}>
              Total: {fmt(grandTotal)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
