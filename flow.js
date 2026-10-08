/* Workflow diagram for a single case page. Same look and motion as the home page's
   automation panel (main.js), but it plays one flow only and has no tabs.
   Needs data.js (IC, QUIPS) and, for motion, GSAP. */
function mountFlow(flow, els) {
  const G = window.gsap;
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION = !!G && !REDUCED;
  const { svg, idEl, nodesEl, stepEl, msEl, toggleEl } = els;
  const svgEl = (n, a = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', n); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const PLAY = '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3 1.5v9l7-4.5z"/></svg>';
  const PAUSE = '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3 2h2.2v8H3zM6.8 2H9v8H6.8z"/></svg>';

  let playing = true, branchFlip = 0, runs = 0, tl = null, delayed = null, nodeMap = {}, edgeMap = {};

  function draw() {
    const vertical = window.innerWidth < 760;
    svg.textContent = '';
    nodeMap = {}; edgeMap = {};

    const NW = vertical ? 196 : 150, NH = vertical ? 48 : 54;
    let W, H, pos;
    const maxC = Math.max(...flow.nodes.map((n) => n.c));

    if (vertical) {
      const order = [...flow.nodes].sort((a, b) => a.c - b.c || a.r - b.r);
      const step = 84, PAD = 26;
      W = 340; H = PAD * 2 + (order.length - 1) * step + NH;
      pos = (n) => ({ x: (W - NW) / 2 + (n.r > 0 ? 24 : n.r < 0 ? -24 : 0), y: PAD + order.indexOf(n) * step });
    } else {
      const PAD = 34, ROWH = 104;
      W = 1120; H = 296;
      const colw = (W - PAD * 2 - NW) / maxC;
      pos = (n) => ({ x: PAD + n.c * colw, y: (H - NH) / 2 + n.r * ROWH });
    }
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    const box = {};
    flow.nodes.forEach((n) => { const p = pos(n); box[n.id] = { ...p, w: NW, h: NH }; });

    const gEdges = svgEl('g');
    svg.appendChild(gEdges);

    flow.edges.forEach(([a, b, lab]) => {
      const A = box[a], B = box[b];
      let d;
      if (vertical) {
        const x1 = A.x + A.w / 2, y1 = A.y + A.h, x2 = B.x + B.w / 2, y2 = B.y;
        const dy = Math.max(18, (y2 - y1) * .5);
        d = `M${x1} ${y1}C${x1} ${y1 + dy} ${x2} ${y2 - dy} ${x2} ${y2}`;
      } else {
        const x1 = A.x + A.w, y1 = A.y + A.h / 2, x2 = B.x, y2 = B.y + B.h / 2;
        const dx = Math.max(26, (x2 - x1) * .45);
        d = `M${x1} ${y1}C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
      }
      const base = svgEl('path', { d, class: 'e-base' });
      const live = svgEl('path', { d, class: 'e-live' });
      gEdges.appendChild(base); gEdges.appendChild(live);
      if (lab) {
        const pt = base.getPointAtLength(base.getTotalLength() * .5);
        const t = svgEl('text', vertical
          ? { x: pt.x + 9, y: pt.y + 3, class: 'e-lbl' }
          : { x: pt.x, y: pt.y - 7, class: 'e-lbl', 'text-anchor': 'middle' });
        t.textContent = lab;
        gEdges.appendChild(t);
      }
      edgeMap[a + '>' + b] = live;
    });

    flow.nodes.forEach((n) => {
      const p = box[n.id];
      const g = svgEl('g', { class: 'node', transform: `translate(${p.x} ${p.y})` });
      g.appendChild(svgEl('rect', { width: NW, height: NH, rx: 9 }));
      const ic = svgEl('g', { class: 'ic', transform: `translate(14 ${NH / 2 - 8}) scale(.68)` });
      ic.appendChild(svgEl('path', { d: IC[n.k] }));
      g.appendChild(ic);
      const nm = svgEl('text', { x: 38, y: NH / 2 - 2, class: 'nm' }); nm.textContent = n.nm;
      const sb = svgEl('text', { x: 38, y: NH / 2 + 13, class: 'sb' }); sb.textContent = n.sb;
      g.appendChild(nm); g.appendChild(sb);
      svg.appendChild(g);
      nodeMap[n.id] = g;
    });

    const packet = svgEl('g', { opacity: 0 });
    packet.appendChild(svgEl('circle', { r: 7, fill: 'var(--acc)', opacity: .16 }));
    packet.appendChild(svgEl('circle', { r: 2.6, fill: 'var(--acc)' }));
    svg.appendChild(packet);

    idEl.textContent = flow.id;
    nodesEl.textContent = flow.nodes.length + ' nodes · ' + flow.edges.length + ' connections';
    return packet;
  }

  function activePath() {
    const path = [flow.nodes[0].id];
    for (;;) {
      const cur = path[path.length - 1];
      const out = flow.edges.filter((e) => e[0] === cur);
      if (!out.length) break;
      path.push(out.length > 1 ? out[branchFlip % out.length][1] : out[0][1]);
    }
    return path;
  }

  function stop() {
    if (tl) { tl.kill(); tl = null; }
    if (delayed) { delayed.kill(); delayed = null; }
    Object.values(nodeMap).forEach((g) => g.classList.remove('on'));
    Object.values(edgeMap).forEach((p) => { p.style.opacity = 0; p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; });
  }

  function run() {
    const packet = draw();
    const path = activePath();
    const quips = QUIPS[flow.id] || QUIPS._;
    const done = () => { stepEl.innerHTML = flow.id + ' · <span class="ok">ok</span> · ' + quips[runs % quips.length]; };

    if (!MOTION) {
      path.forEach((id) => nodeMap[id].classList.add('on'));
      done();
      msEl.textContent = '';
      return;
    }

    tl = G.timeline({
      onUpdate() { msEl.textContent = Math.round(tl.time() * 1000) + 'ms'; },
      onComplete() {
        done();
        branchFlip++; runs++;
        delayed = G.delayedCall(1.45, () => { stop(); run(); });
        if (!playing) delayed.pause();
      },
    });

    path.forEach((id, i) => {
      const g = nodeMap[id];
      tl.call(() => { g.classList.add('on'); stepEl.textContent = flow.id + ' · ' + id; }, null, '+=0');
      tl.fromTo(g, { scale: 1 }, { scale: 1.022, duration: .12, yoyo: true, repeat: 1, ease: 'power2.out' });

      const next = path[i + 1];
      if (!next) return;
      const edge = edgeMap[id + '>' + next];
      const len = edge.getTotalLength();
      const state = { p: 0 };
      tl.set(edge, { opacity: 1, strokeDasharray: len, strokeDashoffset: len });
      tl.set(packet, { opacity: 1 });
      tl.to(state, {
        p: 1, duration: .46, ease: 'power1.inOut',
        onUpdate() {
          const pt = edge.getPointAtLength(state.p * len);
          packet.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
          edge.style.strokeDashoffset = String(len * (1 - state.p));
        },
      });
      tl.set(packet, { opacity: 0 });
      tl.to(edge, { opacity: .3, duration: .45 }, '-=.3');
    });
  }

  function setPlaying(v) {
    playing = v;
    toggleEl.innerHTML = v ? PAUSE : PLAY;
    toggleEl.setAttribute('aria-label', v ? 'Pause' : 'Play');
    if (tl) tl.paused(!v);
    if (delayed) delayed.paused(!v);
  }
  toggleEl.addEventListener('click', () => setPlaying(!playing));

  let rz;
  window.addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { stop(); run(); if (!playing) setPlaying(false); }, 220);
  });

  if (MOTION) { toggleEl.innerHTML = PAUSE; toggleEl.setAttribute('aria-label', 'Pause'); } else { toggleEl.style.display = 'none'; }
  run();
}
