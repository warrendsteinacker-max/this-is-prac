import puppeteer from "puppeteer";

// ╔════════════════════════════════════════════════════════════════════╗
// ║   ASSIGNMENTS — fill in your assignments here                     ║
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
// SOURCE TEXT STORE
// ════════════════════════════════════════════════════════════

const SOURCE_TEXT_STORE = [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const launchOptions = {
  headless: false,
  executablePath: CHROME_PATH,
  slowMo: 50,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-blink-features=AutomationControlled",
    "--start-maximized",
  ],
  defaultViewport: null,
  ignoreDefaultArgs: ["--enable-automation"],
};

// ─── GET PAGE NUMBER FROM MAIN DOM ────────────────────────────────────────────

async function getPageNumber(page) {
  return await page.evaluate(() => {
    // Try the page number input
    for (const input of document.querySelectorAll("input")) {
      const val = parseInt(input.value, 10);
      if (!isNaN(val) && val > 0 && val < 2000) return val;
    }
    // Try aria-valuetext on a slider
    const slider = document.querySelector("[aria-valuetext]");
    if (slider) {
      const m = slider.getAttribute("aria-valuetext").match(/(\d+)/);
      if (m) return parseInt(m[1], 10);
    }
    // Try "Page 22" tooltip
    for (const t of document.querySelectorAll("[class*='tooltip'], [role='tooltip']")) {
      const m = (t.innerText || "").match(/Page\s+(\d+)/i);
      if (m) return parseInt(m[1], 10);
    }
    return null;
  });
}

// ─── COPY PAGE TEXT VIA CLIPBOARD ────────────────────────────────────────────
// Clicks inside the reading pane, Ctrl+A selects all, Ctrl+C copies,
// then reads clipboard. Filters out Yuzu UI strings.

async function copyPageText(page) {
  // Click in the center of the reading pane
  await page.mouse.click(700, 350);
  await sleep(600);

  await page.keyboard.down("Control");
  await page.keyboard.press("a");
  await page.keyboard.up("Control");
  await sleep(500);

  await page.keyboard.down("Control");
  await page.keyboard.press("c");
  await page.keyboard.up("Control");
  await sleep(600);

  let text = await page.evaluate(async () => {
    try { return await navigator.clipboard.readText() || ""; }
    catch (_) { return ""; }
  });

  // Strip known Yuzu UI strings
  const uiStrings = [
    "Book Page Loaded", "Skip to main content", "Skip to book navigation",
    "Table of Contents", "Search across book", "Reader Preferences",
    "Highlights, Notes, Bookmarks", "More Options", "Previous", "Next",
    "Bookmark page", "Go to Page", "Go to First Page", "Read Aloud",
    "Print", "Download", "My Library",
  ];
  for (const ui of uiStrings) text = text.split(ui).join("");
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  return text;
}

// ─── OPEN TOC ─────────────────────────────────────────────────────────────────

async function openToc(page) {
  await page.evaluate(() => {
    for (const btn of document.querySelectorAll("button[aria-label]")) {
      if (btn.getAttribute("aria-label") === "Table of Contents") { btn.click(); return; }
    }
    // Fallback — any hamburger-style button in the header
    const fb = document.querySelector("header button, [class*='header'] button");
    if (fb) fb.click();
  });
  await sleep(1500);
}

// ─── CLICK CHAPTER IN TOC ────────────────────────────────────────────────────

async function clickChapterInToc(page, chapterName) {
  const chapterNum = chapterName.match(/\d+/)?.[0] || "";
  const clicked = await page.evaluate((chapName, chapNum) => {
    // Yuzu TOC buttons: aria-label="Go to Chapter 3 Comprehension, page 20"
    for (const btn of document.querySelectorAll("button[aria-label]")) {
      const lbl = btn.getAttribute("aria-label").toLowerCase();
      if (lbl.includes("go to") && chapNum && lbl.includes("chapter " + chapNum)) {
        btn.click(); return true;
      }
    }
    // Fallback — match by span text inside TOC buttons
    for (const btn of document.querySelectorAll("button")) {
      const span = btn.querySelector("span");
      if (span && span.innerText.toLowerCase().includes(chapName.toLowerCase())) {
        btn.click(); return true;
      }
    }
    // Fallback — any link/button whose text matches
    for (const el of document.querySelectorAll("nav a, nav button, aside a, [class*='toc'] a")) {
      const t = (el.innerText || el.textContent || "").toLowerCase().trim();
      if (t.includes(chapName.toLowerCase()) || (chapNum && t.includes("chapter " + chapNum))) {
        el.click(); return true;
      }
    }
    return false;
  }, chapterName, chapterNum);

  if (!clicked) console.log(`  [WARN] Chapter "${chapterName}" not found in TOC`);
  return clicked;
}

