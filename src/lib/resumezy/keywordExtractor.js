// Comprehensive taxonomy of technical, domain, and professional skills
const SKILL_TAXONOMY = {
  languages: [
    "JavaScript", "TypeScript", "Python", "Go", "Golang", "Java", "C++", "C#", "Rust", "Ruby",
    "PHP", "Swift", "Kotlin", "SQL", "HTML5", "CSS3", "Bash", "Shell", "R", "Scala"
  ],
  frameworks: [
    "React", "React.js", "Next.js", "Node.js", "Express", "Express.js", "FastAPI", "Django", "Flask",
    "Spring Boot", "Vue", "Vue.js", "Angular", "Tailwind", "Redux", "GraphQL", "REST", "RESTful",
    "PyTorch", "TensorFlow", "Scikit-Learn", "HuggingFace", "LangChain", "LlamaIndex", "vLLM", "Pandas", "NumPy"
  ],
  cloud_devops: [
    "AWS", "Amazon Web Services", "GCP", "Google Cloud", "Azure", "Docker", "Kubernetes", "K8s",
    "EKS", "ECS", "Terraform", "CI/CD", "GitHub Actions", "GitLab CI", "Jenkins", "Helm",
    "Serverless", "Lambda", "Triton", "CloudWatch", "Datadog", "Prometheus", "OpenTelemetry"
  ],
  data_storage: [
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Apache Kafka", "Kafka", "RabbitMQ", "Snowflake",
    "BigQuery", "Elasticsearch", "Cassandra", "DynamoDB", "Pinecone", "Weaviate", "pgvector", "SQL Server"
  ],
  architecture_concepts: [
    "Distributed Systems", "Microservices", "Event-Driven", "High Availability", "Fault Tolerance",
    "System Design", "Scalability", "Concurrency", "Low Latency", "Throughput", "Caching", "Load Balancing",
    "RAG", "Retrieval-Augmented Generation", "Vector Search", "Semantic Search", "Fine-Tuning", "Embeddings",
    "API Design", "Database Optimization", "Query Optimization", "Zero-Trust", "SOC2", "PCI-DSS"
  ],
  methodology_soft: [
    "Agile", "Scrum", "Sprint Planning", "Cross-Functional Leadership", "Mentorship", "Code Reviews",
    "Technical Architecture", "Root Cause Analysis", "Stakeholder Management", "Roadmap Planning",
    "A/B Testing", "User Research", "PRD", "Product Strategy", "KPIs", "OKRs"
  ]
};

/**
 * Normalizes a string for loose matching
 */
