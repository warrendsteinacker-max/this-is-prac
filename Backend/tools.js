// tools.js
import { GoogleGenAI } from '@google/genai';
import puppeteer from 'puppeteer';

const ai = new GoogleGenAI({ apiKey: '' });

export async function generatePdfInMemory(html) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdfBuffer;
}

async function generateImageAsBuffer(prompt) {
    // Placeholder: This returns a tiny transparent 1x1 pixel base64 image
    return Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
}

export async function generateOnlyHtml(prompt) {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a professional HTML report about: ${prompt}. Only return the raw HTML string.`
    });
    return response.text(); 
}

export async function createAiReportPdf(prompt, bgImage = null, style = "professional") {
    // If bgImage isn't provided, fallback to your default generator
    const imageToUse = bgImage || `data:image/png;base64,${(await generateImageAsBuffer(prompt)).toString('base64')}`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create an HTML report about: ${prompt}. 
                   Style: ${style}. 
                   Background Image: ${imageToUse}. 
                   CSS: body { background-image: url('${imageToUse}'); background-size: cover; }`
    });
    
    return await generatePdfInMemory(response.text());
}