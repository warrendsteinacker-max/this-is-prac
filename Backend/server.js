// const express = require('express');
// const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// require('dotenv').config();

// const { JSONFileSyncPreset } = require('lowdb/node');
// const defaultData = { users: [] }; 
// const db = JSONFileSyncPreset('db.json', defaultData);
// import express from 'express';
// import cors from 'cors';
// // import AI from './AI.js;'

// import {GoogleGenAI} from '@google/genai';

// const ai = new GoogleGenAI({
//     apiKey: 'AIzaSyDwCHfgA0QkF8_-17HIdTBNJLa6HZYPjuE'});




// import puppeteer from 'puppeteer';

// const generatePdfInMemory = async (html) => {
//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: 'networkidle0' });
//     const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
//     await browser.close();
//     return pdfBuffer;
// };



// async function createAiReportPdf(prompt) {
//     // 1. AI writes the HTML structure
//     const response = await ai.models.generateContent({
//         model: 'gemini-3-flash-preview',
//         contents: `Generate a clean, professional HTML/CSS string for a PDF report. Topic: ${prompt}. Only return the HTML.`
//     });
    
//     // 2. Pass HTML to the PDF generator
//     const html = response.text;
//     const buffer = await generatePdfInMemory(html);
    
//     return buffer; // Returns the binary PDF data
// }



// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// import { z } from "zod";

// const server = new McpServer({ name: "ai-doc-gen", version: "1.0.0" });

// server.tool("generate_ai_pdf", "Create a PDF using AI content", 
//     { prompt: z.string() }, 
//     async ({ prompt }) => {
//         await createAiReportPdf(prompt);
//         return { content: [{ type: "text", text: "PDF generated in memory." }] };
//     }
// );

// await server.connect(new StdioServerTransport());




// import express from 'express';
// import { createAiReportPdf } from '../mcp/tools.js';

// const app = express();
// app.use(express.json());

// // Frontend calls this to get the download
// app.post('/api/download-report', async (req, res) => {
//     try {
//         const { prompt } = req.body;
//         const pdfBuffer = await createAiReportPdf(prompt);
        
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
//         res.send(pdfBuffer);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// app.listen(3000, () => console.log('Backend listening on port 3000'));





// const app = express();

// // --- 1. RELAXED CORS CONFIG ---
// // Allows the React Frontend (port 5173) to talk to this Server (port 3000)
// app.use(cors({
//     origin: '*',
//     credentials: true 
// }));

// app.use(express.json()); 
// // app.use(cookieParser());

// app.get('/', (req, res) => {
//     res.status(200).json({message: "Welcome to the Backend Server!"});
// });

// app.post('/AIsandT', async (req, res) => {
//     const {Q} = req.body

//     const response = await ai.models.generateContent({
//         model: 'gemini-2.5-flash',
//         contents: Q})

//      res.status(200).json({answer: response.text})
// })

// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Backend Server running on port ${PORT}`);
// });





// // --- Middlewares ---

// const Tcheack = (req, res, next) => {
//     const token = req.cookies.token;
//     if(!token) return res.status(401).json({error: "Access denied"});
//     try {
//         const decoded = jwt.verify(token, process.env.JWT);
//         req.user = decoded; 
//         next();
//     } catch(error) {
//         return res.status(403).json({error: "Invalid token"});
//     }
// }

// const UserFolderHandler = (req, res, next) => {
//     const userId = req.user.id;
//     const content = req.body;
//     const safeUserId = String(userId).replace(/[^a-z0-9]/gi, '_');
//     const userDir = path.join(__dirname, 'storage', 'users', safeUserId);

//     try {
//         if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
//         const timestamp = new Date().toISOString().replace(/:/g, '-');
//         const fileName = `${req.method}_log_${timestamp}.json`;
//         const filePath = path.join(userDir, fileName);

//         fs.writeFileSync(filePath, JSON.stringify({
//             timestamp: new Date().toLocaleString(),
//             action: req.method,
//             data: content
//         }, null, 2));
//         next();
//     } catch (err) {
//         return res.status(500).json({ error: "Failed to log action" });
//     }
// }

// const FileDeleteHandler = (req, res, next) => {
//     const userId = req.user.id;
//     const { fileName } = req.body; 
//     const safeUserId = String(userId).replace(/[^a-z0-9]/gi, '_');
//     const filePath = path.join(__dirname, 'storage', 'users', safeUserId, fileName);

//     try {
//         if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath); 
//             console.log(`File ${fileName} deleted by user ${userId}`);
//             next();
//         } else {
//             return res.status(404).json({ error: "File not found on server" });
//         }
//     } catch (err) {
//         return res.status(500).json({ error: "Delete failed" });
//     }
// }

// // --- Auth Routes ---

// app.post('/login', (req, res) => {
//     const { pas, use } = req.body;
//     const Luser = db.data.users.find(u => u.username === use);
//     if(!Luser || pas !== Luser.pas) return res.status(401).json({ e: "Invalid credentials" });

//     const Atoken = jwt.sign({ id: Luser.id, role: Luser.role }, process.env.JWT, { expiresIn: '1h' });
    
