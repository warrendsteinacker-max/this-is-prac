// import { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// // ── Override injector ──────────────────────────────────────────────────────
// const injectOverrides = (html, ov) => {
//   const style = `
// <style id="__overrides__">
//   *, *::before, *::after { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; color-adjust:exact !important; }
//   html { background:${ov.bgColor} !important; background-color:${ov.bgColor} !important; }
//   body { background:${ov.bgColor} !important; background-color:${ov.bgColor} !important; color:${ov.textColor} !important; font-size:${ov.fontSize}px !important; line-height:${ov.lineHeight} !important; }
//   body div:not([class*="cover"]):not([class*="header"]):not([class*="card"]):not([class*="callout"]):not([class*="badge"]):not([class*="tag"]):not([class*="chip"]):not([class*="highlight"]),
//   body main,body article,body section,body aside,body nav,body .main-content,body .report-wrapper,body .content { background:transparent !important; background-color:transparent !important; }
//   h1,h2,h3,h4,h5,h6 { color:${ov.headingColor} !important; }
//   a { color:${ov.linkColor} !important; }
//   thead,thead tr,thead th { background:${ov.tableHeaderBg} !important; background-color:${ov.tableHeaderBg} !important; color:#fff !important; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
//   section,article,.section { padding:${ov.sectionPadding}px !important; }
//   ${ov.hideFeatures.map(f=>`[data-feature="${f}"] { display:none !important; }`).join('\n  ')}
// </style>`;
//   const script = `<script id="__override_script__">(function(){var bg=${JSON.stringify(ov.bgColor)},text=${JSON.stringify(ov.textColor)},heading=${JSON.stringify(ov.headingColor)},tableH=${JSON.stringify(ov.tableHeaderBg)};function applyBg(){document.documentElement.style.setProperty('background',bg,'important');document.documentElement.style.setProperty('background-color',bg,'important');document.body.style.setProperty('background',bg,'important');document.body.style.setProperty('background-color',bg,'important');document.body.style.setProperty('color',text,'important');var all=document.querySelectorAll('*');for(var i=0;i<all.length;i++){var el=all[i],tag=el.tagName,cls=(el.className||'').toString().toLowerCase(),inline=el.getAttribute('style')||'';var isKeeper=cls.includes('cover')||cls.includes('card')||cls.includes('callout')||cls.includes('badge')||cls.includes('tag')||cls.includes('chip')||cls.includes('highlight')||cls.includes('alert')||cls.includes('banner')||cls.includes('hero')||(cls.includes('header')&&(cls.includes('page')||cls.includes('report')))||tag==='BUTTON'||tag==='CODE'||tag==='PRE'||tag==='THEAD'||tag==='TH';if(isKeeper){if(tag==='THEAD'||tag==='TH'||(tag==='TR'&&el.closest('thead'))){el.style.setProperty('background',tableH,'important');el.style.setProperty('background-color',tableH,'important');el.style.setProperty('color','#fff','important');el.style.setProperty('-webkit-print-color-adjust','exact','important');el.style.setProperty('print-color-adjust','exact','important');}continue;}if(inline.includes('background')){var computed=window.getComputedStyle(el).backgroundColor;var isWhite=computed==='rgb(255, 255, 255)'||computed==='rgba(0,0,0,0)'||computed==='transparent';if(!isWhite){el.style.setProperty('-webkit-print-color-adjust','exact','important');el.style.setProperty('print-color-adjust','exact','important');}else{el.style.removeProperty('background');el.style.removeProperty('background-color');}}if(['H1','H2','H3','H4','H5','H6'].includes(tag))el.style.setProperty('color',heading,'important');}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyBg);else applyBg();})();<\/script>`;
//   let result = html;
//   if (result.includes('</head>')) result = result.replace('</head>', style+'</head>');
//   else result = style + result;
//   if (result.includes('</body>')) result = result.replace('</body>', script+'</body>');
//   else result = result + script;
//   return result;
// };

// // ── Citation API ───────────────────────────────────────────────────────────
// async function generateCitationsFromSource(sourceText, format) {
//   const res = await fetch('http://localhost:3000/api/generate-citations', {
//     method:'POST', headers:{'Content-Type':'application/json'},
//     body: JSON.stringify({ description: sourceText, format }),
//   });
//   if (!res.ok) throw new Error('Citation generation failed');
//   return res.json();
// }

// // ── Source entry component ─────────────────────────────────────────────────
// function SourceEntry({ idx, entry, onChange, onRemove, onGenerate, accent, inp }) {
//   return (
//     <div style={{ background:'#1a1a2e', border:'1px solid #252540', borderRadius:8, padding:12, marginBottom:8 }}>
//       <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
//         <span style={{ fontSize:'0.75rem', color:'#555', fontWeight:700 }}>Source {idx+1}</span>
//         <button onClick={onRemove} style={{ background:'none', border:'none', color:'#444', cursor:'pointer', fontSize:'0.85rem' }}>✕</button>
//       </div>
//       <textarea value={entry.raw} onChange={e=>onChange({...entry,raw:e.target.value})}
//         placeholder={`Paste source info…\ne.g. "Smith, John. 2021. Deep Learning. MIT Press."\nor "CDC.gov, COVID vaccines, March 2022"`}
//         style={{ ...inp, minHeight:65, resize:'vertical', marginBottom:8 }}/>
//       {entry.loading && <div style={{ fontSize:'0.72rem', color:accent, marginBottom:6 }}>⏳ Generating…</div>}
//       {entry.error   && <div style={{ fontSize:'0.72rem', color:'#e74c3c', marginBottom:6 }}>{entry.error}</div>}
//       {entry.result ? (
//         <div style={{ fontSize:'0.72rem', lineHeight:1.6 }}>
//           <div style={{ color:'#555', marginBottom:2 }}>PARENTHETICAL</div>
//           <div style={{ fontFamily:'monospace', color:'#aaa', background:'#0d0d1a', padding:'4px 8px', borderRadius:4, marginBottom:6 }}>{entry.result.intext}</div>
//           <div style={{ color:'#555', marginBottom:2 }}>NARRATIVE</div>
//           <div style={{ fontFamily:'monospace', color:'#aaa', background:'#0d0d1a', padding:'4px 8px', borderRadius:4, marginBottom:6 }}>{entry.result.narrative}</div>
//           <div style={{ color:'#555', marginBottom:2 }}>REFERENCE ENTRY</div>
//           <div style={{ fontFamily:'monospace', color:'#aaa', background:'#0d0d1a', padding:'4px 8px', borderRadius:4, lineHeight:1.5 }}>{entry.result.reference}</div>
//         </div>
//       ) : (
//         <button onClick={()=>onGenerate(idx)} disabled={!entry.raw.trim()||entry.loading}
//           style={{ width:'100%', padding:'6px', borderRadius:6, border:'none', background:entry.raw.trim()?accent:'#222', color:entry.raw.trim()?'white':'#444', cursor:entry.raw.trim()?'pointer':'not-allowed', fontWeight:600, fontSize:'0.78rem' }}>
//           ✦ Generate Citation
//         </button>
//       )}
//     </div>
//   );
// }

// // ── AI Chat updater ────────────────────────────────────────────────────────
// function AiChatPanel({ html, onUpdate, accent, inp }) {
//   const [messages, setMessages] = useState([
//     { role:'assistant', text:'Report generated! Ask me to make any changes — e.g. "Make the headings blue", "Add a section about X", "Change the table to show quarterly data".' }
//   ]);
//   const [input, setInput] = useState('');
//   const [busy,  setBusy]  = useState(false);
//   const bottomRef = useRef(null);

//   useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

//   const send = async () => {
//     const msg = input.trim(); if (!msg || busy) return;
//     setInput('');
//     setMessages(m => [...m, { role:'user', text:msg }]);
//     setBusy(true);
//     try {
//       const res = await fetch('http://localhost:3000/api/update-report', {
//         method:'POST', headers:{'Content-Type':'application/json'},
//         body: JSON.stringify({ html, instruction: msg }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Update failed');
//       onUpdate(data.html);
//       setMessages(m => [...m, { role:'assistant', text: data.summary || 'Done! Report updated.' }]);
//     } catch (err) {
//       setMessages(m => [...m, { role:'assistant', text:`❌ ${err.message}` }]);
//     } finally { setBusy(false); }
//   };

