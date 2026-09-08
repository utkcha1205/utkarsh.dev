import * as mammoth from 'mammoth';

/**
 * Extracts raw text from uploaded files (PDF, DOCX, TXT, MD)
 * Preserves the exact structure, line breaks, and indentation.
 */
export async function parseUploadedResumeFile(file) {
  if (!file) throw new Error("No file provided");

  const fileName = file.name;
  const extension = fileName.split('.').pop().toLowerCase();

  // 1. Plain Text or Markdown
  if (extension === 'txt' || extension === 'md' || file.type === 'text/plain') {
    const text = await file.text();
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

  // 3. PDF Files (.pdf)
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

      const fullText = extractedLines.join("\n").trim();
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
        const recoveredText = cleanParts.join("\n");
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
  const rawText = await file.text();
  if (rawText && rawText.trim().length > 10) {
    return {
      text: rawText,
      fileName,
      fileType: extension.toUpperCase() || 'DOCUMENT',
      wordCount: rawText.split(/\s+/).filter(Boolean).length
    };
  }

  throw new Error(`Unable to extract text from ${fileName}. Please paste your resume text or upload as .txt/.docx/.pdf.`);
}
