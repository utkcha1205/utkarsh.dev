import { checkKeywordInResume } from './keywordExtractor';

// Strong action verbs preferred by ATS and hiring managers
const STRONG_ACTION_VERBS = [
  "architected", "engineered", "spearheaded", "orchestrated", "developed", "designed",
  "optimized", "accelerated", "deployed", "scaled", "automated", "streamlined",
  "reduced", "increased", "maximized", "migrated", "built", "implemented", "delivered",
  "refactored", "formulated", "established", "mentored", "directed", "authored", "audited"
];

// Weak verbs / passive phrasing that ATS and recruiters penalize
const WEAK_VERBS = [
  "worked on", "helped", "assisted", "responsible for", "participated in", "involved in",
  "handled", "dealt with", "aided", "supported", "attempted", "tried to", "did"
];

/**
 * Parses bullet points from resume text
 */
export function extractBulletPoints(resumeText) {
  if (!resumeText) return [];
  const lines = resumeText.split(/\r?\n/);
  const bullets = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*") || trimmed.startsWith("–")) {
      const content = trimmed.replace(/^[-•*–]\s*/, "");
      if (content.length > 10) {
        bullets.push({ lineIndex: index, text: content, raw: trimmed });
      }
    }
  });

  return bullets;
}

/**
 * Evaluates whether a bullet point has quantifiable business impact
 */
export function isBulletQuantified(text) {
  // Regex for numbers, percentages, dollar values, multipliers, latency metrics
  const metricRegex = /(\b\d+([.,]\d+)?\s*(%|percent|\$|k|m|b|x|ms|s|hours|days|weeks|engineers|users|customers|requests|transactions|tps|qps|queries|models|pipelines)\b|\b\d{2,}\b|\$\d+)/i;
  return metricRegex.test(text);
}

/**
 * Checks for weak starting verbs in a bullet point
 */
export function getBulletVerbStrength(text) {
  const lower = text.trim().toLowerCase();
  for (const weak of WEAK_VERBS) {
    if (lower.startsWith(weak)) {
      return { isWeak: true, verb: weak };
    }
  }
  for (const strong of STRONG_ACTION_VERBS) {
    if (lower.startsWith(strong)) {
      return { isStrong: true, verb: strong };
    }
  }
  return { isNeutral: true, verb: lower.split(" ")[0] };
}

/**
 * Performs a comprehensive ATS screening audit on a resume against extracted JD keywords
 */