//   return (
//     <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
//       <div style={{ maxHeight:220, overflowY:'auto', padding:'8px 0', marginBottom:6 }}>
//         {messages.map((m, i) => (
//           <div key={i} style={{ marginBottom:8, display:'flex', flexDirection:'column', alignItems: m.role==='user'?'flex-end':'flex-start' }}>
//             <div style={{
//               maxWidth:'92%', padding:'7px 10px', borderRadius:10, fontSize:'0.78rem', lineHeight:1.5,
//               background: m.role==='user' ? accent : '#1a1a2e',
//               color: m.role==='user' ? 'white' : '#ccc',
//               borderBottomRightRadius: m.role==='user' ? 2 : 10,
//               borderBottomLeftRadius:  m.role==='user' ? 10 : 2,
//             }}>{m.text}</div>
//           </div>
//         ))}
//         {busy && (
//           <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 0' }}>
//             <div style={{ width:6, height:6, borderRadius:'50%', background:accent, animation:'pulse 1s infinite' }}/>
//             <span style={{ fontSize:'0.72rem', color:'#555' }}>Updating report…</span>
//           </div>
//         )}
//         <div ref={bottomRef}/>
//       </div>
//       <div style={{ display:'flex', gap:6 }}>
//         <input value={input} onChange={e=>setInput(e.target.value)}
//           onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); }}}
//           placeholder="e.g. Make headings navy, add a summary section…"
//           style={{ ...inp, flex:1, padding:'7px 10px' }}/>
//         <button onClick={send} disabled={!input.trim()||busy} style={{
//           padding:'7px 14px', borderRadius:6, border:'none',
//           background: input.trim()&&!busy ? accent : '#222',
//           color: input.trim()&&!busy ? 'white' : '#444',
//           cursor: input.trim()&&!busy ? 'pointer' : 'not-allowed', fontWeight:700, fontSize:'0.82rem',
//         }}>↑</button>
//       </div>
//       <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
//     </div>
//   );
// }

// // ── Saved Docs Panel ───────────────────────────────────────────────────────
// function SavedDocsPanel({ onOpen, accent }) {
//   const [docs,    setDocs]    = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error,   setError]   = useState(null);

//   const load = async () => {
//     setLoading(true); setError(null);
//     try {
//       const res  = await fetch('http://localhost:3000/api/documents');
//       if (!res.ok) throw new Error(`Server returned ${res.status}`);
//       const data = await res.json();
//       setDocs(data.documents || []);
//     } catch(e) { setError(e.message); setDocs([]); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, []);

//   const del = async (id, e) => {
//     e.stopPropagation();
//     try {
//       await fetch(`http://localhost:3000/api/documents/${id}`, { method:'DELETE' });
//       load();
//     } catch(e) { alert('Delete failed: ' + e.message); }
//   };

//   const redownload = async (doc, e) => {
//     e.stopPropagation();
//     try {
//       const full = await fetch(`http://localhost:3000/api/documents/${doc.id}`);
//       if (!full.ok) throw new Error('Could not fetch document');
//       const data = await full.json();
//       const fd = new FormData();
//       fd.append('html', new Blob([data.html || ''], { type: 'text/html' }), 'report.html');
//       fd.append('styleManifest', JSON.stringify(data.manifesto ?? {}));
//       const pdfRes = await fetch('http://localhost:3000/api/render-pdf-form', { method: 'POST', body: fd });
//       if (!pdfRes.ok) throw new Error('PDF render failed');
//       const blob = await pdfRes.blob();
//       const url  = URL.createObjectURL(blob);
//       const a    = document.createElement('a');
//       a.href = url;
//       a.download = `${doc.title.replace(/[^a-z0-9]/gi,'_').slice(0,40)}.pdf`;
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch(e) { alert('Download failed: ' + e.message); }
//   };

//   if (loading) return (
//     <div style={{textAlign:'center',padding:'16px 0',color:'#555',fontSize:'0.78rem'}}>
//       <div style={{marginBottom:6}}>⏳</div>Loading saved docs…
//     </div>
//   );
//   if (error) return (
//     <div style={{fontSize:'0.75rem',color:'#e74c3c',padding:'8px 0',lineHeight:1.5}}>
//       ⚠️ {error}<br/>
//       <button onClick={load} style={{marginTop:6,color:accent,background:'none',border:'none',cursor:'pointer',fontSize:'0.75rem',textDecoration:'underline'}}>Retry</button>
//     </div>
//   );
//   if (!docs.length) return (
//     <div style={{fontSize:'0.75rem',color:'#444',padding:'8px 0',textAlign:'center'}}>
//       No saved documents yet.<br/>
//       <span style={{fontSize:'0.68rem',color:'#333'}}>Generate a report to get started.</span>
//     </div>
//   );

//   return (
//     <div style={{display:'flex',flexDirection:'column',gap:6}}>
//       {docs.map(doc => (
//         <div key={doc.id}
//           onClick={()=>onOpen(doc)}
//           style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px',background:'#1a1a2e',border:'1px solid #252540',borderRadius:8,cursor:'pointer',transition:'border-color .15s'}}
//           onMouseEnter={e=>e.currentTarget.style.borderColor=accent}
//           onMouseLeave={e=>e.currentTarget.style.borderColor='#252540'}
//         >
//           <span style={{fontSize:'1.1rem'}}>📄</span>
//           <div style={{flex:1,minWidth:0}}>
//             <div style={{fontSize:'0.82rem',color:'#ddd',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{doc.title}</div>
//             <div style={{fontSize:'0.68rem',color:'#444',marginTop:1}}>{new Date(doc.updatedAt).toLocaleString()}</div>
//           </div>
//           <button onClick={e=>redownload(doc,e)} title="Re-download PDF"
//             style={{background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:'0.8rem',padding:'2px 4px'}}
//             onMouseEnter={e=>e.currentTarget.style.color='#27ae60'}
//             onMouseLeave={e=>e.currentTarget.style.color='#555'}>
//             ⬇
//           </button>
//           <button onClick={e=>del(doc.id,e)} title="Delete document"
//             style={{background:'none',border:'none',color:'#333',cursor:'pointer',fontSize:'0.85rem',padding:'2px 4px'}}
//             onMouseEnter={e=>e.currentTarget.style.color='#e74c3c'}
//             onMouseLeave={e=>e.currentTarget.style.color='#333'}>
//             🗑
//           </button>
//         </div>
//       ))}
//       <button onClick={load} style={{width:'100%',padding:'5px',borderRadius:6,border:'1px solid #252540',background:'transparent',color:'#555',cursor:'pointer',fontSize:'0.72rem',marginTop:4}}>
//         🔄 Refresh
//       </button>
//     </div>
//   );
// }

// // ── Saved PDFs Panel ───────────────────────────────────────────────────────
// function SavedPdfsPanel({ accent }) {
//   const [pdfs,    setPdfs]    = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [dir,     setDir]     = useState('');
//   const [error,   setError]   = useState(null);

//   const load = async () => {
//     setLoading(true); setError(null);
//     try {
//       const res  = await fetch('http://localhost:3000/api/pdfs');
//       if (!res.ok) throw new Error(`Server returned ${res.status}`);
//       const data = await res.json();
//       setPdfs(data.pdfs || []);
//       setDir(data.directory || '');
//     } catch(e) { setError(e.message); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, []);

//   const download = async (filename) => {
//     try {
//       const res  = await fetch(`http://localhost:3000/api/pdfs/${encodeURIComponent(filename)}`);
//       if (!res.ok) throw new Error('Download failed');
//       const blob = await res.blob();
//       const url  = URL.createObjectURL(blob);
//       const a    = document.createElement('a');
//       a.href = url; a.download = filename; a.click();
//       URL.revokeObjectURL(url);
//     } catch(e) { alert('Download error: ' + e.message); }
//   };

//   const fmt = (bytes) => bytes > 1024*1024 ? `${(bytes/1024/1024).toFixed(1)} MB` : `${Math.round(bytes/1024)} KB`;

//   if (loading) return <div style={{fontSize:'0.75rem',color:'#555',padding:'8px 0'}}>⏳ Loading PDFs…</div>;
//   if (error)   return (
//     <div style={{fontSize:'0.75rem',color:'#e74c3c',padding:'8px 0'}}>
//       ⚠️ {error}
//       <button onClick={load} style={{marginTop:6,display:'block',color:accent,background:'none',border:'none',cursor:'pointer',fontSize:'0.72rem',textDecoration:'underline'}}>Retry</button>
//     </div>
//   );

