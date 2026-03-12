import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const uid = () => Math.random().toString(36).slice(2, 9);

// ── Element templates ──────────────────────────────────────────────────────
const TEMPLATES = {
  heading:   () => `<h2 data-editable="true" data-id="${uid()}" data-draggable="true" style="color:inherit;margin:0 0 8px">New Heading</h2>`,
  paragraph: () => `<p data-editable="true" data-id="${uid()}" data-draggable="true" style="margin:0 0 8px">New paragraph text.</p>`,
  table:     (rows=3, cols=3) => {
    const hdr  = Array.from({length:cols},(_,i)=>`<th style="padding:8px;background:#3498db;background-color:#3498db;-webkit-print-color-adjust:exact;print-color-adjust:exact;color:#fff;border:1px solid #ddd">Col ${i+1}</th>`).join('');
    const row  = Array.from({length:cols},()=>`<td data-editable="true" data-id="${uid()}" style="padding:8px;border:1px solid #ddd" contenteditable="false">Cell</td>`).join('');
    const rows_ = Array.from({length:rows},(_,i)=>`<tr style="${i%2===1?'background:#f0f4f8;background-color:#f0f4f8;-webkit-print-color-adjust:exact;':''}">${row}</tr>`).join('');
    return `<table data-id="${uid()}" data-editable="true" data-draggable="true" style="width:100%;border-collapse:collapse;margin:0"><thead><tr>${hdr}</tr></thead><tbody>${rows_}</tbody></table>`;
  },
  callout:   () => `<aside data-editable="true" data-id="${uid()}" data-draggable="true" style="border-left:4px solid #3498db;background:#eef6ff;background-color:#eef6ff;-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:14px 18px;border-radius:6px;margin:0"><strong>💡 Note:</strong> Add your callout text here.</aside>`,
  divider:   () => `<hr data-id="${uid()}" data-draggable="true" style="border:none;border-top:2px solid #eee;margin:0"/>`,
  card:      () => `<div data-editable="true" data-id="${uid()}" data-draggable="true" style="background:#fff;background-color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.08);padding:20px;margin:0"><h3 data-editable="true" data-id="${uid()}" style="margin:0 0 8px">Card Title</h3><p data-editable="true" data-id="${uid()}" style="margin:0;color:#666">Card description.</p></div>`,
  image:     (src) => `<figure data-id="${uid()}" data-draggable="true" data-editable="true" style="margin:0;text-align:center;position:relative;display:inline-block;max-width:100%"><img data-id="${uid()}" data-editable="true" src="${src}" style="max-width:100%;height:auto;border-radius:6px;display:block;margin:0 auto"/><figcaption data-editable="true" data-id="${uid()}" style="color:#888;font-size:0.85em;margin-top:6px">Image caption</figcaption></figure>`,
  citation:  (intext, full) => `<span data-editable="true" data-id="${uid()}" data-citation="true" style="color:#2255a4;cursor:pointer" title="${full}">${intext}</span>`,
  references: (items) => `<section data-id="${uid()}" data-draggable="true" data-feature="references" style="margin:0;padding-top:16px;border-top:2px solid #ddd">
  <h2 data-editable="true" data-id="${uid()}" style="color:inherit">References</h2>
  ${items.map(r=>`<p data-editable="true" data-id="${uid()}" style="margin-bottom:12px;padding-left:2em;text-indent:-2em;font-size:0.9em;line-height:1.6">${r}</p>`).join('\n  ')}
</section>`,
};

const COLOR_ADJUST_STYLE = `<style>*,*::before,*::after{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important;}</style>`;

const injectPrintStyles = (html) => {
  if (html.includes('</head>')) return html.replace('</head>', COLOR_ADJUST_STYLE + '</head>');
  return COLOR_ADJUST_STYLE + html;
};

async function fetchPdf(html, manifesto) {
  const fd = new FormData();
  fd.append('html', new Blob([injectPrintStyles(html)], { type:'text/html' }), 'report.html');
  fd.append('styleManifest', JSON.stringify(manifesto ?? {}));
  return fetch('http://localhost:3000/api/render-pdf-form', { method:'POST', body:fd });
}

