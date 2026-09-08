import { isBulletQuantified, getBulletVerbStrength } from './atsAuditor';

/**
 * Intelligent bullet rewriter that applies Google's XYZ formula:
 * "Accomplished [X] as measured by [Y], by doing [Z]"
 */

// Contextual upgrade patterns based on domain keywords
const KEYWORD_ENHANCEMENT_TEMPLATES = [
  {
    triggers: ["react", "frontend", "ui", "dashboard", "components"],
    targetSkills: ["React", "TypeScript", "Performance", "Redis", "Next.js"],
    generate: (orig, missingSkills, directive) => {
      const skillsToUse = missingSkills.filter(s => ["Redis", "Next.js", "TypeScript", "GraphQL", "Performance", "CI/CD"].includes(s));
      const skillMention = skillsToUse.length > 0 ? ` leveraging ${skillsToUse.slice(0, 2).join(" and ")}` : "";
      return `Architected responsive, high-performance web applications using React and modern component architecture${skillMention}, cutting p99 rendering latency by 38% and elevating user task completion rates by 27%.`;
    }
  },
  {
    triggers: ["node", "backend", "api", "express", "microservices", "rest"],
    targetSkills: ["Node.js", "Go", "Distributed Systems", "Kafka", "PostgreSQL", "Microservices", "Docker"],
    generate: (orig, missingSkills, directive) => {
      const skillsToUse = missingSkills.filter(s => ["Kafka", "Apache Kafka", "Redis", "Docker", "Kubernetes", "Microservices", "Event-Driven"].includes(s));
      const skillMention = skillsToUse.length > 0 ? ` integrating ${skillsToUse.slice(0, 2).join(" and ")}` : " with asynchronous event pipelines";
      return `Engineered fault-tolerant backend microservices and RESTful APIs${skillMention}, scaling throughput to 12,000+ RPS while maintaining 99.99% service availability.`;
    }
  },
  {
    triggers: ["database", "sql", "query", "postgres", "mysql", "queries"],
    targetSkills: ["PostgreSQL", "Query Optimization", "Database Optimization", "Redis", "Caching"],
    generate: (orig, missingSkills, directive) => {
      return `Optimized complex relational database schemas and indexed query execution plans in PostgreSQL, slashing query latency by 54% and unlocking 3x database connection capacity.`;
    }
  },
  {
    triggers: ["aws", "cloud", "deploy", "infrastructure", "devops"],
    targetSkills: ["AWS", "Kubernetes", "Docker", "CI/CD", "Terraform", "EKS"],
    generate: (orig, missingSkills, directive) => {
      const skillsToUse = missingSkills.filter(s => ["Kubernetes", "Docker", "CI/CD", "Terraform", "AWS", "EKS"].includes(s));
      const techList = skillsToUse.length > 0 ? skillsToUse.slice(0, 3).join(", ") : "AWS and Docker";
      return `Automated zero-downtime deployment pipelines utilizing ${techList}, trimming release cycle durations by 65% and saving an estimated $45K in annual compute overhead.`;
    }
  },
  {
    triggers: ["test", "testing", "unit test", "bugs", "qa", "regression"],
    targetSkills: ["CI/CD", "Jest", "Automated Testing", "Code Reviews"],
    generate: (orig, missingSkills, directive) => {
      return `Established comprehensive automated test suites and continuous testing gates, boosting code test coverage from 62% to 94% and decreasing critical production incidents by 40%.`;
    }
  },
  {
    triggers: ["agile", "sprint", "collaborate", "team", "planning", "meetings", "mentor"],
    targetSkills: ["Cross-Functional Leadership", "Mentorship", "Agile", "System Design"],
    generate: (orig, missingSkills, directive, seniority) => {
      const isSenior = seniority === "lead" || seniority === "senior";
      if (isSenior) {
        return `Spearheaded sprint architecture planning and mentored 5 junior/mid-level engineers, establishing rigorous code review guidelines and elevating overall sprint velocity by 28%.`;
      }
      return `Collaborated across engineering, product, and QA stakeholders in bi-weekly Agile sprints, accelerating milestone delivery timelines by 22% through structured technical specs.`;
    }
  },
  {
    triggers: ["machine learning", "model", "churn", "xgboost", "predictive", "scikit"],
    targetSkills: ["PyTorch", "Transformers", "Scikit-Learn", "MLOps", "MLflow", "FastAPI"],
    generate: (orig, missingSkills, directive) => {
      const skillsToUse = missingSkills.filter(s => ["PyTorch", "Transformers", "LangChain", "FastAPI", "MLOps"].includes(s));
      const tech = skillsToUse.length > 0 ? ` and ${skillsToUse[0]}` : "";
      return `Developed and productionized high-accuracy predictive ML models using Scikit-Learn${tech}, achieving an 89.4% ROC-AUC score and driving an estimated $320K reduction in annual churn.`;
    }
  },
  {
    triggers: ["llm", "embeddings", "rag", "vector", "generative ai", "text"],
    targetSkills: ["RAG", "Vector Search", "Pinecone", "LangChain", "LlamaIndex", "HuggingFace"],
    generate: (orig, missingSkills, directive) => {
      return `Architected enterprise Retrieval-Augmented Generation (RAG) pipeline with hybrid vector search (Pinecone) and dense embeddings, trimming LLM query latency to <120ms and eliminating hallucination by 92%.`;
    }
  },
  {
    triggers: ["roadmap", "prd", "user stories", "requirements", "product", "features"],
    targetSkills: ["Product Strategy", "Roadmap Planning", "A/B Testing", "KPIs", "PRD"],
    generate: (orig, missingSkills, directive) => {
      return `Authored comprehensive PRDs and led end-to-end product discovery for core workflows, resulting in a 34% increase in user adoption and a 4.8/5 satisfaction rating across enterprise customers.`;
    }
  }
];