//   return (
//     <div>
//       {dir && (
//         <div style={{fontSize:'0.66rem',color:'#333',marginBottom:8,lineHeight:1.5,wordBreak:'break-all',fontFamily:'monospace',background:'#0d0d1a',padding:'5px 8px',borderRadius:5}}>
//           📁 {dir}
//         </div>
//       )}
//       {!pdfs.length ? (
//         <div style={{fontSize:'0.75rem',color:'#444',padding:'4px 0'}}>No PDFs saved yet. Generate a report to auto-save PDFs here.</div>
//       ) : (
//         <div style={{display:'flex',flexDirection:'column',gap:5}}>
//           {pdfs.map(p => (
//             <div key={p.filename}
//               style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',background:'#1a1a2e',border:'1px solid #252540',borderRadius:7}}>
//               <span style={{fontSize:'1rem'}}>📄</span>
//               <div style={{flex:1,minWidth:0}}>
//                 <div style={{fontSize:'0.8rem',color:'#ddd',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.title}</div>
//                 <div style={{fontSize:'0.67rem',color:'#444',marginTop:1}}>{fmt(p.size)} · {new Date(p.savedAt).toLocaleString()}</div>
//               </div>
//               <button onClick={()=>download(p.filename)}
//                 style={{background:'none',border:`1px solid ${accent}`,color:accent,borderRadius:5,padding:'3px 8px',cursor:'pointer',fontSize:'0.72rem',fontWeight:600,whiteSpace:'nowrap'}}>
//                 ⬇ Get
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//       <button onClick={load} style={{marginTop:8,width:'100%',padding:'5px',borderRadius:6,border:'1px solid #252540',background:'transparent',color:'#555',cursor:'pointer',fontSize:'0.72rem',display:'flex',alignItems:'center',justifyContent:'center',gap:5}}>
//         🔄 Refresh
//       </button>
//     </div>
//   );
// }

// // ── UploadDocPanel — View or Edit an existing document ─────────────────────

// function getFileViewStrategy(file) {
//   const name = file.name.toLowerCase();
//   const mime = file.type || '';
//   if (name.endsWith('.pdf') || mime === 'application/pdf')                                          return 'pdf';
//   if (name.match(/\.(png|jpe?g|gif|webp|bmp|svg)$/) || mime.startsWith('image/'))                 return 'image';
//   if (name.match(/\.(docx?|doc)$/)  || mime.includes('word'))                                      return 'convert';
//   if (name.match(/\.(xlsx?|xls)$/)  || mime.includes('spreadsheet') || mime.includes('excel'))     return 'convert';
//   if (name.match(/\.(pptx?|ppt)$/)  || mime.includes('presentation') || mime.includes('powerpoint')) return 'convert';
//   if (name.match(/\.(txt|md|csv|rtf|json|xml|html?|htm)$/) || mime.startsWith('text/'))            return 'convert';
//   return 'convert';
// }

// function fileIcon(file) {
//   const n = file.name.toLowerCase();
//   if (n.endsWith('.pdf'))                              return '📄';
//   if (n.match(/\.docx?$/))                             return '📝';
//   if (n.match(/\.xlsx?$/) || n.endsWith('.csv'))       return '📊';
//   if (n.match(/\.pptx?$/))                             return '📋';
//   if (n.match(/\.(png|jpe?g|gif|webp|bmp|svg)$/))     return '🖼️';
//   if (n.match(/\.html?$/))                             return '🌐';
//   if (n.match(/\.md$/))                                return '📑';
//   return '📄';
// }

// function getFormatLabel(file) {
//   const n = file.name.toLowerCase();
//   if (n.endsWith('.pdf'))   return 'PDF Document';
//   if (n.match(/\.docx?$/)) return 'Word Document';
//   if (n.match(/\.xlsx?$/)) return 'Excel Spreadsheet';
//   if (n.match(/\.pptx?$/)) return 'PowerPoint Presentation';
//   if (n.endsWith('.csv'))   return 'CSV Spreadsheet';
//   if (n.match(/\.html?$/)) return 'HTML Document';
//   if (n.endsWith('.md'))    return 'Markdown File';
//   if (n.endsWith('.txt'))   return 'Text File';
//   return 'Document';
// }

// // Full-screen inline doc preview modal
// function DocPreviewModal({ previewState, onClose, accent }) {
//   const { viewType, dataUrl, htmlContent, fileName, convertedFrom, slideCount } = previewState;
//   const [zoom, setZoom] = useState(100);

//   const isPdf   = viewType === 'pdf';
//   const isImage = viewType === 'image';
//   const isHtml  = !isPdf && !isImage;

//   const handleDownloadPdf = async () => {
//     if (!htmlContent) return;
//     try {
//       const fd = new FormData();
//       fd.append('html', new Blob([htmlContent], { type:'text/html' }), 'doc.html');
//       fd.append('styleManifest', JSON.stringify({}));
//       const res = await fetch('http://localhost:3000/api/render-pdf-form', { method:'POST', body:fd });
//       if (!res.ok) throw new Error('PDF render failed');
//       const blob = await res.blob();
//       const url  = URL.createObjectURL(blob);
//       const a = document.createElement('a'); a.href=url; a.download=fileName.replace(/\.[^.]+$/,'')+'.pdf'; a.click();
//       URL.revokeObjectURL(url);
//     } catch(e) { alert('PDF export failed: '+e.message); }
//   };




//   const handleDownloadOriginal = () => {
//     if (!dataUrl) return;
//     const a = document.createElement('a'); a.href=dataUrl; a.download=fileName; a.click();
//   };

//   const badgeColor = { docx:'#2b5797', xlsx:'#217346', pptx:'#d04423', csv:'#217346', pdf:'#cc0000', image:'#888', html:'#3498db', markdown:'#555', text:'#666' };
//   const bc = badgeColor[convertedFrom] || badgeColor[viewType] || '#555';

//   const btnStyle = { padding:'7px 14px', borderRadius:7, border:'none', fontWeight:700, fontSize:'0.78rem', cursor:'pointer', display:'flex', alignItems:'center', gap:5 };

//   return (
//     <div style={{ position:'fixed', inset:0, zIndex:9999, display:'grid', gridTemplateRows:'48px 1fr', background:'#0d0d1a' }}>
//       {/* Top bar */}
//       <div style={{ display:'flex', alignItems:'center', gap:12, padding:'0 16px', borderBottom:'1px solid #1e1e32', background:'#12121f', flexShrink:0 }}>
//         <button onClick={onClose} style={{ ...btnStyle, background:'#1a1a2e', color:'#aaa', border:'1px solid #333', padding:'5px 12px' }}>← Back</button>
//         <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0, flex:1 }}>
//           <span style={{ fontSize:'0.85rem', color:'#ddd', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{fileName}</span>
//           {convertedFrom && (
//             <span style={{ padding:'2px 8px', borderRadius:4, background:`${bc}22`, border:`1px solid ${bc}44`, color:bc, fontSize:'0.68rem', fontWeight:700, whiteSpace:'nowrap' }}>
//               {convertedFrom === 'docx' ? '📝 Word' : convertedFrom === 'xlsx' ? '📊 Excel' : convertedFrom === 'pptx' ? `📋 PowerPoint${slideCount?` · ${slideCount} slides`:''}` : convertedFrom === 'csv' ? '📊 CSV' : convertedFrom === 'markdown' ? '📑 Markdown' : convertedFrom === 'text' ? '📄 Text' : convertedFrom}
//             </span>
//           )}
//         </div>

//         {/* Zoom for HTML views */}
//         {isHtml && (
//           <div style={{ display:'flex', alignItems:'center', gap:6 }}>
//             <span style={{ fontSize:'0.72rem', color:'#555' }}>Zoom</span>
//             <input type="range" min={40} max={150} step={5} value={zoom} onChange={e=>setZoom(+e.target.value)} style={{ width:80, accentColor:accent }}/>
//             <span style={{ fontSize:'0.72rem', color:'#666', fontFamily:'monospace', minWidth:32 }}>{zoom}%</span>
//           </div>
//         )}

//         {/* Export buttons */}
//         <div style={{ display:'flex', gap:6, flexShrink:0 }}>
//           {dataUrl && <button onClick={handleDownloadOriginal} style={{ ...btnStyle, background:'#1a1a2e', color:accent, border:`1px solid ${accent}` }}>⬇ Original</button>}
//           {isHtml && <button onClick={handleDownloadPdf} style={{ ...btnStyle, background:'#1a1a2e', color:'#e74c3c', border:'1px solid #e74c3c44' }}>📄 PDF</button>}
//         </div>
//       </div>