// ─── CLICK NEXT PAGE ─────────────────────────────────────────────────────────

async function clickNext(page) {
  const clicked = await page.evaluate(() => {
    for (const btn of document.querySelectorAll("button[aria-label]")) {
      if (btn.getAttribute("aria-label") === "Next") { btn.click(); return true; }
    }
    return false;
  });
  if (!clicked) await page.keyboard.press("ArrowRight");
}

// ─── YUZU BOOK READER ─────────────────────────────────────────────────────────

async function readYuzuBook(source, profileIndex) {
  const label    = `YUZU-${profileIndex + 1}`;
  const chapters = source.chapters || [source.chapter].filter(Boolean);
  console.log(`\n  [${label}] Book: "${source.bookTitle}"`);
  console.log(`  [${label}] Chapters: ${chapters.join(", ")}`);

  const browser = await puppeteer.launch({
    ...launchOptions,
    args: [
      ...launchOptions.args,
      `--user-data-dir=C:\\Temp\\puppeteer-yuzu-${profileIndex}`,
    ],
  });

  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    window.chrome = { runtime: {} };
  });

  // Grant clipboard permissions
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://reader.yuzu.com", ["clipboard-read", "clipboard-write"]);

  // Go directly to book via VBID
  const readerUrl = source.vbid
    ? `https://reader.yuzu.com/reader/books/${source.vbid}`
    : `https://reader.yuzu.com/home/my-library`;

  console.log(`  [${label}] Opening: ${readerUrl}`);
  await page.goto(readerUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(5000);

  // Wait for login if needed
  if (page.url().includes("sign-in") || page.url().includes("#sign") || page.url().includes("login")) {
    console.log(`  [${label}] Not logged in — sign into Yuzu in this window.`);
    await page.waitForFunction(
      () => location.href.includes("/reader/books/"),
      { timeout: 180000, polling: 2000 }
    );
    await sleep(5000);
  }

  // Wait for reader UI — page number input signals it's ready
  await page.waitForFunction(
    () => {
      for (const input of document.querySelectorAll("input")) {
        if (!isNaN(parseInt(input.value, 10)) && parseInt(input.value, 10) > 0) return true;
      }
      return false;
    },
    { timeout: 30000, polling: 1000 }
  ).catch(() => console.log(`  [${label}] Reader load wait timed out`));

  await sleep(3000);
  console.log(`  [${label}] Reader loaded.`);

  for (const chapterName of chapters) {
    console.log(`\n  [${label}] → ${chapterName}`);

    await openToc(page);
    const clicked = await clickChapterInToc(page, chapterName);
    if (clicked) {
      console.log(`  [${label}] Chapter clicked in TOC`);
      await sleep(4000);
    } else {
      console.log(`  [${label}] Reading from current position`);
      await sleep(1000);
    }

    const maxPages      = source.maxPagesPerChapter || 20;
    let lastText        = "";
    let lastPageNum     = null;
    let emptyStreak     = 0;
    let duplicateStreak = 0;

    for (let offset = 0; offset < maxPages; offset++) {
      await sleep(3000);

      const pageNum = await getPageNumber(page);
      console.log(`  [${label}] Offset ${offset + 1}: page=${pageNum ?? "?"}`);

      // Stuck check
      if (pageNum && pageNum === lastPageNum && offset > 1) {
        console.log(`  [${label}] Page number stuck — stopping.`);
        break;
      }
      lastPageNum = pageNum;

      let text = await copyPageText(page);
      console.log(`  [${label}] Copied ${text.length} chars`);

      if (text.length > 200) {
        if (text === lastText) {
          duplicateStreak++;
          if (duplicateStreak >= 2) {
            console.log(`  [${label}] Duplicate text — chapter ended. Stopping.`);
            break;
          }
        } else {
          duplicateStreak = 0;
        }
        lastText    = text;
        emptyStreak = 0;

        SOURCE_TEXT_STORE.push({
          bookTitle:       source.bookTitle,
          author:          source.author,
          authorLastFirst: source.authorLastFirst,
          date:            source.date,
          publisher:       source.publisher || "",
          chapter:         chapterName,
          page:            pageNum ?? (offset + 1),
          text,
        });
        console.log(`  [${label}] Stored p.${pageNum ?? offset + 1}`);
      } else {
        emptyStreak++;
        console.warn(`  [${label}] Low text (${text.length} chars) — streak: ${emptyStreak}`);
        if (emptyStreak >= 3) {
          console.log(`  [${label}] 3 low-text pages — stopping.`);
          break;
        }
      }

      await clickNext(page);
    }
  }

  const stored = SOURCE_TEXT_STORE.filter(e => e.bookTitle === source.bookTitle);
  console.log(`\n  [${label}] Done. ${stored.length} pages stored.`);
  if (!stored.length) {
    console.error(`  [${label}] No text captured — clipboard may not have worked.`);
    console.error(`  [${label}] Make sure Chrome has clipboard permissions for reader.yuzu.com`);
  }
  await browser.close();
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
  const seen = new Set(), refs = [];
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
  const bookEntries    = SOURCE_TEXT_STORE.filter(e => assignment.sources.some(s => s.bookTitle === e.bookTitle));
  const manualEntries  = SOURCE_TEXT_STORE.filter(e => e.isManual);
  const allEntries     = [...bookEntries, ...manualEntries];
  const sourceBlock    = buildSourceBlock(allEntries);
  const referenceList  = buildReferenceList(allEntries.map(e => ({ bookTitle: e.bookTitle, authorLastFirst: e.authorLastFirst, date: e.date, publisher: e.publisher || "" })));

  return `You are completing an assignment using exact text pulled word for word from textbooks.
Use these passages as your ONLY citation sources.
You have been given every page of the chapter. Read all of them, decide which pages contain
the most relevant content for each part of the assignment, and cite only those pages.
You do NOT need to cite every page — choose the most useful ones.

${"=".repeat(55)}
ASSIGNMENT DIRECTIONS:
${"=".repeat(55)}
${assignment.directions.trim()}

${"=".repeat(55)}
SOURCE TEXT — WORD FOR WORD FROM TEXTBOOKS:
${"=".repeat(55)}
${sourceBlock}

${"=".repeat(55)}
REFERENCE LIST:
${"=".repeat(55)}
${referenceList}

${"=".repeat(55)}
APA 7TH EDITION CITATION RULES — FOLLOW EVERY ONE:
${"=".repeat(55)}

━━ THE ONLY ALLOWED PARENTHETICAL FORMAT ━━━━━━━━━━━━━━━━
  Author (date) verb "word for word text" (p. #).

CORRECT:
  Ramlal (2023) explains "vocabulary relates to the understanding a student demonstrates" (p. 20).
  Annenberg Learner (n.d.) notes "students become engaged whenever they are using their senses" (p. 24).

WRONG — NEVER DO THESE:
  WRONG: "text" (Author, date, p. #).     ← author/date go in the SENTENCE not closing parens
  WRONG: "Text starts capital" (p. #).    ← capital first word must be pulled out
  WRONG: "text." (p. #).                  ← period inside quotes
  WRONG: such as "text" (p. #).           ← filler word before quote

━━ RULE 1 — AUTHOR INTRODUCES THE QUOTE ━━━━━━━━━━━━━━━━
Author (date) verb "word for word text" (p. #).
NEVER put author and date inside the closing parentheses alongside the page number.
WRONG: "text" (Ramlal, 2023, p. 20).
RIGHT: Ramlal (2023) explains "text" (p. 20).

━━ RULE 2 — FIRST WORD OF QUOTE ━━━━━━━━━━━━━━━━━━━━━━━━
If the source starts with a capital letter, pull that first word OUT of the quotes,
lowercase it, blend into the sentence. Quote opens on the second word.

SOURCE: Students become engaged whenever they are using their senses
RIGHT:  Annenberg Learner (n.d.) notes that students "become engaged whenever they are using their senses" (p. 24).
WRONG:  Annenberg Learner (n.d.) notes "Students become engaged..." (p. 24).

If source already starts lowercase — quote it directly.
SOURCE: vocabulary relates to the understanding
RIGHT:  Ramlal (2023) states "vocabulary relates to the understanding a student demonstrates" (p. 20).

━━ RULE 3 — PERIOD PLACEMENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━
Period goes AFTER the closing (p. #) — NEVER inside the quotes.
RIGHT: Ramlal (2023) notes "text here" (p. 23).
WRONG: Ramlal (2023) notes "text here." (p. 23).

━━ RULE 4 — EVERY QUOTE NEEDS A CITATION ━━━━━━━━━━━━━━━
Every quoted phrase must be followed immediately by (p. #).
A quote with nothing after it is always wrong — drop it and write a plain sentence.

━━ RULE 5 — NO FILLER WORDS BEFORE OPENING QUOTE ━━━━━━━
WRONG: such as "text" (p. #).
WRONG: like "text" (p. #).
WRONG: called "text" (p. #).
RIGHT: Ramlal (2023) states "text" (p. #).
A word pulled OUT of the source text before the quote is CORRECT — that is the intended format.

━━ RULE 6 — NO UNCITED QUOTED TERMS ━━━━━━━━━━━━━━━━━━━━
NEVER put quotes around a term or phrase without (p. #) after it.
WRONG: this is called "guided discovery" in science.
RIGHT: this is called guided discovery in science.

━━ RULE 7 — DO NOT MIX SOURCES ━━━━━━━━━━━━━━━━━━━━━━━━━
Only cite text from the source it actually came from.
Annenberg Learner text → cite as Annenberg Learner (n.d.)
Ramlal text → cite as Ramlal (2023)

━━ NARRATIVE CITATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  According to Ramlal (2023), from Chapter 3 on page 20, ...
  As Annenberg Learner (n.d.) explains on page 25, ...

Chapter and page go NATURALLY in the sentence — NEVER inside the parentheses.
WRONG: Ramlal (2023, Chapter 3, p. 20) states...
RIGHT: According to Ramlal (2023), from Chapter 3 on page 20, ...

━━ IF IN DOUBT — drop the citation and write a plain sentence.

Complete the assignment. Add a References section at the end.`;
}

