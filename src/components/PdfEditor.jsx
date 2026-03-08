import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ── constants ──────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 7);

const NEW_ELEMENT_TEMPLATES = {
  heading:  () => `<h2 data-editable="true" data-id="${uid()}" style="color:inherit">New Heading</h2>`,
  paragraph:() => `<p  data-editable="true" data-id="${uid()}">New paragraph text goes here.</p>`,
  table:    () => `<table data-editable="true" data-id="${uid()}" style="width:100%;border-collapse:collapse">
    <thead><tr><th style="padding:8px;background:#3498db;color:#fff">Col 1</th><th style="padding:8px;background:#3498db;color:#fff">Col 2</th><th style="padding:8px;background:#3498db;color:#fff">Col 3</th></tr></thead>
    <tbody>
      <tr><td style="padding:8px;border:1px solid #ddd">A1</td><td style="padding:8px;border:1px solid #ddd">A2</td><td style="padding:8px;border:1px solid #ddd">A3</td></tr>
      <tr style="background:#f0f4f8"><td style="padding:8px;border:1px solid #ddd">B1</td><td style="padding:8px;border:1px solid #ddd">B2</td><td style="padding:8px;border:1px solid #ddd">B3</td></tr>
    </tbody>
  </table>`,
  callout:  () => `<aside data-editable="true" data-id="${uid()}" style="border-left:4px solid #3498db;background:#eef6ff;padding:14px 18px;border-radius:6px;margin:16px 0">
    <strong>💡 Note:</strong> Add your callout text here.
  </aside>`,
  divider:  () => `<hr data-id="${uid()}" style="border:none;border-top:2px solid #eee;margin:24px 0"/>`,
  card:     () => `<div data-editable="true" data-id="${uid()}" style="background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.08);padding:20px;margin:12px 0">
    <h3 style="margin:0 0 8px">Card Title</h3>
    <p style="margin:0;color:#666">Card description goes here.</p>
  </div>`,
};

// inject editor bridge script into the iframe HTML
const wrapWithBridge = (html) => {
  const bridge = `
<style>
  [data-editable]:hover   { outline: 2px dashed #7c6fff44; cursor:pointer; }
  [data-selected]         { outline: 2px solid #7c6fff !important; outline-offset:2px; }
  [data-drag-over]        { border-top: 3px solid #48dbfb !important; }
  body.drag-active *      { pointer-events:none; }
  body.drag-active [data-section] { pointer-events:auto; }
</style>
<script>
(function() {
  let dragSrc = null;

  function post(msg) { window.parent.postMessage(msg, '*'); }

  // click to select
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-editable]');
    document.querySelectorAll('[data-selected]').forEach(n => n.removeAttribute('data-selected'));
    if (el) {
      el.setAttribute('data-selected','');
      post({ type:'select', id: el.dataset.id, tag: el.tagName.toLowerCase(),
             styles: el.getAttribute('style')||'', text: el.innerText });
      e.stopPropagation();
    } else {
      post({ type:'deselect' });
    }
  });

  // double-click to edit text inline
  document.addEventListener('dblclick', e => {
    const el = e.target.closest('[data-editable]');
    if (!el) return;
    el.contentEditable = 'true';
    el.focus();
    post({ type:'editing', id: el.dataset.id });
  });

  document.addEventListener('blur', e => {
    const el = e.target.closest('[contenteditable]');
    if (!el) return;
    el.contentEditable = 'false';
    post({ type:'textChanged', id: el.dataset.id, html: el.innerHTML });
  }, true);

  // drag sections
  document.querySelectorAll('[data-section]').forEach(sec => {
    sec.draggable = true;
    sec.addEventListener('dragstart', e => {
      dragSrc = sec;
      document.body.classList.add('drag-active');
      e.dataTransfer.effectAllowed = 'move';
    });
    sec.addEventListener('dragover', e => { e.preventDefault(); sec.setAttribute('data-drag-over',''); });
    sec.addEventListener('dragleave', ()=> sec.removeAttribute('data-drag-over'));
    sec.addEventListener('drop', e => {
      e.preventDefault();
      sec.removeAttribute('data-drag-over');
      if (dragSrc && dragSrc !== sec) {
        sec.parentNode.insertBefore(dragSrc, sec);
        post({ type:'reorder', html: document.body.innerHTML });
      }
      document.body.classList.remove('drag-active');
    });
    sec.addEventListener('dragend', ()=> document.body.classList.remove('drag-active'));
  });

  // listen for commands from parent
  window.addEventListener('message', e => {
    const { type, id, style, html, where } = e.data || {};
    if (type === 'applyStyle' && id) {
      const el = document.querySelector('[data-id="'+id+'"]');
      if (el) { el.setAttribute('style', style); post({ type:'reorder', html: document.body.innerHTML }); }
    }
    if (type === 'deleteEl' && id) {
      const el = document.querySelector('[data-id="'+id+'"]');
      if (el) { el.remove(); post({ type:'reorder', html: document.body.innerHTML }); post({ type:'deselect' }); }
    }
    if (type === 'insertHtml') {
      const anchor = document.querySelector('[data-selected]') || document.body.lastElementChild;
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      anchor.after(...tmp.children);
      post({ type:'reorder', html: document.body.innerHTML });
    }
  });
})();
</script>`;
  return html.includes('</body>')
    ? html.replace('</body>', bridge + '</body>')
    : html + bridge;
};