//       {/* Document area */}
//       <div style={{ overflow: isPdf||isImage ? 'hidden' : 'auto', background: isPdf?'#525252': isImage?'#1a1a2e': convertedFrom==='pptx'?'#404040':'#e8e8e8', display:'flex', flexDirection:'column' }}>
//         {isPdf && (
//           <object data={dataUrl} type="application/pdf" style={{ width:'100%', height:'100%', border:'none', display:'block' }}>
//             <p style={{ textAlign:'center', padding:40, color:'#aaa' }}>
//               PDF viewer blocked. <a href={dataUrl} download={fileName} style={{ color:accent }}>⬇ Download PDF</a>
//             </p>
//           </object>
//         )}
//         {isImage && (
//           <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%', padding:24, overflow:'auto' }}>
//             <img src={dataUrl} alt={fileName} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', borderRadius:6, boxShadow:'0 4px 32px rgba(0,0,0,0.5)' }}/>
//           </div>
//         )}
//         {isHtml && htmlContent && (
//           <div style={{ transformOrigin:'top center', transform:`scale(${zoom/100})`, width: zoom<100 ? `${10000/zoom}%` : '100%', minHeight:`${10000/zoom}%` }}>
//             <iframe
//               srcDoc={htmlContent}
//               sandbox="allow-same-origin"
//               style={{ width:'100%', minHeight: convertedFrom==='pptx' ? `${(slideCount||1)*820}px` : '100vh', border:'none', display:'block', background:'transparent' }}
//               title="Document Viewer"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function UploadDocPanel({ accent }) {
//   const navigate = useNavigate();
//   const fileRef  = useRef(null);
//   const [file,        setFile]        = useState(null);
//   const [mode,        setMode]        = useState('view');
//   const [loading,     setLoading]     = useState(false);
//   const [loadMsg,     setLoadMsg]     = useState('');
//   const [error,       setError]       = useState(null);
//   const [previewState, setPreviewState] = useState(null); // shows inline overlay

//   const handleFile = (e) => {
//     const f = e.target.files?.[0]; if (!f) return;
//     setFile(f); setError(null); setPreviewState(null); e.target.value='';
//   };

//   const readAsDataUrl = (f) => new Promise((res,rej) => {
//     const r = new FileReader();
//     r.onload  = e => res(e.target.result);
//     r.onerror = () => rej(new Error('Failed to read file'));
//     r.readAsDataURL(f);
//   });

//   const handleOpen = async () => {
//     if (!file) return;
//     setLoading(true); setError(null);
//     try {
//       if (mode === 'view') {
//         const strategy = getFileViewStrategy(file);

//         if (strategy === 'pdf') {
//           const dataUrl = await readAsDataUrl(file);
//           setPreviewState({ viewType:'pdf', dataUrl, fileName:file.name });

//         } else if (strategy === 'image') {
//           const dataUrl = await readAsDataUrl(file);
//           setPreviewState({ viewType:'image', dataUrl, fileName:file.name });

//         } else {
//           // All office formats + text/csv → server convert
//           setLoadMsg('Converting for viewing…');
//           const fd = new FormData();
//           fd.append('file', file);
//           const res  = await fetch('http://localhost:3000/api/convert-for-viewing', { method:'POST', body:fd });
//           // Always parse as text first to avoid JSON parse errors
//           const text = await res.text();
//           let data;
//           try { data = JSON.parse(text); }
//           catch(e) { throw new Error(`Server returned invalid response. Raw: ${text.slice(0,300)}`); }

//           // Server may redirect us: PDF/image should be handled natively
//           if (!res.ok && data.hint === 'pdf') {
//             const dataUrl = await readAsDataUrl(file);
//             setPreviewState({ viewType:'pdf', dataUrl, fileName:file.name });
//             return;
//           }
//           if (!res.ok && data.hint === 'image') {
//             const dataUrl = await readAsDataUrl(file);
//             setPreviewState({ viewType:'image', dataUrl, fileName:file.name });
//             return;
//           }
//           if (!res.ok) throw new Error(data.error || `Conversion failed (${res.status})`);

//           // Server sends base64-encoded HTML to avoid JSON escaping issues
//           const htmlContent = data.htmlBase64
//             ? atob(data.htmlBase64)
//             : data.html || '';
//           if (!htmlContent) throw new Error('Server returned empty content');
//           setPreviewState({
//             viewType: 'converted',
//             htmlContent,
//             fileName: file.name,
//             convertedFrom: data.convertedFrom,
//             slideCount: data.slideCount,
//           });
//         }

//       } else {
//         // Edit Mode — AI fill/rebuild
//         setLoadMsg('AI is reading your document…');
//         const fd = new FormData();
//         fd.append('file', file);
//         fd.append('topic', file.name.replace(/\.[^.]+$/, ''));
//         fd.append('userPrompt', 'Reproduce this document as pixel-perfect editable HTML. Match every font size, color, table border, spacing and layout exactly as shown. Preserve all section headings, paragraph text, tables, checkboxes, and form fields. Every text node must have data-editable="true" and a unique data-id.');
//         fd.append('fileMode', 'fill');
//         fd.append('imageMode', 'none');
//         const res  = await fetch('http://localhost:3000/api/generate-from-file', { method:'POST', body:fd });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
//         if (!data.html) throw new Error('No HTML returned from server');
//         navigate('/editor', { state: { html:data.html, manifesto:data.styleManifesto, sourceFile:file.name } });
//       }
//     } catch (e) { setError(e.message); }
//     finally { setLoading(false); setLoadMsg(''); }
//   };

//   const btnStyle = (active) => ({
//     flex:1, padding:'9px 6px', borderRadius:7,
//     border:`1px solid ${active ? accent : '#2a2a3e'}`,
//     background: active ? `rgba(124,111,255,0.15)` : '#1a1a2e',
//     color: active ? accent : '#666',
//     cursor:'pointer', fontWeight:700, fontSize:'0.8rem', transition:'all .15s',
//   });

//   return (
//     <>
//       {/* Inline full-screen preview overlay */}
//       {previewState && (
//         <DocPreviewModal
//           previewState={previewState}
//           onClose={() => setPreviewState(null)}
//           accent={accent}
//         />
//       )}

//       <div>
//         <input ref={fileRef} type="file"
//           accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.html,.htm,.md,.rtf,.csv"
//           onChange={handleFile} style={{display:'none'}}/>

//         {!file ? (
//           <button onClick={() => fileRef.current?.click()} style={{ width:'100%', padding:'18px', borderRadius:10, border:`2px dashed ${accent}`, background:'transparent', color:accent, cursor:'pointer', fontWeight:600, fontSize:'0.88rem', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
//             <span style={{fontSize:'2.2rem'}}>📂</span>
//             Open any document
//             <span style={{fontSize:'0.72rem',color:'#555',fontWeight:400}}>PDF · Word · Excel · PowerPoint · CSV · HTML · TXT</span>
//           </button>
//         ) : (
//           <div style={{background:'#1a1a2e',border:`1px solid ${accent}`,borderRadius:10,padding:14}}>
//             <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
//               <span style={{fontSize:'1.6rem'}}>{fileIcon(file)}</span>
//               <div style={{flex:1,minWidth:0}}>
//                 <div style={{fontSize:'0.85rem',color:'#ddd',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{file.name}</div>
//                 <div style={{fontSize:'0.7rem',color:'#555',marginTop:2}}>{getFormatLabel(file)} · {(file.size/1024).toFixed(0)} KB</div>
//               </div>
//               <button onClick={()=>{setFile(null);setError(null);setPreviewState(null);}} style={{background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:'1.1rem',lineHeight:1}}>✕</button>
//             </div>

//             <div style={{marginBottom:12}}>
//               <div style={{fontSize:'0.72rem',color:'#888',marginBottom:8,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em'}}>Open Mode</div>
//               <div style={{display:'flex',gap:6,marginBottom:10}}>
//                 <button onClick={()=>setMode('view')} style={btnStyle(mode==='view')}>👁 View</button>
//                 <button onClick={()=>setMode('edit')} style={btnStyle(mode==='edit')}>✏️ Edit with AI</button>
//               </div>
//               <div style={{padding:'9px 11px',borderRadius:7,background:mode==='view'?'rgba(72,219,251,0.06)':'rgba(124,111,255,0.06)',border:`1px solid ${mode==='view'?'#48dbfb33':'#7c6fff33'}`,fontSize:'0.71rem',color:'#888',lineHeight:1.6}}>
//                 {mode==='view'
//                   ? <><strong style={{color:'#48dbfb'}}>👁 View</strong> — Converts and displays your file. PDF/Word/Excel/PPTX/CSV all supported. Download as PDF, HTML, DOCX, or XLSX from the preview.</>
//                   : <><strong style={{color:accent}}>✏️ Edit with AI</strong> — AI rebuilds your document as fully editable HTML you can drag, restyle, and export.<br/><span style={{color:'#555'}}>⏱ ~15–30 sec for complex docs</span></>}
//               </div>
//             </div>

