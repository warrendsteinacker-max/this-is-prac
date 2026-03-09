// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// import { z } from "zod";
// import { generateReportHtml, renderPdfFromHtml } from "./tools.js";

// const server = new McpServer({ name: "pdf-report-generator", version: "1.0.0" });

// server.tool("create_html_report", "Generates report HTML based on a topic",
//     { topic: z.string() },
//     async ({ topic }) => ({ content: [{ type: "text", text: await generateReportHtml(topic) }] })
// );

// server.tool("render_pdf", "Converts HTML string to a PDF buffer",
//     { html: z.string() },
//     async ({ html }) => {
//         await renderPdfFromHtml(html);
//         return { content: [{ type: "text", text: "PDF rendering complete." }] };
//     }
// );

// await server.connect(new StdioServerTransport());


// console.log("Connected")







import { McpServer }           from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport }  from "@modelcontextprotocol/sdk/server/stdio.js";
import { z }                     from "zod";
import { generateReportHtml, generateReportHtmlFromFile, renderPdfFromHtml } from "./tools.js";

const server = new McpServer({ name: "pdf-report-generator", version: "2.1.0" });

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const TableSchema = z.array(z.object({
  id:          z.string().optional(),
  name:        z.string(),
  rows:        z.number(),
  cols:        z.number(),
  hasHeader:   z.boolean().optional(),
  striped:     z.boolean().optional(),
  bordered:    z.boolean().optional(),
  headerBg:    z.string().optional(),
  headerText:  z.string().optional(),
  stripeBg:    z.string().optional(),
  borderColor: z.string().optional(),
  colWidths:   z.string().optional(),
  caption:     z.string().optional(),
  notes:       z.string().optional(),
})).optional();

const CardSchema = z.array(z.object({
  id:          z.string().optional(),
  name:        z.string(),
  layout:      z.string(),
  count:       z.number(),
  bg:          z.string().optional(),
  textColor:   z.string().optional(),
  accentColor: z.string().optional(),
  radius:      z.number().optional(),
  padding:     z.number().optional(),
  shadow:      z.boolean().optional(),
  borderStyle: z.string().optional(),
  borderColor: z.string().optional(),
  borderWidth: z.number().optional(),
  hasIcon:     z.boolean().optional(),
  hasImage:    z.boolean().optional(),
  hasButton:   z.boolean().optional(),
  notes:       z.string().optional(),
})).optional();

const CalloutSchema = z.array(z.object({
  id:          z.string().optional(),
  type:        z.string(),
  bg:          z.string().optional(),
  borderColor: z.string().optional(),
  textColor:   z.string().optional(),
  borderSide:  z.enum(['left','top','right','bottom','all']).optional(),
  borderWidth: z.number().optional(),
  radius:      z.number().optional(),
  padding:     z.number().optional(),
  count:       z.number(),
  notes:       z.string().optional(),
})).optional();

const HeaderFooterSchema = z.array(z.object({
  id:       z.string().optional(),
  text:     z.string(),
  position: z.enum(['left','center','right']).optional(),
})).optional();

const ActiveStyleSchema = z.array(z.object({
  id:     z.string(),
  label:  z.string().optional(),
  prompt: z.string(),
})).optional();

const StyleManifestSchema = z.object({
  primaryColor:     z.string().optional(),
  bgColor:          z.string().optional(),
  h1Color:          z.string().optional(),
  h2Color:          z.string().optional(),
  h3Color:          z.string().optional(),
  pColor:           z.string().optional(),
  linkColor:        z.string().optional(),
  coverBg:          z.string().optional(),
  coverText:        z.string().optional(),
  footerBg:         z.string().optional(),
  footerText:       z.string().optional(),
  bodyFont:         z.string().optional(),
  headingFont:      z.string().optional(),
  baseFontSize:     z.number().optional(),
  h1Size:           z.number().optional(),
  h2Size:           z.number().optional(),
  h3Size:           z.number().optional(),
  lineHeight:       z.number().optional(),
  letterSpacing:    z.number().optional(),
  paragraphSpacing: z.number().optional(),
  textAlign:        z.string().optional(),
  headingBorderStyle: z.string().optional(),
  headingBorderColor: z.string().optional(),
  pageSize:         z.string().optional(),
  orientation:      z.string().optional(),
  margin:           z.string().optional(),
  columnCount:      z.number().optional(),
  columnGap:        z.number().optional(),
  sectionPadding:   z.number().optional(),
  listIndent:       z.number().optional(),
  sectionDivider:   z.string().optional(),
  tables:           TableSchema,
  cards:            CardSchema,
  callouts:         CalloutSchema,
  headers:          HeaderFooterSchema,
  footers:          HeaderFooterSchema,
  watermarkText:    z.string().optional(),
  watermarkOpacity: z.number().optional(),
  activeStyles:     ActiveStyleSchema,
  customText:       z.string().optional(),
}).optional();

