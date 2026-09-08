import React, { useState } from 'react';
import { Copy, Check, Printer, Eye, Edit3, Sparkles, Layers, Minimize2, Maximize2, FileText, GraduationCap, Phone, Mail, ExternalLink } from 'lucide-react';
import DiffViewer from './DiffViewer';

// Brand SVGs for LinkedIn and GitHub
const LinkedInIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px', color: '#0077b5' }}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px', color: '#111827' }}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

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
  const [templateStyle, setTemplateStyle] = useState('latex'); // 'latex' | 'modern'

  const handleCopyPlainText = () => {
    navigator.clipboard.writeText(resumeText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Robust check for Bullet points
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
      "PROJECTS", "KEY PROJECTS", "PERSONAL PROJECTS", "NOTABLE WORK", "PORTFOLIO PROJECTS", "ACADEMIC PROJECTS",
      "TECHNICAL SKILLS", "SKILLS & TOOLS", "SKILLS", "CORE COMPETENCIES", "COMPETENCIES", "AREAS OF EXPERTISE", "TECHNOLOGIES", "TOOLKIT",
      "EDUCATION", "ACADEMIC BACKGROUND", "ACADEMIC QUALIFICATIONS", "QUALIFICATIONS",
      "CERTIFICATIONS", "LICENSES & CERTIFICATIONS", "LICENSES", "COURSES",
      "AWARDS", "ACHIEVEMENTS", "HONORS & AWARDS", "HONORS",
      "PUBLICATIONS", "VOLUNTEERING", "LEADERSHIP & ACTIVITIES", "LEADERSHIP"
    ];

    if (knownHeaders.includes(upper)) return true;

    // Short line that matches exact standard header format
    if (trimmed.length >= 3 && trimmed.length <= 30 && !trimmed.includes(',') && !trimmed.includes('|') && !trimmed.includes('—')) {
      if (trimmed === upper || /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(trimmed)) {
        return knownHeaders.some(h => upper.includes(h));
      }
    }

    return false;
  };

  // Date pattern extractor (e.g. "May 2022 – Present", "Jul 2016 – May 2020", "2020 – 2022")
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

  // Helper to render Contact Header with icons matching Overleaf screenshot
  const renderCandidateHeader = (sec) => {
    const lines = sec.lines.filter(l => l.trim().length > 0);
    const candidateName = lines[0] || "UTKARSH CHATURVEDI";
    const sublines = lines.slice(1);

    // Group items by category (Phone, Email, LinkedIn, GitHub, Location)
    let locationStr = "Gurgaon, Haryana";
    let phoneStr = "";
    let emailStr = "";
    let linkedInStr = "";
    let gitHubStr = "";
    let otherSubtitle = "";

    for (const line of sublines) {
      // Split on pipes or bullet dots
      const tokens = line.split(/[|•]/).map(t => t.trim()).filter(Boolean);

      for (const token of tokens) {
        if (/[\d\s+()-]{9,}/.test(token) && !token.includes('@') && !token.includes('github') && !token.includes('linkedin')) {
          phoneStr = token;
        } else if (token.includes('@')) {
          emailStr = token;
        } else if (/linkedin\.com/i.test(token)) {
          linkedInStr = token.replace(/^https?:\/\/(www\.)?/, '');
        } else if (/github\.com/i.test(token)) {
          gitHubStr = token.replace(/^https?:\/\/(www\.)?/, '');
        } else if (/gurgaon|delhi|bangalore|mumbai|san francisco|california|new york|mathura|india/i.test(token)) {
          locationStr = token;
        } else if (tokens.length === 1 && !phoneStr && !emailStr) {
          otherSubtitle = token;
        }
      }
    }

    return (
      <div className="resume-header">
        <div className="candidate-name" style={{ letterSpacing: '0.04em' }}>{candidateName}</div>
        
        {locationStr && (
          <div className="location-line" style={{ fontSize: '9.75pt', color: '#111827', marginBottom: '2px' }}>
            {locationStr}
          </div>
        )}

        {otherSubtitle && (
          <div style={{ fontSize: '9.5pt', color: '#333333', marginBottom: '3px' }}>
            {otherSubtitle}
          </div>
        )}

        {/* Row 1: Phone, Email, LinkedIn */}
        <div className="contact-line" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2px' }}>
          {phoneStr && (
            <span className="contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Phone size={10} style={{ color: '#111827' }} />
              <a href={`tel:${phoneStr.replace(/\s+/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {phoneStr}
              </a>
            </span>
          )}

          {emailStr && (
            <span className="contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Mail size={10} style={{ color: '#111827' }} />
              <a href={`mailto:${emailStr}`} style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                {emailStr}
              </a>
            </span>
          )}

          {linkedInStr && (
            <span className="contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <LinkedInIcon />
              <a href={`https://${linkedInStr}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                {linkedInStr}
              </a>
            </span>
          )}
        </div>

        {/* Row 2: GitHub */}
        {gitHubStr && (
          <div className="contact-line" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3px' }}>
            <span className="contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <GitHubIcon />
              <a href={`https://${gitHubStr}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                {gitHubStr}
              </a>
            </span>
          </div>
        )}
      </div>
    );
  };

  // Helper to render section content with LaTeX Overleaf 4-corner layout
  const renderSectionContent = (sec) => {
    const isExperience = sec.title.toUpperCase().includes("EXPERIENCE") || sec.title.toUpperCase().includes("EMPLOYMENT") || sec.title.toUpperCase().includes("WORK");
    const isEducation = sec.title.toUpperCase().includes("EDUCATION");
    const isSkills = sec.title.toUpperCase().includes("SKILL") || sec.title.toUpperCase().includes("COMPETENC") || sec.title.toUpperCase().includes("TOOL");
    const isProjects = sec.title.toUpperCase().includes("PROJECT");

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

        // Date line detection (Company / Institution with Date)
        const dateMatch = line.match(dateRegex);
        if ((isExperience || isEducation) && dateMatch) {
          const dateStr = dateMatch[1];
          const topLabel = line.slice(0, dateMatch.index).trim();
          
          let subLeft = '';
          let subRight = '';
          if (i + 1 < lines.length && !isBulletLine(lines[i + 1]) && !isSectionHeader(lines[i + 1])) {
            const nextLine = lines[i + 1];
            if (nextLine.includes(' — ')) {
              const parts = nextLine.split(' — ');
              subLeft = parts[0].trim();
              subRight = parts.slice(1).join(' — ').trim();
              i++;
            } else if (nextLine.includes('  ')) {
              const parts = nextLine.split(/\s{2,}/);
              subLeft = parts[0].trim();
              subRight = parts.slice(1).join(' ').trim();
              i++;
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
        } else if (isProjects && (line.includes('|') || line.includes('–') || line.includes('-'))) {
          // Project header format: Guidezy – Personal Portfolio ↗ | Next.js, TypeScript, CI/CD
          const parts = line.split('|');
          clusters.push({
            type: 'project-header',
            title: parts[0].trim(),
            tech: parts[1] ? parts[1].trim() : ''
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
            const isExternalLinkCompany = /Statusneo|Publicis|83Incs|Sapient|Guidezy/i.test(cluster.topLabel);

            return (
              <div key={ci} className="latex-job-block" style={{ marginTop: ci > 0 ? '0.55rem' : '0.15rem', marginBottom: '0.2rem' }}>
                <div className="role-header-top">
                  <span className="company-name" style={{ color: isExternalLinkCompany && !cluster.topLabel.includes('Indigo') ? '#1d4ed8' : '#000000' }}>
                    {cluster.topLabel}
                    {isExternalLinkCompany && (
                      <ExternalLink size={9} style={{ display: 'inline', marginLeft: '3px', verticalAlign: 'middle', color: '#1d4ed8' }} />
                    )}
                  </span>
                  <span className="timeline-dates" style={{ fontWeight: 400, color: '#111827' }}>{cluster.dateStr}</span>
                </div>
                {(cluster.subLeft || cluster.subRight) && (
                  <div className="role-header-sub">
                    <span className="role-title" style={{ fontStyle: 'italic', color: '#111827' }}>{cluster.subLeft}</span>
                    <span className="role-location" style={{ fontStyle: 'italic', color: '#333333' }}>{cluster.subRight}</span>
                  </div>
                )}
              </div>
            );
          }

          if (cluster.type === 'project-header') {
            return (
              <div key={ci} style={{ marginTop: ci > 0 ? '0.5rem' : '0.15rem', marginBottom: '0.2rem', fontSize: '9.75pt' }}>
                <strong style={{ color: '#1d4ed8' }}>{cluster.title}</strong>
                <ExternalLink size={9} style={{ display: 'inline', marginLeft: '3px', marginRight: '6px', verticalAlign: 'middle', color: '#1d4ed8' }} />
                {cluster.tech && <span style={{ color: '#333333', fontStyle: 'normal' }}>| {cluster.tech}</span>}
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
              <div key={ci} className="skill-category" style={{ marginBottom: '2.5pt' }}>
                <strong>{cluster.category}:</strong> {renderTextWithHighlights(cluster.items)}
              </div>
            );
          }

          return (
            <p key={ci} style={{ marginBottom: '0.3rem', lineHeight: '1.32' }}>
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
          <strong>LaTeX / Overleaf Mode Active:</strong> Rendered with Computer Modern serif typography, small-caps section titles, GitHub/LinkedIn/Email icons, and 4-corner company/timeline alignment.
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
                  return <React.Fragment key={secIdx}>{renderCandidateHeader(sec)}</React.Fragment>;
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