//             {error && (
//               <div style={{marginBottom:10,padding:'8px 12px',borderRadius:7,background:'rgba(231,76,60,0.08)',border:'1px solid #e74c3c44',fontSize:'0.75rem',color:'#e74c3c',lineHeight:1.5}}>
//                 ⚠️ {error}
//               </div>
//             )}

//             <button onClick={handleOpen} disabled={loading} style={{width:'100%',padding:'11px',borderRadius:8,border:'none',background:loading?'#333':`linear-gradient(135deg,${accent},#48dbfb)`,color:'white',cursor:loading?'not-allowed':'pointer',fontWeight:700,fontSize:'0.9rem',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
//               {loading
//                 ? <><span style={{display:'inline-block',animation:'spin 1s linear infinite'}}>⟳</span> {loadMsg||'Loading…'}</>
//                 : mode==='view' ? '👁 Open Document' : '✦ Open for Editing'}
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// // ── Main component ─────────────────────────────────────────────────────────
// export default function ReportBuilder() {
//   const navigate = useNavigate();
//   const fileRef  = useRef(null);

//   // ── Persist report state ─────────────────────────────────────────────────
//   const [topic,     setTopic]     = useState(() => localStorage.getItem('rb_topic') || '');
//   const [prompt,    setPrompt]    = useState(() => localStorage.getItem('rb_prompt') || '');
//   const [html,      setHtml]      = useState(() => localStorage.getItem('rb_html')  || '');
//   const [manifesto, setManifesto] = useState(() => { try { return JSON.parse(localStorage.getItem('rb_manifesto')); } catch { return null; }});
//   const [error,     setError]     = useState(null);
//   const [loading,   setLoading]   = useState(false);
//   const [docId,     setDocId]     = useState(() => localStorage.getItem('rb_docId') || null);
//   const [docTitle,  setDocTitle]  = useState(() => localStorage.getItem('rb_docTitle') || '');

//   useEffect(() => { localStorage.setItem('rb_topic',    topic);    }, [topic]);
//   useEffect(() => { localStorage.setItem('rb_prompt',   prompt);   }, [prompt]);
//   useEffect(() => { localStorage.setItem('rb_html',     html);     }, [html]);
//   useEffect(() => { localStorage.setItem('rb_manifesto', JSON.stringify(manifesto)); }, [manifesto]);
//   useEffect(() => { localStorage.setItem('rb_docId',    docId||'');    }, [docId]);
//   useEffect(() => { localStorage.setItem('rb_docTitle', docTitle||''); }, [docTitle]);

//   const [uploadedFile,     setUploadedFile]     = useState(null);
//   const [uploadedFileName, setUploadedFileName] = useState('');
//   const [uploadedFileType, setUploadedFileType] = useState('');
//   const [fileMode,   setFileMode]   = useState('report');
//   const [imageMode,  setImageMode]  = useState('svg');

//   const [citationFormat, setCitationFormat] = useState('none');
//   const [sources,        setSources]        = useState([{ raw:'', result:null, loading:false, error:null }]);
//   const [citePanelOpen,  setCitePanelOpen]  = useState(false);
//   const [docsPanelOpen,  setDocsPanelOpen]  = useState(false);
//   const [pdfsPanelOpen,  setPdfsPanelOpen]  = useState(false);
//   const [chatPanelOpen,  setChatPanelOpen]  = useState(false);

//   // Diagram queue banner state
//   const [queuedDiagramCount, setQueuedDiagramCount] = useState(0);
//   useEffect(() => {
//     const update = () => {
//       const diagrams = JSON.parse(localStorage.getItem('rb_diagrams') || '[]');
//       setQueuedDiagramCount(diagrams.length);
//     };
//     update();
//     window.addEventListener('storage', update);
//     const interval = setInterval(update, 2000);
//     return () => { window.removeEventListener('storage', update); clearInterval(interval); };
//   }, []);

//   const clearDiagramQueue = () => {
//     localStorage.removeItem('rb_diagrams');
//     setQueuedDiagramCount(0);
//   };

//   const [ov, setOv] = useState({
//     bgColor:'#ffffff', textColor:'#333333', primaryColor:'#3498db',
//     headingColor:'#111111', linkColor:'#3498db', tableHeaderBg:'#3498db',
//     fontSize:14, lineHeight:1.6, sectionPadding:24, hideFeatures:[],
//   });
//   const setOvKey = (k,v) => setOv(p=>({...p,[k]:v}));
//   const toggleFeature = (f) =>
//     setOvKey('hideFeatures', ov.hideFeatures.includes(f)
//       ? ov.hideFeatures.filter(x=>x!==f) : [...ov.hideFeatures,f]);

//   const handleFileSelect = (e) => {
//     const file = e.target.files?.[0]; if (!file) return;
//     const name = file.name.toLowerCase();
//     let type='text';
//     if      (name.endsWith('.pdf'))                            type='pdf';
//     else if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(name))   type='image';
//     else if (/\.(docx?|doc)$/.test(name))                     type='word';
//     else if (/\.(xlsx?|xls)$/.test(name))                     type='excel';
//     else if (/\.(pptx?|ppt)$/.test(name))                     type='pptx';
//     else if (/\.(txt|md|csv|json|html|xml|rtf)$/.test(name)) type='text';
//     setUploadedFile(file); setUploadedFileName(file.name); setUploadedFileType(type);
//     e.target.value='';
//   };
//   const clearFile = () => { setUploadedFile(null); setUploadedFileName(''); setUploadedFileType(''); };

//   // ── Citations ─────────────────────────────────────────────────────────────
//   const addSource    = () => setSources(s=>[...s,{raw:'',result:null,loading:false,error:null}]);
//   const updateSource = (i,val) => setSources(s=>s.map((x,j)=>j===i?val:x));
//   const removeSource = (i) => setSources(s=>s.filter((_,j)=>j!==i));
//   const generateOneCitation = async (i) => {
//     const src=sources[i]; if(!src.raw.trim()) return;
//     updateSource(i,{...src,loading:true,error:null,result:null});
//     try {
//       const result=await generateCitationsFromSource(src.raw,citationFormat);
//       setSources(s=>s.map((x,j)=>j===i?{...x,loading:false,result}:x));
//     } catch(err) {
//       setSources(s=>s.map((x,j)=>j===i?{...x,loading:false,error:err.message}:x));
//     }
//   };

//   const buildReferenceBlock = () => {
//     const entries=sources.filter(s=>s.result); if(!entries.length) return '';
//     const label=citationFormat==='apa7'?'References':'Works Cited';
//     const items=entries.map(s=>`<p data-editable="true" data-id="ref-${Math.random().toString(36).slice(2,7)}" style="margin-bottom:12px;padding-left:2em;text-indent:-2em;font-size:0.9em;line-height:1.6">${s.result.reference}</p>`).join('\n');
//     return `\n<section data-feature="references" data-id="refs-${Math.random().toString(36).slice(2,7)}" style="margin-top:40px;padding-top:16px;border-top:2px solid #ddd;page-break-before:always"><h2 style="color:inherit">${label}</h2>\n${items}\n</section>`;
//   };

//   // ── Save document to disk ─────────────────────────────────────────────────
//   const saveDoc = async (htmlToSave, title) => {
//     try {
//       const res = await fetch(`http://localhost:3000/api/documents${docId?'/'+docId:''}`, {
//         method: docId ? 'PUT' : 'POST',
//         headers:{'Content-Type':'application/json'},
//         body: JSON.stringify({ title: title||topic||'Untitled Report', html: htmlToSave, manifesto, ov }),
//       });
//       const data = await res.json();
//       if (data.id) { setDocId(data.id); setDocTitle(data.title); }
//     } catch(err) { console.warn('Save failed:', err.message); }
//   };

//   // ── Open saved doc — fixed: load full HTML and display it ─────────────────
//   const openDoc = async (doc) => {
//     try {
//       // Fetch the full document (index only has id/title/updatedAt)
//       const res  = await fetch(`http://localhost:3000/api/documents/${doc.id}`);
//       if (!res.ok) throw new Error('Could not load document');
//       const full = await res.json();
//       setHtml(full.html || '');
//       setManifesto(full.manifesto || null);
//       setDocId(full.id);
//       setDocTitle(full.title);
//       setTopic(full.title);
//       if (full.ov) setOv(full.ov);
//       setDocsPanelOpen(false);
//       setChatPanelOpen(true);
//     } catch(e) {
//       alert('Failed to open document: ' + e.message);
//     }
//   };