// ─── GEMINI UTILITIES ─────────────────────────────────────────────────────────

async function openGeminiBrowser(profileName, label) {
  const browser = await puppeteer.launch({
    ...launchOptions,
    args: [...launchOptions.args, `--user-data-dir=C:\\Temp\\puppeteer-${profileName}`],
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { Object.defineProperty(navigator, "webdriver", { get: () => false }); window.chrome = { runtime: {} }; });
  await page.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
  console.log(`  [${label}] window open.`);
  return { browser, page };
}

async function findInput(page, label) {
  for (const sel of ['rich-textarea div[contenteditable="true"]', 'div[contenteditable="true"]', 'div[role="textbox"]', 'textarea']) {
    try { const el = await page.$(sel); if (el && (await el.boundingBox())?.width > 0) return { el, sel }; } catch (_) {}
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
    el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true }));
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
  if (!text) console.warn(`  [${label}] Empty response`); else console.log(`  [${label}] ${text.length} chars`);
  return text;
}

// ─── CITATION SCANNER ─────────────────────────────────────────────────────────

function scanCitations(text) {
  const v = []; let m;

  // Rule 1a — period inside closing quote WITH citation after
  const r1a = /"([^"]+?)\."\s*\((?:[^)]+)\)/g;
  while ((m = r1a.exec(text)) !== null)
    v.push({ rule: 1, bad: m[0], detail: "Period inside closing quote — must go AFTER the closing (p. #)." });

  // Rule 1b — period inside closing quote with NO citation after
  const r1b = /"([^"]{5,}?)\."\s*(?!\s*\()/g;
  while ((m = r1b.exec(text)) !== null)
    v.push({ rule: 1, bad: m[0].trim(), detail: "Period inside closing quote AND no citation after it — remove entirely, write plain sentence." });

  // Rule 2 — empty quotes
  const r2 = /""\s*\([^)]*\)/g;
  while ((m = r2.exec(text)) !== null)
    v.push({ rule: 2, bad: m[0], detail: "Empty quotes — drop and write your own sentence." });

  // Rule 3 — WRONG FORMAT: "text" (Author, date, p. #)
  const r3 = /"([^"]{3,}?)"\s*\([A-Z][^,)]+,\s*(?:n\.d\.|[12][09]\d\d),\s*(?:p\.|pp\.)\s*\d+\)/g;
  while ((m = r3.exec(text)) !== null)
    v.push({ rule: 3, bad: m[0], detail: `WRONG FORMAT — author/date inside closing parens. Correct: Author (date) verb "text" (p. #).` });

  // Rule 4 — filler connector before opening quote
  for (const f of ["such as", "like", "known as", "called", "termed", "referred to as", "of"]) {
    const re = new RegExp(`\\b${f}\\s+"([^"]{3,}?)"\\s*\\(`, "gi");
    while ((m = re.exec(text)) !== null)
      v.push({ rule: 4, bad: m[0].trim(), detail: `Filler connector "${f}" before opening quote — rewrite as Author (date) verb "text" (p. #).` });
  }

  // Rule 5 — chapter/page inside narrative citation parens
  const r5 = /([A-Z][a-zA-Z\s,&.]+?)\s*\((\d{4}|n\.d\.?)\s*,\s*(?:Chapter|Ch\.?|p\.)\s*[\d\w]+[^)]*\)/g;
  while ((m = r5.exec(text)) !== null)
    v.push({ rule: 5, bad: m[0], detail: "Chapter/page inside parentheses — write in the sentence naturally." });

  // Rule 6 — narrative citation missing chapter/page
  const r6 = /(?:According to|As noted by|As stated by|As explained by)\s+([^(]+?)\s*\(([^)]+)\)\s*,/gi;
  while ((m = r6.exec(text)) !== null) {
    const after = text.substring(m.index + m[0].length, m.index + m[0].length + 300).toLowerCase();
    if (!after.match(/\b(chapter|section|page|p\.|on page)\b/))
      v.push({ rule: 6, bad: m[0].trim(), detail: "Narrative citation missing chapter/page in the sentence." });
  }

  // Rule 7 — capital first word inside opening quote
  const r7cap = /(?:states|notes|explains|writes|argues|suggests|reports|observes)\s+"([A-Z][a-zA-Z']{2,})\s+([^"]{3,}?)"\s*\(/g;
  while ((m = r7cap.exec(text)) !== null)
    v.push({ rule: 7, bad: `"${m[1]} ${m[2]}"`, detail: `Opening quote starts on capital "${m[1]}" — pull out and lowercase into sentence: ${m[1].toLowerCase()} "${m[2]}..." (p. #).` });

  // Rule 8 — quoted phrase with no citation at all
  const r8 = /"([^"]{2,60})"\s*(?!\s*\()/g;
  const hasVerb = /\b(is|are|was|were|has|have|must|should|will|can|does|do|shows|states|notes|explains|suggests)\b/;
  while ((m = r8.exec(text)) !== null)
    if (!hasVerb.test(m[1].toLowerCase()) && m[1].length < 60)
      v.push({ rule: 8, bad: m[0].trim(), detail: "Quoted phrase has no citation after it — add (p. #) or remove quotes and write plainly." });

  return v;
}

