import puppeteer from "puppeteer";
import path from "path"
import { fileURLToPath } from "url";
import {writeFile, appendFile} from "fs/promises"

// ╔══════════════════════════════════════════════════════════════════╗
// ║  pipeline.js  —  run with:  node pipeline.js                    ║
// ║                                                                  ║
// ║  WHAT IT DOES:                                                   ║
// ║  1. Opens Yuzu, navigates to each chapter, copies text per page ║
// ║  2. Prints every captured page to terminal with page number      ║
// ║  3. Opens 3 Gemini windows: Worker, Citation Reviewer, Checker  ║
// ║  4. Worker writes assignment using source text + citation rules  ║
// ║  5. Citation Reviewer checks and corrects format until PASS      ║
// ║  6. Directions Checker verifies all assignment points covered    ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── CONFIGURATION ────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log(__dirname)

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";


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

      Include a 200-300 word summary with APA 7th Edition citations from the sources provided.
    `,

    sources: [
      {
        bookTitle: "Literacy in Elementary Education, Grades 3-6",
        author:          "Ramlal",
        authorLastFirst: "Ramlal, S. R.",
        date:            "2023",
        publisher:       "Cognella Academic Publishing",
        vbid:            "826802A",          // from reader.yuzu.com/reader/books/826802A
        chapters:        ["Chapter 3"],
        maxPagesPerChapter: 16,
      },
    ],

    // ── MANUAL TEXT (optional — leave as "" to skip) ─────────────────────────
    manualText: `
