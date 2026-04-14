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
//    INCORRECT:      "students must read widely and deeply" (p. 10).
//    CORRECT: The source states "students must read widely and deeply" (p. 10).

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



















































////////three + how many ever needed ai puppeter driven text finder for work ai loop thrid ai dose not work for some odd resone







////////every thing below this is for mod 4 chat




// import puppeteer from "puppeteer";

// // ╔════════════════════════════════════════════════════════════════════╗
// // ║                                                                    ║
// // ║   ASSIGNMENTS — fill in your assignments here                     ║
// // ║                                                                    ║
// // ║   For each assignment set:                                        ║
// // ║   - directions: the full assignment prompt                        ║
// // ║   - sources: one entry per book                                   ║
// // ║       bookTitle  — exact title as it appears on Yuzu              ║
// // ║       author     — author last name to confirm correct book       ║
// // ║       authorLastFirst — full name for APA reference list          ║
// // ║       date       — publication year                               ║
// // ║       publisher  — publisher name for reference list              ║
// // ║       chapters   — array of chapter names to read                 ║
// // ║                    Puppeteer opens each chapter and reads         ║
// // ║                    pages forward until the chapter ends.          ║
// // ║                    The AI decides which pages to cite.            ║
// // ║       maxPagesPerChapter — safety limit on pages read per chapter ║
// // ║                                                                    ║
// // ║   - manualText (OPTIONAL):                                        ║
// // ║       Paste any extra text here you want the AI to use.          ║
// // ║       Include PAGE, CHAPTER, SECTION, AUTHOR, DATE, EXACT TEXT.  ║
// // ║       Leave as empty string "" if you do not need it.            ║
// // ║                                                                    ║
// // ╚════════════════════════════════════════════════════════════════════╝

// const ASSIGNMENTS = [
//   {
//     directions: `
//       Based on your assigned readings and in-class activities, you will analyze a video
//       to identify teaching strategies that promote oral language, comprehension, vocabulary
//       development and home-school connections within a classroom setting.

//       The analysis table must:
//       1. Examine how the teacher supported students in using science talk
//       2. Determine strategies used to introduce and reinforce science vocabulary
//       3. Examine how visual tools or hands-on activities contribute to student talk and understanding
//       4. Determine if students were encouraged to use key terms in discussion or writing
//       5. Explore how the teacher promoted speaking and listening skills
//       6. Explore one way this science lesson could be extended at home
//       7. Investigate how you could modify a strategy for diverse learners

//       Include a 200-300 word summary with APA 7th Edition citations.
//     `,

//     sources: [
//       {
//         bookTitle: "Literacy in Elementary Education, Grades 3-6",
//         author: "Ramlal",
//         authorLastFirst: "Ramlal, S. R.",
//         date: "2023",
//         publisher: "Cognella Academic Publishing",
//         vbid: "826802A",
//         chapters: ["Chapter 3"],
//         maxPagesPerChapter: 20,
//       },
//     ],

//     manualText: `
// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 24
// CHAPTER: does not have one
// SECTION: does not have one

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

// Module 1 - Introducing the Case
// Elsa believes that for many children, what happens in kindergarten affects students' feelings about and learning in school for the rest of their lives. She is beginning to ask questions of herself and rethink her approach to teaching science. Knowing that her students become engaged whenever they are using their senses to explore objects and phenomena,
// ---

// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 25
// CHAPTER: does not have one
// SECTION: does not have one

// EXACT TEXT:
// Elsa wants to build upon her students' natural inclination to learn by making their own discoveries. She hopes to extend this type of learning to meaningful expressions of students' understandings.

// Module 2 - Trying New Ideas
// Jeff Winokur, an early childhood science educator at Wheelock College, has observed in his teaching practice that young students cherish playing with materials and that this fascination can be put to use to help them make scientific discoveries. During students' discovery of magnets, Elsa takes a guided discovery approach by getting students to work with a partner as she circulates through the classroom, helping them move toward making specific discoveries.
// ---

// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 26
// CHAPTER: does not have one
// SECTION: does not have one

// EXACT TEXT:
// After working in pairs, where materials are shared, each student completes a worksheet that reflects his or her findings about materials through which a magnetic force can travel. Later, the class reviews the worksheets together. Elsa believes that when students take their worksheets home, students' understandings are again reinforced when shared with family members.
// ---

// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 27
// CHAPTER: does not have one
// SECTION: does not have one

// EXACT TEXT:
// Module 3 - Reflecting and Building on Change
// As the year progresses, Elsa is convinced that science has become her students' favorite activity period. As part of her final science unit, Elsa invites her students to mix food coloring in water to find out what happens. Elsa is learning that with discovery activities, even though a scientific concept is not necessarily being discovered, her students are making their own discoveries and beginning to build new knowledge.
// ---
//     `,
//   },
// ];

// // ════════════════════════════════════════════════════════════
// // SOURCE TEXT STORE — populated automatically
// // ════════════════════════════════════════════════════════════

// const SOURCE_TEXT_STORE = [];

// // ════════════════════════════════════════════════════════════
// // Everything below runs automatically.
// // ════════════════════════════════════════════════════════════

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// const YUZU_LIBRARY = "https://reader.yuzu.com/home/my-library";
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

// // ─── YUZU PAGE READER ─────────────────────────────────────────────────────────

// async function readYuzuBook(source, profileIndex) {
//   const label = `YUZU-${profileIndex + 1}`;
//   const chapters = source.chapters || [source.chapter].filter(Boolean);
//   console.log(`\n  [${label}] Book: "${source.bookTitle}"`);
//   console.log(`  [${label}] Chapters to read: ${chapters.join(", ")}`);

//   const browser = await puppeteer.launch({
//     ...launchOptions,
//     args: [
//       ...launchOptions.args,
//       `--user-data-dir=C:\\Temp\\puppeteer-yuzu-${profileIndex}`,
//     ],
//   });

//   const page = await browser.newPage();
//   await page.evaluateOnNewDocument(() => {
//     Object.defineProperty(navigator, "webdriver", { get: () => false });
//     window.chrome = { runtime: {} };
//   });

//   await page.goto(YUZU_LIBRARY, { waitUntil: "domcontentloaded", timeout: 60000 });
//   await sleep(5000);

//   if (page.url().includes("sign-in") || page.url().includes("#sign") || page.url().includes("login")) {
//     console.log(`  [${label}] Not logged in — sign into Yuzu in this window.`);
//     await page.waitForFunction(
//       () => location.href.includes("my-library") || location.href.includes("dashboard"),
//       { timeout: 180000, polling: 2000 }
//     );
//     await sleep(4000);
//     console.log(`  [${label}] Signed in.`);
//   }

//   let readerUrl = null;

//   if (source.vbid) {
//     readerUrl = `https://reader.yuzu.com/reader/books/${source.vbid}`;
//     console.log(`  [${label}] Using provided VBID: ${readerUrl}`);
//   } else {
//     console.log(`  [${label}] Searching library for: "${source.bookTitle}"`);
//     await page.waitForFunction(
//       () => document.querySelectorAll("a[href*='reader/books']").length > 0,
//       { timeout: 20000, polling: 1000 }
//     ).catch(() => console.log(`  [${label}] Library card wait timed out`));

//     readerUrl = await page.evaluate((title) => {
//       const links = document.querySelectorAll("a[href*='reader/books']");
//       for (const link of links) {
//         const ariaLabel = link.getAttribute("aria-label") || "";
//         const linkText = link.innerText || "";
//         if (
//           ariaLabel.toLowerCase().includes(title.toLowerCase()) ||
//           linkText.toLowerCase().includes(title.toLowerCase())
//         ) {
//           return link.href.split("?")[0];
//         }
//       }
//       const allEls = document.querySelectorAll("*");
//       for (const el of allEls) {
//         if (
//           el.children.length === 0 &&
//           el.innerText &&
//           el.innerText.toLowerCase().includes(title.toLowerCase()) &&
//           el.innerText.length < 200
//         ) {
//           let node = el;
//           for (let i = 0; i < 10; i++) {
//             if (!node) break;
//             const a = node.querySelector ? node.querySelector("a[href*='reader/books']") : null;
//             if (a) return a.href.split("?")[0];
//             if (node.tagName === "A" && node.href && node.href.includes("reader/books")) {
//               return node.href.split("?")[0];
//             }
//             node = node.parentElement;
//           }
//         }
//       }
//       return null;
//     }, source.bookTitle);

//     if (readerUrl) {
//       console.log(`  [${label}] Found book URL: ${readerUrl}`);
//     } else {
//       console.error(`  [${label}] ERROR: Could not find "${source.bookTitle}" in library.`);
//       await browser.close();
//       return;
//     }
//   }

//   console.log(`  [${label}] Opening book reader...`);
//   await page.goto(readerUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
//   await sleep(6000);

//   await page.waitForFunction(
//     () => {
//       const hasInput  = document.querySelector("input[type='number']");
//       const hasIframe = document.querySelector("iframe[src*='jigsaw'], iframe[title], iframe[name]");
//       const hasReader = location.href.includes("/reader/books/");
//       return hasReader && (hasInput || hasIframe);
//     },
//     { timeout: 30000, polling: 1000 }
//   ).catch(() => console.log(`  [${label}] Reader load wait timed out — continuing`));

//   await sleep(3000);
//   console.log(`  [${label}] Reader open.`);

//   for (const chapterName of chapters) {
//     console.log(`\n  [${label}] Navigating to: ${chapterName}`);

//     await page.evaluate(() => {
//       const btns = Array.from(document.querySelectorAll("button, [role='button']"));
//       for (const btn of btns) {
//         const lbl = (
//           btn.getAttribute("aria-label") ||
//           btn.getAttribute("title") ||
//           btn.innerText || ""
//         ).toLowerCase();
//         if (
//           lbl.includes("table of contents") ||
//           lbl.includes("contents") ||
//           lbl.includes("toc") ||
//           lbl === "menu" ||
//           lbl.includes("sidebar") ||
//           lbl.includes("main menu")
//         ) {
//           btn.click(); return;
//         }
//       }
//       const firstBtn = document.querySelector("header button, nav button, [class*='header'] button");
//       if (firstBtn) firstBtn.click();
//     });

//     await sleep(2500);

//     const chapterNum = chapterName.replace(/\D/g, "");
//     const chapterClicked = await page.evaluate((chap, chapNum) => {
//       const candidates = Array.from(document.querySelectorAll(
//         "nav a, nav button, [class*='toc'] a, [class*='toc'] button, " +
//         "[class*='chapter'] a, [class*='contents'] a, aside a, " +
//         "[role='navigation'] a, [role='listitem'] a"
//       ));
//       for (const el of candidates) {
//         const text = (el.innerText || el.textContent || "").toLowerCase().trim();
//         if (
//           text.includes(chap.toLowerCase()) ||
//           (chapNum && (
//             text.startsWith(chapNum + " ") ||
//             text.startsWith(chapNum + ".") ||
//             text.includes("chapter " + chapNum)
//           ))
//         ) {
//           el.click(); return true;
//         }
//       }
//       return false;
//     }, chapterName, chapterNum);

//     if (!chapterClicked) {
//       console.log(`  [${label}] Chapter not found in TOC — reading from current position`);
//     } else {
//       console.log(`  [${label}] Chapter clicked in TOC`);
//     }

//     await page.evaluate(() => {
//       const btns = Array.from(document.querySelectorAll("button, [role='button']"));
//       for (const btn of btns) {
//         const lbl = (btn.getAttribute("aria-label") || btn.innerText || "").toLowerCase();
//         if (lbl.includes("close") || lbl.includes("dismiss")) { btn.click(); return; }
//       }
//     });

//     await sleep(4000);

//     const startPage = await page.evaluate(() => {
//       const inputs = document.querySelectorAll("input");
//       for (const input of inputs) {
//         if (input.type === "number" || input.className?.includes("page")) {
//           const val = parseInt(input.value, 10);
//           if (!isNaN(val) && val > 0) return val;
//         }
//       }
//       const match = document.body.innerText.match(/\b(\d+)\s*\/\s*(\d+)\b/);
//       if (match) return parseInt(match[1], 10);
//       return null;
//     });

//     console.log(`  [${label}] Chapter starts at page: ${startPage || "unknown"}`);

//     const maxPages = source.maxPagesPerChapter || 20;
//     let lastExtractedText = "";
//     let noTextCount = 0;

//     for (let offset = 0; offset < maxPages; offset++) {
//       await sleep(3000);

//       const screenshotBuffer = await page.screenshot({ type: "png", fullPage: false });
//       const base64Screenshot = screenshotBuffer.toString("base64");

//       console.log(`  [${label}] Page ${offset + 1}: screenshot ${Math.round(base64Screenshot.length / 1024)}kb — sending to vision...`);

//       let extractedText = "";
//       let extractedPageNum = null;

//       try {
//         const response = await fetch("https://api.anthropic.com/v1/messages", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             model: "claude-sonnet-4-20250514",
//             max_tokens: 2000,
//             messages: [{
//               role: "user",
//               content: [
//                 {
//                   type: "image",
//                   source: {
//                     type: "base64",
//                     media_type: "image/png",
//                     data: base64Screenshot,
//                   },
//                 },
//                 {
//                   type: "text",
//                   text: `This is a screenshot of a page from a textbook shown in the Yuzu ebook reader.

// Your job:
// 1. Read ALL the text visible on the book page inside the reader.
// 2. Find the page number shown at the bottom of the reader (e.g. "20 / 89" means page 20).
// 3. Tell me if this page is still part of "${chapterName}" or if a new chapter has started.

// Respond in this exact format and nothing else:

// PAGE_NUMBER: [the number, or UNKNOWN if not visible]
// NEW_CHAPTER: [YES if a different chapter started on this page, NO if still in ${chapterName}]
// TEXT:
// [copy every single word of book text visible on this page, word for word, preserving paragraph breaks]`,
//                 },
//               ],
//             }),
//           }),
//         });

//         const data = await response.json();
//         const raw = data.content?.[0]?.text || "";

//         const pageMatch      = raw.match(/PAGE_NUMBER:\s*(\d+|UNKNOWN)/i);
//         const chapterEndMatch = raw.match(/NEW_CHAPTER:\s*(YES|NO)/i);
//         const textMatch      = raw.match(/TEXT:\s*([\s\S]+)/i);

//         extractedPageNum = pageMatch && pageMatch[1] !== "UNKNOWN"
//           ? parseInt(pageMatch[1], 10)
//           : (startPage ? startPage + offset : null);

//         extractedText = textMatch ? textMatch[1].trim() : "";

//         const chapterEnded = chapterEndMatch && chapterEndMatch[1].toUpperCase() === "YES";

//         console.log(`  [${label}] page=${extractedPageNum}, chapterEnded=${chapterEnded}, textLen=${extractedText.length}`);

//         if (chapterEnded && offset > 0) {
//           console.log(`  [${label}] New chapter detected — stopping ${chapterName}.`);
//           break;
//         }

//       } catch (err) {
//         console.error(`  [${label}] Vision API error: ${err.message}`);
//         extractedText = "";
//       }

//       if (extractedText && extractedText.length > 100) {
//         if (extractedText === lastExtractedText) {
//           console.log(`  [${label}] Same text as previous page — stuck. Stopping.`);
//           break;
//         }
//         lastExtractedText = extractedText;
//         noTextCount = 0;

//         console.log(`  [${label}] p.${extractedPageNum}: ${extractedText.length} chars stored`);
//         SOURCE_TEXT_STORE.push({
//           bookTitle:       source.bookTitle,
//           author:          source.author,
//           authorLastFirst: source.authorLastFirst,
//           date:            source.date,
//           publisher:       source.publisher || "",
//           chapter:         chapterName,
//           page:            extractedPageNum || (startPage ? startPage + offset : offset + 1),
//           text:            extractedText,
//         });
//       } else {
//         noTextCount++;
//         console.warn(`  [${label}] No usable text (${extractedText?.length || 0} chars).`);
//         if (noTextCount >= 3) {
//           console.log(`  [${label}] 3 consecutive empty pages — stopping.`);
//           break;
//         }
//       }

//       const nextClicked = await page.evaluate(() => {
//         const btns = Array.from(document.querySelectorAll("button, a, [role='button']"));
//         for (const btn of btns) {
//           const lbl = (
//             btn.getAttribute("aria-label") ||
//             btn.getAttribute("title") ||
//             btn.innerText || ""
//           ).toLowerCase().trim();
//           if (lbl === "next" || lbl === "next page" || lbl.includes("next page") || lbl === ">") {
//             btn.click(); return true;
//           }
//         }
//         const arrows = document.querySelectorAll("[class*='next'], [aria-label*='next' i]");
//         for (const a of arrows) {
//           if (a.tagName === "BUTTON" || a.tagName === "A") { a.click(); return true; }
//         }
//         return false;
//       });

//       if (!nextClicked) await page.keyboard.press("ArrowRight");
//     }
//   } // end chapter loop

//   const stored = SOURCE_TEXT_STORE.filter(e => e.bookTitle === source.bookTitle);
//   console.log(`\n  [${label}] Done. ${stored.length} pages stored from "${source.bookTitle}".`);
//   await browser.close();
// }

// // ─── BUILD SOURCE BLOCK ───────────────────────────────────────────────────────

// function buildSourceBlock(entries) {
//   if (!entries.length) return "No source text available.";
//   return entries.map(entry => `
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SOURCE PASSAGE
// Book:    ${entry.bookTitle}
// Author:  ${entry.authorLastFirst} (${entry.date})
// Chapter: ${entry.chapter}
// Page:    p. ${entry.page}
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ${entry.text}
// `.trim()).join("\n\n");
// }

// // ─── BUILD REFERENCE LIST ─────────────────────────────────────────────────────

// function buildReferenceList(sources) {
//   const seen = new Set();
//   const refs = [];
//   for (const s of sources) {
//     const key = `${s.bookTitle}${s.date}`;
//     if (!seen.has(key)) {
//       seen.add(key);
//       refs.push(`${s.authorLastFirst} (${s.date}). *${s.bookTitle}*. ${s.publisher}.`);
//     }
//   }
//   return refs.join("\n");
// }

// // ─── PARSE MANUAL TEXT ────────────────────────────────────────────────────────

// function parseManualText(manualText, assignmentIndex) {
//   if (!manualText || !manualText.trim()) return;

//   const blocks = manualText.split(/^---\s*$/m).filter(b => b.trim());
//   let added = 0;

//   for (const block of blocks) {
//     const get = (key) => {
//       const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, "im"));
//       return match ? match[1].trim() : "";
//     };

//     const author     = get("AUTHOR");
//     const date       = get("DATE");
//     const pageRaw    = get("PAGE");
//     const chapter    = get("CHAPTER");
//     const section    = get("SECTION");
//     const exactMatch = block.match(/EXACT TEXT:\s*([\s\S]+)/i);
//     const text       = exactMatch ? exactMatch[1].trim() : "";

//     if (!text || text.length < 30) continue;

//     const page = parseInt(pageRaw, 10) || pageRaw;
//     const chapterLabel =
//       (chapter && !chapter.toLowerCase().includes("does not")) ? chapter :
//       (section && !section.toLowerCase().includes("does not")) ? section :
//       "Manual Source";

//     SOURCE_TEXT_STORE.push({
//       bookTitle:       `Manual Source — ${author}`,
//       author:          author.split(" ").pop(),
//       authorLastFirst: author,
//       date,
//       publisher:       "",
//       chapter:         chapterLabel,
//       page,
//       text,
//       isManual:        true,
//     });
//     added++;
//   }

//   if (added > 0) {
//     console.log(`  [MANUAL TEXT] Parsed ${added} passage(s) for assignment ${assignmentIndex + 1}`);
//   }
// }

// // ─── FIRST PROMPT ─────────────────────────────────────────────────────────────

// function buildFirstPrompt(assignment) {
//   const relevantEntries = SOURCE_TEXT_STORE.filter(e =>
//     assignment.sources.some(s => s.bookTitle === e.bookTitle)
//   );

//   const sourceBlock   = buildSourceBlock(relevantEntries);
//   const referenceList = buildReferenceList(
//     relevantEntries.map(e => ({
//       bookTitle:       e.bookTitle,
//       authorLastFirst: e.authorLastFirst,
//       date:            e.date,
//       publisher:       e.publisher || "",
//     }))
//   );

//   return `You are completing an assignment using exact text pulled word for word from textbooks.
// The source passages below are labeled with their exact book, chapter, and page number.
// Use these passages as your ONLY citation sources.

// ${"=".repeat(55)}
// ASSIGNMENT DIRECTIONS:
// ${"=".repeat(55)}
// ${assignment.directions.trim()}

// ${"=".repeat(55)}
// SOURCE TEXT — PULLED WORD FOR WORD FROM TEXTBOOKS:
// (Each block shows the exact book, chapter, and page)
// ${"=".repeat(55)}
// ${sourceBlock}

// ${"=".repeat(55)}
// REFERENCE LIST (use for in-text citations):
// ${"=".repeat(55)}
// ${referenceList}

// ${"=".repeat(55)}
// APA 7TH EDITION CITATION RULES — FOLLOW EVERY ONE:
// ${"=".repeat(55)}

// ━━ PARENTHETICAL CITATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Format A — author intro then quote:
//   Author (date) states "word for word text" (p. #).
//   Author (date) explains "word for word text" (p. #).
//   Author (date) notes "word for word text" (p. #).

// Format B — quote then citation:
//   "word for word text" (Author, date, p. #).
//   "word for word text" (Author, date, pp. #–#).

// RULES:
// 1. Text inside quotes must be EXACTLY word for word from the source above.
// 2. Period goes AFTER the closing parenthesis — NEVER inside the quotes.
//    CORRECT: "word for word text" (Ramlal, 2023, p. 23).
//    WRONG:   "word for word text." (Ramlal, 2023, p. 23).
// 3. Every quote MUST have a citation immediately after it.
// 4. No filler connector words directly before the opening quote.
//    WRONG: such as "word for word text" (Ramlal, 2023, p. 23).
//    CORRECT: Ramlal (2023) states "word for word text" (p. 23).
// 5. If source text starts with a capital letter — pull that first word OUT of the quotes,
//    lowercase it, blend into sentence, quote opens on second word.
// 6. NEVER put quotes around a word or phrase unless a citation immediately follows.

// ━━ NARRATIVE CITATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   According to Author (date), from Chapter X on page #, [sentence].
//   As Author (date) explains in Chapter X on page #, [sentence].

// RULES:
// - Author name before parentheses, date inside.
// - Chapter and page mentioned NATURALLY in the sentence — NEVER inside parentheses.
//   WRONG: Ramlal (2023, Chapter 3, p. 23) states...
//   CORRECT: Ramlal (2023) explains in Chapter 3 on page 23 that...
// - Every narrative citation must reference where in the source it came from.

// ━━ IF IN DOUBT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Drop the citation. Write your own plain sentence.

// ━━ PAGE SELECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// You have passages from multiple pages. Choose the most relevant ones.
// You do not have to cite every page.

// Now complete the assignment. Add a References section at the end.`;
// }

// // ─── GEMINI UTILITIES ─────────────────────────────────────────────────────────

// async function openGeminiBrowser(profileName, label) {
//   console.log(`  Opening ${label} (${profileName})...`);
//   const browser = await puppeteer.launch({
//     ...launchOptions,
//     args: [...launchOptions.args, `--user-data-dir=C:\\Temp\\puppeteer-${profileName}`],
//   });
//   const page = await browser.newPage();
//   await page.evaluateOnNewDocument(() => {
//     Object.defineProperty(navigator, "webdriver", { get: () => false });
//     window.chrome = { runtime: {} };
//   });
//   await page.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
//   return { browser, page };
// }

// async function findInput(page, label) {
//   const selectors = [
//     'rich-textarea div[contenteditable="true"]',
//     'div[contenteditable="true"]',
//     'div[role="textbox"]',
//     'textarea',
//   ];
//   for (const sel of selectors) {
//     try {
//       const el = await page.$(sel);
//       if (el) {
//         const box = await el.boundingBox();
//         if (box && box.width > 0) return { el, sel };
//       }
//     } catch (_) {}
//   }
//   throw new Error(`[${label}] Input box not found`);
// }

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
//       if (el.contentEditable === "true") el.innerText = t;
//       else Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(el, t);
//       el.dispatchEvent(new Event("input",  { bubbles: true }));
//       el.dispatchEvent(new Event("change", { bubbles: true }));
//     }, text, sel);
//   }

//   await sleep(500);
//   const btn = await page.$(
//     'button[aria-label="Send message"], button[aria-label="Submit"], button[jsname="Qx7uuf"]'
//   );
//   if (btn) await btn.click();
//   else await page.keyboard.press("Enter");
//   await sleep(2000);
// }

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
//   else console.log(`  [${label}] ${text.length} chars`);
//   return text;
// }

// // ─── CITATION SCANNER ─────────────────────────────────────────────────────────

// function scanCitations(text) {
//   const violations = [];
//   let m;

//   const r1a = /"([^"]+?)\."\s*\((?:[^)]+)\)/g;
//   while ((m = r1a.exec(text)) !== null)
//     violations.push({ rule: 1, bad: m[0], detail: `Period inside closing quote — must go AFTER closing parenthesis.` });

//   const r1b = /"([^"]{5,}?)\."\s*(?!\s*\()/g;
//   while ((m = r1b.exec(text)) !== null)
//     violations.push({ rule: 1, bad: m[0].trim(), detail: `Period inside closing quote AND no citation after — remove entirely.` });

//   const r2 = /""\s*\([^)]*\)/g;
//   while ((m = r2.exec(text)) !== null)
//     violations.push({ rule: 2, bad: m[0], detail: `Empty quotes — drop and write your own sentence.` });

//   const fillers = ["such as", "like", "known as", "called", "termed", "referred to as"];
//   for (const filler of fillers) {
//     const re = new RegExp(`${filler}\\s+"([^"]{3,}?)"\\s*\\(`, "gi");
//     while ((m = re.exec(text)) !== null)
//       violations.push({ rule: 3, bad: m[0].trim(), detail: `Filler word "${filler}" before opening quote.` });
//   }

//   const r4 = /([A-Z][a-zA-Z\s,&.]+?)\s*\((\d{4})\s*,\s*(?:Chapter|Ch\.?|p\.)\s*[\d\w]+[^)]*\)/g;
//   while ((m = r4.exec(text)) !== null)
//     violations.push({ rule: 4, bad: m[0], detail: `Chapter/page inside parentheses — write location naturally in the sentence.` });

//   const r5 = /(?:According to|As noted by|As stated by|As explained by)\s+([^(]+?)\s*\((\d{4})\)\s*,/gi;
//   while ((m = r5.exec(text)) !== null) {
//     const after = text.substring(m.index + m[0].length, m.index + m[0].length + 300).toLowerCase();
//     if (!after.match(/\b(chapter|section|page|p\.|on page)\b/))
//       violations.push({ rule: 5, bad: m[0].trim(), detail: `Narrative citation missing chapter/page reference.` });
//   }

//   const r6 = /(?:states|notes|explains|writes|argues|suggests|reports|observes)\s+"([A-Z][a-zA-Z']{2,})\s+([^"]{3,}?)"\s*\(/g;
//   while ((m = r6.exec(text)) !== null)
//     violations.push({ rule: 6, bad: `"${m[1]} ${m[2]}"`, detail: `Opening quote starts on capital "${m[1]}" — pull out and lowercase.` });

//   const r7 = /"([^"]{2,60})"\s*(?!\s*\()/g;
//   const hasVerb = /\b(is|are|was|were|has|have|must|should|will|can|does|do|shows|states|notes|explains|suggests)\b/;
//   while ((m = r7.exec(text)) !== null) {
//     if (!hasVerb.test(m[1].toLowerCase()) && m[1].length < 60)
//       violations.push({ rule: 7, bad: m[0].trim(), detail: `Quoted phrase has no citation — remove quotes or add citation.` });
//   }

//   return violations;
// }

// function buildEvidenceReport(violations) {
//   if (!violations.length) return null;
//   let r = `Scanner found ${violations.length} violation(s):\n\n`;
//   violations.forEach((v, i) => {
//     r += `VIOLATION ${i + 1} — Rule ${v.rule}\nWrong: ${v.bad}\nWhy:   ${v.detail}\n\n`;
//   });
//   return r;
// }

// // ─── REVIEWER PROMPT ──────────────────────────────────────────────────────────

// const buildReviewerPrompt = (assignment, evidence) => `You are a strict APA 7th Edition citation reviewer.

// ${evidence ? `Scanner found these violations. Confirm each and check for more:\n\nSCANNER:\n${evidence}` : `Scanner found nothing. Do a thorough manual check.`}

// RULES:
// 1. Period AFTER closing parenthesis — NEVER inside quotes
// 2. Every quote needs a citation immediately after it
// 3. No filler words before opening quote
// 4. No empty quotes
// 5. Opening quote on capital word = pull out and lowercase
// 6. No quotes around terms without citations
// 7. Narrative: chapter/page in the sentence NOT inside parentheses
// 8. Every narrative citation must reference chapter or page in the sentence

// End with: OVERALL RESULT: PASS  or  OVERALL RESULT: FAIL

// Assignment:
// ---
// ${assignment}
// ---`;

// function buildCorrectionPrompt(feedback, violations) {
//   let p = `Fix every citation violation now.\n\n`;
//   violations.forEach((v, i) => {
//     p += `${i + 1}. WRONG: ${v.bad}\n   WHY: ${v.detail}\n   FIX: Remove it. Write your own sentence instead.\n\n`;
//   });
//   p += `Reviewer said:\n${feedback}\n\n`;
//   p += `CORRECT formats:\n`;
//   p += `  Ramlal (2023) states "word for word text" (p. 23).\n`;
//   p += `  "word for word text" (Ramlal, 2023, p. 23).\n`;
//   p += `  According to Ramlal (2023), from Chapter 3 on page 23, ...\n\n`;
//   p += `Period ALWAYS after closing parenthesis. Every quote must have a citation.\n\n`;
//   p += `Rewrite the full assignment now.`;
//   return p;
// }

// // ─── DIRECTIONS CHECKER ───────────────────────────────────────────────────────

// function buildDirectionsCheckerPrompt(assignment, directions) {
//   return `You are checking if a completed assignment covers every requirement in the directions.
// Do NOT check citation format — only check CONTENT coverage.

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
// For each numbered requirement report:
//   POINT: [exact requirement]
//   STATUS: COVERED or MISSING
//   REASON: one sentence

// You MUST end with exactly one of these two lines as the very last line:
// DIRECTIONS RESULT: PASS
// DIRECTIONS RESULT: FAIL`;
// }