function buildEvidenceReport(violations) {
  if (!violations.length) return null;
  return `Scanner found ${violations.length} violation(s):\n\n` +
    violations.map((v, i) => `VIOLATION ${i + 1} — Rule ${v.rule}\nWrong: ${v.bad}\nWhy:   ${v.detail}`).join("\n\n");
}

// ─── REVIEWER PROMPT ──────────────────────────────────────────────────────────

const buildReviewerPrompt = (assignment, evidence) => `You are a strict APA 7th Edition citation reviewer enforcing ONE specific citation format.

${evidence ? `Scanner found violations:\n\n${evidence}` : "Scanner found nothing. Do a thorough manual check."}

THE ONLY CORRECT PARENTHETICAL FORMAT IS:
  Author (date) verb "word for word text" (p. #).
  Example: Ramlal (2023) explains "vocabulary relates to the understanding" (p. 20).
  Example: Annenberg Learner (n.d.) notes "students become engaged" (p. 24).

VIOLATIONS TO FLAG:
1. "text" (Author, date, p. #). — WRONG. Author/date must introduce the quote in the sentence.
   Fix: rewrite as Author (date) verb "text" (p. #).
2. Period inside closing quote: "text." (p. #). — WRONG. Fix: "text" (p. #).
3. Quote with no (p. #) after it. Fix: add (p. #) or drop the quote, write plain sentence.
4. Capital letter as first word inside opening quote. Fix: pull first word out, lowercase, blend into sentence.
5. Empty or shell quotes: "" (p. #). Fix: drop and write plain sentence.
6. Chapter/page inside narrative parens: Author (2023, Chapter 3) — WRONG.
   Fix: According to Author (2023), from Chapter 3 on page #, ...
7. Filler connector before opening quote: such as "text" — WRONG.
   Fix: Author (date) verb "text" (p. #).
8. Citing Ramlal for Annenberg Learner text or vice versa — sources must not be mixed.

For each violation: quote the exact wrong text, state the rule broken, state the fix.

End with exactly: OVERALL RESULT: PASS  or  OVERALL RESULT: FAIL

Assignment:
---
${assignment}
---`;

