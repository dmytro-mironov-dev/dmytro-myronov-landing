(() => {
  const C = window.CONTENT;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* photo slot: assets/photos/<slot>.webp, then .jpg; a missing photo hides its figure */
  const exts = ['webp', 'jpg'];
  function loadSlot(img, slot) {
    let i = 0;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.dataset.slot = slot;
    const next = () => {
      if (i < exts.length) { img.src = `assets/photos/${slot}.${exts[i++]}`; return; }
      img.onerror = null;
      const fig = img.closest('figure');
      if (fig) fig.hidden = true;
    };
    img.onerror = next;
    next();
  }
  const slotImg = (slot, alt) => { const i = el('img'); i.alt = alt || slot; loadSlot(i, slot); return i; };

  /* lightbox */
  const lb = $('#lightbox');
  function openLightbox(src, caption) {
    $('img', lb).src = src; $('p', lb).textContent = caption || ''; lb.classList.add('open');
  }
  lb.addEventListener('click', e => { if (e.target !== $('img', lb)) lb.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
  const zoomable = (node, caption) => node.addEventListener('click', () => openLightbox($('img', node).currentSrc || $('img', node).src, caption));

  /* ---------- HERO ---------- */
  const p = C.person;
  const [first, ...rest] = p.name.split(' ');
  $('#heroName').innerHTML = `<span class="word"><span>${first}</span></span><br><span class="word"><span><em>${rest.join(' ')}</em></span></span>`;
  $('#heroRole').textContent = p.role;
  $('#heroTagline').textContent = p.tagline;

  /* rotating "I build ..." line */
  const rot = $('#rotator');
  const words = p.builds.map((w, i) => { const s = el('span', i === 0 ? 'is-in' : null, w); rot.appendChild(s); return s; });
  let wi = 0;
  setInterval(() => {
    if (document.hidden) return;
    const cur = words[wi]; wi = (wi + 1) % words.length; const nxt = words[wi];
    cur.classList.remove('is-in'); cur.classList.add('is-out');
    nxt.classList.remove('is-out'); nxt.classList.add('is-in');
    setTimeout(() => cur.classList.remove('is-out'), 600);
  }, 2400);

  /* pillars */
  const pillarsEl = $('#pillars');
  C.pillars.forEach(x => {
    const a = el('a', 'pillar reveal', `<h3>${x.title}</h3><p>${x.text}</p><div class="pillar__chips">${x.chips.map(c => `<span>${c}</span>`).join('')}</div><span class="pillar__link mono">→ ${x.link}</span>`);
    a.href = x.href;
    a.style.setProperty('--c', x.color);
    pillarsEl.appendChild(a);
  });
  loadSlot($('[data-slot="portrait"]'), p.portrait);

  const phrases = [
    'bin/magento setup:upgrade && echo "zero downtime"',
    'syncing 250,000 products from Kerridge…',
    'POST /netsuite/orders → 201 Created',
    'magepilot run SHOP-198 --agents=all',
    'yolo detect source=parking.mp4',
    'php artisan queue:work --tries=5',
  ];
  (function typer() {
    const t = $('#typed'); let pi = 0, ci = 0, del = false;
    const tick = () => {
      const s = phrases[pi];
      t.textContent = s.slice(0, ci);
      if (!del && ci === s.length) { del = true; return setTimeout(tick, 1600); }
      if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      ci += del ? -1 : 1;
      setTimeout(tick, del ? 22 : 48);
    };
    tick();
  })();

  const glyphs = ['<?php', '$order->save()', 'namespace Vendor\\Module;', 'di.xml', '@api', 'SELECT * FROM sales_order', 'composer require', '{ }', '=>', 'cron', 'GraphQL', 'Redis', 'queue:consumer', 'yolo.pt', 'cv2.imread()', 'django', '200 OK', 'webhook', '::class', 'public function execute()'];
  const gl = $('#glyphs');
  for (let i = 0; i < 34; i++) {
    const s = el('span', null, glyphs[i % glyphs.length].replace(/</g, '&lt;'));
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.fontSize = 11 + Math.random() * 10 + 'px';
    s.style.opacity = .3 + Math.random() * .7;
    gl.appendChild(s);
  }

  /* ---------- STATS ---------- */
  const sg = $('#statsGrid');
  C.stats.forEach(s => {
    const d = el('div', 'stat reveal', `<div class="stat__num" data-to="${s.value}" data-suffix="${s.suffix}">0</div><div class="stat__label">${s.label}</div>`);
    sg.appendChild(d);
  });
  const fmt = n => n.toLocaleString('en-US');
  function countUp(node) {
    const to = +node.dataset.to, suf = node.dataset.suffix || '';
    if (reduced) { node.textContent = fmt(to) + suf; return; }
    const t0 = performance.now(), dur = 1800;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      node.textContent = fmt(Math.round(to * e)) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const marqueeWords = ['Magento 2', 'Adobe Commerce Cloud', 'PHP 8', 'Kerridge', 'NetSuite', 'Salesforce', 'Hyvä', 'Laravel', 'Django', 'YOLO', 'OpenCV', 'Claude Agent SDK', 'MCP', 'Docker', 'Redis', 'Varnish', 'Elasticsearch', 'GraphQL', 'Stripe', 'NMI'];
  $('#marquee').innerHTML = [...marqueeWords, ...marqueeWords].map(w => `<span>${w}</span>`).join('');

  /* ---------- CAREER ---------- */
  const track = $('#careerTrack');
  C.career.forEach((s, idx) => {
    if (s.feature) track.appendChild(featureBanner(s));
    const st = el('article', 'stage' + (s.photos.length ? '' : ' stage--solo'));
    st.id = 'stage-' + s.id;
    st.style.setProperty('--c', s.color);
    st.innerHTML = `
      <div class="stage__bg"><div class="glow" style="background:${s.color}"></div><div class="big-year">${s.years.match(/\d{4}/)[0]}</div></div>
      <div class="stage__inner">
        <div class="stage__content">
          <span class="stage__years" style="color:${s.color};border-color:${s.color}55">${String(idx + 1).padStart(2, '0')} · ${s.years}</span>
          <h3 class="stage__company">${s.company}</h3>
          <div class="stage__role" style="color:${s.color}">${s.role}</div>
          <div class="stage__place">${s.place}</div>
          <p class="stage__text">${s.text}</p>
          <ul class="stage__points">${s.points.map(x => `<li>${x}</li>`).join('')}</ul>
          <div class="tags">${s.tags.map(x => `<span>${x}</span>`).join('')}</div>
        </div>
        ${s.photos.length ? `<div class="stage__photos stage__photos--n${Math.min(s.photos.length, 5)}"></div>` : ''}
      </div>`;
    const ph = $('.stage__photos', st);
    s.photos.slice(0, 5).forEach((photo, i) => {
      const f = el('figure', `ph ph--${i}`);
      f.dataset.depth = [0.12, -0.18, 0.25, -0.1, 0.3][i];
      f.appendChild(slotImg(photo.slot, photo.cap));
      f.appendChild(el('figcaption', null, photo.cap));
      zoomable(f, photo.cap);
      ph.appendChild(f);
    });
    track.appendChild(st);
  });

  /* full-bleed parallax banner in front of a career stage */
  function featureBanner(s) {
    const f = s.feature;
    const b = el('div', 'feature');
    b.style.setProperty('--c', s.color);
    b.innerHTML = `
      <div class="feature__word feature__word--back" aria-hidden="true">${f.word}</div>
      <figure class="feature__photo"><div class="feature__img"></div></figure>
      <div class="feature__word feature__word--front" aria-hidden="true">${f.word}</div>
      <div class="feature__text">
        <span class="feature__kicker mono">${f.kicker}</span>
        <h3>${f.title}</h3>
        <p>${f.text}</p>
      </div>`;
    const img = slotImg(f.slot, `${s.company}: ${f.title}`);
    img.loading = 'eager';
    $('.feature__img', b).appendChild(img);
    zoomable($('.feature__photo', b), f.kicker);
    return b;
  }

  /* ---------- COMMUNITY ---------- */
  const cm = C.community;
  $('#communityLead').textContent = cm.lead;
  const strip = $('#communityStrip');
  cm.events.forEach((ev, i) => {
    const card = el('figure', 'event');
    card.appendChild(slotImg(ev.slot, `${ev.title}, ${ev.date}`));
    card.appendChild(el('figcaption', null, `<span class="event__date mono">${ev.date}</span><b>${ev.title}</b><span>${ev.text}</span>`));
    card.style.setProperty('--tilt', (i % 2 ? 2.5 : -2.5) + 'deg');
    zoomable(card, `${ev.title} · ${ev.date}`);
    strip.appendChild(card);
  });

  /* ---------- INTEGRATIONS SVG ---------- */
  const svg = $('#integrationSvg');
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (tag, attrs, parent = svg) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent.appendChild(n); return n; };
  const cx = 300, cy = 300, R = 225;
  const defs = sv('defs', {});
  defs.innerHTML = `<radialGradient id="hubG"><stop offset="0" stop-color="#ff8a4c"/><stop offset="1" stop-color="#f26322"/></radialGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  sv('circle', { cx, cy, r: R, fill: 'none', stroke: 'rgba(255,255,255,.06)', 'stroke-dasharray': '4 8' });
  sv('circle', { cx, cy, r: 130, fill: 'none', stroke: 'rgba(242,99,34,.15)' });
  const nodes = C.integrations.map((n, i) => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / C.integrations.length;
    return { ...n, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  nodes.forEach(n => sv('line', { x1: cx, y1: cy, x2: n.x, y2: n.y, stroke: 'rgba(255,255,255,.1)', 'stroke-width': 2 }));
  const packetLayer = sv('g', {});
  nodes.forEach(n => {
    const g = sv('g', { class: 'node' });
    sv('circle', { cx: n.x, cy: n.y, r: 46, fill: '#171427', stroke: 'rgba(255,255,255,.15)', 'stroke-width': 1.5 }, g);
    const words = n.name.split(' ');
    words.forEach((w, wi) => {
      const t = sv('text', { x: n.x, y: n.y + 5 + (wi - (words.length - 1) / 2) * 15, 'text-anchor': 'middle', fill: '#ece9f6', 'font-size': 13, 'font-weight': 700 }, g);
      t.textContent = w;
    });
  });
  const hub = sv('g', {});
  const pulse = sv('circle', { cx, cy, r: 78, fill: 'none', stroke: '#f26322', 'stroke-width': 2, opacity: .6 }, hub);
  sv('circle', { cx, cy, r: 74, fill: 'url(#hubG)', filter: 'url(#glow)' }, hub);
  // Magento-like mark (original geometric glyph)
  sv('path', { d: `M${cx - 26} ${cy + 22} V${cy - 10} L${cx} ${cy - 25} L${cx + 26} ${cy - 10} V${cy + 22} M${cx - 9} ${cy + 22} V${cy - 3} L${cx} ${cy - 8} L${cx + 9} ${cy - 3} V${cy + 22}`, fill: 'none', stroke: '#fff', 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, hub);
  const ht = sv('text', { x: cx, y: cy + 48, 'text-anchor': 'middle', fill: '#fff', 'font-size': 13, 'font-weight': 800 }, hub);
  ht.textContent = 'MAGENTO 2';

  const packets = [];
  let orders = 0, stock = 0;
  function spawnPacket() {
    const n = nodes[Math.floor(Math.random() * nodes.length)];
    const label = n.flows[Math.floor(Math.random() * n.flows.length)];
    const out = Math.random() < .5;
    const g = sv('g', {}, packetLayer);
    const w = label.length * 6.6 + 16;
    sv('rect', { x: -w / 2, y: -10, width: w, height: 20, rx: 10, fill: out ? '#f26322' : '#7c5cff' }, g);
    const t = sv('text', { x: 0, y: 4, 'text-anchor': 'middle', 'font-size': 10.5, 'font-weight': 700, fill: '#fff' }, g);
    t.textContent = label;
    packets.push({ g, n, out, k: 0, speed: .006 + Math.random() * .004, label });
  }
  let lastSpawn = 0;
  function animHub(now) {
    if (now - lastSpawn > 420) { spawnPacket(); lastSpawn = now; }
    for (let i = packets.length - 1; i >= 0; i--) {
      const pk = packets[i];
      pk.k += pk.speed;
      const k = pk.out ? pk.k : 1 - pk.k;
      const x = cx + (pk.n.x - cx) * k, y = cy + (pk.n.y - cy) * k;
      pk.g.setAttribute('transform', `translate(${x} ${y})`);
      pk.g.style.opacity = Math.min(1, Math.sin(Math.min(pk.k, 1) * Math.PI) * 3);
      if (pk.k >= 1) {
        pk.g.remove(); packets.splice(i, 1);
        if (/order|invoice|payment/.test(pk.label)) orders++;
        if (/stock|price|product/.test(pk.label)) stock += 37;
      }
    }
    const s = 1 + (Math.sin(now / 400) + 1) * .06;
    pulse.setAttribute('r', 78 * s);
    pulse.setAttribute('opacity', .7 - (s - 1) * 5);
    $('#tickOrders').textContent = fmt(orders);
    $('#tickStock').textContent = fmt(stock);
  }

  /* ---------- MAGEPILOT ---------- */
  const mp = C.magepilot;
  const pl = $('#pipeline');
  mp.steps.forEach((s, i) => pl.appendChild(el('div', 'pipe-step', `<i>step ${i + 1}</i><b>${s.name}</b><span>${s.text}</span>`)));
  const tickets = ['SHOP-198', 'B2B-331', 'PIM-79', 'SHOP-187'];
  let pipeIdx = 0, ticketIdx = 0, pipeTimer = null;
  function pipeStep() {
    const steps = [...pl.children].filter(n => n.classList.contains('pipe-step'));
    steps.forEach((n, i) => { n.classList.toggle('on', i === pipeIdx); n.classList.toggle('done', i < pipeIdx); });
    let tok = $('.pipe-token', pl);
    if (!tok) { tok = el('div', 'pipe-token'); pl.appendChild(tok); }
    tok.textContent = tickets[ticketIdx];
    tok.style.left = steps[pipeIdx].offsetLeft + 'px';
    tok.style.top = (steps[pipeIdx].offsetTop - 14) + 'px';
    pipeIdx++;
    if (pipeIdx >= steps.length) { pipeIdx = 0; ticketIdx = (ticketIdx + 1) % tickets.length; }
  }
  const sh = $('#shots');
  mp.shots.forEach(s => {
    const f = el('figure', 'shot' + (s.tall ? ' shot--tall' : ''), `<img src="${s.src}" alt="${s.caption}" loading="lazy"><figcaption>${s.caption}</figcaption>`);
    zoomable(f, s.caption);
    sh.appendChild(f);
  });
  $('#mpLink').href = mp.site;

  /* ---------- COMPUTER VISION ---------- */
  const cv = $('#cvCanvas'), cx2 = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const spotW = 70, spotH = 120, cols = 8, ox = (W - cols * spotW) / 2;
  const laneY = H / 2;
  const spots = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < cols; c++) spots.push({ x: ox + c * spotW, y: r === 0 ? 50 : H - 50 - spotH, row: r, car: null });
  const carColors = ['#e5e7eb', '#60a5fa', '#f87171', '#fbbf24', '#34d399', '#a78bfa', '#94a3b8', '#fb923c'];
  const cars = [];
  spots.forEach(s => { if (Math.random() < .55) { const car = makeCar(s); car.state = 'parked'; car.x = s.x + spotW / 2; car.y = s.y + spotH / 2; car.t = Math.random() * 600; s.car = car; cars.push(car); } });
  function makeCar(spot) {
    return { spot, x: -60, y: laneY, color: carColors[Math.floor(Math.random() * carColors.length)], state: 'arriving', t: 0, conf: (.86 + Math.random() * .13), vert: false };
  }
  let cvFrame = 0;
  function drawCar(c) {
    const vert = c.vert;
    const w = vert ? 38 : 72, h = vert ? 72 : 38;
    cx2.save();
    cx2.translate(c.x, c.y);
    cx2.fillStyle = 'rgba(0,0,0,.35)';
    roundRect(-w / 2 + 3, -h / 2 + 4, w, h, 9); cx2.fill();
    cx2.fillStyle = c.color;
    roundRect(-w / 2, -h / 2, w, h, 9); cx2.fill();
    cx2.fillStyle = 'rgba(15,23,42,.75)';
    if (vert) { roundRect(-w / 2 + 5, -h / 2 + 12, w - 10, 14, 4); cx2.fill(); roundRect(-w / 2 + 5, h / 2 - 22, w - 10, 10, 3); cx2.fill(); }
    else { roundRect(w / 2 - 26, -h / 2 + 5, 14, h - 10, 4); cx2.fill(); roundRect(-w / 2 + 10, -h / 2 + 5, 10, h - 10, 3); cx2.fill(); }
    cx2.restore();
    return { w, h };
  }
  function roundRect(x, y, w, h, r) { cx2.beginPath(); cx2.roundRect ? cx2.roundRect(x, y, w, h, r) : cx2.rect(x, y, w, h); }
  function cvTick() {
    cvFrame++;
    // spawn
    if (cvFrame % 90 === 0) {
      const free = spots.filter(s => !s.car);
      const busy = cars.filter(c => c.state === 'parked' && c.t > 400);
      if (free.length && (Math.random() < .6 || !busy.length)) { const s = free[Math.floor(Math.random() * free.length)]; const car = makeCar(s); s.car = car; cars.push(car); }
      else if (busy.length) { busy[Math.floor(Math.random() * busy.length)].state = 'leaving'; }
    }
    // move
    for (let i = cars.length - 1; i >= 0; i--) {
      const c = cars[i], s = c.spot, tx = s.x + spotW / 2, ty = s.y + spotH / 2;
      c.t++;
      if (c.state === 'arriving') {
        if (Math.abs(c.x - tx) > 2 && !c.vert) { c.x += Math.sign(tx - c.x) * 3.2; }
        else { c.vert = true; c.x = tx; c.y += Math.sign(ty - c.y) * 2.2; if (Math.abs(c.y - ty) < 2.5) { c.y = ty; c.state = 'parked'; c.t = 0; } }
      } else if (c.state === 'leaving') {
        if (c.vert) { c.y += Math.sign(laneY - c.y) * 2.2; if (Math.abs(c.y - laneY) < 2.5) { c.y = laneY; c.vert = false; } }
        else { c.x += 3.4; if (c.x > W + 60) { s.car = null; cars.splice(i, 1); } }
      } else c.vert = true;
    }
    // draw lot
    cx2.fillStyle = '#1f2329'; cx2.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) { cx2.fillStyle = `rgba(255,255,255,${(i * 7919 % 13) / 400})`; cx2.fillRect((i * 151) % W, (i * 263) % H, 2, 2); }
    cx2.strokeStyle = '#e5e7eb'; cx2.lineWidth = 2; cx2.setLineDash([22, 18]);
    cx2.beginPath(); cx2.moveTo(0, laneY); cx2.lineTo(W, laneY); cx2.stroke(); cx2.setLineDash([]);
    let freeN = 0, busyN = 0;
    spots.forEach(s => {
      const occ = s.car && (s.car.state === 'parked' || (s.car.vert && Math.abs(s.car.y - (s.y + spotH / 2)) < spotH / 2));
      occ ? busyN++ : freeN++;
      cx2.strokeStyle = 'rgba(229,231,235,.8)'; cx2.lineWidth = 2;
      cx2.beginPath(); cx2.moveTo(s.x, s.y); cx2.lineTo(s.x, s.y + spotH); cx2.moveTo(s.x + spotW, s.y); cx2.lineTo(s.x + spotW, s.y + spotH);
      s.row === 0 ? (cx2.moveTo(s.x, s.y), cx2.lineTo(s.x + spotW, s.y)) : (cx2.moveTo(s.x, s.y + spotH), cx2.lineTo(s.x + spotW, s.y + spotH));
      cx2.stroke();
      cx2.fillStyle = occ ? 'rgba(239,68,68,.18)' : 'rgba(34,197,94,.16)';
      cx2.fillRect(s.x + 3, s.y + 3, spotW - 6, spotH - 6);
      cx2.fillStyle = occ ? '#f87171' : '#4ade80';
      cx2.font = '700 11px JetBrains Mono, monospace';
      cx2.fillText(occ ? 'BUSY' : 'FREE', s.x + 18, s.row === 0 ? s.y + spotH - 8 : s.y + 16);
    });
    cars.forEach(c => {
      const { w, h } = drawCar(c);
      const jitter = Math.sin((cvFrame + c.t) / 7) * 1.5;
      cx2.strokeStyle = '#22d3ee'; cx2.lineWidth = 2;
      cx2.strokeRect(c.x - w / 2 - 5 + jitter, c.y - h / 2 - 5, w + 10, h + 10);
      const conf = Math.min(.99, c.conf + Math.sin(cvFrame / 11 + c.t) * .02);
      const label = `car ${conf.toFixed(2)}`;
      cx2.font = '700 11px JetBrains Mono, monospace';
      const tw = cx2.measureText(label).width + 8;
      cx2.fillStyle = '#22d3ee';
      cx2.fillRect(c.x - w / 2 - 5 + jitter, c.y - h / 2 - 21, tw, 16);
      cx2.fillStyle = '#05202a';
      cx2.fillText(label, c.x - w / 2 - 1 + jitter, c.y - h / 2 - 9);
    });
    // scanline
    const sy = (cvFrame * 3) % H;
    const grad = cx2.createLinearGradient(0, sy - 30, 0, sy);
    grad.addColorStop(0, 'rgba(34,211,238,0)'); grad.addColorStop(1, 'rgba(34,211,238,.12)');
    cx2.fillStyle = grad; cx2.fillRect(0, sy - 30, W, 30);
    $('#cvFree').textContent = freeN; $('#cvBusy').textContent = busyN;
    if (cvFrame % 30 === 0) $('#cvFps').textContent = 28 + Math.floor(Math.random() * 4);
  }

  /* ---------- LOGISTICS ---------- */
  const truckSvg = (body, cab, cargo) => `
    <svg viewBox="0 0 260 110">
      <rect x="2" y="10" width="170" height="72" rx="6" fill="${body}"/>
      <rect x="2" y="10" width="170" height="10" rx="4" fill="rgba(255,255,255,.18)"/>
      <text x="87" y="54" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="700" font-size="15" fill="#fff">${cargo}</text>
      <path d="M176 32 h44 l30 28 v22 h-74z" fill="${cab}"/>
      <path d="M186 38 h30 l22 20 h-52z" fill="#bfe9ff" opacity=".85"/>
      <rect x="244" y="66" width="10" height="6" rx="2" fill="#fde68a"/>
      <rect x="0" y="80" width="256" height="8" rx="3" fill="#0f0d18"/>
      <g class="wheel"><circle cx="40" cy="92" r="14" fill="#111"/><circle cx="40" cy="92" r="6" fill="#9ca3af"/><rect x="38" y="80" width="4" height="8" fill="#9ca3af"/></g>
      <g class="wheel"><circle cx="76" cy="92" r="14" fill="#111"/><circle cx="76" cy="92" r="6" fill="#9ca3af"/><rect x="74" y="80" width="4" height="8" fill="#9ca3af"/></g>
      <g class="wheel"><circle cx="216" cy="92" r="14" fill="#111"/><circle cx="216" cy="92" r="6" fill="#9ca3af"/><rect x="214" y="80" width="4" height="8" fill="#9ca3af"/></g>
    </svg>`;
  const trucksEl = $('#trucks');
  const truckDefs = [
    { body: '#f26322', cab: '#c2410c', cargo: 'ORDER #2041', speed: 1.25, x: 0.62, bottom: 30 },
    { body: '#7c5cff', cab: '#5b3fd6', cargo: 'CO₂ 412 kg', speed: .8, x: 0.08, bottom: 30 },
    { body: '#0e7490', cab: '#155e75', cargo: 'STOCK SYNC', speed: 1.05, x: -0.4, bottom: 30 },
  ];
  const trucks = truckDefs.map(t => { t.x = t.x * (trucksEl.clientWidth || innerWidth); const d = el('div', 'truck', truckSvg(t.body, t.cab, t.cargo)); d.style.bottom = t.bottom + 'px'; trucksEl.appendChild(d); return { ...t, node: d }; });
  function truckTick() {
    const w = trucksEl.clientWidth;
    trucks.forEach(t => { t.x += t.speed * 1.6; if (t.x > w + 40) t.x = -300 - Math.random() * 500; t.node.style.transform = `translateX(${t.x}px)`; });
  }
  const shipments = [
    { id: 'SHP-10421', route: 'Rotterdam → Wrocław', km: 1012, co2: 388, p: 72 },
    { id: 'SHP-10422', route: 'Hamburg → Poznań', km: 543, co2: 201, p: 34 },
    { id: 'SHP-10423', route: 'Antwerp → Berlin', km: 760, co2: 279, p: 91 },
    { id: 'SHP-10424', route: 'Gdańsk → Kraków', km: 586, co2: 214, p: 12 },
  ];
  const scEl = $('#shipCards');
  shipments.forEach(s => scEl.appendChild(el('div', 'ship reveal', `<div class="ship__id">${s.id}</div><div class="ship__route">${s.route}</div><div class="ship__bar"><i style="width:${s.p}%"></i></div><div class="ship__meta"><span>${s.km} km</span><span class="co2">${s.co2} kg CO₂</span></div>`)));
  setInterval(() => {
    [...scEl.children].forEach((n, i) => {
      const s = shipments[i];
      s.p = s.p >= 100 ? 0 : s.p + Math.random() * 6;
      $('i', n).style.width = Math.min(100, s.p) + '%';
    });
  }, 900);

  /* ---------- SKILLS ---------- */
  const sk = $('#skillsGrid');
  C.skills.forEach(s => {
    const d = el('div', 'skill reveal', `<h3>${s.group}<span>${s.level}%</span></h3><div class="skill__bar"><i data-w="${s.level}"></i></div><div class="skill__chips">${s.items.map(i => `<span>${i}</span>`).join('')}</div>`);
    d.addEventListener('pointermove', e => { const r = d.getBoundingClientRect(); d.style.setProperty('--mx', e.clientX - r.left + 'px'); d.style.setProperty('--my', e.clientY - r.top + 'px'); });
    sk.appendChild(d);
  });

  /* ---------- GALLERY ---------- */
  const ms = $('#masonry');
  const gal = [];
  C.career.forEach(s => s.photos.forEach(ph => gal.push(ph)));
  cm.events.forEach(ev => { if (!gal.some(g => g.slot === ev.slot)) gal.push({ slot: ev.slot, cap: `${ev.title} · ${ev.date}` }); });
  gal.forEach(g => {
    const f = el('figure', 'reveal');
    f.appendChild(slotImg(g.slot, g.cap));
    f.appendChild(el('figcaption', null, g.cap));
    zoomable(f, g.cap);
    ms.appendChild(f);
  });

  /* ---------- CONTACT ---------- */
  const cg = $('#contactGrid');
  [
    { k: 'Email', v: p.email, href: 'mailto:' + p.email },
    { k: 'Phone', v: p.phone, href: 'tel:' + p.phone.replace(/\s/g, '') },
    { k: 'LinkedIn', v: 'dmytro-myronov', href: p.linkedin },
    { k: 'Location', v: p.location, href: null },
  ].forEach(c => {
    const a = el(c.href ? 'a' : 'div', 'contact__item', `<small>${c.k}</small><b>${c.v}</b>`);
    if (c.href) { a.href = c.href; if (c.href.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener'; } }
    cg.appendChild(a);
  });
  $('#cvLink').href = p.cv;
  $('#year').textContent = new Date().getFullYear();

  /* ---------- SCROLL: progress, nav, parallax ---------- */
  const prog = $('#progress');
  const navLinks = [...document.querySelectorAll('.nav__links a')];
  const sections = navLinks.map(a => $(a.getAttribute('href')));
  function onScroll() {
    const h = document.documentElement;
    prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
    let cur = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
    navLinks.forEach((a, i) => a.classList.toggle('active', i === cur));
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* visibility-gated animation loops */
  const visible = new Set();
  const vio = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)), { threshold: 0.05 });
  ['integrations', 'vision', 'logistics', 'magepilot'].forEach(id => vio.observe($('#' + id)));
  function loop(now) {
    if (visible.has('integrations')) animHub(now);
    if (visible.has('vision')) cvTick();
    if (visible.has('logistics')) truckTick();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  setInterval(() => { if (visible.has('magepilot')) pipeStep(); }, 1300);
  pipeStep();

  /* reveal + counters + skill bars */
  const rio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target;
    if (hasGsap && !reduced) gsap.to(t, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', delay: (+t.dataset.i || 0) * .06 });
    else { t.style.opacity = 1; t.style.transform = 'none'; }
    const num = $('.stat__num', t); if (num) countUp(num);
    const bar = $('.skill__bar i', t); if (bar) bar.style.width = bar.dataset.w + '%';
    rio.unobserve(t);
  }), { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((n, i) => { n.dataset.i = i % 6; rio.observe(n); });

  if (hasGsap && !reduced) {
    // hero intro
    gsap.from('.hero__name .word > span', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: .12 });
    gsap.from(['.hero .eyebrow', '.hero__role', '.hero__builds', '.hero__typed', '.hero__tagline', '.hero__cta'], { opacity: 0, y: 24, duration: .9, stagger: .1, delay: .4, ease: 'power3.out' });
    gsap.from('.hero__photo', { opacity: 0, scale: .9, rotate: -6, duration: 1.3, delay: .2, ease: 'power3.out' });
    // hero layers parallax
    document.querySelectorAll('.hero [data-speed]').forEach(n => {
      gsap.to(n, { yPercent: +n.dataset.speed * 100, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
    // career stages: background drift, photos at different depths, content slide-in
    document.querySelectorAll('.stage').forEach(st => {
      gsap.fromTo($('.stage__bg', st), { yPercent: -12 }, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: st, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo($('.big-year', st), { xPercent: 20 }, { xPercent: -20, ease: 'none', scrollTrigger: { trigger: st, start: 'top bottom', end: 'bottom top', scrub: true } });
      st.querySelectorAll('.ph').forEach(ph => {
        const d = +ph.dataset.depth;
        gsap.fromTo(ph, { y: d * 220 }, { y: -d * 220, ease: 'none', scrollTrigger: { trigger: st, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      gsap.from($('.stage__content', st).children, { opacity: 0, x: -50, duration: .9, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: st, start: 'top 65%' } });
      gsap.from(st.querySelectorAll('.ph img'), { scale: 1.3, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: st, start: 'top 70%' } });
    });
    // feature banner: photo and words move at different depths
    document.querySelectorAll('.feature').forEach(b => {
      const st = { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true };
      gsap.fromTo($('.feature__img', b), { yPercent: -14, scale: 1.18 }, { yPercent: 14, scale: 1.05, ease: 'none', scrollTrigger: st });
      gsap.fromTo($('.feature__photo', b), { y: 120 }, { y: -120, ease: 'none', scrollTrigger: { ...st } });
      gsap.fromTo($('.feature__word--back', b), { xPercent: 18 }, { xPercent: -28, ease: 'none', scrollTrigger: { ...st } });
      gsap.fromTo($('.feature__word--front', b), { xPercent: -30 }, { xPercent: 12, ease: 'none', scrollTrigger: { ...st } });
      gsap.fromTo($('.feature__photo', b), { clipPath: 'inset(18% 18% 18% 18% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'power2.out', scrollTrigger: { trigger: b, start: 'top 85%', end: 'top 25%', scrub: true } });
      gsap.from($('.feature__text', b).children, { opacity: 0, y: 40, stagger: .12, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: b, start: 'top 55%' } });
    });
    // community: horizontal strip pinned on wide screens
    ScrollTrigger.matchMedia({
      '(min-width: 900px)': () => {
        const dist = () => Math.max(0, strip.scrollWidth - strip.parentElement.clientWidth);
        gsap.to(strip, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.community__pin', start: 'top 12%', end: () => '+=' + dist(), pin: true, scrub: true, invalidateOnRefresh: true } });
      },
    });
    gsap.from('.event', { opacity: 0, y: 80, rotate: 0, stagger: .1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '#communityStrip', start: 'top 85%' } });
    // section heads
    document.querySelectorAll('.section-head, .split__text').forEach(h => {
      gsap.from(h.children, { opacity: 0, y: 40, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 80%' } });
    });
    gsap.from('.hub', { scale: .7, opacity: 0, rotate: -20, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.hub', start: 'top 80%' } });
    gsap.from('.cv-frame', { opacity: 0, y: 60, rotateX: 18, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.cv-frame', start: 'top 85%' } });
    gsap.from('.shot', { opacity: 0, y: 60, stagger: .12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.shots', start: 'top 85%' } });
    gsap.from('.road__sky', { yPercent: -20, ease: 'none', scrollTrigger: { trigger: '.road', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.contact__box', { scale: .92, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.contact__box', start: 'top 85%' } });
    addEventListener('load', () => ScrollTrigger.refresh());
  }
})();
