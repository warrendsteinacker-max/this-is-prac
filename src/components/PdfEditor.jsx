import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const uid = () => Math.random().toString(36).slice(2, 7);

// ── Element templates ──────────────────────────────────────────────────────
const TEMPLATES = {
  heading:   () => `<h2 data-editable="true" data-id="${uid()}" style="color:inherit">New Heading</h2>`,
  paragraph: () => `<p data-editable="true" data-id="${uid()}">New paragraph text.</p>`,
  table:     (rows=3, cols=3) => {
    const hdr = Array.from({length:cols},(_,i)=>`<th style="padding:8px;background:#3498db;color:#fff;border:1px solid #ddd">Col ${i+1}</th>`).join('');
    const row = Array.from({length:cols},(_,i)=>`<td data-editable="true" data-id="${uid()}" style="padding:8px;border:1px solid #ddd" contenteditable="false">Cell</td>`).join('');
    const rows_ = Array.from({length:rows},(_,i)=>`<tr style="${i%2===1?'background:#f0f4f8':''}">${row}</tr>`).join('');
    return `<table data-id="${uid()}" data-editable="true" style="width:100%;border-collapse:collapse;margin:16px 0"><thead><tr>${hdr}</tr></thead><tbody>${rows_}</tbody></table>`;
  },
  callout:   () => `<aside data-editable="true" data-id="${uid()}" style="border-left:4px solid #3498db;background:#eef6ff;padding:14px 18px;border-radius:6px;margin:16px 0"><strong>💡 Note:</strong> Add your callout text here.</aside>`,
  divider:   () => `<hr data-id="${uid()}" style="border:none;border-top:2px solid #eee;margin:24px 0"/>`,
  card:      () => `<div data-editable="true" data-id="${uid()}" style="background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.08);padding:20px;margin:12px 0"><h3 data-editable="true" data-id="${uid()}" style="margin:0 0 8px">Card Title</h3><p data-editable="true" data-id="${uid()}" style="margin:0;color:#666">Card description.</p></div>`,
  image:     (src) => `<figure data-id="${uid()}" style="margin:16px 0;text-align:center"><img data-id="${uid()}" data-editable="true" src="${src}" style="max-width:100%;height:auto;border-radius:6px"/><figcaption data-editable="true" data-id="${uid()}" style="color:#888;font-size:0.85em;margin-top:6px">Image caption</figcaption></figure>`,
};

// ── Inject print-color-adjust so backgrounds survive PDF rendering ─────────
// This is injected into the HTML that gets sent to /api/render-pdf
const COLOR_ADJUST_STYLE = `
<style>
  *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
</style>`;

// Prepend the style into the raw HTML before sending to the PDF renderer
const injectPrintStyles = (html) => {
  if (html.includes('</head>')) return html.replace('</head>', COLOR_ADJUST_STYLE + '</head>');
  if (html.includes('<body')) return html.replace('<body', COLOR_ADJUST_STYLE + '<body');
  return COLOR_ADJUST_STYLE + html;
};

