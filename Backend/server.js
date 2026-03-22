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






























// import express  from 'express';
// import cors     from 'cors';
// import multer   from 'multer';
// import mammoth  from 'mammoth';
// import xlsx     from 'xlsx';
// import AdmZip   from 'adm-zip';
// import fs       from 'fs';
// import path     from 'path';
// import os       from 'os';
// import { generateReportHtml, generateReportHtmlFromFile, renderPdfFromHtml, DOCS_DIR } from './tools.js';



// // ~/Documents/ReportBuilderDocs/  (JSON docs + index)
// const DOCS_INDEX = path.join(DOCS_DIR, 'index.json');
// if (!fs.existsSync(DOCS_INDEX)) fs.writeFileSync(DOCS_INDEX, JSON.stringify([]));

// // ~/Documents/ReportBuilderDocs/pdfs/  (auto-saved PDFs)
// const PDF_DIR = path.join(DOCS_DIR, 'pdfs');
// if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR, { recursive: true });

// function readIndex()      { try { return JSON.parse(fs.readFileSync(DOCS_INDEX,'utf8')); } catch { return []; } }
// function writeIndex(docs) { fs.writeFileSync(DOCS_INDEX, JSON.stringify(docs, null, 2)); }
// function docPath(id)      { return path.join(DOCS_DIR, `${id}.json`); }

// // ── PDF auto-save helper ──────────────────────────────────────────────────
// async function savePdfToDisk(html, title, id) {
//   try {
//     if (!html?.trim()) return;
//     const safeTitle = (title || 'report').replace(/[^a-z0-9]/gi, '_').slice(0, 60);
//     const pdfPath   = path.join(PDF_DIR, `${safeTitle}_${id}.pdf`);
//     const puppeteer  = (await import('puppeteer')).default;
//     const browser    = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
//     const page       = await browser.newPage();
//     await page.setContent(html, { waitUntil:'networkidle0', timeout:60000 });
//     const buffer     = await page.pdf({ format:'A4', printBackground:true });
//     await browser.close();
//     fs.writeFileSync(pdfPath, buffer);
//     console.log(`[PDF saved] ${pdfPath}`);
//   } catch(err) {
//     console.warn('[PDF auto-save failed]', err.message);
//     // Best-effort — don't fail the main request
//   }
// }

// // ── Multer — memory, max 50 MB ────────────────────────────────────────────
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits:  { fileSize: 50 * 1024 * 1024 },
// });

// // ── Error classifier ──────────────────────────────────────────────────────
// function classifyError(err) {
//   const msg = err.message ?? '';
//   if (msg.startsWith('API_KEY_LEAKED'))  return { status:403, code:'API_KEY_LEAKED',  message: msg.replace('API_KEY_LEAKED: ','') };
//   if (msg.startsWith('API_KEY_EXPIRED')) return { status:403, code:'API_KEY_EXPIRED', message: msg.replace('API_KEY_EXPIRED: ','') };
//   if (msg.startsWith('API_KEY_INVALID')) return { status:403, code:'API_KEY_INVALID', message: msg.replace('API_KEY_INVALID: ','') };
//   if (msg.includes('malformed JSON'))    return { status:422, code:'PARSE_ERROR',     message: msg };
//   return { status:500, code:'SERVER_ERROR', message: msg };
// }

// // ── File normalizer ───────────────────────────────────────────────────────
// function sniffFileType(buffer, originalname, mimetype) {
//   const name = originalname.toLowerCase();
//   const hex4 = buffer.slice(0,4).toString('hex').toLowerCase();
//   if (hex4 === '25504446') return 'pdf';
//   if (hex4 === '504b0304') {
//     const scan = buffer.slice(0, Math.min(buffer.length, 65536)).toString('binary');
//     if (scan.includes('word/'))  return 'docx';
//     if (scan.includes('xl/'))    return 'xlsx';
//     if (scan.includes('ppt/'))   return 'pptx';
//     // [Content_Types] without specific dir — use extension
//     if (name.endsWith('.docx') || name.endsWith('.doc'))  return 'docx';
//     if (name.endsWith('.xlsx') || name.endsWith('.xls'))  return 'xlsx';
//     if (name.endsWith('.pptx') || name.endsWith('.ppt'))  return 'pptx';
//     return 'docx'; // default ZIP-based → try as docx
//   }
//   if (hex4 === 'd0cf11e0') {
//     if (name.endsWith('.xls') || mimetype.includes('excel'))       return 'xlsx';
//     if (name.endsWith('.ppt') || mimetype.includes('powerpoint'))  return 'pptx';
//     return 'docx';
//   }
//   if (hex4 === '89504e47' || hex4.startsWith('ffd8') || hex4 === '47494638' || hex4 === '52494646') return 'image';
//   if (name.endsWith('.pdf') || mimetype === 'application/pdf') return 'pdf';
//   if (name.match(/\.(png|jpe?g|gif|webp|bmp|svg)$/) || mimetype.startsWith('image/')) return 'image';
//   return 'text';
// }

// async function normalizeFile(buffer, mimetype, originalname) {
//   const name = originalname.toLowerCase();
//   const sniffed = sniffFileType(buffer, originalname, mimetype);

//   if (sniffed === 'docx') {
//     try {
//       const result = await mammoth.extractRawText({ buffer });
//       return { text: result.value, mimeType: 'text/plain', normalizedBuffer: Buffer.from(result.value, 'utf8') };
//     } catch(e) {
//       throw new Error(`UNSUPPORTED_FILE: Could not read Word document "${originalname}": ${e.message}`);
//     }
//   }

//   if (sniffed === 'xlsx') {
//     try {
//       const workbook = xlsx.read(buffer, { type:'buffer' });
//       const lines = [];
//       workbook.SheetNames.forEach(sheetName => {
//         lines.push(`\n=== Sheet: ${sheetName} ===`);
//         lines.push(xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]));
//       });
//       const text = lines.join('\n');
//       return { text, mimeType: 'text/plain', normalizedBuffer: Buffer.from(text, 'utf8') };
//     } catch(e) {
//       throw new Error(`UNSUPPORTED_FILE: Could not read Excel file "${originalname}": ${e.message}`);
//     }
//   }

//   if (sniffed === 'pptx') {
//     try {
      
//       const zip    = new AdmZip(buffer);
//       const slides = zip.getEntries()
//         .filter(e => e.entryName.match(/ppt\/slides\/slide\d+\.xml/))
//         .sort((a, b) => a.entryName.localeCompare(b.entryName));
//       const texts = slides.map((slide, i) => {
//         const text = slide.getData().toString('utf8').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
//         return `--- Slide ${i+1} ---\n${text}`;
//       });
//       const full = texts.join('\n\n');
//       return { text: full, mimeType: 'text/plain', normalizedBuffer: Buffer.from(full, 'utf8') };
//     } catch {
//       const fallback = `[PowerPoint presentation: ${originalname}. Could not extract slide text.]`;
//       return { text: fallback, mimeType: 'text/plain', normalizedBuffer: Buffer.from(fallback, 'utf8') };
//     }
//   }

//   if (sniffed === 'pdf') {
//     return { text: null, mimeType: 'application/pdf', normalizedBuffer: buffer };
//   }

//   if (sniffed === 'image') {
//     if (name.endsWith('.svg') || mimetype === 'image/svg+xml') {
//       const svgText = buffer.toString('utf8');
//       return { text: svgText, mimeType: 'text/plain', normalizedBuffer: Buffer.from(svgText) };
//     }
//     return { text: null, mimeType: mimetype || 'image/png', normalizedBuffer: buffer };
//   }

//   // Text-based fallback
//   const textTypes = ['text/plain','text/csv','text/html','text/markdown','text/xml','application/json','application/xml','application/rtf'];
//   if (textTypes.includes(mimetype) || mimetype.startsWith('text/') || /\.(txt|md|csv|json|html|xml|rtf)$/.test(name)) {
//     const text = buffer.toString('utf8').slice(0, 80000);
//     return { text, mimeType: 'text/plain', normalizedBuffer: Buffer.from(text, 'utf8') };
//   }

//   try {
//     const text = buffer.toString('utf8').slice(0, 80000);
//     if (text.length > 0) return { text, mimeType: 'text/plain', normalizedBuffer: Buffer.from(text, 'utf8') };
//   } catch { /* not text */ }

//   throw new Error(`UNSUPPORTED_FILE: File type "${mimetype}" (${originalname}) could not be read.`);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// const app = express();
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));

// // ── POST /api/generate-preview ────────────────────────────────────────────
// app.post('/api/generate-preview', async (req, res) => {
//   const { topic, userPrompt = '', styleManifest = {}, imageMode = 'svg' } = req.body;
//   if (!topic?.trim()) return res.status(400).json({ error: 'Topic is required.' });
//   try {
//     const data = await generateReportHtml(topic, userPrompt, styleManifest, imageMode);
//     res.json(data);
//   } catch (err) {
//     const { status, code, message } = classifyError(err);
//     console.error(`[${code}]`, message);
//     res.status(status).json({ error: message, code });
//   }
// });

// // ── POST /api/generate-from-file ──────────────────────────────────────────
// app.post('/api/generate-from-file', upload.single('file'), async (req, res) => {
//   if (!req.file) return res.status(400).json({ code:'NO_FILE', error:'No file uploaded.' });
//   const { topic = '', userPrompt = '', fileMode = 'report', imageMode = 'svg' } = req.body;
//   let styleManifest = {};
//   try { if (req.body.styleManifest) styleManifest = JSON.parse(req.body.styleManifest); } catch { /* ignore */ }
//   const { mimetype, buffer, originalname } = req.file;
//   try {
//     const { mimeType: normalizedMime, normalizedBuffer } = await normalizeFile(buffer, mimetype, originalname);
//     const data = await generateReportHtmlFromFile(normalizedBuffer, normalizedMime, originalname, topic, userPrompt, styleManifest, fileMode, imageMode);
//     res.json(data);
//   } catch (err) {
//     if (err.message?.startsWith('UNSUPPORTED_FILE')) {
//       return res.status(400).json({ code:'UNSUPPORTED_FILE', error: err.message.replace('UNSUPPORTED_FILE: ','') });
//     }
//     const { status, code, message } = classifyError(err);
//     console.error(`[${code}]`, message);
//     res.status(status).json({ error: message, code });
//   }
// });

