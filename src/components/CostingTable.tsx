'use client';

import React from 'react';
import { MATERIAL_ROWS, CATEGORIES, calculateTotal } from '@/lib/costingData';

export interface RowData {
  material: string;
  itemName: string;
  sqInchRate: number | null;
  quantity: number | null;
  unitPrice: number | null;
  total: number;
}

interface CostingTableProps {
  rows: RowData[];
  onChange: (rows: RowData[]) => void;
  readOnly?: boolean;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string; text: string }> = {
  paper: { label: 'Paper & Board', color: 'var(--cat-paper)', text: '#d4a017' },
  plates: { label: 'Plates', color: 'var(--cat-plates)', text: '#c8a000' },
  impression: { label: 'Impression', color: 'var(--cat-impression)', text: '#4da8e0' },
  lamination: { label: 'Lamination & Coating', color: 'var(--cat-lamination)', text: '#52c99a' },
  finishing: { label: 'Finishing', color: 'var(--cat-finishing)', text: '#52c99a' },
  postpress: { label: 'Post-Press', color: 'var(--cat-postpress)', text: '#74d6aa' },
  misc: { label: 'Miscellaneous', color: 'var(--cat-misc)', text: '#95e0be' },
};

function parseNum(v: string): number | null {
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

export default function CostingTable({ rows, onChange, readOnly = false }: CostingTableProps) {
  const updateRow = (index: number, field: keyof RowData, value: string | number | null) => {
    const updated = [...rows];
    const row = { ...updated[index] };
    (row as Record<string, unknown>)[field] = value;
    // Recalculate total
    row.total = calculateTotal(
      field === 'sqInchRate' ? (value as number | null) : row.sqInchRate,
      field === 'quantity' ? (value as number | null) : row.quantity,
      field === 'unitPrice' ? (value as number | null) : row.unitPrice,
    );
    updated[index] = row;
    onChange(updated);
  };

  // Group rows by category
  let lastCategory = '';

  const fmtNum = (n: number | null) => (n === null || n === 0 ? '' : n.toString());
  const fmtTotal = (n: number) => (n === 0 ? '–' : `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

  return (
    <div className="costing-table-wrapper">
      <table className="costing-table">
        <thead>
          <tr>
            <th style={{ width: '180px' }}>Material</th>
            <th>Item Name / Description</th>
            <th className="right" style={{ width: '120px' }}>Sq. Inch Rate</th>
            <th className="right" style={{ width: '110px' }}>Quantity</th>
            <th className="right" style={{ width: '120px' }}>Unit Price</th>
            <th className="right" style={{ width: '130px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {MATERIAL_ROWS.map((matRow, idx) => {
            const row = rows[idx];
            if (!row) return null;
            const catInfo = CATEGORY_LABELS[matRow.category];
            const showHeader = matRow.category !== lastCategory;
            if (showHeader) lastCategory = matRow.category;

            return (
              <React.Fragment key={matRow.id}>
                {showHeader && (
                  <tr key={`cat-${matRow.category}`} className="category-header-row">
                    <td
                      colSpan={6}
                      style={{
                        background: catInfo.color,
                        color: catInfo.text,
                        borderLeft: `3px solid ${catInfo.text}`,
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {catInfo.label}
                    </td>
                  </tr>
                )}
                <tr key={matRow.id} style={{ background: catInfo.color }}>
                  {/* Material label */}
                  <td>
                    <span style={{
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      color: catInfo.text,
                      letterSpacing: '0.02em',
                    }}>
                      {matRow.material}
                    </span>
                  </td>

                  {/* Item Name */}
                  <td>
                    {readOnly ? (
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.83rem' }}>{row.itemName || '–'}</span>
                    ) : (
                      <input
                        type="text"
                        className="table-input"
                        value={row.itemName}
                        onChange={(e) => updateRow(idx, 'itemName', e.target.value)}
                        placeholder="Enter item name..."
                      />
                    )}
                  </td>

                  {/* Sq Inch Rate */}
                  <td style={{ textAlign: 'right' }}>
                    {readOnly ? (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>{fmtNum(row.sqInchRate) || '–'}</span>
                    ) : (
                      <input
                        type="number"
                        className="table-input"
                        style={{ textAlign: 'right' }}
                        value={fmtNum(row.sqInchRate)}
                        onChange={(e) => updateRow(idx, 'sqInchRate', parseNum(e.target.value))}
                        placeholder="0"
                        step="0.001"
                        min="0"
                      />
                    )}
                  </td>

                  {/* Quantity */}
                  <td style={{ textAlign: 'right' }}>
                    {readOnly ? (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>{fmtNum(row.quantity) || '–'}</span>
                    ) : (
                      <input
                        type="number"
                        className="table-input"
                        style={{ textAlign: 'right' }}
                        value={fmtNum(row.quantity)}
                        onChange={(e) => updateRow(idx, 'quantity', parseNum(e.target.value))}
                        placeholder="0"
                        min="0"
                      />
                    )}
                  </td>

                  {/* Unit Price */}
                  <td style={{ textAlign: 'right' }}>
                    {readOnly ? (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>{fmtNum(row.unitPrice) || '–'}</span>
                    ) : (
                      <input
                        type="number"
                        className="table-input"
                        style={{ textAlign: 'right' }}
                        value={fmtNum(row.unitPrice)}
                        onChange={(e) => updateRow(idx, 'unitPrice', parseNum(e.target.value))}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    )}
                  </td>

                  {/* Total */}
                  <td className="total-cell">
                    {fmtTotal(row.total)}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