// function buildDirectionsRewritePrompt(checkerFeedback) {
//   return `Your assignment is missing required content. Add everything that is missing.

// Checker feedback:
// ${checkerFeedback}

// Keep every existing citation exactly as it is.
// Only add the content that is missing.
// Rewrite the full assignment with the missing points included.`;
// }

// const FOLLOWUP_PROMPTS = [
//   `Review every citation in your assignment. For each parenthetical citation: confirm the text inside the quotes is exactly word for word from the source, the author and date are included, and the period is AFTER the closing parenthesis. For each narrative citation: confirm chapter and page are mentioned naturally in the sentence. Fix any that are wrong.`,
//   `Final citation check: (1) every quoted phrase must have a citation after it — if it does not, remove the quotes and write plainly. (2) Period must be AFTER closing parenthesis — never inside the quotes. (3) No quotes around terms or phrases without citations. Fix everything that does not match.`,
// ];

// // ─── RUN ONE ASSIGNMENT ───────────────────────────────────────────────────────

// async function runAssignment(num, assignment, workerPage, reviewerPage, checkerPage) {
//   console.log("\n" + "█".repeat(60));
//   console.log(`  ASSIGNMENT ${num}`);
//   console.log("█".repeat(60));

//   const relevantEntries = SOURCE_TEXT_STORE.filter(e =>
//     assignment.sources.some(s => s.bookTitle === e.bookTitle)
//   );

//   console.log(`\n  Source text: ${relevantEntries.length} pages from ${assignment.sources.length} book(s)`);
//   relevantEntries.forEach(e =>
//     console.log(`    ${e.bookTitle} — ${e.chapter} — p. ${e.page} (${e.text.length} chars)`)
//   );

//   console.log(`\n${"=".repeat(60)}\n  ROUND 0 — Sending to Worker\n${"=".repeat(60)}\n`);
//   await sendMessage(workerPage, buildFirstPrompt(assignment), "WORKER");
//   let lastResponse = await waitForResponse(workerPage, "WORKER");

//   // Citation rounds
//   for (let i = 0; i < FOLLOWUP_PROMPTS.length; i++) {
//     const round = i + 1;
//     console.log(`\n${"=".repeat(60)}\n  CITATION ROUND ${round}\n${"=".repeat(60)}`);
//     let approved = false;
//     let attempt  = 0;

//     while (!approved) {
//       attempt++;
//       console.log(`\n  Attempt ${attempt}`);

//       if (attempt === 1) {
//         await sendMessage(workerPage, FOLLOWUP_PROMPTS[i], "WORKER");
//         lastResponse = await waitForResponse(workerPage, "WORKER");
//       }

//       const violations = scanCitations(lastResponse);
//       console.log(`  [SCANNER] ${violations.length ? violations.length + " violation(s)" : "Clean"}`);
//       violations.forEach((v, i) => console.log(`    ${i + 1}. Rule ${v.rule} — ${v.bad.substring(0, 80)}`));

//       await sendMessage(reviewerPage, buildReviewerPrompt(lastResponse, buildEvidenceReport(violations)), "CITATION REVIEWER");
//       const feedback = await waitForResponse(reviewerPage, "CITATION REVIEWER");
//       console.log(`\n  CITATION REVIEWER:\n  ` + feedback.split("\n").join("\n  "));

//       const passed = feedback.includes("OVERALL RESULT: PASS");
//       const failed = feedback.includes("OVERALL RESULT: FAIL") || feedback.toLowerCase().includes("violation");

//       if (passed && !failed) {
//         console.log(`\n  Citation Round ${round} PASSED.\n`);
//         approved = true;
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
//   let dirApproved = false;
//   let dirAttempt  = 0;

//   while (!dirApproved) {
//     dirAttempt++;
//     console.log(`\n  Directions Attempt ${dirAttempt}`);

//     await sendMessage(checkerPage, buildDirectionsCheckerPrompt(lastResponse, assignment.directions), "DIRECTIONS CHECKER");
//     const checkerFeedback = await waitForResponse(checkerPage, "DIRECTIONS CHECKER");
//     console.log(`\n  DIRECTIONS CHECKER:\n  ` + checkerFeedback.split("\n").join("\n  "));

//     if (checkerFeedback.includes("DIRECTIONS RESULT: PASS")) {
//       console.log(`\n  Directions Check PASSED.\n`);
//       dirApproved = true;

//     } else if (checkerFeedback.includes("DIRECTIONS RESULT: FAIL")) {
//       console.log(`\n  Directions Check FAILED — sending gaps to Worker...\n`);
//       await sendMessage(workerPage, buildDirectionsRewritePrompt(checkerFeedback), "WORKER");
//       lastResponse = await waitForResponse(workerPage, "WORKER");

//       const rv = scanCitations(lastResponse);
//       if (rv.length) {
//         await sendMessage(reviewerPage, buildReviewerPrompt(lastResponse, buildEvidenceReport(rv)), "CITATION REVIEWER");
//         const rf = await waitForResponse(reviewerPage, "CITATION REVIEWER");
//         if (!rf.includes("OVERALL RESULT: PASS")) {
//           await sendMessage(workerPage, buildCorrectionPrompt(rf, rv), "WORKER");
//           lastResponse = await waitForResponse(workerPage, "WORKER");
//         }
//       }
//       await sleep(2000);

//     } else {
//       // No verdict — send reminder
//       console.log(`  [DIRECTIONS CHECKER] No verdict — sending reminder...`);
//       if (dirAttempt >= 4) {
//         console.log(`  [DIRECTIONS CHECKER] No verdict after 4 attempts — moving on.`);
//         dirApproved = true;
//       } else {
//         await sendMessage(
//           checkerPage,
//           `You forgot the required verdict line. End your response with exactly one of:\n\nDIRECTIONS RESULT: PASS\n\nor\n\nDIRECTIONS RESULT: FAIL`,
//           "DIRECTIONS CHECKER"
//         );
//         const reminder = await waitForResponse(checkerPage, "DIRECTIONS CHECKER");
//         if (reminder.includes("DIRECTIONS RESULT: PASS")) {
//           console.log(`\n  Directions Check PASSED.\n`);
//           dirApproved = true;
//         } else if (reminder.includes("DIRECTIONS RESULT: FAIL")) {
//           console.log(`\n  Directions Check FAILED — sending gaps to Worker...\n`);
//           await sendMessage(workerPage, buildDirectionsRewritePrompt(reminder), "WORKER");
//           lastResponse = await waitForResponse(workerPage, "WORKER");
//           const rv = scanCitations(lastResponse);
//           if (rv.length) {
//             await sendMessage(reviewerPage, buildReviewerPrompt(lastResponse, buildEvidenceReport(rv)), "CITATION REVIEWER");
//             const rf = await waitForResponse(reviewerPage, "CITATION REVIEWER");
//             if (!rf.includes("OVERALL RESULT: PASS")) {
//               await sendMessage(workerPage, buildCorrectionPrompt(rf, rv), "WORKER");
//               lastResponse = await waitForResponse(workerPage, "WORKER");
//             }
//           }
//         }
//         await sleep(2000);
//       }
//     }
//   } // ← this closing brace was missing — ends the while (!dirApproved) loop

//   console.log(`\n${"█".repeat(60)}`);
//   console.log(`  ASSIGNMENT ${num} COMPLETE`);
//   console.log(`  Copy final assignment from the Worker window.`);
//   console.log(`${"█".repeat(60)}\n`);

//   return lastResponse;
// } // ← ends runAssignment

// // ─── MAIN ─────────────────────────────────────────────────────────────────────

// (async () => {
//   console.log("█".repeat(60));
//   console.log("  GEMINI 3-AI + YUZU READER PIPELINE");
//   console.log("█".repeat(60));
//   console.log(`  ${ASSIGNMENTS.length} assignment(s) queued.\n`);

//   console.log("STEP 1 — Reading source books + parsing manual text...\n");
//   let yuzuIndex = 0;
//   for (let ai = 0; ai < ASSIGNMENTS.length; ai++) {
//     const assignment = ASSIGNMENTS[ai];
//     if (assignment.manualText && assignment.manualText.trim()) {
//       parseManualText(assignment.manualText, ai);
//     }
//     for (const source of assignment.sources) {
//       await readYuzuBook(source, yuzuIndex++);
//     }
//   }

//   console.log(`\nAll source text read. ${SOURCE_TEXT_STORE.length} total pages stored.`);
//   SOURCE_TEXT_STORE.forEach(e =>
//     console.log(`  ${e.bookTitle} — ${e.chapter} — p. ${e.page} — ${e.text.length} chars`)
//   );

//   console.log("\nSTEP 2 — Opening Gemini AI windows...\n");
//   const { browser: wBrowser, page: workerPage }   = await openGeminiBrowser("worker",   "WORKER");
//   const { browser: rBrowser, page: reviewerPage } = await openGeminiBrowser("reviewer", "CITATION REVIEWER");
//   const { browser: cBrowser, page: checkerPage }  = await openGeminiBrowser("checker",  "DIRECTIONS CHECKER");

//   const allPages = [workerPage, reviewerPage, checkerPage];
//   const needsLogin = allPages.some(p => p.url().includes("accounts.google.com"));
//   if (needsLogin) {
//     console.log("\n  Sign into Google in ALL THREE Gemini windows.");
//     await Promise.all(allPages.map(p =>
//       p.waitForFunction(() => location.href.includes("gemini.google.com"), { timeout: 180000, polling: 1000 })
//     ));
//   }

//   for (const [p, label] of [
//     [workerPage,   "WORKER"],
//     [reviewerPage, "CITATION REVIEWER"],
//     [checkerPage,  "DIRECTIONS CHECKER"],
//   ]) {
//     await p.waitForFunction(
//       () => !!document.querySelector(
//         'rich-textarea div[contenteditable="true"], div[contenteditable="true"], div[role="textbox"], textarea'
//       ),
//       { timeout: 30000, polling: 1000 }
//     ).catch(() => console.warn(`  [${label}] Input wait timed out`));
//   }

//   await sleep(2000);
//   console.log("\nAll Gemini windows ready.\n");

//   console.log("STEP 3 — Running assignments...\n");
//   for (let i = 0; i < ASSIGNMENTS.length; i++) {
//     await runAssignment(i + 1, ASSIGNMENTS[i], workerPage, reviewerPage, checkerPage);
//     if (i < ASSIGNMENTS.length - 1) {
//       console.log("Next assignment in 5 seconds...\n");
//       await sleep(5000);
//     }
//   }

//   console.log("\n" + "█".repeat(60));
//   console.log("  ALL ASSIGNMENTS COMPLETE");
//   console.log("█".repeat(60) + "\n");

//   // await wBrowser.close(); await rBrowser.close(); await cBrowser.close();
// })();






















































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
//    can open directly on that word if and only if you can fether in words to make it fit in complete sentence — no change needed. And if it dose start with a uppercase letter it can be used if and only if it dose not complete a full sentence
//    SOURCE TEXT:  students must read widely and deeply
//    CORRECT only if you can fether in words to make it fit:    fether words "students must read widely and deeply" (p. 10).

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
// can include Chapter && section || section || Chapter && section && page
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
// // WRONG:   sentence (2024, Chapter 6, Section 2).
// WRONG:   sentence (2024, Chapter 6, Section 2).
// WRONG:   sentence (auther, 2024).
// WRONG:   sentence (anything in these or even if it is emptey).

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
// I read to my students every day. I always wanted to use my read-aloud time to capture their interests and make reading fun. So, I thought it would be a good idea to allow the students to select the books we'd read. It seemed to be working just fine. Then, I had students take a practice state test. In this practice test, they scored very well when reading and writing about fictional passages. However, they struggled quite a bit with informational passages. During the first few months prior to the practice test, nearly all of the read-aloud books were fictional. This helped me see the importance of varying the genres I used in my read-alouds. It also confirmed what an important instructional tool a read-aloud can be.
// INTRODUCTION: COMPREHENSION In Chapter 2, we explored the connections accuracy, fluency, and vocabulary may have to a student's comprehension of a text. In this chapter, we will delve more deeply into the aspects we must consider when teaching reading as it relates to comprehension.
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
// the grade to ensure you are meeting grade-level expectations. Also, be sure to vary the format of the genres used by including a mixture of print-based and digital texts. Creating such varied exposure to reading materials can have a positive impact on how students' comprehension develops. It can also promote engagement and an overall love of reading.

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
// • making predictions using clues in the text (comprehension) • making an inference about the character's feelings using clues in the text (comprehension)
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
// • When setting an instructional purpose for a read aloud, consider the needs of the whole class as they relate to accuracy, fluency, vocabulary, and/or comprehension. vary the read-aloud to address both skills and strategies. However, at times, you should set no instructional purpose for the read-aloud to promote a "reading for fun" message.
// • Use a checklist or some other means to vary the genres of texts used for a read-aloud (see Table 3.1).
// • Use read-alouds to develop vocabulary, promote student-led discussions, and encourage listening comprehension. Plan questions and stopping points ahead of time.
// • Use read-alouds to make content-area connections and/or teach purposeful life skills (e.g., dealing with bullying, sharing, friendship).
// • Use read-alouds to make meaningful connections to students' lives and/or expose students to new experiences and ideas that will support their learning in the future.
// • Preview the topics in the read-aloud before reading to the class. There may be concepts or terms that are not appropriate for the grade level or individual students in the class.
// • Select read-aloud topics that consider a broad view of diversity: cultural, linguistic, or geographical, or about students with disabilities, gender stereotypes, family structures, popular culture, and so on.
// When planning for a read-aloud, follow the procedures below:
// • Before Reading: Have a discussion to introduce the book and activate prior knowledge. If you have already read part of the book, have a discussion to introduce the new section or chapter and review what was read previously. Then review key details from the previous day's read-aloud. Try to allow students to do most of the talking.
// • During Reading: Plan out stopping points to discuss the text or to ask and answer questions. Or simply use the stopping points for students to reflect on the read-aloud before continuing

// ---
// `;

// // ════════════════════════════════════════════════════════════
// // Everything below runs automatically — do not edit.
// // ════════════════════════════════════════════════════════════

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// // ─── PROMPT BUILDERS ─────────────────────────────────────────────────────────

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

// IMPORTANT: Citations are REQUIRED throughout this assignment. You must use both
// parenthetical and narrative citations from the sources above. Do NOT write plain
// text only. Every key claim must be backed by a properly formatted citation.

// ━━ PARENTHETICAL CITATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Format option A: Author (date) states word "word for word text from source" (p. #).
// Format option B: word "word for word text from source" (Author, date, p. #).

// CORRECT EXAMPLES (use these as models):
//   Annenberg Learner (n.d.) notes that Elsa believes that for many "children, what
//   happens in kindergarten affects students' feelings" (p. 24).

//   Elsa takes "a guided discovery approach by getting students to work with a
//   partner" (Annenberg Learner, n.d., p. 26).

//   students "record their discoveries on worksheets and discuss their findings
//   with the entire class" (Annenberg Learner, n.d., p. 26).

// RULES:
// 1. Text inside the quotes must be copied EXACTLY word for word from the EXACT TEXT
//    in the source block — nothing changed.

// 2. The period goes AFTER the closing parenthesis — NEVER inside the quotes.
//    CORRECT: "word for word text" (p. 53).
//    WRONG:   "word for word text." (p. 53).
//    WRONG:   "word for word text."

// 3. Every quote MUST be immediately followed by a citation.
//    WRONG: "is her literal comprehension, which scored at 82%."
//    RIGHT:  "is her literal comprehension, which scored at 82%" (p. 53).

// 4. Do NOT use filler connector words immediately before the opening quote.
//    WRONG: such as "word for word text" (p. 53).
//    A word pulled OUT of the source text is CORRECT and encouraged:
//    CORRECT: Elsa takes "a guided discovery approach by getting students to work
//              with a partner" (Annenberg Learner, n.d., p. 26).

// 5. No empty quotes ever.

// 6. If the source text starts with a capital letter, pull that first word OUT of the
//    quotes, lowercase it, and blend it into your sentence.
//    SOURCE: Discoveries are shared between partners and with Elsa.
//    CORRECT: discoveries "are shared between partners and with Elsa" (Annenberg Learner, n.d., p. 27).
//    WRONG:   "Discoveries are shared between partners and with Elsa" (p. 27).

// 7. NEVER put quotes around a word or phrase unless a citation (p. #) or
//    (Author, date, p. #) immediately follows it.
//    WRONG: educators use "guided discovery" to build skills.
//    RIGHT:  educators use guided discovery to build skills.
//    RIGHT:  Elsa takes "a guided discovery approach" (Annenberg Learner, n.d., p. 26).

// ━━ NARRATIVE CITATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Format: According to Author (date), from Chapter X on page #, sentence continues...

// CORRECT EXAMPLES:
//   According to Ramlal (2023), from Chapter 3 on page 24, teachers should plan
//   questions and stopping points ahead of time to support comprehension.

//   According to Annenberg Learner (n.d.), on page 26, Elsa believes that when
//   students take their worksheets home, their understandings are reinforced.

// RULES:
// 8. Author name in the sentence, date in parentheses only: Author (date).

// 9. Chapter/section/page go NATURALLY in the sentence AFTER (date) — NEVER inside
//    the parentheses.
//    CORRECT: According to Ramlal (2023), from Chapter 3 on page 24, ...
//    WRONG:   According to Ramlal (2023, Chapter 3, p. 24), ...
//    WRONG:   sentence (Ramlal, 2023, Chapter 3).
//    WRONG:   sentence (anything except just the year or n.d.).

// 10. Every narrative citation must mention chapter and/or page in the sentence.

// ━━ IF IN DOUBT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// If you are unsure about a citation format, write a plain sentence instead of that
// one citation. But you MUST have citations throughout — do not write the entire
// assignment as plain prose.

// Now complete the full assignment. Every paragraph of the summary and every row
// of the analysis table must contain at least one properly formatted citation.`;
// }

// // ─── CITATION SCANNER ────────────────────────────────────────────────────────

// function scanCitations(text) {
//   const violations = [];
//   let m;

//   // VIOLATION 1a — period INSIDE the closing quote when citation follows
//   const r1a =
//     /"([^"]+?)\."\s*\((?:p\.\s*\d+|Chapter[^)]+|Section[^)]+|Annenberg[^)]+|Ramlal[^)]+)\)/g;
//   while ((m = r1a.exec(text)) !== null) {
//     violations.push({
//       rule: 1,
//       bad: m[0],
//       detail: `Period is inside the closing quote — must go AFTER the closing parenthesis. CORRECT: "word for word text" (p. #).`,
//     });
//   }

//   // VIOLATION 1b — period INSIDE the closing quote with NO citation following
//   const r1b =
//     /"([^"]{5,}?)\."\s*(?!\s*\((?:p\.|Chapter|Section|Annenberg|Ramlal))/g;
//   while ((m = r1b.exec(text)) !== null) {
//     violations.push({
//       rule: 1,
//       bad: m[0].trim(),
//       detail: `Two violations: (1) period is inside the closing quote. (2) No citation after this quote. Fix: rewrite as "text" (p. #). or write your own plain sentence instead.`,
//     });
//   }

//   // VIOLATION 2 — empty quotes
//   const r2 = /""\s*\((?:p\.\s*\d+|Chapter[^)]*|Section[^)]*)?\)/g;
//   while ((m = r2.exec(text)) !== null) {
//     violations.push({
//       rule: 2,
//       bad: m[0],
//       detail: `Empty quotes — must contain real word-for-word text from the source.`,
//     });
//   }

//   // VIOLATION 3 — filler glue words before opening quote tied to a citation
//   const knownGlue = [
//     /\brate of\s+"/g,
//     /\bsuch as\s+"/g,
//     /\bknown as\s+"/g,
//     /\breferred to as\s+"/g,
//     /\btermed\s+"/g,
//     /\bthe concept of\s+"/g,
//   ];
//   for (const pattern of knownGlue) {
//     const glueRe = new RegExp(
//       pattern.source +
//         '([^"]{3,}?)"\\s*\\((?:p\\.\\s*\\d+|Chapter[^)]+|Section[^)]+|Annenberg[^)]+|Ramlal[^)]+)\\)',
//       "g"
//     );
//     while ((m = glueRe.exec(text)) !== null) {
//       violations.push({
//         rule: 3,
//         bad: m[0].trim(),
//         detail: `Filler connector word before the opening quote. Rewrite so the citation starts with a pulled-out source word or the quote begins directly.`,
//       });
//     }
//   }

//   // VIOLATION 4 — chapter/section/page crammed INSIDE narrative citation parens
//   const r4 =
//     /([A-Z][a-zA-Z\s]+?)\s*\((\d{4}|n\.d\.)\s*,\s*(?:Chapter|Ch\.?|chapter|Section|Sec\.?|section|p\.)\s*[\d\w]+[^)]*\)/g;
//   while ((m = r4.exec(text)) !== null) {
//     violations.push({
//       rule: 4,
//       bad: m[0],
//       detail: `Chapter/section/page must NOT go inside the parentheses. CORRECT: According to ${m[1].trim()} (${m[2]}), from Chapter X on page #, ...`,
//     });
//   }

//   // VIOLATION 5 — narrative citation with no chapter/section/page nearby
//   const r5 =
//     /According to ([A-Z][^(]+?)\s*\((\d{4}|n\.d\.)\)\s*,\s*(?!.*?\b(?:chapter|section|page|p\.)\b)/gi;
//   while ((m = r5.exec(text)) !== null) {
//     const after = text
//       .substring(m.index + m[0].length, m.index + m[0].length + 200)
//       .toLowerCase();
//     if (!after.match(/\b(chapter|section|page|p\.)\b/)) {
//       violations.push({
//         rule: 5,
//         bad: m[0].trim(),
//         detail: `Narrative citation has no chapter/section/page in the sentence. Add naturally: According to ${m[1].trim()} (${m[2]}), from Chapter X on page #, ...`,
//       });
//     }
//   }

//   // VIOLATION 6 — opening quote starts on a capitalized word (with citation after)
//   const r6 =
//     /"([A-Z][a-zA-Z']+)\s+([^"]{3,}?)"\s*\((?:p\.\s*\d+|Chapter[^)]+|Section[^)]+|Annenberg[^)]+|Ramlal[^)]+)\)/g;
//   while ((m = r6.exec(text)) !== null) {
//     violations.push({
//       rule: 6,
//       bad: m[0],
//       detail: `Opening quote starts on capital word "${m[1]}" — pull it out and lowercase it: ${m[1].toLowerCase()} "${m[2]}..." (p. #).`,
//     });
//   }

//   // VIOLATION 7 — quotes around a word/phrase with NO citation immediately after
//   const r7 =
//     /"([^"]{2,60})"\s*(?!\s*\((?:p\.|Chapter|Section|Annenberg|Ramlal))/g;
//   while ((m = r7.exec(text)) !== null) {
//     const inner = m[1].toLowerCase();
//     // Skip if it contains a verb (likely a legitimate sentence fragment)
//     const hasVerb =
//       /\b(is|are|was|were|has|have|must|should|will|can|does|do|reads|shows|indicates|believes|takes|invites|notes|records|mix|use|plan|select|avoid|keep|work|share|discuss|develop|encourage)\b/.test(
//         inner
//       );
//     if (!hasVerb && m[1].length < 60) {
//       violations.push({
//         rule: 7,
//         bad: m[0].trim(),
//         detail: `Quotes around "${m[1]}" with no citation after — remove quotes and write plainly, OR add (p. #) or (Author, date, p. #) immediately after the closing quote.`,
//       });
//     }
//   }

//   return violations;
// }

// // ─── CITATION PRESENCE CHECK ─────────────────────────────────────────────────
// // Detects when the Worker has removed ALL citations to escape the loop.

// function hasSufficientCitations(text) {
//   const parentheticalPattern =
//     /\((?:p\.\s*\d+|Annenberg[^)]{1,60}|Ramlal[^)]{1,60})\)/g;
//   const narrativePattern =
//     /According to [A-Z][^(]+\((?:\d{4}|n\.d\.)\)/gi;

//   const pCount = (text.match(parentheticalPattern) || []).length;
//   const nCount = (text.match(narrativePattern) || []).length;

//   return pCount + nCount >= 3;
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

// // ─── REVIEWER PROMPT ─────────────────────────────────────────────────────────

// const buildReviewerPrompt = (assignment, evidence) =>
//   `You are a strict APA 7th Edition citation reviewer.

// ${
//   evidence
//     ? `A scanner already found these violations. Confirm each one, explain why it is wrong, and check for anything else missed.\n\nSCANNER FINDINGS:\n${evidence}`
//     : `The scanner found no formatting violations. Do a thorough manual check yourself.`
// }

// ━━ CRITICAL CHECK FIRST ━━
// Before checking formatting, check: does this assignment contain AT LEAST 3 citations?
// Count all parenthetical citations like (p. 24) or (Annenberg Learner, n.d., p. 26)
// AND narrative citations like "According to Ramlal (2023), from Chapter 3 on page 24..."
// If fewer than 3 citations total exist, report:
// VIOLATION: MISSING CITATIONS — assignment must have properly formatted citations throughout.
// Writing plain prose with NO citations is NOT a valid fix. The assignment requires citations.

// ━━ PARENTHETICAL FORMAT ━━
// Correct: "word for word text" (p. #).
// Correct: "word for word text" (Author, date, p. #).

//   VIOLATION — period inside the closing quote:
//     WRONG: "text." (p. 53).  |  WRONG: "text."
//     RIGHT: "text" (p. 53).

//   VIOLATION — quote with no citation after it:
//     WRONG: Elsa "is building new knowledge."
//     RIGHT: Elsa "is building new knowledge" (Annenberg Learner, n.d., p. 27).

//   VIOLATION — empty quotes.

//   VIOLATION — filler connector words before quote (such as, a, called, of):
//     WRONG: such as "word for word text" (p. 53).
//     NOT a violation — pulled-out source word or verb before quote:
//       Elsa takes "a guided discovery approach" (Annenberg Learner, n.d., p. 26). ← CORRECT
//       students "record their discoveries on worksheets" (Annenberg Learner, n.d., p. 26). ← CORRECT

//   VIOLATION — opening quote starts on a capital word:
//     WRONG: "Discoveries are shared between partners" (p. 27).
//     RIGHT: discoveries "are shared between partners" (p. 27).

//   VIOLATION — quotes around a word/phrase with no citation:
//     WRONG: educators use "guided discovery" in class.
//     RIGHT: educators use guided discovery in class.
//     NOT a violation if a citation follows: Elsa takes "a guided approach" (p. 26). ← CORRECT

// ━━ NARRATIVE FORMAT ━━
// Correct: According to Author (date), from Chapter X on page #, sentence...

//   VIOLATION — location inside the parentheses:
//     WRONG: According to Ramlal (2023, Chapter 3, p. 24), ...
//     RIGHT: According to Ramlal (2023), from Chapter 3 on page 24, ...

//   VIOLATION — narrative citation with no chapter/section/page in the sentence:
//     WRONG: According to Ramlal (2023), the data shows...
//     RIGHT: According to Ramlal (2023), from Chapter 3 on page 24, the data shows...

// ━━ IMPORTANT ━━
// The fix for a citation FORMATTING problem is to correct the format — NOT to remove the citation.
// Only tell the Worker to remove a citation if it absolutely cannot be fixed.
// Citations are REQUIRED throughout the assignment.

// Quote every wrong piece of text exactly. State the fix.

// End with exactly one of:
// OVERALL RESULT: PASS
// OVERALL RESULT: FAIL

// Assignment to review:
// ---
// ${assignment}
// ---`;

// // ─── CORRECTION PROMPT ───────────────────────────────────────────────────────

// function buildCorrectionPrompt(feedback, violations, noCitations) {
//   let p = ``;

//   if (noCitations) {
//     p += `⚠️ CRITICAL: Your assignment has NO citations or almost none.
// Citations are REQUIRED — you cannot submit plain prose with no citations.
// Go back to the source text and add properly formatted citations to every
// section of the table and every paragraph of the summary.

// `;
//   }

//   p += `Your assignment has citation violations. FIX the format — do NOT simply remove citations.
// Citations from the source text are required throughout.\n\n`;

//   if (violations.length) {
//     p += `These exact wrong texts were found — fix each one:\n\n`;
//     violations.forEach((v, i) => {
//       p += `${i + 1}. WRONG TEXT: ${v.bad}\n`;
//       p += `   WHY WRONG:  ${v.detail}\n`;
//       p += `   FIX:        Correct the format. Only remove entirely if truly unfixable.\n\n`;
//     });
//   }

//   p += `Reviewer feedback:\n${feedback}\n\n`;
//   p += `${"━".repeat(50)}\n`;
//   p += `REWRITING RULES — CITATIONS ARE MANDATORY\n`;
//   p += `${"━".repeat(50)}\n\n`;
//   p += `The assignment MUST contain at least 4-6 properly formatted citations total.\n`;
//   p += `Do NOT write the assignment as plain prose with no citations.\n\n`;
//   p += `PARENTHETICAL FORMAT:\n`;
//   p += `  "word for word text" (p. #).                      ← correct\n`;
//   p += `  "word for word text" (Author, date, p. #).        ← also correct\n`;
//   p += `  Author (date) states word "word for word text" (p. #).  ← also correct\n\n`;
//   p += `- Period AFTER the closing parenthesis — NEVER inside the quotes\n`;
//   p += `- Every quote must be followed IMMEDIATELY by its citation\n`;
//   p += `- Pulled-out source word before the quote IS correct:\n`;
//   p += `  Elsa takes "a guided discovery approach by getting students to work with a partner"\n`;
//   p += `  (Annenberg Learner, n.d., p. 26).  ← CORRECT\n`;
//   p += `- If quote opens on a capital word — pull it out and lowercase it:\n`;
//   p += `  WRONG: "Discoveries are shared between partners" (p. 27).\n`;
//   p += `  RIGHT: discoveries "are shared between partners" (p. 27).\n`;
//   p += `- No quotes around a term unless a citation immediately follows.\n\n`;
//   p += `NARRATIVE FORMAT:\n`;
//   p += `  According to Author (date), from Chapter X on page #, sentence...\n`;
//   p += `- Chapter/page go in the SENTENCE — NEVER inside the parentheses:\n`;
//   p += `  WRONG: According to Ramlal (2023, Chapter 3, p. 24), ...\n`;
//   p += `  RIGHT: According to Ramlal (2023), from Chapter 3 on page 24, ...\n\n`;
//   p += `Rewrite the full assignment now. Keep all correctly formatted citations.\n`;
//   p += `Fix all violations. ADD citations where they are missing.`;
//   return p;
// }

// // ─── FOLLOW-UP PROMPTS ───────────────────────────────────────────────────────

