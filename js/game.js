/* ElePHPant vs Bugs — a tiny canvas shooter. */
(() => {
  const cvs = document.getElementById('gameCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  const overlay = document.getElementById('gameOverlay');
  const goTitle = document.getElementById('goTitle');
  const goText = document.getElementById('goText');
  const startBtn = document.getElementById('gameStart');

  const ENEMY = {
    '500': { color: '#ef4444', hp: 2, pts: 50, speed: .9 },
    '404': { color: '#f59e0b', hp: 1, pts: 20, speed: 1.3 },
    'N+1': { color: '#a855f7', hp: 1, pts: 40, speed: 1.0, split: true },
    'null': { color: '#64748b', hp: 1, pts: 15, speed: 1.6 },
    'Undefined index': { color: '#ec4899', hp: 1, pts: 30, speed: 1.1 },
    'deadlock': { color: '#f97316', hp: 3, pts: 80, speed: .7 },
  };
  const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const POWER = {
    composer: { label: 'composer require', color: '#22c55e' },
    flush: { label: 'cache:flush', color: '#38bdf8' },
    heal: { label: 'hotfix', color: '#facc15' },
  };

  let st, keys = {}, running = false, paused = false, raf = 0, best = +(localStorage.getItem('elephpant-best') || 0);
  const stars = Array.from({ length: 90 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: Math.random() * 1.6 + .3, v: Math.random() * .6 + .2 }));

  function reset() {
    st = {
      p: { x: W / 2, y: H - 70, vx: 0, cool: 0, triple: 0, hit: 0, walk: 0 },
      bullets: [], enemies: [], powers: [], particles: [], floaters: [],
      score: 0, uptime: 100, wave: 1, t: 0, spawn: 0, flash: 0, kills: 0,
    };
  }

  /* ---------- input ---------- */
  addEventListener('keydown', e => {
    if (!running) return;
    if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd', 'A', 'D'].includes(e.key)) e.preventDefault();
    if (e.key === 'p' || e.key === 'P') { paused = !paused; return; }
    keys[e.key.toLowerCase()] = true;
  });
  addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
  let touchX = null, touching = false;
  const toCanvasX = e => { const r = cvs.getBoundingClientRect(); return (e.clientX - r.left) * (W / r.width); };
  cvs.addEventListener('pointerdown', e => { touching = true; touchX = toCanvasX(e); });
  cvs.addEventListener('pointermove', e => { if (touching || e.pointerType === 'mouse') touchX = toCanvasX(e); });
  addEventListener('pointerup', () => { touching = false; });
  cvs.addEventListener('pointerleave', () => { if (!touching) touchX = null; });

  /* pause when the game scrolls out of view */
  new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting && running) paused = true; }), { threshold: .2 }).observe(cvs);

  /* ---------- drawing ---------- */
  function drawElephant(x, y, t, hit) {
    ctx.save();
    ctx.translate(x, y);
    const bob = Math.sin(t / 5) * 2;
    ctx.translate(0, bob);
    if (hit > 0 && Math.floor(hit / 4) % 2) ctx.globalAlpha = .4;
    const body = '#7b86c9', dark = '#5a64a8';
    // legs
    ctx.fillStyle = dark;
    [-26, -10, 8, 22].forEach((lx, i) => { ctx.beginPath(); ctx.roundRect(lx, 12 + (i % 2 ? Math.sin(t / 4) * 3 : -Math.sin(t / 4) * 3), 12, 22, 4); ctx.fill(); });
    // body
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(0, 4, 40, 28, 0, 0, Math.PI * 2); ctx.fill();
    // tail
    ctx.strokeStyle = dark; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-38, 0); ctx.quadraticCurveTo(-50, -6, -48, 8); ctx.stroke();
    // head
    ctx.beginPath(); ctx.ellipse(26, -22, 24, 22, 0, 0, Math.PI * 2); ctx.fill();
    // ear
    ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(12, -20, 14, 18, -.3, 0, Math.PI * 2); ctx.fill();
    // trunk aiming up (it is the cannon)
    ctx.strokeStyle = body; ctx.lineWidth = 11; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(40, -24); ctx.quadraticCurveTo(54, -36, 46, -58); ctx.stroke();
    ctx.fillStyle = '#c6f432'; ctx.beginPath(); ctx.arc(46, -60, 4, 0, Math.PI * 2); ctx.fill();
    // eye
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(32, -28, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(33, -28, 2.5, 0, Math.PI * 2); ctx.fill();
    // php label
    ctx.fillStyle = '#fff'; ctx.font = '900 15px Inter, Arial'; ctx.textAlign = 'center'; ctx.fillText('php', -6, 10);
    ctx.restore();
  }
  function drawBug(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(Math.sin(e.t / 10) * .15);
    const w = e.w, h = 30;
    // legs
    ctx.strokeStyle = e.color; ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
      const lw = Math.sin(e.t / 3 + i) * 4;
      ctx.beginPath(); ctx.moveTo(-w / 2, i * 8); ctx.lineTo(-w / 2 - 10, i * 8 + lw); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w / 2, i * 8); ctx.lineTo(w / 2 + 10, i * 8 - lw); ctx.stroke();
    }
    ctx.fillStyle = e.flash > 0 ? '#fff' : e.color;
    ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 12); ctx.fill();
    // antennae
    ctx.beginPath(); ctx.moveTo(-6, -h / 2); ctx.lineTo(-12, -h / 2 - 10); ctx.moveTo(6, -h / 2); ctx.lineTo(12, -h / 2 - 10); ctx.stroke();
    ctx.fillStyle = '#0b0a12'; ctx.font = '800 13px JetBrains Mono, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(e.label, 0, 1);
    if (e.maxHp > 1) {
      ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(-w / 2, h / 2 + 5, w, 4);
      ctx.fillStyle = '#4ade80'; ctx.fillRect(-w / 2, h / 2 + 5, w * e.hp / e.maxHp, 4);
    }
    ctx.restore();
  }
  function drawServer() {
    const y = H - 22;
    ctx.fillStyle = '#15131f'; ctx.fillRect(0, y, W, 22);
    for (let x = 10; x < W; x += 60) {
      ctx.fillStyle = '#211d33'; ctx.fillRect(x, y + 5, 48, 12);
      ctx.fillStyle = (Math.floor(st.t / 10 + x) % 3) ? '#22c55e' : '#16a34a'; ctx.fillRect(x + 4, y + 9, 4, 4);
      ctx.fillStyle = st.uptime < 35 && Math.floor(st.t / 6) % 2 ? '#ef4444' : '#334155'; ctx.fillRect(x + 12, y + 9, 4, 4);
    }
  }
  function hud() {
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#ece9f6'; ctx.font = '700 16px JetBrains Mono, monospace';
    ctx.fillText(`score ${st.score}`, 16, 14);
    ctx.fillStyle = '#9a94b3'; ctx.font = '600 13px JetBrains Mono, monospace';
    ctx.fillText(`best ${Math.max(best, st.score)} · wave ${st.wave}`, 16, 36);
    // uptime bar
    const bw = 200, bx = W - bw - 16;
    ctx.fillStyle = '#9a94b3'; ctx.textAlign = 'right'; ctx.fillText(`uptime ${Math.max(0, st.uptime).toFixed(0)}%`, W - 16, 36);
    ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(bx, 16, bw, 10);
    ctx.fillStyle = st.uptime > 60 ? '#22c55e' : st.uptime > 30 ? '#f59e0b' : '#ef4444';
    ctx.fillRect(bx, 16, bw * Math.max(0, st.uptime) / 100, 10);
    if (st.p.triple > 0) { ctx.fillStyle = '#22c55e'; ctx.textAlign = 'left'; ctx.fillText(`triple shot ${Math.ceil(st.p.triple / 60)}s`, 16, 56); }
  }

  /* ---------- logic ---------- */
  function spawnEnemy() {
    const pool = st.wave < 2 ? ['404', 'null'] : st.wave < 4 ? ['404', 'null', '500', 'N+1'] : Object.keys(ENEMY);
    const label = pool[Math.floor(Math.random() * pool.length)];
    makeEnemy(label, 40 + Math.random() * (W - 80), -30);
  }
  function makeEnemy(label, x, y, vx = 0) {
    const d = ENEMY[label];
    ctx.font = '800 13px JetBrains Mono, monospace';
    const w = Math.max(46, ctx.measureText(label).width + 22);
    st.enemies.push({ label, x, y, vx, w, color: d.color, hp: d.hp, maxHp: d.hp, pts: d.pts, split: d.split, vy: d.speed * (1 + st.wave * .12) * (.8 + Math.random() * .4), t: Math.random() * 100, flash: 0 });
  }
  function shoot() {
    const p = st.p;
    const m = METHODS[Math.floor(Math.random() * METHODS.length)];
    const base = { x: p.x + 46, y: p.y - 60, label: m };
    st.bullets.push({ ...base, vx: 0, vy: -9 });
    if (p.triple > 0) { st.bullets.push({ ...base, vx: -2.4, vy: -8.6 }); st.bullets.push({ ...base, vx: 2.4, vy: -8.6 }); }
    p.cool = p.triple > 0 ? 9 : 12;
  }
  function burst(x, y, color, n = 14) {
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 4; st.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 30 + Math.random() * 20, color }); }
  }
  const floater = (x, y, text, color = '#fff') => st.floaters.push({ x, y, text, color, life: 50 });

  function update() {
    st.t++;
    const p = st.p;
    // movement
    let ax = 0;
    if (keys['arrowleft'] || keys['a']) ax -= 1;
    if (keys['arrowright'] || keys['d']) ax += 1;
    if (ax === 0 && touchX != null) { const dx = touchX - (p.x + 20); ax = Math.abs(dx) > 6 ? Math.sign(dx) : 0; }
    p.vx = p.vx * .8 + ax * 1.6;
    p.x = Math.max(50, Math.min(W - 60, p.x + p.vx));
    if (p.cool > 0) p.cool--;
    if (p.triple > 0) p.triple--;
    if (p.hit > 0) p.hit--;
    if ((keys[' '] || touching) && p.cool <= 0) shoot();

    // waves
    st.wave = 1 + Math.floor(st.kills / 15);
    st.spawn--;
    if (st.spawn <= 0) { spawnEnemy(); st.spawn = Math.max(22, 70 - st.wave * 6) * (.7 + Math.random() * .6); }
    if (st.t % 600 === 0) {
      const kinds = Object.keys(POWER);
      const kind = st.uptime < 60 && Math.random() < .5 ? 'heal' : kinds[Math.floor(Math.random() * kinds.length)];
      st.powers.push({ kind, x: 60 + Math.random() * (W - 120), y: -20, t: 0 });
    }

    st.bullets.forEach(b => { b.x += b.vx; b.y += b.vy; });
    st.bullets = st.bullets.filter(b => b.y > -30 && b.x > -40 && b.x < W + 40);

    st.enemies.forEach(e => { e.t++; e.y += e.vy; e.x += e.vx + Math.sin(e.t / 25) * .6; e.x = Math.max(e.w / 2, Math.min(W - e.w / 2, e.x)); if (e.flash) e.flash--; });

    // bullet hits
    for (const b of st.bullets) {
      for (const e of st.enemies) {
        if (e.dead) continue;
        if (Math.abs(b.x - e.x) < e.w / 2 + 8 && Math.abs(b.y - e.y) < 22) {
          b.dead = true; e.hp--; e.flash = 4;
          if (e.hp <= 0) {
            e.dead = true; st.score += e.pts; st.kills++;
            burst(e.x, e.y, e.color);
            floater(e.x, e.y, `+${e.pts} ${['200 OK', '201 Created', '204 No Content'][Math.floor(Math.random() * 3)]}`, '#4ade80');
            if (e.split) { makeEnemy('404', e.x - 20, e.y, -1.5); makeEnemy('404', e.x + 20, e.y, 1.5); }
          }
          break;
        }
      }
    }
    st.bullets = st.bullets.filter(b => !b.dead);

    // enemies reaching server or elephant
    for (const e of st.enemies) {
      if (e.dead) continue;
      if (Math.abs(e.x - p.x) < e.w / 2 + 36 && Math.abs(e.y - (p.y - 5)) < 40 && p.hit === 0) {
        e.dead = true; st.uptime -= 12; p.hit = 60; st.flash = 10; burst(e.x, e.y, '#ef4444', 20); floater(p.x, p.y - 80, 'Fatal error!', '#ef4444');
      } else if (e.y > H - 30) {
        e.dead = true; st.uptime -= 8; st.flash = 8; burst(e.x, H - 30, e.color); floater(e.x, H - 50, `${e.label} in prod`, '#f87171');
      }
    }
    st.enemies = st.enemies.filter(e => !e.dead);

    // power-ups
    st.powers.forEach(pw => { pw.t++; pw.y += 1.6; });
    for (const pw of st.powers) {
      if (Math.abs(pw.x - p.x) < 60 && Math.abs(pw.y - (p.y - 10)) < 45) {
        pw.dead = true;
        if (pw.kind === 'composer') { p.triple = 600; floater(p.x, p.y - 90, 'triple shot installed', '#22c55e'); }
        if (pw.kind === 'flush') { st.enemies.forEach(e => { burst(e.x, e.y, '#38bdf8', 8); st.score += Math.floor(e.pts / 2); }); st.enemies = []; floater(W / 2, H / 2, 'cache flushed ✨', '#38bdf8'); }
        if (pw.kind === 'heal') { st.uptime = Math.min(100, st.uptime + 25); floater(p.x, p.y - 90, 'hotfix deployed +25%', '#facc15'); }
      }
    }
    st.powers = st.powers.filter(pw => !pw.dead && pw.y < H);

    st.particles.forEach(q => { q.x += q.vx; q.y += q.vy; q.vy += .08; q.life--; });
    st.particles = st.particles.filter(q => q.life > 0);
    st.floaters.forEach(f => { f.y -= .8; f.life--; });
    st.floaters = st.floaters.filter(f => f.life > 0);
    if (st.flash) st.flash--;
    p.walk += Math.abs(p.vx);

    if (st.uptime <= 0) gameOver();
  }

  function render() {
    ctx.fillStyle = '#0d0b18'; ctx.fillRect(0, 0, W, H);
    stars.forEach(s => { s.y += s.v; if (s.y > H) s.y = 0; ctx.fillStyle = `rgba(255,255,255,${s.s / 3})`; ctx.fillRect(s.x, s.y, s.s, s.s); });
    if (st.flash) { ctx.fillStyle = `rgba(239,68,68,${st.flash / 40})`; ctx.fillRect(0, 0, W, H); }
    drawServer();
    st.powers.forEach(pw => {
      const P = POWER[pw.kind];
      ctx.save(); ctx.translate(pw.x, pw.y);
      ctx.font = '800 12px JetBrains Mono, monospace';
      const w = ctx.measureText(P.label).width + 20;
      ctx.shadowColor = P.color; ctx.shadowBlur = 16 + Math.sin(pw.t / 6) * 6;
      ctx.fillStyle = P.color; ctx.beginPath(); ctx.roundRect(-w / 2, -13, w, 26, 13); ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle = '#0b0a12'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(P.label, 0, 1);
      ctx.restore();
    });
    st.enemies.forEach(drawBug);
    st.bullets.forEach(b => {
      ctx.save(); ctx.translate(b.x, b.y);
      ctx.font = '800 11px JetBrains Mono, monospace';
      const w = ctx.measureText(b.label).width + 12;
      ctx.shadowColor = '#c6f432'; ctx.shadowBlur = 12;
      ctx.fillStyle = '#c6f432'; ctx.beginPath(); ctx.roundRect(-w / 2, -9, w, 18, 6); ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle = '#11140a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.label, 0, 1);
      ctx.restore();
    });
    drawElephant(st.p.x, st.p.y, st.t, st.p.hit);
    st.particles.forEach(q => { ctx.globalAlpha = q.life / 50; ctx.fillStyle = q.color; ctx.fillRect(q.x, q.y, 3, 3); });
    ctx.globalAlpha = 1;
    st.floaters.forEach(f => { ctx.globalAlpha = f.life / 50; ctx.fillStyle = f.color; ctx.font = '700 13px JetBrains Mono, monospace'; ctx.textAlign = 'center'; ctx.fillText(f.text, f.x, f.y); });
    ctx.globalAlpha = 1;
    hud();
    if (paused) {
      ctx.fillStyle = 'rgba(11,10,18,.6)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff'; ctx.font = '900 34px Inter, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Paused', W / 2, H / 2 - 10);
      ctx.font = '500 15px Inter, Arial'; ctx.fillStyle = '#9a94b3'; ctx.fillText('press P or tap to continue', W / 2, H / 2 + 24);
    }
  }

  /* fixed 60 Hz simulation step, independent of the display refresh rate */
  const STEP = 1000 / 60;
  let last = 0, acc = 0;
  function frame(now) {
    if (!running) return;
    if (!last) last = now;
    acc = Math.min(acc + (now - last), STEP * 8);
    last = now;
    while (acc >= STEP) { if (!paused && running) update(); acc -= STEP; }
    render();
    raf = requestAnimationFrame(frame);
  }
  cvs.addEventListener('click', () => { if (running && paused) paused = false; });

  function start() {
    reset(); keys = {}; running = true; paused = false;
    overlay.classList.add('hidden');
    cancelAnimationFrame(raf); last = 0; acc = 0; raf = requestAnimationFrame(frame);
  }
  function gameOver() {
    running = false;
    const record = st.score > best;
    if (record) { best = st.score; localStorage.setItem('elephpant-best', best); }
    render();
    goTitle.textContent = record ? 'New record! 🏆' : '502 Bad Gateway';
    goText.innerHTML = `Score <b>${st.score}</b> · wave ${st.wave} · ${st.kills} bugs fixed.<br>${st.score > 1500 ? 'Senior-level debugging. Let’s work together →' : 'Even seniors get paged at 3 am. Try again?'}`;
    startBtn.textContent = 'Redeploy';
    overlay.classList.remove('hidden');
  }
  startBtn.addEventListener('click', start);


  // idle preview frame
  reset();
  st.enemies = [];
  makeEnemy('404', 220, 140); makeEnemy('500', 480, 90); makeEnemy('N+1', 690, 180);
  st.bullets.push({ x: W / 2 + 46, y: 300, vx: 0, vy: 0, label: 'POST' });
  render();
})();