---
AUTHOR: Annenberg Learner
DATE: n.d.
PAGE: 24
CHAPTER: does not have one
SECTION: does not have one
EXACT TEXT:
Case Studies in Science Education. Elsa — K. Teacher Profile: Name | Elsa. Experience | 15 years. Grade & Subject(s) | Two half-day kindergarten classes; all subjects. Classroom Demographics | Bilingual classroom. School | Elementary school in an urban district. Science Teaching | 2 days/week for 30 minutes. Curriculum | Specified by district. Module 1 - Introducing the Case. Elsa believes that for many children, what happens in kindergarten affects students' feelings about and learning in school for the rest of their lives. She is beginning to ask questions of herself and rethink her approach to teaching science. Knowing that her students become engaged whenever they are using their senses to explore objects and phenomena,
---
---
AUTHOR: Annenberg Learner
DATE: n.d.
PAGE: 25
CHAPTER: does not have one
SECTION: does not have one
EXACT TEXT:
Elsa wants to build upon her students' natural inclination to learn by making their own discoveries. She hopes to extend this type of learning to meaningful expressions of students' understandings. Module 2 - Trying New Ideas. Jeff Winokur, an early childhood science educator at Wheelock College, has observed in his teaching practice that young students cherish playing with materials and that this fascination can be put to use to help them make scientific discoveries. During students' discovery of magnets, Elsa takes a guided discovery approach by getting students to work with a partner as she circulates through the classroom, helping them move toward making specific discoveries.
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
Module 3 - Reflecting and Building on Change. As the year progresses, Elsa is convinced that science has become her students' favorite activity period. As part of her final science unit, Elsa invites her students to mix food coloring in water to find out what happens. Elsa is learning that with discovery activities, even though a scientific concept is not necessarily being discovered, her students are making their own discoveries and beginning to build new knowledge.
---
    `,
  },

  // ── ADD MORE ASSIGNMENTS BELOW ────────────────────────────────────────────
  // {
  //   directions: `...`,
  //   sources: [{ bookTitle: "...", author: "...", authorLastFirst: "...", date: "...", publisher: "...", vbid: "...", chapters: ["Chapter 1"], maxPagesPerChapter: 15 }],
  //   manualText: "",
  // },
];

// ── INTERNALS — do not edit below ────────────────────────────────────────────

const SOURCE_TEXT_STORE = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const BASE_ARGS = [
  "--no-sandbox", "--disable-setuid-sandbox",
  "--disable-blink-features=AutomationControlled",
  "--start-maximized",
];

function makeBrowser(profileSuffix, extra = []) {
  return puppeteer.launch({
    headless: false,
    executablePath: CHROME,
    slowMo: 50,
    args: [...BASE_ARGS, `--user-data-dir=C:\\Temp\\pup-${profileSuffix}`, ...extra],
    defaultViewport: null,
    ignoreDefaultArgs: ["--enable-automation"],
  });
}

// ── PAGE NUMBER — read from main Yuzu DOM ─────────────────────────────────────
// The iframe content is cross-origin but the page number is always in the
// main DOM: <input value="22">, aria-valuetext="Page 22", or tooltip text
async function getPageNum(page) {
  return page.evaluate(() => {
    // 1. The Go-to-Page input at the bottom bar
    for (const inp of document.querySelectorAll("input")) {
      const v = parseInt(inp.value, 10);
      console.log(typeof(v))
      if (!isNaN(v) && v > 0 && v < 5000) return v;
    }
    // 2. The progress slider: aria-valuetext="Page 22"
    const slider = document.querySelector("[aria-valuetext]");
    if (slider) {
      const m = (slider.getAttribute("aria-valuetext") || "").match(/(\d+)/);
      if (m) return parseInt(m[1], 10);
    }
    return null;
  });
}

// ── COPY PAGE TEXT via Ctrl+A / Ctrl+C ───────────────────────────────────────
// Yuzu book content is inside a cross-origin jigsaw.yuzu.com iframe.
// DOM access is blocked by same-origin policy.
// Keyboard select-all + copy works across iframe boundaries — same approach
// a human uses when they highlight text and press Copy.
async function copyText(page) {
  // Click in the centre of the book reading pane to focus it
  await page.mouse.click(700, 300);
  await sleep(700);
  await page.keyboard.down("Control");
  await page.keyboard.press("a");
  await page.keyboard.up("Control");
  await sleep(500);
  await page.keyboard.down("Control");
  await page.keyboard.press("c");
  await page.keyboard.up("Control");
  await sleep(500);

  const raw = await page.evaluate(async () => {
    try { return await navigator.clipboard.readText(); } catch { return ""; }
  });

  // Strip Yuzu UI chrome strings that get selected alongside book text
  const uiNoise = [
    "Book Page Loaded", "Skip to main content", "Skip to book navigation",
    "Table of Contents", "Search across book", "Reader Preferences",
    "Highlights, Notes, Bookmarks, and Flashcards", "More Options",
    "Previous", "Next", "Bookmark page", "Go to Page", "Go to First Page",
    "Open/Close Margin", "More book options", "Back",
  ];
  let text = raw;
  for (const s of uiNoise) text = text.split(s).join("");
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

// ── NEXT PAGE ─────────────────────────────────────────────────────────────────
async function nextPage(page) {
  const ok = await page.evaluate(() => {
    for (const btn of document.querySelectorAll("button[aria-label]")) {
      if (btn.getAttribute("aria-label") === "Next") { btn.click(); return true; }
    }
    return false;
  });
  if (!ok) await page.keyboard.press("ArrowRight");
}

// ── OPEN TOC & CLICK CHAPTER ──────────────────────────────────────────────────
async function gotoChapter(page, chapterName) {
  // Open the TOC panel
  await page.evaluate(() => {
    for (const btn of document.querySelectorAll("button[aria-label]")) {
      if (btn.getAttribute("aria-label") === "Table of Contents") { btn.click(); return; }
    }
  });
  await sleep(2000);

  const chapNum = (chapterName.match(/\d+/) || [""])[0];
  const clicked = await page.evaluate((name, num) => {
    // TOC buttons: aria-label="Go to Chapter 3 Comprehension, page 20"
    for (const btn of document.querySelectorAll("button[aria-label]")) {
      const lbl = (btn.getAttribute("aria-label") || "").toLowerCase();
      if (lbl.startsWith("go to") && num && lbl.includes("chapter " + num)) {
        btn.click(); return true;
      }
    }
    // Fallback: match by span text inside button
    for (const btn of document.querySelectorAll("button")) {
      const t = (btn.innerText || "").toLowerCase();
      if (t.includes(name.toLowerCase())) { btn.click(); return true; }
    }
    return false;
  }, chapterName, chapNum);

  if (clicked) {
    await sleep(4000);
    console.log(`    → Navigated to ${chapterName}`);
  } else {
    console.log(`    → Chapter not found in TOC — reading from current position`);
  }
}

// ── READ ONE BOOK FROM YUZU ───────────────────────────────────────────────────
async function readYuzuBook(source, idx) {
  const tag = `YUZU${idx + 1}`;
  const chapters = source.chapters || [source.chapter].filter(Boolean);
  console.log(`\n[${tag}] Opening "${source.bookTitle}"`);

  const browser = await makeBrowser(`yuzu${idx}`);
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    window.chrome = { runtime: {} };
  });

  // Grant clipboard access
  await browser.defaultBrowserContext()
    .overridePermissions("https://reader.yuzu.com", ["clipboard-read", "clipboard-write"]);

  const url = source.vbid
    ? `https://reader.yuzu.com/reader/books/${source.vbid}`
    : "https://reader.yuzu.com/home/my-library";

  console.log(`[${tag}] Navigating to ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(6000);

  // Handle sign-in redirect
  if (!page.url().includes("/reader/books/")) {
    console.log(`[${tag}] Not at book — waiting for sign-in or library navigation...`);
    console.log(`[${tag}] Sign into Yuzu in the browser window that just opened.`);
    await page.waitForFunction(
      () => location.href.includes("/reader/books/"),
      { timeout: 300000, polling: 2000 }
    ).catch(() => console.log(`[${tag}] Timeout waiting for reader — continuing`));
    await sleep(5000);
  }

  // Wait for page number input to appear (signals reader is fully loaded)
  await page.waitForFunction(
    () => {
      for (const inp of document.querySelectorAll("input")) {
        const v = parseInt(inp.value, 10);
        if (!isNaN(v) && v > 0) return true;
      }
      return false;
    },
    { timeout: 30000, polling: 1000 }
  ).catch(() => console.log(`[${tag}] Reader load wait timed out`));

  await sleep(3000);
  console.log(`[${tag}] Reader loaded. Starting chapter reading...`);

  for (const chapterName of chapters) {
    console.log(`\n[${tag}] Chapter: ${chapterName}`);
    await gotoChapter(page, chapterName);

    const max = source.maxPagesPerChapter || 20;
    let prevText = "";
    let prevPage = null;
    let emptyRun = 0;
    let dupRun = 0;

    await writeFile(path.join(__dirname, `${chapterName} of ${chapters}.txt`), "")

    for (let i = 0; i < max; i++) {
      await sleep(2800);
      const pn = await getPageNum(page);
      const text = await copyText(page);

      console.log(`  [${tag}] Page ${pn ?? "?"}: ${text.length} chars`);

      console.log(text)

      await appendFile(path.join(__dirname, `${chapterName} of ${chapters}.txt`), `\n${text}`)

      // Stuck detection
      if (pn && pn === prevPage && i > 1) {
        console.log(`  [${tag}] Page number unchanged — stopping.`); break;
      }
      prevPage = pn;

      if (text.length > 150) {
        if (text === prevText) {
          if (++dupRun >= 2) { console.log(`  [${tag}] Duplicate — chapter ended. Stopping.`); break; }
        } else { dupRun = 0; }
        prevText = text;
        emptyRun = 0;

        SOURCE_TEXT_STORE.push({
          bookTitle: source.bookTitle, author: source.author,
          authorLastFirst: source.authorLastFirst, date: source.date,
          publisher: source.publisher || "", chapter: chapterName,
          page: pn ?? i + 1, text,
        });
      } else {
        if (++emptyRun >= 3) { console.log(`  [${tag}] 3 empty pages — stopping.`); break; }
      }
      await nextPage(page);
    }
  }

  const n = SOURCE_TEXT_STORE.filter(e => e.bookTitle === source.bookTitle).length;
  console.log(`\n[${tag}] Done — ${n} page(s) stored from "${source.bookTitle}"`);
  await browser.close();
}

// ── PARSE MANUAL TEXT BLOCKS ──────────────────────────────────────────────────
function parseManual(manualText, assignIdx) {
  if (!manualText?.trim()) return;
  let added = 0;
  for (const block of manualText.split(/^---\s*$/m).filter(b => b.trim())) {
    const g = (k) => { const m = block.match(new RegExp(`^${k}:\\s*(.+)$`, "im")); return m ? m[1].trim() : ""; };
    const author = g("AUTHOR"), date = g("DATE"), pageRaw = g("PAGE");
    const chapter = g("CHAPTER"), section = g("SECTION");
    const em = block.match(/EXACT TEXT:\s*([\s\S]+)/i);
    const text = em ? em[1].trim() : "";
    if (text.length < 30) continue;
    const chapLabel =
      chapter && !chapter.toLowerCase().includes("does not") ? chapter :
      section && !section.toLowerCase().includes("does not") ? section : "n/a";
    SOURCE_TEXT_STORE.push({
      bookTitle: `Manual — ${author}`, author: author.split(" ").pop(),
      authorLastFirst: author, date, publisher: "", chapter: chapLabel,
      page: parseInt(pageRaw, 10) || pageRaw, text, isManual: true,
    });
    added++;
  }
  if (added) console.log(`  [MANUAL] ${added} passage(s) loaded for assignment ${assignIdx + 1}`);
}

// ── PRINT ALL CAPTURED TEXT TO TERMINAL ──────────────────────────────────────
function printCapturedText() {
  console.log("\n" + "█".repeat(62));
  console.log("  CAPTURED SOURCE TEXT — verify before assignment starts");
  console.log("█".repeat(62));
  SOURCE_TEXT_STORE.forEach((e, i) => {
    console.log(`\n${"─".repeat(62)}`);
    console.log(`  [${i + 1}]  ${e.bookTitle}`);
    console.log(`  Chapter : ${e.chapter}`);
    console.log(`  Page    : ${e.page}`);
    console.log(`  Author  : ${e.authorLastFirst} (${e.date})`);
    console.log(`${"─".repeat(62)}`);
    const preview = e.text.length > 900 ? e.text.substring(0, 900) + `\n  ...[${e.text.length - 900} more chars]` : e.text;
    console.log(preview);
  });
  console.log("\n" + "█".repeat(62) + "\n");
}

// ── BUILD SOURCE BLOCK FOR PROMPT ─────────────────────────────────────────────
function sourceBlock(entries) {
  if (!entries.length) return "No source text was provided.";
  return entries.map(e => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOURCE PASSAGE
Book:    ${e.bookTitle}
Author:  ${e.authorLastFirst} (${e.date})
Chapter: ${e.chapter}
Page:    p. ${e.page}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${e.text}`.trim()).join("\n\n");
}