// const FOLLOWUP_PROMPTS = [
//   `Review every citation in your assignment against the source text.
// IMPORTANT: Do NOT remove citations — fix their format.

// Check each one against these rules:
// 1. Is the quoted text copied exactly word-for-word from the source (nothing changed)?
// 2. Does the period go AFTER the closing parenthesis — never inside the quotes?
// 3. If the quote opens on a capitalized word — pull that word OUT of the quotes,
//    lowercase it, and blend it into your sentence.
//    WRONG: "Discoveries are shared between partners and with Elsa" (p. 27).
//    RIGHT: discoveries "are shared between partners and with Elsa" (Annenberg Learner, n.d., p. 27).
// 4. Does every narrative citation say the chapter and/or page in the sentence —
//    not inside the parentheses?
//    WRONG: According to Ramlal (2023, Chapter 3, p. 24), ...
//    RIGHT: According to Ramlal (2023), from Chapter 3 on page 24, ...
// 5. Are there at least 4-6 citations total? If not, add more from the source text.

// Fix all violations. Keep all correctly formatted citations as-is.`,

//   `Final citation check — verify every quote and citation in the assignment:
// 1. Every word-for-word quote must be followed IMMEDIATELY by (p. #) or (Author, date, p. #).
// 2. If a quote opens on a capital word — pull it out, lowercase it, blend into sentence.
//    WRONG: "Elsa believes that for many children" (p. 24).
//    RIGHT: Elsa believes that for many "children, what happens in kindergarten" (p. 24).
// 3. Period at the end of every parenthetical citation AFTER the closing parenthesis.
// 4. Never put quotes around a word or phrase unless a citation immediately follows.
//    WRONG: Elsa used "guided discovery" as a strategy.
//    RIGHT: Elsa used guided discovery as a strategy.
//    OR RIGHT: Elsa took "a guided discovery approach" (Annenberg Learner, n.d., p. 26).
// 5. Narrative citations: chapter/page in the sentence, never inside (parentheses).
// 6. The assignment must have at least 4-6 citations. If citations are missing, add them.

// Fix all violations. Do NOT remove citations — correct their format.`,
// ];

// // ─── DIRECTIONS CHECKER PROMPTS ──────────────────────────────────────────────

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

// If FAIL, list a short summary of exactly what is missing so the Worker AI
// knows what to add.`;
// }

// function buildDirectionsRewritePrompt(checkerFeedback) {
//   return `Your assignment is missing required content. The directions checker found gaps.

// Checker feedback:
// ${checkerFeedback}

// Add the missing content now. Keep all existing citations exactly as they are —
// do not change any citation formatting. Only add the content that is missing.
// Rewrite the full assignment with the missing points added.`;
// }

// // ─── FIND INPUT BOX ───────────────────────────────────────────────────────────

// async function findInput(page, label) {
//   const selectors = [
//     'rich-textarea div[contenteditable="true"]',
//     'div[contenteditable="true"]',
//     'div[role="textbox"]',
//     "textarea",
//     ".ql-editor",
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
//   const html = await page.evaluate(
//     () => document.body.innerHTML.substring(0, 3000)
//   );
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

//   const ok = await page.evaluate(
//     (t, s) => {
//       const el = document.querySelector(s);
//       if (!el) return false;
//       el.focus();
//       return document.execCommand("insertText", false, t);
//     },
//     text,
//     sel
//   );

//   if (!ok) {
//     await page.evaluate(
//       (t, s) => {
//         const el = document.querySelector(s);
//         if (!el) return;
//         el.focus();
//         if (el.contentEditable === "true") {
//           el.innerText = t;
//         } else {
//           Object.getOwnPropertyDescriptor(
//             window.HTMLTextAreaElement.prototype,
//             "value"
//           ).set.call(el, t);
//         }
//         el.dispatchEvent(new Event("input", { bubbles: true }));
//         el.dispatchEvent(new Event("change", { bubbles: true }));
//       },
//       text,
//       sel
//     );
//   }

//   await sleep(500);
//   const sendBtn = await page.$(
//     'button[aria-label="Send message"], button[aria-label="Submit"], button[jsname="Qx7uuf"]'
//   );
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
//       () =>
//         !!document.querySelector(
//           '[aria-label="Stop generating"], [aria-label="Stop response"]'
//         ),
//       { timeout: 15000, polling: 500 }
//     );
//   } catch (_) {}

//   await page
//     .waitForFunction(
//       () =>
//         !document.querySelector(
//           '[aria-label="Stop generating"], [aria-label="Stop response"]'
//         ),
//       { timeout: timeoutMs, polling: 1000 }
//     )
//     .catch(() => {});

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

// // ─── CITATION CHECK LOOP ─────────────────────────────────────────────────────
// // Shared by both Stage 1 and the re-check inside Stage 2.
// // Sends the given prompt to the Worker, then loops until citations pass
// // or MAX_ATTEMPTS is reached.

// async function runCitationCheckLoop(
//   workerPage,
//   reviewerPage,
//   prompt,
//   roundLabel,
//   maxAttempts = 6
// ) {
//   // Send the opening prompt to the Worker
//   await sendMessage(workerPage, prompt, "WORKER");
//   let lastResponse = await waitForResponse(workerPage, "WORKER");

//   let approved = false;
//   let attempt  = 0;

//   while (!approved && attempt < maxAttempts) {
//     attempt++;
//     console.log(
//       `\n  [${roundLabel}] Citation check attempt ${attempt}/${maxAttempts}`
//     );

//     // ── Key fix: detect missing citations before running the reviewer ──
//     const noCitations = !hasSufficientCitations(lastResponse);
//     if (noCitations) {
//       console.log(
//         `  [SCANNER] ⚠️  Fewer than 3 citations found — forcing citation rewrite.`
//       );
//     }

//     const violations = scanCitations(lastResponse);
//     if (!violations.length && !noCitations) {
//       console.log(`  [SCANNER] No violations found.`);
//     } else if (violations.length) {
//       console.log(`  [SCANNER] ${violations.length} violation(s):`);
//       violations.forEach((v, i) =>
//         console.log(`    ${i + 1}. Rule ${v.rule} — ${v.bad}`)
//       );
//     }

//     // Send to Citation Reviewer
//     await sendMessage(
//       reviewerPage,
//       buildReviewerPrompt(lastResponse, buildEvidenceReport(violations)),
//       "REVIEWER"
//     );
//     const feedback = await waitForResponse(reviewerPage, "REVIEWER");

//     console.log(`\n  REVIEWER:\n  ` + feedback.split("\n").join("\n  "));
//     console.log("\n  " + "─".repeat(58));

//     const passed = feedback.includes("OVERALL RESULT: PASS");
//     const failed =
//       feedback.includes("OVERALL RESULT: FAIL") ||
//       feedback.toLowerCase().includes("violation") ||
//       noCitations; // ← treat missing citations as a failure even if reviewer says PASS

//     if (passed && !failed) {
//       console.log(
//         `\n  [${roundLabel}] Citations PASSED after ${attempt} attempt(s).\n`
//       );
//       approved = true;
//     } else {
//       console.log(
//         `\n  [${roundLabel}] Citations FAILED — sending corrections to Worker...\n`
//       );
//       await sendMessage(
//         workerPage,
//         buildCorrectionPrompt(feedback, violations, noCitations),
//         "WORKER"
//       );
//       lastResponse = await waitForResponse(workerPage, "WORKER");
//       await sleep(2000);
//     }
//   }

//   if (!approved) {
//     console.warn(
//       `  [${roundLabel}] ⚠️  Max attempts reached — proceeding with best version.`
//     );
//   }

//   return lastResponse;
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
//   console.log("  1.  Worker writes assignment with citations");
//   console.log("  2.  Scanner checks for citation violations + missing citations");
//   console.log("  3.  Citation Reviewer confirms findings");
//   console.log("  4.  If violations OR < 3 citations → Worker fixes → repeat 2-3");
//   console.log("  5.  Once citations PASS → Directions Checker reads it");
//   console.log("  6.  Directions Checker checks every assignment requirement");
//   console.log("  7.  If missing content → Worker adds it → re-check citations → repeat 5-7");
//   console.log("  8.  Both PASS → done");
//   console.log("");
//   console.log("  KEY FIX: Worker cannot escape by removing all citations.");
//   console.log("           hasSufficientCitations() enforces ≥ 3 citations always.");

//   const launchOptions = {
//     headless: false,
//     executablePath:
//       "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
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

//   console.log("\nOpening Worker browser (window 1)...");
//   const workerBrowser = await puppeteer.launch({
//     ...launchOptions,
//     args: [
//       ...launchOptions.args,
//       "--user-data-dir=C:\\Temp\\puppeteer-worker",
//     ],
//   });

//   console.log("Opening Citation Reviewer browser (window 2)...");
//   const reviewerBrowser = await puppeteer.launch({
//     ...launchOptions,
//     args: [
//       ...launchOptions.args,
//       "--user-data-dir=C:\\Temp\\puppeteer-reviewer",
//     ],
//   });

//   console.log("Opening Directions Checker browser (window 3)...");
//   const checkerBrowser = await puppeteer.launch({
//     ...launchOptions,
//     args: [
//       ...launchOptions.args,
//       "--user-data-dir=C:\\Temp\\puppeteer-checker",
//     ],
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

//   const needsLogin = [workerPage, reviewerPage, checkerPage].some((p) =>
//     p.url().includes("accounts.google.com")
//   );
//   if (needsLogin) {
//     console.log("\n" + "!".repeat(60));
//     console.log("  Sign into Google in ALL THREE windows.");
//     console.log("  Script waits until all three are on Gemini.");
//     console.log("!".repeat(60));
//     await Promise.all([
//       workerPage.waitForFunction(
//         () => location.href.includes("gemini.google.com"),
//         { timeout: 120000, polling: 1000 }
//       ),
//       reviewerPage.waitForFunction(
//         () => location.href.includes("gemini.google.com"),
//         { timeout: 120000, polling: 1000 }
//       ),
//       checkerPage.waitForFunction(
//         () => location.href.includes("gemini.google.com"),
//         { timeout: 120000, polling: 1000 }
//       ),
//     ]);
//   }

//   console.log("\nWaiting for input to be ready in all three windows...");
//   for (const [p, label] of [
//     [workerPage,   "WORKER"],
//     [reviewerPage, "CITATION REVIEWER"],
//     [checkerPage,  "DIRECTIONS CHECKER"],
//   ]) {
//     await p
//       .waitForFunction(
//         () =>
//           !!document.querySelector(
//             'rich-textarea div[contenteditable="true"], div[contenteditable="true"], div[role="textbox"], textarea'
//           ),
//         { timeout: 30000, polling: 1000 }
//       )
//       .catch(() =>
//         console.warn(`  [${label}] Input wait timed out — continuing anyway`)
//       );
//   }

//   await sleep(2000);
//   console.log("\nAll three windows ready. Starting...\n");

//   // ── Stage 1: Initial write + follow-up citation passes ────────────────────
//   console.log("=".repeat(60));
//   console.log("  STAGE 1 — Write + Citation Review");
//   console.log("=".repeat(60) + "\n");

//   let lastResponse = await runCitationCheckLoop(
//     workerPage,
//     reviewerPage,
//     buildFirstPrompt(),
//     "INITIAL WRITE"
//   );

//   for (let i = 0; i < FOLLOWUP_PROMPTS.length; i++) {
//     const label = `FOLLOW-UP ${i + 1} of ${FOLLOWUP_PROMPTS.length}`;
//     console.log("\n" + "=".repeat(60));
//     console.log(`  STAGE 1 — ${label}`);
//     console.log("=".repeat(60));
//     lastResponse = await runCitationCheckLoop(
//       workerPage,
//       reviewerPage,
//       FOLLOWUP_PROMPTS[i],
//       label
//     );
//     await sleep(3000);
//   }

//   // ── Stage 2: Directions Checker loop ──────────────────────────────────────
//   console.log("\n" + "=".repeat(60));
//   console.log("  STAGE 2 — Directions Check");
//   console.log("=".repeat(60) + "\n");

//   let directionsApproved = false;
//   let directionsAttempt  = 0;
//   const MAX_DIR_ATTEMPTS = 5;

//   while (!directionsApproved && directionsAttempt < MAX_DIR_ATTEMPTS) {
//     directionsAttempt++;
//     console.log(
//       `\n  [DIRECTIONS CHECKER] Attempt ${directionsAttempt}/${MAX_DIR_ATTEMPTS}...`
//     );

//     // Send current assignment to the Directions Checker (Window 3)
//     await sendMessage(
//       checkerPage,
//       buildDirectionsCheckerPrompt(lastResponse),
//       "DIRECTIONS CHECKER"
//     );
//     const checkerFeedback = await waitForResponse(
//       checkerPage,
//       "DIRECTIONS CHECKER"
//     );

//     console.log(`\n  DIRECTIONS CHECKER FEEDBACK:\n`);
//     console.log("  " + checkerFeedback.split("\n").join("\n  "));
//     console.log("\n  " + "─".repeat(58));

//     const dirPass = checkerFeedback.includes("DIRECTIONS RESULT: PASS");
//     const dirFail = checkerFeedback.includes("DIRECTIONS RESULT: FAIL");

//     if (dirPass && !dirFail) {
//       console.log(`\n  DIRECTIONS CHECK PASSED — all content requirements met.\n`);
//       directionsApproved = true;
//     } else {
//       console.log(
//         `\n  DIRECTIONS CHECK FAILED — sending gaps to Worker to fill...\n`
//       );

//       // Worker adds the missing content
//       await sendMessage(
//         workerPage,
//         buildDirectionsRewritePrompt(checkerFeedback),
//         "WORKER"
//       );
//       lastResponse = await waitForResponse(workerPage, "WORKER");
//       console.log(
//         `  [WORKER] Rewrite received — ${lastResponse.length} chars`
//       );

//       // Re-check citations on the rewritten version
//       console.log(`\n  Re-checking citations after directions rewrite...`);
//       const noCitations = !hasSufficientCitations(lastResponse);
//       const rewriteViolations = scanCitations(lastResponse);

//       if (!rewriteViolations.length && !noCitations) {
//         console.log(`  [SCANNER] No citation violations in rewrite.`);
//       } else {
//         console.log(
//           `  [SCANNER] ${rewriteViolations.length} violation(s) found — fixing...`
//         );
//         await sendMessage(
//           reviewerPage,
//           buildReviewerPrompt(
//             lastResponse,
//             buildEvidenceReport(rewriteViolations)
//           ),
//           "CITATION REVIEWER"
//         );
//         const rewriteFeedback = await waitForResponse(
//           reviewerPage,
//           "CITATION REVIEWER"
//         );
//         const rewritePassed =
//           rewriteFeedback.includes("OVERALL RESULT: PASS") &&
//           !rewriteFeedback.includes("OVERALL RESULT: FAIL") &&
//           !noCitations;

//         if (!rewritePassed) {
//           await sendMessage(
//             workerPage,
//             buildCorrectionPrompt(
//               rewriteFeedback,
//               rewriteViolations,
//               noCitations
//             ),
//             "WORKER"
//           );
//           lastResponse = await waitForResponse(workerPage, "WORKER");
//         }
//       }

//       await sleep(2000);
//     }
//   }

//   if (!directionsApproved) {
//     console.warn(
//       `  ⚠️  Directions max attempts reached — proceeding with best version.`
//     );
//   }

//   // ── Final summary ─────────────────────────────────────────────────────────
//   console.log("\n" + "=".repeat(60));
//   console.log("  ALL CHECKS COMPLETE");
//   console.log("  Citations:  PASS");
//   console.log(
//     "  Directions: " +
//       (directionsApproved ? "PASS" : "MAX ATTEMPTS REACHED — review manually")
//   );
//   console.log("  Copy final assignment from the left window (Worker).");
//   console.log("=".repeat(60) + "\n");

//   // Uncomment to auto-close all three browsers when done:
//   // await workerBrowser.close();
//   // await reviewerBrowser.close();
//   // await checkerBrowser.close();
// })();









////////////////////////////working code with 3 ais



// import puppeteer from "puppeteer";
// import fs from "fs";
// import path from "path";
// import express from "express";

// const app = express();

// // ╔════════════════════════════════════════════════════════════╗
// // ║   CONFIG — edit these                                     ║
// // ╚════════════════════════════════════════════════════════════╝

// // Name of the output file — the assignment answers go here
// const OUTPUT_FILENAME = "science_video_analysis.txt";

// const ASSIGNMENT_DIRECTIONS = `

// complete this first use three books


// Part A – Science Children’s Literature Review
// ● Assignment Overview: For each selected book (3 total), include the following:
// ● Book Details
// ▪ Title, author, publication year, grade level, and a brief summary of the
// content and science connection.
// ● Literacy Integration Analysis
// Under each of the following categories, explain:
// ▪ Oral Language-How will students use oral language to process and
// communicate scientific ideas during the lesson?
// ● What structures (e.g., partner talk, science sentence stems, group
// discussions) will you use to help students explain, justify, or reflect
// on science concepts out loud?
// ▪ Comprehension- How does your lesson design support students in
// understanding scientific texts, instructions, or concepts?
// ● What strategies will you include to build science comprehension
// through oral reading, listening, or shared meaning-making (e.g.,
// choral reading of procedures, acting out processes, summarizing
// steps)?
// ▪ Vocabulary-What science-specific or academic vocabulary will students
// encounter in the lesson?
// ● How will you introduce, model, and reinforce key terms before,
// during, and after the lesson (e.g., word wall, visuals, hands-on
// labeling, word games, sentence frames)?

// -then Thoughtfully evaluate the 3 texts with clear and insightful analysis of how each supports accuracy, fluency, and vocabulary. Instructional suggestions are highly relevant, well-developed, and grounded in course concepts. 


// then complete this and use one book from part A to complete make sure it follows these guide lines in quotes make sure to use the answers to create part B

// "   Checklist Instructions



// 1. Choose at least one of the texts from Part A as the foundation of your science
// lesson.
// 2. Create a literacy-integrated lesson plan that:
// o Targets a science standard and a literacy standard.
// o Includes explicit strategies to build oral language, comprehension, and/or
// vocabulary.
// o Involves engaging activities (e.g., read-alouds, group work, performance,
// writing tasks).
// o Specifically creates a home-school connection.




// 3. Use the specific Baker College Teacher Prep Lesson Plan Format (provided) Part B.   "

// Baker College
// Teacher Prep Lesson Plan Format
// Subject Area & Grade Level: 6 Lesson Duration:
// Lesson Goal:
// What do we want
// students to learn?
// Assessment:
// How will we know they
// have learned it?
// (see guide)
// Intervention:
// What will we do if they
// don’t learn it?
// (see guide)
// Enrichment:
// What will we do if they
// already know it?
// (see guide)
// State Standards for Science in Grades 6-8 research to Build and Present Knowledge page 66:

// 1. Conduct short research projects to answer a
// question (including a self-generated question),
// drawing on several sources and generating
// additional related, focused questions that allow for
// multiple avenues of exploration.
// 2. Draw evidence from informational texts to support
// analysis reflection, and research.




// Learning Objective:
// Materials:
// Select your learning strategy:
// ● Direct Teach
// ● Demonstration
// ● Cooperative Learning
// ● Differentiation
// ● Discovery/Inquiry-Based Learning
// ● Project-Based Learning
// ● Reading/Writing/Math Workshop
// ● Other
// Activities Planned: ___ Active (Students are active participants in learning)
// ___ Passive (Teacher led lecture/demonstration)
// ___ Both
// Lesson Delivery Steps:
// Core Teaching Practices addressed in your lesson (check all that apply): (from MDE CTPs)
// ● Leading a group discussion (CTP #1)
// ● Explaining and modeling content, practices, and strategies (CTP #2)
// ● Eliciting and interpreting individual students’ thinking (CTP #3)
// ● Building respectful relationships with students (CTP #10)
// ● Check for Understanding (CTP #15)
// Real-world connections including attention to English language learners and culturally and historically
// responsive practices (diversity, inclusion, equity, and social justice):
// Technology tools (listed):
// Collaboration opportunities (list all that are included whole group, small group, partnerships, building
// resource personnel i.e., school social worker, special educators, parents, etc…):
// Lesson Plan Guide
// Assessment: Used to gather information about a student’s progress towards mastery of the learning objective,
// help the teacher identify what instruction is working well and what needs refinement, and informs the
// students about their learning.
// Options to consider
// ￿ Diagnostic/Pre-Assessment – Used to check prior knowledge before a lesson
// ￿ Self-Assessment (Writing Prompts, Running Records, Performance Task, Other)
// ￿ Formative – Used during a lesson to check progress, identify any misconception, and give feedback to
// students (Learning/Response Log, Admin/Exit Ticket, Think/Pair/Share, One Minute Paper, Other)
// ￿ Summative – Used at the end of a lesson to check student mastery of the objective (End of Unit Test,
// Final Exams or Mid-term Exams, State Tests, Culminating Project, Portfolio, Other)
// Intervention: How will we respond when they don’t learn?
// ￿ Differentiated Instruction
// ￿ Target specific skills
// ￿ Data item analysis
// ￿ Leveled materials (below, on level,
// above)
// ￿ Bloom's Taxonomy
// ￿ Grade recovery (re-do/correct)
// ￿ Parent contact
// ￿ Referral to Student Support Team
// ￿ Graphic organizers
// ￿ Manipulatives
// ￿ Choice boards
// ￿ Immediate feedback
// ￿ Flexible grouping
// ￿ Extended responses (math/reading)
// ￿ Journal/Reading logs
// Responses to Intervention (RtI)
// ￿ Small group instruction
// ￿ Tiered group instruction (Tier I, II, III)
// ￿ 1-1
// ￿ Centers (leveled)
// ￿ Re-teach in a different way
// ￿ Modify: backtrack, build background knowledge
// ￿ Tutoring: after or before school, lunch
// ￿ Referral to Student Support Team
// Enrichment: How will we respond if they already know it?
// ￿ Choice boards
// ￿ Use vocabulary to write sentences
// ￿ Accelerated reader
// ￿ Centers-High level
// ￿ Reading buddies
// ￿ Peer tutoring
// ￿ Enriched-Leveled Reader-Novels
// ￿ Picture/writing journals
// ￿ Independent projects
// ￿ Separate curriculum
// ￿ Games
// ￿ Group leader



// then complete this 


// Write a 1-page home-school connection reflection that addresses:
// ● How does the selected science text support meaningful conversations at
// home?
// ● Describe how families might discuss or explore the science topic
// introduced in the literature. What types of questions or activities
// could encourage students to share what they learned?
// ● What specific vocabulary or science concept could be reinforced at home,
// and how?
// ● Suggest a simple home-based activity (e.g., observation journal,
// vocabulary scavenger hunt, shared reading) that helps families
// reinforce the content or language from the lesson.
// ● In what ways does this lesson create an opportunity for family
// engagement in science and literacy?
// ● Reflect on how the read-aloud, writing task, or experiment could
// spark curiosity or participation from family members and
// strengthen school–home connections.
// `;

// const SOURCE_PAGES = `
// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 24
// CHAPTER: does not have one
// SECTION: does not have one

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

// Module 1 - Introducing the Case
// Elsa believes that for many children, what happens in kindergarten affects students' feelings about and learning in school for the rest of their lives. She is beginning to ask questions of herself and rethink her approach to teaching science. Knowing that her students become engaged whenever they are using their senses to explore objects and phenomena,
// ---

// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 25
// CHAPTER: does not have one
// SECTION: does not have one

// EXACT TEXT:
// Elsa wants to build upon her students' natural inclination to learn by making their own discoveries. She hopes to extend this type of learning to meaningful expressions of students' understandings.

// Module 2 - Trying New Ideas
// Jeff Winokur, an early childhood science educator at Wheelock College, has observed in his teaching practice that young students cherish playing with materials and that this fascination can be put to use to help them make scientific discoveries. During students' discovery of magnets, Elsa takes a guided discovery approach by getting students to work with a partner as she circulates through the classroom, helping them move toward making specific discoveries.
// ---

// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 26
// CHAPTER: does not have one
// SECTION: does not have one

// EXACT TEXT:
// After working in pairs, where materials are shared, each student completes a worksheet that reflects his or her findings about materials through which a magnetic force can travel. Later, the class reviews the worksheets together. Elsa believes that when students take their worksheets home, students' understandings are again reinforced when shared with family members.
// ---

// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 27
// CHAPTER: does not have one
// SECTION: does not have one

// EXACT TEXT:
// Module 3 - Reflecting and Building on Change
// As the year progresses, Elsa is convinced that science has become her students' favorite activity period. As part of her final science unit, Elsa invites her students to mix food coloring in water to find out what happens. Elsa is learning that with discovery activities, even though a scientific concept is not necessarily being discovered, her students are making their own discoveries and beginning to build new knowledge.
// ---

// ---
// AUTHOR: Ramlal
// DATE: 2023
// PAGE: 23
// CHAPTER: Chapter 3
// SECTION: does not have one

// EXACT TEXT:
// Teaching a balance of skills and strategies is important to promote growth in the area of reading.
// Overtime, as students gain experience with using strategies and continue to practice reading skills,
// the manner in which you plan your instruction should also evolve.
// Read-Alouds When planning for whole-class instruction, be sure to include a daily read-aloud.
// Use read-alouds to develop vocabulary, promote student-led discussions, and encourage listening comprehension.
// Plan questions and stopping points ahead of time.
// ---

// ---
// AUTHOR: Ramlal
// DATE: 2023
// PAGE: 24
// CHAPTER: Chapter 3
// SECTION: does not have one

// EXACT TEXT:
// Use read-alouds to develop vocabulary, promote student-led discussions, and encourage listening comprehension.
// Plan questions and stopping points ahead of time.
// Select read-aloud topics that consider a broad view of diversity: cultural, linguistic, or geographical,
// or about students with disabilities, gender stereotypes, family structures, popular culture, and so on.
// Before Reading: Have a discussion to introduce the book and activate prior knowledge.
// Try to allow students to do most of the talking.
// During Reading: Plan out stopping points to discuss the text or to ask and answer questions.
// ---
// `;

// // ════════════════════════════════════════════════════════════
// // Everything below runs automatically.
// // ════════════════════════════════════════════════════════════

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

// const launchOptions = {
//   headless: false,
//   executablePath: CHROME_PATH,
//   slowMo: 80,
//   args: [
//     "--no-sandbox",
//     "--disable-setuid-sandbox",
//     "--disable-blink-features=AutomationControlled",
//     "--start-maximized",
//   ],
//   defaultViewport: null,
//   ignoreDefaultArgs: ["--enable-automation"],
// };

// // ─── OUTPUT FILE ──────────────────────────────────────────────────────────────

// const OUTPUT_PATH = path.resolve(OUTPUT_FILENAME);

// function initOutputFile() {
//   const header = [
//     "=".repeat(70),
//     `  ASSIGNMENT: ${OUTPUT_FILENAME.replace(".txt", "").replace(/_/g, " ").toUpperCase()}`,
//     `  Generated: ${new Date().toLocaleString()}`,
//     "=".repeat(70),
//     "",
//   ].join("\n");
//   fs.writeFileSync(OUTPUT_PATH, header, "utf8");
//   console.log(`\n  ✓ Output file created: ${OUTPUT_PATH}\n`);
// }

// function appendToFile(questionNumber, questionText, answerText) {
//   const block = [
//     "",
//     "─".repeat(70),
//     `  QUESTION ${questionNumber}`,
//     "─".repeat(70),
//     questionText.trim(),
//     "",
//     "─".repeat(70),
//     `  ANSWER ${questionNumber}`,
//     "─".repeat(70),
//     answerText.trim(),
//     "",
//   ].join("\n");
//   fs.appendFileSync(OUTPUT_PATH, block, "utf8");
//   console.log(`\n  ✓ Question ${questionNumber} appended to ${OUTPUT_PATH}`);
// }

// function appendSummaryToFile(summaryText) {
//   const block = [
//     "",
//     "=".repeat(70),
//     "  SUMMARY (200-300 words)",
//     "=".repeat(70),
//     summaryText.trim(),
//     "",
//   ].join("\n");
//   fs.appendFileSync(OUTPUT_PATH, block, "utf8");
//   console.log(`\n  ✓ Summary appended to ${OUTPUT_PATH}`);
// }

// // ─── GEMINI WINDOW UTILITIES ──────────────────────────────────────────────────

// async function openGeminiBrowser(profileName, label) {
//   const browser = await puppeteer.launch({
//     ...launchOptions,
//     args: [...launchOptions.args, `--user-data-dir=C:\\Temp\\puppeteer-${profileName}`],
//   });
//   const page = await browser.newPage();
//   await page.evaluateOnNewDocument(() => {
//     Object.defineProperty(navigator, "webdriver", { get: () => false });
//     window.chrome = { runtime: {} };
//   });
//   await page.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
//   console.log(`  [${label}] window open.`);
//   return { browser, page };
// }

// async function findInput(page, label) {
//   for (const sel of [
//     'rich-textarea div[contenteditable="true"]',
//     'div[contenteditable="true"]',
//     'div[role="textbox"]',
//     "textarea",
//     ".ql-editor",
//   ]) {
//     try {
//       const el = await page.$(sel);
//       if (el && (await el.boundingBox())?.width > 0) return { el, sel };
//     } catch (_) {}
//   }
//   throw new Error(`[${label}] Input box not found`);
// }

// async function sendMessage(page, text, label) {
//   const { el, sel } = await findInput(page, label);
//   await el.click(); await sleep(400);
//   await page.keyboard.down("Control"); await page.keyboard.press("a"); await page.keyboard.up("Control");
//   await page.keyboard.press("Backspace"); await sleep(200);
//   const ok = await page.evaluate((t, s) => {
//     const el = document.querySelector(s); if (!el) return false;
//     el.focus(); return document.execCommand("insertText", false, t);
//   }, text, sel);
//   if (!ok) await page.evaluate((t, s) => {
//     const el = document.querySelector(s); if (!el) return; el.focus();
//     if (el.contentEditable === "true") el.innerText = t;
//     else Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(el, t);
//     el.dispatchEvent(new Event("input", { bubbles: true }));
//     el.dispatchEvent(new Event("change", { bubbles: true }));
//   }, text, sel);
//   await sleep(500);
//   const btn = await page.$('button[aria-label="Send message"], button[aria-label="Submit"], button[jsname="Qx7uuf"]');
//   if (btn) await btn.click(); else await page.keyboard.press("Enter");
//   await sleep(2000);
// }

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
//   else console.log(`  [${label}] ${text.length} chars`);
//   return text;
// }

// // ─── AI1 PROMPT — parse directions into question array ────────────────────────

// function buildAI1Prompt() {
//   return `You are reading an assignment and breaking it down into individual questions or tasks.

