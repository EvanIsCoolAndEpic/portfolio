/* Portfolio app. Content lives in content.js; nothing in here needs editing to add work. */
(() => {
  'use strict';
  const C = window.PORTFOLIO;
  if (!C || !Array.isArray(C.books)) { console.error('content.js did not load'); return; }

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
  };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 760px)');
  const inFrame = (() => { try { return window.top !== window.self; } catch (e) { return true; } })();
  const metaLine = p => [p.type, p.year].filter(Boolean).map(esc).join(' · ');
  const mono = esc(C.monogram || C.name.split(/\s+/).map(w => w[0]).join('').slice(0, 3).toUpperCase());

  /* Icons: Phosphor Icons (regular weight, MIT), inlined from @phosphor-icons/core@2.1.1. */
  const ICONS = {
    "arrow-left": "<path d=\"M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z\"/>",
    "arrow-right": "<path d=\"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z\"/>",
    "arrow-up-right": "<path d=\"M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z\"/>",
    "x": "<path d=\"M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z\"/>",
    "copy": "<path d=\"M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z\"/>",
    "link": "<path d=\"M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z\"/>",
    "list-bullets": "<path d=\"M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z\"/>",
    "images": "<path d=\"M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z\"/>",
    "asterisk": "<path d=\"M214.86,180.12a8,8,0,0,1-11,2.74L136,142.13V216a8,8,0,0,1-16,0V142.13L52.12,182.86a8,8,0,1,1-8.23-13.72L112.45,128,43.89,86.86a8,8,0,1,1,8.23-13.72L120,113.87V40a8,8,0,0,1,16,0v73.87l67.88-40.73a8,8,0,1,1,8.23,13.72L143.55,128l68.56,41.14A8,8,0,0,1,214.86,180.12Z\"/>",
    "trophy": "<path d=\"M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-29,64.64-64,64.9a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z\"/>",
    "play": "<path d=\"M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z\"/>"
    };
  const icon = (n, cls = '') => `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 256 256" aria-hidden="true" focusable="false">${ICONS[n]}</svg>`;


  /* ---------- content model ---------- */
  const BOOKS = C.books;
  const ALL = [];
  BOOKS.forEach((b, bi) => {
    b.slot = (bi % 6) + 1;
    b.projects = b.projects.filter(p => !p.hidden);
    b.projects.forEach((p, k) => { p.book = b; p.k = k; p.items = itemsOf(p); p.items.forEach((it, m) => { it.m = m; }); ALL.push(p); });
    const ys = b.projects.flatMap(p => String(p.year).match(/\d{4}/g) || []).map(Number);
    b.years = ys.length ? (Math.min(...ys) === Math.max(...ys) ? String(ys[0]) : `${Math.min(...ys)}-${Math.max(...ys)}`) : '';
  });
  function itemsOf(p) {
    const ph = p.placeholder ? [].concat(p.placeholder) : [];
    if (Array.isArray(p.media) && p.media.length) return p.media.map(m => ({ ...m, art: m.art || ph[0] }));
    return ph.map(a => ({ type: 'art', art: a }));
  }

  /* ---------- media + generated art ---------- */
  function codeHTML(src) {
    return esc(src).replace(/(\/\/[^\n]*)/g, '<span class="c">$1</span>');
  }
  function artHTML(a, mode) {
    if (!a) return '<span class="vid-blank"></span>';
    const thumb = mode === 'thumb';
    switch (a.kind) {
      case 'video':
        return thumb
          ? `<span class="art a-video grainy" style="--sky:${a.sky};--ground:${a.ground}"><span class="play"></span></span>`
          : `<span class="art a-video"><span class="pv-frame"><span class="pv-scene grainy" style="--sky:${a.sky};--ground:${a.ground}"><span class="play"></span></span></span></span>`;
      case 'photo':
        return `<span class="art a-photo grainy${a.wide ? ' wide' : ''}" style="--t:${a.tone}"></span>`;
      case 'poster': {
        const bands = (a.bands || []).map(([c, r, t]) => `<span class="pd-band" style="--bc:${c};--br:${r};top:${t}"></span>`).join('');
        return `<span class="art a-poster grainy" style="--pbg:${a.bg};--pfg:${a.fg};${a.size ? `--psz:${a.size};` : ''}${a.stretch ? `--pst:${a.stretch};` : ''}${a.tt ? `--ptt:${a.tt};` : ''}">${bands}<span class="pd-word">${a.word}</span></span>`;
      }
      case 'code':
        return `<span class="art a-code">${codeHTML(a.code)}</span>`;
      case 'wave': {
        const bars = Array.from({ length: 56 }, (_, i) => {
          const h = 18 + Math.abs(Math.sin(i * .55) * 48 + Math.sin(i * 1.9) * 22 + Math.cos(i * .21) * 12);
          return `<span style="height:${Math.min(98, h).toFixed(0)}%"></span>`;
        }).join('');
        return `<span class="art a-wave">${bars}</span>`;
      }
      case 'sketch':
        return `<span class="art a-sketch"><i style="left:10%;top:12%;width:26%;height:26%"></i><i style="left:44%;top:16%;width:18%;height:30%;border-radius:4px"></i><i style="left:68%;top:10%;width:22%;height:22%;border-radius:0"></i><b style="left:12%;top:44%">DSLR</b><b style="left:44%;top:52%;transform:rotate(-4deg)">motion sensor?</b><b style="left:10%;top:76%">weatherproof box</b></span>`;
      default:
        return '<span class="vid-blank"></span>';
    }
  }
  function mediaHTML(it, mode) {
    if (!it) return '';
    if (it.type === 'image') {
      return `<img src="${esc(it.src)}" alt="${esc(it.alt || '')}"${mode === 'full' ? '' : ' loading="lazy"'} decoding="async">`;
    }
    if (it.type === 'video') {
      if (mode === 'full') {
        if (it.embed) return `<iframe src="${esc(it.embed)}" title="${esc(it.alt || 'Video')}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        if (it.src) return `<video src="${esc(it.src)}"${it.poster ? ` poster="${esc(it.poster)}"` : ''} controls autoplay playsinline></video>`;
      }
      if (mode === 'thumb' && !it.poster && it.art) return artHTML(it.art, 'thumb');
      const face = it.poster
        ? `<img src="${esc(it.poster)}" alt="${esc(it.alt || '')}" loading="lazy" decoding="async">`
        : (it.art ? artHTML(it.art, mode === 'thumb' ? 'thumb' : 'plate') : '<span class="vid-blank"></span>');
      return `<span class="vid">${face}${it.poster ? '<span class="play" aria-hidden="true"></span>' : ''}</span>`;
    }
    if (it.type === 'art') return artHTML(it.art, mode === 'thumb' ? 'thumb' : 'plate');
    return '';
  }

  /* ---------- header ---------- */
  function buildHeader() {
    $('#siteName').textContent = C.name;
    $('#siteRole').textContent = C.role || '';
    document.title = `${C.name}${C.role ? ` | ${C.role}` : ''}`;
  }

  /* ---------- shelf ---------- */
  const HEIGHTS = [262, 288, 246, 272, 256, 280];
  function dims(b) {
    const i = BOOKS.indexOf(b);
    if (b.flat) return { w: b.spine?.w ?? 168, h: b.spine?.h ?? 34 };
    return { w: b.spine?.w ?? (44 + Math.min(b.projects.length, 8) * 5 + (i % 2 ? 9 : 0)), h: b.spine?.h ?? HEIGHTS[i % HEIGHTS.length] };
  }
  function spine(b, order) {
    const d = dims(b);
    const label = `Open ${b.title}${b.peek ? `, ${b.peek}` : ''}`;
    return `<button class="book${b.flat ? ' flat top' : ''}" data-open="${esc(b.id)}" data-fill="${b.slot}" style="--w:${d.w};--h:${d.h};--i:${order};--c:var(--b${b.slot});--fc:var(--f${b.slot})" aria-label="${esc(label)}">`
      + `<span class="ribbon" aria-hidden="true"></span>${b.peek ? `<span class="peek" aria-hidden="true">${esc(b.peek)}</span>` : ''}`
      + `<span class="sp-title">${esc(b.title)}</span><span class="mark" aria-hidden="true">${mono}</span></button>`;
  }
  function buildShelf() {
    const up = BOOKS.filter(b => !b.flat), flat = BOOKS.filter(b => b.flat);
    let h = '<div class="bookend decor-obj" aria-hidden="true"></div>';
    up.forEach((b, i) => { h += spine(b, i); });
    h += '<div class="book lean decor-obj" style="--w:40;--h:236" aria-hidden="true"></div><div class="gap decor-obj" aria-hidden="true"></div>';
    flat.forEach((b, i) => { h += `<div class="stack">${spine(b, up.length + i)}<div class="book flat under decor-obj" style="--w:${Math.max(182, dims(b).w - 18)};--h:28" aria-hidden="true"></div></div>`; });
    h += `<div class="cup decor-obj" aria-hidden="true"><span class="pencil" style="left:20%;transform:rotate(-9deg)"></span><span class="pencil" style="left:44%;transform:rotate(4deg);height:calc(var(--u)*76)"></span><span class="pencil" style="left:64%;transform:rotate(13deg);height:calc(var(--u)*84)"></span></div>`;
    $('#row').innerHTML = h;
    $('#scene').dataset.dim = `${BOOKS.length} books · ${ALL.length} projects`;
    markRibbon();
  }
  function markRibbon() {
    const id = store.get('ee-bookmark');
    $$('.book[data-open]').forEach(b => b.classList.toggle('marked', b.dataset.open === id));
  }
  let lastU = 0;
  function sizeShelf() {
    const scene = $('#scene'), row = $('#row');
    if (!scene || !scene.clientWidth) return;
    const measure = u => { scene.style.setProperty('--u', u + 'px'); row.style.width = 'max-content'; const w = row.getBoundingClientRect().width; row.style.width = ''; return w; };
    const w1 = measure(1), w2 = measure(2);
    const slope = Math.max(1, w2 - w1), fixed = w1 - slope;
    const byW = (scene.clientWidth - fixed - 4) / slope;
    const tallest = Math.max(...BOOKS.filter(b => !b.flat).map(b => dims(b).h)) + 70;
    const byH = (window.innerHeight * 0.54) / tallest;
    const u = Math.max(0.42, Math.min(1.35, byW, byH));
    lastU = u;
    scene.style.setProperty('--u', u.toFixed(3) + 'px');
  }

  /* ---------- decor: Bauhaus shapes on the wall behind the shelf ---------- */
  const DECOR = `
      <span class="d" style="right:-7vw;top:-9vh;width:30vw;height:30vw;border-radius:50%;background:#b8301e"></span>
      <span class="d" style="left:-6vw;bottom:-16vh;width:28vw;height:28vw;border-radius:50%;background:#1f4aa8"></span>
      <span class="d sm-hide" style="left:5vw;top:14%;width:0;height:0;border-left:5vw solid transparent;border-right:5vw solid transparent;border-bottom:8.6vw solid #f2c12e"></span>
      <span class="d sm-hide" style="right:7vw;bottom:18%;width:16vw;height:1.2vw;background:#161616;transform:rotate(-30deg)"></span>
      <span class="d sm-hide" style="right:24vw;bottom:30%;width:2.2vw;height:2.2vw;background:#161616"></span>`;

  /* ---------- work grid ---------- */
  function thumbHTML(p) {
    const it = p.items[0];
    if (!it) return `<span class="art a-photo" style="--t:var(--paper)"></span>`;
    if (it.type === 'image') return `<img src="${esc(it.thumb || it.src)}" alt="" loading="lazy" decoding="async">`;
    return mediaHTML(it, 'thumb');
  }
  function buildWork() {
    $('#filters').innerHTML = [`<button class="chip" data-filter="all" aria-pressed="true">All</button>`]
      .concat(BOOKS.filter(b => b.projects.length).map(b => `<button class="chip" data-filter="${esc(b.id)}" aria-pressed="false">${esc(b.title)}</button>`)).join('');
    $('#cards').innerHTML = ALL.map(p => `<li data-book="${esc(p.book.id)}"${p.k === 0 ? ' class="featured"' : ''}><a class="card" href="#${esc(p.book.id)}.${esc(p.slug)}" data-open="${esc(p.book.id)}" data-slug="${esc(p.slug)}" data-slot="${p.book.slot}" style="--c:var(--b${p.book.slot})">`
      + `<span class="thumb">${thumbHTML(p)}</span><span class="card-text"><span class="card-title">${esc(p.title)}</span><span class="card-kicker">${metaLine(p)}</span></span></a></li>`).join('');
  }
  function filterWork(id) {
    $$('#filters .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filter === id)));
    $$('#cards li').forEach(li => { li.hidden = id !== 'all' && li.dataset.book !== id; });
  }

  /* ---------- about ---------- */
  function buildAbout() {
    const a = C.about || {};
    $('#portrait').innerHTML = a.photo ? `<img src="${esc(a.photo)}" alt="Portrait of ${esc(C.name)}">` : `<span class="mono" aria-hidden="true">${mono}</span>`;
    $('#aboutText').innerHTML = (a.text || []).map(t => `<p>${esc(t)}</p>`).join('');
    $('#disc').innerHTML = BOOKS.map(b => `<dt><a href="#${esc(b.id)}" data-open="${esc(b.id)}">${esc(b.title)}</a></dt><dd>${esc(b.blurb || '')}</dd>`).join('');
    $('#avail').textContent = C.availability || '';
    $('#avail').hidden = !C.availability;
    $('#email').textContent = C.email;
    $('#copyEmail').dataset.copy = C.email;
    $('#resumeRow').innerHTML = C.resume ? `<a class="btn" href="${esc(C.resume)}" target="_blank" rel="noopener">Résumé (PDF)${icon('arrow-up-right')}</a>` : '';
    $('#resumeRow').hidden = !C.resume;
    $('#links').innerHTML = (C.links || []).map(l => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}${icon('arrow-up-right')}</a></li>`).join('');
    $('#copyright').textContent = `© ${new Date().getFullYear()} ${C.name}`;
    $('#loc').textContent = C.location || '';
  }

  async function copyText(text, btn) {
    const out = btn.querySelector('.lbl') || btn;
    const label = btn.dataset.label || (btn.dataset.label = out.textContent);
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) { ok = false; }
    if (!ok) {
      const src = btn.closest('[data-copy-scope]')?.querySelector('[data-copy-src]');
      if (src) { const r = document.createRange(); r.selectNodeContents(src); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    }
    out.textContent = ok ? 'Copied' : 'Selected, copy it';
    btn.classList.add('copied');
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { out.textContent = label; btn.classList.remove('copied'); }, 1800);
  }

  /* ---------- reader ---------- */
  const site = $('#site'), reader = $('#reader'), spread = $('#spread'), L = $('#pageL'), R = $('#pageR');
  let V = null, P = [], pos = -1, single = false, pushed = false, lastFocus = null;
  let turning = null, turnTo = null, queued = null;   // the page turn under way, the spread it lands on, the next one asked for

  /* Each book is designed for its medium. 'photo' is a photobook on square pages,
     'film' a screening programme, 'notebook' an engineering notebook. Pages are built
     per mode because a photo running across two pages becomes one page on a phone. */
  const fmt = b => b.format || 'notebook';
  // A book with no projects yet opens as a blank book: ruled, empty contents and an "in progress" note.
  const isBlank = b => !b.projects.length;
  const photosN = n => `${n} photograph${n === 1 ? '' : 's'}`;
  const blankRows = (cls, n) => `<ol class="${cls} toc-blank" aria-hidden="true">${'<li></li>'.repeat(n)}</ol>`;

  /* ----- photo book: one or two photographs to a page, set with margins like a printed photobook ----- */
  const orient = it => ((it.ratio || 1.5) < 1 ? 'P' : 'L');
  const roman = n => ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n] || String(n);
  const pad2 = n => String(n).padStart(2, '0');
  // The frame photographs sit in, in % of the page's width (cqw): 9 at the sides, 8 above, 12 below for
  // the running foot. Pages are square on a spread and taller on a phone (keep in step with --pa in styles.css).
  const frame = one => ({ w: 82, h: (one ? 100 / 0.72 : 100) - 20, gap: 3 });
  // Big chapters (sports, events) put two to a page more often; small ones breathe.
  const RHYTHM = { small: ['solo', 'two', 'solo', 'quiet', 'solo', 'two'], big: ['two', 'solo', 'two', 'two', 'quiet', 'two', 'solo'] };

  // Group a chapter's photographs into pages, in the order they were listed: one to a page, two of the
  // same shape to a page (portraits side by side, landscapes one above the other), or one small and alone.
  function packChapter(items) {
    const q = items.slice(), out = [], rhythm = items.length > 14 ? RHYTHM.big : RHYTHM.small;
    let r = 0;
    while (q.length) {
      const a = q[0], b = q[1];
      if (a.feature && orient(a) === 'L') { out.push({ tpl: 'feature', its: q.splice(0, 1) }); continue; }
      let want = rhythm[r++ % rhythm.length];
      if (want === 'two' && !(b && !(b.feature && orient(b) === 'L') && orient(a) === orient(b))) want = 'solo';
      if (want === 'quiet' && q.length < 3) want = 'solo';
      out.push(want === 'two' ? { tpl: orient(a) === 'P' ? 'pair' : 'stack', its: q.splice(0, 2) } : { tpl: want, its: q.splice(0, 1) });
    }
    return out;
  }

  // Lay a chapter out page by page. On a spread it opens with its text on the left and its first photograph
  // on the right, a photograph marked `feature` runs across a whole spread, and it ends on a right-hand page
  // so the next chapter opens on a spread too.
  function planChapter(p, one, first) {
    const [opener, ...rest] = p.orig;
    const plan = [{ t: 'ph-ch', p }];
    if (!opener) return plan;
    plan.push({ t: 'ph-page', p, tpl: 'solo', its: [opener] });
    const groups = packChapter(rest), at = () => first + plan.length, page = g => ({ t: 'ph-page', p, tpl: g.tpl, its: g.its });
    while (groups.length) {
      const g = groups.shift();
      if (g.tpl !== 'feature') { plan.push(page(g)); continue; }
      if (one) { plan.push({ t: 'ph-page', p, tpl: 'solo', its: g.its }); continue; }
      if (at() % 2) {   // on a right-hand page: fill it with the next single photograph, or leave it white
        const k = groups.findIndex(x => x.tpl === 'solo' || x.tpl === 'quiet');
        plan.push(k >= 0 ? page(groups.splice(k, 1)[0]) : { t: 'blank' });
      }
      plan.push({ t: 'ph-half', p, it: g.its[0], side: 'L' }, { t: 'ph-half', p, it: g.its[0], side: 'R' });
    }
    if (!one && at() % 2) {
      // ending on a left-hand page: give the last pair after any spread a page each, or leave the facing page white
      let k = -1;
      for (let i = plan.length - 1; i > 1 && plan[i].t !== 'ph-half'; i--) if (plan[i].its && plan[i].its.length === 2) { k = i; break; }
      if (k >= 0) { const d = plan[k]; plan.splice(k, 1, { ...d, tpl: 'solo', its: [d.its[0]] }, { ...d, tpl: 'solo', its: [d.its[1]] }); }
      else plan.push({ t: 'blank' });
    }
    return plan;
  }

  // Where each photograph sits in the frame, in cqw. Photographs are never cropped: every box has the photo's own shape.
  function layout(tpl, its, F, side) {
    const r = its.map(it => it.ratio || 1.5), lift = 0.42, n = v => Math.round(v * 100) / 100;   // a touch above centre reads as centred
    let boxes;
    if (tpl === 'pair') {
      const h = Math.min(F.h, (F.w - F.gap) / (r[0] + r[1])), w0 = h * r[0], w1 = h * r[1], x = (F.w - w0 - w1 - F.gap) / 2, y = (F.h - h) * lift;
      boxes = [{ it: its[0], x, y, w: w0, h }, { it: its[1], x: x + w0 + F.gap, y, w: w1, h }];
    } else if (tpl === 'stack') {
      const w = Math.min(F.w, (F.h - F.gap) / (1 / r[0] + 1 / r[1])), h0 = w / r[0], h1 = w / r[1], x = (F.w - w) / 2, y = (F.h - h0 - h1 - F.gap) * lift;
      boxes = [{ it: its[0], x, y, w, h: h0 }, { it: its[1], x, y: y + h0 + F.gap, w, h: h1 }];
    } else if (tpl === 'quiet') {
      // small and low on the page, against the outer margin
      const s = 44, w = r[0] >= 1 ? s : s * r[0], h = r[0] >= 1 ? s / r[0] : s;
      boxes = [{ it: its[0], x: single ? (F.w - w) / 2 : side === 'odd' ? F.w - w : 0, y: F.h - h, w, h, small: true }];
    } else {
      const w = Math.min(F.w, F.h * r[0]), h = w / r[0];
      boxes = [{ it: its[0], x: (F.w - w) / 2, y: (F.h - h) * lift, w, h }];
    }
    return boxes.map(b => ({ ...b, x: n(b.x), y: n(b.y), w: n(b.w), h: n(b.h) }));
  }

  function buildPhotoPages(b, one, pages) {
    const add = (...ps) => pages.push(...ps);
    const onRight = () => !one && pages.length % 2 === 1;
    if (!one) add({ t: 'endpaper' });
    add({ t: 'ph-title' });
    b.tocPage = pages.length;
    add({ t: 'ph-contents' });
    if (b.intro) add({ t: 'ph-fore' });
    let part = null, partNo = 0;
    b.projects.forEach((p, ci) => {
      p.orig = p.orig || p.items.slice();
      p.no = ci + 1;
      if (p.part && p.part !== part) {
        part = p.part; partNo++;
        if (onRight()) add({ t: 'blank' });
        if (!one) add({ t: 'ph-part-color', part, n: partNo });
        add({ t: 'ph-part', part, n: partNo });
      }
      if (onRight()) add({ t: 'blank' });
      p.start = pages.length;
      const plan = planChapter(p, one, pages.length);
      add(...plan);
      // the viewer follows the order the photographs appear on the pages
      p.items = plan.flatMap(d => d.its || (d.side === 'L' ? [d.it] : []));
      p.items.forEach((it, m) => { it.m = m; });
      p.end = pages.length - 1;
    });
    b.endPage = pages.length;
    b.endLabel = 'Colophon';
    add({ t: 'ph-colophon' });
    if (!one) { if (pages.length % 2 === 0) add({ t: 'blank' }); add({ t: 'endpaper' }); }
  }

  function buildPages(b, one) {
    const f = fmt(b), pages = [];
    const add = (...ps) => pages.push(...ps);
    b.endLabel = 'The end';
    if (f === 'photo') {
      buildPhotoPages(b, one, pages);
    } else {
      add({ t: 'title' });
      b.tocPage = pages.length;
      add({ t: 'contents' });
      let fig = 0;
      b.projects.forEach(p => {
        p.start = pages.length;
        p.fig = ++fig;
        add(f === 'film' ? { t: 'film-a', p } : { t: 'nb-text', p }, f === 'film' ? { t: 'film-b', p } : { t: 'nb-fig', p });
        // a notebook project can carry a longer report: one section per page after the figure,
        // padded to a full spread so the next project still opens on a left-hand page
        if (f === 'notebook' && Array.isArray(p.report)) {
          p.report.forEach((sec, k) => add({ t: 'nb-report', p, sec, k }));
          if (!one && p.report.length % 2) add({ t: 'nb-grid', p });
        }
        p.end = pages.length - 1;
      });
      b.endPage = pages.length;
      add({ t: 'end' }, { t: 'back' });
    }
    return pages;
  }

  const folio = i => `<div class="folio"><span>${i + 1}</span></div>`;
  const zoom = (p, it, inner, cls = '') => `<button class="zoom${cls ? ' ' + cls : ''}" data-lb="${p.k}" data-m="${it.m}" aria-label="View larger: ${esc(it.alt || p.title)}">${inner}</button>`;
  const fill_ = it => it.type === 'image' ? `<img src="${esc(it.src)}" alt="${esc(it.alt || '')}" decoding="async">`
    : it.type === 'video' && it.poster ? `<img src="${esc(it.poster)}" alt="${esc(it.alt || '')}" decoding="async">`
    : artHTML(it.art, 'thumb');
  const credits = p => {
    const rows = p.credits || [p.role && ['Role', p.role], p.tools && ['Tools', p.tools]].filter(Boolean);
    return rows.length ? `<dl class="credits">${rows.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl>` : '';
  };
  const linkBtn = p => p.link ? `<a class="act" href="${esc(p.link.url)}" target="_blank" rel="noopener">${esc(p.link.label || 'Visit')}${icon('arrow-up-right')}</a>` : '';
  const otherBooks = () => BOOKS.filter(b => b !== V).map(b => `<button class="act" data-switch="${esc(b.id)}">${esc(b.title)}</button>`).join('');
  const contactBlock = () => `<div data-copy-scope><p class="end-email" data-copy-src>${esc(C.email)}</p><div class="acts" style="margin-top:2cqw"><button class="act" data-copy="${esc(C.email)}">${icon('copy')}<span class="lbl">Copy email</span></button></div></div>`;
  const phImg = (it, big) => `<img src="${esc(big ? it.src : (it.thumb || it.src))}" alt="${esc(it.alt || '')}" decoding="async"${it.pos ? ` style="object-position:${esc(it.pos)}"` : ''}>`;
  const phFoot = (i, p) => `<div class="ph-foot"><span class="n">${i + 1}</span><span class="t">${esc(p.title)}</span></div>`;

  function band(p, side) {
    const it = p.items[0];
    const media = it ? fill_(it) : '<span class="vid-blank"></span>';
    const inner = `<span class="band-media">${media}</span>`;
    return `<div class="band ${side}">${it ? zoom(p, it, inner, 'band-zoom') : inner}<span class="band-play" aria-hidden="true">${icon('play')}</span></div>`;
  }

  function coverHTML() {
    if (fmt(V) === 'photo') {
      const it = V.cover ? V.projects.flatMap(p => p.items).find(x => x.id === V.cover) : (V.projects[0] && V.projects[0].items[0]);
      // the window follows the cover photo's shape; a blank book shows an empty portrait plate
      return `<div class="ph-cover"><span class="tip${it ? (orient(it) === 'P' ? ' is-p' : '') : ' blank is-p'}">${it ? fill_(it) : ''}</span>`
        + `<div class="ph-cover-foot"><h2 class="ph-cover-t">${esc(V.title)}</h2><span class="ph-cover-by"><span class="tri" aria-hidden="true"></span>${esc(C.name)}</span></div></div>`;
    }
    return `<div class="cover-in"><h2 class="cv-title">${esc(V.title)}</h2><span class="cv-sub">${esc(C.name)}</span><span class="mark cv-mark" aria-hidden="true">${mono}</span></div>`;
  }

  function page(i) {
    if (i === -1) return { cls: 'odd cover', html: coverHTML() };
    if (i < -1 || i >= P.length) return { cls: 'void', html: '' };
    const d = P[i], side = i % 2 ? 'odd' : 'even';
    let h = '', extra = '';
    switch (d.t) {
      case 'blank': h = '<div class="pg"></div>'; break;
      case 'endpaper': extra = ' ph-endpaper'; h = '<div class="pg"></div>'; break;

      /* photo book */
      case 'ph-title': {
        const n = V.projects.reduce((s, p) => s + p.orig.length, 0), c = V.projects.length;
        h = `<div class="ph-text ph-titlepg"><span class="tri" aria-hidden="true"></span><h2 class="ph-big">${esc(V.title)}</h2><p class="ph-by">${esc(C.name)}</p>`
          + `${n ? `<p class="ph-small">${photosN(n)} in ${c} chapter${c === 1 ? '' : 's'}</p>` : ''}</div>`;
        break;
      }
      case 'ph-fore':
        h = `<div class="ph-text ph-forepg"><p class="ph-small">Foreword</p><p class="ph-fore">${esc(V.intro)}</p><p class="ph-by">${esc(C.name)}</p></div>`;
        break;
      case 'ph-part-color':
        extra = ' ph-colorpg';
        h = `<div class="ph-text ph-partno"><p class="ph-small">Part ${roman(d.n)}</p><h2 class="ph-partname">${esc(d.part)}</h2></div>`;
        break;
      case 'ph-ch': {
        const p = d.p;
        h = `<div class="ph-text ph-chpg"><p class="ph-chno">${pad2(p.no)}</p><div class="ph-chtext"><h3 class="ph-cht">${esc(p.title)}</h3>`
          + `${(p.text || []).map(t => `<p>${esc(t)}</p>`).join('')}${credits(p)}<p class="ph-small">${photosN(p.orig.length)}</p></div></div>`;
        break;
      }
      case 'ph-contents': {
        if (isBlank(V)) { h = `<div class="ph-text ph-toc-pg"><h3 class="ph-t">Contents</h3>${blankRows('ph-toc', 7)}<p class="ph-small">In progress</p></div>`; break; }
        const parts = [];
        V.projects.forEach(p => { const k = p.part || ''; let g = parts.find(x => x.k === k); if (!g) parts.push(g = { k, list: [] }); g.list.push(p); });
        const row = p => `<li><button data-goto="${p.start}"><span class="no">${pad2(p.no)}</span><span class="t">${esc(p.title)}</span><span class="c">${p.orig.length}</span><span class="n">${p.start + 1}</span></button></li>`;
        h = `<div class="ph-text ph-toc-pg"><h3 class="ph-t">Contents</h3>${parts.map((g, k) => `<div class="ph-toc-part">${g.k ? `<p class="ph-toc-h"><span>${roman(k + 1)}</span>${esc(g.k)}</p>` : ''}<ol class="ph-toc">${g.list.map(row).join('')}</ol></div>`).join('')}</div>`;
        break;
      }
      case 'ph-part': {
        const list = V.projects.filter(p => p.part === d.part);
        // on a spread the part's name is on the colour page opposite; a phone shows it here
        h = `<div class="ph-text ph-part">${single ? `<div><p class="ph-small">Part ${roman(d.n)}</p><h2 class="ph-part-t">${esc(d.part)}</h2></div>` : '<p class="ph-small">In this part</p>'}`
          + `<ol class="ph-toc">${list.map(p => `<li><button data-goto="${p.start}"><span class="no">${pad2(p.no)}</span><span class="t">${esc(p.title)}</span><span class="c">${p.orig.length}</span><span class="n">${p.start + 1}</span></button></li>`).join('')}</ol></div>`;
        break;
      }
      case 'ph-page': {
        const F = frame(single);
        h = `<div class="ph-fr" style="height:${F.h}cqw">${layout(d.tpl, d.its, F, side).map(b => `<div class="ph-c" style="left:${b.x}cqw;top:${b.y}cqw;width:${b.w}cqw;height:${b.h}cqw">`
          + `${zoom(d.p, b.it, phImg(b.it, !b.small), 'ph-zoom')}</div>`).join('')}</div>${phFoot(i, d.p)}`;
        break;
      }
      case 'ph-half':
        h = `<div class="ph-half ${d.side}">${zoom(d.p, d.it, phImg(d.it, true), 'ph-zoom')}</div>`;
        break;
      case 'ph-colophon': {
        const n = V.projects.reduce((s, p) => s + p.orig.length, 0);
        h = `<div class="ph-text ph-colo"><p class="ph-small">${!n ? 'More soon.' : V.byline ? `${photosN(n)}. ${esc(V.byline)}` : `${photosN(n)} by ${esc(C.name)}.`}</p>${contactBlock()}<div class="end-books">${otherBooks()}</div></div>`;
        break;
      }

      /* shared front and back matter */
      case 'title':
        h = `<div class="pg pg-title"><h2 class="tp-title">${esc(V.title)}</h2>${V.intro ? `<p class="lede">${esc(V.intro)}</p>` : ''}<p class="tp-meta">${isBlank(V) ? 'In progress' : `${V.projects.length} project${V.projects.length === 1 ? '' : 's'}${V.years ? ` · ${V.years}` : ''}`}</p></div>`;
        break;
      case 'contents':
        if (isBlank(V)) { h = `<div class="pg pg-contents"><h3 class="pg-label">Contents</h3>${blankRows('toc', 6)}<p class="note">pages to come</p>${folio(i)}</div>`; break; }
        h = `<div class="pg pg-contents"><h3 class="pg-label">Contents</h3><ol class="toc">${V.projects.map(p => `<li><button data-goto="${p.start}"><span class="t">${esc(p.title)}${p.award ? ` ${icon('trophy', 'toc-award')}` : ''}</span><span class="y">${esc(p.year)}</span><span class="n">${p.start + 1}</span></button></li>`).join('')}</ol>${folio(i)}</div>`;
        break;
      case 'end':
        h = `<div class="pg pg-end"><h3 class="ph">${isBlank(V) ? 'More soon.' : 'Thanks for reading.'}</h3>${contactBlock()}<div class="end-books">${otherBooks()}</div>${folio(i)}</div>`;
        break;
      case 'back':
        extra = ' endpaper-pat';
        h = `<div class="pg pg-back"><span class="mark" aria-hidden="true">${mono}</span></div>`;
        break;

      /* film programme */
      case 'film-a': {
        const p = d.p;
        h = `<div class="film-pg${single ? ' one' : ''}">${band(p, single ? 'full' : 'L')}<div class="film-body">`
          + `<p class="pmeta">${metaLine(p)}</p><h3 class="film-title">${esc(p.title)}</h3>`
          + `<div class="body">${(p.text || []).map(t => `<p>${esc(t)}</p>`).join('')}</div>${folio(i)}</div></div>`;
        break;
      }
      case 'film-b': {
        const p = d.p;
        h = `<div class="film-pg${single ? ' noband' : ''}">${single ? '' : band(p, 'R')}<div class="film-body">`
          + `${p.award ? `<p class="award">${icon('trophy')}<span>${esc(p.award)}</span></p>` : ''}${credits(p)}`
          + `<div class="acts">${linkBtn(p)}</div>${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}${folio(i)}</div></div>`;
        break;
      }

      /* engineering notebook */
      case 'nb-text': {
        const p = d.p;
        const parts = [['Problem', p.problem], ['What I built', p.built], ['Result', p.result]].filter(([, t]) => t);
        const body = parts.length ? parts.map(([hd, t]) => `<div class="nb-part"><h4 class="nb-h">${hd}</h4><p>${esc(t)}</p></div>`).join('')
          : `<div class="body">${(p.text || []).map(t => `<p>${esc(t)}</p>`).join('')}</div>`;
        h = `<div class="pg pg-text"><h3 class="ph">${esc(p.title)}</h3><p class="pmeta">${metaLine(p)}</p>${body}${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}${folio(i)}</div>`;
        break;
      }
      case 'nb-report': {
        const { p, sec, k } = d;
        const paras = (sec.p || []).map(t => `<p>${esc(t)}</p>`).join('');
        const list = sec.list ? `<ul class="rp-list">${sec.list.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '';
        h = `<div class="pg pg-report"><p class="nb-h">${esc(p.title)} · ${k + 1} of ${p.report.length}</p><h4 class="rp-h">${esc(sec.h)}</h4><div class="body">${paras}</div>${list}${sec.note ? `<p class="note">${esc(sec.note)}</p>` : ''}${folio(i)}</div>`;
        break;
      }
      case 'nb-grid':
        extra = ' nb-gridpaper';
        h = `<div class="pg">${folio(i)}</div>`;
        break;
      case 'nb-fig': {
        const p = d.p, it = p.items[0];
        const fig = it ? zoom(p, it, mediaHTML(it, 'plate')) : '';
        h = `<div class="pg pg-plate"><figure class="plate">${fig}<figcaption><b>Fig. ${p.fig}</b> ${esc(p.figCaption || p.title)}</figcaption></figure>`
          + `${p.tools ? `<dl class="credits"><dt>Built with</dt><dd>${esc(p.tools)}</dd></dl>` : ''}${p.link ? `<div class="acts">${linkBtn(p)}</div>` : ''}${folio(i)}</div>`;
        break;
      }
    }
    if (side === 'odd' && !['endpaper', 'back', 'ph-half', 'ph-part-color'].includes(d.t)) h += '<span class="curl" aria-hidden="true"></span>';
    return { cls: side + extra + ` pk-${d.t}`, html: h };
  }
  function fill(el, i, extra = '') { const r = page(i); el.className = 'page ' + r.cls + (extra ? ' ' + extra : ''); el.innerHTML = r.html; return el; }
  const maxPos = () => single ? P.length - 1 : Math.floor((P.length - 1) / 2);
  const toPos = n => single ? n : Math.floor(n / 2);
  const visible = () => (single ? [pos] : [2 * pos, 2 * pos + 1]).filter(i => i >= 0 && i < P.length);

  function draw() {
    spread.classList.toggle('single', single);
    if (single) fill(R, pos); else { fill(L, 2 * pos); fill(R, 2 * pos + 1); }
    spread.classList.toggle('closed', !single && pos === -1);
    chrome();
    preload();
  }
  // fetch the photographs on the spreads either side, so a turn never shows a half-loaded page
  function preload() {
    if (!V) return;
    (single ? [pos + 1, pos - 1] : [2 * pos + 2, 2 * pos + 3, 2 * pos - 2, 2 * pos - 1]).forEach(i => {
      if (i < 0 || i >= P.length) return;
      for (const m of page(i).html.matchAll(/<img[^>]+?src="([^"]+)"/g)) { const im = new Image(); im.decoding = 'async'; im.src = m[1].replace(/&amp;/g, '&'); }
    });
  }
  function section() {
    if (pos === -1) return { label: 'Cover', seg: -1 };
    const vis = visible();
    for (const p of V.projects) if (vis.some(i => i >= p.start && i <= p.end)) return { label: p.title, seg: p.k + 1, p };
    if (vis.some(i => i >= V.endPage)) return { label: V.endLabel, seg: V.projects.length + 1 };
    const pt = vis.map(i => P[i]).find(d => d && d.part);   // a part opener
    if (pt) { const p = V.projects.find(x => x.part === pt.part); return { label: pt.part, seg: p ? p.k + 1 : 0 }; }
    return { label: 'Contents', seg: 0 };
  }
  function chrome() {
    const s = section(), nums = visible().map(i => i + 1);
    const range = nums.length > 1 ? `${nums[0]}-${nums[1]}` : (nums[0] ?? '');
    $('#scrubLabel').innerHTML = `<b>${esc(s.label)}</b>${fmt(V) === 'photo' ? '' : range}`;
    $$('#scrubBar button').forEach((b, k) => b.setAttribute('aria-current', String(k === s.seg)));
    $('#prevBtn').disabled = pos <= -1;
    $('#nextBtn').disabled = pos >= maxPos();
    $('#edgePrev').hidden = pos <= -1;
    $('#edgeNext').hidden = pos >= maxPos();
    $('#live').textContent = `${s.label}${nums.length ? `, page ${nums.join(' and ')}` : ''}`;
    setHash(s.p ? `${V.id}.${s.p.slug}` : V.id, false);
  }
  // Turn to a spread. A press during a turn hurries it along and the next turn follows straight after,
  // so quick presses are never lost; `step` counts from wherever the book is heading.
  const dest = () => queued ?? turnTo ?? pos;
  const step = d => go(dest() + d);
  let turnAnims = [];
  async function go(target) {
    if (!V) return;
    target = Math.max(-1, Math.min(maxPos(), target));
    if (turning) { queued = target === turnTo ? null : target; turnAnims.forEach(a => { a.playbackRate = 2.6; }); return; }
    if (target === pos) return;
    if (reduce.matches) { pos = target; draw(); return; }
    const fwd = target > pos;
    const leaf = document.createElement('div'), front = document.createElement('div'), back = document.createElement('div');
    leaf.setAttribute('inert', ''); leaf.setAttribute('aria-hidden', 'true');
    let from = 0, to;
    if (!single) {
      if (fwd) { fill(front, 2 * pos + 1, 'face'); fill(back, 2 * target, 'face back'); fill(R, 2 * target + 1); leaf.className = 'leaf on-right'; to = -180; }
      else { fill(front, 2 * pos, 'face'); fill(back, 2 * target + 1, 'face back'); fill(L, 2 * target); leaf.className = 'leaf on-left'; to = 180; }
      spread.classList.toggle('closed', target === -1);
    } else {
      leaf.className = 'leaf on-full'; back.className = 'page reverse face back';
      if (fwd) { fill(front, pos, 'face'); fill(R, target); to = -180; } else { fill(front, target, 'face'); from = -180; to = 0; }
    }
    [front, back].forEach(f => { const s = document.createElement('span'); s.className = 'shade'; f.append(s); });
    leaf.append(front, back);
    spread.append(leaf);
    // give the photographs on the new pages a moment to finish decoding, so the turn reveals a finished page
    turning = 'waiting'; turnTo = target;
    const loading = $$('img', spread).filter(im => !im.complete);
    if (loading.length) await Promise.race([Promise.all(loading.map(im => im.decode().catch(() => {}))), new Promise(r => setTimeout(r, 320))]);
    if (!V) { leaf.remove(); turning = turnTo = null; queued = null; return; }
    const dur = single ? 400 : 560, easing = 'cubic-bezier(.45,.05,.2,1)';
    const kf = [{ transform: `rotateY(${from}deg)` }, { transform: `rotateY(${to}deg)` }];
    if (single) { kf[0].opacity = fwd ? 1 : 0; kf[1].opacity = fwd ? 0 : 1; }
    const anim = leaf.animate(kf, { duration: dur, easing, fill: 'forwards' });
    turnAnims = [anim, ...$$('.shade', leaf).map(s => s.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: dur, easing }))];
    turning = anim;
    if (queued !== null) turnAnims.forEach(a => { a.playbackRate = 2.6; });
    try { await anim.finished; } catch (e) { /* cancelled when the book closes */ }
    leaf.remove();
    turning = null; turnTo = null; turnAnims = [];
    if (!V) { queued = null; return; }
    pos = target;
    draw();
    if (queued !== null) { const q = queued; queued = null; if (q !== pos) go(q); }
  }
  function gotoSlug(slug) {
    const p = V && V.projects.find(x => x.slug === slug);
    if (!p) return;
    if (visible().some(i => i >= p.start && i <= p.end)) return;
    go(toPos(p.start));
  }

  function setHash(h, push) {
    const url = location.pathname + location.search + (h ? '#' + h : '');
    try { if (push) history.pushState({ book: true }, '', url); else history.replaceState(history.state, '', url); } catch (e) { /* sandboxed */ }
  }
  function lock(on) { site.inert = on; site.toggleAttribute('inert', on); document.body.classList.toggle('locked', on); }

  function openBook(id, slug, { push = true, from = null } = {}) {
    const b = BOOKS.find(x => x.id === id);
    if (!b) return;
    if (V && V.id === id) { if (slug) gotoSlug(slug); return; }
    lastFocus = from || document.activeElement;
    single = narrow.matches; V = b; P = buildPages(b, single); pos = -1; turning = turnTo = queued = null;
    spread.dataset.format = reader.dataset.format = fmt(b);
    spread.dataset.slot = b.slot;
    spread.querySelectorAll('.leaf').forEach(l => l.remove());
    spread.style.setProperty('--c', `var(--b${b.slot})`);
    spread.style.setProperty('--fc', `var(--f${b.slot})`);
    $('#rTitle').textContent = b.title;
    buildScrub();
    reader.hidden = false;
    lock(true);
    pushed = false;
    if (push) { setHash(slug ? `${id}.${slug}` : id, true); pushed = true; }
    draw();
    store.set('ee-bookmark', id);
    markRibbon();
    $('#nextBtn').focus({ preventScroll: true });
    const p = slug && b.projects.find(x => x.slug === slug);
    const target = p ? p.start : 0;
    setTimeout(() => { if (V === b && pos === -1) go(toPos(target)); }, reduce.matches ? 0 : 380);
  }
  function buildScrub() {
    const segs = [{ label: 'Contents', page: V.tocPage }, ...V.projects.map(p => ({ label: p.title, page: p.start })), { label: V.endLabel, page: V.endPage }];
    // each part of the bar is as long as its share of the book
    segs.forEach((s, k) => { s.len = Math.max(1, (k + 1 < segs.length ? segs[k + 1].page : P.length) - s.page); });
    $('#scrubBar').innerHTML = segs.map(s => `<button data-goto="${s.page}" style="flex-grow:${s.len}" aria-label="Go to ${esc(s.label)}" title="${esc(s.label)}"></button>`).join('');
  }
  function closeBook({ restore = true, fromHistory = false } = {}) {
    if (!V) return;
    if (LB) closeLB(false);
    reader.hidden = true;
    lock(false);
    V = null; queued = null;
    turnAnims.forEach(a => a.cancel());
    spread.querySelectorAll('.leaf').forEach(l => l.remove());
    $$('.pulled').forEach(b => b.classList.remove('pulled'));
    if (!fromHistory) {
      if (pushed) { try { history.back(); } catch (e) { setHash('', false); } }
      else setHash('', false);
    }
    pushed = false;
    if (restore && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  function switchBook(id) {
    const wasPushed = pushed;
    closeBook({ restore: false, fromHistory: true });
    openBook(id, null, { push: false, from: document.querySelector(`.book[data-open="${id}"]`) });
    pushed = wasPushed;
  }
  function route() {
    if (LB) closeLB(false);
    const raw = decodeURIComponent(location.hash.slice(1));
    const [id, slug] = raw.split('.');
    const b = BOOKS.find(x => x.id === id);
    if (b) {
      if (V && V.id === id) { if (slug) gotoSlug(slug); }
      else { if (V) closeBook({ restore: false, fromHistory: true }); openBook(id, slug, { push: false }); }
    } else if (V) closeBook({ fromHistory: true });
  }

  /* ---------- lightbox ---------- */
  const lb = $('#lb');
  let LB = null, lbFocus = null;
  function openLB(p, m) {
    LB = { p, m };
    lbFocus = document.activeElement;
    lb.hidden = false;
    reader.inert = true; reader.setAttribute('inert', '');
    lock(true);
    renderLB();
    $('#lbClose').focus({ preventScroll: true });
  }
  function renderLB() {
    const { p, m } = LB, it = p.items[m], n = p.items.length;
    const wide = it.art && (it.art.kind === 'video' || it.art.wide);
    $('#lbMedia').innerHTML = it.type === 'art' ? `<div class="lb-paper${wide ? ' wide' : ''}">${artHTML(it.art, 'plate')}</div>` : mediaHTML(it, 'full');
    const bits = [`<b>${esc(p.title)}</b>`];
    if (it.caption || (it.type === 'image' && it.alt)) bits.push(`<span>${esc(it.caption || it.alt)}</span>`);
    if (it.type === 'video' && it.url) bits.push(`<a href="${esc(it.url)}" target="_blank" rel="noopener">Open video${icon('arrow-up-right')}</a>`);
    $('#lbCap').innerHTML = bits.join('');
    $('#lbCount').textContent = n > 1 ? `${m + 1} / ${n}` : '';
    $('#lbPrev').disabled = m <= 0;
    $('#lbNext').disabled = m >= n - 1;
    $('#lbPrev').hidden = $('#lbNext').hidden = n < 2;
  }
  function stepLB(d) { if (!LB) return; const n = LB.p.items.length; const m = LB.m + d; if (m < 0 || m >= n) return; LB.m = m; renderLB(); }
  function closeLB(restore = true) {
    if (!LB) return;
    $('#lbMedia').innerHTML = '';
    lb.hidden = true;
    reader.inert = false; reader.removeAttribute('inert');
    if (!V) lock(false);
    LB = null;
    if (restore && lbFocus && document.contains(lbFocus)) lbFocus.focus({ preventScroll: true });
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const t = e.target;
    const op = t.closest('[data-open]');
    if (op && !V) {
      e.preventDefault();
      const id = op.dataset.open, slug = op.dataset.slug;
      if (op.classList.contains('book')) {
        op.classList.add('pulled');
        setTimeout(() => openBook(id, slug, { from: op }), reduce.matches ? 0 : 220);
      } else openBook(id, slug, { from: op });
      return;
    }
    const ed = t.closest('[data-step]');
    if (ed && V) { step(+ed.dataset.step); return; }
    const gt = t.closest('[data-goto]');
    if (gt && V) { go(toPos(+gt.dataset.goto)); return; }
    const sw = t.closest('[data-switch]');
    if (sw && V) { switchBook(sw.dataset.switch); return; }
    const z = t.closest('[data-lb]');
    if (z && V) { openLB(V.projects[+z.dataset.lb], +z.dataset.m); return; }
    const cp = t.closest('[data-copy]');
    if (cp) { copyText(cp.dataset.copy, cp); return; }
    const ch = t.closest('#filters .chip');
    if (ch) { filterWork(ch.dataset.filter); return; }
    if (V && !single && !LB && !t.closest('button,a') && t.closest('#spread')) {
      if (t.closest('#pageR')) step(1); else if (t.closest('#pageL')) step(-1);
    }
  });
  $('#closeBtn').addEventListener('click', () => closeBook());
  $('#prevBtn').addEventListener('click', () => step(-1));
  $('#nextBtn').addEventListener('click', () => step(1));
  $('#tocBtn').addEventListener('click', () => V && go(toPos(V.tocPage)));
  const share = $('#shareBtn');
  if (inFrame) share.remove(); else share.addEventListener('click', () => copyText(location.href, share));
  $('#lbClose').addEventListener('click', () => closeLB());
  $('#lbPrev').addEventListener('click', () => stepLB(-1));
  $('#lbNext').addEventListener('click', () => stepLB(1));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLB(); });


  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (LB) {
      if (e.key === 'Escape') closeLB();
      else if (e.key === 'ArrowRight') stepLB(1);
      else if (e.key === 'ArrowLeft') stepLB(-1);
      return;
    }
    if (!V) return;
    switch (e.key) {
      case 'Escape': closeBook(); break;
      case 'ArrowRight': case 'PageDown': e.preventDefault(); step(1); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); step(-1); break;
      case ' ': if (!e.target.closest('button,a,input')) { e.preventDefault(); step(e.shiftKey ? -1 : 1); } break;
      case 'Home': e.preventDefault(); go(toPos(0)); break;
      case 'End': e.preventDefault(); go(maxPos()); break;
    }
  });

  function swipe(el, fn) {
    let x = null, y = null;
    el.addEventListener('touchstart', e => { x = e.touches[0].clientX; y = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', e => {
      if (x === null) return;
      const dx = e.changedTouches[0].clientX - x, dy = e.changedTouches[0].clientY - y;
      x = y = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) fn(dx < 0 ? 1 : -1);
    });
  }
  swipe(spread, d => step(d));

  // Trackpads and mouse wheels turn pages too: one turn per gesture, so a fling doesn't riffle the whole book.
  let wheelSum = 0, wheelIdle = 0, wheelDone = false;
  const scrollsItself = (el, dy) => {
    for (; el && el !== reader; el = el.parentElement) {
      if (el.scrollHeight > el.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(el).overflowY)
        && (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0)) return true;
    }
    return false;
  };
  reader.addEventListener('wheel', e => {
    if (!V || LB || e.ctrlKey) return;   // ctrl + wheel is pinch-to-zoom
    const across = Math.abs(e.deltaX) > Math.abs(e.deltaY), d = (across ? e.deltaX : e.deltaY) * (e.deltaMode === 1 ? 16 : 1);
    if (!across && scrollsItself(e.target, d)) return;   // a long text page scrolls first
    e.preventDefault();
    clearTimeout(wheelIdle);
    wheelIdle = setTimeout(() => { wheelSum = 0; wheelDone = false; }, 160);
    if (wheelDone) return;
    wheelSum += d;
    if (Math.abs(wheelSum) >= 36) { step(wheelSum > 0 ? 1 : -1); wheelDone = true; }
  }, { passive: false });
  swipe(lb, d => stepLB(d));

  narrow.addEventListener('change', () => {
    if (!V) return;
    const now = narrow.matches;
    if (now === single) return;
    const s = section();
    single = now;
    P = buildPages(V, single);
    buildScrub();
    pos = pos === -1 ? -1 : (s.p ? toPos(s.p.start) : 0);
    draw();
  });
  addEventListener('popstate', route);
  addEventListener('hashchange', route);
  let rq = 0;
  const resized = () => { cancelAnimationFrame(rq); rq = requestAnimationFrame(sizeShelf); };
  // the shelf screen fills the window below the header (see .hero min-height)
  const head = $('.site-head');
  const setHeadH = () => document.documentElement.style.setProperty('--head-h', Math.ceil(head.getBoundingClientRect().height) + 'px');
  setHeadH();
  if ('ResizeObserver' in window) new ResizeObserver(resized).observe($('#scene'));
  if ('ResizeObserver' in window) new ResizeObserver(setHeadH).observe(head);
  addEventListener('resize', resized);

  /* ---------- boot ---------- */
  const setBtn = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };
  setBtn('#closeBtn', `${icon('arrow-left')}<span>Shelf</span>`);
  setBtn('#tocBtn', `${icon('list-bullets')}<span>Contents</span>`);
  setBtn('#shareBtn', `${icon('link')}<span class="lbl">Copy link</span>`);
  setBtn('#prevBtn', icon('arrow-left'));
  setBtn('#nextBtn', icon('arrow-right'));
  setBtn('#lbClose', `${icon('x')}<span>Close</span>`);
  setBtn('#lbPrev', icon('arrow-left'));
  setBtn('#lbNext', icon('arrow-right'));
  setBtn('#copyEmail', `${icon('copy')}<span class="lbl">Copy email</span>`);

  // A broken image path shows a labelled slot instead of the browser's broken-image icon.
  document.addEventListener('error', e => {
    const t = e.target;
    if (!t || t.tagName !== 'IMG' || t.dataset.failed) return;
    t.dataset.failed = '1';
    const s = document.createElement('span');
    s.className = 'img-missing';
    s.textContent = t.alt ? `Image unavailable: ${t.alt}` : 'Image unavailable';
    t.replaceWith(s);
  }, true);


  buildHeader();
  buildShelf();
  buildWork();
  buildAbout();
  $('#decor').innerHTML = DECOR;
  sizeShelf();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeShelf);
  route();
})();