// // ── POST /api/render-pdf ──────────────────────────────────────────────────
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
//     res.status(status).json({ error: message, code });
//   }
// });

// // ── POST /api/render-pdf-form ─────────────────────────────────────────────
// app.post('/api/render-pdf-form', upload.single('html'), async (req, res) => {
//   if (!req.file) return res.status(400).json({ error: 'No HTML file uploaded.' });
//   const html = req.file.buffer.toString('utf8');
//   let styleManifest = {};
//   try { if (req.body.styleManifest) styleManifest = JSON.parse(req.body.styleManifest); } catch { /* ignore */ }
//   try {
//     const { pageSize = 'A4', orientation = 'Portrait' } = styleManifest;
//     const puppeteer = (await import('puppeteer')).default;
//     const browser   = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
//     const page      = await browser.newPage();
//     await page.setContent(html, { waitUntil:'networkidle0', timeout:60000 });
//     const buffer = await page.pdf({ format:pageSize, landscape:orientation==='Landscape', printBackground:true });
//     await browser.close();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
//     res.send(buffer);
//   } catch (err) {
//     console.error('PDF form render error:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── POST /api/render-pdf-raw ──────────────────────────────────────────────
// app.post('/api/render-pdf-raw', async (req, res) => {
//   const { html, styleManifest = {} } = req.body;
//   if (!html?.trim()) return res.status(400).json({ error: 'HTML content is required.' });
//   try {
//     const { pageSize = 'A4', orientation = 'Portrait' } = styleManifest;
//     const puppeteer = (await import('puppeteer')).default;
//     const browser   = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
//     const page      = await browser.newPage();
//     await page.setContent(html, { waitUntil:'networkidle0' });
//     const buffer = await page.pdf({ format:pageSize, landscape:orientation==='Landscape', printBackground:true });
//     await browser.close();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename="report-edited.pdf"');
//     res.send(buffer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── POST /api/convert-for-viewing ────────────────────────────────────────
// // Converts any office doc to a self-contained styled HTML for the Doc Viewer.
// // Returns: { htmlBase64, convertedFrom, originalName, ... }
// app.post('/api/convert-for-viewing', upload.single('file'), async (req, res) => {
//   if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
//   const { mimetype, buffer, originalname } = req.file;
//   const name = originalname.toLowerCase();

//   // ── Magic-byte + ZIP-content file type detection ─────────────────────────
//   function detectType(buf, fileName, mime) {
//     const hex4 = buf.slice(0,4).toString('hex').toLowerCase();
//     const hex8 = buf.slice(0,8).toString('hex').toLowerCase();

//     // PDF: %PDF
//     if (hex4 === '25504446') return 'pdf';

//     // ZIP-based Office formats (DOCX, XLSX, PPTX all start with PK\x03\x04)
//     if (hex4 === '504b0304') {
//       // Scan ZIP local file headers for directory markers
//       // Local file headers store filename immediately after PK\x03\x04 signature
//       // Search up to first 64KB for the marker strings
//       const scanLen = Math.min(buf.length, 65536);
//       const zipStr = buf.slice(0, scanLen).toString('binary');
//       if (zipStr.includes('word/'))                                                                  return 'docx';
//       if (zipStr.includes('xl/') || zipStr.includes('[Content_Types]') && fileName.endsWith('.xlsx')) return 'xlsx';
//       if (zipStr.includes('ppt/'))                                                                   return 'pptx';
//       // If [Content_Types].xml found but no specific dir — check extension
//       if (zipStr.includes('[Content_Types]')) {
//         if (fileName.endsWith('.docx') || fileName.endsWith('.doc'))  return 'docx';
//         if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))  return 'xlsx';
//         if (fileName.endsWith('.pptx') || fileName.endsWith('.ppt'))  return 'pptx';
//       }
//       // Fall back to extension / MIME
//       if (fileName.endsWith('.docx'))                                                               return 'docx';
//       if (fileName.endsWith('.xlsx'))                                                               return 'xlsx';
//       if (fileName.endsWith('.pptx'))                                                               return 'pptx';
//       if (fileName.endsWith('.doc')  || mime.includes('word'))                                      return 'docx';
//       if (fileName.endsWith('.xls')  || mime.includes('spreadsheet') || mime.includes('excel'))    return 'xlsx';
//       if (fileName.endsWith('.ppt')  || mime.includes('presentation') || mime.includes('powerpoint')) return 'pptx';
//       return 'zip-unknown';
//     }

//     // Legacy OLE2 compound doc (old .doc, .xls, .ppt — D0CF11E0A1B11AE1)
//     if (hex4 === 'd0cf11e0') {
//       if (fileName.endsWith('.xls') || mime.includes('excel'))       return 'xlsx';
//       if (fileName.endsWith('.ppt') || mime.includes('powerpoint'))  return 'pptx';
//       return 'docx'; // .doc / unknown OLE2
//     }

//     // Images
//     if (hex4 === '89504e47')            return 'image'; // PNG
//     if (hex4.startsWith('ffd8'))        return 'image'; // JPEG
//     if (hex4 === '47494638')            return 'image'; // GIF
//     if (hex4 === '52494646')            return 'image'; // WEBP/RIFF
//     if (hex4.startsWith('424d'))        return 'image'; // BMP
//     if (buf.slice(0,5).toString('ascii') === '<svg ') return 'image'; // SVG

//     // Text-based formats (no magic bytes — use extension / MIME)
//     if (fileName.endsWith('.csv') || mime === 'text/csv')            return 'csv';
//     if (fileName.endsWith('.md')  || mime === 'text/markdown')       return 'markdown';
//     if (fileName.endsWith('.html') || fileName.endsWith('.htm') || mime === 'text/html') return 'html';
//     if (fileName.endsWith('.txt') || fileName.endsWith('.rtf'))      return 'text';
//     if (mime === 'application/pdf')                                   return 'pdf';
//     if (mime.startsWith('image/'))                                    return 'image';
//     if (mime.startsWith('text/'))                                     return 'text';

//     // Last resort: check if it looks like readable UTF-8 text
//     try {
//       const sample = buf.slice(0, 512).toString('utf8');
//       if (/^[\x09\x0a\x0d\x20-\x7e\u00a0-\ufffd]+$/.test(sample))  return 'text';
//     } catch { /* binary */ }

//     return 'unknown';
//   }

//   const detectedType = detectType(buffer, name, mimetype);
//   console.log(`[convert-for-viewing] "${originalname}" mime="${mimetype}" detected="${detectedType}"`);

//   // Guard: if it's a PDF or image, tell client to handle it natively
//   if (detectedType === 'pdf') {
//     return res.status(400).json({ error: 'PDF files should be viewed natively — no server conversion needed.', hint: 'pdf' });
//   }
//   if (detectedType === 'image') {
//     return res.status(400).json({ error: 'Image files should be viewed natively — no server conversion needed.', hint: 'image' });
//   }
//   if (detectedType === 'zip-unknown') {
//     return res.status(400).json({ error: `Cannot determine Office format for "${originalname}". Please ensure the file extension is .docx, .xlsx, or .pptx.` });
//   }
//   if (detectedType === 'unknown') {
//     return res.status(400).json({ error: `"${originalname}" is an unrecognised binary format that cannot be previewed.` });
//   }

//   try {
//     // ── DOCX / DOC ────────────────────────────────────────────────────────
//     if (detectedType === 'docx') {
//       let result;
//       try {
//         result = await mammoth.convertToHtml(
//           { buffer },
//           {
//             styleMap: [
//               "p[style-name='Heading 1'] => h1:fresh",
//               "p[style-name='Heading 2'] => h2:fresh",
//               "p[style-name='Heading 3'] => h3:fresh",
//               "p[style-name='Title']     => h1.title:fresh",
//               "b => strong",
//               "i => em",
//               "u => u",
//               "strike => s",
//               "table => table",
//               "tr    => tr",
//               "td    => td",
//             ],
//             convertImage: mammoth.images.imgElement(image => {
//               return image.read('base64').then(imageBuffer => {
//                 return { src: `data:${image.contentType};base64,${imageBuffer}` };
//               });
//             }),
//           }
//         );
//       } catch(mammothErr) {
//         return res.status(400).json({ error: `"${originalname}" could not be read as a Word document: ${mammothErr.message}` });
//       }