function buildCorrectionPrompt(feedback, violations) {
  let p = "Fix every citation violation now.\n\n";
  violations.forEach((v, i) => {
    p += `${i + 1}. WRONG: ${v.bad}\n   WHY: ${v.detail}\n   FIX: Rewrite using correct format or drop and write plain sentence.\n\n`;
  });
  p += `Reviewer said:\n${feedback}\n\n`;
  p += `THE ONLY CORRECT FORMAT:\n`;
  p += `  Author (date) verb "word for word text" (p. #).\n\n`;
  p += `CORRECT EXAMPLES:\n`;
  p += `  Ramlal (2023) explains "vocabulary relates to the understanding a student demonstrates" (p. 20).\n`;
  p += `  Annenberg Learner (n.d.) notes "students become engaged whenever they are using their senses" (p. 24).\n\n`;
  p += `NEVER: "text" (Author, date, p. #). ← author/date do NOT go in closing parens.\n`;
  p += `NEVER: "Capital first word..." (p. #). ← pull capital word out, lowercase it, blend into sentence.\n`;
  p += `FIRST WORD RULE: SOURCE: Students become engaged → RIGHT: ...that students "become engaged" (p. 24).\n`;
  p += `PERIOD: always AFTER the closing (p. #) — never inside the quotes.\n\n`;
  p += `Rewrite the full assignment now with every violation fixed.`;
  return p;
}