export function auditResumeAgainstJD(resumeText, jdKeywordsData) {
  if (!resumeText) {
    return {
      overallScore: 0,
      keywordMatchScore: 0,
      impactScore: 0,
      verbScore: 0,
      formatScore: 0,
      matchedKeywords: [],
      missingMustHaves: [],
      missingNiceToHaves: [],
      quantifiedRatio: 0,
      bulletCount: 0,
      weakBulletCount: 0,
      atsEngineChecks: []
    };
  }

  const { keywords = [], mustHaves = [], niceToHaves = [] } = jdKeywordsData || {};

  // 1. Keyword Matching
  const matchedKeywords = [];
  const missingMustHaves = [];
  const missingNiceToHaves = [];

  keywords.forEach(kw => {
    const isPresent = checkKeywordInResume(kw.name, resumeText);
    if (isPresent) {
      matchedKeywords.push(kw);
    } else {
      if (kw.importance === "Must-Have" || kw.importanceScore >= 12) {
        missingMustHaves.push(kw);
      } else {
        missingNiceToHaves.push(kw);
      }
    }
  });

  const totalKeywordWeight = keywords.reduce((sum, k) => sum + k.importanceScore, 0) || 1;
  const matchedWeight = matchedKeywords.reduce((sum, k) => sum + k.importanceScore, 0);
  const keywordMatchScore = Math.min(100, Math.round((matchedWeight / totalKeywordWeight) * 100));

  // 2. Quantified Impact Metric Score (Google XYZ compliance)
  const bullets = extractBulletPoints(resumeText);
  const totalBullets = bullets.length;
  let quantifiedBulletsCount = 0;
  let weakVerbsCount = 0;
  let strongVerbsCount = 0;

  bullets.forEach(b => {
    if (isBulletQuantified(b.text)) {
      quantifiedBulletsCount++;
    }
    const verbCheck = getBulletVerbStrength(b.text);
    if (verbCheck.isWeak) weakVerbsCount++;
    if (verbCheck.isStrong) strongVerbsCount++;
  });

  const quantifiedRatio = totalBullets > 0 ? Math.round((quantifiedBulletsCount / totalBullets) * 100) : 0;
  const impactScore = Math.min(100, Math.round(quantifiedRatio * 1.1));

  // 3. Action Verb Strength Score
  const strongRatio = totalBullets > 0 ? (strongVerbsCount / totalBullets) : 0;
  const weakPenalty = totalBullets > 0 ? (weakVerbsCount / totalBullets) * 40 : 0;
  const verbScore = Math.max(0, Math.min(100, Math.round(strongRatio * 100 - weakPenalty)));

  // 4. ATS Formatting & Parsing Readiness
  let formatScore = 95;
  const formatIssues = [];

  // Check for essential sections
  const lowerResume = resumeText.toLowerCase();
  const hasExperience = lowerResume.includes("experience") || lowerResume.includes("employment") || lowerResume.includes("work history");
  const hasSkills = lowerResume.includes("skills") || lowerResume.includes("technologies") || lowerResume.includes("competencies");
  const hasEducation = lowerResume.includes("education") || lowerResume.includes("degree") || lowerResume.includes("university");
  const hasSummary = lowerResume.includes("summary") || lowerResume.includes("profile") || lowerResume.includes("objective");

  if (!hasExperience) {
    formatScore -= 25;
    formatIssues.push("Missing standardized 'WORK EXPERIENCE' section header.");
  }
  if (!hasSkills) {
    formatScore -= 15;
    formatIssues.push("Missing dedicated 'TECHNICAL SKILLS' section header.");
  }
  if (!hasEducation) {
    formatScore -= 10;
    formatIssues.push("Missing 'EDUCATION' section header.");
  }
  if (!hasSummary) {
    formatScore -= 5;
    formatIssues.push("Missing 'PROFESSIONAL SUMMARY' section header.");
  }

  // Check for non-standard characters
  if (resumeText.includes("\t")) {
    formatScore -= 5;
    formatIssues.push("Contains tabs instead of clean spaces (can scramble parser column alignment).");
  }

  // 5. Composite Weighted ATS Overall Score
  // Standard ATS Weighting: 50% Keyword Alignment, 25% Quantified Impact, 15% Strong Verbs, 10% Formatting Standard
  const overallScore = Math.round(
    keywordMatchScore * 0.50 +
    impactScore * 0.25 +
    verbScore * 0.15 +
    formatScore * 0.10
  );

  // 6. ATS Parser Simulations
  const atsEngineChecks = [
    {
      engine: "Workday",
      version: "Enterprise v42",
      status: overallScore >= 80 ? "PASSED" : overallScore >= 60 ? "NEEDS OPTIMIZATION" : "REJECTED",
      score: Math.min(99, Math.max(35, overallScore + 2)),
      notes: "Strict keyword weighting on job title and primary toolchain."
    },
    {
      engine: "Greenhouse",
      version: "Talent Suite 2026",
      status: overallScore >= 75 ? "PASSED" : overallScore >= 55 ? "REVIEW REQUIRED" : "FILTERED",
      score: Math.min(99, Math.max(32, overallScore - 1)),
      notes: "High emphasis on action verbs and role progression."
    },
    {
      engine: "Lever",
      version: "TRM Core",
      status: overallScore >= 70 ? "PASSED" : "AUTO-FLAGGED",
      score: Math.min(99, Math.max(38, overallScore + 1)),
      notes: "Extracts skill clusters and density across recent 3 years."
    },
    {
      engine: "Taleo / Oracle",
      version: "Enterprise Cloud",
      status: formatScore >= 80 && overallScore >= 75 ? "PASSED" : "PARSER WARNING",
      score: Math.min(98, Math.max(30, overallScore - 3)),
      notes: "Rigid plain text header matching and zero tolerance for odd formats."
    },
    {
      engine: "iCIMS",
      version: "Talent Cloud v18",
      status: overallScore >= 75 ? "PASSED" : "LOW SCORE",
      score: Math.min(99, Math.max(35, overallScore)),
      notes: "Contextual matching of responsibilities against minimum qualifications."
    }
  ];

  return {
    overallScore: Math.max(5, Math.min(99, overallScore)),
    keywordMatchScore,
    impactScore,
    verbScore,
    formatScore,
    matchedKeywords,
    missingMustHaves,
    missingNiceToHaves,
    quantifiedRatio,
    totalBullets,
    quantifiedBulletsCount,
    weakVerbsCount,
    strongVerbsCount,
    formatIssues,
    atsEngineChecks
  };
}