//       const bodyHtml = result.value;
//       const html = `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8"/>
// <meta name="viewport" content="width=device-width,initial-scale=1"/>
// <title>${originalname}</title>
// <style>
//   * { box-sizing: border-box; }
//   body {
//     font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
//     font-size: 11pt;
//     line-height: 1.5;
//     color: #000;
//     background: #fff;
//     margin: 0;
//     padding: 0;
//   }
//   .page {
//     max-width: 850px;
//     margin: 0 auto;
//     padding: 72px 96px;
//     background: #fff;
//     min-height: 100vh;
//   }
//   h1 { font-size: 20pt; font-weight: 700; margin: 18pt 0 6pt; line-height: 1.2; }
//   h2 { font-size: 16pt; font-weight: 700; margin: 14pt 0 4pt; line-height: 1.2; }
//   h3 { font-size: 13pt; font-weight: 700; margin: 12pt 0 4pt; }
//   h4 { font-size: 11pt; font-weight: 700; margin: 10pt 0 4pt; }
//   p  { margin: 0 0 8pt; }
//   p:empty { margin: 0 0 4pt; min-height: 8pt; }
//   ul, ol { margin: 0 0 8pt 22pt; padding: 0; }
//   li { margin-bottom: 3pt; }
//   table {
//     width: 100%;
//     border-collapse: collapse;
//     margin: 12pt 0;
//     font-size: 10pt;
//   }
//   td, th {
//     border: 1px solid #000;
//     padding: 4pt 6pt;
//     vertical-align: top;
//     min-width: 30pt;
//   }
//   th {
//     background: #d0d0d0;
//     font-weight: 700;
//     text-align: left;
//   }
//   tr:nth-child(even) td { background: #f8f8f8; }
//   img { max-width: 100%; height: auto; display: block; margin: 8pt auto; }
//   strong, b { font-weight: 700; }
//   em, i { font-style: italic; }
//   u { text-decoration: underline; }
//   s { text-decoration: line-through; }
//   a { color: #1155cc; }
//   /* Checkbox-like spans from DOCX */
//   .checkbox { display: inline-block; width: 11pt; height: 11pt; border: 1px solid #000; vertical-align: middle; margin-right: 4pt; }
//   .checkbox.checked { background: #000; }
//   /* Form blank lines */
//   .blank { display: inline-block; border-bottom: 1px solid #000; min-width: 100pt; margin: 0 3pt; }
//   @media print {
//     .page { padding: 0; }
//     body { margin: 0; }
//   }
// </style>
// </head>
// <body>
// <div class="page">
// ${bodyHtml}
// </div>
// </body>
// </html>`;
//       const htmlB64 = Buffer.from(html, 'utf8').toString('base64');
//       return res.json({ htmlBase64: htmlB64, originalName: originalname, convertedFrom: 'docx' });
//     }

//     // ── XLSX / XLS ────────────────────────────────────────────────────────
//     if (detectedType === 'xlsx') {
//       const workbook = xlsx.read(buffer, { type: 'buffer', cellStyles: true, cellDates: true });

//       let sheetsHtml = '';
//       for (const sheetName of workbook.SheetNames) {
//         const ws = workbook.Sheets[sheetName];
//         if (!ws || !ws['!ref']) { sheetsHtml += `<div class="sheet-tab empty">${sheetName} (empty)</div>`; continue; }

//         const range = xlsx.utils.decode_range(ws['!ref']);
//         const colWidths = ws['!cols'] || [];
//         const rowHeights = ws['!rows'] || [];

//         // Build table
//         let tableHtml = '<table>';
//         for (let R = range.s.r; R <= range.e.r; R++) {
//           const rh = rowHeights[R];
//           const rowStyle = rh?.hpx ? `height:${rh.hpx}px;` : '';
//           tableHtml += `<tr style="${rowStyle}">`;
//           for (let C = range.s.c; C <= range.e.c; C++) {
//             const cellAddr = xlsx.utils.encode_cell({ r: R, c: C });
//             const cell = ws[cellAddr];
//             const cw = colWidths[C];
//             const colStyle = cw?.wpx ? `width:${cw.wpx}px;min-width:${cw.wpx}px;` : 'min-width:60px;';

//             // Check merge
//             const merges = ws['!merges'] || [];
//             const merge = merges.find(m => m.s.r === R && m.s.c === C);
//             const isMergedAway = merges.find(m => R > m.s.r && R <= m.e.r && C >= m.s.c && C <= m.e.c && !(m.s.r === R && m.s.c === C)) ||
//                                  merges.find(m => C > m.s.c && C <= m.e.c && R >= m.s.r && R <= m.e.r && !(m.s.r === R && m.s.c === C));
//             if (isMergedAway) continue;

//             const colspan = merge ? (merge.e.c - merge.s.c + 1) : 1;
//             const rowspan = merge ? (merge.e.r - merge.s.r + 1) : 1;
//             const mergeAttrs = (colspan > 1 ? ` colspan="${colspan}"` : '') + (rowspan > 1 ? ` rowspan="${rowspan}"` : '');

//             // Cell value
//             let val = '';
//             if (cell) {
//               if (cell.t === 'd' && cell.v instanceof Date) {
//                 val = cell.v.toLocaleDateString();
//               } else if (cell.w !== undefined) {
//                 val = cell.w;
//               } else {
//                 val = cell.v !== undefined ? String(cell.v) : '';
//               }
//             }

//             // Cell styling from xlsx
//             const s = cell?.s || {};
//             let tdStyle = colStyle;
//             if (s.font?.bold || R === range.s.r) tdStyle += 'font-weight:700;';
//             if (s.font?.italic) tdStyle += 'font-style:italic;';
//             if (s.font?.underline) tdStyle += 'text-decoration:underline;';
//             if (s.alignment?.horizontal === 'center') tdStyle += 'text-align:center;';
//             if (s.alignment?.horizontal === 'right')  tdStyle += 'text-align:right;';
//             if (s.fill?.fgColor?.rgb) tdStyle += `background:#${s.fill.fgColor.rgb.slice(-6)};`;
//             if (s.font?.color?.rgb)   tdStyle += `color:#${s.font.color.rgb.slice(-6)};`;

//             // Header row gets header style
//             const tag = R === range.s.r ? 'th' : 'td';
//             tableHtml += `<${tag}${mergeAttrs} style="${tdStyle}">${val}</${tag}>`;
//           }
//           tableHtml += '</tr>';
//         }
//         tableHtml += '</table>';

//         sheetsHtml += `
// <div class="sheet-wrapper">
//   <div class="sheet-tab">${sheetName}</div>
//   <div class="sheet-content">
//     ${tableHtml}
//   </div>
// </div>`;
//       }

//       const html = `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8"/>
// <title>${originalname}</title>
// <style>
//   * { box-sizing: border-box; }
//   body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 10pt; background: #f0f0f0; margin: 0; padding: 16px; }
//   .sheet-wrapper { background: #fff; margin-bottom: 32px; border: 1px solid #ccc; border-radius: 4px; overflow: hidden; }
//   .sheet-tab { background: #217346; color: #fff; font-weight: 700; font-size: 10pt; padding: 6px 16px; letter-spacing: 0.03em; }
//   .sheet-content { overflow-x: auto; padding: 0; }
//   table { border-collapse: collapse; font-size: 10pt; min-width: 100%; }
//   td, th {
//     border: 1px solid #d0d0d0;
//     padding: 3pt 6pt;
//     vertical-align: middle;
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     max-width: 300px;
//   }
//   th { background: #e8f0e8; font-weight: 700; text-align: left; border-color: #b0b0b0; }
//   tr:hover td { background: #f5f5f5; }
//   .empty { padding: 8px 16px; color: #999; font-style: italic; }
// </style>
// </head>
// <body>
// ${sheetsHtml}
// </body>
// </html>`;
//       const htmlB64 = Buffer.from(html, 'utf8').toString('base64');
//       return res.json({ htmlBase64: htmlB64, originalName: originalname, convertedFrom: 'xlsx' });
//     }

//     // ── PPTX / PPT ────────────────────────────────────────────────────────
//     if (detectedType === 'pptx') {
      
//       let zip, entries;
//       try {
//         zip = new AdmZip(buffer);
//         entries = zip.getEntries();
//       } catch (zipErr) {
//         return res.status(400).json({ error: `"${originalname}" does not appear to be a valid PowerPoint file. ${zipErr.message}` });
//       }

//       // Extract slide dimensions from presentation.xml
//       let slideW = 9144000, slideH = 6858000; // default 10in x 7.5in in EMUs
//       const presEntry = entries.find(e => e.entryName === 'ppt/presentation.xml');
//       if (presEntry) {
//         const presXml = presEntry.getData().toString('utf8');
//         const szMatch = presXml.match(/p:sldSz[^>]+cx="(\d+)"[^>]+cy="(\d+)"/);
//         if (szMatch) { slideW = parseInt(szMatch[1]); slideH = parseInt(szMatch[2]); }
//       }
//       const aspectRatio = slideH / slideW;
//       const displayW = 900;
//       const displayH = Math.round(displayW * aspectRatio);

//       // Extract images as base64 map: "ppt/media/imageX.xxx" -> dataUrl
//       const mediaMap = {};
//       for (const e of entries) {
//         if (e.entryName.startsWith('ppt/media/')) {
//           const ext = e.entryName.split('.').pop().toLowerCase();
//           const mimeTypes = { png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', gif:'image/gif', bmp:'image/bmp', svg:'image/svg+xml', webp:'image/webp', emf:'image/x-emf', wmf:'image/x-wmf' };
//           const mt = mimeTypes[ext] || `image/${ext}`;
//           const b64 = e.getData().toString('base64');
//           mediaMap[e.entryName] = `data:${mt};base64,${b64}`;
//         }
//       }

//       // Get slide relationship files to map rId -> media path
//       const slideEntries = entries
//         .filter(e => e.entryName.match(/ppt\/slides\/slide\d+\.xml$/) && !e.entryName.includes('_rels'))
//         .sort((a, b) => {
//           const na = parseInt(a.entryName.match(/slide(\d+)/)?.[1] || 0);
//           const nb = parseInt(b.entryName.match(/slide(\d+)/)?.[1] || 0);
//           return na - nb;
//         });

//       // Parse slide XML to extract text and images with their approximate positions
//       function parseSlideXml(slideXml, relsXml) {
//         // Parse rels to get media refs
//         const relsMap = {};
//         const relMatches = [...(relsXml || '').matchAll(/<Relationship[^>]+Id="([^"]+)"[^>]+Target="([^"]+)"/g)];
//         for (const m of relMatches) {
//           relsMap[m[1]] = m[2];
//         }

//         const elements = [];

