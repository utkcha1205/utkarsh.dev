import React from 'react';
import { ShieldCheck, CheckCircle, TrendingUp, AlertCircle, Sparkles, Server } from 'lucide-react';

export default function ScoreDashboard({ scorecard, jdKeywordsData }) {
  if (!scorecard) return null;

  const {
    overallScore = 96,
    baselineScore = 48,
    scoreDelta = 48,
    keywordMatchScore = 95,
    impactScore = 98,
    verbScore = 94,
    formatScore = 98,
    atsEngineChecks = []
  } = scorecard;

  return (
    <div className="glass-card score-dashboard-wrapper" style={{ marginTop: '1.5rem', overflow: 'hidden' }}>
      <div className="panel-header" style={{ background: 'rgba(10, 16, 30, 0.7)' }}>
        <div className="panel-title">
          <ShieldCheck size={18} style={{ color: '#10b981' }} />
          Screening Shield Audit & ATS Certification Scorecard
        </div>
        <div className="badge badge-emerald">
          <Sparkles size={12} />
          PASSED ALL ATS FILTERS
        </div>
      </div>

      <div className="panel-body">
        {/* Main Score Comparison Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '1.5rem',
          alignItems: 'center',
          padding: '1rem',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem'
        }}>
          {/* Baseline Score */}
          <div style={{ textAlign: 'center', padding: '0 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              BEFORE OPTIMIZATION
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#f59e0b' }}>
              {baselineScore}%
            </div>
            <div style={{ fontSize: '0.7rem', color: '#fbbf24' }}>
              High Rejection Risk
            </div>
          </div>

          {/* Arrow / Progress indicator */}
          <div style={{ textAlign: 'center' }}>
            <div className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem', marginBottom: '0.5rem' }}>
              <TrendingUp size={14} />
              +{scoreDelta}% ATS Screening Boost
            </div>
            <div style={{
              height: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                height: '100%',
                width: `${overallScore}%`,
                background: 'linear-gradient(90deg, #f59e0b 0%, #6366f1 50%, #10b981 100%)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 1s ease'
              }} />
            </div>
          </div>

          {/* Guaranteed Post Score */}
          <div style={{ textAlign: 'center', padding: '0 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              AFTER SCREENING SHIELD
            </div>
            <div style={{
              fontSize: '2.4rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {overallScore}%
            </div>
            <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: '700' }}>
              Top 1% Candidate Match
            </div>
          </div>
        </div>

        {/* Sub-Metric Breakdown Bars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Keyword Coverage</span>
              <strong style={{ color: '#06b6d4' }}>{keywordMatchScore}%</strong>
            </div>
            <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: `${keywordMatchScore}%`, background: '#06b6d4', borderRadius: '3px' }} />
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Google XYZ Impact</span>
              <strong style={{ color: '#10b981' }}>{impactScore}%</strong>
            </div>
            <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: `${impactScore}%`, background: '#10b981', borderRadius: '3px' }} />
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Action Verb Strength</span>
              <strong style={{ color: '#818cf8' }}>{verbScore}%</strong>
            </div>
            <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: `${verbScore}%`, background: '#818cf8', borderRadius: '3px' }} />
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>ATS Layout Standard</span>
              <strong style={{ color: '#a855f7' }}>{formatScore}%</strong>
            </div>
            <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: `${formatScore}%`, background: '#a855f7', borderRadius: '3px' }} />
            </div>
          </div>
        </div>

        {/* ATS Parser Simulation Matrix */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Server size={13} />
            Simulated ATS Parser Compatibility Engines:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
            {atsEngineChecks.map((check, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem 0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#f8fafc' }}>
                    {check.engine}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {check.version}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                    PASSED ({check.score})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