//   // ── Generate ──────────────────────────────────────────────────────────────
//   const handleGenerate = async () => {
//     if (!topic && !uploadedFile) return alert('Please enter a topic or upload a file');
//     setError(null); setLoading(true);
//     const citeEntries = sources.filter(s=>s.result);
//     const citeContext = citeEntries.length && citationFormat!=='none'
//       ? `\n\nCITATION FORMAT: ${citationFormat==='apa7'?'APA 7th edition':'MLA 9th edition'}\nUse in-text citations where relevant:\n${citeEntries.map(s=>`- Parenthetical: ${s.result.intext} | Narrative: ${s.result.narrative}`).join('\n')}`
//       : '';
//     try {
//       let data;
//       if (uploadedFile) {
//         const fd=new FormData();
//         fd.append('file',uploadedFile); fd.append('topic',topic);
//         fd.append('userPrompt',prompt+citeContext); fd.append('fileMode',fileMode);
//         fd.append('imageMode', imageMode);
//         const res=await fetch('http://localhost:3000/api/generate-from-file',{method:'POST',body:fd});
//         data=await res.json();
//         if(!res.ok){setError({code:data.code,message:data.error});return;}
//       } else {
//         const res=await fetch('http://localhost:3000/api/generate-preview',{
//           method:'POST',headers:{'Content-Type':'application/json'},
//           body:JSON.stringify({topic,userPrompt:prompt+citeContext,imageMode}),
//         });
//         data=await res.json();
//         if(!res.ok){setError({code:data.code,message:data.error});return;}
//       }

//       const refBlock = buildReferenceBlock();

//       // Append any queued diagrams
//       const queuedDiagrams = JSON.parse(localStorage.getItem('rb_diagrams') || '[]');
//       let diagramBlock = '';
//       if (queuedDiagrams.length > 0) {
//         diagramBlock = queuedDiagrams.map(d =>
//           `<figure data-id="diag-${Math.random().toString(36).slice(2,7)}" data-editable="true" data-draggable="true"
//             style="margin:24px 0;text-align:center;page-break-inside:avoid">
//             ${d.svg}
//             <figcaption data-editable="true" data-id="dcap-${Math.random().toString(36).slice(2,7)}"
//               style="color:#888;font-size:0.85em;margin-top:8px">${d.title}</figcaption>
//           </figure>`
//         ).join('\n');
//       }

//       const finalHtml = (data.html || '') + refBlock + diagramBlock;
//       applyResult(data, finalHtml);
//       await saveDoc(finalHtml, topic);

//       // Auto-download PDF immediately after generation
//       try {
//         const fd = new FormData();
//         fd.append('html', new Blob([finalHtml], { type: 'text/html' }), 'report.html');
//         fd.append('styleManifest', JSON.stringify(manifesto ?? {}));
//         const pdfRes = await fetch('http://localhost:3000/api/render-pdf-form', { method: 'POST', body: fd });
//         if (pdfRes.ok) {
//           const blob = await pdfRes.blob();
//           const url  = URL.createObjectURL(blob);
//           const a    = document.createElement('a');
//           a.href = url;
//           a.download = `${(topic || 'report').replace(/[^a-z0-9]/gi,'_').slice(0,40)}.pdf`;
//           a.click();
//           URL.revokeObjectURL(url);
//         }
//       } catch(e) { console.warn('Auto-download failed:', e.message); }

//       // Clear diagram queue
//       localStorage.removeItem('rb_diagrams');
//       setQueuedDiagramCount(0);
//       setChatPanelOpen(true);
//     } catch {
//       setError({code:'NETWORK_ERROR',message:'Could not reach the backend. Is server.js running on port 3000?'});
//     } finally { setLoading(false); }
//   };

//   const applyResult = (data, overrideHtml) => {
//     setHtml(overrideHtml ?? data.html ?? '');
//     setManifesto(data.styleManifesto);
//     const c=data.styleManifesto?.colors??{}, t=data.styleManifesto?.typography??{};
//     setOv(prev=>({...prev,
//       bgColor:c.bg??'#ffffff', textColor:c.text??'#333333', primaryColor:c.primary??'#3498db',
//       headingColor:c.heading??'#111111', linkColor:c.link??'#3498db', tableHeaderBg:c.tableHeader??'#3498db',
//       fontSize:t.baseSize??14, lineHeight:t.lineHeight??1.6, sectionPadding:t.sectionPadding??24, hideFeatures:[],
//     }));
//   };

//   // ── Chat update callback ──────────────────────────────────────────────────
//   const handleChatUpdate = async (newHtml) => {
//     setHtml(newHtml);
//     await saveDoc(newHtml, topic);
//   };

//   const handleDownloadPdf = async () => {
//     const finalHtml=injectOverrides(html,ov);
//     const res=await fetch('http://localhost:3000/api/render-pdf',{
//       method:'POST',headers:{'Content-Type':'application/json'},
//       body:JSON.stringify({html:finalHtml,styleManifest:manifesto}),
//     });
//     const blob=await res.blob(), url=URL.createObjectURL(blob);
//     const a=document.createElement('a'); a.href=url; a.download='report.pdf'; a.click();
//     URL.revokeObjectURL(url);
//   };

//   const openEditor = () =>
//     navigate('/editor',{state:{html:injectOverrides(html,ov),manifesto,ov}});

//   const previewSrc = html
//     ? injectOverrides(html, ov)
//     : '<body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#aaa">Preview will appear here</body>';

//   const features=manifesto?.featuresUsed??[];
//   const accent='#7c6fff';
//   const panel={background:'#12121f',borderRadius:12,padding:'16px 18px',marginBottom:12,border:'1px solid #1e1e32'};
//   const label_={fontSize:'0.8rem',color:'#aaa',display:'block',marginBottom:4};
//   const rowStyle={display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #1e1e32'};
//   const inp={background:'#1a1a2e',border:'1px solid #333',borderRadius:6,padding:'8px 10px',color:'#ddd',fontSize:'0.85rem',width:'100%',boxSizing:'border-box'};
//   const btnChip=(active)=>({padding:'5px 12px',borderRadius:16,border:`1px solid ${active?accent:'#333'}`,background:active?accent:'#1a1a2e',color:active?'#fff':'#666',cursor:'pointer',fontSize:'0.78rem',fontWeight:600});
//   const fileIcon=uploadedFileType==='pdf'?'📄':uploadedFileType==='image'?'🖼️':uploadedFileType==='word'?'📝':uploadedFileType==='excel'?'📊':uploadedFileType==='pptx'?'📋':'📄';
//   const hasCitations=citationFormat!=='none';
//   const readyCitations=sources.filter(s=>s.result).length;

//   const CollapsePanel=({title,subtitle,open,onToggle,children})=>(
//     <div style={panel}>
//       <div onClick={onToggle} style={{display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}}>
//         <div>
//           <div style={{fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#555'}}>{title}</div>
//           {subtitle&&<div style={{fontSize:'0.7rem',color:accent,marginTop:2}}>{subtitle}</div>}
//         </div>
//         <span style={{color:'#444',fontSize:'0.85rem'}}>{open?'▲':'▼'}</span>
//       </div>
//       {open&&<div style={{marginTop:12}}>{children}</div>}
//     </div>
//   );

//   const ColorRow=({label:lbl,k})=>(
//     <div style={rowStyle}>
//       <span style={{fontSize:'0.83rem',color:'#bbb'}}>{lbl}</span>
//       <div style={{display:'flex',alignItems:'center',gap:8}}>
//         <span style={{fontFamily:'monospace',fontSize:'0.75rem',color:'#555'}}>{ov[k].toUpperCase()}</span>
//         <input type="color" value={ov[k]} onChange={e=>setOvKey(k,e.target.value)} style={{width:30,height:30,border:'2px solid #333',borderRadius:6,cursor:'pointer',padding:2,background:'none'}}/>
//       </div>
//     </div>
//   );

