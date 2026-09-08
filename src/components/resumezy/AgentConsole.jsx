import React from 'react';
import { Terminal, Shield, CheckCircle2, Clock, AlertTriangle, Cpu, ArrowRight } from 'lucide-react';

export default function AgentConsole({
  stages,
  activeStage,
  isRunning,
  logs = []
}) {
  const stageDefs = [
    {
      id: 1,
      name: "LexiScan Agent",
      role: "Job Spec & Keyword Decomposition",
      icon: Cpu,
      color: "#818cf8"
    },
    {
      id: 2,
      name: "ShieldAudit Agent",
      role: "ATS Vulnerability & Gap Detection",
      icon: AlertTriangle,
      color: "#f59e0b"
    },
    {
      id: 3,
      name: "ImpactCraft Agent",
      role: "Google XYZ Bullet Restructuring",
      icon: Shield,
      color: "#06b6d4"
    },
    {
      id: 4,
      name: "ProfileTailor Agent",
      role: "Executive Summary & Skills Rebalance",
      icon: ArrowRight,
      color: "#a855f7"
    },
    {
      id: 5,
      name: "PassGuarantor Agent",
      role: "Cross-ATS Simulation & Certification",
      icon: CheckCircle2,
      color: "#10b981"
    }
  ];

  return (
    <div className="glass-card agent-console-wrapper" style={{ marginTop: '1.5rem', overflow: 'hidden' }}>
      <div className="panel-header" style={{ background: 'rgba(9, 13, 22, 0.9)' }}>
        <div className="panel-title">
          <Terminal size={16} style={{ color: '#818cf8' }} />
          Screening Shield Agent Mission Control
          {isRunning && (
            <span className="badge badge-indigo spin" style={{ marginLeft: '0.5rem', padding: '0.15rem 0.45rem' }}>
              LIVE EXECUTION
            </span>
          )}
        </div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          Autonomous 5-Stage ATS Optimization Pipeline
        </div>
      </div>

      <div className="panel-body" style={{ background: 'rgba(7, 10, 18, 0.95)', padding: '1rem' }}>
        {/* Stage Timeline Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          {stageDefs.map((def) => {
            const stageInfo = stages[def.id] || {};
            const isCompleted = stageInfo.status === 'completed';
            const isInProgress = stageInfo.status === 'in_progress';
            const Icon = def.icon;

            return (
              <div
                key={def.id}
                style={{
                  background: isInProgress
                    ? 'rgba(99, 102, 241, 0.15)'
                    : isCompleted
                    ? 'rgba(16, 185, 129, 0.08)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${
                    isInProgress
                      ? 'rgba(99, 102, 241, 0.6)'
                      : isCompleted
                      ? 'rgba(16, 185, 129, 0.3)'
                      : 'rgba(255, 255, 255, 0.05)'
                  }`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.75rem',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isInProgress ? '0 0 15px rgba(99, 102, 241, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: '700', color: def.color }}>
                    <Icon size={14} className={isInProgress ? 'spin' : ''} />
                    {def.name}
                  </div>
                  <div>
                    {isCompleted ? (
                      <CheckCircle2 size={13} style={{ color: '#10b981' }} />
                    ) : isInProgress ? (
                      <Clock size={13} style={{ color: '#818cf8' }} className="spin" />
                    ) : (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>QUEUED</span>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-secondary)' }}>
                  {def.role}
                </div>
              </div>
            );
          })}
        </div>

        {/* Streaming Logs Window */}
        <div style={{
          background: '#04060b',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '0.75rem 1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          lineHeight: '1.6',
          color: '#cbd5e1',
          maxHeight: '160px',
          overflowY: 'auto'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              &gt; Ready. Click "Shield & Optimize Resume" to initiate the autonomous 5-stage screening engine...
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} style={{ marginBottom: '0.25rem' }}>
                <span style={{ color: '#64748b' }}>[{log.time}]</span>{' '}
                <span style={{ color: log.color || '#818cf8', fontWeight: '600' }}>{log.agent}</span>:{' '}
                <span>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
