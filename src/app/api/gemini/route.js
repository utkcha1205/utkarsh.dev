import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { apiKey, resumeText, jdText, missingKeywords = [], directives = {} } = await request.json();
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

    if (!effectiveKey) {
      return NextResponse.json({ error: "Missing Gemini API Key" }, { status: 400 });
    }

    const { seniority = "senior", tone = "impact", customPrompt = "" } = directives;

    const systemPrompt = `You are the Resumezy Screening Shield Agent, an elite technical recruiter and ATS optimization engine.
Your goal is to transform the user's resume so that it passes all automated ATS screening filters (Workday, Greenhouse, Lever, Taleo) and guarantees a top-percentile human recruiter review.

Rules:
1. Apply Google's XYZ Formula for bullet points: "Accomplished [X] as measured by [Y], by doing [Z]".
2. Naturally and authentically weave in these critical missing keywords without spamming: ${missingKeywords.join(", ")}.
3. Seniority target: ${seniority}. Tone: ${tone}.
4. Additional user instructions: ${customPrompt || "Focus on maximizing measurable business and technical metrics."}
5. Keep standard clean ATS sections: PROFESSIONAL SUMMARY, WORK EXPERIENCE, TECHNICAL SKILLS, EDUCATION.
6. Preserve truthful background while significantly elevating verb strength and quantifiable impact metrics.

Return a JSON object with:
- "transformedText": full formatted resume text
- "bulletChanges": array of objects with { "original": string, "upgraded": string, "reason": string }`;

    const userContent = `Here is the current Resume:
---
${resumeText}
---

Here is the Target Job Description:
---
${jdText}
---

Return valid JSON adhering to the specified schema.`;

    // Candidate models to try in order (Auto-selects best model)
    const requestedModel = (directives.model && directives.model !== "auto") ? directives.model : "gemini-3.6-flash";
    const candidateModels = [
      requestedModel,
      "gemini-3.6-flash",
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-2.5-pro",
      "gemini-1.5-pro"
    ];

    // Deduplicate
    const modelsToAttempt = [...new Set(candidateModels)];

    let lastError = null;
    let successfulData = null;

    for (const model of modelsToAttempt) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`;

      try {
        const apiRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: `${systemPrompt}\n\n${userContent}` }] }
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json"
            }
          })
        });

        if (apiRes.ok) {
          const apiData = await apiRes.json();
          const rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            successfulData = JSON.parse(rawText);
            break; // Success!
          }
        } else {
          const errText = await apiRes.text();
          lastError = errText;
          // If model is not available/deprecated, loop continues to the next candidate model
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    if (successfulData) {
      return NextResponse.json({
        transformedText: successfulData.transformedText,
        bulletChanges: successfulData.bulletChanges || []
      });
    }

    // Dynamic model discovery fallback if static list was exhausted
    try {
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${effectiveKey}`);
      if (listRes.ok) {
        const listData = await listRes.json();
        const available = listData.models?.filter(m => m.supportedGenerationMethods?.includes('generateContent')) || [];
        if (available.length > 0) {
          const dynamicModel = available[0].name.replace(/^models\//, '');
          const dynamicRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${dynamicModel}:generateContent?key=${effectiveKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userContent}` }] }],
              generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
            })
          });
          if (dynamicRes.ok) {
            const dynData = await dynamicRes.json();
            const rawText = dynData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const parsed = JSON.parse(rawText);
              return NextResponse.json({
                transformedText: parsed.transformedText,
                bulletChanges: parsed.bulletChanges || []
              });
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ error: "Gemini API error", details: lastError }, { status: 500 });

  } catch (error) {
    console.error("Gemini API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
