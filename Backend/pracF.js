// import puppeteer from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// puppeteer.use(StealthPlugin());

// // ── CONFIGURATION ────────────────────────────────────────────────────────────
// const BOOK_URL = 'https://reader.yuzu.com/reader/books/826802A';
// const GOAL = "Extract Chapter 3 text using smartCopy and navigate to the end.";
// const MAX_LOOPS = 50; // Increased for longer chapters
// const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

// const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// async function startOrchestrator() {
//     const browser = await puppeteer.launch({
//         headless: false,
//         executablePath: CHROME_PATH,
//         defaultViewport: null,
//         userDataDir: './automation_session',
//         args: [
//             '--start-maximized', 
//             '--no-sandbox', 
//             '--disable-setuid-sandbox',
//             '--disable-blink-features=AutomationControlled'
//         ]
//     });

//     const [yuzuPage] = await browser.pages();
//     const geminiPage = await browser.newPage();
//     const context = browser.defaultBrowserContext();

//     // Grant clipboard permissions for smartCopy tool
//     await context.overridePermissions('https://reader.yuzu.com', ['clipboard-read', 'clipboard-write']);

//     // Injects tools that survive page reloads
//     const injectTools = async (page) => {
//         await page.evaluateOnNewDocument(() => {
//             window.smartCopy = () => {
//                 try {
//                     const range = document.createRange();
//                     range.selectNode(document.body);
//                     const selection = window.getSelection();
//                     selection.removeAllRanges();
//                     selection.addRange(range);
//                     document.execCommand('copy'); 
//                     const text = selection.toString();
//                     selection.removeAllRanges();
                    
//                     // CLEANING LOGIC: Remove ISBNs and "Page X of Y" noise
//                     const cleaned = text
//                         .replace(/\d{13}/g, "")             // Removes 13-digit ISBNs
//                         .replace(/\d+\s*\/\s*\d+/g, "")     // Removes "59 / 303"
//                         .replace(/Book Page Loaded|Skip to main content/gi, "")
//                         .trim();
                        
//                     return `SUCCESS_EXTRACT: ${cleaned.substring(0, 100)}... (Length: ${cleaned.length})`;
//                 } catch (e) {
//                     return `ERROR_EXTRACT: ${e.message}`;
//                 }
//             };
//         });
//     };

//     await injectTools(yuzuPage);
    
//     console.log(">> Opening Pages...");
//     try {
//         await yuzuPage.goto(BOOK_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
//     } catch (e) {
//         console.log(">> Note: Initial navigation redirected or timed out. Waiting for manual login.");
//     }

//     await geminiPage.goto('https://gemini.google.com/app', { waitUntil: 'domcontentloaded' });

//     console.log(">> WAITING FOR MANUAL LOGIN...");
    
//     // Wait until Yuzu is actually in the reader
//     await yuzuPage.waitForFunction(
//         () => window.location.href.includes('/reader/books/'),
//         { timeout: 0 }
//     );

//     // Wait for the reader UI and Gemini input box
//     await yuzuPage.waitForSelector('button[aria-label="Next"]', { timeout: 0 });
//     await geminiPage.waitForSelector('div[role="textbox"]', { timeout: 0 });
    
//     console.log(">> LOGIN DETECTED. Starting Orchestrator...");
//     await sleep(2000);

//     for (let i = 1; i <= MAX_LOOPS; i++) {
//         console.log(`\n--- ORCHESTRATOR LOOP ${i} ---`);

//         // 1. CAPTURE YUZU STATE
//         await yuzuPage.bringToFront();
//         await sleep(2500); // Wait for page to settle

//         const semanticUI = await yuzuPage.evaluate(() => {
//             const selectors = 'button, a, h1, h2, h3, p, .epub-content, .reader-content';
//             const elements = document.querySelectorAll(selectors);
//             return Array.from(elements)
//                 .map(el => {
//                     const tag = el.tagName.toLowerCase();
//                     const text = el.innerText.replace(/\s+/g, ' ').trim().substring(0, 70);
//                     const id = el.id ? `#${el.id}` : '';
//                     const label = el.getAttribute('aria-label') ? `[${el.getAttribute('aria-label')}]` : '';
//                     if (!text && !id && !label) return null;
//                     return `<${tag}${id}> ${label} "${text}"`;
//                 })
//                 .filter(item => item !== null)
//                 .slice(0, 80) // Reduced slice to keep prompt focused
//                 .join('\n');
//         });

