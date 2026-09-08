import React, { useState } from 'react';
import { Copy, Check, Printer, Eye, Edit3, Sparkles, Layers, Minimize2, Maximize2, Info, FileText, GraduationCap } from 'lucide-react';
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
  const [templateStyle, setTemplateStyle] = useState('latex'); // 'latex' (Overleaf) | 'modern'

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

  // Check for Section Headers
  const isSectionHeader = (line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 60 || /[.?!]$/.test(trimmed)) return false;
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

    // Short all-caps line
    if (trimmed === upper && trimmed.length >= 3 && trimmed.length <= 35 && !trimmed.includes(',') && !trimmed.includes('|')) {
      return true;
    }

    return false;
  };

  // Date pattern extractor (e.g., "May 2022 – Present", "2016 – 2020", "Aug 2021 - May 2022")
  const dateRegex = /\s+((?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:\d{4})\s*[\–\—\-]\s*(?:Present|Current|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:\d{4})))$/i;

  // Structure resume lines into sections
  const parseResumeToElements = (text) => {
    if (!text) return [];
    const lines = text.split(/\r?\n/);

    const sections = [];
    let currentSection = { title: "HEADER", lines: [] };

    for (const rawLine of lines) {
      const trimmed = rawLine.trim();
      if (!trimmed) continue;
      if (/^[=\-_*~]{3,}$/.test(trimmed)) continue;

      if (isSectionHeader(trimmed)) {
        if (currentSection.lines.length > 0 || currentSection.title !== "HEADER") {
          sections.push(currentSection);
        }
        const cleanTitle = trimmed.replace(/[:#]/g, '').trim();
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

  // Render content with LaTeX / Overleaf 4-corner layout support
  const renderSectionContent = (sec) => {
    const isExperience = sec.title.toUpperCase().includes("EXPERIENCE") || sec.title.toUpperCase().includes("EMPLOYMENT") || sec.title.toUpperCase().includes("WORK");
    const isEducation = sec.title.toUpperCase().includes("EDUCATION");
    const isSkills = sec.title.toUpperCase().includes("SKILL") || sec.title.toUpperCase().includes("COMPETENC") || sec.title.toUpperCase().includes("TOOL");

    const clusters = [];
    let currentBulletCluster = null;

    const lines = sec.lines;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

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

        // Overleaf / LaTeX Role Entry Check (Line ends with date or has pipe/dash)
        const dateMatch = line.match(dateRegex);
        if ((isExperience || isEducation) && dateMatch) {
          const dateStr = dateMatch[1];
          const topLabel = line.slice(0, dateMatch.index).trim();
          
          // Check if next line is a subline (Role / Location)
          let subLeft = '';
          let subRight = '';
          if (i + 1 < lines.length && !isBulletLine(lines[i + 1]) && !isSectionHeader(lines[i + 1])) {
            const nextLine = lines[i + 1];
            if (nextLine.includes(' — ')) {
              const parts = nextLine.split(' — ');
              subLeft = parts[0].trim();
              subRight = parts.slice(1).join(' — ').trim();
              i++; // consume subline
            } else if (nextLine.includes('|')) {
              const parts = nextLine.split('|');
              subLeft = parts[0].trim();
              subRight = parts.slice(1).join(' | ').trim();
              i++;
            } else if (nextLine.length < 80) {
              subLeft = nextLine;
              i++;
            }
          }

          clusters.push({
            type: 'latex-entry',
            topLabel,
            dateStr,
            subLeft,
            subRight
          });
        } else if (isExperience && (line.includes('|') || line.includes(' — '))) {
          // Standard pipe/dash role header
          const parts = line.includes('|') ? line.split('|') : line.split(' — ');
          clusters.push({
            type: 'latex-entry',
            topLabel: parts[0].trim(),
            dateStr: parts[1] ? parts[1].trim() : '',
            subLeft: parts[2] ? parts[2].trim() : '',
            subRight: ''
          });
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
          if (cluster.type === 'latex-entry') {
            return (
              <div key={ci} className="latex-job-block" style={{ marginTop: ci > 0 ? '0.55rem' : '0.15rem', marginBottom: '0.2rem' }}>
                <div className="role-header-top">
                  <span className="company-name">{cluster.topLabel}</span>
                  <span className="timeline-dates">{cluster.dateStr}</span>
                </div>
                {(cluster.subLeft || cluster.subRight) && (
                  <div className="role-header-sub">
                    <span className="role-title">{cluster.subLeft}</span>
                    <span className="role-location">{cluster.subRight}</span>
                  </div>
                )}
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
            <p key={ci} style={{ marginBottom: '0.35rem', lineHeight: '1.32' }}>
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
            title="Formatted resume sheet"
          >
            <Eye size={13} />
            Formatted Sheet
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
            Original Verbatim
          </button>
        </div>

        {/* Style & Density Toggles */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {activeTab === 'preview' && (
            <>
              {/* Template Style Toggle: LaTeX (Overleaf) vs Modern */}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '0.725rem',
                  color: templateStyle === 'latex' ? '#a855f7' : '#94a3b8',
                  borderColor: templateStyle === 'latex' ? 'rgba(168, 85, 247, 0.5)' : 'var(--border-subtle)'
                }}
                onClick={() => setTemplateStyle(templateStyle === 'latex' ? 'modern' : 'latex')}
                title="Toggle between Overleaf/LaTeX style and Modern Sans-Serif ATS style"
              >
                <GraduationCap size={13} />
                {templateStyle === 'latex' ? '🎓 LaTeX / Overleaf' : '💼 Modern ATS'}
              </button>

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

      {/* Print Hint Banner */}
      <div className="no-print" style={{
        background: 'rgba(168, 85, 247, 0.08)',
        borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
        padding: '0.35rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.7rem',
        color: '#e9d5ff'
      }}>
        <GraduationCap size={13} style={{ color: '#c084fc', flexShrink: 0 }} />
        <span>
          <strong>LaTeX / Overleaf Mode Active:</strong> Rendered with Computer Modern serif typography, small-caps section titles, and 4-corner company/timeline alignment. Only the resume paper will be exported.
        </span>
      </div>

      <div className="panel-body" style={{ background: 'rgba(8, 12, 22, 0.95)', padding: '1rem' }}>
        {activeTab === 'diff' ? (
          <DiffViewer bulletChanges={bulletChanges} />
        ) : activeTab === 'raw' ? (
          /* EXACT ORIGINAL VERBATIM VIEW */
          <div id="resume-printable-area" className="resume-sheet-container">
            <div className={`resume-paper ${templateStyle === 'latex' ? 'latex-mode' : ''} ${density === 'compact' ? 'compact-mode' : ''}`} style={{ whiteSpace: 'pre-wrap' }}>
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
          /* FORMATTED SHEET VIEW (LATEX OR MODERN) */
          <div id="resume-printable-area" className="resume-sheet-container">
            <div className={`resume-paper ${templateStyle === 'latex' ? 'latex-mode' : ''} ${density === 'compact' ? 'compact-mode' : ''} ${highlightDiff ? 'highlight-diff' : ''}`}>
              {sections && sections.map((sec, secIdx) => {
                if (sec.title === "HEADER") {
                  const nonBlank = sec.lines.filter(l => l.trim().length > 0);
                  const nameLine = nonBlank[0] || "Candidate Name";
                  const contactLines = nonBlank.slice(1);

                  return (
                    <div key={secIdx} className="resume-header">
                      <div className="candidate-name">{nameLine}</div>
                      {contactLines.length > 0 && (
                        <div className="contact-lines-container" style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                          {contactLines.map((cl, ci) => (
                            <div key={ci} className="contact-line">
                              <span className="contact-item">{cl}</span>
                            </div>
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
