import React, { useState } from 'react';
import { Copy, Check, Printer, Eye, Edit3, Sparkles, Layers, Minimize2, Maximize2, FileText, GraduationCap, ExternalLink, Crown } from 'lucide-react';
import DiffViewer from './DiffViewer';

// Authentic FontAwesome solid & brand SVGs matching Overleaf LaTeX template
const PhoneIcon = () => (
  <svg width="10" height="10" viewBox="0 0 512 512" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M493.4 401.3l-104-74.3c-11.4-8.1-26.8-6.1-35.9 4.7l-46.7 54.5c-59.2-29.8-107.5-78.1-137.3-137.3l54.5-46.7c10.8-9.1 12.8-24.5 4.7-35.9L154.4 62.6C146.1 50.8 129.9 47 117.4 54.3L27.6 106.6C10.7 116.5 0 134.7 0 154.4 0 351.9 160.1 512 357.6 512c19.7 0 37.9-10.7 47.8-27.6l52.3-89.8c7.3-12.5 3.5-28.7-8.3-37z"/>
  </svg>
);

const EnvelopeIcon = () => (
  <svg width="10" height="10" viewBox="0 0 512 512" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="10" height="10" viewBox="0 0 448 512" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="10" height="10" viewBox="0 0 496 512" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="10" height="10" viewBox="0 0 496 512" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-64c-7.3-39.7-27.1-75.1-55.8-101.4C392.5 125.6 373.1 160 361.3 192h115.4zM17.3 192h115.4c-11.8-32-31.2-66.4-59.6-101.4C44.4 116.9 24.6 152.3 17.3 192zM248 504c39.8 0 74-62.7 88.5-152h-177c14.5 89.3 48.7 152 88.5 152zm173.1-152c11.8-32 31.2-66.4 59.6-101.4 7.3 39.7 27.1 75.1 55.8 101.4H421.1zm-346.2 0H17.3c-7.3 39.7-27.1 75.1-55.8 101.4 28.4-35 47.8-69.4 59.6-101.4z" />
  </svg>
);