// ─── DIRECTIONS CHECKER ───────────────────────────────────────────────────────

function buildDirectionsCheckerPrompt(assignment, directions) {
  return `You are checking if a completed assignment covers every requirement in the directions.
Do NOT check citations — only CONTENT coverage.

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

Keep every existing citation exactly as it is. Only add the missing content.
Rewrite the full assignment with the missing points included.`;
}

const FOLLOWUP_PROMPTS = [
  `Review every citation in your assignment. The ONLY correct format is:
  Author (date) verb "word for word text" (p. #).
  Example: Ramlal (2023) explains "vocabulary relates to the understanding" (p. 20).

  Fix anything that does not match:
  - "text" (Author, date, p. #) is WRONG — rewrite as Author (date) verb "text" (p. #).
  - If the first word inside the opening quote is capitalized — pull it out and blend into the sentence.
  - Period must be AFTER the closing (p. #) never inside the quotes.
  - Every quote must have (p. #) immediately after it.
  - Do NOT cite Ramlal text with Annenberg Learner or vice versa.`,

  `Final check — scan every single quoted phrase:
  1. Does it follow: Author (date) verb "text" (p. #)? If not, fix it.
  2. Is the first word inside the quote capitalized? Pull it out, lowercase it, blend into sentence.
  3. Is the period inside the closing quote? Move it outside.
  4. Is there any "text" (Author, date, p. #)? Rewrite as Author (date) verb "text" (p. #).
  5. Are sources mixed? Fix it.
  If unsure — drop the citation and write a plain sentence.`,
];

// ─── RUN ONE ASSIGNMENT ───────────────────────────────────────────────────────

