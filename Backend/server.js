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





import express from 'express';
import cors    from 'cors';
import { generateReportHtml, renderPdfFromHtml } from './tools.js';

// ── API key error classifier ──────────────────────────────────────────────
function classifyError(err) {
  const msg = err.message ?? '';
  if (msg.startsWith('API_KEY_LEAKED'))   return { status: 403, code: 'API_KEY_LEAKED',   message: msg.replace('API_KEY_LEAKED: ', '') };
  if (msg.startsWith('API_KEY_EXPIRED'))  return { status: 403, code: 'API_KEY_EXPIRED',  message: msg.replace('API_KEY_EXPIRED: ', '') };
  if (msg.startsWith('API_KEY_INVALID'))  return { status: 403, code: 'API_KEY_INVALID',  message: msg.replace('API_KEY_INVALID: ', '') };
  if (msg.includes('malformed JSON'))     return { status: 422, code: 'PARSE_ERROR',       message: msg };
  return { status: 500, code: 'SERVER_ERROR', message: msg };
}


app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/generate-preview
// Body: { topic, userPrompt, styleManifest }
// Returns: { html, styleManifesto }
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/generate-preview', async (req, res) => {
  const { topic, userPrompt = '', styleManifest = {} } = req.body;

  if (!topic?.trim()) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  try {
    const reportData = await generateReportHtml(topic, userPrompt, styleManifest);
    res.json(reportData);
  } catch (err) {
    const { status, code, message } = classifyError(err);
    console.error(`[${code}]`, message);
    res.status(status).json({ error: message, code });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/render-pdf
// Body: { html, styleManifest }
// Returns: application/pdf binary
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/render-pdf', async (req, res) => {
  const { html, styleManifest = {} } = req.body;

  if (!html?.trim()) {
    return res.status(400).json({ error: 'HTML content is required.' });
  }

  try {
    const buffer = await renderPdfFromHtml(html, styleManifest);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(buffer);
  } catch (err) {
    const { status, code, message } = classifyError(err);
    console.error(`[${code}]`, message);
    res.status(status).json({ error: message, code });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/render-pdf-raw
// For the PdfEditor — sends already-complete HTML (with CSS injected by
// the editor's override system) directly to Puppeteer, no CSS re-injection.
// Body: { html, styleManifest }
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/render-pdf-raw', async (req, res) => {
  const { html, styleManifest = {} } = req.body;

  if (!html?.trim()) {
    return res.status(400).json({ error: 'HTML content is required.' });
  }

  try {
    // For editor output the HTML is already complete — wrap minimally
    const { pageSize = 'A4', orientation = 'Portrait' } = styleManifest;
    const browser = (await import('puppeteer')).default;
    const b   = await browser.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
    const pg  = await b.newPage();
    await pg.setContent(html, { waitUntil:'networkidle0' });
    const buf = await pg.pdf({ format:pageSize, landscape:orientation==='Landscape', printBackground:true });
    await b.close();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report-edited.pdf"');
    res.send(buf);
  } catch (err) {
    console.error('Raw PDF render error:', err);
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));