//     res.cookie('token', Atoken, { 
//         httpOnly: true, 
//         secure: false, 
//         sameSite: 'lax' 
//     });
//     return res.status(200).json({ status: "Success", role: Luser.role });
// });

// // --- Data Routes ---

// app.post('/api/data', Tcheack, UserFolderHandler, (req, res) => {
//     res.status(200).json({ status: "Logged" });
// });

// app.delete('/api/data', Tcheack, FileDeleteHandler, (req, res) => {
//     res.status(200).json({ status: "File permanently deleted" });
// });

// --- 3. LISTEN ON ALL INTERFACES ---

// server.js
// server.js



// import express from 'express';
// import cors from 'cors';
// import { generateReportHtml, renderPdfFromHtml } from './tools.js';

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));

// app.post('/api/generate-preview', async (req, res) => {
//     const { topic } = req.body;
//     try {
//         const html = await generateReportHtml(topic);
//         res.json({ html });
//     } catch (err) {
//         // This will print the full error details to your terminal
//         console.error("DEBUG ERROR:", err); 
//         res.status(500).json({ 
//             error: err.message, 
//             details: err.stack // This line is key
//         });
//     }
// });

// app.post('/api/render-pdf', async (req, res) => {
//     const { html } = req.body;
//     try {
//         const buffer = await renderPdfFromHtml(html);
//         res.setHeader('Content-Type', 'application/pdf');
//         res.send(buffer);
//     } catch (err) {
//         res.status(500).send(err.message);
//         console.log("render bad")
//     }
// });

// app.listen(3000, () => console.log('Backend running on port 3000'));





// import express  from 'express';
// import cors     from 'cors';
// import multer   from 'multer';
// import mammoth  from 'mammoth';
// import xlsx     from 'xlsx';
// import { generateReportHtml, generateReportHtmlFromFile, renderPdfFromHtml } from './tools.js';

// // ── Multer — keep files in memory, max 50 MB ──────────────────────────────
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits:  { fileSize: 50 * 1024 * 1024 },
// });

// // ── API key error classifier ──────────────────────────────────────────────
// function classifyError(err) {
//   const msg = err.message ?? '';
//   if (msg.startsWith('API_KEY_LEAKED'))  return { status:403, code:'API_KEY_LEAKED',  message: msg.replace('API_KEY_LEAKED: ','') };
//   if (msg.startsWith('API_KEY_EXPIRED')) return { status:403, code:'API_KEY_EXPIRED', message: msg.replace('API_KEY_EXPIRED: ','') };
//   if (msg.startsWith('API_KEY_INVALID')) return { status:403, code:'API_KEY_INVALID', message: msg.replace('API_KEY_INVALID: ','') };
//   if (msg.includes('malformed JSON'))    return { status:422, code:'PARSE_ERROR',     message: msg };
//   return { status:500, code:'SERVER_ERROR', message: msg };
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // FILE NORMALIZER
// // Converts any uploaded file into { text, mimeType, normalizedBuffer }
// // so tools.js always gets something it can work with.
// // ─────────────────────────────────────────────────────────────────────────────
// async function normalizeFile(buffer, mimetype, originalname) {
//   const name = originalname.toLowerCase();

//   // ── Word .docx ────────────────────────────────────────────────────────────
//   if (
//     mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
//     mimetype === 'application/msword' ||
//     name.endsWith('.docx') || name.endsWith('.doc')
//   ) {
//     const result = await mammoth.extractRawText({ buffer });
//     return {
//       text:           result.value,
//       mimeType:       'text/plain',
//       normalizedBuffer: Buffer.from(result.value, 'utf8'),
//     };
//   }

//   // ── Excel .xlsx / .xls ────────────────────────────────────────────────────
//   if (
//     mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
//     mimetype === 'application/vnd.ms-excel' ||
//     name.endsWith('.xlsx') || name.endsWith('.xls')
//   ) {
//     const workbook = xlsx.read(buffer, { type: 'buffer' });
//     const lines = [];
//     workbook.SheetNames.forEach(sheetName => {
//       lines.push(`\n=== Sheet: ${sheetName} ===`);
//       const sheet = workbook.Sheets[sheetName];
//       const csv   = xlsx.utils.sheet_to_csv(sheet);
//       lines.push(csv);
//     });
//     const text = lines.join('\n');
//     return {
//       text,
//       mimeType:       'text/plain',
//       normalizedBuffer: Buffer.from(text, 'utf8'),
//     };
//   }

//   // ── PowerPoint .pptx ─────────────────────────────────────────────────────
//   // pptx is a zip — extract slide text via xlsx (it handles pptx too)
//   if (
//     mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
//     mimetype === 'application/vnd.ms-powerpoint' ||
//     name.endsWith('.pptx') || name.endsWith('.ppt')
//   ) {
//     // Use JSZip-style extraction via xlsx package (it can read pptx text)
//     try {
//       const AdmZip = (await import('adm-zip')).default;
//       const zip    = new AdmZip(buffer);
//       const slides = zip.getEntries()
//         .filter(e => e.entryName.match(/ppt\/slides\/slide\d+\.xml/))
//         .sort((a, b) => a.entryName.localeCompare(b.entryName));

