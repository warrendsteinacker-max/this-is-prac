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





















// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs';
// import puppeteer from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// puppeteer.use(StealthPlugin());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname  = path.dirname(__filename);

// // ══════════════════════════════════════════════════════════════════════════════
// //  ★  YOUR PROJECT
// // ══════════════════════════════════════════════════════════════════════════════
// const PROJECT = {
//   name:     'Gemini Puppeteer Automation Bot',
//   stack:    'Node.js, Puppeteer, puppeteer-extra-plugin-stealth',
//   bigThree: [
//     '1. Auto-detect and type into Gemini chat input',
//     '2. Parse [[[AUTOTASK]]] tags and reply automatically',
//     '3. Detect stuck loops and self-correct',
//   ],
//   goal: 'Fully automated bot that drives a Gemini conversation producing real code each loop',
// };

// // ══════════════════════════════════════════════════════════════════════════════
// //  ★  SCREEN — right-click desktop → Display Settings → Resolution
// // ══════════════════════════════════════════════════════════════════════════════
// const SCREEN_W = 1366;
// const SCREEN_H = 768;
// const HALF_W   = Math.floor(SCREEN_W / 2);

// const RESET_AFTER = 6;      // open fresh chat every N exchanges
// const STUCK_MAX   = 3;      // same-task repeats before unstick fires
// const DELAY       = [5000, 9000]; // random human-pace delay before each send (ms)

// const sleep     = ms       => new Promise(r => setTimeout(r, ms));
// const randSleep = (lo, hi) => sleep(lo + Math.random() * (hi - lo));

// // ─── Lock file cleanup ────────────────────────────────────────────────────────
// function clearLocks(dir) {
//   for (const f of ['SingletonLock', 'SingletonCookie', 'SingletonSocket']) {
//     try { fs.unlinkSync(path.join(dir, f)); } catch (_) {}
//   }
// }

// // ══════════════════════════════════════════════════════════════════════════════
// //  LAUNCH
// //  — uses puppeteer's bundled Chromium (no executablePath = no handshake timeout)
// //  — stealth plugin removes all automation signals
// //  — window placed exactly at xPos
// // ══════════════════════════════════════════════════════════════════════════════
// async function launchWindow(profileName, xPos) {
//   const userDataDir = path.join(__dirname, profileName);
//   if (fs.existsSync(userDataDir)) clearLocks(userDataDir);
//   else fs.mkdirSync(userDataDir, { recursive: true });

//   const browser = await puppeteer.launch({
//     headless:        false,
//     // NO executablePath — use bundled Chromium to avoid the 30s handshake timeout
//     // Stealth plugin handles the bot-signal removal instead
//     userDataDir,
//     defaultViewport: null,
//     protocolTimeout: 120000,   // give Chrome 2 min to respond (was 30s default)
//     timeout:         120000,   // launch timeout

//     args: [
//       `--window-size=${HALF_W},${SCREEN_H}`,
//       `--window-position=${xPos},0`,

//       '--no-first-run',
//       '--no-default-browser-check',
//       '--noerrdialogs',
//       '--disable-infobars',
//       '--disable-blink-features=AutomationControlled',
//       '--no-sandbox',
//       '--disable-setuid-sandbox',
//       '--disable-dev-shm-usage',
//       '--disable-gpu',
//       '--disable-notifications',
//       '--disable-extensions',
//       '--restore-last-session',

//       // Prevent Chromium from opening extra tabs on startup
//       '--no-startup-window',
//     ],
//     ignoreDefaultArgs: [
//       '--enable-automation',
//       '--enable-blink-features=IdleDetection',
//     ],
//   });

//   // Reuse the single tab — never call browser.newPage()
//   const pages = await browser.pages();
//   const page  = pages.length ? pages[0] : await browser.newPage();

//   // Extra stealth on top of the plugin
//   await page.evaluateOnNewDocument(() => {
//     Object.defineProperty(navigator, 'webdriver',  { get: () => undefined });
//     Object.defineProperty(navigator, 'plugins',    { get: () => [1,2,3,4,5] });
//     Object.defineProperty(navigator, 'languages',  { get: () => ['en-US','en'] });
//     // Wipe CDP canary keys
//     Object.getOwnPropertyNames(window)
//       .filter(k => k.startsWith('cdc_'))
//       .forEach(k => { try { delete window[k]; } catch(_){} });
//   });

//   await page.setUserAgent(
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
//     'AppleWebKit/537.36 (KHTML, like Gecko) ' +
//     'Chrome/124.0.0.0 Safari/537.36'
//   );

//   // Kill any extra tabs that try to open
//   browser.on('targetcreated', async target => {
//     if (target.type() === 'page') {
//       try {
//         const p = await target.page();
//         if (p && p !== page) { await sleep(200); await p.close(); }
//       } catch (_) {}
//     }
//   });

//   return { browser, page };
// }

// // ══════════════════════════════════════════════════════════════════════════════
// //  PAGE HELPERS
// // ══════════════════════════════════════════════════════════════════════════════
// async function findInput(page) {
//   for (const sel of [
//     'div[role="textbox"]',
//     'rich-textarea div[contenteditable="true"]',
//     'div[contenteditable="true"]',
//     'textarea',
//   ]) {
//     try { if (await page.$(sel)) return sel; } catch (_) {}
//   }
//   return null;
// }

// async function waitInput(page, label) {
//   const t = Date.now();
//   while (Date.now() - t < 90000) {
//     const s = await findInput(page);
//     if (s) { process.stdout.write('\n'); return s; }
//     process.stdout.write(`\r  [${label}] waiting for input box...`);
//     await sleep(2000);
//   }
//   throw new Error(`[${label}] no input box after 90s — are you logged in?`);
// }

// async function paste(page, sel, text) {
//   await page.click(sel);
//   await sleep(400);
//   // Clear
//   await page.keyboard.down('Control');
//   await page.keyboard.press('a');
//   await page.keyboard.up('Control');
//   await sleep(100);
//   await page.keyboard.press('Backspace');
//   await sleep(200);
//   // Paste via clipboard
//   const ok = await page.evaluate(async t => {
//     try { await navigator.clipboard.writeText(t); return true; }
//     catch (_) { return false; }
//   }, text);
//   if (ok) {
//     await page.keyboard.down('Control');
//     await page.keyboard.press('v');
//     await page.keyboard.up('Control');
//   } else {
//     await page.evaluate(t => document.execCommand('insertText', false, t), text);
//   }
//   await sleep(400);
// }

// async function send(page, sel, text, label) {
//   console.log(`\n[${label}] ► "${text.slice(0,110).replace(/\n/g,' ')}${text.length>110?'…':''}"`);
//   await paste(page, sel, text);
//   await randSleep(500, 900);
//   await page.keyboard.press('Enter');
//   console.log(`[${label}] ✓ sent`);
// }

// async function waitDone(page, label) {
//   await sleep(4000);
//   const t = Date.now();
//   let d = 0;
//   while (Date.now() - t < 120000) {
//     const busy = await page.evaluate(() =>
//       !!document.querySelector(
//         'button[aria-label*="Stop"], button[aria-label*="stop"], ' +
//         'mat-icon[fonticon="stop_circle"], .stop-button'
//       )
//     ).catch(() => false);
//     if (!busy) break;
//     if (d++ % 16 === 0) process.stdout.write(`\n[${label}] generating`);
//     else process.stdout.write('.');
//     await sleep(1800);
//   }
//   console.log(`\n[${label}] ✓ done`);
//   await sleep(2500);
// }

// async function latestTask(page) {
//   try {
//     return await page.evaluate(() => {
//       const m = [...(document.body.innerText||'')
//         .matchAll(/\[\[\[AUTOTASK\]\]\]:\s*"(.*?)"/g)];
//       return m.length ? m[m.length-1][1] : null;
//     });
//   } catch (_) { return null; }
// }

// async function latestResponse(page) {
//   try {
//     return await page.evaluate(() => {
//       const els = document.querySelectorAll(
//         'message-content,[data-message-author-role="model"],.model-response-text'
//       );
//       return els.length
//         ? els[els.length-1].innerText
//         : (document.body.innerText||'').slice(-3000);
//     });
//   } catch (_) { return ''; }
// }

// async function freshChat(page, label) {
//   console.log(`\n[${label}] 🔄 fresh chat to reset rate limit…`);
//   await page.goto('https://gemini.google.com/app',
//     { waitUntil:'domcontentloaded', timeout:30000 }).catch(()=>{});
//   await sleep(4000);
// }

// // ══════════════════════════════════════════════════════════════════════════════
// //  THINKER
// // ══════════════════════════════════════════════════════════════════════════════
// const log = [];

// async function think(tPage, task, builderResp, stuck) {
//   console.log('\n🧠 thinker generating…');
//   if (builderResp) log.push({ r:'BUILDER', t:builderResp.slice(0,500) });
//   const history = log.slice(-5).map(e=>`[${e.r}]: ${e.t}`).join('\n\n');

//   const prompt = stuck
//     ? `Builder is STUCK on: "${task}"
// Project: ${PROJECT.name} | ${PROJECT.stack}
// History:\n${history}

// Write a blunt prompt forcing it to:
// 1. Stop looping and decide NOW
// 2. Write the specific next file with FULL real code
// 3. End with [[[AUTOTASK]]]: "..."
// Output ONLY the prompt — no preamble.`

//     : `Project manager role.
// Project: ${PROJECT.name} | Stack: ${PROJECT.stack}
// Builder's next task: "${task}"
// History:\n${history}

// Write follow-up prompt (max 160 words):
// - Name exact file/function to implement
// - Demand complete working code, no placeholders
// - Reference prior work if possible
// - Do NOT add [[[AUTOTASK]]] — builder does that
// Output ONLY the prompt text — no intro.`;

//   const sel = await waitInput(tPage, 'THINKER');
//   await send(tPage, sel, prompt, 'THINKER');
//   await waitDone(tPage, 'THINKER');

//   const thought = (await latestResponse(tPage))?.trim() || '';
//   console.log(`\n💭 "${thought.slice(0,130)}…"`);
//   log.push({ r:'THINKER', t:thought.slice(0,500) });
//   return thought;
// }

// // ══════════════════════════════════════════════════════════════════════════════
// //  MAIN
// // ══════════════════════════════════════════════════════════════════════════════
// (async () => {
//   console.log('═══════════════════════════════════════════════════');
//   console.log(`  BUILDER left 0–${HALF_W}px  |  THINKER right ${HALF_W}–${SCREEN_W}px`);
//   console.log(`  Each window: ${HALF_W} × ${SCREEN_H}px`);
//   console.log('═══════════════════════════════════════════════════\n');

//   console.log('Launching BUILDER (left)…');
//   const { browser:bB, page:bP } = await launchWindow('gemini_builder_profile', 0);

//   console.log('Launching THINKER (right)…');
//   const { browser:tB, page:tP } = await launchWindow('gemini_thinker_profile', HALF_W);

//   bB.on('disconnected', () => { console.log('Builder closed.'); process.exit(0); });
//   tB.on('disconnected', () => { console.log('Thinker closed.'); process.exit(0); });

//   console.log('\nNavigating to Gemini…');
//   await Promise.all([
//     bP.goto('https://gemini.google.com/app', { waitUntil:'domcontentloaded', timeout:60000 }),
//     tP.goto('https://gemini.google.com/app', { waitUntil:'domcontentloaded', timeout:60000 }),
//   ]);

//   console.log('\n⚠  Log in to BOTH windows if needed. Waiting 20s…\n');
//   await sleep(20000);

//   // Prime thinker
//   const tSel = await waitInput(tP, 'THINKER');
//   await send(tP, tSel,
//     `You are a project manager AI. When I give you context reply with ONLY the ` +
//     `next prompt to send the builder — no intro, no explanation.\n` +
//     `Project: ${PROJECT.name} | Stack: ${PROJECT.stack}`,
//     'THINKER');
//   await waitDone(tP, 'THINKER');

//   // Kick off builder
//   const kickoff =
// `Project: ${PROJECT.name}
// Stack: ${PROJECT.stack}
// Features:\n${PROJECT.bigThree.join('\n')}
// Goal: ${PROJECT.goal}

// RULES — every single response must follow these:
// - Output REAL complete code — no placeholders, no "I would…"
// - Never ask questions — make assumptions and build
// - End with EXACTLY: [[[AUTOTASK]]]: "specific next task"
// - Never repeat the same task

// Start: scaffold the full project with real file contents now.`;

//   log.push({ r:'USER', t:kickoff.slice(0,500) });
//   const bSel = await waitInput(bP, 'BUILDER');
//   await send(bP, bSel, kickoff, 'BUILDER');
//   await waitDone(bP, 'BUILDER');

//   let prevTask  = '';
//   let sameCount = 0;
//   let exchanges = 0;
//   let loop      = 0;

//   while (true) {
//     try {
//       if (bP.isClosed() || tP.isClosed()) break;
//       loop++;

//       const task = await latestTask(bP);
//       const resp = await latestResponse(bP);

//       if (task && task !== prevTask) {
//         sameCount = 0; prevTask = task; exchanges++;

//         console.log(`\n${'─'.repeat(55)}`);
//         console.log(`Loop ${loop} | Exchange ${exchanges}`);
//         console.log(`TASK: "${task}"`);
//         console.log('─'.repeat(55));

//         if (exchanges > 1 && exchanges % RESET_AFTER === 0) {
//           await freshChat(bP, 'BUILDER');
//           const s = await waitInput(bP, 'BUILDER');
//           await send(bP, s,
//             `Continuing: ${PROJECT.name} (${PROJECT.stack}).\n` +
//             `Last task: "${task}"\nContinue — real code, end with [[[AUTOTASK]]]: "…"`,
//             'BUILDER');
//           await waitDone(bP, 'BUILDER');
//           continue;
//         }

//         const thought = await think(tP, task, resp, false);
//         await randSleep(...DELAY);
//         const s = await waitInput(bP, 'BUILDER');
//         log.push({ r:'PROMPT', t:thought.slice(0,500) });
//         await send(bP, s, thought, 'BUILDER');
//         await waitDone(bP, 'BUILDER');

//       } else if (task && task === prevTask) {
//         sameCount++;
//         console.log(`\n[Loop ${loop}] ⚠ same task ×${sameCount}`);
//         if (sameCount >= STUCK_MAX) {
//           sameCount = 0;
//           const unstick = await think(tP, task, resp, true);
//           await randSleep(4000, 7000);
//           const s = await waitInput(bP, 'BUILDER');
//           await send(bP, s, unstick, 'BUILDER');
//           await waitDone(bP, 'BUILDER');
//         } else {
//           await randSleep(5000, 9000);
//         }

//       } else {
//         process.stdout.write(`\r[Loop ${loop}] waiting for [[[AUTOTASK]]] tag…`);
//         await randSleep(4000, 6000);
//       }

//     } catch (err) {
//       console.log(`\nError: ${err.message}\nRecovering in 6s…`);
//       await sleep(6000);
//     }
//   }

//   await bB.close();
//   await tB.close();
// })();







// create a assigment summary given the SOURCE_PAGES and text make parthentical source (date) words "word for word text" (). and narrative apa 7th eddition citations source (data) metion cahpter and section or page num



//////two ai

// import puppeteer from "puppeteer";

// // ╔════════════════════════════════════════════════════════════╗
// // ║   STEP 1 — PASTE YOUR ASSIGNMENT DIRECTIONS HERE          ║
// // ╚════════════════════════════════════════════════════════════╝

// const ASSIGNMENT_DIRECTIONS = `
// create a assigment summary for this topic soclia studies given the SOURCE_PAGES and text make parthentical source (date) words "word for word text" (). and narrative apa 7th eddition citations source (data) metion cahpter and section or page num

// `;

// // ╔════════════════════════════════════════════════════════════╗
// // ║   STEP 2 — PASTE YOUR SOURCE TEXT / PAGES HERE           ║
// // ║                                                            ║
// // ║   Fill in every field for each block.                    ║
// // ║   The PAGE / CHAPTER / SECTION fields are what gets      ║
// // ║   used inside the parenthetical citation ().             ║
// // ║                                                            ║
// // ║   Add as many --- blocks as you need.                    ║
// // ╚════════════════════════════════════════════════════════════╝

// const SOURCE_PAGES = `
// ---
// AUTHOR: Common Core State Standards Initiative
// DATE: 2010
// PAGE: 10
// CHAPTER: Chapter 1 — College and Career Readiness Anchor Standards
// SECTION: Section 1 — Reading Standards K-12