// ${"=".repeat(55)}
// ASSIGNMENT DIRECTIONS:
// ${"=".repeat(55)}
// ${ASSIGNMENT_DIRECTIONS.trim()}

// ${"=".repeat(55)}
// YOUR JOB:
// ${"=".repeat(55)}
// Read the directions carefully. Extract every numbered requirement or task as a
// separate question. Include the summary requirement as the last item.

// Output ONLY a JSON array of strings. Each string is one question/task exactly
// as it appears in the directions. No extra text, no markdown, no explanation.
// Just the raw JSON array.

// Example format:
// [
//   "Examine how the teacher supported students in using science talk",
//   "Determine strategies used to introduce and reinforce science vocabulary",
//   "Include a 200-300 word summary with APA 7th Edition citations"
// ]

// Output the JSON array now:`;
// }

// // ─── AI1 SELF-CHECK PROMPT ────────────────────────────────────────────────────

// function buildAI1SelfCheckPrompt(generatedQuestions) {
//   return `You previously broke the assignment directions into this list of questions:

// ${JSON.stringify(generatedQuestions, null, 2)}

// Now compare your list against the original directions:

// ${"=".repeat(55)}
// ORIGINAL DIRECTIONS:
// ${"=".repeat(55)}
// ${ASSIGNMENT_DIRECTIONS.trim()}

// ${"=".repeat(55)}
// YOUR JOB:
// ${"=".repeat(55)}
// Check if your list covers EVERY requirement in the directions.
// For each original requirement say:
//   COVERED: [yes/no] — [requirement text]

// If anything is missing, output the corrected complete JSON array at the end.
// If everything is covered, output the original array unchanged at the end.

// End your response with the final JSON array — nothing after it.`;
// }

// // ─── AI2 PROMPT — answer one question ─────────────────────────────────────────

// function buildAI2Prompt(questionIndex, questionText, totalQuestions) {
//   return `You are answering question ${questionIndex + 1} of ${totalQuestions} for an assignment.
// Answer ONLY this one question — do not answer other questions.

// ${"=".repeat(55)}
// QUESTION ${questionIndex + 1}:
// ${"=".repeat(55)}
// ${questionText}

// ${"=".repeat(55)}
// SOURCE TEXT — use these for citations:
// ${"=".repeat(55)}
// ${SOURCE_PAGES.trim()}

// ${"=".repeat(55)}
// APA 7TH EDITION CITATION RULES:
// ${"=".repeat(55)}

// You MUST use BOTH parenthetical AND narrative citations in your answer and at max only use 3 parthentical cittions peer answer rest narrative.

// PARENTHETICAL FORMAT:
//   Author (date) verb "word for word text" (p. #).
//   CORRECT: Ramlal (2023) explains "vocabulary relates to understanding" (p. 23).
//   CORRECT: Annenberg Learner (n.d.) notes "students become engaged whenever they are using their senses" (p. 24).

//   WRONG: "text" (Author, date, p. #).     ← author/date must be in the sentence
//   WRONG: "Text starts capital" (p. #).    ← pull capital word out, lowercase it
//   WRONG: "text." (p. #).                  ← period goes AFTER (p. #) never inside quotes
//   WRONG: such as "text" (p. #).           ← no filler words before opening quote

// NARRATIVE FORMAT:
//   According to Author (date), from Chapter X on page #, ...
//   As Author (date) explains on page #, ...

//   If the source HAS a chapter: According to Ramlal (2023), from Chapter 3 on page 23, ...
//   If NO chapter (Annenberg Learner): As Annenberg Learner (n.d.) explains on page 25, ...

//   WRONG: Ramlal (2023, Chapter 3, p. 23) states...  ← chapter/page inside parens
//   WRONG: According to Ramlal (2023), teaching is important.  ← no page mentioned

// CAPITAL FIRST WORD RULE:
//   If source starts with a capital, pull that word OUT of the quotes, lowercase it.
//   SOURCE: Students become engaged whenever they are using their senses
//   RIGHT:  Annenberg Learner (n.d.) notes that students "become engaged whenever they are using their senses" (p. 24).
//   WRONG:  Annenberg Learner (n.d.) notes "Students become engaged" (p. 24).

// PERIOD RULE: Period AFTER (p. #) — NEVER inside the quotes.
// NO MIXED SOURCES: Annenberg Learner text → Annenberg Learner (n.d.). Ramlal text → Ramlal (2023).
// IF IN DOUBT: drop the citation and write a plain sentence.

// Write a thorough answer to the question above using at least 2 citations.
// If this is the summary question, write 200-300 words.
// Output ONLY your answer — no preamble, no "here is my answer".`;
// }

// // ─── AI3 PROMPT — check citations ─────────────────────────────────────────────

// function buildAI3Prompt(questionText, answerText) {
//   return `You are a strict APA 7th Edition citation reviewer.

// ${"=".repeat(55)}
// QUESTION BEING ANSWERED:
// ${"=".repeat(55)}
// ${questionText}

// ${"=".repeat(55)}
// ANSWER TO REVIEW:
// ${"=".repeat(55)}
// ${answerText}

// ${"=".repeat(55)}
// WHAT TO CHECK:
// ${"=".repeat(55)}
// TWO citation formats are required — check both are present and correct.

// PARENTHETICAL — correct format:
//   Author (date) verb "word for word text" (p. #).
//   Ramlal (2023) explains "vocabulary relates to understanding" (p. 23).

// NARRATIVE — correct format:
//   According to Ramlal (2023), from Chapter 3 on page 23, ...
//   As Annenberg Learner (n.d.) explains on page 24, ...

// VIOLATIONS TO FLAG:
// 1. "text" (Author, date, p. #) — WRONG. Fix: Author (date) verb "text" (p. #).
// 2. Period inside closing quote: "text." (p. #) — WRONG. Fix: "text" (p. #).
// 3. Quote with no (p. #) after it. Fix: add (p. #) or drop quote.
// 4. Capital first word inside opening quote. Fix: pull out, lowercase, blend into sentence.
// 5. Empty quotes "" (p. #). Fix: drop and write plain sentence.
// 6. Chapter/page inside narrative parens: Author (2023, Chapter 3). Fix: write in sentence.
// 7. Narrative missing page: According to Author (date), teaching is important. Fix: add page.
// 8. Only one citation type used — both parenthetical AND narrative required.
// 9. Sources mixed — Ramlal text cited as Annenberg Learner or vice versa.
// 10. Quote fragment mid-sentence: Author (n.d.) notes a "short term" (p. #) feels... WRONG.
//     The sentence must END after (p. #).

// For each violation: quote the exact wrong text and state the fix.

// End with EXACTLY one of these as the very last line:
// CITATION RESULT: PASS
// CITATION RESULT: FAIL`;
// }

// // ─── AI2 CORRECTION PROMPT ───────────────────────────────────────────────────

// function buildAI2CorrectionPrompt(questionText, currentAnswer, ai3Feedback) {
//   return `Your answer has citation violations. Fix every one now.

// ${"=".repeat(55)}
// QUESTION:
// ${"=".repeat(55)}
// ${questionText}

// ${"=".repeat(55)}
// YOUR CURRENT ANSWER WITH VIOLATIONS:
// ${"=".repeat(55)}
// ${currentAnswer}

// ${"=".repeat(55)}
// REVIEWER FEEDBACK:
// ${"=".repeat(55)}
// ${ai3Feedback}

// ${"=".repeat(55)}
// FIX USING THESE RULES:
// ${"=".repeat(55)}
// PARENTHETICAL: Author (date) verb "word for word text" (p. #).
//   Ramlal (2023) explains "vocabulary relates to understanding" (p. 23).

// NARRATIVE: According to Author (date), from Chapter X on page #, ...
//   As Annenberg Learner (n.d.) explains on page 24, ...

// - Period AFTER (p. #) — NEVER inside quotes
// - Capital first word → pull out, lowercase, blend into sentence
// - Quote must END the sentence — never continue after (p. #) with lowercase text
// - Both parenthetical AND narrative required
// - Page always present — either as (p. #) or said naturally in the sentence

// Output ONLY the corrected answer — no preamble.`;
// }

// // ─── PARSE AI1 JSON RESPONSE ──────────────────────────────────────────────────

// function extractQuestionsFromResponse(raw) {
//   // Find the last JSON array in the response
//   const match = raw.match(/\[[\s\S]*\]/g);
//   if (!match) throw new Error("AI1 did not return a JSON array");
//   const lastArray = match[match.length - 1];
//   try {
//     const parsed = JSON.parse(lastArray);
//     if (!Array.isArray(parsed) || parsed.length === 0)
//       throw new Error("Empty or invalid array");
//     return parsed.map(q => String(q).trim()).filter(q => q.length > 5);
//   } catch (e) {
//     throw new Error(`Failed to parse AI1 JSON: ${e.message}\nRaw: ${lastArray.substring(0, 300)}`);
//   }
// }

// // ─── MAIN ─────────────────────────────────────────────────────────────────────

// (async () => {
//   console.log("=".repeat(70));
//   console.log("  QUESTION-BY-QUESTION PIPELINE");
//   console.log("=".repeat(70));
//   console.log("  AI1 — parses directions into question array");
//   console.log("  AI2 — answers each question with APA citations");
//   console.log("  AI3 — checks citations, sends back to AI2 if wrong");
//   console.log(`  Output file: ${OUTPUT_FILENAME}`);
//   console.log("=".repeat(70) + "\n");

//   // Init output file
//   initOutputFile();

//   // Open three Gemini windows
//   console.log("Opening AI windows...\n");
//   const { browser: b1, page: ai1Page } = await openGeminiBrowser("ai1-parser",   "AI1 PARSER");
//   const { browser: b2, page: ai2Page } = await openGeminiBrowser("ai2-writer",   "AI2 WRITER");
//   const { browser: b3, page: ai3Page } = await openGeminiBrowser("ai3-reviewer", "AI3 REVIEWER");

//   // Wait for login if needed
//   const allPages = [ai1Page, ai2Page, ai3Page];
//   if (allPages.some(p => p.url().includes("accounts.google.com"))) {
//     console.log("\n  Sign into Google in ALL THREE Gemini windows.");
//     console.log("  Script waits until all three are on Gemini.\n");
//     await Promise.all(allPages.map(p =>
//       p.waitForFunction(() => location.href.includes("gemini.google.com"), { timeout: 180000, polling: 1000 })
//     ));
//   }

//   for (const [p, lbl] of [[ai1Page, "AI1"], [ai2Page, "AI2"], [ai3Page, "AI3"]]) {
//     await p.waitForFunction(
//       () => !!document.querySelector('rich-textarea div[contenteditable="true"], div[contenteditable="true"], div[role="textbox"], textarea'),
//       { timeout: 30000, polling: 1000 }
//     ).catch(() => console.warn(`  [${lbl}] Input wait timed out`));
//   }
//   await sleep(2000);
//   console.log("All windows ready.\n");

//   // ── STEP 1: AI1 parses directions into questions ───────────────────────────
//   console.log("=".repeat(70));
//   console.log("  STEP 1 — AI1 parsing directions into questions");
//   console.log("=".repeat(70) + "\n");

//   await sendMessage(ai1Page, buildAI1Prompt(), "AI1 PARSER");
//   const ai1Raw = await waitForResponse(ai1Page, "AI1 PARSER");

//   let questions;
//   try {
//     questions = extractQuestionsFromResponse(ai1Raw);
//   } catch (e) {
//     console.error(`  ✗ AI1 parse failed: ${e.message}`);
//     process.exit(1);
//   }

//   console.log(`\n  AI1 generated ${questions.length} question(s):`);
//   questions.forEach((q, i) => console.log(`    [${i + 1}] ${q}`));

//   // ── STEP 2: AI1 self-checks its own question list ──────────────────────────
//   console.log("\n" + "=".repeat(70));
//   console.log("  STEP 2 — AI1 self-checking question coverage");
//   console.log("=".repeat(70) + "\n");

//   await sendMessage(ai1Page, buildAI1SelfCheckPrompt(questions), "AI1 PARSER");
//   const ai1CheckRaw = await waitForResponse(ai1Page, "AI1 PARSER");

//   // Try to extract a revised array from the self-check response
//   try {
//     const revised = extractQuestionsFromResponse(ai1CheckRaw);
//     if (revised.length >= questions.length) {
//       questions = revised;
//       console.log(`\n  AI1 self-check complete. Final question count: ${questions.length}`);
//     } else {
//       console.log(`\n  AI1 self-check returned fewer questions — keeping original list.`);
//     }
//   } catch (_) {
//     console.log(`\n  AI1 self-check did not change the list.`);
//   }

//   console.log(`\n  Final questions to answer (${questions.length} total):`);
//   questions.forEach((q, i) => console.log(`    [${i + 1}] ${q}`));

//   // ── STEP 3: Loop through each question ────────────────────────────────────
//   console.log("\n" + "=".repeat(70));
//   console.log(`  STEP 3 — AI2 answers each question, AI3 checks citations`);
//   console.log("=".repeat(70));

//   for (let idx = 0; idx < questions.length; idx++) {
//     const questionText = questions[idx];
//     const qNum = idx + 1;
//     const isSummary = questionText.toLowerCase().includes("summary");

//     console.log(`\n${"─".repeat(70)}`);
//     console.log(`  QUESTION ${qNum} of ${questions.length}`);
//     console.log(`  ${questionText}`);
//     console.log(`${"─".repeat(70)}`);

//     // AI2 writes the answer
//     await sendMessage(ai2Page, buildAI2Prompt(idx, questionText, questions.length), "AI2 WRITER");
//     let answer = await waitForResponse(ai2Page, "AI2 WRITER");

//     // AI3 checks citations — loop until PASS
//     let citationApproved = false;
//     let citationAttempt  = 0;
//     const MAX_CITATION_ATTEMPTS = 5;

//     while (!citationApproved && citationAttempt < MAX_CITATION_ATTEMPTS) {
//       citationAttempt++;
//       console.log(`\n  [CITATION CHECK] Attempt ${citationAttempt}/${MAX_CITATION_ATTEMPTS} for Q${qNum}`);

//       await sendMessage(ai3Page, buildAI3Prompt(questionText, answer), "AI3 REVIEWER");
//       const ai3Feedback = await waitForResponse(ai3Page, "AI3 REVIEWER");

//       console.log(`\n  [AI3]:\n  ` + ai3Feedback.split("\n").join("\n  "));

//       if (ai3Feedback.includes("CITATION RESULT: PASS")) {
//         console.log(`\n  ✓ Citations PASSED for Q${qNum}`);
//         citationApproved = true;
//       } else {
//         console.log(`\n  ✗ Citations FAILED — sending back to AI2 to fix...`);
//         await sendMessage(ai2Page, buildAI2CorrectionPrompt(questionText, answer, ai3Feedback), "AI2 WRITER");
//         answer = await waitForResponse(ai2Page, "AI2 WRITER");
//         await sleep(2000);
//       }
//     }

//     if (!citationApproved) {
//       console.warn(`  ⚠ Max citation attempts reached for Q${qNum} — using best version.`);
//     }

//     // Append to output file
//     if (isSummary) {
//       appendSummaryToFile(answer);
//     } else {
//       appendToFile(qNum, questionText, answer);
//     }

//     console.log(`\n  ✓ Q${qNum} complete and saved.`);
//     await sleep(2000);
//   }

//   // ── DONE ──────────────────────────────────────────────────────────────────
//   console.log("\n" + "=".repeat(70));
//   console.log("  ALL QUESTIONS COMPLETE");
//   console.log(`  Output saved to: ${OUTPUT_PATH}`);
//   console.log("=".repeat(70) + "\n");

//   // Uncomment to close windows when done:
//   // await b1.close(); await b2.close(); await b3.close();
// })();


// app.listen(3000, () => console.log("working"))































////////////////testing code with 4 ais




// ////////build ai 2 prompt

// You MUST only make narrative citations in your answer and mention chapter page section or nnumber were cited from in citations what every you can find.

// PARENTHETICAL FORMAT:
//   Author (date) verb "word for word text" (p. #).
//   CORRECT: Ramlal (2023) explains "vocabulary relates to understanding" (p. 23).
//   CORRECT: Annenberg Learner (n.d.) notes "students become engaged whenever they are using their senses" (p. 24).

//   WRONG: "text" (Author, date, p. #).     ← author/date must be in the sentence
//   WRONG: "Text starts capital" (p. #).    ← pull capital word out, lowercase it
//   WRONG: "text." (p. #).                  ← period goes AFTER (p. #) never inside quotes
//   WRONG: such as "text" (p. #).           ← no filler words before opening quote

// NARRATIVE FORMAT:
//   According to Author (date), from Chapter X on page #, ...
//   As Author (date) explains on page #, ...

//   If the source HAS a chapter: According to Ramlal (2023), from Chapter 3 on page 23, ...
//   If NO chapter (Annenberg Learner): As Annenberg Learner (n.d.) explains on page 25, ...

//   WRONG: Ramlal (2023, Chapter 3, p. 23) states...  ← chapter/page inside parens
//   WRONG: According to Ramlal (2023), teaching is important.  ← no page mentioned

// CAPITAL FIRST WORD RULE:
//   If source starts with a capital, pull that word OUT of the quotes, lowercase it.
//   SOURCE: Students become engaged whenever they are using their senses
//   RIGHT:  Annenberg Learner (n.d.) notes that students "become engaged whenever they are using their senses" (p. 24).
//   WRONG:  Annenberg Learner (n.d.) notes "Students become engaged" (p. 24).

// PERIOD RULE: Period AFTER (p. #) — NEVER inside the quotes.
// NO MIXED SOURCES: Annenberg Learner text → Annenberg Learner (n.d.). Ramlal text → Ramlal (2023).
// IF IN DOUBT: drop the citation and write a plain sentence.

// Write a thorough answer to the question above using at least 2 citations.
// If this is the summary question, write 200-300 words.
// Output ONLY your answer — no preamble, no "here is my answer".






////////build ai3 prompt 



// TWO citation formats are required — check both are present and correct.

// PARENTHETICAL — correct format:
//   Author (date) verb "word for word text" (p. #).
//   Ramlal (2023) explains "vocabulary relates to understanding" (p. 23).

// NARRATIVE — correct format:
//   According to Ramlal (2023), from Chapter 3 on page 23, ...
//   As Annenberg Learner (n.d.) explains on page 24, ...

// VIOLATIONS TO FLAG:
// 1. "text" (Author, date, p. #) — WRONG. Fix: Author (date) verb "text" (p. #).
// 2. Period inside closing quote: "text." (p. #) — WRONG. Fix: "text" (p. #).
// 3. Quote with no (p. #) after it. Fix: add (p. #) or drop quote.
// 4. Capital first word inside opening quote. Fix: pull out, lowercase, blend into sentence.
// 5. Empty quotes "" (p. #). Fix: drop and write plain sentence.
// 6. Chapter/page inside narrative parens: Author (2023, Chapter 3). Fix: write in sentence.
// 7. Narrative missing page: According to Author (date), teaching is important. Fix: add page.
// 8. Only one citation type used — both parenthetical AND narrative required.
// 9. Sources mixed — Ramlal text cited as Annenberg Learner or vice versa.
// 10. Quote fragment mid-sentence: Author (n.d.) notes a "short term" (p. #) feels... WRONG.
//     The sentence must END after (p. #).

// For each violation: quote the exact wrong text and state the fix.

// End with EXACTLY one of these as the very last line:
// CITATION RESULT: PASS
// CITATION RESULT: FAIL



//////build ai 4 prompt




// =======================================================
// 1. RELEVANCE: Compare this answer to ALL other answers.
//    - Remove any content that duplicates what another answer already covers.
//    - Remove any content that has no relevance to the assignment's overall topic.
//    - If the answer is missing relevant context that ties it to the assignment, add it.

// 2. FLOW: Add a natural transition sentence at the START that connects from the previous answer.
//    Add a natural transition sentence at the END that leads into the next answer.
//    If this is the first or last answer, only add one transition where applicable.

// 3. APA 7TH REPAIR: Fix every citation violation using the rules below.

// =======================================================
// APA 7TH EDITION CITATION RULES:
// =======================================================
// You MUST use BOTH parenthetical AND narrative citations. Max 3 parenthetical per answer, rest narrative.

// PARENTHETICAL FORMAT:
//   Author (date) verb "word for word text" (p. #).
//   CORRECT: Ramlal (2023) explains "vocabulary relates to understanding" (p. 23).
//   WRONG: "text" (Author, date, p. #).
//   WRONG: "Text starts capital" (p. #).
//   WRONG: "text." (p. #).

// NARRATIVE FORMAT:
//   According to Author (date), from Chapter X on page #, ...
// //   As Author (date) explains on page #, ...
// CORRECT As Author (date) explains on Chapter num from section somthing  #, ...
//   WRONG: Ramlal (2023, Chapter 3, p. 23) states...
//   WRONG: According to Ramlal (2023), teaching is important.

// CAPITAL FIRST WORD RULE:
//   Pull capital word OUT of quotes, lowercase it, blend into sentence.

// PERIOD RULE: Period AFTER (p. #) — NEVER inside quotes.
// NO MIXED SOURCES. IF IN DOUBT: drop citation, write plain sentence.

// =======================================================
// OUTPUT:
// =======================================================
// Output ONLY the final polished answer — no preamble, no labels.

































///////with only narrative 
















// import puppeteer from "puppeteer";
// import fs from "fs";
// import path from "path";
// import express from "express";

// const app = express();

// // ╔════════════════════════════════════════════════════════════╗
// // ║   CONFIG — edit these                                     ║
// // ╚════════════════════════════════════════════════════════════╝

// const OUTPUT_FILENAME = "math";
// const SEC_OUTPUT_FILENAME = `FINAL ${OUTPUT_FILENAME}`;

// const ASSIGNMENT_DIRECTIONS = `

// Mathematical Standards and Practices
// Purpose:
// For this checkpoint, you will analyze the mathematical standards and practices and integrate
// with an engaging activity.
// Directions:
// Evidence Expectation
// Naming Standards and
// Diversifying Instruction:
// Mathematical Standards and
// Practices
// 1. Use the link to go to the Michigan K-12 Standards - Mathematics.
// 2. Read through the 5th and 6th grade overview and standards.
// 3. Choose one standard, from 5th or 6th grade, to focus on for this
// activity. Copy and paste the Common Core State Standard into
// your Baker College Teacher Prep Lesson Plan Format.
// 4. Under the learning objective, rewrite this standard in your own
// words that makes sense for 5th or 6th grade students.
// 5. Choose one mathematical practice that integrates well with the
// standard.
// 6. Create an engaging activity that integrates the standard and the
// mathematical practice. Use the Baker College Teacher Prep
// Lesson Plan Format in Canvas to document all parts of the plan.
// Leave the grayed-out sections as it is, and complete the
// remaining sections.




// Baker College Teacher Prep Lesson Plan Format
// Subject Area & Grade Level:
// Lesson Duration:
// Lesson Goal: What do
// we want students to
// learn?
// Assessment: How will
// we know if they have
// learned it? (see guide)
// Intervention: What will
// we do if they don’t
// learn it? (see guide)
// Enrichment: What will
// we do if they already
// know it? (see guide)
// Common Core State
// Standard: use these for 6th grade page 44

// Apply and extend previous understandings of multiplication and
// division to divide fractions by fractions.

// Compute fluently with multi-digit numbers and find common factors
// and multiples. 

// Example:
// operations and algebraic
// thinking
// 4.OA.1 Use the four
// operations with whole
// numbers to solve problems.
// 1. Interpret a
// multiplication equation
// as a comparison, e.g.,
// interpret 35 = 5 × 7 as a
// statement that 35 is 5
// times as many as 7 and 7
// times as many as 5.
// Represent verbal
// statements of
// multiplicative
// comparisons as
// multiplication equations.
// Learning Objective:
// (In words that your students would
// understand)
// Materials:
// Select your learning strategy:
// ● Direct Teach
// ● Demonstration
// ● Cooperative Learning
// ● Discovery/Inquiry-Based Learning
// ● Project-Based Learning
// ● Reading/Writing/Math Workshop
// ● Other
// Activities Planned: ☐Active (Students are active participants in learning)
// ☐Passive (Teacher led lecture/demonstration)
// ☐Both
// Lesson Delivery Steps:
// Check the Core Teaching Practices addressed in your lesson: (from MDE CTPs)
// • Leading a group discussion (CTP #1)
// • Explaining and modeling content, practices, and strategies (CTP #2)
// • Eliciting and interpreting individual students’ thinking (CTP #3)
// • Building respectful relationships with students (CTP #10)
// • Check for Understanding (CTP #15)
// List real-world connections including attention to English language learners and culturally and historically
// responsive practices (diversity, inclusion, equity, and social justice):
// List technology tools:
// List collaboration opportunities (whole group, small group, partnerships, building resource personnel i.e.,
// school social worker, special educators, parents, etc.):
// Lesson Plan Guide
// Assessment: Used to gather information about a student’s progress towards mastery of the learning objective,
// help the teacher identify what instruction is working well and what needs refinement, and informs the
// students about their learning.
// Options to consider
// ☐Diagnostic/Pre-Assessment – Used to check prior knowledge before a lesson
// ☐Self-Assessment (Writing Prompts, Running Records, Performance Task, Other)
// ☐Formative – Used during a lesson to check progress, identify any misconception, and give feedback to
// students (Learning/Response Log, Admin/Exit Ticket, Think/Pair/Share, One Minute Paper, Other)
// ☐Summative – Used at the end of a lesson to check student mastery of the objective (End of Unit Test,
// Final Exams or Mid-term Exams, State Tests, Culminating Project, Portfolio, Other)
// Intervention: How will we respond when they don’t learn?
// ☐Differentiated Instruction
// ☐Target specific skills
// ☐Data item analysis
// ☐Leveled materials (below, on level,
// above)
// ☐Bloom's Taxonomy
// ☐Grade recovery (re-do/correct)
// ☐Parent contact
// ☐Referral to Student Support Team
// ☐Graphic organizers
// ☐Manipulatives
// ☐Choice boards
// ☐Immediate feedback
// ☐Flexible grouping
// ☐Extended responses (math/reading)
// ☐Journal/Reading logs
// Responses to Intervention (RtI)
// ☐Small group instruction
// ☐Tiered group instruction (Tier I, II, III)
// ☐1-1
// ☐Centers (leveled)
// ☐Re-teach in a different way
// ☐Modify: backtrack, build background knowledge
// ☐Tutoring: after or before school, lunch
// ☐Referral to Student Support Team
// Enrichment: How will we respond if they already know it?
// ☐Choice boards
// ☐Use vocabulary to write sentences
// ☐Accelerated reader
// ☐Centers-High level
// ☐Reading buddies
// ☐Peer tutoring
// ☐Enriched-Leveled Reader-Novels
// ☐Picture/writing journals
// ☐Independent projects
// ☐Separate curriculum
// ☐Games
// ☐Group leader


// `;

// const SOURCE_PAGES = `


// ---
// AUTHOR: Michigan Department of Education
// DATE: n.d. 
// PAGE: 44 
// CHAPTER: does not have one
// SECTION: does not have one
// Note: use this state standard for lesson
// EXACT TEXT:


// Apply and extend previous understandings of multiplication and
// division to divide fractions by fractions.
// 1.	 Interpret and compute quotients of fractions, and solve word
// problems involving division of fractions by fractions, e.g., by using
// visual fraction models and equations to represent the problem. For
// example, create a story context for (2/3)
// ÷ (3/4) and use a visual fraction
// model to show the quotient; use the relationship between multiplication
// and division to explain that (2/3)
// ÷ (3/4) = 8/9 because 3/4 of 8/9 is 2/3.
// (In general, (a/b)
// ÷ (c/d) = ad/bc.) How much chocolate will each person
// get if 3 people share 1/2 lb of chocolate equally? How many 3/4-cup
// servings are in 2/3 of a cup of yogurt? How wide is a rectangular strip of
// land with length 3/4 mi and area 1/2 square mi?


// ---






// ---
// AUTHOR: Dance and Kaplan 
// DATE: 2018
// PAGE: dose not have one
// CHAPTER: 5
// SECTION: refrence the sections throught the text what ever section you get the text from ref it wit citation only use narrative

// EXACT TEXT:

