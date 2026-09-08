import React, { useState } from 'react';
import { Copy, Check, Printer, Eye, Edit3, Sparkles, Layers, Minimize2, Maximize2, FileText, GraduationCap, ExternalLink } from 'lucide-react';
import DiffViewer from './DiffViewer';

// Authentic FontAwesome solid & brand SVGs matching Overleaf LaTeX template
const PhoneIcon = () => (
  <svg width="10" height="10" viewBox="0 0 512 512" fill="currentColor" style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }}>
    <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.1l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
  </svg>
);

const EnvelopeIcon = () => (
  <svg width="10" height="10" viewBox="0 0 512 512" fill="currentColor" style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }}>
    <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.5c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.6zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="10" height="10" viewBox="0 0 448 512" fill="currentColor" style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px', color: '#000000' }}>
    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="10" height="10" viewBox="0 0 496 512" fill="currentColor" style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px', color: '#000000' }}>
    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
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
  const [highlightDiff, setHighlightDiff] = useState(false);
  const [highlightKeywords, setHighlightKeywords] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('sheet'); // 'sheet' | 'diff' | 'raw'
  const [templateStyle, setTemplateStyle] = useState('latex'); // 'latex' | 'modern'
  const [density, setDensity] = useState('standard'); // 'standard' | 'compact'

  const handleCopyPlainText = () => {
    navigator.clipboard.writeText(resumeText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Section Header Detector
  const isSectionHeader = (line) => {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.length > 40) return false;
    const clean = trimmed.replace(/^#+\s*/, '').replace(/[:*_-]/g, '').trim().toUpperCase();
    const commonTitles = [
      "SUMMARY", "PROFESSIONAL SUMMARY", "EXECUTIVE SUMMARY", "OBJECTIVE",
      "EXPERIENCE", "WORK EXPERIENCE", "PROFESSIONAL EXPERIENCE", "EMPLOYMENT HISTORY",
      "EDUCATION", "ACADEMIC BACKGROUND",
      "TECHNICAL SKILLS", "SKILLS", "CORE COMPETENCIES", "AREAS OF EXPERTISE",
      "PROJECTS", "PERSONAL PROJECTS", "KEY PROJECTS",
      "CERTIFICATIONS", "LICENSES", "AWARDS", "PUBLICATIONS"
    ];
    return commonTitles.some(title => clean === title || clean.startsWith(title));
  };

  // Parse raw text into structured sections
  const parseSections = (text) => {
    if (!text) return [];
    const rawLines = text.split('\n');
    const sections = [];
    let currentSection = { title: "HEADER", lines: [] };

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      if (isSectionHeader(line)) {
        if (currentSection.lines.length > 0 || currentSection.title !== "HEADER") {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace(/^#+\s*/, '').replace(/[:*_-]/g, '').trim(),
          lines: []
        };
      } else {
        currentSection.lines.push(line);
      }
    }
    if (currentSection.lines.length > 0) {
      sections.push(currentSection);
    }
    return sections;
  };

  const sections = parseSections(resumeText);

  const isBulletLine = (line) => {
    const trimmed = line.trim();
    return trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+[.)]/.test(trimmed);
  };

  const cleanBulletText = (line) => {
    return line.trim().replace(/^[•\-*]\s*/, '').replace(/^\d+[.)]\s*/, '');
  };

  const dateRegex = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\d{4})\s*(?:\d{4})?\s*[-–—]\s*(?:Present|Current|\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{4}))/i;

  // Render text with markdown bold support and optional keyword highlights
  const renderTextWithHighlights = (textStr) => {
    if (!textStr) return null;

    // Helper to render bold spans for **word** or \textbf{word}
    const renderMarkdownBold = (str, keyPrefix = 'txt') => {
      const parts = str.split(/(\*\*[^*]+\*\*|\\textbf\{[^}]+\})/g);
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={`${keyPrefix}-b-${idx}`} style={{ fontWeight: 700, color: '#000000' }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('\\textbf{') && part.endsWith('}')) {
          return <strong key={`${keyPrefix}-tb-${idx}`} style={{ fontWeight: 700, color: '#000000' }}>{part.slice(8, -1)}</strong>;
        }
        return part;
      });
    };

    if (!highlightKeywords || !jdKeywordsData?.keywords) {
      return renderMarkdownBold(textStr);
    }

    const keywords = jdKeywordsData.keywords.map(k => k.name).filter(Boolean);
    if (keywords.length === 0) return renderMarkdownBold(textStr);

    const escaped = keywords.slice(0, 30).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    if (!escaped) return renderMarkdownBold(textStr);

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
      return renderMarkdownBold(part, `kw-${i}`);
    });
  };

  // Helper to render Contact Header matching Overleaf screenshot
  const renderCandidateHeader = (sec) => {
    const lines = sec.lines.filter(l => l.trim().length > 0);
    const candidateName = lines[0] || "UTKARSH CHATURVEDI";
    const sublines = lines.slice(1);

    let locationStr = "Gurgaon, Haryana";
    let phoneStr = "";
    let emailStr = "";
    let linkedInStr = "";
    let gitHubStr = "";

    const fullSubText = sublines.join(' ');

    // 1. Phone extraction
    const phoneMatch = fullSubText.match(/(\+?\d{1,3}[\s-]?\d{5}[\s-]?\d{5}|\+?\d{10,12})/);
    if (phoneMatch) phoneStr = phoneMatch[1].trim();

    // 2. Email extraction
    const emailMatch = fullSubText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) emailStr = emailMatch[1].trim();

    // 3. LinkedIn extraction
    const linkedInMatch = fullSubText.match(/(?:https?:\/\/)?(?:www\.)?(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
    if (linkedInMatch) linkedInStr = linkedInMatch[1].trim();

    // 4. GitHub extraction
    const gitHubMatch = fullSubText.match(/(?:https?:\/\/)?(?:www\.)?(github\.com\/[a-zA-Z0-9_-]+)/i);
    if (gitHubMatch) gitHubStr = gitHubMatch[1].trim();

    // 5. Location extraction
    for (const line of sublines) {
      const cleanLine = line.replace(/[\u0080-\u009F\uF000-\uFFFFï§#\u00A7\u00EF\u0083|•]/g, ' ').trim();
      if (/gurgaon|delhi|bangalore|mumbai|san francisco|california|new york|mathura|india/i.test(cleanLine)) {
        const tokens = cleanLine.split(/\s{2,}|,/);
        if (tokens.length >= 2) {
          locationStr = cleanLine.split('|')[0].trim();
        }
      }
    }

    return (
      <div className="resume-header">
        <div className="candidate-name">{candidateName}</div>
        
        {locationStr && (
          <div className="location-line">
            {locationStr}
          </div>
        )}

        {/* Row 1: Phone, Email, LinkedIn */}
        <div className="contact-line">
          {phoneStr && (
            <span className="contact-item">
              <PhoneIcon />
              <span>{phoneStr}</span>
            </span>
          )}

          {emailStr && (
            <span className="contact-item">
              <EnvelopeIcon />
              <a href={`mailto:${emailStr}`}>
                {emailStr}
              </a>
            </span>
          )}

          {linkedInStr && (
            <span className="contact-item">
              <LinkedInIcon />
              <a href={`https://${linkedInStr}`} target="_blank" rel="noopener noreferrer">
                {linkedInStr}
              </a>
            </span>
          )}
        </div>

        {/* Row 2: GitHub */}
        {gitHubStr && (
          <div className="contact-line">
            <span className="contact-item">
              <GitHubIcon />
              <a href={`https://${gitHubStr}`} target="_blank" rel="noopener noreferrer">
                {gitHubStr}
              </a>
            </span>
          </div>
        )}
      </div>
    );
  };

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
          const parts = line.split('|');
          clusters.push({
            type: 'project-header',
            title: parts[0].trim(),
            tech: parts[1] ? parts[1].trim() : ''
          });
        } else if (isSkills && line.includes(':')) {
          const [cat, items] = line.split(/:(.+)/);
          clusters.push({ type: 'skill', category: cat.trim(), items: (items || '').trim() });
        } else if (line.trim().length > 0) {
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
              <div key={ci} className="latex-job-block" style={{ marginTop: ci > 0 ? '5pt' : '1.5pt', marginBottom: '1.5pt' }}>
                <div className="role-header-top">
                  <span className="company-name" style={{ color: '#000000', fontWeight: 700 }}>
                    {cluster.topLabel}
                    {isExternalLinkCompany && (
                      <ExternalLink size={9} style={{ display: 'inline', marginLeft: '3px', verticalAlign: 'middle', color: '#0000ee' }} />
                    )}
                  </span>
                  <span className="timeline-dates" style={{ fontWeight: 400, color: '#000000' }}>{cluster.dateStr}</span>
                </div>
                {(cluster.subLeft || cluster.subRight) && (
                  <div className="role-header-sub">
                    <span className="role-title" style={{ fontStyle: 'italic', color: '#000000' }}>{cluster.subLeft}</span>
                    <span className="role-location" style={{ fontStyle: 'italic', color: '#000000' }}>{cluster.subRight}</span>
                  </div>
                )}
              </div>
            );
          }

          if (cluster.type === 'project-header') {
            return (
              <div key={ci} style={{ marginTop: ci > 0 ? '5pt' : '1.5pt', marginBottom: '1.5pt', fontSize: '9.75pt' }}>
                <strong style={{ color: '#000000', fontWeight: 700 }}>{cluster.title}</strong>
                <ExternalLink size={9} style={{ display: 'inline', marginLeft: '3px', marginRight: '5px', verticalAlign: 'middle', color: '#0000ee' }} />
                {cluster.tech && <span style={{ color: '#000000', fontStyle: 'normal' }}>| {cluster.tech}</span>}
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
            <p key={ci} style={{ marginBottom: '2.5pt', lineHeight: '1.28' }}>
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
      <div className="panel-header resume-toolbar no-print" style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'sheet' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.725rem' }}
            onClick={() => setActiveTab('sheet')}
          >
            <Eye size={12} />
            Formatted Sheet
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'diff' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.725rem' }}
            onClick={() => setActiveTab('diff')}
          >
            <Layers size={12} />
            Bullet Impact Diff ({bulletChanges.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'raw' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.725rem' }}
            onClick={() => setActiveTab('raw')}
          >
            <FileText size={12} />
            Original Verbatim
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {activeTab === 'sheet' && (
            <>
              {/* LaTeX / Modern ATS Template Toggle */}
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
          <strong>LaTeX / Overleaf Mode Active:</strong> Authentic Computer Modern Serif font, exact 0.4in margins, FontAwesome icons, and 4-corner company alignment.
        </span>
      </div>

      <div className="panel-body" style={{ background: 'rgba(8, 12, 22, 0.95)', padding: '0.75rem 0.5rem', overflowX: 'auto' }}>
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
