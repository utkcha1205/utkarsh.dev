import * as mammoth from 'mammoth';

/**
 * Extracts raw text from uploaded files (PDF, DOCX, TXT, MD, TEX)
 * Preserves the exact structure, line breaks, and indentation.
 * Specifically handles LaTeX/Overleaf hyphenation and macros.
 */
export async function parseUploadedResumeFile(file) {
  if (!file) throw new Error("No file provided");

  const fileName = file.name;
  const extension = fileName.split('.').pop().toLowerCase();

  // 1. Plain Text, Markdown, or LaTeX (.tex) Source File
  if (extension === 'txt' || extension === 'md' || extension === 'tex' || file.type === 'text/plain') {
    let text = await file.text();

    // If LaTeX .tex source from Overleaf, parse macros cleanly
    if (extension === 'tex') {
      text = parseLatexSource(text);
    }

    return {
      text,
      fileName,
      fileType: extension.toUpperCase(),
      wordCount: text.split(/\s+/).filter(Boolean).length
    };
  }

  // 2. Word DOCX (.docx)
  if (extension === 'docx' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = (result && result.value) ? result.value : "";
      if (text.trim().length > 0) {
        return {
          text,
          fileName,
          fileType: 'DOCX',
          wordCount: text.split(/\s+/).filter(Boolean).length
        };
      }
    } catch (docxErr) {
      console.warn("Mammoth DOCX parsing warning:", docxErr);
    }
  }

  // 3. PDF Files (.pdf - including Overleaf/LaTeX compiled PDFs)
  if (extension === 'pdf' || file.type === 'application/pdf') {
    try {
      // Dynamic import pdfjs-dist
      const pdfjsLib = await import('pdfjs-dist');
      if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions?.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDoc = await loadingTask.promise;

      let extractedLines = [];

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let lastY = null;
        let lineText = "";

        for (const item of textContent.items) {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 4) {
            if (lineText.trim()) extractedLines.push(lineText.trim());
            lineText = "";
          }
          lineText += (lineText.length > 0 && !lineText.endsWith(" ") ? " " : "") + item.str;
          lastY = item.transform[5];
        }
        if (lineText.trim()) {
          extractedLines.push(lineText.trim());
        }
      }

      let fullText = extractedLines.join("\n").trim();

      // Clean LaTeX / Overleaf artifacts:
      // 1. Fix line-break hyphenation (e.g. "Re-\nact," -> "React,")
      fullText = fullText.replace(/(\b[A-Za-z]+)-\s*\n\s*([a-z]+)\b/g, '$1$2');

      // 2. Remove trailing isolated page numbers (e.g., lone "1" or "Page 1 of 1" at the bottom)
      fullText = fullText.replace(/\n\s*\d+\s*$/g, '').trim();

      // 3. Remove stray LaTeX / FontAwesome glyph characters (e.g. \u0083, #, ï, §) from contact headers
      fullText = fullText.replace(/[\u0080-\u009F\uF000-\uFFFFï§#\u00A7\u00EF\u0083]/g, ' ');
      fullText = fullText.split('\n').map(l => l.replace(/\s{2,}/g, ' ').trim()).join('\n');

      if (fullText.length > 20) {
        return {
          text: fullText,
          fileName,
          fileType: 'PDF',
          wordCount: fullText.split(/\s+/).filter(Boolean).length
        };
      }
    } catch (pdfErr) {
      console.warn("PDF extraction warning, attempting text stream fallback:", pdfErr);
    }

    // Fallback: extract printable strings from PDF binary stream
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const decoder = new TextDecoder('latin1');
      const decoded = decoder.decode(bytes);
      const textMatches = decoded.match(/\(([^()]{2,})\)/g) || [];
      const cleanParts = textMatches
        .map(m => m.slice(1, -1).trim())
        .filter(s => /[a-zA-Z]{2,}/.test(s));

      if (cleanParts.length > 5) {
        let recoveredText = cleanParts.join("\n");
        recoveredText = recoveredText.replace(/(\b[A-Za-z]+)-\s*\n\s*([a-z]+)\b/g, '$1$2');
        recoveredText = recoveredText.replace(/\n\s*\d+\s*$/g, '').trim();

        return {
          text: recoveredText,
          fileName,
          fileType: 'PDF',
          wordCount: recoveredText.split(/\s+/).filter(Boolean).length
        };
      }
    } catch (streamErr) {
      console.warn("PDF stream fallback failed:", streamErr);
    }
  }

  // Generic fallback if all else fails
  let rawText = await file.text();
  if (rawText && rawText.trim().length > 10) {
    rawText = rawText.replace(/(\b[A-Za-z]+)-\s*\n\s*([a-z]+)\b/g, '$1$2');
    return {
      text: rawText,
      fileName,
      fileType: extension.toUpperCase() || 'DOCUMENT',
      wordCount: rawText.split(/\s+/).filter(Boolean).length
    };
  }

  throw new Error(`Unable to extract text from ${fileName}. Please paste your resume text or upload as .txt/.docx/.pdf/.tex.`);
}

/**
 * Parses LaTeX (.tex) resume source into clean formatted plain text
 * Handles standard templates: Jake's Resume, Awesome-CV, ModernCV, Deedy
 */
function parseLatexSource(tex) {
  let cleaned = tex;

  // Remove comments
  cleaned = cleaned.replace(/%[^\n]*/g, '');

  // Convert \section{...} to section headers
  cleaned = cleaned.replace(/\\section\*?\{([^}]+)\}/gi, '\n\n$1\n');

  // Convert \resumeSubheading{Role/Company}{Dates}{Company/Role}{Location}
  cleaned = cleaned.replace(/\\resumeSubheading\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}/gi, '\n$1 — $2\n$3 — $4');

  // Convert \resumeItem{...} or \item to bullet points
  cleaned = cleaned.replace(/\\resumeItem\{([^}]+)\}/gi, '• $1\n');
  cleaned = cleaned.replace(/\\item\s+([^\n]+)/gi, '• $1\n');

  // Remove formatting macros
  cleaned = cleaned.replace(/\\textbf\{([^}]+)\}/gi, '$1');
  cleaned = cleaned.replace(/\\textit\{([^}]+)\}/gi, '$1');
  cleaned = cleaned.replace(/\\underline\{([^}]+)\}/gi, '$1');
  cleaned = cleaned.replace(/\\href\{[^}]*\}\{([^}]+)\}/gi, '$1');
  cleaned = cleaned.replace(/\\scshape\s*/gi, '');

  // Strip preamble up to \begin{document}
  if (cleaned.includes('\\begin{document}')) {
    cleaned = cleaned.split('\\begin{document}')[1];
  }
  if (cleaned.includes('\\end{document}')) {
    cleaned = cleaned.split('\\end{document}')[0];
  }

  // Remove remaining commands \command or \command{...}
  cleaned = cleaned.replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?(?:\{[^}]*\})?/g, ' ');

  // Clean excessive spaces and multiple blank lines
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n');

  return cleaned.trim();
}
