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








import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { generateReportHtml, renderPdfFromHtml } from "./tools.js";

const server = new McpServer({ name: "pdf-report-generator", version: "1.0.0" });

// Tool 1: Generates both HTML and the Style Manifesto
server.tool("create_html_report", "Generates report HTML and style metadata based on a topic",
    { topic: z.string() },
    async ({ topic }) => {
        const result = await generateReportHtml(topic);
        // We return the full object stringified so the client has both HTML and styles
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
);

// Tool 2: Renders PDF using HTML and the provided Style Manifesto
server.tool("render_pdf", "Converts HTML string and style manifesto to a PDF buffer",
    { 
        html: z.string(),
        styleManifesto: z.string() // Expecting a JSON stringified manifesto
    },
    async ({ html, styleManifesto }) => {
        const manifesto = JSON.parse(styleManifesto);
        await renderPdfFromHtml(html, manifesto);
        return { content: [{ type: "text", text: "PDF rendering complete." }] };
    }
);

await server.connect(new StdioServerTransport());

console.log("MCP Server Connected and listening for style-aware requests.");