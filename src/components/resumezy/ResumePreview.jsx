import React, { useState } from 'react';
import { Copy, Check, Printer, Eye, Edit3, Sparkles, Layers, Minimize2, Maximize2, Info } from 'lucide-react';
import DiffViewer from './DiffViewer';

export default function ResumePreview({
  resumeText,
  onUpdateResumeText,
  bulletChanges = [],
  jdKeywordsData,
  onPrint
}) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [highlightDiff, setHighlightDiff] = useState(true);
  const [highlightKeywords, setHighlightKeywords] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview', 'diff'
  const [density, setDensity] = useState('compact'); // 'compact' (1-page fit) | 'standard'

  const handleCopyPlainText = () => {
    navigator.clipboard.writeText(resumeText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(resumeText);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  // Helper to parse the plain resume text into standard structured sections
  const parseResumeToElements = (text) => {
    if (!text) return null;
    const lines = text.split(/\r?\n/);

    const sections = [];
    let currentSection = { title: "HEADER", content: [] };

    const knownHeaders = [
      "PROFESSIONAL SUMMARY", "SUMMARY", "PROFILE",
      "WORK EXPERIENCE", "EXPERIENCE", "EMPLOYMENT HISTORY", "EMPLOYMENT",
      "TECHNICAL SKILLS", "SKILLS", "CORE COMPETENCIES", "COMPETENCIES",
      "EDUCATION", "PROJECTS", "CERTIFICATIONS"
    ];

    for (const line of lines) {
      const trimmed = line.trim();
      const upper = trimmed.toUpperCase();

      if (knownHeaders.some(h => upper === h || upper.startsWith(h + ":") || upper.startsWith(h + " :"))) {
        if (currentSection.content.length > 0 || currentSection.title !== "HEADER") {
          sections.push(currentSection);
        }
        currentSection = { title: upper.replace(/[:]/g, ''), content: [] };
      } else {
        currentSection.content.push(line);
      }
    }
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = parseResumeToElements(resumeText);

  // Keyword highlighter helper
  const renderTextWithHighlights = (textStr) => {
    if (!highlightKeywords || !jdKeywordsData?.keywords) {
      return textStr;
    }

    const keywords = jdKeywordsData.keywords.map(k => k.name).filter(Boolean);
    if (keywords.length === 0) return textStr;

    const escaped = keywords.slice(0, 25).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    if (!escaped) return textStr;

    const regex = new RegExp(`(\\b(?:${escaped})\\b)`, 'gi');
    const parts = textStr.split(regex);

    return parts.map((part, i) => {
      const isMatch = keywords.some(k => k.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <mark
            key={i}
            className="injected-keyword"
            title="Matched Target ATS Keyword"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="glass-card preview-card-wrapper" style={{ overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
      {/* Resume View Toolbar */}
      <div className="panel-header resume-toolbar" style={{ background: 'rgba(10, 16, 30, 0.75)', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'preview' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={13} />
            ATS Resume Sheet
          </button>

          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'diff' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('diff')}
          >
            <Layers size={13} />
            Bullet Impact Diff ({bulletChanges.length})
          </button>
        </div>

        {/* Highlight & Edit & Density Toggles */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {activeTab === 'preview' && (
            <>
              {/* Density Toggle (Compact 1-Page vs Standard) */}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '0.725rem',
                  color: density === 'compact' ? '#34d399' : 'var(--text-secondary)',
                  borderColor: density === 'compact' ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'
                }}
                onClick={() => setDensity(density === 'compact' ? 'standard' : 'compact')}
                title="Toggle tight 1-page compact fit"
              >
                {density === 'compact' ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                {density === 'compact' ? '1-Page Fit: ON' : 'Standard Spacing'}
              </button>

              <button
                type="button"
                className={`btn btn-sm ${highlightDiff ? 'btn-secondary' : 'btn-ghost'}`}
                style={{
                  fontSize: '0.725rem',
                  borderColor: highlightDiff ? 'var(--accent-emerald)' : 'transparent',
                  color: highlightDiff ? '#34d399' : 'var(--text-secondary)'
                }}
                onClick={() => setHighlightDiff(!highlightDiff)}
                title="Toggle visual diff highlights on rewritten bullet points"
              >
                <Sparkles size={12} />
                Diff Highlights
              </button>

              <button
                type="button"
                className={`btn btn-sm ${highlightKeywords ? 'btn-secondary' : 'btn-ghost'}`}
                style={{
                  fontSize: '0.725rem',
                  borderColor: highlightKeywords ? 'var(--accent-cyan)' : 'transparent',
                  color: highlightKeywords ? '#38bdf8' : 'var(--text-secondary)'
                }}
                onClick={() => setHighlightKeywords(!highlightKeywords)}
                title="Toggle highlighted ATS target keywords"
              >
                Keywords
              </button>

              <button
                type="button"
                className={`btn btn-sm ${isEditing ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ fontSize: '0.725rem' }}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 size={12} />
                {isEditing ? 'View Sheet' : 'Edit Text'}
              </button>
            </>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleCopyPlainText}
            title="Copy plain text formatted for online application portals"
          >
            {copiedText ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
            {copiedText ? 'Copied' : 'Copy Text'}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onPrint}
            title="Download formatted ATS-compliant PDF without headers, footers, or borders"
          >
            <Printer size={13} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Print Hint Banner (Hidden during print) */}
      <div className="no-print" style={{
        background: 'rgba(99, 102, 241, 0.08)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        padding: '0.35rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.675rem',
        color: '#c7d2fe'
      }}>
        <Info size={12} style={{ color: '#818cf8', flexShrink: 0 }} />
        <span>
          <strong>PDF Export Tip:</strong> In your browser print dialog, select <em>Destination: Save as PDF</em> and ensure <em>Headers and Footers</em> is unchecked.
        </span>
      </div>

      <div className="panel-body" style={{ background: 'rgba(8, 12, 22, 0.95)', padding: '1rem' }}>
        {activeTab === 'diff' ? (
          <DiffViewer bulletChanges={bulletChanges} />
        ) : isEditing ? (
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Edit resume text directly. Changes update the sheet and ATS score calculations in real time:
            </div>
            <textarea
              className="custom-textarea"
              rows={28}
              value={resumeText}
              onChange={(e) => onUpdateResumeText(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', lineHeight: '1.5' }}
            />
          </div>
        ) : (
          <div className="resume-sheet-container">
            <div className={`resume-paper ${density === 'compact' ? 'compact-mode' : ''} ${highlightDiff ? 'highlight-diff' : ''}`}>
              {/* Render Structured ATS Layout */}
              {sections && sections.map((sec, secIdx) => {
                if (sec.title === "HEADER") {
                  // Candidate Name & Contact
                  const nonBlank = sec.content.filter(l => l.trim().length > 0);
                  const nameLine = nonBlank[0] || "Candidate Name";
                  const contactLines = nonBlank.slice(1);

                  return (
                    <div key={secIdx} className="resume-header">
                      <div className="candidate-name">{nameLine}</div>
                      <div className="contact-line">
                        {contactLines.map((cl, ci) => (
                          <span key={ci} className="contact-item">
                            {cl}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={secIdx} className="resume-section">
                    <div className="section-title">{sec.title}</div>
                    <div className="section-content">
                      {sec.title.includes("EXPERIENCE") || sec.title.includes("EMPLOYMENT") ? (
                        <div>
                          {sec.content.map((line, li) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;

                            // Check if bullet point
                            if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*") || trimmed.startsWith("–")) {
                              const bulletText = trimmed.replace(/^[-•*–]\s*/, "");
                              const wasModified = bulletChanges.some(bc => bc.upgraded === bulletText);

                              return (
                                <ul key={li} className="bullet-list">
                                  <li className={`bullet-item ${wasModified && highlightDiff ? 'modified' : ''}`}>
                                    {renderTextWithHighlights(bulletText)}
                                  </li>
                                </ul>
                              );
                            }

                            // Job Title or Company Line
                            if (trimmed.includes("|") || trimmed.includes("–") || trimmed.includes(" - ") || trimmed.includes(",")) {
                              return (
                                <div key={li} className="role-header" style={{ marginTop: '0.35rem', marginBottom: '0.1rem' }}>
                                  {trimmed}
                                </div>
                              );
                            }

                            return <div key={li} style={{ marginBottom: '0.15rem' }}>{trimmed}</div>;
                          })}
                        </div>
                      ) : sec.title.includes("SKILLS") || sec.title.includes("COMPETENCIES") ? (
                        <div>
                          {sec.content.map((line, li) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            if (trimmed.includes(":")) {
                              const [cat, items] = trimmed.split(":");
                              return (
                                <div key={li} className="skill-category">
                                  <strong>{cat}:</strong> {renderTextWithHighlights(items)}
                                </div>
                              );
                            }
                            return <div key={li} className="skill-category">{renderTextWithHighlights(trimmed)}</div>;
                          })}
                        </div>
                      ) : (
                        <div>
                          {sec.content.map((line, li) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            return (
                              <p key={li} style={{ marginBottom: '0.25rem', lineHeight: '1.35' }}>
                                {renderTextWithHighlights(trimmed)}
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