// EXACT TEXT:
// The CCR and grade-specific standards are necessary complements—the former providing broad standards, the latter providing additional specificity—that together define the skills and understandings that all students must demonstrate.

// Read closely to determine what the text says explicitly and to make logical inferences from it; cite specific textual evidence when writing or speaking to support conclusions drawn from the text.

// Assess how point of view or purpose shapes the content and style of a text.

// To build a foundation for college and career readiness, students must read widely and deeply from among a broad range of high-quality, increasingly challenging literary and informational texts.

// Students also acquire the habits of reading independently and closely, which are essential to their future success.
// ---

// ---
// AUTHOR: Smith, J.
// DATE: 2024
// PAGE: 53
// CHAPTER: Chapter 6 — Vocabulary Acquisition and Use
// SECTION: Section 2 — Greek and Latin Roots

// EXACT TEXT:
// This analysis table examines the diagnostic literacy data of Mary, a 6th-grade general education student receiving Tier 2 intervention support. Decoding is Mary's greatest area of need and the root cause of her challenges in the other two areas.

// Mary's decoding scores are the weakest across the entire profile, with Greek and Latin Roots at 40%, Multisyllabic Words at 50%, and Vowel Teams at 48%. These deficits directly affect her fluency, which falls well below the 6th-grade benchmark of 120-140 WPM at only 95-100 WPM, with expression at just 45%.

// Mary's greatest strength is her literal comprehension, which scored at 82%. This strength becomes the instructional bridge.

// The three recommended strategies, a Morpheme Wall, Word Surgery with color-coded breakdown, and vocabulary games, aligned with L.6.4b, which are designed to build the decoding awareness Mary needs while connecting to her existing strengths. Together, these approaches reflect data-informed and standard-aligned instruction that meets Mary where she is and moves her toward grade-level independence.
// ---
// `;

// // ════════════════════════════════════════════════════════════
// // Everything below runs automatically — do not edit.
// // ════════════════════════════════════════════════════════════

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// function buildFirstPrompt() {
//   return `You are completing an assignment. Here are your directions and all source material.

// ${"=".repeat(50)}
// ASSIGNMENT DIRECTIONS:
// ${"=".repeat(50)}
// ${ASSIGNMENT_DIRECTIONS.trim()}

// ${"=".repeat(50)}
// SOURCE TEXT — USE THIS FOR ALL CITATIONS:
// ${"=".repeat(50)}
// ${SOURCE_PAGES.trim()}

// ${"=".repeat(50)}
// CITATION RULES — FOLLOW EVERY ONE EXACTLY:
// ${"=".repeat(50)}

// ━━ PARENTHETICAL CITATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Format: "word for word text from source" (p. #).
//      or "word for word text from source" (Chapter X).
//      or "word for word text from source" (Section X).

// Use whichever of PAGE / CHAPTER / SECTION is listed in the
// source block the text came from.

// CORRECT:
//   "decoding is Mary's greatest area of need" (p. 53).
//   "students must read widely and deeply" (p. 10).

// RULES:
// 1. Text inside the quotes must be copied EXACTLY word for word
//    from the EXACT TEXT in the source block — nothing changed.

// 2. The period that ends the sentence goes AFTER the closing
//    parenthesis — NEVER inside the quotes.
//    CORRECT: "word for word text" (p. 53).
//    WRONG:   "word for word text." (p. 53).
//    WRONG:   "word for word text."

// 3. Every quote MUST be followed immediately by a citation reference.
//    A quote with nothing after it is always wrong.
//    WRONG: "is her literal comprehension, which scored at 82%."
//    WRONG: "is her literal comprehension, which scored at 82%"
//    RIGHT: "is her literal comprehension, which scored at 82%" (p. 53).
//    If you cannot immediately follow a quote with (p. #) or (Chapter X)
//    or (Section X) — do not use the quote. Write your own sentence instead.

// 3. Do NOT use filler connector words immediately before the opening quote.
//    WRONG: rate of "word for word text" (p. 53).
//    WRONG: a "word for word text" (p. 53).
//    WRONG: such as "word for word text" (p. 53).
//    RIGHT: "word for word text" (p. 53).

//    A word pulled OUT of the source text sitting before the quote is CORRECT
//    and is NOT a violation — this is the intended format:
//    CORRECT: decoding "is Mary's greatest area of need" (p. 53).
//    CORRECT: Mary's greatest strength "is her literal comprehension" (p. 53).
//    Normal sentence verbs before a quote are also fine:
//    CORRECT: The data shows "word for word text" (p. 53).

// 4. No empty quotes ever.
//    WRONG: "" (p. 53).
//    WRONG: "" ().
//    If you think about writing empty quotes — drop the citation
//    and write your own sentence instead.

// 5. If the word-for-word text from the source starts with a capital letter,
//    pull that first word OUT of the quotes, lowercase it, and blend it into
//    your sentence. The opening quote then starts on the second word.

//    SOURCE TEXT:  Decoding is Mary's greatest area of need
//    CORRECT:      decoding "is Mary's greatest area of need" (p. 53).
//    WRONG:        "Decoding is Mary's greatest area of need" (p. 53).

//    SOURCE TEXT:  The CCR and grade-specific standards are necessary complements
//    CORRECT:      the CCR "and grade-specific standards are necessary complements" (p. 10).
//    WRONG:        "The CCR and grade-specific standards are necessary complements" (p. 10).

//    SOURCE TEXT:  Mary's greatest strength is her literal comprehension
//    CORRECT:      Mary's greatest strength "is her literal comprehension" (p. 53).
//    WRONG:        "Mary's greatest strength is her literal comprehension" (p. 53).

//    If the source text already starts with a lowercase word the quote
//    can open directly on that word — no change needed.
//    SOURCE TEXT:  students must read widely and deeply
//    CORRECT:      "students must read widely and deeply" (p. 10).

// 6. NEVER put quotes around a word or phrase unless it is a full
//    parenthetical citation with a page/chapter/section reference.
//    Quotes used for emphasis or stylistic reasons are not allowed.
//    WRONG: educators use "Word Surgery" to build skills.
//    WRONG: this is called "close reading" in the standards.
//    If you want to highlight a term — just write it without quotes.
//    CORRECT: educators use Word Surgery to build skills.

// ━━ NARRATIVE CITATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Format: According to Author (date), from Chapter X in Section X
//         on page #, the text explains that...

// CORRECT:
//   According to Smith (2024), from Chapter 6 in Section 2 on
//   page 53, the data reveals that students benefit from...

//   As noted by the Common Core State Standards Initiative (2010),
//   found in Chapter 1 Section 1 on page 10, students must...

// RULES:
// 5. Author and date go in the narrative citation parentheses: (date).
//    Author name is written in the sentence before the parentheses.

// 6. Chapter, section, and page are mentioned NATURALLY in the
//    sentence after the (date) — NEVER inside the parentheses.
//    CORRECT: According to Smith (2024), from Chapter 6 in Section 2, ...
//    WRONG:   According to Smith (2024, Chapter 6, Section 2), ...

// 7. Every narrative citation must mention where in the source the
//    information came from — chapter, section, or page — naturally
//    in the sentence.

// ━━ IF IN DOUBT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// If you are unsure about the format of any citation — drop it
// entirely and write your own plain sentence instead. A missing
// citation is better than a wrong one.

// Now complete the assignment following all rules above.`;
// }

// // ─── CITATION SCANNER ────────────────────────────────────────────────────────
// function scanCitations(text) {
//   const violations = [];
//   let m;

//   // VIOLATION 1a — period INSIDE the closing quote when citation follows
//   // BAD: "word for word text." (p. 53).
//   const r1a = /"([^"]+?)\."\s*\((?:p\.\s*\d+|Chapter[^)]+|Section[^)]+)\)/g;
//   while ((m = r1a.exec(text)) !== null) {
//     violations.push({
//       rule: 1,
//       bad: m[0],
//       detail: `Period is inside the closing quote — must go AFTER the closing parenthesis. CORRECT: "word for word text" (p. #).`,
//     });
//   }

//   // VIOLATION 1b — period INSIDE the closing quote with NO citation following at all
//   // BAD: "is her literal comprehension, which scored at 82%."
//   // This catches quotes that end with ." and have no (p. #) or (Chapter) or (Section) after them
//   const r1b = /"([^"]{5,}?)\."\s*(?!\s*\((?:p\.|Chapter|Section))/g;
//   while ((m = r1b.exec(text)) !== null) {
//     violations.push({
//       rule: 1,
//       bad: m[0].trim(),
//       detail: `Two violations: (1) period is inside the closing quote — must go outside. (2) This quote has no citation reference after it — must be followed by (p. #) or (Chapter X) or (Section X). Fix: remove the citation entirely and write your own plain sentence instead.`,
//     });
//   }

//   // VIOLATION 2 — empty quotes in citation
//   // BAD: "" (p. 53) or "" ()
//   const r2 = /""\s*\((?:p\.\s*\d+|Chapter[^)]*|Section[^)]*)?\)/g;
//   while ((m = r2.exec(text)) !== null) {
//     violations.push({
//       rule: 2,
//       bad: m[0],
//       detail: `Empty quotes — must contain real word-for-word text from the source. Drop this citation and write your own sentence.`,
//     });
//   }

//   // VIOLATION 3 — glue words before opening quote tied to citation
//   // Only flag known connecting/filler words that are NOT part of the source text.
//   // Words pulled OUT of the source (like "decoding", "Mary's greatest strength")
//   // are the CORRECT format and must NEVER be flagged.
//   //
//   // BAD — filler connectors:  rate of "text" (p. 53)
//   //                           a "text" (p. 53)
//   //                           such as "text" (p. 53)
//   //                           known as "text" (p. 53)
//   //
//   // CORRECT — pulled source word: decoding "is Mary's greatest area" (p. 53)
//   // CORRECT — sentence verb:      The data shows "text" (p. 53)
//   //
//   // Only flag a small list of known filler/connector glue patterns
//   const knownGlue = [
//     /\brate of\s+"/g,
//     /\ba\s+"/g,
//     /\bsuch as\s+"/g,
//     /\bknown as\s+"/g,
//     /\breferred to as\s+"/g,
//     /\bcalled\s+"/g,
//     /\btermed\s+"/g,
//     /\bof\s+"/g,
//     /\bthe concept of\s+"/g,
//     /\bin\s+"/g,
//   ];
//   for (const pattern of knownGlue) {
//     const glueRe = new RegExp(pattern.source + '([^"]{3,}?)"\\s*\\((?:p\\.\\s*\\d+|Chapter[^)]+|Section[^)]+)\\)', 'g');
//     while ((m = glueRe.exec(text)) !== null) {
//       violations.push({
//         rule: 3,
//         bad: m[0].trim(),
//         detail: `Filler connector word before the opening quote — the citation must start with the opening quote or a pulled-out source word. Drop this citation and write your own sentence.`,
//       });
//     }
//   }

//   // VIOLATION 4 — chapter/section crammed INSIDE narrative citation parens
//   // BAD: Smith (2024, Chapter 3, Section 2)
//   const r4 = /([A-Z][a-zA-Z\s]+?)\s*\((\d{4})\s*,\s*(?:Chapter|Ch\.?|chapter|Section|Sec\.?|section)\s*[\d\w]+[^)]*\)/g;
//   while ((m = r4.exec(text)) !== null) {
//     violations.push({
//       rule: 4,
//       bad: m[0],
//       detail: `Chapter and section must NOT go inside the parentheses. CORRECT: According to ${m[1].trim()} (${m[2]}), from Chapter X in Section X on page #, ...`,
//     });
//   }

//   // VIOLATION 5 — narrative citation with no chapter/section/page mentioned nearby
//   // Catches: According to Smith (2024), with no location reference after it
//   const r5 = /According to ([A-Z][^(]+?)\s*\((\d{4})\)\s*,\s*(?!.*?\b(?:chapter|section|page|p\.)\b)/gi;
//   while ((m = r5.exec(text)) !== null) {
//     // Only flag if the next 200 chars have no location reference
//     const after = text.substring(m.index + m[0].length, m.index + m[0].length + 200).toLowerCase();
//     if (!after.match(/\b(chapter|section|page|p\.)\b/)) {
//       violations.push({
//         rule: 5,
//         bad: m[0].trim(),
//         detail: `Narrative citation has no chapter, section, or page referenced in the sentence. Add naturally: According to ${m[1].trim()} (${m[2]}), from Chapter X in Section X on page #, ...`,
//       });
//     }
//   }

//   // VIOLATION 6 — opening quote starts on a capitalized word
//   // First word must be pulled OUT of the quotes and lowercased into the sentence
//   // BAD:  "Decoding is Mary's greatest area of need" (p. 53).
//   // BAD:  "The CCR and grade-specific standards" (p. 10).
//   // GOOD: decoding "is Mary's greatest area of need" (p. 53).
//   // GOOD: the CCR "and grade-specific standards" (p. 10).
//   // OK:   "students must read widely" (p. 10). ← already lowercase
//   const r6 = /"([A-Z][a-zA-Z']+)\s+([^"]{3,}?)"\s*\((?:p\.\s*\d+|Chapter[^)]+|Section[^)]+)\)/g;
//   while ((m = r6.exec(text)) !== null) {
//     const firstWord = m[1];
//     const rest = m[2];
//     violations.push({
//       rule: 6,
//       bad: m[0],
//       detail: `Opening quote starts on capital word "${firstWord}" — pull it out and lowercase it into the sentence: ${firstWord.toLowerCase()} "${rest}..." (p. #).`,
//     });
//   }

//   // VIOLATION 7 — quotes around a word or phrase with NO citation reference after them
//   // BAD: educators use "Word Surgery" to build skills.
//   // BAD: this is called "close reading" in the standards.
//   // GOOD: educators use Word Surgery to build skills.
//   // Only flag short quoted phrases (under 60 chars) with no (p./Chapter/Section) after
//   const r7 = /"([^"]{2,60})"\s*(?!\s*\((?:p\.|Chapter|Section))/g;
//   while ((m = r7.exec(text)) !== null) {
//     // Skip if it looks like dialogue or a full sentence quote (has a verb in it)
//     const inner = m[1].toLowerCase();
//     const hasVerb = /\b(is|are|was|were|has|have|must|should|will|can|does|do|reads|shows|indicates)\b/.test(inner);
//     if (!hasVerb && m[1].length < 60) {
//       violations.push({
//         rule: 7,
//         bad: m[0].trim(),
//         detail: `Quotes around "${m[1]}" with no citation reference — do not use quotes for emphasis or terms. Remove the quotes and write the word or phrase plainly.`,
//       });
//     }
//   }

//   return violations;
// }

// function buildEvidenceReport(violations) {
//   if (!violations.length) return null;
//   let r = `Citation scanner found ${violations.length} violation(s):\n\n`;
//   violations.forEach((v, i) => {
//     r += `VIOLATION ${i + 1} — Rule ${v.rule}\n`;
//     r += `Wrong text:  ${v.bad}\n`;
//     r += `Why wrong:   ${v.detail}\n\n`;
//   });
//   return r;
// }

// const buildReviewerPrompt = (assignment, evidence) => `You are a strict APA 7th Edition citation reviewer.

// ${evidence
//   ? `A scanner already found these violations. Confirm each one, explain why it is wrong, and check for anything else missed.\n\nSCANNER FINDINGS:\n${evidence}`
//   : `The scanner found no violations. Do a thorough manual check yourself.`}

// RULES YOU ARE ENFORCING:

// PARENTHETICAL CITATIONS — format: "word for word text" (p. #).
//   or (Chapter X). or (Section X). — whichever matches the source block.

//   VIOLATION — period inside the closing quote:
//     WRONG: "word for word text." (p. 53).   ← period inside AND citation present
//     WRONG: "word for word text."             ← period inside AND no citation at all
//     RIGHT: "word for word text" (p. 53).

//     The second case is TWO violations at once:
//     (1) period inside the closing quote
//     (2) quote with no citation reference after it
//     Both make it wrong. Fix: remove it entirely, write your own plain sentence.

//   VIOLATION — quote with no citation reference after it:
//     A quote must ALWAYS be followed immediately by (p. #) or (Chapter X) or (Section X).
//     WRONG: Mary's greatest strength "is her literal comprehension, which scored at 82%."
//     WRONG: "word for word text" with nothing after it
//     RIGHT: "word for word text" (p. 53).
//     If a quote has no citation after it — remove it and write your own plain sentence.

//   VIOLATION — empty quotes:
//     WRONG: "" (p. 53). or "" ().