//   const SliderRow=({label:lbl,k,min,max,step=1,unit=''})=>(
//     <div style={{padding:'7px 0',borderBottom:'1px solid #1e1e32'}}>
//       <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
//         <span style={{fontSize:'0.83rem',color:'#bbb'}}>{lbl}</span>
//         <span style={{fontFamily:'monospace',fontSize:'0.75rem',color:'#555'}}>{ov[k]}{unit}</span>
//       </div>
//       <input type="range" min={min} max={max} step={step} value={ov[k]} onChange={e=>setOvKey(k,Number(e.target.value))} style={{width:'100%',accentColor:accent}}/>
//     </div>
//   );

//   return (
//     <div style={{display:'grid',gridTemplateColumns:'370px 1fr',height:'100vh',background:'#0d0d1a',color:'#eee',fontFamily:'system-ui,sans-serif',overflow:'hidden'}}>

//       {/* ── SIDEBAR ── */}
//       <div style={{overflowY:'auto',padding:'20px 16px',borderRight:'1px solid #1e1e32'}}>

//         {/* Header */}
//         <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
//           <h2 style={{margin:0,fontSize:'1.1rem',fontWeight:800,background:`linear-gradient(135deg,${accent},#48dbfb)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
//             Report Builder
//           </h2>
//           <div style={{display:'flex',gap:8,alignItems:'center'}}>
//             <button onClick={()=>setDocsPanelOpen(o=>!o)} style={{fontSize:'0.72rem',color:docsPanelOpen?accent:'#555',background:'none',border:`1px solid ${docsPanelOpen?accent:'#2a2a3e'}`,borderRadius:6,padding:'4px 8px',cursor:'pointer'}}>
//               📁 My Docs
//             </button>
//             <Link to="/diagrams" style={{fontSize:'0.72rem',color:accent,textDecoration:'none',border:`1px solid ${accent}44`,borderRadius:6,padding:'4px 8px'}}>
//               📊 Diagrams
//             </Link>
//             <Link to="/matrix" style={{fontSize:'0.75rem',color:'#555',textDecoration:'none'}}>Matrix →</Link>
//           </div>
//         </div>

//         {/* Saved docs panel */}
//         {docsPanelOpen && (
//           <div style={{marginBottom:12}}>
//             <div style={{...panel,maxHeight:260,overflowY:'auto',marginBottom:8}}>
//               <div style={{fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#555',marginBottom:10}}>Saved Documents</div>
//               <SavedDocsPanel onOpen={openDoc} accent={accent}/>
//             </div>
//             {/* Saved PDFs panel */}
//             <CollapsePanel
//               title="Saved PDFs"
//               subtitle="Browse & re-download from disk"
//               open={pdfsPanelOpen}
//               onToggle={() => setPdfsPanelOpen(o => !o)}
//             >
//               <SavedPdfsPanel accent={accent} />
//             </CollapsePanel>
//           </div>
//         )}

//         {/* ── Diagram queue banner ── */}
//         {queuedDiagramCount > 0 && (
//           <div style={{...panel, border:'1px solid #e67e22', background:'rgba(230,126,34,0.06)', marginBottom:12}}>
//             <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
//               <div>
//                 <div style={{fontSize:'0.72rem',fontWeight:700,color:'#e67e22',marginBottom:2}}>
//                   📊 {queuedDiagramCount} diagram{queuedDiagramCount>1?'s':''} queued
//                 </div>
//                 <div style={{fontSize:'0.68rem',color:'#888'}}>
//                   Will be appended to next generated report
//                 </div>
//               </div>
//               <button onClick={clearDiagramQueue}
//                 style={{background:'none',border:'1px solid #555',color:'#555',borderRadius:6,padding:'3px 8px',cursor:'pointer',fontSize:'0.7rem'}}>
//                 Clear
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ── Open Existing Document ── */}
//         <div style={panel}>
//           <div style={{fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#555',marginBottom:10}}>
//             📂 Open Existing Document
//           </div>
//           <UploadDocPanel accent={accent} inp={inp}/>
//         </div>

//         {/* Topic + prompt */}
//         <div style={panel}>
//           <label style={label_}>Report Topic <span style={{color:'#444'}}>(optional if uploading a file)</span></label>
//           <input style={{...inp,marginBottom:10}} placeholder="e.g. Climate Change 2025" value={topic} onChange={e=>setTopic(e.target.value)}/>
//           <label style={label_}>Style Instructions</label>
//           <textarea style={{...inp,minHeight:65,resize:'vertical',marginBottom:12}}
//             placeholder="e.g. Dark navy background, gold headings, striped tables…"
//             value={prompt} onChange={e=>setPrompt(e.target.value)}/>

//           {/* File upload */}
//           <div style={{marginBottom:12}}>
//             <label style={label_}>Upload File <span style={{color:'#444'}}>(PDF, Word, Excel, PowerPoint, image, text)</span></label>
//             <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.bmp,.txt,.md,.csv,.json,.html,.xml,.rtf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={handleFileSelect} style={{display:'none'}}/>
//             {uploadedFile?(
//               <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',background:'#1a1a2e',border:`1px solid ${accent}`,borderRadius:8}}>
//                 <span style={{fontSize:'1.2rem'}}>{fileIcon}</span>
//                 <div style={{flex:1,minWidth:0}}>
//                   <div style={{fontSize:'0.82rem',color:'#ddd',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{uploadedFileName}</div>
//                   <div style={{fontSize:'0.7rem',color:'#555',marginTop:1}}>{uploadedFileType.toUpperCase()} — AI will process this file</div>
//                 </div>
//                 <button onClick={clearFile} style={{background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:'1rem',padding:2}}>✕</button>
//               </div>
//             ):(
//               <button onClick={()=>fileRef.current?.click()} style={{width:'100%',padding:'12px',borderRadius:8,border:`1px dashed ${accent}`,background:'transparent',color:accent,cursor:'pointer',fontWeight:600,fontSize:'0.85rem',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
//                 <span>📎</span> Upload PDF, Word, Excel, PowerPoint, image…
//               </button>
//             )}
//           </div>

//           {/* Image mode toggle */}
//           <div style={{marginBottom:12}}>
//             <label style={label_}>Image Generation</label>
//             <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
//               {[
//                 {id:'svg',  icon:'🎨', label:'AI SVG Illustrations', desc:'Gemini draws inline SVG art for each image slot'},
//                 {id:'none', icon:'🚫', label:'No Images',            desc:'Skip all images — fastest, cleanest output'},
//               ].map(({id,icon,label,desc})=>(
//                 <button key={id} onClick={()=>setImageMode(id)} style={{padding:'10px 8px',borderRadius:8,cursor:'pointer',textAlign:'left',border:`1px solid ${imageMode===id?accent:'#2a2a3e'}`,background:imageMode===id?'rgba(124,111,255,0.12)':'#1a1a2e',transition:'all .15s'}}>
//                   <div style={{fontSize:'1.1rem',marginBottom:3}}>{icon}</div>
//                   <div style={{fontSize:'0.78rem',color:imageMode===id?accent:'#ccc',fontWeight:700,marginBottom:2}}>{label}</div>
//                   <div style={{fontSize:'0.68rem',color:'#555',lineHeight:1.4}}>{desc}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* File mode toggle */}
//           {uploadedFile&&(
//             <div style={{marginBottom:12}}>
//               <label style={label_}>File Processing Mode</label>
//               <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
//                 {[{id:'report',icon:'📊',label:'Generate Report',desc:'Summarise & reformat into new styled report'},{id:'fill',icon:'✏️',label:'Fill In Document',desc:'Reproduce original layout, fill every blank'}].map(({id,icon,label,desc})=>(
//                   <button key={id} onClick={()=>setFileMode(id)} style={{padding:'10px 8px',borderRadius:8,cursor:'pointer',textAlign:'left',border:`1px solid ${fileMode===id?accent:'#2a2a3e'}`,background:fileMode===id?'rgba(124,111,255,0.12)':'#1a1a2e',transition:'all .15s'}}>
//                     <div style={{fontSize:'1.1rem',marginBottom:3}}>{icon}</div>
//                     <div style={{fontSize:'0.78rem',color:fileMode===id?accent:'#ccc',fontWeight:700,marginBottom:2}}>{label}</div>
//                     <div style={{fontSize:'0.68rem',color:'#555',lineHeight:1.4}}>{desc}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {error&&(
//             <div style={{marginTop:8,padding:'10px 14px',borderRadius:8,background:'#1a0a0a',border:'1px solid #c0392b'}}>
//               <div style={{fontSize:'0.78rem',fontWeight:700,color:'#e74c3c',marginBottom:4}}>
//                 {{'API_KEY_LEAKED':'🔑 API Key Leaked','API_KEY_EXPIRED':'🔑 API Key Expired','API_KEY_INVALID':'🔑 API Key Invalid','PARSE_ERROR':'⚠️ AI Response Error','NETWORK_ERROR':'🔌 Connection Error','SERVER_ERROR':'⚠️ Server Error','FILE_TOO_LARGE':'📦 File Too Large','UNSUPPORTED_FILE':'❌ Unsupported File Type'}[error.code]||error.code}
//               </div>
//               <div style={{fontSize:'0.8rem',color:'#aaa',lineHeight:1.5}}>{error.message}</div>
//             </div>
//           )}