//         // Extract text shapes with position/size
//         const spRegex = /<p:sp\b[\s\S]*?<\/p:sp>/g;
//         for (const spMatch of slideXml.matchAll(spRegex)) {
//           const sp = spMatch[0];

//           // Position (in EMUs)
//           const offMatch = sp.match(/a:off\s+x="(-?\d+)"\s+y="(-?\d+)"/);
//           const extMatch = sp.match(/a:ext\s+cx="(\d+)"\s+cy="(\d+)"/);
//           const x = offMatch ? parseInt(offMatch[1]) : 0;
//           const y = offMatch ? parseInt(offMatch[2]) : 0;
//           const w = extMatch ? parseInt(extMatch[1]) : slideW;
//           const h = extMatch ? parseInt(extMatch[2]) : 200000;

//           // Is this a title placeholder?
//           const isTitle = /<p:ph\s+type="title"/.test(sp) || /<p:ph\s+type="ctrTitle"/.test(sp);

//           // Extract text runs
//           const paras = [];
//           for (const paraMatch of sp.matchAll(/<a:p\b[\s\S]*?<\/a:p>/g)) {
//             const para = paraMatch[0];
//             let paraText = '';
//             let isBold = false, isItal = false, fontSize = null;

//             for (const rMatch of para.matchAll(/<a:r\b[\s\S]*?<\/a:r>/g)) {
//               const r = rMatch[0];
//               const tMatch = r.match(/<a:t>([^<]*)<\/a:t>/);
//               if (!tMatch) continue;
//               const text = tMatch[1]
//                 .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
//                 .replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#x([0-9A-Fa-f]+);/g,(_,h)=>String.fromCharCode(parseInt(h,16)));

//               // Style
//               const bold  = /<a:rPr[^>]*\bb="1"/.test(r) || /<a:rPr[^>]*\bbold="1"/.test(r);
//               const ital  = /<a:rPr[^>]*\bi="1"/.test(r);
//               const szMatch = r.match(/a:rPr[^>]*\bsz="(\d+)"/);
//               if (bold) isBold = true;
//               if (ital) isItal = true;
//               if (szMatch) fontSize = parseInt(szMatch[1]) / 100; // hundredths of a point

//               paraText += (bold ? `<strong>${text}</strong>` : '') +
//                           (!bold && ital ? `<em>${text}</em>` : '') +
//                           (!bold && !ital ? text : '');
//             }
//             if (paraText.trim()) paras.push({ text: paraText, fontSize });
//           }

//           if (paras.length) {
//             elements.push({ type: 'text', x, y, w, h, paras, isTitle });
//           }
//         }

//         // Extract images
//         const picRegex = /<p:pic\b[\s\S]*?<\/p:pic>/g;
//         for (const picMatch of slideXml.matchAll(picRegex)) {
//           const pic = picMatch[0];
//           const offMatch = pic.match(/a:off\s+x="(-?\d+)"\s+y="(-?\d+)"/);
//           const extMatch = pic.match(/a:ext\s+cx="(\d+)"\s+cy="(\d+)"/);
//           const rIdMatch = pic.match(/r:embed="([^"]+)"/);
//           if (!rIdMatch) continue;

//           const x = offMatch ? parseInt(offMatch[1]) : 0;
//           const y = offMatch ? parseInt(offMatch[2]) : 0;
//           const w = extMatch ? parseInt(extMatch[1]) : 914400;
//           const h = extMatch ? parseInt(extMatch[2]) : 685800;
//           const rId = rIdMatch[1];
//           const relTarget = relsMap[rId] || '';
//           // Resolve relative path: ../media/image1.png → ppt/media/image1.png
//           const mediaPath = relTarget.startsWith('../')
//             ? 'ppt/' + relTarget.slice(3)
//             : 'ppt/slides/' + relTarget;
//           const dataUrl = mediaMap[mediaPath];
//           if (dataUrl) elements.push({ type: 'img', x, y, w, h, dataUrl });
//         }

//         // Sort by y then x for reading order
//         elements.sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);
//         return elements;
//       }

//       // Get slide background colors from slide layout/theme (best-effort)
//       function getSlideBackground(slideXml) {
//         // Check for solid fill on sp tree background
//         const bgMatch = slideXml.match(/<p:bg>[\s\S]*?<a:srgbClr val="([0-9A-Fa-f]{6})"[\s\S]*?<\/p:bg>/);
//         if (bgMatch) return `#${bgMatch[1]}`;
//         // Check for gradient or schemeClr (too complex — use white)
//         return '#ffffff';
//       }

//       // Generate slide HTML
//       let slidesHtml = '';
//       let slideIndex = 0;
//       for (const slideEntry of slideEntries) {
//         slideIndex++;
//         const slideXml = slideEntry.getData().toString('utf8');

//         // Get rels
//         const relsPath = slideEntry.entryName.replace('ppt/slides/', 'ppt/slides/_rels/') + '.rels';
//         const relsEntry = entries.find(e => e.entryName === relsPath);
//         const relsXml = relsEntry ? relsEntry.getData().toString('utf8') : '';

//         const elements = parseSlideXml(slideXml, relsXml);
//         const bgColor  = getSlideBackground(slideXml);

//         // Convert EMU coords to percentage of slide
//         function emuToX(v) { return (v / slideW * 100).toFixed(3) + '%'; }
//         function emuToY(v) { return (v / slideH * 100).toFixed(3) + '%'; }
//         function emuToW(v) { return (v / slideW * 100).toFixed(3) + '%'; }
//         function emuToH(v) { return (v / slideH * 100).toFixed(3) + '%'; }

//         let elemHtml = '';
//         for (const el of elements) {
//           const left   = emuToX(Math.max(0, el.x));
//           const top    = emuToY(Math.max(0, el.y));
//           const width  = emuToW(Math.min(el.w, slideW - Math.max(0, el.x)));
//           const height = emuToH(Math.min(el.h, slideH - Math.max(0, el.y)));
//           const style  = `position:absolute;left:${left};top:${top};width:${width};height:${height};overflow:hidden;`;

//           if (el.type === 'img') {
//             elemHtml += `<div style="${style}"><img src="${el.dataUrl}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/></div>`;
//           } else {
//             // Determine text color for readability
//             const bgLum = (() => {
//               const hex = bgColor.replace('#','').padEnd(6,'0');
//               const r=parseInt(hex.slice(0,2),16), g=parseInt(hex.slice(2,4),16), b=parseInt(hex.slice(4,6),16);
//               return (0.299*r + 0.587*g + 0.114*b)/255;
//             })();
//             const textColor = bgLum < 0.5 ? '#ffffff' : '#000000';

//             const paragraphs = el.paras.map(p => {
//               const fs = p.fontSize ? `font-size:${Math.max(8, Math.min(p.fontSize, el.isTitle ? 60 : 40))}pt;` : (el.isTitle ? 'font-size:28pt;' : 'font-size:18pt;');
//               return `<p style="margin:0 0 4pt;line-height:1.2;${fs}">${p.text}</p>`;
//             }).join('');

//             const fw = el.isTitle ? 'font-weight:700;' : '';
//             elemHtml += `<div style="${style}color:${textColor};${fw}padding:4pt;word-break:break-word;">${paragraphs}</div>`;
//           }
//         }

//         slidesHtml += `
// <div class="slide-wrapper">
//   <div class="slide-number">Slide ${slideIndex} of ${slideEntries.length}</div>
//   <div class="slide" style="width:${displayW}px;height:${displayH}px;background:${bgColor};">
//     ${elemHtml}
//   </div>
// </div>`;
//       }

//       const html = `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8"/>
// <title>${originalname}</title>
// <style>
//   * { box-sizing: border-box; }
//   body { font-family: 'Calibri', Arial, sans-serif; background: #404040; margin: 0; padding: 24px; min-height: 100vh; }
//   .slide-wrapper { display: flex; flex-direction: column; align-items: center; margin-bottom: 32px; }
//   .slide-number { color: #ccc; font-size: 12px; margin-bottom: 6px; letter-spacing: 0.05em; }
//   .slide {
//     position: relative;
//     overflow: hidden;
//     border-radius: 3px;
//     box-shadow: 0 4px 24px rgba(0,0,0,0.5);
//     background: #fff;
//     flex-shrink: 0;
//   }
//   .slide p { user-select: text; }
//   @media (max-width: 960px) {
//     .slide { width: 100% !important; height: auto !important; min-height: 200px; }
//     .slide > div[style*="position:absolute"] { position: relative !important; left: auto !important; top: auto !important; width: 100% !important; height: auto !important; }
//   }
// </style>
// </head>
// <body>
// ${slidesHtml}
// </body>
// </html>`;
//       const htmlB64 = Buffer.from(html, 'utf8').toString('base64');
//       return res.json({ htmlBase64: htmlB64, originalName: originalname, convertedFrom: 'pptx', slideCount: slideEntries.length });
//     }

//     // ── CSV — render as styled spreadsheet-like table ─────────────────────
//     if (detectedType === 'csv') {
//       const text = buffer.toString('utf8');
//       // Parse CSV properly (handles quoted fields with commas/newlines)
//       function parseCsv(str) {
//         const rows = [];
//         let row = [], field = '', inQuote = false;
//         for (let i = 0; i < str.length; i++) {
//           const ch = str[i], next = str[i+1];
//           if (inQuote) {
//             if (ch === '"' && next === '"') { field += '"'; i++; }
//             else if (ch === '"') { inQuote = false; }
//             else { field += ch; }
//           } else {
//             if (ch === '"') { inQuote = true; }
//             else if (ch === ',') { row.push(field); field = ''; }
//             else if (ch === '\n' || (ch === '\r' && next === '\n')) {
//               row.push(field); field = '';
//               if (row.some(c => c.trim())) rows.push(row);
//               row = [];
//               if (ch === '\r') i++;
//             } else if (ch === '\r') {
//               row.push(field); field = '';
//               if (row.some(c => c.trim())) rows.push(row);
//               row = [];
//             } else { field += ch; }
//           }
//         }
//         if (field || row.length) { row.push(field); if (row.some(c => c.trim())) rows.push(row); }
//         return rows;
//       }
//       const rows = parseCsv(text);
//       if (!rows.length) return res.json({ html: '<html><body><p>Empty CSV file.</p></body></html>', originalName: originalname, convertedFrom: 'csv' });

