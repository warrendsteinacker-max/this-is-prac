
// this test is for mod 4 discusion


import puppeteer from "puppeteer";

// ╔════════════════════════════════════════════════════════════════════╗
// ║   ASSIGNMENTS — fill in your assignments here                     ║
// ║                                                                    ║
// ║   sources:                                                        ║
// ║     bookTitle, author, authorLastFirst, date, publisher           ║
// ║     vbid       — number after /books/ in the Yuzu URL             ║
// ║     chapters   — array of chapter names to read                   ║
// ║     maxPagesPerChapter — how many pages to read before stopping   ║
// ║                                                                    ║
// ║   manualText — optional extra passages (leave "" to skip)         ║
// ╚════════════════════════════════════════════════════════════════════╝

const ASSIGNMENTS = [
  {
    directions: `
      Based on your assigned readings and in-class activities, you will analyze a video
      to identify teaching strategies that promote oral language, comprehension, vocabulary
      development and home-school connections within a classroom setting.

      The analysis table must:
      1. Examine how the teacher supported students in using science talk
      2. Determine strategies used to introduce and reinforce science vocabulary
      3. Examine how visual tools or hands-on activities contribute to student talk and understanding
      4. Determine if students were encouraged to use key terms in discussion or writing
      5. Explore how the teacher promoted speaking and listening skills
      6. Explore one way this science lesson could be extended at home
      7. Investigate how you could modify a strategy for diverse learners

      Include a 200-300 word summary with APA 7th Edition citations.
    `,

    sources: [
      {
        bookTitle: "Literacy in Elementary Education, Grades 3-6",
        author: "Ramlal",
        authorLastFirst: "Ramlal, S. R.",
        date: "2023",
        publisher: "Cognella Academic Publishing",
        vbid: "826802A",
        chapters: ["Chapter 3"],
        maxPagesPerChapter: 20,
      },
    ],

    manualText: `
---
AUTHOR: Annenberg Learner
DATE: n.d.
PAGE: 24
CHAPTER: does not have one
SECTION: does not have one

EXACT TEXT:
Case Studies in Science Education

Elsa — K

Teacher Profile
Name | Elsa
Experience | 15 years
Grade & Subject(s) | Two half-day kindergarten classes; all subjects
Classroom Demographics | Bilingual classroom
School | Elementary school in an urban district
Science Teaching | 2 days/week for 30 minutes
Curriculum | Specified by district

Module 1 - Introducing the Case
Elsa believes that for many children, what happens in kindergarten affects students' feelings about and learning in school for the rest of their lives. She is beginning to ask questions of herself and rethink her approach to teaching science. Knowing that her students become engaged whenever they are using their senses to explore objects and phenomena,
---

---
AUTHOR: Annenberg Learner
DATE: n.d.
PAGE: 25
CHAPTER: does not have one
SECTION: does not have one

EXACT TEXT:
Elsa wants to build upon her students' natural inclination to learn by making their own discoveries. She hopes to extend this type of learning to meaningful expressions of students' understandings.

Module 2 - Trying New Ideas
Jeff Winokur, an early childhood science educator at Wheelock College, has observed in his teaching practice that young students cherish playing with materials and that this fascination can be put to use to help them make scientific discoveries. During students' discovery of magnets, Elsa takes a guided discovery approach by getting students to work with a partner as she circulates through the classroom, helping them move toward making specific discoveries.
---

---
AUTHOR: Annenberg Learner
DATE: n.d.
PAGE: 26
CHAPTER: does not have one
SECTION: does not have one

EXACT TEXT:
After working in pairs, where materials are shared, each student completes a worksheet that reflects his or her findings about materials through which a magnetic force can travel. Later, the class reviews the worksheets together. Elsa believes that when students take their worksheets home, students' understandings are again reinforced when shared with family members.
---

---
AUTHOR: Annenberg Learner
DATE: n.d.
PAGE: 27
CHAPTER: does not have one
SECTION: does not have one

EXACT TEXT:
Module 3 - Reflecting and Building on Change
As the year progresses, Elsa is convinced that science has become her students' favorite activity period. As part of her final science unit, Elsa invites her students to mix food coloring in water to find out what happens. Elsa is learning that with discovery activities, even though a scientific concept is not necessarily being discovered, her students are making their own discoveries and beginning to build new knowledge.
---
    `,
  },
];

// ════════════════════════════════════════════════════════════
// SOURCE TEXT STORE — populated automatically
// ════════════════════════════════════════════════════════════

const SOURCE_TEXT_STORE = [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const YUZU_LIBRARY = "https://reader.yuzu.com/home/my-library";
const CHROME_PATH  = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const launchOptions = {
  headless: false,
  executablePath: CHROME_PATH,
  slowMo: 60,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-blink-features=AutomationControlled",
    "--start-maximized",
  ],
  defaultViewport: null,
  ignoreDefaultArgs: ["--enable-automation"],
};