function refList(entries) {
  const seen = new Set(), out = [];
  for (const e of entries) {
    const k = `${e.bookTitle}|${e.date}`;
    if (!seen.has(k)) {
      seen.add(k);
      out.push(`${e.authorLastFirst} (${e.date}). *${e.bookTitle}*${e.publisher ? ". " + e.publisher : ""}.`);
    }
  }
  return out.join("\n");
}

// ── FIRST PROMPT TO WORKER ────────────────────────────────────────────────────
function firstPrompt(assignment) {
  const bookEntries   = SOURCE_TEXT_STORE.filter(e => assignment.sources.some(s => s.bookTitle === e.bookTitle));
  const manualEntries = SOURCE_TEXT_STORE.filter(e => e.isManual);
  const all = [...bookEntries, ...manualEntries];

  return `You are completing an academic assignment. Use ONLY the source passages below for citations.

${"=".repeat(58)}
ASSIGNMENT DIRECTIONS:
${"=".repeat(58)}
${assignment.directions.trim()}

${"=".repeat(58)}
SOURCE TEXT (cite only from these — word for word):
${"=".repeat(58)}
${sourceBlock(all)}

${"=".repeat(58)}
REFERENCE LIST:
${"=".repeat(58)}
${refList(all)}

${"=".repeat(58)}
CITATION RULES — READ EVERY RULE CAREFULLY:
${"=".repeat(58)}

╔═══════════════════════════════════════════════════════╗
║  THE ONLY CORRECT CITATION FORMAT IS:                 ║
║                                                       ║
║  Author (date) verb "word for word text" (p. #).      ║
╚═══════════════════════════════════════════════════════╝

CORRECT EXAMPLES — study these:
  Ramlal (2023) explains "vocabulary relates to the understanding a student demonstrates" (p. 20).
  Annenberg Learner (n.d.) notes "students become engaged whenever they are using their senses" (p. 24).
  Ramlal (2023) states "read-alouds to develop vocabulary, promote student-led discussions" (p. 23).

ALSO CORRECT — narrative form that mentions chapter/page/section:
  According to Ramlal (2023), in Chapter 3 on page 23, teaching a balance of skills and strategies
  is important to promote growth in reading.

  As Annenberg Learner (n.d.) observes on page 26, students' understandings are reinforced
  when worksheets are shared with family members.

══ RULE 1 — ONE FORMAT ONLY ════════════════════════════
Use: Author (date) verb "exact text" (p. #).
Author name + date come BEFORE the quote in the sentence.
(p. #) comes immediately AFTER the closing quote.

BANNED FORMATS — never use these:
  ✗ "text" (Author, date, p. #).       ← author/date must NOT go in closing parens
  ✗ (Author, date, p. #) alone         ← parenthetical-only citation
  ✗ text (Author, date)                ← no page number

══ RULE 2 — FIRST WORD OF QUOTE ═══════════════════════
When the source text starts with a capital letter:
  • Pull that first word OUT of the quotes
  • Lowercase it and blend it naturally into your sentence
  • The opening quote starts on the SECOND word

SOURCE TEXT starts: "Students become engaged whenever they are using their senses"
CORRECT: ...that students "become engaged whenever they are using their senses" (p. 24).
                   ↑ "Students" pulled out, lowercased to "students", blended in

SOURCE TEXT starts: "Elsa believes that when students take their worksheets home"
CORRECT: ...that Elsa believes "that when students take their worksheets home" (p. 26).

If source already starts lowercase — no change needed. Quote it directly.

══ RULE 3 — PERIOD PLACEMENT ══════════════════════════
Period goes AFTER the closing (p. #). NEVER inside the quotes.
  CORRECT: ...notes "students become engaged" (p. 24).
  WRONG:   ...notes "students become engaged." (p. 24).

══ RULE 4 — EVERY QUOTE NEEDS A CITATION ══════════════
Every quoted phrase must be followed immediately by (p. #).
A floating quote with no (p. #) after it is always wrong.

══ RULE 5 — DO NOT MIX SOURCES ════════════════════════
Annenberg Learner text → cite as Annenberg Learner (n.d.)
Ramlal text → cite as Ramlal (2023)
Never cite Ramlal for Annenberg text or vice versa.

══ RULE 6 — NO FILLER CONNECTORS ══════════════════════
No connector words between your sentence and the opening quote:
  WRONG: the teacher uses such as "guided discovery" (p. 25).
  CORRECT: Annenberg Learner (n.d.) describes "guided discovery" (p. 25).

══ RULE 7 — NARRATIVE CITATIONS ═══════════════════════
For narrative citations you MUST mention chapter OR page OR section naturally:
  According to Ramlal (2023), in Chapter 3 on page 23, ...
  As noted by Annenberg Learner (n.d.) on page 26, ...
  Ramlal (2023) discusses in Chapter 3 ...

Chapter/page/section go IN THE SENTENCE — never inside the parentheses:
  WRONG:  Ramlal (2023, Chapter 3, p. 23) states...
  CORRECT: Ramlal (2023) explains in Chapter 3 on page 23 that...

══ RULE 8 — BALANCE PARENTHETICAL AND NARRATIVE ═══════
Use a mix of both citation styles throughout:
  • Parenthetical: Author (date) verb "text" (p. #).
  • Narrative: According to Author (date), on page #, [paraphrase or text].
Aim for roughly half and half.

══ IF IN DOUBT — drop the citation and write a plain sentence. ═

Complete the assignment now following ALL rules above.
Add a References section at the end.`;
}

