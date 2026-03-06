import { GoogleGenAI } from '@google/genai';
import puppeteer from 'puppeteer';

// REMINDER: Secure your API key using process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: "" });

/**
 * Generates report HTML using AI, with dynamic style interpretation.
 */
// ///////////////////////////////////////export async function generateReportHtml(topic, retries = 3, delay = 2000) {
//     // Define Default Aesthetic Constants
//     const defaultStyles = {
//         primaryColor: "#2c3e50",
//         backgroundColor: "#ffffff",
//         accentColor: "#3498db",
//         fontFamily: "'Helvetica', sans-serif"
//     };

//     for (let i = 0; i < retries; i++) {
//         try {
//             const response = await ai.models.generateContent({
//                 model: 'gemini-2.5-flash', 
//                 contents: `
//                   Generate a professional report about: "${topic}".
                  
//                   DESIGN DIRECTIVE:
//                   1. Analyze the user's request for specific colors or styles. If they mention specific styles (e.g., "red background", "dark theme"), APPLY THEM.
//                   2. If the user request is vague, use these default values: ${JSON.stringify(defaultStyles)}.
//                   3. Mandatory Print CSS:
//                      <style>
//                        @page { size: A4; margin: 20mm; }
//                        body { 
//                            break-inside: avoid; 
//                            font-family: ${defaultStyles.fontFamily}; 
//                            line-height: 1.6;
//                            background-color: var(--bg-color, ${defaultStyles.backgroundColor});
//                            color: var(--text-color, #333);
//                        }
//                        h1 { color: var(--primary-color, ${defaultStyles.primaryColor}); border-bottom: 2px solid var(--accent-color, ${defaultStyles.accentColor}); }
//                        .page-break { page-break-after: always; }
//                      </style>
                  
//                   IMPORTANT: Inject requested colors directly into the <body> style attribute or CSS variables if the user requested a specific color scheme. Ensure all backgrounds are explicitly set.
//                   Return ONLY the raw HTML string. No markdown code blocks.
//                 `
//             });
            
//             // Safe extraction of text from the SDK response object
//             return response.text || (response.candidates && response.candidates[0].content.parts[0].text);
            
//         } catch (err) {
//             // Exponential backoff for 503 errors
//             if (err.status === 503 && i < retries - 1) {
//                 console.warn(`Server busy, retry ${i + 1}/${retries} in ${delay}ms...`);
//                 await new Promise(resolve => setTimeout(resolve, delay));
//                 delay *= 2; 
//             } else {
//                 console.error("Critical AI Error:", err);
//                 throw err;
//             }
//         }
//     }
// }



export async function generateReportHtml(topic) {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
          Generate a report about "${topic}".
          Return ONLY a valid JSON object in this format:
          {
            "html": "<h1>...</h1><p>...</p>",
            "suggestedStyles": {
              "bg": "#ffffff",
              "text": "#333333",
              "primary": "#2c3e50"
            }
          }
          Do not use markdown. Ensure colors fit the professional theme of the topic.
        `
    });
    return JSON.parse(response.text());
}




/**
 * Renders HTML to a PDF buffer, ensuring print-specific styles are applied.
 */
export async function renderPdfFromHtml(html) {
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    // Wrap the raw HTML in a full, clean document structure
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @media print {
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    body { -webkit-print-color-adjust: exact !important; }
                }
                body { margin: 0; padding: 20px; }
            </style>
        </head>
        <body>${html}</body>
        </html>
    `;

    await page.setContent(fullHtml, { waitUntil: 'domcontentloaded' });
    
    const buffer = await page.pdf({ 
        format: 'A4', 
        printBackground: true, 
        margin: { top: '20mm', bottom: '20mm' }
    });
    
    await browser.close();
    return buffer;
}

