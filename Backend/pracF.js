import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Clipboard } from 'clipboardy'; // Optional: Use a library or browser-native

puppeteer.use(StealthPlugin());

/**
 * CONFIGURATION
 * Edit these values for your specific book and chapter.
 */
const BOOK_URL = 'https://reader.yuzu.com/reader/books/826802A';
const TARGET_CHAPTER = "Chapter 3"; // Exact name in Table of Contents
const MAX_PAGES = 15; 

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function startExtraction() {
    const browser = await puppeteer.launch({
        headless: false, // MUST BE FALSE for clipboard and UI interaction
        defaultViewport: null,
        args: ['--start-maximized', '--disable-blink-features=AutomationControlled']
    });

    const [page] = await browser.pages();
    
    // Grant Clipboard Permissions
    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://reader.yuzu.com", ["clipboard-read", "clipboard-write"]);

    console.log(">> Navigating to Yuzu...");
    await page.goto(BOOK_URL);

    console.log(">> Please login. Waiting for the reader to load...");
    // Wait for the 'Next' button or page input to know we are in the book
    await page.waitForSelector('button[aria-label="Next"]', { timeout: 0 });

    // 1. NAVIGATE TO CHAPTER (The "AI-Style" Search)
    console.log(`>> Searching for ${TARGET_CHAPTER}...`);
    await page.keyboard.press('t'); // Opens Table of Contents
    await sleep(2000);

    const navSuccess = await page.evaluate((chapterName) => {
        const items = Array.from(document.querySelectorAll('button, a, span'));
        const match = items.find(el => el.innerText.includes(chapterName));
        if (match) {
            match.click();
            return true;
        }
        return false;
    }, TARGET_CHAPTER);

    if (!navSuccess) {
        console.log(">> Chapter not found in TOC. Please navigate manually, then the script will continue.");
        await sleep(5000);
    } else {
        await sleep(5000); // Wait for page to load
    }

    // 2. EXTRACTION LOOP
    for (let i = 1; i <= MAX_PAGES; i++) {
        console.log(`>> Extracting Page ${i}...`);

        // Focus the iframe by clicking center screen
        await page.mouse.click(600, 400);
        await sleep(500);

        // Perform the "Human" Copy
        await page.keyboard.down('Control');
        await page.keyboard.press('a');
        await page.keyboard.up('Control');
        await sleep(200);
        await page.keyboard.down('Control');
        await page.keyboard.press('c');
        await page.keyboard.up('Control');
        await sleep(1000);

        // Read the text from the clipboard
        const pageText = await page.evaluate(async () => {
            return await navigator.clipboard.readText();
        });

        // SAVE DATA (Logging for now)
        console.log("--------------------------------------------------");
        console.log(`CONTENT PREVIEW (Page ${i}):`, pageText.substring(0, 100) + "...");
        
        // Write to a local file (append mode)
        fs.appendFileSync('extracted_text.txt', `\n--- PAGE ${i} ---\n${pageText}\n`);

        // 3. TURN THE PAGE
        await page.keyboard.press('ArrowRight');
        await sleep(3000); // Wait for next page to render
    }

    console.log(">> Done! Check extracted_text.txt");
    await browser.close();
}

import fs from 'fs';
startExtraction();





/////////remeber new copy meth ctrl a then c