// ── main component ─────────────────────────────────────────────────────────
export default function PdfEditor() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const iframeRef = useRef(null);

  const [liveHtml,  setLiveHtml]  = useState(() => state?.html ? wrapWithBridge(state.html) : '');
  const [rawHtml,   setRawHtml]   = useState(state?.html ?? '');
  const [selected,  setSelected]  = useState(null); // { id, tag, styles, text }
  const [activeTab, setActiveTab] = useState('element');
  const [downloading, setDownloading] = useState(false);

  // element style controls
  const [elStyles, setElStyles] = useState({
    color:'#111111', background:'#ffffff', fontSize:'16',
    fontWeight:'normal', textAlign:'left', padding:'0',
    borderRadius:'0', borderStyle:'none', borderColor:'#dddddd', borderWidth:'1',
    marginTop:'0', marginBottom:'0',
  });

  // receive messages from iframe
  const onMessage = useCallback((e) => {
    const { type, id, tag, styles, text, html } = e.data || {};
    if (type === 'select') {
      setSelected({ id, tag, styles, text });
      // parse inline styles into our controls
      const tmp = document.createElement('div');
      tmp.setAttribute('style', styles);
      const cs = tmp.style;
      setElStyles({
        color:       cs.color       || '#111111',
        background:  cs.background  || '#ffffff',
        fontSize:    parseInt(cs.fontSize) || 16,
        fontWeight:  cs.fontWeight  || 'normal',
        textAlign:   cs.textAlign   || 'left',
        padding:     parseInt(cs.padding)  || 0,
        borderRadius:parseInt(cs.borderRadius) || 0,
        borderStyle: cs.borderStyle || 'none',
        borderColor: cs.borderColor || '#dddddd',
        borderWidth: parseInt(cs.borderWidth) || 1,
        marginTop:   parseInt(cs.marginTop)    || 0,
        marginBottom:parseInt(cs.marginBottom) || 0,
      });
      setActiveTab('element');
    }
    if (type === 'deselect') setSelected(null);
    if (type === 'reorder' || type === 'textChanged') setRawHtml(html ?? rawHtml);
  }, [rawHtml]);

  useEffect(() => {
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onMessage]);

  // push style update to iframe
  const pushStyle = (newStyles) => {
    const merged = { ...elStyles, ...newStyles };
    setElStyles(merged);
    if (!selected) return;
    const styleStr = Object.entries({
      color:        merged.color,
      background:   merged.background,
      'font-size':  merged.fontSize + 'px',
      'font-weight':merged.fontWeight,
      'text-align': merged.textAlign,
      padding:      merged.padding + 'px',
      'border-radius': merged.borderRadius + 'px',
      border:       merged.borderStyle !== 'none'
                    ? `${merged.borderWidth}px ${merged.borderStyle} ${merged.borderColor}`
                    : 'none',
      'margin-top':    merged.marginTop + 'px',
      'margin-bottom': merged.marginBottom + 'px',
    }).map(([k,v]) => `${k}:${v}`).join(';');
    iframeRef.current?.contentWindow?.postMessage({ type:'applyStyle', id:selected.id, style:styleStr }, '*');
  };

  const deleteSelected = () => {
    if (!selected) return;
    iframeRef.current?.contentWindow?.postMessage({ type:'deleteEl', id:selected.id }, '*');
    setSelected(null);
  };

  const insertElement = (kind) => {
    const html = NEW_ELEMENT_TEMPLATES[kind]?.();
    if (html) iframeRef.current?.contentWindow?.postMessage({ type:'insertHtml', html }, '*');
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch('http://localhost:3000/api/render-pdf', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ html: rawHtml, styleManifesto: state?.manifesto }),
      });
      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'report-edited.pdf';
      a.click();
    } finally { setDownloading(false); }
  };

  // ── styles ──
  const panel  = { background:'#12121f', borderRadius:12, padding:'16px', marginBottom:12, border:'1px solid #1e1e32' };
  const lbl    = { fontSize:'0.72rem', color:'#666', display:'block', marginBottom:3 };
  const inp    = { background:'#1a1a2e', border:'1px solid #333', borderRadius:6, padding:'6px 8px', color:'#ccc', fontSize:'0.82rem', width:'100%', boxSizing:'border-box' };
  const row    = { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #1a1a2e' };
  const accent = '#7c6fff';

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setActiveTab(id)} style={{
      flex:1, padding:'8px 4px', border:'none', borderRadius:0, cursor:'pointer', fontSize:'0.75rem', fontWeight:600,
      background: activeTab===id ? '#1e1e3a' : 'transparent',
      color:      activeTab===id ? accent     : '#555',
      borderBottom: activeTab===id ? `2px solid ${accent}` : '2px solid transparent',
    }}>{label}</button>
  );

  const ColorRow = ({ label: lbl2, k }) => (
    <div style={row}>
      <span style={{ fontSize:'0.8rem', color:'#bbb' }}>{lbl2}</span>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ fontFamily:'monospace', fontSize:'0.72rem', color:'#555' }}>{String(elStyles[k]).toUpperCase()}</span>
        <input type="color" value={elStyles[k]} onChange={e => pushStyle({ [k]: e.target.value })}
          style={{ width:28, height:28, border:'2px solid #333', borderRadius:5, cursor:'pointer', padding:1, background:'none' }} />
      </div>
    </div>
  );

  const SliderRow = ({ label: lbl2, k, min, max, step=1, unit='' }) => (
    <div style={{ padding:'6px 0', borderBottom:'1px solid #1a1a2e' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
        <span style={{ fontSize:'0.8rem', color:'#bbb' }}>{lbl2}</span>
        <span style={{ fontFamily:'monospace', fontSize:'0.72rem', color:'#555' }}>{elStyles[k]}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={elStyles[k]}
        onChange={e => pushStyle({ [k]: Number(e.target.value) })}
        style={{ width:'100%', accentColor:accent }} />
    </div>
  );

  const noHtml = !liveHtml;

  return (
    <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', height:'100vh', background:'#0d0d1a', color:'#eee', fontFamily:'system-ui,sans-serif', overflow:'hidden' }}>

      {/* ── SIDEBAR ── */}
      <div style={{ display:'flex', flexDirection:'column', borderRight:'1px solid #1e1e32', overflow:'hidden' }}>

        {/* header */}
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #1e1e32', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <h2 style={{ margin:0, fontSize:'1rem', fontWeight:800, background:`linear-gradient(135deg,${accent},#48dbfb)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>PDF Editor</h2>
            <div style={{ fontSize:'0.72rem', color:'#444', marginTop:2 }}>Double-click text to edit • Drag sections to reorder</div>
          </div>
          <button onClick={() => navigate(-1)} style={{ background:'none', border:'1px solid #333', color:'#666', borderRadius:8, padding:'4px 10px', cursor:'pointer', fontSize:'0.75rem' }}>← Back</button>
        </div>

        {/* tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid #1e1e32', flexShrink:0 }}>
          <TabBtn id="element" label="Element" />
          <TabBtn id="insert"  label="Insert"  />
        </div>

        <div style={{ overflowY:'auto', flex:1, padding:'12px' }}>

          {/* ── ELEMENT TAB ── */}
          {activeTab === 'element' && (
            <>
              {selected ? (
                <>
                  <div style={{ ...panel, background:'#1a1a2e', marginBottom:10 }}>
                    <div style={{ fontSize:'0.7rem', color:'#555', marginBottom:4 }}>Selected</div>
                    <div style={{ fontSize:'0.85rem', color:accent, fontWeight:700, fontFamily:'monospace' }}>&lt;{selected.tag}&gt;</div>
                    {selected.text && <div style={{ fontSize:'0.75rem', color:'#666', marginTop:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selected.text.slice(0,60)}</div>}
                  </div>

                  <div style={panel}>
                    <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#555', marginBottom:8 }}>Colors</div>
                    <ColorRow label="Text Color"   k="color" />
                    <ColorRow label="Background"   k="background" />
                    <ColorRow label="Border Color" k="borderColor" />
                  </div>

                  <div style={panel}>
                    <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#555', marginBottom:8 }}>Typography</div>
                    <SliderRow label="Font Size"   k="fontSize"   min={8}  max={64} unit="px" />
                    <div style={{ ...row, marginTop:6 }}>
                      <span style={{ fontSize:'0.8rem', color:'#bbb' }}>Weight</span>
                      <select value={elStyles.fontWeight} onChange={e => pushStyle({ fontWeight: e.target.value })}
                        style={{ ...inp, width:'auto' }}>
                        {['normal','bold','300','500','600','700','800'].map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                    <div style={{ ...row, marginTop:6 }}>
                      <span style={{ fontSize:'0.8rem', color:'#bbb' }}>Align</span>
                      <div style={{ display:'flex', gap:4 }}>
                        {['left','center','right','justify'].map(a => (
                          <button key={a} onClick={() => pushStyle({ textAlign:a })} style={{
                            padding:'3px 8px', borderRadius:5, border:`1px solid ${elStyles.textAlign===a?accent:'#333'}`,
                            background: elStyles.textAlign===a ? accent : '#1a1a2e', color: elStyles.textAlign===a?'white':'#666', cursor:'pointer', fontSize:'0.72rem'
                          }}>{a[0].toUpperCase()}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={panel}>
                    <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#555', marginBottom:8 }}>Spacing & Shape</div>
                    <SliderRow label="Padding"       k="padding"      min={0} max={60} unit="px" />
                    <SliderRow label="Margin Top"    k="marginTop"    min={0} max={80} unit="px" />
                    <SliderRow label="Margin Bottom" k="marginBottom" min={0} max={80} unit="px" />
                    <SliderRow label="Border Radius" k="borderRadius" min={0} max={40} unit="px" />
                  </div>

                  <div style={panel}>
                    <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#555', marginBottom:8 }}>Border</div>
                    <div style={{ ...row, marginBottom:4 }}>
                      <span style={{ fontSize:'0.8rem', color:'#bbb' }}>Style</span>
                      <select value={elStyles.borderStyle} onChange={e => pushStyle({ borderStyle: e.target.value })}
                        style={{ ...inp, width:'auto' }}>
                        {['none','solid','dashed','dotted','double'].map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    {elStyles.borderStyle !== 'none' && (
                      <SliderRow label="Border Width" k="borderWidth" min={1} max={10} unit="px" />
                    )}
                  </div>

                  <button onClick={deleteSelected} style={{ width:'100%', padding:'9px', borderRadius:8, border:'1px solid #c0392b', background:'#1a0a0a', color:'#e74c3c', cursor:'pointer', fontWeight:700, fontSize:'0.83rem' }}>
                    🗑 Delete Element
                  </button>
                </>
              ) : (
                <div style={{ textAlign:'center', color:'#333', fontSize:'0.83rem', paddingTop:40 }}>
                  <div style={{ fontSize:'2rem', marginBottom:10 }}>👆</div>
                  Click any element in the preview to select and edit it
                </div>
              )}
            </>
          )}

          {/* ── INSERT TAB ── */}
          {activeTab === 'insert' && (
            <div>
              <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#555', marginBottom:12 }}>
                Insert after selected element
              </div>
              {[
                { kind:'heading',   icon:'H', label:'Heading',   desc:'H2 heading block' },
                { kind:'paragraph', icon:'¶', label:'Paragraph', desc:'Body text block' },
                { kind:'table',     icon:'⊞', label:'Table',     desc:'3-column table with header' },
                { kind:'callout',   icon:'💡', label:'Callout',   desc:'Tip / note box with accent border' },
                { kind:'card',      icon:'▣', label:'Card',      desc:'Shadowed content card' },
                { kind:'divider',   icon:'—', label:'Divider',   desc:'Horizontal rule' },
              ].map(({ kind, icon, label, desc }) => (
                <button key={kind} onClick={() => insertElement(kind)} style={{
                  width:'100%', display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
                  background:'#1a1a2e', border:'1px solid #252540', borderRadius:8, cursor:'pointer',
                  marginBottom:8, textAlign:'left', transition:'border-color 0.15s',
                }}>
                  <span style={{ fontSize:'1.2rem', width:28, textAlign:'center' }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:'0.85rem', color:'#ddd', fontWeight:600 }}>{label}</div>
                    <div style={{ fontSize:'0.73rem', color:'#555' }}>{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* download */}
        <div style={{ padding:'12px', borderTop:'1px solid #1e1e32', flexShrink:0 }}>
          <button onClick={handleDownload} disabled={downloading || noHtml} style={{
            width:'100%', padding:'11px', borderRadius:8, border:'none',
            background: noHtml ? '#1a1a2e' : downloading ? '#333' : 'linear-gradient(135deg,#27ae60,#2ecc71)',
            color: noHtml ? '#444' : 'white', fontWeight:700, fontSize:'0.9rem', cursor: noHtml?'not-allowed':'pointer',
          }}>
            {downloading ? 'Rendering PDF…' : '⬇ Download PDF'}
          </button>
        </div>
      </div>

      {/* ── PREVIEW ── */}
      <div style={{ position:'relative', overflow:'hidden', background:'#1a1a2e' }}>
        {noHtml ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', flexDirection:'column', gap:12, color:'#333' }}>
            <div style={{ fontSize:'3rem' }}>📄</div>
            <div style={{ fontSize:'0.9rem' }}>No report loaded — go back and generate one first</div>
            <button onClick={() => navigate(-1)} style={{ padding:'9px 20px', borderRadius:8, border:`1px solid ${accent}`, background:'transparent', color:accent, cursor:'pointer', fontWeight:600 }}>← Back to Builder</button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            srcDoc={liveHtml}
            style={{ width:'100%', height:'100%', border:'none', display:'block' }}
            title="PDF Editor Preview"
          />
        )}
      </div>
    </div>
  );
}