//       const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
//       const maxCols = Math.max(...rows.map(r => r.length));
//       // Normalize rows to same column count
//       const norm = rows.map(r => { while(r.length < maxCols) r.push(''); return r; });
//       const header = norm[0];
//       const body   = norm.slice(1);

//       const thead = `<thead><tr>${header.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>`;
//       const tbody = `<tbody>${body.map((row,ri) => `<tr class="${ri%2===0?'even':'odd'}">${row.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;

//       const htmlStr = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
// <title>${esc(originalname)}</title>
// <style>
// *{box-sizing:border-box;}
// body{font-family:Calibri,'Segoe UI',Arial,sans-serif;font-size:10pt;background:#f0f0f0;margin:0;padding:20px;}
// h3{margin:0 0 10px;font-size:13pt;color:#217346;}
// .info{font-size:9pt;color:#666;margin-bottom:12px;}
// .wrap{background:#fff;border:1px solid #ccc;border-radius:4px;overflow:hidden;}
// .tab-bar{background:#217346;color:#fff;font-weight:700;font-size:10pt;padding:6px 16px;}
// .scroll{overflow-x:auto;}
// table{border-collapse:collapse;font-size:10pt;min-width:100%;white-space:nowrap;}
// th{background:#e8f4ee;font-weight:700;text-align:left;border:1px solid #aaa;padding:4px 10px;position:sticky;top:0;}
// td{border:1px solid #d0d0d0;padding:3px 10px;vertical-align:middle;}
// tr.even td{background:#f9f9f9;}
// tr:hover td{background:#eef7f0;}
// </style></head><body>
// <div class="wrap">
// <div class="tab-bar">📊 ${esc(originalname)}</div>
// <div class="info" style="padding:6px 16px;">${rows.length - 1} rows × ${maxCols} columns</div>
// <div class="scroll"><table>${thead}${tbody}</table></div>
// </div>
// </body></html>`;
//       // Send as base64 to avoid JSON escaping issues with large HTML
//       const htmlB64 = Buffer.from(htmlStr, 'utf8').toString('base64');
//       return res.json({ htmlBase64: htmlB64, originalName: originalname, convertedFrom: 'csv', rows: rows.length - 1, cols: maxCols });
//     }

//     // ── TXT / MD / RTF / HTML — styled text viewer ────────────────────────
//     if (detectedType === 'html' || detectedType === 'markdown' || detectedType === 'text') {
//       const text = buffer.toString('utf8');
//       // For HTML files, serve as-is
//       if (detectedType === 'html') {
//         const htmlB64 = buffer.toString('base64');
//         return res.json({ htmlBase64: htmlB64, originalName: originalname, convertedFrom: 'html' });
//       }
//       // Markdown → basic HTML conversion
//       if (detectedType === 'markdown') {
//         const esc2 = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
//         const md2html = str => str
//           .replace(/^### (.+)$/gm, '<h3>$1</h3>')
//           .replace(/^## (.+)$/gm, '<h2>$1</h2>')
//           .replace(/^# (.+)$/gm, '<h1>$1</h1>')
//           .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
//           .replace(/\*(.+?)\*/g, '<em>$1</em>')
//           .replace(/`(.+?)`/g, '<code>$1</code>')
//           .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
//           .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
//           .replace(/\n\n/g, '</p><p>')
//           .replace(/^(?!<[hpuol])/gm, '');
//         const body = md2html(esc2(text));
//         const htmlStr = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>${esc2(originalname)}</title>
// <style>body{font-family:'Segoe UI',Arial,sans-serif;font-size:11pt;max-width:820px;margin:0 auto;padding:40px 60px;line-height:1.7;color:#222;}
// h1{font-size:22pt;border-bottom:2px solid #ddd;padding-bottom:8px;}h2{font-size:16pt;}h3{font-size:13pt;}
// code{background:#f4f4f4;padding:2px 5px;border-radius:3px;font-family:Consolas,monospace;}
// ul{margin-left:24px;}li{margin-bottom:4px;}</style>
// </head><body><p>${body}</p></body></html>`;
//         const htmlB64 = Buffer.from(htmlStr,'utf8').toString('base64');
//         return res.json({ htmlBase64: htmlB64, originalName: originalname, convertedFrom: 'markdown' });
//       }
//       // Plain text / RTF
//       const esc2 = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
//       const escaped = esc2(text);
//       const htmlStr = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>${esc2(originalname)}</title>
// <style>body{font-family:Consolas,'Courier New',monospace;font-size:12px;background:#1e1e1e;color:#d4d4d4;padding:24px;margin:0;white-space:pre-wrap;word-break:break-word;line-height:1.6;tab-size:4;}</style>
// </head><body>${escaped}</body></html>`;
//       const htmlB64 = Buffer.from(htmlStr,'utf8').toString('base64');
//       return res.json({ htmlBase64: htmlB64, originalName: originalname, convertedFrom: 'text' });
//     }

//     return res.status(400).json({ error: `Cannot preview "${originalname}" — unsupported file type (detected: ${detectedType}, mime: ${mimetype})` });

//   } catch (err) {
//     console.error('[convert-for-viewing]', err);
//     res.status(500).json({ error: `Failed to convert "${originalname}": ${err.message}` });
//   }
// });

// // ── POST /api/generate-citations ──────────────────────────────────────────
// app.post('/api/generate-citations', async (req, res) => {
//   const { description = '', format = 'apa7' } = req.body;
//   if (!description.trim()) return res.status(400).json({ error: 'Description is required.' });
//   const isApa = format !== 'mla';
//   const formatLabel   = isApa ? 'APA 7th edition' : 'MLA 9th edition';
//   const refListLabel  = isApa ? 'References'      : 'Works Cited';
//   const exParenthetical = isApa ? '(Smith & Jones, 2021, p. 45)' : '(Smith and Jones 45)';
//   const exNarrative     = isApa ? 'Smith and Jones (2021)'        : 'Smith and Jones';
//   const exReference     = isApa
//     ? 'Smith, J., & Jones, A. (2021). <em>Book title</em>. Publisher.'
//     : 'Smith, John, and Alice Jones. <em>Book Title</em>. Publisher, 2021.';
//   try {
//     const { GoogleGenAI } = await import('@google/genai');
//     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
//     const prompt = `You are an expert in ${formatLabel} citation formatting.
// The user wants to cite: "${description}"
// Generate three things in strict ${formatLabel} format:
// 1. Parenthetical in-text citation — e.g. ${exParenthetical}
// 2. Narrative in-text citation     — e.g. ${exNarrative}
// 3. Full ${refListLabel} entry     — e.g. ${exReference}
// Return ONLY this JSON — no markdown:
// {"intext":"(citation)","narrative":"Narrative citation","reference":"Full entry"}`;
//     const result = await ai.models.generateContent({ model:'gemini-2.5-flash', contents:prompt, config:{ responseMimeType:'application/json' } });
//     const text   = typeof result.text==='function' ? result.text() : result.text;
//     const parsed = JSON.parse(text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/i,'').trim());
//     if (!parsed.intext||!parsed.narrative||!parsed.reference) return res.status(422).json({ error:'Incomplete citation data. Try again.' });
//     res.json(parsed);
//   } catch (err) {
//     console.error('Citation error:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── DOCUMENTS CRUD ────────────────────────────────────────────────────────

// // GET /api/documents — list all
// app.get('/api/documents', (req, res) => {
//   const idx = readIndex();
//   res.json({ documents: idx.map(({ id, title, updatedAt }) => ({ id, title, updatedAt })) });
// });

// // GET /api/documents/:id — full doc
// app.get('/api/documents/:id', (req, res) => {
//   const fp = docPath(req.params.id);
//   if (!fs.existsSync(fp)) return res.status(404).json({ error:'Not found' });
//   try { res.json(JSON.parse(fs.readFileSync(fp,'utf8'))); }
//   catch { res.status(500).json({ error:'Read error' }); }
// });

// // POST /api/documents — create (auto-saves PDF to disk)
// app.post('/api/documents', async (req, res) => {
//   const { title, html, manifesto, ov } = req.body;
//   const id  = Date.now().toString(36) + Math.random().toString(36).slice(2,7);
//   const now = new Date().toISOString();
//   const doc = { id, title: title||'Untitled Report', html, manifesto, ov, createdAt:now, updatedAt:now };

//   fs.writeFileSync(docPath(id), JSON.stringify(doc, null, 2));
//   const idx = readIndex();
//   idx.unshift({ id, title: doc.title, updatedAt: now });
//   writeIndex(idx);

//   // Auto-save PDF to ~/Documents/ReportBuilderDocs/pdfs/ (best-effort)
//   savePdfToDisk(html, title, id).catch(() => {});

//   res.json({ id, title: doc.title, updatedAt: now });
// });

// // PUT /api/documents/:id — update (re-saves PDF)
// app.put('/api/documents/:id', async (req, res) => {
//   const fp = docPath(req.params.id);
//   if (!fs.existsSync(fp)) return res.status(404).json({ error:'Not found' });
//   const existing = JSON.parse(fs.readFileSync(fp,'utf8'));
//   const { title, html, manifesto, ov } = req.body;
//   const now = new Date().toISOString();
//   const updated = { ...existing, title:title||existing.title, html, manifesto, ov, updatedAt:now };
//   fs.writeFileSync(fp, JSON.stringify(updated, null, 2));
//   const idx = readIndex().map(d => d.id===req.params.id ? { ...d, title:updated.title, updatedAt:now } : d);
//   writeIndex(idx);

