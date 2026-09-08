import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function DiffViewer({ bulletChanges = [] }) {
  if (bulletChanges.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
        <Sparkles size={32} style={{ color: '#818cf8', marginBottom: '0.75rem', opacity: 0.6 }} />
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
          No Bullet Points Transformed Yet
        </div>
        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
          Run the Screening Shield Agent to see before-and-after XYZ impact transformations.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
        Transformed <strong>{bulletChanges.length}</strong> bullet points applying Google's XYZ formula (<em>Accomplished [X] as measured by [Y], by doing [Z]</em>):
      </div>

      {bulletChanges.map((change, index) => (
        <div
          key={index}
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            transition: 'border-color 0.2s ease'
          }}
        >
          {/* Change Strategy Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span className="badge badge-emerald" style={{ fontSize: '0.675rem' }}>
              <Sparkles size={11} />
              Google XYZ Formula Upgrade
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Bullet #{index + 1}
            </span>
          </div>

          {/* Original (Before) */}
          <div style={{
            background: 'rgba(244, 63, 94, 0.06)',
            borderLeft: '3px solid #f43f5e',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            padding: '0.5rem 0.75rem',
            marginBottom: '0.65rem',
            fontSize: '0.8rem',
            color: '#fda4af'
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: '#fb7185', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldAlert size={11} />
              Original (Penalized by ATS / Passive)
            </div>
            {change.original}
          </div>

          {/* Upgraded (After) */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            borderLeft: '3px solid #10b981',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            padding: '0.55rem 0.75rem',
            fontSize: '0.825rem',
            color: '#a7f3d0',
            lineHeight: '1.45'
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: '#34d399', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckCircle2 size={11} />
              Shield-Optimized (High Quantified Impact)
            </div>
            {change.upgraded}
          </div>

          {/* Reason */}
          {change.reason && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              💡 {change.reason}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