// As teachers, we encourage students to think deeply as they read, questioning an author’s reasoning and motivations. We must encourage them to do the same with math. The Common Core State Standards for Mathematical Practice encourage students to provide evidence of their thinking and evaluate the evidence provided by others. One of the best ways to help students accomplish these goals is through deliberate and direct questioning, both from the teacher and by the students themselves.
// Questioning: Why It Matters
// Being able to ask specific, targeted questions is a skill that must be learned and practiced by both the teacher and the students. When we as teachers question students, we must learn how to ask the specific types of questions that pull out the information we are looking for from our students. As we question our students, we are also modeling effective questioning techniques. Students will learn to ask the same types of targeted questions of each other as they learn to analyze and compare their classmates’ mathematical reasoning. Questioning is crucial to our math instruction.
// TYPES OF QUESTIONS
// Questions are one of the most valuable tools we have as teachers. Strategic, deliberate questions can push student thinking to deeper levels and open up opportunities for quick formative assessment. With every math problem we give our students, we think about which questions will allow us to formatively assess student understandings and/or misconceptions. We think about which questions will push students’ thinking, allowing them to extend their understanding of mathematical concepts and ideas. As students answer questions and discuss mathematical concepts and ideas, they are able to develop a metacognitive awareness of their own understanding and thought processes.
// It is also important for us as teachers to be flexible with our questioning. Even with the best-planned lesson, we can never quite know which direction a conversation may flow. Teachers must be able to adapt their questioning to the conversation as it happens. Doing this requires us to truly listen to our students and be responsive to where they are in their understanding. It requires patience and practice to become artful, thoughtful questioners.
// Teacher questions generally fit into three categories:
// 1.  questions that clarify and probe for justification
// 2.  questions that guide, challenge, and extend thinking
// 3.  questions that assess understanding
// You will notice that these question types often overlap, but here we will explain the general purpose for asking each type of question. Skilled teachers must be able to choose which questions to use based on the students they are working with. In one conversation, a teacher may fluidly move back and forth between all three question purposes and types, and an individual question may address two or more purposes at once.
// Questions That Clarify and Probe Thinking
// Clarification questions help students understand a task, make sense of a problem, and explain their thinking more clearly. Clarification may be necessary as they solve a problem or share their thinking with others. When introducing a problem task or new idea, we use clarification questions to ensure that students understand the problem, or to help them visualize the context of the problem and help them see what the problem is asking them to figure out. Clarifying questions can also help highlight and define any new or unfamiliar vocabulary that may interfere with student understanding. Finally, clarifying questions can help ensure that the rest of the class is following along with the presenter’s line of thinking during a share.
// A probing question encourages students to think about the problem at a deeper level. Probing questions can also help us better understand student thinking. Both probing and clarifying questions allow us to guide students through misconceptions and help decrease obstacles that get in the way of mathematical thinking, such as reading comprehension issues or a lack of language skills. These are generally open-ended questions, allowing for multiple responses, and they should not give any clues or hints as to how to solve the problem.
// The following vignette shows how we launch a problem in our classrooms and highlights the clarifying and probing questions used while introducing the task. Mrs. Dance begins by attempting to engage the students in the problem.
// Students have been taught that calling out the answer goes against the classroom expectation that everyone has the right to learn (discussed in Chapter 2). One way to prevent those who want to jump right in and answer is by leaving out the numbers in the problem or covering them with a sticky note until the problem has been discussed and visualized.
// Mrs. Dance: I need your help today, boys and girls. I’m having trouble with a deer in my garden and I don’t know what to do. Does anybody think they know what my problem may be?
// Delaney: The deer is eating your garden.
// Mrs. Dance: Delaney, great prediction. Show me a private thumb if your thinking was similar to Delaney’s. Well, I need you to figure out how many strawberries this deer ended up eating out of my garden. Do you think you can help me with this?
// Mrs. Dance reads the following problem at least twice: “Mrs. Dance had 19 strawberries in her garden, but a deer came and gobbled up some strawberries. Now she has 8 strawberries left in her garden. How many strawberries did the deer eat?”
// Mrs. Dance: What do we know about my garden?
// Julien: The deer gobbled 8 strawberries.
// Mrs. Dance: William, I see you’re pointing to your brain, giving the “I’m thinking something different” signal. Why is that?
// William: The deer didn’t eat 8 strawberries, but that’s how many strawberries are left.
// Mrs. Dance: Let’s go back and reread the problem.
// The class chorally rereads the problem together.
// Mrs. Dance: What do we think? Did the deer eat 8 strawberries, or do I have 8 strawberries left?
// Class: You have 8 strawberries left.
// Mrs. Dance: What other information do we know?
// Samantha: You had 19 strawberries at first.
// The class gives the “I agree” signal.
// Mrs. Dance: I want you to turn and talk with your math partner. What are we trying to figure out?
// Students sit knee to knee and eye to eye with their partners and discuss the question in the problem. Students are careful not to talk about how they will solve the problem or what the answer is.
// Mrs. Dance [restating the task]: What are we trying to figure out?
// Reese: How many strawberries did the deer eat?
// Mrs. Dance: Do we agree on the key question?
// Class: Yes!
// Mrs. Dance: You may use any tools you would like as you try and figure out how many strawberries this pesky deer ended up eating. I can’t wait to see what you come up with as you work to solve this problem.
// Notice that during this task introduction, Mrs. Dance gave very little information to the students, other than reading and rereading the problem. She asked questions to pull the important information from the students and also encouraged the students to question one another’s thinking.
// Clarifying and probing questions are also used as students work to solve a problem or as they share their thinking. When one student shares, the teacher may ask questions to clarify the steps a student used in solving a problem. Clarifying questions may help students restate ideas in their own words as they listen to the thinking of their classmates.

// Questions That Guide, Challenge, and Extend
// Questions that guide, challenge, and extend are used to push student thinking, often while creating cognitive dissonance, which increases the learning. These types of questions allow students to deepen their own reasoning as they justify their thinking. Guiding questions are also used to navigate students through misconceptions as they explain their reasoning. Additionally, they may be used to help a student get started or facilitate strategy use as students solve a problem.
// Let’s step back into Mrs. Dance’s classroom as the kids begin to work on solving the problem introduced earlier. The students have been released from the carpet area to return to their tables and begin solving the problem. Some students go straight to their table and begin working on the problem, while others go to the math center to grab number lines, hundred charts, cubes, or another tool of their choice. Mrs. Dance walks around the room with the goal of initially targeting students who are having trouble getting started.
// Marty: I’m stuck.
// Mrs. Dance: That’s great, our brains are not working when something is easy. What are you stuck on?
// Marty: I don’t get it.
// Mrs. Dance: Well, let’s see what we know. Can you circle or underline important information as I read the problem?
// As Mrs. Dance rereads, Marty circles the 19 and the 8.
// Mrs. Dance: What did you circle?
// Marty: 19 strawberries.
// Mrs. Dance: What does the 19 mean in the problem?
// Marty: The strawberries you had in the beginning.
// Mrs. Dance: What else did you circle?
// Marty: 8, because that is how many strawberries are left.
// Mrs. Dance: Can you underline the question?
// Marty underlines the question.
// Mrs. Dance: Would you like to draw a picture of what we know or use cubes to show what is happening in the problem?
// Marty: I want to draw a picture.
// Mrs. Dance: I’ll let you get started on your picture and come back in a few minutes to see your great work.
// Mrs. Dance continues to circle the room.
// Mrs. Dance: Julia, I see you have an 11 on your paper. What does the 11 mean?
// Julia: That’s how many the deer gobbled?
// Mrs. Dance: How do you know it’s 11? Can you tell me what you did?
// Julia: I know you had 19 strawberries at first and then there were 8 left, so I started at 19 on the number line and hopped back to 8 and that was 11 hops.
// Mrs. Dance: Why did you hop back on the number line?
// Julia: Because the deer was eating your strawberries, so it’s like a takeaway problem.
// Mrs. Dance: Do you think you could show all of that work on your paper and explain why you stopped at the number 8? I wonder if you could write a number sentence that matches this problem. I’ll come back to see how you showed your work in a little bit.
// Mrs. Dance moves on to another student.
// Mrs. Dance: Delaney, I see you drew a picture and did a number line. Do you think one strategy is more efficient for this task?
// Delaney: The number line because it took less time. It took me a while to draw 19 circles for the strawberries.
// Mrs. Dance: Can you explain these two strategies to me, please?
// Delaney: I knew it was a mystery box problem because it said “some” and we don’t know how many “some” is, so I wrote 19 minus blank equals 8. First I drew 19 circles and then I crossed them out until there were 8 left like the problem said. On my number line, I started at 19 and counted back to 8 because it was subtraction and I got 11 both times.
// Mrs. Dance: Let’s pretend I had 37 strawberries. How many did the deer eat?
// During this work time, Mrs. Dance asked questions to guide students toward a strategy, to evaluate strategy efficiency, and to extend thinking. In her conversation with Marty, she used questioning to guide him toward the important information in the problem and help him choose a strategy to use. With Julia, she asked questions to push her to more clearly justify her thinking on her paper. With Delaney, she asked questions to push her thinking beyond the context of the problem by evaluating efficiency and extending her thinking with more difficult numbers.
// These types of questions may also be used during whole-group discussions to guide, challenge, and extend the thinking of the class as a group. Through formative assessments, the teacher can make judgments as to which line of questioning (clarifying and probing or guiding and extending) may be best during each whole-group lesson.
// Questions That Assess Understanding
// Questions can be a powerful, daily formative assessment tool. By intentionally questioning students, teachers can gather important evidence of student understanding and strategy use and make informed instructional decisions about where to go next, what may need revisiting, and how to further challenge our learners.
// Let’s visit Mrs. Dance’s room again as students are back on the carpet, sharing their thinking with the whole group. She begins by asking students to think about the problem they just solved and show a secret silent signal that reflects how they feel about their understanding of the problem. Students place a thumb down, sideways, or up on their tummies to show how solving the problem felt. A thumbs-down signal means the problem was too tricky, sideways means “I understood but didn’t finish,” and thumbs-up means the problem felt just right. This quick self-assessment both promotes metacognitive reflection and gives the teacher a quick overview of how students feel they understood the problem at hand.
// Mrs. Dance: I’m seeing some sideways thumbs, which is awesome because our brains really had to work and grow while solving this problem. Delaney is going to share today, and I want you to pay close attention to what she says. While she is talking, decide if you agree or disagree. Please be thinking of what you did and figure out if your strategy is different from or similar to Delaney’s strategies. Think of questions you might ask her about her mathematical thinking. Remember, questions show we care about her thinking and questions help our brain grow.

// Questions
// That Guide, Challenge, and Extend
//    How can we get started on this problem?
//    Let’s reread the problem. What do we know? [When students seem to be missing information or are having trouble getting started]
//    I saw you use a 100 chart yesterday. Do you think that would help you today?
//    Can you tell me more about this?
//    Why did you______?
//    What does the number___mean in your number sentence?
//    Can you use a second strategy to prove your thinking?
//    What if there were 20 instead of 10?
//    Does that strategy always work?
//    Would this work if the numbers were different?
//    What strategy is most efficient?
//    Can you create a similar problem that I could give to the class?
//    Why did you use________to solve this problem? [To guide students toward clearer justification or help them analyze why they chose a particular tool/strategy]
//    How is your strategy similar to_____’s strategy?
//    How is your strategy different?
// Delaney shares her work under the document camera while Mrs. Dance records it onto the chart paper to make a public record documenting her strategy. This will be posted on the class’s math wall with other previous shares that have taken place.
// Mrs. Dance: Does anyone have questions for Delaney so far?
// Jacob: Why did you cross out the circles?
// Mrs. Dance: Great question, Jacob!
// Delaney: The problem said that the deer was eating the strawberries, so I wanted to cross them off.
// Mrs. Dance: Any other questions?
// Max: I disagree with Delaney. I got 27 strawberries.
// Mrs. Dance: Did anyone else get 27? Turn and talk.
// Mrs. Dance: I’m hearing that a few of you got 27. Can someone who got 27 justify their thinking, please?
// Aaliyah: I know that 19 plus 8 is 27, so the answer is 27.
// Mrs. Dance: Thank you, Aaliyah. Can you call on someone who is thinking something different?
// Aaliyah calls on Jayden, who is giving a silent signal to show she is thinking differently.
// Jayden: The problem said that you had 19 and then 8 left, so 27 would not make sense for the problem.
// Mrs. Dance: Delaney, can you explain the number sentence you have on your paper and why you wrote that?
// Delaney: I put 19 first because that is how many strawberries were in your garden at first, and then I put a subtraction symbol because the problem said that the deer gobbled up your strawberries and so I knew it was minus. I have “blank” because I didn’t know how many were gobbled by the deer, but I knew you had 8 strawberries left, so I wrote it equals 8. Then I found out that the deer had eaten 11 after I drew my picture and did my number line.
// Mrs. Dance: Can we have two different answers for this problem? Do addition and subtraction both work? I want you to turn and talk about this.
// The students then discuss this with their partners.
// Mrs. Dance: What are we thinking?
// Aaliyah: I revised my thinking and I don’t agree with my 27 anymore; I agree with Delaney.
// Mrs. Dance: Why?
// Aaliyah: The deer didn’t eat 19 plus 8 more strawberries, so 27 doesn’t make sense.
// As Mrs. Dance facilitated this share, she was able to assess through questioning that her students were experiencing a common misconception. In this missing-part problem, many of her students were adding the two numbers together. She used questioning to guide them through this misconception and help them come to the conclusion that addition did not make sense for this problem. She listened in during turn and talks to assess what students were misunderstanding in the problem and then was able to directly address the misconception within the share.
// Note that many good probing and challenging questions in this example came from students! We’ll discuss the important role of student questions shortly.
// This type of questioning can also be used as students explore a problem on their own. You might start with questions for assessment and then choose which types of questions to ask next based on that assessment.
// Questions
// That Assess
//    Why did you start at 7?
//    Tell me what this means.
//    What makes you think that?
//    What does the number___represent in the problem?
//    How do you know that this works?
//    Why did you use that operation?
//    I saw that some of our friends had___as their answer. What do you think they did to get that answer?
//    Why did you choose this [tool/strategy]? [To determine whether or not a student is thinking critically about their choice of tool or strategy]
//    Which part of the problem gave you that information?
// STUDENT QUESTIONING
// Student questioning is just as important as teacher questioning. It enables students to advocate for their own learning and develop their own understanding
// Children by nature are always asking questions, and it is our job to create an environment that nurtures and encourages these questions. Asking questions is a skill that all students need to develop to be critical, metacognitive mathematicians. In order to skillfully ask their own questions, students must be able to assess their own understanding, pinpoint where any confusions may exist or where they are feeling a lack of clarity, and choose the right question to ask in order to gather the information they need to deepen their learning. Teaching students to question themselves and one another takes time, patience, and much praise. We instill the belief in students that they learn the most by asking questions. We stress that it is very important to ask a question when there is something you don’t understand, something you don’t agree with, or something you are curious about.
// Young learners often feel uncomfortable with the idea of questioning and feel that asking questions shows a lack of understanding, which means they are not smart. For this reason, not only must we directly teach students about the importance of asking questions, but we must also teach them how to ask meaningful questions. In the next few sections, we will first return briefly to teacher questioning, and then focus on student questioning for the rest of the chapter.
// Effective Teacher Questioning
// In order to be deliberate about asking meaningful questions, it is very important to think through the lesson. Solve the problem or complete the task yourself and do the math before you give it to your students. Consider the misconceptions students will have and predict the variety of strategies students will use. You will also want to think about what your students may say and plan questions to either clarify, guide, or extend their thinking. Appendix B shows the template we use when thinking through our lessons, but you may play around to find one that works best for you. Appendix C is this same template with guiding questions to help you as you plan a lesson. The more you think through each lesson, planning the questions you might ask, the more meaningful your questions will be and this process will soon become natural.
// BUILDING STUDENTS’ WILLINGNESS TO ANSWER
// Not all students are immediately comfortable when a teacher questions their thinking. Some come to the classroom with the preconceived notion that when a teacher questions their work or thinking, it must mean that they are wrong. At the beginning of the year, students will often erase whatever it is they have on their paper as soon as any question is asked. When asked questions such as, “How do you know?” or “Why did you subtract?” they begin erasing away. Over the first months of the school year, it is important to emphasize the purpose of our questioning and to explain to students that when we as teachers ask questions it is because we want to understand or deepen their thinking. We must continually reassure our students that just because we are asking a question, it does not mean that they are wrong. It takes time, constant reassurance, and many reminders before students will learn to grow comfortable with teacher questioning. As with any new learning, some students take longer than others to become comfortable with this kind of questioning. However, it is worth the time, effort, and patience it takes to develop a relationship with these students so that they can trust that our questioning is not a negative judgment but simply what it is: a question.
// We also encourage comfort with questioning by explaining to our students that answering and asking questions makes their brains grow stronger in math by getting them to think beyond just the correct answer. When students become more used to our questioning, they often begin to anticipate questions, answering them before they are asked. They know that when you ask them about their thinking, answers aren’t enough and justification is always expected. The need to ask “How do you know?” slowly dissipates throughout the year.
// Effective Student Questioning
// Teaching questioning skills is not an easy process. It involves patience, scaffolding, and focused instruction.
// QUESTIONS VERSUS STATEMENTS
// Asking a question is not something that a lot of our students know how to do innately, especially at the primary level. At the beginning of the year, our youngest learners will often confuse statements with questions. It is important to start the year by teaching the difference between a question and a statement.
// One way we do this is through the use of a question/statement T-chart. Find an engaging or interesting photograph that you know will spark the interest of your students. Show it to the class and tell them you’d like them to work with a partner to ask questions or talk about what they notice in the picture.
// As a whole group, provide students with definitions of a question and a statement. A statement can be defined as something we observe, notice, or feel. A question is something that can be answered to gain more information. Make a question/statement T-chart as students share about the discussion they had with their partners. When someone shares a statement or question about the photograph, ask students to choose which column the sentence belongs in. Facilitate a discussion as students decide which sentences belong where on the chart, asking students to justify their thoughts. By charting the examples, students are able to see clearly how questions and statements differ. Leave this chart posted in the room and refer back to it as necessary throughout the year.
// ACCEPT ALL QUESTIONS … AT FIRST
// Nonmathematical questions like, “Why did you color the tree blue?” or “Why is your 9 backwards?” are not uncommon at the beginning of the year, especially in the primary grades. As students are just beginning to understand how to ask questions, it is important to accept these questions and praise students for asking them. If you begin limiting question types too soon, students may be hesitant to ask questions at all. However, as they progress in their understanding of questioning, you will eventually need to discourage this type of questioning. Explain the difference between a “mathematical question,” or one that asks about the mathematical strategy or model, and a “nonmathematical question,” or one that asks about spelling, handwriting, or other unrelated topics. Encourage students to ask only mathematical questions during share times.
// NOTICING AND WONDERING
// Another way to encourage students to ask questions is through the classroom routine “I Notice, I Wonder” suggested by the Math Forum (2017). In this routine, students are given a math problem or scenario and encouraged to first talk about what they notice in the problem. These noticings can be charted as a whole class, discussed with partners, or discussed in a small group. Then students are asked, “What do you wonder?” They should be encouraged to discuss all the things they wonder about the math problem or scenario. In this routine, students feel comfortable asking questions because they are encouraged to think about the problem in a low-stress way. They are being asked not to solve the problem but simply to wonder about it.
// Once students are comfortable with this routine, teachers can take it a step further by asking students to analyze the types of noticings and wonderings they are having. Teachers can ask questions such as, “Which of our wonderings help us to understand the problem mathematically?” or “Which of the things we noticed give us information we need to solve the problem, and which do not?” By analyzing what they notice and wonder, students begin to think metacognitively about the kinds of questions they are asking.
// TEACHER MODELING
// Modeling is crucial when promoting student questioning. Just as we deliberately model kind and polite words with our students to encourage respectful behavior, we need to deliberately model questioning to encourage students to begin asking their own questions. During the beginning of the year, most of the questioning in math will come from the teacher. As students share thinking during daily lessons, teachers need to be intentional in asking all types of questions. After a while, encourage your students to ask questions of one another. When you begin to hear them mimicking the types of questions you ask, use specific praise to talk about why those questions are important. As you strategically praise students for asking focused questions, more students will begin to follow suit, trying their best to ask deep-level questions. You will soon hear students using those same questions with their peers, and they will begin developing their own questions instead of just mimicking your modeled questions.
// You can push the level of questioning in your classroom throughout the year by scaffolding the types of questions that you model. At the beginning of the year, ask straightforward questions such as, “Why did you choose that strategy?” or “How did that tool help you solve the problem?” Once students begin asking these questions on their own, increase the complexity of the questions you are modeling. Ask, “Why did using a number line make sense for this problem?” or “How did using an area model help you make sense of the problem?” As you increase the complexity of the questions you model, students will increase the complexity of their own questioning.
// QUESTION AND CONVERSATION STEMS
// Question and conversation stems can be extremely helpful in getting students, especially English learners, to ask questions and discuss mathematical concepts. Create sentence stems for students to use and post them in your room to help guide student questioning (see Figure 5.1). As students come up with other questions, add stems for them to your collection. One way to encourage students to use the stems is by writing a student’s name on a sticky note and placing it on a stem when they use it (or letting them do so). The kids love to see their name up there, and you will find that kids often notice when others in the class use a stem they added.
// TEACHER TALK MOVES
// While there are a variety of talk moves you can use to promote mathematical discussions, a few specific moves help students develop their ability to ask questions.
// Questions like, “Can you tell me more about that?” or “What did you mean when you said _______?” or “Can you say that again in a different way?” help students see that elaboration is sometimes necessary for better understanding. Directly modeling these types of talk moves helps them become part of the math language in your classroom, and students will begin using them during group discussions and with their peers.

// Figure 5.1: Questions and Conversation Stems
// During discussions, we often ask students to rephrase one another’s thinking to ensure understanding and keep them engaged in the discussion. When students struggle to rephrase their classmates, encourage them to think of a question they can ask to help clarify what the student sharing is trying to say. Ask, “What questions can we ask ______ to better understand [his/her] thinking?” (For more on rephrasing, see Chapter 2.)
// Another talk move that you can use frequently is simply asking students if they have any questions. You can keep it simple, asking, “Does anyone have any questions for ______?” Or you can narrow the focus by asking question like, “Does anyone have any questions for ______ about how [he/she] used the doubling and halving strategy to solve this multiplication problem?”
// Teacher Talk Moves to Encourage Questioning
//    Does anyone have any questions for________?
//    Does anyone have any questions about________’s strategy?
//    What questions can you ask________to help yourself better understand [his/her] thinking?
//    Talk moves to model in order to encourage student use:
//   Can you tell me more about that?
//   What did you mean when you said_________?
//   I heard you say_________. Is that correct?
//   Can you say that again in a different way?
// PRAISE
// As teachers, we know that our students will do anything and everything to please, so creating a classroom culture that encourages questions relies heavily on positive praise. We jump for joy when our students ask a clear and meaningful mathematical question. The excitement may be a bit over the top, but it is a huge motivator for all your students to ask questions. We make sure that we are specifically praising the questions and not the answers: “I love how ______ asked ______ because it lets us ______.” Then we soon hear students repeating those same questions in future lessons. When a student asks us a question while working with us one-on-one, we often say, “What a great question! Can we ask that to the class?” You can also create a public record of the mathematical questions the kids ask. After praising a student for asking a question, say, “Can we write that down so we remember to use it again?” Be sure to use and refer to the chart often so that students begin using it on their own.

// ---

// `;

// // ════════════════════════════════════════════════════════════
// // Everything below runs automatically.
// // ════════════════════════════════════════════════════════════

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

// const launchOptions = {
//   headless: false,
//   executablePath: CHROME_PATH,
//   slowMo: 80,
//   args: [
//     "--no-sandbox",
//     "--disable-setuid-sandbox",
//     "--disable-blink-features=AutomationControlled",
//     "--start-maximized",
//   ],
//   defaultViewport: null,
//   ignoreDefaultArgs: ["--enable-automation"],
// };

// // ─── ROUGH DRAFT ANSWER STORAGE ───────────────────────────────────────────────
// // Populated during Step 3, consumed by Step 4 (AI4)
// const roughDraftAnswers = []; // { qNum, questionText, answer }

// // ─── OUTPUT FILE PATHS ────────────────────────────────────────────────────────
// const OUTPUT_PATH       = path.resolve(OUTPUT_FILENAME);
// const FINAL_OUTPUT_PATH = path.resolve(SEC_OUTPUT_FILENAME);

// // ─── ROUGH DRAFT FILE HELPERS ─────────────────────────────────────────────────

// function initOutputFile() {
//   const header = [
//     "=".repeat(70),
//     `  ASSIGNMENT: ${OUTPUT_FILENAME.replace(".txt", "").replace(/_/g, " ").toUpperCase()}`,
//     `  Generated: ${new Date().toLocaleString()}`,
//     "=".repeat(70),
//     "",
//   ].join("\n");
//   fs.writeFileSync(OUTPUT_PATH, header, "utf8");
//   console.log(`\n  ✓ Rough draft file created: ${OUTPUT_PATH}\n`);
// }

// function appendToFile(questionNumber, questionText, answerText) {
//   const block = [
//     "",
//     "─".repeat(70),
//     `  QUESTION ${questionNumber}`,
//     "─".repeat(70),
//     questionText.trim(),
//     "",
//     "─".repeat(70),
//     `  ANSWER ${questionNumber}`,
//     "─".repeat(70),
//     answerText.trim(),
//     "",
//   ].join("\n");
//   fs.appendFileSync(OUTPUT_PATH, block, "utf8");
//   console.log(`\n  ✓ Question ${questionNumber} appended to ${OUTPUT_PATH}`);
// }

// function appendSummaryToFile(summaryText) {
//   const block = [
//     "",
//     "=".repeat(70),
//     "  SUMMARY (200-300 words)",
//     "=".repeat(70),
//     summaryText.trim(),
//     "",
//   ].join("\n");
//   fs.appendFileSync(OUTPUT_PATH, block, "utf8");
//   console.log(`\n  ✓ Summary appended to ${OUTPUT_PATH}`);
// }

// // ─── FINAL DRAFT FILE HELPERS ─────────────────────────────────────────────────

// function initFinalOutputFile() {
//   const header = [
//     "=".repeat(70),
//     `  FINAL DRAFT: ${SEC_OUTPUT_FILENAME.replace(".txt", "").replace(/_/g, " ").toUpperCase()}`,
//     `  Generated: ${new Date().toLocaleString()}`,
//     "=".repeat(70),
//     "",
//   ].join("\n");
//   fs.writeFileSync(FINAL_OUTPUT_PATH, header, "utf8");
//   console.log(`\n  ✓ Final draft file created: ${FINAL_OUTPUT_PATH}\n`);
// }

// function appendFinalAnswerToFile(questionNumber, questionText, answerText) {
//   const block = [
//     "",
//     "─".repeat(70),
//     `  QUESTION ${questionNumber}`,
//     "─".repeat(70),
//     questionText.trim(),
//     "",
//     "─".repeat(70),
//     `  ANSWER ${questionNumber}`,
//     "─".repeat(70),
//     answerText.trim(),
//     "",
//   ].join("\n");
//   fs.appendFileSync(FINAL_OUTPUT_PATH, block, "utf8");
//   console.log(`\n  ✓ Final Q${questionNumber} appended to ${FINAL_OUTPUT_PATH}`);
// }

// function appendFinalSummaryToFile(summaryText) {
//   const block = [
//     "",
//     "=".repeat(70),
//     "  SUMMARY (200-300 words)",
//     "=".repeat(70),
//     summaryText.trim(),
//     "",
//   ].join("\n");
//   fs.appendFileSync(FINAL_OUTPUT_PATH, block, "utf8");
//   console.log(`\n  ✓ Final summary appended to ${FINAL_OUTPUT_PATH}`);
// }

// // ─── GEMINI WINDOW UTILITIES ──────────────────────────────────────────────────

// async function openGeminiBrowser(profileName, label) {
//   const browser = await puppeteer.launch({
//     ...launchOptions,
//     args: [...launchOptions.args, `--user-data-dir=C:\\Temp\\puppeteer-${profileName}`],
//   });
//   const page = await browser.newPage();
//   await page.evaluateOnNewDocument(() => {
//     Object.defineProperty(navigator, "webdriver", { get: () => false });
//     window.chrome = { runtime: {} };
//   });
//   await page.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
//   console.log(`  [${label}] window open.`);
//   return { browser, page };
// }

// async function findInput(page, label) {
//   for (const sel of [
//     'rich-textarea div[contenteditable="true"]',
//     'div[contenteditable="true"]',
//     'div[role="textbox"]',
//     "textarea",
//     ".ql-editor",
//   ]) {
//     try {
//       const el = await page.$(sel);
//       if (el && (await el.boundingBox())?.width > 0) return { el, sel };
//     } catch (_) {}
//   }
//   throw new Error(`[${label}] Input box not found`);
// }

// async function sendMessage(page, text, label) {
//   const { el, sel } = await findInput(page, label);
//   await el.click(); await sleep(400);
//   await page.keyboard.down("Control"); await page.keyboard.press("a"); await page.keyboard.up("Control");
//   await page.keyboard.press("Backspace"); await sleep(200);
//   const ok = await page.evaluate((t, s) => {
//     const el = document.querySelector(s); if (!el) return false;
//     el.focus(); return document.execCommand("insertText", false, t);
//   }, text, sel);
//   if (!ok) await page.evaluate((t, s) => {
//     const el = document.querySelector(s); if (!el) return; el.focus();
//     if (el.contentEditable === "true") el.innerText = t;
//     else Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(el, t);
//     el.dispatchEvent(new Event("input", { bubbles: true }));
//     el.dispatchEvent(new Event("change", { bubbles: true }));
//   }, text, sel);
//   await sleep(500);
//   const btn = await page.$('button[aria-label="Send message"], button[aria-label="Submit"], button[jsname="Qx7uuf"]');
//   if (btn) await btn.click(); else await page.keyboard.press("Enter");
//   await sleep(2000);
// }

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
//   else console.log(`  [${label}] ${text.length} chars`);
//   return text;
// }

// // ─── AI1 PROMPT — parse directions into question array ────────────────────────

// function buildAI1Prompt() {
//   return `You are reading an assignment and breaking it down into individual questions or tasks.

// ${"=".repeat(55)}
// ASSIGNMENT DIRECTIONS:
// ${"=".repeat(55)}
// ${ASSIGNMENT_DIRECTIONS.trim()}

// ${"=".repeat(55)}
// YOUR JOB:
// ${"=".repeat(55)}
// Read the directions carefully. Extract every numbered requirement or task as a
// separate question. Include the summary requirement as the last item.

// Output ONLY a JSON array of strings. Each string is one question/task exactly
// as it appears in the directions. No extra text, no markdown, no explanation.
// Just the raw JSON array.

// Example format:
// [
//   "Examine how the teacher supported students in using science talk",
//   "Determine strategies used to introduce and reinforce science vocabulary",
//   "Include a 200-300 word summary with APA 7th Edition citations"
// ]

// Output the JSON array now:`;
// }

// // ─── AI1 SELF-CHECK PROMPT ────────────────────────────────────────────────────

// function buildAI1SelfCheckPrompt(generatedQuestions) {
//   return `You previously broke the assignment directions into this list of questions:

// ${JSON.stringify(generatedQuestions, null, 2)}

// Now compare your list against the original directions:

// ${"=".repeat(55)}
// ORIGINAL DIRECTIONS:
// ${"=".repeat(55)}
// ${ASSIGNMENT_DIRECTIONS.trim()}

// ${"=".repeat(55)}
// YOUR JOB:
// ${"=".repeat(55)}
// Check if your list covers EVERY requirement in the directions.
// For each original requirement say:
//   COVERED: [yes/no] — [requirement text]

// If anything is missing, output the corrected complete JSON array at the end.
// If everything is covered, output the original array unchanged at the end.

// End your response with the final JSON array — nothing after it.`;
// }

// // ─── AI2 PROMPT — answer one question ─────────────────────────────────────────

// function buildAI2Prompt(questionIndex, questionText, totalQuestions) {
//   return `You are answering question ${questionIndex + 1} of ${totalQuestions} for an assignment.
// Answer ONLY this one question — do not answer other questions.

// ${"=".repeat(55)}
// QUESTION ${questionIndex + 1}:
// ${"=".repeat(55)}
// ${questionText}

// ${"=".repeat(55)}
// SOURCE TEXT — use these for citations:
// ${"=".repeat(55)}
// ${SOURCE_PAGES.trim()}

// ${"=".repeat(55)}
// APA 7TH EDITION CITATION RULES:
// ${"=".repeat(55)}

// You MUST only make narrative citations in your answer and mention chapter page section or nnumber were cited from in citations what every you can find.


// NARRATIVE FORMAT:
//   According to Author (date), from Chapter X on page #, ...
//   As Author (date) explains on page #, ...