//   VIOLATION — filler connector words before the opening quote:
//     WRONG: rate of "word for word text" (p. 53).
//     WRONG: a "word for word text" (p. 53).
//     WRONG: such as "word for word text" (p. 53).
//     RIGHT: "word for word text" (p. 53).

//     IMPORTANT — these are NOT violations and must NOT be flagged:
//     - A word pulled out of the source text sitting before the quote is CORRECT.
//       decoding "is Mary's greatest area of need" (p. 53). ← CORRECT
//       Mary's greatest strength "is her literal comprehension" (p. 53). ← CORRECT
//     - A normal sentence verb before a quote is CORRECT.
//       The data shows "word for word text" (p. 53). ← CORRECT
//     - Only flag small filler/connector words like: rate of, a, such as,
//       known as, called, referred to as, of — when they appear immediately
//       before the opening quote as connectors with no source meaning.

//   VIOLATION — opening quote starts on a capitalized word:
//     WRONG: "Decoding is Mary's greatest area of need" (p. 53).
//     RIGHT: decoding "is Mary's greatest area of need" (p. 53).
//     WRONG: "The CCR and grade-specific standards" (p. 10).
//     RIGHT: the CCR "and grade-specific standards" (p. 10).
//     The first capital word gets pulled OUT of the quotes, lowercased,
//     and blended into the sentence. The quote opens on the second word.

//   VIOLATION — quotes around a word or phrase with no citation reference:
//     WRONG: educators use "Word Surgery" to build skills.
//     WRONG: this is called "close reading" in the standards.
//     RIGHT: educators use Word Surgery to build skills.
//     Quotes are only allowed when followed by (p. #) or (Chapter X) or (Section X).
//     Any other use of quotes is a violation — remove them and write the word plainly.

// NARRATIVE CITATIONS — format: According to Author (date), from Chapter X
//   in Section X on page #, the sentence continues...

//   VIOLATION — chapter/section/page crammed inside the parentheses:
//     WRONG: According to Smith (2024, Chapter 6, Section 2), ...
//     RIGHT: According to Smith (2024), from Chapter 6 in Section 2, ...

//   VIOLATION — narrative citation with no chapter/section/page in the sentence:
//     WRONG: According to Smith (2024), the data shows...
//     RIGHT: According to Smith (2024), from Chapter 6 in Section 2 on page 53, the data shows...

// FIX FOR ALL VIOLATIONS: remove the citation and replace with plain written text.

// Quote every wrong piece of text exactly. State the fix.

// End with exactly one of:
// OVERALL RESULT: PASS
// OVERALL RESULT: FAIL

// Assignment to review:
// ---
// ${assignment}
// ---`;

// function buildCorrectionPrompt(feedback, violations) {
//   let p = `Your assignment has citation violations. Fix all of them now.\n\n`;
//   if (violations.length) {
//     p += `These exact wrong texts were found:\n\n`;
//     violations.forEach((v, i) => {
//       p += `${i + 1}. WRONG TEXT: ${v.bad}\n`;
//       p += `   WHY WRONG:  ${v.detail}\n`;
//       p += `   FIX:        Remove it. Write your own plain sentence instead.\n\n`;
//     });
//   }
//   p += `Reviewer feedback:\n${feedback}\n\n`;
//   p += `RULES WHEN REWRITING:\n\n`;
//   p += `PARENTHETICAL:\n`;
//   p += `  "word for word text" (p. #).  ← correct\n`;
//   p += `- Period goes AFTER the closing parenthesis — NEVER inside the quotes\n`;
//   p += `  WRONG: "text." (p. 53).   WRONG: "text."   RIGHT: "text" (p. 53).\n`;
//   p += `- Every quote MUST be followed by (p. #) or (Chapter X) or (Section X)\n`;
//   p += `  A quote with nothing after it is wrong — remove it, write your own sentence\n`;
//   p += `  No filler connector words before the opening quote (rate of, a, such as, called)\n`;
//   p += `  A pulled-out source word before the quote IS correct: decoding "is Mary's greatest area" (p. 53).\n`;
//   p += `  No empty quotes\n\n`;
//   p += `NARRATIVE:\n`;
//   p += `  According to Author (date), from Chapter X in Section X on page #, ...\n`;
//   p += `  Chapter / section / page go in the SENTENCE — NEVER inside the parentheses\n`;
//   p += `  Every narrative citation must say where in the source it came from\n\n`;
//   p += `- If a citation opens on a capitalized word — pull that word OUT of the quotes, lowercase it, and blend it into the sentence\n`;
//   p += `  WRONG: "Decoding is Mary's greatest area of need" (p. 53).\n`;
//   p += `  RIGHT: decoding "is Mary's greatest area of need" (p. 53).\n`;
//   p += `- Never put quotes around a word or phrase unless it is followed by (p. #) or (Chapter X) or (Section X)\n`;
//   p += `  WRONG: educators use "Word Surgery"   RIGHT: educators use Word Surgery\n\n`;
//   p += `Rewrite the full assignment now with every violation fixed.`;
//   return p;
// }

// const FOLLOWUP_PROMPTS = [
//   `Compare every citation in your assignment against the source text. Fix any parenthetical citation where the text inside the quotes is not exactly word for word from the source. Fix any narrative citation that does not mention the chapter, section, or page naturally in the sentence. Also check: if any citation opens on a capitalized word — pull that word OUT of the quotes, lowercase it, and blend it into your sentence so the quote opens on the second word. Example: decoding "is Mary's greatest area of need" (p. 53).`,
//   `Final check on every single quote in the assignment:\n1. If a word or phrase has quotes around it but NO (p. #) or (Chapter) or (Section) after it — remove the quotes entirely and write the word plainly.\n2. If a citation opens on a capitalized word — pull that word out of the quotes, lowercase it, blend into the sentence. The quote opens on the second word.\n3. The period at the end of every parenthetical citation must be AFTER the closing parenthesis — never inside the quotes.\nFix anything that does not match — if unsure drop the citation and write your own sentence.`,
// ];

// // ─── FIND INPUT BOX ───────────────────────────────────────────────────────────
// async function findInput(page, label) {
//   const selectors = [
//     'rich-textarea div[contenteditable="true"]',
//     'div[contenteditable="true"]',
//     'div[role="textbox"]',
//     'textarea',
//     '.ql-editor',
//   ];
//   for (const sel of selectors) {
//     try {
//       const el = await page.$(sel);
//       if (el) {
//         const box = await el.boundingBox();
//         if (box && box.width > 0) {
//           console.log(`  [${label}] Input found: ${sel}`);
//           return { el, sel };
//         }
//       }
//     } catch (_) {}
//   }
//   const html = await page.evaluate(() => document.body.innerHTML.substring(0, 3000));
//   console.error(`  [${label}] ERROR: No input found. Page HTML:\n`, html);
//   throw new Error(`[${label}] Input box not found.`);
// }

// // ─── SEND MESSAGE ─────────────────────────────────────────────────────────────
// async function sendMessage(page, text, label) {
//   const { el, sel } = await findInput(page, label);
//   await el.click();
//   await sleep(400);
//   await page.keyboard.down("Control");
//   await page.keyboard.press("a");
//   await page.keyboard.up("Control");
//   await page.keyboard.press("Backspace");
//   await sleep(200);

//   const ok = await page.evaluate((t, s) => {
//     const el = document.querySelector(s);
//     if (!el) return false;
//     el.focus();
//     return document.execCommand("insertText", false, t);
//   }, text, sel);

//   if (!ok) {
//     await page.evaluate((t, s) => {
//       const el = document.querySelector(s);
//       if (!el) return;
//       el.focus();
//       if (el.contentEditable === "true") {
//         el.innerText = t;
//       } else {
//         Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(el, t);
//       }
//       el.dispatchEvent(new Event("input", { bubbles: true }));
//       el.dispatchEvent(new Event("change", { bubbles: true }));
//     }, text, sel);
//   }

//   await sleep(500);
//   const sendBtn = await page.$('button[aria-label="Send message"], button[aria-label="Submit"], button[jsname="Qx7uuf"]');
//   if (sendBtn) {
//     await sendBtn.click();
//   } else {
//     await page.keyboard.press("Enter");
//   }
//   await sleep(2000);
// }

// // ─── WAIT FOR RESPONSE ────────────────────────────────────────────────────────
// async function waitForResponse(page, label, timeoutMs = 180000) {
//   console.log(`  [${label}] Waiting for response...`);
//   try {
//     await page.waitForFunction(
//       () => !!document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'),
//       { timeout: 15000, polling: 500 }
//     );
//   } catch (_) {}

//   await page.waitForFunction(
//     () => !document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'),
//     { timeout: timeoutMs, polling: 1000 }
//   ).catch(() => {});

//   await sleep(3000);

//   const text = await page.evaluate(() => {
//     const all = [
//       ...document.querySelectorAll("model-response"),
//       ...document.querySelectorAll('[data-message-author-role="model"]'),
//       ...document.querySelectorAll(".model-response-text"),
//       ...document.querySelectorAll("message-content"),
//     ];
//     return all.length ? all[all.length - 1].innerText.trim() : "";
//   });

//   if (!text) console.warn(`  [${label}] WARNING: empty response`);
//   else console.log(`  [${label}] Response received (${text.length} chars)`);
//   return text;
// }

// // ─── MAIN ─────────────────────────────────────────────────────────────────────
// (async () => {
//   console.log("=".repeat(60));
//   console.log("  GEMINI DUAL-AI + CITATION SCANNER");
//   console.log("=".repeat(60));

//   if (ASSIGNMENT_DIRECTIONS.trim() === "PASTE YOUR ASSIGNMENT DIRECTIONS HERE.") {
//     console.warn("⚠️  Fill in ASSIGNMENT_DIRECTIONS at the top of server.js\n");
//   }

//   const launchOptions = {
//     headless: false,
//     executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
//     slowMo: 80,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-blink-features=AutomationControlled",
//       "--start-maximized",
//     ],
//     defaultViewport: null,
//     ignoreDefaultArgs: ["--enable-automation"],
//   };

//   console.log("Opening Worker browser...");
//   const workerBrowser = await puppeteer.launch({
//     ...launchOptions,
//     args: [...launchOptions.args, "--user-data-dir=C:\\Temp\\puppeteer-worker"],
//   });

//   console.log("Opening Reviewer browser...");
//   const reviewerBrowser = await puppeteer.launch({
//     ...launchOptions,
//     args: [...launchOptions.args, "--user-data-dir=C:\\Temp\\puppeteer-reviewer"],
//   });

//   const workerPage = await workerBrowser.newPage();
//   const reviewerPage = await reviewerBrowser.newPage();

//   for (const p of [workerPage, reviewerPage]) {
//     await p.evaluateOnNewDocument(() => {
//       Object.defineProperty(navigator, "webdriver", { get: () => false });
//       window.chrome = { runtime: {} };
//     });
//   }

//   console.log("\nOpening Gemini in both windows...");
//   await workerPage.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
//   await reviewerPage.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
//   await sleep(4000);

//   // If Gemini redirected to sign-in wait for user to sign in manually
//   const needsLogin = [workerPage, reviewerPage].some(p => p.url().includes("accounts.google.com"));
//   if (needsLogin) {
//     console.log("\n" + "!".repeat(60));
//     console.log("  Sign into Google in both windows.");
//     console.log("  Script waits automatically until both land on Gemini.");
//     console.log("!".repeat(60));
//     await Promise.all([
//       workerPage.waitForFunction(() => location.href.includes("gemini.google.com"), { timeout: 120000, polling: 1000 }),
//       reviewerPage.waitForFunction(() => location.href.includes("gemini.google.com"), { timeout: 120000, polling: 1000 }),
//     ]);
//   }

//   console.log("\nWaiting for Gemini input to be ready...");
//   for (const [p, label] of [[workerPage, "WORKER"], [reviewerPage, "REVIEWER"]]) {
//     await p.waitForFunction(
//       () => !!document.querySelector('rich-textarea div[contenteditable="true"], div[contenteditable="true"], div[role="textbox"], textarea'),
//       { timeout: 30000, polling: 1000 }
//     ).catch(() => console.warn(`  [${label}] Input wait timed out — continuing anyway`));
//   }

//   await sleep(2000);
//   console.log("\nBoth ready. Starting...\n");

//   // Round 0 — send everything to Worker
//   console.log("=".repeat(60));
//   console.log("  ROUND 0 — Directions + source text → Worker");
//   console.log("=".repeat(60) + "\n");
//   await sendMessage(workerPage, buildFirstPrompt(), "WORKER");
//   let lastResponse = await waitForResponse(workerPage, "WORKER");

//   // Rounds 1-N — follow up, scan, review, correct loop
//   for (let i = 0; i < FOLLOWUP_PROMPTS.length; i++) {
//     const round = i + 1;
//     console.log("\n" + "=".repeat(60));
//     console.log(`  ROUND ${round} of ${FOLLOWUP_PROMPTS.length}`);
//     console.log("=".repeat(60));

//     let approved = false;
//     let attempt = 0;

//     while (!approved) {
//       attempt++;
//       console.log(`\n  Attempt ${attempt} — Round ${round}`);

//       if (attempt === 1) {
//         await sendMessage(workerPage, FOLLOWUP_PROMPTS[i], "WORKER");
//         lastResponse = await waitForResponse(workerPage, "WORKER");
//       }

//       console.log(`\n  [SCANNER] Scanning...`);
//       const violations = scanCitations(lastResponse);
//       if (!violations.length) {
//         console.log(`  [SCANNER] No violations.`);
//       } else {
//         console.log(`  [SCANNER] ${violations.length} violation(s):`);
//         violations.forEach((v, i) => console.log(`    ${i + 1}. Rule ${v.rule} — ${v.bad}`));
//       }

//       await sendMessage(reviewerPage, buildReviewerPrompt(lastResponse, buildEvidenceReport(violations)), "REVIEWER");
//       const feedback = await waitForResponse(reviewerPage, "REVIEWER");

//       console.log(`\n  REVIEWER:\n  ` + feedback.split("\n").join("\n  "));
//       console.log("\n  " + "─".repeat(58));

//       const passed = feedback.includes("OVERALL RESULT: PASS");
//       const failed = feedback.includes("OVERALL RESULT: FAIL") || feedback.toLowerCase().includes("violation");

//       if (passed && !failed) {
//         console.log(`\n  ROUND ${round} PASSED after ${attempt} attempt(s).\n`);
//         approved = true;
//       } else {
//         console.log(`\n  ROUND ${round} FAILED — sending corrections to Worker...\n`);
//         await sendMessage(workerPage, buildCorrectionPrompt(feedback, violations), "WORKER");
//         lastResponse = await waitForResponse(workerPage, "WORKER");
//         await sleep(2000);
//       }
//     }
//     await sleep(3000);
//   }

//   console.log("\n" + "=".repeat(60));
//   console.log("  COMPLETE — Copy final assignment from the left window.");
//   console.log("=".repeat(60) + "\n");
// })();






////////three ai human driven ai loop thrid ai dose not work for some odd resone




// create a assigment summary given the SOURCE_PAGES and text make parthentical source (date) words "word for word text" (). and narrative apa 7th eddition citations source (data) metion cahpter and section or page num




// import puppeteer from "puppeteer";

// // ╔════════════════════════════════════════════════════════════╗
// // ║   STEP 1 — PASTE YOUR ASSIGNMENT DIRECTIONS HERE          ║
// // ╚════════════════════════════════════════════════════════════╝

// const ASSIGNMENT_DIRECTIONS = `
//  create the assigment given the SOURCE_PAGES and text make parthentical source (date) words "word for word text" (). and narrative apa 7th eddition citations source (data) metion cahpter and section or page num
// Directions: Based on your assigned readings and in-class activities, you will analyze a video to identify teaching strategies that promote oral language, comprehension, vocabulary development and home-school connections within a classroom setting.

// Click on the following link to watch the video: Case Studies in Science EducationLinks to an external site..

// You will view the full video lesson, taking notes, observing instructional practices connected to course concepts for your analysis. The analysis table must:

// Examine how the teacher supported students in using science talk (e.g., asking questions, explaining ideas, or collaborating with peers).
// Determine the strategies the teacher used to introduce and reinforce science vocabulary.
// Examine how the use of visual tools (e.g., diagrams, anchor charts) or hands-on activities (e.g., experiments, group investigations) contribute to student talk, vocabulary use, and concept understanding.
// Determine if students were encouraged to use key terms in discussion or writing.
// Explore the ways the teacher promoted speaking and listening skills through group discussion, partner talk, or presentations during the lesson.
// Explore one way this science lesson could be extended at home, including activities involving families in supporting vocabulary or inquiry learning.
// Investigate how you could modify or extend one of these strategies to better meet the needs of  learners (e.g., Dyslexic, ELs, students with IEPs, ADHD, ASD or Gifted) for literacy instruction.
// Submission Instructions:

