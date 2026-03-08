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













import { GoogleGenerativeAI } from '@google/generative-ai';
import puppeteer from 'puppeteer';

if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL: GEMINI_API_KEY environment variable is not set.');
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// BUILD FULL SYSTEM PROMPT FROM STYLE MANIFEST
// Converts every frontend control into concrete AI instructions
// ─────────────────────────────────────────────────────────────────────────────
function buildSystemPrompt(styleManifest = {}) {
  const {
    // Brand
    primaryColor = '#3498db', bgColor = '#ffffff',
    // Heading colors
    h1Color = '#111111', h2Color = '#222222', h3Color = '#333333',
    pColor = '#444444', linkColor = '#3498db',
    // Cover
    coverBg = '#1a1a2e', coverText = '#ffffff',
    // Header/footer
    headers = [], footers = [],
    footerBg = '#f5f5f5', footerText = '#888888',
    // Typography
    bodyFont = 'system-ui, sans-serif', headingFont = 'system-ui, sans-serif',
    baseFontSize = 14, h1Size = 32, h2Size = 24, h3Size = 18,
    lineHeight = 1.6, letterSpacing = 0, paragraphSpacing = 16,
    textAlign = 'left', headingBorderStyle = 'none', headingBorderColor = '#3498db',
    // Page layout
    pageSize = 'A4', orientation = 'Portrait', margin = '20mm',
    columnCount = 1, columnGap = 20,
    sectionPadding = 24, listIndent = 20, sectionDivider = 'solid',
    // Tables array
    tables = [],
    // Cards array
    cards = [],
    // Callouts array
    callouts = [],
    // Watermark
    watermarkText = '', watermarkOpacity = 0.08,
    // Style directives
    activeStyles = [],
    // Custom instructions
    customText = '',
  } = styleManifest;

  const pageW = orientation === 'Landscape' ? 'landscape' : 'portrait';

  // ── Table CSS generator ──────────────────────────────────────────────────
  const tableCSS = tables.map((t, i) => `
  /* Table ${i + 1}: ${t.name} */
  .report-table-${i + 1} {
    width: 100%;
    border-collapse: collapse;
    break-inside: avoid;
    margin-bottom: ${paragraphSpacing}px;
    ${t.colWidths ? '' : ''}
  }
  ${t.hasHeader ? `
  .report-table-${i + 1} thead tr {
    background: ${t.headerBg};
    color: ${t.headerText};
    font-weight: 700;
  }
  .report-table-${i + 1} thead th {
    padding: 10px 14px;
    ${t.bordered ? `border: 1px solid ${t.borderColor};` : ''}
    text-align: left;
  }` : ''}
  .report-table-${i + 1} tbody td {
    padding: 8px 14px;
    ${t.bordered ? `border: 1px solid ${t.borderColor};` : ''}
  }
  ${t.striped ? `
  .report-table-${i + 1} tbody tr:nth-child(even) {
    background: ${t.stripeBg};
  }` : ''}
  ${t.caption ? `
  .report-table-${i + 1} caption {
    caption-side: top;
    text-align: left;
    font-weight: 600;
    margin-bottom: 6px;
    color: ${h2Color};
  }` : ''}`).join('\n');

  // ── Card CSS generator ───────────────────────────────────────────────────
  const cardCSS = cards.map((c, i) => {
    const gridMap = {
      'Single Column':      'grid-template-columns: 1fr;',
      'Two Column Grid':    'grid-template-columns: repeat(2, 1fr);',
      'Three Column Grid':  'grid-template-columns: repeat(3, 1fr);',
      'Bento (mixed sizes)':'grid-template-columns: repeat(3, 1fr);',
      'Full Width Banner':  'grid-template-columns: 1fr;',
      'Sidebar + Content':  'grid-template-columns: 220px 1fr;',
    };
    return `
  /* Card Group ${i + 1}: ${c.name} — ${c.layout} */
  .card-group-${i + 1} {
    display: grid;
    ${gridMap[c.layout] || 'grid-template-columns: 1fr;'}
    gap: 16px;
    margin-bottom: ${paragraphSpacing}px;
  }
  .card-group-${i + 1} .card {
    background: ${c.bg};
    color: ${c.textColor};
    border-radius: ${c.radius}px;
    padding: ${c.padding}px;
    ${c.shadow ? 'box-shadow: 0 2px 12px rgba(0,0,0,0.08);' : ''}
    ${c.borderStyle !== 'none' ? `border: ${c.borderWidth ?? 1}px ${c.borderStyle} ${c.borderColor};` : ''}
    break-inside: avoid;
  }
  .card-group-${i + 1} .card .card-accent {
    width: 100%;
    height: 4px;
    background: ${c.accentColor};
    border-radius: 2px;
    margin-bottom: 10px;
  }`;
  }).join('\n');

  // ── Callout CSS generator ────────────────────────────────────────────────
  const calloutCSS = callouts.map((c, i) => {
    const borderProp = c.borderSide === 'all'
      ? `border: ${c.borderWidth}px solid ${c.borderColor};`
      : `border-${c.borderSide}: ${c.borderWidth}px solid ${c.borderColor};`;
    return `
  /* Callout ${i + 1}: ${c.type} */
  .callout-${i + 1} {
    background: ${c.bg};
    color: ${c.textColor};
    ${borderProp}
    border-radius: ${c.radius}px;
    padding: ${c.padding ?? 14}px;
    margin-bottom: ${paragraphSpacing}px;
    break-inside: avoid;
  }`;
  }).join('\n');

  // ── Header/footer runners ────────────────────────────────────────────────
  const headerRunner = headers.filter(h => h.text?.trim()).length > 0 ? `
  .page-header {
    background: ${footerBg};
    color: ${footerText};
    padding: 8px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    border-bottom: 1px solid #ddd;
    position: running(pageHeader);
  }
  @page { @top-center { content: element(pageHeader); } }` : '';

  const footerRunner = footers.filter(f => f.text?.trim()).length > 0 ? `
  .page-footer {
    background: ${footerBg};
    color: ${footerText};
    padding: 8px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    border-top: 1px solid #ddd;
    position: running(pageFooter);
  }
  @page { @bottom-center { content: element(pageFooter); } }` : '';

  // ── Watermark ────────────────────────────────────────────────────────────
  const watermarkCSS = watermarkText?.trim() ? `
  body::before {
    content: "${watermarkText}";
    position: fixed;
    top: 42%;
    left: 8%;
    font-size: 5rem;
    font-weight: 900;
    color: rgba(0,0,0,${watermarkOpacity});
    transform: rotate(-35deg);
    pointer-events: none;
    z-index: 0;
    white-space: nowrap;
    -webkit-print-color-adjust: exact;
  }` : '';

  // ── Active style directives → extra CSS ─────────────────────────────────
  const directiveCSS = (activeStyles || []).map(s => {
    switch (s.id) {
      case 'dark':     return `body { filter: none; } :root { color-scheme: dark; }`;
      case 'gradient': return `header, .report-header { background: linear-gradient(135deg, ${primaryColor}, #ffffff) !important; }`;
      case 'bento':    return `.bento-grid { display: grid; grid-template-columns: repeat(3,1fr); gap:16px; } .bento-grid > * { aspect-ratio: 1/1; }`;
      case 'serif':    return `h1,h2,h3,h4 { font-family: Georgia, serif !important; }`;
      case 'toc':      return `.toc { margin-bottom: 32px; } .toc a { display:flex; justify-content:space-between; } .toc a::after { content: leader('.') target-counter(attr(href), page); }`;
      default:         return '';
    }
  }).filter(Boolean).join('\n');

  // ── Full CSS block ───────────────────────────────────────────────────────
  const fullCSS = `
@page {
  size: ${pageSize} ${pageW};
  margin: ${margin};
}

@media print {
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}

*, *::before, *::after { box-sizing: border-box; }

body {
  background-color: ${bgColor};
  color: ${pColor};
  font-family: ${bodyFont};
  font-size: ${baseFontSize}px;
  line-height: ${lineHeight};
  letter-spacing: ${letterSpacing}px;
  text-align: ${textAlign};
  margin: 0;
  padding: 0;
  position: relative;
}

h1 { font-family: ${headingFont}; font-size: ${h1Size}px; color: ${h1Color}; margin-bottom: ${paragraphSpacing}px; text-wrap: balance;
  ${headingBorderStyle !== 'none' ? `border-bottom: 2px ${headingBorderStyle} ${headingBorderColor}; padding-bottom: 6px;` : ''} }
h2 { font-family: ${headingFont}; font-size: ${h2Size}px; color: ${h2Color}; margin-bottom: ${paragraphSpacing * 0.75}px; text-wrap: balance;
  ${headingBorderStyle !== 'none' ? `border-bottom: 1px ${headingBorderStyle} ${headingBorderColor}; padding-bottom: 4px;` : ''} }
h3 { font-family: ${headingFont}; font-size: ${h3Size}px; color: ${h3Color}; margin-bottom: ${paragraphSpacing * 0.5}px; }
h4, h5, h6 { font-family: ${headingFont}; color: ${h3Color}; }

p { margin-bottom: ${paragraphSpacing}px; orphans: 3; widows: 3; }
a { color: ${linkColor}; }

ul, ol { padding-left: ${listIndent}px; margin-bottom: ${paragraphSpacing}px; }
li { margin-bottom: 4px; }

section, .section {
  padding: ${sectionPadding}px;
  break-inside: avoid;
}

hr {
  border: none;
  border-top: 1px ${sectionDivider} #ddd;
  margin: ${sectionPadding}px 0;
}

${columnCount > 1 ? `
main, .main-content {
  column-count: ${columnCount};
  column-gap: ${columnGap}px;
}` : ''}

/* Cover page */
.cover-page {
  background: ${coverBg};
  color: ${coverText};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 40px;
  break-after: page;
}
.cover-page h1 { color: ${coverText}; border: none; }

/* Page breaks */
.page-break { break-before: page; }
figure, blockquote { break-inside: avoid; }

/* Blockquote */
blockquote {
  border-left: 5px solid ${primaryColor};
  padding-left: 20px;
  color: #555;
  font-style: italic;
  margin: ${paragraphSpacing}px 0;
  break-inside: avoid;
}

/* SVG figures */
figure {
  margin: ${paragraphSpacing}px 0;
  text-align: center;
}
figcaption {
  font-size: 0.85em;
  color: #888;
  margin-top: 6px;
}

${tableCSS}
${cardCSS}
${calloutCSS}
${headerRunner}
${footerRunner}
${watermarkCSS}
${directiveCSS}
`;

  // ── Table HTML instruction block for AI ─────────────────────────────────
  const tableInstructions = tables.map((t, i) => `
TABLE ${i + 1} — "${t.name}":
  - Use class "report-table-${i + 1}" on the <table> element
  - Size: ${t.rows} data rows × ${t.cols} columns
  ${t.hasHeader ? `- Include <thead> with ${t.cols} <th> elements` : '- No header row'}
  ${t.striped ? '- Stripe every even tbody row' : ''}
  ${t.bordered ? `- All cells have borders (color: ${t.borderColor})` : '- Borderless'}
  ${t.colWidths ? `- Column widths: ${t.colWidths}` : ''}
  ${t.caption ? `- Add <caption>${t.caption}</caption>` : ''}
  ${t.notes ? `- Content context: ${t.notes}` : ''}
`).join('\n');

  // ── Card HTML instruction block for AI ──────────────────────────────────
  const cardInstructions = cards.map((c, i) => `
CARD GROUP ${i + 1} — "${c.name}":
  - Wrap all cards in a <div class="card-group-${i + 1}">
  - Generate exactly ${c.count} <div class="card"> elements inside it
  - Layout: ${c.layout}
  ${c.hasIcon ? '- Each card starts with a relevant SVG icon (24×24)' : ''}
  ${c.hasImage ? '- Each card includes an <img> placeholder' : ''}
  ${c.hasButton ? `- Each card ends with a <button style="background:${c.accentColor};color:#fff;border:none;padding:6px 14px;border-radius:4px;cursor:pointer">Learn More</button>` : ''}
  ${c.notes ? `- Content context: ${c.notes}` : ''}
`).join('\n');

  // ── Callout HTML instruction block for AI ────────────────────────────────
  const calloutInstructions = callouts.map((c, i) => `
CALLOUT TYPE ${i + 1} — ${c.type} (×${c.count}):
  - Use <aside class="callout-${i + 1}"> for each occurrence
  - Place ${c.count} of these callouts at contextually appropriate points
  ${c.notes ? `- Content context: ${c.notes}` : ''}
`).join('\n');

  // ── Header/footer HTML ───────────────────────────────────────────────────
  const headerHTML = headers.filter(h => h.text?.trim()).length > 0 ? `
HEADER: Generate a <div class="page-header"> as the first element in <body>:
${headers.filter(h => h.text?.trim()).map(h => `  - "${h.text}" aligned ${h.position}`).join('\n')}
` : '';

  const footerHTML = footers.filter(f => f.text?.trim()).length > 0 ? `
FOOTER: Generate a <div class="page-footer"> as the last element in <body>:
${footers.filter(f => f.text?.trim()).map(f => `  - "${f.text.replace('{page}', 'Page [auto-number]')}" aligned ${f.position}`).join('\n')}
` : '';

  // ── Active style directive text instructions ─────────────────────────────
  const directiveInstructions = (activeStyles || []).map(s => `- ${s.prompt}`).join('\n');

  return `
You are an expert HTML/CSS document engineer. Generate a complete, print-ready HTML report body.

═══════════════════════════════════════════════
GLOBAL STYLE LAWS (apply to every element)
═══════════════════════════════════════════════
Primary color: ${primaryColor}
Background: ${bgColor}
Body text: ${pColor}
H1: ${h1Color} at ${h1Size}px
H2: ${h2Color} at ${h2Size}px  
H3: ${h3Color} at ${h3Size}px
Links: ${linkColor}
Body font: ${bodyFont}
Heading font: ${headingFont}
Font size: ${baseFontSize}px | Line height: ${lineHeight} | Letter spacing: ${letterSpacing}px
Text align: ${textAlign} | Paragraph spacing: ${paragraphSpacing}px
Page: ${pageSize} ${orientation} | Margin: ${margin}
${columnCount > 1 ? `Columns: ${columnCount} (gap: ${columnGap}px)` : ''}

═══════════════════════════════════════════════
STRUCTURE DIRECTIVES
═══════════════════════════════════════════════
${directiveInstructions || 'Use clean semantic HTML.'}
${customText ? `\nCUSTOM INSTRUCTIONS:\n${customText}` : ''}

═══════════════════════════════════════════════
TABLES — generate exactly as specified
═══════════════════════════════════════════════
${tableInstructions || 'Include tables where appropriate for the topic.'}

═══════════════════════════════════════════════
CARD GROUPS — generate exactly as specified
═══════════════════════════════════════════════
${cardInstructions || 'Include content cards where appropriate.'}

═══════════════════════════════════════════════
CALLOUT BOXES — generate exactly as specified
═══════════════════════════════════════════════
${calloutInstructions || 'Include callouts for key insights.'}

${headerHTML}
${footerHTML}
${watermarkText?.trim() ? `WATERMARK: The CSS already handles the watermark "${watermarkText}" — do not add it in HTML.` : ''}

═══════════════════════════════════════════════
HTML ENGINEERING RULES
═══════════════════════════════════════════════
- Output ONLY the content that goes inside <body> — no <html>, <head>, or <style> tags
- Use data-feature attributes on major sections: <section data-feature="tables">, <section data-feature="cards"> etc.
- Use data-section attribute on every top-level section for drag-reorder support
- Use data-editable="true" and a unique data-id on every editable element
- Wrap main text content in <main class="main-content"> for column-count support
- Add class="page-break" on divs that should start a new PDF page
- Use <figure> + <svg> for any diagrams or charts — pure SVG, no external libs
- Use break-inside: avoid inline on any element that must not be split across pages
- Use semantic tags: <main>, <section>, <article>, <aside>, <figure>, <blockquote>
- All CSS is already injected — only use the class names specified above
- Generate rich, realistic content appropriate for the topic (not placeholder text)
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE REPORT HTML + MANIFESTO
// ─────────────────────────────────────────────────────────────────────────────
export async function generateReportHtml(topic, userPrompt = '', styleManifest = {}) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const systemPrompt = buildSystemPrompt(styleManifest);

  const prompt = `
${systemPrompt}

═══════════════════════════════════════════════
REPORT TOPIC & USER INSTRUCTIONS
═══════════════════════════════════════════════
Topic: ${topic}
User Instructions: ${userPrompt}

Return a JSON object with exactly this structure:
{
  "html": "string — full body content as described above",
  "styleManifesto": {
    "colors": {
      "primary": "${styleManifest.primaryColor || '#3498db'}",
      "bg":      "${styleManifest.bgColor      || '#ffffff'}",
      "text":    "${styleManifest.pColor        || '#444444'}",
      "heading": "${styleManifest.h1Color       || '#111111'}",
      "link":    "${styleManifest.linkColor     || '#3498db'}",
      "tableHeader": "${styleManifest.tables?.[0]?.headerBg || '#3498db'}"
    },
    "typography": {
      "bodyFont":      "${styleManifest.bodyFont    || 'system-ui, sans-serif'}",
      "headingFont":   "${styleManifest.headingFont || 'system-ui, sans-serif'}",
      "baseSize":      ${styleManifest.baseFontSize  || 14},
      "lineHeight":    ${styleManifest.lineHeight     || 1.6},
      "sectionPadding":${styleManifest.sectionPadding || 24}
    },
    "featuresUsed": ["list every data-feature section name used, e.g. tables, cards, callouts, cover, toc, charts"]
  }
}
`;

  let text = '';
  try {
    const result = await model.generateContent(prompt);
    text = result.response.text();
  } catch (apiErr) {
    // Surface Google API key errors clearly
    const msg = apiErr?.message || '';
    if (msg.includes('leaked'))   throw new Error('API_KEY_LEAKED: Your Gemini API key has been reported as leaked. Generate a new key at https://aistudio.google.com/app/apikey and update your .env file.');
    if (msg.includes('expired'))  throw new Error('API_KEY_EXPIRED: Your Gemini API key has expired. Renew it at https://aistudio.google.com/app/apikey and update your .env file.');
    if (msg.includes('API_KEY'))  throw new Error('API_KEY_INVALID: Your Gemini API key is invalid. Check your .env file.');
    throw apiErr;
  }

  // Strip markdown fences if model ignores responseMimeType
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    console.error('Parse failed. Raw AI output (first 800 chars):\n', cleaned.slice(0, 800));
    throw new Error('AI returned malformed JSON. Try again or simplify your style manifest.');
  }

  // ── Normalize the manifesto shape ───────────────────────────────────────
  // The AI sometimes returns a verbose "design system" manifesto instead of
  // the flat shape the frontend expects. Normalize it here.
  const raw = parsed.styleManifesto ?? parsed.styleManifest ?? {};

  const colors    = raw.colors    ?? raw.branding   ?? {};
  const typo      = raw.typography ?? {};
  const containers= raw.containers ?? raw.components?.card ?? {};

  const normalizedManifesto = {
    colors: {
      primary:     colors.primary     ?? colors.primaryColor  ?? styleManifest.primaryColor ?? '#3498db',
      bg:          colors.bg          ?? colors.background    ?? styleManifest.bgColor      ?? '#ffffff',
      text:        colors.text        ?? colors.bodyText      ?? styleManifest.pColor       ?? '#444444',
      heading:     colors.heading     ?? colors.headingColor  ?? styleManifest.h1Color      ?? '#111111',
      link:        colors.link        ?? colors.linkColor     ?? styleManifest.linkColor    ?? '#3498db',
      tableHeader: colors.tableHeader ?? styleManifest.tables?.[0]?.headerBg               ?? '#3498db',
    },
    typography: {
      bodyFont:       typo.bodyFont      ?? typo.fontFamily    ?? styleManifest.bodyFont       ?? 'system-ui, sans-serif',
      headingFont:    typo.headingFont   ?? typo.headingFontFamily ?? styleManifest.headingFont ?? 'system-ui, sans-serif',
      baseSize:       typeof typo.baseSize === 'number' ? typo.baseSize : parseInt(typo.baseFontSize) || styleManifest.baseFontSize || 14,
      lineHeight:     typo.lineHeight    ?? styleManifest.lineHeight    ?? 1.6,
      sectionPadding: typo.sectionPadding ?? styleManifest.sectionPadding ?? 24,
    },
    featuresUsed: Array.isArray(parsed.styleManifesto?.featuresUsed)
      ? parsed.styleManifesto.featuresUsed
      : [],
  };

  return { html: parsed.html ?? '', styleManifesto: normalizedManifesto };
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER PDF FROM HTML + STYLE MANIFEST
// ─────────────────────────────────────────────────────────────────────────────
export async function renderPdfFromHtml(html, styleManifest = {}) {
  const {
    pageSize = 'A4',
    orientation = 'Portrait',
    margin = '20mm',
    primaryColor = '#3498db', bgColor = '#ffffff',
    pColor = '#444444', h1Color = '#111111', h2Color = '#222222', h3Color = '#333333',
    linkColor = '#3498db',
    bodyFont = 'system-ui, sans-serif', headingFont = 'system-ui, sans-serif',
    baseFontSize = 14, h1Size = 32, h2Size = 24, h3Size = 18,
    lineHeight = 1.6, letterSpacing = 0, paragraphSpacing = 16,
    textAlign = 'left', headingBorderStyle = 'none', headingBorderColor = '#3498db',
    columnCount = 1, columnGap = 20, sectionPadding = 24, listIndent = 20,
    sectionDivider = 'solid', coverBg = '#1a1a2e', coverText = '#ffffff',
    footerBg = '#f5f5f5', footerText = '#888888',
    watermarkText = '', watermarkOpacity = 0.08,
    tables = [], cards = [], callouts = [], activeStyles = [], customText = '',
  } = styleManifest;

  // Re-use buildSystemPrompt to get the exact same CSS the AI was told about
  const cssBlock = buildSystemPrompt(styleManifest)
    .split('═══')[0]; // we only need the CSS, but easier to regenerate below

  // Build CSS directly for Puppeteer injection (same logic as buildSystemPrompt)
  const tableCSS = tables.map((t, i) => `
.report-table-${i+1} { width:100%; border-collapse:collapse; break-inside:avoid; margin-bottom:${paragraphSpacing}px; }
${t.hasHeader ? `.report-table-${i+1} thead tr { background:${t.headerBg}; color:${t.headerText}; font-weight:700; }
.report-table-${i+1} thead th { padding:10px 14px; ${t.bordered?`border:1px solid ${t.borderColor};`:''} text-align:left; }` : ''}
.report-table-${i+1} tbody td { padding:8px 14px; ${t.bordered?`border:1px solid ${t.borderColor};`:''} }
${t.striped ? `.report-table-${i+1} tbody tr:nth-child(even) { background:${t.stripeBg}; }` : ''}`).join('');

  const cardCSS = cards.map((c, i) => {
    const gridMap = { 'Single Column':'1fr','Two Column Grid':'repeat(2,1fr)','Three Column Grid':'repeat(3,1fr)','Bento (mixed sizes)':'repeat(3,1fr)','Full Width Banner':'1fr','Sidebar + Content':'220px 1fr' };
    return `.card-group-${i+1} { display:grid; grid-template-columns:${gridMap[c.layout]||'1fr'}; gap:16px; margin-bottom:${paragraphSpacing}px; }
.card-group-${i+1} .card { background:${c.bg}; color:${c.textColor}; border-radius:${c.radius}px; padding:${c.padding}px; ${c.shadow?'box-shadow:0 2px 12px rgba(0,0,0,0.08);':''} ${c.borderStyle!=='none'?`border:${c.borderWidth||1}px ${c.borderStyle} ${c.borderColor};`:''} break-inside:avoid; }
.card-group-${i+1} .card .card-accent { width:100%; height:4px; background:${c.accentColor}; border-radius:2px; margin-bottom:10px; }`;
  }).join('');

  const calloutCSS = callouts.map((c, i) => {
    const bp = c.borderSide==='all' ? `border:${c.borderWidth}px solid ${c.borderColor};` : `border-${c.borderSide}:${c.borderWidth}px solid ${c.borderColor};`;
    return `.callout-${i+1} { background:${c.bg}; color:${c.textColor}; ${bp} border-radius:${c.radius}px; padding:${c.padding||14}px; margin-bottom:${paragraphSpacing}px; break-inside:avoid; }`;
  }).join('');

  const watermarkCSS = watermarkText?.trim() ? `body::before { content:"${watermarkText}"; position:fixed; top:42%; left:8%; font-size:5rem; font-weight:900; color:rgba(0,0,0,${watermarkOpacity}); transform:rotate(-35deg); pointer-events:none; z-index:0; white-space:nowrap; -webkit-print-color-adjust:exact; }` : '';

  const directiveCSS = (activeStyles||[]).map(s => {
    switch(s.id) {
      case 'gradient': return `header,.report-header{background:linear-gradient(135deg,${primaryColor},#ffffff)!important;}`;
      case 'bento':    return `.bento-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}.bento-grid>*{aspect-ratio:1/1;}`;
      case 'serif':    return `h1,h2,h3,h4{font-family:Georgia,serif!important;}`;
      default:         return '';
    }
  }).filter(Boolean).join('');

  const fullCSS = `
@page { size: ${pageSize} ${orientation === 'Landscape' ? 'landscape' : 'portrait'}; margin: ${margin}; }
@media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }
*, *::before, *::after { box-sizing: border-box; }
body { background-color:${bgColor}; color:${pColor}; font-family:${bodyFont}; font-size:${baseFontSize}px; line-height:${lineHeight}; letter-spacing:${letterSpacing}px; text-align:${textAlign}; margin:0; padding:0; position:relative; }
h1 { font-family:${headingFont}; font-size:${h1Size}px; color:${h1Color}; margin-bottom:${paragraphSpacing}px; text-wrap:balance; ${headingBorderStyle!=='none'?`border-bottom:2px ${headingBorderStyle} ${headingBorderColor};padding-bottom:6px;`:''} }
h2 { font-family:${headingFont}; font-size:${h2Size}px; color:${h2Color}; margin-bottom:${paragraphSpacing*.75}px; ${headingBorderStyle!=='none'?`border-bottom:1px ${headingBorderStyle} ${headingBorderColor};padding-bottom:4px;`:''} }
h3 { font-family:${headingFont}; font-size:${h3Size}px; color:${h3Color}; margin-bottom:${paragraphSpacing*.5}px; }
p { margin-bottom:${paragraphSpacing}px; orphans:3; widows:3; }
a { color:${linkColor}; }
ul,ol { padding-left:${listIndent}px; margin-bottom:${paragraphSpacing}px; }
section,.section { padding:${sectionPadding}px; break-inside:avoid; }
hr { border:none; border-top:1px ${sectionDivider} #ddd; margin:${sectionPadding}px 0; }
${columnCount>1 ? `main,.main-content{column-count:${columnCount};column-gap:${columnGap}px;}` : ''}
.cover-page { background:${coverBg}; color:${coverText}; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:60px 40px; break-after:page; }
.cover-page h1 { color:${coverText}; border:none; }
.page-break { break-before:page; }
figure,blockquote { break-inside:avoid; }
blockquote { border-left:5px solid ${primaryColor}; padding-left:20px; color:#555; font-style:italic; margin:${paragraphSpacing}px 0; }
figure { margin:${paragraphSpacing}px 0; text-align:center; }
figcaption { font-size:0.85em; color:#888; margin-top:6px; }
.page-footer { background:${footerBg}; color:${footerText}; padding:8px 20px; display:flex; justify-content:space-between; font-size:0.8rem; border-top:1px solid #ddd; }
.page-header { background:${footerBg}; color:${footerText}; padding:8px 20px; display:flex; justify-content:space-between; font-size:0.8rem; border-bottom:1px solid #ddd; }
${tableCSS}
${cardCSS}
${calloutCSS}
${watermarkCSS}
${directiveCSS}
`;

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>${fullCSS}</style>
</head>
<body>${html}</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

  // Determine paper format or custom size
  const formatMap = { A4:'A4', A3:'A3', Letter:'Letter', Legal:'Legal', Tabloid:'Tabloid' };
  const pdfFormat = formatMap[pageSize] || 'A4';

  const buffer = await page.pdf({
    format:          pdfFormat,
    landscape:       orientation === 'Landscape',
    printBackground: true,
    displayHeaderFooter: false, // handled via CSS running elements
  });

  await browser.close();
  return buffer;
}