//   // Re-save PDF
//   savePdfToDisk(html, updated.title, req.params.id).catch(() => {});

//   res.json({ id:req.params.id, title:updated.title, updatedAt:now });
// });

// // DELETE /api/documents/:id
// app.delete('/api/documents/:id', (req, res) => {
//   const fp = docPath(req.params.id);
//   if (fs.existsSync(fp)) fs.unlinkSync(fp);
//   writeIndex(readIndex().filter(d => d.id!==req.params.id));
//   res.json({ deleted:true });
// });

// // ── PDFs ROUTES ───────────────────────────────────────────────────────────

// // GET /api/pdfs — list all saved PDFs
// app.get('/api/pdfs', (req, res) => {
//   try {
//     const files = fs.readdirSync(PDF_DIR)
//       .filter(f => f.endsWith('.pdf'))
//       .map(f => {
//         const stat = fs.statSync(path.join(PDF_DIR, f));
//         return {
//           filename: f,
//           title: f.replace(/_[a-z0-9]{8,}\.pdf$/, '').replace(/_/g, ' ').trim() || f,
//           size:     stat.size,
//           savedAt:  stat.mtime.toISOString(),
//         };
//       })
//       .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
//     res.json({ pdfs: files, directory: PDF_DIR });
//   } catch(err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /api/pdfs/:filename — serve a saved PDF
// app.get('/api/pdfs/:filename', (req, res) => {
//   const fp = path.join(PDF_DIR, path.basename(req.params.filename));
//   if (!fs.existsSync(fp)) return res.status(404).json({ error: 'Not found' });
//   res.setHeader('Content-Type', 'application/pdf');
//   res.setHeader('Content-Disposition', `attachment; filename="${path.basename(fp)}"`);
//   res.send(fs.readFileSync(fp));
// });

// // ── POST /api/update-report ───────────────────────────────────────────────
// app.post('/api/update-report', async (req, res) => {
//   const { html='', instruction='' } = req.body;
//   if (!instruction.trim()) return res.status(400).json({ error:'Instruction required.' });
//   try {
//     const { GoogleGenAI } = await import('@google/genai');
//     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
//     const prompt = `You are editing an HTML report document. The user wants you to make the following change:
// "${instruction}"
// Current HTML body:
// ${html.slice(0,60000)}
// RULES:
// - Apply ONLY the requested change. Do not rewrite or restructure anything else.
// - Preserve all data-id, data-editable, data-draggable, data-feature attributes exactly.
// - If adding new elements, give them unique data-id values and data-editable="true".
// - Output the COMPLETE updated HTML body.
// Return ONLY this JSON — no markdown:
// {"html":"<updated full HTML body>","summary":"One sentence describing what changed"}`;

//     let result, lastErr;
//     for (let attempt = 0; attempt < 4; attempt++) {
//       try {
//         result = await ai.models.generateContent({ model:'gemini-2.5-flash', contents:prompt, config:{ responseMimeType:'application/json' } });
//         break;
//       } catch(err) {
//         lastErr = err;
//         const msg = err?.message||'';
//         const retryable = msg.includes('503')||msg.includes('UNAVAILABLE')||msg.includes('high demand')||msg.includes('429');
//         if (!retryable) throw err;
//         const wait = Math.min(2000*Math.pow(2,attempt)+Math.random()*500, 20000);
//         await new Promise(r=>setTimeout(r,wait));
//       }
//     }
//     if (!result) throw lastErr;
//     const text    = typeof result.text==='function' ? result.text() : result.text;
//     const parsed  = JSON.parse(text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/i,'').trim());
//     if (!parsed.html) return res.status(422).json({ error:'AI returned no HTML.' });
//     res.json({ html: parsed.html, summary: parsed.summary||'Report updated.' });
//   } catch(err) {
//     console.error('Update report error:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── POST /api/regenerate-diagram ─────────────────────────────────────────
// app.post('/api/regenerate-diagram', async (req, res) => {
//   const { keyword, topic, diagramType, bgColor, primaryColor } = req.body;
//   try {
//     const { regenerateDiagram } = await import('./tools.js');
//     const svg = await regenerateDiagram(keyword, topic, diagramType, bgColor, primaryColor);
//     if (!svg) return res.status(422).json({ error:'SVG generation returned empty result.' });
//     res.json({ svg });
//   } catch(err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── POST /api/generate-diagram-ai ────────────────────────────────────────
// // Proxies Claude AI calls for DiagramBuilder (avoids browser CORS block)
// app.post('/api/generate-diagram-ai', async (req, res) => {
//   const { prompt, chartType } = req.body;
//   if (!prompt || !chartType) return res.status(400).json({ error: 'prompt and chartType required' });

//   const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
//   if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set on server' });

//   // Build a schema description per chart type so AI knows exactly what to return
//   // Canvas mode — AI generates a full layout with multiple elements
//   if (chartType === 'canvas') {
//     const systemPrompt = `You are a diagram layout AI. Given a description, you generate a JSON layout for a canvas diagram editor.

// Return ONLY this exact JSON structure — no markdown, no backticks, no explanation:
// {
//   "canvasBg": "#1e293b",
//   "elements": [
//     {
//       "type": "chart",
//       "chartType": "bar|line|pie|donut|area|scatter|gauge|table|timeline|flow|grid|funnel|heatmap|treemap|radar|waterfall|bullet|pyramid|venn|orgchart|mindmap|swimlane|grouped",
//       "x": 50, "y": 50, "w": 380, "h": 260,
//       "title": "Chart Title",
//       "palette": "blue|green|purple|warm|mono|vivid|ocean|sunset",
//       "textColor": "#1e293b",
//       "bgColor": "#ffffff",
//       "chartData": { /* data object matching chart type — see below */ }
//     },
//     {
//       "type": "rect|circle|diamond|triangle|hexagon|text",
//       "x": 100, "y": 50, "w": 160, "h": 80,
//       "fill": "#3b82f6", "stroke": "#1d4ed8", "strokeW": 2,
//       "text": "Label", "fontSize": 14, "fontColor": "#ffffff",
//       "cornerRadius": 6, "opacity": 1
//     }
//   ]
// }

// ChartData formats:
// - bar/line/area: { data: [{name, v}] }
// - pie/donut: { data: [{name, v}] }
// - scatter: { data: [{x, y, label?}] }
// - gauge: { data: [{label, value, max, unit}] }
// - table: { headers: [str], rows: [[str]] }
// - timeline: { data: [{year, title, desc}] }
// - flow/orgchart: { nodes: [{id, label, x, y, shape, color}], edges: [{from, to, label?}] }
// - grid: { data: [{icon, title, desc}] }
// - funnel/pyramid: { data: [{label, v}] }
// - heatmap: { rows: [str], cols: [str], data: [[num]] }
// - treemap: { data: [{label, v}] }
// - radar: { labels: [str], series: [{name, vals: [num]}] }
// - waterfall: { data: [{label, v, base, total?}] }
// - bullet: { data: [{label, actual, target, max}] }
// - venn: { sets: [{label, x, r, color}], overlap: str }
// - sankey: { nodes: [str], flows: [{from, to, v}] }
// - mindmap: { center: str, branches: [{label, children: [str]}] }
// - swimlane: { lanes: [str], items: [{lane, label, x, w}] }
// - grouped: { labels: [str], series: [{name, vals: [num]}] }

// RULES:
// - Place elements to not overlap (space them out on the 1400×900 canvas)
// - Use 2-5 elements for best results
// - Keep data realistic and relevant to the prompt
// - Use appropriate chart types for the data
// - Text/shape elements can label sections`;

//     try {
//       const response = await fetch('https://api.anthropic.com/v1/messages', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
//         body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4000, system: systemPrompt, messages: [{ role: 'user', content: prompt }] }),
//       });
//       if (!response.ok) { const t = await response.text(); throw new Error(`Anthropic ${response.status}: ${t.slice(0,200)}`); }
//       const data = await response.json();
//       const text = data.content?.find(b => b.type === 'text')?.text || '';
//       const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
//       const result = JSON.parse(clean);
//       return res.json({ result });
//     } catch(err) {
//       console.error('[generate-diagram-ai canvas]', err.message);
//       return res.status(500).json({ error: err.message });
//     }
//   }

//   const schemas = {
//     bar:      'Return JSON: { title, palette, data: [{name, v}] }',
//     grouped:  'Return JSON: { title, palette, labels: [str], series: [{name, vals:[num]}] }',
//     line:     'Return JSON: { title, palette, data: [{name, v}] }',
//     area:     'Return JSON: { title, palette, data: [{name, v}] }',
//     pie:      'Return JSON: { title, palette, data: [{name, v}] }',
//     donut:    'Return JSON: { title, palette, data: [{name, v}] }',
//     scatter:  'Return JSON: { title, palette, data: [{x, y, label?}] }',
//     timeline: 'Return JSON: { title, palette, data: [{year, title, desc}] }',
//     table:    'Return JSON: { title, headers: [str], rows: [[str]] }',
//     gauge:    'Return JSON: { title, palette, data: [{label, value, max, unit}] } — max 3 gauges',
//     grid:     'Return JSON: { title, palette, data: [{icon, title, desc}] } — icon is an emoji',
//     flow:     'Return JSON: { title, nodes: [{id,label,x,y,shape,color}], edges: [{from,to,label?}] } — shapes: rect|circle|diamond, x/y positions spaced ~200px apart horizontally',
//   };

//   const systemPrompt = `You generate chart/diagram data for a diagram builder application.
// The user will describe what they want and you respond with ONLY valid JSON matching the schema.
// Available palette names: blue, green, purple, warm, mono, vivid, ocean, sunset
// Do NOT include markdown, backticks, or any explanation — ONLY the raw JSON object.
// ${schemas[chartType] || schemas.bar}`;