// Save your table analysis as a PDF file.
// Clearly post your analysis table with a brief summary. Your analysis table should be clear, organized, and easy to read (include 200-300 word summary).
// `;

// // ╔════════════════════════════════════════════════════════════╗
// // ║   STEP 2 — PASTE YOUR SOURCE TEXT / PAGES HERE           ║
// // ║                                                            ║
// // ║   Fill in every field for each block.                    ║
// // ║   The PAGE / CHAPTER / SECTION fields are what gets      ║
// // ║   used inside the parenthetical citation ().             ║
// // ║                                                            ║
// // ║   Add as many --- blocks as you need.                    ║
// // ╚════════════════════════════════════════════════════════════╝

// const SOURCE_PAGES = `
// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 24
// CHAPTER: dose not have one
// SECTION: dose not have one

// EXACT TEXT:

// Case Studies in Science Education

// Elsa — K

// Teacher Profile

// Name | Elsa
// Experience | 15 years
// Grade & Subject(s) | Two half-day kindergarten classes; all subjects
// Classroom Demographics | Bilingual classroom
// School | Elementary school in an urban district
// Science Teaching | 2 days/week for 30 minutes
// Curriculum | Specified by district

// Contents

// Module 1 Introducing the Case

// Module 2 Trying New Ideas

// Module 3 Reflecting and Building on Change

// Module 1 - Introducing the Case

// Elsa believes that for many children, what happens in kindergarten affects students' feelings about and learning in school for the rest of their lives. She is beginning to ask questions of herself and rethink her approach to teaching science. Knowing that her students become engaged whenever they are using their senses to explore objects and phenomena,
// ---


// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 25
// CHAPTER: dose not have one
// SECTION: dose not have one

// EXACT TEXT:
// Elsa wants to build upon her students' natural inclination to learn by making their own discoveries. She hopes to extend this type of learning to meaningful expressions of students' understandings.

// Seasons Study
// To initiate discussion of seasonal characteristics, Elsa reads aloud a picture book. Students are then asked to verbalize what they know about seasons. Finally, students are given paper divided into four sections and asked to draw a picture that represents each season.

// Discussion Questions
// Given Elsa's interest in having students "participate more" during science activities, what would you describe as the strengths and weaknesses of the seasons study?

// What role do you think "free exploration" of objects and phenomena should play in helping students develop basic scientific understandings?

// How would you design activities so that students are likely to make scientifically accurate "discoveries?"

// Module 2 - Trying New Ideas
// Jeff Winokur, an early childhood science educator at Wheelock College, has observed in his teaching practice that young students cherish playing with materials and that this fascination can be put to use to help them make scientific discoveries. During students' discovery of magnets, Elsa

// ---

// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 26
// CHAPTER: dose not have one
// SECTION: dose not have one

// EXACT TEXT:

// takes a "guided discovery" approach by getting students to work with a partner as she circulates through the classroom, helping them move toward making specific discoveries.

// After working in pairs, where materials are shared, each student completes a worksheet that reflects his or her findings about materials through which a magnetic force can travel. Later, the class reviews the worksheets together. Elsa believes that when students take their worksheets home, students' understandings are again reinforced when shared with family members.

// Magnet Study
// After a period where students find out what magnets will and will not pick up, student pairs work together in a guided discovery activity to determine whether magnetic force can travel through various substances such as water, paper, wood, and cloth. Students record their discoveries on worksheets and discuss their findings with the entire class.

// Discussion Questions
// In comparing the magnet study to the seasons study, what do you consider to be the most important changes with regard to getting students to be more actively engaged?

// What meaning does the "discovery method" have for you? How would you contrast "free exploration" with "guided discovery?"

// What would you do to help students reach scientific conclusions and represent their learning after a "discovery" activity?
// ---



// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 27
// CHAPTER: dose not have one
// SECTION: dose not have one

// EXACT TEXT:

// Module 3 - Reflecting and Building on Change
// As the year progresses, Elsa is convinced that science has become her students' favorite activity period. As part of her final science unit, Elsa invites her students to mix food coloring in water to find out what happens. This time, pairs of students each have their own materials but are encouraged to share their results.

// One of Elsa's goals is that students notice consistent results from mixing certain colors. Another goal is that students develop ways of expressing their findings. Overall, however, Elsa recognizes that this activity allows many different outcomes as students pose their own questions and find their own answers by mixing colors.

// Elsa is learning that with discovery activities, even though a scientific concept is not necessarily being discovered, her students are making their own discoveries and beginning to build new knowledge. Having never seen this before, Elsa is elated.

// Mixing Colors Activities
// Students mix food coloring in water to discover what happens when different colors are combined. Discoveries are shared between partners and with Elsa. Later, students use colored cellophane as overlays to see what other changes in color can result. Both activities are designed to reflect a more "open discovery" approach.

// Discussion Questions
// How would you compare the purposes and the outcomes of the mixing colors activity with the magnet study?

// In your opinion, what is the appropriate balance between free exploration, guided discovery, and open discovery in elementary science? In later grades?
// ---


// ---
// AUTHOR: Ramlal 
// DATE: 2023
// PAGE: 20
// CHAPTER: Chapter 3
// SECTION: dose not have one

// EXACT TEXT:

// NOTES FROM THE FIELD ...
// I read to my students every day. I always wanted to use my read-aloud time to capture their interests and make reading fun. So, I thought it would be a good idea to allow the students to select the books we’d read. It seemed to be working just fine. Then, I had students take a practice state test. In this practice test, they scored very well when reading and writing about fictional passages. However, they struggled quite a bit with informational passages. During the first few months prior to the practice test, nearly all of the read-aloud books were fictional. This helped me see the importance of varying the genres I used in my read-alouds. It also confirmed what an important instructional tool a read-aloud can be.
// INTRODUCTION: COMPREHENSION In Chapter 2, we explored the connections accuracy, fluency, and vocabulary may have to a student’s comprehension of a text. In this chapter, we will delve more deeply into the aspects we must consider when teaching reading as it relates to comprehension.
// TExT SELECTION Comprehension is how a student understands what was read. When we consider our instructional plans, it is important to think of the types of texts we expect our students to work with. As comprehension is essential for learning in all subject areas, we must ensure that our instructional plans include texts from various genres (e.g., chapter books,
// ---

// ---
// AUTHOR: Ramlal 
// DATE: 2023
// PAGE: 21
// CHAPTER: Chapter 3
// SECTION: dose not have one

// EXACT TEXT:

// textbooks, graphic novels, poetry), in various formats (e.g., print and digital), and in various mediums (e.g., letters from teachers, newspaper advertisements, email messages, videos and images, presidential speeches). It is natural for students (and even the classroom teacher) to demonstrate a preference
// for a particular genre. However, our goal is to expose students in the upper-elementary grades to varied genres to offer an assortment of experiences to develop comprehension abilities. Table 3.1 shows an example of a checklist to keep track of the types of genres that you should incorporate into your instruction.
// Table 3.1 Read-Aloud Genre Checklist GENRE
// Drama Fairy Tale Historical Fiction Poetry Biography Narrative Nonfiction Textbook
// This checklist will allow you to determine which genres have been used and
// which genres you still need to incorporate into your classroom. This can be a valuable instructional tool to ensure that you are balancing the genres in your classroom. Table 3.2 offers a brief list of some genres typically used in an upper-elementary school classroom. When considering the genres to use in your classroom, review the standards for
// the grade to ensure you are meeting grade-level expectations. Also, be sure to vary the format of the genres used by including a mixture of print-based and digital texts. Creating such varied exposure to reading materials can have a positive impact on how students’ comprehension develops. It can also promote engagement and an overall love of reading.

// ---


// ---
// AUTHOR: Ramlal 
// DATE: 2023
// PAGE: 23
// CHAPTER: Chapter 3
// SECTION: dose not have one

// EXACT TEXT:

// component of reading that is done automatically and is typically limited to accuracy, fluency, and vocabulary. Here are some examples of reading skills:
// • decoding words (accuracy) • reading with expression (fluency) • using affixes to determine word meaning (vocabulary)
// Thus, skills typically include the components of reading outside of comprehension. A
// strategy is a component of reading that requires the reader to have a purposeful, metacognitive plan, or to monitor their own thinking. It often solely connects to comprehension. Here are some examples of reading strategies:
// • making predictions using clues in the text (comprehension) • making an inference about the character’s feelings using clues in the text (comprehension)
// Teaching a balance of skills and strategies is important to promote growth in the area
// of reading. Overtime, as students gain experience with using strategies and continue to practice reading skills, the manner in which you plan your instruction should also evolve. Chapter 6 will discuss how to assess students in these areas.
// WHOLE-CLASS METHODS When creating your instructional plans for the entire class, you should focus on the following areas: accuracy, fluency, vocabulary, and comprehension. Chapter 2 discussed activities you can implement to support students with reading skills (accuracy, fluency, and vocabulary). This section will focus on reading strategies for comprehension for the whole class.
// Read-Alouds When planning for whole-class instruction, be sure to include a daily read-aloud. Use the chart in Table 3.1 to keep track of the genres used for read-alouds to promote variety. At times, you want to ensure your read-aloud has a clear instructional purpose. Plan this purpose around the needs of the class. At other times, you want to use the read-aloud to build a love for reading. Table 3.3 lists some general read-aloud tips to consider
// ---



// ---
// AUTHOR: Ramlal 
// DATE: 2023
// PAGE: 24
// CHAPTER: Chapter 3
// SECTION: dose not have one

// EXACT TEXT:

// Table 3.3 Tips for Read-Alouds • Avoid using read-alouds as a behavior management tool. Implement other strategies if you need the class to sit quietly.
// • Plan read-alouds for when you have uninterrupted blocks of time. Keep the read-aloud time to 20–30 minutes. Do not attempt to start with 20 minutes on the first day. Begin with a smaller timeframe, then work your way up.
// • When setting an instructional purpose for a read aloud, consider the needs of the whole class as they relate to accuracy, fluency, vocabulary, and/or comprehension. vary the read-aloud to address both skills and strategies. However, at times, you should set no instructional purpose for the read-aloud to promote a “reading for fun” message.
// • Use a checklist or some other means to vary the genres of texts used for a read-aloud (see Table 3.1).
// • Use read-alouds to develop vocabulary, promote student-led discussions, and encourage listening comprehension. Plan questions and stopping points ahead of time.
// • Use read-alouds to make content-area connections and/or teach purposeful life skills (e.g., dealing with bullying, sharing, friendship).
// • Use read-alouds to make meaningful connections to students’ lives and/or expose students to new experiences and ideas that will support their learning in the future.
// • Preview the topics in the read-aloud before reading to the class. There may be concepts or terms that are not appropriate for the grade level or individual students in the class.
// • Select read-aloud topics that consider a broad view of diversity: cultural, linguistic, or geographical, or about students with disabilities, gender stereotypes, family structures, popular culture, and so on.
// When planning for a read-aloud, follow the procedures below:
// • Before Reading: Have a discussion to introduce the book and activate prior knowledge. If you have already read part of the book, have a discussion to introduce the new section or chapter and review what was read previously. Then review key details from the previous day’s read-aloud. Try to allow students to do most of the talking.
// • During Reading: Plan out stopping points to discuss the text or to ask and answer questions. Or simply use the stopping points for students to reflect on the read-aloud before continuing

// ---
// `;

// // ════════════════════════════════════════════════════════════
// // Everything below runs automatically — do not edit.
// // ════════════════════════════════════════════════════════════

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// function buildFirstPrompt() {
//   return `You are completing an assignment. Here are your directions and all source material.

// ${"=".repeat(50)}
// ASSIGNMENT DIRECTIONS:
// ${"=".repeat(50)}
// ${ASSIGNMENT_DIRECTIONS.trim()}

// ${"=".repeat(50)}
// SOURCE TEXT — USE THIS FOR ALL CITATIONS:
// ${"=".repeat(50)}
// ${SOURCE_PAGES.trim()}

// ${"=".repeat(50)}
// CITATION RULES — FOLLOW EVERY ONE EXACTLY:
// ${"=".repeat(50)}

// ━━ PARENTHETICAL CITATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Format: auther (date) states or other introductory word "word for word text from source" (p. #).
//      or "word for word text from source" (author, date, page location or para use pp if on more then on page).
     

// Use whichever of PAGE / CHAPTER / SECTION is listed in the
// source block the text came from.

// CORRECT:
//   "decoding is Mary's greatest area of need" (p. 53).
//   "students must read widely and deeply" (p. 10).

// RULES:
// 1. Text inside the quotes must be copied EXACTLY word for word
//    from the EXACT TEXT in the source block — nothing changed.

// 2. The period that ends the sentence goes AFTER the closing
//    parenthesis — NEVER inside the quotes.
//    CORRECT: "word for word text" (p. 53).
//    WRONG:   "word for word text." (p. 53).
//    WRONG:   "word for word text."

// 3. Every quote MUST be started with author (date) wods for picing together quote followed immediately by a citation reference.
//    A quote with nothing after it is always wrong.
//    WRONG: "is her literal comprehension, which scored at 82%."
//    WRONG: "is her literal comprehension, which scored at 82%"
//    RIGHT: "is her literal comprehension, which scored at 82%" (p. 53).
//    If you cannot immediately follow a quote with (p. #) or (Chapter X)
//    or (Section X) — do not use the quote. Write your own sentence instead.

// 3. Do NOT use filler connector words immediately before the opening quote.
//    WRONG: rate of "word for word text" (p. 53).
//    WRONG: a "word for word text" (p. 53).
//    WRONG: such as "word for word text" (p. 53).
//    RIGHT: "word for word text" (p. 53).

//    A word pulled OUT of the source text sitting before the quote is CORRECT
//    and is NOT a violation — this is the intended format:
//    CORRECT: decoding "is Mary's greatest area of need" (p. 53).
//    CORRECT: Mary's greatest strength "is her literal comprehension" (p. 53).
//    Normal sentence verbs before a quote are also fine:
//    CORRECT: The data shows "word for word text" (p. 53).

// 4. No empty quotes ever.
//    WRONG: "" (p. 53).
//    WRONG: "" ().
//    If you think about writing empty quotes — drop the citation
//    and write your own sentence instead.

// 5. If the word-for-word text from the source starts with a capital letter,
//    pull that first word OUT of the quotes, lowercase it, and blend it into
//    your sentence. The opening quote then starts on the second word.

//    SOURCE TEXT:  Decoding is Mary's greatest area of need
//    CORRECT:      decoding "is Mary's greatest area of need" (p. 53).
//    WRONG:        "Decoding is Mary's greatest area of need" (p. 53).

//    SOURCE TEXT:  The CCR and grade-specific standards are necessary complements
//    CORRECT:      the CCR "and grade-specific standards are necessary complements" (p. 10).
//    WRONG:        "The CCR and grade-specific standards are necessary complements" (p. 10).

//    SOURCE TEXT:  Mary's greatest strength is her literal comprehension
//    CORRECT:      Mary's greatest strength "is her literal comprehension" (p. 53).
//    WRONG:        "Mary's greatest strength is her literal comprehension" (p. 53).

//    If the source text already starts with a lowercase word the quote
//    can open directly on that word — no change needed.
//    SOURCE TEXT:  students must read widely and deeply
//    CORRECT:      "students must read widely and deeply" (p. 10).

// 6. NEVER put quotes around a word or phrase unless it is a full
//    parenthetical citation with a page/chapter/section reference.
//    Quotes used for emphasis or stylistic reasons are not allowed.
//    WRONG: educators use "Word Surgery" to build skills.
//    WRONG: this is called "close reading" in the standards.
//    If you want to highlight a term — just write it without quotes.
//    CORRECT: educators use Word Surgery to build skills.

// ━━ NARRATIVE CITATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Format: According to Author (date), from Chapter X in Section X
//         on page #, the text explains that...

// CORRECT:
//   According to Smith (2024), from Chapter 6 in Section 2 on
//   page 53, the data reveals that students benefit from...

//   As noted by the Common Core State Standards Initiative (2010),
//   found in Chapter 1 Section 1 on page 10, students must...