// ── iframe bridge ──────────────────────────────────────────────────────────
const wrapWithBridge = (html) => {
  const bridge = `
<style>
  *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  [data-editable]:hover { outline:2px dashed rgba(124,111,255,0.4); cursor:pointer; }
  [data-selected] { outline:2px solid #7c6fff !important; outline-offset:2px; }
  [data-drag-over] { border-top:3px solid #48dbfb !important; }
  body.drag-active * { pointer-events:none; }
  body.drag-active [data-section] { pointer-events:auto; }
</style>
<script>
(function(){
  let dragSrc = null;
  function post(msg){ window.parent.postMessage(msg,'*'); }

  document.addEventListener('click', e => {
    document.querySelectorAll('[data-selected]').forEach(n=>n.removeAttribute('data-selected'));
    const el = e.target.closest('[data-editable]');
    if(el){
      el.setAttribute('data-selected','');
      post({ type:'select', id:el.dataset.id, tag:el.tagName.toLowerCase(),
             styles:el.getAttribute('style')||'', text:el.innerText,
             isTable: el.tagName==='TABLE' || !!el.closest('table'),
             tableId: el.closest('table')?.dataset?.id || null });
      e.stopPropagation();
    } else {
      post({ type:'deselect' });
    }
  });

  document.addEventListener('dblclick', e => {
    const el = e.target.closest('[data-editable]');
    if(!el || el.tagName==='TABLE') return;
    el.contentEditable='true';
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    post({ type:'editing', id:el.dataset.id });
  });

  document.addEventListener('blur', e => {
    const el = e.target.closest('[contenteditable="true"]');
    if(!el) return;
    el.contentEditable='false';
    post({ type:'textChanged', id:el.dataset.id, html:document.body.innerHTML });
  }, true);

  document.querySelectorAll('[data-section]').forEach(sec => {
    sec.draggable=true;
    sec.addEventListener('dragstart', e=>{ dragSrc=sec; document.body.classList.add('drag-active'); e.dataTransfer.effectAllowed='move'; });
    sec.addEventListener('dragover',  e=>{ e.preventDefault(); sec.setAttribute('data-drag-over',''); });
    sec.addEventListener('dragleave', ()=>sec.removeAttribute('data-drag-over'));
    sec.addEventListener('drop', e=>{
      e.preventDefault(); sec.removeAttribute('data-drag-over');
      if(dragSrc && dragSrc!==sec){ sec.parentNode.insertBefore(dragSrc,sec); post({ type:'reorder', html:document.body.innerHTML }); }
      document.body.classList.remove('drag-active');
    });
    sec.addEventListener('dragend',()=>document.body.classList.remove('drag-active'));
  });

  window.addEventListener('message', e => {
    const { type, id, style, html } = e.data || {};

    if(type==='applyStyle' && id){
      const el = document.querySelector('[data-id="'+id+'"]');
      if(el){ el.setAttribute('style',style); post({ type:'reorder', html:document.body.innerHTML }); }
    }
    if(type==='deleteEl' && id){
      const el = document.querySelector('[data-id="'+id+'"]');
      if(el){ el.remove(); post({ type:'reorder', html:document.body.innerHTML }); post({ type:'deselect' }); }
    }
    if(type==='insertHtml'){
      const anchor = document.querySelector('[data-selected]') || document.body.lastElementChild;
      const tmp=document.createElement('div'); tmp.innerHTML=html;
      anchor.after(...tmp.children);
      post({ type:'reorder', html:document.body.innerHTML });
    }
    if(type==='addTableRow' && id){
      const tbl = document.querySelector('[data-id="'+id+'"]');
      const table = tbl?.tagName==='TABLE' ? tbl : tbl?.closest('table');
      if(!table) return;
      const tbody = table.querySelector('tbody');
      const colCount = table.querySelector('tr')?.cells?.length || 3;
      const rowCount = tbody?.rows?.length || 0;
      const newRow = document.createElement('tr');
      if(rowCount%2===1) newRow.style.background='#f0f4f8';
      for(let i=0;i<colCount;i++){
        const td=document.createElement('td');
        td.setAttribute('data-editable','true');
        td.setAttribute('data-id',Math.random().toString(36).slice(2,7));
        td.setAttribute('contenteditable','false');
        td.style.cssText='padding:8px;border:1px solid #ddd';
        td.textContent='Cell';
        newRow.appendChild(td);
      }
      tbody.appendChild(newRow);
      post({ type:'reorder', html:document.body.innerHTML });
    }
    if(type==='addTableCol' && id){
      const tbl = document.querySelector('[data-id="'+id+'"]');
      const table = tbl?.tagName==='TABLE' ? tbl : tbl?.closest('table');
      if(!table) return;
      const headerRow = table.querySelector('thead tr');
      if(headerRow){
        const th=document.createElement('th');
        th.style.cssText='padding:8px;background:#3498db;color:#fff;border:1px solid #ddd';
        th.textContent='New Col';
        headerRow.appendChild(th);
      }
      table.querySelectorAll('tbody tr').forEach(row=>{
        const td=document.createElement('td');
        td.setAttribute('data-editable','true');
        td.setAttribute('data-id',Math.random().toString(36).slice(2,7));
        td.setAttribute('contenteditable','false');
        td.style.cssText='padding:8px;border:1px solid #ddd';
        td.textContent='Cell';
        row.appendChild(td);
      });
      post({ type:'reorder', html:document.body.innerHTML });
    }
    if(type==='removeTableRow' && id){
      const tbl = document.querySelector('[data-id="'+id+'"]');
      const table = tbl?.tagName==='TABLE' ? tbl : tbl?.closest('table');
      if(!table) return;
      const tbody=table.querySelector('tbody');
      if(tbody && tbody.rows.length>1) tbody.deleteRow(tbody.rows.length-1);
      post({ type:'reorder', html:document.body.innerHTML });
    }
    if(type==='removeTableCol' && id){
      const tbl = document.querySelector('[data-id="'+id+'"]');
      const table = tbl?.tagName==='TABLE' ? tbl : tbl?.closest('table');
      if(!table) return;
      table.querySelectorAll('tr').forEach(row=>{ if(row.cells.length>1) row.deleteCell(row.cells.length-1); });
      post({ type:'reorder', html:document.body.innerHTML });
    }
    if(type==='replaceImage' && id){
      const img = document.querySelector('[data-id="'+id+'"]');
      if(img){ img.src=e.data.src; post({ type:'reorder', html:document.body.innerHTML }); }
    }
  });
})();
</script>`;
  return html.includes('</body>') ? html.replace('</body>', bridge+'</body>') : html+bridge;
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function PdfEditor() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const iframeRef  = useRef(null);
  const imgUpRef   = useRef(null);

  const [liveHtml,    setLiveHtml]    = useState(() => state?.html ? wrapWithBridge(state.html) : '');
  const [rawHtml,     setRawHtml]     = useState(state?.html ?? '');
  const [selected,    setSelected]    = useState(null);
  const [activeTab,   setActiveTab]   = useState('element');
  const [downloading, setDownloading] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [urlPreview,      setUrlPreview]      = useState('');
  const [newRows, setNewRows] = useState(3);
  const [newCols, setNewCols] = useState(3);

  // ── PDF Preview toggle ────────────────────────────────────────────────────
  // 'edit' = the interactive editor iframe
  // 'pdf'  = the actual rendered PDF in an <iframe src=blobUrl>
  const [viewMode,      setViewMode]      = useState('edit'); // 'edit' | 'pdf'
  const [pdfBlobUrl,    setPdfBlobUrl]    = useState(null);
  const [pdfLoading,    setPdfLoading]    = useState(false);
  const [pdfError,      setPdfError]      = useState(null);

  const loadPdfPreview = async () => {
    setPdfLoading(true);
    setPdfError(null);
    try {
      const res = await fetch('http://localhost:3000/api/render-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: injectPrintStyles(rawHtml), styleManifest: state?.manifesto }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const blob = await res.blob();
      // Revoke previous URL to avoid memory leaks
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      setPdfError(err.message);
    } finally {
      setPdfLoading(false);
    }
  };

  // When switching to PDF view, auto-fetch
  const handleToggleView = async (mode) => {
    setViewMode(mode);
    if (mode === 'pdf') await loadPdfPreview();
  };

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => { if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl); };
  }, [pdfBlobUrl]);

  const [elStyles, setElStyles] = useState({
    color:'#111111', background:'#ffffff', fontSize:16,
    fontWeight:'normal', textAlign:'left', padding:0,
    borderRadius:0, borderStyle:'none', borderColor:'#dddddd', borderWidth:1,
    marginTop:0, marginBottom:0, width:'100', opacity:100,
  });

  const onMessage = useCallback((e) => {
    const { type, id, tag, styles, text, html, isTable, tableId } = e.data || {};
    if(type==='select'){
      setSelected({ id, tag, styles, text, isTable, tableId });
      const tmp=document.createElement('div');
      tmp.setAttribute('style', styles);
      const cs=tmp.style;
      setElStyles({
        color:       cs.color       || '#111111',
        background:  cs.background  || '#ffffff',
        fontSize:    parseInt(cs.fontSize)     || 16,
        fontWeight:  cs.fontWeight  || 'normal',
        textAlign:   cs.textAlign   || 'left',
        padding:     parseInt(cs.padding)      || 0,
        borderRadius:parseInt(cs.borderRadius) || 0,
        borderStyle: cs.borderStyle || 'none',
        borderColor: cs.borderColor || '#dddddd',
        borderWidth: parseInt(cs.borderWidth)  || 1,
        marginTop:   parseInt(cs.marginTop)    || 0,
        marginBottom:parseInt(cs.marginBottom) || 0,
        width:       parseInt(cs.width)        || 100,
        opacity:     Math.round((parseFloat(cs.opacity)||1)*100),
      });
      setActiveTab('element');
    }
    if(type==='deselect') setSelected(null);
    if(type==='reorder'||type==='textChanged') setRawHtml(html ?? rawHtml);
  }, [rawHtml]);

  useEffect(() => {
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onMessage]);

  const send = (msg) => iframeRef.current?.contentWindow?.postMessage(msg, '*');

  const pushStyle = (newStyles) => {
    const merged = { ...elStyles, ...newStyles };
    setElStyles(merged);
    if(!selected) return;
    // background-color is set explicitly so PDF renderers can't ignore it
    const styleStr = [
      `color:${merged.color}`,
      `background:${merged.background}`,
      `background-color:${merged.background}`,        // ← extra explicit declaration
      `-webkit-print-color-adjust:exact`,             // ← force print backgrounds
      `print-color-adjust:exact`,
      `font-size:${merged.fontSize}px`,
      `font-weight:${merged.fontWeight}`,
      `text-align:${merged.textAlign}`,
      `padding:${merged.padding}px`,
      `border-radius:${merged.borderRadius}px`,
      `border:${merged.borderStyle!=='none'?`${merged.borderWidth}px ${merged.borderStyle} ${merged.borderColor}`:'none'}`,
      `margin-top:${merged.marginTop}px`,
      `margin-bottom:${merged.marginBottom}px`,
      `width:${merged.width}%`,
      `opacity:${merged.opacity/100}`,
    ].join(';');
    send({ type:'applyStyle', id:selected.id, style:styleStr });
  };

  const deleteSelected = () => { if(selected){ send({ type:'deleteEl', id:selected.id }); setSelected(null); } };
  const insertEl = (kind) => { const h=TEMPLATES[kind]?.(); if(h) send({ type:'insertHtml', html:h }); };
  const insertTable = () => { send({ type:'insertHtml', html:TEMPLATES.table(newRows, newCols) }); };

  const tableTarget = selected?.tableId || selected?.id;
  const addRow    = () => send({ type:'addTableRow',    id:tableTarget });
  const removeRow = () => send({ type:'removeTableRow', id:tableTarget });
  const addCol    = () => send({ type:'addTableCol',    id:tableTarget });
  const removeCol = () => send({ type:'removeTableCol', id:tableTarget });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedPreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch('http://localhost:3000/api/render-pdf', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        // ↓ inject print styles here too so downloaded PDF also has correct colors
        body:JSON.stringify({ html: injectPrintStyles(rawHtml), styleManifest:state?.manifesto }),
      });
      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href=url; a.download='report-edited.pdf'; a.click();
      URL.revokeObjectURL(url);
    } finally { setDownloading(false); }
  };

  // ── style constants ──
  const accent = '#7c6fff';
  const panel  = { background:'#12121f', borderRadius:12, padding:'14px', marginBottom:10, border:'1px solid #1e1e32' };
  const row_   = { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #1a1a2e' };
  const inp    = { background:'#1a1a2e', border:'1px solid #333', borderRadius:6, padding:'5px 8px', color:'#ccc', fontSize:'0.82rem', width:'100%', boxSizing:'border-box' };
  const noHtml = !liveHtml;

  const TabBtn = ({id,label}) => (
    <button onClick={()=>setActiveTab(id)} style={{
      flex:1,padding:'8px 4px',border:'none',borderRadius:0,cursor:'pointer',fontSize:'0.75rem',fontWeight:600,
      background:activeTab===id?'#1e1e3a':'transparent',
      color:activeTab===id?accent:'#555',
      borderBottom:activeTab===id?`2px solid ${accent}`:'2px solid transparent',
    }}>{label}</button>
  );

  const ColorRow = ({label,k}) => (
    <div style={row_}>
      <span style={{fontSize:'0.8rem',color:'#bbb'}}>{label}</span>
      <div style={{display:'flex',alignItems:'center',gap:6}}>
        <span style={{fontFamily:'monospace',fontSize:'0.72rem',color:'#555'}}>{String(elStyles[k]).toUpperCase()}</span>
        <input type="color" value={elStyles[k]} onChange={e=>pushStyle({[k]:e.target.value})}
          style={{width:28,height:28,border:'2px solid #333',borderRadius:5,cursor:'pointer',padding:1,background:'none'}}/>
      </div>
    </div>
  );

  const SliderRow = ({label,k,min,max,step=1,unit=''}) => (
    <div style={{padding:'6px 0',borderBottom:'1px solid #1a1a2e'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
        <span style={{fontSize:'0.8rem',color:'#bbb'}}>{label}</span>
        <span style={{fontFamily:'monospace',fontSize:'0.72rem',color:'#555'}}>{elStyles[k]}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={elStyles[k]}
        onChange={e=>pushStyle({[k]:Number(e.target.value)})}
        style={{width:'100%',accentColor:accent}}/>
    </div>
  );

  const TableBtn = ({label,onClick,color='#333'}) => (
    <button onClick={onClick} style={{
      flex:1,padding:'6px 4px',borderRadius:6,border:`1px solid ${color}`,
      background:'transparent',color,cursor:'pointer',fontSize:'0.75rem',fontWeight:600,
    }}>{label}</button>
  );

  // ── View mode toggle pill ─────────────────────────────────────────────────
  const ViewToggle = () => (
    <div style={{
      display:'flex', alignItems:'center', gap:0,
      background:'#0d0d1a', border:'1px solid #1e1e32',
      borderRadius:8, padding:3, margin:'8px 10px', flexShrink:0,
    }}>
      {[
        { id:'edit', label:'✏️ Edit' },
        { id:'pdf',  label:'📄 PDF Preview' },
      ].map(({id,label}) => (
        <button key={id} onClick={()=>handleToggleView(id)} style={{
          flex:1, padding:'7px 10px', border:'none', borderRadius:6, cursor:'pointer',
          fontSize:'0.78rem', fontWeight:700, transition:'all .15s',
          background: viewMode===id ? accent : 'transparent',
          color: viewMode===id ? 'white' : '#444',
        }}>{label}</button>
      ))}
    </div>
  );

  return (
    <div style={{display:'grid',gridTemplateColumns:'300px 1fr',height:'100vh',background:'#0d0d1a',color:'#eee',fontFamily:'system-ui,sans-serif',overflow:'hidden'}}>

      {/* ── SIDEBAR ── */}
      <div style={{display:'flex',flexDirection:'column',borderRight:'1px solid #1e1e32',overflow:'hidden'}}>

        {/* header */}
        <div style={{padding:'12px 14px',borderBottom:'1px solid #1e1e32',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div>
            <h2 style={{margin:0,fontSize:'0.95rem',fontWeight:800,background:`linear-gradient(135deg,${accent},#48dbfb)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>PDF Editor</h2>
            <div style={{fontSize:'0.68rem',color:'#444',marginTop:2}}>Double-click to edit • Drag sections to reorder</div>
          </div>
          <button onClick={()=>navigate(-1)} style={{background:'none',border:'1px solid #333',color:'#666',borderRadius:8,padding:'4px 8px',cursor:'pointer',fontSize:'0.72rem'}}>← Back</button>
        </div>

        {/* ── View mode toggle ── */}
        <ViewToggle />

        {/* tabs — only show when in edit mode */}
        {viewMode === 'edit' && (
          <div style={{display:'flex',borderBottom:'1px solid #1e1e32',flexShrink:0}}>
            <TabBtn id="element" label="Element"/>
            <TabBtn id="table"   label="Table"/>
            <TabBtn id="insert"  label="Insert"/>
            <TabBtn id="image"   label="Image"/>
          </div>
        )}

        {/* PDF preview sidebar info */}
        {viewMode === 'pdf' && (
          <div style={{padding:'10px',borderBottom:'1px solid #1e1e32',flexShrink:0}}>
            <div style={{fontSize:'0.75rem',color:'#555',lineHeight:1.5}}>
              This is a live render of your PDF exactly as it will be downloaded. Switch back to <strong style={{color:accent}}>Edit</strong> to make changes, then refresh the preview.
            </div>
            <button onClick={loadPdfPreview} disabled={pdfLoading} style={{
              marginTop:8,width:'100%',padding:'7px',borderRadius:8,border:`1px solid ${accent}`,
              background:'transparent',color:accent,cursor:pdfLoading?'not-allowed':'pointer',fontWeight:600,fontSize:'0.8rem',
            }}>
              {pdfLoading ? '⏳ Rendering…' : '🔄 Refresh Preview'}
            </button>
            {pdfError && <div style={{marginTop:6,fontSize:'0.72rem',color:'#e74c3c'}}>{pdfError}</div>}
          </div>
        )}

        <div style={{overflowY:'auto',flex:1,padding:'10px', display: viewMode==='pdf' ? 'none' : 'block'}}>

          {/* ── ELEMENT TAB ── */}
          {activeTab==='element' && (<>
            {selected ? (<>
              <div style={{...panel,background:'#1a1a2e',marginBottom:8}}>
                <div style={{fontSize:'0.68rem',color:'#555',marginBottom:3}}>Selected</div>
                <div style={{fontSize:'0.85rem',color:accent,fontWeight:700,fontFamily:'monospace'}}>&lt;{selected.tag}&gt;</div>
                {selected.text && <div style={{fontSize:'0.72rem',color:'#555',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{selected.text.slice(0,50)}</div>}
              </div>

              <div style={panel}>
                <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#555',marginBottom:6}}>Colors</div>
                <ColorRow label="Text" k="color"/>
                <ColorRow label="Background" k="background"/>
                <ColorRow label="Border Color" k="borderColor"/>
              </div>

              <div style={panel}>
                <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#555',marginBottom:6}}>Typography</div>
                <SliderRow label="Font Size" k="fontSize" min={8} max={72} unit="px"/>
                <div style={{...row_,marginTop:4}}>
                  <span style={{fontSize:'0.8rem',color:'#bbb'}}>Weight</span>
                  <select value={elStyles.fontWeight} onChange={e=>pushStyle({fontWeight:e.target.value})} style={{...inp,width:'auto'}}>
                    {['normal','bold','300','400','500','600','700','800','900'].map(w=><option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div style={{...row_,marginTop:4}}>
                  <span style={{fontSize:'0.8rem',color:'#bbb'}}>Align</span>
                  <div style={{display:'flex',gap:4}}>
                    {['left','center','right','justify'].map(a=>(
                      <button key={a} onClick={()=>pushStyle({textAlign:a})} style={{
                        padding:'3px 7px',borderRadius:5,border:`1px solid ${elStyles.textAlign===a?accent:'#333'}`,
                        background:elStyles.textAlign===a?accent:'#1a1a2e',color:elStyles.textAlign===a?'white':'#666',cursor:'pointer',fontSize:'0.7rem'
                      }}>{a[0].toUpperCase()}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={panel}>
                <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#555',marginBottom:6}}>Spacing & Shape</div>
                <SliderRow label="Padding"       k="padding"      min={0} max={60} unit="px"/>
                <SliderRow label="Margin Top"    k="marginTop"    min={0} max={80} unit="px"/>
                <SliderRow label="Margin Bottom" k="marginBottom" min={0} max={80} unit="px"/>
                <SliderRow label="Border Radius" k="borderRadius" min={0} max={40} unit="px"/>
                <SliderRow label="Width"         k="width"        min={10} max={100} unit="%"/>
                <SliderRow label="Opacity"       k="opacity"      min={0} max={100} unit="%"/>
              </div>

              <div style={panel}>
                <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#555',marginBottom:6}}>Border</div>
                <div style={{...row_,marginBottom:4}}>
                  <span style={{fontSize:'0.8rem',color:'#bbb'}}>Style</span>
                  <select value={elStyles.borderStyle} onChange={e=>pushStyle({borderStyle:e.target.value})} style={{...inp,width:'auto'}}>
                    {['none','solid','dashed','dotted','double'].map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                {elStyles.borderStyle!=='none' && <SliderRow label="Width" k="borderWidth" min={1} max={10} unit="px"/>}
              </div>

              <button onClick={deleteSelected} style={{width:'100%',padding:'8px',borderRadius:8,border:'1px solid #c0392b',background:'#1a0a0a',color:'#e74c3c',cursor:'pointer',fontWeight:700,fontSize:'0.82rem',marginBottom:8}}>
                🗑 Delete Element
              </button>
            </>) : (
              <div style={{textAlign:'center',color:'#333',fontSize:'0.82rem',paddingTop:40}}>
                <div style={{fontSize:'2rem',marginBottom:8}}>👆</div>
                Click any element in the preview to select it
              </div>
            )}
          </>)}

          {/* ── TABLE TAB ── */}
          {activeTab==='table' && (
            <div>
              <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#555',marginBottom:10}}>
                {selected?.isTable||selected?.tableId ? 'Edit Selected Table' : 'Select a table cell first'}
              </div>
              {(selected?.isTable||selected?.tableId) && (<>
                <div style={panel}>
                  <div style={{fontSize:'0.72rem',color:'#888',marginBottom:8}}>Rows</div>
                  <div style={{display:'flex',gap:6}}>
                    <TableBtn label="+ Add Row"    onClick={addRow}    color="#27ae60"/>
                    <TableBtn label="− Remove Row" onClick={removeRow} color="#e74c3c"/>
                  </div>
                  <div style={{fontSize:'0.72rem',color:'#888',margin:'10px 0 8px'}}>Columns</div>
                  <div style={{display:'flex',gap:6}}>
                    <TableBtn label="+ Add Col"    onClick={addCol}    color="#27ae60"/>
                    <TableBtn label="− Remove Col" onClick={removeCol} color="#e74c3c"/>
                  </div>
                </div>
                <div style={{fontSize:'0.7rem',color:'#555',marginBottom:6}}>Double-click any cell to edit its text</div>
              </>)}
              <div style={{...panel,marginTop:12}}>
                <div style={{fontSize:'0.72rem',color:'#888',marginBottom:8}}>Insert New Table</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                  <div>
                    <div style={{fontSize:'0.7rem',color:'#666',marginBottom:3}}>Rows</div>
                    <input type="number" min={1} max={50} value={newRows} onChange={e=>setNewRows(Number(e.target.value))} style={{...inp,textAlign:'center'}}/>
                  </div>
                  <div>
                    <div style={{fontSize:'0.7rem',color:'#666',marginBottom:3}}>Columns</div>
                    <input type="number" min={1} max={12} value={newCols} onChange={e=>setNewCols(Number(e.target.value))} style={{...inp,textAlign:'center'}}/>
                  </div>
                </div>
                <button onClick={insertTable} style={{width:'100%',padding:'8px',borderRadius:8,border:'none',background:accent,color:'white',cursor:'pointer',fontWeight:600,fontSize:'0.82rem'}}>
                  Insert {newRows}×{newCols} Table
                </button>
              </div>
            </div>
          )}

          {/* ── INSERT TAB ── */}
          {activeTab==='insert' && (
            <div>
              <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#555',marginBottom:10}}>
                Insert after selected element
              </div>
              {[
                {kind:'heading',   icon:'H',  label:'Heading',   desc:'H2 heading block'},
                {kind:'paragraph', icon:'¶',  label:'Paragraph', desc:'Body text block'},
                {kind:'callout',   icon:'💡', label:'Callout',   desc:'Tip / note box'},
                {kind:'card',      icon:'▣',  label:'Card',      desc:'Shadowed content card'},
                {kind:'divider',   icon:'—',  label:'Divider',   desc:'Horizontal rule'},
              ].map(({kind,icon,label,desc})=>(
                <button key={kind} onClick={()=>insertEl(kind)} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',
                  background:'#1a1a2e',border:'1px solid #252540',borderRadius:8,cursor:'pointer',
                  marginBottom:7,textAlign:'left',
                }}>
                  <span style={{fontSize:'1.1rem',width:26,textAlign:'center'}}>{icon}</span>
                  <div>
                    <div style={{fontSize:'0.83rem',color:'#ddd',fontWeight:600}}>{label}</div>
                    <div style={{fontSize:'0.71rem',color:'#555'}}>{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── IMAGE TAB ── */}
          {activeTab==='image' && (
            <div>
              <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#555',marginBottom:10}}>Images</div>
              <div style={panel}>
                <div style={{fontSize:'0.72rem',color:'#888',marginBottom:8}}>Upload from device</div>
                <input ref={imgUpRef} type="file" accept="image/*" onChange={handleImageUpload} style={{display:'none'}}/>
                <button onClick={()=>imgUpRef.current?.click()} style={{
                  width:'100%',padding:'10px',borderRadius:8,border:`1px dashed ${accent}`,
                  background:'transparent',color:accent,cursor:'pointer',fontWeight:600,fontSize:'0.85rem',marginBottom:6,
                }}>
                  📁 {selected?.tag==='img' ? 'Replace Selected Image' : 'Upload & Insert Image'}
                </button>
                {uploadedPreview && (
                  <div style={{marginTop:8}}>
                    <div style={{fontSize:'0.7rem',color:'#555',marginBottom:4}}>Preview</div>
                    <iframe
                      srcDoc={`<html><body style="margin:0;background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh"><img src="${uploadedPreview}" style="max-width:100%;max-height:200px;border-radius:6px;box-shadow:0 2px 12px rgba(0,0,0,0.5)"/></body></html>`}
                      style={{width:'100%',height:160,border:'1px solid #252540',borderRadius:8,display:'block'}}
                      title="Image Preview"
                    />
                    <button onClick={()=>{
                      if(selected?.tag==='img') send({type:'replaceImage',id:selected.id,src:uploadedPreview});
                      else send({type:'insertHtml',html:TEMPLATES.image(uploadedPreview)});
                      setUploadedPreview(null);
                    }} style={{width:'100%',marginTop:6,padding:'7px',borderRadius:8,border:'none',background:'#27ae60',color:'white',cursor:'pointer',fontWeight:600,fontSize:'0.82rem'}}>
                      ✓ Insert into Document
                    </button>
                    <button onClick={()=>setUploadedPreview(null)} style={{width:'100%',marginTop:4,padding:'5px',borderRadius:8,border:'1px solid #333',background:'transparent',color:'#666',cursor:'pointer',fontSize:'0.78rem'}}>Cancel</button>
                  </div>
                )}
              </div>
              <div style={panel}>
                <div style={{fontSize:'0.72rem',color:'#888',marginBottom:6}}>Or insert by URL</div>
                <input id="imgUrlInput" placeholder="https://example.com/photo.jpg" style={{...inp,marginBottom:6}} onChange={e=>setUrlPreview(e.target.value)}/>
                {urlPreview && (
                  <iframe
                    srcDoc={`<html><body style="margin:0;background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh"><img src="${urlPreview}" style="max-width:100%;max-height:160px;border-radius:6px" onerror="this.style.display='none';document.body.innerHTML='<p style=color:#555;font-family:sans-serif;padding:20px>Could not load image</p>'"/></body></html>`}
                    style={{width:'100%',height:130,border:'1px solid #252540',borderRadius:8,display:'block',marginBottom:6}}
                    title="URL Preview"
                  />
                )}
                <button onClick={()=>{
                  const src = document.getElementById('imgUrlInput')?.value?.trim();
                  if(!src) return;
                  if(selected?.tag==='img') send({type:'replaceImage',id:selected.id,src});
                  else send({type:'insertHtml',html:TEMPLATES.image(src)});
                  setUrlPreview('');
                  document.getElementById('imgUrlInput').value='';
                }} style={{width:'100%',padding:'8px',borderRadius:8,border:'none',background:accent,color:'white',cursor:'pointer',fontWeight:600,fontSize:'0.82rem'}}>
                  Insert from URL
                </button>
              </div>
              {selected?.tag==='img' && (
                <div style={{...panel,marginTop:4}}>
                  <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#555',marginBottom:6}}>Image Style</div>
                  <SliderRow label="Width"         k="width"        min={10} max={100} unit="%"/>
                  <SliderRow label="Border Radius" k="borderRadius" min={0}  max={40}  unit="px"/>
                  <SliderRow label="Opacity"       k="opacity"      min={0}  max={100} unit="%"/>
                  <ColorRow  label="Border Color"  k="borderColor"/>
                  <div style={{...row_,marginTop:4}}>
                    <span style={{fontSize:'0.8rem',color:'#bbb'}}>Border</span>
                    <select value={elStyles.borderStyle} onChange={e=>pushStyle({borderStyle:e.target.value})} style={{...inp,width:'auto'}}>
                      {['none','solid','dashed','dotted'].map(b=><option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  {elStyles.borderStyle!=='none'&&<SliderRow label="Border Width" k="borderWidth" min={1} max={10} unit="px"/>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* download */}
        <div style={{padding:'10px',borderTop:'1px solid #1e1e32',flexShrink:0}}>
          <button onClick={handleDownload} disabled={downloading||noHtml} style={{
            width:'100%',padding:'11px',borderRadius:8,border:'none',
            background:noHtml?'#1a1a2e':downloading?'#333':'linear-gradient(135deg,#27ae60,#2ecc71)',
            color:noHtml?'#444':'white',fontWeight:700,fontSize:'0.9rem',cursor:noHtml?'not-allowed':'pointer',
          }}>
            {downloading?'Rendering PDF…':'⬇ Download PDF'}
          </button>
        </div>
      </div>

      {/* ── PREVIEW AREA ── */}
      <div style={{position:'relative',overflow:'hidden',background:'#1a1a2e'}}>
        {noHtml ? (
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',flexDirection:'column',gap:12,color:'#333'}}>
            <div style={{fontSize:'3rem'}}>📄</div>
            <div style={{fontSize:'0.9rem'}}>No report loaded — generate one first</div>
            <button onClick={()=>navigate(-1)} style={{padding:'9px 20px',borderRadius:8,border:`1px solid ${accent}`,background:'transparent',color:accent,cursor:'pointer',fontWeight:600}}>← Back to Builder</button>
          </div>
        ) : (
          <>
            {/* Edit iframe — always mounted so state is preserved, just hidden in pdf mode */}
            <iframe
              ref={iframeRef}
              srcDoc={liveHtml}
              style={{
                width:'100%', height:'100%', border:'none', display:'block',
                // hide rather than unmount so the bridge stays alive
                visibility: viewMode==='edit' ? 'visible' : 'hidden',
                position: 'absolute', inset: 0,
              }}
              title="PDF Editor Preview"
            />

            {/* PDF preview iframe */}
            {viewMode === 'pdf' && (
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                {pdfLoading ? (
                  <div style={{color:'#555',fontSize:'0.9rem',textAlign:'center'}}>
                    <div style={{fontSize:'2.5rem',marginBottom:12}}>⏳</div>
                    Rendering PDF preview…
                  </div>
                ) : pdfError ? (
                  <div style={{color:'#e74c3c',fontSize:'0.85rem',textAlign:'center',padding:24}}>
                    <div style={{fontSize:'2rem',marginBottom:8}}>⚠️</div>
                    {pdfError}
                    <br/>
                    <button onClick={loadPdfPreview} style={{marginTop:12,padding:'7px 16px',borderRadius:8,border:`1px solid ${accent}`,background:'transparent',color:accent,cursor:'pointer',fontWeight:600}}>Retry</button>
                  </div>
                ) : pdfBlobUrl ? (
                  <iframe
                    src={pdfBlobUrl}
                    style={{width:'100%',height:'100%',border:'none',display:'block'}}
                    title="PDF Preview"
                  />
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}