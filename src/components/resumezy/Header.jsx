import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Settings, Sparkles, Printer, ArrowLeft } from 'lucide-react';

export default function Header({
  onOpenSettings,
  onLoadQuickDemo,
  onPrint,
  hasOptimized,
  atsScore
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-section">
          <Link
            href="/"
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', textDecoration: 'none', padding: '0.4rem 0.75rem', borderRadius: '8px' }}
            title="Return to Utkarsh's Portfolio (guidezy.in)"
          >
            <ArrowLeft size={15} />
            <span>guidezy.in</span>
          </Link>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

          <div className="brand-logo-badge" style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' }}>
            <ShieldCheck size={26} strokeWidth={2.4} style={{ color: '#fff' }} />
          </div>
          <div>
            <div className="brand-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Resumezy
              <span className="brand-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                ⚡ ATS Shield AI
              </span>
            </div>
            <div className="brand-subtitle">
              Maxx Your Resume & Slay the ATS • 100% Template-Locked
            </div>
          </div>
        </div>

        <div className="header-actions">
          {atsScore && (
            <div className="badge badge-emerald" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <ShieldCheck size={14} />
              ATS Pass Score: {atsScore}%
            </div>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onLoadQuickDemo}
            title="Load ready-to-test sample resume and target job"
          >
            <Sparkles size={14} style={{ color: '#818cf8' }} />
            Load Sample Demo
          </button>

          {hasOptimized && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onPrint}
              title="Print or Save as ATS-compliant PDF"
            >
              <Printer size={14} />
              Export PDF / Print
            </button>
          )}

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onOpenSettings}
            title="Configure AI Model & Gemini API Key"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