export function normalizeText(text) {
  return (text || "").toLowerCase().replace(/[^a-z0-9\s+#.-]/g, " ");
}

/**
 * Escapes regex special characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extracts and categorizes keywords from a Job Description
 */
export function extractKeywordsFromJD(jdText) {
  if (!jdText) return { keywords: [], mustHaves: [], niceToHaves: [], roleTitle: "" };

  const lowerJD = jdText.toLowerCase();
  const rawKeywords = [];

  // Identify role title cues
  let detectedTitle = "";
  const titleMatch = jdText.match(/(?:Role|Position|Title)\s*:\s*([^\r\n]+)/i) ||
                     jdText.match(/(?:We are looking for|Seeking|Hiring)\s+(?:an?|our next)?\s*([A-Za-z0-9\s\/\-_]+?)(?:\s+to|\s+who|\.|\r|\n)/i);
  if (titleMatch) {
    detectedTitle = titleMatch[1].trim();
  }

  // Check section context for "Must Have" vs "Nice to Have"
  const lines = jdText.split(/\r?\n/);
  let currentSection = "general"; // 'requirements', 'preferred', 'responsibilities'

  const sectionKeywords = {
    requirements: new Set(),
    preferred: new Set(),
    general: new Set()
  };

  lines.forEach(line => {
    const trimmed = line.trim().toLowerCase();
    if (trimmed.includes("minimum qualification") || trimmed.includes("required qualification") ||
        trimmed.includes("what you'll bring") || trimmed.includes("requirements") || trimmed.includes("must have")) {
      currentSection = "requirements";
      return;
    }
    if (trimmed.includes("preferred qualification") || trimmed.includes("nice to have") ||
        trimmed.includes("bonus") || trimmed.includes("plus") || trimmed.includes("desired")) {
      currentSection = "preferred";
      return;
    }
    if (trimmed.includes("responsibilities") || trimmed.includes("what you'll do") || trimmed.includes("the role")) {
      currentSection = "responsibilities";
      return;
    }

    // Check skills in this line
    for (const [category, skills] of Object.entries(SKILL_TAXONOMY)) {
      skills.forEach(skill => {
        const regex = new RegExp(`(?:^|[^a-zA-Z0-9+#.-])${escapeRegex(skill)}(?:[^a-zA-Z0-9+#.-]|$)`, "i");
        if (regex.test(line)) {
          if (currentSection === "requirements") {
            sectionKeywords.requirements.add(skill);
          } else if (currentSection === "preferred") {
            sectionKeywords.preferred.add(skill);
          } else {
            sectionKeywords.general.add(skill);
          }
        }
      });
    }
  });

  // Consolidate and score keywords
  const allFoundSkills = new Set([
    ...sectionKeywords.requirements,
    ...sectionKeywords.preferred,
    ...sectionKeywords.general
  ]);

  // Fallback scan across entire text if structured lines missed anything
  for (const [category, skills] of Object.entries(SKILL_TAXONOMY)) {
    skills.forEach(skill => {
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9+#.-])${escapeRegex(skill)}(?:[^a-zA-Z0-9+#.-]|$)`, "i");
      if (regex.test(lowerJD)) {
        allFoundSkills.add(skill);
      }
    });
  }

  // Also extract specific dynamic phrases (e.g. "99.999% availability", "five-nines", "p99", "millisecond")
  const metricKeywords = ["99.999%", "five-nines", "p99", "low latency", "high-throughput", "SOC2", "PCI-DSS", "zero-downtime"];
  metricKeywords.forEach(mk => {
    if (lowerJD.includes(mk.toLowerCase())) {
      allFoundSkills.add(mk);
    }
  });

  const processedKeywords = Array.from(allFoundSkills).map(name => {
    let category = "Domain & Architecture";
    for (const [cat, list] of Object.entries(SKILL_TAXONOMY)) {
      if (list.some(item => item.toLowerCase() === name.toLowerCase())) {
        category = cat.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
        break;
      }
    }

    // Determine weight
    const isMustHave = sectionKeywords.requirements.has(name) ||
                       (detectedTitle && detectedTitle.toLowerCase().includes(name.toLowerCase()));
    const isPreferred = sectionKeywords.preferred.has(name);

    // Count occurrences
    const matches = lowerJD.match(new RegExp(escapeRegex(name.toLowerCase()), "g"));
    const frequency = matches ? matches.length : 1;

    const importanceScore = (isMustHave ? 10 : isPreferred ? 6 : 7) + Math.min(frequency, 5);

    return {
      name,
      category,
      importance: isMustHave ? "Must-Have" : isPreferred ? "Nice-to-Have" : "High Priority",
      importanceScore,
      frequency
    };
  });

  // Sort by importance
  processedKeywords.sort((a, b) => b.importanceScore - a.importanceScore);

  const mustHaves = processedKeywords.filter(k => k.importance === "Must-Have" || k.importanceScore >= 12);
  const niceToHaves = processedKeywords.filter(k => !mustHaves.includes(k));

  return {
    keywords: processedKeywords,
    mustHaves: mustHaves.slice(0, 15),
    niceToHaves: niceToHaves.slice(0, 15),
    roleTitle: detectedTitle || "Target Role",
    totalCount: processedKeywords.length
  };
}

/**
 * Checks if a specific keyword or its aliases are found within a resume text
 */
export function checkKeywordInResume(keyword, resumeText) {
  if (!keyword || !resumeText) return false;
  const lowerResume = resumeText.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();

  // Handle common aliases
  const aliasMap = {
    "kubernetes": ["k8s", "kubernetes", "eks", "gke"],
    "k8s": ["k8s", "kubernetes"],
    "aws": ["amazon web services", "aws", "ec2", "s3", "lambda"],
    "gcp": ["google cloud", "google cloud platform", "gcp", "bigquery"],
    "node.js": ["nodejs", "node.js", "node"],
    "react": ["react.js", "reactjs", "react"],
    "react.js": ["react.js", "reactjs", "react"],
    "vue": ["vue.js", "vuejs", "vue"],
    "ci/cd": ["ci/cd", "continuous integration", "github actions", "gitlab ci", "jenkins"],
    "distributed systems": ["distributed systems", "distributed architecture", "microservices"],
    "microservices": ["microservice", "microservices", "service-oriented"],
    "kafka": ["apache kafka", "kafka"],
    "apache kafka": ["apache kafka", "kafka"],
    "redis": ["redis", "in-memory cache", "caching"],
    "graphql": ["graphql", "apollo"],
    "rest": ["rest api", "restful", "rest apis", "rest"],
    "scikit-learn": ["scikit-learn", "sklearn"],
    "postgres": ["postgresql", "postgres"]
  };

  const aliases = aliasMap[lowerKeyword] || [lowerKeyword];

  return aliases.some(alias => {
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9+#.-])${escapeRegex(alias)}(?:[^a-zA-Z0-9+#.-]|$)`, "i");
    return regex.test(lowerResume);
  });
}
