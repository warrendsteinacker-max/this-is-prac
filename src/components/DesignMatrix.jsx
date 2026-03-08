import { useState } from 'react';
import { Link } from 'react-router-dom';

const matrixData = [
  // ── Layout & Structure ──────────────────────────────────────────────────
  { category: 'Layout & Structure',
    goal: 'Two-Column Layout',
    user: 'Splits content side-by-side like a magazine spread.',
    dev: 'column-count: 2; column-gap: 40px;' },
  { category: 'Layout & Structure',
    goal: 'Bento Grid',
    user: 'Dashboard-style boxes of different sizes on one page.',
    dev: 'display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;' },
  { category: 'Layout & Structure',
    goal: 'Sidebar + Content',
    user: 'Narrow panel on the left, main content on the right.',
    dev: 'display: grid; grid-template-columns: 220px 1fr; gap: 32px;' },
  { category: 'Layout & Structure',
    goal: 'Full-Width Banner',
    user: 'A section that stretches edge-to-edge across the page.',
    dev: 'width: 100vw; margin-left: calc(-1 * var(--page-margin));' },

  // ── Page Setup ──────────────────────────────────────────────────────────
  { category: 'Page Setup',
    goal: 'Page Size & Margin',
    user: 'Sets the physical paper size and white border around each page.',
    dev: '@page { size: A4; margin: 20mm; }' },
  { category: 'Page Setup',
    goal: 'Page-Specific Background',
    user: 'Assign a unique color or image to any individual page by ID.',
    dev: '#page-1 { background-image: url("cover.jpg"); background-size: cover; }' },
  { category: 'Page Setup',
    goal: 'Background Attachment',
    user: 'Locks a background image in place so it stays fixed while content scrolls.',
    dev: 'background-attachment: fixed;' },
  { category: 'Page Setup',
    goal: 'Landscape Orientation',
    user: 'Rotates the page sideways — useful for wide tables or charts.',
    dev: '@page { size: A4 landscape; }' },

  // ── Typography ──────────────────────────────────────────────────────────
  { category: 'Typography',
    goal: 'Visual Hierarchy',
    user: 'Scales headings so the most important ones stand out.',
    dev: 'h1 { font-size: 2.5rem; } h2 { font-size: 1.8rem; }' },
  { category: 'Typography',
    goal: 'Heading Underline',
    user: 'Adds a decorative line under section titles.',
    dev: 'h2 { border-bottom: 2px solid var(--primary); padding-bottom: 6px; }' },
  { category: 'Typography',
    goal: 'Drop Cap',
    user: 'Makes the first letter of a paragraph large and decorative.',
    dev: 'p:first-of-type::first-letter { font-size: 3em; float: left; line-height: 1; margin-right: 6px; }' },
  { category: 'Typography',
    goal: 'Balanced Title Wrapping',
    user: 'Prevents titles from awkwardly breaking onto a new line with one word.',
    dev: 'h1, h2 { text-wrap: balance; }' },
  { category: 'Typography',
    goal: 'Prevent Orphans & Widows',
    user: 'Stops a single line of text from being left alone at the top or bottom of a page.',
    dev: 'p { orphans: 3; widows: 3; }' },

  // ── Color & Branding ────────────────────────────────────────────────────
  { category: 'Color & Branding',
    goal: 'CSS Color Variables',
    user: 'Defines your brand colors once and applies them everywhere automatically.',
    dev: ':root { --primary: #3498db; --bg: #ffffff; --text: #333333; }' },
  { category: 'Color & Branding',
    goal: 'Gradient Header',
    user: 'Fades your brand color from solid to light across the page header.',
    dev: 'header { background: linear-gradient(135deg, var(--primary), #ffffff); }' },
  { category: 'Color & Branding',
    goal: 'Watermark',
    user: 'Places faint text (e.g. CONFIDENTIAL) diagonally behind the content.',
    dev: 'body::before { content: "CONFIDENTIAL"; position: fixed; opacity: 0.07; transform: rotate(-35deg); font-size: 5rem; top: 40%; left: 10%; pointer-events: none; }' },

  // ── Tables ──────────────────────────────────────────────────────────────
  { category: 'Tables',
    goal: 'Striped Rows',
    user: 'Alternates row background colors for easy reading.',
    dev: 'tbody tr:nth-child(even) { background: #f0f4f8; }' },
  { category: 'Tables',
    goal: 'Styled Header Row',
    user: 'Makes the top row bold with a brand-color background.',
    dev: 'thead tr { background: var(--primary); color: #fff; font-weight: 700; }' },
  { category: 'Tables',
    goal: 'Borderless Table',
    user: 'Removes all table grid lines for a modern, clean look.',
    dev: 'table { border-collapse: collapse; } td, th { border: none; padding: 10px 14px; }' },
  { category: 'Tables',
    goal: 'Column Widths',
    user: 'Sets each column to a specific percentage of the table width.',
    dev: 'col:nth-child(1) { width: 30%; } col:nth-child(2) { width: 50%; }' },
  { category: 'Tables',
    goal: 'Prevent Table Split',
    user: 'Keeps a table together — stops it from being cut between two pages.',
    dev: 'table { break-inside: avoid; }' },

  // ── Cards & Callouts ────────────────────────────────────────────────────
  { category: 'Cards & Callouts',
    goal: 'Callout Box',
    user: 'Colored highlight box with an accent border for tips or warnings.',
    dev: '.callout { background: #eef6ff; border-left: 4px solid var(--primary); border-radius: 6px; padding: 14px 18px; }' },
  { category: 'Cards & Callouts',
    goal: 'Content Card',
    user: 'A raised box with a shadow — great for KPIs or highlighted stats.',
    dev: '.card { background: #fff; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); padding: 20px; }' },
  { category: 'Cards & Callouts',
    goal: 'Section Box Shadow',
    user: 'Adds subtle depth around any section to make it pop off the page.',
    dev: '#section-1 { box-shadow: 0 4px 16px rgba(0,0,0,0.12); border-radius: 8px; padding: 24px; }' },
  { category: 'Cards & Callouts',
    goal: 'Quote Block',
    user: 'Styles a pull-quote with large decorative quotation marks.',
    dev: 'blockquote { font-size: 1.3rem; border-left: 5px solid var(--primary); padding-left: 20px; color: #555; }' },

  // ── PDF Print Engineering ───────────────────────────────────────────────
  { category: 'PDF Print Engineering',
    goal: 'Smart Page Breaks',
    user: 'Prevents a card or table being sliced in half across two pages.',
    dev: '.card, table, figure { break-inside: avoid; }' },
  { category: 'PDF Print Engineering',
    goal: 'Force New Page',
    user: 'Starts a specific section always at the top of a fresh page.',
    dev: '.chapter { break-before: page; }' },
  { category: 'PDF Print Engineering',
    goal: 'Page Numbers',
    user: 'Automatically inserts "Page X of Y" into every page footer.',
    dev: '@page { @bottom-center { content: "Page " counter(page) " of " counter(pages); } }' },
  { category: 'PDF Print Engineering',
    goal: 'Force Background Printing',
    user: 'Makes sure background colors and images actually show up in the PDF.',
    dev: '/* Puppeteer: printBackground: true */ -webkit-print-color-adjust: exact;' },
  { category: 'PDF Print Engineering',
    goal: 'White Space / Margins',
    user: 'Adds breathing room around the edges of every page.',
    dev: '@page { margin: 20mm; }' },

  // ── Graphics & SVG ──────────────────────────────────────────────────────
  { category: 'Graphics & SVG',
    goal: 'Inline SVG Icon',
    user: 'Draws a small icon or arrow directly in the document — no image files needed.',
    dev: '<svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="var(--primary)"/></svg>' },
  { category: 'Graphics & SVG',
    goal: 'SVG Flowchart',
    user: 'Draws a process diagram with boxes and arrows using pure code.',
    dev: '<svg><rect .../><line .../><text ...>Step 1</text></svg>' },
  { category: 'Graphics & SVG',
    goal: 'CSS Bar Chart',
    user: 'Creates a bar chart using only divs and widths — no chart library needed.',
    dev: '.bar { height: 20px; background: var(--primary); width: 65%; border-radius: 4px; }' },
  { category: 'Graphics & SVG',
    goal: 'Decorative Flourish',
    user: 'Adds a decorative line or symbol before/after a heading using pure CSS.',
    dev: 'h2::before { content: "▎"; color: var(--primary); margin-right: 8px; }' },
];

