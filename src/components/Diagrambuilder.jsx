import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, PieChart, TrendingUp, GitBranch, Layers, Grid,
  Download, Plus, Trash2, Sparkles, ArrowLeft, Check,
  FileDown, Table2, Activity, Gauge, ScatterChart,
  ChevronDown, ChevronUp, Square, Circle, Diamond,
  Type, Minus, ArrowRight, Image, Hexagon, Triangle,
  Move, MousePointer, ZoomIn, ZoomOut, RotateCcw,
  AlignLeft, AlignCenter, Bold, Italic, Palette,
  Copy, Scissors, Maximize2, Lock, Unlock,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const PALETTES = {
  blue:   ['#3b82f6','#2563eb','#1d4ed8','#60a5fa','#93c5fd','#bfdbfe'],
  green:  ['#22c55e','#16a34a','#15803d','#4ade80','#86efac','#bbf7d0'],
  purple: ['#a855f7','#9333ea','#7e22ce','#c084fc','#d8b4fe','#ede9fe'],
  warm:   ['#f97316','#ea580c','#ef4444','#fb923c','#fca5a5','#fed7aa'],
  mono:   ['#334155','#475569','#64748b','#94a3b8','#cbd5e1','#e2e8f0'],
  vivid:  ['#ef4444','#3b82f6','#22c55e','#eab308','#a855f7','#06b6d4'],
  ocean:  ['#0284c7','#0369a1','#075985','#38bdf8','#7dd3fc','#bae6fd'],
  sunset: ['#f43f5e','#fb923c','#facc15','#e879f9','#818cf8','#34d399'],
  neon:   ['#00ff88','#00ccff','#ff00ff','#ffff00','#ff6600','#0066ff'],
  earth:  ['#92400e','#78350f','#b45309','#d97706','#fbbf24','#fde68a'],
};

const SHAPE_TYPES = [
  { id:'rect',    label:'Rectangle',  icon: Square    },
  { id:'circle',  label:'Ellipse',    icon: Circle    },
  { id:'diamond', label:'Diamond',    icon: Diamond   },
  { id:'triangle',label:'Triangle',   icon: Triangle  },
  { id:'hexagon', label:'Hexagon',    icon: Hexagon   },
  { id:'text',    label:'Text Box',   icon: Type      },
  { id:'line',    label:'Line',       icon: Minus     },
  { id:'arrow',   label:'Arrow',      icon: ArrowRight},
];

const CHART_EMBED_TYPES = [
  { id:'bar',      label:'Bar Chart',    icon: BarChart2    },
  { id:'grouped',  label:'Grouped Bar',  icon: BarChart2    },
  { id:'line',     label:'Line Chart',   icon: TrendingUp   },
  { id:'area',     label:'Area Chart',   icon: Activity     },
  { id:'pie',      label:'Pie Chart',    icon: PieChart     },
  { id:'donut',    label:'Donut Chart',  icon: PieChart     },
  { id:'scatter',  label:'Scatter',      icon: ScatterChart },
  { id:'gauge',    label:'KPI Gauge',    icon: Gauge        },
  { id:'table',    label:'Data Table',   icon: Table2       },
  { id:'timeline', label:'Timeline',     icon: Layers       },
  { id:'flow',     label:'Flow',         icon: GitBranch    },
  { id:'grid',     label:'Icon Grid',    icon: Grid         },
  { id:'funnel',   label:'Funnel',       icon: Triangle     },
  { id:'heatmap',  label:'Heat Map',     icon: Grid         },
  { id:'treemap',  label:'Tree Map',     icon: Maximize2    },
  { id:'radar',    label:'Radar/Spider', icon: Hexagon      },
  { id:'waterfall',label:'Waterfall',    icon: BarChart2    },
  { id:'bullet',   label:'Bullet Chart', icon: Minus        },
  { id:'pyramid',  label:'Pyramid',      icon: Triangle     },
  { id:'venn',     label:'Venn Diagram', icon: Circle       },
  { id:'sankey',   label:'Sankey Flow',  icon: ArrowRight   },
  { id:'orgchart', label:'Org Chart',    icon: GitBranch    },
  { id:'mindmap',  label:'Mind Map',     icon: Hexagon      },
  { id:'swimlane', label:'Swim Lane',    icon: Layers       },
];

const DEFAULT_CHART_DATA = {
  bar:      { data:[{name:'Q1',v:42},{name:'Q2',v:68},{name:'Q3',v:55},{name:'Q4',v:81}] },
  grouped:  { labels:['Q1','Q2','Q3'], series:[{name:'A',vals:[42,68,55]},{name:'B',vals:[30,50,45]}] },
  line:     { data:[{name:'Jan',v:30},{name:'Feb',v:45},{name:'Mar',v:38},{name:'Apr',v:60},{name:'May',v:78}] },
  area:     { data:[{name:'Jan',v:30},{name:'Feb',v:45},{name:'Mar',v:38},{name:'Apr',v:60},{name:'May',v:78}] },
  pie:      { data:[{name:'A',v:35},{name:'B',v:25},{name:'C',v:20},{name:'D',v:20}] },
  donut:    { data:[{name:'A',v:35},{name:'B',v:25},{name:'C',v:20},{name:'D',v:20}] },
  scatter:  { data:[{x:10,y:20},{x:25,y:45},{x:40,y:30},{x:55,y:70},{x:70,y:55}] },
  gauge:    { data:[{label:'Score',value:78,max:100,unit:'%'}] },
  table:    { headers:['Item','Value','Change'], rows:[['Alpha','$1.2M','+12%'],['Beta','$0.8M','+5%'],['Gamma','$2.1M','+18%']] },
  timeline: { data:[{year:'2020',title:'Start',desc:'Founded'},{year:'2021',title:'Launch',desc:'MVP live'},{year:'2022',title:'Growth',desc:'10k users'},{year:'2023',title:'Scale',desc:'Series A'}] },
  flow:     { nodes:[{id:'1',label:'Start',x:30,y:30,shape:'circle',color:'#22c55e'},{id:'2',label:'Process',x:130,y:30,shape:'rect',color:'#3b82f6'},{id:'3',label:'End',x:230,y:30,shape:'circle',color:'#ef4444'}], edges:[{from:'1',to:'2'},{from:'2',to:'3'}] },
  grid:     { data:[{icon:'🚀',title:'Speed',desc:'Fast'},{icon:'🔒',title:'Secure',desc:'Safe'},{icon:'📊',title:'Analytics',desc:'Smart'},{icon:'🌍',title:'Global',desc:'Worldwide'}] },
  funnel:   { data:[{label:'Awareness',v:1000},{label:'Interest',v:600},{label:'Decision',v:300},{label:'Action',v:100}] },
  heatmap:  { rows:['Mon','Tue','Wed','Thu','Fri'], cols:['9am','12pm','3pm','6pm'], data:[[3,7,5,2],[5,9,8,4],[4,6,7,3],[6,8,9,5],[2,5,4,1]] },
  treemap:  { data:[{label:'Product A',v:400},{label:'Product B',v:300},{label:'Product C',v:200},{label:'Product D',v:100}] },
  radar:    { labels:['Speed','Quality','Cost','UX','Support'], series:[{name:'Us',vals:[80,90,60,85,70]},{name:'Them',vals:[60,70,80,65,90]}] },
  waterfall:{ data:[{label:'Start',v:100,base:0},{label:'Sales',v:50,base:100},{label:'Costs',v:-30,base:150},{label:'Tax',v:-10,base:120},{label:'Net',v:110,base:0,total:true}] },
  bullet:   { data:[{label:'Revenue',actual:75,target:80,max:100},{label:'Growth',actual:12,target:15,max:20}] },
  pyramid:  { data:[{label:'Executive',v:5},{label:'Manager',v:20},{label:'Senior',v:60},{label:'Junior',v:150},{label:'Intern',v:300}] },
  venn:     { sets:[{label:'Set A',x:140,r:90,color:'#3b82f6'},{label:'Set B',x:220,r:90,color:'#22c55e'}], overlap:'A ∩ B' },
  sankey:   { nodes:['Revenue','Product','Service','COGS','Profit'], flows:[{from:0,to:1,v:60},{from:0,to:2,v:40},{from:1,to:3,v:25},{from:1,to:4,v:35},{from:2,to:4,v:40}] },
  orgchart: { nodes:[{id:'ceo',label:'CEO',role:'Leadership',x:140,y:10},{id:'cto',label:'CTO',role:'Tech',x:60,y:80},{id:'cfo',label:'CFO',role:'Finance',x:220,y:80}], edges:[{from:'ceo',to:'cto'},{from:'ceo',to:'cfo'}] },
  mindmap:  { center:'Main Topic', branches:[{label:'Branch 1',children:['Item A','Item B']},{label:'Branch 2',children:['Item C','Item D']},{label:'Branch 3',children:['Item E']}] },
  swimlane: { lanes:['Planning','Development','Testing'], items:[{lane:0,label:'Design',x:20,w:80},{lane:1,label:'Build',x:120,w:100},{lane:2,label:'QA',x:240,w:80}] },
};

