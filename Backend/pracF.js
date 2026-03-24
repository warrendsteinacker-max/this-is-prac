import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

// Apply stealth to hide the "navigator.webdriver" flag from Gemini/Yuzu
puppeteer.use(StealthPlugin());

async function runGhostAgent() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        // Using specific flags to ensure Gemini doesn't detect the automation
        args: [
            '--start-maximized',
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const [workerPage] = await browser.pages(); // Yuzu Reader Tab
    const brainPage = await browser.newPage();   // Gemini AI Tab

    // Setting a standard User Agent to look like a normal Windows user
    const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    await workerPage.setUserAgent(UA);
    await brainPage.setUserAgent(UA);

    // Load both sites
    await workerPage.goto('https://reader.yuzu.com/reader/books/826802A');
    await brainPage.goto('https://gemini.google.com/app');

    console.log("--------------------------------------------------");
    console.log("STATUS: WAITING FOR LOGIN");
    console.log("Please sign in to Yuzu and Gemini manually.");
    console.log("The script will start automatically once the chat box appears.");
    console.log("--------------------------------------------------");

    // The script pauses here until the Gemini input box exists (detects login)
    await brainPage.waitForSelector('div[role="textbox"]', { timeout: 0 });
    console.log("STATUS: CONNECTION ESTABLISHED. BEGINNING EXTRACTION...");

    let pageCount = 1;

    while (true) {
        try {
            const screenshotPath = path.resolve(`temp_capture.png`);
            
            // 1. Capture the textbook page from Yuzu
            await workerPage.bringToFront();
            // We wait a moment to ensure the page is fully rendered before snapping
            await new Promise(r => setTimeout(r, 2000)); 
            await workerPage.screenshot({ path: screenshotPath });

            // 2. Switch to Gemini to process the image
            await brainPage.bringToFront();
            
            // Locate the file input for Gemini's upload feature
            const fileInput = await brainPage.$('input[type="file"]');
            await fileInput.uploadFile(screenshotPath);
            
            // Wait for the image thumbnail to show up in the prompt box
            await new Promise(r => setTimeout(r, 3000));

            // 3. Send the "Human" Prompt (Mimicking a student, not a bot)
            const humanMsg = "Could you please type out the text from this page for my notes? Just the content of the book, no extra conversation please.";
            
            await brainPage.click('div[role="textbox"]');
            // 'delay' makes the typing look like a real person typing
            await brainPage.keyboard.type(humanMsg, { delay: 40 }); 
            await brainPage.keyboard.press('Enter');

            // 4. Monitor Gemini for the finished response
            console.log(`[SYSTEM] Transcribing Page ${pageCount}...`);
            
            // The "Stop generating" button disappears when the AI is done talking
            await brainPage.waitForSelector('button[aria-label="Stop generating"]', { hidden: true, timeout: 120000 });

            // Grab the latest message from the chat
            const transcribedText = await brainPage.evaluate(() => {
                const messages = document.querySelectorAll('.message-content');
                return messages[messages.length - 1]?.innerText || "Extraction failed.";
            });

            // 5. Output to Terminal
            console.log(`\n=== PAGE ${pageCount} CONTENT ===\n`);
            console.log(transcribedText);
            console.log(`\n================================\n`);

            // 6. Navigate to the next page in Yuzu
            await workerPage.bringToFront();
            await workerPage.keyboard.press('ArrowRight');
            
            pageCount++;

            // Clean up and wait for the next page to load
            if (fs.existsSync(screenshotPath)) fs.unlinkSync(screenshotPath);
            await new Promise(r => setTimeout(r, 4000));

        } catch (err) {
            console.error("Critical Loop Error. Retrying in 10s...", err.message);
            await new Promise(r => setTimeout(r, 10000));
        }
    }
}

runGhostAgent();