// RULES:
// 5. Author and date go in the narrative citation parentheses: (date).
//    Author name is written in the sentence before the parentheses.

// 6. Chapter, section, and page are mentioned NATURALLY in the
//    sentence after the (date) — NEVER inside the parentheses.
//    CORRECT: According to Smith (2024), from Chapter 6 in Section 2, ...
//    WRONG:   According to Smith (2024, Chapter 6, Section 2), ...

// 7. Every narrative citation must mention where in the source the
//    information came from — chapter, section, or page — naturally
//    in the sentence.

// ━━ IF IN DOUBT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// If you are unsure about the format of any citation — drop it
// entirely and write your own plain sentence instead. A missing
// citation is better than a wrong one.

// Now complete the assignment following all rules above.`;
// }

// // ─── CITATION SCANNER ────────────────────────────────────────────────────────
// function scanCitations(text) {
//   const violations = [];
//   let m;

//   // VIOLATION 1a — period INSIDE the closing quote when citation follows
//   // BAD: "word for word text." (p. 53).
//   const r1a = /"([^"]+?)\."\s*\((?:p\.\s*\d+|Chapter[^)]+|Section[^)]+)\)/g;
//   while ((m = r1a.exec(text)) !== null) {
//     violations.push({
//       rule: 1,
//       bad: m[0],
//       detail: `Period is inside the closing quote — must go AFTER the closing parenthesis. CORRECT: "word for word text" (p. #).`,
//     });
//   }

//   // VIOLATION 1b — period INSIDE the closing quote with NO citation following at all
//   // BAD: "is her literal comprehension, which scored at 82%."
//   // This catches quotes that end with ." and have no (p. #) or (Chapter) or (Section) after them
//   const r1b = /"([^"]{5,}?)\."\s*(?!\s*\((?:p\.|Chapter|Section))/g;
//   while ((m = r1b.exec(text)) !== null) {
//     violations.push({
//       rule: 1,
//       bad: m[0].trim(),
//       detail: `Two violations: (1) period is inside the closing quote — must go outside. (2) This quote has no citation reference after it — must be followed by (p. #) or (Chapter X) or (Section X). Fix: remove the citation entirely and write your own plain sentence instead.`,
//     });
//   }

//   // VIOLATION 2 — empty quotes in citation
//   // BAD: "" (p. 53) or "" ()
//   const r2 = /""\s*\((?:p\.\s*\d+|Chapter[^)]*|Section[^)]*)?\)/g;
//   while ((m = r2.exec(text)) !== null) {
//     violations.push({
//       rule: 2,
//       bad: m[0],
//       detail: `Empty quotes — must contain real word-for-word text from the source. Drop this citation and write your own sentence.`,
//     });
//   }

//   // VIOLATION 3 — glue words before opening quote tied to citation
//   // Only flag known connecting/filler words that are NOT part of the source text.
//   // Words pulled OUT of the source (like "decoding", "Mary's greatest strength")
//   // are the CORRECT format and must NEVER be flagged.
//   //
//   // BAD — filler connectors:  rate of "text" (p. 53)
//   //                           a "text" (p. 53)
//   //                           such as "text" (p. 53)
//   //                           known as "text" (p. 53)
//   //
//   // CORRECT — pulled source word: decoding "is Mary's greatest area" (p. 53)
//   // CORRECT — sentence verb:      The data shows "text" (p. 53)
//   //
//   // Only flag a small list of known filler/connector glue patterns
//   const knownGlue = [
//     /\brate of\s+"/g,
//     /\ba\s+"/g,
//     /\bsuch as\s+"/g,
//     /\bknown as\s+"/g,
//     /\breferred to as\s+"/g,
//     /\bcalled\s+"/g,
//     /\btermed\s+"/g,
//     /\bof\s+"/g,
//     /\bthe concept of\s+"/g,
//     /\bin\s+"/g,
//   ];
//   for (const pattern of knownGlue) {
//     const glueRe = new RegExp(pattern.source + '([^"]{3,}?)"\\s*\\((?:p\\.\\s*\\d+|Chapter[^)]+|Section[^)]+)\\)', 'g');
//     while ((m = glueRe.exec(text)) !== null) {
//       violations.push({
//         rule: 3,
//         bad: m[0].trim(),
//         detail: `Filler connector word before the opening quote — the citation must start with the opening quote or a pulled-out source word. Drop this citation and write your own sentence.`,
//       });
//     }
//   }

//   // VIOLATION 4 — chapter/section crammed INSIDE narrative citation parens
//   // BAD: Smith (2024, Chapter 3, Section 2)
//   const r4 = /([A-Z][a-zA-Z\s]+?)\s*\((\d{4})\s*,\s*(?:Chapter|Ch\.?|chapter|Section|Sec\.?|section)\s*[\d\w]+[^)]*\)/g;
//   while ((m = r4.exec(text)) !== null) {
//     violations.push({
//       rule: 4,
//       bad: m[0],
//       detail: `Chapter and section must NOT go inside the parentheses. CORRECT: According to ${m[1].trim()} (${m[2]}), from Chapter X in Section X on page #, ...`,
//     });
//   }

//   // VIOLATION 5 — narrative citation with no chapter/section/page mentioned nearby
//   // Catches: According to Smith (2024), with no location reference after it
//   const r5 = /According to ([A-Z][^(]+?)\s*\((\d{4})\)\s*,\s*(?!.*?\b(?:chapter|section|page|p\.)\b)/gi;
//   while ((m = r5.exec(text)) !== null) {
//     // Only flag if the next 200 chars have no location reference
//     const after = text.substring(m.index + m[0].length, m.index + m[0].length + 200).toLowerCase();
//     if (!after.match(/\b(chapter|section|page|p\.)\b/)) {
//       violations.push({
//         rule: 5,
//         bad: m[0].trim(),
//         detail: `Narrative citation has no chapter, section, or page referenced in the sentence. Add naturally: According to ${m[1].trim()} (${m[2]}), from Chapter X in Section X on page #, ...`,
//       });
//     }
//   }

//   // VIOLATION 6 — opening quote starts on a capitalized word
//   // First word must be pulled OUT of the quotes and lowercased into the sentence
//   // BAD:  "Decoding is Mary's greatest area of need" (p. 53).
//   // BAD:  "The CCR and grade-specific standards" (p. 10).
//   // GOOD: decoding "is Mary's greatest area of need" (p. 53).
//   // GOOD: the CCR "and grade-specific standards" (p. 10).
//   // OK:   "students must read widely" (p. 10). ← already lowercase
//   const r6 = /"([A-Z][a-zA-Z']+)\s+([^"]{3,}?)"\s*\((?:p\.\s*\d+|Chapter[^)]+|Section[^)]+)\)/g;
//   while ((m = r6.exec(text)) !== null) {
//     const firstWord = m[1];
//     const rest = m[2];
//     violations.push({
//       rule: 6,
//       bad: m[0],
//       detail: `Opening quote starts on capital word "${firstWord}" — pull it out and lowercase it into the sentence: ${firstWord.toLowerCase()} "${rest}..." (p. #).`,
//     });
//   }

//   // VIOLATION 7 — quotes around a word or phrase with NO citation reference after them
//   // BAD: educators use "Word Surgery" to build skills.
//   // BAD: this is called "close reading" in the standards.
//   // GOOD: educators use Word Surgery to build skills.
//   // Only flag short quoted phrases (under 60 chars) with no (p./Chapter/Section) after
//   const r7 = /"([^"]{2,60})"\s*(?!\s*\((?:p\.|Chapter|Section))/g;
//   while ((m = r7.exec(text)) !== null) {
//     // Skip if it looks like dialogue or a full sentence quote (has a verb in it)
//     const inner = m[1].toLowerCase();
//     const hasVerb = /\b(is|are|was|were|has|have|must|should|will|can|does|do|reads|shows|indicates)\b/.test(inner);
//     if (!hasVerb && m[1].length < 60) {
//       violations.push({
//         rule: 7,
//         bad: m[0].trim(),
//         detail: `Quotes around "${m[1]}" with no citation reference — do not use quotes for emphasis or terms. Remove the quotes and write the word or phrase plainly.`,
//       });
//     }
//   }

//   return violations;
// }

// function buildEvidenceReport(violations) {
//   if (!violations.length) return null;
//   let r = `Citation scanner found ${violations.length} violation(s):\n\n`;
//   violations.forEach((v, i) => {
//     r += `VIOLATION ${i + 1} — Rule ${v.rule}\n`;
//     r += `Wrong text:  ${v.bad}\n`;
//     r += `Why wrong:   ${v.detail}\n\n`;
//   });
//   return r;
// }

// const buildReviewerPrompt = (assignment, evidence) => `You are a strict APA 7th Edition citation reviewer.

// ${evidence
//   ? `A scanner already found these violations. Confirm each one, explain why it is wrong, and check for anything else missed.\n\nSCANNER FINDINGS:\n${evidence}`
//   : `The scanner found no violations. Do a thorough manual check yourself.`}

// RULES YOU ARE ENFORCING:

// PARENTHETICAL CITATIONS — format: "word for word text" (p. #).
//   or (Chapter X). or (Section X). — whichever matches the source block.

//   VIOLATION — period inside the closing quote:
//     WRONG: "word for word text." (p. 53).   ← period inside AND citation present
//     WRONG: "word for word text."             ← period inside AND no citation at all
//     RIGHT: "word for word text" (p. 53).

//     The second case is TWO violations at once:
//     (1) period inside the closing quote
//     (2) quote with no citation reference after it
//     Both make it wrong. Fix: remove it entirely, write your own plain sentence.

//   VIOLATION — quote with no citation reference after it:
//     A quote must ALWAYS be followed immediately by (p. #) or (Chapter X) or (Section X).
//     WRONG: Mary's greatest strength "is her literal comprehension, which scored at 82%."
//     WRONG: "word for word text" with nothing after it
//     RIGHT: "word for word text" (p. 53).
//     If a quote has no citation after it — remove it and write your own plain sentence.

//   VIOLATION — empty quotes:
//     WRONG: "" (p. 53). or "" ().

//   VIOLATION — filler connector words before the opening quote:
//     WRONG: rate of "word for word text" (p. 53).
//     WRONG: a "word for word text" (p. 53).
//     WRONG: such as "word for word text" (p. 53).
//     RIGHT: "word for word text" (p. 53).

//     IMPORTANT — these are NOT violations and must NOT be flagged:
//     - A word pulled out of the source text sitting before the quote is CORRECT.
//       decoding "is Mary's greatest area of need" (p. 53). ← CORRECT
//       Mary's greatest strength "is her literal comprehension" (p. 53). ← CORRECT
//     - A normal sentence verb before a quote is CORRECT.
//       The data shows "word for word text" (p. 53). ← CORRECT
//     - Only flag small filler/connector words like: rate of, a, such as,
//       known as, called, referred to as, of — when they appear immediately
//       before the opening quote as connectors with no source meaning.

//   VIOLATION — opening quote starts on a capitalized word:
//     WRONG: "Decoding is Mary's greatest area of need" (p. 53).
//     RIGHT: decoding "is Mary's greatest area of need" (p. 53).
//     WRONG: "The CCR and grade-specific standards" (p. 10).
//     RIGHT: the CCR "and grade-specific standards" (p. 10).
//     The first capital word gets pulled OUT of the quotes, lowercased,
//     and blended into the sentence. The quote opens on the second word.

//   VIOLATION — quotes around a word or phrase with no citation reference:
//     WRONG: educators use "Word Surgery" to build skills.
//     WRONG: this is called "close reading" in the standards.
//     RIGHT: educators use Word Surgery to build skills.
//     Quotes are only allowed when followed by (p. #) or (Chapter X) or (Section X).
//     Any other use of quotes is a violation — remove them and write the word plainly.

// NARRATIVE CITATIONS — format: According to Author (date), from Chapter X
//   in Section X on page #, the sentence continues...

//   VIOLATION — chapter/section/page crammed inside the parentheses:
//     WRONG: According to Smith (2024, Chapter 6, Section 2), ...
//     RIGHT: According to Smith (2024), from Chapter 6 in Section 2, ...

//   VIOLATION — narrative citation with no chapter/section/page in the sentence:
//     WRONG: According to Smith (2024), the data shows...
//     RIGHT: According to Smith (2024), from Chapter 6 in Section 2 on page 53, the data shows...

// FIX FOR ALL VIOLATIONS: remove the citation and replace with plain written text.

// Quote every wrong piece of text exactly. State the fix.

// End with exactly one of:
// OVERALL RESULT: PASS
// OVERALL RESULT: FAIL

// Assignment to review:
// ---
// ${assignment}
// ---`;

// function buildCorrectionPrompt(feedback, violations) {
//   let p = `Your assignment has citation violations. Fix all of them now.\n\n`;
//   if (violations.length) {
//     p += `These exact wrong texts were found:\n\n`;
//     violations.forEach((v, i) => {
//       p += `${i + 1}. WRONG TEXT: ${v.bad}\n`;
//       p += `   WHY WRONG:  ${v.detail}\n`;
//       p += `   FIX:        Remove it. Write your own plain sentence instead.\n\n`;
//     });
//   }
//   p += `Reviewer feedback:\n${feedback}\n\n`;
//   p += `RULES WHEN REWRITING:\n\n`;
//   p += `PARENTHETICAL:\n`;
//   p += `  "word for word text" (p. #).  ← correct\n`;
//   p += `- Period goes AFTER the closing parenthesis — NEVER inside the quotes\n`;
//   p += `  WRONG: "text." (p. 53).   WRONG: "text."   RIGHT: "text" (p. 53).\n`;
//   p += `- Every quote MUST be followed by (p. #) or (Chapter X) or (Section X)\n`;
//   p += `  A quote with nothing after it is wrong — remove it, write your own sentence\n`;
//   p += `  No filler connector words before the opening quote (rate of, a, such as, called)\n`;
//   p += `  A pulled-out source word before the quote IS correct: decoding "is Mary's greatest area" (p. 53).\n`;
//   p += `  No empty quotes\n\n`;
//   p += `NARRATIVE:\n`;
//   p += `  According to Author (date), from Chapter X in Section X on page #, ...\n`;
//   p += `  Chapter / section / page go in the SENTENCE — NEVER inside the parentheses\n`;
//   p += `  Every narrative citation must say where in the source it came from\n\n`;
//   p += `- If a citation opens on a capitalized word — pull that word OUT of the quotes, lowercase it, and blend it into the sentence\n`;
//   p += `  WRONG: "Decoding is Mary's greatest area of need" (p. 53).\n`;
//   p += `  RIGHT: decoding "is Mary's greatest area of need" (p. 53).\n`;
//   p += `- Never put quotes around a word or phrase unless it is followed by (p. #) or (Chapter X) or (Section X)\n`;
//   p += `  WRONG: educators use "Word Surgery"   RIGHT: educators use Word Surgery\n\n`;
//   p += `Rewrite the full assignment now with every violation fixed.`;
//   return p;
// }

// const FOLLOWUP_PROMPTS = [
//   `Compare every citation in your assignment against the source text. Fix any parenthetical citation where the text inside the quotes is not exactly word for word from the source. Fix any narrative citation that does not mention the chapter, section, or page naturally in the sentence. Also check: if any citation opens on a capitalized word — pull that word OUT of the quotes, lowercase it, and blend it into your sentence so the quote opens on the second word. Example: decoding "is Mary's greatest area of need" (p. 53).`,
//   `Final check on every single quote in the assignment:\n1. If a word or phrase has quotes around it but NO (p. #) or (Chapter) or (Section) after it — remove the quotes entirely and write the word plainly.\n2. If a citation opens on a capitalized word — pull that word out of the quotes, lowercase it, blend into the sentence. The quote opens on the second word.\n3. The period at the end of every parenthetical citation must be AFTER the closing parenthesis — never inside the quotes.\nFix anything that does not match — if unsure drop the citation and write your own sentence.`,
// ];

// // ─── FIND INPUT BOX ───────────────────────────────────────────────────────────
// async function findInput(page, label) {
//   const selectors = [
//     'rich-textarea div[contenteditable="true"]',
//     'div[contenteditable="true"]',
//     'div[role="textbox"]',
//     'textarea',
//     '.ql-editor',
//   ];
//   for (const sel of selectors) {
//     try {
//       const el = await page.$(sel);
//       if (el) {
//         const box = await el.boundingBox();
//         if (box && box.width > 0) {
//           console.log(`  [${label}] Input found: ${sel}`);
//           return { el, sel };
//         }
//       }
//     } catch (_) {}
//   }
//   const html = await page.evaluate(() => document.body.innerHTML.substring(0, 3000));
//   console.error(`  [${label}] ERROR: No input found. Page HTML:\n`, html);
//   throw new Error(`[${label}] Input box not found.`);
// }

