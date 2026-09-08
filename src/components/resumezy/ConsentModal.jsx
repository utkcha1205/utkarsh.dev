import React, { useState } from 'react';
import { Lock, Unlock, Check, X, ShieldAlert, Sparkles, ArrowRight, CheckCircle2, Sliders, AlertCircle } from 'lucide-react';

export default function ConsentModal({
  isOpen,
  onClose,
  proposedChanges = [],
  lockTemplate = true,
  onToggleLockTemplate,
  onApplyChanges,
  baselineScore = 48,
  projectedScore = 96
}) {
  const [changes, setChanges] = useState(proposedChanges);
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");

  if (!isOpen) return null;

  const handleStatusChange = (id, newStatus) => {
    setChanges(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleApproveAll = () => {
    setChanges(prev => prev.map(c => ({ ...c, status: 'accepted' })));
  };

  const handleRejectAll = () => {
    setChanges(prev => prev.map(c => ({ ...c, status: 'rejected' })));
  };

  const handleStartEdit = (change) => {
    setEditingId(change.id);
    setEditedText(change.proposedContent);
  };

  const handleSaveEdit = (id) => {
    setChanges(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          proposedContent: editedText,
          proposedRaw: `${c.originalRaw.charAt(0)} ${editedText}`,
          status: 'accepted'
        };
      }
      return c;
    }));
    setEditingId(null);
  };

  const approvedCount = changes.filter(c => c.status === 'accepted').length;

  const handleFinalApply = () => {
    onApplyChanges(changes);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(3, 5, 11, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.25rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '860px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(14, 20, 36, 0.98)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div className="panel-header" style={{ borderBottom: '1px solid var(--border-subtle)', padding: '1rem 1.5rem' }}>
          <div>
            <div className="panel-title" style={{ fontSize: '1.1rem' }}>
              <Lock size={18} style={{ color: '#10b981' }} />
              Template Lock & Change Consent Center
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Every proposed optimization requires your explicit consent. Your resume template remains 100% locked.
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Template Lock Status Banner */}
        <div style={{
          background: lockTemplate ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
          borderBottom: `1px solid ${lockTemplate ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {lockTemplate ? (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <Lock size={15} />
              </div>
            ) : (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                <Unlock size={15} />
              </div>
            )}
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: '700', color: lockTemplate ? '#34d399' : '#fbbf24' }}>
                {lockTemplate ? 'Strict Template Lock: ACTIVE' : 'Template Restructuring: UNLOCKED'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {lockTemplate
                  ? 'Your original template, headers, font layout, and section ordering will NOT be changed.'
                  : 'Allows AI to reorganize sections and format for high ATS density.'}
              </div>
            </div>
          </div>

          {/* Toggle Lock Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
            onClick={onToggleLockTemplate}
          >
            {lockTemplate ? 'Unlock Template Reformatting' : 'Lock Exact Template'}
          </button>
        </div>

        {/* Action Controls & Approval Counter */}
        <div style={{
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 16, 30, 0.5)'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <strong>{approvedCount}</strong> of <strong>{changes.length}</strong> optimizations approved
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleApproveAll}
            >
              <Check size={13} style={{ color: '#10b981' }} />
              Approve All
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleRejectAll}
            >
              <X size={13} style={{ color: '#f43f5e' }} />
              Reject All (Keep Original)
            </button>
          </div>
        </div>

        {/* Change List (Scrollable) */}
        <div style={{
          padding: '1.25rem 1.5rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {changes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No proposed bullet changes pending.
            </div>
          ) : (
            changes.map((change, idx) => {
              const isAccepted = change.status === 'accepted';
              const isRejected = change.status === 'rejected';
              const isEditing = editingId === change.id;

              return (
                <div
                  key={change.id}
                  style={{
                    background: 'rgba(18, 26, 47, 0.7)',
                    border: `1px solid ${
                      isAccepted
                        ? 'rgba(16, 185, 129, 0.4)'
                        : isRejected
                        ? 'rgba(244, 63, 94, 0.3)'
                        : 'var(--border-subtle)'
                    }`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Top Bar with Context and Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-indigo" style={{ fontSize: '0.675rem' }}>
                        {change.section}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Item #{idx + 1}
                      </span>
                      {isAccepted && (
                        <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                          <Check size={10} /> APPROVED
                        </span>
                      )}
                      {isRejected && (
                        <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>
                          <X size={10} /> KEEP ORIGINAL
                        </span>
                      )}
                    </div>

                    {/* Decision Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${isAccepted ? 'btn-success' : 'btn-secondary'}`}
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.725rem' }}
                        onClick={() => handleStatusChange(change.id, 'accepted')}
                      >
                        <Check size={12} />
                        Consent & Apply
                      </button>

                      <button
                        type="button"
                        className={`btn btn-sm ${isRejected ? 'btn-secondary' : 'btn-ghost'}`}
                        style={{
                          padding: '0.25rem 0.6rem',
                          fontSize: '0.725rem',
                          color: isRejected ? '#fb7185' : 'var(--text-muted)',
                          borderColor: isRejected ? '#f43f5e' : 'transparent'
                        }}
                        onClick={() => handleStatusChange(change.id, 'rejected')}
                      >
                        <X size={12} />
                        Keep Original
                      </button>

                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }}
                        onClick={() => handleStartEdit(change)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Original Text */}
                  <div style={{
                    background: 'rgba(244, 63, 94, 0.05)',
                    borderLeft: '3px solid rgba(244, 63, 94, 0.5)',
                    borderRadius: '0 4px 4px 0',
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.775rem',
                    color: '#fda4af',
                    marginBottom: '0.6rem'
                  }}>
                    <strong style={{ fontSize: '0.65rem', color: '#fb7185', display: 'block', marginBottom: '0.15rem' }}>
                      YOUR CURRENT RESUME TEXT:
                    </strong>
                    {change.originalContent}
                  </div>

                  {/* Proposed Upgrade / Edit Field */}
                  {isEditing ? (
                    <div style={{ marginTop: '0.5rem' }}>
                      <textarea
                        className="custom-textarea"
                        rows={3}
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        style={{ fontSize: '0.8rem' }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSaveEdit(change.id)}
                        >
                          Save & Approve
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.06)',
                      borderLeft: '3px solid #10b981',
                      borderRadius: '0 4px 4px 0',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8rem',
                      color: '#a7f3d0',
                      lineHeight: '1.45'
                    }}>
                      <strong style={{ fontSize: '0.65rem', color: '#34d399', display: 'block', marginBottom: '0.15rem' }}>
                        PROPOSED HIGH-IMPACT REWRITE (GOOGLE XYZ FORMULA):
                      </strong>
                      {change.proposedContent}
                    </div>
                  )}

                  {/* Injected Keywords Tags */}
                  {change.injectedKeywords?.length > 0 && (
                    <div style={{ marginTop: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Target Keywords Injected:</span>
                      {change.injectedKeywords.map((kw, ki) => (
                        <span key={ki} className="badge badge-indigo" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                          +{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(10, 16, 30, 0.9)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🔒 <strong>Zero Surprise Policy</strong>: Only the {approvedCount} items you consented to will be updated.
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success btn-md"
              onClick={handleFinalApply}
            >
              <Check size={16} />
              Apply {approvedCount} Consented Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