// ─── GEMINI VISION — reads a screenshot by pasting it into a Gemini window ───
// We open a dedicated Gemini window for vision at startup and reuse it.
// Each page screenshot is uploaded via the Gemini attachment button,
// then we read the response text back.

async function openVisionBrowser() {
  const browser = await puppeteer.launch({
    ...launchOptions,
    args: [...launchOptions.args, `--user-data-dir=C:\\Temp\\puppeteer-vision`],
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    window.chrome = { runtime: {} };
  });
  await page.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
  console.log("  [VISION] Gemini vision window open.");
  return { browser, page };
}

// Sends a screenshot buffer + prompt to the Gemini vision window and returns the text response.
async function geminiVision(visionPage, screenshotBuffer, chapterName) {
  // Write screenshot to a temp file so Gemini's file input can pick it up
  const { writeFileSync, unlinkSync } = await import("fs");
  const tmpPath = `C:\\Temp\\yuzu_page_tmp.png`;
  writeFileSync(tmpPath, screenshotBuffer);

  // Click the attachment / image button in Gemini
  const attached = await visionPage.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button, [role='button'], label"));
    for (const btn of btns) {
      const lbl = (btn.getAttribute("aria-label") || btn.getAttribute("title") || btn.innerText || "").toLowerCase();
      if (lbl.includes("upload") || lbl.includes("attach") || lbl.includes("image") || lbl.includes("add image")) {
        btn.click();
        return true;
      }
    }
    // Try the file input directly
    const fileInput = document.querySelector("input[type='file']");
    if (fileInput) { fileInput.click(); return "input"; }
    return false;
  });

  if (attached === "input" || attached) {
    await sleep(800);
    // Set the file on the hidden input
    const fileInput = await visionPage.$("input[type='file']");
    if (fileInput) {
      await fileInput.uploadFile(tmpPath);
      await sleep(2000);
    }
  }

  // Type the prompt into the text box
  const prompt = `This is a screenshot of a textbook page in the Yuzu ebook reader.

Read ALL text visible on the book page. Find the page number at the bottom (e.g. "20 / 89" = page 20). Tell me if this is still part of "${chapterName}" or if a new chapter started.

Respond ONLY in this exact format:

PAGE_NUMBER: [number or UNKNOWN]
NEW_CHAPTER: [YES or NO]
TEXT:
[every word on the page, word for word]`;

  const sel = 'rich-textarea div[contenteditable="true"], div[contenteditable="true"], div[role="textbox"], textarea';
  const inputEl = await visionPage.$(sel);
  if (inputEl) {
    await inputEl.click();
    await sleep(300);
    await visionPage.evaluate((t, s) => {
      const el = document.querySelector(s);
      if (!el) return;
      el.focus();
      document.execCommand("insertText", false, t);
    }, prompt, sel);
  }

  await sleep(500);
  const sendBtn = await visionPage.$(
    'button[aria-label="Send message"], button[aria-label="Submit"], button[jsname="Qx7uuf"]'
  );
  if (sendBtn) await sendBtn.click();
  else await visionPage.keyboard.press("Enter");

  // Wait for response
  try {
    await visionPage.waitForFunction(
      () => !!document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'),
      { timeout: 15000, polling: 500 }
    );
  } catch (_) {}
  await visionPage.waitForFunction(
    () => !document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'),
    { timeout: 60000, polling: 1000 }
  ).catch(() => {});
  await sleep(2000);

  const raw = await visionPage.evaluate(() => {
    const all = [
      ...document.querySelectorAll("model-response"),
      ...document.querySelectorAll('[data-message-author-role="model"]'),
      ...document.querySelectorAll(".model-response-text"),
      ...document.querySelectorAll("message-content"),
    ];
    return all.length ? all[all.length - 1].innerText.trim() : "";
  });

  // Clean up temp file
  try { unlinkSync(tmpPath); } catch (_) {}

  return raw;
}

// ─── YUZU PAGE READER ─────────────────────────────────────────────────────────