// // ─── SEND MESSAGE ─────────────────────────────────────────────────────────────
// async function sendMessage(page, text, label) {
//   const { el, sel } = await findInput(page, label);
//   await el.click();
//   await sleep(400);
//   await page.keyboard.down("Control");
//   await page.keyboard.press("a");
//   await page.keyboard.up("Control");
//   await page.keyboard.press("Backspace");
//   await sleep(200);

//   const ok = await page.evaluate((t, s) => {
//     const el = document.querySelector(s);
//     if (!el) return false;
//     el.focus();
//     return document.execCommand("insertText", false, t);
//   }, text, sel);

//   if (!ok) {
//     await page.evaluate((t, s) => {
//       const el = document.querySelector(s);
//       if (!el) return;
//       el.focus();
//       if (el.contentEditable === "true") {
//         el.innerText = t;
//       } else {
//         Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(el, t);
//       }
//       el.dispatchEvent(new Event("input", { bubbles: true }));
//       el.dispatchEvent(new Event("change", { bubbles: true }));
//     }, text, sel);
//   }

//   await sleep(500);
//   const sendBtn = await page.$('button[aria-label="Send message"], button[aria-label="Submit"], button[jsname="Qx7uuf"]');
//   if (sendBtn) {
//     await sendBtn.click();
//   } else {
//     await page.keyboard.press("Enter");
//   }
//   await sleep(2000);
// }

// // ─── WAIT FOR RESPONSE ────────────────────────────────────────────────────────
// async function waitForResponse(page, label, timeoutMs = 180000) {
//   console.log(`  [${label}] Waiting for response...`);
//   try {
//     await page.waitForFunction(
//       () => !!document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'),
//       { timeout: 15000, polling: 500 }
//     );
//   } catch (_) {}

//   await page.waitForFunction(
//     () => !document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'),
//     { timeout: timeoutMs, polling: 1000 }
//   ).catch(() => {});

//   await sleep(3000);

//   const text = await page.evaluate(() => {
//     const all = [
//       ...document.querySelectorAll("model-response"),
//       ...document.querySelectorAll('[data-message-author-role="model"]'),
//       ...document.querySelectorAll(".model-response-text"),
//       ...document.querySelectorAll("message-content"),
//     ];
//     return all.length ? all[all.length - 1].innerText.trim() : "";
//   });

//   if (!text) console.warn(`  [${label}] WARNING: empty response`);
//   else console.log(`  [${label}] Response received (${text.length} chars)`);
//   return text;
// }

// // ─── DIRECTIONS CHECKER PROMPT ───────────────────────────────────────────────
// // Sent to the third browser after the assignment passes citation review.
// // Checks that every point in the assignment directions is covered.

// function buildDirectionsCheckerPrompt(assignment) {
//   return `You are checking whether a completed assignment fully covers all points
// listed in the assignment directions. You are NOT checking citations or formatting —
// that has already been done. You are ONLY checking content coverage.

// ${"=".repeat(50)}
// ASSIGNMENT DIRECTIONS:
// ${"=".repeat(50)}
// ${ASSIGNMENT_DIRECTIONS.trim()}

// ${"=".repeat(50)}
// COMPLETED ASSIGNMENT TO CHECK:
// ${"=".repeat(50)}
// ${assignment}

// ${"=".repeat(50)}
// YOUR JOB:
// ${"=".repeat(50)}
// Go through every requirement in the assignment directions above.
// For each requirement, check whether the completed assignment addresses it.

// Report like this for each point:
//   POINT: [state the requirement from the directions]
//   STATUS: COVERED or MISSING
//   REASON: [one sentence explaining why]

// At the end give an overall verdict:
//   DIRECTIONS RESULT: PASS   — if every point is covered
//   DIRECTIONS RESULT: FAIL   — if any point is missing

// If FAIL, also list a short summary of exactly what is missing so the
// Worker AI knows what to add.`;
// }

// function buildDirectionsRewritePrompt(checkerFeedback) {
//   return `Your assignment is missing required content. The directions checker found gaps.

// Checker feedback:
// ${checkerFeedback}

// Add the missing content now. Keep all existing citations exactly as they are —
// do not change any citation formatting. Only add the content that is missing.
// Rewrite the full assignment with the missing points added.`;
// }

// // ─── MAIN ─────────────────────────────────────────────────────────────────────
// (async () => {
//   console.log("=".repeat(60));
//   console.log("  GEMINI THREE-AI PIPELINE");
//   console.log("=".repeat(60));
//   console.log("  Window 1 — WORKER            writes the assignment");
//   console.log("  Window 2 — CITATION REVIEWER checks citation format");
//   console.log("  Window 3 — DIRECTIONS CHECKER checks all points covered");
//   console.log("");
//   console.log("  FLOW:");
//   console.log("  1. Worker writes assignment");
//   console.log("  2. Scanner scans for citation violations");
//   console.log("  3. Citation Reviewer confirms + checks for more");
//   console.log("  4. If violations → Worker fixes → repeat steps 2-3");
//   console.log("  5. Once citations PASS → Directions Checker reads it");
//   console.log("  6. Directions Checker checks every assignment point");
//   console.log("  7. If missing content → Worker adds it → repeat 2-6");
//   console.log("  8. Both PASS → done");

//   if (ASSIGNMENT_DIRECTIONS.trim() === "PASTE YOUR ASSIGNMENT DIRECTIONS HERE.") {
//     console.warn("⚠️  Fill in ASSIGNMENT_DIRECTIONS at the top of server.js\n");
//   }

//   const launchOptions = {
//     headless: false,
//     executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
//     slowMo: 80,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-blink-features=AutomationControlled",
//       "--start-maximized",
//     ],
//     defaultViewport: null,
//     ignoreDefaultArgs: ["--enable-automation"],
//   };

//   console.log("Opening Worker browser (window 1)...");
//   const workerBrowser = await puppeteer.launch({
//     ...launchOptions,
//     args: [...launchOptions.args, "--user-data-dir=C:\\Temp\\puppeteer-worker"],
//   });

//   console.log("Opening Citation Reviewer browser (window 2)...");
//   const reviewerBrowser = await puppeteer.launch({
//     ...launchOptions,
//     args: [...launchOptions.args, "--user-data-dir=C:\\Temp\\puppeteer-reviewer"],
//   });

//   console.log("Opening Directions Checker browser (window 3)...");
//   const checkerBrowser = await puppeteer.launch({
//     ...launchOptions,
//     args: [...launchOptions.args, "--user-data-dir=C:\\Temp\\puppeteer-checker"],
//   });

//   const workerPage   = await workerBrowser.newPage();
//   const reviewerPage = await reviewerBrowser.newPage();
//   const checkerPage  = await checkerBrowser.newPage();

//   for (const p of [workerPage, reviewerPage, checkerPage]) {
//     await p.evaluateOnNewDocument(() => {
//       Object.defineProperty(navigator, "webdriver", { get: () => false });
//       window.chrome = { runtime: {} };
//     });
//   }

//   console.log("\nOpening Gemini in all three windows...");
//   await workerPage.goto("https://gemini.google.com/app",   { waitUntil: "domcontentloaded", timeout: 60000 });
//   await reviewerPage.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
//   await checkerPage.goto("https://gemini.google.com/app",  { waitUntil: "domcontentloaded", timeout: 60000 });
//   await sleep(4000);

//   const needsLogin = [workerPage, reviewerPage, checkerPage].some(p => p.url().includes("accounts.google.com"));
//   if (needsLogin) {
//     console.log("\n" + "!".repeat(60));
//     console.log("  Sign into Google in ALL THREE windows.");
//     console.log("  Script waits until all three are on Gemini.");
//     console.log("!".repeat(60));
//     await Promise.all([
//       workerPage.waitForFunction(()   => location.href.includes("gemini.google.com"), { timeout: 120000, polling: 1000 }),
//       reviewerPage.waitForFunction(() => location.href.includes("gemini.google.com"), { timeout: 120000, polling: 1000 }),
//       checkerPage.waitForFunction(()  => location.href.includes("gemini.google.com"), { timeout: 120000, polling: 1000 }),
//     ]);
//   }

//   console.log("\nWaiting for input to be ready in all three windows...");
//   for (const [p, label] of [[workerPage, "WORKER"], [reviewerPage, "CITATION REVIEWER"], [checkerPage, "DIRECTIONS CHECKER"]]) {
//     await p.waitForFunction(
//       () => !!document.querySelector('rich-textarea div[contenteditable="true"], div[contenteditable="true"], div[role="textbox"], textarea'),
//       { timeout: 30000, polling: 1000 }
//     ).catch(() => console.warn(`  [${label}] Input wait timed out — continuing anyway`));
//   }

//   await sleep(2000);
//   console.log("\nAll three windows ready. Starting...\n");

//   // Round 0 — send everything to Worker
//   console.log("=".repeat(60));
//   console.log("  ROUND 0 — Directions + source text → Worker");
//   console.log("=".repeat(60) + "\n");
//   await sendMessage(workerPage, buildFirstPrompt(), "WORKER");
//   let lastResponse = await waitForResponse(workerPage, "WORKER");

//   // Rounds 1-N — follow up, scan, review, correct loop
//   for (let i = 0; i < FOLLOWUP_PROMPTS.length; i++) {
//     const round = i + 1;
//     console.log("\n" + "=".repeat(60));
//     console.log(`  ROUND ${round} of ${FOLLOWUP_PROMPTS.length}`);
//     console.log("=".repeat(60));

//     let approved = false;
//     let attempt = 0;

//     while (!approved) {
//       attempt++;
//       console.log(`\n  Attempt ${attempt} — Round ${round}`);

//       if (attempt === 1) {
//         await sendMessage(workerPage, FOLLOWUP_PROMPTS[i], "WORKER");
//         lastResponse = await waitForResponse(workerPage, "WORKER");
//       }

//       console.log(`\n  [SCANNER] Scanning...`);
//       const violations = scanCitations(lastResponse);
//       if (!violations.length) {
//         console.log(`  [SCANNER] No violations.`);
//       } else {
//         console.log(`  [SCANNER] ${violations.length} violation(s):`);
//         violations.forEach((v, i) => console.log(`    ${i + 1}. Rule ${v.rule} — ${v.bad}`));
//       }

//       await sendMessage(reviewerPage, buildReviewerPrompt(lastResponse, buildEvidenceReport(violations)), "REVIEWER");
//       const feedback = await waitForResponse(reviewerPage, "REVIEWER");

//       console.log(`\n  REVIEWER:\n  ` + feedback.split("\n").join("\n  "));
//       console.log("\n  " + "─".repeat(58));

//       const passed = feedback.includes("OVERALL RESULT: PASS");
//       const failed = feedback.includes("OVERALL RESULT: FAIL") || feedback.toLowerCase().includes("violation");

//       if (passed && !failed) {
//         console.log(`\n  ROUND ${round} PASSED after ${attempt} attempt(s).\n`);
//         approved = true;
//       } else {
//         console.log(`\n  ROUND ${round} FAILED — sending corrections to Worker...\n`);
//         await sendMessage(workerPage, buildCorrectionPrompt(feedback, violations), "WORKER");
//         lastResponse = await waitForResponse(workerPage, "WORKER");
//         await sleep(2000);
//       }
//     }
//     await sleep(3000);
//   }

//   console.log("\n" + "=".repeat(60));
//   console.log("  CITATION REVIEW COMPLETE");
//   console.log("  Now checking assignment covers all directions points...");
//   console.log("=".repeat(60) + "\n");

//   // ── Stage 2: Directions Checker loop ─────────────────────────────────────
//   // Keeps looping until the Directions Checker says PASS
//   let directionsApproved = false;
//   let directionsAttempt  = 0;

//   while (!directionsApproved) {
//     directionsAttempt++;
//     console.log(`\n  [DIRECTIONS CHECKER] Attempt ${directionsAttempt}...`);

//     // Send assignment to Directions Checker
//     await sendMessage(checkerPage, buildDirectionsCheckerPrompt(lastResponse), "DIRECTIONS CHECKER");
//     const checkerFeedback = await waitForResponse(checkerPage, "DIRECTIONS CHECKER");

//     console.log(`\n  DIRECTIONS CHECKER FEEDBACK:\n`);
//     console.log("  " + checkerFeedback.split("\n").join("\n  "));
//     console.log("\n  " + "─".repeat(58));

//     const dirPass = checkerFeedback.includes("DIRECTIONS RESULT: PASS");
//     const dirFail = checkerFeedback.includes("DIRECTIONS RESULT: FAIL");

//     if (dirPass && !dirFail) {
//       console.log(`\n  DIRECTIONS CHECK PASSED. Assignment covers all points.\n`);
//       directionsApproved = true;
//     } else {
//       console.log(`\n  DIRECTIONS CHECK FAILED — sending gaps back to Worker to fix...\n`);

//       // Send missing content list back to Worker to rewrite
//       await sendMessage(workerPage, buildDirectionsRewritePrompt(checkerFeedback), "WORKER");
//       lastResponse = await waitForResponse(workerPage, "WORKER");
//       console.log(`  [WORKER] Rewrite received — ${lastResponse.length} chars`);

//       // After Worker rewrites, run citation scan + review again on the new version
//       console.log(`\n  [SCANNER] Re-scanning rewritten assignment...`);
//       const rewriteViolations = scanCitations(lastResponse);
//       if (!rewriteViolations.length) {
//         console.log(`  [SCANNER] No violations in rewrite.`);
//       } else {
//         console.log(`  [SCANNER] ${rewriteViolations.length} violation(s) found in rewrite — fixing...`);
//         await sendMessage(reviewerPage, buildReviewerPrompt(lastResponse, buildEvidenceReport(rewriteViolations)), "CITATION REVIEWER");
//         const rewriteFeedback = await waitForResponse(reviewerPage, "CITATION REVIEWER");
//         const rewritePassed = rewriteFeedback.includes("OVERALL RESULT: PASS");
//         if (!rewritePassed) {
//           await sendMessage(workerPage, buildCorrectionPrompt(rewriteFeedback, rewriteViolations), "WORKER");
//           lastResponse = await waitForResponse(workerPage, "WORKER");
//         }
//       }

//       await sleep(2000);
//     }
//   }

//   console.log("\n" + "=".repeat(60));
//   console.log("  ALL CHECKS COMPLETE");
//   console.log("  Citations:   PASS");
//   console.log("  Directions:  PASS");
//   console.log("  Copy final assignment from the left window (Worker).");
//   console.log("=".repeat(60) + "\n");

//   // await workerBrowser.close();
//   // await reviewerBrowser.close();
//   // await checkerBrowser.close();
// })();







////////three + how many ever needed ai puppeter driven text finder for work ai loop thrid ai dose not work for some odd resone






// import puppeteer from "puppeteer";

// // ╔════════════════════════════════════════════════════════════╗
// // ║                                                            ║
// // ║   ASSIGNMENTS — Define all your assignments here          ║
// // ║                                                            ║
// // ║   Each assignment has:                                     ║
// // ║   - directions: what the assignment asks for              ║
// // ║   - sources: one entry per book/chapter to pull text from ║
// // ║     - bookTitle: exact title as it appears on Yuzu        ║
// // ║     - author: author last name to confirm correct book    ║
// // ║     - chapter: chapter number or name to navigate to      ║
// // ║     - pages: array of page numbers to read text from      ║
// // ║                                                            ║
// // ╚════════════════════════════════════════════════════════════╝

// const ASSIGNMENTS = [
//   {
//     directions: `
//       Write a literacy intervention analysis for a 6th grade student named Mary.
//       Include:
//       1. A problem statement identifying the student's core deficit
//       2. The student's area of strength and how it serves as an instructional bridge
//       3. Three recommended intervention strategies aligned to Michigan standards
//       4. How these strategies connect to grade-level independence
//       Use APA 7th Edition citations throughout.
//     `,
//     sources: [
//       {
//         bookTitle: "Literacy in Elementary Education",
//         author: "Ramlal",
//         chapter: "Chapter 2",
//         pages: [8, 9, 10, 11, 12],
//       },
//       // Add more sources for this assignment here
//       // {
//       //   bookTitle: "Literacy in Grades 4-8",
//       //   author: "Cecil",
//       //   chapter: "Chapter One",
//       //   pages: [1, 2, 3],
//       // },
//     ],
//   },
//   // Add more assignments here — they run one after the other automatically
//   // {
//   //   directions: `Write a summary of...`,
//   //   sources: [
//   //     { bookTitle: "...", author: "...", chapter: "Chapter 3", pages: [20, 21] },
//   //   ],
//   // },
// ];