const categories = [...new Set(matrixData.map(d => d.category))];

const s = {
  page:     { minHeight: '100vh', background: '#0d0d1a', color: '#eee', fontFamily: 'system-ui,sans-serif', padding: '28px 24px' },
  inner:    { maxWidth: 960, margin: '0 auto' },
  panel:    { background: '#12121f', borderRadius: 12, padding: '16px 20px', border: '1px solid #1e1e32', marginBottom: 14 },
  tag:      (active, color) => ({ padding: '5px 13px', borderRadius: 16, border: `1px solid ${active ? color : '#252540'}`, background: active ? color : '#1a1a2e', color: active ? '#fff' : '#555', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' }),
  th:       { padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#555', borderBottom: '1px solid #1e1e32' },
  td:       { padding: '11px 14px', borderBottom: '1px solid #1a1a2e', fontSize: '0.85rem', verticalAlign: 'top' },
  catBadge: (color) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 10, background: color + '22', color, fontSize: '0.7rem', fontWeight: 700, marginBottom: 4 }),
};

const CAT_COLORS = {
  'Layout & Structure':    '#48dbfb',
  'Page Setup':            '#ffd32a',
  'Typography':            '#ff9f43',
  'Color & Branding':      '#7c6fff',
  'Tables':                '#26de81',
  'Cards & Callouts':      '#fd9644',
  'PDF Print Engineering': '#fc5c65',
  'Graphics & SVG':        '#45aaf2',
};

export default function DesignMatrix() {
  const [viewMode,    setViewMode]    = useState('user');
  const [activeCategories, setActiveCats] = useState(new Set(categories));
  const [search, setSearch] = useState('');

  const toggleCat = (cat) => {
    setActiveCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const filtered = matrixData.filter(d =>
    activeCategories.has(d.category) &&
    (d.goal.toLowerCase().includes(search.toLowerCase()) ||
     d.user.toLowerCase().includes(search.toLowerCase()) ||
     d.dev.toLowerCase().includes(search.toLowerCase()))
  );

  const accent = '#7c6fff';

  return (
    <div style={s.page}>
      <div style={s.inner}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, background: `linear-gradient(135deg,${accent},#48dbfb)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                PDF Design Matrix
              </h1>
              <p style={{ color: '#555', margin: '4px 0 0', fontSize: '0.85rem' }}>Every CSS & HTML technique available to the AI — {matrixData.length} entries across {categories.length} categories.</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: '← Report Builder', path: '/' },
                { label: 'Style Architect',  path: '/architect' },
                { label: 'PDF Editor',       path: '/editor' },
              ].map(({ label, path }) => (
                <Link key={path} to={path} style={{ padding: '6px 13px', borderRadius: 16, border: '1px solid #252540', background: '#1a1a2e', color: '#666', fontSize: '0.76rem', fontWeight: 600, textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt tip */}
        <div style={{ ...s.panel, borderLeft: `3px solid ${accent}` }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#555', marginBottom: 6 }}>How to prompt the AI</div>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#aaa', lineHeight: 1.6 }}>
            Be explicit about IDs and page structure. <span style={{ color: '#ccc' }}>Example: <em>"Generate a 3-page report. Use ID 'page-1' for the cover with a centered background image. Wrap the summary in a div with ID 'section-1' and apply a box-shadow for depth."</em></span> Referencing element IDs lets you style every page and section uniquely.
          </p>
        </div>

        {/* Controls */}
        <div style={{ ...s.panel, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* View toggle + search */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: '#1a1a2e', borderRadius: 20, padding: 3, border: '1px solid #252540' }}>
              {[['user','👤 User Friendly'], ['dev','</> CSS / HTML']].map(([mode, label]) => (
                <button key={mode} onClick={() => setViewMode(mode)} style={{
                  padding: '6px 16px', borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                  background: viewMode === mode ? accent : 'transparent',
                  color:      viewMode === mode ? '#fff' : '#555',
                }}>{label}</button>
              ))}
            </div>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search features…"
              style={{ flex: 1, minWidth: 180, background: '#1a1a2e', border: '1px solid #252540', borderRadius: 20, padding: '7px 14px', color: '#ccc', fontSize: '0.83rem', outline: 'none' }}
            />
            <span style={{ fontSize: '0.78rem', color: '#444' }}>{filtered.length} results</span>
          </div>

          {/* Category filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button onClick={() => setActiveCats(new Set(categories))} style={s.tag(activeCategories.size === categories.length, accent)}>All</button>
            {categories.map(cat => (
              <button key={cat} onClick={() => toggleCat(cat)} style={s.tag(activeCategories.has(cat), CAT_COLORS[cat] ?? accent)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ ...s.panel, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: '18%' }}>Category</th>
                <th style={{ ...s.th, width: '20%' }}>Design Goal</th>
                <th style={s.th}>{viewMode === 'user' ? 'How it works' : 'Implementation'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={3} style={{ ...s.td, textAlign: 'center', color: '#444', padding: '32px' }}>No results match your filters.</td></tr>
              )}
              {filtered.map((item, i) => (
                <tr key={i} style={{ background: i % 2 === 1 ? '#0f0f1c' : 'transparent' }}>
                  <td style={s.td}>
                    <span style={s.catBadge(CAT_COLORS[item.category] ?? accent)}>{item.category}</span>
                  </td>
                  <td style={{ ...s.td, fontWeight: 600, color: '#ddd' }}>{item.goal}</td>
                  <td style={{ ...s.td, fontFamily: viewMode === 'dev' ? 'monospace' : 'inherit', fontSize: viewMode === 'dev' ? '0.78rem' : '0.85rem', color: viewMode === 'dev' ? '#48dbfb' : '#aaa', whiteSpace: viewMode === 'dev' ? 'pre-wrap' : 'normal', wordBreak: 'break-word' }}>
                    {viewMode === 'user' ? item.user : item.dev}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}