// ── Tool 1: Generate HTML report (text) ──────────────────────────────────────
server.tool(
  "create_html_report",
  "Generates a complete styled HTML report body and style manifesto based on topic, user instructions, and a full style manifest",
  {
    topic:         z.string().describe("The report topic or subject matter"),
    userPrompt:    z.string().optional().describe("Additional user instructions for content or layout"),
    styleManifest: StyleManifestSchema.describe("Full style configuration from the StyleArchitect component"),
  },
  async ({ topic, userPrompt = '', styleManifest = {} }) => {
    try {
      const result = await generateReportHtml(topic, userPrompt, styleManifest);
      return { content: [{ type:"text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type:"text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// ── Tool 2: Generate HTML report from file ────────────────────────────────────
server.tool(
  "create_html_report_from_file",
  "Generates a styled HTML report by reading an uploaded file (PDF, image, or text). The file is passed as base64.",
  {
    fileBase64:    z.string().describe("Base64-encoded file contents"),
    mimeType:      z.string().describe("MIME type of the file, e.g. 'application/pdf', 'image/png', 'text/plain'"),
    originalName:  z.string().describe("Original filename, e.g. 'quarterly-report.pdf'"),
    topic:         z.string().optional().describe("Optional report title or topic"),
    userPrompt:    z.string().optional().describe("Additional style or content instructions"),
    styleManifest: StyleManifestSchema,
  },
  async ({ fileBase64, mimeType, originalName, topic = '', userPrompt = '', styleManifest = {} }) => {
    try {
      const buffer = Buffer.from(fileBase64, 'base64');
      const result = await generateReportHtmlFromFile(buffer, mimeType, originalName, topic, userPrompt, styleManifest);
      return { content: [{ type:"text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type:"text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// ── Tool 3: Render PDF ────────────────────────────────────────────────────────
server.tool(
  "render_pdf",
  "Converts an HTML string to a PDF using Puppeteer, applying the full style manifest for CSS injection",
  {
    html:          z.string().describe("The HTML body content to render"),
    styleManifest: StyleManifestSchema.describe("Full style manifest for CSS injection"),
  },
  async ({ html, styleManifest = {} }) => {
    try {
      const buffer = await renderPdfFromHtml(html, styleManifest);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ success:true, pdfBase64: buffer.toString('base64'), size: buffer.length }),
        }],
      };
    } catch (err) {
      return { content: [{ type:"text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// ── Tool 4: Generate + render in one shot ────────────────────────────────────
server.tool(
  "create_and_render_pdf",
  "Generates a styled HTML report from a topic and immediately renders it to PDF — single tool call for the full pipeline",
  {
    topic:         z.string().describe("The report topic"),
    userPrompt:    z.string().optional(),
    styleManifest: StyleManifestSchema,
  },
  async ({ topic, userPrompt = '', styleManifest = {} }) => {
    try {
      const { html, styleManifesto } = await generateReportHtml(topic, userPrompt, styleManifest);
      const buffer = await renderPdfFromHtml(html, styleManifest);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success:      true,
            pdfBase64:    buffer.toString('base64'),
            size:         buffer.length,
            styleManifesto,
            featuresUsed: styleManifesto.featuresUsed,
          }),
        }],
      };
    } catch (err) {
      return { content: [{ type:"text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// ── Tool 5: Generate from file + render PDF in one shot ───────────────────────
server.tool(
  "create_and_render_pdf_from_file",
  "Reads an uploaded file, generates a styled HTML report from it, and immediately renders to PDF — full pipeline in one call",
  {
    fileBase64:    z.string().describe("Base64-encoded file contents"),
    mimeType:      z.string().describe("MIME type, e.g. 'application/pdf', 'image/png', 'text/plain'"),
    originalName:  z.string().describe("Original filename"),
    topic:         z.string().optional(),
    userPrompt:    z.string().optional(),
    styleManifest: StyleManifestSchema,
  },
  async ({ fileBase64, mimeType, originalName, topic = '', userPrompt = '', styleManifest = {} }) => {
    try {
      const buffer = Buffer.from(fileBase64, 'base64');
      const { html, styleManifesto } = await generateReportHtmlFromFile(buffer, mimeType, originalName, topic, userPrompt, styleManifest);
      const pdfBuffer = await renderPdfFromHtml(html, styleManifest);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success:      true,
            pdfBase64:    pdfBuffer.toString('base64'),
            size:         pdfBuffer.length,
            styleManifesto,
            featuresUsed: styleManifesto.featuresUsed,
          }),
        }],
      };
    } catch (err) {
      return { content: [{ type:"text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// ── Connect ───────────────────────────────────────────────────────────────────
await server.connect(new StdioServerTransport());
console.log("MCP PDF Server v2.1 connected — file upload + full StyleArchitect manifest support active.");