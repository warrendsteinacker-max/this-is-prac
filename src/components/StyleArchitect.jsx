import { useState } from "react";

// ── Helpers ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 7);

const fontFamilies = [
  { label: "System UI", value: "system-ui, sans-serif" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Georgia (Serif)", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier (Mono)", value: "'Courier New', monospace" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Palatino", value: "Palatino, serif" },
];
const pageSizes = ["A4","A3","Letter","Legal","Tabloid"];
const pageOrientations = ["Portrait","Landscape"];
const marginPresets = [
  { label: "Normal (20mm)", value: "20mm" },
  { label: "Narrow (10mm)", value: "10mm" },
  { label: "Wide (30mm)", value: "30mm" },
  { label: "Custom", value: "custom" },
];
const borderStyles = ["none","solid","dashed","dotted","double"];
const alignOptions = ["left","center","right","justify"];
const styleOptions = [
  { id:"modern", label:"Modern/Minimal", prompt:"Use a clean, modern aesthetic with plenty of whitespace." },
  { id:"dark", label:"High-Contrast Dark", prompt:"Use a dark mode theme with neon accents." },
  { id:"gradient", label:"Gradient Branding", prompt:"Use linear-gradient on headers fading from primaryColor to white." },
  { id:"pagebreak", label:"Smart Page Breaks", prompt:"Apply break-inside: avoid on all tables and cards." },
  { id:"watermark", label:"Watermark", prompt:"Add a diagonal CSS watermark using ::before on the body." },
  { id:"toc", label:"Table of Contents", prompt:"Generate a styled TOC at the start using anchor links." },
  { id:"cover", label:"Cover Page", prompt:"Generate a full first-page cover with gradient background and centered title." },
  { id:"footer", label:"Header & Footer", prompt:"Add header and footer with page numbers via @page rules." },
  { id:"svg", label:"SVG Infographics", prompt:"Use <svg> tags inside <figure> for flowcharts and icons." },
  { id:"serif", label:"Classic Serif", prompt:"Use elegant serif fonts for headings." },
  { id:"callouts", label:"Callout Boxes", prompt:"Use styled <aside> callout boxes with left-border accent." },
  { id:"bento", label:"Bento Grid", prompt:"Use aspect-ratio:1/1 div cards in a CSS grid for a dashboard layout." },
];

// ── Reusable UI ────────────────────────────────────────────────────────────
const s = {
  panel: { background:"#12121f", borderRadius:14, padding:"22px 24px", marginBottom:20, border:"1px solid #1e1e32" },
  sectionTitle: { fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"#666", marginBottom:12 },
  row: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #1e1e32" },
  label: { fontSize:"0.85rem", color:"#ccc" },
  hint: { fontSize:"0.72rem", color:"#555", marginTop:2 },
  input: { background:"#1a1a2e", border:"1px solid #333", borderRadius:6, padding:"6px 10px", color:"#ccc", fontSize:"0.83rem", width:"100%", boxSizing:"border-box" },
  select: { background:"#1a1a2e", border:"1px solid #333", borderRadius:6, padding:"5px 8px", color:"#ccc", fontSize:"0.82rem", cursor:"pointer" },
  btn: (active, color="#7c6fff") => ({ padding:"6px 14px", borderRadius:20, border:`1px solid ${active ? color:"#333"}`, background:active ? color:"#1a1a2e", color:active ? "white":"#777", cursor:"pointer", fontSize:"0.8rem", fontWeight:600 }),
  addBtn: { padding:"6px 14px", borderRadius:8, border:"1px dashed #444", background:"transparent", color:"#7c6fff", cursor:"pointer", fontSize:"0.8rem", width:"100%" },
  removeBtn: { padding:"2px 8px", borderRadius:6, border:"none", background:"#2a1a2e", color:"#f55", cursor:"pointer", fontSize:"0.75rem" },
  card: { background:"#1a1a2e", borderRadius:10, padding:"14px 16px", marginBottom:10, border:"1px solid #252540" },
};

const SectionTitle = ({children}) => <div style={s.sectionTitle}>{children}</div>;
const Row = ({label, hint, children}) => (
  <div style={s.row}>
    <div><div style={s.label}>{label}</div>{hint && <div style={s.hint}>{hint}</div>}</div>
    <div style={{flexShrink:0, marginLeft:12}}>{children}</div>
  </div>
);
const ColorPick = ({label, hint, value, onChange}) => (
  <Row label={label} hint={hint}>
    <div style={{display:"flex", alignItems:"center", gap:8}}>
      <span style={{fontFamily:"monospace", fontSize:"0.78rem", color:"#666"}}>{value.toUpperCase()}</span>
      <input type="color" value={value} onChange={e=>onChange(e.target.value)}
        style={{width:32,height:32,border:"2px solid #333",borderRadius:6,cursor:"pointer",padding:2,background:"none"}}/>
    </div>
  </Row>
);
const Slider = ({label, value, onChange, min, max, step=1, unit=""}) => (
  <div style={{padding:"8px 0", borderBottom:"1px solid #1e1e32"}}>
    <div style={{display:"flex", justifyContent:"space-between", marginBottom:5}}>
      <span style={s.label}>{label}</span>
      <span style={{fontFamily:"monospace", fontSize:"0.78rem", color:"#666"}}>{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}
      style={{width:"100%", accentColor:"#7c6fff"}}/>
  </div>
);
const Select = ({label, value, onChange, options}) => (
  <Row label={label}>
    <select value={value} onChange={e=>onChange(e.target.value)} style={s.select}>
      {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
    </select>
  </Row>
);
const TextInput = ({label, value, onChange, placeholder}) => (
  <div style={{padding:"8px 0", borderBottom:"1px solid #1e1e32"}}>
    <div style={{...s.label, marginBottom:6}}>{label}</div>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s.input}/>
  </div>
);

// ── Table Builder ──────────────────────────────────────────────────────────
const defaultTable = () => ({
  id: uid(), name:"Table 1", rows:3, cols:3,
  hasHeader:true, striped:true, bordered:true,
  headerBg:"#3498db", headerText:"#ffffff",
  stripeBg:"#f0f4f8", borderColor:"#dddddd",
  colWidths:"", caption:"", notes:"",
});

const TableBuilder = ({tables, setTables}) => {
  const add = () => setTables(p=>[...p, {...defaultTable(), id:uid(), name:`Table ${p.length+1}`}]);
  const remove = id => setTables(p=>p.filter(t=>t.id!==id));
  const upd = (id,key,val) => setTables(p=>p.map(t=>t.id===id?{...t,[key]:val}:t));

  return (
    <div>
      <SectionTitle>Tables — define each one individually</SectionTitle>
      {tables.map((t,i)=>(
        <div key={t.id} style={s.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <input value={t.name} onChange={e=>upd(t.id,"name",e.target.value)}
              style={{...s.input,width:"auto",flex:1,marginRight:10,fontWeight:700,fontSize:"0.9rem"}}/>
            <button onClick={()=>remove(t.id)} style={s.removeBtn}>✕ Remove</button>
          </div>

          {/* Dimensions */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10}}>
            <div>
              <div style={{...s.hint,marginBottom:4}}>Rows (excl. header)</div>
              <input type="number" min={1} max={50} value={t.rows} onChange={e=>upd(t.id,"rows",Number(e.target.value))}
                style={{...s.input,textAlign:"center"}}/>
            </div>
            <div>
              <div style={{...s.hint,marginBottom:4}}>Columns</div>
              <input type="number" min={1} max={12} value={t.cols} onChange={e=>upd(t.id,"cols",Number(e.target.value))}
                style={{...s.input,textAlign:"center"}}/>
            </div>
          </div>

          {/* Toggles */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
            {[["hasHeader","Header Row"],["striped","Striped Rows"],["bordered","Borders"]].map(([k,lbl])=>(
              <button key={k} onClick={()=>upd(t.id,k,!t[k])} style={s.btn(t[k])}>{lbl}</button>
            ))}
          </div>

          {/* Colors */}
          {t.hasHeader && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <input type="color" value={t.headerBg} onChange={e=>upd(t.id,"headerBg",e.target.value)} style={{width:28,height:28,borderRadius:5,border:"1px solid #333",cursor:"pointer",padding:1}}/>
                <span style={s.hint}>Header BG</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <input type="color" value={t.headerText} onChange={e=>upd(t.id,"headerText",e.target.value)} style={{width:28,height:28,borderRadius:5,border:"1px solid #333",cursor:"pointer",padding:1}}/>
                <span style={s.hint}>Header Text</span>
              </div>
            </div>
          )}
          {t.striped && (
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <input type="color" value={t.stripeBg} onChange={e=>upd(t.id,"stripeBg",e.target.value)} style={{width:28,height:28,borderRadius:5,border:"1px solid #333",cursor:"pointer",padding:1}}/>
              <span style={s.hint}>Stripe Color</span>
            </div>
          )}
          {t.bordered && (
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <input type="color" value={t.borderColor} onChange={e=>upd(t.id,"borderColor",e.target.value)} style={{width:28,height:28,borderRadius:5,border:"1px solid #333",cursor:"pointer",padding:1}}/>
              <span style={s.hint}>Border Color</span>
            </div>
          )}

          {/* Column widths */}
          <input value={t.colWidths} onChange={e=>upd(t.id,"colWidths",e.target.value)}
            placeholder="Column widths e.g. 20%, 40%, 40% (optional)"
            style={{...s.input,marginBottom:8}}/>
          <input value={t.caption} onChange={e=>upd(t.id,"caption",e.target.value)}
            placeholder="Caption / title (optional)" style={{...s.input,marginBottom:8}}/>
          <textarea value={t.notes} onChange={e=>upd(t.id,"notes",e.target.value)}
            placeholder="Content notes — describe what data goes in this table..."
            style={{...s.input,height:60,resize:"vertical"}}/>

          {/* Mini Preview */}
          <div style={{marginTop:10,overflowX:"auto"}}>
            <table style={{borderCollapse:"collapse",width:"100%",fontSize:"0.72rem"}}>
              {t.caption && <caption style={{color:"#aaa",fontSize:"0.72rem",marginBottom:4,textAlign:"left"}}>{t.caption}</caption>}
              {t.hasHeader && (
                <thead>
                  <tr>{Array.from({length:t.cols},(_,ci)=>(
                    <th key={ci} style={{background:t.headerBg,color:t.headerText,padding:"5px 8px",border:t.bordered?`1px solid ${t.borderColor}`:"none",whiteSpace:"nowrap"}}>
                      Col {ci+1}
                    </th>
                  ))}</tr>
                </thead>
              )}
              <tbody>
                {Array.from({length:Math.min(t.rows,4)},(_,ri)=>(
                  <tr key={ri} style={{background:t.striped&&ri%2===1?t.stripeBg:"transparent"}}>
                    {Array.from({length:t.cols},(_,ci)=>(
                      <td key={ci} style={{padding:"4px 8px",border:t.bordered?`1px solid ${t.borderColor}`:"none",color:"#ccc"}}>
                        R{ri+1}C{ci+1}
                      </td>
                    ))}
                  </tr>
                ))}
                {t.rows > 4 && <tr><td colSpan={t.cols} style={{color:"#555",fontSize:"0.7rem",padding:"3px 8px",textAlign:"center"}}>…{t.rows-4} more rows</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <button onClick={add} style={s.addBtn}>+ Add Table</button>
    </div>
  );
};

// ── Card Builder ───────────────────────────────────────────────────────────
const cardLayouts = ["Single Column","Two Column Grid","Three Column Grid","Bento (mixed sizes)","Full Width Banner","Sidebar + Content"];
const defaultCard = () => ({
  id:uid(), name:"Card Group 1", layout:"Single Column", count:1,
  bg:"#ffffff", textColor:"#222222", accentColor:"#3498db",
  radius:8, shadow:true, padding:16,
  borderStyle:"none", borderColor:"#dddddd",
  hasIcon:false, hasImage:false, hasButton:false,
  notes:"",
});

const CardBuilder = ({cards, setCards}) => {
  const add = () => setCards(p=>[...p, {...defaultCard(), id:uid(), name:`Card Group ${p.length+1}`}]);
  const remove = id => setCards(p=>p.filter(c=>c.id!==id));
  const upd = (id,key,val) => setCards(p=>p.map(c=>c.id===id?{...c,[key]:val}:c));

  return (
    <div>
      <SectionTitle>Card Groups — define each layout block</SectionTitle>
      {cards.map(c=>(
        <div key={c.id} style={s.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <input value={c.name} onChange={e=>upd(c.id,"name",e.target.value)}
              style={{...s.input,width:"auto",flex:1,marginRight:10,fontWeight:700,fontSize:"0.9rem"}}/>
            <button onClick={()=>remove(c.id)} style={s.removeBtn}>✕ Remove</button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div>
              <div style={{...s.hint,marginBottom:4}}>Layout</div>
              <select value={c.layout} onChange={e=>upd(c.id,"layout",e.target.value)} style={{...s.select,width:"100%"}}>
                {cardLayouts.map(l=><option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <div style={{...s.hint,marginBottom:4}}># of Cards</div>
              <input type="number" min={1} max={20} value={c.count} onChange={e=>upd(c.id,"count",Number(e.target.value))}
                style={{...s.input,textAlign:"center"}}/>
            </div>
          </div>

          {/* Style toggles */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
            {[["shadow","Drop Shadow"],["hasIcon","Include Icon"],["hasImage","Include Image"],["hasButton","Include Button"]].map(([k,lbl])=>(
              <button key={k} onClick={()=>upd(c.id,k,!c[k])} style={s.btn(c[k])}>{lbl}</button>
            ))}
          </div>

          {/* Colors row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10}}>
            {[["bg","Background",c.bg,"bg"],["textColor","Text",c.textColor,"textColor"],["accentColor","Accent",c.accentColor,"accentColor"]].map(([k,lbl,val])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
                <input type="color" value={val} onChange={e=>upd(c.id,k,e.target.value)} style={{width:26,height:26,borderRadius:5,border:"1px solid #333",cursor:"pointer",padding:1}}/>
                <span style={s.hint}>{lbl}</span>
              </div>
            ))}
          </div>

          {/* Sliders */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
            <div>
              <div style={{...s.hint,marginBottom:4}}>Border Radius: {c.radius}px</div>
              <input type="range" min={0} max={24} value={c.radius} onChange={e=>upd(c.id,"radius",Number(e.target.value))} style={{width:"100%",accentColor:"#7c6fff"}}/>
            </div>
            <div>
              <div style={{...s.hint,marginBottom:4}}>Padding: {c.padding}px</div>
              <input type="range" min={8} max={40} value={c.padding} onChange={e=>upd(c.id,"padding",Number(e.target.value))} style={{width:"100%",accentColor:"#7c6fff"}}/>
            </div>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <select value={c.borderStyle} onChange={e=>upd(c.id,"borderStyle",e.target.value)} style={{...s.select,flex:1}}>
              {borderStyles.map(b=><option key={b} value={b}>{b.charAt(0).toUpperCase()+b.slice(1)} Border</option>)}
            </select>
            {c.borderStyle!=="none" && (
              <input type="color" value={c.borderColor} onChange={e=>upd(c.id,"borderColor",e.target.value)}
                style={{width:30,height:30,borderRadius:5,border:"1px solid #333",cursor:"pointer",padding:1}}/>
            )}
          </div>

          <textarea value={c.notes} onChange={e=>upd(c.id,"notes",e.target.value)}
            placeholder="Describe card content — e.g. 'Each card shows a KPI metric with icon, value, and trend arrow'"
            style={{...s.input,height:60,resize:"vertical"}}/>

          {/* Mini card preview */}
          <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
            {Array.from({length:Math.min(c.count,4)},(_,i)=>(
              <div key={i} style={{background:c.bg,borderRadius:c.radius,padding:c.padding/2,
                boxShadow:c.shadow?"0 2px 10px rgba(0,0,0,0.15)":"none",
                border:c.borderStyle!=="none"?`1.5px ${c.borderStyle} ${c.borderColor}`:"none",
                flex:1,minWidth:60,maxWidth:100,textAlign:"center"}}>
                {c.hasIcon && <div style={{fontSize:"1rem",marginBottom:3}}>⬡</div>}
                <div style={{width:"100%",height:6,background:c.accentColor,borderRadius:3,marginBottom:4}}/>
                <div style={{fontSize:"0.65rem",color:c.textColor,fontWeight:600}}>Card {i+1}</div>
                {c.hasButton && <div style={{marginTop:4,background:c.accentColor,color:"#fff",fontSize:"0.55rem",borderRadius:3,padding:"2px 4px"}}>Button</div>}
              </div>
            ))}
            {c.count > 4 && <div style={{display:"flex",alignItems:"center",color:"#555",fontSize:"0.72rem"}}>+{c.count-4} more</div>}
          </div>
        </div>
      ))}
      <button onClick={add} style={s.addBtn}>+ Add Card Group</button>
    </div>
  );
};

// ── Callout Builder ────────────────────────────────────────────────────────
const calloutTypes = ["💡 Tip","⚠️ Warning","ℹ️ Info","✅ Success","❌ Error","📌 Note","🔥 Important","💬 Quote"];
const defaultCallout = () => ({
  id:uid(), type:"💡 Tip", bg:"#eef6ff", borderColor:"#3498db",
  textColor:"#1a1a1a", borderSide:"left", borderWidth:4,
  radius:6, padding:14, count:1, notes:"",
});

const CalloutBuilder = ({callouts, setCallouts}) => {
  const add = () => setCallouts(p=>[...p, {...defaultCallout(), id:uid()}]);
  const remove = id => setCallouts(p=>p.filter(c=>c.id!==id));
  const upd = (id,key,val) => setCallouts(p=>p.map(c=>c.id===id?{...c,[key]:val}:c));

  return (
    <div style={{marginTop:20}}>
      <SectionTitle>Callout Boxes — define each type</SectionTitle>
      {callouts.map(c=>(
        <div key={c.id} style={s.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <select value={c.type} onChange={e=>upd(c.id,"type",e.target.value)} style={{...s.select,flex:1,marginRight:10,fontWeight:700}}>
              {calloutTypes.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={()=>remove(c.id)} style={s.removeBtn}>✕ Remove</button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
            <div>
              <div style={{...s.hint,marginBottom:4}}>Border Side</div>
              <select value={c.borderSide} onChange={e=>upd(c.id,"borderSide",e.target.value)} style={{...s.select,width:"100%"}}>
                {["left","top","right","bottom","all"].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{...s.hint,marginBottom:4}}>How Many</div>
              <input type="number" min={1} max={20} value={c.count} onChange={e=>upd(c.id,"count",Number(e.target.value))}
                style={{...s.input,textAlign:"center"}}/>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:8}}>
            {[["bg","BG",c.bg],["borderColor","Border",c.borderColor],["textColor","Text",c.textColor]].map(([k,lbl,val])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
                <input type="color" value={val} onChange={e=>upd(c.id,k,e.target.value)} style={{width:26,height:26,borderRadius:5,border:"1px solid #333",cursor:"pointer",padding:1}}/>
                <span style={s.hint}>{lbl}</span>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
            <div>
              <div style={{...s.hint,marginBottom:4}}>Border Width: {c.borderWidth}px</div>
              <input type="range" min={1} max={10} value={c.borderWidth} onChange={e=>upd(c.id,"borderWidth",Number(e.target.value))} style={{width:"100%",accentColor:"#7c6fff"}}/>
            </div>
            <div>
              <div style={{...s.hint,marginBottom:4}}>Radius: {c.radius}px</div>
              <input type="range" min={0} max={20} value={c.radius} onChange={e=>upd(c.id,"radius",Number(e.target.value))} style={{width:"100%",accentColor:"#7c6fff"}}/>
            </div>
          </div>

          <textarea value={c.notes} onChange={e=>upd(c.id,"notes",e.target.value)}
            placeholder="Describe this callout's content / purpose..."
            style={{...s.input,height:50,resize:"vertical",marginBottom:8}}/>

          {/* Preview */}
          <div style={{
            background:c.bg, color:c.textColor, borderRadius:c.radius, padding:c.padding,
            ...(c.borderSide==="all"
              ? {border:`${c.borderWidth}px solid ${c.borderColor}`}
              : {[`border${c.borderSide.charAt(0).toUpperCase()+c.borderSide.slice(1)}`]:`${c.borderWidth}px solid ${c.borderColor}`}
            ),
            fontSize:"0.8rem"
          }}>
            <strong>{c.type}</strong> Preview callout — your content goes here.
          </div>
        </div>
      ))}
      <button onClick={add} style={s.addBtn}>+ Add Callout Type</button>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function StyleArchitect() {
  const [activeTab, setActiveTab] = useState("colors");

  // Colors
  const [primaryColor, setPrimaryColor] = useState("#3498db");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [h1Color, setH1Color] = useState("#111111");
  const [h2Color, setH2Color] = useState("#222222");
  const [h3Color, setH3Color] = useState("#333333");
  const [pColor, setPColor] = useState("#444444");
  const [linkColor, setLinkColor] = useState("#3498db");
  const [coverBg, setCoverBg] = useState("#1a1a2e");
  const [coverText, setCoverText] = useState("#ffffff");
  const [footerBg, setFooterBg] = useState("#f5f5f5");
  const [footerText, setFooterText] = useState("#888888");

  // Typography
  const [bodyFont, setBodyFont] = useState("system-ui, sans-serif");
  const [headingFont, setHeadingFont] = useState("system-ui, sans-serif");
  const [baseFontSize, setBaseFontSize] = useState(14);
  const [h1Size, setH1Size] = useState(32);
  const [h2Size, setH2Size] = useState(24);
  const [h3Size, setH3Size] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [paragraphSpacing, setParagraphSpacing] = useState(16);
  const [textAlign, setTextAlign] = useState("left");
  const [headingBorderStyle, setHeadingBorderStyle] = useState("none");
  const [headingBorderColor, setHeadingBorderColor] = useState("#3498db");

  // Layout
  const [pageSize, setPageSize] = useState("A4");
  const [orientation, setOrientation] = useState("Portrait");
  const [marginPreset, setMarginPreset] = useState("20mm");
  const [customMargin, setCustomMargin] = useState("20mm");
  const [columnCount, setColumnCount] = useState(1);
  const [columnGap, setColumnGap] = useState(20);
  const [sectionPadding, setSectionPadding] = useState(24);
  const [listIndent, setListIndent] = useState(20);
  const [sectionDivider, setSectionDivider] = useState("solid");

  // Page Decor
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.08);
  const [headers, setHeaders] = useState([{ id: uid(), text: "", position: "left" }]);
  const [footers, setFooters] = useState([{ id: uid(), text: "", position: "center" }]);

  // Layout Builders
  const [tables, setTables] = useState([defaultTable()]);
  const [cards, setCards] = useState([defaultCard()]);
  const [callouts, setCallouts] = useState([defaultCallout()]);

  // Styles
  const [activeStyles, setActiveStyles] = useState([]);
  const [customText, setCustomText] = useState("");
  const [copied, setCopied] = useState(false);

  const toggleStyle = s => setActiveStyles(p => p.find(x=>x.id===s.id) ? p.filter(x=>x.id!==s.id) : [...p,s]);
  const isActive = id => activeStyles.some(s=>s.id===id);
  const margin = marginPreset === "custom" ? customMargin : marginPreset;

  const buildPrompt = () => {
    const tableSection = tables.map((t,i) => `
  Table ${i+1}: "${t.name}"
    Size: ${t.rows} rows × ${t.cols} columns${t.hasHeader?" (+ header row)":""}
    Style: ${[t.striped?"striped":"",t.bordered?"bordered":""].filter(Boolean).join(", ")||"plain"}
    ${t.hasHeader?`Header: bg=${t.headerBg}, text=${t.headerText}`:""}
    ${t.striped?`Stripe bg: ${t.stripeBg}`:""}
    ${t.bordered?`Border: ${t.borderColor}`:""}
    ${t.colWidths?`Column widths: ${t.colWidths}`:""}
    ${t.caption?`Caption: "${t.caption}"`:""}
    ${t.notes?`Content: ${t.notes}`:""}`.trim()).join("\n\n");

    const cardSection = cards.map((c,i) => `
  Card Group ${i+1}: "${c.name}"
    Layout: ${c.layout}  |  Count: ${c.count} cards
    Colors: bg=${c.bg}, text=${c.textColor}, accent=${c.accentColor}
    Style: radius=${c.radius}px, padding=${c.padding}px${c.shadow?", drop-shadow":""}
    Border: ${c.borderStyle}${c.borderStyle!=="none"?" "+c.borderColor:""}
    Includes: ${[c.hasIcon?"icon":"",c.hasImage?"image":"",c.hasButton?"button":""].filter(Boolean).join(", ")||"text only"}
    ${c.notes?`Content: ${c.notes}`:""}`.trim()).join("\n\n");

    const calloutSection = callouts.map((c,i) => `
  Callout ${i+1}: ${c.type}  (×${c.count})
    Colors: bg=${c.bg}, text=${c.textColor}, border=${c.borderColor}
    Border: ${c.borderWidth}px on ${c.borderSide} side, radius=${c.radius}px
    ${c.notes?`Content: ${c.notes}`:""}`.trim()).join("\n\n");

    return `=== PDF STYLE MANIFEST ===

── BRAND ──
primaryColor: ${primaryColor}  |  bgColor: ${bgColor}

── HEADING COLORS ──
H1: ${h1Color}  |  H2: ${h2Color}  |  H3: ${h3Color}
Body: ${pColor}  |  Links: ${linkColor}

── TYPOGRAPHY ──
bodyFont: ${bodyFont}
headingFont: ${headingFont}
baseFontSize: ${baseFontSize}px  |  lineHeight: ${lineHeight}
H1: ${h1Size}px  |  H2: ${h2Size}px  |  H3: ${h3Size}px
letterSpacing: ${letterSpacing}px  |  paragraphSpacing: ${paragraphSpacing}px
textAlign: ${textAlign}
headingUnderline: ${headingBorderStyle}${headingBorderStyle!=="none"?" "+headingBorderColor:""}

── PAGE LAYOUT ──
pageSize: ${pageSize} (${orientation})
margin: ${margin}  |  columns: ${columnCount}${columnCount>1?` (gap: ${columnGap}px)`:""}
sectionPadding: ${sectionPadding}px  |  listIndent: ${listIndent}px
sectionDivider: ${sectionDivider}

── COVER PAGE ──
bg: ${coverBg}  |  text: ${coverText}

── HEADERS ──
${headers.filter(h=>h.text.trim()).map(h=>`  "${h.text}" — ${h.position}`).join("\n")||"  None specified."}

── FOOTERS ──
${footers.filter(f=>f.text.trim()).map(f=>`  "${f.text}" — ${f.position}`).join("\n")||"  None specified."}
  bg: ${footerBg}  |  text: ${footerText}

── WATERMARK ──
text: "${watermarkText}"  |  opacity: ${watermarkOpacity}

── TABLES (${tables.length}) ──
${tableSection}

── CARD GROUPS (${cards.length}) ──
${cardSection}

── CALLOUT BOXES (${callouts.length}) ──
${calloutSection}

── ACTIVE STYLE DIRECTIVES ──
${activeStyles.map(s=>`- ${s.prompt}`).join("\n")||"None selected."}

── CUSTOM INSTRUCTIONS ──
${customText.trim()||"None."}

=== TOOLS ENABLED ===
• Div Engine, CSS Grid/Flexbox, Semantic HTML
• Raw SVG for flowcharts/icons, Pure CSS charts
• Print: break-inside, orphans/widows, @page, CSS counters
• Puppeteer background printing forced on
• CSS ::before/::after pseudo-elements
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildPrompt());
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  };

  const tabs = [
    {id:"colors",label:"🎨 Colors"},
    {id:"typography",label:"🔤 Typography"},
    {id:"layout",label:"📐 Layout"},
    {id:"tables",label:"📊 Tables"},
    {id:"cards",label:"🃏 Cards"},
    {id:"callouts",label:"📣 Callouts"},
    {id:"pagedec",label:"🖨️ Page Decor"},
    {id:"styles",label:"⚡ Presets"},
    {id:"custom",label:"✏️ Custom"},
  ];

  return (
    <div style={{fontFamily:"system-ui,sans-serif",background:"#0d0d1a",minHeight:"100vh",color:"#eee",padding:"28px 20px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>

        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:"1.5rem",fontWeight:800,margin:0,background:"linear-gradient(135deg,#7c6fff,#48dbfb)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            🎨 Style Architect
          </h1>
          <p style={{color:"#555",marginTop:5,fontSize:"0.85rem"}}>Configure every CSS & HTML property, define your tables/cards/callouts, then copy the prompt to your MCP server.</p>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
              padding:"7px 13px",borderRadius:20,border:"none",cursor:"pointer",fontSize:"0.78rem",fontWeight:600,
              background:activeTab===t.id?"#7c6fff":"#1a1a2e",
              color:activeTab===t.id?"white":"#666",transition:"all 0.15s"
            }}>{t.label}</button>
          ))}
        </div>

        <div style={s.panel}>
          {activeTab==="colors" && (
            <div>
              <SectionTitle>Global Brand</SectionTitle>
              <ColorPick label="Primary / Accent" hint="Buttons, borders, highlights" value={primaryColor} onChange={setPrimaryColor}/>
              <ColorPick label="Page Background" hint="Main document background" value={bgColor} onChange={setBgColor}/>
              <div style={{height:16}}/>
              <SectionTitle>Headings</SectionTitle>
              <ColorPick label="H1" value={h1Color} onChange={setH1Color}/>
              <ColorPick label="H2" value={h2Color} onChange={setH2Color}/>
              <ColorPick label="H3" value={h3Color} onChange={setH3Color}/>
              <div style={{height:16}}/>
              <SectionTitle>Text & Links</SectionTitle>
              <ColorPick label="Body / Paragraph" value={pColor} onChange={setPColor}/>
              <ColorPick label="Links" value={linkColor} onChange={setLinkColor}/>
              <div style={{height:16}}/>
              <SectionTitle>Cover Page</SectionTitle>
              <ColorPick label="Cover Background" value={coverBg} onChange={setCoverBg}/>
              <ColorPick label="Cover Text" value={coverText} onChange={setCoverText}/>
            </div>
          )}
          {activeTab==="typography" && (
            <div>
              <SectionTitle>Font Families</SectionTitle>
              <Select label="Body Font" value={bodyFont} onChange={setBodyFont} options={fontFamilies}/>
              <Select label="Heading Font" value={headingFont} onChange={setHeadingFont} options={fontFamilies}/>
              <div style={{height:16}}/>
              <SectionTitle>Sizes</SectionTitle>
              <Slider label="Base / Body" value={baseFontSize} onChange={setBaseFontSize} min={10} max={20} unit="px"/>
              <Slider label="H1" value={h1Size} onChange={setH1Size} min={20} max={60} unit="px"/>
              <Slider label="H2" value={h2Size} onChange={setH2Size} min={16} max={48} unit="px"/>
              <Slider label="H3" value={h3Size} onChange={setH3Size} min={14} max={36} unit="px"/>
              <div style={{height:16}}/>
              <SectionTitle>Spacing & Rhythm</SectionTitle>
              <Slider label="Line Height" value={lineHeight} onChange={setLineHeight} min={1.0} max={2.5} step={0.05}/>
              <Slider label="Letter Spacing" value={letterSpacing} onChange={setLetterSpacing} min={-1} max={5} step={0.5} unit="px"/>
              <Slider label="Paragraph Spacing" value={paragraphSpacing} onChange={setParagraphSpacing} min={8} max={40} unit="px"/>
              <div style={{height:16}}/>
              <SectionTitle>Alignment & Decoration</SectionTitle>
              <Select label="Text Align" value={textAlign} onChange={setTextAlign} options={alignOptions.map(v=>({label:v.charAt(0).toUpperCase()+v.slice(1),value:v}))}/>
              <Select label="Heading Underline" value={headingBorderStyle} onChange={setHeadingBorderStyle} options={borderStyles.map(v=>({label:v.charAt(0).toUpperCase()+v.slice(1),value:v}))}/>
              {headingBorderStyle!=="none" && <ColorPick label="Underline Color" value={headingBorderColor} onChange={setHeadingBorderColor}/>}
            </div>
          )}
          {activeTab==="layout" && (
            <div>
              <SectionTitle>Page Setup</SectionTitle>
              <Select label="Page Size" value={pageSize} onChange={setPageSize} options={pageSizes.map(v=>({label:v,value:v}))}/>
              <Select label="Orientation" value={orientation} onChange={setOrientation} options={pageOrientations.map(v=>({label:v,value:v}))}/>
              <Select label="Margins" value={marginPreset} onChange={setMarginPreset} options={marginPresets}/>
              {marginPreset==="custom" && (
                <div style={{padding:"8px 0",borderBottom:"1px solid #1e1e32"}}>
                  <input value={customMargin} onChange={e=>setCustomMargin(e.target.value)} placeholder="e.g. 15mm or 10mm 20mm" style={s.input}/>
                </div>
              )}
              <div style={{height:16}}/>
              <SectionTitle>Columns</SectionTitle>
              <Slider label="Column Count" value={columnCount} onChange={setColumnCount} min={1} max={4}/>
              {columnCount>1 && <Slider label="Column Gap" value={columnGap} onChange={setColumnGap} min={10} max={60} unit="px"/>}
              <div style={{height:16}}/>
              <SectionTitle>Spacing</SectionTitle>
              <Slider label="Section Padding" value={sectionPadding} onChange={setSectionPadding} min={8} max={60} unit="px"/>
              <Slider label="List Indent" value={listIndent} onChange={setListIndent} min={10} max={50} unit="px"/>
              <Select label="Section Divider" value={sectionDivider} onChange={setSectionDivider} options={borderStyles.filter(b=>b!=="none").map(v=>({label:v.charAt(0).toUpperCase()+v.slice(1),value:v}))}/>
            </div>
          )}
          {activeTab==="tables" && <TableBuilder tables={tables} setTables={setTables}/>}
          {activeTab==="cards" && <CardBuilder cards={cards} setCards={setCards}/>}
          {activeTab==="callouts" && <CalloutBuilder callouts={callouts} setCallouts={setCallouts}/>}
          {activeTab==="pagedec" && (
            <div>
              <SectionTitle>Headers</SectionTitle>
              {headers.map((h, i) => (
                <div key={h.id} style={{ ...s.card, display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "center" }}>
                  <input value={h.text} onChange={e => setHeaders(p => p.map(x => x.id === h.id ? { ...x, text: e.target.value } : x))}
                    placeholder={`Header line ${i + 1} text…`} style={s.input} />
                  <select value={h.position} onChange={e => setHeaders(p => p.map(x => x.id === h.id ? { ...x, position: e.target.value } : x))} style={s.select}>
                    {["left","center","right"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button onClick={() => setHeaders(p => p.filter(x => x.id !== h.id))} style={s.removeBtn}>✕</button>
                </div>
              ))}
              <button onClick={() => setHeaders(p => [...p, { id: uid(), text: "", position: "left" }])} style={{ ...s.addBtn, marginBottom: 16 }}>+ Add Header Line</button>

              <SectionTitle>Footers</SectionTitle>
              {footers.map((f, i) => (
                <div key={f.id} style={{ ...s.card, display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "center" }}>
                  <input value={f.text} onChange={e => setFooters(p => p.map(x => x.id === f.id ? { ...x, text: e.target.value } : x))}
                    placeholder={`Footer line ${i + 1} text… (use {page} for page number)`} style={s.input} />
                  <select value={f.position} onChange={e => setFooters(p => p.map(x => x.id === f.id ? { ...x, position: e.target.value } : x))} style={s.select}>
                    {["left","center","right"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button onClick={() => setFooters(p => p.filter(x => x.id !== f.id))} style={s.removeBtn}>✕</button>
                </div>
              ))}
              <button onClick={() => setFooters(p => [...p, { id: uid(), text: "", position: "center" }])} style={{ ...s.addBtn, marginBottom: 16 }}>+ Add Footer Line</button>

              <ColorPick label="Header / Footer Background" value={footerBg} onChange={setFooterBg}/>
              <ColorPick label="Header / Footer Text Color" value={footerText} onChange={setFooterText}/>
              <div style={{height:16}}/>
              <SectionTitle>Watermark</SectionTitle>
              <TextInput label="Watermark Text" value={watermarkText} onChange={setWatermarkText} placeholder="CONFIDENTIAL"/>
              <Slider label="Opacity" value={watermarkOpacity} onChange={setWatermarkOpacity} min={0.02} max={0.3} step={0.01}/>
              <div style={{marginTop:14,position:"relative",background:"#f9f9f9",borderRadius:8,padding:"24px 20px",overflow:"hidden",textAlign:"center"}}>
                <p style={{margin:0,color:"#333",fontSize:"0.8rem",position:"relative",zIndex:1}}>Page content preview</p>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%) rotate(-35deg)",
                  fontSize:"1.3rem",fontWeight:800,color:`rgba(0,0,0,${watermarkOpacity*3.3})`,whiteSpace:"nowrap",pointerEvents:"none"}}>
                  {watermarkText}
                </div>
              </div>
            </div>
          )}
          {activeTab==="styles" && (
            <div>
              <SectionTitle>Style Presets — toggle any combination</SectionTitle>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
                {styleOptions.map(opt=>(
                  <button key={opt.id} onClick={()=>toggleStyle(opt)} style={{
                    padding:"8px 15px",borderRadius:25,cursor:"pointer",fontWeight:500,fontSize:"0.83rem",
                    border:`2px solid ${isActive(opt.id)?"#7c6fff":"#2a2a3a"}`,
                    background:isActive(opt.id)?"#7c6fff":"#1a1a2e",
                    color:isActive(opt.id)?"white":"#777"
                  }}>{opt.label}</button>
                ))}
              </div>
              {activeStyles.length>0 && (
                <div style={{marginTop:18}}>
                  <SectionTitle>Active Directives</SectionTitle>
                  {activeStyles.map(s=>(
                    <div key={s.id} style={{padding:"7px 0",borderBottom:"1px solid #1e1e32",fontSize:"0.82rem",color:"#888"}}>
                      <span style={{color:"#7c6fff",fontWeight:600}}>{s.label}: </span>{s.prompt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab==="custom" && (
            <div>
              <SectionTitle>Custom CSS / Layout Instructions</SectionTitle>
              <textarea value={customText} onChange={e=>setCustomText(e.target.value)}
                placeholder={"e.g.\n- Make every third table row red\n- Add a thick top border to h1 using primaryColor\n- Use a drop cap on the first paragraph\n- Add a large background quote mark to blockquotes"}
                style={{...s.input,height:200,resize:"vertical",lineHeight:1.7}}/>
            </div>
          )}
        </div>

        {/* Prompt Preview */}
        <div style={{...s.panel,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={s.sectionTitle}>Generated MCP Prompt</span>
            <span style={{fontSize:"0.72rem",color:"#444"}}>{buildPrompt().length} chars</span>
          </div>
          <pre style={{background:"#0a0a14",color:"#7ec8e3",borderRadius:10,padding:16,
            fontSize:"0.71rem",whiteSpace:"pre-wrap",wordBreak:"break-word",
            maxHeight:260,overflowY:"auto",lineHeight:1.7,margin:0}}>
            {buildPrompt()}
          </pre>
        </div>

        <button onClick={handleCopy} style={{
          width:"100%",padding:14,borderRadius:12,border:"none",
          background:copied?"#27ae60":"linear-gradient(135deg,#7c6fff,#48dbfb)",
          color:"white",fontWeight:700,fontSize:"1rem",cursor:"pointer",letterSpacing:"0.02em"
        }}>
          {copied?"✓ Copied to Clipboard!":"Copy Prompt to MCP Server"}
        </button>
        <p style={{color:"#444",fontSize:"0.76rem",marginTop:8,textAlign:"center"}}>
          Paste into your MCP server to give the AI complete styling + layout instructions for PDF generation.
        </p>
      </div>
    </div>
  );
}