async function readYuzuBook(source, profileIndex, visionPage) {
  const label = `YUZU-${profileIndex + 1}`;
  const chapters = source.chapters || [source.chapter].filter(Boolean);
  console.log(`\n  [${label}] Book: "${source.bookTitle}"`);
  console.log(`  [${label}] Chapters: ${chapters.join(", ")}`);

  const browser = await puppeteer.launch({
    ...launchOptions,
    args: [...launchOptions.args, `--user-data-dir=C:\\Temp\\puppeteer-yuzu-${profileIndex}`],
  });

  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    window.chrome = { runtime: {} };
  });

  await page.goto(YUZU_LIBRARY, { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(5000);

  if (page.url().includes("sign-in") || page.url().includes("#sign") || page.url().includes("login")) {
    console.log(`  [${label}] Not logged in — sign into Yuzu in this window.`);
    await page.waitForFunction(
      () => location.href.includes("my-library") || location.href.includes("dashboard"),
      { timeout: 180000, polling: 2000 }
    );
    await sleep(4000);
  }

  const readerUrl = source.vbid
    ? `https://reader.yuzu.com/reader/books/${source.vbid}`
    : await findBookUrl(page, source.bookTitle, label);

  if (!readerUrl) {
    console.error(`  [${label}] Could not find book — skipping.`);
    await browser.close();
    return;
  }

  await page.goto(readerUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(6000);

  await page.waitForFunction(
    () => location.href.includes("/reader/books/") &&
      (document.querySelector("input[type='number']") ||
       document.querySelector("iframe[src*='jigsaw'], iframe[title], iframe[name]")),
    { timeout: 30000, polling: 1000 }
  ).catch(() => {});

  await sleep(3000);

  for (const chapterName of chapters) {
    console.log(`\n  [${label}] → ${chapterName}`);
    await openToc(page);
    await sleep(2500);
    await clickChapter(page, chapterName);
    await closeToc(page);
    await sleep(4000);

    const startPage = await getPageNumber(page);
    console.log(`  [${label}] Starts at page: ${startPage || "unknown"}`);

    const maxPages = source.maxPagesPerChapter || 20;
    let lastText = "";
    let emptyCount = 0;

    for (let offset = 0; offset < maxPages; offset++) {
      await sleep(3000);
      const buf = await page.screenshot({ type: "png", fullPage: false });
      console.log(`  [${label}] Page ${offset + 1}: ${Math.round(buf.length / 1024)}kb — reading via Gemini vision...`);

      const raw = await geminiVision(visionPage, buf, chapterName);

      const pageMatch      = raw.match(/PAGE_NUMBER:\s*(\d+|UNKNOWN)/i);
      const chapterEndMatch = raw.match(/NEW_CHAPTER:\s*(YES|NO)/i);
      const textMatch      = raw.match(/TEXT:\s*([\s\S]+)/i);

      const pageNum    = pageMatch && pageMatch[1] !== "UNKNOWN" ? parseInt(pageMatch[1], 10) : (startPage ? startPage + offset : offset + 1);
      const extracted  = textMatch ? textMatch[1].trim() : "";
      const newChapter = chapterEndMatch && chapterEndMatch[1].toUpperCase() === "YES";

      console.log(`  [${label}] p.${pageNum} chapterEnded=${newChapter} len=${extracted.length}`);

      if (newChapter && offset > 0) { console.log(`  [${label}] New chapter — stopping.`); break; }

      if (extracted.length > 100) {
        if (extracted === lastText) { console.log(`  [${label}] Stuck — stopping.`); break; }
        lastText = extracted;
        emptyCount = 0;
        SOURCE_TEXT_STORE.push({
          bookTitle: source.bookTitle, author: source.author,
          authorLastFirst: source.authorLastFirst, date: source.date,
          publisher: source.publisher || "", chapter: chapterName,
          page: pageNum, text: extracted,
        });
        console.log(`  [${label}] Stored p.${pageNum}`);
      } else {
        emptyCount++;
        if (emptyCount >= 3) { console.log(`  [${label}] 3 empty pages — stopping.`); break; }
      }

      // Next page
      const clicked = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button, a, [role='button']"));
        for (const btn of btns) {
          const lbl = (btn.getAttribute("aria-label") || btn.getAttribute("title") || btn.innerText || "").toLowerCase().trim();
          if (lbl === "next" || lbl === "next page" || lbl === ">") { btn.click(); return true; }
        }
        return false;
      });
      if (!clicked) await page.keyboard.press("ArrowRight");
    }
  }

  console.log(`  [${label}] Done. ${SOURCE_TEXT_STORE.filter(e => e.bookTitle === source.bookTitle).length} pages stored.`);
  await browser.close();
}

async function findBookUrl(page, title, label) {
  await page.waitForFunction(
    () => document.querySelectorAll("a[href*='reader/books']").length > 0,
    { timeout: 20000, polling: 1000 }
  ).catch(() => {});
  return await page.evaluate((t) => {
    for (const link of document.querySelectorAll("a[href*='reader/books']")) {
      if ((link.getAttribute("aria-label") || link.innerText || "").toLowerCase().includes(t.toLowerCase()))
        return link.href.split("?")[0];
    }
    return null;
  }, title);
}

async function getPageNumber(page) {
  return await page.evaluate(() => {
    for (const input of document.querySelectorAll("input")) {
      if (input.type === "number" || input.className?.includes("page")) {
        const v = parseInt(input.value, 10);
        if (!isNaN(v) && v > 0) return v;
      }
    }
    const m = document.body.innerText.match(/\b(\d+)\s*\/\s*(\d+)\b/);
    return m ? parseInt(m[1], 10) : null;
  });
}

