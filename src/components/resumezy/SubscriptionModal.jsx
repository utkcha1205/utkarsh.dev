import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, ShieldCheck, Zap, Lock, Unlock, ArrowRight } from 'lucide-react';

export default function SubscriptionModal({
  isOpen,
  onClose,
  isPro,
  onTogglePro
}) {
  const [selectedPlan, setSelectedPlan] = useState('annual'); // 'monthly' | 'annual'
  const [activationSuccess, setActivationSuccess] = useState(false);

  if (!isOpen) return null;

  const handleActivate = () => {
    onTogglePro(true);
    setActivationSuccess(true);
    setTimeout(() => {
      setActivationSuccess(false);
      onClose();
    }, 1200);
  };

  const handleDeactivate = () => {
    onTogglePro(false);
    onClose();
  };

  return (
    <div
      className="no-print"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(4, 6, 14, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '560px',
          width: '100%',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(168, 85, 247, 0.25)',
          overflow: 'hidden',
          animation: 'modalSlideIn 0.2s ease-out'
        }}
      >
        {/* Modal Header */}
        <div
          className="panel-header"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
            borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
            padding: '1rem 1.25rem'
          }}
        >
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f8fafc' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
              }}
            >
              <Crown size={18} style={{ color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Resumezy Pro
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    background: isPro ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.25)',
                    color: isPro ? '#34d399' : '#c084fc',
                    border: isPro ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(168, 85, 247, 0.4)',
                    fontWeight: 600
                  }}
                >
                  {isPro ? '👑 ACTIVE' : 'PRO UPGRADE'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Export 100% watermark-free, unlimited ATS bullet optimizations
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ color: '#94a3b8', padding: '0.3rem 0.5rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="panel-body" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Pro Benefits */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.6rem',
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.78rem', color: '#e2e8f0' }}>
              <Check size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
              <span><strong>100% Watermark-Free:</strong> Zero tags or branding on PDF exports</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.78rem', color: '#e2e8f0' }}>
              <Check size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
              <span><strong>LaTeX / Overleaf:</strong> Exact 0.4in margins & Computer Modern font</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.78rem', color: '#e2e8f0' }}>
              <Check size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Unlimited AI Rewrites:</strong> Priority Gemini 2.0 Flash generation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.78rem', color: '#e2e8f0' }}>
              <Check size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
              <span><strong>ATS Keyword Targeting:</strong> Deep job match & skill injection</span>
            </div>
          </div>

          {/* Pricing Plan Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {/* Monthly Plan */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              style={{
                cursor: 'pointer',
                padding: '0.9rem',
                borderRadius: '8px',
                border: selectedPlan === 'monthly' ? '2px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedPlan === 'monthly' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(30, 41, 59, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>Monthly Pro</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Billed monthly</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                $9 <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94a3b8' }}>/ month</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                Cancel anytime • Instant access
              </div>
            </div>

            {/* Annual Plan (Best Value) */}
            <div
              onClick={() => setSelectedPlan('annual')}
              style={{
                cursor: 'pointer',
                padding: '0.9rem',
                borderRadius: '8px',
                border: selectedPlan === 'annual' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedPlan === 'annual' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(30, 41, 59, 0.3)',
                position: 'relative',
                transition: 'all 0.15s ease'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  color: '#fff',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '10px',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)'
                }}
              >
                SAVE 55% • POPULAR
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>Annual Pro</span>
                <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>$4.08/mo</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                $49 <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94a3b8' }}>/ year</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                Unlimited exports for 12 months
              </div>
            </div>
          </div>

          {/* Action Button */}
          {activationSuccess ? (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                padding: '0.75rem',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#34d399',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Sparkles size={16} />
              Pro Activated! Watermark removed from PDF exports.
            </div>
          ) : isPro ? (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <div
                style={{
                  flex: 1,
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  color: '#34d399',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Crown size={16} />
                <span>You have <strong>Pro Active</strong> (Watermark is removed)</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleDeactivate}
                title="Switch to Free tier to preview with watermark"
                style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              >
                Switch to Free Mode
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleActivate}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.35)'
                }}
              >
                <Crown size={16} />
                <span>Unlock Pro & Remove Watermark ({selectedPlan === 'annual' ? '$49/yr' : '$9/mo'})</span>
                <ArrowRight size={14} />
              </button>
              <div style={{ fontSize: '0.68rem', color: '#64748b', textAlign: 'center' }}>
                Instant activation • Secure checkout • 100% satisfaction guarantee
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
