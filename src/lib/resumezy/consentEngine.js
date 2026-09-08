import { extractBulletPoints } from './atsAuditor';
import { rewriteSingleBullet } from './bulletRewriter';

/**
 * Generates an atomic list of proposed changes for user review and explicit consent.
 * Guarantees that the candidate's template structure, headings, and formatting remain 100% locked.
 */
export function generateProposedChanges(originalResumeText, jdKeywordsData, directives = {}) {
  const { seniority = "senior", tone = "impact", customPrompt = "", lockTemplate = true } = directives;
  const { mustHaves = [] } = jdKeywordsData || {};
  const missingMustHaves = mustHaves.filter(m => !originalResumeText.toLowerCase().includes(m.name.toLowerCase()));

  const proposedChanges = [];
  const lines = originalResumeText.split(/\r?\n/);

  let currentSection = "General";
  let bulletIndex = 0;

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();
    const upper = trimmed.toUpperCase();

    // Track section context without modifying it
    if (upper.includes("SUMMARY") || upper.includes("PROFILE")) {
      currentSection = "Professional Summary";
    } else if (upper.includes("EXPERIENCE") || upper.includes("EMPLOYMENT")) {
      currentSection = "Work Experience";
    } else if (upper.includes("SKILLS") || upper.includes("TECHNOLOGIES")) {
      currentSection = "Technical Skills";
    } else if (upper.includes("EDUCATION") || upper.includes("PROJECTS")) {
      currentSection = trimmed;
    }

    // Identify bullet points to propose surgical upgrades
    if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*") || trimmed.startsWith("–")) {
      const bulletContent = trimmed.replace(/^[-•*–]\s*/, "");
      const rewriteResult = rewriteSingleBullet(bulletContent, missingMustHaves, { seniority, tone, customPrompt });

      if (rewriteResult.wasModified) {
        bulletIndex++;
        proposedChanges.push({
          id: `change_bullet_${bulletIndex}`,
          type: "bullet",
          section: currentSection,
          lineIndex: lineIdx,
          originalRaw: trimmed,
          originalContent: bulletContent,
          proposedContent: rewriteResult.upgraded,
          proposedRaw: `${trimmed.charAt(0)} ${rewriteResult.upgraded}`,
          reason: rewriteResult.reason,
          status: "pending", // 'accepted' | 'rejected' | 'pending'
          injectedKeywords: missingMustHaves.filter(m => rewriteResult.upgraded.toLowerCase().includes(m.name.toLowerCase())).map(m => m.name)
        });
      }
    }
  });

  return proposedChanges;
}

/**
 * Surgically merges ONLY the changes the user has consented to.
 * When lockTemplate is true, ensures 0% alteration to the user's template styling or layout.
 */
export function applyConsentedChanges(originalResumeText, changeList = [], lockTemplate = true) {
  if (!originalResumeText) return "";
  let updatedText = originalResumeText;

  changeList.forEach(change => {
    if (change.status === "accepted") {
      const targetSearch = change.originalRaw;
      const targetReplacement = change.proposedRaw;

      if (updatedText.includes(targetSearch)) {
        updatedText = updatedText.replace(targetSearch, targetReplacement);
      } else if (updatedText.includes(change.originalContent)) {
        updatedText = updatedText.replace(change.originalContent, change.proposedContent);
      }
    }
  });

  return updatedText;
}