async function runAssignment(num, assignment, workerPage, reviewerPage, checkerPage) {
  console.log("\n" + "=".repeat(60) + `\n  ASSIGNMENT ${num}\n` + "=".repeat(60));

  const bookEntries   = SOURCE_TEXT_STORE.filter(e => assignment.sources.some(s => s.bookTitle === e.bookTitle));
  const manualEntries = SOURCE_TEXT_STORE.filter(e => e.isManual);
  console.log(`\n  Book pages: ${bookEntries.length}   Manual passages: ${manualEntries.length}`);

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
      violations.forEach((v, i) => console.log(`    ${i + 1}. Rule ${v.rule} — ${v.bad.substring(0, 80)}`));
      await sendMessage(reviewerPage, buildReviewerPrompt(lastResponse, buildEvidenceReport(violations)), "CITATION REVIEWER");
      const feedback = await waitForResponse(reviewerPage, "CITATION REVIEWER");
      console.log(`\n  REVIEWER:\n  ` + feedback.split("\n").join("\n  "));
      if (feedback.includes("OVERALL RESULT: PASS") && !feedback.includes("OVERALL RESULT: FAIL")) {
        console.log(`\n  Round ${round} PASSED.\n`); approved = true;
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
    await sendMessage(checkerPage, buildDirectionsCheckerPrompt(lastResponse, assignment.directions), "DIRECTIONS CHECKER");
    const cf = await waitForResponse(checkerPage, "DIRECTIONS CHECKER");
    console.log(`\n  CHECKER:\n  ` + cf.split("\n").join("\n  "));

    if (cf.includes("DIRECTIONS RESULT: PASS")) {
      console.log(`\n  Directions PASSED.\n`); dirApproved = true;
    } else if (cf.includes("DIRECTIONS RESULT: FAIL")) {
      await sendMessage(workerPage, buildDirectionsRewritePrompt(cf), "WORKER");
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
      if (dirAttempt >= 4) { console.log(`  No verdict — moving on.`); dirApproved = true; }
      else {
        await sendMessage(checkerPage, `End your response with exactly one of:\nDIRECTIONS RESULT: PASS\nor\nDIRECTIONS RESULT: FAIL`, "DIRECTIONS CHECKER");
        const reminder = await waitForResponse(checkerPage, "DIRECTIONS CHECKER");
        if (reminder.includes("DIRECTIONS RESULT: PASS")) dirApproved = true;
        else if (reminder.includes("DIRECTIONS RESULT: FAIL")) {
          await sendMessage(workerPage, buildDirectionsRewritePrompt(reminder), "WORKER");
          lastResponse = await waitForResponse(workerPage, "WORKER");
        }
        await sleep(2000);
      }
    }
  }

  console.log(`\n${"=".repeat(60)}\n  ASSIGNMENT ${num} COMPLETE — copy from Worker window.\n${"=".repeat(60)}\n`);
  return lastResponse;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log("=".repeat(60) + "\n  GEMINI PIPELINE\n" + "=".repeat(60));
  console.log(`  ${ASSIGNMENTS.length} assignment(s) queued.\n`);

  console.log("STEP 1 — Reading source text...\n");
  let yuzuIndex = 0;
  for (let ai = 0; ai < ASSIGNMENTS.length; ai++) {
    const a = ASSIGNMENTS[ai];
    if (a.manualText?.trim()) parseManualText(a.manualText, ai);
    for (const source of a.sources) await readYuzuBook(source, yuzuIndex++);
  }

  console.log(`\n${SOURCE_TEXT_STORE.length} total pages stored:`);
  SOURCE_TEXT_STORE.forEach(e => console.log(`  ${e.bookTitle} — ${e.chapter} — p.${e.page} — ${e.text.length} chars`));

  // Print captured text so you can verify
  console.log("\n" + "=".repeat(60) + "\n  CAPTURED TEXT — verify before proceeding\n" + "=".repeat(60));
  SOURCE_TEXT_STORE.forEach((e, i) => {
    console.log(`\n[${ i + 1}] ${e.bookTitle} | ${e.chapter} | p.${e.page}`);
    console.log("─".repeat(60));
    console.log(e.text.substring(0, 600));
    if (e.text.length > 600) console.log(`  ... [${e.text.length - 600} more chars]`);
  });
  console.log("\n" + "=".repeat(60) + "\n");

  console.log("STEP 2 — Opening Gemini windows...\n");
  const { browser: wB, page: workerPage }   = await openGeminiBrowser("worker",   "WORKER");
  const { browser: rB, page: reviewerPage } = await openGeminiBrowser("reviewer", "CITATION REVIEWER");
  const { browser: cB, page: checkerPage }  = await openGeminiBrowser("checker",  "DIRECTIONS CHECKER");

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

  console.log("STEP 3 — Running assignments...\n");
  for (let i = 0; i < ASSIGNMENTS.length; i++) {
    await runAssignment(i + 1, ASSIGNMENTS[i], workerPage, reviewerPage, checkerPage);
    if (i < ASSIGNMENTS.length - 1) { console.log("Next in 5s...\n"); await sleep(5000); }
  }

  console.log("\n" + "=".repeat(60) + "\n  ALL COMPLETE\n" + "=".repeat(60) + "\n");
})();