// // ════════════════════════════════════════════════════════════
// // Everything below runs automatically — do not edit.
// // ════════════════════════════════════════════════════════════

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// const YUZU_BASE    = "https://reader.yuzu.com";
// const YUZU_LIBRARY = `${YUZU_BASE}/home/my-library`;

// const CHROME_PATH  = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

// const launchOptions = {
//   headless: false,
//   executablePath: CHROME_PATH,
//   slowMo: 60,
//   args: [
//     "--no-sandbox",
//     "--disable-setuid-sandbox",
//     "--disable-blink-features=AutomationControlled",
//     "--start-maximized",
//   ],
//   defaultViewport: null,
//   ignoreDefaultArgs: ["--enable-automation"],
// };

// // ─── YUZU TEXT READER ────────────────────────────────────────────────────────
// // One browser per source book. Navigates Yuzu, finds the book by title+author,
// // opens the specified chapter, reads page text word for word.

// async function launchYuzuReader(source, index) {
//   console.log(`\n  [YUZU ${index + 1}] Launching browser for: ${source.bookTitle}`);

//   const browser = await puppeteer.launch({
//     ...launchOptions,
//     args: [
//       ...launchOptions.args,
//       `--user-data-dir=C:\\Temp\\puppeteer-yuzu-${index}`,
//     ],
//   });

//   const page = await browser.newPage();
//   await page.evaluateOnNewDocument(() => {
//     Object.defineProperty(navigator, "webdriver", { get: () => false });
//     window.chrome = { runtime: {} };
//   });

//   // Go to Yuzu library — uses your existing logged-in session
//   console.log(`  [YUZU ${index + 1}] Going to Yuzu library...`);
//   await page.goto(YUZU_LIBRARY, { waitUntil: "domcontentloaded", timeout: 60000 });
//   await sleep(4000);

//   // If redirected to sign-in, wait for user to sign in
//   if (page.url().includes("sign-in") || page.url().includes("login")) {
//     console.log(`\n  [YUZU ${index + 1}] Not logged in — sign into Yuzu in this window.`);
//     console.log(`  [YUZU ${index + 1}] Script waits until you are on the library page.`);
//     await page.waitForFunction(
//       () => location.href.includes("my-library") || location.href.includes("dashboard"),
//       { timeout: 120000, polling: 1000 }
//     );
//     await sleep(3000);
//   }

//   console.log(`  [YUZU ${index + 1}] On library. Searching for: ${source.bookTitle} by ${source.author}`);

//   // Find the book card by title text
//   const bookFound = await page.evaluate((title, author) => {
//     const cards = document.querySelectorAll("h3, h4, .book-title, [class*='title'], [class*='book']");
//     for (const card of cards) {
//       if (card.innerText && card.innerText.toLowerCase().includes(title.toLowerCase())) {
//         // Confirm author if possible
//         const parent = card.closest("[class*='book'], [class*='card'], li, article") || card.parentElement;
//         const parentText = parent ? parent.innerText.toLowerCase() : "";
//         if (!author || parentText.includes(author.toLowerCase())) {
//           card.click();
//           return true;
//         }
//       }
//     }
//     return false;
//   }, source.bookTitle, source.author);

//   if (!bookFound) {
//     // Try clicking the three-dot menu and then Open Book
//     console.log(`  [YUZU ${index + 1}] Direct click not found — trying menu approach...`);
//     await page.evaluate((title) => {
//       const allText = document.querySelectorAll("*");
//       for (const el of allText) {
//         if (el.children.length === 0 && el.innerText &&
//             el.innerText.toLowerCase().includes(title.toLowerCase())) {
//           el.closest("[class*='book'], [class*='card'], li, article")
//             ?.querySelector("button, [class*='menu'], [class*='more']")
//             ?.click();
//           return;
//         }
//       }
//     }, source.bookTitle);
//     await sleep(1000);

//     // Click "Open Book" in the menu
//     await page.evaluate(() => {
//       const items = document.querySelectorAll("li, [role='menuitem'], button, a");
//       for (const item of items) {
//         if (item.innerText && item.innerText.toLowerCase().includes("open book")) {
//           item.click();
//           return;
//         }
//       }
//     });
//   }

//   // Wait for the book reader to open
//   await sleep(5000);
//   await page.waitForFunction(
//     () => location.href.includes("/reader/books/") || location.href.includes("/reader/"),
//     { timeout: 30000, polling: 1000 }
//   ).catch(() => console.log(`  [YUZU ${index + 1}] Book reader wait timed out — continuing`));

//   await sleep(3000);
//   console.log(`  [YUZU ${index + 1}] Book open. Navigating to ${source.chapter}...`);

//   // Open the table of contents sidebar
//   await page.evaluate(() => {
//     const toc = document.querySelector(
//       "[aria-label='Table of contents'], [class*='toc'], [class*='contents'], button[class*='menu']"
//     );
//     if (toc) toc.click();
//   });
//   await sleep(2000);

//   // Find and click the chapter in the TOC
//   const chapterClicked = await page.evaluate((chapterName) => {
//     const links = document.querySelectorAll("a, [role='link'], [class*='chapter'], [class*='toc'] li");
//     for (const link of links) {
//       if (link.innerText && link.innerText.toLowerCase().includes(chapterName.toLowerCase())) {
//         link.click();
//         return true;
//       }
//     }
//     return false;
//   }, source.chapter);

//   if (!chapterClicked) {
//     console.log(`  [YUZU ${index + 1}] Chapter link not found in TOC — trying search...`);
//   }

//   await sleep(4000);

//   // Read text from each specified page
//   let allPageText = "";
//   const currentPageNum = source.pages[0];

//   // Navigate to first page using the page input at the bottom
//   await page.evaluate((pageNum) => {
//     const inputs = document.querySelectorAll("input[type='number'], input[class*='page'], .page-input");
//     for (const input of inputs) {
//       input.value = "";
//       input.dispatchEvent(new Event("input", { bubbles: true }));
//       input.value = String(pageNum);
//       input.dispatchEvent(new Event("input", { bubbles: true }));
//       input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
//       input.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter", bubbles: true }));
//       input.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
//       return;
//     }
//   }, currentPageNum);

//   await sleep(3000);

//   // Read text from each page
//   for (const pageNum of source.pages) {
//     console.log(`  [YUZU ${index + 1}] Reading page ${pageNum}...`);

//     // Navigate to page
//     await page.evaluate((num) => {
//       const inputs = document.querySelectorAll("input[type='number'], input[class*='page'], .page-input");
//       for (const input of inputs) {
//         input.value = String(num);
//         input.dispatchEvent(new Event("input", { bubbles: true }));
//         input.dispatchEvent(new Event("change", { bubbles: true }));
//         ["keydown","keypress","keyup"].forEach(evType => {
//           input.dispatchEvent(new KeyboardEvent(evType, { key: "Enter", keyCode: 13, bubbles: true }));
//         });
//         return;
//       }
//     }, pageNum);

//     await sleep(3000);

//     // Extract all visible text from the page content area
//     const pageText = await page.evaluate((num) => {
//       // Try common Yuzu content selectors
//       const contentSelectors = [
//         ".page-content",
//         "[class*='page-content']",
//         "[class*='reader-content']",
//         "[class*='book-content']",
//         ".epub-content",
//         "[class*='epub']",
//         "article",
//         "main",
//         "#content",
//       ];

//       for (const sel of contentSelectors) {
//         const el = document.querySelector(sel);
//         if (el && el.innerText && el.innerText.length > 100) {
//           return `[PAGE ${num}]\n${el.innerText.trim()}`;
//         }
//       }

//       // Fallback: get all paragraph text
//       const paras = document.querySelectorAll("p");
//       const text = Array.from(paras).map(p => p.innerText).filter(t => t.length > 20).join("\n");
//       return text.length > 50 ? `[PAGE ${num}]\n${text}` : "";
//     }, pageNum);

//     if (pageText) {
//       allPageText += "\n\n" + pageText;
//       console.log(`  [YUZU ${index + 1}] Page ${pageNum}: captured ${pageText.length} chars`);
//     } else {
//       console.warn(`  [YUZU ${index + 1}] Page ${pageNum}: no text captured`);
//     }
//   }

//   console.log(`  [YUZU ${index + 1}] Done reading. Total: ${allPageText.length} chars`);
//   return { browser, text: allPageText.trim(), source };
// }

// // ─── FIND GEMINI INPUT ────────────────────────────────────────────────────────
// async function findInput(page, label) {
//   const selectors = [
//     'rich-textarea div[contenteditable="true"]',
//     'div[contenteditable="true"]',
//     'div[role="textbox"]',
//     'textarea',
//     '.ql-editor',
//   ];
//   for (const sel of selectors) {
//     try {
//       const el = await page.$(sel);
//       if (el) {
//         const box = await el.boundingBox();
//         if (box && box.width > 0) {
//           console.log(`  [${label}] Input: ${sel}`);
//           return { el, sel };
//         }
//       }
//     } catch (_) {}
//   }
//   const html = await page.evaluate(() => document.body.innerHTML.substring(0, 2000));
//   console.error(`  [${label}] No input found. HTML:\n`, html);
//   throw new Error(`[${label}] Input not found`);
// }

// // ─── SEND MESSAGE ─────────────────────────────────────────────────────────────
// async function sendMessage(page, text, label) {
//   const { el, sel } = await findInput(page, label);
//   await el.click();
//   await sleep(400);
//   await page.keyboard.down("Control");
//   await page.keyboard.press("a");
//   await page.keyboard.up("Control");
//   await page.keyboard.press("Backspace");
//   await sleep(200);

//   const ok = await page.evaluate((t, s) => {
//     const el = document.querySelector(s);
//     if (!el) return false;
//     el.focus();
//     return document.execCommand("insertText", false, t);
//   }, text, sel);

//   if (!ok) {
//     await page.evaluate((t, s) => {
//       const el = document.querySelector(s);
//       if (!el) return;
//       el.focus();
//       if (el.contentEditable === "true") {
//         el.innerText = t;
//       } else {
//         Object.getOwnPropertyDescriptor(
//           window.HTMLTextAreaElement.prototype, "value"
//         ).set.call(el, t);
//       }
//       el.dispatchEvent(new Event("input", { bubbles: true }));
//       el.dispatchEvent(new Event("change", { bubbles: true }));
//     }, text, sel);
//   }

//   await sleep(500);
//   const sendBtn = await page.$(
//     'button[aria-label="Send message"], button[aria-label="Submit"], button[jsname="Qx7uuf"]'
//   );
//   if (sendBtn) await sendBtn.click();
//   else await page.keyboard.press("Enter");
//   await sleep(2000);
// }

// // ─── WAIT FOR RESPONSE ────────────────────────────────────────────────────────
// async function waitForResponse(page, label, timeoutMs = 240000) {
//   console.log(`  [${label}] Waiting...`);
//   try {
//     await page.waitForFunction(
//       () => !!document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'),
//       { timeout: 20000, polling: 500 }
//     );
//   } catch (_) {}

//   await page.waitForFunction(
//     () => !document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'),
//     { timeout: timeoutMs, polling: 1000 }
//   ).catch(() => {});

//   await sleep(3000);

//   const text = await page.evaluate(() => {
//     const all = [
//       ...document.querySelectorAll("model-response"),
//       ...document.querySelectorAll('[data-message-author-role="model"]'),
//       ...document.querySelectorAll(".model-response-text"),
//       ...document.querySelectorAll("message-content"),
//     ];
//     return all.length ? all[all.length - 1].innerText.trim() : "";
//   });

//   if (!text) console.warn(`  [${label}] Empty response`);
//   else console.log(`  [${label}] Got ${text.length} chars`);
//   return text;
// }

// // ─── OPEN GEMINI BROWSER ─────────────────────────────────────────────────────
// async function openGeminiBrowser(profileName, label) {
//   console.log(`  Opening ${label} browser...`);
//   const browser = await puppeteer.launch({
//     ...launchOptions,
//     args: [
//       ...launchOptions.args,
//       `--user-data-dir=C:\\Temp\\puppeteer-${profileName}`,
//     ],
//   });
//   const page = await browser.newPage();
//   await page.evaluateOnNewDocument(() => {
//     Object.defineProperty(navigator, "webdriver", { get: () => false });
//     window.chrome = { runtime: {} };
//   });
//   await page.goto("https://gemini.google.com/app", {
//     waitUntil: "domcontentloaded",
//     timeout: 60000,
//   });
//   return { browser, page };
// }

// // ─── CITATION SCANNER ────────────────────────────────────────────────────────
// function scanCitations(text) {
//   const violations = [];
//   let m;

//   // 1a — period inside closing quote WITH citation after
//   const r1a = /"([^"]+?)\."\s*\((?:p\.\s*\d+|Chapter[^)]+|Section[^)]+)\)/g;
//   while ((m = r1a.exec(text)) !== null) {
//     violations.push({ rule: 1, bad: m[0], detail: `Period inside closing quote — must go AFTER closing parenthesis. CORRECT: "word for word text" (p. #).` });
//   }

//   // 1b — period inside closing quote with NO citation after
//   const r1b = /"([^"]{5,}?)\."\s*(?!\s*\((?:p\.|Chapter|Section))/g;
//   while ((m = r1b.exec(text)) !== null) {
//     violations.push({ rule: 1, bad: m[0].trim(), detail: `Two violations: period inside closing quote AND no citation reference after it. Fix: remove entirely, write your own sentence.` });
//   }

//   // 2 — empty quotes
//   const r2 = /""\s*\((?:p\.\s*\d+|Chapter[^)]*|Section[^)]*)?\)/g;
//   while ((m = r2.exec(text)) !== null) {
//     violations.push({ rule: 2, bad: m[0], detail: `Empty quotes — drop citation, write your own sentence.` });
//   }

//   // 3 — known filler connector words before opening quote
//   const knownGlue = [/\brate of\s+"/, /(?<!\w)a\s+"/, /\bsuch as\s+"/, /\bknown as\s+"/, /\breferred to as\s+"/, /\bcalled\s+"/, /\btermed\s+"/, /\bof\s+"/, /\bin\s+"/];
//   for (const pattern of knownGlue) {
//     const glueRe = new RegExp(pattern.source + '([^"]{3,}?)"\\s*\\((?:p\\.\\s*\\d+|Chapter[^)]+|Section[^)]+)\\)', 'g');
//     while ((m = glueRe.exec(text)) !== null) {
//       violations.push({ rule: 3, bad: m[0].trim(), detail: `Filler connector word before opening quote — citation must start with opening quote or pulled-out source word. Drop and write your own sentence.` });
//     }
//   }

//   // 4 — chapter/section inside narrative citation parens
//   const r4 = /([A-Z][a-zA-Z\s]+?)\s*\((\d{4})\s*,\s*(?:Chapter|Ch\.?)\s*[\d\w]+[^)]*\)/g;
//   while ((m = r4.exec(text)) !== null) {
//     violations.push({ rule: 4, bad: m[0], detail: `Chapter/section inside parentheses — write naturally in the sentence: According to ${m[1].trim()} (${m[2]}), from Chapter X in Section X, ...` });
//   }

//   // 5 — narrative citation with no location in sentence
//   const r5 = /According to ([^(]+?)\s*\((\d{4})\)\s*,\s*/gi;
//   while ((m = r5.exec(text)) !== null) {
//     const after = text.substring(m.index + m[0].length, m.index + m[0].length + 250).toLowerCase();
//     if (!after.match(/\b(chapter|section|page|p\.)\b/)) {
//       violations.push({ rule: 5, bad: m[0].trim(), detail: `Narrative citation missing location — add chapter/section/page naturally in sentence: According to ${m[1].trim()} (${m[2]}), from Chapter X in Section X on page #, ...` });
//     }
//   }

//   // 6 — opening quote starts on capital word
//   const r6 = /"([A-Z][a-zA-Z']+)\s+([^"]{3,}?)"\s*\((?:p\.\s*\d+|Chapter[^)]+|Section[^)]+)\)/g;
//   while ((m = r6.exec(text)) !== null) {
//     violations.push({ rule: 6, bad: m[0], detail: `Opening quote starts on capital word "${m[1]}" — pull it out and lowercase: ${m[1].toLowerCase()} "${m[2]}..." (p. #).` });
//   }