//       const texts = slides.map((slide, i) => {
//         const xml  = slide.getData().toString('utf8');
//         // Strip XML tags, keep text content
//         const text = xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
//         return `--- Slide ${i+1} ---\n${text}`;
//       });
//       const full = texts.join('\n\n');
//       return {
//         text:           full,
//         mimeType:       'text/plain',
//         normalizedBuffer: Buffer.from(full, 'utf8'),
//       };
//     } catch {
//       // Fallback: just tell AI it's a presentation and pass minimal info
//       const fallback = `[PowerPoint presentation: ${originalname}. Could not extract slide text. Generate a report outline based on the filename and any topic provided.]`;
//       return {
//         text:           fallback,
//         mimeType:       'text/plain',
//         normalizedBuffer: Buffer.from(fallback, 'utf8'),
//       };
//     }
//   }

//   // ── PDF ───────────────────────────────────────────────────────────────────
//   if (mimetype === 'application/pdf' || name.endsWith('.pdf')) {
//     return { text: null, mimeType: 'application/pdf', normalizedBuffer: buffer };
//   }

//   // ── Images ────────────────────────────────────────────────────────────────
//   if (mimetype.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(name)) {
//     // Normalize svg to text since Gemini can't read SVG as image
//     if (mimetype === 'image/svg+xml' || name.endsWith('.svg')) {
//       const svgText = buffer.toString('utf8');
//       return { text: svgText, mimeType: 'text/plain', normalizedBuffer: Buffer.from(svgText) };
//     }
//     return { text: null, mimeType: mimetype, normalizedBuffer: buffer };
//   }

//   // ── Plain text variants ───────────────────────────────────────────────────
//   const textTypes = [
//     'text/plain','text/csv','text/html','text/markdown','text/xml',
//     'application/json','application/xml','application/rtf',
//   ];
//   if (textTypes.includes(mimetype) || mimetype.startsWith('text/') || /\.(txt|md|csv|json|html|xml|rtf)$/.test(name)) {
//     const text = buffer.toString('utf8').slice(0, 80000); // cap at 80k chars
//     return { text, mimeType: 'text/plain', normalizedBuffer: Buffer.from(text, 'utf8') };
//   }

//   // ── Unknown — try to read as text, fallback gracefully ───────────────────
//   try {
//     const text = buffer.toString('utf8').slice(0, 80000);
//     if (text.length > 0) return { text, mimeType: 'text/plain', normalizedBuffer: Buffer.from(text, 'utf8') };
//   } catch { /* not text */ }

//   throw new Error(`UNSUPPORTED_FILE: File type "${mimetype}" (${originalname}) could not be read. Try PDF, Word, Excel, PowerPoint, images, or text files.`);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// const app = express();
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));

// // ─────────────────────────────────────────────────────────────────────────────
// // POST /api/generate-preview  —  text-based generation
// // ─────────────────────────────────────────────────────────────────────────────
// app.post('/api/generate-preview', async (req, res) => {
//   const { topic, userPrompt = '', styleManifest = {} } = req.body;
//   if (!topic?.trim()) return res.status(400).json({ error: 'Topic is required.' });
//   try {
//     const data = await generateReportHtml(topic, userPrompt, styleManifest);
//     res.json(data);
//   } catch (err) {
//     const { status, code, message } = classifyError(err);
//     console.error(`[${code}]`, message);
//     res.status(status).json({ error: message, code });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // POST /api/generate-from-file  —  ANY file type
// // ─────────────────────────────────────────────────────────────────────────────
// app.post('/api/generate-from-file', upload.single('file'), async (req, res) => {
//   if (!req.file) return res.status(400).json({ code:'NO_FILE', error:'No file uploaded.' });

//   const { topic = '', userPrompt = '' } = req.body;
//   let styleManifest = {};
//   try {
//     if (req.body.styleManifest) styleManifest = JSON.parse(req.body.styleManifest);
//   } catch { /* ignore */ }

//   const { mimetype, buffer, originalname } = req.file;

//   try {
//     // Normalize to something Gemini can consume
//     const { mimeType: normalizedMime, normalizedBuffer } = await normalizeFile(buffer, mimetype, originalname);

//     const data = await generateReportHtmlFromFile(
//       normalizedBuffer, normalizedMime, originalname, topic, userPrompt, styleManifest
//     );
//     res.json(data);
//   } catch (err) {
//     // Surface UNSUPPORTED_FILE as a 400
//     if (err.message?.startsWith('UNSUPPORTED_FILE')) {
//       return res.status(400).json({ code:'UNSUPPORTED_FILE', error: err.message.replace('UNSUPPORTED_FILE: ','') });
//     }
//     const { status, code, message } = classifyError(err);
//     console.error(`[${code}]`, message);
//     res.status(status).json({ error: message, code });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // POST /api/render-pdf
// // ─────────────────────────────────────────────────────────────────────────────
// app.post('/api/render-pdf', async (req, res) => {
//   const { html, styleManifest = {} } = req.body;
//   if (!html?.trim()) return res.status(400).json({ error: 'HTML content is required.' });
//   try {
//     const buffer = await renderPdfFromHtml(html, styleManifest);
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
//     res.send(buffer);
//   } catch (err) {
//     const { status, code, message } = classifyError(err);
//     console.error(`[${code}]`, message);
//     res.status(status).json({ error: message, code });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // POST /api/render-pdf-raw  —  PdfEditor: HTML already has CSS injected
// // ─────────────────────────────────────────────────────────────────────────────
// app.post('/api/render-pdf-raw', async (req, res) => {
//   const { html, styleManifest = {} } = req.body;
//   if (!html?.trim()) return res.status(400).json({ error: 'HTML content is required.' });
//   try {
//     const { pageSize = 'A4', orientation = 'Portrait' } = styleManifest;
//     const puppeteer = (await import('puppeteer')).default;
//     const browser   = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
//     const page      = await browser.newPage();
//     await page.setContent(html, { waitUntil:'networkidle0' });
//     const buffer = await page.pdf({
//       format:          pageSize,
//       landscape:       orientation === 'Landscape',
//       printBackground: true,
//     });
//     await browser.close();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename="report-edited.pdf"');
//     res.send(buffer);
//   } catch (err) {
//     console.error('Raw PDF render error:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(3000, () => console.log('Backend running on http://localhost:3000'));