export default function ResumePreview({
  resumeText,
  onUpdateResumeText,
  bulletChanges = [],
  jdKeywordsData,
  onPrint,
  isPro,
  onOpenSubscription,
  structuredResume = null
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

  const SECTION_TITLES = new Set([
    'SUMMARY', 'PROFESSIONAL SUMMARY', 'EXECUTIVE SUMMARY', 'OBJECTIVE', 'PROFILE', 'ABOUT', 'ABOUT ME',
    'EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'EMPLOYMENT HISTORY', 'EMPLOYMENT', 'WORK HISTORY',
    'EDUCATION', 'ACADEMIC BACKGROUND', 'ACADEMICS', 'EDUCATION & TRAINING', 'EDUCATION & CREDENTIALS',
    'TECHNICAL SKILLS', 'SKILLS', 'CORE COMPETENCIES', 'AREAS OF EXPERTISE', 'TECHNOLOGIES', 'TOOLS',
    'PROJECTS', 'PERSONAL PROJECTS', 'KEY PROJECTS', 'SIDE PROJECTS', 'OPEN SOURCE',
    'CERTIFICATIONS', 'LICENSES', 'AWARDS', 'PUBLICATIONS', 'HONORS', 'PATENTS',
    'VOLUNTEER', 'VOLUNTEER EXPERIENCE', 'VOLUNTEER WORK', 'COMMUNITY', 'COMMUNITY INVOLVEMENT',
    'LANGUAGES', 'INTERESTS', 'ACTIVITIES', 'ACHIEVEMENTS', 'AFFILIATIONS',
    'PROFESSIONAL DEVELOPMENT', 'TRAINING', 'COURSES', 'REFERENCES'
  ]);

  const isSectionHeader = (line, lineIndex = 1) => {
    if (lineIndex === 0) return false;
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.length > 50) return false;
    if (/@|\.com|\.in|\.org|\+?\d{10}/i.test(trimmed)) return false;

    const clean = trimmed.replace(/^#+\s*/, '').replace(/[:*_\-=]/g, '').trim().toUpperCase();
    if (SECTION_TITLES.has(clean)) return true;
    for (const title of SECTION_TITLES) {
      if (clean === title || clean.startsWith(title + ' ') || clean.startsWith(title + ':')) return true;
    }
    // Generic ALL-CAPS line after header lines
    if (lineIndex > 3 && clean.length >= 4 && clean.length <= 35 && clean === clean.toUpperCase() && /^[A-Z\s&/\\-]+$/.test(clean)) {
      const words = clean.split(/\s+/);
      if (words.length <= 2 && !/EXPERIENCE|PROJECTS|EDUCATION|SKILLS|AWARDS|COMMUNITY|SERVICE|LEADERSHIP|ACTIVITIES/i.test(clean)) {
        return false;
      }
      return true;
    }
    return false;
  };

  // Parse raw text into structured sections (fallback when structured JSON is not used)
  const parseSections = (text) => {
    if (!text) return [];
    const rawLines = text.split('\n');
    const firstNonEmptyIdx = rawLines.findIndex(l => l.trim().length > 0);
    const sections = [];
    let currentSection = { title: "HEADER", lines: [] };

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      if (isSectionHeader(line, i - firstNonEmptyIdx)) {
        if (currentSection.lines.length > 0 || currentSection.title !== "HEADER") {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace(/^#+\s*/, '').replace(/[:*_\-=]/g, '').trim(),
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
    return trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('–') || /^\d+[.)]\s/.test(trimmed);
  };

  const cleanBulletText = (line) => {
    return line.trim().replace(/^[•\-*–]\s*/, '').replace(/^\d+[.)]\s*/, '');
  };

  const dateRegex = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\d{4})\s*(?:\d{0,4})?\s*[-–—]\s*(?:Present|Current|Now|\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{0,4}))/i;

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

  // Structured Candidate Header (High Fidelity)
  const renderStructuredCandidateHeader = (header) => {
    if (!header) return null;
    const candidateName = header.name || "Candidate Name";
    const locationStr = header.location || "";
    const phoneStr = header.phone || "";
    const emailStr = header.email || "";
    const linkedInStr = header.linkedin || "";
    const gitHubStr = header.github || "";
    const websiteStr = header.website || header.portfolio || "";

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
              <a href={linkedInStr.startsWith('http') ? linkedInStr : `https://${linkedInStr}`} target="_blank" rel="noopener noreferrer">
                {linkedInStr.replace(/^https?:\/\/(www\.)?/i, '')}
              </a>
            </span>
          )}
        </div>

        {/* Row 2: GitHub & Website */}
        {(gitHubStr || websiteStr) && (
          <div className="contact-line">
            {gitHubStr && (
              <span className="contact-item">
                <GitHubIcon />
                <a href={gitHubStr.startsWith('http') ? gitHubStr : `https://${gitHubStr}`} target="_blank" rel="noopener noreferrer">
                  {gitHubStr.replace(/^https?:\/\/(www\.)?/i, '')}
                </a>
              </span>
            )}
            {websiteStr && (
              <span className="contact-item">
                <GlobeIcon />
                <a href={websiteStr.startsWith('http') ? websiteStr : `https://${websiteStr}`} target="_blank" rel="noopener noreferrer">
                  {websiteStr.replace(/^https?:\/\/(www\.)?/i, '')}
                </a>
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Structured Section Rendering
  const renderStructuredSection = (sec, secIdx) => {
    return (
      <div key={secIdx} className="resume-section">
        <div className="section-title">{sec.title}</div>
        <div className="section-content">
          {sec.entries && sec.entries.map((entry, ei) => {
            // Skills category
            if (sec.type === 'skills') {
              const categoryLabel = entry.role || entry.organization || 'Skills';
              const skillsContent = entry.description || (entry.bullets && entry.bullets.join(', ')) || '';
              return (
                <div key={ei} className="skill-category">
                  <strong>{categoryLabel}:</strong> {renderTextWithHighlights(skillsContent)}
                </div>
              );
            }

            // Summary or single-block description
            if (sec.type === 'summary' || (!entry.organization && !entry.role && entry.description)) {
              return (
                <div key={ei} style={{ marginBottom: '2.5pt' }}>
                  {entry.description && (
                    <p style={{ marginBottom: entry.bullets && entry.bullets.length > 0 ? '2pt' : '2.5pt', lineHeight: '1.28' }}>
                      {renderTextWithHighlights(entry.description)}
                    </p>
                  )}
                  {entry.bullets && entry.bullets.length > 0 && (
                    <ul className="bullet-list">
                      {entry.bullets.map((bText, bi) => {
                        const wasModified = bulletChanges.some(bc => bc.upgraded && (bc.upgraded.includes(bText) || bText.includes(bc.upgraded)));
                        return (
                          <li key={bi} className={`bullet-item ${wasModified && highlightDiff ? 'modified' : ''}`}>
                            {renderTextWithHighlights(bText)}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            }

            // Projects
            if (sec.type === 'projects') {
              const projectTitle = entry.organization || entry.role || 'Project';
              return (
                <div key={ei} style={{ marginTop: ei > 0 ? '5pt' : '1.5pt', marginBottom: '1.5pt' }}>
                  <div style={{ fontSize: '9.75pt', marginBottom: '1pt' }}>
                    <strong style={{ color: '#000000', fontWeight: 700 }}>{projectTitle}</strong>
                    {entry.tech && <span style={{ color: '#000000', fontStyle: 'normal' }}> | {entry.tech}</span>}
                  </div>
                  {entry.description && (
                    <p style={{ marginBottom: '2pt', lineHeight: '1.28' }}>
                      {renderTextWithHighlights(entry.description)}
                    </p>
                  )}
                  {entry.bullets && entry.bullets.length > 0 && (
                    <ul className="bullet-list">
                      {entry.bullets.map((bText, bi) => {
                        const wasModified = bulletChanges.some(bc => bc.upgraded && (bc.upgraded.includes(bText) || bText.includes(bc.upgraded)));
                        return (
                          <li key={bi} className={`bullet-item ${wasModified && highlightDiff ? 'modified' : ''}`}>
                            {renderTextWithHighlights(bText)}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            }

            // Experience, Education, or 4-Corner Layout Entries
            const topTitle = entry.organization || entry.role || '';
            const topDate = entry.dates || '';
            const subLeft = entry.organization ? (entry.role || '') : '';
            const subRight = entry.location || '';
            const hasSubRow = Boolean(subLeft || subRight);

            return (
              <div key={ei} className="latex-job-block" style={{ marginTop: ei > 0 ? '5pt' : '1.5pt', marginBottom: '1.5pt' }}>
                <div className="role-header-top">
                  <span className="company-name" style={{ color: '#000000', fontWeight: 700 }}>
                    {topTitle}
                  </span>
                  {topDate && (
                    <span className="timeline-dates" style={{ fontWeight: 400, color: '#000000' }}>
                      {topDate}
                    </span>
                  )}
                </div>

                {hasSubRow && (
                  <div className="role-header-sub">
                    <span className="role-title" style={{ fontStyle: 'italic', color: '#000000' }}>
                      {subLeft}
                    </span>
                    {subRight && (
                      <span className="role-location" style={{ fontStyle: 'italic', color: '#000000' }}>
                        {subRight}
                      </span>
                    )}
                  </div>
                )}

                {entry.description && (
                  <p style={{ marginBottom: '2pt', lineHeight: '1.28' }}>
                    {renderTextWithHighlights(entry.description)}
                  </p>
                )}

                {entry.bullets && entry.bullets.length > 0 && (
                  <ul className="bullet-list">
                    {entry.bullets.map((bText, bi) => {
                      const wasModified = bulletChanges.some(bc => bc.upgraded && (bc.upgraded.includes(bText) || bText.includes(bc.upgraded)));
                      return (
                        <li key={bi} className={`bullet-item ${wasModified && highlightDiff ? 'modified' : ''}`}>
                          {renderTextWithHighlights(bText)}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Heuristic Candidate Header Fallback (No Hardcoded Fallbacks)
  const renderCandidateHeader = (sec) => {
    const lines = sec.lines.filter(l => l.trim().length > 0);
    const candidateName = lines[0] || "Candidate Name";
    const sublines = lines.slice(1);

    let locationStr = "";
    let phoneStr = "";
    let emailStr = "";
    let linkedInStr = "";
    let gitHubStr = "";
    let websiteStr = "";

    const fullSubText = sublines.join(' ');

    // 1. Phone extraction
    const phoneMatch = fullSubText.match(/(\+?\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,5}[\s.-]?\d{3,5}|\+?\d{10,12})/);
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

    // 5. Website extraction
    const urlMatches = fullSubText.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9][a-zA-Z0-9\-]*\.[a-zA-Z]{2,}(?:\/[^\s|]*)?)/gi);
    if (urlMatches) {
      for (const url of urlMatches) {
        if (!/linkedin|github|mailto|gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com/i.test(url)) {
          if (!emailStr || !emailStr.includes(url)) {
            websiteStr = url.trim();
            break;
          }
        }
      }
    }

    // 6. Generic Location extraction: "City, State" or "City, Country"
    for (const line of sublines) {
      const cleanLine = line.replace(/[\u0080-\u009F\uE000-\uF8FF\uFFF0-\uFFFF|•#]/g, ' ').trim();
      const locMatch = cleanLine.match(/\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*,\s*[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\b/);
      if (locMatch && !/@/.test(locMatch[1]) && !/linkedin|github|http/i.test(locMatch[1])) {
        locationStr = locMatch[1].trim();
        break;
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
              <a href={linkedInStr.startsWith('http') ? linkedInStr : `https://${linkedInStr}`} target="_blank" rel="noopener noreferrer">
                {linkedInStr.replace(/^https?:\/\/(www\.)?/i, '')}
              </a>
            </span>
          )}
        </div>

        {/* Row 2: GitHub & Website */}
        {(gitHubStr || websiteStr) && (
          <div className="contact-line">
            {gitHubStr && (
              <span className="contact-item">
                <GitHubIcon />
                <a href={gitHubStr.startsWith('http') ? gitHubStr : `https://${gitHubStr}`} target="_blank" rel="noopener noreferrer">
                  {gitHubStr.replace(/^https?:\/\/(www\.)?/i, '')}
                </a>
              </span>
            )}
            {websiteStr && (
              <span className="contact-item">
                <GlobeIcon />
                <a href={websiteStr.startsWith('http') ? websiteStr : `https://${websiteStr}`} target="_blank" rel="noopener noreferrer">
                  {websiteStr.replace(/^https?:\/\/(www\.)?/i, '')}
                </a>
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Heuristic Section Content Fallback (No Hardcoded Companies)
  const renderSectionContent = (sec) => {
    const isExperience = sec.title.toUpperCase().includes("EXPERIENCE") || sec.title.toUpperCase().includes("EMPLOYMENT") || sec.title.toUpperCase().includes("WORK");
    const isEducation = sec.title.toUpperCase().includes("EDUCATION") || sec.title.toUpperCase().includes("ACADEMIC");
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
          let topLabel = line.slice(0, dateMatch.index).trim();
          if (topLabel.endsWith('|') || topLabel.endsWith('–') || topLabel.endsWith('-')) {
            topLabel = topLabel.slice(0, -1).trim();
          }
          
          let subLeft = '';
          let subRight = '';
          if (i + 1 < lines.length && !isBulletLine(lines[i + 1]) && !isSectionHeader(lines[i + 1], i + 1)) {
            const nextLine = lines[i + 1];
            if (nextLine.includes(' — ') || nextLine.includes(' - ') || nextLine.includes(' | ')) {
              const parts = nextLine.split(/\s+[—\-|]\s+/);
              subLeft = parts[0]?.trim();
              subRight = parts.slice(1).join(' | ').trim();
              i++;
            } else if (nextLine.includes('  ')) {
              const parts = nextLine.split(/\s{2,}/);
              subLeft = parts[0]?.trim();
              subRight = parts.slice(1).join(' ').trim();
              i++;
            } else if (nextLine.length < 80) {
              subLeft = nextLine.trim();
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
          const parts = line.split(/[|–]/);
          clusters.push({
            type: 'project-header',
            title: parts[0].trim(),
            tech: parts[1] ? parts.slice(1).join(' | ').trim() : ''
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
            return (
              <div key={ci} className="latex-job-block" style={{ marginTop: ci > 0 ? '5pt' : '1.5pt', marginBottom: '1.5pt' }}>
                <div className="role-header-top">
                  <span className="company-name" style={{ color: '#000000', fontWeight: 700 }}>
                    {cluster.topLabel}
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
                {cluster.tech && <span style={{ color: '#000000', fontStyle: 'normal' }}> | {cluster.tech}</span>}
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

  const hasStructuredData = Boolean(
    structuredResume &&
    structuredResume.header &&
    structuredResume.sections &&
    structuredResume.sections.length > 0
  );

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

        <div className="preview-toolbar" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
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
                  borderColor: density === 'compact' ? 'rgba(168, 85, 247, 0.4)' : 'var(--border-subtle)'
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

          {/* Watermark / Pro Subscription Toggle Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{
              fontSize: '0.725rem',
              color: isPro ? '#34d399' : '#c084fc',
              borderColor: isPro ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.4)',
              background: isPro ? 'rgba(16, 185, 129, 0.1)' : 'rgba(168, 85, 247, 0.1)'
            }}
            onClick={onOpenSubscription}
            title={isPro ? "Pro Member: 100% Watermark-Free Active" : "Subscribe to Pro for a small fee to remove watermark"}
          >
            <Crown size={12} />
            {isPro ? '👑 Pro: No Watermark' : '⚡ Remove Watermark'}
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
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.7rem',
        color: '#e9d5ff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <GraduationCap size={13} style={{ color: '#c084fc', flexShrink: 0 }} />
          <span>
            <strong>LaTeX / Overleaf Mode Active:</strong> Authentic Computer Modern Serif font & 0.4in margins. Universal parser active for all resume formats.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {isPro ? (
            <span style={{ color: '#34d399', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Crown size={12} /> 100% Watermark-Free Active
            </span>
          ) : (
            <button
              type="button"
              onClick={onOpenSubscription}
              style={{
                background: 'rgba(168, 85, 247, 0.2)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                color: '#c084fc',
                borderRadius: '4px',
                padding: '0.15rem 0.5rem',
                fontSize: '0.68rem',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Crown size={11} /> Subscribe to remove watermark
            </button>
          )}
        </div>
      </div>

      <div className="panel-body" style={{ background: 'rgba(8, 12, 22, 0.95)', padding: '0.75rem 0.5rem', overflowX: 'auto' }}>
        {activeTab === 'diff' ? (
          <DiffViewer bulletChanges={bulletChanges} />
        ) : activeTab === 'raw' ? (
          /* EXACT ORIGINAL VERBATIM VIEW */
          <div id="resume-printable-area" className="resume-sheet-container">
            <div className={`resume-paper ${templateStyle === 'latex' ? 'latex-mode' : ''} ${density === 'compact' ? 'compact-mode' : ''}`} style={{ whiteSpace: 'pre-wrap' }}>
              {renderTextWithHighlights(resumeText)}
              <div className={`resume-watermark-footer ${isPro ? 'pro-hidden' : ''}`}>
                <span className="resume-watermark-tag">
                  Built with Resumezy ATS Shield (guidezy.in/resumezy)
                </span>
                <button
                  type="button"
                  className="no-print resume-watermark-pro-btn"
                  onClick={onOpenSubscription}
                  title="Subscribe to Pro to remove this watermark from exported PDFs"
                >
                  👑 Remove Watermark (Pro)
                </button>
              </div>
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
          /* FORMATTED SHEET VIEW (STRUCTURED JSON OR HEURISTIC) */
          <div id="resume-printable-area" className="resume-sheet-container">
            <div className={`resume-paper ${templateStyle === 'latex' ? 'latex-mode' : ''} ${density === 'compact' ? 'compact-mode' : ''} ${highlightDiff ? 'highlight-diff' : ''}`}>
              {hasStructuredData ? (
                <>
                  {renderStructuredCandidateHeader(structuredResume.header)}
                  {structuredResume.sections.map((sec, secIdx) => renderStructuredSection(sec, secIdx))}
                </>
              ) : (
                sections && sections.map((sec, secIdx) => {
                  if (sec.title === "HEADER") {
                    return <React.Fragment key={secIdx}>{renderCandidateHeader(sec)}</React.Fragment>;
                  }

                  return (
                    <div key={secIdx} className="resume-section">
                      <div className="section-title">{sec.title}</div>
                      {renderSectionContent(sec)}
                    </div>
                  );
                })
              )}
              <div className={`resume-watermark-footer ${isPro ? 'pro-hidden' : ''}`}>
                <span className="resume-watermark-tag">
                  Built with Resumezy ATS Shield (guidezy.in/resumezy)
                </span>
                <button
                  type="button"
                  className="no-print resume-watermark-pro-btn"
                  onClick={onOpenSubscription}
                  title="Subscribe to Pro to remove this watermark from exported PDFs"
                >
                  👑 Remove Watermark (Pro)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
