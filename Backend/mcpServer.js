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








import { McpServer }          from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z }                  from "zod";
import { generateReportHtml, renderPdfFromHtml } from "./tools.js";

const server = new McpServer({ name: "pdf-report-generator", version: "2.0.0" });

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const ColorSchema = z.object({
  primaryColor:    z.string().optional(),
  bgColor:         z.string().optional(),
  h1Color:         z.string().optional(),
  h2Color:         z.string().optional(),
  h3Color:         z.string().optional(),
  pColor:          z.string().optional(),
  linkColor:       z.string().optional(),
  coverBg:         z.string().optional(),
  coverText:       z.string().optional(),
  footerBg:        z.string().optional(),
  footerText:      z.string().optional(),
}).optional();

const TypographySchema = z.object({
  bodyFont:        z.string().optional(),
  headingFont:     z.string().optional(),
  baseFontSize:    z.number().optional(),
  h1Size:          z.number().optional(),
  h2Size:          z.number().optional(),
  h3Size:          z.number().optional(),
  lineHeight:      z.number().optional(),
  letterSpacing:   z.number().optional(),
  paragraphSpacing:z.number().optional(),
  textAlign:       z.enum(['left','center','right','justify']).optional(),
  headingBorderStyle: z.string().optional(),
  headingBorderColor: z.string().optional(),
}).optional();

const PageSchema = z.object({
  pageSize:        z.enum(['A4','A3','Letter','Legal','Tabloid']).optional(),
  orientation:     z.enum(['Portrait','Landscape']).optional(),
  margin:          z.string().optional(),
  columnCount:     z.number().min(1).max(4).optional(),
  columnGap:       z.number().optional(),
  sectionPadding:  z.number().optional(),
  listIndent:      z.number().optional(),
  sectionDivider:  z.string().optional(),
}).optional();

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

// Full style manifest schema — mirrors every control in StyleArchitect
const StyleManifestSchema = z.object({
  // Colors
  primaryColor: z.string().optional(),
  bgColor:      z.string().optional(),
  h1Color:      z.string().optional(),
  h2Color:      z.string().optional(),
  h3Color:      z.string().optional(),
  pColor:       z.string().optional(),
  linkColor:    z.string().optional(),
  coverBg:      z.string().optional(),
  coverText:    z.string().optional(),
  footerBg:     z.string().optional(),
  footerText:   z.string().optional(),
  // Typography
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
  // Page
  pageSize:       z.string().optional(),
  orientation:    z.string().optional(),
  margin:         z.string().optional(),
  columnCount:    z.number().optional(),
  columnGap:      z.number().optional(),
  sectionPadding: z.number().optional(),
  listIndent:     z.number().optional(),
  sectionDivider: z.string().optional(),
  // Layouts
  tables:         TableSchema,
  cards:          CardSchema,
  callouts:       CalloutSchema,
  headers:        HeaderFooterSchema,
  footers:        HeaderFooterSchema,
  // Decor
  watermarkText:    z.string().optional(),
  watermarkOpacity: z.number().optional(),
  // Directives
  activeStyles: ActiveStyleSchema,
  customText:   z.string().optional(),
}).optional();

// ── Tool 1: Generate HTML report ─────────────────────────────────────────────
server.tool(
  "create_html_report",
  "Generates a complete styled HTML report body and style manifesto based on topic, user instructions, and a full style manifest from StyleArchitect",
  {
    topic:         z.string().describe("The report topic or subject matter"),
    userPrompt:    z.string().optional().describe("Additional user instructions for content or layout"),
    styleManifest: StyleManifestSchema.describe("Full style configuration from the StyleArchitect component"),
  },
  async ({ topic, userPrompt = '', styleManifest = {} }) => {
    try {
      const result = await generateReportHtml(topic, userPrompt, styleManifest);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// ── Tool 2: Render PDF ────────────────────────────────────────────────────────
server.tool(
  "render_pdf",
  "Converts an HTML string to a PDF using Puppeteer, applying the full style manifest for accurate CSS injection",
  {
    html:          z.string().describe("The HTML body content to render"),
    styleManifest: StyleManifestSchema.describe("Full style manifest — used to inject all CSS into the Puppeteer page"),
  },
  async ({ html, styleManifest = {} }) => {
    try {
      const buffer = await renderPdfFromHtml(html, styleManifest);
      // Return base64 so the MCP client can handle the binary
      const base64 = buffer.toString('base64');
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ success: true, pdfBase64: base64, size: buffer.length }),
        }],
      };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// ── Tool 3: Generate + render in one shot ────────────────────────────────────
server.tool(
  "create_and_render_pdf",
  "Generates a styled HTML report from a topic and immediately renders it to PDF — a single tool call for the full pipeline",
  {
    topic:         z.string().describe("The report topic"),
    userPrompt:    z.string().optional(),
    styleManifest: StyleManifestSchema,
  },
  async ({ topic, userPrompt = '', styleManifest = {} }) => {
    try {
      const { html, styleManifesto } = await generateReportHtml(topic, userPrompt, styleManifest);
      const buffer = await renderPdfFromHtml(html, styleManifest);
      const base64 = buffer.toString('base64');
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success:      true,
            pdfBase64:    base64,
            size:         buffer.length,
            styleManifesto,
            featuresUsed: styleManifesto.featuresUsed,
          }),
        }],
      };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// ── Connect ───────────────────────────────────────────────────────────────────
await server.connect(new StdioServerTransport());
console.log("MCP PDF Server v2 connected — full StyleArchitect manifest support active.");