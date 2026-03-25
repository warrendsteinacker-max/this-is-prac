// import puppeteer from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// puppeteer.use(StealthPlugin());

// // ── CONFIGURATION ────────────────────────────────────────────────────────────
// const BOOK_URL = 'https://reader.yuzu.com/reader/books/826802A';
// const TARGET_CHAPTER = "Chapter 3"; 
// const MAX_PAGES = 10; 

// const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// async function startGhostAgent() {
//     const browser = await puppeteer.launch({
//         headless: false, // Must be false for clipboard and AI interaction
//         defaultViewport: null,
//         args: [
//             '--start-maximized',
//             '--disable-blink-features=AutomationControlled',
//             '--no-sandbox'
//         ]
//     });

//     const [yuzuPage] = await browser.pages();
//     const geminiPage = await browser.newPage();

//     // Grant Clipboard Permissions to Yuzu
//     const context = browser.defaultBrowserContext();
//     await context.overridePermissions("https://reader.yuzu.com", ["clipboard-read", "clipboard-write"]);

//     console.log("--------------------------------------------------");
//     console.log("STATUS: STARTING ENGINES");
//     console.log("Please login to Yuzu and Gemini in the windows.");
//     console.log("--------------------------------------------------");

//     await yuzuPage.goto(BOOK_URL);
//     await geminiPage.goto('https://gemini.google.com/app');

//     // Wait for the reader UI to load
//     await yuzuPage.waitForSelector('button[aria-label="Next"], .toc, nav', { timeout: 0 });

//     // 1. CAPTURE NAVIGATION HTML FOR THE AI
//     console.log(">> Scraping Sidebar HTML for the AI...");
//     const navHTML = await yuzuPage.evaluate(() => {
//         // Grab the navigation area specifically to keep the prompt clean
//         const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]') || document.body;
//         return nav.innerHTML.substring(0, 8000); 
//     });

//     // 2. SEND TO GEMINI TO GENERATE THE NAVIGATION FUNCTION
//     await geminiPage.bringToFront();
//     const aiPrompt = `
//         I am using Puppeteer. Here is the HTML of a digital library sidebar:
//         ---
//         ${navHTML}
//         ---
//         Based on this HTML, write a simple JavaScript function called "navigate" that takes 
//         a "chapterTitle" string and clicks the element to open that chapter. 
//         Return ONLY the raw JavaScript code inside the function body. 
//         Do not include "async" or "function" keywords, just the logic.
//     `;

//     console.log(">> Asking Gemini to build the navigation boilerplate...");
//     await geminiPage.waitForSelector('div[role="textbox"]');
//     await geminiPage.click('div[role="textbox"]');
//     await geminiPage.keyboard.type(aiPrompt);
//     await geminiPage.keyboard.press('Enter');

//     // Wait for Gemini to finish (looking for the stop button to disappear)
//     await sleep(8000); 
//     const aiGeneratedLogic = await geminiPage.evaluate(() => {
//         const responses = document.querySelectorAll('model-response');
//         const latest = responses[responses.length - 1];
//         // Strip out triple backticks if the AI included them
//         return latest ? latest.innerText.replace(/
// http://googleusercontent.com/immersive_entry_chip/0

// // ---

// // ### Quick Start Guide

// // 1.  **Dependencies**: Ensure you have these installed:
// //     `npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth`
// // 2.  **Run**: `node ghost_agent.js`
// // 3.  **The Flow**:
// //     * The script opens Yuzu and Gemini.
// //     * It **waits for you to log in** to both.
// //     * It grabs the HTML of the Yuzu sidebar and sends it to Gemini.
// //     * Gemini writes the "Click" logic, and the script runs it to find your chapter.
// //     * The script begins the **Ctrl+A / Ctrl+C** loop and prints everything to your terminal.

// // **Would you like me to add a filter that automatically hides the "Skip to Content" and "Navigation Menu" text from your terminal output?**




/////////remeber new copy meth ctrl a then c