// ── GEMINI BROWSER HELPERS ────────────────────────────────────────────────────
async function openGemini(profile, label) {
  const browser = await makeBrowser(profile);
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    window.chrome = { runtime: {} };
  });
  await page.goto("https://gemini.google.com/app", { waitUntil: "domcontentloaded", timeout: 60000 });
  console.log(`  [${label}] window opened`);
  return { browser, page };
}

async function getInput(page, label) {
  for (const sel of [
    'rich-textarea div[contenteditable="true"]',
    'div[contenteditable="true"]',
    'div[role="textbox"]',
    'textarea',
  ]) {
    try {
      const el = await page.$(sel);
      if (el && (await el.boundingBox())?.width > 0) return { el, sel };
    } catch (_) {}
  }
  throw new Error(`[${label}] Could not find input box`);
}

async function send(page, text, label) {
  const { el, sel } = await getInput(page, label);
  await el.click(); await sleep(300);
  await page.keyboard.down("Control"); await page.keyboard.press("a"); await page.keyboard.up("Control");
  await page.keyboard.press("Backspace"); await sleep(150);
  const ok = await page.evaluate((t, s) => {
    const el = document.querySelector(s); if (!el) return false;
    el.focus(); return document.execCommand("insertText", false, t);
  }, text, sel);
  if (!ok) await page.evaluate((t, s) => {
    const el = document.querySelector(s); if (!el) return; el.focus();
    if (el.contentEditable === "true") el.innerText = t;
    else Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(el, t);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, text, sel);
  await sleep(400);
  const btn = await page.$('button[aria-label="Send message"],button[aria-label="Submit"],button[jsname="Qx7uuf"]');
  if (btn) await btn.click(); else await page.keyboard.press("Enter");
  await sleep(1800);
}

async function waitReply(page, label, ms = 300000) {
  console.log(`  [${label}] waiting...`);
  try {
    await page.waitForFunction(
      () => !!document.querySelector('[aria-label="Stop generating"],[aria-label="Stop response"]'),
      { timeout: 18000, polling: 400 }
    );
  } catch (_) {}
  await page.waitForFunction(
    () => !document.querySelector('[aria-label="Stop generating"],[aria-label="Stop response"]'),
    { timeout: ms, polling: 1000 }
  ).catch(() => {});
  await sleep(3000);
  const t = await page.evaluate(() => {
    const all = [
      ...document.querySelectorAll("model-response"),
      ...document.querySelectorAll('[data-message-author-role="model"]'),
      ...document.querySelectorAll(".model-response-text"),
      ...document.querySelectorAll("message-content"),
    ];
    return all.length ? all[all.length - 1].innerText.trim() : "";
  });
  if (!t) console.warn(`  [${label}] empty response`);
  else console.log(`  [${label}] ${t.length} chars received`);
  return t;
}

// ── CITATION SCANNER ──────────────────────────────────────────────────────────
function scan(text) {
  const v = []; let m;

  // Wrong format: "text" (Author, date, p.#) — author in closing parens
  const rWrong = /"([^"]{3,150})"\s*\([A-Z][^,)]{1,40},\s*(?:n\.d\.?|[12]\d{3}),\s*(?:p\.|pp\.)\s*\d+\)/g;
  while ((m = rWrong.exec(text)) !== null)
    v.push({ rule: "W", bad: m[0], detail: 'WRONG FORMAT "text" (Author, date, p.#) — rewrite as: Author (date) verb "text" (p.#).' });

  // Period inside closing quote
  const r1 = /"([^"]{4,}?)\."\s*\(/g;
  while ((m = r1.exec(text)) !== null)
    v.push({ rule: 1, bad: m[0], detail: "Period inside closing quote — move period after (p.#)." });

  // Empty quotes
  const r2 = /""\s*\([^)]*\)/g;
  while ((m = r2.exec(text)) !== null)
    v.push({ rule: 2, bad: m[0], detail: "Empty quotes." });

  // Filler connector before opening quote
  for (const f of ["such as", "like", "known as", "called", "termed", "referred to as"]) {
    const re = new RegExp(`\\b${f}\\s+"[^"]{3,}"\\s*\\(`, "gi");
    while ((m = re.exec(text)) !== null)
      v.push({ rule: 3, bad: m[0].trim(), detail: `Filler connector "${f}" directly before opening quote.` });
  }

  // Chapter/page inside narrative parens
  const r4 = /\w[^(]{0,30}\((?:n\.d\.?|[12]\d{3})\s*,\s*(?:Chapter|p\.|pp\.|Section)/g;
  while ((m = r4.exec(text)) !== null)
    v.push({ rule: 4, bad: m[0].trim(), detail: "Chapter/page inside parentheses — move to sentence." });

  // Quoted phrase with no (p.#) after it
  const r5 = /"([^"]{4,80})"\s*(?!\s*\()/g;
  const verbRe = /\b(is|are|was|were|has|have|must|should|will|can|does|do|shows|states|notes|explains|observes)\b/;
  while ((m = r5.exec(text)) !== null)
    if (!verbRe.test(m[1].toLowerCase()))
      v.push({ rule: 5, bad: m[0].trim(), detail: "Quoted phrase has no (p.#) citation after it." });

  return v;
}