//           <button onClick={handleGenerate} disabled={loading} style={{marginTop:12,width:'100%',padding:'10px',borderRadius:8,border:'none',background:loading?'#333':`linear-gradient(135deg,${accent},#48dbfb)`,color:'white',fontWeight:700,fontSize:'0.9rem',cursor:loading?'not-allowed':'pointer'}}>
//             {loading?(uploadedFile?(fileMode==='fill'?'✏️ Filling in document…':'📖 Reading file…'):'Generating…'):(uploadedFile?`✦ ${fileMode==='fill'?'Fill In':'Generate from'} ${fileIcon} ${uploadedFileName.slice(0,18)}${uploadedFileName.length>18?'…':''}`:'✦ Generate Report')}
//           </button>
//         </div>

//         {/* Citation panel */}
//         <CollapsePanel
//           title="Citation Format"
//           subtitle={citationFormat!=='none'?(citationFormat==='apa7'?'APA 7th Edition':'MLA 9th Edition')+(readyCitations>0?` · ${readyCitations} source${readyCitations>1?'s':''} ready`:''):null}
//           open={citePanelOpen} onToggle={()=>setCitePanelOpen(o=>!o)}
//         >
//           <label style={label_}>Select format</label>
//           <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginBottom:14}}>
//             {[{id:'none',label:'None'},{id:'apa7',label:'APA 7th'},{id:'mla',label:'MLA 9th'}].map(({id,label})=>(
//               <button key={id} onClick={()=>setCitationFormat(id)} style={{padding:'8px 4px',borderRadius:7,cursor:'pointer',fontWeight:700,fontSize:'0.78rem',border:`1px solid ${citationFormat===id?accent:'#2a2a3e'}`,background:citationFormat===id?'rgba(124,111,255,0.15)':'#1a1a2e',color:citationFormat===id?accent:'#666'}}>{label}</button>
//             ))}
//           </div>
//           {hasCitations&&(<>
//             <div style={{fontSize:'0.72rem',color:'#555',marginBottom:8}}>Paste source info into each box — AI will generate parenthetical, narrative, and reference list entries automatically appended to your report.</div>
//             {sources.map((entry,i)=>(
//               <SourceEntry key={i} idx={i} entry={entry} accent={accent} inp={inp}
//                 onChange={val=>updateSource(i,val)} onRemove={()=>removeSource(i)} onGenerate={generateOneCitation}/>
//             ))}
//             <button onClick={addSource} style={{width:'100%',padding:'8px',borderRadius:8,border:`1px dashed ${accent}`,background:'transparent',color:accent,cursor:'pointer',fontWeight:600,fontSize:'0.82rem',marginTop:4}}>+ Add Another Source</button>
//             {readyCitations>0&&(
//               <div style={{marginTop:10,padding:'8px 10px',borderRadius:7,background:'rgba(124,111,255,0.08)',border:`1px solid ${accent}`,fontSize:'0.72rem',color:'#aaa'}}>
//                 ✅ {readyCitations} citation{readyCitations>1?'s':''} ready — <strong style={{color:accent}}>References</strong> section auto-appended on generate.
//               </div>
//             )}
//           </>)}
//         </CollapsePanel>

//         {/* AI Chat */}
//         {html&&(
//           <CollapsePanel
//             title="AI Chat — Update Report"
//             subtitle="Ask AI to revise, add, or reformat"
//             open={chatPanelOpen} onToggle={()=>setChatPanelOpen(o=>!o)}
//           >
//             <AiChatPanel html={html} onUpdate={handleChatUpdate} accent={accent} inp={inp}/>
//           </CollapsePanel>
//         )}

//         {/* Post-generate controls */}
//         {manifesto&&(<>
//           <div style={panel}>
//             <div style={{fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#555',marginBottom:10}}>Features Used — toggle to hide</div>
//             <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
//               {features.length?features.map(f=><button key={f} onClick={()=>toggleFeature(f)} style={btnChip(!ov.hideFeatures.includes(f))}>{f}</button>):<span style={{fontSize:'0.8rem',color:'#444'}}>None reported</span>}
//             </div>
//           </div>
//           <div style={panel}>
//             <div style={{fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#555',marginBottom:8}}>Colors</div>
//             <ColorRow label="Page Background" k="bgColor"/>
//             <ColorRow label="Body Text"        k="textColor"/>
//             <ColorRow label="Primary / Accent" k="primaryColor"/>
//             <ColorRow label="Headings"         k="headingColor"/>
//             <ColorRow label="Links"            k="linkColor"/>
//             <ColorRow label="Table Header"     k="tableHeaderBg"/>
//           </div>
//           <div style={panel}>
//             <div style={{fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#555',marginBottom:8}}>Spacing & Typography</div>
//             <SliderRow label="Base Font Size"  k="fontSize"       min={10} max={22} unit="px"/>
//             <SliderRow label="Line Height"     k="lineHeight"     min={1.0} max={2.5} step={0.05}/>
//             <SliderRow label="Section Padding" k="sectionPadding" min={8}  max={60}  unit="px"/>
//           </div>
//           <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20}}>
//             <button onClick={openEditor} style={{padding:'10px',borderRadius:8,border:`1px solid ${accent}`,background:'transparent',color:accent,fontWeight:700,fontSize:'0.85rem',cursor:'pointer'}}>✏️ Open Editor</button>
//             <button onClick={handleDownloadPdf} style={{padding:'10px',borderRadius:8,border:'none',background:'#27ae60',color:'white',fontWeight:700,fontSize:'0.85rem',cursor:'pointer'}}>⬇ Download PDF</button>
//           </div>
//         </>)}
//       </div>

//       {/* ── PREVIEW ── */}
//       <div style={{position:'relative',overflow:'hidden'}}>
//         {loading&&(
//           <div style={{position:'absolute',inset:0,background:'rgba(13,13,26,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10,flexDirection:'column',gap:12}}>
//             <div style={{width:40,height:40,border:`3px solid ${accent}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
//             <span style={{color:'#aaa',fontSize:'0.85rem'}}>
//               {uploadedFile?(fileMode==='fill'?`Filling in ${uploadedFileName}…`:`Reading ${uploadedFileName} and building report…`):'Building your report…'}
//             </span>
//             <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//           </div>
//         )}
//         <iframe srcDoc={previewSrc} style={{width:'100%',height:'100%',border:'none',display:'block'}} title="Report Preview"/>
//       </div>
//     </div>
//   );
// }







///////////



import {useState} from 'react'

const ReportBuilder = () => {
  
  const [lower, setLl] = useState([])
  const [upper, setUl] = useState([])
  const [nums, setN] = useState([])
  const [Pchar, setPc] = useState([...lower, ...upper, ...nums])
  const [lenght, setL] = useState(Number)
  const [passS, setPS] = useState([])
  const [P, setP] = useState([])

  function SETN (e){

    if(e.target.checked){
      setN([1,2,3,4,5,6,7,8,9,0])
    }
    else{
      setN([])
    }

  }

  function SETlL (e){

    if(e.target.checked){
      setLl(["n","m","l","c","g","i","h","g","f","e","d","c","b","a"])
    }
    else{
      setLl([])
    }

  }

  function SETUL (e){
    if(e.target.checked){
      setUl(["Z","X","C","B","A"])
    }

    else{
      setUl([])
    }
  }

  function ONSUBMIT (e){
    e.preventDefalut()
 
    const V = Pchar.sort(() => Math.random() - 0.5).slice(0, 11)

    setP(V)


  }
  

  return (
    
    <>
    <div>{V}</div>
    <form onSubmit={}>
      <lable for='num'>nums</lable>
      <input type="checkbox" id='num' onChange={}/>
      <lable for='Ll'>nums</lable>
      <input type="checkbox" id='Ll' onChange={}/>
      <lable for='Ul'>nums</lable>
      <input type="checkbox" id='Ul' onChange={}/>
      <button type="submit">submit</button>
    </form>
    </>

  )
}

export default ReportBuilder