// ══════════════════════════════════════════════════════════════════════════
//  BRIDGE — injected into the iframe
//  Key design: elements stay in normal document flow BUT we use a
//  "drag ghost + insertion cursor" approach so the user can drop
//  any element EXACTLY where they want in the page.
// ══════════════════════════════════════════════════════════════════════════
const wrapWithBridge = (html) => {
  const bridge = `
<style>
  *,*::before,*::after{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important;}

  /* Drag handle that appears on hover */
  [data-draggable]{position:relative;}
  [data-draggable]>.rb-drag-handle{
    display:none;position:absolute;left:-32px;top:6px;
    width:24px;height:24px;background:#7c6fff;border-radius:5px;cursor:grab;
    align-items:center;justify-content:center;font-size:14px;color:white;
    z-index:9999;user-select:none;box-shadow:0 2px 8px rgba(124,111,255,.5);
    line-height:1;flex-shrink:0;
  }
  [data-draggable]:hover>.rb-drag-handle{display:flex !important;}
  /* For figures, pin handle inside top-left so it's never clipped */
  figure[data-draggable]>.rb-drag-handle{
    left:6px !important;top:6px !important;opacity:0.9;
  }
  [data-draggable].rb-dragging{opacity:0.35;outline:2px dashed #7c6fff;}
  /* Prevent figure from clipping the handle */
  figure[data-draggable]{overflow:visible !important;}

  /* Drop cursor line — set via inline style in JS */
  .rb-drop-cursor{ pointer-events:none; }

  /* Selection */
  [data-selected]{outline:2px solid #7c6fff !important;outline-offset:3px;}

  /* Image resize handle */
  .rb-img-handle{
    position:absolute;bottom:4px;right:4px;width:16px;height:16px;
    background:#7c6fff;border-radius:4px;cursor:se-resize;z-index:100;
    display:none;border:2px solid white;
  }
  figure[data-selected] .rb-img-handle,[data-selected].rb-img-handle-parent .rb-img-handle{display:block;}

  /* Editing mode */
  body.rb-editing [data-draggable]>.rb-drag-handle{display:none !important;}
  [contenteditable=true]{cursor:text;outline:2px solid #48dbfb !important;}

  /* ── SVG diagram editing ── */
  svg[data-diagram] text{cursor:text;}
  svg[data-diagram] text:hover{outline:1px dashed rgba(124,111,255,0.7);outline-offset:2px;}
  svg[data-diagram] text[data-editing]{outline:2px solid #7c6fff;outline-offset:2px;}
  svg[data-diagram] rect:hover,svg[data-diagram] circle:hover,
  svg[data-diagram] ellipse:hover,svg[data-diagram] polygon:hover{cursor:pointer;filter:brightness(1.2);}
  svg[data-diagram] [data-sel]{filter:brightness(1.35) drop-shadow(0 0 4px #7c6fff);}
</style>
<script>
(function(){
  'use strict';
  var PARENT = window.parent;
  function post(msg){ PARENT.postMessage(msg,'*'); }
  function getBody(){ return document.body.innerHTML; }

  /* ── Drag state ── */
  var dragging = null;      // element being dragged
  var cursor   = null;      // .rb-drop-cursor element
  var ghostY   = 0;         // mouse Y on drag start inside element
  var editing  = false;

  /* ── Utilities ── */
  function allDropTargets(){
    // Collect all block-level draggable/editable elements visible on page
    // We walk ALL elements in body and pick ones that are direct children of
    // a block container (not nested inside another draggable)
    var results = [];
    var seen = new WeakSet();
    function walk(node){
      if(!node || node.nodeType !== 1) return;
      if(node === dragging) return;
      if(node.classList && (node.classList.contains('rb-drop-cursor') || node.classList.contains('rb-drag-handle') || node.classList.contains('rb-img-handle'))) return;
      if(node.tagName === 'STYLE' || node.tagName === 'SCRIPT') return;

      var isDraggable = node.hasAttribute && node.hasAttribute('data-draggable');
      var isEditable  = node.hasAttribute && node.hasAttribute('data-editable');

      if((isDraggable || isEditable) && !seen.has(node)){
        seen.add(node);
        results.push(node);
        // Don't walk inside draggable containers — treat them as atomic
        return;
      }
      // Keep walking into non-draggable containers to find nested draggables
      Array.from(node.children || []).forEach(walk);
    }
    Array.from(document.body.children).forEach(walk);
    return results.filter(function(el){ return el !== dragging; });
  }

  function findInsertionPoint(mouseY){
    var targets = allDropTargets();
    if(!targets.length) return null;

    // Find closest gap between elements
    var best = null, bestDist = Infinity;
    targets.forEach(function(el){
      var r = el.getBoundingClientRect();
      // Distance to top edge (insert before) and bottom edge (insert after)
      var distTop    = Math.abs(mouseY - r.top);
      var distBottom = Math.abs(mouseY - r.bottom);
      var distMid    = Math.abs(mouseY - (r.top + r.height / 2));

      if(distTop < bestDist){
        bestDist = distTop;
        best = {el: el, before: true};
      }
      if(distBottom < bestDist){
        bestDist = distBottom;
        best = {el: el, before: false};
      }
      // If mouse is squarely inside the element, use midpoint rule
      if(mouseY >= r.top && mouseY <= r.bottom){
        var before = mouseY < r.top + r.height / 2;
        if(distMid < bestDist){
          bestDist = distMid * 0.5; // prefer "inside" match
          best = {el: el, before: before};
        }
      }
    });
    return best;
  }

  function ensureHandle(el){
    // Make sure element is marked draggable
    if(!el.hasAttribute('data-draggable')) el.setAttribute('data-draggable','true');
    if(el.querySelector(':scope > .rb-drag-handle')) return;
    var h = document.createElement('div');
    h.className = 'rb-drag-handle';
    h.innerHTML = '&#8942;&#8942;'; // ⠿ dots
    h.title = 'Drag to reorder';
    h.addEventListener('mousedown', function(e){ startDrag(e, el); });
    el.insertBefore(h, el.firstChild);
  }

  function ensureImgHandle(fig){
    if(fig.querySelector('.rb-img-handle')) return;
    var h = document.createElement('div');
    h.className = 'rb-img-handle';
    h.title = 'Drag to resize';
    fig.style.position = 'relative';
    fig.appendChild(h);
    var img = fig.querySelector('img'), startX, startW;
    h.addEventListener('mousedown', function(e){
      if(!img) return;
      startX = e.clientX; startW = img.offsetWidth;
      e.preventDefault(); e.stopPropagation();
      function onMove(e2){
        img.style.width = Math.max(40, startW + (e2.clientX - startX)) + 'px';
        img.style.maxWidth = '100%';
      }
      function onUp(){ document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); post({type:'reorder',html:getBody()}); }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  function initAll(){
    // Add handles to all draggable elements
    document.querySelectorAll('[data-draggable]').forEach(ensureHandle);
    // Also make figures draggable even if attribute was missing
    document.querySelectorAll('figure').forEach(function(fig){
      ensureHandle(fig);
      ensureImgHandle(fig);
    });
  }

  /* ── Drag logic (mouse-based, works across entire page) ── */
  function startDrag(e, el){
    if(editing) return;
    e.preventDefault(); e.stopPropagation();
    dragging = el;
    ghostY = e.clientY - el.getBoundingClientRect().top;
    el.classList.add('rb-dragging');

    // Create a fixed-position cursor line
    cursor = document.createElement('div');
    cursor.className = 'rb-drop-cursor';
    cursor.style.cssText = 'position:fixed;height:4px;background:linear-gradient(90deg,#7c6fff,#48dbfb);border-radius:3px;z-index:99999;pointer-events:none;box-shadow:0 0 10px rgba(72,219,251,0.7);transition:top 0.04s;';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup',   onDragEnd);
  }

  function onDragMove(e){
    if(!dragging || !cursor) return;
    e.preventDefault();
    var pt = findInsertionPoint(e.clientY);
    if(!pt) return;
    var r = pt.el.getBoundingClientRect();
    var lineY = pt.before ? r.top - 2 : r.bottom + 2;
    cursor.style.top  = lineY + 'px';
    cursor.style.left = r.left + 'px';
    cursor.style.width = r.width + 'px';
  }

  function onDragEnd(e){
    if(!dragging){ cleanup(); return; }
    e.preventDefault();

    var pt = findInsertionPoint(e.clientY);
    if(pt && pt.el !== dragging){
      var parent = pt.el.parentNode;
      if(pt.before){
        parent.insertBefore(dragging, pt.el);
      } else {
        parent.insertBefore(dragging, pt.el.nextSibling || null);
      }
    }
    cleanup();
    post({type:'reorder', html:getBody()});
  }

  function cleanup(){
    if(dragging) dragging.classList.remove('rb-dragging');
    dragging = null;
    if(cursor && cursor.parentElement) cursor.parentElement.removeChild(cursor);
    cursor = null;
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup',   onDragEnd);
  }

  /* ── SVG diagram — uid init ── */
  function initSvgUids(){
    document.querySelectorAll('svg[data-diagram] text,svg[data-diagram] rect,svg[data-diagram] circle,svg[data-diagram] ellipse,svg[data-diagram] polygon,svg[data-diagram] path').forEach(function(el){
      if(!el.dataset.svgUid) el.dataset.svgUid = Math.random().toString(36).slice(2,8);
    });
  }

  /* ── SVG click (capture phase — fires before generic click) ── */
  document.addEventListener('click', function(e){
    var svg = e.target.closest('svg[data-diagram]');
    if(!svg) return;
    svg.querySelectorAll('[data-sel]').forEach(function(n){ n.removeAttribute('data-sel'); });
    var textEl = e.target.closest('text');
    var shape  = e.target.closest('rect,circle,ellipse,polygon,path');
    if(textEl && textEl.closest('svg[data-diagram]') === svg){
      textEl.setAttribute('data-sel','');
      post({type:'svgSelect', svgId: svg.dataset.id||(svg.closest('figure')||{dataset:{}}).dataset.id||'',
        elType:'text', text:textEl.textContent,
        fill:textEl.getAttribute('fill')||'#ffffff',
        fontSize:textEl.getAttribute('font-size')||'14',
        fontWeight:textEl.getAttribute('font-weight')||'normal'});
      e.stopPropagation(); return;
    }
    if(shape && shape.closest('svg[data-diagram]') === svg){
      shape.setAttribute('data-sel','');
      post({type:'svgSelect', svgId: svg.dataset.id||(svg.closest('figure')||{dataset:{}}).dataset.id||'',
        elType:'shape', fill:shape.getAttribute('fill')||'#3498db'});
      e.stopPropagation(); return;
    }
    var fig = svg.closest('figure[data-editable]');
    if(fig){
      document.querySelectorAll('[data-selected]').forEach(function(n){ n.removeAttribute('data-selected'); });
      fig.setAttribute('data-selected','');
      post({type:'diagramFigureSelect', id:fig.dataset.id, svgId:svg.dataset.id||fig.dataset.id});
      e.stopPropagation();
    }
  }, true);

  /* ── SVG double-click: inline text edit ── */
  document.addEventListener('dblclick', function(e){
    var textEl = e.target.closest('text');
    if(!textEl || !textEl.closest('svg[data-diagram]')) return;
    var svg = textEl.closest('svg[data-diagram]');
    textEl.setAttribute('data-editing','');
    var fs = parseInt(textEl.getAttribute('font-size')||'14');
    var x  = parseFloat(textEl.getAttribute('x')||'0');
    var y  = parseFloat(textEl.getAttribute('y')||'0');
    var fo = document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
    fo.setAttribute('x', x-4); fo.setAttribute('y', y-fs-4);
    fo.setAttribute('width','200'); fo.setAttribute('height', fs+20);
    fo.setAttribute('data-fo','true');
    var ta = document.createElement('input');
    ta.type = 'text';
    ta.value = textEl.textContent.trim();
    ta.style.cssText = 'width:100%;height:100%;background:rgba(13,13,26,0.95);color:'+(textEl.getAttribute('fill')||'#fff')+';font-size:'+fs+'px;font-weight:'+(textEl.getAttribute('font-weight')||'normal')+';border:2px solid #7c6fff;border-radius:3px;padding:2px 5px;outline:none;font-family:inherit;box-sizing:border-box;';
    fo.appendChild(ta); svg.appendChild(fo);
    ta.focus(); ta.select();
    var commit = function(){
      var v = ta.value.trim() || textEl.textContent;
      if(textEl.children.length > 0) Array.from(textEl.children).forEach(function(ts){ ts.textContent=v; });
      else textEl.textContent = v;
      textEl.removeAttribute('data-editing');
      if(fo.parentNode) svg.removeChild(fo);
      post({type:'reorder', html:getBody()});
    };
    ta.addEventListener('keydown', function(ev){ if(ev.key==='Enter'||ev.key==='Escape'){ev.preventDefault();commit();} });
    ta.addEventListener('blur', commit);
    e.stopPropagation();
  }, true);

  /* ── Click to select ── */
  document.addEventListener('click', function(e){
    if(e.target.classList.contains('rb-drag-handle')) return;
    if(e.target.classList.contains('rb-img-handle'))  return;
    var el = e.target.closest('[data-editable]');
    document.querySelectorAll('[data-selected]').forEach(function(n){ n.removeAttribute('data-selected'); });
    if(el){
      el.setAttribute('data-selected','');
      var isFig = el.tagName==='FIGURE', isImg = el.tagName==='IMG';
      var innerImg = isFig ? el.querySelector('img') : null;
      post({type:'select',
        id:      el.dataset.id,
        tag:     el.tagName.toLowerCase(),
        styles:  el.getAttribute('style')||'',
        text:    el.innerText||'',
        isTable: el.tagName==='TABLE'||!!el.closest('table'),
        tableId: (el.closest('table')||{dataset:{}}).dataset.id||null,
        isImg:   isImg||isFig,
        imgSrc:  isImg?el.src:(innerImg?innerImg.src:null),
        imgId:   isImg?el.dataset.id:(innerImg?innerImg.dataset.id:null),
        imgW:    isImg?el.style.width||(innerImg?innerImg.style.width:''):'',
      });
      e.stopPropagation();
    } else {
      post({type:'deselect'});
    }
  });

  /* ── Double-click to edit text ── */
  document.addEventListener('dblclick', function(e){
    var el = e.target.closest('[data-editable]');
    if(!el||el.tagName==='TABLE'||el.tagName==='IMG'||el.tagName==='FIGURE') return;
    editing = true;
    document.body.classList.add('rb-editing');
    el.setAttribute('contenteditable','true');
    el.setAttribute('draggable','false');
    el.focus();
    post({type:'editing', id:el.dataset.id});
    // Select all text
    var range = document.createRange();
    range.selectNodeContents(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  });

  document.addEventListener('blur', function(e){
    var el = e.target.closest('[contenteditable=true]');
    if(!el) return;
    el.setAttribute('contenteditable','false');
    editing = false;
    document.body.classList.remove('rb-editing');
    post({type:'textChanged', id:el.dataset.id, html:getBody()});
  }, true);

  /* ── Key handler ── */
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape' && editing){
      var el = document.querySelector('[contenteditable=true]');
      if(el){ el.blur(); }
    }
  });

  /* ── postMessage API ── */
  window.addEventListener('message', function(e){
    var d = e.data||{};

    if(d.type==='applyStyle' && d.id){
      var el = document.querySelector('[data-id="'+d.id+'"]');
      if(el){ el.setAttribute('style', d.style); post({type:'reorder',html:getBody()}); }
    }

    if(d.type==='deleteEl' && d.id){
      var el = document.querySelector('[data-id="'+d.id+'"]');
      var rm = (el&&el.tagName==='IMG'&&el.closest('figure')) ? el.closest('figure') : el;
      if(rm){ rm.remove(); post({type:'reorder',html:getBody()}); post({type:'deselect'}); }
    }

    if(d.type==='insertHtml'){
      var tmp = document.createElement('div');
      tmp.innerHTML = d.html;
      var nodes = Array.from(tmp.childNodes);

      // Find anchor: selected element or last element in main container
      var anchor = document.querySelector('[data-selected]');
      if(anchor){
        var ref = anchor.nextSibling;
        nodes.forEach(function(n){ anchor.parentNode.insertBefore(n, ref); });
      } else {
        var container = document.querySelector('main.main-content,main,.main-content,.report-wrapper,.content') || document.body;
        nodes.forEach(function(n){ container.appendChild(n); });
      }
      initAll();
      post({type:'reorder', html:getBody()});

      // Auto-select the newly inserted element
      var firstNew = nodes.find(function(n){ return n.nodeType===1 && n.dataset && n.dataset.id; });
      if(firstNew){
        document.querySelectorAll('[data-selected]').forEach(function(n){ n.removeAttribute('data-selected'); });
        firstNew.setAttribute('data-selected','');
        firstNew.scrollIntoView({behavior:'smooth', block:'center'});
        post({type:'select',
          id:firstNew.dataset.id, tag:firstNew.tagName.toLowerCase(),
          styles:firstNew.getAttribute('style')||'', text:firstNew.innerText||'',
          isImg:firstNew.tagName==='FIGURE'||firstNew.tagName==='IMG',
        });
      }
    }

    if(d.type==='replaceImage' && d.id){
      var img = document.querySelector('[data-id="'+d.id+'"]');
      if(img){ img.src=d.src; post({type:'reorder',html:getBody()}); }
    }

    if(d.type==='setImgWidth' && d.id){
      var img = document.querySelector('[data-id="'+d.id+'"]');
      if(img){ img.style.width=d.width; img.style.maxWidth='100%'; post({type:'reorder',html:getBody()}); }
    }

    if(d.type==='addTableRow' && d.id){
      var tbl = document.querySelector('[data-id="'+d.id+'"]');
      var table = tbl&&tbl.tagName==='TABLE'?tbl:(tbl&&tbl.closest('table'));
      if(!table) return;
      var tbody = table.querySelector('tbody');
      var colCount = (table.querySelector('tr')&&table.querySelector('tr').cells.length)||3;
      var rowCount = (tbody&&tbody.rows.length)||0;
      var newRow = document.createElement('tr');
      if(rowCount%2===1) newRow.style.cssText='background:#f0f4f8;background-color:#f0f4f8;-webkit-print-color-adjust:exact;';
      for(var i=0;i<colCount;i++){
        var td=document.createElement('td');
        td.setAttribute('data-editable','true');
        td.setAttribute('data-id',Math.random().toString(36).slice(2,7));
        td.setAttribute('contenteditable','false');
        td.style.cssText='padding:8px;border:1px solid #ddd';
        td.textContent='Cell'; newRow.appendChild(td);
      }
      tbody.appendChild(newRow); post({type:'reorder',html:getBody()});
    }

    if(d.type==='addTableCol' && d.id){
      var tbl = document.querySelector('[data-id="'+d.id+'"]');
      var table = tbl&&tbl.tagName==='TABLE'?tbl:(tbl&&tbl.closest('table'));
      if(!table) return;
      var headerRow = table.querySelector('thead tr');
      if(headerRow){
        var th=document.createElement('th');
        th.style.cssText='padding:8px;background:#3498db;background-color:#3498db;-webkit-print-color-adjust:exact;color:#fff;border:1px solid #ddd';
        th.textContent='New Col'; headerRow.appendChild(th);
      }
      table.querySelectorAll('tbody tr').forEach(function(row){
        var td=document.createElement('td');
        td.setAttribute('data-editable','true');
        td.setAttribute('data-id',Math.random().toString(36).slice(2,7));
        td.setAttribute('contenteditable','false');
        td.style.cssText='padding:8px;border:1px solid #ddd';
        td.textContent='Cell'; row.appendChild(td);
      });
      post({type:'reorder',html:getBody()});
    }

    if(d.type==='removeTableRow' && d.id){
      var tbl = document.querySelector('[data-id="'+d.id+'"]');
      var table = tbl&&tbl.tagName==='TABLE'?tbl:(tbl&&tbl.closest('table'));
      if(!table) return;
      var tbody = table.querySelector('tbody');
      if(tbody&&tbody.rows.length>1) tbody.deleteRow(tbody.rows.length-1);
      post({type:'reorder',html:getBody()});
    }

    if(d.type==='removeTableCol' && d.id){
      var tbl = document.querySelector('[data-id="'+d.id+'"]');
      var table = tbl&&tbl.tagName==='TABLE'?tbl:(tbl&&tbl.closest('table'));
      if(!table) return;
      table.querySelectorAll('tr').forEach(function(row){
        if(row.cells.length>1) row.deleteCell(row.cells.length-1);
      });
      post({type:'reorder',html:getBody()});
    }

    if(d.type==='scrollTo' && d.id){
      var el = document.querySelector('[data-id="'+d.id+'"]');
      if(el) el.scrollIntoView({behavior:'smooth', block:'center'});
    }

    /* ── SVG diagram edits ── */
    function getSvg(id){
      return document.querySelector('svg[data-id="'+id+'"]')
          || document.querySelector('figure[data-id="'+id+'"] svg')
          || document.querySelector('[data-id="'+id+'"] svg');
    }
    if(d.type==='svgSetTextFill'){
      var svg=getSvg(id); if(svg) svg.querySelectorAll('[data-sel]').forEach(function(el){ if(el.tagName.toLowerCase()==='text') el.setAttribute('fill',d.fill); });
      post({type:'reorder',html:getBody()});
    }
    if(d.type==='svgSetShapeFill'){
      var svg=getSvg(id); if(svg) svg.querySelectorAll('[data-sel]').forEach(function(el){ el.setAttribute('fill',d.fill); });
      post({type:'reorder',html:getBody()});
    }
    if(d.type==='svgSetFontSize'){
      var svg=getSvg(id); if(svg) svg.querySelectorAll('[data-sel]').forEach(function(el){ if(el.tagName.toLowerCase()==='text') el.setAttribute('font-size',d.size); });
      post({type:'reorder',html:getBody()});
    }
    if(d.type==='svgSetFontWeight'){
      var svg=getSvg(id); if(svg) svg.querySelectorAll('[data-sel]').forEach(function(el){ if(el.tagName.toLowerCase()==='text') el.setAttribute('font-weight',d.weight); });
      post({type:'reorder',html:getBody()});
    }
    if(d.type==='svgSetScale'){
      var fig=document.querySelector('figure[data-id="'+id+'"]');
      var svg=fig?fig.querySelector('svg'):getSvg(id);
      if(svg){ svg.style.width=d.pct+'%'; svg.style.maxWidth='100%'; svg.style.height='auto'; }
      post({type:'reorder',html:getBody()});
    }
    if(d.type==='svgReplace'){
      var fig=document.querySelector('figure[data-id="'+id+'"]');
      if(fig){ var oldSvg=fig.querySelector('svg'); var tmp2=document.createElement('div'); tmp2.innerHTML=d.svg; var newSvg=tmp2.querySelector('svg'); if(oldSvg&&newSvg) fig.replaceChild(newSvg,oldSvg); else if(newSvg) fig.prepend(newSvg); post({type:'reorder',html:getBody()}); }
    }
  });

  // ── Init ──
  initAll();
  initSvgUids();
  new MutationObserver(function(){ initAll(); initSvgUids(); }).observe(document.body,{childList:true,subtree:true});
})();
</script>`;

  return html.includes('</body>') ? html.replace('</body>', bridge+'</body>') : html + bridge;
};

