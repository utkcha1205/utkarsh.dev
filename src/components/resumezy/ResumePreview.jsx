import React, { useState } from 'react';
import { Copy, Check, Printer, Eye, Edit3, Sparkles, Layers, Minimize2, Maximize2, Info, FileText } from 'lucide-react';
import DiffViewer from './DiffViewer';

export default function ResumePreview({
  resumeText,
  onUpdateResumeText,
  bulletChanges = [],
  jdKeywordsData,
  onPrint
}) {
  const [copiedText, setCopiedText] = useState(false);
  const [highlightDiff, setHighlightDiff] = useState(true);
  const [highlightKeywords, setHighlightKeywords] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'diff' | 'raw'
  const [density, setDensity] = useState('compact'); // 'compact' | 'standard'

  const handleCopyPlainText = () => {
    navigator.clipboard.writeText(resumeText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Robust check for Bullet points across all standard and unicode symbols
  const isBulletLine = (line) => {
    const trimmed = line.trim();
    return /^[•\*\-\–\—\▪\▫\►\▸\⁃]\s*/.test(trimmed) || /^\d+[\.\)]\s+/.test(trimmed);
  };

  const cleanBulletText = (line) => {
    return line.trim().replace(/^[•\*\-\–\—\▪\▫\►\▸\⁃]\s*/, '').replace(/^\d+[\.\)]\s*/, '');
  };

  // Robust check for Section Headers (Case-insensitive & flexible)
  const isSectionHeader = (line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 60 || /[.?!]$/.test(trimmed)) return false;

    // Check against standard separator dividers
    if (/^[=\-_*~]{3,}$/.test(trimmed)) return false;

    const upper = trimmed.toUpperCase().replace(/[:#]/g, '').trim();
    const knownHeaders = [
      "PROFESSIONAL SUMMARY", "SUMMARY", "PROFILE", "ABOUT ME", "ABOUT", "OBJECTIVE", "EXECUTIVE SUMMARY",
      "WORK EXPERIENCE", "EXPERIENCE", "PROFESSIONAL EXPERIENCE", "EMPLOYMENT HISTORY", "EMPLOYMENT", "WORK HISTORY", "CAREER HISTORY",
      "TECHNICAL SKILLS", "SKILLS & TOOLS", "SKILLS", "CORE COMPETENCIES", "COMPETENCIES", "AREAS OF EXPERTISE", "TECHNOLOGIES", "TOOLKIT",
      "EDUCATION", "ACADEMIC BACKGROUND", "ACADEMIC QUALIFICATIONS", "QUALIFICATIONS",
      "PROJECTS", "KEY PROJECTS", "PERSONAL PROJECTS", "NOTABLE WORK", "PORTFOLIO PROJECTS", "ACADEMIC PROJECTS",
      "CERTIFICATIONS", "LICENSES & CERTIFICATIONS", "LICENSES", "COURSES",
      "AWARDS", "ACHIEVEMENTS", "HONORS & AWARDS", "HONORS",
      "PUBLICATIONS", "VOLUNTEERING", "LEADERSHIP & ACTIVITIES", "LEADERSHIP"
    ];

    if (knownHeaders.includes(upper)) return true;

    // Short all-caps line that doesn't have sentences or dates
    if (trimmed === upper && trimmed.length >= 3 && trimmed.length <= 35 && !trimmed.includes(',') && !trimmed.includes('|')) {
      return true;
    }

    return false;
  };

  // Check if a line is a Role / Company / Timeline header
  const isRoleOrDateLine = (line) => {
    const trimmed = line.trim();
    if (isBulletLine(trimmed)) return false;

    // Must have date markers OR prominent separators like |, —, –
    const hasDate = /\b(19\d\d|20\d\d|present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(trimmed);
    const hasPipeOrDash = trimmed.includes('|') || trimmed.includes(' — ') || trimmed.includes(' – ');

    return (hasDate && (hasPipeOrDash || trimmed.length < 80)) || (hasPipeOrDash && trimmed.length < 90);
  };

  // Structure resume lines into intelligent semantic blocks
  const parseResumeToElements = (text) => {
    if (!text) return [];
    const lines = text.split(/\r?\n/);

    const sections = [];
    let currentSection = { title: "HEADER", lines: [] };

    for (const rawLine of lines) {
      const trimmed = rawLine.trim();
      if (!trimmed) {
        if (currentSection.lines.length > 0) {
          currentSection.lines.push(""); // preserve paragraph break
        }
        continue;
      }

      // Ignore decorative divider lines
      if (/^[=\-_*~]{3,}$/.test(trimmed)) continue;

      if (isSectionHeader(trimmed)) {
        if (currentSection.lines.length > 0 || currentSection.title !== "HEADER") {
          sections.push(currentSection);
        }
        const cleanTitle = trimmed.toUpperCase().replace(/[:#]/g, '').trim();
        currentSection = { title: cleanTitle, lines: [] };
      } else {
        currentSection.lines.push(trimmed);
      }
    }

    if (currentSection.lines.length > 0) {
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = parseResumeToElements(resumeText);

  // Keyword highlighter helper
  const renderTextWithHighlights = (textStr) => {
    if (!highlightKeywords || !jdKeywordsData?.keywords || !textStr) {
      return textStr;
    }

    const keywords = jdKeywordsData.keywords.map(k => k.name).filter(Boolean);
    if (keywords.length === 0) return textStr;

    const escaped = keywords.slice(0, 30).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    if (!escaped) return textStr;

    const regex = new RegExp(`(\\b(?:${escaped})\\b)`, 'gi');
    const parts = textStr.split(regex);

    return parts.map((part, i) => {
      const isMatch = keywords.some(k => k.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <mark key={i} className="injected-keyword" title="Matched Target ATS Keyword">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  // Helper to render section lines grouping consecutive bullet points
  const renderSectionContent = (sec) => {
    const isExperience = sec.title.includes("EXPERIENCE") || sec.title.includes("EMPLOYMENT") || sec.title.includes("WORK") || sec.title.includes("PROJECT");
    const isSkills = sec.title.includes("SKILL") || sec.title.includes("COMPETENC") || sec.title.includes("TOOL");

    // Group consecutive bullet points into clusters
    const clusters = [];
    let currentBulletCluster = null;

    for (const line of sec.lines) {
      if (!line) {
        if (currentBulletCluster) {
          clusters.push({ type: 'bullets', items: currentBulletCluster });
          currentBulletCluster = null;
        }
        continue;
      }

      if (isBulletLine(line)) {
        const bulletText = cleanBulletText(line);
        const wasModified = bulletChanges.some(bc => bc.upgraded && (bc.upgraded.includes(bulletText) || bulletText.includes(bc.upgraded)));
        const bulletObj = { text: bulletText, modified: wasModified };

        if (!currentBulletCluster) currentBulletCluster = [];
        currentBulletCluster.push(bulletObj);
      } else {
        if (currentBulletCluster) {
          clusters.push({ type: 'bullets', items: currentBulletCluster });
          currentBulletCluster = null;
        }

        if (isExperience && isRoleOrDateLine(line)) {
          clusters.push({ type: 'role-header', text: line });
        } else if (isSkills && line.includes(':')) {
          const [cat, items] = line.split(/:(.+)/);
          clusters.push({ type: 'skill', category: cat.trim(), items: (items || '').trim() });
        } else {
          clusters.push({ type: 'text', text: line });
        }
      }
    }

    if (currentBulletCluster) {
      clusters.push({ type: 'bullets', items: currentBulletCluster });
    }

    return (
      <div className="section-content">
        {clusters.map((cluster, ci) => {
          if (cluster.type === 'role-header') {
            // Split title and company/date if separated by pipe or dash
            let leftPart = cluster.text;
            let rightPart = '';

            if (cluster.text.includes('|')) {
              const parts = cluster.text.split('|');
              leftPart = parts[0].trim();
              rightPart = parts.slice(1).join(' | ').trim();
            } else if (cluster.text.includes(' — ')) {
              const parts = cluster.text.split(' — ');
              leftPart = parts[0].trim();
              rightPart = parts.slice(1).join(' — ').trim();
            }

            return (
              <div key={ci} className="role-header" style={{ marginTop: ci > 0 ? '0.5rem' : '0.1rem', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{leftPart}</span>
                {rightPart && <span style={{ fontStyle: 'italic', color: '#475569', fontSize: '9pt' }}>{rightPart}</span>}
              </div>
            );
          }

          if (cluster.type === 'bullets') {
            return (
              <ul key={ci} className="bullet-list">
                {cluster.items.map((b, bi) => (
                  <li key={bi} className={`bullet-item ${b.modified && highlightDiff ? 'modified' : ''}`}>
                    {renderTextWithHighlights(b.text)}
                  </li>
                ))}
              </ul>
            );
          }

          if (cluster.type === 'skill') {
            return (
              <div key={ci} className="skill-category">
                <strong>{cluster.category}:</strong> {renderTextWithHighlights(cluster.items)}
              </div>
            );
          }

          return (
            <p key={ci} style={{ marginBottom: '0.35rem', lineHeight: '1.35' }}>
              {renderTextWithHighlights(cluster.text)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-card preview-card-wrapper" style={{ overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
      {/* Resume View Toolbar (Hidden during Print) */}
      <div className="panel-header resume-toolbar no-print" style={{ background: 'rgba(10, 16, 30, 0.75)', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'preview' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('preview')}
            title="Formatted clean ATS Sheet"
          >
            <Eye size={13} />
            ATS Resume Sheet
          </button>

          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'diff' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('diff')}
            title="View side-by-side bullet comparisons"
          >
            <Layers size={13} />
            Bullet Impact Diff ({bulletChanges.length})
          </button>

          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'raw' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('raw')}
            title="View exact original template text"
          >
            <FileText size={13} />
            Original Template
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
            title="Export clean ATS-compliant PDF without any website UI"
          >
            <Printer size={13} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Print Hint Banner (Hidden during print) */}
      <div className="no-print" style={{
        background: 'rgba(16, 185, 129, 0.08)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
        padding: '0.35rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.7rem',
        color: '#a7f3d0'
      }}>
        <Info size={12} style={{ color: '#10b981', flexShrink: 0 }} />
        <span>
          <strong>Clean PDF Export:</strong> Only your resume paper will be exported. All website navigation, sidebars, and buttons are automatically hidden.
        </span>
      </div>

      <div className="panel-body" style={{ background: 'rgba(8, 12, 22, 0.95)', padding: '1rem' }}>
        {activeTab === 'diff' ? (
          <DiffViewer bulletChanges={bulletChanges} />
        ) : activeTab === 'raw' ? (
          /* EXACT ORIGINAL TEMPLATE PRESERVED VIEW */
          <div id="resume-printable-area" className="resume-sheet-container">
            <div className={`resume-paper ${density === 'compact' ? 'compact-mode' : ''} ${highlightDiff ? 'highlight-diff' : ''}`} style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
              {renderTextWithHighlights(resumeText)}
            </div>
          </div>
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
          /* FORMATTED ATS SHEET VIEW */
          <div id="resume-printable-area" className="resume-sheet-container">
            <div className={`resume-paper ${density === 'compact' ? 'compact-mode' : ''} ${highlightDiff ? 'highlight-diff' : ''}`}>
              {sections && sections.map((sec, secIdx) => {
                if (sec.title === "HEADER") {
                  const nonBlank = sec.lines.filter(l => l.trim().length > 0);
                  const nameLine = nonBlank[0] || "Candidate Name";
                  const contactLines = nonBlank.slice(1);

                  return (
                    <div key={secIdx} className="resume-header">
                      <div className="candidate-name">{nameLine}</div>
                      {contactLines.length > 0 && (
                        <div className="contact-line">
                          {contactLines.map((cl, ci) => (
                            <span key={ci} className="contact-item">
                              {cl}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={secIdx} className="resume-section">
                    <div className="section-title">{sec.title}</div>
                    {renderSectionContent(sec)}
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
