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


































///////remeber new copy meth ctrl a then c






// Book info Author(s) Sasha R. Ramlal Publisher Cognella Academic Publishing Copyright 2023 Format pdf VBID 826802A





// import puppeteer from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// puppeteer.use(StealthPlugin());

// // ── CONFIGURATION ────────────────────────────────────────────────────────────
// const BOOK_URL = 'https://reader.yuzu.com/reader/books/826802A';
// const GOAL = "Extract Chapter 3 text using smartCopy and navigate to the end.";
// const MAX_LOOPS = 25; 

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

//     // Injects tools that survive page reloads
//     const injectTools = async (page) => {
//         await page.evaluateOnNewDocument(() => {
//             window.smartCopy = () => {
//                 const range = document.createRange();
//                 range.selectNode(document.body);
//                 const selection = window.getSelection();
//                 selection.removeAllRanges();
//                 selection.addRange(range);
//                 document.execCommand('copy'); 
//                 const text = selection.toString();
//                 selection.removeAllRanges();
//                 return `SUCCESS_EXTRACT: ${text.substring(0, 100)}...`;
//             };
//         });
//     };

//     await injectTools(yuzuPage);
    
//     console.log(">> Opening Pages...");
//     await yuzuPage.goto(BOOK_URL);
//     await geminiPage.goto('https://gemini.google.com/app');

//     console.log(">> WAITING FOR MANUAL LOGIN...");
//     await yuzuPage.waitForSelector('body', { timeout: 0 });
//     await geminiPage.waitForSelector('div[role="textbox"]', { timeout: 0 });

//     for (let i = 1; i <= MAX_LOOPS; i++) {
//         console.log(`\n--- ORCHESTRATOR LOOP ${i} ---`);

//         // 1. FRESH UI CAPTURE
//         await yuzuPage.bringToFront();
//         await sleep(3000); 

//         const semanticUI = await yuzuPage.evaluate(() => {
//             const selectors = 'button, a, h1, h2, h3, p, .epub-content, .reader-content';
//             const elements = document.querySelectorAll(selectors);
//             return Array.from(elements)
//                 .map(el => {
//                     const tag = el.tagName.toLowerCase();
//                     const text = el.innerText.replace(/\s+/g, ' ').trim().substring(0, 60);
//                     const id = el.id ? `#${el.id}` : '';
//                     if (!text && !id) return null;
//                     return `[${tag}${id}] "${text}"`;
//                 })
//                 .filter(item => item !== null)
//                 .join('\n');
//         });

//         // 2. STABILIZED SENDING TO GEMINI
//         await geminiPage.bringToFront();
        
//         // Step A: Clear the box
//         await geminiPage.click('div[role="textbox"]');
//         await geminiPage.keyboard.down('Control');
//         await geminiPage.keyboard.press('A');
//         await geminiPage.keyboard.up('Control');
//         await geminiPage.keyboard.press('Backspace');
        
//         console.log(">> Textbox cleared. Waiting 10s before pasting...");
//         await sleep(10000); // 10-second pause as requested

//         // Step B: Type the prompt with a human-like delay
//         const orchestratorPrompt = `ACT AS A PUPPETEER ORCHESTRATOR. GOAL: ${GOAL}\nTOOLS: window.smartCopy(); | document.querySelector('SELECTOR').click();\n\nUI STATE:\n${semanticUI.substring(0, 8000)}\n\nSTRICT RULES: Output ONLY raw JS code. No markdown. If done, return: console.log("GOAL_REACHED");`;
        
//         await geminiPage.keyboard.type(orchestratorPrompt, { delay: 10 }); 
        
//         console.log(">> Text entered. Waiting 10s before pressing Enter...");
//         await sleep(10000); // 10-second pause before hitting Enter
//         await geminiPage.keyboard.press('Enter');

//         console.log(">> Prompt sent. Waiting 20.5s for Gemini to process...");
//         await sleep(20500); 

//         // 3. GET GEMINI'S CODE
//         const rawResponse = await geminiPage.evaluate(() => {
//             const bubbles = document.querySelectorAll('.message-content, .markdown, model-response');
//             return bubbles.length ? bubbles[bubbles.length - 1].innerText : null;
//         });

//         if (rawResponse) {
//             const nextCommand = rawResponse.replace(/```javascript|```js|```/g, '').trim();

//             if (nextCommand.includes("GOAL_REACHED")) {
//                 console.log(">> SUCCESS: Goal reached.");
//                 break;
//             }

//             console.log(`>> GEMINI ACTION: ${nextCommand}`);
//             await yuzuPage.bringToFront();
//             try {
//                 const result = await yuzuPage.evaluate((cmd) => eval(cmd), nextCommand);
//                 if (result) console.log(`>> OUTPUT: ${result}`);
//             } catch (err) {
//                 console.error(`>> ERROR: ${err.message}`);
//             }
//         }
        
//         await sleep(5000); // Let everything settle
//     }
// }

// startOrchestrator().catch(console.error);










let data = []
let row = 7;
let col = 6;


///////sloving for horizontal 
for(let r = 0; r < row; r++){
    for(let c = 0; c < col - 3; c++){
        let start = r*col+c
        data.push([start, start + 1, start + 2, start + 3])
    }
}

/////solving for vertical
for(let r = 0; r < row - 3; r++){
    for(let c = 0; c < col; c++){
        let start = r*col+c
        data.push([start, start + col*1, start + col*2, start + col*3]) 
    }
}
////// for this direction \
for(let r = 0; r < row - 3; r++){
    for(let c = 0; c < col - 3; c++){
        let start = r*col+c
        data.push([start, start+col+1, start+3(col+1), start+3(col+1)])
    }
}

for(let r = 0; r < row - 3; r++){
    for(let c = 3; c < col; c++){
        let start = r*col+c
        data.push([start, start+col-1, start+2(col-1), start+3(col-1)])
    }
}