// ── APA Citation Generator ─────────────────────────────────────────────────
async function generateApaCitations(description, docHtml) {
  const res = await fetch('http://localhost:3000/api/generate-citations', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ description, docHtml: docHtml.slice(0, 8000) }),
  });
  if (!res.ok) throw new Error('Citation generation failed');
  return res.json();
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function PdfEditor() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const iframeRef  = useRef(null);
  const imgUpRef   = useRef(null);

  const [liveHtml,    setLiveHtml]    = useState(() => state?.html ? wrapWithBridge(state.html) : '');
  const [rawHtml,     setRawHtml]     = useState(state?.html ?? '');
  const [selected,    setSelected]    = useState(null);
  const [selectedSvg, setSelectedSvg] = useState(null);
  const [activeTab,   setActiveTab]   = useState('element');
  const [downloading, setDownloading] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [urlPreview,      setUrlPreview]      = useState('');
  const [newRows,  setNewRows]  = useState(3);
  const [newCols,  setNewCols]  = useState(3);
  const [insertTip, setInsertTip] = useState(false);

  // SVG diagram editor state
  const [svgFill,       setSvgFill]       = useState('#ffffff');
  const [svgFontSize,   setSvgFontSize]   = useState(14);
  const [svgFontWeight, setSvgFontWeight] = useState('normal');
  const [svgScale,      setSvgScale]      = useState(100);
  const [regeneKw,      setRegeneKw]      = useState('');
  const [regeneLoading, setRegeneLoading] = useState(false);
  const [regeneError,   setRegeneError]   = useState(null);

  const [viewMode,   setViewMode]   = useState('edit');
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError,   setPdfError]   = useState(null);

  const [citeDesc,    setCiteDesc]    = useState('');
  const [citeResult,  setCiteResult]  = useState(null);
  const [citeLoading, setCiteLoading] = useState(false);
  const [citeError,   setCiteError]   = useState(null);
  const [refList,     setRefList]     = useState([]);

  const [elStyles, setElStyles] = useState({
    color:'#111111', background:'#ffffff', fontSize:16,
    fontWeight:'normal', textAlign:'left', padding:0,
    borderRadius:0, borderStyle:'none', borderColor:'#dddddd', borderWidth:1,
    marginTop:0, marginBottom:0, width:100, opacity:100,
  });

  const loadPdfPreview = async () => {
    setPdfLoading(true); setPdfError(null);
    try {
      const res = await fetchPdf(rawHtml, state?.manifesto);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const blob = await res.blob();
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(URL.createObjectURL(blob));
    } catch (err) { setPdfError(err.message); }
    finally { setPdfLoading(false); }
  };

  const handleToggleView = async (mode) => {
    setViewMode(mode);
    if (mode === 'pdf') await loadPdfPreview();
  };

  useEffect(() => () => { if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl); }, [pdfBlobUrl]);

  const onMessage = useCallback((e) => {
    const { type, id, tag, styles, text, html, isTable, tableId, isImg, imgSrc, imgId, imgW } = e.data || {};
    if (type === 'select') {
      setSelected({ id, tag, styles, text, isTable, tableId, isImg, imgSrc, imgId, imgW });
      setSelectedSvg(null);
      const tmp = document.createElement('div');
      tmp.setAttribute('style', styles);
      const cs = tmp.style;
      setElStyles({
        color:        cs.color        || '#111111',
        background:   cs.background   || '#ffffff',
        fontSize:     parseInt(cs.fontSize)     || 16,
        fontWeight:   cs.fontWeight   || 'normal',
        textAlign:    cs.textAlign    || 'left',
        padding:      parseInt(cs.padding)      || 0,
        borderRadius: parseInt(cs.borderRadius) || 0,
        borderStyle:  cs.borderStyle  || 'none',
        borderColor:  cs.borderColor  || '#dddddd',
        borderWidth:  parseInt(cs.borderWidth)  || 1,
        marginTop:    parseInt(cs.marginTop)    || 0,
        marginBottom: parseInt(cs.marginBottom) || 0,
        width:        parseInt(cs.width)        || 100,
        opacity:      Math.round((parseFloat(cs.opacity)||1)*100),
      });
      if (isImg) setActiveTab('image');
      else       setActiveTab('element');
    }
    if (type === 'svgSelect' || type === 'diagramFigureSelect') {
      setSelectedSvg(e.data);
      setSvgFill(e.data.fill || '#ffffff');
      setSvgFontSize(parseInt(e.data.fontSize) || 14);
      setSvgFontWeight(e.data.fontWeight || 'normal');
      setActiveTab('diagram');
    }
    if (type === 'deselect') { setSelected(null); setSelectedSvg(null); }
    if (type === 'reorder' || type === 'textChanged') setRawHtml(html ?? rawHtml);
  }, [rawHtml]);

  useEffect(() => {
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onMessage]);

  const send = (msg) => iframeRef.current?.contentWindow?.postMessage(msg, '*');

  const pushStyle = (newStyles) => {
    const merged = { ...elStyles, ...newStyles };
    setElStyles(merged);
    if (!selected) return;
    const styleStr = [
      `color:${merged.color}`,
      `background:${merged.background}`,
      `background-color:${merged.background}`,
      `-webkit-print-color-adjust:exact`,
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

  // SVG diagram actions
  const svgId = selectedSvg?.svgId || selectedSvg?.id || '';
  const applyTextFill  = (fill)   => { setSvgFill(fill);        send({ type:'svgSetTextFill',  id:svgId, fill }); };
  const applyShapeFill = (fill)   => { setSvgFill(fill);        send({ type:'svgSetShapeFill', id:svgId, fill }); };
  const applyFontSize  = (size)   => { setSvgFontSize(size);    send({ type:'svgSetFontSize',  id:svgId, size }); };
  const applyFontWeight= (w)      => { setSvgFontWeight(w);     send({ type:'svgSetFontWeight',id:svgId, weight:w }); };
  const applyScale     = (pct)    => { setSvgScale(pct);        send({ type:'svgSetScale',     id:svgId, pct }); };
  const handleRegenerate = async () => {
    if (!svgId || !regeneKw.trim()) return;
    setRegeneLoading(true); setRegeneError(null);
    try {
      const res  = await fetch('http://localhost:3000/api/regenerate-diagram', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ keyword:regeneKw, topic:regeneKw, bgColor:'#1a1a2e', primaryColor:'#3498db' }),
      });
      const data = await res.json();
      if (!res.ok || !data.svg) throw new Error(data.error || 'No SVG returned');
      send({ type:'svgReplace', id:svgId, svg:data.svg });
    } catch(e) { setRegeneError(e.message); }
    finally { setRegeneLoading(false); }
  };

  const insertEl = (kind) => {
    const h = TEMPLATES[kind]?.();
    if (h) {
      send({ type:'insertHtml', html:h });
      // Show tip on first insert
      setInsertTip(true);
      setTimeout(() => setInsertTip(false), 4000);
    }
  };

  const insertTable = () => {
    send({ type:'insertHtml', html:TEMPLATES.table(newRows, newCols) });
    setInsertTip(true);
    setTimeout(() => setInsertTip(false), 4000);
  };

  const tableTarget = selected?.tableId || selected?.id;
  const addRow    = () => send({ type:'addTableRow',    id:tableTarget });
  const removeRow = () => send({ type:'removeTableRow', id:tableTarget });
  const addCol    = () => send({ type:'addTableCol',    id:tableTarget });
  const removeCol = () => send({ type:'removeTableCol', id:tableTarget });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedPreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const doInsertImage = (src) => {
    if (selected?.isImg && selected.imgId) {
      send({ type:'replaceImage', id:selected.imgId, src });
    } else {
      send({ type:'insertHtml', html:TEMPLATES.image(src) });
      setInsertTip(true);
      setTimeout(() => setInsertTip(false), 5000);
    }
  };

  const handleGenerateCitation = async () => {
    if (!citeDesc.trim()) return;
    setCiteLoading(true); setCiteError(null); setCiteResult(null);
    try {
      const result = await generateApaCitations(citeDesc, rawHtml);
      setCiteResult(result);
    } catch (err) { setCiteError(err.message); }
    finally { setCiteLoading(false); }
  };

  const insertParenthetical = () => {
    if (!citeResult) return;
    send({ type:'insertHtml', html: TEMPLATES.citation(citeResult.intext, citeResult.reference) });
    addToRefList(citeResult.reference);
  };

  const insertNarrative = () => {
    if (!citeResult) return;
    send({ type:'insertHtml', html: TEMPLATES.citation(citeResult.narrative, citeResult.reference) });
    addToRefList(citeResult.reference);
  };

  const addToRefList = (ref) => setRefList(prev => prev.includes(ref) ? prev : [...prev, ref]);
  const insertReferenceList = () => { if (refList.length) send({ type:'insertHtml', html: TEMPLATES.references(refList) }); };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetchPdf(rawHtml, state?.manifesto);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'report-edited.pdf'; a.click();
      URL.revokeObjectURL(url);
    } finally { setDownloading(false); }
  };





  // ── Styles ──────────────────────────────────────────────────────────────
  const accent = '#7c6fff';
  const panel  = { background:'#12121f', borderRadius:12, padding:'14px', marginBottom:10, border:'1px solid #1e1e32' };
  const row_   = { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #1a1a2e' };
  const inp    = { background:'#1a1a2e', border:'1px solid #333', borderRadius:6, padding:'5px 8px', color:'#ccc', fontSize:'0.82rem', width:'100%', boxSizing:'border-box' };
  const noHtml = !liveHtml;

  const TabBtn = ({id,label}) => (
    <button onClick={()=>setActiveTab(id)} style={{
      flex:1, padding:'8px 2px', border:'none', borderRadius:0, cursor:'pointer',
      fontSize:'0.72rem', fontWeight:600,
      background: activeTab===id ? '#1e1e3a' : 'transparent',
      color:      activeTab===id ? accent : '#555',
      borderBottom: activeTab===id ? `2px solid ${accent}` : '2px solid transparent',
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
    <button onClick={onClick} style={{flex:1,padding:'6px 4px',borderRadius:6,border:`1px solid ${color}`,background:'transparent',color,cursor:'pointer',fontSize:'0.75rem',fontWeight:600}}>{label}</button>
  );

  const ViewToggle = () => (
    <div style={{display:'flex',background:'#0d0d1a',border:'1px solid #1e1e32',borderRadius:8,padding:3,margin:'8px 10px',flexShrink:0}}>
      {[{id:'edit',label:'✏️ Edit'},{id:'pdf',label:'📄 PDF Preview'}].map(({id,label})=>(
        <button key={id} onClick={()=>handleToggleView(id)} style={{
          flex:1, padding:'7px 10px', border:'none', borderRadius:6, cursor:'pointer',
          fontSize:'0.78rem', fontWeight:700, transition:'all .15s',
          background: viewMode===id ? accent : 'transparent',
          color:      viewMode===id ? 'white' : '#444',
        }}>{label}</button>
      ))}
    </div>
  );

  return (
    <div style={{display:'grid',gridTemplateColumns:'300px 1fr',height:'100vh',background:'#0d0d1a',color:'#eee',fontFamily:'system-ui,sans-serif',overflow:'hidden'}}>

      {/* ── SIDEBAR ── */}
      <div style={{display:'flex',flexDirection:'column',borderRight:'1px solid #1e1e32',overflow:'hidden'}}>

        <div style={{padding:'12px 14px',borderBottom:'1px solid #1e1e32',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div>
            <h2 style={{margin:0,fontSize:'0.95rem',fontWeight:800,background:`linear-gradient(135deg,${accent},#48dbfb)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>PDF Editor</h2>
            <div style={{fontSize:'0.68rem',color:'#444',marginTop:2}}>Click to select · Double-click to edit text</div>
          </div>
          <button onClick={()=>navigate(-1)} style={{background:'none',border:'1px solid #333',color:'#666',borderRadius:8,padding:'4px 8px',cursor:'pointer',fontSize:'0.72rem'}}>← Back</button>
        </div>

        {/* Drag tip banner */}
        <div style={{padding:'8px 14px',background:'rgba(124,111,255,0.08)',borderBottom:'1px solid #1e1e32',flexShrink:0}}>
          <div style={{fontSize:'0.7rem',color:'#7c6fff',lineHeight:1.5}}>
            <strong>⠿ Drag handle</strong> appears on hover — grab it to reorder any element anywhere on the page
          </div>
        </div>

        <ViewToggle />

        {viewMode === 'edit' && (
          <div style={{display:'flex',borderBottom:'1px solid #1e1e32',flexShrink:0}}>
            <TabBtn id="element" label="Element"/>
            <TabBtn id="table"   label="Table"/>
            <TabBtn id="insert"  label="Insert"/>
            <TabBtn id="image"   label="Image"/>
            <TabBtn id="cite"    label="Cite"/>
          </div>
        )}

        {viewMode === 'pdf' && (
          <div style={{padding:'10px',borderBottom:'1px solid #1e1e32',flexShrink:0}}>
            <div style={{fontSize:'0.75rem',color:'#555',lineHeight:1.5}}>
              Live render — exactly as it will download. Switch to <strong style={{color:accent}}>Edit</strong> to make changes.
            </div>
            <button onClick={loadPdfPreview} disabled={pdfLoading} style={{marginTop:8,width:'100%',padding:'7px',borderRadius:8,border:`1px solid ${accent}`,background:'transparent',color:accent,cursor:pdfLoading?'not-allowed':'pointer',fontWeight:600,fontSize:'0.8rem'}}>
              {pdfLoading ? '⏳ Rendering…' : '🔄 Refresh Preview'}
            </button>
            {pdfError && <div style={{marginTop:6,fontSize:'0.72rem',color:'#e74c3c'}}>{pdfError}</div>}
          </div>
        )}

        <div style={{overflowY:'auto',flex:1,padding:'10px',display:viewMode==='pdf'?'none':'block'}}>

          {/* ── ELEMENT TAB ── */}
          {activeTab==='element' && (<>
            {selected ? (<>
              <div style={{...panel,background:'#1a1a2e',marginBottom:8}}>
                <div style={{fontSize:'0.68rem',color:'#555',marginBottom:3}}>Selected</div>
                <div style={{fontSize:'0.85rem',color:accent,fontWeight:700,fontFamily:'monospace'}}>&lt;{selected.tag}&gt;</div>
                {selected.text && <div style={{fontSize:'0.72rem',color:'#555',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{selected.text.slice(0,50)}</div>}
                <button onClick={()=>send({type:'scrollTo',id:selected.id})} style={{marginTop:8,width:'100%',padding:'5px',borderRadius:6,border:`1px solid ${accent}44`,background:'transparent',color:accent,cursor:'pointer',fontSize:'0.72rem'}}>
                  📍 Scroll to element
                </button>
              </div>
              <div style={panel}>
                <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#555',marginBottom:6}}>Colors</div>
                <ColorRow label="Text"         k="color"/>
                <ColorRow label="Background"   k="background"/>
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
                      <button key={a} onClick={()=>pushStyle({textAlign:a})} style={{padding:'3px 7px',borderRadius:5,border:`1px solid ${elStyles.textAlign===a?accent:'#333'}`,background:elStyles.textAlign===a?accent:'#1a1a2e',color:elStyles.textAlign===a?'white':'#666',cursor:'pointer',fontSize:'0.7rem'}}>{a[0].toUpperCase()}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={panel}>
                <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#555',marginBottom:6}}>Spacing & Shape</div>
                <SliderRow label="Padding"       k="padding"      min={0}  max={60}  unit="px"/>
                <SliderRow label="Margin Top"    k="marginTop"    min={0}  max={80}  unit="px"/>
                <SliderRow label="Margin Bottom" k="marginBottom" min={0}  max={80}  unit="px"/>
                <SliderRow label="Border Radius" k="borderRadius" min={0}  max={40}  unit="px"/>
                <SliderRow label="Width"         k="width"        min={10} max={100} unit="%"/>
                <SliderRow label="Opacity"       k="opacity"      min={0}  max={100} unit="%"/>
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
                Click any element in the document to select it
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
                <div style={{fontSize:'0.7rem',color:'#555',marginBottom:6}}>Double-click a cell to edit its text</div>
              </>)}
              <div style={{...panel,marginTop:12}}>
                <div style={{fontSize:'0.72rem',color:'#888',marginBottom:8}}>Insert New Table</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                  <div><div style={{fontSize:'0.7rem',color:'#666',marginBottom:3}}>Rows</div><input type="number" min={1} max={50} value={newRows} onChange={e=>setNewRows(Number(e.target.value))} style={{...inp,textAlign:'center'}}/></div>
                  <div><div style={{fontSize:'0.7rem',color:'#666',marginBottom:3}}>Columns</div><input type="number" min={1} max={12} value={newCols} onChange={e=>setNewCols(Number(e.target.value))} style={{...inp,textAlign:'center'}}/></div>
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
              {/* Placement tip */}
              <div style={{background:'rgba(124,111,255,0.1)',border:'1px solid rgba(124,111,255,0.3)',borderRadius:8,padding:'8px 10px',marginBottom:10,fontSize:'0.72rem',color:'#a89dff',lineHeight:1.6}}>
                <strong>How placement works:</strong><br/>
                1. Click an element in the doc to select it<br/>
                2. Click Insert — element appears right after<br/>
                3. Grab the <strong>⠿ handle</strong> (hover left edge) to drag it anywhere
              </div>

              {insertTip && (
                <div style={{background:'rgba(72,219,251,0.1)',border:'1px solid rgba(72,219,251,0.3)',borderRadius:8,padding:'8px 10px',marginBottom:10,fontSize:'0.72rem',color:'#48dbfb',lineHeight:1.6,animation:'fadeIn .3s'}}>
                  ✅ Inserted! Hover the element to see the <strong>⠿ drag handle</strong> on its left — drag to move it anywhere.
                </div>
              )}

              <div style={{fontSize:'0.68rem',color:'#555',marginBottom:6,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em'}}>
                {selected ? `↓ Inserting after <${selected.tag}>` : 'Will append to document end'}
              </div>
              {[
                {kind:'heading',   icon:'H',  label:'Heading',   desc:'H2 heading block'},
                {kind:'paragraph', icon:'¶',  label:'Paragraph', desc:'Body text block'},
                {kind:'callout',   icon:'💡', label:'Callout',   desc:'Tip / note box'},
                {kind:'card',      icon:'▣',  label:'Card',      desc:'Shadowed content card'},
                {kind:'divider',   icon:'—',  label:'Divider',   desc:'Horizontal rule'},
              ].map(({kind,icon,label,desc})=>(
                <button key={kind} onClick={()=>insertEl(kind)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',background:'#1a1a2e',border:'1px solid #252540',borderRadius:8,cursor:'pointer',marginBottom:7,textAlign:'left',transition:'border-color .15s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=accent}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='#252540'}>
                  <span style={{fontSize:'1.1rem',width:26,textAlign:'center'}}>{icon}</span>
                  <div><div style={{fontSize:'0.83rem',color:'#ddd',fontWeight:600}}>{label}</div><div style={{fontSize:'0.71rem',color:'#555'}}>{desc}</div></div>
                </button>
              ))}
            </div>
          )}

          {/* ── IMAGE TAB ── */}
          {activeTab==='image' && (
            <div>
              <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#555',marginBottom:6}}>Images</div>

              {/* Placement tip */}
              <div style={{background:'rgba(124,111,255,0.1)',border:'1px solid rgba(124,111,255,0.3)',borderRadius:8,padding:'8px 10px',marginBottom:10,fontSize:'0.72rem',color:'#a89dff',lineHeight:1.6}}>
                Images insert after the selected element. After inserting, hover the image to grab the <strong>⠿ handle</strong> and drag it exactly where you want.
              </div>

              {selected?.isImg && (
                <div style={{...panel,border:`1px solid ${accent}`,marginBottom:10}}>
                  <div style={{fontSize:'0.72rem',color:accent,fontWeight:700,marginBottom:8}}>📷 Selected Image</div>
                  {selected.imgSrc && <img src={selected.imgSrc} alt="" style={{width:'100%',maxHeight:100,objectFit:'cover',borderRadius:6,marginBottom:8}}/>}
                  <div style={{padding:'4px 0'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                      <span style={{fontSize:'0.8rem',color:'#bbb'}}>Width</span>
                      <span style={{fontFamily:'monospace',fontSize:'0.72rem',color:'#555'}}>{elStyles.width}%</span>
                    </div>
                    <input type="range" min={10} max={100} value={elStyles.width}
                      onChange={e=>{ const v=Number(e.target.value); setElStyles(s=>({...s,width:v})); if(selected.imgId) send({type:'setImgWidth',id:selected.imgId,width:v+'%'}); }}
                      style={{width:'100%',accentColor:accent}}/>
                  </div>
                  <div style={{display:'flex',gap:6,marginTop:8}}>
                    <button onClick={()=>imgUpRef.current?.click()} style={{flex:1,padding:'7px',borderRadius:8,border:`1px dashed ${accent}`,background:'transparent',color:accent,cursor:'pointer',fontWeight:600,fontSize:'0.78rem'}}>🔄 Replace</button>
                    <button onClick={deleteSelected} style={{flex:1,padding:'7px',borderRadius:8,border:'1px solid #c0392b',background:'#1a0a0a',color:'#e74c3c',cursor:'pointer',fontWeight:600,fontSize:'0.78rem'}}>🗑 Delete</button>
                  </div>
                </div>
              )}

              <div style={panel}>
                <div style={{fontSize:'0.72rem',color:'#888',marginBottom:8}}>Upload from device</div>
                <input ref={imgUpRef} type="file" accept="image/*" onChange={handleImageUpload} style={{display:'none'}}/>
                <button onClick={()=>imgUpRef.current?.click()} style={{width:'100%',padding:'10px',borderRadius:8,border:`1px dashed ${accent}`,background:'transparent',color:accent,cursor:'pointer',fontWeight:600,fontSize:'0.85rem',marginBottom:6}}>
                  📁 {selected?.isImg ? 'Replace Selected Image' : 'Upload & Insert Image'}
                </button>
                {uploadedPreview && (
                  <div style={{marginTop:8}}>
                    <img src={uploadedPreview} alt="preview" style={{width:'100%',maxHeight:140,objectFit:'cover',borderRadius:6,marginBottom:6}}/>
                    <button onClick={()=>{ doInsertImage(uploadedPreview); setUploadedPreview(null); }}
                      style={{width:'100%',padding:'7px',borderRadius:8,border:'none',background:'#27ae60',color:'white',cursor:'pointer',fontWeight:600,fontSize:'0.82rem'}}>
                      ✓ {selected?.isImg ? 'Replace Image' : 'Insert into Document'}
                    </button>
                    <button onClick={()=>setUploadedPreview(null)} style={{width:'100%',marginTop:4,padding:'5px',borderRadius:8,border:'1px solid #333',background:'transparent',color:'#666',cursor:'pointer',fontSize:'0.78rem'}}>Cancel</button>
                  </div>
                )}
              </div>

              <div style={panel}>
                <div style={{fontSize:'0.72rem',color:'#888',marginBottom:6}}>Or insert by URL</div>
                <input id="imgUrlInput" placeholder="https://example.com/photo.jpg" style={{...inp,marginBottom:6}} onChange={e=>setUrlPreview(e.target.value)}/>
                {urlPreview && <img src={urlPreview} alt="url preview" style={{width:'100%',maxHeight:120,objectFit:'cover',borderRadius:6,marginBottom:6}} onError={e=>e.target.style.display='none'}/>}
                <button onClick={()=>{
                  const src = document.getElementById('imgUrlInput')?.value?.trim();
                  if (!src) return;
                  doInsertImage(src);
                  setUrlPreview('');
                  document.getElementById('imgUrlInput').value='';
                }} style={{width:'100%',padding:'8px',borderRadius:8,border:'none',background:accent,color:'white',cursor:'pointer',fontWeight:600,fontSize:'0.82rem'}}>
                  Insert from URL
                </button>
              </div>
            </div>
          )}

          {/* ── CITE TAB ── */}
          {activeTab==='cite' && (
            <div>
              <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#555',marginBottom:10}}>APA 7th Edition Citations</div>
              <div style={panel}>
                <div style={{fontSize:'0.72rem',color:'#888',marginBottom:6}}>Describe the source</div>
                <textarea value={citeDesc} onChange={e=>setCiteDesc(e.target.value)}
                  placeholder={'e.g. "Smith, John, 2021, book called Deep Learning, MIT Press"\nor "CDC.gov article about COVID vaccines, March 2022"'}
                  style={{...inp,minHeight:80,resize:'vertical',marginBottom:8}}/>
                <button onClick={handleGenerateCitation} disabled={citeLoading||!citeDesc.trim()} style={{width:'100%',padding:'8px',borderRadius:8,border:'none',background:citeLoading?'#333':accent,color:'white',cursor:citeLoading?'not-allowed':'pointer',fontWeight:600,fontSize:'0.82rem'}}>
                  {citeLoading ? '⏳ Generating…' : '✦ Generate APA Citation'}
                </button>
                {citeError && <div style={{marginTop:6,fontSize:'0.72rem',color:'#e74c3c'}}>{citeError}</div>}
              </div>
              {citeResult && (
                <div style={panel}>
                  <div style={{fontSize:'0.72rem',fontWeight:700,color:accent,marginBottom:10}}>Generated Citations</div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:'0.68rem',color:'#555',marginBottom:4}}>PARENTHETICAL</div>
                    <div style={{fontFamily:'monospace',fontSize:'0.78rem',color:'#ddd',background:'#0d0d1a',padding:'8px 10px',borderRadius:6,marginBottom:6}}>{citeResult.intext}</div>
                    <button onClick={insertParenthetical} style={{width:'100%',padding:'6px',borderRadius:6,border:`1px solid ${accent}`,background:'transparent',color:accent,cursor:'pointer',fontWeight:600,fontSize:'0.75rem'}}>Insert Parenthetical</button>
                  </div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:'0.68rem',color:'#555',marginBottom:4}}>NARRATIVE</div>
                    <div style={{fontFamily:'monospace',fontSize:'0.78rem',color:'#ddd',background:'#0d0d1a',padding:'8px 10px',borderRadius:6,marginBottom:6}}>{citeResult.narrative}</div>
                    <button onClick={insertNarrative} style={{width:'100%',padding:'6px',borderRadius:6,border:`1px solid ${accent}`,background:'transparent',color:accent,cursor:'pointer',fontWeight:600,fontSize:'0.75rem'}}>Insert Narrative</button>
                  </div>
                  <div>
                    <div style={{fontSize:'0.68rem',color:'#555',marginBottom:4}}>REFERENCE LIST ENTRY</div>
                    <div style={{fontFamily:'monospace',fontSize:'0.75rem',color:'#bbb',background:'#0d0d1a',padding:'8px 10px',borderRadius:6,lineHeight:1.5}}>{citeResult.reference}</div>
                  </div>
                </div>
              )}
              {refList.length > 0 && (
                <div style={panel}>
                  <div style={{fontSize:'0.72rem',fontWeight:700,color:'#888',marginBottom:8}}>Reference List ({refList.length})</div>
                  {refList.map((r,i)=>(
                    <div key={i} style={{fontSize:'0.7rem',color:'#666',marginBottom:6,paddingLeft:'1em',textIndent:'-1em',lineHeight:1.5}}>{r}</div>
                  ))}
                  <button onClick={insertReferenceList} style={{width:'100%',marginTop:8,padding:'7px',borderRadius:8,border:'none',background:'#27ae60',color:'white',cursor:'pointer',fontWeight:600,fontSize:'0.8rem'}}>Insert References Section</button>
                  <button onClick={()=>setRefList([])} style={{width:'100%',marginTop:4,padding:'5px',borderRadius:8,border:'1px solid #333',background:'transparent',color:'#666',cursor:'pointer',fontSize:'0.75rem'}}>Clear List</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Export panel ── */}
        <div style={{padding:'10px',borderTop:'1px solid #1e1e32',flexShrink:0}}>
          <button onClick={handleDownload} disabled={downloading||noHtml} style={{
            width:'100%',padding:'10px',borderRadius:8,border:'none',
            background:noHtml?'#1a1a2e':downloading?'#333':'linear-gradient(135deg,#27ae60,#2ecc71)',
            color:noHtml?'#444':'white',fontWeight:700,fontSize:'0.88rem',
            cursor:noHtml?'not-allowed':'pointer',
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
            <iframe ref={iframeRef} srcDoc={liveHtml}
              style={{width:'100%',height:'100%',border:'none',display:'block',visibility:viewMode==='edit'?'visible':'hidden',position:'absolute',inset:0}}
              title="PDF Editor Preview"/>
            {viewMode === 'pdf' && (
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#1a1a2e'}}>
                {pdfLoading ? (
                  <div style={{color:'#555',fontSize:'0.9rem',textAlign:'center'}}>
                    <div style={{fontSize:'2.5rem',marginBottom:12}}>⏳</div>Rendering PDF preview…
                  </div>
                ) : pdfError ? (
                  <div style={{color:'#e74c3c',fontSize:'0.85rem',textAlign:'center',padding:24}}>
                    <div style={{fontSize:'2rem',marginBottom:8}}>⚠️</div>
                    {pdfError}
                    <button onClick={loadPdfPreview} style={{display:'block',margin:'12px auto 0',padding:'7px 16px',borderRadius:8,border:`1px solid ${accent}`,background:'transparent',color:accent,cursor:'pointer',fontWeight:600}}>Retry</button>
                  </div>
                ) : pdfBlobUrl ? (
                  <object data={pdfBlobUrl} type="application/pdf" style={{width:'100%',height:'100%',border:'none'}}>
                    <div style={{color:'#aaa',textAlign:'center',padding:40}}>
                      <p>PDF preview blocked by browser.</p>
                      <a href={pdfBlobUrl} download="preview.pdf" style={{color:accent,fontWeight:600}}>⬇ Download to view</a>
                    </div>
                  </object>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}