function evidenceReport(violations) {
  if (!violations.length) return null;
  return violations.map((v, i) =>
    `VIOLATION ${i + 1} — Rule ${v.rule}\nWrong text: ${v.bad}\nWhy: ${v.detail}`
  ).join("\n\n");
}

// ── REVIEWER PROMPT ───────────────────────────────────────────────────────────
function reviewerPrompt(assignment, evidence) {
  return `You are a strict APA 7th Edition citation reviewer.

${evidence ? `The scanner found these violations — confirm each and find any others:\n\n${evidence}` : "The scanner found nothing. Do a careful manual check."}

THE ONLY CORRECT FORMAT:
  Author (date) verb "word for word text" (p. #).
  OR narrative: According to Author (date), on page #, [paraphrase or text].

VIOLATIONS TO FIND AND FIX:
1. "text" (Author, date, p.#) — WRONG FORMAT. Author must introduce quote in the sentence.
   Fix: Author (date) verb "text" (p.#).
2. Period inside closing quote before (p.#). Fix: move period after (p.#).
3. Quote with no (p.#) after it at all. Fix: add page or drop quote.
4. Capital first word inside opening quote. Fix: pull out, lowercase, blend into sentence.
   SOURCE: "Students become engaged..."  CORRECT: ...that students "become engaged..." (p.24).
5. Filler connector (such as, like, called) immediately before opening quote.
6. Author, date crammed inside closing parens with page: (Author, 2023, p.#). Always wrong.
7. Source mixing — Ramlal text cited as Annenberg Learner or vice versa.
8. Narrative citation with no chapter/page mentioned in the sentence.

For every violation: quote the exact wrong text, state rule broken, state the correct rewrite.

End with ONE of these as the very last line of your response:
OVERALL RESULT: PASS
OVERALL RESULT: FAIL

Assignment to review:
---
${assignment}
---`;
}

