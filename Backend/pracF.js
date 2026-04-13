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



/**
 * PREREQUISITES:
 * npm install puppeteer-extra puppeteer-extra-plugin-stealth puppeteer
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Apply stealth plugin to help bypass bot detection
puppeteer.use(StealthPlugin());

(async () => {
    console.log("Initializing Self-Driving Browser...");
    
    const browser = await puppeteer.launch({ 
        headless: false, 
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--disable-blink-features=AutomationControlled'
        ] 
    });

    // Initialize both pages simultaneously
    const [page, page2] = await Promise.all([
        browser.newPage(),
        browser.newPage()
    ]);

    console.log("Loading interfaces...");
    // Note: You must be logged into Google in this browser instance for Gemini to work
    await page.goto('https://gemini.google.com', { waitUntil: 'networkidle2' });
    await page2.goto('https://www.webmd.com/', { waitUntil: 'networkidle2' });

    // CSS selectors for Gemini's UI (these may change if Google updates the site)
    const promptSelector = 'div[contenteditable="true"]'; 
    const visitedUrls = new Set();

    console.log("System Active. Monitoring WebMD...");

    while (true) {
        try {
            const currentHtml = await page2.content();
            const currentUrl = page2.url();
            visitedUrls.add(currentUrl);

            // 1. Prepare the prompt
            // We limit HTML to 5000 chars to avoid hitting LLM context limits or slowing down the UI
            const myPrompt = `The current URL is ${currentUrl}. 
            Based on this HTML snippet: ${currentHtml.substring(0, 5000)}, 
            find a link or anything to a different internal page, article or to just do ssomething on current page. 
            Provide ONLY a JSON object: {"selector": "CSS_SELECTOR_HERE", "reason": "SHORT_REASON"}. 
            Avoid these recently visited URLs: ${Array.from(visitedUrls).slice(-5).join(', ')}.`;

            // 2. Interact with Gemini
            await page.waitForSelector(promptSelector);
            await page.click(promptSelector);
            
            // Clear existing text
            await page.keyboard.down('Control');
            await page.keyboard.press('A');
            await page.keyboard.up('Control');
            await page.keyboard.press('Backspace');

            // Type the prompt and send
            await page.type(promptSelector, myPrompt, { delay: 10 });
            await page.keyboard.press('Enter');

            console.log("Waiting for AI to decide next move...");
            // Adjust wait time based on AI response speed
            await new Promise(r => setTimeout(r, 15000)); 

            // 3. Extract the response
            const aiResponse = await page.evaluate(() => {
                const messages = document.querySelectorAll('div[data-message-author-role="assistant"]');
                return messages.length > 0 ? messages[messages.length - 1].innerText : null; 
            });

            if (aiResponse) {
                try {
                    // Regex to find the JSON object in the AI's message
                    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const decision = JSON.parse(jsonMatch[0]);
                        console.log(`AI Decision: ${decision.reason}`);
                        console.log(`Clicking selector: ${decision.selector}`);
                        
                        // 4. Execute the action on page2
                        await page2.waitForSelector(decision.selector, { timeout: 5000 });
                        await page2.click(decision.selector);
                        
                        // Wait for navigation but don't crash if it's just a partial update
                        await page2.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => {});
                    }
                } catch (e) {
                    console.warn("Could not parse AI JSON or find selector. Retrying...");
                }
            }

            // Cool-down to mimic human browsing behavior
            await new Promise(r => setTimeout(r, 5000));
        } catch (err) {
            console.error("Loop Error:", err.message);
            await new Promise(r => setTimeout(r, 10000));
        }
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