//         // 2. COMMUNICATE WITH GEMINI
//         await geminiPage.bringToFront();
        
//         // Clear existing text aggressively
//         await geminiPage.click('div[role="textbox"]');
//         await geminiPage.keyboard.down('Control');
//         await geminiPage.keyboard.press('A');
//         await geminiPage.keyboard.up('Control');
//         await geminiPage.keyboard.press('Backspace');
//         await sleep(500);
        
//         const orchestratorPrompt = `ACT AS A PUPPETEER ORCHESTRATOR. 
// GOAL: ${GOAL}
// CURRENT LOOP: ${i}
// TOOLS: window.smartCopy(); | document.querySelector('SELECTOR').click();

// UI STATE:
// ${semanticUI}

// STRICT RULES:
// 1. Output ONLY raw JavaScript code.
// 2. NO markdown code blocks (\`\`\`).
// 3. NO explanations or conversational filler.
// 4. If goal is finished, return: console.log("GOAL_REACHED");`;
        
//         console.log(">> Typing Prompt...");
//         await geminiPage.keyboard.type(orchestratorPrompt, { delay: 0 }); 
//         await sleep(800);

//         // Click Send Button
//         const sendBtn = 'button[aria-label="Send message"]';
//         await geminiPage.waitForSelector(sendBtn);
//         await geminiPage.click(sendBtn);

//         // --- THE "STUCK STOP" FIX: SYNC LOGIC ---
//         console.log(">> Gemini is thinking (Waiting for Sync)...");
//         try {
//             // Wait for 'Stop' to appear (indicates generation started)
//             await geminiPage.waitForSelector('button[aria-label="Stop generating"]', { visible: true, timeout: 10000 });
            
//             // Wait for 'Stop' to disappear (indicates generation is COMPLETE)
//             await geminiPage.waitForSelector('button[aria-label="Stop generating"]', { hidden: true, timeout: 60000 });
            
//             // Stabilization sleep to let DOM update
//             await sleep(2000); 
//         } catch (e) {
//             console.log(">> Note: Stop button lifecycle skipped or timed out.");
//         }

//         // 3. READ AND EXECUTE
//         const rawResponse = await geminiPage.evaluate(() => {
//             const bubbles = document.querySelectorAll('.message-content, .markdown, model-response');
//             return bubbles.length ? bubbles[bubbles.length - 1].innerText : null;
//         });

//         if (rawResponse) {
//             // Cleanup any backticks if Gemini ignored the "No Markdown" rule
//             const cleanCode = rawResponse.replace(/```javascript|```js|```/g, "").trim();
            
//             if (cleanCode.includes("GOAL_REACHED")) {
//                 console.log(">> MISSION COMPLETE: Goal reached according to AI.");
//                 break;
//             }

//             console.log(">> Executing Gemini's Command...");
//             await yuzuPage.bringToFront();
//             try {
//                 const result = await yuzuPage.evaluate(async (code) => {
//                     // Wrap in async IIFE to support 'await' inside the eval
//                     return await eval(`(async () => { 
//                         try {
//                             ${code} 
//                         } catch(e) {
//                             return "Eval Error: " + e.message;
//                         }
//                     })()`);
//                 }, cleanCode);
//                 console.log(`>> Result: ${result}`);
//             } catch (evalError) {
//                 console.error(`>> JS EXECUTION ERROR: ${evalError.message}`);
//             }
//         }
        
//         // Final pause between loops to prevent rate limiting/UI crashes
//         await sleep(3000);
//     }
// }

// startOrchestrator().catch(console.error);




























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