/**
 * Transforms a single bullet point into Google's XYZ formula
 */
export function rewriteSingleBullet(originalBullet, missingKeywords = [], options = {}) {
  const { seniority = "senior", tone = "impact", customPrompt = "" } = options;
  const lower = originalBullet.toLowerCase();

  // Check if bullet already has good metrics and strong verbs
  const hasMetrics = isBulletQuantified(originalBullet);
  const verbInfo = getBulletVerbStrength(originalBullet);

  // Search for matching template
  let matchedTemplate = null;
  for (const template of KEYWORD_ENHANCEMENT_TEMPLATES) {
    if (template.triggers.some(trig => lower.includes(trig))) {
      matchedTemplate = template;
      break;
    }
  }

  const missingSkillNames = missingKeywords.map(k => k.name || k);

  if (matchedTemplate) {
    const upgraded = matchedTemplate.generate(originalBullet, missingSkillNames, customPrompt, seniority);
    return {
      original: originalBullet,
      upgraded,
      wasModified: true,
      reason: "Converted to Google XYZ formula with quantifiable business metrics and target ATS keywords."
    };
  }

  // Fallback heuristic rewrite: upgrade weak verb and inject realistic metrics
  let cleanText = originalBullet;
  let actionVerb = "Engineered";
  if (seniority === "lead") actionVerb = "Spearheaded";
  else if (tone === "executive") actionVerb = "Orchestrated";
  else if (tone === "technical") actionVerb = "Architected";

  if (verbInfo.isWeak) {
    cleanText = cleanText.replace(new RegExp(`^${verbInfo.verb}\\s*`, "i"), "");
    cleanText = cleanText.charAt(0).toLowerCase() + cleanText.slice(1);
  }

  // Inject a quantified metric if missing
  if (!hasMetrics) {
    const randomPercent = 25 + Math.floor(Math.random() * 30);
    return {
      original: originalBullet,
      upgraded: `${actionVerb} ${cleanText}, delivering a ${randomPercent}% performance improvement and accelerating deployment velocity.`,
      wasModified: true,
      reason: "Enhanced action verb strength and added quantifiable impact metric."
    };
  }

  // Upgrade weak verb if metric already exists
  if (verbInfo.isWeak) {
    return {
      original: originalBullet,
      upgraded: `${actionVerb} ${cleanText}`,
      wasModified: true,
      reason: "Replaced passive verb with high-impact leadership verb."
    };
  }

  return {
    original: originalBullet,
    upgraded: originalBullet,
    wasModified: false,
    reason: "Bullet already meets high ATS impact criteria."
  };
}

/**
 * Re-architects the entire resume text based on JD analysis, missing keywords, and user constraints
 */
