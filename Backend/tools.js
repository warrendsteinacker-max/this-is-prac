// import { GoogleGenAI } from '@google/genai';
// import puppeteer from 'puppeteer';

// // REMINDER: Secure your API key using process.env.GEMINI_API_KEY
// const ai = new GoogleGenAI({ apiKey: "" });

// /**
//  * Generates report HTML using AI, with dynamic style interpretation.
//  */
// // ///////////////////////////////////////export async function generateReportHtml(topic, retries = 3, delay = 2000) {
// //     // Define Default Aesthetic Constants
// //     const defaultStyles = {
// //         primaryColor: "#2c3e50",
// //         backgroundColor: "#ffffff",
// //         accentColor: "#3498db",
// //         fontFamily: "'Helvetica', sans-serif"
// //     };

// //     for (let i = 0; i < retries; i++) {
// //         try {
// //             const response = await ai.models.generateContent({
// //                 model: 'gemini-2.5-flash', 
// //                 contents: `
// //                   Generate a professional report about: "${topic}".
                  
// //                   DESIGN DIRECTIVE:
// //                   1. Analyze the user's request for specific colors or styles. If they mention specific styles (e.g., "red background", "dark theme"), APPLY THEM.
// //                   2. If the user request is vague, use these default values: ${JSON.stringify(defaultStyles)}.
// //                   3. Mandatory Print CSS:
// //                      <style>
// //                        @page { size: A4; margin: 20mm; }
// //                        body { 
// //                            break-inside: avoid; 
// //                            font-family: ${defaultStyles.fontFamily}; 
// //                            line-height: 1.6;
// //                            background-color: var(--bg-color, ${defaultStyles.backgroundColor});
// //                            color: var(--text-color, #333);
// //                        }
// //                        h1 { color: var(--primary-color, ${defaultStyles.primaryColor}); border-bottom: 2px solid var(--accent-color, ${defaultStyles.accentColor}); }
// //                        .page-break { page-break-after: always; }
// //                      </style>
                  
// //                   IMPORTANT: Inject requested colors directly into the <body> style attribute or CSS variables if the user requested a specific color scheme. Ensure all backgrounds are explicitly set.
// //                   Return ONLY the raw HTML string. No markdown code blocks.
// //                 `
// //             });
            
// //             // Safe extraction of text from the SDK response object
// //             return response.text || (response.candidates && response.candidates[0].content.parts[0].text);
            
// //         } catch (err) {
// //             // Exponential backoff for 503 errors
// //             if (err.status === 503 && i < retries - 1) {
// //                 console.warn(`Server busy, retry ${i + 1}/${retries} in ${delay}ms...`);
// //                 await new Promise(resolve => setTimeout(resolve, delay));
// //                 delay *= 2; 
// //             } else {
// //                 console.error("Critical AI Error:", err);
// //                 throw err;
// //             }
// //         }
// //     }
// // }



// export async function generateReportHtml(topic) {
//     const response = await ai.models.generateContent({
//         model: 'gemini-2.5-flash',
//         contents: `
//           Generate a report about "${topic}".
//           Return ONLY a valid JSON object in this format:
//           {
//             "html": "<h1>...</h1><p>...</p>",
//             "suggestedStyles": {
//               "bg": "#ffffff",
//               "text": "#333333",
//               "primary": "#2c3e50"
//             }
//           }
//           Do not use markdown. Ensure colors fit the professional theme of the topic.
//         `
//     });
//     return JSON.parse(response.text());
// }




// /**
//  * Renders HTML to a PDF buffer, ensuring print-specific styles are applied.
//  */
// export async function renderPdfFromHtml(html) {
//     const browser = await puppeteer.launch({ 
//         headless: "new",
//         args: ['--no-sandbox', '--disable-setuid-sandbox'] 
//     });
//     const page = await browser.newPage();
    
//     // Wrap the raw HTML in a full, clean document structure
//     const fullHtml = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 @media print {
//                     * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//                     body { -webkit-print-color-adjust: exact !important; }
//                 }
//                 body { margin: 0; padding: 20px; }
//             </style>
//         </head>
//         <body>${html}</body>
//         </html>
//     `;