//   try {
//     const response = await fetch('https://api.anthropic.com/v1/messages', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': ANTHROPIC_KEY,
//         'anthropic-version': '2023-06-01',
//       },
//       body: JSON.stringify({
//         model: 'claude-sonnet-4-20250514',
//         max_tokens: 1500,
//         system: systemPrompt,
//         messages: [{ role: 'user', content: prompt }],
//       }),
//     });

//     if (!response.ok) {
//       const errText = await response.text();
//       throw new Error(`Anthropic API error ${response.status}: ${errText.slice(0, 200)}`);
//     }

//     const data = await response.json();
//     const text = data.content?.find(b => b.type === 'text')?.text || '';
//     const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
//     const result = JSON.parse(clean);
//     res.json({ result });
//   } catch (err) {
//     console.error('[generate-diagram-ai]', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// app.listen(3000, () => {
//   console.log('');
//   console.log('┌────────────────────────────────────────────────────────────┐');
//   console.log('│  ✅ Backend running on http://localhost:3000                │');
//   console.log('│  Export routes (Puppeteer-rendered, edits captured):       │');
//   console.log('│  ─────────────────────────────────────────────────────     │');
//   console.log('│   POST /api/generate-preview                               │');
//   console.log('│   POST /api/generate-from-file                             │');
//   console.log('│   POST /api/convert-for-viewing                            │');
//   console.log('│   POST /api/render-pdf / render-pdf-form / render-pdf-raw  │');
//   console.log('│   POST /api/generate-citations                             │');
//   console.log('│   POST /api/update-report                                  │');
//   console.log('│   POST /api/regenerate-diagram                             │');
//   console.log('│   POST /api/generate-diagram-ai                            │');
//   console.log('│   GET/POST/PUT/DELETE /api/documents                       │');
//   console.log('│   GET  /api/pdfs  /api/pdfs/:filename                      │');
//   console.log('└────────────────────────────────────────────────────────────┘');
//   console.log('');
// });




















///////server for ai auto via webscraping/puppeter///////////////////////////////







// import { GoogleGenAI } from '@google/genai';
// import puppeteer from 'puppeteer';

// const ai = new GoogleGenAI({ apiKey: '' });
// let browser, page;

// // Global AI Brain State
// let state = {
//   activeGoal: "Discover trending technology and find interesting GitHub repositories",
//   todoList: ["Search Google for 'latest open source AI tools'", "Analyze results"],
//   observationLog: [],
// };

// // --- The "Hands" of the AI (Puppeteer Actions) ---
// const actions = {
//   search_google: async (query) => {
//     if (!browser) browser = await puppeteer.launch({ headless: false, defaultViewport: null });
//     if (!page) page = (await browser.pages())[0] || await browser.newPage();
//     await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'networkidle2' });
//     const results = await page.evaluate(() => {
//       return Array.from(document.querySelectorAll('h3')).map(el => el.innerText).join('\n');
//     });
//     return `Google Search Results:\n${results}`;
//   },

//   visit_url: async (url) => {
//     if (!browser) browser = await puppeteer.launch({ headless: false });
//     if (!page) page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'networkidle2' });
//     const text = await page.evaluate(() => document.body.innerText.substring(0, 2000));
//     return `Content from ${url}:\n${text}`;
//   },

//   type_text: async ({ selector, text }) => {
//     await page.waitForSelector(selector, { timeout: 5000 });
//     await page.type(selector, text);
//     await page.keyboard.press('Enter');
//     return `Typed "${text}" into ${selector} and pressed Enter.`;
//   },

//   click_element: async ({ selector }) => {
//     await page.waitForSelector(selector, { timeout: 5000 });
//     await page.click(selector);
//     return `Clicked element: ${selector}`;
//   }
// };

// async function startAutonomousLoop() {
//   console.log(`\n\x1b[35m--- AI is deciding what to do next... ---\x1b[0m`);

//   try {
//     // CORRECT SYNTAX FOR @google/genai:
//     // We use ai.models.generateContent directly
//     const result = await ai.models.generateContent({
//       model: 'gemini-2.0-flash',
//       contents: [{ 
//         role: 'user', 
//         parts: [{ text: `
//           You are an autonomous web agent. You have full control over a browser.
//           GOAL: ${state.activeGoal}
//           TODO: ${JSON.stringify(state.todoList)}
//           LOGS: ${JSON.stringify(state.observationLog)}

//           RETURN JSON ONLY:
//           {
//             "thought": "your reasoning",
//             "actionType": "search_google",
//             "actionInput": "query",
//             "newObservations": [],
//             "updatedTodo": []
//           }
//         `}] 
//       }],
//       config: { 
//         response_mime_type: 'application/json' 
//       }
//     });

//     // Accessing the text in the new SDK
//     const action = JSON.parse(result.response.text());

//     console.log(`\x1b[33m[Thought]:\x1b[0m ${action.thought}`);
//     console.log(`\x1b[32m[Action]:\x1b[0m ${action.actionType}`);

//     // ... (Your existing execution logic for search_google, visit_url, etc.)

//     // Execute the AI's chosen tool
//     let toolResult;
//     if (action.actionType === 'search_google') {
//       toolResult = await actions.search_google(action.actionInput);
//     } else if (action.actionType === 'visit_url') {
//       toolResult = await actions.visit_url(action.actionInput);
//     } else if (action.actionType === 'type_text') {
//       toolResult = await actions.type_text(action.actionInput);
//     } else if (action.actionType === 'click_element') {
//       toolResult = await actions.click_element(action.actionInput);
//     }

//     state.todoList = action.updatedTodo;
//     state.observationLog.push(...action.newObservations);
//     state.observationLog.push(`Result: ${toolResult?.substring(0, 300)}`);

//     setTimeout(startAutonomousLoop, 4000);

//   } catch (err) {
//     console.error("Critical Error:", err.message);
//     setTimeout(startAutonomousLoop, 10000);
//   }
// }

// // Start the browser and the agent
// startAutonomousLoop();

// ─────────────────────────────────────────────────────────────────────────────
//  DUAL GEMINI AUTOMATION  —  Builder (left) + Thinker (right)
// ─────────────────────────────────────────────────────────────────────────────
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ══════════════════════════════════════════════════════════════════════════════
//  ★  YOUR PROJECT
// ══════════════════════════════════════════════════════════════════════════════
const PROJECT = {
  name:     'Gemini Puppeteer Automation Bot',
  stack:    'Node.js, Puppeteer, puppeteer-extra-plugin-stealth',
  bigThree: [
    '1. Auto-detect and type into Gemini chat input',
    '2. Parse [[[AUTOTASK]]] tags and reply automatically',
    '3. Detect stuck loops and self-correct',
  ],
  goal: 'Fully automated bot that drives a Gemini conversation producing real code each loop',
};

// ══════════════════════════════════════════════════════════════════════════════
//  ★  SCREEN — right-click desktop → Display Settings → Resolution
// ══════════════════════════════════════════════════════════════════════════════
const SCREEN_W = 1366;
const SCREEN_H = 768;
const HALF_W   = Math.floor(SCREEN_W / 2);

const RESET_AFTER = 6;      // open fresh chat every N exchanges
const STUCK_MAX   = 3;      // same-task repeats before unstick fires
const DELAY       = [5000, 9000]; // random human-pace delay before each send (ms)

const sleep     = ms       => new Promise(r => setTimeout(r, ms));
const randSleep = (lo, hi) => sleep(lo + Math.random() * (hi - lo));

// ─── Lock file cleanup ────────────────────────────────────────────────────────
function clearLocks(dir) {
  for (const f of ['SingletonLock', 'SingletonCookie', 'SingletonSocket']) {
    try { fs.unlinkSync(path.join(dir, f)); } catch (_) {}
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  LAUNCH
//  — uses puppeteer's bundled Chromium (no executablePath = no handshake timeout)
//  — stealth plugin removes all automation signals
//  — window placed exactly at xPos
// ══════════════════════════════════════════════════════════════════════════════
async function launchWindow(profileName, xPos) {
  const userDataDir = path.join(__dirname, profileName);
  if (fs.existsSync(userDataDir)) clearLocks(userDataDir);
  else fs.mkdirSync(userDataDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless:        false,
    // NO executablePath — use bundled Chromium to avoid the 30s handshake timeout
    // Stealth plugin handles the bot-signal removal instead
    userDataDir,
    defaultViewport: null,
    protocolTimeout: 120000,   // give Chrome 2 min to respond (was 30s default)
    timeout:         120000,   // launch timeout

    args: [
      `--window-size=${HALF_W},${SCREEN_H}`,
      `--window-position=${xPos},0`,

      '--no-first-run',
      '--no-default-browser-check',
      '--noerrdialogs',
      '--disable-infobars',
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-notifications',
      '--disable-extensions',
      '--restore-last-session',

      // Prevent Chromium from opening extra tabs on startup
      '--no-startup-window',
    ],
    ignoreDefaultArgs: [
      '--enable-automation',
      '--enable-blink-features=IdleDetection',
    ],
  });

  // Reuse the single tab — never call browser.newPage()
  const pages = await browser.pages();
  const page  = pages.length ? pages[0] : await browser.newPage();

  // Extra stealth on top of the plugin
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver',  { get: () => undefined });
    Object.defineProperty(navigator, 'plugins',    { get: () => [1,2,3,4,5] });
    Object.defineProperty(navigator, 'languages',  { get: () => ['en-US','en'] });
    // Wipe CDP canary keys
    Object.getOwnPropertyNames(window)
      .filter(k => k.startsWith('cdc_'))
      .forEach(k => { try { delete window[k]; } catch(_){} });
  });

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/124.0.0.0 Safari/537.36'
  );

  // Kill any extra tabs that try to open
  browser.on('targetcreated', async target => {
    if (target.type() === 'page') {
      try {
        const p = await target.page();
        if (p && p !== page) { await sleep(200); await p.close(); }
      } catch (_) {}
    }
  });

  return { browser, page };
}

