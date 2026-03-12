import { useState, useEffect, useRef, useCallback } from "react";

const accent = "#6366f1";

const PALETTES = {
  blue:   ["#3b82f6","#2563eb","#1d4ed8","#60a5fa","#93c5fd","#bfdbfe"],
  green:  ["#22c55e","#16a34a","#15803d","#4ade80","#86efac","#bbf7d0"],
  purple: ["#a855f7","#9333ea","#7e22ce","#c084fc","#d8b4fe","#ede9fe"],
  warm:   ["#f97316","#ea580c","#ef4444","#fb923c","#fca5a5","#fed7aa"],
  mono:   ["#334155","#475569","#64748b","#94a3b8","#cbd5e1","#e2e8f0"],
  vivid:  ["#ef4444","#3b82f6","#22c55e","#eab308","#a855f7","#06b6d4"],
  ocean:  ["#0284c7","#0369a1","#075985","#38bdf8","#7dd3fc","#bae6fd"],
  sunset: ["#f43f5e","#fb923c","#facc15","#e879f9","#818cf8","#34d399"],
};

// ═══ MATH MODELS ═════════════════════════════════════════════
// Each model renders an SVG inline — fully visual, not just text
const MATH_MODELS = {
  Geometry: {
    icon: "📐",
    models: [
      { id:"geo_pythagorean", label:"Pythagorean Theorem", desc:"a²+b²=c² — right triangle",
        params:[{key:"a",label:"Side a",val:3,min:1,max:20},{key:"b",label:"Side b",val:4,min:1,max:20}],
        render:(p,C)=>{
          const {a=3,b=4}=p; const c=Math.sqrt(a*a+b*b);
          const sc=Math.min(140/(Math.max(a,b)||1),14);
          const bx=20, by=200, ax=bx+a*sc, ay=by-b*sc;
          return `<svg width="300" height="220" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="220" fill="#020617" rx="8"/>
            <polygon points="${bx},${by} ${ax},${by} ${ax},${ay}" fill="${C[0]}22" stroke="${C[0]}" stroke-width="2"/>
            <rect x="${ax-10}" y="${by-10}" width="10" height="10" fill="none" stroke="${C[2]}" stroke-width="1.5"/>
            <text x="${(bx+ax)/2}" y="${by+18}" text-anchor="middle" fill="${C[1]}" font-size="13" font-weight="700">a = ${a}</text>
            <text x="${ax+14}" y="${(by+ay)/2}" text-anchor="start" fill="${C[2]}" font-size="13" font-weight="700">b = ${b}</text>
            <text x="${(bx+ax)/2-12}" y="${(by+ay)/2-10}" text-anchor="middle" fill="${C[3]}" font-size="13" font-weight="700">c = ${c.toFixed(2)}</text>
            <text x="150" y="205" text-anchor="middle" fill="#94a3b8" font-size="11">${a}² + ${b}² = ${c.toFixed(2)}²</text>
          </svg>`;
        }
      },
      { id:"geo_eulers_poly", label:"Euler's Polyhedron F+V=E+2", desc:"3D: F+V=E+2, 2D: F+V=E+1",
        params:[{key:"F",label:"Faces",val:6,min:1,max:20},{key:"V",label:"Vertices",val:8,min:1,max:20},{key:"E",label:"Edges",val:12,min:1,max:30}],
        render:(p,C)=>{
          const {F=6,V=8,E=12}=p; const euler3d=F+V-E; const euler2d=F+V-E;
          const valid3d=euler3d===2, valid2d=euler3d===1;
          const col=valid3d||valid2d?"#22c55e":"#ef4444";
          return `<svg width="300" height="220" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="220" fill="#020617" rx="8"/>
            <text x="150" y="30" text-anchor="middle" fill="#e2e8f0" font-size="15" font-weight="800">Euler's Formula</text>
            <rect x="20" y="45" width="260" height="55" rx="8" fill="${C[0]}22" stroke="${C[0]}" stroke-width="1.5"/>
            <text x="150" y="68" text-anchor="middle" fill="${C[0]}" font-size="13">F + V − E = χ (Euler characteristic)</text>
            <text x="150" y="88" text-anchor="middle" fill="#94a3b8" font-size="11">${F} + ${V} − ${E} = ${F+V-E}</text>
            <rect x="20" y="110" width="120" height="48" rx="6" fill="${valid3d?"#22c55e22":"#ef444422"}" stroke="${valid3d?"#22c55e":"#ef4444"}" stroke-width="1.5"/>
            <text x="80" y="128" text-anchor="middle" fill="${valid3d?"#22c55e":"#ef4444"}" font-size="10" font-weight="700">3D Solid (χ=2)</text>
            <text x="80" y="148" text-anchor="middle" fill="${valid3d?"#22c55e":"#ef4444"}" font-size="14">${valid3d?"✓ Valid":"✗ Invalid"}</text>
            <rect x="160" y="110" width="120" height="48" rx="6" fill="${valid2d?"#22c55e22":"#94a3b822"}" stroke="${valid2d?"#22c55e":"#334155"}" stroke-width="1.5"/>
            <text x="220" y="128" text-anchor="middle" fill="${valid2d?"#22c55e":"#64748b"}" font-size="10" font-weight="700">2D Graph (χ=1)</text>
            <text x="220" y="148" text-anchor="middle" fill="${valid2d?"#22c55e":"#64748b"}" font-size="14">${valid2d?"✓ Valid":"−"}</text>
            <text x="150" y="185" text-anchor="middle" fill="#475569" font-size="10">Cube: F=6 V=8 E=12 → χ=2 ✓</text>
            <text x="150" y="200" text-anchor="middle" fill="#475569" font-size="10">Tetrahedron: F=4 V=4 E=6 → χ=2 ✓</text>
          </svg>`;
        }
      },
      { id:"geo_circle", label:"Circle Properties", desc:"Area, circumference, arc, sector",
        params:[{key:"r",label:"Radius",val:5,min:1,max:20},{key:"theta",label:"Angle (°)",val:90,min:1,max:360}],
        render:(p,C)=>{
          const {r=5,theta=90}=p;
          const area=(Math.PI*r*r).toFixed(2), circ=(2*Math.PI*r).toFixed(2);
          const arc=(Math.PI*r*theta/180).toFixed(2), sector=(Math.PI*r*r*theta/360).toFixed(2);
          const cx=110,cy=110,sr=80,rad=theta*Math.PI/180;
          const ex=cx+sr*Math.cos(-Math.PI/2+rad),ey=cy+sr*Math.sin(-Math.PI/2+rad);
          const lg=theta>180?1:0;
          return `<svg width="300" height="220" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="220" fill="#020617" rx="8"/>
            <circle cx="${cx}" cy="${cy}" r="${sr}" fill="${C[0]}18" stroke="${C[0]}44" stroke-width="1.5"/>
            <path d="M${cx},${cy} L${cx},${cy-sr} A${sr},${sr} 0 ${lg} 1 ${ex},${ey} Z" fill="${C[0]}44" stroke="${C[0]}" stroke-width="2"/>
            <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy-sr}" stroke="${C[1]}" stroke-width="1.5" stroke-dasharray="4,3"/>
            <text x="${cx}" y="${cy-sr/2-6}" text-anchor="middle" fill="${C[1]}" font-size="11">r=${r}</text>
            <text x="195" y="35" fill="#e2e8f0" font-size="11" font-weight="700">r = ${r}</text>
            <text x="195" y="55" fill="${C[0]}" font-size="10">Area = ${area}</text>
            <text x="195" y="72" fill="${C[1]}" font-size="10">Circ = ${circ}</text>
            <text x="195" y="89" fill="${C[2]}" font-size="10">Arc(${theta}°)= ${arc}</text>
            <text x="195" y="106" fill="${C[3]}" font-size="10">Sector= ${sector}</text>
          </svg>`;
        }
      },
      { id:"geo_triangle", label:"Triangle Properties", desc:"Sides, angles, area (Heron's formula)",
        params:[{key:"a",label:"Side a",val:5,min:1,max:20},{key:"b",label:"Side b",val:7,min:1,max:20},{key:"c",label:"Side c",val:6,min:1,max:20}],
        render:(p,C)=>{
          const {a=5,b=7,c=6}=p;
          const s=(a+b+c)/2;
          const areaVal=s>0&&s>a&&s>b&&s>c?Math.sqrt(s*(s-a)*(s-b)*(s-c)):-1;
          const valid=areaVal>0;
          const cosA=valid?(b*b+c*c-a*a)/(2*b*c):0;
          const cosB=valid?(a*a+c*c-b*b)/(2*a*c):0;
          const A=valid?(Math.acos(Math.max(-1,Math.min(1,cosA)))*180/Math.PI).toFixed(1):0;
          const B=valid?(Math.acos(Math.max(-1,Math.min(1,cosB)))*180/Math.PI).toFixed(1):0;
          const Cv=valid?(180-parseFloat(A)-parseFloat(B)).toFixed(1):0;
          const sc=10;
          const p0=[30,180],p1=[30+c*sc,180],p2=[30+b*sc*Math.cos(parseFloat(A)*Math.PI/180),180-b*sc*Math.sin(parseFloat(A)*Math.PI/180)];
          return `<svg width="300" height="220" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="220" fill="#020617" rx="8"/>
            ${valid?`<polygon points="${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}" fill="${C[0]}22" stroke="${C[0]}" stroke-width="2"/>
            <text x="${(p0[0]+p1[0])/2}" y="${p0[1]+16}" text-anchor="middle" fill="${C[1]}" font-size="11">c=${c}</text>
            <text x="${(p0[0]+p2[0])/2-14}" y="${(p0[1]+p2[1])/2}" text-anchor="end" fill="${C[2]}" font-size="11">b=${b}</text>
            <text x="${(p1[0]+p2[0])/2+8}" y="${(p1[1]+p2[1])/2}" fill="${C[3]}" font-size="11">a=${a}</text>`
            :`<text x="150" y="80" text-anchor="middle" fill="#ef4444" font-size="13">Invalid triangle</text>`}
            <text x="240" y="60" text-anchor="middle" fill="#e2e8f0" font-size="10" font-weight="700">Properties</text>
            ${valid?`<text x="240" y="80" text-anchor="middle" fill="${C[0]}" font-size="10">A = ${A}°</text>
            <text x="240" y="97" text-anchor="middle" fill="${C[1]}" font-size="10">B = ${B}°</text>
            <text x="240" y="114" text-anchor="middle" fill="${C[2]}" font-size="10">C = ${Cv}°</text>
            <text x="240" y="131" text-anchor="middle" fill="${C[3]}" font-size="10">s = ${s}</text>
            <text x="240" y="148" text-anchor="middle" fill="#94a3b8" font-size="10">Area=${areaVal.toFixed(2)}</text>`:""}
          </svg>`;
        }
      },
      { id:"geo_shapes_grid", label:"Regular Polygons", desc:"n-gon interior angles, area, perimeter",
        params:[{key:"n",label:"Sides (n)",val:6,min:3,max:12},{key:"s",label:"Side length",val:4,min:1,max:20}],
        render:(p,C)=>{
          const {n=6,s=4}=p;
          const interiorAngle=((n-2)*180/n).toFixed(1);
          const perimeter=n*s;
          const apothem=(s/(2*Math.tan(Math.PI/n))).toFixed(2);
          const area=(n*s*parseFloat(apothem)/2).toFixed(2);
          const cx=100,cy=110,r=70;
          const pts=Array.from({length:n},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(" ");
          const names=["","","","Triangle","Square","Pentagon","Hexagon","Heptagon","Octagon","Nonagon","Decagon","Hendecagon","Dodecagon"];
          return `<svg width="300" height="220" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="220" fill="#020617" rx="8"/>
            <polygon points="${pts}" fill="${C[0]}22" stroke="${C[0]}" stroke-width="2"/>
            <line x1="${cx}" y1="${cy}" x2="${cx+r}" y2="${cy}" stroke="${C[1]}" stroke-width="1" stroke-dasharray="3,2"/>
            <text x="${cx+r/2}" y="${cy-6}" text-anchor="middle" fill="${C[1]}" font-size="10">R=${r}</text>
            <text x="210" y="40" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="700">${names[n]||n+"-gon"}</text>
            <text x="210" y="60" text-anchor="middle" fill="${C[0]}" font-size="10">n = ${n} sides</text>
            <text x="210" y="78" text-anchor="middle" fill="${C[1]}" font-size="10">Interior ∠ = ${interiorAngle}°</text>
            <text x="210" y="96" text-anchor="middle" fill="${C[2]}" font-size="10">Sum ∠ = ${(n-2)*180}°</text>
            <text x="210" y="114" text-anchor="middle" fill="${C[3]}" font-size="10">Perimeter = ${perimeter}</text>
            <text x="210" y="132" text-anchor="middle" fill="#94a3b8" font-size="10">Apothem = ${apothem}</text>
            <text x="210" y="150" text-anchor="middle" fill="#94a3b8" font-size="10">Area = ${area}</text>
          </svg>`;
        }
      },
    ]
  },
  Algebra: {
    icon: "🔢",
    models: [
      { id:"alg_quadratic", label:"Quadratic Function", desc:"y = ax²+bx+c — parabola graph",
        params:[{key:"a",label:"a",val:1,min:-5,max:5,step:0.5},{key:"b",label:"b",val:0,min:-10,max:10},{key:"c",label:"c",val:0,min:-10,max:10}],
        render:(p,C)=>{
          const {a=1,b=0,c=0}=p;
          const disc=b*b-4*a*c;
          const roots=disc>=0?`x = ${((-b+Math.sqrt(disc))/(2*a)).toFixed(2)}, ${((-b-Math.sqrt(disc))/(2*a)).toFixed(2)}`:"No real roots";
          const vx=-b/(2*a), vy=a*vx*vx+b*vx+c;
          const W=300,H=200,ox=W/2,oy=H/2,sc=15;
          const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
          const pts=Array.from({length:61},(_,i)=>{const x=(i-30)/3;const y=a*x*x+b*x+c;return `${ox+x*sc},${clamp(oy-y*sc,0,H)}`;}).join(" ");
          const axisY=clamp(oy,0,H);
          return `<svg width="${W}" height="${H+20}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+20}" fill="#020617" rx="8"/>
            <line x1="10" y1="${axisY}" x2="${W-10}" y2="${axisY}" stroke="#334155" stroke-width="1"/>
            <line x1="${ox}" y1="5" x2="${ox}" y2="${H-5}" stroke="#334155" stroke-width="1"/>
            ${Array.from({length:7},(_,i)=>`<text x="${ox+(i-3)*sc*3}" y="${axisY+12}" text-anchor="middle" fill="#334155" font-size="8">${(i-3)*3}</text>`).join("")}
            <polyline points="${pts}" fill="none" stroke="${C[0]}" stroke-width="2.5"/>
            <circle cx="${ox+vx*sc}" cy="${clamp(oy-vy*sc,0,H)}" r="4" fill="${C[1]}"/>
            <text x="8" y="14" fill="#e2e8f0" font-size="10" font-weight="700">y = ${a}x² ${b>=0?"+":""}${b}x ${c>=0?"+":""}${c}</text>
            <text x="8" y="28" fill="${C[2]}" font-size="9">Vertex: (${vx.toFixed(2)}, ${vy.toFixed(2)})</text>
            <text x="8" y="42" fill="${C[3]}" font-size="9">Roots: ${roots}</text>
            <text x="8" y="56" fill="#64748b" font-size="9">Disc = ${disc.toFixed(2)}</text>
          </svg>`;
        }
      },
      { id:"alg_linear_sys", label:"Linear System (2×2)", desc:"Intersection of two lines",
        params:[{key:"a1",label:"a₁",val:2,min:-5,max:5},{key:"b1",label:"b₁",val:1,min:-5,max:5},{key:"c1",label:"c₁",val:4,min:-10,max:10},{key:"a2",label:"a₂",val:1,min:-5,max:5},{key:"b2",label:"b₂",val:-1,min:-5,max:5},{key:"c2",label:"c₂",val:1,min:-10,max:10}],
        render:(p,C)=>{
          const {a1=2,b1=1,c1=4,a2=1,b2=-1,c2=1}=p;
          const det=a1*b2-a2*b1;
          const ix=det!==0?(c1*b2-c2*b1)/det:null;
          const iy=det!==0?(a1*c2-a2*c1)/det:null;
          const W=300,H=200,ox=W/2,oy=H/2,sc=18;
          const lineY=(a,b,c,x)=>b!==0?(c-a*x)/b:null;
          const pts=(a,b,c)=>Array.from({length:31},(_,i)=>{const x=(i-15);const y=lineY(a,b,c,x);if(y==null)return null;return `${ox+x*sc},${oy-y*sc}`;}).filter(Boolean).join(" ");
          return `<svg width="${W}" height="${H+22}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+22}" fill="#020617" rx="8"/>
            <line x1="10" y1="${oy}" x2="${W-10}" y2="${oy}" stroke="#1e293b" stroke-width="1"/>
            <line x1="${ox}" y1="5" x2="${ox}" y2="${H-5}" stroke="#1e293b" stroke-width="1"/>
            <polyline points="${pts(a1,b1,c1)}" fill="none" stroke="${C[0]}" stroke-width="2"/>
            <polyline points="${pts(a2,b2,c2)}" fill="none" stroke="${C[1]}" stroke-width="2"/>
            ${ix!=null?`<circle cx="${ox+ix*sc}" cy="${oy-iy*sc}" r="5" fill="${C[2]}" stroke="white" stroke-width="1.5"/>
            <text x="8" y="${H+10}" fill="${C[2]}" font-size="9">Intersection: (${ix.toFixed(2)}, ${iy.toFixed(2)})</text>`
            :`<text x="8" y="${H+10}" fill="#ef4444" font-size="9">${det===0?"Parallel (no solution)":"Parallel"}</text>`}
            <text x="${W-5}" y="14" text-anchor="end" fill="${C[0]}" font-size="9">${a1}x+${b1}y=${c1}</text>
            <text x="${W-5}" y="26" text-anchor="end" fill="${C[1]}" font-size="9">${a2}x+${b2}y=${c2}</text>
          </svg>`;
        }
      },
    ]
  },
  "XY Graph": {
    icon: "📈",
    models: [
      { id:"xy_function", label:"Function Plotter (y=f(x))", desc:"Plot sin, cos, polynomial, exp",
        params:[{key:"type",label:"Function",val:0,min:0,max:7,step:1,options:["sin(x)","cos(x)","tan(x)","eˣ","ln(x)","x³","1/x","√x"]}],
        render:(p,C)=>{
          const {type=0}=p;
          const fns=[x=>Math.sin(x),x=>Math.cos(x),x=>Math.tan(x),x=>Math.exp(x/3),x=>x>0?Math.log(x):null,x=>x*x*x/20,x=>x!==0?1/x:null,x=>x>=0?Math.sqrt(x):null];
          const names=["sin(x)","cos(x)","tan(x)","eˣ","ln(x)","x³","1/x","√x"];
          const fn=fns[Math.round(type)%8];
          const W=300,H=200,ox=W/2,oy=H/2,sc=20;
          const pts=[]; for(let i=0;i<=200;i++){const x=(i-100)/10;const yv=fn(x);if(yv==null||!isFinite(yv)||Math.abs(yv)>12)continue;pts.push(`${ox+x*sc},${oy-yv*sc}`);}
          const segs=[]; let cur=[];
          pts.forEach((pt,i)=>{
            if(i>0){const prev=pts[i-1];const px=parseFloat(prev.split(",")[0]),cx=parseFloat(pt.split(",")[0]);if(Math.abs(cx-px)>sc*2){segs.push(cur);cur=[];};}
            cur.push(pt);
          }); segs.push(cur);
          return `<svg width="${W}" height="${H+20}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+20}" fill="#020617" rx="8"/>
            ${Array.from({length:5},(_,i)=>`<line x1="10" y1="${oy+(i-2)*40}" x2="${W-10}" y2="${oy+(i-2)*40}" stroke="#1e293b" stroke-width="0.5"/>`).join("")}
            ${Array.from({length:7},(_,i)=>`<line x1="${ox+(i-3)*40}" y1="5" x2="${ox+(i-3)*40}" y2="${H-5}" stroke="#1e293b" stroke-width="0.5"/>`).join("")}
            <line x1="10" y1="${oy}" x2="${W-10}" y2="${oy}" stroke="#334155" stroke-width="1.5"/>
            <line x1="${ox}" y1="5" x2="${ox}" y2="${H-5}" stroke="#334155" stroke-width="1.5"/>
            ${segs.filter(s=>s.length>1).map(s=>`<polyline points="${s.join(" ")}" fill="none" stroke="${C[0]}" stroke-width="2.5"/>`).join("")}
            <text x="150" y="${H+15}" text-anchor="middle" fill="#94a3b8" font-size="11">y = ${names[Math.round(type)%8]}</text>
          </svg>`;
        }
      },
      { id:"xy_polar", label:"Polar Plot", desc:"Rose, spiral, lemniscate in polar coords",
        params:[{key:"type",label:"Curve",val:0,min:0,max:4,step:1,options:["Rose r=cos(3θ)","Spiral r=θ","Lemniscate","Cardioid","Limaçon"]}],
        render:(p,C)=>{
          const {type=0}=p;
          const fns=[(t)=>Math.cos(3*t),(t)=>t/8,(t)=>Math.sqrt(Math.abs(Math.cos(2*t))),(t)=>1+Math.cos(t),(t)=>1.5+Math.cos(t)];
          const names=["Rose r=cos(3θ)","Spiral r=θ/8","Lemniscate","Cardioid r=1+cosθ","Limaçon"];
          const fn=fns[Math.round(type)%5];
          const W=300,H=210,cx=W/2,cy=H/2,sc=55;
          const pts=[]; const steps=Math.round(type)===1?400:200;
          for(let i=0;i<=steps;i++){const t=i*(2*Math.PI)/200;const r=fn(t);if(!isFinite(r)||r<0)continue;pts.push(`${cx+r*sc*Math.cos(t)},${cy+r*sc*Math.sin(t)}`);}
          return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H}" fill="#020617" rx="8"/>
            ${[20,40,55].map(r=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1e293b" stroke-width="0.5"/>`).join("")}
            <line x1="${cx-65}" y1="${cy}" x2="${cx+65}" y2="${cy}" stroke="#1e293b" stroke-width="1"/>
            <line x1="${cx}" y1="${cy-65}" x2="${cx}" y2="${cy+65}" stroke="#1e293b" stroke-width="1"/>
            <polyline points="${pts.join(" ")}" fill="${C[0]}22" stroke="${C[0]}" stroke-width="2"/>
            <text x="150" y="${H-6}" text-anchor="middle" fill="#94a3b8" font-size="10">${names[Math.round(type)%5]}</text>
          </svg>`;
        }
      },
      { id:"xy_parametric", label:"Parametric Curves", desc:"Lissajous, cycloid, epicycloid",
        params:[{key:"type",label:"Curve",val:0,min:0,max:3,step:1,options:["Lissajous a=3,b=2","Cycloid","Epicycloid","Hypocycloid"]},{key:"A",label:"Amplitude",val:3,min:1,max:5}],
        render:(p,C)=>{
          const {type=0,A=3}=p;
          const W=300,H=200,cx=W/2,cy=H/2;
          const sc=30;
          let pts=[];
          const t0=Math.round(type)%4;
          if(t0===0){for(let i=0;i<=628;i++){const t=i/100;pts.push(`${cx+sc*A*Math.sin(3*t+Math.PI/4)},${cy+sc*A*Math.sin(2*t)}`);}}
          else if(t0===1){for(let i=0;i<=628;i++){const t=i/100;pts.push(`${20+(t*20)},${cy-(sc*A)*(1-Math.cos(t))}`);}}
          else if(t0===2){for(let i=0;i<=628;i++){const t=i/100;const R=A*8,r=R/3;pts.push(`${cx+((R+r)*Math.cos(t)-r*Math.cos((R+r)/r*t))},${cy+((R+r)*Math.sin(t)-r*Math.sin((R+r)/r*t))}`);}}
          else{for(let i=0;i<=628;i++){const t=i/100;const R=A*8,r=R/4;pts.push(`${cx+((R-r)*Math.cos(t)+r*Math.cos((R-r)/r*t))},${cy+((R-r)*Math.sin(t)-r*Math.sin((R-r)/r*t))}`);}}
          const names=["Lissajous (3:2)","Cycloid","Epicycloid","Hypocycloid"];
          return `<svg width="${W}" height="${H+20}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+20}" fill="#020617" rx="8"/>
            <line x1="10" y1="${cy}" x2="${W-10}" y2="${cy}" stroke="#1e293b" stroke-width="1"/>
            <line x1="${cx}" y1="5" x2="${cx}" y2="${H-5}" stroke="#1e293b" stroke-width="1"/>
            <polyline points="${pts.join(" ")}" fill="none" stroke="${C[0]}" stroke-width="2"/>
            <text x="150" y="${H+14}" text-anchor="middle" fill="#94a3b8" font-size="10">${names[t0]}</text>
          </svg>`;
        }
      },
    ]
  },
  "XYZ / 3D": {
    icon: "🧊",
    models: [
      { id:"xyz_surface", label:"3D Surface (Isometric)", desc:"Sine surface, saddle, paraboloid",
        params:[{key:"type",label:"Surface",val:0,min:0,max:3,step:1,options:["sin(r)","Saddle z=x²-y²","Paraboloid","Ripple"]}],
        render:(p,C)=>{
          const {type=0}=p;
          const fns=[(x,y)=>Math.sin(Math.sqrt(x*x+y*y))*20,(x,y)=>(x*x-y*y)*0.5,(x,y)=>-(x*x+y*y)*0.04,(x,y)=>Math.sin(x)*Math.cos(y)*15];
          const fn=fns[Math.round(type)%4];
          const names=["Ripple: z=sin(r)","Saddle: z=x²-y²","Paraboloid: z=-(x²+y²)","Sine: z=sin(x)cos(y)"];
          const W=300,H=220;
          const toIso=(x,y,z)=>{const ix=(x-y)*0.866,iy=(x+y)*0.5-z;return [W/2+ix*6,H/2+iy*4];};
          const polys=[];
          const N=12;
          for(let i=-N/2;i<N/2;i++){for(let j=-N/2;j<N/2;j++){
            const z00=fn(i,j),z10=fn(i+1,j),z01=fn(i,j+1),z11=fn(i+1,j+1);
            const [x0,y0]=toIso(i,j,z00),[x1,y1]=toIso(i+1,j,z10),[x2,y2]=toIso(i+1,j+1,z11),[x3,y3]=toIso(i,j+1,z01);
            const avgZ=(z00+z10+z01+z11)/4;
            const t=(avgZ+25)/50;
            const r=Math.round(59+t*(C[0]==="0"?0:parseInt(C[0].slice(1,3),16)-59));
            polys.push({pts:`${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3}`,z:avgZ,t});
          }}
          polys.sort((a,b)=>a.z-b.z);
          return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H}" fill="#020617" rx="8"/>
            ${polys.map(({pts,t})=>`<polygon points="${pts}" fill="${C[0]}" fill-opacity="${0.3+t*0.5}" stroke="${C[1]}" stroke-width="0.3" stroke-opacity="0.5"/>`).join("")}
            <text x="150" y="${H-5}" text-anchor="middle" fill="#64748b" font-size="10">${names[Math.round(type)%4]}</text>
          </svg>`;
        }
      },
      { id:"xyz_axes", label:"3D Coordinate System", desc:"Visualize xyz axes and a point",
        params:[{key:"px",label:"Point X",val:3,min:-5,max:5},{key:"py",label:"Point Y",val:2,min:-5,max:5},{key:"pz",label:"Point Z",val:4,min:-5,max:5}],
        render:(p,C)=>{
          const {px=3,py=2,pz=4}=p;
          const W=300,H=220,cx=W/2,cy=H*0.6;
          const iso=(x,y,z)=>[cx+x*18-y*18,cy-z*24+x*9+y*9];
          const [ax,ay]=iso(4,0,0),[bx,by]=iso(0,4,0),[cz1,cz2]=iso(0,0,4);
          const [ppx,ppy]=iso(px,py,pz);
          const [dx,dy]=iso(px,py,0);
          return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H}" fill="#020617" rx="8"/>
            <defs><marker id="ax" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0,6 2,0 4" fill="${C[0]}"/></marker>
            <marker id="ay" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0,6 2,0 4" fill="${C[1]}"/></marker>
            <marker id="az" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0,6 2,0 4" fill="${C[2]}"/></marker></defs>
            <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}" stroke="${C[0]}" stroke-width="2" marker-end="url(#ax)"/>
            <line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke="${C[1]}" stroke-width="2" marker-end="url(#ay)"/>
            <line x1="${cx}" y1="${cy}" x2="${cz1}" y2="${cz2}" stroke="${C[2]}" stroke-width="2" marker-end="url(#az)"/>
            <text x="${ax+5}" y="${ay+4}" fill="${C[0]}" font-size="12" font-weight="700">X</text>
            <text x="${bx+5}" y="${by+4}" fill="${C[1]}" font-size="12" font-weight="700">Y</text>
            <text x="${cz1}" y="${cz2-5}" fill="${C[2]}" font-size="12" font-weight="700">Z</text>
            <line x1="${cx}" y1="${cy}" x2="${dx}" y2="${dy}" stroke="#334155" stroke-width="1" stroke-dasharray="3,2"/>
            <line x1="${dx}" y1="${dy}" x2="${ppx}" y2="${ppy}" stroke="#334155" stroke-width="1" stroke-dasharray="3,2"/>
            <circle cx="${ppx}" cy="${ppy}" r="5" fill="${C[3]}" stroke="white" stroke-width="1.5"/>
            <text x="${ppx+8}" y="${ppy}" fill="${C[3]}" font-size="10" font-weight="700">(${px},${py},${pz})</text>
            <text x="150" y="${H-5}" text-anchor="middle" fill="#475569" font-size="9">Isometric projection</text>
          </svg>`;
        }
      },
    ]
  },
  Statistics: {
    icon: "📊",
    models: [
      { id:"stat_normal_dist", label:"Normal Distribution", desc:"Bell curve with μ and σ controls",
        params:[{key:"mu",label:"μ (mean)",val:0,min:-5,max:5,step:0.5},{key:"sigma",label:"σ (std dev)",val:1,min:0.5,max:4,step:0.5}],
        render:(p,C)=>{
          const {mu=0,sigma=1}=p;
          const W=300,H=200,px=W/2,py=H-30,sc=25;
          const normal=(x)=>(1/(sigma*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-mu)/sigma)**2);
          const scY=140/normal(mu);
          const pts=Array.from({length:121},(_,i)=>{const x=(i-60)/10;const y=normal(x)*scY;return `${px+x*sc},${py-y}`;}).join(" ");
          const sdLines=[-2,-1,1,2].map(n=>{const x=mu+n*sigma;const y=normal(x)*scY;return `<line x1="${px+x*sc}" y1="${py}" x2="${px+x*sc}" y2="${py-y}" stroke="${C[Math.abs(n)%C.length]}" stroke-width="1" stroke-dasharray="3,2"/><text x="${px+x*sc}" y="${py+12}" text-anchor="middle" fill="${C[Math.abs(n)%C.length]}" font-size="9">μ${n>=0?"+":""}${n}σ</text>`;}).join("");
          return `<svg width="${W}" height="${H+15}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+15}" fill="#020617" rx="8"/>
            <path d="${pts.split(" ").map((pt,i)=>i===0?`M${pt}`:`L${pt}`).join(" ")} L${px+60*sc},${py} L${px-60*sc},${py} Z" fill="${C[0]}22"/>
            <polyline points="${pts}" fill="none" stroke="${C[0]}" stroke-width="2.5"/>
            <line x1="20" y1="${py}" x2="${W-20}" y2="${py}" stroke="#334155" stroke-width="1"/>
            <line x1="${px+mu*sc}" y1="${py}" x2="${px+mu*sc}" y2="${py-140}" stroke="${C[1]}" stroke-width="1.5" stroke-dasharray="4,3"/>
            ${sdLines}
            <text x="8" y="16" fill="#e2e8f0" font-size="10" font-weight="700">N(μ=${mu}, σ=${sigma})</text>
            <text x="8" y="30" fill="#64748b" font-size="9">68% within 1σ | 95% within 2σ | 99.7% within 3σ</text>
          </svg>`;
        }
      },
      { id:"stat_histogram", label:"Histogram + Boxplot", desc:"Data distribution visualized",
        params:[{key:"bins",label:"Bins",val:8,min:3,max:15},{key:"skew",label:"Skew",val:0,min:-2,max:2,step:0.5}],
        render:(p,C)=>{
          const {bins=8,skew=0}=p;
          const W=300,H=200;
          const data=Array.from({length:bins},(_,i)=>{const x=(i/bins-0.5)*2;const h=Math.exp(-0.5*(x-skew*0.5)**2)*80+Math.random()*10;return Math.max(5,h);});
          const maxH=Math.max(...data);
          const bw=(W-40)/bins;
          const bars=data.map((h,i)=>`<rect x="${20+i*bw}" y="${H-30-h*1.2}" width="${bw-2}" height="${h*1.2}" fill="${C[i%C.length]}" fill-opacity="0.8" rx="2"/>`).join("");
          return `<svg width="${W}" height="${H+10}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+10}" fill="#020617" rx="8"/>
            ${bars}
            <line x1="20" y1="${H-30}" x2="${W-10}" y2="${H-30}" stroke="#334155" stroke-width="1"/>
            <text x="150" y="${H+6}" text-anchor="middle" fill="#64748b" font-size="10">Histogram (${bins} bins, skew≈${skew})</text>
          </svg>`;
        }
      },
      { id:"stat_regression", label:"Scatter + Regression Line", desc:"Linear regression visualization",
        params:[{key:"slope",label:"Slope",val:2,min:-5,max:5,step:0.5},{key:"noise",label:"Noise",val:15,min:0,max:40,step:5}],
        render:(p,C)=>{
          const {slope=2,noise=15}=p;
          const W=300,H=200,ox=30,oy=H-30;
          const seed=slope*1000+noise;
          const pts=Array.from({length:15},(_,i)=>{const x=i*15+10;const yn=((seed*(i+1)*7331)%1000)/1000*noise*2-noise;const y=slope*x/15+yn;return {x,y:Math.max(0,Math.min(170,y+50));});
          const n=pts.length,sx=pts.reduce((s,p)=>s+p.x,0),sy=pts.reduce((s,p)=>s+p.y,0);
          const mx=sx/n,my=sy/n;
          const m=pts.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0)/pts.reduce((s,p)=>s+(p.x-mx)**2,0);
          const b_=my-m*mx;
          return `<svg width="${W}" height="${H+10}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+10}" fill="#020617" rx="8"/>
            <line x1="${ox}" y1="5" x2="${ox}" y2="${oy}" stroke="#334155" stroke-width="1"/>
            <line x1="${ox}" y1="${oy}" x2="${W-10}" y2="${oy}" stroke="#334155" stroke-width="1"/>
            ${pts.map(p=>`<circle cx="${ox+p.x}" cy="${oy-p.y}" r="4" fill="${C[0]}" fill-opacity="0.8"/>`).join("")}
            <line x1="${ox}" y1="${oy-b_}" x2="${W-10}" y2="${oy-(m*(W-40)+b_)}" stroke="${C[1]}" stroke-width="2"/>
            <text x="150" y="${H+6}" text-anchor="middle" fill="#64748b" font-size="9">ŷ = ${m.toFixed(2)}x + ${b_.toFixed(1)}</text>
          </svg>`;
        }
      },
    ]
  },
  Probability: {
    icon: "🎲",
    models: [
      { id:"prob_binomial", label:"Binomial Distribution", desc:"P(X=k) = C(n,k)pᵏ(1-p)ⁿ⁻ᵏ",
        params:[{key:"n",label:"n (trials)",val:10,min:1,max:20},{key:"pv",label:"p (prob)",val:5,min:1,max:9,step:1}],
        render:(p,C)=>{
          const {n=10,pv=5}=p; const prob=pv/10;
          const W=300,H=200;
          const comb=(n,k)=>{if(k>n)return 0;let r=1;for(let i=0;i<k;i++)r=r*(n-i)/(i+1);return r;};
          const probs=Array.from({length:n+1},(_,k)=>({k,p:comb(n,k)*Math.pow(prob,k)*Math.pow(1-prob,n-k)}));
          const maxP=Math.max(...probs.map(x=>x.p));
          const bw=(W-20)/(n+1);
          return `<svg width="${W}" height="${H+10}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+10}" fill="#020617" rx="8"/>
            ${probs.map(({k,p:pv2})=>{const bh=(pv2/maxP)*(H-40);return `<rect x="${10+k*bw}" y="${H-30-bh}" width="${bw-2}" height="${bh}" fill="${C[k%C.length]}" rx="2"/>${bw>18?`<text x="${10+k*bw+bw/2}" y="${H-18}" text-anchor="middle" fill="#64748b" font-size="8">${k}</text>`:""}`;}).join("")}
            <line x1="10" y1="${H-30}" x2="${W-10}" y2="${H-30}" stroke="#334155" stroke-width="1"/>
            <text x="150" y="${H+6}" text-anchor="middle" fill="#64748b" font-size="9">Bin(n=${n}, p=${prob}) μ=${(n*prob).toFixed(1)} σ=${Math.sqrt(n*prob*(1-prob)).toFixed(2)}</text>
          </svg>`;
        }
      },
      { id:"prob_bayes", label:"Bayes' Theorem Visual", desc:"Prior, likelihood, posterior",
        params:[{key:"prior",label:"Prior P(A) %",val:30,min:1,max:99},{key:"likeli",label:"P(B|A) %",val:80,min:1,max:99},{key:"likeliN",label:"P(B|¬A) %",val:20,min:1,max:99}],
        render:(p,C)=>{
          const {prior=30,likeli=80,likeliN=20}=p;
          const pA=prior/100,pBgA=likeli/100,pBgnA=likeliN/100;
          const pB=pA*pBgA+(1-pA)*pBgnA;
          const posterior=(pA*pBgA/pB);
          const W=300,H=200;
          const barW=W-40;
          return `<svg width="${W}" height="${H+20}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+20}" fill="#020617" rx="8"/>
            <text x="150" y="20" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="700">Bayes' Theorem</text>
            ${[["Prior P(A)",pA,C[0],50],["P(B|A)",pBgA,C[1],90],["P(B|¬A)",pBgnA,C[2],130],["P(B)",pB,C[3],170],["Posterior P(A|B)",posterior,"#f59e0b",210]].map(([lbl,val,col,y])=>`
              <text x="20" y="${y-3}" fill="${col}" font-size="9" font-weight="600">${lbl}</text>
              <rect x="20" y="${y}" width="${barW*val}" height="16" fill="${col}" fill-opacity="0.7" rx="3"/>
              <rect x="20" y="${y}" width="${barW}" height="16" fill="${col}" fill-opacity="0.1" rx="3"/>
              <text x="${20+barW+5}" y="${y+12}" fill="${col}" font-size="9" font-weight="700">${(val*100).toFixed(1)}%</text>`).join("")}
          </svg>`;
        }
      },
    ]
  },
  Calculus: {
    icon: "∫",
    models: [
      { id:"calc_derivative", label:"Derivative Visualizer", desc:"f(x) and f'(x) on same plot",
        params:[{key:"fn",label:"Function",val:0,min:0,max:4,step:1,options:["x³-3x","sin(x)","eˣ/5","x²-4","cos(x)"]}],
        render:(p,C)=>{
          const {fn=0}=p;
          const fns=[(x)=>x*x*x/30-x,(x)=>Math.sin(x),(x)=>Math.exp(x/3)/5-2,(x)=>x*x/30-2,(x)=>Math.cos(x)];
          const dfns=[(x)=>x*x/10-1,(x)=>Math.cos(x),(x)=>Math.exp(x/3)/15,(x)=>x/15,(x)=>-Math.sin(x)];
          const names=["x³-3x","sin(x)","eˣ/5","x²-4","cos(x)"];
          const dnames=["3x²-3","cos(x)","eˣ/15","2x","−sin(x)"];
          const ti=Math.round(fn)%5;
          const W=300,H=200,ox=W/2,oy=H/2,sc=20;
          const clamp=(v)=>Math.max(-H/2,Math.min(H/2,v));
          const pts1=Array.from({length:121},(_,i)=>{const x=(i-60)/10;return `${ox+x*sc},${oy-clamp(fns[ti](x)*sc)}`;}).join(" ");
          const pts2=Array.from({length:121},(_,i)=>{const x=(i-60)/10;return `${ox+x*sc},${oy-clamp(dfns[ti](x)*sc)}`;}).join(" ");
          return `<svg width="${W}" height="${H+25}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+25}" fill="#020617" rx="8"/>
            ${Array.from({length:5},(_,i)=>`<line x1="10" y1="${oy+(i-2)*40}" x2="${W-10}" y2="${oy+(i-2)*40}" stroke="#0f172a" stroke-width="1"/>`).join("")}
            <line x1="10" y1="${oy}" x2="${W-10}" y2="${oy}" stroke="#1e293b" stroke-width="1.5"/>
            <line x1="${ox}" y1="5" x2="${ox}" y2="${H-5}" stroke="#1e293b" stroke-width="1.5"/>
            <polyline points="${pts1}" fill="none" stroke="${C[0]}" stroke-width="2.5"/>
            <polyline points="${pts2}" fill="none" stroke="${C[1]}" stroke-width="2" stroke-dasharray="6,3"/>
            <rect x="8" y="${H+2}" width="10" height="4" fill="${C[0]}"/>
            <text x="22" y="${H+8}" fill="${C[0]}" font-size="9">f(x) = ${names[ti]}</text>
            <rect x="120" y="${H+2}" width="10" height="4" fill="${C[1]}" fill-opacity="0.7"/>
            <text x="134" y="${H+8}" fill="${C[1]}" font-size="9">f'(x) = ${dnames[ti]}</text>
          </svg>`;
        }
      },
      { id:"calc_integral", label:"Riemann Integral", desc:"Area under curve with rectangles",
        params:[{key:"a",label:"a (left)",val:-3,min:-5,max:0},{key:"b",label:"b (right)",val:3,min:0,max:5},{key:"n",label:"n (rects)",val:8,min:2,max:30}],
        render:(p,C)=>{
          const {a=-3,b=3,n=8}=p;
          const fn=(x)=>-x*x/4+4;
          const W=300,H=200,ox=W/2,oy=H-25,sc=22;
          const dx=(b-a)/n, area=Array.from({length:n},(_,i)=>fn(a+i*dx)*dx).reduce((s,v)=>s+v,0);
          const rects=Array.from({length:n},(_,i)=>{const x=a+i*dx;const y=fn(x+dx/2);const bh=Math.abs(y)*sc;const ry=y>=0?oy-bh:oy;return `<rect x="${ox+x*sc}" y="${ry}" width="${dx*sc-1}" height="${bh}" fill="${C[i%3]}" fill-opacity="0.5" stroke="${C[i%3]}" stroke-width="0.5"/>`;}).join("");
          const curve=Array.from({length:81},(_,i)=>{const x=(i-40)/5;return `${ox+x*sc},${oy-fn(x)*sc}`;}).join(" ");
          return `<svg width="${W}" height="${H+15}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+15}" fill="#020617" rx="8"/>
            ${rects}
            <polyline points="${curve}" fill="none" stroke="${C[0]}" stroke-width="2.5"/>
            <line x1="15" y1="${oy}" x2="${W-10}" y2="${oy}" stroke="#334155" stroke-width="1.5"/>
            <line x1="${ox+a*sc}" y1="${oy-2}" x2="${ox+a*sc}" y2="${oy+6}" stroke="#f59e0b" stroke-width="2"/>
            <line x1="${ox+b*sc}" y1="${oy-2}" x2="${ox+b*sc}" y2="${oy+6}" stroke="#f59e0b" stroke-width="2"/>
            <text x="150" y="${H+12}" text-anchor="middle" fill="#94a3b8" font-size="9">∫[${a},${b}] f(x)dx ≈ ${area.toFixed(2)} (${n} rectangles)</text>
          </svg>`;
        }
      },
      { id:"calc_taylor", label:"Taylor Series Approximation", desc:"Partial sums converging to sin(x)",
        params:[{key:"terms",label:"Terms",val:3,min:1,max:7}],
        render:(p,C)=>{
          const {terms=3}=p;
          const W=300,H=200,ox=W/2,oy=H/2,sc=25;
          const factorial=(n)=>{let f=1;for(let i=2;i<=n;i++)f*=i;return f;};
          const taylor=(x,t)=>{let s=0;for(let k=0;k<t;k++)s+=Math.pow(-1,k)*Math.pow(x,2*k+1)/factorial(2*k+1);return s;};
          const clamp=(v)=>Math.max(-4,Math.min(4,v));
          const sin_pts=Array.from({length:101},(_,i)=>{const x=(i-50)/10;return `${ox+x*sc},${oy-clamp(Math.sin(x))*sc}`;}).join(" ");
          const taylor_pts=Array.from({length:101},(_,i)=>{const x=(i-50)/10;return `${ox+x*sc},${oy-clamp(taylor(x,terms))*sc}`;}).join(" ");
          return `<svg width="${W}" height="${H+22}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+22}" fill="#020617" rx="8"/>
            <line x1="10" y1="${oy}" x2="${W-10}" y2="${oy}" stroke="#1e293b" stroke-width="1"/>
            <line x1="${ox}" y1="5" x2="${ox}" y2="${H-5}" stroke="#1e293b" stroke-width="1"/>
            <polyline points="${sin_pts}" fill="none" stroke="${C[0]}" stroke-width="2"/>
            <polyline points="${taylor_pts}" fill="none" stroke="${C[1]}" stroke-width="2" stroke-dasharray="5,3"/>
            <text x="8" y="${H+10}" fill="${C[0]}" font-size="9">sin(x)</text>
            <text x="60" y="${H+10}" fill="${C[1]}" font-size="9">Taylor(${terms} terms): Σ(-1)ᵏx²ᵏ⁺¹/(2k+1)!</text>
          </svg>`;
        }
      },
    ]
  },
  Physics: {
    icon: "⚛️",
    models: [
      { id:"phys_projectile", label:"Projectile Motion", desc:"Range, height, trajectory",
        params:[{key:"v",label:"v₀ (m/s)",val:20,min:5,max:50},{key:"angle",label:"θ (degrees)",val:45,min:5,max:85}],
        render:(p,C)=>{
          const {v=20,angle=45}=p;
          const g=9.8, rad=angle*Math.PI/180;
          const T=2*v*Math.sin(rad)/g, R=v*v*Math.sin(2*rad)/g, H=v*v*Math.sin(rad)*Math.sin(rad)/(2*g);
          const W=300,H2=200;
          const scX=(W-40)/R, scY=(H2-50)/Math.max(H,1);
          const pts=Array.from({length:61},(_,i)=>{const t=i*T/60;const x=v*Math.cos(rad)*t;const y=v*Math.sin(rad)*t-0.5*g*t*t;return y>=0?`${20+x*scX},${H2-20-y*scY}`:null;}).filter(Boolean).join(" ");
          return `<svg width="${W}" height="${H2+20}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H2+20}" fill="#020617" rx="8"/>
            <line x1="20" y1="${H2-20}" x2="${W-10}" y2="${H2-20}" stroke="#334155" stroke-width="1.5"/>
            <polyline points="${pts}" fill="none" stroke="${C[0]}" stroke-width="2.5"/>
            <circle cx="20" cy="${H2-20}" r="4" fill="${C[1]}"/>
            <line x1="${20+R*scX*0.5}" y1="${H2-20}" x2="${20+R*scX*0.5}" y2="${H2-20-H*scY}" stroke="${C[2]}" stroke-width="1" stroke-dasharray="3,2"/>
            <text x="8" y="16" fill="#e2e8f0" font-size="10" font-weight="700">v₀=${v}m/s θ=${angle}°</text>
            <text x="8" y="30" fill="${C[0]}" font-size="9">Range = ${R.toFixed(1)} m</text>
            <text x="8" y="43" fill="${C[1]}" font-size="9">Max H = ${H.toFixed(1)} m</text>
            <text x="8" y="56" fill="${C[2]}" font-size="9">Time = ${T.toFixed(2)} s</text>
          </svg>`;
        }
      },
      { id:"phys_wave", label:"Wave Interference", desc:"Superposition of two waves",
        params:[{key:"f1",label:"f₁ (freq)",val:2,min:1,max:8},{key:"f2",label:"f₂ (freq)",val:3,min:1,max:8},{key:"phase",label:"Phase Δ",val:0,min:0,max:6,step:0.5}],
        render:(p,C)=>{
          const {f1=2,f2=3,phase=0}=p;
          const W=300,H=200,oy=H/2,sc=25;
          const pts1=Array.from({length:201},(_,i)=>{const x=i*2;const y=Math.sin(f1*x*0.05);return `${x},${oy-y*sc}`;}).join(" ");
          const pts2=Array.from({length:201},(_,i)=>{const x=i*2;const y=Math.sin(f2*x*0.05+phase);return `${x},${oy-y*sc}`;}).join(" ");
          const ptsS=Array.from({length:201},(_,i)=>{const x=i*2;const y=Math.sin(f1*x*0.05)+Math.sin(f2*x*0.05+phase);return `${x},${oy-y*sc*0.6}`;}).join(" ");
          return `<svg width="${W}" height="${H+20}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+20}" fill="#020617" rx="8"/>
            <line x1="0" y1="${oy}" x2="${W}" y2="${oy}" stroke="#1e293b" stroke-width="1"/>
            <polyline points="${pts1}" fill="none" stroke="${C[0]}" stroke-width="1.5" opacity="0.7"/>
            <polyline points="${pts2}" fill="none" stroke="${C[1]}" stroke-width="1.5" opacity="0.7"/>
            <polyline points="${ptsS}" fill="none" stroke="${C[2]}" stroke-width="2.5"/>
            <text x="8" y="${H+12}" fill="${C[2]}" font-size="9">Superposition: f₁=${f1} + f₂=${f2} (Δφ=${phase})</text>
          </svg>`;
        }
      },
      { id:"phys_circuit", label:"RC Circuit Response", desc:"Charging/discharging capacitor",
        params:[{key:"R",label:"R (kΩ)",val:10,min:1,max:100},{key:"C",label:"C (μF)",val:100,min:10,max:1000}],
        render:(p,C)=>{
          const {R=10,C2=100}=p; const C3=p.C||100;
          const tau=(R*C3)/1000; // ms
          const W=300,H=200,oy=H-30;
          const pts=Array.from({length:100},(_,i)=>{const t=i*tau/20;const v=1-Math.exp(-t/tau);return `${10+i*2.8},${oy-v*(H-50)}`;}).join(" ");
          const pts2=Array.from({length:100},(_,i)=>{const t=i*tau/20;const v=Math.exp(-t/tau);return `${10+i*2.8},${oy-v*(H-50)}`;}).join(" ");
          return `<svg width="${W}" height="${H+20}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+20}" fill="#020617" rx="8"/>
            <line x1="10" y1="${oy}" x2="${W-10}" y2="${oy}" stroke="#334155" stroke-width="1"/>
            <line x1="10" y1="20" x2="10" y2="${oy}" stroke="#334155" stroke-width="1"/>
            <polyline points="${pts}" fill="none" stroke="${C[0]}" stroke-width="2.5"/>
            <polyline points="${pts2}" fill="none" stroke="${C[1]}" stroke-width="2" stroke-dasharray="5,3"/>
            <line x1="${10+20*2.8}" y1="20" x2="${10+20*2.8}" y2="${oy}" stroke="${C[2]}" stroke-width="1" stroke-dasharray="2,2"/>
            <text x="${10+20*2.8+3}" y="30" fill="${C[2]}" font-size="9">τ=${tau.toFixed(1)}ms</text>
            <text x="8" y="${H+12}" fill="#94a3b8" font-size="9">RC = ${R}kΩ × ${C3}μF → τ=${tau.toFixed(1)}ms</text>
          </svg>`;
        }
      },
    ]
  },
  Chemistry: {
    icon: "🧪",
    models: [
      { id:"chem_reaction_rate", label:"Arrhenius Reaction Rate", desc:"k vs T with activation energy",
        params:[{key:"Ea",label:"Ea (kJ/mol)",val:50,min:10,max:150},{key:"A",label:"A (freq)",val:5,min:1,max:10}],
        render:(p,C)=>{
          const {Ea=50,A=5}=p;
          const R=8.314, W=300,H=200;
          const pts=Array.from({length:100},(_,i)=>{const T=300+i*5;const k=A*Math.exp(-Ea*1000/(R*T));return {T,k};});
          const maxK=pts[pts.length-1].k;
          const poly=pts.map(({T,k},i)=>`${20+i*2.8},${H-30-(k/maxK)*(H-50)}`).join(" ");
          return `<svg width="${W}" height="${H+20}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+20}" fill="#020617" rx="8"/>
            <line x1="20" y1="${H-30}" x2="${W-10}" y2="${H-30}" stroke="#334155" stroke-width="1"/>
            <line x1="20" y1="10" x2="20" y2="${H-30}" stroke="#334155" stroke-width="1"/>
            <polyline points="${poly}" fill="none" stroke="${C[0]}" stroke-width="2.5"/>
            <path d="M20,${H-30} ${poly} ${W-10},${H-30} Z" fill="${C[0]}18"/>
            <text x="8" y="16" fill="#e2e8f0" font-size="10" font-weight="700">k = Ae^(-Eₐ/RT)</text>
            <text x="8" y="30" fill="${C[1]}" font-size="9">Eₐ = ${Ea} kJ/mol</text>
            <text x="8" y="43" fill="${C[2]}" font-size="9">T range: 300K → 800K</text>
            <text x="150" y="${H+12}" text-anchor="middle" fill="#475569" font-size="9">Temperature (K) →</text>
          </svg>`;
        }
      },
      { id:"chem_titration", label:"Titration Curve", desc:"pH vs volume added (acid-base)",
        params:[{key:"type",label:"Type",val:0,min:0,max:2,step:1,options:["Strong Acid-Base","Weak Acid","Diprotic"]}],
        render:(p,C)=>{
          const {type=0}=p;
          const W=300,H=200,oy=H-20,ox=20;
          const pHFn=type===0?(v)=>{if(v<24)return Math.max(0,2-Math.log10(0.1*(25-v)/50));if(v===25)return 7;return 14+Math.log10(0.1*(v-25)/50);}
            :(v)=>{if(v<25)return 4.75+Math.log10(v/(25-v||0.01));return 9+Math.log10((v-25)/(50-v||0.01));};
          const pts=Array.from({length:100},(_,i)=>{const v=i*0.5;try{const pH=Math.max(0,Math.min(14,pHFn(v)));return `${ox+v*5.2},${oy-pH*(H-30)/14}`;}catch{return null;}}).filter(Boolean).join(" ");
          const epx=ox+25*5.2;
          return `<svg width="${W}" height="${H+20}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+20}" fill="#020617" rx="8"/>
            <rect x="${ox}" y="${oy-7*(H-30)/14}" width="${W-ox-10}" height="${(H-30)/14}" fill="${C[0]}15"/>
            <line x1="${ox}" y1="${oy}" x2="${W-10}" y2="${oy}" stroke="#334155" stroke-width="1"/>
            <line x1="${ox}" y1="10" x2="${ox}" y2="${oy}" stroke="#334155" stroke-width="1"/>
            ${[0,2,4,7,10,12,14].map(ph=>`<line x1="${ox-3}" y1="${oy-ph*(H-30)/14}" x2="${W-10}" y2="${oy-ph*(H-30)/14}" stroke="#0f172a" stroke-width="1"/><text x="${ox-5}" y="${oy-ph*(H-30)/14+4}" text-anchor="end" fill="#475569" font-size="8">${ph}</text>`).join("")}
            <polyline points="${pts}" fill="none" stroke="${C[0]}" stroke-width="2.5"/>
            <line x1="${epx}" y1="10" x2="${epx}" y2="${oy}" stroke="${C[1]}" stroke-width="1.5" stroke-dasharray="4,3"/>
            <text x="${epx}" y="20" text-anchor="middle" fill="${C[1]}" font-size="9">EP</text>
            <text x="150" y="${H+12}" text-anchor="middle" fill="#475569" font-size="9">Volume NaOH added (mL) →   pH ↑</text>
          </svg>`;
        }
      },
    ]
  },
  Finance: {
    icon: "💰",
    models: [
      { id:"fin_compound", label:"Compound Interest Growth", desc:"Compare simple vs compound",
        params:[{key:"P",label:"Principal ($)",val:1000,min:100,max:10000,step:100},{key:"r",label:"Rate (%)",val:8,min:1,max:20},{key:"n",label:"Years",val:20,min:5,max:40}],
        render:(p,C)=>{
          const {P=1000,r=8,n=20}=p;
          const W=300,H=200,ox=20,oy=H-25;
          const rr=r/100;
          const compound=Array.from({length:n+1},(_,i)=>P*Math.pow(1+rr,i));
          const simple=Array.from({length:n+1},(_,i)=>P*(1+rr*i));
          const maxV=compound[n];
          const scX=(W-40)/n, scY=(H-40)/maxV;
          const cpts=compound.map((v,i)=>`${ox+i*scX},${oy-v*scY}`).join(" ");
          const spts=simple.map((v,i)=>`${ox+i*scX},${oy-v*scY}`).join(" ");
          return `<svg width="${W}" height="${H+20}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+20}" fill="#020617" rx="8"/>
            <line x1="${ox}" y1="${oy}" x2="${W-10}" y2="${oy}" stroke="#334155" stroke-width="1"/>
            <line x1="${ox}" y1="10" x2="${ox}" y2="${oy}" stroke="#334155" stroke-width="1"/>
            <polyline points="${spts}" fill="none" stroke="${C[1]}" stroke-width="1.5" stroke-dasharray="5,3"/>
            <polyline points="${cpts}" fill="none" stroke="${C[0]}" stroke-width="2.5"/>
            <text x="8" y="16" fill="#e2e8f0" font-size="10" font-weight="700">$${P} @ ${r}% for ${n}yrs</text>
            <text x="8" y="30" fill="${C[0]}" font-size="9">Compound: $${compound[n].toFixed(0)}</text>
            <text x="8" y="44" fill="${C[1]}" font-size="9">Simple: $${simple[n].toFixed(0)}</text>
            <text x="8" y="58" fill="#64748b" font-size="9">Gain: $${(compound[n]-simple[n]).toFixed(0)}</text>
          </svg>`;
        }
      },
    ]
  },
  "ML / Info": {
    icon: "🤖",
    models: [
      { id:"ml_loss", label:"Gradient Descent", desc:"Loss curve and parameter update",
        params:[{key:"lr",label:"Learning Rate",val:3,min:1,max:9,step:1},{key:"steps",label:"Steps",val:30,min:5,max:80}],
        render:(p,C)=>{
          const {lr=3,steps=30}=p;
          const alpha=[0.3,0.1,0.03,0.5,0.8,0.15,0.25,0.4,0.05][Math.round(lr)-1]||0.1;
          const W=300,H=200,ox=20,oy=H-25;
          let theta=5, loss=(t)=>t*t;
          const history=[{t:theta,l:loss(theta)}];
          for(let i=0;i<steps-1;i++){theta=theta-alpha*2*theta;history.push({t:theta,l:loss(theta)});}
          const maxL=history[0].l;
          const scX=(W-40)/(steps-1), scY=(H-40)/maxL;
          const lpts=history.map((h,i)=>`${ox+i*scX},${oy-h.l*scY}`).join(" ");
          const tpts=history.map((h,i)=>`${ox+i*scX},${oy-Math.abs(h.t)*scY*maxL/5}`).join(" ");
          return `<svg width="${W}" height="${H+20}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${W}" height="${H+20}" fill="#020617" rx="8"/>
            <line x1="${ox}" y1="${oy}" x2="${W-10}" y2="${oy}" stroke="#334155" stroke-width="1"/>
            <polyline points="${lpts}" fill="none" stroke="${C[0]}" stroke-width="2.5"/>
            <polyline points="${tpts}" fill="none" stroke="${C[1]}" stroke-width="1.5" stroke-dasharray="4,3"/>
            <text x="8" y="16" fill="${C[0]}" font-size="10" font-weight="700">Loss: J(θ) = θ²</text>
            <text x="8" y="30" fill="${C[1]}" font-size="9">θ (parameter)</text>
            <text x="8" y="44" fill="#64748b" font-size="9">α=${alpha} | Final θ=${history[steps-1].t.toFixed(4)}</text>
            <text x="150" y="${H+12}" text-anchor="middle" fill="#475569" font-size="9">Steps →</text>
          </svg>`;
        }
      },
    ]
  },
};

// ═══ CHART SVG RENDERER (abbreviated, same as before) ════════
const DEFAULT_CHART_DATA = {
  bar:{data:[{name:"Q1",v:42},{name:"Q2",v:68},{name:"Q3",v:55},{name:"Q4",v:81}]},
  line:{data:[{name:"Jan",v:30},{name:"Feb",v:45},{name:"Mar",v:38},{name:"Apr",v:60},{name:"May",v:78}]},
  area:{data:[{name:"Jan",v:30},{name:"Feb",v:45},{name:"Mar",v:38},{name:"Apr",v:60},{name:"May",v:78}]},
  pie:{data:[{name:"A",v:35},{name:"B",v:25},{name:"C",v:20},{name:"D",v:20}]},
  donut:{data:[{name:"A",v:35},{name:"B",v:25},{name:"C",v:20},{name:"D",v:20}]},
  scatter:{data:[{x:10,y:20},{x:25,y:45},{x:40,y:30},{x:55,y:70},{x:70,y:55}]},
  gauge:{data:[{label:"Score",value:78,max:100,unit:"%"}]},
  table:{headers:["Item","Value","Change"],rows:[["Alpha","$1.2M","+12%"],["Beta","$0.8M","+5%"],["Gamma","$2.1M","+18%"]]},
  funnel:{data:[{label:"Awareness",v:1000},{label:"Interest",v:600},{label:"Decision",v:300},{label:"Action",v:100}]},
  radar:{labels:["Speed","Quality","Cost","UX","Support"],series:[{name:"Us",vals:[80,90,60,85,70]},{name:"Them",vals:[60,70,80,65,90]}]},
  grouped:{labels:["Q1","Q2","Q3"],series:[{name:"A",vals:[42,68,55]},{name:"B",vals:[30,50,45]}]},
};

function renderChartSVG(type,chartData,palette,w,h,textColor,bgColor){
  const C=PALETTES[palette]||PALETTES.blue, tc=textColor||"#1e293b", d=chartData||DEFAULT_CHART_DATA[type]||{};
  const wrap=(body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${bgColor||"#fff"}" rx="8"/>${body}</svg>`;
  try{
    if(type==="bar"){const rows=d.data||[];const pd={t:40,r:20,b:40,l:40};const cw=w-pd.l-pd.r,ch=h-pd.t-pd.b;const max=Math.max(...rows.map(r=>r.v||0))*1.2||1;const bw=cw/rows.length*0.6,gap=cw/rows.length*0.4;return wrap(`<line x1="${pd.l}" y1="${pd.t+ch}" x2="${pd.l+cw}" y2="${pd.t+ch}" stroke="${tc}" opacity="0.2"/>${rows.map((r,i)=>{const v=r.v||0,bh=Math.max((v/max)*ch,2),x=pd.l+i*(bw+gap)+gap/2,y=pd.t+ch-bh;return `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${C[i%C.length]}" rx="3"/><text x="${x+bw/2}" y="${y-5}" text-anchor="middle" fill="${tc}" font-size="${Math.max(9,w/60)}" font-weight="600">${v}</text><text x="${x+bw/2}" y="${pd.t+ch+14}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/65)}">${r.name||""}</text>`;}).join("")}`);}
    if(type==="line"||type==="area"){const rows=d.data||[];const pd={t:30,r:20,b:35,l:35};const cw=w-pd.l-pd.r,ch=h-pd.t-pd.b;const max=Math.max(...rows.map(r=>r.v||0))*1.2||1;const pts=rows.map((r,i)=>({x:pd.l+i*(cw/(rows.length-1||1)),y:pd.t+ch-((r.v||0)/max)*ch}));const path=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");const col=C[0];const aE=type==="area"?`<defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${col}" stop-opacity="0.35"/><stop offset="100%" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><path d="${path} L${pts[pts.length-1].x},${pd.t+ch} L${pts[0].x},${pd.t+ch}Z" fill="url(#ag)"/>`:"";return wrap(`${aE}<path d="${path}" fill="none" stroke="${col}" stroke-width="2.5"/>${pts.map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="4" fill="${col}" stroke="white" stroke-width="1.5"/><text x="${p.x}" y="${p.y-8}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/70)}">${rows[i].v||0}</text>`).join("")}${rows.map((r,i)=>`<text x="${pts[i].x}" y="${pd.t+ch+14}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/70)}">${r.name||""}</text>`).join("")}`);}
    if(type==="pie"||type==="donut"){const rows=d.data||[];const cx=w*0.38,cy=h/2,r=Math.min(w,h)*0.38,hole=type==="donut"?r*0.45:0;const total=rows.reduce((s,r)=>s+(r.v||0),0)||1;let ang=-Math.PI/2;return wrap(rows.map((row,i)=>{const v=row.v||0,sw=(v/total)*2*Math.PI,x1=cx+r*Math.cos(ang),y1=cy+r*Math.sin(ang),a2=ang+sw,x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2),lg=sw>Math.PI?1:0,mx=cx+((r+hole)/2)*Math.cos(ang+sw/2),my=cy+((r+hole)/2)*Math.sin(ang+sw/2);let path;if(type==="donut"){const ix1=cx+hole*Math.cos(ang),iy1=cy+hole*Math.sin(ang),ix2=cx+hole*Math.cos(a2),iy2=cy+hole*Math.sin(a2);path=`M${x1},${y1} A${r},${r} 0 ${lg} 1 ${x2},${y2} L${ix2},${iy2} A${hole},${hole} 0 ${lg} 0 ${ix1},${iy1}Z`;}else{path=`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${lg} 1 ${x2},${y2}Z`;}ang+=sw;const pct=Math.round((v/total)*100);return `<path d="${path}" fill="${C[i%C.length]}" stroke="white" stroke-width="1.5"/>${pct>6?`<text x="${mx}" y="${my+4}" text-anchor="middle" fill="white" font-size="${Math.max(9,w/55)}" font-weight="700">${pct}%</text>`:""}`;}).join("")+rows.map((row,i)=>`<rect x="${w*0.72}" y="${h*0.15+i*22}" width="12" height="12" fill="${C[i%C.length]}" rx="2"/><text x="${w*0.72+16}" y="${h*0.15+i*22+10}" fill="${tc}" font-size="${Math.max(9,w/65)}">${row.name||""}</text>`).join(""));}
    if(type==="scatter"){const rows=d.data||[];const pd={t:30,r:20,b:35,l:35};const cw=w-pd.l-pd.r,ch=h-pd.t-pd.b;const maxX=Math.max(...rows.map(r=>r.x))*1.1||1,maxY=Math.max(...rows.map(r=>r.y))*1.1||1;return wrap(`<line x1="${pd.l}" y1="${pd.t}" x2="${pd.l}" y2="${pd.t+ch}" stroke="${tc}" opacity="0.2"/><line x1="${pd.l}" y1="${pd.t+ch}" x2="${pd.l+cw}" y2="${pd.t+ch}" stroke="${tc}" opacity="0.2"/>${rows.map(r=>`<circle cx="${pd.l+(r.x/maxX)*cw}" cy="${pd.t+ch-(r.y/maxY)*ch}" r="5" fill="${C[0]}" fill-opacity="0.7" stroke="white" stroke-width="1.5"/>`).join("")}`);}
    if(type==="gauge"){const g=(d.data||[])[0]||{label:"Score",value:75,max:100,unit:"%"};const cx=w/2,cy=h*0.62,r=Math.min(w,h)*0.36,sw=22;const pct=Math.min((g.value||75)/(g.max||100),1);const sA=Math.PI,arcA=sA+pct*Math.PI;const x1=cx+r*Math.cos(sA),y1=cy+r*Math.sin(sA),x2=cx+r*Math.cos(arcA),y2=cy+r*Math.sin(arcA),x3=cx+r*Math.cos(2*Math.PI),y3=cy+r*Math.sin(2*Math.PI);return wrap(`<path d="M${x1},${y1} A${r},${r} 0 1 1 ${x3},${y3}" fill="none" stroke="#e2e8f0" stroke-width="${sw}" stroke-linecap="round"/><path d="M${x1},${y1} A${r},${r} 0 ${pct>0.5?1:0} 1 ${x2},${y2}" fill="none" stroke="${C[0]}" stroke-width="${sw}" stroke-linecap="round"/><text x="${cx}" y="${cy-8}" text-anchor="middle" fill="${tc}" font-size="${Math.max(18,w/18)}" font-weight="700">${g.value}${g.unit||""}</text><text x="${cx}" y="${cy+14}" text-anchor="middle" fill="${tc}" font-size="${Math.max(10,w/55)}" opacity="0.7">${g.label||""}</text>`);}
    if(type==="table"){const{headers=[],rows=[]}=d;const rh=Math.min(32,(h-50)/Math.max(rows.length+1,1));const cw_=(w-20)/Math.max(headers.length,1);return wrap(headers.map((h_,i)=>`<rect x="${10+i*cw_}" y="30" width="${cw_}" height="${rh}" fill="${C[0]}"/><text x="${10+i*cw_+cw_/2}" y="${30+rh*0.65}" text-anchor="middle" fill="white" font-size="${Math.max(9,w/70)}" font-weight="700">${h_}</text>`).join("")+rows.map((row,ri)=>row.map((cell,ci)=>`<rect x="${10+ci*cw_}" y="${30+rh+ri*rh}" width="${cw_}" height="${rh}" fill="${ri%2===0?"rgba(0,0,0,0.03)":"transparent"}" stroke="#e2e8f0" stroke-width="0.5"/><text x="${10+ci*cw_+cw_/2}" y="${30+rh+ri*rh+rh*0.65}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/75)}">${cell}</text>`).join("")).join(""));}
    if(type==="funnel"){const items=d.data||[];const total=items[0]?.v||1,rh=(h-30)/items.length;return wrap(items.map((item,i)=>{const pct=(item.v||0)/total,bw=pct*(w-60),x=(w-bw)/2,y=20+i*rh;return `<rect x="${x}" y="${y}" width="${bw}" height="${rh-4}" fill="${C[i%C.length]}" rx="3"/><text x="${w/2}" y="${y+rh/2+4}" text-anchor="middle" fill="white" font-size="${Math.max(9,w/65)}" font-weight="600">${item.label||""}: ${item.v||0}</text>`;}).join(""));}
    if(type==="radar"){const{labels=[],series=[]}=d;const n=labels.length||5,cx=w*0.45,cy=h/2,r=Math.min(w,h)*0.38;const angles=Array.from({length:n},(_,i)=>-Math.PI/2+i*(2*Math.PI/n));return wrap([0.25,0.5,0.75,1].map(s=>`<polygon points="${angles.map(a=>`${cx+r*s*Math.cos(a)},${cy+r*s*Math.sin(a)}`).join(" ")}" fill="none" stroke="#e2e8f0" stroke-width="1"/>`).join("")+angles.map(a=>`<line x1="${cx}" y1="${cy}" x2="${cx+r*Math.cos(a)}" y2="${cy+r*Math.sin(a)}" stroke="#e2e8f0" stroke-width="1"/>`).join("")+labels.map((l,i)=>`<text x="${cx+(r+18)*Math.cos(angles[i])}" y="${cy+(r+18)*Math.sin(angles[i])+4}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/70)}">${l}</text>`).join("")+series.map((s,si)=>{const max=Math.max(...s.vals)||1;return `<polygon points="${s.vals.map((v,i)=>`${cx+(v/max)*r*Math.cos(angles[i])},${cy+(v/max)*r*Math.sin(angles[i])}`).join(" ")}" fill="${C[si%C.length]}" fill-opacity="0.2" stroke="${C[si%C.length]}" stroke-width="2"/>`;}).join("")+series.map((s,i)=>`<rect x="${w*0.78}" y="${h*0.2+i*20}" width="10" height="10" fill="${C[i%C.length]}" rx="2"/><text x="${w*0.78+14}" y="${h*0.2+i*20+9}" fill="${tc}" font-size="${Math.max(8,w/75)}">${s.name||""}</text>`).join(""));}
    if(type==="grouped"){const{labels=[],series=[]}=d;const pd={t:40,r:15,b:35,l:35};const cw=w-pd.l-pd.r,ch=h-pd.t-pd.b;const max=Math.max(...series.flatMap(s=>s.vals||[]))*1.2||1;const gw=cw/Math.max(labels.length,1),bw=gw*0.65/Math.max(series.length,1);return wrap(series.map((s,i)=>`<rect x="${pd.l+i*80}" y="8" width="10" height="10" fill="${C[i%C.length]}" rx="2"/><text x="${pd.l+i*80+14}" y="17" fill="${tc}" font-size="${Math.max(8,w/75)}">${s.name||""}</text>`).join("")+`<line x1="${pd.l}" y1="${pd.t+ch}" x2="${pd.l+cw}" y2="${pd.t+ch}" stroke="${tc}" opacity="0.2"/>`+labels.map((lbl,gi)=>{const gx=pd.l+gi*gw+gw*0.175;return series.map((s,si)=>{const v=s.vals?.[gi]||0,bh=Math.max((v/max)*ch,2),x=gx+si*bw,y=pd.t+ch-bh;return `<rect x="${x}" y="${y}" width="${bw-1}" height="${bh}" fill="${C[si%C.length]}" rx="2"/>`;}).join("")+`<text x="${gx+bw*series.length/2}" y="${pd.t+ch+14}" text-anchor="middle" fill="${tc}" font-size="${Math.max(8,w/75)}">${lbl}</text>`;}).join(""));}
  }catch(e){}
  return wrap(`<text x="${w/2}" y="${h/2}" text-anchor="middle" fill="${tc}" font-size="14">⚠ Render error</text>`);
}

function renderShapeSVG(el,isSelected){
  const{w,h,fill="#3b82f6",stroke="#1d4ed8",strokeW=2,opacity=1,text="",fontSize=14,fontColor="#ffffff",fontBold=false,fontItalic=false,cornerRadius=4,rotation=0}=el;
  const sel=isSelected?`<rect x="-2" y="-2" width="${w+4}" height="${h+4}" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,3" rx="4"/>`:"";
  const handles=isSelected?[[0,0],[w/2,0],[w,0],[w,h/2],[w,h],[w/2,h],[0,h],[0,h/2]].map(([hx,hy])=>`<rect x="${hx-4}" y="${hy-4}" width="8" height="8" fill="white" stroke="#f59e0b" stroke-width="1.5" rx="1"/>`).join(""):"";
  const textEl=text?`<text x="${w/2}" y="${h/2}" dy="0.35em" text-anchor="middle" fill="${fontColor}" font-size="${fontSize}" font-weight="${fontBold?"700":"400"}" font-style="${fontItalic?"italic":"normal"}" font-family="system-ui,sans-serif">${text}</text>`:"";
  let shape="";
  if(el.type==="rect")shape=`<rect width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" rx="${cornerRadius}" opacity="${opacity}"/>`;
  else if(el.type==="circle")shape=`<ellipse cx="${w/2}" cy="${h/2}" rx="${w/2-strokeW/2}" ry="${h/2-strokeW/2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" opacity="${opacity}"/>`;
  else if(el.type==="diamond")shape=`<polygon points="${w/2},${strokeW} ${w-strokeW},${h/2} ${w/2},${h-strokeW} ${strokeW},${h/2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" opacity="${opacity}"/>`;
  else if(el.type==="triangle")shape=`<polygon points="${w/2},${strokeW} ${w-strokeW},${h-strokeW} ${strokeW},${h-strokeW}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" opacity="${opacity}"/>`;
  else if(el.type==="text")shape=`<rect width="${w}" height="${h}" rx="4" fill="${fill}" fill-opacity="0.08" stroke="${stroke}" stroke-width="${strokeW}" stroke-dasharray="4,3"/>`;
  else if(el.type==="line"||el.type==="dline")shape=`<line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="${stroke}" stroke-width="${Math.max(strokeW,2)}" opacity="${opacity}" ${el.type==="dline"?'stroke-dasharray="6,4"':""}/>`;
  else if(el.type==="rarrow")shape=`<line x1="0" y1="${h/2}" x2="${w-12}" y2="${h/2}" stroke="${stroke}" stroke-width="${Math.max(strokeW,2)}" opacity="${opacity}"/><polygon points="${w-12},${h/2-6} ${w},${h/2} ${w-12},${h/2+6}" fill="${stroke}" opacity="${opacity}"/>`;
  else{const pts=Array.from({length:el.type==="hexagon"?6:el.type==="pentagon"?5:el.type==="octagon"?8:4},(_,i)=>{const a=el.type==="hexagon"?i*Math.PI/3-Math.PI/6:-Math.PI/2+i*2*Math.PI/(el.type==="pentagon"?5:el.type==="octagon"?8:4);return `${w/2+(w/2-strokeW)*Math.cos(a)},${h/2+(h/2-strokeW)*Math.sin(a)}`;}).join(" ");shape=`<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" opacity="${opacity}"/>`;}
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" style="overflow:visible;${rotation?`transform:rotate(${rotation}deg);transform-origin:${w/2}px ${h/2}px;`:""}">
    ${shape}${textEl}${sel}${handles}</svg>`;
}

let idCnt=1;
const uid=()=>`el_${idCnt++}_${Math.random().toString(36).slice(2,6)}`;

// ═══ MATH MODEL PARAM EDITOR ══════════════════════════════════
function MathModelEditor({model,palette,onInsert,onClose}){
  const C=PALETTES[palette]||PALETTES.blue;
  const [params,setParams]=useState(()=>{const p={};(model.params||[]).forEach(pr=>{p[pr.key]=pr.val;});return p;});
  const upd=(k,v)=>setParams(prev=>({...prev,[k]:v}));
  const svgStr=model.render(params,C);
  const inp={background:"#0f172a",border:"1px solid #1e293b",color:"#e2e8f0",borderRadius:6,padding:"4px 7px",fontSize:"0.75rem",width:"100%",outline:"none",boxSizing:"border-box"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:14,width:580,maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #1e293b",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:800,color:"#e2e8f0",fontSize:"0.9rem"}}>{model.label}</div>
            <div style={{fontSize:"0.72rem",color:"#475569"}}>{model.desc}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:"1.3rem"}}>×</button>
        </div>
        <div style={{display:"flex",flex:1,overflow:"hidden"}}>
          {/* Controls */}
          <div style={{width:220,borderRight:"1px solid #1e293b",padding:14,overflowY:"auto",flexShrink:0}}>
            <div style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Parameters</div>
            {(model.params||[]).map(pr=>(
              <div key={pr.key} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <label style={{fontSize:"0.72rem",color:"#94a3b8"}}>{pr.label}</label>
                  <span style={{fontSize:"0.72rem",color:accent,fontWeight:700}}>{params[pr.key]}{pr.options?` (${pr.options[Math.round(params[pr.key])]||""})`:""}</span>
                </div>
                {pr.options?(
                  <div style={{display:"flex",flexDirection:"column",gap:3}}>
                    {pr.options.map((opt,i)=>(
                      <button key={i} onClick={()=>upd(pr.key,i)}
                        style={{padding:"4px 8px",borderRadius:5,border:`1px solid ${Math.round(params[pr.key])===i?accent:"#1e293b"}`,background:Math.round(params[pr.key])===i?`${accent}22`:"#020617",color:Math.round(params[pr.key])===i?accent:"#64748b",cursor:"pointer",fontSize:"0.7rem",textAlign:"left"}}>
                        {opt}
                      </button>
                    ))}
                  </div>
                ):(
                  <>
                    <input type="range" min={pr.min||0} max={pr.max||10} step={pr.step||1} value={params[pr.key]}
                      onChange={e=>upd(pr.key,+e.target.value)}
                      style={{width:"100%",accentColor:accent,marginBottom:3}}/>
                    <input type="number" value={params[pr.key]} onChange={e=>upd(pr.key,+e.target.value)} style={inp}/>
                  </>
                )}
              </div>
            ))}
          </div>
          {/* Preview */}
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#020617",padding:20}}>
            <div dangerouslySetInnerHTML={{__html:svgStr}} style={{borderRadius:10,overflow:"hidden",boxShadow:"0 4px 24px rgba(0,0,0,0.4)"}}/>
            <div style={{fontSize:"0.68rem",color:"#334155",marginTop:10}}>Live preview — sliders update instantly</div>
          </div>
        </div>
        <div style={{padding:"10px 16px",borderTop:"1px solid #1e293b",display:"flex",gap:8}}>
          <button onClick={()=>onInsert(model,params,svgStr)} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:`linear-gradient(135deg,${accent},#06b6d4)`,color:"white",fontWeight:700,cursor:"pointer",fontSize:"0.82rem"}}>
            ✓ Insert into Canvas
          </button>
          <button onClick={onClose} style={{padding:"9px 14px",borderRadius:8,border:"1px solid #1e293b",background:"transparent",color:"#64748b",cursor:"pointer",fontSize:"0.82rem"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ═══ CHART ROW EDITOR ════════════════════════════════════════
function ChartRowEditor({el,updateEl,onClose}){
  const upd=(k,v)=>updateEl(el.id,{[k]:v});
  const [tab,setTab]=useState("rows");
  const C=PALETTES[el.palette]||PALETTES.blue;
  const d=el.chartData||{};
  const inp={background:"#020617",border:"1px solid #1e293b",color:"#e2e8f0",borderRadius:5,padding:"4px 7px",fontSize:"0.75rem",outline:"none",boxSizing:"border-box"};

  const isSimple=["bar","line","area"].includes(el.chartType)&&Array.isArray(d.data);
  const isPie=["pie","donut"].includes(el.chartType)&&Array.isArray(d.data);
  const isTable=el.chartType==="table";
  const isGauge=el.chartType==="gauge";

  const updateRow=(i,key,val)=>{
    const nd={...d,data:d.data.map((r,ri)=>ri===i?{...r,[key]:key==="v"?+val:val}:r)};
    upd("chartData",nd);
  };
  const addRow=()=>{const nd={...d,data:[...(d.data||[]),{name:"New",v:50}]};upd("chartData",nd);};
  const delRow=(i)=>{const nd={...d,data:d.data.filter((_,ri)=>ri!==i)};upd("chartData",nd);};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:14,width:640,maxHeight:"85vh",display:"flex",flexDirection:"column",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid #1e293b",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontWeight:800,color:"#e2e8f0"}}>✏️ Edit: {el.title||el.chartType}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:"1.3rem"}}>×</button>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid #1e293b"}}>
          {["rows","style","size"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"8px",border:"none",background:"none",color:tab===t?accent:"#475569",fontSize:"0.75rem",fontWeight:tab===t?700:400,cursor:"pointer",borderBottom:tab===t?`2px solid ${accent}`:"2px solid transparent",textTransform:"capitalize"}}>
              {t==="rows"?"📋 Data":t==="style"?"🎨 Style":"📐 Size & Pos"}
            </button>
          ))}
        </div>
        <div style={{flex:1,overflow:"auto",padding:16}}>
          {tab==="rows"&&(
            <div>
              {/* Simple bar/line/area */}
              {isSimple&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <span style={{fontSize:"0.75rem",color:"#64748b"}}>Click any cell to edit</span>
                    <button onClick={addRow} style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${accent}`,background:`${accent}22`,color:accent,cursor:"pointer",fontSize:"0.75rem",fontWeight:700}}>+ Add Row</button>
                  </div>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr>
                      <th style={{padding:"6px",textAlign:"left",fontSize:"0.72rem",color:"#64748b",borderBottom:"1px solid #1e293b"}}>Label</th>
                      <th style={{padding:"6px",textAlign:"left",fontSize:"0.72rem",color:"#64748b",borderBottom:"1px solid #1e293b"}}>Value</th>
                      <th style={{padding:"6px",textAlign:"left",fontSize:"0.72rem",color:"#64748b",borderBottom:"1px solid #1e293b"}}>Color</th>
                      <th style={{padding:"6px",borderBottom:"1px solid #1e293b"}}></th>
                    </tr></thead>
                    <tbody>
                      {(d.data||[]).map((row,i)=>(
                        <tr key={i} style={{borderBottom:"1px solid #0f172a"}}>
                          <td style={{padding:"4px"}}><input value={row.name||""} onChange={e=>updateRow(i,"name",e.target.value)} style={{...inp,width:90}}/></td>
                          <td style={{padding:"4px"}}><input type="number" value={row.v||0} onChange={e=>updateRow(i,"v",e.target.value)} style={{...inp,width:70}}/></td>
                          <td style={{padding:"4px"}}>
                            <div style={{width:28,height:24,background:C[i%C.length],borderRadius:4,border:"1px solid #1e293b"}}/>
                          </td>
                          <td style={{padding:"4px"}}>
                            <button onClick={()=>delRow(i)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:"1rem"}}>×</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Pie/donut */}
              {isPie&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <span style={{fontSize:"0.75rem",color:"#64748b"}}>Slice data</span>
                    <button onClick={addRow} style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${accent}`,background:`${accent}22`,color:accent,cursor:"pointer",fontSize:"0.75rem",fontWeight:700}}>+ Add Slice</button>
                  </div>
                  {(d.data||[]).map((row,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,padding:"6px 8px",background:"#020617",borderRadius:6,border:"1px solid #1e293b"}}>
                      <div style={{width:16,height:16,background:C[i%C.length],borderRadius:3,flexShrink:0}}/>
                      <input value={row.name||""} onChange={e=>updateRow(i,"name",e.target.value)} style={{...inp,flex:1}} placeholder="Label"/>
                      <input type="number" value={row.v||0} onChange={e=>updateRow(i,"v",e.target.value)} style={{...inp,width:70}} placeholder="Value"/>
                      <button onClick={()=>delRow(i)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer"}}>×</button>
                    </div>
                  ))}
                </div>
              )}
              {/* Gauge */}
              {isGauge&&(
                <div>
                  {(d.data||[{label:"Score",value:75,max:100,unit:"%"}]).map((g,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {[["Label","label",g.label],["Value","value",g.value],["Max","max",g.max],["Unit","unit",g.unit]].map(([lbl,k,val])=>(
                        <div key={k}>
                          <label style={{fontSize:"0.72rem",color:"#94a3b8",display:"block",marginBottom:3}}>{lbl}</label>
                          <input value={val||""} onChange={e=>{const nd={...d,data:[{...g,[k]:k==="value"||k==="max"?+e.target.value:e.target.value}]};upd("chartData",nd);}} style={inp}/>
                        </div>
                      ))}
                      <div style={{gridColumn:"1/-1"}}>
                        <label style={{fontSize:"0.72rem",color:"#94a3b8",display:"block",marginBottom:3}}>Value: {g.value} / {g.max}</label>
                        <input type="range" min={0} max={g.max||100} value={g.value||0} onChange={e=>{const nd={...d,data:[{...g,value:+e.target.value}]};upd("chartData",nd);}} style={{width:"100%",accentColor:accent}}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Table */}
              {isTable&&(
                <div>
                  <div style={{fontSize:"0.73rem",color:"#64748b",marginBottom:8}}>Headers (comma separated)</div>
                  <input value={(d.headers||[]).join(",")} onChange={e=>{upd("chartData",{...d,headers:e.target.value.split(",")});}} style={{...inp,marginBottom:12,width:"100%"}}/>
                  <div style={{fontSize:"0.73rem",color:"#64748b",marginBottom:6}}>Rows (one per line, values comma separated)</div>
                  <textarea value={(d.rows||[]).map(r=>r.join(",")).join("\n")} onChange={e=>{const rows=e.target.value.split("\n").map(l=>l.split(",").map(v=>v.trim())).filter(r=>r.length>0);upd("chartData",{...d,rows});}} style={{...inp,width:"100%",minHeight:120,resize:"vertical",fontFamily:"monospace"}}/>
                </div>
              )}
              {/* Fallback JSON */}
              {!isSimple&&!isPie&&!isTable&&!isGauge&&(
                <div>
                  <div style={{fontSize:"0.73rem",color:"#64748b",marginBottom:8}}>JSON Data Editor</div>
                  <textarea value={JSON.stringify(el.chartData,null,2)} onChange={e=>{try{upd("chartData",JSON.parse(e.target.value));}catch{}}} style={{...inp,width:"100%",minHeight:200,resize:"vertical",fontFamily:"monospace"}}/>
                </div>
              )}
              {/* Live preview */}
              <div style={{marginTop:16,borderTop:"1px solid #1e293b",paddingTop:12}}>
                <div style={{fontSize:"0.7rem",color:"#64748b",marginBottom:6}}>Live Preview</div>
                <div dangerouslySetInnerHTML={{__html:renderChartSVG(el.chartType,el.chartData,el.palette,340,180,el.textColor,el.bgColor)}} style={{borderRadius:8,overflow:"hidden"}}/>
              </div>
            </div>
          )}
          {tab==="style"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div>
                <label style={{fontSize:"0.72rem",color:"#94a3b8",display:"block",marginBottom:6}}>Color Palette</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {Object.entries(PALETTES).map(([k,cols])=>(
                    <button key={k} onClick={()=>upd("palette",k)} title={k}
                      style={{display:"flex",gap:1,borderRadius:6,overflow:"hidden",border:el.palette===k?`2px solid ${accent}`:"2px solid transparent",cursor:"pointer",padding:0,background:"none"}}>
                      {cols.slice(0,5).map((c,i)=><span key={i} style={{width:14,height:24,background:c,display:"block"}}/>)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:12}}>
                <label style={{fontSize:"0.72rem",color:"#94a3b8",display:"flex",flexDirection:"column",gap:4}}>Text Color<input type="color" value={el.textColor||"#1e293b"} onChange={e=>upd("textColor",e.target.value)} style={{width:44,height:34,border:"1px solid #1e293b",borderRadius:6,cursor:"pointer",padding:2,background:"none"}}/></label>
                <label style={{fontSize:"0.72rem",color:"#94a3b8",display:"flex",flexDirection:"column",gap:4}}>Background<input type="color" value={el.bgColor||"#ffffff"} onChange={e=>upd("bgColor",e.target.value)} style={{width:44,height:34,border:"1px solid #1e293b",borderRadius:6,cursor:"pointer",padding:2,background:"none"}}/></label>
              </div>
              <div><label style={{fontSize:"0.72rem",color:"#94a3b8",display:"block",marginBottom:4}}>Title</label><input value={el.title||""} onChange={e=>upd("title",e.target.value)} style={{...inp,width:"100%"}}/></div>
              <div style={{marginTop:8}}><div style={{fontSize:"0.7rem",color:"#64748b",marginBottom:6}}>Preview</div><div dangerouslySetInnerHTML={{__html:renderChartSVG(el.chartType,el.chartData,el.palette,340,190,el.textColor,el.bgColor)}} style={{borderRadius:8,overflow:"hidden"}}/></div>
            </div>
          )}
          {tab==="size"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[["X","x"],["Y","y"],["Width","w"],["Height","h"]].map(([lbl,k])=>(
                <div key={k}>
                  <label style={{fontSize:"0.72rem",color:"#94a3b8",display:"block",marginBottom:4}}>{lbl}</label>
                  <input type="number" value={Math.round(el[k])} onChange={e=>upd(k,+e.target.value)} style={{...inp,width:"100%"}}/>
                </div>
              ))}
              <div style={{gridColumn:"1/-1",marginTop:8}}>
                <label style={{fontSize:"0.72rem",color:"#94a3b8",display:"block",marginBottom:6}}>Change Chart Type</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
                  {Object.keys(DEFAULT_CHART_DATA).map(ct=>(
                    <button key={ct} onClick={()=>{upd("chartType",ct);upd("chartData",JSON.parse(JSON.stringify(DEFAULT_CHART_DATA[ct]||{})));upd("title",ct);}}
                      style={{padding:"5px",borderRadius:5,border:`1px solid ${el.chartType===ct?accent:"#1e293b"}`,background:el.chartType===ct?`${accent}22`:"transparent",color:el.chartType===ct?accent:"#64748b",cursor:"pointer",fontSize:"0.68rem"}}>
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{padding:"10px 16px",borderTop:"1px solid #1e293b",display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:"8px",borderRadius:7,border:`1px solid ${accent}`,background:`${accent}22`,color:accent,cursor:"pointer",fontSize:"0.8rem",fontWeight:700}}>✓ Done</button>
        </div>
      </div>
    </div>
  );
}

// ═══ MAIN ════════════════════════════════════════════════════
export default function DiagramStudio(){
  const [elements,setElements]=useState([]);
  const [selected,setSelected]=useState(null);
  const [zoom,setZoom]=useState(1);
  const [pan,setPan]=useState({x:0,y:0});
  const [canvasBg,setCanvasBg]=useState("#1e293b");
  const [gridVisible,setGridVisible]=useState(true);
  const canvasRef=useRef(null);
  const dragState=useRef(null);
  const panState=useRef(null);

  const [leftTab,setLeftTab]=useState("shapes");
  const [mathSection,setMathSection]=useState("Geometry");
  const [activeMathModel,setActiveMathModel]=useState(null);
  const [editingChart,setEditingChart]=useState(null);
  const [palette,setPalette]=useState("blue");

  const [aiMessages,setAiMessages]=useState([{role:"assistant",content:"👋 Hi! Describe what you want to create. Try: 'Bar chart of monthly revenue' or 'Flowchart with 5 steps' or 'Add a title box at the top'."}]);
  const [aiInput,setAiInput]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const [saveMsg,setSaveMsg]=useState("");
  const chatEndRef=useRef(null);

  const selectedEl=elements.find(e=>e.id===selected)||null;
  const inp={background:"#0f172a",border:"1px solid #1e293b",color:"#e2e8f0",borderRadius:6,padding:"5px 8px",fontSize:"0.76rem",width:"100%",outline:"none",boxSizing:"border-box"};

  const updateEl=useCallback((id,patch)=>setElements(els=>els.map(e=>e.id===id?{...e,...patch}:e)),[]);
  const addElement=useCallback((el)=>{const n={id:uid(),x:60+Math.random()*200,y:60+Math.random()*100,w:200,h:130,...el};setElements(els=>[...els,n]);setSelected(n.id);return n;},[]);
  const deleteSelected=useCallback(()=>{if(!selected)return;setElements(els=>els.filter(e=>e.id!==selected));setSelected(null);},[selected]);
  const duplicateSelected=useCallback(()=>{if(!selectedEl)return;const c={...selectedEl,id:uid(),x:selectedEl.x+20,y:selectedEl.y+20};setElements(els=>[...els,c]);setSelected(c.id);},[selectedEl]);

  const onCanvasMouseDown=useCallback((e)=>{
    if(e.button===1||(e.button===0&&e.altKey)){panState.current={startX:e.clientX-pan.x,startY:e.clientY-pan.y};return;}
    if(e.target===canvasRef.current||e.target.closest("[data-canvas-bg]"))setSelected(null);
  },[pan]);

  const onElMouseDown=useCallback((e,elId)=>{
    e.stopPropagation();setSelected(elId);
    const el=elements.find(el_=>el_.id===elId);if(!el)return;
    const rect=canvasRef.current.getBoundingClientRect();
    dragState.current={id:elId,startElX:el.x,startElY:el.y,startMouseX:(e.clientX-rect.left)/zoom,startMouseY:(e.clientY-rect.top)/zoom};
  },[elements,zoom]);

  const onMouseMove=useCallback((e)=>{
    if(panState.current){setPan({x:e.clientX-panState.current.startX,y:e.clientY-panState.current.startY});return;}
    if(!dragState.current)return;
    const rect=canvasRef.current?.getBoundingClientRect();if(!rect)return;
    const mx=(e.clientX-rect.left)/zoom,my=(e.clientY-rect.top)/zoom;
    updateEl(dragState.current.id,{x:Math.max(0,dragState.current.startElX+mx-dragState.current.startMouseX),y:Math.max(0,dragState.current.startElY+my-dragState.current.startMouseY)});
  },[zoom,updateEl]);

  const onMouseUp=useCallback(()=>{dragState.current=null;panState.current=null;},[]);

  useEffect(()=>{window.addEventListener("mousemove",onMouseMove);window.addEventListener("mouseup",onMouseUp);return()=>{window.removeEventListener("mousemove",onMouseMove);window.removeEventListener("mouseup",onMouseUp);};},[onMouseMove,onMouseUp]);
  useEffect(()=>{const onKey=(e)=>{if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")return;if(e.key==="Delete"||e.key==="Backspace")deleteSelected();if(e.key==="d"&&e.ctrlKey){e.preventDefault();duplicateSelected();}if(e.key==="Escape")setSelected(null);if(e.key==="="&&e.ctrlKey){e.preventDefault();setZoom(z=>Math.min(z+0.1,3));}if(e.key==="-"&&e.ctrlKey){e.preventDefault();setZoom(z=>Math.max(z-0.1,0.2));}};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);},[deleteSelected,duplicateSelected]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[aiMessages]);

  const addShape=(type)=>{
    const isLine=["line","dline","rarrow","darrow"].includes(type);
    addElement({type,fill:isLine?"none":type==="text"?"transparent":"#3b82f6",stroke:isLine?"#94a3b8":type==="text"?"#94a3b8":"#1d4ed8",strokeW:isLine?2:type==="text"?1:2,text:type==="text"?"Text Box":"",fontSize:14,fontColor:type==="text"?"#1e293b":"#ffffff",opacity:1,cornerRadius:4,rotation:0,w:isLine?200:type==="text"?200:150,h:isLine?4:type==="text"?60:90});
  };
  const addChart=(chartType)=>{addElement({type:"chart",chartType,chartData:JSON.parse(JSON.stringify(DEFAULT_CHART_DATA[chartType]||{})),palette:"blue",textColor:"#1e293b",bgColor:"#ffffff",title:chartType,w:360,h:240});};
  const insertMathModel=(model,params,svgStr)=>{
    // Store as a "mathmodel" element with embedded SVG
    addElement({type:"mathmodel",modelId:model.id,modelLabel:model.label,params,palette,svgStr,w:300,h:230});
    setActiveMathModel(null);
  };

  // AI
  const handleAI=async()=>{
    if(!aiInput.trim()||aiLoading)return;
    const userMsg=aiInput.trim();setAiInput("");
    setAiMessages(m=>[...m,{role:"user",content:userMsg}]);setAiLoading(true);
    const ctx=elements.length>0?`Canvas has ${elements.length} elements: ${elements.slice(0,6).map(e=>`${e.type}${e.type==="chart"?`(${e.chartType})`:""} at (${Math.round(e.x)},${Math.round(e.y)})`).join("; ")}.`:"Canvas is empty.";
    const sys=`You are a diagram-building AI. ${ctx} When the user asks to create/add diagrams, respond ONLY with valid JSON (no markdown):
{"action":"add"|"message","reply":"friendly description","elements":[...]}
For elements use: type ("rect"|"circle"|"diamond"|"triangle"|"text"|"line"|"rarrow"|"chart"), x, y, w, h, fill, stroke, strokeW, text, fontSize, fontColor, opacity, cornerRadius.
For chart type also: chartType ("bar"|"line"|"area"|"pie"|"donut"|"scatter"|"gauge"|"table"|"funnel"|"radar"), chartData (matching structure), palette, textColor, bgColor, title.
For message action just return {"action":"message","reply":"..."}.`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[...aiMessages.filter(m=>m.role!=="assistant"||aiMessages.indexOf(m)>0).slice(-6).map(m=>({role:m.role,content:m.content})),{role:"user",content:userMsg}]})});
      const data=await res.json();
      const raw=data.content?.find(c=>c.type==="text")?.text||"{}";
      let result;try{result=JSON.parse(raw.replace(/```json|```/g,"").trim());}catch{result={action:"message",reply:"I had trouble understanding that. Try again?"};}
      if(result.action==="add"&&Array.isArray(result.elements)&&result.elements.length>0){
        const newEls=result.elements.map(e=>({id:uid(),x:e.x||100,y:e.y||100,w:e.w||200,h:e.h||120,type:e.type||"rect",fill:e.fill||"#3b82f6",stroke:e.stroke||"#1d4ed8",strokeW:e.strokeW||2,text:e.text||"",fontSize:e.fontSize||14,fontColor:e.fontColor||"#ffffff",opacity:e.opacity||1,cornerRadius:e.cornerRadius||4,rotation:0,...(e.type==="chart"?{chartType:e.chartType||"bar",chartData:e.chartData||DEFAULT_CHART_DATA[e.chartType||"bar"]||DEFAULT_CHART_DATA.bar,palette:e.palette||"blue",textColor:e.textColor||"#1e293b",bgColor:e.bgColor||"#ffffff",title:e.title||e.chartType}:{})}));
        setElements(prev=>[...prev,...newEls]);
      }
      setAiMessages(m=>[...m,{role:"assistant",content:result.reply||"Done!"}]);
    }catch(e){setAiMessages(m=>[...m,{role:"assistant",content:"Sorry, error occurred. Please try again."}]);}
    setAiLoading(false);
  };

  const exportSVG=()=>{
    const parts=elements.map(el=>{
      if(el.type==="chart"){const s=renderChartSVG(el.chartType,el.chartData,el.palette,el.w,el.h,el.textColor,el.bgColor);return `<g transform="translate(${el.x},${el.y})">${s.replace(/<svg[^>]*>/,"").replace(/<\/svg>/,"")}</g>`;}
      if(el.type==="mathmodel"){return `<g transform="translate(${el.x},${el.y})">${(el.svgStr||"").replace(/<svg[^>]*>/,"").replace(/<\/svg>/,"")}</g>`;}
      const s=renderShapeSVG(el,false);return `<g transform="translate(${el.x},${el.y})">${s.replace(/<svg[^>]*>/,"").replace(/<\/svg>/,"")}</g>`;
    });
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900"><rect width="1400" height="900" fill="${canvasBg}"/>${parts.join("")}</svg>`;
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"}));a.download="diagram.svg";a.click();
  };
  const addToReport=()=>{
    const parts=elements.map(el=>{if(el.type==="chart"){const s=renderChartSVG(el.chartType,el.chartData,el.palette,el.w,el.h,el.textColor,el.bgColor);return `<g transform="translate(${el.x},${el.y})">${s.replace(/<svg[^>]*>/,"").replace(/<\/svg>/,"")}</g>`;}if(el.type==="mathmodel")return `<g transform="translate(${el.x},${el.y})">${(el.svgStr||"").replace(/<svg[^>]*>/,"").replace(/<\/svg>/,"")}</g>`;const s=renderShapeSVG(el,false);return `<g transform="translate(${el.x},${el.y})">${s.replace(/<svg[^>]*>/,"").replace(/<\/svg>/,"")}</g>`;});
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900"><rect width="1400" height="900" fill="${canvasBg}"/>${parts.join("")}</svg>`;
    const saved=JSON.parse(localStorage.getItem("rb_diagrams")||"[]");
    saved.push({svg,title:"Canvas Diagram",type:"canvas",createdAt:Date.now()});
    localStorage.setItem("rb_diagrams",JSON.stringify(saved));
    setSaveMsg("✓ Added!"); setTimeout(()=>setSaveMsg(""),2000);
  };

  // Props panel
  const PropsPanel=()=>{
    if(!selectedEl)return(<div style={{color:"#334155",fontSize:"0.78rem",textAlign:"center",padding:"30px 12px"}}>
      <div style={{fontSize:"1.5rem",marginBottom:8}}>☝️</div>Select an element<br/>
      <span style={{fontSize:"0.7rem",color:"#1e293b"}}>Double-click chart to edit</span>
    </div>);
    const el=selectedEl,upd=(k,v)=>updateEl(el.id,{[k]:v});
    if(el.type==="chart")return(<div style={{padding:12}}>
      <div style={{fontWeight:700,color:"#e2e8f0",marginBottom:8,fontSize:"0.82rem"}}>📊 {el.title||el.chartType}</div>
      <button onClick={()=>setEditingChart(el.id)} style={{width:"100%",padding:"9px",borderRadius:7,border:`1px solid ${accent}`,background:`${accent}22`,color:accent,cursor:"pointer",fontSize:"0.8rem",fontWeight:700,marginBottom:8}}>✏️ Open Editor</button>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        {[["X","x"],["Y","y"],["W","w"],["H","h"]].map(([l,k])=>(<div key={k}><label style={{fontSize:"0.68rem",color:"#94a3b8",display:"block",marginBottom:2}}>{l}</label><input type="number" value={Math.round(el[k])} onChange={e=>upd(k,+e.target.value)} style={inp}/></div>))}
      </div>
      <div style={{display:"flex",gap:6,marginTop:8}}>
        <button onClick={duplicateSelected} style={{flex:1,padding:"5px",borderRadius:5,border:"1px solid #1e293b",background:"transparent",color:"#64748b",cursor:"pointer",fontSize:"0.72rem"}}>⧉</button>
        <button onClick={deleteSelected} style={{flex:1,padding:"5px",borderRadius:5,border:"1px solid #7f1d1d",background:"transparent",color:"#ef4444",cursor:"pointer",fontSize:"0.72rem"}}>✕</button>
      </div>
    </div>);
    if(el.type==="mathmodel")return(<div style={{padding:12}}>
      <div style={{fontWeight:700,color:"#e2e8f0",marginBottom:8,fontSize:"0.82rem"}}>∫ {el.modelLabel}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
        {[["X","x"],["Y","y"],["W","w"],["H","h"]].map(([l,k])=>(<div key={k}><label style={{fontSize:"0.68rem",color:"#94a3b8",display:"block",marginBottom:2}}>{l}</label><input type="number" value={Math.round(el[k])} onChange={e=>upd(k,+e.target.value)} style={inp}/></div>))}
      </div>
      <div style={{fontSize:"0.7rem",color:"#475569",marginBottom:8,padding:"6px 8px",background:"rgba(99,102,241,0.08)",borderRadius:6}}>Math model — to re-edit params, re-insert from Math tab</div>
      <div style={{display:"flex",gap:6}}>
        <button onClick={duplicateSelected} style={{flex:1,padding:"5px",borderRadius:5,border:"1px solid #1e293b",background:"transparent",color:"#64748b",cursor:"pointer",fontSize:"0.72rem"}}>⧉</button>
        <button onClick={deleteSelected} style={{flex:1,padding:"5px",borderRadius:5,border:"1px solid #7f1d1d",background:"transparent",color:"#ef4444",cursor:"pointer",fontSize:"0.72rem"}}>✕</button>
      </div>
    </div>);
    const isLine=["line","dline","rarrow","darrow"].includes(el.type);
    return(<div style={{padding:12,overflowY:"auto",height:"100%"}}>
      <div style={{fontWeight:700,color:"#e2e8f0",marginBottom:8,fontSize:"0.82rem",textTransform:"capitalize"}}>{el.type}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:8}}>
        {[["X","x"],["Y","y"],["W","w"],["H","h"]].map(([l,k])=>(<div key={k}><label style={{fontSize:"0.68rem",color:"#94a3b8",display:"block",marginBottom:2}}>{l}</label><input type="number" value={Math.round(el[k])} onChange={e=>upd(k,+e.target.value)} style={inp}/></div>))}
      </div>
      {!isLine&&<><div style={{display:"flex",gap:8,marginBottom:7}}>
        <label style={{fontSize:"0.68rem",color:"#94a3b8",display:"flex",flexDirection:"column",gap:3}}>Fill<input type="color" value={el.fill||"#3b82f6"} onChange={e=>upd("fill",e.target.value)} style={{width:32,height:26,border:"1px solid #1e293b",borderRadius:4,cursor:"pointer",padding:1,background:"none"}}/></label>
        <label style={{fontSize:"0.68rem",color:"#94a3b8",display:"flex",flexDirection:"column",gap:3}}>Stroke<input type="color" value={el.stroke||"#1d4ed8"} onChange={e=>upd("stroke",e.target.value)} style={{width:32,height:26,border:"1px solid #1e293b",borderRadius:4,cursor:"pointer",padding:1,background:"none"}}/></label>
        <div style={{flex:1}}><label style={{fontSize:"0.68rem",color:"#94a3b8",display:"block",marginBottom:2}}>Bdr</label><input type="number" value={el.strokeW||1} onChange={e=>upd("strokeW",+e.target.value)} style={inp} min={0} max={20}/></div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}>
        <input type="range" min={0} max={1} step={0.05} value={el.opacity||1} onChange={e=>upd("opacity",+e.target.value)} style={{flex:1,accentColor:accent}}/>
        <span style={{fontSize:"0.68rem",color:"#64748b",width:28}}>{Math.round((el.opacity||1)*100)}%</span>
      </div></>}
      {isLine&&<div style={{display:"flex",gap:8,marginBottom:7}}>
        <label style={{fontSize:"0.68rem",color:"#94a3b8",display:"flex",flexDirection:"column",gap:3}}>Color<input type="color" value={el.stroke||"#94a3b8"} onChange={e=>upd("stroke",e.target.value)} style={{width:32,height:26,border:"1px solid #1e293b",borderRadius:4,cursor:"pointer",padding:1,background:"none"}}/></label>
        <div style={{flex:1}}><label style={{fontSize:"0.68rem",color:"#94a3b8",display:"block",marginBottom:2}}>Thick</label><input type="number" value={el.strokeW||2} onChange={e=>upd("strokeW",+e.target.value)} style={inp} min={1} max={20}/></div>
      </div>}
      {!isLine&&<><textarea value={el.text||""} onChange={e=>upd("text",e.target.value)} rows={2} style={{...inp,resize:"vertical",marginBottom:7}} placeholder="Label..."/>
      <div style={{display:"flex",gap:7,marginBottom:7}}>
        <label style={{fontSize:"0.68rem",color:"#94a3b8",display:"flex",flexDirection:"column",gap:3}}>Txt<input type="color" value={el.fontColor||"#ffffff"} onChange={e=>upd("fontColor",e.target.value)} style={{width:32,height:26,border:"1px solid #1e293b",borderRadius:4,cursor:"pointer",padding:1,background:"none"}}/></label>
        <div style={{flex:1}}><label style={{fontSize:"0.68rem",color:"#94a3b8",display:"block",marginBottom:2}}>Size</label><input type="number" value={el.fontSize||14} onChange={e=>upd("fontSize",+e.target.value)} style={inp} min={8} max={72}/></div>
      </div></>}
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
        <input type="range" min={-180} max={180} value={el.rotation||0} onChange={e=>upd("rotation",+e.target.value)} style={{flex:1,accentColor:accent}}/>
        <span style={{fontSize:"0.68rem",color:"#64748b",width:30}}>{el.rotation||0}°</span>
      </div>
      <div style={{display:"flex",gap:5}}>
        <button onClick={duplicateSelected} style={{flex:1,padding:"5px",borderRadius:5,border:"1px solid #1e293b",background:"transparent",color:"#64748b",cursor:"pointer",fontSize:"0.72rem"}}>⧉</button>
        <button onClick={deleteSelected} style={{flex:1,padding:"5px",borderRadius:5,border:"1px solid #7f1d1d",background:"transparent",color:"#ef4444",cursor:"pointer",fontSize:"0.72rem"}}>✕ Del</button>
      </div>
    </div>);
  };

  const SHAPES=[["rect","Rect"],["circle","Circle"],["diamond","Diamond"],["triangle","Tri"],["hexagon","Hex"],["pentagon","Penta"],["text","Text"],["line","Line"],["dline","Dash"],["rarrow","Arrow"],["darrow","D.Arrow"]];
  const CHARTS=Object.keys(DEFAULT_CHART_DATA);

  return(
    <div style={{display:"flex",height:"100vh",background:"#020617",color:"#e2e8f0",fontFamily:'"DM Sans",system-ui,sans-serif',overflow:"hidden",userSelect:"none",fontSize:"0.82rem"}}>

      {activeMathModel&&<MathModelEditor model={activeMathModel} palette={palette} onInsert={insertMathModel} onClose={()=>setActiveMathModel(null)}/>}
      {editingChart&&<ChartRowEditor el={elements.find(e=>e.id===editingChart)} updateEl={updateEl} onClose={()=>setEditingChart(null)}/>}

      {/* LEFT */}
      <div style={{width:230,flexShrink:0,borderRight:"1px solid #1e293b",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"10px 12px",borderBottom:"1px solid #1e293b"}}>
          <span style={{fontWeight:800,fontSize:"0.95rem",background:`linear-gradient(135deg,${accent},#06b6d4)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Diagram Studio</span>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid #1e293b",flexShrink:0}}>
          {[["shapes","Shapes"],["charts","Charts"],["math","Math"],["ai","✨ AI"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setLeftTab(id)} style={{flex:1,padding:"7px 2px",border:"none",background:"none",color:leftTab===id?accent:"#475569",fontSize:"0.65rem",fontWeight:leftTab===id?700:500,cursor:"pointer",borderBottom:leftTab===id?`2px solid ${accent}`:"2px solid transparent"}}>{lbl}</button>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:8}}>

          {leftTab==="shapes"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:10}}>
                {SHAPES.map(([t,lbl])=>(<button key={t} onClick={()=>addShape(t)}
                  style={{padding:"7px 2px",borderRadius:6,border:"1px solid #1e293b",background:"#0f172a",color:"#94a3b8",cursor:"pointer",fontSize:"0.67rem",transition:"all .12s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.color="#e2e8f0";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e293b";e.currentTarget.style.color="#94a3b8";}}>{lbl}</button>))}
              </div>
              <div style={{borderTop:"1px solid #1e293b",paddingTop:8}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                  <span style={{fontSize:"0.72rem",color:"#64748b",flex:1}}>Canvas BG</span>
                  <input type="color" value={canvasBg} onChange={e=>setCanvasBg(e.target.value)} style={{width:28,height:22,border:"1px solid #1e293b",borderRadius:4,cursor:"pointer",padding:1,background:"none"}}/>
                </div>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={()=>setGridVisible(v=>!v)} style={{flex:1,padding:"5px",borderRadius:5,border:`1px solid ${gridVisible?accent:"#1e293b"}`,background:gridVisible?`${accent}22`:"transparent",color:gridVisible?accent:"#64748b",cursor:"pointer",fontSize:"0.67rem"}}>Grid</button>
                  <button onClick={()=>{setElements([]);setSelected(null);}} style={{flex:1,padding:"5px",borderRadius:5,border:"1px solid #7f1d1d",background:"transparent",color:"#ef4444",cursor:"pointer",fontSize:"0.67rem"}}>Clear</button>
                </div>
              </div>
            </div>
          )}

          {leftTab==="charts"&&(
            <div>
              <div style={{fontSize:"0.65rem",color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Click to add · Dbl-click to edit</div>
              {CHARTS.map(t=>(<button key={t} onClick={()=>addChart(t)}
                style={{width:"100%",padding:"7px 10px",borderRadius:6,border:"1px solid #1e293b",background:"#0f172a",color:"#94a3b8",cursor:"pointer",fontSize:"0.72rem",display:"flex",alignItems:"center",gap:8,marginBottom:3,textAlign:"left",transition:"all .12s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.color="#e2e8f0";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e293b";e.currentTarget.style.color="#94a3b8";}}>
                📊 {t}
              </button>))}
            </div>
          )}

          {leftTab==="math"&&(
            <div>
              <div style={{fontSize:"0.65rem",color:"#64748b",marginBottom:6}}>Interactive math models — click to configure & insert</div>
              <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:8}}>
                {Object.entries(MATH_MODELS).map(([k,v])=>(
                  <button key={k} onClick={()=>setMathSection(k)}
                    style={{padding:"3px 6px",borderRadius:5,border:`1px solid ${mathSection===k?accent:"#1e293b"}`,background:mathSection===k?`${accent}22`:"transparent",color:mathSection===k?accent:"#64748b",cursor:"pointer",fontSize:"0.64rem",fontWeight:mathSection===k?700:400}}>
                    {v.icon} {k}
                  </button>
                ))}
              </div>
              <div style={{fontSize:"0.68rem",color:"#475569",marginBottom:6}}>
                {MATH_MODELS[mathSection]?.models.length} models in {mathSection}
              </div>
              {MATH_MODELS[mathSection]?.models.map(m=>(
                <button key={m.id} onClick={()=>setActiveMathModel(m)}
                  style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #1e293b",background:"#0f172a",cursor:"pointer",textAlign:"left",marginBottom:4,transition:"all .12s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.background=`${accent}11`;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e293b";e.currentTarget.style.background="#0f172a";}}>
                  <div style={{fontWeight:700,color:"#e2e8f0",fontSize:"0.73rem",marginBottom:2}}>{m.label}</div>
                  <div style={{color:"#475569",fontSize:"0.67rem"}}>{m.desc}</div>
                </button>
              ))}
            </div>
          )}

          {leftTab==="ai"&&(
            <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 110px)"}}>
              <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:5,marginBottom:8}}>
                {aiMessages.map((msg,i)=>(
                  <div key={i} style={{padding:"7px 9px",borderRadius:8,background:msg.role==="user"?`${accent}22`:"rgba(255,255,255,0.04)",border:`1px solid ${msg.role==="user"?`${accent}44`:"#1e293b"}`,fontSize:"0.72rem",color:msg.role==="user"?"#a5b4fc":"#cbd5e1",lineHeight:1.5,alignSelf:msg.role==="user"?"flex-end":"flex-start",maxWidth:"92%"}}>
                    {msg.content}
                  </div>
                ))}
                {aiLoading&&<div style={{padding:"7px 9px",borderRadius:8,background:"rgba(255,255,255,0.04)",border:"1px solid #1e293b",fontSize:"0.72rem",color:"#475569"}}>● Thinking...</div>}
                <div ref={chatEndRef}/>
              </div>
              <div style={{flexShrink:0}}>
                <textarea value={aiInput} onChange={e=>setAiInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleAI();}}}
                  placeholder="Describe what to add..." rows={3}
                  style={{...inp,resize:"none",lineHeight:1.5,marginBottom:5}}/>
                <button onClick={handleAI} disabled={aiLoading||!aiInput.trim()}
                  style={{width:"100%",padding:"8px",borderRadius:7,border:"none",background:`linear-gradient(135deg,${accent},#06b6d4)`,color:"white",fontWeight:700,cursor:"pointer",fontSize:"0.78rem",opacity:!aiInput.trim()||aiLoading?0.5:1,marginBottom:6}}>
                  ✨ {aiLoading?"Generating...":"Send"}
                </button>
                <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                  {["Bar chart Q1-Q4","Org chart 3 levels","Funnel with 4 stages","Radar chart 5 metrics"].map(h=>(
                    <button key={h} onClick={()=>setAiInput(h)} style={{padding:"3px 5px",borderRadius:4,border:"1px solid #1e293b",background:"transparent",color:"#334155",cursor:"pointer",fontSize:"0.62rem"}}>{h}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CANVAS */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"5px 10px",borderBottom:"1px solid #1e293b",display:"flex",alignItems:"center",gap:6,flexShrink:0,background:"#020617"}}>
          <button onClick={()=>setZoom(z=>Math.min(z+0.1,3))} style={{padding:"4px 7px",borderRadius:5,border:"1px solid #1e293b",background:"transparent",color:"#64748b",cursor:"pointer"}}>+</button>
          <button onClick={()=>setZoom(z=>Math.max(z-0.1,0.2))} style={{padding:"4px 7px",borderRadius:5,border:"1px solid #1e293b",background:"transparent",color:"#64748b",cursor:"pointer"}}>−</button>
          <button onClick={()=>{setZoom(1);setPan({x:0,y:0});}} style={{padding:"4px 7px",borderRadius:5,border:"1px solid #1e293b",background:"transparent",color:"#64748b",cursor:"pointer",fontSize:"0.72rem"}}>{Math.round(zoom*100)}%</button>
          <div style={{width:1,height:18,background:"#1e293b"}}/>
          {selected&&<>
            <button onClick={duplicateSelected} style={{padding:"4px 7px",borderRadius:5,border:"1px solid #1e293b",background:"transparent",color:"#64748b",cursor:"pointer",fontSize:"0.72rem"}}>⧉</button>
            <button onClick={deleteSelected} style={{padding:"4px 7px",borderRadius:5,border:"1px solid #7f1d1d",background:"transparent",color:"#ef4444",cursor:"pointer",fontSize:"0.72rem"}}>✕</button>
            {selectedEl?.type==="chart"&&<button onClick={()=>setEditingChart(selected)} style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${accent}`,background:`${accent}22`,color:accent,cursor:"pointer",fontSize:"0.72rem",fontWeight:700}}>✏️ Edit Chart</button>}
          </>}
          <div style={{flex:1}}/>
          {saveMsg&&<span style={{fontSize:"0.72rem",color:"#22c55e",fontWeight:600}}>{saveMsg}</span>}
          <button onClick={addToReport} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #d97706",background:"transparent",color:"#f59e0b",cursor:"pointer",fontSize:"0.72rem",fontWeight:600}}>+ Report</button>
          <button onClick={exportSVG} style={{padding:"5px 10px",borderRadius:6,border:`1px solid ${accent}44`,background:`${accent}11`,color:accent,cursor:"pointer",fontSize:"0.72rem",fontWeight:600}}>↓ SVG</button>
        </div>
        <div style={{flex:1,overflow:"hidden",position:"relative"}} onMouseDown={onCanvasMouseDown}>
          <div style={{position:"absolute",inset:0,overflow:"hidden"}}>
            <div style={{position:"absolute",transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`,transformOrigin:"0 0",willChange:"transform"}}>
              <div ref={canvasRef} data-canvas-bg="true" style={{width:1400,height:900,background:canvasBg,position:"relative",boxShadow:"0 0 0 1px rgba(255,255,255,0.05)",borderRadius:4}}>
                {gridVisible&&<svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
                  <defs>
                    <pattern id="sg" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/></pattern>
                    <pattern id="lg" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill="url(#sg)"/><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/></pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#lg)"/>
                </svg>}
                {elements.map(el=>(
                  <div key={el.id} style={{position:"absolute",left:el.x,top:el.y,width:el.w,height:el.h,cursor:"move"}}
                    onMouseDown={e=>onElMouseDown(e,el.id)}
                    onDoubleClick={()=>{if(el.type==="chart")setEditingChart(el.id);}}>
                    {el.type==="chart"
                      ?<div style={{width:"100%",height:"100%",overflow:"hidden",borderRadius:8,boxShadow:selected===el.id?"0 0 0 2px #f59e0b,0 0 0 5px rgba(245,158,11,0.2)":"0 2px 12px rgba(0,0,0,0.3)"}} dangerouslySetInnerHTML={{__html:renderChartSVG(el.chartType,el.chartData,el.palette,el.w,el.h,el.textColor,el.bgColor)}}/>
                      :el.type==="mathmodel"
                      ?<div style={{width:"100%",height:"100%",overflow:"hidden",borderRadius:8,boxShadow:selected===el.id?"0 0 0 2px #f59e0b,0 0 0 5px rgba(245,158,11,0.2)":"0 2px 12px rgba(0,0,0,0.3)"}} dangerouslySetInnerHTML={{__html:el.svgStr||""}}/>
                      :<div style={{width:"100%",height:"100%",filter:selected===el.id?"drop-shadow(0 0 5px rgba(245,158,11,0.5))":""}} dangerouslySetInnerHTML={{__html:renderShapeSVG(el,selected===el.id)}}/>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{position:"absolute",bottom:10,left:10,background:"rgba(0,0,0,0.5)",color:"#64748b",fontSize:"0.67rem",padding:"3px 8px",borderRadius:20,backdropFilter:"blur(4px)"}}>
            {elements.length} elements · {Math.round(zoom*100)}% · Alt+drag to pan · Dbl-click chart to edit
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{width:220,flexShrink:0,borderLeft:"1px solid #1e293b",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"8px 12px",borderBottom:"1px solid #1e293b",fontSize:"0.68rem",fontWeight:700,color:accent,textTransform:"uppercase"}}>
          {selectedEl?`${selectedEl.type==="chart"?"📊":selectedEl.type==="mathmodel"?"∫":"◻"} Properties`:"Properties"}
        </div>
        <div style={{flex:1,overflow:"auto"}}><PropsPanel/></div>
        <div style={{borderTop:"1px solid #1e293b",maxHeight:180,overflow:"auto"}}>
          <div style={{padding:"5px 10px",fontSize:"0.65rem",fontWeight:700,color:"#475569",textTransform:"uppercase"}}>Layers ({elements.length})</div>
          {[...elements].reverse().map(el=>(
            <div key={el.id} onClick={()=>setSelected(el.id)}
              style={{padding:"4px 10px",fontSize:"0.7rem",cursor:"pointer",background:selected===el.id?`${accent}22`:"transparent",color:selected===el.id?accent:"#64748b",display:"flex",alignItems:"center",gap:5,borderBottom:"1px solid rgba(30,41,59,0.5)"}}>
              <span>{el.type==="chart"?"📊":el.type==="mathmodel"?"∫":el.type==="text"?"T":"◻"}</span>
              <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{el.type==="chart"?el.title||el.chartType:el.type==="mathmodel"?el.modelLabel:el.text||el.type}</span>
              <button onClick={e=>{e.stopPropagation();setElements(els=>els.filter(x=>x.id!==el.id));if(selected===el.id)setSelected(null);}} style={{background:"none",border:"none",color:"#334155",cursor:"pointer"}}>×</button>
            </div>
          ))}
          {elements.length===0&&<div style={{padding:"12px",color:"#334155",fontSize:"0.7rem",textAlign:"center"}}>No elements</div>}
        </div>
      </div>
    </div>
  );
}