import { useState } from 'react';
import { Download, Sparkles, Settings2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// ── helpers ────────────────────────────────────────────────────────────────
const injectOverrides = (html, ov) => {
  const vars = `
    <style id="__overrides__">
      :root {
        --ov-bg:          ${ov.bgColor};
        --ov-text:        ${ov.textColor};
        --ov-primary:     ${ov.primaryColor};
        --ov-heading:     ${ov.headingColor};
        --ov-link:        ${ov.linkColor};
        --ov-table-head:  ${ov.tableHeaderBg};
      }
      body          { background: var(--ov-bg)      !important; color: var(--ov-text)    !important; font-size: ${ov.fontSize}px !important; line-height: ${ov.lineHeight} !important; }
      h1,h2,h3,h4   { color: var(--ov-heading)      !important; }
      a             { color: var(--ov-link)          !important; }
      thead tr      { background: var(--ov-table-head) !important; }
      section,article,
      .section      { padding: ${ov.sectionPadding}px !important; }
      ${ov.hideFeatures.map(f => `[data-feature="${f}"] { display:none !important; }`).join('\n')}
    </style>`;
  return html.replace('</head>', vars + '</head>');
};

// ── component ──────────────────────────────────────────────────────────────
export default function ReportBuilder() {
  const navigate = useNavigate();

  const [topic,   setTopic]   = useState('');
  const [prompt,  setPrompt]  = useState('');
  const [html,    setHtml]    = useState('');
  const [manifesto, setManifesto] = useState(null);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [ov, setOv] = useState({
    bgColor:       '#ffffff',
    textColor:     '#333333',
    primaryColor:  '#3498db',
    headingColor:  '#111111',
    linkColor:     '#3498db',
    tableHeaderBg: '#3498db',
    fontSize:      14,
    lineHeight:    1.6,
    sectionPadding:24,
    hideFeatures:  [],
  });

  const setOvKey = (k, v) => setOv(p => ({ ...p, [k]: v }));
  const toggleFeature = (f) =>
    setOvKey('hideFeatures', ov.hideFeatures.includes(f)
      ? ov.hideFeatures.filter(x => x !== f)
      : [...ov.hideFeatures, f]);

  // ── generate ──
  const handleGenerate = async () => {
    if (!topic) return alert('Please enter a topic');
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/generate-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, userPrompt: prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Show API key errors prominently
        setError({ code: data.code, message: data.error });
        return;
      }
      setHtml(data.html);
      setManifesto(data.styleManifesto);
      // seed overrides from what the AI chose
      const c = data.styleManifesto?.colors ?? {};
      const t = data.styleManifesto?.typography ?? {};
      setOv({
        bgColor:       c.bg            ?? '#ffffff',
        textColor:     c.text          ?? '#333333',
        primaryColor:  c.primary       ?? '#3498db',
        headingColor:  c.heading       ?? '#111111',
        linkColor:     c.link          ?? '#3498db',
        tableHeaderBg: c.tableHeader   ?? '#3498db',
        fontSize:      t.baseSize      ?? 14,
        lineHeight:    t.lineHeight    ?? 1.6,
        sectionPadding:t.sectionPadding ?? 24,
        hideFeatures:  [],
      });
    } catch (err) {
      setError({ code: 'NETWORK_ERROR', message: 'Could not reach the backend. Is server.js running on port 3000?' });
    } finally {
      setLoading(false);
    }
  };

  // ── download ──
  const handleDownloadPdf = async () => {
    const finalHtml = injectOverrides(html, ov);
    const res = await fetch('http://localhost:3000/api/render-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: finalHtml, styleManifesto: manifesto }),
    });
    const blob = await res.blob();
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'report.pdf';
    a.click();
  };

  // open full editor, passing html + overrides via router state
  const openEditor = () =>
    navigate('/editor', { state: { html, manifesto, ov } });

  const previewSrc = html
    ? injectOverrides(html, ov)
    : '<body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#aaa">Preview will appear here</body>';

  const features = manifesto?.featuresUsed ?? [];

  // ── styles ──
  const panel  = { background:'#12121f', borderRadius:12, padding:'18px 20px', marginBottom:14, border:'1px solid #1e1e32' };
  const label  = { fontSize:'0.8rem', color:'#aaa', display:'block', marginBottom:4 };
  const row    = { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #1e1e32' };
  const inp    = { background:'#1a1a2e', border:'1px solid #333', borderRadius:6, padding:'8px 10px', color:'#ddd', fontSize:'0.85rem', width:'100%', boxSizing:'border-box' };
  const btn    = (active) => ({ padding:'5px 12px', borderRadius:16, border:`1px solid ${active?'#7c6fff':'#333'}`, background:active?'#7c6fff':'#1a1a2e', color:active?'#fff':'#666', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 });
  const accent = '#7c6fff';

  const ColorRow = ({ label: lbl, k }) => (
    <div style={row}>
      <span style={{ fontSize:'0.83rem', color:'#bbb' }}>{lbl}</span>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontFamily:'monospace', fontSize:'0.75rem', color:'#555' }}>{ov[k].toUpperCase()}</span>
        <input type="color" value={ov[k]} onChange={e => setOvKey(k, e.target.value)}
          style={{ width:30, height:30, border:'2px solid #333', borderRadius:6, cursor:'pointer', padding:2, background:'none' }} />
      </div>
    </div>
  );

  const SliderRow = ({ label: lbl, k, min, max, step=1, unit='' }) => (
    <div style={{ padding:'7px 0', borderBottom:'1px solid #1e1e32' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:'0.83rem', color:'#bbb' }}>{lbl}</span>
        <span style={{ fontFamily:'monospace', fontSize:'0.75rem', color:'#555' }}>{ov[k]}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={ov[k]} onChange={e => setOvKey(k, Number(e.target.value))}
        style={{ width:'100%', accentColor:accent }} />
    </div>
  );

  return (
    <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', height:'100vh', background:'#0d0d1a', color:'#eee', fontFamily:'system-ui,sans-serif', overflow:'hidden' }}>

      {/* ── LEFT SIDEBAR ── */}
      <div style={{ overflowY:'auto', padding:'20px 16px', borderRight:'1px solid #1e1e32' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <h2 style={{ margin:0, fontSize:'1.1rem', fontWeight:800, background:`linear-gradient(135deg,${accent},#48dbfb)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Report Builder
          </h2>
          <Link to="/matrix" style={{ fontSize:'0.75rem', color:'#555', textDecoration:'none' }}>Style Matrix →</Link>
        </div>

        {/* Topic + Prompt */}
        <div style={panel}>
          <label style={label}>Report Topic</label>
          <input style={{ ...inp, marginBottom:10 }} placeholder="e.g. Climate Change 2025" value={topic} onChange={e => setTopic(e.target.value)} />
          <label style={label}>Style Instructions</label>
          <textarea style={{ ...inp, minHeight:80, resize:'vertical' }}
            placeholder="e.g. Use two columns, striped tables, a dark header..."
            value={prompt} onChange={e => setPrompt(e.target.value)} />
          {error && (
            <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 8, background: '#1a0a0a', border: '1px solid #c0392b' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e74c3c', marginBottom: 4 }}>
                {error.code === 'API_KEY_LEAKED'  && '🔑 API Key Leaked'}
                {error.code === 'API_KEY_EXPIRED' && '🔑 API Key Expired'}
                {error.code === 'API_KEY_INVALID' && '🔑 API Key Invalid'}
                {error.code === 'PARSE_ERROR'     && '⚠️ AI Response Error'}
                {error.code === 'NETWORK_ERROR'   && '🔌 Connection Error'}
                {error.code === 'SERVER_ERROR'    && '⚠️ Server Error'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#aaa', lineHeight: 1.5 }}>{error.message}</div>
              {['API_KEY_LEAKED','API_KEY_EXPIRED','API_KEY_INVALID'].includes(error.code) && (
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                  style={{ display: 'inline-block', marginTop: 6, fontSize: '0.78rem', color: '#7c6fff' }}>
                  → Get a new API key at Google AI Studio
                </a>
              )}
            </div>
          )}
          <button onClick={handleGenerate} disabled={loading} style={{
            marginTop:12, width:'100%', padding:'10px', borderRadius:8, border:'none',
            background:loading?'#333':`linear-gradient(135deg,${accent},#48dbfb)`,
            color:'white', fontWeight:700, fontSize:'0.9rem', cursor:loading?'not-allowed':'pointer'
          }}>
            {loading ? 'Generating…' : '✦ Generate Report'}
          </button>
        </div>

        {/* Only show panels once AI has responded */}
        {manifesto && (<>

          {/* Features Used */}
          <div style={panel}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#555', marginBottom:10 }}>
              Features Used — toggle to hide
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {features.length ? features.map(f => (
                <button key={f} onClick={() => toggleFeature(f)} style={btn(!ov.hideFeatures.includes(f))}>
                  {f}
                </button>
              )) : <span style={{ fontSize:'0.8rem', color:'#444' }}>None reported by AI</span>}
            </div>
          </div>

          {/* Color Overrides */}
          <div style={panel}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#555', marginBottom:8 }}>
              Colors
            </div>
            <ColorRow label="Page Background"   k="bgColor" />
            <ColorRow label="Body Text"          k="textColor" />
            <ColorRow label="Primary / Accent"   k="primaryColor" />
            <ColorRow label="Headings"           k="headingColor" />
            <ColorRow label="Links"              k="linkColor" />
            <ColorRow label="Table Header"       k="tableHeaderBg" />
          </div>

          {/* Sliders */}
          <div style={panel}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#555', marginBottom:8 }}>
              Spacing & Typography
            </div>
            <SliderRow label="Base Font Size"    k="fontSize"       min={10} max={22} unit="px" />
            <SliderRow label="Line Height"       k="lineHeight"     min={1.0} max={2.5} step={0.05} />
            <SliderRow label="Section Padding"   k="sectionPadding" min={8} max={60} unit="px" />
          </div>

          {/* Actions */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <button onClick={openEditor} style={{ padding:'10px', borderRadius:8, border:`1px solid ${accent}`, background:'transparent', color:accent, fontWeight:700, fontSize:'0.85rem', cursor:'pointer' }}>
              ✏️ Open Editor
            </button>
            <button onClick={handleDownloadPdf} style={{ padding:'10px', borderRadius:8, border:'none', background:'#27ae60', color:'white', fontWeight:700, fontSize:'0.85rem', cursor:'pointer' }}>
              ⬇ Download PDF
            </button>
          </div>
        </>)}
      </div>

      {/* ── PREVIEW ── */}
      <div style={{ position:'relative', overflow:'hidden' }}>
        {loading && (
          <div style={{ position:'absolute', inset:0, background:'rgba(13,13,26,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, flexDirection:'column', gap:12 }}>
            <div style={{ width:40, height:40, border:`3px solid ${accent}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
            <span style={{ color:'#aaa', fontSize:'0.85rem' }}>Building your report…</span>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
        <iframe
          srcDoc={previewSrc}
          style={{ width:'100%', height:'100%', border:'none', display:'block' }}
          title="Report Preview"
        />
      </div>
    </div>
  );
}