import express  from 'express';
import cors     from 'cors';
import multer   from 'multer';
import mammoth  from 'mammoth';
import xlsx     from 'xlsx';
import fs       from 'fs';
import path     from 'path';
import os       from 'os';
import { generateReportHtml, generateReportHtmlFromFile, renderPdfFromHtml, DOCS_DIR } from './tools.js';

// ── Persistent storage ────────────────────────────────────────────────────
// ~/Documents/ReportBuilderDocs/  (JSON docs + index)
const DOCS_INDEX = path.join(DOCS_DIR, 'index.json');
if (!fs.existsSync(DOCS_INDEX)) fs.writeFileSync(DOCS_INDEX, JSON.stringify([]));

// ~/Documents/ReportBuilderDocs/pdfs/  (auto-saved PDFs)
const PDF_DIR = path.join(DOCS_DIR, 'pdfs');
if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR, { recursive: true });

function readIndex()      { try { return JSON.parse(fs.readFileSync(DOCS_INDEX,'utf8')); } catch { return []; } }
function writeIndex(docs) { fs.writeFileSync(DOCS_INDEX, JSON.stringify(docs, null, 2)); }
function docPath(id)      { return path.join(DOCS_DIR, `${id}.json`); }

// ── PDF auto-save helper ──────────────────────────────────────────────────
async function savePdfToDisk(html, title, id) {
  try {
    if (!html?.trim()) return;
    const safeTitle = (title || 'report').replace(/[^a-z0-9]/gi, '_').slice(0, 60);
    const pdfPath   = path.join(PDF_DIR, `${safeTitle}_${id}.pdf`);
    const puppeteer  = (await import('puppeteer')).default;
    const browser    = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
    const page       = await browser.newPage();
    await page.setContent(html, { waitUntil:'networkidle0', timeout:60000 });
    const buffer     = await page.pdf({ format:'A4', printBackground:true });
    await browser.close();
    fs.writeFileSync(pdfPath, buffer);
    console.log(`[PDF saved] ${pdfPath}`);
  } catch(err) {
    console.warn('[PDF auto-save failed]', err.message);
    // Best-effort — don't fail the main request
  }
}

// ── Multer — memory, max 50 MB ────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 50 * 1024 * 1024 },
});

// ── Error classifier ──────────────────────────────────────────────────────
function classifyError(err) {
  const msg = err.message ?? '';
  if (msg.startsWith('API_KEY_LEAKED'))  return { status:403, code:'API_KEY_LEAKED',  message: msg.replace('API_KEY_LEAKED: ','') };
  if (msg.startsWith('API_KEY_EXPIRED')) return { status:403, code:'API_KEY_EXPIRED', message: msg.replace('API_KEY_EXPIRED: ','') };
  if (msg.startsWith('API_KEY_INVALID')) return { status:403, code:'API_KEY_INVALID', message: msg.replace('API_KEY_INVALID: ','') };
  if (msg.includes('malformed JSON'))    return { status:422, code:'PARSE_ERROR',     message: msg };
  return { status:500, code:'SERVER_ERROR', message: msg };
}