//   // 7 — quotes around word/phrase with no citation (short, no verb)
//   const r7 = /"([^"]{2,60})"\s*(?!\s*\((?:p\.|Chapter|Section))/g;
//   const hasVerb = /\b(is|are|was|were|has|have|must|should|will|can|does|do|reads|shows)\b/;
//   while ((m = r7.exec(text)) !== null) {
//     if (!hasVerb.test(m[1].toLowerCase()) && m[1].length < 60) {
//       violations.push({ rule: 7, bad: m[0].trim(), detail: `Quotes around "${m[1]}" with no citation — remove quotes and write plainly.` });
//     }
//   }

//   return violations;
// }

// function buildEvidenceReport(violations) {
//   if (!violations.length) return null;
//   let r = `Scanner found ${violations.length} violation(s):\n\n`;
//   violations.forEach((v, i) => {
//     r += `VIOLATION ${i + 1} — Rule ${v.rule}\nWrong: ${v.bad}\nWhy: ${v.detail}\n\n`;
//   });
//   return r;
// }

// // ─── PROMPT BUILDERS ─────────────────────────────────────────────────────────
// function buildFirstPrompt(directions, sourceBlocks) {
//   const sourcesText = sourceBlocks.map(s =>
//     `---\nBOOK: ${s.source.bookTitle}\nAUTHOR: ${s.source.author}\nCHAPTER: ${s.source.chapter}\nPAGES: ${s.source.pages.join(", ")}\n\nEXACT TEXT FROM BOOK:\n${s.text}\n---`
//   ).join("\n\n");

//   return `You are completing an assignment. You have been given the exact word-for-word text from the required textbooks. Use this text to write the assignment.

// ${"=".repeat(50)}
// ASSIGNMENT DIRECTIONS:
// ${"=".repeat(50)}
// ${directions.trim()}

// ${"=".repeat(50)}
// SOURCE TEXT — PULLED WORD FOR WORD FROM TEXTBOOKS:
// ${"=".repeat(50)}
// ${sourcesText}

// ${"=".repeat(50)}
// CITATION RULES — FOLLOW EVERY ONE:
// ${"=".repeat(50)}

// PARENTHETICAL CITATIONS: "word for word text" (p. #).
//   - Text inside quotes must be EXACT word for word from the source above
//   - Period goes AFTER the closing parenthesis — NEVER inside the quotes
//   - Every quote MUST be followed by (p. #) or (Chapter X) or (Section X)
//   - A quote with nothing after it is WRONG
//   - No filler connector words before opening quote: rate of "text" is wrong
//   - A word pulled out of the source sitting before the quote IS correct:
//     decoding "is Mary's greatest area of need" (p. 8). ← CORRECT
//   - If source text starts with a capital — pull that word OUT, lowercase it,
//     blend into sentence, quote opens on second word:
//     SOURCE: Decoding is Mary's greatest area of need
//     CORRECT: decoding "is Mary's greatest area of need" (p. 8).
//   - No empty quotes: "" (p. #) is wrong
//   - No random quotes around terms without a citation after them

// NARRATIVE CITATIONS: According to Author (date), from Chapter X in Section X on page #, ...
//   - Author name and date in parentheses — chapter/section/page naturally in sentence
//   - NEVER put chapter/section inside the parentheses
//   - Every narrative citation must mention where in the source it came from

// IF IN DOUBT about any citation — drop it and write your own sentence.

// Now complete the assignment using only the source text provided above.`;
// }

// const buildReviewerPrompt = (assignment, evidence) => `You are a strict APA 7th Edition citation reviewer.

// ${evidence ? `Scanner already found these violations. Confirm each and check for more:\n\nSCANNER FINDINGS:\n${evidence}` : `Scanner found no violations. Do a thorough manual check.`}

// RULES:
// 1. "word for word text" (p. #). — period AFTER closing parenthesis, NEVER inside quotes
// 2. Every quote MUST be followed by (p. #) or (Chapter X) or (Section X)
//    "text." with no citation after it = WRONG — two violations at once
// 3. No filler connector words before opening quote
//    Pulled-out source word before quote IS correct: decoding "is..." (p. #). ← CORRECT
// 4. No empty quotes: "" (p. #) is wrong
// 5. Opening quote on capital word = WRONG
//    decoding "is Mary's greatest area" (p. #). ← CORRECT (first word pulled out)
// 6. No quotes around words/phrases without citation after them
// 7. Narrative: According to Author (date), from Chapter X in Section X on page #, ...
//    Chapter/section NEVER inside parentheses

// FIX FOR ALL: remove citation, replace with plain written text.
// Quote every wrong piece exactly. State the fix.

// End with: OVERALL RESULT: PASS  or  OVERALL RESULT: FAIL

// Assignment:
// ---
// ${assignment}
// ---`;

// function buildCorrectionPrompt(feedback, violations) {
//   let p = `Your assignment has citation violations. Fix all of them now.\n\n`;
//   if (violations.length) {
//     p += `These exact wrong texts were found:\n\n`;
//     violations.forEach((v, i) => {
//       p += `${i + 1}. WRONG: ${v.bad}\n   WHY: ${v.detail}\n   FIX: Remove it. Write your own plain sentence instead.\n\n`;
//     });
//   }
//   p += `Reviewer said:\n${feedback}\n\n`;
//   p += `RULES:\n`;
//   p += `- "word for word text" (p. #). — period AFTER closing paren, NEVER inside quotes\n`;
//   p += `- Every quote needs (p. #) or (Chapter X) after it — no citation = wrong\n`;
//   p += `- No filler connector words before opening quote\n`;
//   p += `- Pulled-out source word before quote IS correct: decoding "is..." (p. #).\n`;
//   p += `- No empty quotes\n`;
//   p += `- Opening quote on capital = WRONG: pull first word out, lowercase it\n`;
//   p += `- Narrative: According to Author (date), from Chapter X in Section X on page #, ...\n`;
//   p += `- Any doubt — drop the citation, write your own sentence\n\n`;
//   p += `Rewrite the full assignment now.`;
//   return p;
// }

// function buildDirectionsCheckerPrompt(assignment, directions) {
//   return `You are checking whether a completed assignment fully covers all points in the directions.
// You are NOT checking citations — only content coverage.

// ${"=".repeat(50)}
// ASSIGNMENT DIRECTIONS:
// ${"=".repeat(50)}
// ${directions.trim()}

// ${"=".repeat(50)}
// COMPLETED ASSIGNMENT:
// ${"=".repeat(50)}
// ${assignment}

// ${"=".repeat(50)}
// YOUR JOB:
// ${"=".repeat(50)}
// For each requirement in the directions, check if it is covered.

// Report:
//   POINT: [requirement]
//   STATUS: COVERED or MISSING
//   REASON: [one sentence]

// End with:
//   DIRECTIONS RESULT: PASS   — all points covered
//   DIRECTIONS RESULT: FAIL   — any point missing

// If FAIL, list exactly what is missing.`;
// }

// function buildDirectionsRewritePrompt(checkerFeedback) {
//   return `Your assignment is missing required content. Add it now.

// Checker feedback:
// ${checkerFeedback}

// Keep all existing citations exactly as they are. Only add the missing content.
// Rewrite the full assignment with the missing points included.`;
// }

// const FOLLOWUP_PROMPTS = [
//   `Compare every citation in your assignment against the source text. Fix any parenthetical citation where the text inside the quotes is not exactly word for word from the source. Fix any narrative citation that does not mention chapter, section, or page naturally in the sentence. If a citation opens on a capital word — pull that word out, lowercase it, blend into the sentence.`,
//   `Final check: every quote must be followed by (p. #) or (Chapter X) or (Section X). Any quote with a period inside it or nothing after it is wrong — remove it and write your own sentence. Every narrative citation must mention where in the source it came from.`,
// ];

// // ─── RUN ONE ASSIGNMENT ───────────────────────────────────────────────────────
// async function runAssignment(assignmentNum, assignment, workerPage, reviewerPage, checkerPage) {
//   console.log("\n" + "█".repeat(60));
//   console.log(`  ASSIGNMENT ${assignmentNum}`);
//   console.log("█".repeat(60));

//   // Launch one Yuzu browser per source book and read text
//   console.log(`\n  Reading source books from Yuzu (${assignment.sources.length} book(s))...`);
//   const sourceResults = [];

//   for (let i = 0; i < assignment.sources.length; i++) {
//     const { browser, text, source } = await launchYuzuReader(assignment.sources[i], i);
//     sourceResults.push({ browser, text, source });
//     console.log(`  Book ${i + 1} text captured: ${text.length} chars`);
//   }

//   // Round 0 — send directions + captured source text to Worker
//   console.log(`\n${"=".repeat(60)}`);
//   console.log(`  ROUND 0 — Directions + book text → Worker`);
//   console.log(`${"=".repeat(60)}\n`);

//   await sendMessage(workerPage, buildFirstPrompt(assignment.directions, sourceResults), "WORKER");
//   let lastResponse = await waitForResponse(workerPage, "WORKER");

//   // Citation review rounds
//   for (let i = 0; i < FOLLOWUP_PROMPTS.length; i++) {
//     const round = i + 1;
//     console.log(`\n${"=".repeat(60)}\n  CITATION ROUND ${round}\n${"=".repeat(60)}`);

//     let citationApproved = false;
//     let attempt = 0;

//     while (!citationApproved) {
//       attempt++;
//       console.log(`\n  Attempt ${attempt} — Citation Round ${round}`);

//       if (attempt === 1) {
//         await sendMessage(workerPage, FOLLOWUP_PROMPTS[i], "WORKER");
//         lastResponse = await waitForResponse(workerPage, "WORKER");
//       }

//       const violations = scanCitations(lastResponse);
//       console.log(`  [SCANNER] ${violations.length ? violations.length + " violation(s)" : "No violations"}`);
//       violations.forEach((v, i) => console.log(`    ${i + 1}. Rule ${v.rule} — ${v.bad.substring(0, 80)}`));

//       await sendMessage(reviewerPage, buildReviewerPrompt(lastResponse, buildEvidenceReport(violations)), "CITATION REVIEWER");
//       const feedback = await waitForResponse(reviewerPage, "CITATION REVIEWER");
//       console.log(`\n  CITATION REVIEWER:\n  ` + feedback.split("\n").join("\n  "));

//       const passed = feedback.includes("OVERALL RESULT: PASS");
//       const failed = feedback.includes("OVERALL RESULT: FAIL") || feedback.toLowerCase().includes("violation");

//       if (passed && !failed) {
//         console.log(`\n  Citation Round ${round} PASSED.\n`);
//         citationApproved = true;
//       } else {
//         await sendMessage(workerPage, buildCorrectionPrompt(feedback, violations), "WORKER");
//         lastResponse = await waitForResponse(workerPage, "WORKER");
//         await sleep(2000);
//       }
//     }
//     await sleep(2000);
//   }

//   // Directions check
//   console.log(`\n${"=".repeat(60)}\n  DIRECTIONS CHECK\n${"=".repeat(60)}`);
//   let directionsApproved = false;
//   let dirAttempt = 0;

//   while (!directionsApproved) {
//     dirAttempt++;
//     console.log(`\n  Directions Check Attempt ${dirAttempt}...`);

//     await sendMessage(checkerPage, buildDirectionsCheckerPrompt(lastResponse, assignment.directions), "DIRECTIONS CHECKER");
//     const checkerFeedback = await waitForResponse(checkerPage, "DIRECTIONS CHECKER");
//     console.log(`\n  DIRECTIONS CHECKER:\n  ` + checkerFeedback.split("\n").join("\n  "));

//     if (checkerFeedback.includes("DIRECTIONS RESULT: PASS")) {
//       console.log(`\n  Directions Check PASSED.\n`);
//       directionsApproved = true;
//     } else {
//       await sendMessage(workerPage, buildDirectionsRewritePrompt(checkerFeedback), "WORKER");
//       lastResponse = await waitForResponse(workerPage, "WORKER");

//       // Re-run citation scan on rewrite
//       const rewriteViolations = scanCitations(lastResponse);
//       if (rewriteViolations.length) {
//         await sendMessage(reviewerPage, buildReviewerPrompt(lastResponse, buildEvidenceReport(rewriteViolations)), "CITATION REVIEWER");
//         const rFeedback = await waitForResponse(reviewerPage, "CITATION REVIEWER");
//         if (!rFeedback.includes("OVERALL RESULT: PASS")) {
//           await sendMessage(workerPage, buildCorrectionPrompt(rFeedback, rewriteViolations), "WORKER");
//           lastResponse = await waitForResponse(workerPage, "WORKER");
//         }
//       }
//       await sleep(2000);
//     }
//   }

//   // Close Yuzu browsers for this assignment
//   for (const { browser } of sourceResults) {
//     await browser.close();
//   }

//   console.log(`\n${"=".repeat(60)}`);
//   console.log(`  ASSIGNMENT ${assignmentNum} COMPLETE`);
//   console.log(`  Citations: PASS  |  Directions: PASS`);
//   console.log(`  Copy the final assignment from the Worker window.`);
//   console.log(`${"=".repeat(60)}\n`);

//   return lastResponse;
// }

// // ─── MAIN ─────────────────────────────────────────────────────────────────────
// (async () => {
//   console.log("█".repeat(60));
//   console.log("  GEMINI THREE-AI + YUZU BOOK READER PIPELINE");
//   console.log("█".repeat(60));
//   console.log("  Window 1 — WORKER            writes the assignment");
//   console.log("  Window 2 — CITATION REVIEWER checks citation format");
//   console.log("  Window 3 — DIRECTIONS CHECKER checks all points covered");
//   console.log("  Window(s) — YUZU READERS     one per source book per assignment");
//   console.log("");
//   console.log(`  ${ASSIGNMENTS.length} assignment(s) queued. Running in order.`);
//   console.log("█".repeat(60) + "\n");

//   // Open the three Gemini AI windows
//   const { browser: wBrowser, page: workerPage }   = await openGeminiBrowser("worker",   "WORKER");
//   const { browser: rBrowser, page: reviewerPage } = await openGeminiBrowser("reviewer", "CITATION REVIEWER");
//   const { browser: cBrowser, page: checkerPage }  = await openGeminiBrowser("checker",  "DIRECTIONS CHECKER");

//   // Wait for all three to land on Gemini
//   const allPages = [workerPage, reviewerPage, checkerPage];
//   const needsLogin = allPages.some(p => p.url().includes("accounts.google.com"));
//   if (needsLogin) {
//     console.log("\n" + "!".repeat(60));
//     console.log("  Sign into Google in ALL THREE Gemini windows.");
//     console.log("  Script waits until all three are on Gemini.");
//     console.log("!".repeat(60));
//     await Promise.all(allPages.map(p =>
//       p.waitForFunction(() => location.href.includes("gemini.google.com"), { timeout: 120000, polling: 1000 })
//     ));
//   }

//   // Wait for input boxes
//   for (const [p, label] of [[workerPage, "WORKER"], [reviewerPage, "CITATION REVIEWER"], [checkerPage, "DIRECTIONS CHECKER"]]) {
//     await p.waitForFunction(
//       () => !!document.querySelector('rich-textarea div[contenteditable="true"], div[contenteditable="true"], div[role="textbox"], textarea'),
//       { timeout: 30000, polling: 1000 }
//     ).catch(() => console.warn(`  [${label}] Input wait timed out`));
//   }

//   await sleep(2000);
//   console.log("All three Gemini windows ready.\n");

//   // Run each assignment in order
//   for (let i = 0; i < ASSIGNMENTS.length; i++) {
//     await runAssignment(i + 1, ASSIGNMENTS[i], workerPage, reviewerPage, checkerPage);

//     if (i < ASSIGNMENTS.length - 1) {
//       console.log("Moving to next assignment in 5 seconds...\n");
//       await sleep(5000);
//     }
//   }

//   console.log("\n" + "█".repeat(60));
//   console.log("  ALL ASSIGNMENTS COMPLETE");
//   console.log("█".repeat(60) + "\n");

//   // Windows stay open so you can copy final assignments
//   // Uncomment to close:
//   // await wBrowser.close();
//   // await rBrowser.close();
//   // await cBrowser.close();
// })();


class man{
 male = true

 isAlive(){
  console.log("true")
 }
}



class me extends man{

    name = "warren"


}

const Me = new me()

console.log(Me.name)
console.log(Me.male)
console.log(Me.isAlive())
console.log("w")