//   If the source HAS a chapter: According to Ramlal (2023), from Chapter 3 on page 23, ...
//   If NO chapter (Annenberg Learner): As Annenberg Learner (n.d.) explains on page 25, ...

//   WRONG: Ramlal (2023, Chapter 3, p. 23) states...  ← chapter/page inside parens
//   WRONG: According to Ramlal (2023), teaching is important.  ← no page mentioned

// CAPITAL FIRST WORD RULE:
//   If source starts with a capital, pull that word OUT of the quotes, lowercase it.
//   SOURCE: Students become engaged whenever they are using their senses
//   RIGHT:  Annenberg Learner (n.d.) notes that students "become engaged whenever they are using their senses" (p. 24).
//   WRONG:  Annenberg Learner (n.d.) notes "Students become engaged" (p. 24).

// PERIOD RULE: Period AFTER (p. #) — NEVER inside the quotes.
// NO MIXED SOURCES: Annenberg Learner text → Annenberg Learner (n.d.). Ramlal text → Ramlal (2023).
// IF IN DOUBT: drop the citation and write a plain sentence.

// Write a thorough answer to the question above using at least 2 citations.
// If this is the summary question, write 200-300 words.
// Output ONLY your answer — no preamble, no "here is my answer".`;
// }

// // ─── AI3 PROMPT — check citations ─────────────────────────────────────────────

// function buildAI3Prompt(questionText, answerText) {
//   return `You are a strict APA 7th Edition citation reviewer.

// ${"=".repeat(55)}
// QUESTION BEING ANSWERED:
// ${"=".repeat(55)}
// ${questionText}

// ${"=".repeat(55)}
// ANSWER TO REVIEW:
// ${"=".repeat(55)}
// ${answerText}

// ${"=".repeat(55)}
// WHAT TO CHECK:
// ${"=".repeat(55)}
// You MUST only make narrative citations in your answer and mention chapter page section or nnumber were cited from in citations what every you can find.

// NARRATIVE — correct format:
//   According to Ramlal (2023), from Chapter 3 on page 23, ...
//   As Annenberg Learner (n.d.) explains on page 24, ...

// VIOLATIONS TO FLAG:
// 3. Quote with no (p. #) after it. Fix: drop quote.
// 4. Empty quotes "" (p. #). Fix: drop and write plain sentence.
// 6. Chapter/page inside narrative parens: Author (2023, Chapter 3). Fix: write in sentence.
// 7. Narrative missing page: According to Author (date), teaching is important. Fix: add page if there is one or section what ever it can find in text.
// 9. Sources mixed — Ramlal text cited as Annenberg Learner or vice versa.

// For each violation: quote the exact wrong text and state the fix.

// End with EXACTLY one of these as the very last line:
// CITATION RESULT: PASS
// CITATION RESULT: FAIL`;
// }

// // ─── AI2 CORRECTION PROMPT ────────────────────────────────────────────────────

// function buildAI2CorrectionPrompt(questionText, currentAnswer, ai3Feedback) {
//   return `Your answer has citation violations. Fix every one now.

// ${"=".repeat(55)}
// QUESTION:
// ${"=".repeat(55)}
// ${questionText}

// ${"=".repeat(55)}
// YOUR CURRENT ANSWER WITH VIOLATIONS:
// ${"=".repeat(55)}
// ${currentAnswer}

// ${"=".repeat(55)}
// REVIEWER FEEDBACK:
// ${"=".repeat(55)}
// ${ai3Feedback}

// ${"=".repeat(55)}
// FIX USING THESE RULES:
// ${"=".repeat(55)}
// You MUST only make narrative citations in your answer and mention chapter page section or nnumber were cited from in citations what every you can find.


// NARRATIVE: According to Author (date), from Chapter X on page #, ...
//   As Annenberg Learner (n.d.) explains on page 24, ...

// VIOLATIONS:
// 3. Quote with no (p. #) after it. Fix: drop quote.
// 4. Empty quotes "" (p. #). Fix: drop and write plain sentence.
// 6. Chapter/page inside narrative parens: Author (2023, Chapter 3). Fix: write in sentence.
// 7. Narrative missing page: According to Author (date), teaching is important. Fix: add page if there is one or section what ever it can find in text.
// 9. Sources mixed — Ramlal text cited as Annenberg Learner or vice versa.


// Output ONLY the corrected answer — no preamble.`;
// }

// // ─── AI4 PROMPT — cohesion + transitions + APA on final draft ─────────────────

// function buildAI4MasterEditorPrompt(targetIdx, roughDraftAnswers) {
//   const target = roughDraftAnswers[targetIdx];

//   const allOthers = roughDraftAnswers
//     .filter((_, i) => i !== targetIdx)
//     .map(a => `--- Q${a.qNum}: ${a.questionText}\n${a.answer}`)
//     .join("\n\n");

//   const prevAnswer = targetIdx > 0
//     ? `--- Q${roughDraftAnswers[targetIdx - 1].qNum}: ${roughDraftAnswers[targetIdx - 1].questionText}\n${roughDraftAnswers[targetIdx - 1].answer}`
//     : "None — this is the first answer.";

//   const nextAnswer = targetIdx < roughDraftAnswers.length - 1
//     ? `--- Q${roughDraftAnswers[targetIdx + 1].qNum}: ${roughDraftAnswers[targetIdx + 1].questionText}\n${roughDraftAnswers[targetIdx + 1].answer}`
//     : "None — this is the last answer.";

//   return `You are the Lead Editor for a Baker College assignment final draft.

// =======================================================
// YOUR TARGET: Q${target.qNum} — ${target.questionText}
// =======================================================
// ${target.answer}

// =======================================================
// ALL OTHER ANSWERS IN THE ASSIGNMENT (for relevance check):
// =======================================================
// ${allOthers}

// =======================================================
// IMMEDIATELY PREVIOUS ANSWER (transition context):
// =======================================================
// ${prevAnswer}

// =======================================================
// IMMEDIATELY NEXT ANSWER (transition context):
// =======================================================
// ${nextAnswer}

// =======================================================
// YOUR TASKS:
// =======================================================
// 1. RELEVANCE: Compare this answer to ALL other answers.
//    - Remove any content that duplicates what another answer already covers.
//    - Remove any content that has no relevance to the assignment's overall topic.
//    - If the answer is missing relevant context that ties it to the assignment, add it.

// 2. FLOW: Add a natural transition sentence at the START that connects from the previous answer.
//    Add a natural transition sentence at the END that leads into the next answer.
//    If this is the first or last answer, only add one transition where applicable.

// 3. APA 7TH REPAIR: Fix every citation violation using the rules below.

// =======================================================
// APA 7TH EDITION CITATION RULES:
// =======================================================
// You MUST use narrative citations. 



// NARRATIVE FORMAT:
//   According to Author (date), from Chapter X on page #, ...
//   As Author (date) explains on page #, ...
//   As Author (date) explains on page or what ever you can find like chapter or section #, ...
//   WRONG: Ramlal (2023, Chapter 3, p. 23) states...
//   WRONG: According to Ramlal (2023), teaching is important.


// =======================================================
// OUTPUT:
// =======================================================
// Output ONLY the final polished answer — no preamble, no labels.`;
// }

// // ─── PARSE AI1 JSON RESPONSE ──────────────────────────────────────────────────

// function extractQuestionsFromResponse(raw) {
//   const match = raw.match(/\[[\s\S]*\]/g);
//   if (!match) throw new Error("AI1 did not return a JSON array");
//   const lastArray = match[match.length - 1];
//   try {
//     const parsed = JSON.parse(lastArray);
//     if (!Array.isArray(parsed) || parsed.length === 0)
//       throw new Error("Empty or invalid array");
//     return parsed.map(q => String(q).trim()).filter(q => q.length > 5);
//   } catch (e) {
//     throw new Error(`Failed to parse AI1 JSON: ${e.message}\nRaw: ${lastArray.substring(0, 300)}`);
//   }
// }

// // ─── MAIN ─────────────────────────────────────────────────────────────────────

// (async () => {
//   console.log("=".repeat(70));
//   console.log("  QUESTION-BY-QUESTION PIPELINE");
//   console.log("=".repeat(70));
//   console.log("  AI1 — parses directions into question array");
//   console.log("  AI2 — answers each question with APA citations");
//   console.log("  AI3 — checks citations, sends back to AI2 if wrong");
//   console.log("  AI4 — cohesion pass on all answers, AI3 re-checks before final save");
//   console.log(`  Rough draft:  ${OUTPUT_FILENAME}`);
//   console.log(`  Final draft:  ${SEC_OUTPUT_FILENAME}`);
//   console.log("=".repeat(70) + "\n");

//   initOutputFile();

//   // ── Open all four Gemini windows ────────────────────────────────────────────
//   console.log("Opening AI windows...\n");
//   const { browser: b1, page: ai1Page } = await openGeminiBrowser("ai1-parser",    "AI1 PARSER");
//   const { browser: b2, page: ai2Page } = await openGeminiBrowser("ai2-writer",    "AI2 WRITER");
//   const { browser: b3, page: ai3Page } = await openGeminiBrowser("ai3-reviewer",  "AI3 REVIEWER");
//   const { browser: b4, page: ai4Page } = await openGeminiBrowser("ai4-draft",     "AI4 FINAL-DRAFT");

//   // Wait for login if needed
//   const allPages = [ai1Page, ai2Page, ai3Page, ai4Page];
//   if (allPages.some(p => p.url().includes("accounts.google.com"))) {
//     console.log("  Waiting for all windows to reach Gemini...\n");
//     await Promise.all(allPages.map(p =>
//       p.waitForFunction(() => location.href.includes("gemini.google.com"), { timeout: 180000, polling: 1000 })
//     ));
//   }

//   for (const [p, lbl] of [[ai1Page, "AI1"], [ai2Page, "AI2"], [ai3Page, "AI3"], [ai4Page, "AI4"]]) {
//     await p.waitForFunction(
//       () => !!document.querySelector('rich-textarea div[contenteditable="true"], div[contenteditable="true"], div[role="textbox"], textarea'),
//       { timeout: 30000, polling: 1000 }
//     ).catch(() => console.warn(`  [${lbl}] Input wait timed out`));
//   }
//   await sleep(2000);
//   console.log("All windows ready.\n");

//   // ── STEP 1: AI1 parses directions into questions ───────────────────────────
//   console.log("=".repeat(70));
//   console.log("  STEP 1 — AI1 parsing directions into questions");
//   console.log("=".repeat(70) + "\n");

//   await sendMessage(ai1Page, buildAI1Prompt(), "AI1 PARSER");
//   const ai1Raw = await waitForResponse(ai1Page, "AI1 PARSER");

//   let questions;
//   try {
//     questions = extractQuestionsFromResponse(ai1Raw);
//   } catch (e) {
//     console.error(`  ✗ AI1 parse failed: ${e.message}`);
//     process.exit(1);
//   }

//   console.log(`\n  AI1 generated ${questions.length} question(s):`);
//   questions.forEach((q, i) => console.log(`    [${i + 1}] ${q}`));

//   // ── STEP 2: AI1 self-checks its own question list ──────────────────────────
//   console.log("\n" + "=".repeat(70));
//   console.log("  STEP 2 — AI1 self-checking question coverage");
//   console.log("=".repeat(70) + "\n");

//   await sendMessage(ai1Page, buildAI1SelfCheckPrompt(questions), "AI1 PARSER");
//   const ai1CheckRaw = await waitForResponse(ai1Page, "AI1 PARSER");

//   try {
//     const revised = extractQuestionsFromResponse(ai1CheckRaw);
//     if (revised.length >= questions.length) {
//       questions = revised;
//       console.log(`\n  AI1 self-check complete. Final question count: ${questions.length}`);
//     } else {
//       console.log(`\n  AI1 self-check returned fewer questions — keeping original list.`);
//     }
//   } catch (_) {
//     console.log(`\n  AI1 self-check did not change the list.`);
//   }

//   console.log(`\n  Final questions to answer (${questions.length} total):`);
//   questions.forEach((q, i) => console.log(`    [${i + 1}] ${q}`));

//   // ── STEP 3: AI2 answers, AI3 checks citations ──────────────────────────────
//   console.log("\n" + "=".repeat(70));
//   console.log(`  STEP 3 — AI2 answers each question, AI3 checks citations`);
//   console.log("=".repeat(70));

//   for (let idx = 0; idx < questions.length; idx++) {
//     const questionText = questions[idx];
//     const qNum = idx + 1;
//     const isSummary = questionText.toLowerCase().includes("summary");

//     console.log(`\n${"─".repeat(70)}`);
//     console.log(`  QUESTION ${qNum} of ${questions.length}`);
//     console.log(`  ${questionText}`);
//     console.log(`${"─".repeat(70)}`);

//     // AI2 writes the answer
//     await sendMessage(ai2Page, buildAI2Prompt(idx, questionText, questions.length), "AI2 WRITER");
//     let answer = await waitForResponse(ai2Page, "AI2 WRITER");

//     // AI3 checks citations — loop until PASS or max attempts
//     let citationApproved = false;
//     let citationAttempt  = 0;
//     const MAX_CITATION_ATTEMPTS = 5;

//     while (!citationApproved && citationAttempt < MAX_CITATION_ATTEMPTS) {
//       citationAttempt++;
//       console.log(`\n  [CITATION CHECK] Attempt ${citationAttempt}/${MAX_CITATION_ATTEMPTS} for Q${qNum}`);

//       await sendMessage(ai3Page, buildAI3Prompt(questionText, answer), "AI3 REVIEWER");
//       const ai3Feedback = await waitForResponse(ai3Page, "AI3 REVIEWER");

//       console.log(`\n  [AI3]:\n  ` + ai3Feedback.split("\n").join("\n  "));

//       if (ai3Feedback.includes("CITATION RESULT: PASS")) {
//         console.log(`\n  ✓ Citations PASSED for Q${qNum}`);
//         citationApproved = true;
//       } else {
//         console.log(`\n  ✗ Citations FAILED — sending back to AI2 to fix...`);
//         await sendMessage(ai2Page, buildAI2CorrectionPrompt(questionText, answer, ai3Feedback), "AI2 WRITER");
//         answer = await waitForResponse(ai2Page, "AI2 WRITER");
//         await sleep(2000);
//       }
//     }

//     if (!citationApproved) {
//       console.warn(`  ⚠ Max citation attempts reached for Q${qNum} — using best version.`);
//     }

//     // Save to rough draft file
//     if (isSummary) {
//       appendSummaryToFile(answer);
//     } else {
//       appendToFile(qNum, questionText, answer);
//     }

//     // Store for AI4 cohesion pass
//     roughDraftAnswers.push({ qNum, questionText, answer });

//     console.log(`\n  ✓ Q${qNum} complete and saved to rough draft.`);
//     await sleep(2000);
//   }

//   // ── STEP 4: AI4 cohesion pass + AI3 final APA check → Final Draft ──────────
//   console.log("\n" + "=".repeat(70));
//   console.log("  STEP 4 — AI4 cohesion + transition pass, AI3 re-checks → Final Draft");
//   console.log("=".repeat(70));

//   initFinalOutputFile();

//   for (let idx = 0; idx < roughDraftAnswers.length; idx++) {
//     const { qNum, questionText } = roughDraftAnswers[idx];
//     const isSummary = questionText.toLowerCase().includes("summary");

//     console.log(`\n${"─".repeat(70)}`);
//     console.log(`  AI4 PASS — Q${qNum} of ${roughDraftAnswers.length}`);
//     console.log(`  ${questionText}`);
//     console.log(`${"─".repeat(70)}`);

//     // AI4 rewrites for cohesion, relevance, transitions, and APA
//     await sendMessage(ai4Page, buildAI4MasterEditorPrompt(idx, roughDraftAnswers), "AI4 FINAL-DRAFT");
//     let finalAnswer = await waitForResponse(ai4Page, "AI4 FINAL-DRAFT");

//     // AI3 re-checks the AI4 output — loop until PASS or max attempts
//     let finalCitationApproved = false;
//     let finalCitationAttempt  = 0;
//     const MAX_FINAL_CITATION_ATTEMPTS = 5;

//     while (!finalCitationApproved && finalCitationAttempt < MAX_FINAL_CITATION_ATTEMPTS) {
//       finalCitationAttempt++;
//       console.log(`\n  [FINAL CITATION CHECK] Attempt ${finalCitationAttempt}/${MAX_FINAL_CITATION_ATTEMPTS} for Q${qNum}`);

//       await sendMessage(ai3Page, buildAI3Prompt(questionText, finalAnswer), "AI3 REVIEWER");
//       const ai3FinalFeedback = await waitForResponse(ai3Page, "AI3 REVIEWER");

//       console.log(`\n  [AI3 on AI4 output]:\n  ` + ai3FinalFeedback.split("\n").join("\n  "));

//       if (ai3FinalFeedback.includes("CITATION RESULT: PASS")) {
//         console.log(`\n  ✓ Final citations PASSED for Q${qNum}`);
//         finalCitationApproved = true;
//       } else {
//         console.log(`\n  ✗ Final citations FAILED — sending back to AI4 to fix...`);
//         await sendMessage(ai4Page, buildAI2CorrectionPrompt(questionText, finalAnswer, ai3FinalFeedback), "AI4 FINAL-DRAFT");
//         finalAnswer = await waitForResponse(ai4Page, "AI4 FINAL-DRAFT");
//         await sleep(2000);
//       }
//     }

//     if (!finalCitationApproved) {
//       console.warn(`  ⚠ Max final citation attempts reached for Q${qNum} — using best version.`);
//     }

//     // Write to final draft file
//     if (isSummary) {
//       appendFinalSummaryToFile(finalAnswer);
//     } else {
//       appendFinalAnswerToFile(qNum, questionText, finalAnswer);
//     }

//     console.log(`\n  ✓ Final Q${qNum} complete and saved to final draft.`);
//     await sleep(2000);
//   }

//   // ── DONE ──────────────────────────────────────────────────────────────────
//   console.log("\n" + "=".repeat(70));
//   console.log("  ALL QUESTIONS COMPLETE");
//   console.log(`  Rough draft saved to: ${OUTPUT_PATH}`);
//   console.log(`  Final draft saved to: ${FINAL_OUTPUT_PATH}`);
//   console.log("=".repeat(70) + "\n");

//   // Uncomment to auto-close all windows when done:
//   // await b1.close(); await b2.close(); await b3.close(); await b4.close();
// })();

// app.listen(3000, () => console.log("working"));










































/////////with parthentical and narrative







import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import express from "express";

const app = express();

// ╔════════════════════════════════════════════════════════════╗
// ║   CONFIG — edit these                                     ║
// ╚════════════════════════════════════════════════════════════╝

const OUTPUT_FILENAME = "lit mode 5 assig.txt";
const SEC_OUTPUT_FILENAME = `FINAL ${OUTPUT_FILENAME}`;

const ASSIGNMENT_DIRECTIONS = `

do this 

Part A –Math Literacy Software/Digital Tool Evaluation (table)
Follow the steps below to complete your software/digital tool evaluation table for Grades 3–6
math literacy integration:
o Select 2-3 Software/Digital Math Tools
Choose 2-3 educational math tools or platforms appropriate for students in Grades 3–6
(e.g., DreamBox, Prodigy, IXL, Zearn, Freckle, Khan Academy). These tools should offer
interactive or instructional features that could support literacy development within
math instruction.
o Create a Table for Evaluation
Create a table with the following columns:
o Tool Name
o Grade Level Target (3, 4, 5, or 6)
o Accuracy
o Fluency
o Vocabulary
o Oral Language
o Reading Comprehension
o Scaffolding
For each literacy skill, rate the tool as High, Moderate, or Low in terms of support, and
include 1–2 brief notes or examples that justify each rating.
o Compare and Reflect
Review your completed table and consider which tool offers the most balanced or
targeted literacy support for math instruction. Use this analysis to guide your selection
of one tool to feature in Part B of the assignment (lesson plan and reflection).



then this 

make qustion read this

then 

Part B – Math Integrated Literacy Lesson Plan & Reflection
Using your Part A Math Literacy Digital Tool Evaluation, develop a detailed lesson plan on the thematic unit communites and change that
incorporates at least 2 -3 of the key components of effective literacy instruction, specifically
focused on:
▪ Accuracy
▪ Fluency
▪ Vocabulary
▪ Oral Language
▪ Reading Comprehension
▪ Scaffolding
▪ Your lesson should be research-informed and responsive to student
needs.
o Remember, your lesson must be part of the theme you selected during module 1, as this
is a thematic unit.
Setting the Stage for Success
o Baker College Teacher Prep Lesson Plan Format
Checklist Instructions
1. Choose at least one of the digital software/digital tools from Part A as the foundation of
your math lesson.
2. Create a literacy-integrated lesson plan that:
o Targets a math standard and a literacy standard.
o Includes explicit strategies to build
▪ Accuracy
▪ Fluency
▪ Vocabulary
▪ Oral Language
▪ Reading Comprehension
● Scaffolding
o Involves engaging activities (e.g., read-alouds, group work, performance, writing
tasks).
o Specifically integrates the software/digital tool you evaluated and selected

then make qustion do this

then make Qs for this below



Baker College
Teacher Prep Lesson Plan Format for thematic unit communitey and change
Subject Area & Grade Level: Lesson Duration:
Lesson Goal:
What do we want
students to learn?
Assessment:
How will we know they
have learned it?
(see guide)
Intervention:
What will we do if they
don’t learn it?
(see guide)
Enrichment:
What will we do if they
already know it?
(see guide)
State Standards:
Learning Objective:
Materials:
Select your learning strategy:
● Direct Teach
● Demonstration
● Cooperative Learning
● Differentiation
● Discovery/Inquiry-Based Learning
● Project-Based Learning
● Reading/Writing/Math Workshop
● Other
Activities Planned: ___ Active (Students are active participants in learning)
___ Passive (Teacher led lecture/demonstration)
___ Both
Lesson Delivery Steps:
Core Teaching Practices addressed in your lesson (check all that apply): (from MDE CTPs)
● Leading a group discussion (CTP #1)
● Explaining and modeling content, practices, and strategies (CTP #2)
● Eliciting and interpreting individual students’ thinking (CTP #3)
● Building respectful relationships with students (CTP #10)
● Check for Understanding (CTP #15)
Real-world connections including attention to English language learners and culturally and historically
responsive practices (diversity, inclusion, equity, and social justice):
Technology tools (listed):
Collaboration opportunities (list all that are included whole group, small group, partnerships, building
resource personnel i.e., school social worker, special educators, parents, etc…):
Lesson Plan Guide
Assessment: Used to gather information about a student’s progress towards mastery of the learning objective,
help the teacher identify what instruction is working well and what needs refinement, and informs the
students about their learning.
Options to consider
￿ Diagnostic/Pre-Assessment – Used to check prior knowledge before a lesson
￿ Self-Assessment (Writing Prompts, Running Records, Performance Task, Other)
￿ Formative – Used during a lesson to check progress, identify any misconception, and give feedback to
students (Learning/Response Log, Admin/Exit Ticket, Think/Pair/Share, One Minute Paper, Other)
￿ Summative – Used at the end of a lesson to check student mastery of the objective (End of Unit Test,
Final Exams or Mid-term Exams, State Tests, Culminating Project, Portfolio, Other)
Intervention: How will we respond when they don’t learn?
￿ Differentiated Instruction
￿ Target specific skills
￿ Data item analysis
￿ Leveled materials (below, on level,
above)
￿ Bloom's Taxonomy
￿ Grade recovery (re-do/correct)
￿ Parent contact
￿ Referral to Student Support Team
￿ Graphic organizers
￿ Manipulatives
￿ Choice boards
￿ Immediate feedback
￿ Flexible grouping
￿ Extended responses (math/reading)
￿ Journal/Reading logs
Responses to Intervention (RtI)
￿ Small group instruction
￿ Tiered group instruction (Tier I, II, III)
￿ 1-1
￿ Centers (leveled)
￿ Re-teach in a different way
￿ Modify: backtrack, build background knowledge
￿ Tutoring: after or before school, lunch
￿ Referral to Student Support Team
Enrichment: How will we respond if they already know it?
￿ Choice boards
￿ Use vocabulary to write sentences
￿ Accelerated reader
￿ Centers-High level
￿ Reading buddies
￿ Peer tutoring
￿ Enriched-Leveled Reader-Novels
￿ Picture/writing journals
￿ Independent projects
￿ Separate curriculum
￿ Games
￿ Group leader


then do this 


Write a 1-page reflection that addresses:
● How does this lesson build both math understanding and support literacy
development?
● In what ways does the selected digital tool help scaffold instruction or
promote student engagement?


`;

const SOURCE_PAGES = `




---
AUTHOR: Michigan Deparment of Education
DATE: n.d.
PAGE: 62 
CHAPTER: 
note: use this as a state standard in lesson
SECTION: Grades 6–8 students column Craft and Structure
EXACT TEXT:

Analyze the structure an author uses to organize a
text, including how the major sections contribute
to the whole and to an understanding of the topic
---

---
AUTHOR: Michigan Deparment of Education
DATE: n.d.
PAGE: 62 
CHAPTER: 
note: use this as a state standard in lesson
SECTION: Grades 6–8 students column and Craft and Structure
EXACT TEXT:

Analyze the structure an author uses to organize a
text, including how the major sections contribute
to the whole and to an understanding of the topic
---

---
AUTHOR: Michigan Deparment of Education
DATE: n.d.
PAGE: 62 
CHAPTER: 
note: use this as a state standard in lesson

SECTION: Grades 6–8 students column and Integration of Knowledge and Ideas
EXACT TEXT:

Integrate quantitative or technical information
expressed in words in a text with a version of that
information expressed visually (e.g., in a flowchart,
diagram, model, graph, or table).
---



---
AUTHOR: Ramlal
DATE: 2023
PAGE: 20 
CHAPTER: Chapter 3
SECTION: dose not have one

EXACT TEXT:

INTRODUCTION: COMPREHENSION In Chapter 2, we explored the connections accuracy, fluency, and vocabulary may have to a student’s comprehension of a text. In this chapter, we will delve more deeply into the aspects we must consider when teaching reading as it relates to comprehension.
TExT SELECTION Comprehension is how a student understands what was read. When we consider our instructional plans, it is important to think of the types of texts we expect our students to work with. As comprehension is essential for learning in all subject areas, we must ensure that our instructional plans include texts from various genres 
---


---
AUTHOR: Ramlal
DATE: 2023
PAGE: 20 
CHAPTER: Chapter 3
SECTION: dose not have one

EXACT TEXT:

INTRODUCTION: COMPREHENSION In Chapter 2, we explored the connections accuracy, fluency, and vocabulary may have to a student’s comprehension of a text. In this chapter, we will delve more deeply into the aspects we must consider when teaching reading as it relates to comprehension.
TExT SELECTION Comprehension is how a student understands what was read. When we consider our instructional plans, it is important to think of the types of texts we expect our students to work with. As comprehension is essential for learning in all subject areas, we must ensure that our instructional plans include texts from various genres 
---


---
AUTHOR: Ramlal
DATE: 2023
PAGE: 9 
CHAPTER: Chapter 2
SECTION: ACCURACY

EXACT TEXT:

ACCURACY Accuracy involves how a student reads a text aloud. When a student reads aloud the words and phrases in the printed text the way they are supposed to be pronounced, the student is reading with accuracy. Chapter 6 will explore specific ways to measure students’ accuracy rates to determine how to select a level of text suitable for each student. The ability to read a text accurately can greatly contribute to a student’s comprehension
of the text. Similarly, if students are unable to read a text accurately, they can often struggle to understand what they read. Table 2.1 lists some possible areas of need to look for that may contribute to struggles with accuracy. If accuracy is an area of need for your students, the following are some activities you
can implement in your classroom to offer support.
---

---
AUTHOR: Ramlal
DATE: 2023
PAGE: 9 
CHAPTER: Chapter 2
SECTION: ACCURACY

EXACT TEXT:

ACCURACY Accuracy involves how a student reads a text aloud. When a student reads aloud the words and phrases in the printed text the way they are supposed to be pronounced, the student is reading with accuracy. Chapter 6 will explore specific ways to measure students’ accuracy rates to determine how to select a level of text suitable for each student. The ability to read a text accurately can greatly contribute to a student’s comprehension
of the text. Similarly, if students are unable to read a text accurately, they can often struggle to understand what they read. Table 2.1 lists some possible areas of need to look for that may contribute to struggles with accuracy. If accuracy is an area of need for your students, the following are some activities you
can implement in your classroom to offer support.
---

---
AUTHOR: Ramlal
DATE: 2023
PAGE: 13 
CHAPTER: Chapter 2
SECTION: dose not have one

EXACT TEXT:

FLUENCY Fluency and accuracy are closely linked. Fluency is how a student reads a text with automaticity (accuracy and speed) and prosody, or expression. If one or more of these components are an area of need for a student, then struggles with comprehension and accuracy may develop. For instance, suppose I read a text very quickly, ignoring punctuation and other textual features, such as bolded or capitalized words. Reading a text this way may prevent me from fully understanding the author’s intended message. Thus, when observing how a student reads a text aloud, be sure to pay special attention to their fluency (automaticity and prosody). If you do notice that fluency is an area of need for a student, here are some activities you can incorporate into your instructional plans to offer support.
Choral Reading Choral reading can be completed in a whole-class or small-group setting. Choral reading builds fluency because it offers students a model of what fluent reading should sound like using a predetermined text and immediately offers an opportunity for students to practice fluent reading using the same text in which the fluent reading was modeled. Choral reading requires students to read the text in unison with the teacher. A text for choral reading should be brief in length, such as a poem, and it should be clearly related to the experiences of the students, so the prior knowledge connection is apparent. Use this text over several days until the students demonstrate fluent reading
---

---
AUTHOR: Ramlal
DATE: 2023
PAGE: 13 
CHAPTER: Chapter 2
SECTION: dose not have one

EXACT TEXT:

FLUENCY Fluency and accuracy are closely linked. Fluency is how a student reads a text with automaticity (accuracy and speed) and prosody, or expression. If one or more of these components are an area of need for a student, then struggles with comprehension and accuracy may develop. For instance, suppose I read a text very quickly, ignoring punctuation and other textual features, such as bolded or capitalized words. Reading a text this way may prevent me from fully understanding the author’s intended message. Thus, when observing how a student reads a text aloud, be sure to pay special attention to their fluency (automaticity and prosody). If you do notice that fluency is an area of need for a student, here are some activities you can incorporate into your instructional plans to offer support.
Choral Reading Choral reading can be completed in a whole-class or small-group setting. Choral reading builds fluency because it offers students a model of what fluent reading should sound like using a predetermined text and immediately offers an opportunity for students to practice fluent reading using the same text in which the fluent reading was modeled. Choral reading requires students to read the text in unison with the teacher. A text for choral reading should be brief in length, such as a poem, and it should be clearly related to the experiences of the students, so the prior knowledge connection is apparent. Use this text over several days until the students demonstrate fluent reading
---



---
AUTHOR: Ramlal
DATE: 2023
PAGE: 15 
CHAPTER: Chapter 2
SECTION: dose not have one

EXACT TEXT:

VOCABULARY Vocabulary relates to the understanding a student demonstrates when they read a text. This can greatly impact comprehension. When working with your students, asking questions and having discussions can assist you in identifying how much assistance they require with developing vocabulary skills. While it is not useful to attempt to determine a specific vocabulary level, students who demonstrate a need to work on vocabulary need to be identified as vocabulary may have a huge impact on how students comprehend what was read. It can also have an impact on the quality of writing that is produced. Typically, vocabulary skills should be incorporated into your daily reading instruction and should strongly connect to the content areas. Here are some activities that can offer support in this area.
Interactive Word Walls If vocabulary is an area of need for the students in your class, one suggestion is to create word walls of key concepts relevant to the current unit of study. To make a word wall interactive, use a sentence strip or large index card that has been folded in half. On the outside cover of the card, write the new word with a visual. On the inside of the card, write the definition of the new word and a sample sentence in which the word is used. Display these cards on the classroom word wall. You can also have students create their own personal word walls using poster boards. Frequently refer to the words on the word wall and encourage students to use them when reading and writing. Your overall goal with using word walls is to develop students’ vocabulary in a meaningful way, rather than simply having them memorize the word meanings.
---


`;