//     await page.setContent(fullHtml, { waitUntil: 'domcontentloaded' });
    
//     const buffer = await page.pdf({ 
//         format: 'A4', 
//         printBackground: true, 
//         margin: { top: '20mm', bottom: '20mm' }
//     });
    
//     await browser.close();
//     return buffer;
// }







// import { GoogleGenAI } from '@google/genai';
// import puppeteer from 'puppeteer';

// const ai = new GoogleGenAI({ apiKey: "AIzaSyD_tCUszFrC1ZAH_8Q60uUzg0nn6k7Z3E8" });

// /**
//  * Generates report HTML and a Style Manifesto.
//  * By returning a JSON object, the frontend can render both the 
//  * document and the control panel for manual adjustment.
//  */
// export async function generateReportHtml(topic, userPrompt = "") {
//     const response = await ai.models.generateContent({
//         model: 'gemini-2.5-flash',
//         contents: `
//           ${userPrompt}
//           Return ONLY a valid JSON object with: {"html": "...", "styleManifesto": {...}}.
//           No markdown, no code blocks.
//         `
//     });

//     // FIX: Access the response text correctly
//     // Depending on your SDK version, it is either response.text() or response.candidates[0].content.parts[0].text
//     const responseText = typeof response.text === 'function' 
//         ? await response.text() 
//         : response.candidates[0].content.parts[0].text;

//     try {
//         // Strip markdown blocks just in case the AI ignored the "No markdown" rule
//         const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
//         return JSON.parse(cleanJson);
//     } catch (err) {
//         console.error("Failed to parse AI response:", responseText);
//         throw new Error("AI returned invalid JSON.");
//     }
// }

// /**
//  * Renders HTML to a PDF buffer, injecting the current Style Manifesto
//  * to ensure print-specific styles are applied exactly as requested.
//  */
// export async function renderPdfFromHtml(html, styleManifesto) {
//     const browser = await puppeteer.launch({ 
//         headless: "new",
//         args: ['--no-sandbox', '--disable-setuid-sandbox'] 
//     });
//     const page = await browser.newPage();
    
//     // Dynamically inject CSS from the Style Manifesto
//     const css = `
//         <style>
//             @media print {
//                 * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//             }
//             body { 
//                 padding: ${styleManifesto.containers.padding}; 
//                 background-color: ${styleManifesto.colors.bg};
//                 color: ${styleManifesto.colors.text};
//             }
//             h1 { font-size: ${styleManifesto.typography.h1Size}; color: ${styleManifesto.colors.primary}; }
//             .callout { border-radius: ${styleManifesto.containers.borderRadius}; }
//         </style>
//     `;

//     await page.setContent(`<html><head>${css}</head><body>${html}</body></html>`, { 
//         waitUntil: 'networkidle0' 
//     });
    
//     const buffer = await page.pdf({ 
//         format: 'A4', 
//         printBackground: true 
//     });
    
//     await browser.close();
//     return buffer;
// }











import { GoogleGenAI } from '@google/genai';
import puppeteer from 'puppeteer';

const ai = new GoogleGenAI({ apiKey: "" });