export function transformResumeContent(originalResumeText, jdKeywordsData, options = {}) {
  const {
    seniority = "senior",
    tone = "impact",
    customPrompt = "",
    targetLength = "1page"
  } = options;

  const { keywords = [], mustHaves = [], roleTitle = "Target Role" } = jdKeywordsData;
  const missingMustHaves = mustHaves.filter(m => !originalResumeText.toLowerCase().includes(m.name.toLowerCase()));
  const missingNames = missingMustHaves.map(m => m.name);

  const lines = originalResumeText.split(/\r?\n/);
  const upgradedLines = [];
  const bulletChanges = [];
  let inExperienceSection = false;
  let inSummarySection = false;
  let inSkillsSection = false;

  let currentRoleBullets = 0;

  // 1. Process line by line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const upperTrimmed = trimmed.toUpperCase();

    // Section detection
    if (upperTrimmed === "PROFESSIONAL SUMMARY" || upperTrimmed === "SUMMARY" || upperTrimmed === "PROFILE") {
      inSummarySection = true;
      inExperienceSection = false;
      inSkillsSection = false;
      upgradedLines.push("PROFESSIONAL SUMMARY");
      continue;
    } else if (upperTrimmed === "WORK EXPERIENCE" || upperTrimmed === "EXPERIENCE" || upperTrimmed === "EMPLOYMENT") {
      inSummarySection = false;
      inExperienceSection = true;
      inSkillsSection = false;
      upgradedLines.push("WORK EXPERIENCE");
      continue;
    } else if (upperTrimmed === "TECHNICAL SKILLS" || upperTrimmed === "SKILLS" || upperTrimmed === "CORE COMPETENCIES") {
      inSummarySection = false;
      inExperienceSection = false;
      inSkillsSection = true;
      upgradedLines.push("TECHNICAL SKILLS");
      continue;
    } else if (upperTrimmed === "EDUCATION" || upperTrimmed === "PROJECTS" || upperTrimmed === "CERTIFICATIONS") {
      inSummarySection = false;
      inExperienceSection = false;
      inSkillsSection = false;
      upgradedLines.push(trimmed);
      continue;
    }

    // Rewrite Summary Section
    if (inSummarySection) {
      // If we encounter a non-empty summary line
      if (trimmed.length > 0 && !lines[i + 1]?.trim().toUpperCase().startsWith("WORK EXPERIENCE")) {
        // Generate high-impact tailored summary
        const topSkills = mustHaves.slice(0, 5).map(k => k.name).join(", ");
        const seniorityTitle = seniority === "lead" ? "Staff / Principal" : seniority === "senior" ? "Senior" : "Mid-Level";
        
        let customAddon = "";
        if (customPrompt) {
          customAddon = ` Specialized focus on ${customPrompt.replace(/focus on|highlight|emphasize/gi, "").trim()}.`;
        }

        const tailoredSummary = `${seniorityTitle} Software Engineer with demonstrated expertise in architecting high-throughput distributed systems and enterprise applications. Proven track record of scaling low-latency services, optimizing cloud infrastructure with ${topSkills || "modern architectures"}, and leading cross-functional engineering teams. Adept at driving 99.999% availability, standardizing CI/CD deployment pipelines, and translating mission-critical product specs into production reality.${customAddon}`;
        
        upgradedLines.push(tailoredSummary);
        inSummarySection = false; // Summary updated
        // Skip subsequent original summary lines until next section
        while (i + 1 < lines.length && lines[i + 1].trim().length > 0 && !lines[i + 1].trim().toUpperCase().includes("EXPERIENCE")) {
          i++;
        }
        continue;
      }
    }

    // Rewrite Experience Bullets
    if (inExperienceSection) {
      if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*")) {
        const bulletText = trimmed.replace(/^[-•*]\s*/, "");
        const rewriteResult = rewriteSingleBullet(bulletText, missingMustHaves, { seniority, tone, customPrompt });
        
        upgradedLines.push(`- ${rewriteResult.upgraded}`);
        if (rewriteResult.wasModified) {
          bulletChanges.push(rewriteResult);
        }
        continue;
      }
    }

    // Rebalance Skills Section
    if (inSkillsSection) {
      if (trimmed.length > 0 && !trimmed.toUpperCase().includes("EDUCATION")) {
        // Check if line is a skill category
        if (trimmed.includes(":")) {
          const [cat, skillsPart] = trimmed.split(":");
          const existingList = skillsPart.split(",").map(s => s.trim());
          
          // Inject missing relevant skills into appropriate categories
          const injected = [];
          missingNames.forEach(missing => {
            if (!existingList.some(e => e.toLowerCase() === missing.toLowerCase())) {
              if (cat.toLowerCase().includes("language") && ["Go", "TypeScript", "Python", "Java", "SQL"].includes(missing)) {
                injected.push(missing);
              } else if (cat.toLowerCase().includes("cloud") || cat.toLowerCase().includes("database") || cat.toLowerCase().includes("devops")) {
                if (["Kubernetes", "Kafka", "Docker", "AWS", "Redis", "Terraform", "CI/CD"].includes(missing)) {
                  injected.push(missing);
                }
              } else if (cat.toLowerCase().includes("framework")) {
                if (["Next.js", "Express", "FastAPI", "React", "PyTorch"].includes(missing)) {
                  injected.push(missing);
                }
              }
            }
          });

          const combined = [...injected, ...existingList];
          upgradedLines.push(`${cat}: ${combined.join(", ")}`);
        } else {
          upgradedLines.push(trimmed);
        }
        continue;
      }
    }

    upgradedLines.push(line);
  }

  // Ensure missing critical skills appear in Technical Skills if not already there
  let finalResultText = upgradedLines.join("\n");

  // Post-audit to ensure high keywords presence
  missingMustHaves.slice(0, 4).forEach(miss => {
    if (!finalResultText.toLowerCase().includes(miss.name.toLowerCase())) {
      // Append to Technical Skills
      finalResultText = finalResultText.replace(/(TECHNICAL SKILLS[\s\S]*?Tools:[^\n]+)/i, `$1, ${miss.name}`);
    }
  });

  return {
    transformedResumeText: finalResultText,
    bulletChanges,
    totalBulletsUpdated: bulletChanges.length
  };
}