// ════════════════════════════════════════════════════════════
// Everything below runs automatically.
// ════════════════════════════════════════════════════════════

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const launchOptions = {
  headless: false,
  executablePath: CHROME_PATH,
  slowMo: 80,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-blink-features=AutomationControlled",
    "--start-maximized",
  ],
  defaultViewport: null,
  ignoreDefaultArgs: ["--enable-automation"],
};

// ─── ROUGH DRAFT ANSWER STORAGE ───────────────────────────────────────────────
// Populated during Step 3, consumed by Step 4 (AI4)
const roughDraftAnswers = []; // { qNum, questionText, answer }

// ─── OUTPUT FILE PATHS ────────────────────────────────────────────────────────
const OUTPUT_PATH       = path.resolve(OUTPUT_FILENAME);
const FINAL_OUTPUT_PATH = path.resolve(SEC_OUTPUT_FILENAME);

// ─── ROUGH DRAFT FILE HELPERS ─────────────────────────────────────────────────

function initOutputFile() {
  const header = [
    "=".repeat(70),
    `  ASSIGNMENT: ${OUTPUT_FILENAME.replace(".txt", "").replace(/_/g, " ").toUpperCase()}`,
    `  Generated: ${new Date().toLocaleString()}`,
    "=".repeat(70),
    "",
  ].join("\n");
  fs.writeFileSync(OUTPUT_PATH, header, "utf8");
  console.log(`\n  ✓ Rough draft file created: ${OUTPUT_PATH}\n`);
}

function appendToFile(questionNumber, questionText, answerText) {
  const block = [
    "",
    "─".repeat(70),
    `  QUESTION ${questionNumber}`,
    "─".repeat(70),
    questionText.trim(),
    "",
    "─".repeat(70),
    `  ANSWER ${questionNumber}`,
    "─".repeat(70),
    answerText.trim(),
    "",
  ].join("\n");
  fs.appendFileSync(OUTPUT_PATH, block, "utf8");
  console.log(`\n  ✓ Question ${questionNumber} appended to ${OUTPUT_PATH}`);
}

function appendSummaryToFile(summaryText) {
  const block = [
    "",
    "=".repeat(70),
    "  SUMMARY (200-300 words)",
    "=".repeat(70),
    summaryText.trim(),
    "",
  ].join("\n");
  fs.appendFileSync(OUTPUT_PATH, block, "utf8");
  console.log(`\n  ✓ Summary appended to ${OUTPUT_PATH}`);
}

// ─── FINAL DRAFT FILE HELPERS ─────────────────────────────────────────────────

function initFinalOutputFile() {
  const header = [
    "=".repeat(70),
    `  FINAL DRAFT: ${SEC_OUTPUT_FILENAME.replace(".txt", "").replace(/_/g, " ").toUpperCase()}`,
    `  Generated: ${new Date().toLocaleString()}`,
    "=".repeat(70),
    "",
  ].join("\n");
  fs.writeFileSync(FINAL_OUTPUT_PATH, header, "utf8");
  console.log(`\n  ✓ Final draft file created: ${FINAL_OUTPUT_PATH}\n`);
}

function appendFinalAnswerToFile(questionNumber, questionText, answerText) {
  const block = [
    "",
    "─".repeat(70),
    `  QUESTION ${questionNumber}`,
    "─".repeat(70),
    questionText.trim(),
    "",
    "─".repeat(70),
    `  ANSWER ${questionNumber}`,
    "─".repeat(70),
    answerText.trim(),
    "",
  ].join("\n");
  fs.appendFileSync(FINAL_OUTPUT_PATH, block, "utf8");
  console.log(`\n  ✓ Final Q${questionNumber} appended to ${FINAL_OUTPUT_PATH}`);
}

function appendFinalSummaryToFile(summaryText) {
  const block = [
    "",
    "=".repeat(70),
    "  SUMMARY (200-300 words)",
    "=".repeat(70),
    summaryText.trim(),
    "",
  ].join("\n");
  fs.appendFileSync(FINAL_OUTPUT_PATH, block, "utf8");
  console.log(`\n  ✓ Final summary appended to ${FINAL_OUTPUT_PATH}`);
}

// ─── GEMINI WINDOW UTILITIES ──────────────────────────────────────────────────

async function openGeminiBrowser(profileName, label) {
  const browser = await puppeteer.launch({
    ...launchOptions,
    args: [...launchOptions.args, `--user-data-dir=C:\\Temp\\puppeteer-${profileName}`],
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    window.chrome = { runtime: {} };
  });
  await page.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
  console.log(`  [${label}] window open.`);
  return { browser, page };
}

async function findInput(page, label) {
  for (const sel of [
    'rich-textarea div[contenteditable="true"]',
    'div[contenteditable="true"]',
    'div[role="textbox"]',
    "textarea",
    ".ql-editor",
  ]) {
    try {
      const el = await page.$(sel);
      if (el && (await el.boundingBox())?.width > 0) return { el, sel };
    } catch (_) {}
  }
  throw new Error(`[${label}] Input box not found`);
}