// ══════════════════════════════════════════════════════════════════════════════
//  PAGE HELPERS
// ══════════════════════════════════════════════════════════════════════════════
async function findInput(page) {
  for (const sel of [
    'div[role="textbox"]',
    'rich-textarea div[contenteditable="true"]',
    'div[contenteditable="true"]',
    'textarea',
  ]) {
    try { if (await page.$(sel)) return sel; } catch (_) {}
  }
  return null;
}

async function waitInput(page, label) {
  const t = Date.now();
  while (Date.now() - t < 90000) {
    const s = await findInput(page);
    if (s) { process.stdout.write('\n'); return s; }
    process.stdout.write(`\r  [${label}] waiting for input box...`);
    await sleep(2000);
  }
  throw new Error(`[${label}] no input box after 90s — are you logged in?`);
}

async function paste(page, sel, text) {
  await page.click(sel);
  await sleep(400);
  // Clear
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await sleep(100);
  await page.keyboard.press('Backspace');
  await sleep(200);
  // Paste via clipboard
  const ok = await page.evaluate(async t => {
    try { await navigator.clipboard.writeText(t); return true; }
    catch (_) { return false; }
  }, text);
  if (ok) {
    await page.keyboard.down('Control');
    await page.keyboard.press('v');
    await page.keyboard.up('Control');
  } else {
    await page.evaluate(t => document.execCommand('insertText', false, t), text);
  }
  await sleep(400);
}

async function send(page, sel, text, label) {
  console.log(`\n[${label}] ► "${text.slice(0,110).replace(/\n/g,' ')}${text.length>110?'…':''}"`);
  await paste(page, sel, text);
  await randSleep(500, 900);
  await page.keyboard.press('Enter');
  console.log(`[${label}] ✓ sent`);
}

async function waitDone(page, label) {
  await sleep(4000);
  const t = Date.now();
  let d = 0;
  while (Date.now() - t < 120000) {
    const busy = await page.evaluate(() =>
      !!document.querySelector(
        'button[aria-label*="Stop"], button[aria-label*="stop"], ' +
        'mat-icon[fonticon="stop_circle"], .stop-button'
      )
    ).catch(() => false);
    if (!busy) break;
    if (d++ % 16 === 0) process.stdout.write(`\n[${label}] generating`);
    else process.stdout.write('.');
    await sleep(1800);
  }
  console.log(`\n[${label}] ✓ done`);
  await sleep(2500);
}

async function latestTask(page) {
  try {
    return await page.evaluate(() => {
      const m = [...(document.body.innerText||'')
        .matchAll(/\[\[\[AUTOTASK\]\]\]:\s*"(.*?)"/g)];
      return m.length ? m[m.length-1][1] : null;
    });
  } catch (_) { return null; }
}

async function latestResponse(page) {
  try {
    return await page.evaluate(() => {
      const els = document.querySelectorAll(
        'message-content,[data-message-author-role="model"],.model-response-text'
      );
      return els.length
        ? els[els.length-1].innerText
        : (document.body.innerText||'').slice(-3000);
    });
  } catch (_) { return ''; }
}

async function freshChat(page, label) {
  console.log(`\n[${label}] 🔄 fresh chat to reset rate limit…`);
  await page.goto('https://gemini.google.com/app',
    { waitUntil:'domcontentloaded', timeout:30000 }).catch(()=>{});
  await sleep(4000);
}

// ══════════════════════════════════════════════════════════════════════════════
//  THINKER
// ══════════════════════════════════════════════════════════════════════════════
const log = [];

async function think(tPage, task, builderResp, stuck) {
  console.log('\n🧠 thinker generating…');
  if (builderResp) log.push({ r:'BUILDER', t:builderResp.slice(0,500) });
  const history = log.slice(-5).map(e=>`[${e.r}]: ${e.t}`).join('\n\n');

  const prompt = stuck
    ? `Builder is STUCK on: "${task}"
Project: ${PROJECT.name} | ${PROJECT.stack}
History:\n${history}

Write a blunt prompt forcing it to:
1. Stop looping and decide NOW
2. Write the specific next file with FULL real code
3. End with [[[AUTOTASK]]]: "..."
Output ONLY the prompt — no preamble.`

    : `Project manager role.
Project: ${PROJECT.name} | Stack: ${PROJECT.stack}
Builder's next task: "${task}"
History:\n${history}

Write follow-up prompt (max 160 words):
- Name exact file/function to implement
- Demand complete working code, no placeholders
- Reference prior work if possible
- Do NOT add [[[AUTOTASK]]] — builder does that
Output ONLY the prompt text — no intro.`;

  const sel = await waitInput(tPage, 'THINKER');
  await send(tPage, sel, prompt, 'THINKER');
  await waitDone(tPage, 'THINKER');

  const thought = (await latestResponse(tPage))?.trim() || '';
  console.log(`\n💭 "${thought.slice(0,130)}…"`);
  log.push({ r:'THINKER', t:thought.slice(0,500) });
  return thought;
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════════════════════════════════════
(async () => {
  console.log('═══════════════════════════════════════════════════');
  console.log(`  BUILDER left 0–${HALF_W}px  |  THINKER right ${HALF_W}–${SCREEN_W}px`);
  console.log(`  Each window: ${HALF_W} × ${SCREEN_H}px`);
  console.log('═══════════════════════════════════════════════════\n');

  console.log('Launching BUILDER (left)…');
  const { browser:bB, page:bP } = await launchWindow('gemini_builder_profile', 0);

  console.log('Launching THINKER (right)…');
  const { browser:tB, page:tP } = await launchWindow('gemini_thinker_profile', HALF_W);

  bB.on('disconnected', () => { console.log('Builder closed.'); process.exit(0); });
  tB.on('disconnected', () => { console.log('Thinker closed.'); process.exit(0); });

  console.log('\nNavigating to Gemini…');
  await Promise.all([
    bP.goto('https://gemini.google.com/app', { waitUntil:'domcontentloaded', timeout:60000 }),
    tP.goto('https://gemini.google.com/app', { waitUntil:'domcontentloaded', timeout:60000 }),
  ]);

  console.log('\n⚠  Log in to BOTH windows if needed. Waiting 20s…\n');
  await sleep(20000);

  // Prime thinker
  const tSel = await waitInput(tP, 'THINKER');
  await send(tP, tSel,
    `You are a project manager AI. When I give you context reply with ONLY the ` +
    `next prompt to send the builder — no intro, no explanation.\n` +
    `Project: ${PROJECT.name} | Stack: ${PROJECT.stack}`,
    'THINKER');
  await waitDone(tP, 'THINKER');

  // Kick off builder
  const kickoff =
`Project: ${PROJECT.name}
Stack: ${PROJECT.stack}
Features:\n${PROJECT.bigThree.join('\n')}
Goal: ${PROJECT.goal}

RULES — every single response must follow these:
- Output REAL complete code — no placeholders, no "I would…"
- Never ask questions — make assumptions and build
- End with EXACTLY: [[[AUTOTASK]]]: "specific next task"
- Never repeat the same task

Start: scaffold the full project with real file contents now.`;

  log.push({ r:'USER', t:kickoff.slice(0,500) });
  const bSel = await waitInput(bP, 'BUILDER');
  await send(bP, bSel, kickoff, 'BUILDER');
  await waitDone(bP, 'BUILDER');

  let prevTask  = '';
  let sameCount = 0;
  let exchanges = 0;
  let loop      = 0;

  while (true) {
    try {
      if (bP.isClosed() || tP.isClosed()) break;
      loop++;

      const task = await latestTask(bP);
      const resp = await latestResponse(bP);

      if (task && task !== prevTask) {
        sameCount = 0; prevTask = task; exchanges++;

        console.log(`\n${'─'.repeat(55)}`);
        console.log(`Loop ${loop} | Exchange ${exchanges}`);
        console.log(`TASK: "${task}"`);
        console.log('─'.repeat(55));

        if (exchanges > 1 && exchanges % RESET_AFTER === 0) {
          await freshChat(bP, 'BUILDER');
          const s = await waitInput(bP, 'BUILDER');
          await send(bP, s,
            `Continuing: ${PROJECT.name} (${PROJECT.stack}).\n` +
            `Last task: "${task}"\nContinue — real code, end with [[[AUTOTASK]]]: "…"`,
            'BUILDER');
          await waitDone(bP, 'BUILDER');
          continue;
        }

        const thought = await think(tP, task, resp, false);
        await randSleep(...DELAY);
        const s = await waitInput(bP, 'BUILDER');
        log.push({ r:'PROMPT', t:thought.slice(0,500) });
        await send(bP, s, thought, 'BUILDER');
        await waitDone(bP, 'BUILDER');

      } else if (task && task === prevTask) {
        sameCount++;
        console.log(`\n[Loop ${loop}] ⚠ same task ×${sameCount}`);
        if (sameCount >= STUCK_MAX) {
          sameCount = 0;
          const unstick = await think(tP, task, resp, true);
          await randSleep(4000, 7000);
          const s = await waitInput(bP, 'BUILDER');
          await send(bP, s, unstick, 'BUILDER');
          await waitDone(bP, 'BUILDER');
        } else {
          await randSleep(5000, 9000);
        }

      } else {
        process.stdout.write(`\r[Loop ${loop}] waiting for [[[AUTOTASK]]] tag…`);
        await randSleep(4000, 6000);
      }

    } catch (err) {
      console.log(`\nError: ${err.message}\nRecovering in 6s…`);
      await sleep(6000);
    }
  }

  await bB.close();
  await tB.close();
})();