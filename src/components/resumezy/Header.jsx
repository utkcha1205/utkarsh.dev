import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Settings, Sparkles, Printer, ArrowLeft, Crown } from 'lucide-react';

export default function Header({
  onOpenSettings,
  onLoadQuickDemo,
  onPrint,
  hasOptimized,
  atsScore,
  isPro,
  onOpenSubscription
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
            className="btn btn-sm"
            onClick={onOpenSubscription}
            title={isPro ? "Pro Plan Active (Watermark Removed)" : "Subscribe for fee to remove watermark"}
            style={{
              background: isPro
                ? 'rgba(16, 185, 129, 0.15)'
                : 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)',
              border: isPro ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(168, 85, 247, 0.4)',
              color: isPro ? '#34d399' : '#e9d5ff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600
            }}
          >
            <Crown size={14} style={{ color: isPro ? '#34d399' : '#c084fc' }} />
            <span>{isPro ? '👑 Pro Active' : '⚡ Pro Plan'}</span>
          </button>

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
