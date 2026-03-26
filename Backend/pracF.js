/////////this is code get working for ai to navigate websites via puppeter and do task get working


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

// import puppeteer from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// puppeteer.use(StealthPlugin());

// // ── CONFIGURATION ────────────────────────────────────────────────────────────
// const BOOK_URL = 'https://reader.yuzu.com/reader/books/826802A';
// const GOAL = "Extract Chapter 3 text and navigate to the end of the chapter.";
// const MAX_LOOPS = 20; 

// const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// async function startOrchestrator() {
//     const browser = await puppeteer.launch({
//         headless: false,
//         defaultViewport: null,
//         userDataDir: './automation_session',
//         args: ['--start-maximized', '--no-sandbox']
//     });

//     const [yuzuPage] = await browser.pages();
//     const geminiPage = await browser.newPage();

//     console.log(">> Navigating to Yuzu and Gemini...");
//     await yuzuPage.goto(BOOK_URL);
//     await geminiPage.goto('https://gemini.google.com/app');

//     console.log(">> WAITING FOR MANUAL LOGIN...");
//     // Wait for the main UI elements to exist before starting the loop
//     await yuzuPage.waitForSelector('body', { timeout: 0 });
//     await geminiPage.waitForSelector('div[role="textbox"]', { timeout: 0 });

//     for (let i = 1; i <= MAX_LOOPS; i++) {
//         console.log(`\n--- ORCHESTRATOR LOOP ${i} ---`);

//         // 1. SEMANTIC UI COMPRESSION (Reduces size by ~90%)
//         await yuzuPage.bringToFront();
//         const semanticUI = await yuzuPage.evaluate(() => {
//             // Focus on interactive and content-heavy elements
//             const selectors = 'button, a, [role="button"], h1, h2, h3, p, .epub-content, .reader-content';
//             const elements = document.querySelectorAll(selectors);
            
//             return Array.from(elements)
//                 .map(el => {
//                     const tag = el.tagName.toLowerCase();
//                     const text = el.innerText.replace(/\s+/g, ' ').trim().substring(0, 200);
//                     const id = el.id ? `#${el.id}` : '';
//                     const cls = el.className ? `.${el.className.split(' ').join('.')}` : '';
                    
//                     if (!text && !id && !cls) return null;
//                     return `[${tag}${id}${cls}] "${text}"`;
//                 })
//                 .filter(item => item !== null)
//                 .join('\n');
//         });

//         console.log(`>> UI Compressed to ${semanticUI.length} characters.`);

//         // 2. CONSTRUCT AND SEND PROMPT
//         await geminiPage.bringToFront();
//         const orchestratorPrompt = `
//             ACT AS A PUPPETEER ORCHESTRATOR.
//             GOAL: ${GOAL}
            
//             CURRENT UI STATE (ELEMENTS & TEXT):
//             ${semanticUI.substring(0, 10000)} 

//             Based on this state, provide ONE JavaScript command to run in the browser console.
//             - To click: document.querySelector('SELECTOR').click();
//             - To get text: Array.from(document.querySelectorAll('p')).map(p => p.innerText).join('\\n');
            
//             RULES:
//             1. Return ONLY the raw JavaScript code.
//             2. No explanations. No markdown code blocks.
//             3. If the goal is met, return: console.log("GOAL_REACHED");
//         `;

//         // Clear and type
//         await geminiPage.click('div[role="textbox"]');
//         // Select all and delete to ensure a fresh prompt
//         await geminiPage.keyboard.down('Control');
//         await geminiPage.keyboard.press('A');
//         await geminiPage.keyboard.up('Control');
//         await geminiPage.keyboard.press('Backspace');
        
//         await geminiPage.keyboard.type(orchestratorPrompt, { delay: 0 });
//         await geminiPage.keyboard.press('Enter');

//         console.log(">> Waiting for Gemini to process...");
//         await sleep(15000); 

//         // 3. RETRIEVE AND CLEAN RESPONSE
//         const rawResponse = await geminiPage.evaluate(() => {
//             const bubbles = document.querySelectorAll('.message-content, .markdown, model-response');
//             const latest = bubbles[bubbles.length - 1];
//             return latest ? latest.innerText : null;
//         });

//         if (!rawResponse) {
//             console.log(">> No response from Gemini. Retrying...");
//             continue;
//         }

//         // Strip markdown backticks if Gemini ignores the "No Markdown" rule
//         const nextCommand = rawResponse.replace(/```javascript|```js|```/g, '').trim();

//         if (nextCommand.includes("GOAL_REACHED")) {
//             console.log(">> SUCCESS: Gemini reports goal reached.");
//             break;
//         }

//         // 4. EXECUTE ON YUZU
//         console.log(`>> EXECUTING: ${nextCommand}`);
//         await yuzuPage.bringToFront();
//         try {
//             const result = await yuzuPage.evaluate((cmd) => {
//                 return eval(cmd);
//             }, nextCommand);
            
//             if (result) {
//                 console.log(`>> DATA EXTRACTED: ${String(result).substring(0, 100)}...`);
//             }
//         } catch (err) {
//             console.error(`>> EXECUTION ERROR: ${err.message}`);
//         }

//         await sleep(3000);
//     }
// }

// startOrchestrator().catch(console.error);



import express from "express"
import cors from "cors"


import data from "data.js"

console.log(data)

const app = express()

app.use(express.json())

app.use(cors({origin: "*"}))

app.post("/createA", (req, res) => {
    try
        {const {pass} = req.body
        data.push(pass)
        console.log(data)
        return res.status(201).json({stat: "account created"})}
    catch(error){
        console.error(error.message)
        return res.status(500).json({stat: "account not created"})
    }
})


app.listen(3000, () => console.log("on port 3000"))