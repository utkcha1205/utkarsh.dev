/**
 * AI-Powered Universal Resume Structurer
 * 
 * Works with ANY resume format (Overleaf/LaTeX, Word, Google Docs, LinkedIn PDF, text).
 * - Primary: Gemini AI structured parsing (schema-enforced JSON)
 * - Fallback: Universal Heuristic parser (regex + structure detection, 0 API dependencies)
 */

const STRUCTURE_PROMPT = `You are an expert resume parser. Parse the following resume text into a clean, structured JSON object.

Return ONLY a JSON object with this exact schema:
{
  "header": {
    "name": "Full Name",
    "location": "City, State/Country" or null,
    "phone": "+1 234 567 8901" or null,
    "email": "user@example.com" or null,
    "linkedin": "linkedin.com/in/username" or null,
    "github": "github.com/username" or null,
    "website": "example.com" or null,
    "portfolio": "portfolio url" or null
  },
  "sections": [
    {
      "title": "Section Title",
      "type": "summary" | "experience" | "education" | "skills" | "projects" | "certifications" | "other",
      "entries": [
        {
          "organization": "Company, University, or Institution Name" or null,
          "role": "Job Title or Degree" or null,
          "dates": "Start Date – End Date" or null,
          "location": "City, State/Country" or null,
          "bullets": ["bullet point 1", "bullet point 2"],
          "description": "plain text description if not bulleted" or null,
          "tech": "Technologies used (for projects)" or null
        }
      ]
    }
  ]
}

Strict Rules:
1. Parse ALL sections present in the resume. Never drop non-standard sections (e.g. Volunteer, Languages, Publications, Awards).
2. For Summary/Objective/Profile sections, put text in a single entry with the "description" field.
3. For Skills sections, put each skill category as an entry where "role" is category name (e.g. "Languages", "Cloud") and "description" is the comma-separated skills list.
4. For Experience & Education, extract organization, role, dates, location, and bullet points into the 4-corner fields.
5. Preserve bullet text EXACTLY as written — DO NOT paraphrase, fix typos, or omit details.
6. If a field is not present, use null (not empty string or "N/A").
7. Preserve the candidate's original section order.`;

/**
 * Structure a resume using Gemini AI
 * @param {string} rawText - Raw extracted resume text
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<Object|null>} Structured resume JSON or null on failure
 */
export async function structureResumeWithAI(rawText, apiKey) {
  if (!rawText || rawText.trim().length < 50) return null;

  const effectiveKey = apiKey || (typeof window !== "undefined" ? localStorage.getItem("resumezy_api_key") : null);
  if (!effectiveKey) return null;

  try {
    return await directGeminiStructure(rawText, effectiveKey);
  } catch (err) {
    console.warn("Resume structuring failed, will use heuristic fallback:", err);
    return null;
  }
}

/**
 * Direct Gemini API call for resume structuring
 */
async function directGeminiStructure(rawText, apiKey) {
  const candidateModels = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-2.5-pro"
  ];

  for (const model of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: STRUCTURE_PROMPT + "\n\nResume Text:\n---\n" + rawText + "\n---\n\nReturn valid JSON only." }]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        })
      });

      if (!res.ok) continue;

      const apiData = await res.json();
      const textContent = apiData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textContent) continue;

      const parsed = JSON.parse(textContent);

      // Validate basic structure
      if (parsed && parsed.header && parsed.sections && Array.isArray(parsed.sections)) {
        return parsed;
      }
    } catch (e) {
      console.warn("Gemini model " + model + " failed for structuring:", e.message);
      continue;
    }
  }

  return null;
}

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

function isSectionTitleLine(line, lineIndex, firstNonEmptyIdx) {
  if (lineIndex === firstNonEmptyIdx) return false;
  const trimmed = line.trim();
  if (trimmed.length === 0 || trimmed.length > 50) return false;
  if (/@|\.com|\.in|\.org|\+?\d{10}/i.test(trimmed)) return false;

  const clean = trimmed.replace(/^#+\s*/, '').replace(/[:*_\-=]/g, '').trim().toUpperCase();
  if (SECTION_TITLES.has(clean)) return true;
  for (const t of SECTION_TITLES) {
    if (clean === t || clean.startsWith(t + ' ') || clean.startsWith(t + ':')) return true;
  }
  // Generic all-caps line (e.g. LEADERSHIP, AFFILIATIONS) after the first 3 lines
  if (lineIndex > 3 && clean.length >= 4 && clean.length <= 35 && clean === clean.toUpperCase() && /^[A-Z\s&/\\-]+$/.test(clean)) {
    const words = clean.split(/\s+/);
    if (words.length <= 2 && !/EXPERIENCE|PROJECTS|EDUCATION|SKILLS|AWARDS|COMMUNITY|SERVICE|LEADERSHIP|ACTIVITIES/i.test(clean)) {
      return false;
    }
    return true;
  }
  return false;
}

const DATE_REGEX = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\d{4})\s*(?:\d{0,4})?\s*[-–—]\s*(?:Present|Current|Now|\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{0,4}))/i;