async function openToc(page) {
  await page.evaluate(() => {
    for (const btn of document.querySelectorAll("button, [role='button']")) {
      const lbl = (btn.getAttribute("aria-label") || btn.getAttribute("title") || btn.innerText || "").toLowerCase();
      if (lbl.includes("table of contents") || lbl.includes("toc") || lbl === "menu" || lbl.includes("main menu")) {
        btn.click(); return;
      }
    }
    const fb = document.querySelector("header button, nav button");
    if (fb) fb.click();
  });
}

async function clickChapter(page, chapterName) {
  const chapNum = chapterName.replace(/\D/g, "");
  const clicked = await page.evaluate((chap, num) => {
    for (const el of document.querySelectorAll("nav a, nav button, [class*='toc'] a, aside a, [role='listitem'] a")) {
      const t = (el.innerText || el.textContent || "").toLowerCase().trim();
      if (t.includes(chap.toLowerCase()) || (num && (t.startsWith(num + " ") || t.includes("chapter " + num)))) {
        el.click(); return true;
      }
    }
    return false;
  }, chapterName, chapNum);
  if (!clicked) console.log(`  Chapter not found in TOC — reading from current position`);
}

async function closeToc(page) {
  await page.evaluate(() => {
    for (const btn of document.querySelectorAll("button, [role='button']")) {
      const lbl = (btn.getAttribute("aria-label") || btn.innerText || "").toLowerCase();
      if (lbl.includes("close") || lbl.includes("dismiss")) { btn.click(); return; }
    }
  });
}

// ─── BUILD SOURCE BLOCK ───────────────────────────────────────────────────────