// ── CORRECTION PROMPT ─────────────────────────────────────────────────────────
function correctionPrompt(feedback, violations) {
  let p = "Fix every citation violation listed below. Rewrite the FULL assignment.\n\n";
  if (violations.length) {
    p += "SCANNER FOUND:\n";
    violations.forEach((v, i) => {
      p += `${i + 1}. WRONG: ${v.bad}\n   FIX: ${v.detail}\n\n`;
    });
  }
  p += `REVIEWER SAID:\n${feedback}\n\n`;
  p += `CORRECT FORMAT REMINDER:\n`;
  p += `  Author (date) verb "exact text from source" (p. #).\n`;
  p += `  Ramlal (2023) explains "vocabulary relates to the understanding" (p. 20).\n`;
  p += `  Annenberg Learner (n.d.) notes "students become engaged whenever they are using their senses" (p. 24).\n\n`;
  p += `FIRST-WORD RULE: if source starts with capital — pull first word out, lowercase it, blend in:\n`;
  p += `  SOURCE: "Students become engaged..."  →  ...that students "become engaged..." (p. 24).\n\n`;
  p += `NEVER: "text" (Author, date, p.#). NEVER: period inside closing quote.\n\n`;
  p += `Rewrite the complete assignment now.`;
  return p;
}

// ── FOLLOWUP PROMPTS (citation polish rounds) ─────────────────────────────────
const FOLLOWUPS = [
  `Review every single citation in your assignment against this rule:
THE ONLY CORRECT FORMATs: Author (date) verb "exact text" (p. #).
Example: Ramlal (2023) explains "vocabulary relates to the understanding" (p. 20).
Example: Annenberg Learner (n.d.) notes "students become engaged whenever" (p. 24).
Ex: words to fether in "text" (Author, date, p.#).


Fix capital first word inside quotes: pull it out and lowercase it.
Fix period inside closing quote: move it after (p.#).
Also add at least two NARRATIVE citations in the form:
  According to Author (date), on page #, [your sentence here].
  As Author (date) explains in Chapter X on page #, [your sentence here].`,

  `Final citation polish:
1. Any "text" (Author, date, p.#) format left? Rewrite as Author (date) verb "text" (p.#).
2. Any capital first word inside opening quote? Pull out and lowercase.
3. Any period inside closing quote? Move after (p.#).
4. Every quoted phrase has a (p.#) after it?
5. At least two narrative citations present that mention page or chapter?
6. No source mixing (Ramlal text cited as Annenberg or vice versa)?
Rewrite the full assignment with every issue fixed.`,
];

