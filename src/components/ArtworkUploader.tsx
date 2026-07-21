'use client';
import { useRef, useState } from 'react';

interface ArtworkUploaderProps {
  value: string; // base64
  onChange: (base64: string) => void;
}

export default function ArtworkUploader({ value, onChange }: ArtworkUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {value ? (
        <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Artwork preview" className="artwork-preview" />
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              position: 'absolute', top: 8, right: 8,
              background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius-sm)', color: 'white', cursor: 'pointer',
              padding: '4px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            Remove
          </button>
        </div>
      ) : (
        <label
          className={`artwork-uploader${dragOver ? ' drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <div style={{ fontSize: '2.5rem' }}>🖼️</div>
          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Drop artwork here</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or click to browse — PNG, JPG, PDF preview</div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => inputRef.current?.click()}
            style={{ pointerEvents: 'none' }}
          >Browse File</button>
        </label>
      )}
    </div>
  );
}