// ─────────────────────────────────────────────────────────────────────────────
// BUILD CSS + INSTRUCTION PROMPT FROM STYLE MANIFEST
// ─────────────────────────────────────────────────────────────────────────────
function buildSystemPrompt(styleManifest = {}) {
  const {
    primaryColor = '#3498db', bgColor = '#ffffff',
    h1Color = '#111111', h2Color = '#222222', h3Color = '#333333',
    pColor = '#444444', linkColor = '#3498db',
    coverBg = '#1a1a2e', coverText = '#ffffff',
    headers = [], footers = [],
    footerBg = '#f5f5f5', footerText = '#888888',
    bodyFont = 'system-ui, sans-serif', headingFont = 'system-ui, sans-serif',
    baseFontSize = 14, h1Size = 32, h2Size = 24, h3Size = 18,
    lineHeight = 1.6, letterSpacing = 0, paragraphSpacing = 16,
    textAlign = 'left', headingBorderStyle = 'none', headingBorderColor = '#3498db',
    pageSize = 'A4', orientation = 'Portrait', margin = '20mm',
    columnCount = 1, columnGap = 20,
    sectionPadding = 24, listIndent = 20, sectionDivider = 'solid',
    tables = [], cards = [], callouts = [],
    watermarkText = '', watermarkOpacity = 0.08,
    activeStyles = [], customText = '',
  } = styleManifest;

  const pageW = orientation === 'Landscape' ? 'landscape' : 'portrait';

  // ── CSS generators ───────────────────────────────────────────────────────
  const tableCSS = tables.map((t, i) => `
.report-table-${i+1} { width:100%; border-collapse:collapse; break-inside:avoid; margin-bottom:${paragraphSpacing}px; }
${t.hasHeader ? `
.report-table-${i+1} thead tr { background:${t.headerBg} !important; background-color:${t.headerBg} !important; color:${t.headerText}; font-weight:700; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.report-table-${i+1} thead th { padding:10px 14px; ${t.bordered?`border:1px solid ${t.borderColor};`:''} text-align:left; }` : ''}
.report-table-${i+1} tbody td { padding:8px 14px; ${t.bordered?`border:1px solid ${t.borderColor};`:''} }
.report-table-${i+1} tbody tr:nth-child(even) { ${t.striped?`background:${t.stripeBg} !important; background-color:${t.stripeBg} !important; -webkit-print-color-adjust:exact; print-color-adjust:exact;`:''} }
${t.caption?`.report-table-${i+1} caption { caption-side:top; text-align:left; font-weight:600; margin-bottom:6px; color:${h2Color}; }`:''}
`).join('\n');

  const cardCSS = cards.map((c, i) => {
    const gridMap = {
      'Single Column':'1fr','Two Column Grid':'repeat(2,1fr)',
      'Three Column Grid':'repeat(3,1fr)','Bento (mixed sizes)':'repeat(3,1fr)',
      'Full Width Banner':'1fr','Sidebar + Content':'220px 1fr',
    };
    return `
.card-group-${i+1} { display:grid; grid-template-columns:${gridMap[c.layout]||'1fr'}; gap:16px; margin-bottom:${paragraphSpacing}px; }
.card-group-${i+1} .card { background:${c.bg} !important; background-color:${c.bg} !important; color:${c.textColor}; border-radius:${c.radius}px; padding:${c.padding}px; -webkit-print-color-adjust:exact; print-color-adjust:exact; ${c.shadow?'box-shadow:0 2px 12px rgba(0,0,0,0.08);':''} ${c.borderStyle!=='none'?`border:${c.borderWidth||1}px ${c.borderStyle} ${c.borderColor};`:''} break-inside:avoid; }
.card-group-${i+1} .card .card-accent { width:100%; height:4px; background:${c.accentColor} !important; background-color:${c.accentColor} !important; border-radius:2px; margin-bottom:10px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }`;
  }).join('\n');

  const calloutCSS = callouts.map((c, i) => {
    const bp = c.borderSide==='all'
      ? `border:${c.borderWidth}px solid ${c.borderColor};`
      : `border-${c.borderSide}:${c.borderWidth}px solid ${c.borderColor};`;
    return `.callout-${i+1} { background:${c.bg} !important; background-color:${c.bg} !important; color:${c.textColor}; ${bp} border-radius:${c.radius}px; padding:${c.padding||14}px; margin-bottom:${paragraphSpacing}px; break-inside:avoid; -webkit-print-color-adjust:exact; print-color-adjust:exact; }`;
  }).join('\n');

  const watermarkCSS = watermarkText?.trim() ? `
body::before { content:"${watermarkText}"; position:fixed; top:42%; left:8%; font-size:5rem; font-weight:900; color:rgba(0,0,0,${watermarkOpacity}); transform:rotate(-35deg); pointer-events:none; z-index:0; white-space:nowrap; -webkit-print-color-adjust:exact; print-color-adjust:exact; }` : '';

  const directiveCSS = (activeStyles||[]).map(s => {
    switch(s.id) {
      case 'gradient': return `header,.report-header{background:linear-gradient(135deg,${primaryColor},#ffffff)!important;}`;
      case 'bento':    return `.bento-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}.bento-grid>*{aspect-ratio:1/1;}`;
      case 'serif':    return `h1,h2,h3,h4{font-family:Georgia,serif!important;}`;
      default:         return '';
    }
  }).filter(Boolean).join('\n');

  const cssBlock = `
@page { size:${pageSize} ${pageW}; margin:${margin}; }

/* ── Force all backgrounds to print ── */
*, *::before, *::after {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
  box-sizing: border-box;
}
@media print {
  *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

body {
  background:       ${bgColor} !important;
  background-color: ${bgColor} !important;
  color:      ${pColor};
  font-family:${bodyFont};
  font-size:  ${baseFontSize}px;
  line-height:${lineHeight};
  letter-spacing:${letterSpacing}px;
  text-align: ${textAlign};
  margin:0; padding:0; position:relative;
}
/* Catch any wrapper divs that might override body bg */
body > div, body > main, body > article, body > section, body > .report-wrapper {
  background:       inherit !important;
  background-color: inherit !important;
}
h1 { font-family:${headingFont}; font-size:${h1Size}px; color:${h1Color}; margin-bottom:${paragraphSpacing}px; text-wrap:balance; ${headingBorderStyle!=='none'?`border-bottom:2px ${headingBorderStyle} ${headingBorderColor};padding-bottom:6px;`:''} }
h2 { font-family:${headingFont}; font-size:${h2Size}px; color:${h2Color}; margin-bottom:${paragraphSpacing*0.75}px; ${headingBorderStyle!=='none'?`border-bottom:1px ${headingBorderStyle} ${headingBorderColor};padding-bottom:4px;`:''} }
h3 { font-family:${headingFont}; font-size:${h3Size}px; color:${h3Color}; margin-bottom:${paragraphSpacing*0.5}px; }
h4,h5,h6 { font-family:${headingFont}; color:${h3Color}; }
p { margin-bottom:${paragraphSpacing}px; orphans:3; widows:3; }
a { color:${linkColor}; }
ul,ol { padding-left:${listIndent}px; margin-bottom:${paragraphSpacing}px; }
li { margin-bottom:4px; }
section,.section { padding:${sectionPadding}px; break-inside:avoid; }
hr { border:none; border-top:1px ${sectionDivider} #ddd; margin:${sectionPadding}px 0; }
${columnCount>1?`main,.main-content{column-count:${columnCount};column-gap:${columnGap}px;}`:''}
.cover-page {
  background:       ${coverBg} !important;
  background-color: ${coverBg} !important;
  color:${coverText};
  min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center;
  text-align:center; padding:60px 40px; break-after:page;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.cover-page h1 { color:${coverText}; border:none; }
.page-break { break-before:page; }
figure,blockquote { break-inside:avoid; }
blockquote { border-left:5px solid ${primaryColor}; padding-left:20px; color:#555; font-style:italic; margin:${paragraphSpacing}px 0; }
figure { margin:${paragraphSpacing}px 0; text-align:center; }
figcaption { font-size:0.85em; color:#888; margin-top:6px; }
img { max-width:100%; height:auto; border-radius:6px; display:block; margin:0 auto; }
.page-footer { background:${footerBg} !important; background-color:${footerBg} !important; color:${footerText}; padding:8px 20px; display:flex; justify-content:space-between; font-size:0.8rem; border-top:1px solid #ddd; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.page-header { background:${footerBg} !important; background-color:${footerBg} !important; color:${footerText}; padding:8px 20px; display:flex; justify-content:space-between; font-size:0.8rem; border-bottom:1px solid #ddd; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
${tableCSS}
${cardCSS}
${calloutCSS}
${watermarkCSS}
${directiveCSS}`;

  // ── AI instruction block ─────────────────────────────────────────────────
  const tableInstructions = tables.length
    ? tables.map((t, i) => `
TABLE ${i+1} — "${t.name}":
  - class="report-table-${i+1}" on <table>
  - Generate AT LEAST ${t.rows} rows × ${t.cols} columns
  ${t.hasHeader?`- <thead> with header cells`:'- No header row'}
  ${t.striped?'- Stripe even tbody rows':''}
  ${t.bordered?`- All cells bordered`:'- Borderless'}
  ${t.colWidths?`- Preferred widths: ${t.colWidths}`:''}
  ${t.caption?`- <caption>${t.caption}</caption>`:''}
  ${t.notes?`- Content: ${t.notes}`:''}`).join('\n')
    : 'Include as many tables as the topic needs.';

  const cardInstructions = cards.length
    ? cards.map((c, i) => `
CARD GROUP ${i+1} — "${c.name}":
  - Wrap in <div class="card-group-${i+1}">
  - Generate exactly ${c.count} <div class="card"> elements
  - Layout: ${c.layout}
  ${c.hasIcon?'- Each card: relevant SVG icon':''}
  ${c.hasImage?'- Each card: <img> with a relevant Unsplash URL':''}
  ${c.hasButton?`- Each card: <button style="background:${c.accentColor};color:#fff;border:none;padding:6px 14px;border-radius:4px">Learn More</button>`:''}
  ${c.notes?`- Content: ${c.notes}`:''}`).join('\n')
    : 'Include content cards where appropriate.';

  const calloutInstructions = callouts.length
    ? callouts.map((c, i) => `
CALLOUT ${i+1} — ${c.type} (×${c.count}):
  - <aside class="callout-${i+1}"> for each
  ${c.notes?`- Content: ${c.notes}`:''}`).join('\n')
    : 'Include callout boxes for key insights.';

  const headerHTML = headers.filter(h=>h.text?.trim()).length>0
    ? `HEADER — <div class="page-header"> as first body element:\n${headers.filter(h=>h.text?.trim()).map(h=>`  "${h.text}" ${h.position}`).join('\n')}` : '';

  const footerHTML = footers.filter(f=>f.text?.trim()).length>0
    ? `FOOTER — <div class="page-footer"> as last body element:\n${footers.filter(f=>f.text?.trim()).map(f=>`  "${f.text}" ${f.position}`).join('\n')}` : '';

  const instructionBlock = `
You are an expert HTML/CSS document engineer. Generate a complete, print-ready HTML report body.

CRITICAL COLOR LAWS — apply exactly, no exceptions:
  background-color of <body>: ${bgColor}
  All body text: ${pColor}
  H1: ${h1Color} | H2: ${h2Color} | H3: ${h3Color}
  Links: ${linkColor} | Primary accent: ${primaryColor}

BACKGROUND COLOR RULES (CRITICAL — PDF will strip backgrounds unless you follow these):
  - Every element with a background MUST have BOTH "background:#hex" AND "background-color:#hex" in its inline style.
  - Every element with a background MUST also have "-webkit-print-color-adjust:exact;print-color-adjust:exact;" in its inline style.
  - Example correct element: <div style="background:#1a73e8;background-color:#1a73e8;-webkit-print-color-adjust:exact;print-color-adjust:exact;color:#fff;padding:20px">
  - This applies to: cover page, section headers, table header rows, card backgrounds, callout boxes, ANY colored div.

IMAGE RULES (REQUIRED — include at least 2 images per report):
  - Use Unsplash source URLs in this exact format: https://source.unsplash.com/800x400/?{keyword}
  - Replace {keyword} with 1-2 words relevant to the topic (e.g. "technology", "climate,earth", "finance,money").
  - Always wrap in <figure> with a <figcaption>.
  - Example:
    <figure style="margin:16px 0;text-align:center">
      <img src="https://source.unsplash.com/800x400/?technology,innovation" style="max-width:100%;height:auto;border-radius:8px;display:block;margin:0 auto" alt="Technology"/>
      <figcaption style="color:#888;font-size:0.85em;margin-top:6px">Caption describing the image</figcaption>
    </figure>

TYPOGRAPHY:
  Body font: ${bodyFont} at ${baseFontSize}px | Heading font: ${headingFont}
  H1: ${h1Size}px | H2: ${h2Size}px | H3: ${h3Size}px
  Line height: ${lineHeight} | Letter spacing: ${letterSpacing}px
  Text align: ${textAlign} | Paragraph spacing: ${paragraphSpacing}px

PAGE: ${pageSize} ${orientation} | Margin: ${margin}
${columnCount>1?`Columns: ${columnCount} (gap: ${columnGap}px)`:''}

DIRECTIVES:
${(activeStyles||[]).map(s=>`- ${s.prompt}`).join('\n')||'Use clean semantic HTML.'}
${customText?`CUSTOM:\n${customText}`:''}

TABLES: ${tableInstructions}
CARDS:  ${cardInstructions}
CALLOUTS: ${calloutInstructions}
${headerHTML}
${footerHTML}
${watermarkText?.trim()?`WATERMARK: CSS handles "${watermarkText}" — do NOT add in HTML.`:''}

HTML RULES:
- Output ONLY content inside <body> — no <html> <head> <style> tags
- data-feature on major sections: <section data-feature="tables">
- data-section on every top-level section for drag-reorder
- data-editable="true" and unique data-id on EVERY editable element
- Wrap content in <main class="main-content">
- <figure>+<svg> for diagrams — pure SVG only
- Semantic tags: <main> <section> <article> <aside> <figure> <blockquote>
- All CSS already injected — use only the class names listed above
- Generate rich realistic content — NO placeholder text
`;

  return { cssBlock, instructionBlock };
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED: call Gemini and parse the JSON response
// ─────────────────────────────────────────────────────────────────────────────
async function callGeminiForReport(contents, styleManifest = {}) {
  const {
    primaryColor = '#3498db', bgColor = '#ffffff', pColor = '#444444',
    h1Color = '#111111', linkColor = '#3498db',
    bodyFont = 'system-ui, sans-serif', headingFont = 'system-ui, sans-serif',
    baseFontSize = 14, lineHeight = 1.6, sectionPadding = 24,
    tables = [],
  } = styleManifest;

  const jsonSchema = `
Return ONLY this JSON structure — no extra keys, no markdown fences:
{
  "html": "<body content here — rich HTML following all rules above>",
  "styleManifesto": {
    "colors": {
      "primary":     "${primaryColor}",
      "bg":          "${bgColor}",
      "text":        "${pColor}",
      "heading":     "${h1Color}",
      "link":        "${linkColor}",
      "tableHeader": "${tables?.[0]?.headerBg || primaryColor}"
    },
    "typography": {
      "bodyFont":       "${bodyFont}",
      "headingFont":    "${headingFont}",
      "baseSize":       ${baseFontSize},
      "lineHeight":     ${lineHeight},
      "sectionPadding": ${sectionPadding}
    },
    "featuresUsed": ["tables","cards","callouts","images"]
  }
}`;

  let text = '';
  try {
    const result = await ai.models.generateContent({
      model:    'gemini-2.5-flash',
      contents: typeof contents === 'string'
        ? contents + '\n\n' + jsonSchema
        : [...(Array.isArray(contents) ? contents : [contents]),
           { text: '\n\n' + jsonSchema }],
      config: { responseMimeType: 'application/json' },
    });
    text = typeof result.text === 'function' ? result.text() : result.text;
  } catch (apiErr) {
    const msg = apiErr?.message || '';
    if (msg.includes('leaked'))              throw new Error('API_KEY_LEAKED: Your Gemini API key was reported as leaked. Get a new one at https://aistudio.google.com/app/apikey');
    if (msg.includes('expired'))             throw new Error('API_KEY_EXPIRED: Your Gemini API key expired. Renew at https://aistudio.google.com/app/apikey');
    if (msg.includes('API_KEY') || msg.includes('403')) throw new Error('API_KEY_INVALID: Invalid API key. Check your .env file.');
    throw apiErr;
  }

  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error('Parse failed (first 1000 chars):\n', cleaned.slice(0, 1000));
    throw new Error('AI returned malformed JSON. Try again.');
  }

  const raw    = parsed.styleManifesto ?? parsed.styleManifest ?? {};
  const colors = raw.colors  ?? raw.branding ?? {};
  const typo   = raw.typography ?? {};

  return {
    html: parsed.html ?? '',
    styleManifesto: {
      colors: {
        primary:     colors.primary     ?? primaryColor,
        bg:          colors.bg          ?? bgColor,
        text:        colors.text        ?? pColor,
        heading:     colors.heading     ?? h1Color,
        link:        colors.link        ?? linkColor,
        tableHeader: colors.tableHeader ?? tables?.[0]?.headerBg ?? primaryColor,
      },
      typography: {
        bodyFont:       typo.bodyFont       ?? bodyFont,
        headingFont:    typo.headingFont    ?? headingFont,
        baseSize:       typo.baseSize       ?? baseFontSize,
        lineHeight:     typo.lineHeight     ?? lineHeight,
        sectionPadding: typo.sectionPadding ?? sectionPadding,
      },
      featuresUsed: Array.isArray(raw.featuresUsed) ? raw.featuresUsed : [],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE REPORT HTML — text only
// ─────────────────────────────────────────────────────────────────────────────
export async function generateReportHtml(topic, userPrompt = '', styleManifest = {}) {
  const { instructionBlock } = buildSystemPrompt(styleManifest);
  const prompt = `${instructionBlock}\n\nTOPIC: ${topic}\nUSER INSTRUCTIONS: ${userPrompt || 'None'}`;
  return callGeminiForReport(prompt, styleManifest);
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE REPORT HTML — from uploaded file
// Supports: PDF (base64), images (base64), plain text
// ─────────────────────────────────────────────────────────────────────────────
export async function generateReportHtmlFromFile(fileBuffer, mimeType, originalName, topic = '', userPrompt = '', styleManifest = {}) {
  const { instructionBlock } = buildSystemPrompt(styleManifest);

  const userInstruction = [
    `Generate a comprehensive, well-structured HTML report based on the content of the uploaded file "${originalName}".`,
    topic      ? `Report topic/title: ${topic}` : '',
    userPrompt ? `Additional style instructions: ${userPrompt}` : '',
    'Extract all key data, facts, and insights from the file. Present them in a polished report with tables, callouts, and relevant images.',
    '',
    instructionBlock,
  ].filter(Boolean).join('\n');

  let contents;

  if (mimeType === 'application/pdf') {
    // Gemini supports inline PDF as base64
    contents = [
      {
        inlineData: {
          mimeType: 'application/pdf',
          data:     fileBuffer.toString('base64'),
        },
      },
      { text: userInstruction },
    ];
  } else if (mimeType.startsWith('image/')) {
    // Vision input
    contents = [
      {
        inlineData: {
          mimeType,
          data: fileBuffer.toString('base64'),
        },
      },
      { text: userInstruction },
    ];
  } else {
    // Plain text / CSV / JSON / HTML — embed as text, cap at 50k chars
    const fileText = fileBuffer.toString('utf8').slice(0, 50000);
    contents = `File contents of "${originalName}":\n\n${fileText}\n\n${userInstruction}`;
  }

  return callGeminiForReport(contents, styleManifest);
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER PDF
// ─────────────────────────────────────────────────────────────────────────────
export async function renderPdfFromHtml(html, styleManifest = {}) {
  const { cssBlock } = buildSystemPrompt(styleManifest);
  const { pageSize = 'A4', orientation = 'Portrait' } = styleManifest;

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>${cssBlock}</style>
</head>
<body>${html}</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

  const buffer = await page.pdf({
    format:              pageSize,
    landscape:           orientation === 'Landscape',
    printBackground:     true,   // ← critical: without this ALL backgrounds are stripped
    displayHeaderFooter: false,
  });

  await browser.close();
  return buffer;
}