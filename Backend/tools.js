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
import path from 'path';
import os from 'os';
import fs from 'fs';

// ─────────────────────────────────────────────────────────────────────────────
// DOCS DIR — exported so server.js can import it
// ─────────────────────────────────────────────────────────────────────────────
export const DOCS_DIR = path.join(os.homedir(), 'Documents', 'ReportBuilderDocs');
if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI RETRY WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
async function geminiWithRetry({ model, contents, config }) {
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return await ai.models.generateContent({ model, contents, config });
    } catch (err) {
      lastErr = err;
      const msg = err?.message || '';
      const retryable = msg.includes('503') || msg.includes('UNAVAILABLE') ||
                        msg.includes('high demand') || msg.includes('429');
      if (!retryable) throw err;
      const wait = Math.min(2000 * Math.pow(2, attempt) + Math.random() * 500, 20000);
      console.warn(`Gemini retry ${attempt + 1}, waiting ${Math.round(wait / 1000)}s`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG DIAGRAM GENERATION — replaces broken Unsplash URLs
// Asks Gemini to generate a standalone inline SVG diagram relevant to the topic.
// The SVG gets data-diagram="true" so PdfEditor can detect and offer editing.
// ─────────────────────────────────────────────────────────────────────────────
async function generateSvgDiagram(keyword, topic, bgColor = '#ffffff', primaryColor = '#3498db') {
  const isDark = (() => {
    const hex = (bgColor || '#ffffff').replace('#','').padEnd(6,'0');
    const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    return (0.299*r + 0.587*g + 0.114*b)/255 < 0.5;
  })();
  const textCol  = isDark ? '#ffffff' : '#222222';
  const subCol   = isDark ? '#cccccc' : '#555555';
  const panelBg  = isDark ? '#1a1a2e' : '#f8f9fa';
  const borderCol= isDark ? '#333366' : '#dddddd';

  const prompt = `Generate a standalone, self-contained SVG diagram about "${keyword}" in the context of "${topic}".

REQUIREMENTS:
- viewBox="0 0 800 420" width="800" height="420"
- Use these exact colors: primary=${primaryColor}, text=${textCol}, subtext=${subCol}, panel bg=${panelBg}, border=${borderCol}, page bg=${bgColor}
- Style: modern, clean, professional infographic or data visualization
- Include: a title, labeled data/sections, icons or shapes, a legend if applicable
- Choose the best diagram type for the content:
  * Bar chart — for comparisons or quantities
  * Timeline — for historical or sequential data  
  * Flow diagram — for processes or cycles
  * Pie/donut — for proportions
  * Icon grid — for categorized facts or statistics
  * Map outline — for geographic data
- All text must be readable and properly sized (min 11px)
- NO external fonts, NO images, NO <use> references — pure SVG shapes and text only
- Add data-editable="true" data-diagram="true" data-diagram-type="[type]" data-diagram-keyword="${keyword}" to the root <svg> element
- Wrap each logical section in a <g data-section="[name]"> group for editability

Return ONLY the raw SVG — no markdown, no explanation, no wrapper.`;

  try {
    const result = await geminiWithRetry({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'text/plain' },
    });
    let svg = typeof result.text === 'function' ? result.text() : result.text;
    svg = svg.replace(/^```(?:svg|xml)?\s*/i, '').replace(/\s*```$/i, '').trim();
    if (!svg.includes('<svg')) return null;
    // Ensure it starts cleanly at <svg
    svg = svg.slice(svg.indexOf('<svg'));
    return svg;
  } catch (err) {
    console.warn('SVG generation failed for', keyword, ':', err.message);
    return null;
  }
}

// Replace all Unsplash placeholder URLs with generated SVG diagrams
async function replaceImagesWithSvg(html, topic, bgColor, primaryColor) {
  // Find all <figure> blocks that contain broken img tags (Unsplash or empty src)
  const figureRegex = /<figure[^>]*>[\s\S]*?<\/figure>/gi;
  const figures = [...html.matchAll(figureRegex)];
  if (!figures.length) return html;

  // Also find loose unsplash img tags outside figures
  const unsplashRegex = /https:\/\/source\.unsplash\.com\/[^"'\s]+/g;

  // Extract keywords from alt text, figcaption, or unsplash URL
  const tasks = [];
  for (const fig of figures) {
    const block = fig[0];
    const altMatch    = block.match(/alt="([^"]+)"/i);
    const captionMatch= block.match(/<figcaption[^>]*>([^<]+)<\/figcaption>/i);
    const urlMatch    = block.match(/unsplash\.com[^"'\s]+\?([^"'\s]+)/);
    const keyword = altMatch?.[1] || captionMatch?.[1]?.slice(0,40) || urlMatch?.[1]?.replace(/[+,]/g,' ') || topic;
    tasks.push({ block, keyword: keyword.slice(0, 80) });
  }

  // Generate all SVGs in parallel
  const svgs = await Promise.all(
    tasks.map(t => generateSvgDiagram(t.keyword, topic, bgColor, primaryColor))
  );

  // Replace each figure with an SVG figure
  let result = html;
  for (let i = 0; i < tasks.length; i++) {
    const svg = svgs[i];
    if (!svg) continue;
    const { block } = tasks[i];
    const captionMatch = block.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    const caption = captionMatch ? captionMatch[1] : tasks[i].keyword;
    const uid = Math.random().toString(36).slice(2,7);
    const newFigure = `<figure data-id="fig-${uid}" data-editable="true" data-draggable="true" style="margin:24px 0;text-align:center;position:relative;cursor:move">
  ${svg}
  <figcaption data-editable="true" data-id="cap-${uid}" style="color:#888;font-size:0.85em;margin-top:8px;text-align:center">${caption}</figcaption>
</figure>`;
    result = result.replace(block, newFigure);
  }

  // Also clean up any stray unsplash URLs that weren't in figures
  result = result.replace(unsplashRegex, '');
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT HINT PARSER
// ─────────────────────────────────────────────────────────────────────────────
function mergePromptHintsIntoManifest(userPrompt = '', styleManifest = {}) {
  if (!userPrompt.trim()) return styleManifest;
  const p      = userPrompt.toLowerCase();
  const merged = { ...styleManifest };

  const colorMap = {
    'navy': '#1a1a2e', 'dark navy': '#1a1a2e', 'navy blue': '#0d1b2a',
    'black': '#111111', 'dark': '#1a1a1a', 'dark gray': '#2d2d2d', 'charcoal': '#2b2b2b',
    'white': '#ffffff', 'light': '#f8f8f8', 'light gray': '#f5f5f5',
    'blue': '#2c5f8a', 'dark blue': '#1a2f4a', 'royal blue': '#2255a4', 'sky blue': '#87ceeb',
    'green': '#1e5631', 'dark green': '#1e5631', 'emerald': '#1a6b4a', 'lime': '#90ee90',
    'red': '#8b1a1a', 'dark red': '#6b0f0f', 'crimson': '#8b0000',
    'purple': '#4a1a6b', 'dark purple': '#2d0f4a', 'violet': '#3d1a6b',
    'gold': '#b8860b', 'yellow': '#b8a600', 'amber': '#b87333',
    'orange': '#8b4000', 'brown': '#5c3317', 'slate': '#2f4f6f',
    'teal': '#008080', 'cyan': '#008b8b', 'magenta': '#8b008b', 'pink': '#c71585',
  };

  const hexBg = userPrompt.match(/(?:background|bg|page)[^\w]*(#[0-9a-fA-F]{3,6})/i)
             || userPrompt.match(/(#[0-9a-fA-F]{3,6})[^\w]*(?:background|bg)/i);
  if (hexBg) {
    merged.bgColor = hexBg[1];
  } else {
    for (const [name, hex] of Object.entries(colorMap)) {
      if (p.includes(name + ' background') || p.includes('background ' + name) ||
          p.includes(name + ' bg')         || p.includes('bg ' + name) ||
          p.includes('use a ' + name)      || p.includes('use ' + name) ||
          p.includes('make it ' + name)    || p.includes(name + ' theme') ||
          p.includes(name + ' page')       || p.includes('on a ' + name) ||
          p.includes('with a ' + name + ' back')) {
        merged.bgColor = hex; break;
      }
    }
  }

  const hexH = userPrompt.match(/(?:heading|title|h1|h2)[^\w]*(#[0-9a-fA-F]{3,6})/i)
             || userPrompt.match(/(#[0-9a-fA-F]{3,6})[^\w]*(?:heading|title)/i);
  if (hexH) {
    merged.h1Color = merged.h2Color = merged.h3Color = hexH[1];
  } else {
    for (const [name, hex] of Object.entries(colorMap)) {
      if (p.includes(name + ' heading') || p.includes('heading ' + name) ||
          p.includes(name + ' title')   || p.includes('headings in ' + name) ||
          p.includes('make headings ' + name) || p.includes(name + ' headers')) {
        merged.h1Color = merged.h2Color = merged.h3Color = hex; break;
      }
    }
  }

  const hexPrimary = userPrompt.match(/(?:primary|accent|highlight)[^\w]*(#[0-9a-fA-F]{3,6})/i);
  if (hexPrimary) merged.primaryColor = hexPrimary[1];

  if (merged.bgColor && merged.bgColor !== '#ffffff') {
    const hex = merged.bgColor.replace('#', '').padEnd(6, '0');
    const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
    if (lum < 0.4) {
      merged.pColor   = merged.pColor   || '#e0e0e0';
      merged.h1Color  = merged.h1Color  || '#ffffff';
      merged.h2Color  = merged.h2Color  || '#f0f0f0';
      merged.h3Color  = merged.h3Color  || '#dddddd';
      merged.coverBg  = merged.coverBg  || merged.primaryColor || '#0d1b2a';
      merged.footerBg = merged.footerBg || '#111111';
      merged.footerText = merged.footerText || '#888888';
    }
  }
  return merged;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD CSS + INSTRUCTION PROMPT
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

  const tableCSS = tables.map((t, i) => `
.report-table-${i+1} { width:100%; border-collapse:collapse; break-inside:avoid; margin-bottom:${paragraphSpacing}px; }
${t.hasHeader ? `
.report-table-${i+1} thead tr { background:${t.headerBg} !important; background-color:${t.headerBg} !important; color:${t.headerText}; font-weight:700; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.report-table-${i+1} thead th { padding:10px 14px; ${t.bordered?`border:1px solid ${t.borderColor};`:''} text-align:left; }` : ''}
.report-table-${i+1} tbody td { padding:8px 14px; ${t.bordered?`border:1px solid ${t.borderColor};`:''} }
.report-table-${i+1} tbody tr:nth-child(even) { ${t.striped?`background:${t.stripeBg} !important; background-color:${t.stripeBg} !important; -webkit-print-color-adjust:exact; print-color-adjust:exact;`:''} }
`).join('\n');

  const cardCSS = cards.map((c, i) => {
    const gridMap = { 'Single Column':'1fr','Two Column Grid':'repeat(2,1fr)','Three Column Grid':'repeat(3,1fr)','Bento (mixed sizes)':'repeat(3,1fr)','Full Width Banner':'1fr','Sidebar + Content':'220px 1fr' };
    return `
.card-group-${i+1} { display:grid; grid-template-columns:${gridMap[c.layout]||'1fr'}; gap:16px; margin-bottom:${paragraphSpacing}px; }
.card-group-${i+1} .card { background:${c.bg} !important; background-color:${c.bg} !important; color:${c.textColor}; border-radius:${c.radius}px; padding:${c.padding}px; -webkit-print-color-adjust:exact; print-color-adjust:exact; ${c.shadow?'box-shadow:0 2px 12px rgba(0,0,0,0.08);':''} break-inside:avoid; }`;
  }).join('\n');

  const calloutCSS = callouts.map((c, i) => {
    const bp = c.borderSide==='all' ? `border:${c.borderWidth}px solid ${c.borderColor};` : `border-${c.borderSide}:${c.borderWidth}px solid ${c.borderColor};`;
    return `.callout-${i+1} { background:${c.bg} !important; background-color:${c.bg} !important; color:${c.textColor}; ${bp} border-radius:${c.radius}px; padding:${c.padding||14}px; margin-bottom:${paragraphSpacing}px; break-inside:avoid; -webkit-print-color-adjust:exact; print-color-adjust:exact; }`;
  }).join('\n');

  const watermarkCSS = watermarkText?.trim() ? `body::before { content:"${watermarkText}"; position:fixed; top:42%; left:8%; font-size:5rem; font-weight:900; color:rgba(0,0,0,${watermarkOpacity}); transform:rotate(-35deg); pointer-events:none; z-index:0; }` : '';

  const cssBlock = `
@page { size:${pageSize} ${pageW}; margin:${margin}; }
*, *::before, *::after { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; color-adjust:exact !important; box-sizing:border-box; }
html { background:${bgColor} !important; background-color:${bgColor} !important; }
body { background:${bgColor} !important; background-color:${bgColor} !important; color:${pColor} !important; font-family:${bodyFont}; font-size:${baseFontSize}px; line-height:${lineHeight}; letter-spacing:${letterSpacing}px; text-align:${textAlign}; margin:0; padding:0; }
body > *, body > div, body > main, body > article, body > section, body > .report-wrapper, body > .main-content { background:${bgColor} !important; background-color:${bgColor} !important; }
h1 { font-family:${headingFont}; font-size:${h1Size}px; color:${h1Color} !important; margin-bottom:${paragraphSpacing}px; ${headingBorderStyle!=='none'?`border-bottom:2px ${headingBorderStyle} ${headingBorderColor};padding-bottom:6px;`:''} }
h2 { font-family:${headingFont}; font-size:${h2Size}px; color:${h2Color} !important; margin-bottom:${paragraphSpacing*0.75}px; }
h3 { font-family:${headingFont}; font-size:${h3Size}px; color:${h3Color} !important; margin-bottom:${paragraphSpacing*0.5}px; }
h4,h5,h6 { font-family:${headingFont}; color:${h3Color} !important; }
p { margin-bottom:${paragraphSpacing}px; orphans:3; widows:3; }
a { color:${linkColor}; }
ul,ol { padding-left:${listIndent}px; margin-bottom:${paragraphSpacing}px; }
li { margin-bottom:4px; }
section,.section { padding:${sectionPadding}px; break-inside:avoid; }
hr { border:none; border-top:1px ${sectionDivider} #ddd; margin:${sectionPadding}px 0; }
${columnCount>1?`main,.main-content{column-count:${columnCount};column-gap:${columnGap}px;}`:''}
.cover-page { background:${coverBg} !important; background-color:${coverBg} !important; color:${coverText}; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:60px 40px; break-after:page; -webkit-print-color-adjust:exact; }
.cover-page h1 { color:${coverText} !important; border:none; }
figure { margin:${paragraphSpacing}px 0; text-align:center; break-inside:avoid; }
figcaption { font-size:0.85em; color:#888; margin-top:6px; }
svg[data-diagram] { max-width:100%; height:auto; border-radius:6px; display:block; margin:0 auto; }
img { max-width:100%; height:auto; border-radius:6px; display:block; margin:0 auto; }
blockquote { border-left:5px solid ${primaryColor}; padding-left:20px; color:#555; font-style:italic; margin:${paragraphSpacing}px 0; }
.page-footer { background:${footerBg} !important; color:${footerText}; padding:8px 20px; display:flex; justify-content:space-between; font-size:0.8rem; border-top:1px solid #ddd; -webkit-print-color-adjust:exact; }
.page-header { background:${footerBg} !important; color:${footerText}; padding:8px 20px; display:flex; justify-content:space-between; font-size:0.8rem; border-bottom:1px solid #ddd; -webkit-print-color-adjust:exact; }
${tableCSS}${cardCSS}${calloutCSS}${watermarkCSS}`;

  const instructionBlock = `
You are an expert HTML/CSS document engineer. Generate a complete, print-ready HTML report body.

════════════════════════════════════════════════════════════
MANDATORY COLOR LAWS — NON-NEGOTIABLE:
  • Page background:  ${bgColor}  ← USE THIS EXACTLY. NOT white unless specified.
  • Body text:        ${pColor}
  • H1:  ${h1Color} | H2: ${h2Color} | H3: ${h3Color}
  • Links: ${linkColor} | Primary accent: ${primaryColor}

  EVERY <section>, <main>, <div> that is a direct child of body MUST have:
    style="background:${bgColor};background-color:${bgColor};-webkit-print-color-adjust:exact"

  The <main class="main-content"> MUST have:
    style="background:${bgColor};background-color:${bgColor};min-height:100%;-webkit-print-color-adjust:exact"
════════════════════════════════════════════════════════════

IMAGE / DIAGRAM RULES — CRITICAL:
  - Do NOT use <img> tags with external URLs. Do NOT use Unsplash URLs. They are broken.
  - Instead, use <figure> placeholders with descriptive alt text:
    <figure data-id="fig-[uid]" data-editable="true" data-draggable="true" style="margin:24px 0;text-align:center">
      <img data-id="img-[uid]" data-editable="true" alt="[DESCRIBE WHAT DIAGRAM TO GENERATE: e.g. Bar chart showing global temperature rise 1880-2024]" src="" style="max-width:100%;height:auto;border-radius:6px"/>
      <figcaption data-editable="true" data-id="cap-[uid]" style="color:#888;font-size:0.85em;margin-top:6px">[caption text]</figcaption>
    </figure>
  - The alt text will be read by the SVG generator to create the diagram — be specific and descriptive.
  - Include AT LEAST 2 figures per report.

TYPOGRAPHY:
  Body font: ${bodyFont} at ${baseFontSize}px | Heading font: ${headingFont}
  H1: ${h1Size}px | H2: ${h2Size}px | H3: ${h3Size}px
  Line height: ${lineHeight} | Paragraph spacing: ${paragraphSpacing}px

PAGE: ${pageSize} ${orientation} | Margin: ${margin}
${columnCount>1?`Columns: ${columnCount} (gap: ${columnGap}px)`:''}

HTML RULES:
- Output ONLY content inside <body> — no <html> <head> <style> tags
- data-feature on major sections
- data-editable="true" and unique data-id on EVERY editable element
- Wrap content in <main class="main-content" style="background:${bgColor};background-color:${bgColor};min-height:100%;-webkit-print-color-adjust:exact">
- Semantic tags: <main> <section> <article> <aside> <figure> <blockquote>
- Generate rich realistic content — NO placeholder text
`;

  return { cssBlock, instructionBlock };
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED: call Gemini and parse JSON, then replace image slots with SVG
// ─────────────────────────────────────────────────────────────────────────────
async function callGeminiForReport(contents, styleManifest = {}, imageMode = 'svg') {
  const {
    primaryColor = '#3498db', bgColor = '#ffffff', pColor = '#444444',
    h1Color = '#111111', linkColor = '#3498db',
    bodyFont = 'system-ui, sans-serif', headingFont = 'system-ui, sans-serif',
    baseFontSize = 14, lineHeight = 1.6, sectionPadding = 24,
    tables = [],
  } = styleManifest;

  const jsonSchema = `
Return ONLY this JSON — no markdown fences:
{
  "html": "<body content here>",
  "topic": "extracted topic in 3-5 words",
  "styleManifesto": {
    "colors": { "primary":"${primaryColor}","bg":"${bgColor}","text":"${pColor}","heading":"${h1Color}","link":"${linkColor}","tableHeader":"${tables?.[0]?.headerBg||primaryColor}" },
    "typography": { "bodyFont":"${bodyFont}","headingFont":"${headingFont}","baseSize":${baseFontSize},"lineHeight":${lineHeight},"sectionPadding":${sectionPadding} },
    "featuresUsed": ["tables","diagrams","callouts"]
  }
}`;

  let text = '';
  try {
    const result = await geminiWithRetry({
      model: 'gemini-2.5-flash',
      contents: typeof contents === 'string'
        ? contents + '\n\n' + jsonSchema
        : [...(Array.isArray(contents) ? contents : [contents]), { text: '\n\n' + jsonSchema }],
      config: { responseMimeType: 'application/json' },
    });
    text = typeof result.text === 'function' ? result.text() : result.text;
  } catch (apiErr) {
    const msg = apiErr?.message || '';
    if (msg.includes('leaked'))                         throw new Error('API_KEY_LEAKED: Your Gemini API key was reported as leaked.');
    if (msg.includes('expired'))                        throw new Error('API_KEY_EXPIRED: Your Gemini API key expired.');
    if (msg.includes('API_KEY') || msg.includes('403')) throw new Error('API_KEY_INVALID: Invalid API key.');
    throw apiErr;
  }

  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  let parsed;
  try { parsed = JSON.parse(cleaned); }
  catch { throw new Error('AI returned malformed JSON. Try again.'); }

  const raw    = parsed.styleManifesto ?? parsed.styleManifest ?? {};
  const colors = raw.colors ?? {};
  const typo   = raw.typography ?? {};
  const extractedTopic = parsed.topic || '';

  let html = parsed.html ?? '';

  // Replace image placeholders with generated SVG diagrams
  if (imageMode !== 'none') {
    html = await replaceImagesWithSvg(html, extractedTopic, bgColor, primaryColor);
  }

  return {
    html,
    styleManifesto: {
      colors: {
        primary:     colors.primary     ?? primaryColor,
        bg:          colors.bg          ?? bgColor,
        text:        colors.text        ?? pColor,
        heading:     colors.heading     ?? h1Color,
        link:        colors.link        ?? linkColor,
        tableHeader: colors.tableHeader ?? primaryColor,
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
// PUBLIC: Generate report from topic
// ─────────────────────────────────────────────────────────────────────────────
export async function generateReportHtml(topic, userPrompt = '', styleManifest = {}, imageMode = 'svg') {
  const resolved = mergePromptHintsIntoManifest(userPrompt, styleManifest);
  const { instructionBlock } = buildSystemPrompt(resolved);
  const imgInstruction = imageMode === 'none'
    ? '\nIMAGE RULES: Do NOT include any figures or images in this report.'
    : '\nIMAGE RULES: Use <figure> placeholders with descriptive alt text as described above. AI will replace them with SVG diagrams.';
  const prompt = `${instructionBlock}${imgInstruction}\n\nTOPIC: ${topic}\nUSER INSTRUCTIONS: ${userPrompt || 'None'}`;
  return callGeminiForReport(prompt, resolved, imageMode);
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Generate report from file (two-phase for fill mode)
// ─────────────────────────────────────────────────────────────────────────────
export async function generateReportHtmlFromFile(
  fileBuffer, mimeType, originalName,
  topic = '', userPrompt = '', styleManifest = {},
  mode = 'report', imageMode = 'svg'
) {
  const resolved = mergePromptHintsIntoManifest(userPrompt, styleManifest);
  const { instructionBlock } = buildSystemPrompt(resolved);

  if (mode === 'fill') {
    // Phase 1: Analyze document visual fingerprint
    const analysisPrompt = `Analyze this document and return a JSON visual fingerprint:
{
  "documentType": "form/table/letter/report/etc",
  "fonts": { "body": "font or default", "bodySize": "size", "lineHeight": "value" },
  "colors": { "background": "hex/white", "text": "hex/black", "headings": "hex", "borders": "hex", "headerRow": "hex if any" },
  "spacing": { "cellPadding": "px", "sectionGap": "px" },
  "tableStructure": { "hasTables": true/false, "hasBorders": true/false, "borderStyle": "solid/etc", "borderColor": "hex", "borderWidth": "1px/etc", "hasHeaderRow": true/false, "hasStripedRows": true/false },
  "sections": ["list of section names"],
  "blankFields": ["list of blank fields"],
  "checkboxes": ["field: checked/unchecked"]
}
Return ONLY JSON.`;

    let docProfile = {};
    try {
      const analysisContents = mimeType === 'application/pdf' || mimeType.startsWith('image/')
        ? [{ inlineData: { mimeType, data: fileBuffer.toString('base64') } }, { text: analysisPrompt }]
        : `Document:\n${fileBuffer.toString('utf8').slice(0,30000)}\n\n${analysisPrompt}`;

      const ar = await geminiWithRetry({ model:'gemini-2.5-flash', contents:analysisContents, config:{ responseMimeType:'application/json' } });
      const at = typeof ar.text === 'function' ? ar.text() : ar.text;
      docProfile = JSON.parse(at.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/i,'').trim());
    } catch(e) { console.warn('Phase 1 failed:', e.message); }

    const profileStr = Object.keys(docProfile).length > 0
      ? `\nDOCUMENT VISUAL PROFILE (follow EXACTLY):\n${JSON.stringify(docProfile,null,2)}\n` : '';

    const fillInstruction = `Reproduce this uploaded document as pixel-perfect HTML with all blanks filled in.
${profileStr}
RULES:
1. Match every font size, border, spacing, and color from the profile exactly
2. Keep every section, row, column in original order — do NOT restructure
3. Fill EVERY blank field, "______", "[  ]", "N/A", "TBD" with realistic content
4. Check appropriate checkboxes (☑ checked, ☐ unchecked)
5. Tables must use: <table style="width:100%;border-collapse:collapse">
   <td style="border:${docProfile?.tableStructure?.borderWidth||'1px'} ${docProfile?.tableStructure?.borderStyle||'solid'} ${docProfile?.tableStructure?.borderColor||'#000'};padding:${docProfile?.spacing?.cellPadding||'6px'};vertical-align:top">
6. NO cover page, NO decorative headers, NO elements not in the original
7. data-editable="true" and unique data-id on every editable element
${topic ? `CONTEXT: ${topic}` : ''}
${userPrompt ? `INSTRUCTIONS: ${userPrompt}` : ''}`;

    const fillContents = mimeType === 'application/pdf' || mimeType.startsWith('image/')
      ? [{ inlineData: { mimeType, data: fileBuffer.toString('base64') } }, { text: fillInstruction }]
      : `File "${originalName}":\n${fileBuffer.toString('utf8').slice(0,50000)}\n\n${fillInstruction}`;

    return callGeminiForReport(fillContents, resolved, 'none');
  }

  // Report mode
  const imgInstruction = imageMode === 'none'
    ? '\nIMAGE RULES: No figures.'
    : '\nIMAGE RULES: Use <figure> placeholders with descriptive alt text. AI replaces with SVG diagrams.';

  const reportInstruction = [
    `Generate a comprehensive HTML report from the uploaded file "${originalName}".`,
    topic      ? `Topic: ${topic}` : '',
    userPrompt ? `Style: ${userPrompt}` : '',
    'Extract all key data and present in a polished report with tables, callouts, and diagrams.',
    '', instructionBlock, imgInstruction,
  ].filter(Boolean).join('\n');

  const reportContents = mimeType === 'application/pdf' || mimeType.startsWith('image/')
    ? [{ inlineData: { mimeType, data: fileBuffer.toString('base64') } }, { text: reportInstruction }]
    : `File "${originalName}":\n${fileBuffer.toString('utf8').slice(0,50000)}\n\n${reportInstruction}`;

  return callGeminiForReport(reportContents, resolved, imageMode);
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Regenerate a single SVG diagram by keyword
// Called from server.js /api/regenerate-diagram
// ─────────────────────────────────────────────────────────────────────────────
export async function regenerateDiagram(keyword, topic, diagramType, bgColor, primaryColor) {
  return generateSvgDiagram(keyword, topic, bgColor, primaryColor);
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Render PDF
// ─────────────────────────────────────────────────────────────────────────────
export async function renderPdfFromHtml(html, styleManifest = {}) {
  const { cssBlock } = buildSystemPrompt(styleManifest);
  const { pageSize = 'A4', orientation = 'Portrait', bgColor = '#ffffff' } = styleManifest;

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    ${cssBlock}
    html, body { background:${bgColor} !important; background-color:${bgColor} !important; }
  </style>
</head>
<body>${html}</body>
</html>`;

  const puppeteer = (await import('puppeteer')).default;
  const browser   = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
  const page      = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil:'networkidle0' });
  await page.evaluate((bg) => {
    document.documentElement.style.setProperty('background', bg, 'important');
    document.documentElement.style.setProperty('background-color', bg, 'important');
    document.body.style.setProperty('background', bg, 'important');
    document.body.style.setProperty('background-color', bg, 'important');
  }, bgColor);
  const buffer = await page.pdf({
    format: pageSize, landscape: orientation === 'Landscape',
    printBackground: true, displayHeaderFooter: false,
  });
  await browser.close();
  return buffer;
}