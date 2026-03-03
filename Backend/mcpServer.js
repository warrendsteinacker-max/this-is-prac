// mcpServer.js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createAiReportPdf } from "./tools.js";

const server = new McpServer({ name: "ai-doc-gen", version: "1.0.0" });

server.tool("generate_ai_pdf", "Create a PDF with custom background and style", 
    { 
        prompt: z.string(), 
        bgImage: z.string().optional(), // Base64 string from user
        style: z.string().optional()    // User's custom style instructions
    }, 
    async ({ prompt, bgImage, style }) => {
        // Pass these variables to your logic
        await createAiReportPdf(prompt, bgImage, style);
        return { content: [{ type: "text", text: "PDF generated with custom assets." }] };
    }
);

await server.connect(new StdioServerTransport());
console.log("MCP Server connected successfully via Stdio.");



const word = "abcdefg"


console.log(word.charAt(0))