// ═══════════════════════════════════════════════════════════════
// SVG CHART RENDERERS  (compact — renders into given w×h)
// ═══════════════════════════════════════════════════════════════
function renderChartSVG(type, chartData, palette, w, h, textColor, bgColor) {
  const C = PALETTES[palette] || PALETTES.blue;
  const tc = textColor || '#1e293b';

  const wrap = (body) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <rect width="${w}" height="${h}" fill="${bgColor||'#fff'}" rx="8"/>
      ${body}
    </svg>`;

  const d = chartData || DEFAULT_CHART_DATA[type] || {};

  try {
    if (type === 'bar') {
      const rows = d.data || DEFAULT_CHART_DATA.bar.data;
      const pd = {t:40,r:20,b:40,l:40};
      const cw=w-pd.l-pd.r, ch=h-pd.t-pd.b;
      const max = Math.max(...rows.map(r=>r.v||r.value||0))*1.2||1;
      const bw = cw/rows.length*0.6, gap = cw/rows.length*0.4;
      const bars = rows.map((r,i)=>{
        const v=r.v||r.value||0, bh=Math.max((v/max)*ch,2);
        const x=pd.l+i*(bw+gap)+gap/2, y=pd.t+ch-bh;
        return `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${C[i%C.length]}" rx="3"/>
<text x="${x+bw/2}" y="${y-4}" text-anchor="middle" fill="${tc}" font-size="${Math.max(9,w/60)}" font-weight="600">${v}</text>
<text x="${x+bw/2}" y="${pd.t+ch+14}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/65)}">${r.name||r.label||''}</text>`;
      }).join('');
      return wrap(`<line x1="${pd.l}" y1="${pd.t+ch}" x2="${pd.l+cw}" y2="${pd.t+ch}" stroke="${tc}" opacity="0.2"/>
<line x1="${pd.l}" y1="${pd.t}" x2="${pd.l}" y2="${pd.t+ch}" stroke="${tc}" opacity="0.2"/>${bars}`);
    }

    if (type === 'line' || type === 'area') {
      const rows = d.data || DEFAULT_CHART_DATA.line.data;
      const pd={t:30,r:20,b:35,l:35};
      const cw=w-pd.l-pd.r, ch=h-pd.t-pd.b;
      const max=Math.max(...rows.map(r=>r.v||r.value||0))*1.2||1;
      const pts=rows.map((r,i)=>({x:pd.l+i*(cw/(rows.length-1||1)),y:pd.t+ch-(((r.v||r.value||0)/max)*ch)}));
      const path=pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
      const col=C[0];
      const areaEl=type==='area'?`<defs><linearGradient id="ag${w}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${col}" stop-opacity="0.35"/><stop offset="100%" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
<path d="${path} L${pts[pts.length-1].x},${pd.t+ch} L${pts[0].x},${pd.t+ch}Z" fill="url(#ag${w})"/>`:'';
      const dots=pts.map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="4" fill="${col}" stroke="white" stroke-width="1.5"/>
<text x="${p.x}" y="${p.y-8}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/70)}">${rows[i].v||rows[i].value||0}</text>`).join('');
      const lbls=rows.map((r,i)=>`<text x="${pts[i].x}" y="${pd.t+ch+14}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/70)}">${r.name||''}</text>`).join('');
      return wrap(`${areaEl}<path d="${path}" fill="none" stroke="${col}" stroke-width="2.5"/>${dots}${lbls}`);
    }

    if (type === 'pie' || type === 'donut') {
      const rows = d.data || DEFAULT_CHART_DATA.pie.data;
      const cx=w*0.38, cy=h/2, r=Math.min(w,h)*0.38, hole=type==='donut'?r*0.45:0;
      const total=rows.reduce((s,r)=>s+(r.v||r.value||0),0)||1;
      let ang=-Math.PI/2;
      const slices=rows.map((row,i)=>{
        const v=row.v||row.value||0, sw=(v/total)*2*Math.PI;
        const x1=cx+r*Math.cos(ang),y1=cy+r*Math.sin(ang);
        const a2=ang+sw, x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2), lg=sw>Math.PI?1:0;
        const mx=cx+((r+hole)/2)*Math.cos(ang+sw/2), my=cy+((r+hole)/2)*Math.sin(ang+sw/2);
        let path;
        if(type==='donut'){const ix1=cx+hole*Math.cos(ang),iy1=cy+hole*Math.sin(ang),ix2=cx+hole*Math.cos(a2),iy2=cy+hole*Math.sin(a2);path=`M${x1},${y1} A${r},${r} 0 ${lg} 1 ${x2},${y2} L${ix2},${iy2} A${hole},${hole} 0 ${lg} 0 ${ix1},${iy1}Z`;}
        else{path=`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${lg} 1 ${x2},${y2}Z`;}
        ang+=sw;
        const pct=Math.round((v/total)*100);
        return `<path d="${path}" fill="${C[i%C.length]}" stroke="white" stroke-width="1.5"/>${pct>6?`<text x="${mx}" y="${my+4}" text-anchor="middle" fill="white" font-size="${Math.max(9,w/55)}" font-weight="700">${pct}%</text>`:''}`;
      }).join('');
      const legend=rows.map((row,i)=>`<rect x="${w*0.72}" y="${h*0.15+i*22}" width="12" height="12" fill="${C[i%C.length]}" rx="2"/><text x="${w*0.72+16}" y="${h*0.15+i*22+10}" fill="${tc}" font-size="${Math.max(9,w/65)}">${row.name||row.label||''}</text>`).join('');
      return wrap(`${slices}${legend}`);
    }

    if (type === 'scatter') {
      const rows = d.data || DEFAULT_CHART_DATA.scatter.data;
      const pd={t:30,r:20,b:35,l:35};
      const cw=w-pd.l-pd.r, ch=h-pd.t-pd.b;
      const maxX=Math.max(...rows.map(r=>r.x))*1.1||1, maxY=Math.max(...rows.map(r=>r.y))*1.1||1;
      const col=C[0];
      const dots=rows.map(r=>`<circle cx="${pd.l+(r.x/maxX)*cw}" cy="${pd.t+ch-(r.y/maxY)*ch}" r="5" fill="${col}" fill-opacity="0.7" stroke="white" stroke-width="1.5"/>`).join('');
      return wrap(`<line x1="${pd.l}" y1="${pd.t}" x2="${pd.l}" y2="${pd.t+ch}" stroke="${tc}" opacity="0.2"/>
<line x1="${pd.l}" y1="${pd.t+ch}" x2="${pd.l+cw}" y2="${pd.t+ch}" stroke="${tc}" opacity="0.2"/>${dots}`);
    }

    if (type === 'gauge') {
      const items = d.data || DEFAULT_CHART_DATA.gauge.data;
      const g=items[0]||{label:'Score',value:75,max:100,unit:'%'};
      const cx=w/2, cy=h*0.62, r=Math.min(w,h)*0.36, sw=22;
      const pct=Math.min((g.value||75)/(g.max||100),1);
      const sA=Math.PI, arcA=sA+pct*Math.PI, eA=2*Math.PI;
      const x1=cx+r*Math.cos(sA),y1=cy+r*Math.sin(sA);
      const x2=cx+r*Math.cos(arcA),y2=cy+r*Math.sin(arcA);
      const x3=cx+r*Math.cos(eA),y3=cy+r*Math.sin(eA);
      const large=pct>0.5?1:0, col=C[0];
      return wrap(`<path d="M${x1},${y1} A${r},${r} 0 1 1 ${x3},${y3}" fill="none" stroke="#e2e8f0" stroke-width="${sw}" stroke-linecap="round"/>
<path d="M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>
<text x="${cx}" y="${cy-8}" text-anchor="middle" fill="${tc}" font-size="${Math.max(18,w/18)}" font-weight="700">${g.value}${g.unit||''}</text>
<text x="${cx}" y="${cy+14}" text-anchor="middle" fill="${tc}" font-size="${Math.max(10,w/55)}" opacity="0.7">${g.label||''}</text>
<text x="${cx}" y="${cy+30}" text-anchor="middle" fill="${col}" font-size="${Math.max(10,w/55)}" font-weight="600">${Math.round(pct*100)}%</text>`);
    }

    if (type === 'table') {
      const { headers=[], rows=[] } = d;
      const ac=C[0], rh=Math.min(32, (h-50)/Math.max(rows.length+1,1));
      const cw_=(w-20)/Math.max(headers.length,1);
      const hdrs=headers.map((h_,i)=>`<rect x="${10+i*cw_}" y="30" width="${cw_}" height="${rh}" fill="${ac}"/><text x="${10+i*cw_+cw_/2}" y="${30+rh*0.65}" text-anchor="middle" fill="white" font-size="${Math.max(9,w/70)}" font-weight="700">${h_}</text>`).join('');
      const body=rows.map((row,ri)=>row.map((cell,ci)=>`<rect x="${10+ci*cw_}" y="${30+rh+ri*rh}" width="${cw_}" height="${rh}" fill="${ri%2===0?'rgba(0,0,0,0.03)':'transparent'}" stroke="#e2e8f0" stroke-width="0.5"/><text x="${10+ci*cw_+cw_/2}" y="${30+rh+ri*rh+rh*0.65}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/75)}">${cell}</text>`).join('')).join('');
      return wrap(`${hdrs}${body}`);
    }

    if (type === 'timeline') {
      const items = d.data || DEFAULT_CHART_DATA.timeline.data;
      const sy=h*0.5, sx=30, ex=w-30, step=(ex-sx)/(items.length-1||1);
      const pts=items.map((item,i)=>{
        const x=sx+i*step, top=i%2===0;
        return `<circle cx="${x}" cy="${sy}" r="8" fill="${C[i%C.length]}" stroke="white" stroke-width="2"/>
<line x1="${x}" y1="${sy+(top?-8:8)}" x2="${x}" y2="${sy+(top?-22:22)}" stroke="${C[i%C.length]}" stroke-width="1.5"/>
<text x="${x}" y="${sy+(top?-28:36)}" text-anchor="middle" fill="${tc}" font-size="${Math.max(9,w/65)}" font-weight="700">${item.title||''}</text>
<text x="${x}" y="${sy+(top?-42:50)}" text-anchor="middle" fill="${C[i%C.length]}" font-size="${Math.max(8,w/70)}">${item.year||''}</text>`;
      }).join('');
      return wrap(`<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${sy}" stroke="#e2e8f0" stroke-width="2.5"/>${pts}`);
    }

    if (type === 'flow') {
      const { nodes=[], edges=[] } = d;
      const scaleX = (w-60)/300, scaleY = (h-60)/120;
      const edgesEl=edges.map(e=>{
        const fn=nodes.find(n=>n.id===e.from), tn=nodes.find(n=>n.id===e.to);
        if(!fn||!tn)return '';
        const x1=30+fn.x*scaleX+35*scaleX, y1=30+fn.y*scaleY+20*scaleY;
        const x2=30+tn.x*scaleX, y2=30+tn.y*scaleY+20*scaleY;
        return `<path d="M${x1},${y1} C${(x1+x2)/2},${y1} ${(x1+x2)/2},${y2} ${x2},${y2}" fill="none" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arr_${w})"/>`;
      }).join('');
      const nodesEl=nodes.map(n=>{
        const nx=30+n.x*scaleX, ny=30+n.y*scaleY, col=n.color||C[0];
        const nw=Math.max(50,w*0.12), nh=Math.max(24,h*0.1);
        const lbl=`<text x="${nx+nw/2}" y="${ny+nh/2+4}" text-anchor="middle" fill="white" font-size="${Math.max(9,w/70)}" font-weight="600">${n.label||''}</text>`;
        if(n.shape==='circle')return `<ellipse cx="${nx+nw/2}" cy="${ny+nh/2}" rx="${nw/2}" ry="${nh/2}" fill="${col}"/>${lbl}`;
        if(n.shape==='diamond')return `<polygon points="${nx+nw/2},${ny} ${nx+nw},${ny+nh/2} ${nx+nw/2},${ny+nh} ${nx},${ny+nh/2}" fill="${col}"/>${lbl}`;
        return `<rect x="${nx}" y="${ny}" width="${nw}" height="${nh}" fill="${col}" rx="5"/>${lbl}`;
      }).join('');
      return wrap(`<defs><marker id="arr_${w}" markerWidth="7" markerHeight="5" refX="5" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#94a3b8"/></marker></defs>${edgesEl}${nodesEl}`);
    }

    if (type === 'grid') {
      const items = d.data || DEFAULT_CHART_DATA.grid.data;
      const ac=C[0], cols=Math.min(items.length,3), rows_=Math.ceil(items.length/3);
      const cw_=(w-20)/cols, ch_=(h-20)/rows_;
      const cards=items.map((item,i)=>{
        const col=i%cols, row=Math.floor(i/cols);
        const x=10+col*cw_+4, y=10+row*ch_+4, ew=cw_-8, eh=ch_-8;
        return `<rect x="${x}" y="${y}" width="${ew}" height="${eh}" fill="rgba(0,0,0,0.03)" stroke="${ac}" stroke-width="1" stroke-opacity="0.25" rx="8"/>
<text x="${x+ew/2}" y="${y+eh*0.38}" text-anchor="middle" font-size="${Math.max(14,w/30)}">${item.icon||'⭐'}</text>
<text x="${x+ew/2}" y="${y+eh*0.62}" text-anchor="middle" fill="${tc}" font-size="${Math.max(9,w/65)}" font-weight="700">${item.title||''}</text>
<text x="${x+ew/2}" y="${y+eh*0.8}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/75)}" opacity="0.6">${item.desc||''}</text>`;
      }).join('');
      return wrap(cards);
    }

    if (type === 'funnel') {
      const items = d.data || DEFAULT_CHART_DATA.funnel.data;
      const total=items[0]?.v||1;
      const rh=(h-30)/items.length;
      const bars=items.map((item,i)=>{
        const pct=(item.v||0)/total, bw=pct*(w-60), x=(w-bw)/2;
        const y=20+i*rh;
        return `<rect x="${x}" y="${y}" width="${bw}" height="${rh-4}" fill="${C[i%C.length]}" rx="3"/>
<text x="${w/2}" y="${y+rh/2+4}" text-anchor="middle" fill="white" font-size="${Math.max(9,w/65)}" font-weight="600">${item.label||''}: ${item.v||0}</text>`;
      }).join('');
      return wrap(bars);
    }

    if (type === 'heatmap') {
      const { rows:lblR=[], cols:lblC=[], data:hdata=[] } = d;
      const cw_=(w-50)/Math.max(lblC.length,1), rh=(h-30)/Math.max(lblR.length,1);
      const maxV=Math.max(...hdata.flat());
      const cells=hdata.map((row,ri)=>row.map((v,ci)=>{
        const t=v/maxV, col=`rgba(59,130,246,${0.1+t*0.9})`;
        return `<rect x="${40+ci*cw_}" y="${20+ri*rh}" width="${cw_-1}" height="${rh-1}" fill="${col}" rx="2"/>
<text x="${40+ci*cw_+cw_/2}" y="${20+ri*rh+rh/2+4}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/75)}">${v}</text>`;
      }).join('')).join('');
      const rLbls=lblR.map((l,i)=>`<text x="35" y="${20+i*rh+rh/2+4}" text-anchor="end" fill="${tc}" font-size="${Math.max(8,w/75)}">${l}</text>`).join('');
      const cLbls=lblC.map((l,i)=>`<text x="${40+i*cw_+cw_/2}" y="14" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/75)}">${l}</text>`).join('');
      return wrap(`${cells}${rLbls}${cLbls}`);
    }

    if (type === 'treemap') {
      const items = d.data || DEFAULT_CHART_DATA.treemap.data;
      const total=items.reduce((s,i)=>s+(i.v||0),0)||1;
      let cx=5; const rects=items.map((item,i)=>{
        const iw=((item.v||0)/total)*(w-10), x=cx;
        cx+=iw+2;
        return `<rect x="${x}" y="5" width="${iw}" height="${h-10}" fill="${C[i%C.length]}" rx="4"/>
<text x="${x+iw/2}" y="${h/2-6}" text-anchor="middle" fill="white" font-size="${Math.max(9,iw/8)}" font-weight="700">${item.label||''}</text>
<text x="${x+iw/2}" y="${h/2+10}" text-anchor="middle" fill="white" fill-opacity="0.85" font-size="${Math.max(8,iw/10)}">${item.v||0}</text>`;
      }).join('');
      return wrap(rects);
    }

    if (type === 'radar') {
      const { labels=[], series=[] } = d;
      const n=labels.length||5, cx=w*0.45, cy=h/2, r=Math.min(w,h)*0.38;
      const angles=Array.from({length:n},(_,i)=>-Math.PI/2+i*(2*Math.PI/n));
      const webs=[0.25,0.5,0.75,1].map(s=>
        `<polygon points="${angles.map(a=>`${cx+r*s*Math.cos(a)},${cy+r*s*Math.sin(a)}`).join(' ')}" fill="none" stroke="#e2e8f0" stroke-width="1"/>`
      ).join('');
      const spokes=angles.map(a=>`<line x1="${cx}" y1="${cy}" x2="${cx+r*Math.cos(a)}" y2="${cy+r*Math.sin(a)}" stroke="#e2e8f0" stroke-width="1"/>`).join('');
      const lblEls=labels.map((l,i)=>{
        const a=angles[i], x=cx+(r+18)*Math.cos(a), y=cy+(r+18)*Math.sin(a);
        return `<text x="${x}" y="${y+4}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/70)}">${l}</text>`;
      }).join('');
      const seriesEl=series.map((s,si)=>{
        const max=Math.max(...s.vals)||1;
        const pts=s.vals.map((v,i)=>`${cx+(v/max)*r*Math.cos(angles[i])},${cy+(v/max)*r*Math.sin(angles[i])}`).join(' ');
        return `<polygon points="${pts}" fill="${C[si%C.length]}" fill-opacity="0.2" stroke="${C[si%C.length]}" stroke-width="2"/>`;
      }).join('');
      const legend=series.map((s,i)=>`<rect x="${w*0.78}" y="${h*0.2+i*20}" width="10" height="10" fill="${C[i%C.length]}" rx="2"/><text x="${w*0.78+14}" y="${h*0.2+i*20+9}" fill="${tc}" font-size="${Math.max(8,w/75)}">${s.name||''}</text>`).join('');
      return wrap(`${webs}${spokes}${lblEls}${seriesEl}${legend}`);
    }

    if (type === 'waterfall') {
      const items = d.data || DEFAULT_CHART_DATA.waterfall.data;
      const pd={t:30,r:15,b:35,l:40};
      const cw=w-pd.l-pd.r, ch=h-pd.t-pd.b;
      const vals=items.map(i=>i.total?0:i.v||0);
      const bases=items.map(i=>i.base||0);
      const allVals=[...vals.map((v,i)=>bases[i]+Math.max(v,0)), ...bases];
      const max=Math.max(...allVals)*1.1||1, min=Math.min(...bases,0);
      const range=max-min, bw=cw/items.length*0.6, gap=cw/items.length*0.4;
      const bars=items.map((item,i)=>{
        const v=item.v||0, base=item.base||0;
        const y1=(1-(base-min)/range)*ch+pd.t, y2=(1-((base+v)-min)/range)*ch+pd.t;
        const top=Math.min(y1,y2), hh=Math.abs(y2-y1)||2;
        const x=pd.l+i*(bw+gap)+gap/2;
        const col=item.total?C[0]:v>=0?C[1]:C[2];
        return `<rect x="${x}" y="${top}" width="${bw}" height="${hh}" fill="${col}" rx="2"/>
<text x="${x+bw/2}" y="${top-4}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/70)}">${v>=0?'+':''}${v}</text>
<text x="${x+bw/2}" y="${pd.t+ch+14}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/70)}">${item.label||''}</text>`;
      }).join('');
      return wrap(`<line x1="${pd.l}" y1="${pd.t+ch}" x2="${pd.l+cw}" y2="${pd.t+ch}" stroke="${tc}" opacity="0.2"/>${bars}`);
    }

    if (type === 'pyramid') {
      const items = d.data || DEFAULT_CHART_DATA.pyramid.data;
      const total=items.reduce((s,i)=>s+(i.v||0),0)||1;
      const rh=(h-20)/items.length;
      const layers=items.map((item,i)=>{
        const pct=(item.v||0)/total, bw=pct*(w-40)*1.2+20;
        const x=(w-bw)/2, y=10+i*rh;
        return `<rect x="${x}" y="${y}" width="${bw}" height="${rh-2}" fill="${C[i%C.length]}" rx="2"/>
<text x="${w/2}" y="${y+rh/2+4}" text-anchor="middle" fill="white" font-size="${Math.max(9,w/65)}" font-weight="600">${item.label||''}: ${item.v||0}</text>`;
      }).join('');
      return wrap(layers);
    }

    if (type === 'venn') {
      const sets = d.sets || DEFAULT_CHART_DATA.venn.sets;
      const overlap = d.overlap || 'A ∩ B';
      const shapes = sets.map((s,i)=>
        `<circle cx="${s.x||120+i*80}" cy="${h/2}" r="${s.r||80}" fill="${C[i%C.length]}" fill-opacity="0.35" stroke="${C[i%C.length]}" stroke-width="2"/>
<text x="${(s.x||120+i*80)+(i===0?-30:30)}" y="${h/2+4}" text-anchor="middle" fill="${tc}" font-size="${Math.max(10,w/60)}" font-weight="700">${s.label||''}</text>`
      ).join('');
      const ox=sets.length>1?((sets[0].x||120)+(sets[1].x||200))/2:w/2;
      return wrap(`${shapes}<text x="${ox}" y="${h/2+4}" text-anchor="middle" fill="${tc}" font-size="${Math.max(9,w/70)}">${overlap}</text>`);
    }

    if (type === 'orgchart') {
      const { nodes=[], edges=[] } = d;
      const scaleX=(w-60)/300, scaleY=(h-60)/160;
      const edgesEl=edges.map(e=>{
        const fn=nodes.find(n=>n.id===e.from), tn=nodes.find(n=>n.id===e.to);
        if(!fn||!tn)return '';
        const bw=Math.max(50,w*0.15), bh=Math.max(24,h*0.12);
        const x1=30+fn.x*scaleX+bw/2, y1=30+fn.y*scaleY+bh;
        const x2=30+tn.x*scaleX+bw/2, y2=30+tn.y*scaleY;
        return `<path d="M${x1},${y1} L${x1},${(y1+y2)/2} L${x2},${(y1+y2)/2} L${x2},${y2}" fill="none" stroke="#94a3b8" stroke-width="1.5"/>`;
      }).join('');
      const nodesEl=nodes.map((n,i)=>{
        const nx=30+n.x*scaleX, ny=30+n.y*scaleY, bw=Math.max(50,w*0.15), bh=Math.max(24,h*0.12);
        return `<rect x="${nx}" y="${ny}" width="${bw}" height="${bh}" fill="${C[i%C.length]}" rx="6"/>
<text x="${nx+bw/2}" y="${ny+bh*0.45}" text-anchor="middle" fill="white" font-size="${Math.max(9,w/70)}" font-weight="700">${n.label||''}</text>
<text x="${nx+bw/2}" y="${ny+bh*0.75}" text-anchor="middle" fill="white" font-size="${Math.max(8,w/80)}" opacity="0.8">${n.role||''}</text>`;
      }).join('');
      return wrap(`${edgesEl}${nodesEl}`);
    }

    if (type === 'mindmap') {
      const { center='Topic', branches=[] } = d;
      const cx=w/2, cy=h/2, r1=Math.min(w,h)*0.2, r2=Math.min(w,h)*0.38;
      const angleStep=branches.length>0?(2*Math.PI/branches.length):Math.PI;
      const branchEls=branches.map((b,i)=>{
        const a=-Math.PI/2+i*angleStep;
        const bx=cx+r1*Math.cos(a), by=cy+r1*Math.sin(a);
        const childStep=b.children?.length>1?(Math.PI/4)/(b.children.length-1):0;
        const childEls=(b.children||[]).map((c,j)=>{
          const ca=a-(b.children.length-1)*childStep/2+j*childStep;
          const ccx=cx+r2*Math.cos(ca), ccy=cy+r2*Math.sin(ca);
          return `<line x1="${bx}" y1="${by}" x2="${ccx}" y2="${ccy}" stroke="${C[(i+1)%C.length]}" stroke-width="1.5" opacity="0.6"/>
<circle cx="${ccx}" cy="${ccy}" r="${Math.max(20,w/22)}" fill="${C[(i+1)%C.length]}" fill-opacity="0.2" stroke="${C[(i+1)%C.length]}" stroke-width="1.5"/>
<text x="${ccx}" y="${ccy+4}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/75)}">${c}</text>`;
        }).join('');
        return `<line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke="${C[i%C.length]}" stroke-width="2"/>
<ellipse cx="${bx}" cy="${by}" rx="${Math.max(28,w/18)}" ry="${Math.max(14,h/18)}" fill="${C[i%C.length]}" fill-opacity="0.25" stroke="${C[i%C.length]}" stroke-width="2"/>
<text x="${bx}" y="${by+4}" text-anchor="middle" fill="${tc}" font-size="${Math.max(9,w/70)}" font-weight="600">${b.label||''}</text>
${childEls}`;
      }).join('');
      return wrap(`${branchEls}<ellipse cx="${cx}" cy="${cy}" rx="${Math.max(40,w/14)}" ry="${Math.max(20,h/12)}" fill="${C[0]}" fill-opacity="0.3" stroke="${C[0]}" stroke-width="2.5"/>
<text x="${cx}" y="${cy+4}" text-anchor="middle" fill="${tc}" font-size="${Math.max(10,w/60)}" font-weight="700">${center}</text>`);
    }

    if (type === 'swimlane') {
      const { lanes=[], items:lItems=[] } = d;
      const lh=(h-20)/Math.max(lanes.length,1), lw=50;
      const laneEls=lanes.map((lane,i)=>`<rect x="0" y="${10+i*lh}" width="${w}" height="${lh}" fill="${i%2===0?'rgba(0,0,0,0.02)':'rgba(255,255,255,0.05)'}" stroke="#e2e8f0" stroke-width="0.5"/>
<rect x="0" y="${10+i*lh}" width="${lw}" height="${lh}" fill="${C[i%C.length]}" fill-opacity="0.15"/>
<text x="${lw/2}" y="${10+i*lh+lh/2+4}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/80)}" font-weight="600">${lane}</text>`).join('');
      const itemEls=lItems.map((item,i)=>{
        const y=10+item.lane*lh+8, x=lw+10+(item.x||0)*((w-lw-20)/300);
        const iw=Math.max(40,(item.w||60)*(w-lw-20)/300), ih=lh-16;
        return `<rect x="${x}" y="${y}" width="${iw}" height="${ih}" fill="${C[i%C.length]}" fill-opacity="0.4" stroke="${C[i%C.length]}" stroke-width="1.5" rx="5"/>
<text x="${x+iw/2}" y="${y+ih/2+4}" text-anchor="middle" fill="${tc}" font-size="${Math.max(9,w/70)}" font-weight="600">${item.label||''}</text>`;
      }).join('');
      return wrap(`${laneEls}${itemEls}`);
    }

    if (type === 'grouped') {
      const { labels=[], series=[] } = d;
      const pd={t:40,r:15,b:35,l:35};
      const cw=w-pd.l-pd.r, ch=h-pd.t-pd.b;
      const max=Math.max(...series.flatMap(s=>s.vals||[]))*1.2||1;
      const gw=cw/Math.max(labels.length,1), bw=gw*0.65/Math.max(series.length,1);
      const legend=series.map((s,i)=>`<rect x="${pd.l+i*80}" y="8" width="10" height="10" fill="${C[i%C.length]}" rx="2"/><text x="${pd.l+i*80+14}" y="17" fill="${tc}" font-size="${Math.max(8,w/75)}">${s.name||''}</text>`).join('');
      const bars=labels.map((lbl,gi)=>{
        const gx=pd.l+gi*gw+gw*0.175;
        return series.map((s,si)=>{
          const v=s.vals?.[gi]||0, bh=Math.max((v/max)*ch,2);
          const x=gx+si*bw, y=pd.t+ch-bh;
          return `<rect x="${x}" y="${y}" width="${bw-1}" height="${bh}" fill="${C[si%C.length]}" rx="2"/>`;
        }).join('')+`<text x="${gx+bw*series.length/2}" y="${pd.t+ch+14}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/75)}">${lbl}</text>`;
      }).join('');
      return wrap(`${legend}<line x1="${pd.l}" y1="${pd.t+ch}" x2="${pd.l+cw}" y2="${pd.t+ch}" stroke="${tc}" opacity="0.2"/>${bars}`);
    }

    if (type === 'bullet') {
      const items = d.data || DEFAULT_CHART_DATA.bullet.data;
      const rh=(h-20)/items.length, maxW=w-60;
      const bars=items.map((item,i)=>{
        const y=10+i*rh, maxV=item.max||100;
        const tw=(item.target/maxV)*maxW, aw=(item.actual/maxV)*maxW;
        return `<rect x="50" y="${y+6}" width="${maxW}" height="${rh-12}" fill="#e2e8f0" rx="3"/>
<rect x="50" y="${y+6}" width="${aw}" height="${rh-12}" fill="${C[0]}" rx="3"/>
<line x1="${50+tw}" y1="${y+2}" x2="${50+tw}" y2="${y+rh-2}" stroke="#1e293b" stroke-width="2"/>
<text x="45" y="${y+rh/2+4}" text-anchor="end" fill="${tc}" font-size="${Math.max(9,w/70)}">${item.label||''}</text>
<text x="${50+aw+4}" y="${y+rh/2+4}" fill="${tc}" font-size="${Math.max(8,w/75)}">${item.actual}</text>`;
      }).join('');
      return wrap(bars);
    }

    if (type === 'sankey') {
      const { nodes:sankNodes=[], flows=[] } = d;
      const nw=20, nh=30, pad=15;
      const xPositions=[50, w/2-nw/2, w-50-nw];
      const yPositions=sankNodes.map((_,i)=>20+i*50);
      const nodeEls=sankNodes.map((n,i)=>`<rect x="${xPositions[Math.min(i,2)]||50+i*80}" y="${yPositions[i]||20+i*40}" width="${nw}" height="${nh}" fill="${C[i%C.length]}" rx="3"/>
<text x="${(xPositions[Math.min(i,2)]||50+i*80)+nw+5}" y="${(yPositions[i]||20+i*40)+nh/2+4}" fill="${tc}" font-size="${Math.max(8,w/75)}">${n}</text>`).join('');
      const flowEls=flows.map(f=>{
        const fx=xPositions[Math.min(f.from,2)]||50+f.from*80, fy=(yPositions[f.from]||20+f.from*40)+nh/2;
        const tx=xPositions[Math.min(f.to,2)]||50+f.to*80, ty=(yPositions[f.to]||20+f.to*40)+nh/2;
        return `<path d="M${fx+nw},${fy} C${(fx+tx)/2},${fy} ${(fx+tx)/2},${ty} ${tx},${ty}" fill="none" stroke="${C[f.from%C.length]}" stroke-width="${Math.max(2,f.v/20)}" opacity="0.5"/>`;
      }).join('');
      return wrap(`${flowEls}${nodeEls}`);
    }
  } catch(e) { /* fall through */ }

  return wrap(`<text x="${w/2}" y="${h/2}" text-anchor="middle" fill="${tc}" font-size="14">⚠ Render error</text>`);
}