const isBulletLine = (line) => {
  const t = line.trim();
  return t.startsWith('•') || t.startsWith('-') || t.startsWith('*') || t.startsWith('–') || /^\d+[.)]\s/.test(t);
};

const cleanBullet = (line) => {
  return line.trim().replace(/^[•\-*–]\s*/, '').replace(/^\d+[.)]\s*/, '');
};

const classifySection = (title) => {
  const upper = title.toUpperCase();
  if (/SUMMARY|OBJECTIVE|PROFILE|ABOUT/i.test(upper)) return 'summary';
  if (/EXPERIENCE|EMPLOYMENT|WORK/i.test(upper)) return 'experience';
  if (/EDUCATION|ACADEMIC/i.test(upper)) return 'education';
  if (/SKILL|COMPETENC|TOOL|TECHNOLOG|EXPERTISE/i.test(upper)) return 'skills';
  if (/PROJECT/i.test(upper)) return 'projects';
  if (/CERTIF|LICENSE|AWARD|HONOR|PUBLICATION/i.test(upper)) return 'certifications';
  return 'other';
};

/**
 * Universal Heuristic Fallback Parser
 * High accuracy across all standard resume layouts without requiring an API key.
 */
export function structureResumeHeuristic(rawText) {
  if (!rawText || rawText.trim().length < 50) return null;

  const lines = rawText.split('\n');
  const firstNonEmptyIdx = lines.findIndex(l => l.trim().length > 0);
  if (firstNonEmptyIdx === -1) return null;

  let headerEndIdx = lines.length;
  for (let i = firstNonEmptyIdx; i < Math.min(lines.length, 15); i++) {
    if (isSectionTitleLine(lines[i], i, firstNonEmptyIdx)) {
      headerEndIdx = i;
      break;
    }
  }

  const headerLines = lines.slice(firstNonEmptyIdx, headerEndIdx).filter(l => l.trim().length > 0);
  const headerText = headerLines.join(' ');

  const result = {
    header: {
      name: headerLines[0]?.trim() || "Candidate Name",
      location: null,
      phone: null,
      email: null,
      linkedin: null,
      github: null,
      website: null,
      portfolio: null
    },
    sections: []
  };

  // Contact Info Extraction
  const phoneMatch = headerText.match(/(\+?\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,5}[\s.-]?\d{3,5}|\+?\d{10,12})/);
  if (phoneMatch) result.header.phone = phoneMatch[1].trim();

  const emailMatch = headerText.match(/([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) result.header.email = emailMatch[1].trim();

  const linkedInMatch = headerText.match(/(?:https?:\/\/)?(?:www\.)?(linkedin\.com\/in\/[a-zA-Z0-9_\-]+)/i);
  if (linkedInMatch) result.header.linkedin = linkedInMatch[1].trim();

  const gitHubMatch = headerText.match(/(?:https?:\/\/)?(?:www\.)?(github\.com\/[a-zA-Z0-9_\-]+)/i);
  if (gitHubMatch) result.header.github = gitHubMatch[1].trim();

  const urlMatches = headerText.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9][a-zA-Z0-9\-]*\.[a-zA-Z]{2,}(?:\/[^\s|]*)?)/gi);
  if (urlMatches) {
    for (const url of urlMatches) {
      if (!/linkedin|github|mailto|gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com/i.test(url)) {
        if (!result.header.email || !result.header.email.includes(url)) {
          result.header.website = url.trim();
          break;
        }
      }
    }
  }

  // Location: Search lines 1+ for "City, State" or "City, Country"
  for (let i = 1; i < headerLines.length; i++) {
    const clean = headerLines[i].replace(/[\u0080-\u009F\uE000-\uF8FF|•#]/g, ' ').trim();
    const locMatch = clean.match(/\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*,\s*[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\b/);
    if (locMatch && !/@/.test(locMatch[1]) && !/linkedin|github|http/i.test(locMatch[1])) {
      result.header.location = locMatch[1].trim();
      break;
    }
  }

  // Sections Parsing
  let currentSection = null;

  for (let i = headerEndIdx; i < lines.length; i++) {
    const line = lines[i];

    if (isSectionTitleLine(line, i, -1)) {
      if (currentSection) result.sections.push(currentSection);
      const title = line.replace(/^#+\s*/, '').replace(/[:*_\-=]/g, '').trim();
      currentSection = { title, type: classifySection(title), entries: [] };
      continue;
    }

    if (!currentSection) continue;
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;
    const type = currentSection.type;

    if (type === 'summary') {
      if (currentSection.entries.length === 0) {
        currentSection.entries.push({ organization: null, role: null, dates: null, location: null, bullets: [], description: '', tech: null });
      }
      const entry = currentSection.entries[0];
      if (isBulletLine(line)) {
        entry.bullets.push(cleanBullet(line));
      } else {
        entry.description = (entry.description ? entry.description + ' ' : '') + trimmed;
      }
    } else if (type === 'skills') {
      if (trimmed.includes(':')) {
        const colonIdx = trimmed.indexOf(':');
        const cat = trimmed.slice(0, colonIdx).trim();
        const items = trimmed.slice(colonIdx + 1).trim();
        currentSection.entries.push({ organization: null, role: cat, dates: null, location: null, bullets: [], description: items, tech: null });
      } else if (isBulletLine(line)) {
        if (currentSection.entries.length === 0) {
          currentSection.entries.push({ organization: null, role: null, dates: null, location: null, bullets: [], description: null, tech: null });
        }
        currentSection.entries[currentSection.entries.length - 1].bullets.push(cleanBullet(line));
      } else {
        currentSection.entries.push({ organization: null, role: null, dates: null, location: null, bullets: [], description: trimmed, tech: null });
      }
    } else if (type === 'experience' || type === 'education') {
      const dateMatch = line.match(DATE_REGEX);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        let orgStr = line.slice(0, dateMatch.index).trim();
        if (orgStr.endsWith('|') || orgStr.endsWith('–') || orgStr.endsWith('-')) {
          orgStr = orgStr.slice(0, -1).trim();
        }

        let roleStr = null;
        let locStr = null;

        // Check if next line contains role/location
        if (i + 1 < lines.length && !isBulletLine(lines[i + 1]) && !isSectionTitleLine(lines[i + 1], i + 1, -1)) {
          const nextLine = lines[i + 1].trim();
          if (nextLine.includes(' — ') || nextLine.includes(' - ') || nextLine.includes(' | ')) {
            const parts = nextLine.split(/\s+[—\-|]\s+/);
            roleStr = parts[0]?.trim();
            locStr = parts.slice(1).join(' | ').trim();
            i++;
          } else if (nextLine.length < 80) {
            roleStr = nextLine;
            i++;
          }
        }

        // If roleStr contains 2+ spaces, split into role and location (e.g. "Software Engineer  New York, NY")
        if (roleStr && !locStr) {
          const parts = roleStr.split(/\s{2,}/);
          if (parts.length >= 2) {
            roleStr = parts[0].trim();
            locStr = parts.slice(1).join(' ').trim();
          }
        }

        currentSection.entries.push({
          organization: orgStr || null,
          role: roleStr,
          dates: dateStr,
          location: locStr,
          bullets: [],
          description: null,
          tech: null
        });
      } else if (isBulletLine(line)) {
        if (currentSection.entries.length === 0) {
          currentSection.entries.push({ organization: null, role: null, dates: null, location: null, bullets: [], description: null, tech: null });
        }
        currentSection.entries[currentSection.entries.length - 1].bullets.push(cleanBullet(line));
      } else {
        if (currentSection.entries.length > 0) {
          const lastEntry = currentSection.entries[currentSection.entries.length - 1];
          if (!lastEntry.role && trimmed.length < 80) {
            lastEntry.role = trimmed;
          } else {
            lastEntry.description = (lastEntry.description ? lastEntry.description + ' ' : '') + trimmed;
          }
        } else {
          currentSection.entries.push({ organization: trimmed, role: null, dates: null, location: null, bullets: [], description: null, tech: null });
        }
      }
    } else if (type === 'projects') {
      if (line.includes('|') || line.includes('–')) {
        const parts = line.split(/[|–]/);
        currentSection.entries.push({
          organization: parts[0].trim(),
          role: null,
          dates: null,
          location: null,
          bullets: [],
          description: null,
          tech: parts.slice(1).join(' | ').trim() || null
        });
      } else if (isBulletLine(line)) {
        if (currentSection.entries.length === 0) {
          currentSection.entries.push({ organization: null, role: null, dates: null, location: null, bullets: [], description: null, tech: null });
        }
        currentSection.entries[currentSection.entries.length - 1].bullets.push(cleanBullet(line));
      } else {
        currentSection.entries.push({ organization: trimmed, role: null, dates: null, location: null, bullets: [], description: null, tech: null });
      }
    } else {
      if (isBulletLine(line)) {
        if (currentSection.entries.length === 0) {
          currentSection.entries.push({ organization: null, role: null, dates: null, location: null, bullets: [], description: null, tech: null });
        }
        currentSection.entries[currentSection.entries.length - 1].bullets.push(cleanBullet(line));
      } else {
        currentSection.entries.push({ organization: null, role: null, dates: null, location: null, bullets: [], description: trimmed, tech: null });
      }
    }
  }

  if (currentSection) result.sections.push(currentSection);
  return result;
}