function buildSourceBlock(entries) {
  if (!entries.length) return "No source text available.";
  return entries.map(e => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOURCE PASSAGE
Book:    ${e.bookTitle}
Author:  ${e.authorLastFirst} (${e.date})
Chapter: ${e.chapter}
Page:    p. ${e.page}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${e.text}
`.trim()).join("\n\n");
}

function buildReferenceList(sources) {
  const seen = new Set();
  const refs = [];
  for (const s of sources) {
    const key = `${s.bookTitle}${s.date}`;
    if (!seen.has(key)) {
      seen.add(key);
      refs.push(`${s.authorLastFirst} (${s.date}). *${s.bookTitle}*. ${s.publisher}.`);
    }
  }
  return refs.join("\n");
}

function parseManualText(manualText, idx) {
  if (!manualText?.trim()) return;
  const blocks = manualText.split(/^---\s*$/m).filter(b => b.trim());
  let added = 0;
  for (const block of blocks) {
    const get = (key) => { const m = block.match(new RegExp(`^${key}:\\s*(.+)$`, "im")); return m ? m[1].trim() : ""; };
    const author = get("AUTHOR"), date = get("DATE"), pageRaw = get("PAGE");
    const chapter = get("CHAPTER"), section = get("SECTION");
    const em = block.match(/EXACT TEXT:\s*([\s\S]+)/i);
    const text = em ? em[1].trim() : "";
    if (!text || text.length < 30) continue;
    const chapterLabel =
      (chapter && !chapter.toLowerCase().includes("does not")) ? chapter :
      (section && !section.toLowerCase().includes("does not")) ? section : "Manual Source";
    SOURCE_TEXT_STORE.push({
      bookTitle: `Manual Source — ${author}`, author: author.split(" ").pop(),
      authorLastFirst: author, date, publisher: "", chapter: chapterLabel,
      page: parseInt(pageRaw, 10) || pageRaw, text, isManual: true,
    });
    added++;
  }
  if (added) console.log(`  [MANUAL TEXT] ${added} passage(s) parsed for assignment ${idx + 1}`);
}

// ─── FIRST PROMPT ─────────────────────────────────────────────────────────────

function buildFirstPrompt(assignment) {
  const entries = SOURCE_TEXT_STORE.filter(e => assignment.sources.some(s => s.bookTitle === e.bookTitle));
  const sourceBlock   = buildSourceBlock(entries);
  const referenceList = buildReferenceList(entries.map(e => ({ bookTitle: e.bookTitle, authorLastFirst: e.authorLastFirst, date: e.date, publisher: e.publisher || "" })));

  return `You are completing an assignment using exact text pulled word for word from textbooks.
Use these passages as your ONLY citation sources.

${"=".repeat(55)}
ASSIGNMENT DIRECTIONS:
${"=".repeat(55)}
${assignment.directions.trim()}

${"=".repeat(55)}
SOURCE TEXT:
${"=".repeat(55)}
${sourceBlock}

${"=".repeat(55)}
REFERENCE LIST:
${"=".repeat(55)}
${referenceList}

${"=".repeat(55)}
APA 7TH EDITION CITATION RULES:
${"=".repeat(55)}

━━ PARENTHETICAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Author (date) states "word for word text" (p. #).
  "word for word text" (Author, date, p. #).
  "word for word text" (Author, date, pp. #–#).

RULES:
1. Quotes must be EXACTLY word for word from source.
2. Period AFTER closing parenthesis — NEVER inside quotes.
   CORRECT: "text" (Ramlal, 2023, p. 23).
   WRONG:   "text." (Ramlal, 2023, p. 23).
3. Every quote MUST have a citation immediately after it.
4. No filler words before the opening quote.
   WRONG: such as "text" (Ramlal, 2023, p. 23).
   CORRECT: Ramlal (2023) states "text" (p. 23).
5. If source starts with a capital — pull first word out, lowercase it.
6. NEVER quote a word or phrase without a citation after it.

━━ NARRATIVE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  According to Author (date), from Chapter X on page #, ...
  As Author (date) explains in Chapter X on page #, ...

- Chapter and page in the SENTENCE — never inside parentheses.
  WRONG: Ramlal (2023, Chapter 3, p. 23) states...
  CORRECT: Ramlal (2023) explains in Chapter 3 on page 23 that...

━━ IF IN DOUBT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Drop the citation. Write your own plain sentence.

Choose only the most relevant pages. You do not have to cite every page.

Complete the assignment now. Add a References section at the end.`;
}

// ─── GEMINI WINDOW UTILITIES ──────────────────────────────────────────────────

async function openGeminiBrowser(profileName, label) {
  const browser = await puppeteer.launch({
    ...launchOptions,
    args: [...launchOptions.args, `--user-data-dir=C:\\Temp\\puppeteer-${profileName}`],
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    window.chrome = { runtime: {} };
  });
  await page.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
  console.log(`  [${label}] window open.`);
  return { browser, page };
}

async function findInput(page, label) {
  for (const sel of ['rich-textarea div[contenteditable="true"]', 'div[contenteditable="true"]', 'div[role="textbox"]', 'textarea']) {
    try {
      const el = await page.$(sel);
      if (el && (await el.boundingBox())?.width > 0) return { el, sel };
    } catch (_) {}
  }
  throw new Error(`[${label}] Input not found`);
}

async function sendMessage(page, text, label) {
  const { el, sel } = await findInput(page, label);
  await el.click(); await sleep(400);
  await page.keyboard.down("Control"); await page.keyboard.press("a"); await page.keyboard.up("Control");
  await page.keyboard.press("Backspace"); await sleep(200);
  const ok = await page.evaluate((t, s) => { const el = document.querySelector(s); if (!el) return false; el.focus(); return document.execCommand("insertText", false, t); }, text, sel);
  if (!ok) await page.evaluate((t, s) => {
    const el = document.querySelector(s); if (!el) return; el.focus();
    if (el.contentEditable === "true") el.innerText = t;
    else Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(el, t);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, text, sel);
  await sleep(500);
  const btn = await page.$('button[aria-label="Send message"], button[aria-label="Submit"], button[jsname="Qx7uuf"]');
  if (btn) await btn.click(); else await page.keyboard.press("Enter");
  await sleep(2000);
}

async function waitForResponse(page, label, timeoutMs = 240000) {
  console.log(`  [${label}] Waiting...`);
  try { await page.waitForFunction(() => !!document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'), { timeout: 20000, polling: 500 }); } catch (_) {}
  await page.waitForFunction(() => !document.querySelector('[aria-label="Stop generating"], [aria-label="Stop response"]'), { timeout: timeoutMs, polling: 1000 }).catch(() => {});
  await sleep(3000);
  const text = await page.evaluate(() => {
    const all = [...document.querySelectorAll("model-response"), ...document.querySelectorAll('[data-message-author-role="model"]'), ...document.querySelectorAll(".model-response-text"), ...document.querySelectorAll("message-content")];
    return all.length ? all[all.length - 1].innerText.trim() : "";
  });
  if (!text) console.warn(`  [${label}] Empty response`);
  else console.log(`  [${label}] ${text.length} chars`);
  return text;
}

// ─── CITATION SCANNER ─────────────────────────────────────────────────────────

function scanCitations(text) {
  const v = []; let m;
  const r1a = /"([^"]+?)\."\s*\((?:[^)]+)\)/g;
  while ((m = r1a.exec(text)) !== null) v.push({ rule: 1, bad: m[0], detail: "Period inside closing quote — must go AFTER parenthesis." });
  const r1b = /"([^"]{5,}?)\."\s*(?!\s*\()/g;
  while ((m = r1b.exec(text)) !== null) v.push({ rule: 1, bad: m[0].trim(), detail: "Period inside closing quote AND no citation — remove entirely." });
  const r2 = /""\s*\([^)]*\)/g;
  while ((m = r2.exec(text)) !== null) v.push({ rule: 2, bad: m[0], detail: "Empty quotes — drop and write your own sentence." });
  for (const f of ["such as", "like", "known as", "called", "termed", "referred to as"]) {
    const re = new RegExp(`${f}\\s+"([^"]{3,}?)"\\s*\\(`, "gi");
    while ((m = re.exec(text)) !== null) v.push({ rule: 3, bad: m[0].trim(), detail: `Filler "${f}" before quote.` });
  }
  const r4 = /([A-Z][a-zA-Z\s,&.]+?)\s*\((\d{4})\s*,\s*(?:Chapter|Ch\.?|p\.)\s*[\d\w]+[^)]*\)/g;
  while ((m = r4.exec(text)) !== null) v.push({ rule: 4, bad: m[0], detail: "Chapter/page inside parentheses — write in the sentence instead." });
  const r5 = /(?:According to|As noted by|As stated by|As explained by)\s+([^(]+?)\s*\((\d{4})\)\s*,/gi;
  while ((m = r5.exec(text)) !== null) {
    const after = text.substring(m.index + m[0].length, m.index + m[0].length + 300).toLowerCase();
    if (!after.match(/\b(chapter|section|page|p\.|on page)\b/)) v.push({ rule: 5, bad: m[0].trim(), detail: "Narrative citation missing chapter/page." });
  }
  const r6 = /(?:states|notes|explains|writes|argues|suggests|reports|observes)\s+"([A-Z][a-zA-Z']{2,})\s+([^"]{3,}?)"\s*\(/g;
  while ((m = r6.exec(text)) !== null) v.push({ rule: 6, bad: `"${m[1]} ${m[2]}"`, detail: `Quote starts on capital "${m[1]}" — pull out and lowercase.` });
  const r7 = /"([^"]{2,60})"\s*(?!\s*\()/g;
  const hasVerb = /\b(is|are|was|were|has|have|must|should|will|can|does|do|shows|states|notes|explains|suggests)\b/;
  while ((m = r7.exec(text)) !== null) if (!hasVerb.test(m[1].toLowerCase()) && m[1].length < 60) v.push({ rule: 7, bad: m[0].trim(), detail: "Quoted phrase has no citation." });
  return v;
}