// ── DIRECTIONS CHECKER PROMPT ─────────────────────────────────────────────────
function checkerPrompt(assignment, directions) {
  return `You are checking whether a completed assignment fully covers all requirements in the directions.
Do NOT check citations or formatting — check CONTENT COVERAGE ONLY.

${"=".repeat(52)}
ASSIGNMENT DIRECTIONS:
${"=".repeat(52)}
${directions.trim()}

${"=".repeat(52)}
COMPLETED ASSIGNMENT:
${"=".repeat(52)}
${assignment}

${"=".repeat(52)}
YOUR TASK:
${"=".repeat(52)}
Go through each numbered requirement in the directions.
For each one write EXACTLY:

POINT: [copy the requirement word for word]
STATUS: COVERED
REASON: [one sentence saying where/how it is covered]

OR:

POINT: [copy the requirement word for word]
STATUS: MISSING
REASON: [one sentence saying what is absent]

Check EVERY numbered point. Do not skip any.

After checking all points, end your response with EXACTLY one of these
two lines — this must be the VERY LAST LINE of your response:

DIRECTIONS RESULT: PASS
DIRECTIONS RESULT: FAIL

Rules:
- PASS only if every single point is COVERED.
- FAIL if even one point is MISSING.
- Do not add any text after the DIRECTIONS RESULT line.
- Do not offer to rewrite anything.`;
}

function rewritePrompt(checkerFeedback) {
  return `Your assignment is missing required content. Add what is missing now.

Directions checker feedback:
${checkerFeedback}

Keep every existing citation exactly as it is — do not change citation text.
Only add the missing content.
Rewrite the complete assignment with every missing point covered.`;
}

// ── WAIT FOR GEMINI INPUT TO BE READY ────────────────────────────────────────
async function waitForInput(page, label) {
  await page.waitForFunction(
    () => !!document.querySelector(
      'rich-textarea div[contenteditable="true"], div[contenteditable="true"], textarea'
    ),
    { timeout: 30000, polling: 1000 }
  ).catch(() => console.warn(`  [${label}] input wait timed out`));
}