// ── File normalizer ───────────────────────────────────────────────────────
async function normalizeFile(buffer, mimetype, originalname) {
  const name = originalname.toLowerCase();

  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword' ||
    (mimetype === 'application/octet-stream' && (name.endsWith('.docx') || name.endsWith('.doc'))) ||
    name.endsWith('.docx') || name.endsWith('.doc')
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value, mimeType: 'text/plain', normalizedBuffer: Buffer.from(result.value, 'utf8') };
  }

  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimetype === 'application/vnd.ms-excel' ||
    (mimetype === 'application/octet-stream' && (name.endsWith('.xlsx') || name.endsWith('.xls'))) ||
    name.endsWith('.xlsx') || name.endsWith('.xls')
  ) {
    const workbook = xlsx.read(buffer, { type:'buffer' });
    const lines = [];
    workbook.SheetNames.forEach(sheetName => {
      lines.push(`\n=== Sheet: ${sheetName} ===`);
      lines.push(xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]));
    });
    const text = lines.join('\n');
    return { text, mimeType: 'text/plain', normalizedBuffer: Buffer.from(text, 'utf8') };
  }

  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    mimetype === 'application/vnd.ms-powerpoint' ||
    (mimetype === 'application/octet-stream' && (name.endsWith('.pptx') || name.endsWith('.ppt'))) ||
    name.endsWith('.pptx') || name.endsWith('.ppt')
  ) {
    try {
      const AdmZip = (await import('adm-zip')).default;
      const zip    = new AdmZip(buffer);
      const slides = zip.getEntries()
        .filter(e => e.entryName.match(/ppt\/slides\/slide\d+\.xml/))
        .sort((a, b) => a.entryName.localeCompare(b.entryName));
      const texts = slides.map((slide, i) => {
        const text = slide.getData().toString('utf8').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        return `--- Slide ${i+1} ---\n${text}`;
      });
      const full = texts.join('\n\n');
      return { text: full, mimeType: 'text/plain', normalizedBuffer: Buffer.from(full, 'utf8') };
    } catch {
      const fallback = `[PowerPoint presentation: ${originalname}. Could not extract slide text.]`;
      return { text: fallback, mimeType: 'text/plain', normalizedBuffer: Buffer.from(fallback, 'utf8') };
    }
  }

  if (mimetype === 'application/pdf' || name.endsWith('.pdf')) {
    return { text: null, mimeType: 'application/pdf', normalizedBuffer: buffer };
  }

  if (mimetype.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(name)) {
    if (mimetype === 'image/svg+xml' || name.endsWith('.svg')) {
      const svgText = buffer.toString('utf8');
      return { text: svgText, mimeType: 'text/plain', normalizedBuffer: Buffer.from(svgText) };
    }
    return { text: null, mimeType: mimetype, normalizedBuffer: buffer };
  }

  const textTypes = ['text/plain','text/csv','text/html','text/markdown','text/xml','application/json','application/xml','application/rtf'];
  if (textTypes.includes(mimetype) || mimetype.startsWith('text/') || /\.(txt|md|csv|json|html|xml|rtf)$/.test(name)) {
    const text = buffer.toString('utf8').slice(0, 80000);
    return { text, mimeType: 'text/plain', normalizedBuffer: Buffer.from(text, 'utf8') };
  }

  try {
    const text = buffer.toString('utf8').slice(0, 80000);
    if (text.length > 0) return { text, mimeType: 'text/plain', normalizedBuffer: Buffer.from(text, 'utf8') };
  } catch { /* not text */ }

  throw new Error(`UNSUPPORTED_FILE: File type "${mimetype}" (${originalname}) could not be read.`);
}

// ─────────────────────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ── POST /api/generate-preview ────────────────────────────────────────────
app.post('/api/generate-preview', async (req, res) => {
  const { topic, userPrompt = '', styleManifest = {}, imageMode = 'svg' } = req.body;
  if (!topic?.trim()) return res.status(400).json({ error: 'Topic is required.' });
  try {
    const data = await generateReportHtml(topic, userPrompt, styleManifest, imageMode);
    res.json(data);
  } catch (err) {
    const { status, code, message } = classifyError(err);
    console.error(`[${code}]`, message);
    res.status(status).json({ error: message, code });
  }
});

// ── POST /api/generate-from-file ──────────────────────────────────────────
app.post('/api/generate-from-file', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ code:'NO_FILE', error:'No file uploaded.' });
  const { topic = '', userPrompt = '', fileMode = 'report', imageMode = 'svg' } = req.body;
  let styleManifest = {};
  try { if (req.body.styleManifest) styleManifest = JSON.parse(req.body.styleManifest); } catch { /* ignore */ }
  const { mimetype, buffer, originalname } = req.file;
  try {
    const { mimeType: normalizedMime, normalizedBuffer } = await normalizeFile(buffer, mimetype, originalname);
    const data = await generateReportHtmlFromFile(normalizedBuffer, normalizedMime, originalname, topic, userPrompt, styleManifest, fileMode, imageMode);
    res.json(data);
  } catch (err) {
    if (err.message?.startsWith('UNSUPPORTED_FILE')) {
      return res.status(400).json({ code:'UNSUPPORTED_FILE', error: err.message.replace('UNSUPPORTED_FILE: ','') });
    }
    const { status, code, message } = classifyError(err);
    console.error(`[${code}]`, message);
    res.status(status).json({ error: message, code });
  }
});

// ── POST /api/render-pdf ──────────────────────────────────────────────────
app.post('/api/render-pdf', async (req, res) => {
  const { html, styleManifest = {} } = req.body;
  if (!html?.trim()) return res.status(400).json({ error: 'HTML content is required.' });
  try {
    const buffer = await renderPdfFromHtml(html, styleManifest);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(buffer);
  } catch (err) {
    const { status, code, message } = classifyError(err);
    res.status(status).json({ error: message, code });
  }
});

