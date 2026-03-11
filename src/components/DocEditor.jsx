// src/components/DocEditor.jsx
// Route: /doc-editor
// Registered in App.jsx as: <Route path="/doc-editor" element={<DocEditor />} />
//
// Accepts router state:
//   { viewType: 'pdf'       } — dataUrl → native <object> embed
//   { viewType: 'image'     } — dataUrl → <img> fullscreen
//   { viewType: 'html'      } — htmlContent (raw HTML string) → srcdoc iframe
//   { viewType: 'converted' } — htmlContent (server-converted styled HTML) → srcdoc iframe
//   { viewType: undefined   } — legacy fallback: treat dataUrl as pdf

import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DocEditor() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const iframeRef  = useRef(null);

  const {
    dataUrl      = null,
    htmlContent  = null,
    fileName     = 'document',
    mimeType     = 'application/pdf',
    viewType     = 'pdf',
    convertedFrom = null,
    slideCount   = null,
  } = state || {};

  const [zoom, setZoom] = useState(100);
  const accent = '#7c6fff';

  // ── No state → go back ────────────────────────────────────────────────────
  if (!dataUrl && !htmlContent) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0d0d1a', color:'#555', flexDirection:'column', gap:12 }}>
        <div style={{ fontSize:'3rem' }}>📄</div>
        <div style={{ fontSize:'0.9rem' }}>No document loaded.</div>
        <button onClick={() => navigate(-1)} style={{ padding:'8px 20px', borderRadius:8, border:`1px solid ${accent}`, background:'transparent', color:accent, cursor:'pointer', fontWeight:600 }}>← Back</button>
      </div>
    );
  }

  const isPdf      = viewType === 'pdf';
  const isImage    = viewType === 'image';
  const isHtml     = viewType === 'html' || viewType === 'converted';
  const showZoom   = !isPdf && !isImage;

  // ── Download original (for PDF/image — we have the data URL) ─────────────
  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    a.click();
  };

  // ── Download converted HTML as PDF via server ─────────────────────────────
  const handleDownloadPdf = async () => {
    if (isPdf && dataUrl) { handleDownload(); return; }
    const content = htmlContent || '';
    if (!content.trim()) return;
    try {
      const fd = new FormData();
      fd.append('html', new Blob([content], { type:'text/html' }), 'doc.html');
      fd.append('styleManifest', JSON.stringify({}));
      const res = await fetch('http://localhost:3000/api/render-pdf-form', { method:'POST', body:fd });
      if (!res.ok) throw new Error('PDF render failed');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url;
      a.download = fileName.replace(/\.[^.]+$/, '') + '.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { alert('PDF download failed: ' + e.message); }
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const panel  = { background:'#12121f', borderRadius:10, padding:'12px 14px', marginBottom:10, border:'1px solid #1e1e32' };
  const btnRow = { width:'100%', padding:'9px', borderRadius:8, border:'none', fontWeight:600, fontSize:'0.82rem', cursor:'pointer', marginBottom:7, display:'flex', alignItems:'center', justifyContent:'center', gap:7 };

  // Human-readable format badge
  const formatBadge = () => {
    if (convertedFrom === 'docx') return { label:'Word Document', color:'#2b5797', icon:'📝' };
    if (convertedFrom === 'xlsx') return { label:'Excel Spreadsheet', color:'#217346', icon:'📊' };
    if (convertedFrom === 'pptx') return { label:'PowerPoint' + (slideCount ? ` · ${slideCount} slides` : ''), color:'#d04423', icon:'📋' };
    if (convertedFrom === 'text') return { label:'Text File', color:'#555', icon:'📄' };
    if (isPdf)   return { label:'PDF Document', color:'#e44', icon:'📄' };
    if (isImage) return { label:'Image', color:'#888', icon:'🖼️' };
    return { label:'HTML Document', color:'#3498db', icon:'🌐' };
  };
  const badge = formatBadge();

  // ── Viewer content ────────────────────────────────────────────────────────
  const renderViewer = () => {
    if (isPdf) {
      return (
        <object
          ref={iframeRef}
          data={dataUrl}
          type="application/pdf"
          style={{ width:'100%', height:'100%', border:'none', display:'block' }}
        >
          <embed src={dataUrl} type="application/pdf" style={{ width:'100%', height:'100%', border:'none' }}/>
          <div style={{ textAlign:'center', padding:60, color:'#888' }}>
            <p style={{ marginBottom:16 }}>Browser blocked the inline PDF viewer.</p>
            <a href={dataUrl} download={fileName} style={{ color:accent, fontWeight:600, fontSize:'1rem' }}>⬇ Download PDF to view</a>
          </div>
        </object>
      );
    }

    if (isImage) {
      return (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%', overflow:'auto', padding:24 }}>
          <img
            src={dataUrl}
            alt={fileName}
            style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', borderRadius:6, boxShadow:'0 4px 32px rgba(0,0,0,0.5)' }}
          />
        </div>
      );
    }

    if (isHtml) {
      // Use srcdoc for server-converted or raw HTML — never puts binary in src
      const scale = zoom / 100;
      return (
        <div style={{ width:'100%', height:'100%', overflow:'auto', background: convertedFrom === 'pptx' ? '#404040' : '#f0f0f0', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ transformOrigin:'top center', transform:`scale(${scale})`, width: scale < 1 ? `${100/scale}%` : '100%', minHeight:'100%' }}>
            <iframe
              ref={iframeRef}
              srcDoc={htmlContent}
              sandbox="allow-same-origin"
              style={{
                width:'100%',
                minHeight: convertedFrom === 'pptx' ? `${(slideCount || 1) * 800}px` : '100vh',
                border:'none',
                display:'block',
                background:'transparent',
              }}
              title="Document Viewer"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', height:'100vh', background:'#0d0d1a', color:'#eee', fontFamily:'system-ui,sans-serif', overflow:'hidden' }}>

      {/* ── SIDEBAR ── */}
      <div style={{ display:'flex', flexDirection:'column', borderRight:'1px solid #1e1e32', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ padding:'12px 14px', borderBottom:'1px solid #1e1e32', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
            <h2 style={{ margin:0, fontSize:'0.9rem', fontWeight:800, background:`linear-gradient(135deg,${accent},#48dbfb)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Doc Viewer
            </h2>
            <button onClick={() => navigate(-1)} style={{ background:'none', border:'1px solid #333', color:'#666', borderRadius:7, padding:'3px 8px', cursor:'pointer', fontSize:'0.7rem' }}>← Back</button>
          </div>

          {/* File name */}
          <div style={{ fontSize:'0.72rem', color:'#555', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:6 }} title={fileName}>
            {badge.icon} {fileName}
          </div>

          {/* Format badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', borderRadius:5, background:`${badge.color}22`, border:`1px solid ${badge.color}44`, fontSize:'0.68rem', fontWeight:700, color:badge.color }}>
            {badge.label}
          </div>
        </div>

        <div style={{ overflowY:'auto', flex:1, padding:'10px' }}>

          {/* Zoom — only for HTML views */}
          {showZoom && (
            <div style={panel}>
              <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', color:'#555', marginBottom:8, letterSpacing:'0.07em' }}>Zoom</div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:'0.8rem', color:'#bbb' }}>Scale</span>
                <span style={{ fontFamily:'monospace', fontSize:'0.75rem', color:'#555' }}>{zoom}%</span>
              </div>
              <input type="range" min={50} max={200} step={5} value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                style={{ width:'100%', accentColor:accent }}/>
              <div style={{ display:'flex', gap:5, marginTop:8 }}>
                {[75, 100, 125, 150].map(z => (
                  <button key={z} onClick={() => setZoom(z)} style={{
                    flex:1, padding:'4px', borderRadius:5, fontSize:'0.7rem', fontWeight:600, cursor:'pointer',
                    border:`1px solid ${zoom === z ? accent : '#333'}`,
                    background: zoom === z ? accent : '#1a1a2e',
                    color: zoom === z ? 'white' : '#666',
                  }}>{z}%</button>
                ))}
              </div>
            </div>
          )}

          {/* Export */}
          <div style={panel}>
            <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', color:'#555', marginBottom:10, letterSpacing:'0.07em' }}>Export</div>

            {/* Download original — only if we have a data URL */}
            {dataUrl && (
              <button onClick={handleDownload} style={{ ...btnRow, background:'#1a1a2e', border:`1px solid ${accent}`, color:accent }}>
                ⬇ Download Original
              </button>
            )}

            {/* Download as PDF — for any HTML view */}
            {isHtml && (
              <button onClick={handleDownloadPdf} style={{ ...btnRow, background:'linear-gradient(135deg,#27ae60,#2ecc71)', color:'white' }}>
                📄 Save as PDF
              </button>
            )}

            {/* PDF download for PDFs */}
            {isPdf && dataUrl && (
              <button onClick={handleDownload} style={{ ...btnRow, background:'linear-gradient(135deg,#27ae60,#2ecc71)', color:'white' }}>
                📄 Download PDF
              </button>
            )}
          </div>

          {/* About */}
          <div style={{ ...panel, background:'rgba(124,111,255,0.04)' }}>
            <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', color:'#555', marginBottom:8 }}>About This View</div>
            <div style={{ fontSize:'0.72rem', color:'#666', lineHeight:1.7 }}>
              {isPdf && <>Your PDF is rendered by the <strong style={{ color:'#888' }}>browser's native engine</strong> — exactly as it appears in Acrobat or Preview. No conversion, no quality loss.</>}
              {isImage && <>Image displayed at native resolution.</>}
              {convertedFrom === 'docx' && <>Word document converted to styled HTML via <strong style={{ color:'#888' }}>Mammoth</strong>. All text, headings, tables, lists, bold, italic, and embedded images are preserved.</>}
              {convertedFrom === 'xlsx' && <>Excel spreadsheet rendered as a styled table. All sheets, merged cells, column widths, and formatting are preserved.</>}
              {convertedFrom === 'pptx' && <>PowerPoint slides rendered individually at correct aspect ratio. Text positions and images are extracted from the original file.</>}
              {convertedFrom === 'text' && <>Plain text file displayed with monospace formatting.</>}
              {viewType === 'html' && !convertedFrom && <>HTML file displayed in a sandboxed iframe.</>}
            </div>
          </div>

          {/* Open in edit mode */}
          <div style={panel}>
            <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', color:'#555', marginBottom:8 }}>Want to Edit?</div>
            <button onClick={() => navigate(-1)} style={{ ...btnRow, background:`linear-gradient(135deg,${accent},#48dbfb)`, color:'white', marginBottom:0 }}>
              ✦ Open in Edit Mode
            </button>
            <div style={{ fontSize:'0.68rem', color:'#444', marginTop:6, lineHeight:1.5 }}>
              Goes back to upload panel — switch to Edit Mode and re-open for full AI editing.
            </div>
          </div>

        </div>
      </div>

      {/* ── DOCUMENT VIEWER ── */}
      <div style={{
        position:'relative',
        background: isPdf ? '#525252' : isImage ? '#1a1a2e' : convertedFrom === 'pptx' ? '#404040' : '#e8e8e8',
        overflow: isPdf || isImage ? 'hidden' : 'auto',
        display:'flex',
        flexDirection:'column',
      }}>
        {renderViewer()}
      </div>

    </div>
  );
}