async function sendMessage(page, text, label) {
  const { el, sel } = await findInput(page, label);
  await el.click(); await sleep(400);
  await page.keyboard.down("Control"); await page.keyboard.press("a"); await page.keyboard.up("Control");
  await page.keyboard.press("Backspace"); await sleep(200);
  const ok = await page.evaluate((t, s) => {
    const el = document.querySelector(s); if (!el) return false;
    el.focus(); return document.execCommand("insertText", false, t);
  }, text, sel);
  if (!ok) await page.evaluate((t, s) => {
    const el = document.querySelector(s); if (!el) return; el.focus();
    if (el.contentEditable === "true") el.innerText = t;
    else Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(el, t);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, text, sel);
  await sleep(500);
  const btn = await page.$('button[aria-label="Send message"], button[aria-label="Submit"], button[jsname="Qx7uuf"]');
  if (btn) await btn.click(); else await page.keyboard.press("Enter");
  await sleep(2000);
}

async function waitForResponse(page, label, timeoutMs = 240000) {
  console.log(`  [${label}] Waiting...`);
  try {
    await page.waitForFunction(
      () => !!document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'),
      { timeout: 20000, polling: 500 }
    );
  } catch (_) {}
  await page.waitForFunction(
    () => !document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'),
    { timeout: timeoutMs, polling: 1000 }
  ).catch(() => {});
  await sleep(3000);
  const text = await page.evaluate(() => {
    const all = [
      ...document.querySelectorAll("model-response"),
      ...document.querySelectorAll('[data-message-author-role="model"]'),
      ...document.querySelectorAll(".model-response-text"),
      ...document.querySelectorAll("message-content"),
    ];
    return all.length ? all[all.length - 1].innerText.trim() : "";
  });
  if (!text) console.warn(`  [${label}] Empty response`);
  else console.log(`  [${label}] ${text.length} chars`);
  return text;
}

// ─── AI1 PROMPT — parse directions into question array ────────────────────────

function buildAI1Prompt() {
  return `You are reading an assignment and breaking it down into individual questions or tasks.

${"=".repeat(55)}
ASSIGNMENT DIRECTIONS:
${"=".repeat(55)}
${ASSIGNMENT_DIRECTIONS.trim()}

${"=".repeat(55)}
YOUR JOB:
${"=".repeat(55)}
Read the directions carefully. Extract every numbered requirement or task as a
separate question. Include the summary requirement as the last item.

Output ONLY a JSON array of strings. Each string is one question/task exactly
as it appears in the directions. No extra text, no markdown, no explanation.
Just the raw JSON array.

Example format:
[
  "Examine how the teacher supported students in using science talk",
  "Determine strategies used to introduce and reinforce science vocabulary",
  "Include a 200-300 word summary with APA 7th Edition citations"
]

Output the JSON array now:`;
}

// ─── AI1 SELF-CHECK PROMPT ────────────────────────────────────────────────────

function buildAI1SelfCheckPrompt(generatedQuestions) {
  return `You previously broke the assignment directions into this list of questions:

${JSON.stringify(generatedQuestions, null, 2)}

Now compare your list against the original directions:

${"=".repeat(55)}
ORIGINAL DIRECTIONS:
${"=".repeat(55)}
${ASSIGNMENT_DIRECTIONS.trim()}

${"=".repeat(55)}
YOUR JOB:
${"=".repeat(55)}
Check if your list covers EVERY requirement in the directions.
For each original requirement say:
  COVERED: [yes/no] — [requirement text]

If anything is missing, output the corrected complete JSON array at the end.
If everything is covered, output the original array unchanged at the end.

End your response with the final JSON array — nothing after it.`;
}

// ─── AI2 PROMPT — answer one question ─────────────────────────────────────────

function buildAI2Prompt(questionIndex, questionText, totalQuestions) {
  return `You are answering question ${questionIndex + 1} of ${totalQuestions} for an assignment.
Answer ONLY this one question — do not answer other questions.

${"=".repeat(55)}
QUESTION ${questionIndex + 1}:
${"=".repeat(55)}
${questionText}

${"=".repeat(55)}
SOURCE TEXT — use these for citations:
${"=".repeat(55)}
${SOURCE_PAGES.trim()}

${"=".repeat(55)}
APA 7TH EDITION CITATION RULES:
${"=".repeat(55)}

You MUST use both PARENTHETICAL and NARRATIVE citations

PARENTHETICAL FORMAT:
  Author (date) verb "word for word text" (p. #).
  CORRECT: Ramlal (2023) explains "vocabulary relates to understanding" (p. 23).
  CORRECT: Annenberg Learner (n.d.) notes "students become engaged whenever they are using their senses" (p. 24).

  WRONG: "text" (Author, date, p. #).     ← author/date must be in the sentence
  WRONG: "Text starts capital" (p. #).    ← pull capital word out, lowercase it
  WRONG: "text." (p. #).                  ← period goes AFTER (p. #) never inside quotes
  WRONG: such as "text" (p. #).           ← no filler words before opening quote

NARRATIVE FORMAT:
  According to Author (date), from Chapter X on page #, ...
  As Author (date) explains on page #, ...

  If the source HAS a chapter: According to Ramlal (2023), from Chapter 3 on page 23, ...
  If NO chapter (Annenberg Learner): As Annenberg Learner (n.d.) explains on page 25, ...

  WRONG: Ramlal (2023, Chapter 3, p. 23) states...  ← chapter/page inside parens
  WRONG: According to Ramlal (2023), teaching is important.  ← no page mentioned

CAPITAL FIRST WORD RULE:
  If source starts with a capital, pull that word OUT of the quotes, lowercase it.
  SOURCE: Students become engaged whenever they are using their senses
  RIGHT:  Annenberg Learner (n.d.) notes that students "become engaged whenever they are using their senses" (p. 24).
  WRONG:  Annenberg Learner (n.d.) notes "Students become engaged" (p. 24).

PERIOD RULE: Period AFTER (p. #) — NEVER inside the quotes.
NO MIXED SOURCES: Annenberg Learner text → Annenberg Learner (n.d.). Ramlal text → Ramlal (2023).
IF IN DOUBT: drop the citation and write a plain sentence.

Write a thorough answer to the question above using at least 2 citations.
If this is the summary question, write 200-300 words.
Output ONLY your answer — no preamble, no "here is my answer".`;
}

// ─── AI3 PROMPT — check citations ─────────────────────────────────────────────

function buildAI3Prompt(questionText, answerText) {
  return `You are a strict APA 7th Edition citation reviewer.

${"=".repeat(55)}
QUESTION BEING ANSWERED:
${"=".repeat(55)}
${questionText}

${"=".repeat(55)}
ANSWER TO REVIEW:
${"=".repeat(55)}
${answerText}

${"=".repeat(55)}
WHAT TO CHECK:
${"=".repeat(55)}
TWO citation formats are required — check both are present and correct.

PARENTHETICAL — correct format:
  Author (date) verb "word for word text" (p. #).
  Ramlal (2023) explains "vocabulary relates to understanding" (p. 23).

NARRATIVE — correct format:
  According to Ramlal (2023), from Chapter 3 on page 23, ...
  As Annenberg Learner (n.d.) explains on page 24, ...

VIOLATIONS TO FLAG:
1. "text" (Author, date, p. #) — WRONG. Fix: Author (date) verb "text" (p. #).
2. Period inside closing quote: "text." (p. #) — WRONG. Fix: "text" (p. #).
3. Quote with no (p. #) after it. Fix: add (p. #) or drop quote.
4. Capital first word inside opening quote. Fix: pull out, lowercase, blend into sentence.
5. Empty quotes "" (p. #). Fix: drop and write plain sentence.
6. Chapter/page inside narrative parens: Author (2023, Chapter 3). Fix: write in sentence.
7. Narrative missing page: According to Author (date), teaching is important. Fix: add page.
8. Only one citation type used — both parenthetical AND narrative required.
9. Sources mixed — Ramlal text cited as Annenberg Learner or vice versa.
10. Quote fragment mid-sentence: Author (n.d.) notes a "short term" (p. #) feels... WRONG.
    The sentence must END after (p. #).

For each violation: quote the exact wrong text and state the fix.

End with EXACTLY one of these as the very last line:
CITATION RESULT: PASS
CITATION RESULT: FAIL`;
}

// ─── AI2 CORRECTION PROMPT ────────────────────────────────────────────────────

function buildAI2CorrectionPrompt(questionText, currentAnswer, ai3Feedback) {
  return `Your answer has citation violations. Fix every one now.

${"=".repeat(55)}
QUESTION:
${"=".repeat(55)}
${questionText}

${"=".repeat(55)}
YOUR CURRENT ANSWER WITH VIOLATIONS:
${"=".repeat(55)}
${currentAnswer}

${"=".repeat(55)}
REVIEWER FEEDBACK:
${"=".repeat(55)}
${ai3Feedback}

${"=".repeat(55)}
FIX USING THESE RULES:
${"=".repeat(55)}
PARENTHETICAL: Author (date) verb "word for word text" (p. #).
  Ramlal (2023) explains "vocabulary relates to understanding" (p. 23).

NARRATIVE: According to Author (date), from Chapter X on page #, ...
  As Annenberg Learner (n.d.) explains on page 24, ...

- Period AFTER (p. #) — NEVER inside quotes
- Capital first word → pull out, lowercase, blend into sentence
- Quote must END the sentence — never continue after (p. #) with lowercase text
- Both parenthetical AND narrative required
- Page always present — either as (p. #) or said naturally in the sentence

Output ONLY the corrected answer — no preamble.`;
}

// ─── AI4 PROMPT — cohesion + transitions + APA on final draft ─────────────────

function buildAI4MasterEditorPrompt(targetIdx, roughDraftAnswers) {
  const target = roughDraftAnswers[targetIdx];

  const allOthers = roughDraftAnswers
    .filter((_, i) => i !== targetIdx)
    .map(a => `--- Q${a.qNum}: ${a.questionText}\n${a.answer}`)
    .join("\n\n");

  const prevAnswer = targetIdx > 0
    ? `--- Q${roughDraftAnswers[targetIdx - 1].qNum}: ${roughDraftAnswers[targetIdx - 1].questionText}\n${roughDraftAnswers[targetIdx - 1].answer}`
    : "None — this is the first answer.";

  const nextAnswer = targetIdx < roughDraftAnswers.length - 1
    ? `--- Q${roughDraftAnswers[targetIdx + 1].qNum}: ${roughDraftAnswers[targetIdx + 1].questionText}\n${roughDraftAnswers[targetIdx + 1].answer}`
    : "None — this is the last answer.";

  return `You are the Lead Editor for a Baker College assignment final draft.

=======================================================
YOUR TARGET: Q${target.qNum} — ${target.questionText}
=======================================================
${target.answer}

=======================================================
ALL OTHER ANSWERS IN THE ASSIGNMENT (for relevance check):
=======================================================
${allOthers}

=======================================================
IMMEDIATELY PREVIOUS ANSWER (transition context):
=======================================================
${prevAnswer}

=======================================================
IMMEDIATELY NEXT ANSWER (transition context):
=======================================================
${nextAnswer}

=======================================================
YOUR TASKS:
=======================================================
1. RELEVANCE: Compare this answer to ALL other answers.
   - Remove any content that duplicates what another answer already covers.
   - Remove any content that has no relevance to the assignment's overall topic.
   - If the answer is missing relevant context that ties it to the assignment, add it.

2. FLOW: Add a natural transition sentence at the START that connects from the previous answer.
   Add a natural transition sentence at the END that leads into the next answer.
   If this is the first or last answer, only add one transition where applicable.

3. APA 7TH REPAIR: Fix every citation violation using the rules below.

=======================================================
APA 7TH EDITION CITATION RULES:
=======================================================
You MUST use BOTH parenthetical AND narrative citations. Max 3 parenthetical per answer, rest narrative.

PARENTHETICAL FORMAT:
  Author (date) verb "word for word text" (p. #).
  CORRECT: Ramlal (2023) explains "vocabulary relates to understanding" (p. 23).
  WRONG: "text" (Author, date, p. #).
  WRONG: "Text starts capital" (p. #).
  WRONG: "text." (p. #).

NARRATIVE FORMAT:
  According to Author (date), from Chapter X on page #, ...
  As Author (date) explains on page #, ...
  WRONG: Ramlal (2023, Chapter 3, p. 23) states...
  WRONG: According to Ramlal (2023), teaching is important.

CAPITAL FIRST WORD RULE:
  Pull capital word OUT of quotes, lowercase it, blend into sentence.

PERIOD RULE: Period AFTER (p. #) — NEVER inside quotes.
NO MIXED SOURCES. IF IN DOUBT: drop citation, write plain sentence.

=======================================================
OUTPUT:
=======================================================
Output ONLY the final polished answer — no preamble, no labels.`;
}

// ─── PARSE AI1 JSON RESPONSE ──────────────────────────────────────────────────

function extractQuestionsFromResponse(raw) {
  const match = raw.match(/\[[\s\S]*\]/g);
  if (!match) throw new Error("AI1 did not return a JSON array");
  const lastArray = match[match.length - 1];
  try {
    const parsed = JSON.parse(lastArray);
    if (!Array.isArray(parsed) || parsed.length === 0)
      throw new Error("Empty or invalid array");
    return parsed.map(q => String(q).trim()).filter(q => q.length > 5);
  } catch (e) {
    throw new Error(`Failed to parse AI1 JSON: ${e.message}\nRaw: ${lastArray.substring(0, 300)}`);
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log("=".repeat(70));
  console.log("  QUESTION-BY-QUESTION PIPELINE");
  console.log("=".repeat(70));
  console.log("  AI1 — parses directions into question array");
  console.log("  AI2 — answers each question with APA citations");
  console.log("  AI3 — checks citations, sends back to AI2 if wrong");
  console.log("  AI4 — cohesion pass on all answers, AI3 re-checks before final save");
  console.log(`  Rough draft:  ${OUTPUT_FILENAME}`);
  console.log(`  Final draft:  ${SEC_OUTPUT_FILENAME}`);
  console.log("=".repeat(70) + "\n");

  initOutputFile();

  // ── Open all four Gemini windows ────────────────────────────────────────────
  console.log("Opening AI windows...\n");
  const { browser: b1, page: ai1Page } = await openGeminiBrowser("ai1-parser",    "AI1 PARSER");
  const { browser: b2, page: ai2Page } = await openGeminiBrowser("ai2-writer",    "AI2 WRITER");
  const { browser: b3, page: ai3Page } = await openGeminiBrowser("ai3-reviewer",  "AI3 REVIEWER");
  const { browser: b4, page: ai4Page } = await openGeminiBrowser("ai4-draft",     "AI4 FINAL-DRAFT");

  // Wait for login if needed
  const allPages = [ai1Page, ai2Page, ai3Page, ai4Page];
  if (allPages.some(p => p.url().includes("accounts.google.com"))) {
    console.log("  Waiting for all windows to reach Gemini...\n");
    await Promise.all(allPages.map(p =>
      p.waitForFunction(() => location.href.includes("gemini.google.com"), { timeout: 180000, polling: 1000 })
    ));
  }

  for (const [p, lbl] of [[ai1Page, "AI1"], [ai2Page, "AI2"], [ai3Page, "AI3"], [ai4Page, "AI4"]]) {
    await p.waitForFunction(
      () => !!document.querySelector('rich-textarea div[contenteditable="true"], div[contenteditable="true"], div[role="textbox"], textarea'),
      { timeout: 30000, polling: 1000 }
    ).catch(() => console.warn(`  [${lbl}] Input wait timed out`));
  }
  await sleep(2000);
  console.log("All windows ready.\n");

  // ── STEP 1: AI1 parses directions into questions ───────────────────────────
  console.log("=".repeat(70));
  console.log("  STEP 1 — AI1 parsing directions into questions");
  console.log("=".repeat(70) + "\n");

  await sendMessage(ai1Page, buildAI1Prompt(), "AI1 PARSER");
  const ai1Raw = await waitForResponse(ai1Page, "AI1 PARSER");

  let questions;
  try {
    questions = extractQuestionsFromResponse(ai1Raw);
  } catch (e) {
    console.error(`  ✗ AI1 parse failed: ${e.message}`);
    process.exit(1);
  }

  console.log(`\n  AI1 generated ${questions.length} question(s):`);
  questions.forEach((q, i) => console.log(`    [${i + 1}] ${q}`));

  // ── STEP 2: AI1 self-checks its own question list ──────────────────────────
  console.log("\n" + "=".repeat(70));
  console.log("  STEP 2 — AI1 self-checking question coverage");
  console.log("=".repeat(70) + "\n");

  await sendMessage(ai1Page, buildAI1SelfCheckPrompt(questions), "AI1 PARSER");
  const ai1CheckRaw = await waitForResponse(ai1Page, "AI1 PARSER");

  try {
    const revised = extractQuestionsFromResponse(ai1CheckRaw);
    if (revised.length >= questions.length) {
      questions = revised;
      console.log(`\n  AI1 self-check complete. Final question count: ${questions.length}`);
    } else {
      console.log(`\n  AI1 self-check returned fewer questions — keeping original list.`);
    }
  } catch (_) {
    console.log(`\n  AI1 self-check did not change the list.`);
  }

  console.log(`\n  Final questions to answer (${questions.length} total):`);
  questions.forEach((q, i) => console.log(`    [${i + 1}] ${q}`));

  // ── STEP 3: AI2 answers, AI3 checks citations ──────────────────────────────
  console.log("\n" + "=".repeat(70));
  console.log(`  STEP 3 — AI2 answers each question, AI3 checks citations`);
  console.log("=".repeat(70));

  for (let idx = 0; idx < questions.length; idx++) {
    const questionText = questions[idx];
    const qNum = idx + 1;
    const isSummary = questionText.toLowerCase().includes("summary");

    console.log(`\n${"─".repeat(70)}`);
    console.log(`  QUESTION ${qNum} of ${questions.length}`);
    console.log(`  ${questionText}`);
    console.log(`${"─".repeat(70)}`);

    // AI2 writes the answer
    await sendMessage(ai2Page, buildAI2Prompt(idx, questionText, questions.length), "AI2 WRITER");
    let answer = await waitForResponse(ai2Page, "AI2 WRITER");

    // AI3 checks citations — loop until PASS or max attempts
    let citationApproved = false;
    let citationAttempt  = 0;
    const MAX_CITATION_ATTEMPTS = 5;

    while (!citationApproved && citationAttempt < MAX_CITATION_ATTEMPTS) {
      citationAttempt++;
      console.log(`\n  [CITATION CHECK] Attempt ${citationAttempt}/${MAX_CITATION_ATTEMPTS} for Q${qNum}`);

      await sendMessage(ai3Page, buildAI3Prompt(questionText, answer), "AI3 REVIEWER");
      const ai3Feedback = await waitForResponse(ai3Page, "AI3 REVIEWER");

      console.log(`\n  [AI3]:\n  ` + ai3Feedback.split("\n").join("\n  "));

      if (ai3Feedback.includes("CITATION RESULT: PASS")) {
        console.log(`\n  ✓ Citations PASSED for Q${qNum}`);
        citationApproved = true;
      } else {
        console.log(`\n  ✗ Citations FAILED — sending back to AI2 to fix...`);
        await sendMessage(ai2Page, buildAI2CorrectionPrompt(questionText, answer, ai3Feedback), "AI2 WRITER");
        answer = await waitForResponse(ai2Page, "AI2 WRITER");
        await sleep(2000);
      }
    }

    if (!citationApproved) {
      console.warn(`  ⚠ Max citation attempts reached for Q${qNum} — using best version.`);
    }

    // Save to rough draft file
    if (isSummary) {
      appendSummaryToFile(answer);
    } else {
      appendToFile(qNum, questionText, answer);
    }

    // Store for AI4 cohesion pass
    roughDraftAnswers.push({ qNum, questionText, answer });

    console.log(`\n  ✓ Q${qNum} complete and saved to rough draft.`);
    await sleep(2000);
  }

  // ── STEP 4: AI4 cohesion pass + AI3 final APA check → Final Draft ──────────
  console.log("\n" + "=".repeat(70));
  console.log("  STEP 4 — AI4 cohesion + transition pass, AI3 re-checks → Final Draft");
  console.log("=".repeat(70));

  initFinalOutputFile();

  for (let idx = 0; idx < roughDraftAnswers.length; idx++) {
    const { qNum, questionText } = roughDraftAnswers[idx];
    const isSummary = questionText.toLowerCase().includes("summary");

    console.log(`\n${"─".repeat(70)}`);
    console.log(`  AI4 PASS — Q${qNum} of ${roughDraftAnswers.length}`);
    console.log(`  ${questionText}`);
    console.log(`${"─".repeat(70)}`);

    // AI4 rewrites for cohesion, relevance, transitions, and APA
    await sendMessage(ai4Page, buildAI4MasterEditorPrompt(idx, roughDraftAnswers), "AI4 FINAL-DRAFT");
    let finalAnswer = await waitForResponse(ai4Page, "AI4 FINAL-DRAFT");

    // AI3 re-checks the AI4 output — loop until PASS or max attempts
    let finalCitationApproved = false;
    let finalCitationAttempt  = 0;
    const MAX_FINAL_CITATION_ATTEMPTS = 5;

    while (!finalCitationApproved && finalCitationAttempt < MAX_FINAL_CITATION_ATTEMPTS) {
      finalCitationAttempt++;
      console.log(`\n  [FINAL CITATION CHECK] Attempt ${finalCitationAttempt}/${MAX_FINAL_CITATION_ATTEMPTS} for Q${qNum}`);

      await sendMessage(ai3Page, buildAI3Prompt(questionText, finalAnswer), "AI3 REVIEWER");
      const ai3FinalFeedback = await waitForResponse(ai3Page, "AI3 REVIEWER");

      console.log(`\n  [AI3 on AI4 output]:\n  ` + ai3FinalFeedback.split("\n").join("\n  "));

      if (ai3FinalFeedback.includes("CITATION RESULT: PASS")) {
        console.log(`\n  ✓ Final citations PASSED for Q${qNum}`);
        finalCitationApproved = true;
      } else {
        console.log(`\n  ✗ Final citations FAILED — sending back to AI4 to fix...`);
        await sendMessage(ai4Page, buildAI2CorrectionPrompt(questionText, finalAnswer, ai3FinalFeedback), "AI4 FINAL-DRAFT");
        finalAnswer = await waitForResponse(ai4Page, "AI4 FINAL-DRAFT");
        await sleep(2000);
      }
    }

    if (!finalCitationApproved) {
      console.warn(`  ⚠ Max final citation attempts reached for Q${qNum} — using best version.`);
    }

    // Write to final draft file
    if (isSummary) {
      appendFinalSummaryToFile(finalAnswer);
    } else {
      appendFinalAnswerToFile(qNum, questionText, finalAnswer);
    }

    console.log(`\n  ✓ Final Q${qNum} complete and saved to final draft.`);
    await sleep(2000);
  }

  // ── DONE ──────────────────────────────────────────────────────────────────
  console.log("\n" + "=".repeat(70));
  console.log("  ALL QUESTIONS COMPLETE");
  console.log(`  Rough draft saved to: ${OUTPUT_PATH}`);
  console.log(`  Final draft saved to: ${FINAL_OUTPUT_PATH}`);
  console.log("=".repeat(70) + "\n");

  // Uncomment to auto-close all windows when done:
  // await b1.close(); await b2.close(); await b3.close(); await b4.close();
})();

app.listen(3000, () => console.log("working"));






// ////////every thing above this is for mod 4 chat

























// import puppeteer from "puppeteer";
// import fs from "fs";
// import path from "path";

// // ╔════════════════════════════════════════════════════════════╗
// // ║   CONFIG — edit these for each assignment                 ║
// // ╚════════════════════════════════════════════════════════════╝

// const OUTPUT_FILENAME = "assignment_output.txt";

// const ASSIGNMENT_DIRECTIONS = `
// complete this first use three books

// Part A – Science Children's Literature Review
// ● Assignment Overview: For each selected book (3 total), include the following:
// ● Book Details
// ▪ Title, author, publication year, grade level, and a brief summary of the
// content and science connection.
// ● Literacy Integration Analysis
// Under each of the following categories, explain:
// ▪ Oral Language-How will students use oral language to process and
// communicate scientific ideas during the lesson?
// ● What structures (e.g., partner talk, science sentence stems, group
// discussions) will you use to help students explain, justify, or reflect
// on science concepts out loud?
// ▪ Comprehension- How does your lesson design support students in
// understanding scientific texts, instructions, or concepts?
// ● What strategies will you include to build science comprehension
// through oral reading, listening, or shared meaning-making (e.g.,
// choral reading of procedures, acting out processes, summarizing
// steps)?
// ▪ Vocabulary-What science-specific or academic vocabulary will students
// encounter in the lesson?
// ● How will you introduce, model, and reinforce key terms before,
// during, and after the lesson (e.g., word wall, visuals, hands-on
// labeling, word games, sentence frames)?

// -then Thoughtfully evaluate the 3 texts with clear and insightful analysis of how each supports accuracy, fluency, and vocabulary. Instructional suggestions are highly relevant, well-developed, and grounded in course concepts.


// then complete this and use one book from part A to complete make sure it follows these guidelines — do not make questions for these just answer them in part B

// Checklist Instructions:
// 1. Choose at least one of the texts from Part A as the foundation of your science lesson.
// 2. Create a literacy-integrated lesson plan that:
//    - Targets a science standard and a literacy standard.
//    - Includes explicit strategies to build oral language, comprehension, and/or vocabulary.
//    - Involves engaging activities (e.g., read-alouds, group work, performance, writing tasks).
//    - Specifically creates a home-school connection.
// 3. Use the specific Baker College Teacher Prep Lesson Plan Format (provided).

// Baker College Teacher Prep Lesson Plan Format:
// Subject Area & Grade Level:
// Lesson Duration:
// Lesson Goal (What do we want students to learn?):
// Assessment (How will we know they have learned it?):
//   Options: Diagnostic/Pre-Assessment, Self-Assessment, Formative, Summative
// Intervention (What will we do if they don't learn it?):
//   Options: Differentiated Instruction, Target specific skills, Data item analysis,
//   Leveled materials, Bloom's Taxonomy, Grade recovery, Parent contact,
//   Referral to Student Support Team, Graphic organizers, Manipulatives,
//   Choice boards, Immediate feedback, Flexible grouping, Extended responses,
//   Journal/Reading logs, Small group instruction, Tiered group instruction,
//   1-1, Centers (leveled), Re-teach in a different way, Tutoring, Modify
// Enrichment (What will we do if they already know it?):
//   Options: Choice boards, Use vocabulary to write sentences, Accelerated reader,
//   Centers-High level, Reading buddies, Peer tutoring, Enriched-Leveled Reader-Novels,
//   Picture/writing journals, Independent projects, Separate curriculum, Games, Group leader
// State Standards:
// Learning Objective:
// Materials:
// Learning Strategy (select one): Direct Teach / Demonstration / Cooperative Learning /
//   Differentiation / Discovery/Inquiry-Based Learning / Project-Based Learning /
//   Reading/Writing/Math Workshop / Other
// Activities Planned: Active / Passive / Both
// Lesson Delivery Steps:
// Core Teaching Practices addressed:
//   CTP #1 Leading a group discussion
//   CTP #2 Explaining and modeling content, practices, and strategies
//   CTP #3 Eliciting and interpreting individual students' thinking
//   CTP #10 Building respectful relationships with students
//   CTP #15 Check for Understanding
// Real-world connections including ELL and culturally responsive practices:
// Technology tools:
// Collaboration opportunities:


// then complete this

// Write a 1-page home-school connection reflection that addresses:
// ● How does the selected science text support meaningful conversations at home?
// ● Describe how families might discuss or explore the science topic introduced in the literature.
// ● What specific vocabulary or science concept could be reinforced at home, and how?
// ● Suggest a simple home-based activity (e.g., observation journal, vocabulary scavenger hunt, shared reading).
// ● In what ways does this lesson create an opportunity for family engagement in science and literacy?
// ● Reflect on how the read-aloud, writing task, or experiment could spark curiosity from family members and strengthen school-home connections.
// `;

// const SOURCE_PAGES = `
// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 24
// CHAPTER: does not have one
// SECTION: does not have one

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

// Module 1 - Introducing the Case
// Elsa believes that for many children, what happens in kindergarten affects students' feelings about and learning in school for the rest of their lives. She is beginning to ask questions of herself and rethink her approach to teaching science. Knowing that her students become engaged whenever they are using their senses to explore objects and phenomena,
// ---

// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 25
// CHAPTER: does not have one
// SECTION: does not have one

// EXACT TEXT:
// Elsa wants to build upon her students' natural inclination to learn by making their own discoveries. She hopes to extend this type of learning to meaningful expressions of students' understandings.

// Module 2 - Trying New Ideas
// Jeff Winokur, an early childhood science educator at Wheelock College, has observed in his teaching practice that young students cherish playing with materials and that this fascination can be put to use to help them make scientific discoveries. During students' discovery of magnets, Elsa takes a guided discovery approach by getting students to work with a partner as she circulates through the classroom, helping them move toward making specific discoveries.
// ---

// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 26
// CHAPTER: does not have one
// SECTION: does not have one

// EXACT TEXT:
// After working in pairs, where materials are shared, each student completes a worksheet that reflects his or her findings about materials through which a magnetic force can travel. Later, the class reviews the worksheets together. Elsa believes that when students take their worksheets home, students' understandings are again reinforced when shared with family members.
// ---

// ---
// AUTHOR: Annenberg Learner
// DATE: n.d.
// PAGE: 27
// CHAPTER: does not have one
// SECTION: does not have one

// EXACT TEXT:
// Module 3 - Reflecting and Building on Change
// As the year progresses, Elsa is convinced that science has become her students' favorite activity period. As part of her final science unit, Elsa invites her students to mix food coloring in water to find out what happens. Elsa is learning that with discovery activities, even though a scientific concept is not necessarily being discovered, her students are making their own discoveries and beginning to build new knowledge.
// ---

// ---
// AUTHOR: Ramlal
// DATE: 2023
// PAGE: 23
// CHAPTER: Chapter 3
// SECTION: does not have one

// EXACT TEXT:
// Teaching a balance of skills and strategies is important to promote growth in the area of reading.
// Overtime, as students gain experience with using strategies and continue to practice reading skills,
// the manner in which you plan your instruction should also evolve.
// Read-Alouds When planning for whole-class instruction, be sure to include a daily read-aloud.
// Use read-alouds to develop vocabulary, promote student-led discussions, and encourage listening comprehension.
// Plan questions and stopping points ahead of time.
// ---

// ---
// AUTHOR: Ramlal
// DATE: 2023
// PAGE: 24
// CHAPTER: Chapter 3
// SECTION: does not have one

// EXACT TEXT:
// Use read-alouds to develop vocabulary, promote student-led discussions, and encourage listening comprehension.
// Plan questions and stopping points ahead of time.
// Select read-aloud topics that consider a broad view of diversity: cultural, linguistic, or geographical,
// or about students with disabilities, gender stereotypes, family structures, popular culture, and so on.
// Before Reading: Have a discussion to introduce the book and activate prior knowledge.
// Try to allow students to do most of the talking.
// During Reading: Plan out stopping points to discuss the text or to ask and answer questions.
// ---
// `;

// // ════════════════════════════════════════════════════════════
// // Everything below — do not edit
// // ════════════════════════════════════════════════════════════

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

// const launchOptions = {
//   headless: false,
//   executablePath: CHROME_PATH,
//   slowMo: 80,
//   args: [
//     "--no-sandbox",
//     "--disable-setuid-sandbox",
//     "--disable-blink-features=AutomationControlled",
//     "--start-maximized",
//   ],
//   defaultViewport: null,
//   ignoreDefaultArgs: ["--enable-automation"],
// };

// // ─── OUTPUT FILE ──────────────────────────────────────────────────────────────

// const OUTPUT_PATH = path.resolve(OUTPUT_FILENAME);

// function initOutputFile() {
//   const header = [
//     "=".repeat(70),
//     `  ASSIGNMENT: ${OUTPUT_FILENAME.replace(".txt","").replace(/_/g," ").toUpperCase()}`,
//     `  Generated: ${new Date().toLocaleString()}`,
//     "=".repeat(70),
//     "",
//   ].join("\n");
//   fs.writeFileSync(OUTPUT_PATH, header, "utf8");
//   console.log(`\n  ✓ Output file created: ${OUTPUT_PATH}\n`);
// }

// function appendToFile(sectionLabel, questionText, answerText) {
//   const block = [
//     "",
//     "─".repeat(70),
//     `  ${sectionLabel}`,
//     "─".repeat(70),
//     questionText.trim(),
//     "",
//     "─".repeat(70),
//     `  RESPONSE`,
//     "─".repeat(70),
//     answerText.trim(),
//     "",
//   ].join("\n");
//   fs.appendFileSync(OUTPUT_PATH, block, "utf8");
//   console.log(`\n  ✓ ${sectionLabel} written to file (${answerText.length} chars)`);
// }

// // ─── GEMINI UTILITIES ─────────────────────────────────────────────────────────

// async function openGeminiBrowser(profileName, label) {
//   const browser = await puppeteer.launch({
//     ...launchOptions,
//     args: [...launchOptions.args, `--user-data-dir=C:\\Temp\\puppeteer-${profileName}`],
//   });
//   const page = await browser.newPage();
//   await page.evaluateOnNewDocument(() => {
//     Object.defineProperty(navigator, "webdriver", { get: () => false });
//     window.chrome = { runtime: {} };
//   });
//   await page.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
//   console.log(`  [${label}] window open`);
//   return { browser, page };
// }

// async function findInput(page, label) {
//   for (const sel of [
//     'rich-textarea div[contenteditable="true"]',
//     'div[contenteditable="true"]',
//     'div[role="textbox"]',
//     "textarea",
//   ]) {
//     try {
//       const el = await page.$(sel);
//       if (el && (await el.boundingBox())?.width > 0) return { el, sel };
//     } catch (_) {}
//   }
//   throw new Error(`[${label}] Input box not found`);
// }

// async function sendMessage(page, text, label) {
//   const { el, sel } = await findInput(page, label);
//   await el.click(); await sleep(400);
//   await page.keyboard.down("Control"); await page.keyboard.press("a"); await page.keyboard.up("Control");
//   await page.keyboard.press("Backspace"); await sleep(200);

//   const ok = await page.evaluate((t, s) => {
//     const el = document.querySelector(s); if (!el) return false;
//     el.focus(); return document.execCommand("insertText", false, t);
//   }, text, sel);

//   if (!ok) await page.evaluate((t, s) => {
//     const el = document.querySelector(s); if (!el) return; el.focus();
//     if (el.contentEditable === "true") el.innerText = t;
//     else Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(el, t);
//     el.dispatchEvent(new Event("input", { bubbles: true }));
//     el.dispatchEvent(new Event("change", { bubbles: true }));
//   }, text, sel);

//   await sleep(500);
//   const btn = await page.$('button[aria-label="Send message"], button[aria-label="Submit"], button[jsname="Qx7uuf"]');
//   if (btn) await btn.click(); else await page.keyboard.press("Enter");
//   await sleep(2000);
// }

// // ─── WAIT FOR RESPONSE — scrolls to bottom to force full render ───────────────
// // Gemini lazy-renders long responses. If you read innerText before scrolling,
// // you only get the visible portion and the answer is cut off.
// // Fix: wait for generation to stop, then scroll to the bottom of the response,
// // wait for any remaining content to render, then read the FULL text.

// async function waitForResponse(page, label, timeoutMs = 300000) {
//   console.log(`  [${label}] Waiting for response...`);

//   // Wait for the stop button to appear (generation started)
//   try {
//     await page.waitForFunction(
//       () => !!document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'),
//       { timeout: 20000, polling: 500 }
//     );
//   } catch (_) {}

//   // Wait for the stop button to disappear (generation finished)
//   await page.waitForFunction(
//     () => !document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'),
//     { timeout: timeoutMs, polling: 1000 }
//   ).catch(() => console.warn(`  [${label}] Generation timeout — reading what we have`));

//   // Give Gemini a moment to finalize rendering
//   await sleep(4000);

//   // Scroll to the very bottom of the last response to force lazy-render of all content
//   await page.evaluate(() => {
//     const responses = [
//       ...document.querySelectorAll("model-response"),
//       ...document.querySelectorAll('[data-message-author-role="model"]'),
//       ...document.querySelectorAll(".model-response-text"),
//       ...document.querySelectorAll("message-content"),
//     ];
//     if (!responses.length) return;
//     const last = responses[responses.length - 1];
//     last.scrollIntoView({ behavior: "instant", block: "end" });
//     // Also scroll the page itself to the bottom
//     window.scrollTo(0, document.body.scrollHeight);
//   });

//   // Wait for any lazy-rendered content to appear after scroll
//   await sleep(3000);

//   // Scroll again to make sure everything at the bottom is rendered
//   await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
//   await sleep(2000);

//   // Now read the FULL text of the last response
//   const text = await page.evaluate(() => {
//     const responses = [
//       ...document.querySelectorAll("model-response"),
//       ...document.querySelectorAll('[data-message-author-role="model"]'),
//       ...document.querySelectorAll(".model-response-text"),
//       ...document.querySelectorAll("message-content"),
//     ];
//     if (!responses.length) return "";

//     const last = responses[responses.length - 1];

//     // Walk every child and collect text — catches text inside nested spans/divs
//     // that innerText might miss if they're off-screen
//     function collectText(node) {
//       if (node.nodeType === Node.TEXT_NODE) return node.textContent;
//       if (node.nodeType !== Node.ELEMENT_NODE) return "";
//       // Skip invisible elements
//       const style = window.getComputedStyle(node);
//       if (style.display === "none" || style.visibility === "hidden") return "";
//       let out = "";
//       for (const child of node.childNodes) out += collectText(child);
//       // Add newline after block-level elements
//       const block = ["P","DIV","LI","BR","H1","H2","H3","H4","TR","SECTION","ARTICLE"];
//       if (block.includes(node.tagName)) out += "\n";
//       return out;
//     }

//     return collectText(last).replace(/\n{3,}/g, "\n\n").trim();
//   });

//   if (!text) {
//     console.warn(`  [${label}] Empty response — retrying read once...`);
//     await sleep(3000);
//     // One more attempt using plain innerText as fallback
//     const fallback = await page.evaluate(() => {
//       const all = [
//         ...document.querySelectorAll("model-response"),
//         ...document.querySelectorAll('[data-message-author-role="model"]'),
//       ];
//       return all.length ? all[all.length - 1].innerText.trim() : "";
//     });
//     console.log(`  [${label}] Fallback read: ${fallback.length} chars`);
//     return fallback;
//   }

//   console.log(`  [${label}] ✓ Full response captured: ${text.length} chars`);
//   return text;
// }

// // ─── AI1 PROMPTS ──────────────────────────────────────────────────────────────

// function buildAI1Prompt() {
//   return `You are reading a multi-part assignment and breaking it into a flat ordered list of tasks.

// ${"=".repeat(55)}
// ASSIGNMENT DIRECTIONS:
// ${"=".repeat(55)}
// ${ASSIGNMENT_DIRECTIONS.trim()}

// ${"=".repeat(55)}
// YOUR JOB:
// ${"=".repeat(55)}
// The assignment has three major parts: Part A, Part B, and Part C.

// Part A requires 3 books. Each book needs its own entry covering Book Details,
// Oral Language, Comprehension, and Vocabulary. So Part A = 3 separate tasks,
// one per book, each containing all four sub-sections for that book.

// Part B is ONE complete lesson plan task using the full Baker College format.

// Part C is ONE home-school reflection task covering all bullet points.

// Output a JSON array with exactly 5 items:
// - Index 0: Full task for Part A Book 1 (Book Details + Oral Language + Comprehension + Vocabulary)
// - Index 1: Full task for Part A Book 2 (Book Details + Oral Language + Comprehension + Vocabulary)
// - Index 2: Full task for Part A Book 3 (Book Details + Oral Language + Comprehension + Vocabulary)
// - Index 3: Full Baker College lesson plan task (Part B — all fields, using one book from Part A)
// - Index 4: Full home-school connection reflection (Part C — all 6 bullet points)

// Each task string must be detailed enough that the writer knows exactly what to produce.

// Output ONLY the raw JSON array. No markdown, no explanation, nothing else.`;
// }

// function buildAI1SelfCheckPrompt(generatedQuestions) {
//   return `You previously broke the assignment into this task list:

// ${JSON.stringify(generatedQuestions, null, 2)}

// Compare against the original directions:

// ${"=".repeat(55)}
// ORIGINAL DIRECTIONS:
// ${"=".repeat(55)}
// ${ASSIGNMENT_DIRECTIONS.trim()}

// ${"=".repeat(55)}
// CHECK:
// ${"=".repeat(55)}
// Verify:
// - Part A has exactly 3 book tasks, each covering Book Details + Oral Language + Comprehension + Vocabulary
// - Part B has exactly 1 complete lesson plan task covering ALL Baker College format fields
// - Part C has exactly 1 home-school reflection covering ALL 6 bullet points

// Report what is covered and what is missing.
// Then output the final corrected JSON array as the very last thing in your response — nothing after the array.`;
// }

// // ─── AI2 PROMPTS ──────────────────────────────────────────────────────────────

// function buildAI2Prompt(questionIndex, questionText, totalQuestions, previousAnswers) {
//   const contextBlock = previousAnswers.length > 0
//     ? `${"=".repeat(55)}
// CONTEXT — previous sections already completed (use for continuity):
// ${"=".repeat(55)}
// ${previousAnswers.map((a, i) => `--- Section ${i + 1} ---\n${a.substring(0, 800)}${a.length > 800 ? "\n...[truncated for context]" : ""}`).join("\n\n")}

// `
//     : "";

//   return `You are completing section ${questionIndex + 1} of ${totalQuestions} of an assignment.
// Complete ONLY this section — do not repeat or summarize other sections.

// ${contextBlock}${"=".repeat(55)}
// SECTION ${questionIndex + 1} TASK:
// ${"=".repeat(55)}
// ${questionText}

// ${"=".repeat(55)}
// SOURCE TEXT — cite from these sources only:
// ${"=".repeat(55)}
// ${SOURCE_PAGES.trim()}

// ${"=".repeat(55)}
// APA 7TH EDITION CITATION RULES:
// ${"=".repeat(55)}

// Use BOTH parenthetical AND narrative citations. At most 3 parenthetical citations per answer — the rest must be narrative.

// PARENTHETICAL (max 3 per answer):
//   Author (date) verb "word for word text" (p. #).
//   CORRECT: Ramlal (2023) explains "vocabulary relates to understanding" (p. 23).
//   WRONG: "text" (Author, date, p. #).  WRONG: "Text capital" (p. #).
//   WRONG: "text." (p. #).               WRONG: such as "text" (p. #).

// NARRATIVE (use for the majority of citations):
//   According to Ramlal (2023), from Chapter 3 on page 23, ...
//   As Annenberg Learner (n.d.) explains on page 25, ...
//   WRONG: Ramlal (2023, Chapter 3, p. 23) states...
//   WRONG: According to Ramlal (2023), teaching is important.  ← missing page

// CAPITAL FIRST WORD RULE:
//   SOURCE: Students become engaged → RIGHT: students "become engaged..." (p. 24).

// PERIOD: After (p. #) — NEVER inside quotes.
// NO MIXED SOURCES: Ramlal text → Ramlal (2023). Annenberg text → Annenberg Learner (n.d.).

// Write a COMPLETE, THOROUGH response. Do not cut it short.
// Output ONLY your answer — no preamble, no labels, no "here is my answer".`;
// }

// function buildAI2CorrectionPrompt(questionText, currentAnswer, ai3Feedback) {
//   return `Your answer has citation violations. Fix every one and output the COMPLETE corrected answer.

// ${"=".repeat(55)}
// TASK:
// ${"=".repeat(55)}
// ${questionText}

// ${"=".repeat(55)}
// YOUR CURRENT ANSWER:
// ${"=".repeat(55)}
// ${currentAnswer}

// ${"=".repeat(55)}
// REVIEWER FEEDBACK:
// ${"=".repeat(55)}
// ${ai3Feedback}

// ${"=".repeat(55)}
// FIX RULES:
// ${"=".repeat(55)}
// PARENTHETICAL: Author (date) verb "word for word text" (p. #).
// NARRATIVE: According to Author (date), from Chapter X on page #, ...
// - Period AFTER (p. #) — never inside quotes
// - Capital first word → pull out, lowercase, blend into sentence
// - Quote must END the sentence — never continue after (p. #)
// - Both types required; mostly narrative, max 3 parenthetical
// - Page always present

// Output the COMPLETE corrected answer — no preamble, no truncation.`;
// }

// // ─── AI3 PROMPT ───────────────────────────────────────────────────────────────

// function buildAI3Prompt(questionText, answerText) {
//   return `You are a strict APA 7th Edition citation reviewer.

// ${"=".repeat(55)}
// SECTION TASK:
// ${"=".repeat(55)}
// ${questionText}

// ${"=".repeat(55)}
// ANSWER TO REVIEW:
// ${"=".repeat(55)}
// ${answerText}

// ${"=".repeat(55)}
// CHECK:
// ${"=".repeat(55)}
// Both parenthetical AND narrative citations must be present and correct.

// PARENTHETICAL correct: Author (date) verb "word for word text" (p. #).
// NARRATIVE correct: According to Author (date), from Chapter X on page #, ...

// VIOLATIONS:
// 1. "text" (Author, date, p. #) — WRONG. Fix: Author (date) verb "text" (p. #).
// 2. Period inside closing quote. Fix: move after (p. #).
// 3. Quote with no (p. #). Fix: add or drop.
// 4. Capital first word inside quote. Fix: pull out, lowercase.
// 5. Empty quotes. Fix: drop.
// 6. Chapter/page inside parens. Fix: write in sentence.
// 7. Narrative missing page. Fix: add page naturally.
// 8. Only one citation type. Fix: add the other.
// 9. Sources mixed. Fix: correct attribution.
// 10. Quote fragment — sentence continues after (p. #). Fix: end sentence at (p. #).

// NOTE: Baker College lesson plan template fields (Subject Area, Materials, etc.) do NOT
// require citations. Only fail if narrative explanation paragraphs lack citations.

// For each violation: quote the exact wrong text and state the fix.

// End with EXACTLY one of:
// CITATION RESULT: PASS
// CITATION RESULT: FAIL`;
// }

// // ─── PARSE AI1 JSON ───────────────────────────────────────────────────────────

// function extractQuestionsFromResponse(raw) {
//   const match = raw.match(/\[[\s\S]*\]/g);
//   if (!match) throw new Error("No JSON array found");
//   const lastArray = match[match.length - 1];
//   const parsed = JSON.parse(lastArray);
//   if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Empty array");
//   return parsed.map(q => String(q).trim()).filter(q => q.length > 5);
// }

// // ─── KEEP ALIVE — blocks Node from exiting until Ctrl+C ───────────────────────

// function keepAliveUntilCtrlC(browsers) {
//   return new Promise(() => {
//     // This Promise NEVER resolves — Node stays alive because:
//     // 1. There is a pending Promise (this one)
//     // 2. There are active event listeners (process.on below)
//     // The only way out is Ctrl+C or SIGTERM.
//     console.log("\n" + "=".repeat(70));
//     console.log("  ✓ ALL DONE — windows stay open until you press Ctrl+C");
//     console.log("  Press Ctrl+C in this terminal when finished reviewing.");
//     console.log("=".repeat(70) + "\n");

//     process.on("SIGINT", async () => {
//       console.log("\n  Ctrl+C — closing all Chrome windows...");
//       for (const b of browsers) { try { await b.close(); } catch (_) {} }
//       console.log("  Done. Exiting.\n");
//       process.exit(0);
//     });

//     process.on("SIGTERM", async () => {
//       for (const b of browsers) { try { await b.close(); } catch (_) {} }
//       process.exit(0);
//     });
//   });
// }

// // ─── MAIN ─────────────────────────────────────────────────────────────────────

// (async () => {
//   console.log("=".repeat(70));
//   console.log("  ASSIGNMENT PIPELINE");
//   console.log("=".repeat(70));
//   console.log("  AI1 — parses assignment into ordered task list");
//   console.log("  AI2 — completes each section with APA citations");
//   console.log("  AI3 — checks citations, sends back to AI2 if wrong");
//   console.log(`  Output: ${OUTPUT_FILENAME}`);
//   console.log("=".repeat(70) + "\n");

//   initOutputFile();

//   console.log("Opening AI windows...\n");
//   const { browser: b1, page: ai1Page } = await openGeminiBrowser("ai1-parser",   "AI1 PARSER");
//   const { browser: b2, page: ai2Page } = await openGeminiBrowser("ai2-writer",   "AI2 WRITER");
//   const { browser: b3, page: ai3Page } = await openGeminiBrowser("ai3-reviewer", "AI3 REVIEWER");

//   const allPages = [ai1Page, ai2Page, ai3Page];
//   if (allPages.some(p => p.url().includes("accounts.google.com"))) {
//     console.log("\n  Sign into Google in ALL THREE Gemini windows. Waiting...\n");
//     await Promise.all(allPages.map(p =>
//       p.waitForFunction(() => location.href.includes("gemini.google.com"), { timeout: 180000, polling: 1000 })
//     ));
//   }
//   for (const [p, lbl] of [[ai1Page,"AI1"],[ai2Page,"AI2"],[ai3Page,"AI3"]]) {
//     await p.waitForFunction(
//       () => !!document.querySelector('rich-textarea div[contenteditable="true"], div[contenteditable="true"], div[role="textbox"], textarea'),
//       { timeout: 30000, polling: 1000 }
//     ).catch(() => console.warn(`  [${lbl}] Input wait timed out`));
//   }
//   await sleep(2000);
//   console.log("All windows ready.\n");

//   // ── STEP 1: AI1 parses assignment ─────────────────────────────────────────
//   console.log("=".repeat(70));
//   console.log("  STEP 1 — AI1 parsing assignment into task list");
//   console.log("=".repeat(70) + "\n");

//   await sendMessage(ai1Page, buildAI1Prompt(), "AI1 PARSER");
//   const ai1Raw = await waitForResponse(ai1Page, "AI1 PARSER");

//   let questions;
//   try {
//     questions = extractQuestionsFromResponse(ai1Raw);
//   } catch (e) {
//     console.error(`  ✗ AI1 parse failed: ${e.message}`);
//     process.exit(1);
//   }
//   console.log(`\n  AI1 generated ${questions.length} task(s):`);
//   questions.forEach((q, i) => console.log(`    [${i+1}] ${q.substring(0,100)}...`));

//   // ── STEP 2: AI1 self-check ────────────────────────────────────────────────
//   console.log("\n" + "=".repeat(70));
//   console.log("  STEP 2 — AI1 self-checking coverage");
//   console.log("=".repeat(70) + "\n");

//   await sendMessage(ai1Page, buildAI1SelfCheckPrompt(questions), "AI1 PARSER");
//   const ai1CheckRaw = await waitForResponse(ai1Page, "AI1 PARSER");

//   try {
//     const revised = extractQuestionsFromResponse(ai1CheckRaw);
//     if (revised.length >= questions.length) {
//       questions = revised;
//       console.log(`\n  ✓ Self-check done. Final task count: ${questions.length}`);
//     } else {
//       console.log(`\n  Self-check returned fewer tasks — keeping original list.`);
//     }
//   } catch (_) {
//     console.log(`\n  Self-check did not change the list.`);
//   }

//   const sectionLabels = [
//     "PART A — BOOK 1",
//     "PART A — BOOK 2",
//     "PART A — BOOK 3",
//     "PART B — LESSON PLAN",
//     "PART C — HOME-SCHOOL REFLECTION",
//   ];

//   console.log(`\n  Final tasks (${questions.length} total):`);
//   questions.forEach((q, i) => console.log(`    [${i+1}] ${sectionLabels[i] || `Section ${i+1}`}: ${q.substring(0,80)}...`));

//   // ── STEP 3: AI2 writes + AI3 checks each section ─────────────────────────
//   console.log("\n" + "=".repeat(70));
//   console.log("  STEP 3 — Writing and checking each section");
//   console.log("=".repeat(70));

//   const completedAnswers = [];

//   for (let idx = 0; idx < questions.length; idx++) {
//     const questionText = questions[idx];
//     const qNum         = idx + 1;
//     const label        = sectionLabels[idx] || `SECTION ${qNum}`;

//     console.log(`\n${"─".repeat(70)}`);
//     console.log(`  ${label} (${qNum} of ${questions.length})`);
//     console.log(`${"─".repeat(70)}`);

//     // AI2 writes the answer
//     await sendMessage(ai2Page, buildAI2Prompt(idx, questionText, questions.length, completedAnswers), "AI2 WRITER");
//     let answer = await waitForResponse(ai2Page, "AI2 WRITER");

//     // AI3 checks citations — loop until PASS
//     let citationApproved = false;
//     let attempt = 0;
//     const MAX = 5;

//     while (!citationApproved && attempt < MAX) {
//       attempt++;
//       console.log(`\n  [CITATION CHECK] Attempt ${attempt}/${MAX} — ${label}`);

//       await sendMessage(ai3Page, buildAI3Prompt(questionText, answer), "AI3 REVIEWER");
//       const ai3Feedback = await waitForResponse(ai3Page, "AI3 REVIEWER");
//       console.log(`\n  [AI3]:\n  ` + ai3Feedback.split("\n").join("\n  "));

//       if (ai3Feedback.includes("CITATION RESULT: PASS")) {
//         console.log(`\n  ✓ Citations PASSED — ${label}`);
//         citationApproved = true;
//       } else {
//         console.log(`\n  ✗ Citations FAILED — sending back to AI2...`);
//         await sendMessage(ai2Page, buildAI2CorrectionPrompt(questionText, answer, ai3Feedback), "AI2 WRITER");
//         answer = await waitForResponse(ai2Page, "AI2 WRITER");
//         await sleep(2000);
//       }
//     }

//     if (!citationApproved) console.warn(`  ⚠ Max attempts reached — using best version.`);

//     completedAnswers.push(answer);
//     appendToFile(label, questionText, answer);
//     console.log(`\n  ✓ ${label} complete and saved.`);
//     await sleep(2000);
//   }

//   console.log("\n" + "=".repeat(70));
//   console.log("  ALL SECTIONS COMPLETE");
//   console.log(`  Output: ${OUTPUT_PATH}`);
//   console.log("=".repeat(70));

//   // Block Node from exiting — windows stay open until Ctrl+C
//   await keepAliveUntilCtrlC([b1, b2, b3]);
// })();