// ── RUN ONE ASSIGNMENT ────────────────────────────────────────────────────────
async function runAssignment(num, assignment, wPage, rPage, cPage) {
  console.log("\n" + "▓".repeat(62) + `\n  ASSIGNMENT ${num}\n` + "▓".repeat(62));

  // Round 0 — send everything to worker
  await send(wPage, firstPrompt(assignment), "WORKER");
  let last = await waitReply(wPage, "WORKER");

  // Citation rounds
  for (let ri = 0; ri < FOLLOWUPS.length; ri++) {
    console.log(`\n${"─".repeat(62)}\n  CITATION ROUND ${ri + 1}\n${"─".repeat(62)}`);
    let done = false, att = 0;
    while (!done) {
      att++;
      console.log(`  Attempt ${att}`);
      if (att === 1) { await send(wPage, FOLLOWUPS[ri], "WORKER"); last = await waitReply(wPage, "WORKER"); }
      const violations = scan(last);
      console.log(`  [SCAN] ${violations.length ? violations.length + " issue(s) found" : "clean"}`);
      violations.forEach((v, i) => console.log(`    ${i + 1}. Rule ${v.rule}: ${v.bad.substring(0, 70)}`));
      await send(rPage, reviewerPrompt(last, evidenceReport(violations)), "REVIEWER");
      const fb = await waitReply(rPage, "REVIEWER");
      console.log("\n  REVIEWER:\n  " + fb.split("\n").join("\n  "));
      if (fb.includes("OVERALL RESULT: PASS") && !fb.includes("OVERALL RESULT: FAIL")) {
        console.log(`\n  Round ${ri + 1} PASSED\n`); done = true;
      } else {
        console.log(`\n  Fixing violations...`);
        await send(wPage, correctionPrompt(fb, violations), "WORKER");
        last = await waitReply(wPage, "WORKER");
        await sleep(1500);
      }
    }
    await sleep(1500);
  }

  // Directions check
  console.log(`\n${"─".repeat(62)}\n  DIRECTIONS CHECK\n${"─".repeat(62)}`);
  let dirDone = false, dirAtt = 0;
  while (!dirDone) {
    dirAtt++;
    console.log(`\n  Directions attempt ${dirAtt}`);
    await send(cPage, checkerPrompt(last, assignment.directions), "CHECKER");
    const cf = await waitReply(cPage, "CHECKER");
    console.log("\n  CHECKER:\n  " + cf.split("\n").join("\n  "));

    if (cf.includes("DIRECTIONS RESULT: PASS")) {
      console.log(`\n  Directions: PASS\n`);
      dirDone = true;

    } else if (cf.includes("DIRECTIONS RESULT: FAIL")) {
      console.log(`\n  Directions: FAIL — sending gaps to Worker`);
      await send(wPage, rewritePrompt(cf), "WORKER");
      last = await waitReply(wPage, "WORKER");
      // Re-check citations after rewrite
      const rv = scan(last);
      if (rv.length) {
        await send(rPage, reviewerPrompt(last, evidenceReport(rv)), "REVIEWER");
        const rf = await waitReply(rPage, "REVIEWER");
        if (!rf.includes("OVERALL RESULT: PASS")) {
          await send(wPage, correctionPrompt(rf, rv), "WORKER");
          last = await waitReply(wPage, "WORKER");
        }
      }
      await sleep(1500);

    } else {
      // No verdict found — send a direct reminder
      console.log(`  No verdict found — sending reminder to Checker`);
      if (dirAtt >= 5) {
        console.log(`  Checker gave no verdict after 5 attempts — moving on`);
        dirDone = true;
      } else {
        await send(
          cPage,
          `You must end your response with exactly one of these two lines:\n\nDIRECTIONS RESULT: PASS\n\nor\n\nDIRECTIONS RESULT: FAIL\n\nPlease re-read the assignment against the directions and give the verdict now.`,
          "CHECKER"
        );
        const rem = await waitReply(cPage, "CHECKER");
        console.log("  Reminder response: " + rem.substring(0, 200));
        if (rem.includes("DIRECTIONS RESULT: PASS")) {
          console.log(`\n  Directions: PASS\n`); dirDone = true;
        } else if (rem.includes("DIRECTIONS RESULT: FAIL")) {
          console.log(`\n  Directions: FAIL — fixing`);
          await send(wPage, rewritePrompt(rem), "WORKER");
          last = await waitReply(wPage, "WORKER");
        }
        await sleep(1500);
      }
    }
  }

  console.log(`\n${"▓".repeat(62)}\n  ASSIGNMENT ${num} COMPLETE — copy from the Worker window\n${"▓".repeat(62)}\n`);
  return last;
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log("▓".repeat(62));
  console.log("  PIPELINE — node pipeline.js");
  console.log("▓".repeat(62));
  console.log(`  ${ASSIGNMENTS.length} assignment(s) queued\n`);

  // ── STEP 1: Read all source text ──────────────────────────────────────────
  console.log("STEP 1 — Reading source text from Yuzu + manual blocks\n");
  let yuzuIdx = 0;
  for (let ai = 0; ai < ASSIGNMENTS.length; ai++) {
    const a = ASSIGNMENTS[ai];
    if (a.manualText?.trim()) parseManual(a.manualText, ai);
    for (const src of a.sources) await readYuzuBook(src, yuzuIdx++);
  }

  // Print everything captured to terminal
  printCapturedText();

  if (SOURCE_TEXT_STORE.length === 0) {
    console.error("ERROR: No source text was captured. Check Yuzu login and clipboard permissions.");
    process.exit(1);
  }

  // ── STEP 2: Open three Gemini windows ─────────────────────────────────────
  console.log("STEP 2 — Opening Gemini windows\n");
  const { browser: wB, page: wPage } = await openGemini("worker",   "WORKER");
  const { browser: rB, page: rPage } = await openGemini("reviewer", "REVIEWER");
  const { browser: cB, page: cPage } = await openGemini("checker",  "CHECKER");

  // Sign-in check
  const allPages = [wPage, rPage, cPage];
  if (allPages.some(p => p.url().includes("accounts.google.com"))) {
    console.log("\n  Sign into Google in ALL THREE Gemini windows.");
    console.log("  Waiting up to 3 minutes...");
    await Promise.all(allPages.map(p =>
      p.waitForFunction(() => location.href.includes("gemini.google.com"), { timeout: 180000, polling: 1000 })
    ));
    console.log("  All signed in.\n");
  }

  // Wait for input boxes to appear
  for (const [p, lbl] of [[wPage, "WORKER"], [rPage, "REVIEWER"], [cPage, "CHECKER"]]) {
    await waitForInput(p, lbl);
  }
  await sleep(2000);
  console.log("\nAll Gemini windows ready.\n");

  // ── STEP 3: Run each assignment ────────────────────────────────────────────
  console.log("STEP 3 — Running assignments\n");
  for (let i = 0; i < ASSIGNMENTS.length; i++) {
    await runAssignment(i + 1, ASSIGNMENTS[i], wPage, rPage, cPage);
    if (i < ASSIGNMENTS.length - 1) { console.log("  Next assignment in 5s...\n"); await sleep(5000); }
  }

  console.log("▓".repeat(62) + "\n  ALL DONE\n" + "▓".repeat(62) + "\n");
  // Browsers left open so you can copy from the Worker window
})();