function buildEvidenceReport(violations) {
  if (!violations.length) return null;
  return `Scanner found ${violations.length} violation(s):\n\n` +
    violations.map((v, i) => `VIOLATION ${i + 1} — Rule ${v.rule}\nWrong: ${v.bad}\nWhy:   ${v.detail}`).join("\n\n");
}

const buildReviewerPrompt = (assignment, evidence) => `You are a strict APA 7th Edition citation reviewer.

${evidence ? `Scanner found violations:\n\n${evidence}` : "Scanner found nothing. Do a thorough manual check."}

RULES:
1. Period AFTER closing parenthesis — NEVER inside quotes
2. Every quote needs a citation immediately after it
3. No filler words before opening quote
4. No empty quotes
5. Opening quote on capital word = pull out and lowercase
6. No quotes around terms without citations
7. Narrative: chapter/page in sentence NOT inside parentheses
8. Every narrative citation must reference chapter or page

End with: OVERALL RESULT: PASS  or  OVERALL RESULT: FAIL

Assignment:
---
${assignment}
---`;

function buildCorrectionPrompt(feedback, violations) {
  let p = "Fix every citation violation now.\n\n";
  violations.forEach((v, i) => { p += `${i + 1}. WRONG: ${v.bad}\n   WHY: ${v.detail}\n   FIX: Remove it. Write your own sentence.\n\n`; });
  p += `Reviewer said:\n${feedback}\n\nCORRECT formats:\n`;
  p += `  Ramlal (2023) states "word for word text" (p. 23).\n`;
  p += `  "word for word text" (Ramlal, 2023, p. 23).\n`;
  p += `  According to Ramlal (2023), from Chapter 3 on page 23, ...\n\n`;
  p += "Rewrite the full assignment now.";
  return p;
}

function buildDirectionsCheckerPrompt(assignment, directions) {
  return `You are checking if a completed assignment covers every requirement in the directions.
Do NOT check citation format — only check CONTENT coverage.

${"=".repeat(50)}
ASSIGNMENT DIRECTIONS:
${"=".repeat(50)}
${directions.trim()}

${"=".repeat(50)}
COMPLETED ASSIGNMENT:
${"=".repeat(50)}
${assignment}

${"=".repeat(50)}
YOUR JOB:
${"=".repeat(50)}
For each numbered requirement report:
  POINT: [exact requirement]
  STATUS: COVERED or MISSING
  REASON: one sentence

End with exactly one of these as the very last line:
DIRECTIONS RESULT: PASS
DIRECTIONS RESULT: FAIL`;
}