import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null // Opens at full screen size
    });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://gemini.google.com', { 
            waitUntil: 'networkidle2',
            timeout: 60000 
        });
    } catch (e) {
        console.log("Navigation timeout, proceeding anyway...");
    }

    // 1. Updated Selector from your HTML snippet
    const promptSelector = 'div.ql-editor.textarea'; 

    try {
        // 2. Wait for it to exist
        await page.waitForSelector(promptSelector, { timeout: 15000 });

        // 3. Click it first to ensure the cursor is active
        await page.click(promptSelector);

        // 4. Type the prompt
        const myPrompt = "Write a short poem about coding.";
        await page.type(promptSelector, myPrompt, { delay: 20 }); // Slight delay mimics human typing
        
        // 5. Submit
        await page.keyboard.press('Enter');
        console.log("Prompt sent! Waiting for response...");

        // 6. Wait for the AI assistant to start generating
        const responseSelector = 'div[data-message-author-role="assistant"]';
        await page.waitForSelector(responseSelector, { timeout: 30000 });

        // 7. Wait for the text to finish streaming
        await new Promise(r => setTimeout(r, 7000)); 

        // 8. Extraction and Console Log Line
        const extractedText = await page.evaluate(() => {
            const elements = document.querySelectorAll('div[data-message-author-role="assistant"]');
            const data = Array.from(elements).map(el => el.innerText).join('\n\n---\n\n');
            
            // This is the specific line you asked for to run in the Gemini browser
            console.log("--- EXTRACTED TEXT START ---");
            console.log(data);
            console.log("--- EXTRACTED TEXT END ---");
            
            return data;
        });

        console.log("Successfully extracted text from Gemini.");

    } catch (err) {
        console.error("FAILED: Could not find the div. Check if you are logged in or if a popup is blocking the screen.");
        console.log("Error details:", err.message);
    }
})();
// import puppeteer from 'puppeteer';

// async function automateWithFeedback(targetUrl, instructions) {
//     const browser = await puppeteer.launch({ 
//         headless: false, 
//         defaultViewport: null,
//         userDataDir: './user_data' 
//     });

//     const [targetTab] = await browser.pages();
//     const geminiTab = await browser.newPage();
    
//     let currentAttempt = 1;
//     let lastError = null;

//     try {
//         console.log(`Opening target: ${targetUrl}`);
//         await targetTab.goto(targetUrl, { waitUntil: 'networkidle2' });
        
//         // Only grab the body to keep the prompt clean
//         const siteHtml = await targetTab.evaluate(() => document.body.innerText.substring(0, 5000));

//         while (currentAttempt <= 3) {
//             console.log(`\n--- Attempt ${currentAttempt} ---`);
            
//             await geminiTab.goto('https://gemini.google.com/app');
//             await geminiTab.waitForSelector('div[role="textbox"]');

//             // CLEANER PROMPT: Avoid mentioning "pre code" so Gemini doesn't get confused
//             const feedbackPrompt = lastError 
//                 ? `Your last code failed: "${lastError}". Fix it. Use 'page'. No imports.`
//                 : `Site Content: ${siteHtml}
//                    Task: ${instructions}
//                    Write ONLY the Puppeteer code. No setup, no imports, no require. 
//                    Assume 'page' is already defined.`;

//             await geminiTab.evaluate((text) => {
//                 const box = document.querySelector('div[role="textbox"]');
//                 box.innerText = text;
//                 box.dispatchEvent(new Event('input', { bubbles: true }));
//             }, feedbackPrompt);

//             await geminiTab.click('button[aria-label="Send message"]');

//             // --- IMPROVED LISTENING ---
//             console.log("Waiting for Gemini...");
//             try {
//                 // Wait for the response container, then the code
//                 await geminiTab.waitForSelector('.model-response-text, pre', { timeout: 60000 });
//                 await new Promise(r => setTimeout(r, 4000)); // Wait for typing to finish

//                 let rawCode = await geminiTab.evaluate(() => {
//                     const blocks = document.querySelectorAll('pre');
//                     if (blocks.length === 0) return "";
//                     return blocks[blocks.length - 1].innerText;
//                 });

//                 if (!rawCode) throw new Error("No code block found in Gemini response.");

//                 // --- THE CLEANER ---
//                 const cleanedCode = rawCode
//                     .split('\n')
//                     .filter(line => {
//                         const l = line.trim();
//                         return !l.startsWith('import') && 
//                                !l.startsWith('const puppeteer') &&
//                                !l.includes('require(') &&
//                                !l.includes('puppeteer.launch');
//                     })
//                     .join('\n')
//                     .replace(/```javascript|```/g, '');

//                 console.log("Executing:\n", cleanedCode);

//                 const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
//                 const executeAction = new AsyncFunction('page', cleanedCode);
                
//                 await executeAction(targetTab);
//                 console.log("✅ Success!");
//                 break; 

//             } catch (err) {
//                 console.error(`❌ Error: ${err.message}`);
//                 lastError = err.message;
//                 currentAttempt++;
//             }
//         }
//     } catch (error) {
//         console.error("Fatal:", error);
//     }
// }

// automateWithFeedback('https://example.com', 'Find the "More Information" link and click it.');