// ── POST /api/render-pdf-form ─────────────────────────────────────────────
app.post('/api/render-pdf-form', upload.single('html'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No HTML file uploaded.' });
  const html = req.file.buffer.toString('utf8');
  let styleManifest = {};
  try { if (req.body.styleManifest) styleManifest = JSON.parse(req.body.styleManifest); } catch { /* ignore */ }
  try {
    const { pageSize = 'A4', orientation = 'Portrait' } = styleManifest;
    const puppeteer = (await import('puppeteer')).default;
    const browser   = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
    const page      = await browser.newPage();
    await page.setContent(html, { waitUntil:'networkidle0', timeout:60000 });
    const buffer = await page.pdf({ format:pageSize, landscape:orientation==='Landscape', printBackground:true });
    await browser.close();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(buffer);
  } catch (err) {
    console.error('PDF form render error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/render-pdf-raw ──────────────────────────────────────────────
app.post('/api/render-pdf-raw', async (req, res) => {
  const { html, styleManifest = {} } = req.body;
  if (!html?.trim()) return res.status(400).json({ error: 'HTML content is required.' });
  try {
    const { pageSize = 'A4', orientation = 'Portrait' } = styleManifest;
    const puppeteer = (await import('puppeteer')).default;
    const browser   = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
    const page      = await browser.newPage();
    await page.setContent(html, { waitUntil:'networkidle0' });
    const buffer = await page.pdf({ format:pageSize, landscape:orientation==='Landscape', printBackground:true });
    await browser.close();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report-edited.pdf"');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/generate-citations ──────────────────────────────────────────
app.post('/api/generate-citations', async (req, res) => {
  const { description = '', format = 'apa7' } = req.body;
  if (!description.trim()) return res.status(400).json({ error: 'Description is required.' });
  const isApa = format !== 'mla';
  const formatLabel   = isApa ? 'APA 7th edition' : 'MLA 9th edition';
  const refListLabel  = isApa ? 'References'      : 'Works Cited';
  const exParenthetical = isApa ? '(Smith & Jones, 2021, p. 45)' : '(Smith and Jones 45)';
  const exNarrative     = isApa ? 'Smith and Jones (2021)'        : 'Smith and Jones';
  const exReference     = isApa
    ? 'Smith, J., & Jones, A. (2021). <em>Book title</em>. Publisher.'
    : 'Smith, John, and Alice Jones. <em>Book Title</em>. Publisher, 2021.';
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert in ${formatLabel} citation formatting.
The user wants to cite: "${description}"
Generate three things in strict ${formatLabel} format:
1. Parenthetical in-text citation — e.g. ${exParenthetical}
2. Narrative in-text citation     — e.g. ${exNarrative}
3. Full ${refListLabel} entry     — e.g. ${exReference}
Return ONLY this JSON — no markdown:
{"intext":"(citation)","narrative":"Narrative citation","reference":"Full entry"}`;
    const result = await ai.models.generateContent({ model:'gemini-2.5-flash', contents:prompt, config:{ responseMimeType:'application/json' } });
    const text   = typeof result.text==='function' ? result.text() : result.text;
    const parsed = JSON.parse(text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/i,'').trim());
    if (!parsed.intext||!parsed.narrative||!parsed.reference) return res.status(422).json({ error:'Incomplete citation data. Try again.' });
    res.json(parsed);
  } catch (err) {
    console.error('Citation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── DOCUMENTS CRUD ────────────────────────────────────────────────────────

// GET /api/documents — list all
app.get('/api/documents', (req, res) => {
  const idx = readIndex();
  res.json({ documents: idx.map(({ id, title, updatedAt }) => ({ id, title, updatedAt })) });
});

// GET /api/documents/:id — full doc
app.get('/api/documents/:id', (req, res) => {
  const fp = docPath(req.params.id);
  if (!fs.existsSync(fp)) return res.status(404).json({ error:'Not found' });
  try { res.json(JSON.parse(fs.readFileSync(fp,'utf8'))); }
  catch { res.status(500).json({ error:'Read error' }); }
});

// POST /api/documents — create (auto-saves PDF to disk)
app.post('/api/documents', async (req, res) => {
  const { title, html, manifesto, ov } = req.body;
  const id  = Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  const now = new Date().toISOString();
  const doc = { id, title: title||'Untitled Report', html, manifesto, ov, createdAt:now, updatedAt:now };

  fs.writeFileSync(docPath(id), JSON.stringify(doc, null, 2));
  const idx = readIndex();
  idx.unshift({ id, title: doc.title, updatedAt: now });
  writeIndex(idx);

  // Auto-save PDF to ~/Documents/ReportBuilderDocs/pdfs/ (best-effort)
  savePdfToDisk(html, title, id).catch(() => {});

  res.json({ id, title: doc.title, updatedAt: now });
});

// PUT /api/documents/:id — update (re-saves PDF)
app.put('/api/documents/:id', async (req, res) => {
  const fp = docPath(req.params.id);
  if (!fs.existsSync(fp)) return res.status(404).json({ error:'Not found' });
  const existing = JSON.parse(fs.readFileSync(fp,'utf8'));
  const { title, html, manifesto, ov } = req.body;
  const now = new Date().toISOString();
  const updated = { ...existing, title:title||existing.title, html, manifesto, ov, updatedAt:now };
  fs.writeFileSync(fp, JSON.stringify(updated, null, 2));
  const idx = readIndex().map(d => d.id===req.params.id ? { ...d, title:updated.title, updatedAt:now } : d);
  writeIndex(idx);

  // Re-save PDF
  savePdfToDisk(html, updated.title, req.params.id).catch(() => {});

  res.json({ id:req.params.id, title:updated.title, updatedAt:now });
});

// DELETE /api/documents/:id
app.delete('/api/documents/:id', (req, res) => {
  const fp = docPath(req.params.id);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  writeIndex(readIndex().filter(d => d.id!==req.params.id));
  res.json({ deleted:true });
});

// ── PDFs ROUTES ───────────────────────────────────────────────────────────

// GET /api/pdfs — list all saved PDFs
app.get('/api/pdfs', (req, res) => {
  try {
    const files = fs.readdirSync(PDF_DIR)
      .filter(f => f.endsWith('.pdf'))
      .map(f => {
        const stat = fs.statSync(path.join(PDF_DIR, f));
        return {
          filename: f,
          title: f.replace(/_[a-z0-9]{8,}\.pdf$/, '').replace(/_/g, ' ').trim() || f,
          size:     stat.size,
          savedAt:  stat.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    res.json({ pdfs: files, directory: PDF_DIR });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pdfs/:filename — serve a saved PDF
app.get('/api/pdfs/:filename', (req, res) => {
  const fp = path.join(PDF_DIR, path.basename(req.params.filename));
  if (!fs.existsSync(fp)) return res.status(404).json({ error: 'Not found' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${path.basename(fp)}"`);
  res.send(fs.readFileSync(fp));
});

// ── POST /api/update-report ───────────────────────────────────────────────
app.post('/api/update-report', async (req, res) => {
  const { html='', instruction='' } = req.body;
  if (!instruction.trim()) return res.status(400).json({ error:'Instruction required.' });
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are editing an HTML report document. The user wants you to make the following change:
"${instruction}"
Current HTML body:
${html.slice(0,60000)}
RULES:
- Apply ONLY the requested change. Do not rewrite or restructure anything else.
- Preserve all data-id, data-editable, data-draggable, data-feature attributes exactly.
- If adding new elements, give them unique data-id values and data-editable="true".
- Output the COMPLETE updated HTML body.
Return ONLY this JSON — no markdown:
{"html":"<updated full HTML body>","summary":"One sentence describing what changed"}`;

    let result, lastErr;
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        result = await ai.models.generateContent({ model:'gemini-2.5-flash', contents:prompt, config:{ responseMimeType:'application/json' } });
        break;
      } catch(err) {
        lastErr = err;
        const msg = err?.message||'';
        const retryable = msg.includes('503')||msg.includes('UNAVAILABLE')||msg.includes('high demand')||msg.includes('429');
        if (!retryable) throw err;
        const wait = Math.min(2000*Math.pow(2,attempt)+Math.random()*500, 20000);
        await new Promise(r=>setTimeout(r,wait));
      }
    }
    if (!result) throw lastErr;
    const text    = typeof result.text==='function' ? result.text() : result.text;
    const parsed  = JSON.parse(text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/i,'').trim());
    if (!parsed.html) return res.status(422).json({ error:'AI returned no HTML.' });
    res.json({ html: parsed.html, summary: parsed.summary||'Report updated.' });
  } catch(err) {
    console.error('Update report error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/regenerate-diagram ─────────────────────────────────────────
app.post('/api/regenerate-diagram', async (req, res) => {
  const { keyword, topic, diagramType, bgColor, primaryColor } = req.body;
  try {
    const { regenerateDiagram } = await import('./tools.js');
    const svg = await regenerateDiagram(keyword, topic, diagramType, bgColor, primaryColor);
    if (!svg) return res.status(422).json({ error:'SVG generation returned empty result.' });
    res.json({ svg });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/generate-diagram-ai ────────────────────────────────────────
// Proxies Claude AI calls for DiagramBuilder (avoids browser CORS block)
app.post('/api/generate-diagram-ai', async (req, res) => {
  const { prompt, chartType } = req.body;
  if (!prompt || !chartType) return res.status(400).json({ error: 'prompt and chartType required' });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set on server' });

  // Build a schema description per chart type so AI knows exactly what to return
  // Canvas mode — AI generates a full layout with multiple elements
  if (chartType === 'canvas') {
    const systemPrompt = `You are a diagram layout AI. Given a description, you generate a JSON layout for a canvas diagram editor.

Return ONLY this exact JSON structure — no markdown, no backticks, no explanation:
{
  "canvasBg": "#1e293b",
  "elements": [
    {
      "type": "chart",
      "chartType": "bar|line|pie|donut|area|scatter|gauge|table|timeline|flow|grid|funnel|heatmap|treemap|radar|waterfall|bullet|pyramid|venn|orgchart|mindmap|swimlane|grouped",
      "x": 50, "y": 50, "w": 380, "h": 260,
      "title": "Chart Title",
      "palette": "blue|green|purple|warm|mono|vivid|ocean|sunset",
      "textColor": "#1e293b",
      "bgColor": "#ffffff",
      "chartData": { /* data object matching chart type — see below */ }
    },
    {
      "type": "rect|circle|diamond|triangle|hexagon|text",
      "x": 100, "y": 50, "w": 160, "h": 80,
      "fill": "#3b82f6", "stroke": "#1d4ed8", "strokeW": 2,
      "text": "Label", "fontSize": 14, "fontColor": "#ffffff",
      "cornerRadius": 6, "opacity": 1
    }
  ]
}

ChartData formats:
- bar/line/area: { data: [{name, v}] }
- pie/donut: { data: [{name, v}] }
- scatter: { data: [{x, y, label?}] }
- gauge: { data: [{label, value, max, unit}] }
- table: { headers: [str], rows: [[str]] }
- timeline: { data: [{year, title, desc}] }
- flow/orgchart: { nodes: [{id, label, x, y, shape, color}], edges: [{from, to, label?}] }
- grid: { data: [{icon, title, desc}] }
- funnel/pyramid: { data: [{label, v}] }
- heatmap: { rows: [str], cols: [str], data: [[num]] }
- treemap: { data: [{label, v}] }
- radar: { labels: [str], series: [{name, vals: [num]}] }
- waterfall: { data: [{label, v, base, total?}] }
- bullet: { data: [{label, actual, target, max}] }
- venn: { sets: [{label, x, r, color}], overlap: str }
- sankey: { nodes: [str], flows: [{from, to, v}] }
- mindmap: { center: str, branches: [{label, children: [str]}] }
- swimlane: { lanes: [str], items: [{lane, label, x, w}] }
- grouped: { labels: [str], series: [{name, vals: [num]}] }

RULES:
- Place elements to not overlap (space them out on the 1400×900 canvas)
- Use 2-5 elements for best results
- Keep data realistic and relevant to the prompt
- Use appropriate chart types for the data
- Text/shape elements can label sections`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4000, system: systemPrompt, messages: [{ role: 'user', content: prompt }] }),
      });
      if (!response.ok) { const t = await response.text(); throw new Error(`Anthropic ${response.status}: ${t.slice(0,200)}`); }
      const data = await response.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      const result = JSON.parse(clean);
      return res.json({ result });
    } catch(err) {
      console.error('[generate-diagram-ai canvas]', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  const schemas = {
    bar:      'Return JSON: { title, palette, data: [{name, v}] }',
    grouped:  'Return JSON: { title, palette, labels: [str], series: [{name, vals:[num]}] }',
    line:     'Return JSON: { title, palette, data: [{name, v}] }',
    area:     'Return JSON: { title, palette, data: [{name, v}] }',
    pie:      'Return JSON: { title, palette, data: [{name, v}] }',
    donut:    'Return JSON: { title, palette, data: [{name, v}] }',
    scatter:  'Return JSON: { title, palette, data: [{x, y, label?}] }',
    timeline: 'Return JSON: { title, palette, data: [{year, title, desc}] }',
    table:    'Return JSON: { title, headers: [str], rows: [[str]] }',
    gauge:    'Return JSON: { title, palette, data: [{label, value, max, unit}] } — max 3 gauges',
    grid:     'Return JSON: { title, palette, data: [{icon, title, desc}] } — icon is an emoji',
    flow:     'Return JSON: { title, nodes: [{id,label,x,y,shape,color}], edges: [{from,to,label?}] } — shapes: rect|circle|diamond, x/y positions spaced ~200px apart horizontally',
  };

  const systemPrompt = `You generate chart/diagram data for a diagram builder application.
The user will describe what they want and you respond with ONLY valid JSON matching the schema.
Available palette names: blue, green, purple, warm, mono, vivid, ocean, sunset
Do NOT include markdown, backticks, or any explanation — ONLY the raw JSON object.
${schemas[chartType] || schemas.bar}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API error ${response.status}: ${errText.slice(0, 200)}`);
    }

    const data = await response.json();
    const text = data.content?.find(b => b.type === 'text')?.text || '';
    const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const result = JSON.parse(clean);
    res.json({ result });
  } catch (err) {
    console.error('[generate-diagram-ai]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
app.listen(3000, () => {
  console.log('');
  console.log('┌────────────────────────────────────────────────────────────┐');
  console.log('│  ✅ Backend running on http://localhost:3000                │');
  console.log('│  Routes ready:                                             │');
  console.log('│   POST /api/generate-preview                               │');
  console.log('│   POST /api/generate-from-file                             │');
  console.log('│   POST /api/render-pdf                                     │');
  console.log('│   POST /api/render-pdf-form                                │');
  console.log('│   POST /api/render-pdf-raw                                 │');
  console.log('│   POST /api/generate-citations                             │');
  console.log('│   POST /api/update-report                                  │');
  console.log('│   POST /api/regenerate-diagram                             │');
  console.log('│   POST /api/generate-diagram-ai   ← DiagramBuilder AI     │');
  console.log('│   GET/POST/PUT/DELETE /api/documents                       │');
  console.log('│   GET  /api/pdfs                       ← PDF library       │');
  console.log('│   GET  /api/pdfs/:filename             ← PDF download      │');
  console.log(`│  📁 Docs: ~/Documents/ReportBuilderDocs/                   │`);
  console.log(`│  📄 PDFs: ~/Documents/ReportBuilderDocs/pdfs/              │`);
  console.log('└────────────────────────────────────────────────────────────┘');
  console.log('');
});