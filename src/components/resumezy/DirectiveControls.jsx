import React from 'react';
import { Sliders, Award, Zap, FileSpreadsheet, PlusCircle } from 'lucide-react';

export default function DirectiveControls({
  directives,
  onChangeDirectives
}) {
  const quickPillSuggestions = [
    "Focus on AWS & Cloud Architecture",
    "Quantify with $ cost savings & ROI",
    "Emphasize Kafka & Event-Driven systems",
    "Highlight Mentorship & Team Leadership",
    "Downplay frontend, highlight high-throughput backend",
    "Emphasize zero-downtime database migration"
  ];

  const handleAddPill = (text) => {
    const currentPrompt = directives.customPrompt || "";
    if (currentPrompt.includes(text)) return;
    const newPrompt = currentPrompt ? `${currentPrompt}. ${text}` : text;
    onChangeDirectives({ ...directives, customPrompt: newPrompt });
  };

  return (
    <div className="directive-controls" style={{ marginTop: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        {/* Seniority Selector */}
        <div>
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={14} style={{ color: '#818cf8' }} /> Seniority Level
            </span>
          </label>
          <select
            className="custom-input"
            value={directives.seniority || "senior"}
            onChange={(e) => onChangeDirectives({ ...directives, seniority: e.target.value })}
          >
            <option value="lead">Staff / Principal / Lead Engineer</option>
            <option value="senior">Senior Engineer (5+ years)</option>
            <option value="mid">Mid-Level Engineer (2-5 years)</option>
          </select>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={14} style={{ color: '#06b6d4' }} /> Tone & Optimization Style
            </span>
          </label>
          <select
            className="custom-input"
            value={directives.tone || "impact"}
            onChange={(e) => onChangeDirectives({ ...directives, tone: e.target.value })}
          >
            <option value="impact">High Impact & Metrics (Google XYZ Formula)</option>
            <option value="technical">Technical & Distributed Systems Deep-Dive</option>
            <option value="executive">Executive, Strategic & Cross-Functional</option>
          </select>
        </div>

        {/* Length Constraint */}
        <div>
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FileSpreadsheet size={14} style={{ color: '#10b981' }} /> Target Page Format
            </span>
          </label>
          <select
            className="custom-input"
            value={directives.targetLength || "1page"}
            onChange={(e) => onChangeDirectives({ ...directives, targetLength: e.target.value })}
          >
            <option value="1page">Strict 1-Page Compact (Recommended for ATS)</option>
            <option value="2page">Detailed 2-Page (Senior / Comprehensive)</option>
          </select>
        </div>
      </div>

      {/* Freeform custom input */}
      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
        <label className="form-label">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sliders size={14} style={{ color: '#fbbf24' }} />
            Additional Custom Directives & Constraints
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Tell the agent specific achievements to highlight
          </span>
        </label>
        <textarea
          className="custom-textarea"
          rows={2}
          placeholder="e.g. Highlight my experience migrating monoliths to Kubernetes, cut cloud costs by 35%, and emphasize distributed tracing..."
          value={directives.customPrompt || ""}
          onChange={(e) => onChangeDirectives({ ...directives, customPrompt: e.target.value })}
        />
      </div>

      {/* Quick suggestions pills */}
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
          Quick Suggestion Pills:
        </div>
        <div className="preset-chips">
          {quickPillSuggestions.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              className="chip"
              onClick={() => handleAddPill(pill)}
            >
              <PlusCircle size={11} style={{ color: '#818cf8' }} />
              {pill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