// ═══════════════════════════════════════════════════════════════
// SHAPE RENDERER (for canvas elements)
// ═══════════════════════════════════════════════════════════════
function renderShapeSVG(el, isSelected) {
  const { w, h, fill='#3b82f6', stroke='#1d4ed8', strokeW=2, opacity=1,
    text='', fontSize=14, fontColor='#ffffff', fontBold=false, fontItalic=false,
    cornerRadius=4, rotation=0 } = el;

  const selBorder = isSelected ? `<rect x="-2" y="-2" width="${w+4}" height="${h+4}" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,3" rx="4"/>` : '';
  const handles = isSelected ? [
    [0,0],[w/2,0],[w,0],[w,h/2],[w,h],[w/2,h],[0,h],[0,h/2]
  ].map(([hx,hy])=>`<rect x="${hx-4}" y="${hy-4}" width="8" height="8" fill="white" stroke="#f59e0b" stroke-width="1.5" rx="1"/>`).join('') : '';

  const textEl = text ? `<text x="${w/2}" y="${h/2}" dy="0.35em" text-anchor="middle" fill="${fontColor}" font-size="${fontSize}" font-weight="${fontBold?'700':'400'}" font-style="${fontItalic?'italic':'normal'}" font-family="system-ui,sans-serif">${text}</text>` : '';
  const rotStr = rotation ? `rotate(${rotation}, ${w/2}, ${h/2})` : '';

  let shape = '';
  if (el.type === 'rect') {
    shape = `<rect width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" rx="${cornerRadius}" opacity="${opacity}"/>`;
  } else if (el.type === 'circle') {
    shape = `<ellipse cx="${w/2}" cy="${h/2}" rx="${w/2-strokeW/2}" ry="${h/2-strokeW/2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" opacity="${opacity}"/>`;
  } else if (el.type === 'diamond') {
    shape = `<polygon points="${w/2},${strokeW} ${w-strokeW},${h/2} ${w/2},${h-strokeW} ${strokeW},${h/2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" opacity="${opacity}"/>`;
  } else if (el.type === 'triangle') {
    shape = `<polygon points="${w/2},${strokeW} ${w-strokeW},${h-strokeW} ${strokeW},${h-strokeW}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" opacity="${opacity}"/>`;
  } else if (el.type === 'hexagon') {
    const hx=w/2, hy=h/2, rx=w/2-strokeW, ry=h/2-strokeW;
    const pts=Array.from({length:6},(_,i)=>{const a=i*Math.PI/3-Math.PI/6;return `${hx+rx*Math.cos(a)},${hy+ry*Math.sin(a)}`;}).join(' ');
    shape = `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" opacity="${opacity}"/>`;
  } else if (el.type === 'text') {
    shape = `<rect width="${w}" height="${h}" fill="${fill}" fill-opacity="0.08" stroke="${stroke}" stroke-width="${strokeW}" rx="${cornerRadius}" stroke-dasharray="4,3"/>`;
  } else if (el.type === 'line') {
    shape = `<line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="${stroke}" stroke-width="${Math.max(strokeW,2)}" opacity="${opacity}"/>`;
  } else if (el.type === 'arrow') {
    shape = `<defs><marker id="ah_${el.id}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="${stroke}"/></marker></defs>
<line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="${stroke}" stroke-width="${Math.max(strokeW,2)}" opacity="${opacity}" marker-end="url(#ah_${el.id})"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" style="overflow:visible;${rotStr?`transform:${rotStr};transform-origin:${w/2}px ${h/2}px;`:''}">
    ${shape}${textEl}${selBorder}${handles}
  </svg>`;
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
let idCounter = 1;
const uid = () => `el_${idCounter++}_${Math.random().toString(36).slice(2,6)}`;

export default function DiagramBuilder() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const accent = '#6366f1';

  // Canvas state
  const [elements, setElements] = useState([]);
  const [selected, setSelected] = useState(null);  // element id
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [canvasBg, setCanvasBg] = useState('#1e293b');
  const [canvasW] = useState(1400);
  const [canvasH] = useState(900);
  const [gridVisible, setGridVisible] = useState(true);

  // Drag state
  const dragState = useRef(null);
  const panState  = useRef(null);

  // UI panels
  const [activeTab,    setActiveTab]    = useState('shapes'); // shapes | charts | ai
  const [rightTab,     setRightTab]     = useState('props');
  const [aiPrompt,     setAiPrompt]     = useState('');
  const [aiLoading,    setAiLoading]    = useState(false);
  const [aiError,      setAiError]      = useState('');
  const [aiWarning,    setAiWarning]    = useState('');
  const [inReport,     setInReport]     = useState(false);
  const [saveMsg,      setSaveMsg]      = useState('');
  const [pdfLoading,   setPdfLoading]   = useState(false);
  const [palette,      setPalette]      = useState('blue');

  const selectedEl = elements.find(e => e.id === selected) || null;

  // ── Element helpers ──────────────────────────────────────────
  const updateEl = useCallback((id, patch) => {
    setElements(els => els.map(e => e.id === id ? { ...e, ...patch } : e));
  }, []);

  const addElement = useCallback((el) => {
    const newEl = { id: uid(), x: 100 + Math.random()*200, y: 100 + Math.random()*100, w: 160, h: 100, ...el };
    setElements(els => [...els, newEl]);
    setSelected(newEl.id);
    return newEl;
  }, []);

  const deleteSelected = useCallback(() => {
    if (!selected) return;
    setElements(els => els.filter(e => e.id !== selected));
    setSelected(null);
  }, [selected]);

  const duplicateSelected = useCallback(() => {
    if (!selectedEl) return;
    const copy = { ...selectedEl, id: uid(), x: selectedEl.x + 20, y: selectedEl.y + 20 };
    setElements(els => [...els, copy]);
    setSelected(copy.id);
  }, [selectedEl]);

  // ── Drag handlers ────────────────────────────────────────────
  const onCanvasMouseDown = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      panState.current = { startX: e.clientX - pan.x, startY: e.clientY - pan.y };
      return;
    }
    if (e.target === canvasRef.current || e.target.closest('[data-canvas-bg]')) {
      setSelected(null);
    }
  }, [pan]);

  const onElMouseDown = useCallback((e, elId) => {
    e.stopPropagation();
    setSelected(elId);
    const el = elements.find(el_ => el_.id === elId);
    if (!el) return;
    const rect = canvasRef.current.getBoundingClientRect();
    dragState.current = {
      id: elId,
      startElX: el.x, startElY: el.y,
      startMouseX: (e.clientX - rect.left) / zoom,
      startMouseY: (e.clientY - rect.top) / zoom,
    };
  }, [elements, zoom]);

  const onMouseMove = useCallback((e) => {
    if (panState.current) {
      setPan({ x: e.clientX - panState.current.startX, y: e.clientY - panState.current.startY });
      return;
    }
    if (!dragState.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = (e.clientX - rect.left) / zoom;
    const my = (e.clientY - rect.top) / zoom;
    const dx = mx - dragState.current.startMouseX;
    const dy = my - dragState.current.startMouseY;
    updateEl(dragState.current.id, {
      x: Math.max(0, dragState.current.startElX + dx),
      y: Math.max(0, dragState.current.startElY + dy),
    });
  }, [zoom, updateEl]);

  const onMouseUp = useCallback(() => {
    dragState.current = null;
    panState.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
  }, [onMouseMove, onMouseUp]);

  // ── Keyboard shortcuts ───────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected();
      if (e.key === 'd' && e.ctrlKey) { e.preventDefault(); duplicateSelected(); }
      if (e.key === 'Escape') setSelected(null);
      if (e.key === '=' && e.ctrlKey) { e.preventDefault(); setZoom(z => Math.min(z+0.1, 3)); }
      if (e.key === '-' && e.ctrlKey) { e.preventDefault(); setZoom(z => Math.max(z-0.1, 0.2)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deleteSelected, duplicateSelected]);

  // ── Add shape ─────────────────────────────────────────────────
  const addShape = (type) => {
    const defaults = {
      rect:     { fill:'#3b82f6', stroke:'#1d4ed8', strokeW:2, cornerRadius:6, text:'Label', fontSize:14, fontColor:'#ffffff' },
      circle:   { fill:'#22c55e', stroke:'#15803d', strokeW:2, text:'', fontSize:14, fontColor:'#ffffff' },
      diamond:  { fill:'#a855f7', stroke:'#7e22ce', strokeW:2, text:'', fontSize:14, fontColor:'#ffffff' },
      triangle: { fill:'#f97316', stroke:'#ea580c', strokeW:2, text:'', fontSize:14, fontColor:'#ffffff' },
      hexagon:  { fill:'#06b6d4', stroke:'#0e7490', strokeW:2, text:'', fontSize:14, fontColor:'#ffffff' },
      text:     { fill:'transparent', stroke:'#94a3b8', strokeW:1, text:'Double-click to edit', fontSize:14, fontColor:'#1e293b', w:200, h:60 },
      line:     { fill:'none', stroke:'#94a3b8', strokeW:2, h:4, w:200 },
      arrow:    { fill:'none', stroke:'#3b82f6', strokeW:2.5, h:4, w:200 },
    };
    addElement({ type, ...defaults[type], opacity:1, rotation:0 });
  };

  // ── Add chart ─────────────────────────────────────────────────
  const addChart = (chartType) => {
    addElement({
      type: 'chart',
      chartType,
      chartData: JSON.parse(JSON.stringify(DEFAULT_CHART_DATA[chartType] || {})),
      palette: 'blue',
      textColor: '#1e293b',
      bgColor: '#ffffff',
      title: CHART_EMBED_TYPES.find(t=>t.id===chartType)?.label || chartType,
      w: 380, h: 260,
    });
  };

  // ── Export entire canvas as SVG ───────────────────────────────
  const exportSVG = () => {
    const svgParts = elements.map(el => {
      const transform = `translate(${el.x}, ${el.y})`;
      if (el.type === 'chart') {
        const chartSvg = renderChartSVG(el.chartType, el.chartData, el.palette, el.w, el.h, el.textColor, el.bgColor);
        const inner = chartSvg.replace(/<svg[^>]*>/,'').replace(/<\/svg>/,'');
        return `<g transform="${transform}">${inner}</g>`;
      }
      const elSvg = renderShapeSVG(el, false);
      const inner = elSvg.replace(/<svg[^>]*>/,'').replace(/<\/svg>/,'');
      return `<g transform="${transform}">${inner}</g>`;
    });

    const gridPat = gridVisible ? `<defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/></pattern></defs><rect width="${canvasW}" height="${canvasH}" fill="url(#grid)"/>` : '';

    const full = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}" viewBox="0 0 ${canvasW} ${canvasH}">
  <rect width="${canvasW}" height="${canvasH}" fill="${canvasBg}"/>
  ${gridPat}
  ${svgParts.join('\n')}
</svg>`;
    const blob = new Blob([full],{type:'image/svg+xml'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download='diagram.svg';a.click();
  };

  const exportPDF = async () => {
    setPdfLoading(true);
    try {
      const svgParts = elements.map(el => {
        if (el.type === 'chart') {
          const chartSvg = renderChartSVG(el.chartType, el.chartData, el.palette, el.w, el.h, el.textColor, el.bgColor);
          const inner = chartSvg.replace(/<svg[^>]*>/,'').replace(/<\/svg>/,'');
          return `<g transform="translate(${el.x},${el.y})">${inner}</g>`;
        }
        const elSvg = renderShapeSVG(el, false);
        const inner = elSvg.replace(/<svg[^>]*>/,'').replace(/<\/svg>/,'');
        return `<g transform="translate(${el.x},${el.y})">${inner}</g>`;
      });
      const svgFull = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}" viewBox="0 0 ${canvasW} ${canvasH}"><rect width="${canvasW}" height="${canvasH}" fill="${canvasBg}"/>${svgParts.join('')}</svg>`;
      const html = `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:${canvasBg};display:flex;align-items:center;justify-content:center}</style></head><body>${svgFull}</body></html>`;
      const fd=new FormData();
      fd.append('html',new Blob([html],{type:'text/html'}),'diagram.html');
      fd.append('styleManifest',JSON.stringify({}));
      const res=await fetch('http://localhost:3000/api/render-pdf-form',{method:'POST',body:fd});
      if(!res.ok)throw new Error('Render failed');
      const blob=await res.blob();
      const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='diagram.pdf';a.click();
    } catch(e){alert('PDF failed: '+e.message);}
    setPdfLoading(false);
  };

  const addToReport = () => {
    const svgParts=elements.map(el=>{
      if(el.type==='chart'){const s=renderChartSVG(el.chartType,el.chartData,el.palette,el.w,el.h,el.textColor,el.bgColor);return `<g transform="translate(${el.x},${el.y})">${s.replace(/<svg[^>]*>/,'').replace(/<\/svg>/,'')}</g>`;}
      const s=renderShapeSVG(el,false);return `<g transform="translate(${el.x},${el.y})">${s.replace(/<svg[^>]*>/,'').replace(/<\/svg>/,'')}</g>`;
    });
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}" viewBox="0 0 ${canvasW} ${canvasH}"><rect width="${canvasW}" height="${canvasH}" fill="${canvasBg}"/>${svgParts.join('')}</svg>`;
    const saved=JSON.parse(localStorage.getItem('rb_diagrams')||'[]');
    saved.push({svg,title:'Canvas Diagram',type:'canvas',createdAt:Date.now()});
    localStorage.setItem('rb_diagrams',JSON.stringify(saved));
    setInReport(true);setSaveMsg('Added to report!');setTimeout(()=>setSaveMsg(''),2500);
  };

  // ── AI generation ─────────────────────────────────────────────
  const handleAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true); setAiError(''); setAiWarning('');

    const wordCount = aiPrompt.trim().split(/\s+/).length;
    if (wordCount > 60) {
      setAiWarning('⚠ Complex prompts may produce simplified results. For best accuracy, keep descriptions focused and concise.');
    }

    try {
      const res = await fetch('http://localhost:3000/api/generate-diagram-ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, chartType: 'canvas', mode: 'canvas' }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const result = data.result;
      if (result.canvasBg) setCanvasBg(result.canvasBg);

      const newEls = [];
      if (Array.isArray(result.elements)) {
        result.elements.forEach(e => {
          const newEl = {
            id: uid(), x:e.x||100, y:e.y||100, w:e.w||200, h:e.h||120,
            type: e.type||'rect', fill:e.fill||'#3b82f6', stroke:e.stroke||'#1d4ed8',
            strokeW:e.strokeW||2, text:e.text||'', fontSize:e.fontSize||14,
            fontColor:e.fontColor||'#ffffff', opacity:e.opacity||1, cornerRadius:e.cornerRadius||6,
            ...(e.type==='chart'?{
              chartType:e.chartType||'bar',
              chartData:e.chartData||DEFAULT_CHART_DATA[e.chartType||'bar'],
              palette:e.palette||'blue', textColor:e.textColor||'#1e293b',
              bgColor:e.bgColor||'#ffffff', title:e.title||''
            }:{})
          };
          newEls.push(newEl);
        });
      }
      if (newEls.length > 0) {
        setElements(prev => [...prev, ...newEls]);
      } else {
        throw new Error('AI returned no elements. Try a more specific prompt.');
      }
    } catch(e) { setAiError('AI failed: '+e.message); }
    setAiLoading(false);
  };

  // ── Styles ────────────────────────────────────────────────────
  const inp = { background:'#0f172a', border:'1px solid #1e293b', color:'#e2e8f0', borderRadius:6, padding:'5px 8px', fontSize:'0.78rem', width:'100%', outline:'none', boxSizing:'border-box' };
  const panel = { background:'#0f172a', border:'1px solid #1e293b', borderRadius:10, padding:'12px' };

  // ── Props panel ───────────────────────────────────────────────
  const PropsPanel = () => {
    if (!selectedEl) return (
      <div style={{ color:'#475569', fontSize:'0.8rem', textAlign:'center', padding:'40px 16px' }}>
        Select an element to edit its properties
      </div>
    );

    const el = selectedEl;
    const upd = (k, v) => updateEl(el.id, { [k]: v });

    if (el.type === 'chart') {
      return (
        <div style={{ padding:'12px', overflowY:'auto', height:'100%' }}>
          <div style={{ fontWeight:700, color:'#e2e8f0', marginBottom:12, fontSize:'0.82rem' }}>
            📊 {el.title || el.chartType} Chart
          </div>

          <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:4 }}>Title</label>
          <input value={el.title||''} onChange={e=>upd('title',e.target.value)} style={{...inp,marginBottom:10}}/>

          <div style={{ display:'flex',gap:8,marginBottom:10 }}>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:4 }}>Width</label>
              <input type="number" value={el.w} onChange={e=>upd('w',+e.target.value)} style={inp}/>
            </div>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:4 }}>Height</label>
              <input type="number" value={el.h} onChange={e=>upd('h',+e.target.value)} style={inp}/>
            </div>
          </div>

          <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:4 }}>Color Palette</label>
          <div style={{ display:'flex',gap:4,flexWrap:'wrap',marginBottom:10 }}>
            {Object.entries(PALETTES).map(([k,cols])=>(
              <button key={k} onClick={()=>upd('palette',k)} title={k}
                style={{ display:'flex',gap:1,borderRadius:4,overflow:'hidden',border:el.palette===k?`2px solid ${accent}`:'2px solid transparent',cursor:'pointer',padding:0,background:'none' }}>
                {cols.slice(0,4).map((c,i)=><span key={i} style={{width:11,height:18,background:c,display:'block'}}/>)}
              </button>
            ))}
          </div>

          <div style={{ display:'flex',gap:8,marginBottom:12 }}>
            {[['Text Color','textColor'],['Background','bgColor']].map(([lbl,key])=>(
              <label key={key} style={{ fontSize:'0.72rem',color:'#94a3b8',display:'flex',flexDirection:'column',gap:3 }}>
                {lbl}
                <input type="color" value={el[key]||'#000000'} onChange={e=>upd(key,e.target.value)}
                  style={{ width:32,height:28,border:'1px solid #1e293b',borderRadius:4,cursor:'pointer',padding:1,background:'none' }}/>
              </label>
            ))}
          </div>

          <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:6 }}>Chart Data (JSON)</label>
          <div style={{ background:'#020617',border:'1px solid #1e293b',borderRadius:6,padding:8,marginBottom:8 }}>
            <textarea
              value={JSON.stringify(el.chartData, null, 2)}
              onChange={e => { try { upd('chartData', JSON.parse(e.target.value)); } catch{} }}
              style={{ ...inp, minHeight:160, resize:'vertical', fontFamily:'monospace', fontSize:'0.72rem', background:'transparent', border:'none', padding:0 }}
            />
          </div>
          <div style={{ fontSize:'0.7rem', color:'#475569', marginBottom:8 }}>
            💡 Edit JSON directly — chart updates on valid JSON
          </div>
          <button onClick={()=>{upd('chartData', JSON.parse(JSON.stringify(DEFAULT_CHART_DATA[el.chartType]||{})));}}
            style={{ width:'100%',padding:'6px',borderRadius:6,border:`1px solid #1e293b`,background:'transparent',color:'#64748b',cursor:'pointer',fontSize:'0.75rem' }}>
            ↺ Reset to Default Data
          </button>
        </div>
      );
    }

    // Shape props
    return (
      <div style={{ padding:'12px', overflowY:'auto', height:'100%' }}>
        <div style={{ fontWeight:700, color:'#e2e8f0', marginBottom:12, fontSize:'0.82rem', textTransform:'capitalize' }}>
          {el.type} Properties
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10 }}>
          {[['X','x'],['Y','y'],['W','w'],['H','h']].map(([lbl,k])=>(
            <div key={k}>
              <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:3 }}>{lbl}</label>
              <input type="number" value={Math.round(el[k])} onChange={e=>upd(k,+e.target.value)} style={inp}/>
            </div>
          ))}
        </div>

        {!['line','arrow','text'].includes(el.type) && (<>
          <div style={{ display:'flex',gap:10,marginBottom:10 }}>
            {[['Fill','fill'],['Stroke','stroke']].map(([lbl,k])=>(
              <label key={k} style={{ fontSize:'0.72rem',color:'#94a3b8',display:'flex',flexDirection:'column',gap:3 }}>
                {lbl}
                <input type="color" value={el[k]||'#000000'} onChange={e=>upd(k,e.target.value)}
                  style={{ width:36,height:30,border:'1px solid #1e293b',borderRadius:4,cursor:'pointer',padding:1,background:'none' }}/>
              </label>
            ))}
            <div style={{ flex:1 }}>
              <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:3 }}>Border px</label>
              <input type="number" value={el.strokeW||1} onChange={e=>upd('strokeW',+e.target.value)} style={inp} min={0} max={20}/>
            </div>
          </div>

          <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:3 }}>Opacity</label>
          <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:10 }}>
            <input type="range" min={0} max={1} step={0.05} value={el.opacity||1} onChange={e=>upd('opacity',+e.target.value)} style={{ flex:1,accentColor:accent }}/>
            <span style={{ fontSize:'0.72rem',color:'#64748b',width:28 }}>{Math.round((el.opacity||1)*100)}%</span>
          </div>

          {['rect','hexagon'].includes(el.type) && (<>
            <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:3 }}>Corner Radius</label>
            <input type="range" min={0} max={60} value={el.cornerRadius||0} onChange={e=>upd('cornerRadius',+e.target.value)} style={{ width:'100%',accentColor:accent,marginBottom:10 }}/>
          </>)}
        </>)}

        {['line','arrow'].includes(el.type) && (
          <div style={{ display:'flex',gap:10,marginBottom:10 }}>
            <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'flex',flexDirection:'column',gap:3 }}>
              Color
              <input type="color" value={el.stroke||'#94a3b8'} onChange={e=>upd('stroke',e.target.value)}
                style={{ width:36,height:30,border:'1px solid #1e293b',borderRadius:4,cursor:'pointer',padding:1,background:'none' }}/>
            </label>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:3 }}>Thickness</label>
              <input type="number" value={el.strokeW||2} onChange={e=>upd('strokeW',+e.target.value)} style={inp} min={1} max={20}/>
            </div>
          </div>
        )}

        {!['line','arrow'].includes(el.type) && (<>
          <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:3 }}>Label Text</label>
          <textarea value={el.text||''} onChange={e=>upd('text',e.target.value)} rows={2}
            style={{ ...inp, resize:'vertical', marginBottom:10 }} placeholder="Label…"/>
          <div style={{ display:'flex',gap:8,marginBottom:10 }}>
            <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'flex',flexDirection:'column',gap:3 }}>
              Text Color
              <input type="color" value={el.fontColor||'#ffffff'} onChange={e=>upd('fontColor',e.target.value)}
                style={{ width:36,height:30,border:'1px solid #1e293b',borderRadius:4,cursor:'pointer',padding:1,background:'none' }}/>
            </label>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:3 }}>Font Size</label>
              <input type="number" value={el.fontSize||14} onChange={e=>upd('fontSize',+e.target.value)} style={inp} min={8} max={72}/>
            </div>
          </div>
          <div style={{ display:'flex',gap:8,marginBottom:10 }}>
            {[['Bold','fontBold'],['Italic','fontItalic']].map(([lbl,k])=>(
              <button key={k} onClick={()=>upd(k,!el[k])}
                style={{ flex:1,padding:'6px',borderRadius:6,border:`1px solid ${el[k]?accent:'#1e293b'}`,background:el[k]?`${accent}22`:'transparent',color:el[k]?accent:'#64748b',cursor:'pointer',fontSize:'0.78rem' }}>
                {lbl}
              </button>
            ))}
          </div>
        </>)}

        <label style={{ fontSize:'0.72rem',color:'#94a3b8',display:'block',marginBottom:3 }}>Rotation (°)</label>
        <input type="range" min={-180} max={180} value={el.rotation||0} onChange={e=>upd('rotation',+e.target.value)} style={{ width:'100%',accentColor:accent,marginBottom:4 }}/>
        <div style={{ fontSize:'0.7rem',color:'#475569',marginBottom:12 }}>{el.rotation||0}°</div>

        <div style={{ display:'flex',gap:6 }}>
          <button onClick={duplicateSelected} style={{ flex:1,padding:'7px',borderRadius:7,border:'1px solid #1e293b',background:'transparent',color:'#64748b',cursor:'pointer',fontSize:'0.75rem' }}>⧉ Duplicate</button>
          <button onClick={deleteSelected} style={{ flex:1,padding:'7px',borderRadius:7,border:'1px solid #7f1d1d',background:'transparent',color:'#ef4444',cursor:'pointer',fontSize:'0.75rem' }}>✕ Delete</button>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div style={{ display:'flex', height:'100vh', background:'#020617', color:'#e2e8f0', fontFamily:'"DM Sans",system-ui,sans-serif', overflow:'hidden', userSelect:'none' }}>

      {/* LEFT PANEL */}
      <div style={{ width:220, flexShrink:0, borderRight:'1px solid #1e293b', display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ padding:'12px 14px', borderBottom:'1px solid #1e293b', display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={()=>navigate('/')} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',padding:2 }}><ArrowLeft size={16}/></button>
          <span style={{ fontWeight:800, fontSize:'0.95rem', background:`linear-gradient(135deg,${accent},#06b6d4)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Diagram Studio
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid #1e293b' }}>
          {[['shapes','Shapes'],['charts','Charts'],['ai','✨ AI']].map(([id,lbl])=>(
            <button key={id} onClick={()=>setActiveTab(id)}
              style={{ flex:1, padding:'8px 4px', border:'none', background:'none', color:activeTab===id?accent:'#475569', fontSize:'0.72rem', fontWeight:activeTab===id?700:500, cursor:'pointer', borderBottom:activeTab===id?`2px solid ${accent}`:'2px solid transparent' }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex:1, overflowY:'auto', padding:'10px' }}>

          {activeTab === 'shapes' && (
            <div>
              <div style={{ fontSize:'0.68rem',color:'#475569',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8 }}>Basic Shapes</div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:12 }}>
                {SHAPE_TYPES.map(t=>{
                  const Icon=t.icon;
                  return (
                    <button key={t.id} onClick={()=>addShape(t.id)}
                      style={{ padding:'8px 6px',borderRadius:7,border:'1px solid #1e293b',background:'#0f172a',color:'#94a3b8',cursor:'pointer',fontSize:'0.72rem',display:'flex',flexDirection:'column',alignItems:'center',gap:4,transition:'all .15s' }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=accent}
                      onMouseLeave={e=>e.currentTarget.style.borderColor='#1e293b'}>
                      <Icon size={16}/>{t.label}
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize:'0.68rem',color:'#475569',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8 }}>Canvas</div>
              <div style={{ display:'flex',flexDirection:'column',gap:5 }}>
                <div style={{ display:'flex',gap:5,alignItems:'center' }}>
                  <span style={{ fontSize:'0.72rem',color:'#64748b',flex:1 }}>Background</span>
                  <input type="color" value={canvasBg} onChange={e=>setCanvasBg(e.target.value)}
                    style={{ width:32,height:26,border:'1px solid #1e293b',borderRadius:4,cursor:'pointer',padding:1,background:'none' }}/>
                </div>
                <button onClick={()=>setGridVisible(v=>!v)}
                  style={{ padding:'6px',borderRadius:6,border:`1px solid ${gridVisible?accent:'#1e293b'}`,background:gridVisible?`${accent}22`:'transparent',color:gridVisible?accent:'#64748b',cursor:'pointer',fontSize:'0.72rem' }}>
                  {gridVisible?'Hide':'Show'} Grid
                </button>
                <button onClick={()=>{ setElements([]); setSelected(null); }}
                  style={{ padding:'6px',borderRadius:6,border:'1px solid #7f1d1d',background:'transparent',color:'#ef4444',cursor:'pointer',fontSize:'0.72rem' }}>
                  Clear Canvas
                </button>
              </div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div>
              <div style={{ fontSize:'0.68rem',color:'#475569',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8 }}>
                {CHART_EMBED_TYPES.length} Chart Types
              </div>
              {CHART_EMBED_TYPES.map(t=>{
                const Icon=t.icon;
                return (
                  <button key={t.id} onClick={()=>addChart(t.id)}
                    style={{ width:'100%',padding:'8px 10px',borderRadius:7,border:'1px solid #1e293b',background:'#0f172a',color:'#94a3b8',cursor:'pointer',fontSize:'0.75rem',display:'flex',alignItems:'center',gap:8,marginBottom:4,transition:'all .15s',textAlign:'left' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.color='#e2e8f0';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e293b';e.currentTarget.style.color='#94a3b8';}}>
                    <Icon size={14}/> {t.label}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              <div style={{ fontSize:'0.68rem',color:'#475569',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8 }}>AI Canvas Builder</div>

              {/* Warning banner */}
              <div style={{ background:'rgba(234,179,8,0.1)',border:'1px solid rgba(234,179,8,0.3)',borderRadius:8,padding:'8px 10px',marginBottom:10,fontSize:'0.72rem',color:'#fbbf24',lineHeight:1.5 }}>
                ⚠ <strong>Accuracy warning:</strong> AI may simplify complex layouts or data. For exact control, add elements manually and use the data editor. Long prompts may produce fewer elements.
              </div>

              <textarea value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} rows={5}
                placeholder="Describe your diagram…&#10;e.g. 'A sales funnel with 4 stages showing conversion rates, a bar chart of Q1-Q4 revenue, and a company org chart with 3 departments'"
                style={{ ...inp, resize:'vertical', marginBottom:8, lineHeight:1.5 }}/>

              {aiWarning && (
                <div style={{ background:'rgba(234,179,8,0.08)',border:'1px solid rgba(234,179,8,0.2)',borderRadius:6,padding:'6px 8px',marginBottom:8,fontSize:'0.7rem',color:'#fbbf24',lineHeight:1.5 }}>
                  {aiWarning}
                </div>
              )}

              <button onClick={handleAI} disabled={aiLoading||!aiPrompt.trim()}
                style={{ width:'100%',padding:'9px',borderRadius:8,border:'none',background:`linear-gradient(135deg,${accent},#06b6d4)`,color:'white',fontWeight:700,cursor:aiLoading?'wait':'pointer',fontSize:'0.82rem',display:'flex',alignItems:'center',justifyContent:'center',gap:6,opacity:!aiPrompt.trim()?0.5:1,marginBottom:8 }}>
                <Sparkles size={14}/> {aiLoading?'Generating…':'Generate Diagram'}
              </button>

              {aiError && <div style={{ color:'#f87171',fontSize:'0.73rem',marginBottom:8,padding:'6px 8px',background:'rgba(239,68,68,0.1)',borderRadius:6 }}>{aiError}</div>}

              <div style={{ fontSize:'0.7rem',color:'#334155',lineHeight:1.6 }}>
                <strong style={{color:'#475569'}}>Tips for better results:</strong><br/>
                • Name specific chart types<br/>
                • Give data values when possible<br/>
                • Keep prompts under 50 words<br/>
                • Add shapes manually for precision
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CANVAS AREA */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Toolbar */}
        <div style={{ padding:'6px 12px', borderBottom:'1px solid #1e293b', display:'flex', alignItems:'center', gap:8, flexShrink:0, background:'#020617' }}>
          <div style={{ display:'flex',gap:4 }}>
            <button onClick={()=>setZoom(z=>Math.min(z+0.1,3))} style={{ padding:'5px 8px',borderRadius:5,border:'1px solid #1e293b',background:'transparent',color:'#64748b',cursor:'pointer' }}><ZoomIn size={14}/></button>
            <button onClick={()=>setZoom(z=>Math.max(z-0.1,0.2))} style={{ padding:'5px 8px',borderRadius:5,border:'1px solid #1e293b',background:'transparent',color:'#64748b',cursor:'pointer' }}><ZoomOut size={14}/></button>
            <button onClick={()=>{setZoom(1);setPan({x:0,y:0});}} style={{ padding:'5px 8px',borderRadius:5,border:'1px solid #1e293b',background:'transparent',color:'#64748b',cursor:'pointer',fontSize:'0.72rem' }}>{Math.round(zoom*100)}%</button>
          </div>
          <div style={{ width:1,height:20,background:'#1e293b' }}/>
          {selected && (
            <>
              <button onClick={duplicateSelected} style={{ padding:'5px 8px',borderRadius:5,border:'1px solid #1e293b',background:'transparent',color:'#64748b',cursor:'pointer' }}><Copy size={14}/></button>
              <button onClick={deleteSelected} style={{ padding:'5px 8px',borderRadius:5,border:'1px solid #7f1d1d',background:'transparent',color:'#ef4444',cursor:'pointer' }}><Trash2 size={14}/></button>
            </>
          )}
          <div style={{ flex:1 }}/>
          {saveMsg && <span style={{ fontSize:'0.72rem',color:'#22c55e',fontWeight:600 }}>{saveMsg}</span>}
          <button onClick={addToReport} style={{ padding:'6px 12px',borderRadius:7,border:'1px solid #d97706',background:'transparent',color:'#f59e0b',cursor:'pointer',fontSize:'0.75rem',fontWeight:600,display:'flex',alignItems:'center',gap:5 }}>
            <Plus size={12}/> {inReport?'In Queue':'Add to Report'}
          </button>
          <button onClick={exportSVG} style={{ padding:'6px 12px',borderRadius:7,border:`1px solid ${accent}44`,background:`${accent}11`,color:accent,cursor:'pointer',fontSize:'0.75rem',fontWeight:600,display:'flex',alignItems:'center',gap:5 }}>
            <Download size={12}/> SVG
          </button>
          <button onClick={exportPDF} disabled={pdfLoading} style={{ padding:'6px 12px',borderRadius:7,border:'none',background:'#22c55e',color:'white',cursor:pdfLoading?'wait':'pointer',fontSize:'0.75rem',fontWeight:600,display:'flex',alignItems:'center',gap:5 }}>
            <FileDown size={12}/> {pdfLoading?'…':'PDF'}
          </button>
        </div>

        {/* Canvas */}
        <div style={{ flex:1, overflow:'hidden', position:'relative', cursor:'default' }}
          onMouseDown={onCanvasMouseDown}>
          <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
            <div style={{ position:'absolute', transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin:'0 0', willChange:'transform' }}>
              {/* Canvas background */}
              <div ref={canvasRef} data-canvas-bg="true"
                style={{ width:canvasW, height:canvasH, background:canvasBg, position:'relative', boxShadow:'0 0 0 1px rgba(255,255,255,0.05)', borderRadius:4 }}>

                {/* Grid */}
                {gridVisible && (
                  <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }}>
                    <defs>
                      <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
                      </pattern>
                      <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <rect width="100" height="100" fill="url(#smallGrid)"/>
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)"/>
                  </svg>
                )}

                {/* Elements */}
                {elements.map(el => (
                  <div key={el.id}
                    style={{ position:'absolute', left:el.x, top:el.y, width:el.w, height:el.h, cursor:'move', userSelect:'none' }}
                    onMouseDown={e => onElMouseDown(e, el.id)}>
                    {el.type === 'chart' ? (
                      <div style={{ width:'100%', height:'100%', overflow:'hidden', borderRadius:8, boxShadow: selected===el.id?`0 0 0 2px #f59e0b, 0 0 0 4px rgba(245,158,11,0.2)`:'0 2px 12px rgba(0,0,0,0.3)' }}
                        dangerouslySetInnerHTML={{ __html: renderChartSVG(el.chartType, el.chartData, el.palette, el.w, el.h, el.textColor, el.bgColor) }}/>
                    ) : (
                      <div style={{ width:'100%', height:'100%', filter: selected===el.id?'drop-shadow(0 0 6px rgba(245,158,11,0.6))':'' }}
                        dangerouslySetInnerHTML={{ __html: renderShapeSVG(el, selected===el.id) }}/>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Element count badge */}
          <div style={{ position:'absolute',bottom:12,left:12,background:'rgba(0,0,0,0.5)',color:'#64748b',fontSize:'0.7rem',padding:'4px 8px',borderRadius:20,backdropFilter:'blur(4px)' }}>
            {elements.length} element{elements.length!==1?'s':''} · {Math.round(zoom*100)}% · Alt+drag to pan
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width:240, flexShrink:0, borderLeft:'1px solid #1e293b', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'10px 12px', borderBottom:'1px solid #1e293b', fontSize:'0.72rem', fontWeight:700, color:accent, textTransform:'uppercase', letterSpacing:'0.08em' }}>
          {selected ? `${selectedEl?.type === 'chart' ? '📊' : '◻'} Properties` : 'Properties'}
        </div>
        <div style={{ flex:1, overflow:'auto' }}>
          <PropsPanel/>
        </div>

        {/* Layer list */}
        <div style={{ borderTop:'1px solid #1e293b', maxHeight:180, overflow:'auto' }}>
          <div style={{ padding:'6px 12px', fontSize:'0.68rem', fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.08em' }}>
            Layers ({elements.length})
          </div>
          {[...elements].reverse().map(el=>(
            <div key={el.id} onClick={()=>setSelected(el.id)}
              style={{ padding:'5px 12px', fontSize:'0.72rem', cursor:'pointer', background:selected===el.id?`${accent}22`:'transparent', color:selected===el.id?accent:'#64748b', display:'flex',alignItems:'center',gap:6,borderBottom:'1px solid rgba(30,41,59,0.5)' }}>
              <span style={{ fontSize:'0.85rem' }}>{el.type==='chart'?'📊':el.type==='text'?'T':'◻'}</span>
              <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {el.type==='chart'?el.title||el.chartType:el.text||el.type}
              </span>
              <button onClick={e=>{e.stopPropagation();setElements(els=>els.filter(e=>e.id!==el.id));if(selected===el.id)setSelected(null);}}
                style={{ background:'none',border:'none',color:'#334155',cursor:'pointer',fontSize:'0.8rem' }}>×</button>
            </div>
          ))}
          {elements.length===0 && <div style={{ padding:'12px',color:'#334155',fontSize:'0.72rem',textAlign:'center' }}>No elements yet</div>}
        </div>
      </div>
    </div>
  );
}