function buildDirectionsRewritePrompt(feedback) {
  return `Your assignment is missing required content. Add everything that is missing.

Checker feedback:
${feedback}

Keep every existing citation exactly as it is.
Only add the missing content.
Rewrite the full assignment with the missing points included.`;
}

const FOLLOWUP_PROMPTS = [
  `Review every citation. For each parenthetical: confirm text is word for word, author and date included, period AFTER closing parenthesis. For each narrative: confirm chapter and page are in the sentence naturally. Fix any that are wrong.`,
  `Final citation check: (1) every quoted phrase must have a citation after it — if not, remove quotes and write plainly. (2) Period AFTER closing parenthesis — never inside quotes. (3) No quotes around terms without citations. Fix everything that does not match.`,
];

// ─── RUN ONE ASSIGNMENT ───────────────────────────────────────────────────────

async function runAssignment(num, assignment, workerPage, reviewerPage, checkerPage) {
  console.log("\n" + "█".repeat(60));
  console.log(`  ASSIGNMENT ${num}`);
  console.log("█".repeat(60));

  const entries = SOURCE_TEXT_STORE.filter(e => assignment.sources.some(s => s.bookTitle === e.bookTitle));
  console.log(`\n  Source text: ${entries.length} pages`);

  console.log(`\n${"=".repeat(60)}\n  ROUND 0 — Sending to Worker\n${"=".repeat(60)}\n`);
  await sendMessage(workerPage, buildFirstPrompt(assignment), "WORKER");
  let lastResponse = await waitForResponse(workerPage, "WORKER");

  for (let i = 0; i < FOLLOWUP_PROMPTS.length; i++) {
    const round = i + 1;
    console.log(`\n${"=".repeat(60)}\n  CITATION ROUND ${round}\n${"=".repeat(60)}`);
    let approved = false, attempt = 0;

    while (!approved) {
      attempt++;
      console.log(`\n  Attempt ${attempt}`);
      if (attempt === 1) { await sendMessage(workerPage, FOLLOWUP_PROMPTS[i], "WORKER"); lastResponse = await waitForResponse(workerPage, "WORKER"); }

      const violations = scanCitations(lastResponse);
      console.log(`  [SCANNER] ${violations.length ? violations.length + " violation(s)" : "Clean"}`);

      await sendMessage(reviewerPage, buildReviewerPrompt(lastResponse, buildEvidenceReport(violations)), "CITATION REVIEWER");
      const feedback = await waitForResponse(reviewerPage, "CITATION REVIEWER");
      console.log(`\n  CITATION REVIEWER:\n  ` + feedback.split("\n").join("\n  "));

      if (feedback.includes("OVERALL RESULT: PASS") && !feedback.includes("OVERALL RESULT: FAIL")) {
        console.log(`\n  Citation Round ${round} PASSED.\n`);
        approved = true;
      } else {
        await sendMessage(workerPage, buildCorrectionPrompt(feedback, violations), "WORKER");
        lastResponse = await waitForResponse(workerPage, "WORKER");
        await sleep(2000);
      }
    }
    await sleep(2000);
  }

  console.log(`\n${"=".repeat(60)}\n  DIRECTIONS CHECK\n${"=".repeat(60)}`);
  let dirApproved = false, dirAttempt = 0;

  while (!dirApproved) {
    dirAttempt++;
    console.log(`\n  Directions Attempt ${dirAttempt}`);
    await sendMessage(checkerPage, buildDirectionsCheckerPrompt(lastResponse, assignment.directions), "DIRECTIONS CHECKER");
    const checkerFeedback = await waitForResponse(checkerPage, "DIRECTIONS CHECKER");
    console.log(`\n  DIRECTIONS CHECKER:\n  ` + checkerFeedback.split("\n").join("\n  "));

    if (checkerFeedback.includes("DIRECTIONS RESULT: PASS")) {
      console.log(`\n  Directions Check PASSED.\n`);
      dirApproved = true;
    } else if (checkerFeedback.includes("DIRECTIONS RESULT: FAIL")) {
      console.log(`\n  Directions Check FAILED — fixing...\n`);
      await sendMessage(workerPage, buildDirectionsRewritePrompt(checkerFeedback), "WORKER");
      lastResponse = await waitForResponse(workerPage, "WORKER");
      const rv = scanCitations(lastResponse);
      if (rv.length) {
        await sendMessage(reviewerPage, buildReviewerPrompt(lastResponse, buildEvidenceReport(rv)), "CITATION REVIEWER");
        const rf = await waitForResponse(reviewerPage, "CITATION REVIEWER");
        if (!rf.includes("OVERALL RESULT: PASS")) {
          await sendMessage(workerPage, buildCorrectionPrompt(rf, rv), "WORKER");
          lastResponse = await waitForResponse(workerPage, "WORKER");
        }
      }
      await sleep(2000);
    } else {
      if (dirAttempt >= 4) { console.log(`  No verdict after 4 attempts — moving on.`); dirApproved = true; }
      else {
        await sendMessage(checkerPage, `End your response with exactly one of:\n\nDIRECTIONS RESULT: PASS\n\nor\n\nDIRECTIONS RESULT: FAIL`, "DIRECTIONS CHECKER");
        const reminder = await waitForResponse(checkerPage, "DIRECTIONS CHECKER");
        if (reminder.includes("DIRECTIONS RESULT: PASS")) { dirApproved = true; }
        else if (reminder.includes("DIRECTIONS RESULT: FAIL")) {
          await sendMessage(workerPage, buildDirectionsRewritePrompt(reminder), "WORKER");
          lastResponse = await waitForResponse(workerPage, "WORKER");
        }
        await sleep(2000);
      }
    }
  }

  console.log(`\n${"█".repeat(60)}`);
  console.log(`  ASSIGNMENT ${num} COMPLETE — copy from Worker window.`);
  console.log(`${"█".repeat(60)}\n`);
  return lastResponse;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log("█".repeat(60));
  console.log("  GEMINI PIPELINE — no API key required");
  console.log("█".repeat(60));
  console.log(`  ${ASSIGNMENTS.length} assignment(s) queued.\n`);

  // Open vision window first (reused for all page screenshots)
  console.log("Opening Gemini vision window...");
  const { browser: vBrowser, page: visionPage } = await openVisionBrowser();

  // Wait for vision window login if needed
  if (visionPage.url().includes("accounts.google.com")) {
    console.log("  Sign into Google in the VISION window first.");
    await visionPage.waitForFunction(() => location.href.includes("gemini.google.com"), { timeout: 180000, polling: 1000 });
  }
  await visionPage.waitForFunction(
    () => !!document.querySelector('rich-textarea div[contenteditable="true"], div[contenteditable="true"], textarea'),
    { timeout: 30000, polling: 1000 }
  ).catch(() => {});
  console.log("  Vision window ready.\n");

  // Step 1: Parse manual text + read Yuzu books
  console.log("STEP 1 — Reading books + manual text...\n");
  let yuzuIndex = 0;
  for (let ai = 0; ai < ASSIGNMENTS.length; ai++) {
    const a = ASSIGNMENTS[ai];
    if (a.manualText?.trim()) parseManualText(a.manualText, ai);
    for (const source of a.sources) await readYuzuBook(source, yuzuIndex++, visionPage);
  }

  console.log(`\n${SOURCE_TEXT_STORE.length} total pages stored.`);
  SOURCE_TEXT_STORE.forEach(e => console.log(`  ${e.bookTitle} — ${e.chapter} — p.${e.page} — ${e.text.length} chars`));

  // Step 2: Open Worker, Reviewer, Checker windows
  console.log("\nSTEP 2 — Opening Gemini AI windows...\n");
  const { browser: wBrowser, page: workerPage }   = await openGeminiBrowser("worker",   "WORKER");
  const { browser: rBrowser, page: reviewerPage } = await openGeminiBrowser("reviewer", "CITATION REVIEWER");
  const { browser: cBrowser, page: checkerPage }  = await openGeminiBrowser("checker",  "DIRECTIONS CHECKER");

  const allPages = [workerPage, reviewerPage, checkerPage];
  if (allPages.some(p => p.url().includes("accounts.google.com"))) {
    console.log("\n  Sign into Google in ALL THREE Gemini windows.");
    await Promise.all(allPages.map(p => p.waitForFunction(() => location.href.includes("gemini.google.com"), { timeout: 180000, polling: 1000 })));
  }
  for (const [p, lbl] of [[workerPage, "WORKER"], [reviewerPage, "CITATION REVIEWER"], [checkerPage, "DIRECTIONS CHECKER"]]) {
    await p.waitForFunction(() => !!document.querySelector('rich-textarea div[contenteditable="true"], div[contenteditable="true"], textarea'), { timeout: 30000, polling: 1000 }).catch(() => console.warn(`  [${lbl}] Input wait timed out`));
  }
  await sleep(2000);
  console.log("\nAll windows ready.\n");

  // Step 3: Run assignments
  console.log("STEP 3 — Running assignments...\n");
  for (let i = 0; i < ASSIGNMENTS.length; i++) {
    await runAssignment(i + 1, ASSIGNMENTS[i], workerPage, reviewerPage, checkerPage);
    if (i < ASSIGNMENTS.length - 1) { console.log("Next in 5s...\n"); await sleep(5000); }
  }

  console.log("\n" + "█".repeat(60));
  console.log("  ALL ASSIGNMENTS COMPLETE");
  console.log("█".repeat(60) + "\n");
})();