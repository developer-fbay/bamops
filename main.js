(() => {
'use strict';
const G = window.gsap;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOTION = !!G && !REDUCED;
const $ = (s) => document.querySelector(s);
const svgEl = (n, a = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', n); for (const k in a) e.setAttribute(k, a[k]); return e; };

/* ---------- case files ---------- */
// No client names, URLs or screenshots in here. `client` is only the width of the
// redaction bar in characters, so the real name never reaches the page source.
const CASES = [
  { name: 'The Brain', sector: 'finance · deal management', note: 'deal os. it thinks.', tag: 'vue · supabase', sch: 'app', client: 11,
    problem: 'Deals lived in inboxes, spreadsheets and one person\'s memory. When that person went on holiday, so did the pipeline.',
    fix: 'One operating system for every deal, intake to payout. It remembers everything and nags people politely.',
    result: 'One source of truth. Holidays are allowed again.',
    quip: 'Named accurately.' },
  { name: 'Comparison Engine', sector: 'fintech · lead gen', note: '95% right, 100% certain.', tag: '30+ sources', sch: 'form', client: 9,
    problem: 'Matching a business to the right funder meant hours of phone calls and a lot of gut feel.',
    fix: 'An engine that cross-checks 30+ sources and returns a shortlist in seconds.',
    result: '95% right, 100% certain.',
    quip: 'The other 5% are character-building.' },
  { name: 'Partner Portal', sector: 'b2b · introducers', note: 'CSV is an API.', tag: 'vue · supabase', sch: 'portal', client: 8,
    problem: 'Referrals arrived by email, WhatsApp and occasionally carrier pigeon. Nobody knew who was owed what.',
    fix: 'A portal where partners submit, track and get paid without chasing anyone.',
    result: 'Fewer "just following up" emails. Possibly zero.',
    quip: 'CSV is an API. Everyone insisted.' },
  // TODO: placeholder copy until the real A/B testing project details arrive.
  { name: 'A/B Testing', sector: 'growth · experimentation', note: 'B won. B usually wins.', tag: 'experiments', sch: 'ab', client: 10,
    problem: 'Decisions were made by whoever spoke loudest in the meeting.',
    fix: 'A testing setup that splits traffic, tracks what matters and calls a winner.',
    result: 'Opinions are now optional.',
    quip: 'Variant B. It\'s always variant B.' },
  { name: 'Room Booking', sector: 'property · coworking', note: 'the 3pm slot is gone.', tag: 'n8n · calendar', sch: 'cal', client: 12,
    problem: 'Meeting rooms double-booked, invoices forgotten, doors locked on the wrong people.',
    fix: 'Booking, confirmations, door access and invoicing in one flow.',
    result: 'Nobody fights over the 3pm slot any more. It\'s just gone.',
    quip: 'It was gone before you read this.' },
];

const SCH = {
  app: `<rect class="sch" x="8" y="8" width="296" height="172" rx="7"/><path class="sch" d="M70 8v172M8 34h296"/>
    <rect class="sch-f" x="18" y="46" width="42" height="7" rx="3"/><rect class="sch-a" x="18" y="62" width="42" height="7" rx="3"/>
    <rect class="sch-f" x="18" y="78" width="34" height="7" rx="3"/><rect class="sch-f" x="18" y="94" width="38" height="7" rx="3"/>
    <rect class="sch-f" x="18" y="18" width="30" height="7" rx="3"/><rect class="sch-f" x="82" y="18" width="54" height="7" rx="3"/>
    <rect class="sch-f" x="82" y="48" width="104" height="8" rx="3"/><rect class="sch-f" x="200" y="48" width="48" height="8" rx="3"/>
    <path class="sch" d="M82 70h212M82 94h212M82 118h212M82 142h212"/>
    <rect class="sch-f" x="82" y="78" width="88" height="7" rx="3"/><rect class="sch-f" x="200" y="78" width="40" height="7" rx="3"/>
    <rect class="sch-f" x="82" y="102" width="72" height="7" rx="3"/><rect class="sch-a" x="200" y="102" width="40" height="7" rx="3"/>
    <rect class="sch-f" x="82" y="126" width="96" height="7" rx="3"/><rect class="sch-f" x="200" y="126" width="40" height="7" rx="3"/>
    <rect class="sch-f" x="82" y="150" width="64" height="7" rx="3"/><rect class="sch-f" x="200" y="150" width="40" height="7" rx="3"/>`,
  form: `<rect class="sch" x="8" y="8" width="296" height="172" rx="7"/>
    <rect class="sch-f" x="96" y="26" width="120" height="8" rx="4"/>
    <rect class="sch" x="78" y="50" width="156" height="22" rx="5"/><rect class="sch-f" x="88" y="58" width="52" height="7" rx="3"/>
    <rect class="sch" x="78" y="80" width="156" height="22" rx="5"/><rect class="sch-f" x="88" y="88" width="76" height="7" rx="3"/>
    <rect class="sch" x="78" y="110" width="156" height="22" rx="5"/><rect class="sch-f" x="88" y="118" width="40" height="7" rx="3"/>
    <rect class="sch-a" x="78" y="146" width="156" height="22" rx="5"/>`,
  portal: `<rect class="sch" x="8" y="8" width="296" height="172" rx="7"/><path class="sch" d="M8 34h296"/>
    <rect class="sch-f" x="18" y="18" width="44" height="7" rx="3"/><rect class="sch-f" x="262" y="17" width="30" height="9" rx="4"/>
    <rect class="sch" x="18" y="48" width="130" height="54" rx="6"/><rect class="sch-a" x="30" y="62" width="48" height="12" rx="4"/><rect class="sch-f" x="30" y="82" width="86" height="7" rx="3"/>
    <rect class="sch" x="164" y="48" width="130" height="54" rx="6"/><rect class="sch-f" x="176" y="62" width="40" height="12" rx="4"/><rect class="sch-f" x="176" y="82" width="70" height="7" rx="3"/>
    <path class="sch" d="M18 126h276M18 150h276"/>
    <rect class="sch-f" x="18" y="112" width="92" height="7" rx="3"/><rect class="sch-f" x="18" y="134" width="120" height="7" rx="3"/><rect class="sch-f" x="18" y="158" width="78" height="7" rx="3"/>`,
  ab: `<rect class="sch" x="8" y="8" width="296" height="172" rx="7"/>
    <rect class="sch" x="20" y="20" width="128" height="96" rx="6"/><rect class="sch" x="164" y="20" width="128" height="96" rx="6"/>
    <rect class="sch-f" x="32" y="32" width="40" height="7" rx="3"/><rect class="sch-f" x="176" y="32" width="40" height="7" rx="3"/>
    <rect class="sch-f" x="32" y="48" width="96" height="6" rx="3"/><rect class="sch-f" x="176" y="48" width="96" height="6" rx="3"/>
    <rect class="sch-f" x="32" y="60" width="72" height="6" rx="3"/><rect class="sch-f" x="176" y="60" width="72" height="6" rx="3"/>
    <rect class="sch" x="32" y="88" width="60" height="16" rx="8"/><rect class="sch-a" x="176" y="88" width="60" height="16" rx="8"/>
    <rect class="sch-f" x="20" y="132" width="110" height="10" rx="3"/><rect class="sch-a" x="20" y="150" width="190" height="10" rx="3"/>
    <path class="sch" d="M20 168h272"/>`,
  cal: `<rect class="sch" x="8" y="8" width="296" height="172" rx="7"/><path class="sch" d="M8 36h296"/>
    <rect class="sch-f" x="18" y="18" width="52" height="7" rx="3"/><rect class="sch-f" x="258" y="17" width="34" height="9" rx="4"/>
    <path class="sch" d="M50 36v144M92 36v144M134 36v144M176 36v144M218 36v144M260 36v144M8 72h296M8 108h296M8 144h296"/>
    <rect class="sch-a" x="54" y="78" width="34" height="24" rx="4"/>
    <rect class="sch-f" x="138" y="42" width="34" height="24" rx="4"/>
    <rect class="sch-a" x="180" y="114" width="34" height="24" rx="4"/>
    <rect class="sch-f" x="222" y="78" width="34" height="24" rx="4"/>
    <rect class="sch-f" x="96" y="150" width="34" height="24" rx="4"/>`,
};

const caseNo = (i) => `case_${String(i + 1).padStart(2, '0')}`;
const redact = (len, label) =>
  `<span class="redact" role="img" aria-label="${label}" title="nice try" style="width:${len}ch"></span>`;

const CHEV = '<svg class="arw" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M6 4l4 4-4 4"/></svg>';

const writeup = (c) => `<p class="client">client: ${redact(c.client, 'Client name redacted')}</p>
  <dl>
    <div><dt>Problem</dt><dd>${c.problem}</dd></div>
    <div><dt>Fix</dt><dd>${c.fix}</dd></div>
    <div class="res"><dt>Result</dt><dd>${c.result}</dd></div>
  </dl>
  <p class="quip">${c.quip}</p>`;

const card = (c, i) => `<div class="case-top"><i></i><i></i><i></i><span>${caseNo(i)}</span><span>${c.sector}</span></div>
  <div class="case-prev"><svg viewBox="0 0 312 188">${SCH[c.sch]}</svg><span class="stamp">redacted</span></div>
  <div class="case-body"><h3>${c.name}</h3>${writeup(c)}<div class="case-foot"><span class="tag">${c.tag}</span></div></div>`;

$('#case-count').textContent = String(CASES.length).padStart(2, '0');
// The side card is visual only; each row carries its own write-up, which screen readers
// get on every width and everyone gets inline on narrow screens where the card is hidden.
$('#sys-list').innerHTML = CASES.map((c, i) => `<li>
  <button type="button" class="row" data-i="${i}" aria-pressed="${i === 0}">
    <span class="i">${String(i + 1).padStart(2, '0')}</span>
    <span class="t"><b>${c.name}</b><span>${c.sector} — ${c.note}</span></span>
    <span class="r"><span class="tag">${c.tag}</span>${CHEV}</span>
  </button>
  <div class="wu">${writeup(c)}</div>
</li>`).join('');

const prev = $('#prev');
const sysList = $('#sys-list');
const rows = [...sysList.querySelectorAll('.row')];
let shown = -1, pinned = 0;

function showCase(i) {
  if (i === shown) return;
  shown = i;
  prev.innerHTML = card(CASES[i], i);
  rows.forEach((r, k) => r.classList.toggle('on', k === i));
  if (MOTION) G.fromTo(prev.children, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .28, stagger: .04, ease: 'power2.out' });
}

function pinCase(i) {
  pinned = i;
  rows.forEach((r, k) => r.setAttribute('aria-pressed', String(k === i)));
  showCase(i);
}

rows.forEach((r, i) => {
  r.addEventListener('mouseenter', () => showCase(i));
  r.addEventListener('focus', () => showCase(i));
  r.addEventListener('click', () => pinCase(i));
});
sysList.addEventListener('mouseleave', () => showCase(pinned));
sysList.addEventListener('focusout', (e) => {
  if (!sysList.contains(e.relatedTarget)) showCase(pinned);
});
showCase(0);

/* ---------- menu ---------- */
const menuBtn = $('#menu-btn');
const menu = $('#menu');
const NARROW = matchMedia('(max-width:980px)');

$('#menu-count').textContent = String(CASES.length).padStart(2, '0');
$('#menu-list').innerHTML = CASES.map((c, i) => `<li><a href="#systems" data-i="${i}">
  <span class="i">${String(i + 1).padStart(2, '0')}</span>
  <span><b>${c.name}</b><small>${c.sector}</small></span>
</a></li>`).join('');

let menuOn = false;
function setMenu(on) {
  menuOn = on;
  document.body.classList.toggle('menu-on', on);
  menu.inert = !on;
  menuBtn.setAttribute('aria-expanded', String(on));
  menuBtn.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
  if (on) menu.querySelector('a').focus();
}

menuBtn.addEventListener('click', () => setMenu(!menuOn));
$('#menu-scrim').addEventListener('click', () => setMenu(false));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOn) { setMenu(false); menuBtn.focus(); } });

$('#menu-list').addEventListener('click', (e) => {
  const a = e.target.closest('a'); if (!a) return;
  e.preventDefault();
  const i = +a.dataset.i;
  setMenu(false);
  pinCase(i);
  // Narrow screens have no side card, so go straight to that project's inline write-up.
  const target = NARROW.matches ? rows[i].closest('li') : $('#systems');
  target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  rows[i].focus({ preventScroll: true });
});

/* ---------- workflows ---------- */
const IC = {
  trigger: 'M13 3 5 14h5l-1 7 8-11h-5z',
  http: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c2.6 2.4 2.6 15.6 0 18M12 3c-2.6 2.4-2.6 15.6 0 18',
  ai: 'M12 4l1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7zM18 15l.7 1.8L20.5 17.5l-1.8.7L18 20l-.7-1.8-1.8-.7 1.8-.7z',
  branch: 'M7 4v16M7 9h6l4-4M7 15h6l4 4',
  db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  code: 'M9 7l-5 5 5 5M15 7l5 5-5 5',
  timer: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
  doc: 'M6 3h8l4 4v14H6zM14 3v4h4',
  bell: 'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0',
};

const FLOWS = [
  { id: 'enquiry.intake', nodes: [
      { id: 'hook', c: 0, r: 0, k: 'trigger', nm: 'Enquiry', sb: 'webhook' },
      { id: 'enrich', c: 1, r: 0, k: 'http', nm: 'Enrich', sb: 'companies house' },
      { id: 'classify', c: 2, r: 0, k: 'ai', nm: 'Classify', sb: 'model' },
      { id: 'gate', c: 3, r: 0, k: 'branch', nm: 'Qualified', sb: 'if' },
      { id: 'brain', c: 4, r: -.62, k: 'db', nm: 'Brain', sb: 'supabase' },
      { id: 'nurture', c: 4, r: .62, k: 'mail', nm: 'Nurture', sb: 'sequence' },
    ], edges: [['hook', 'enrich'], ['enrich', 'classify'], ['classify', 'gate'], ['gate', 'brain', 'true'], ['gate', 'nurture', 'false']] },
  { id: 'lender.match', nodes: [
      { id: 'app', c: 0, r: 0, k: 'trigger', nm: 'Application', sb: 'brain' },
      { id: 'criteria', c: 1, r: 0, k: 'code', nm: 'Criteria', sb: 'rules' },
      { id: 'score', c: 2, r: 0, k: 'ai', nm: 'Score', sb: 'model' },
      { id: 'cut', c: 3, r: 0, k: 'branch', nm: 'Shortlist', sb: 'top 5' },
      { id: 'pack', c: 4, r: -.62, k: 'doc', nm: 'Lender pack', sb: 'pdf' },
      { id: 'log', c: 4, r: .62, k: 'bell', nm: 'Reason', sb: 'log' },
    ], edges: [['app', 'criteria'], ['criteria', 'score'], ['score', 'cut'], ['cut', 'pack', 'true'], ['cut', 'log', 'false']] },
  { id: 'booking.ops', nodes: [
      { id: 'bk', c: 0, r: 0, k: 'trigger', nm: 'Booking', sb: 'webhook' },
      { id: 'avail', c: 1, r: 0, k: 'code', nm: 'Availability', sb: 'rooms' },
      { id: 'conf', c: 2, r: 0, k: 'mail', nm: 'Confirm', sb: 'ics' },
      { id: 'win', c: 3, r: 0, k: 'branch', nm: 'Window', sb: 'if' },
      { id: 'door', c: 4, r: -.62, k: 'http', nm: 'Access', sb: 'door api' },
      { id: 'inv', c: 4, r: .62, k: 'db', nm: 'Invoice', sb: 'ledger' },
    ], edges: [['bk', 'avail'], ['avail', 'conf'], ['conf', 'win'], ['win', 'door', 'true'], ['win', 'inv', 'false']] },
  { id: 'friday.deploy', nodes: [
      { id: 'commit', c: 0, r: 0, k: 'code', nm: 'Commit', sb: '--no-verify' },
      { id: 'tests', c: 1, r: 0, k: 'doc', nm: 'Skip tests', sb: 'flaky anyway' },
      { id: 'ship', c: 2, r: 0, k: 'http', nm: 'Deploy', sb: 'friday 16:58' },
      { id: 'pray', c: 3, r: 0, k: 'branch', nm: 'Pray', sb: 'if' },
      { id: 'pub', c: 4, r: -.62, k: 'timer', nm: 'Weekend', sb: 'clock out' },
      { id: 'undo', c: 4, r: .62, k: 'db', nm: 'Rollback', sb: 'git revert' },
    ], edges: [['commit', 'tests'], ['tests', 'ship'], ['ship', 'pray'], ['pray', 'pub', 'held'], ['pray', 'undo', 'oh no']] },
];

const QUIPS = {
  'friday.deploy': ['see you monday', 'nobody noticed', 'held, remarkably', 'the pub won'],
  _: ['nobody was paged', 'no standups were held', 'not a single ticket', 'no one had to be told', 'mildly pleased'],
};

const flowSvg = $('#flow');
const tabsEl = $('#tabs');
const stepEl = $('#run-step');
const msEl = $('#run-ms');
const toggleEl = $('#toggle');
const PLAY = '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3 1.5v9l7-4.5z"/></svg>';
const PAUSE = '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3 2h2.2v8H3zM6.8 2H9v8H6.8z"/></svg>';

$('#flow-count').textContent = String(FLOWS.length).padStart(2, '0');
tabsEl.innerHTML = FLOWS.map((f, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === 0}">${f.id}</button>`).join('');

let activeFlow = 0, playing = true, branchFlip = 0, runs = 0, tl = null, delayed = null, nodeMap = {}, edgeMap = {};

function draw(flow) {
  const vertical = window.innerWidth < 760;
  flowSvg.textContent = '';
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
  flowSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const box = {};
  flow.nodes.forEach((n) => { const p = pos(n); box[n.id] = { ...p, w: NW, h: NH }; });

  const gEdges = svgEl('g');
  flowSvg.appendChild(gEdges);

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
    flowSvg.appendChild(g);
    nodeMap[n.id] = g;
  });

  const packet = svgEl('g', { id: 'packet', opacity: 0 });
  packet.appendChild(svgEl('circle', { r: 7, fill: 'var(--acc)', opacity: .16 }));
  packet.appendChild(svgEl('circle', { r: 2.6, fill: 'var(--acc)' }));
  flowSvg.appendChild(packet);

  $('#flow-id').textContent = flow.id;
  $('#flow-nodes').textContent = flow.nodes.length + ' nodes · ' + flow.edges.length + ' connections';
  return packet;
}

function activePath(flow) {
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
  const flow = FLOWS[activeFlow];
  const packet = draw(flow);
  const path = activePath(flow);

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

tabsEl.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  activeFlow = +b.dataset.i; branchFlip = 0;
  [...tabsEl.children].forEach((x, i) => x.setAttribute('aria-selected', String(i === activeFlow)));
  stop(); run();
  if (!playing && tl) tl.pause();
});

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

/* ---------- headline ---------- */
const PHRASES = ['Quietly load-bearing', 'Boringly reliable', 'Suspiciously calm', 'Mostly automated', 'Still standing'];
const typeEl = $('#type');
const caretEl = $('#caret');

function startHeadline(delay) {
  const TYPE = 46, JITTER = 58, ERASE = 28, HOLD = 2300, GAP = 420;
  let pi = 0, ci = 0, erasing = false;
  typeEl.textContent = '';

  const tick = () => {
    const word = PHRASES[pi];
    ci += erasing ? -1 : 1;
    typeEl.textContent = word.slice(0, ci);

    let wait, resting = false;
    if (!erasing && ci === word.length) { erasing = true; wait = HOLD; resting = true; }
    else if (erasing && ci === 0) { erasing = false; pi = (pi + 1) % PHRASES.length; wait = GAP; resting = true; }
    else wait = erasing ? ERASE : TYPE + Math.random() * JITTER;

    // The caret only blinks while a line rests; mid-word it stays solid, as a real one would.
    caretEl.classList.toggle('busy', !resting);
    setTimeout(tick, wait);
  };
  setTimeout(tick, delay);
}

/* ---------- typed page ---------- */
// Every stable line on the page, in document order. Anything the running workflow rewrites
// (#flow-id, #flow-nodes, #run-step) or hover rewrites (#prev-name) is left out, or typing
// would fight whatever set it last.
const TYPED = [
  '.hero p', '#type', '.stack span',
  '.head .n', '.head h2', '.head .meta',
  '.cases-intro', '.row .i', '.row .t b', '.row .t span', '.row .tag',
  '.tabs button', '.contact p', '.contact a.mail',
  'footer span', 'footer a',
].join(',');

const CHAR = 16, CHAR_JITTER = 12, SLOT = 58;

// Splits a line into a plain text node plus a transparent tail holding the rest. The whole
// string stays in the DOM throughout, so the line keeps its final size and its full text.
function splitLine(el, text) {
  const head = document.createTextNode('');
  const rest = document.createElement('span');
  rest.className = 'rest';
  rest.textContent = text;
  el.textContent = '';
  el.append(head, rest);
  return (n) => { head.nodeValue = text.slice(0, n); rest.textContent = text.slice(n); };
}

if (MOTION) {
  const lines = [...document.querySelectorAll(TYPED)]
    .filter((el) => el === typeEl || (!el.children.length && el.textContent.trim()));
  const order = new Map(lines.map((el, i) => [el, i]));
  const writers = new Map();

  // Split every line up front. Waiting until a line scrolls into view would show it whole
  // for a frame before it emptied, since the observer fires once it is already on screen.
  lines.filter((el) => el !== typeEl).forEach((el) => {
    const text = el.textContent;
    writers.set(el, { text, write: splitLine(el, text) });
  });

  let nextSlot = performance.now() + 160;

  // Lines claim successive openings rather than all firing at once, so a section arriving in
  // one go still fills top to bottom instead of appearing together.
  const claimSlot = () => {
    const now = performance.now();
    const at = Math.max(now, nextSlot);
    nextSlot = at + SLOT;
    return at - now;
  };

  const typeLine = (el) => {
    if (el === typeEl) { startHeadline(claimSlot()); return; }
    const { text, write } = writers.get(el);
    let i = 0;
    const step = () => {
      write(++i);
      if (i < text.length) setTimeout(step, CHAR + Math.random() * CHAR_JITTER);
      else el.textContent = text; // back to one text node once the line is whole
    };
    setTimeout(step, claimSlot());
  };

  const lineObs = new IntersectionObserver((ents, obs) => {
    // Entry order is not document order, and the cascade reads wrong without it.
    ents.filter((en) => en.isIntersecting)
      .sort((a, b) => order.get(a.target) - order.get(b.target))
      .forEach((en) => { obs.unobserve(en.target); typeLine(en.target); });
    // No bottom inset here on purpose: the footer sits inside the last few percent of the
    // viewport at full scroll, so insetting it would leave those lines untyped for good.
  }, { rootMargin: '0px' });

  lines.forEach((el) => lineObs.observe(el));
}

/* ---------- scroll rail ---------- */
const MARKS = [
  { id: 'intro', label: 'index' },
  { id: 'systems', label: 'case files' },
  { id: 'automation', label: 'automation' },
  { id: 'contact', label: 'contact' },
];
const MINORS = 3;

const rail = $('#rail');
rail.innerHTML = MARKS.map((m, i) =>
  `<a class="tk" href="#${m.id}"><b>${m.label}</b><i></i></a>` +
  (i === MARKS.length - 1 ? '' : '<span class="mn" aria-hidden="true"><i></i></span>'.repeat(MINORS))
).join('');

const marks = [...rail.querySelectorAll('.tk')];
const markTargets = MARKS.map((m) => document.getElementById(m.id));
let markI = -1;

function syncRail() {
  // Active mark is the last section whose top has crossed the upper third of the viewport,
  // so exactly one is lit at every scroll position.
  const line = window.innerHeight * .35;
  let i = 0;
  markTargets.forEach((el, k) => { if (el.getBoundingClientRect().top <= line) i = k; });
  // The closing section sits too near the page end to ever cross that line, so the last
  // stretch of scroll hands it over.
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80) i = marks.length - 1;
  if (i === markI) return;
  markI = i;
  marks.forEach((t, k) => {
    if (k === i) t.setAttribute('aria-current', 'true');
    else t.removeAttribute('aria-current');
  });
}
syncRail();
window.addEventListener('scroll', syncRail, { passive: true });
window.addEventListener('resize', syncRail);

/* ---------- terminal ---------- */
const termEl = $('#term');
const termOut = $('#term-out');
const termDoc = $('#term-doc');
const termIn = $('#term-in');
const modeBtn = $('#mode');

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

// One element per line, so a line can be rewritten in place while it types. The container is
// pre-wrap, so padding survives; pad before escaping, never after, or entities would be
// counted as columns and the tables would skew.
function write(html = '') {
  const el = document.createElement('div');
  el.className = 'ln';
  el.innerHTML = html;
  termDoc.appendChild(el);
  termOut.scrollTop = termOut.scrollHeight;
  return el;
}

const byIndexOrName = (list, arg, ...fields) => {
  if (!arg) return null;
  const n = Number(arg);
  if (Number.isInteger(n) && n >= 1 && n <= list.length) return list[n - 1];
  const q = arg.toLowerCase();
  return list.find((item) => fields.some((f) => item[f].toLowerCase().includes(q))) || null;
};

function cmdHelp() {
  const use = (k) => CMDS[k].use || k;
  const w = Math.max(...Object.keys(CMDS).map((k) => use(k).length));
  Object.keys(CMDS).forEach((k) => write(`  <em>${esc(use(k).padEnd(w))}</em>  <i>${esc(CMDS[k].about)}</i>`));
  write('');
  write(`  <i>also ${Object.keys(ALIAS).map((a) => esc(a)).join(', ')} · esc leaves</i>`);
  write('');
}

function cmdCases() {
  const nameW = Math.max(...CASES.map((c) => c.name.length));
  const secW = Math.max(...CASES.map((c) => c.sector.length));
  const stacked = window.innerWidth < 760;
  CASES.forEach((c, i) => {
    const n = String(i + 1).padStart(2, '0');
    if (stacked) {
      write(`<em>${n}</em>  ${esc(c.name)}`);
      write(`    <i>${esc(c.sector)}</i>`);
    } else {
      write(`<em>${n}</em>  ${esc(c.name.padEnd(nameW))}  <i>${esc(c.sector.padEnd(secW))}</i>`);
    }
  });
  write('');
  write('  <i>try <em>open 1</em> or <em>open brain</em>.</i>');
  write('');
}

function cmdOpen(arg) {
  const c = byIndexOrName(CASES, arg, 'name', 'sector');
  if (!c) { write(`  <i>${arg ? esc(arg) + ': no such case.' : 'open what? try <em>cases</em>.'}</i>`); return; }
  const w = termCols() - 12;
  const para = (label, text) => wrapText(text, w).forEach((t, k) =>
    write(`  <i>${(k ? '' : label).padEnd(9)}</i> ${esc(t)}`));
  write(`  <b>${esc(c.name)}</b> <i>· ${esc(c.sector)}</i>`);
  write('');
  para('problem', c.problem);
  para('fix', c.fix);
  para('result', c.result);
  write(`  <i>${'client'.padEnd(9)}</i> <i>████████████ · nice try.</i>`);
  write(`  <i>${'link'.padEnd(9)}</i> <i>also redacted. ask nicely: <em>contact</em></i>`);
  write('');
}

function cmdFlows() {
  const w = Math.max(...FLOWS.map((f) => f.id.length));
  FLOWS.forEach((f, i) => write(`<em>${String(i + 1).padStart(2, '0')}</em>  ${esc(f.id.padEnd(w))}` +
    `  <i>${f.nodes.length} nodes · ${f.edges.length} connections</i>`));
  write('');
  write('  <i>step one through with <em>run 1</em>.</i>');
  write('');
}

function cmdRun(arg) {
  const flow = byIndexOrName(FLOWS, arg, 'id');
  if (!flow) { write(`  <i>${arg ? esc(arg) + ': no such automation.' : 'run what? try <em>flows</em>.'}</i>`); return; }

  const path = activePath(flow);
  const w = Math.max(...flow.nodes.map((n) => n.nm.length));
  const quips = QUIPS[flow.id] || QUIPS._;
  const step = (id) => {
    const n = flow.nodes.find((x) => x.id === id);
    write(`  <em>-&gt;</em> ${esc(n.nm.padEnd(w))}  <i>${esc(n.sb)}</i>`);
  };
  const done = () => {
    write(`  <span class="ok">ok</span> <i>· ${esc(quips[Math.floor(Math.random() * quips.length)])}</i>`);
    write('');
    termIn.disabled = false;
    termIn.focus();
  };

  write(`<i>${esc(flow.id)}</i>`);
  if (!MOTION) { path.forEach(step); done(); return; }
  // Held shut while it steps, the way a shell holds the prompt until a command returns.
  termIn.disabled = true;
  path.forEach((id, k) => setTimeout(() => { step(id); if (k === path.length - 1) done(); }, 240 * (k + 1)));
}

// Read back off the page rather than restating it, so the two modes cannot drift apart.
// Direct children only: a mid-type chip holds a .rest wrapper that would otherwise be
// collected as a second copy of the same word.
const stackItems = () => [...document.querySelectorAll('.stack > span')].map((s) => s.textContent);

function cmdAbout() {
  write(`<b>BAMOPS</b> <i>— ${esc($('.hero .lbl').textContent.toLowerCase())}</i>`);
  write(esc($('.hero p:last-of-type').textContent));
  write('');
  write(`  <i>where  </i>${esc($('footer > span').textContent)}`);
  write(`  <i>stack  </i><i>${stackItems().length} of them · <em>stack</em> lists them</i>`);
  write('');
}

function cmdStack() {
  const items = stackItems();
  const w = Math.max(...items.map((i) => i.length)) + 3;
  const per = window.innerWidth < 760 ? 2 : 4;
  for (let i = 0; i < items.length; i += per) {
    write('  ' + items.slice(i, i + per).map((t) => esc(t.padEnd(w))).join(''));
  }
  write('');
}

function cmdContact() {
  const mail = $('.contact a.mail').textContent;
  write(esc($('.contact p').textContent));
  write(`<a href="mailto:${esc(mail)}">${esc(mail)}</a>`);
  write('');
}

/* ---------- the site, as a typed document ---------- */
// Terminal mode types the whole site out rather than waiting to be asked. Every line is built
// from the data the page itself renders from, so the two modes cannot drift apart.

// A line is a list of [text, class, href] segments, so it can be coloured and still typed
// character by character — typing raw HTML would put the tags on screen.
const FR = 'fr', KEY = 'em', HI = 'b', MUT = 'i';
// Characters per second. The frame snaps in, the dump is brisk the way a real one is, and a
// typed command is human-paced because a human is meant to have typed it.
const CPS = { frame: 800, body: 400, head: 160, cmd: 24 };

function renderSegs(segs, n) {
  let left = n, html = '';
  for (const [text, cls, href] of segs) {
    if (left <= 0) break;
    const part = text.slice(0, left);
    left -= part.length;
    const take = esc(part);
    if (href) html += `<a href="${esc(href)}"${cls ? ` class="${cls}"` : ''}>${take}</a>`;
    else html += cls ? `<span class="${cls}">${take}</span>` : take;
  }
  return html;
}

// Columns the output can actually fit, measured rather than assumed, so the rules and the
// right-aligned columns land whatever the font size clamps to.
function termCols() {
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
  probe.textContent = '0'.repeat(50);
  termOut.appendChild(probe);
  const ch = probe.getBoundingClientRect().width / 50;
  probe.remove();
  const cs = getComputedStyle(termOut);
  const inner = termOut.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const cols = Math.max(34, Math.min(74, Math.floor(inner / ch)));
  // Hand the measure to the layout so the centred block is exactly as wide as the text, and
  // fixed from the start — sizing it to its content would slide it about as lines arrive.
  // In pixels off the advance measured above, not in ch: ch rounds a shade under the real
  // cell, and over 74 of them a full-width line loses its last character to a wrap.
  termEl.style.setProperty('--doc-w', (cols * ch + 1) + 'px');
  termEl.style.setProperty('--gutter', (termOut.offsetWidth - termOut.clientWidth) + 'px');
  return cols;
}

function wrapText(s, w) {
  const out = [];
  let ln = '';
  s.split(/\s+/).forEach((word) => {
    if (ln && (ln + ' ' + word).length > w) { out.push(ln); ln = word; }
    else ln = ln ? ln + ' ' + word : word;
  });
  if (ln) out.push(ln);
  return out;
}

function buildDoc() {
  const W = termCols();
  const narrow = W < 46;
  const ops = [];
  const at = (cps, ...segs) => ops.push({ segs: segs.filter(Boolean), cps });
  const row = (...segs) => at(CPS.body, ...segs);
  const gap = () => ops.push({ segs: [], cps: CPS.frame });
  const hold = (ms) => ops.push({ ms });
  const indent = (pad, text, cls, w) => wrapText(text, w).forEach((t) => row([pad + t, cls]));

  // Right-aligns a trailing column against the measured width.
  const spread = (left, right) => ' '.repeat(Math.max(2, W - left - right));

  // Structural characters are ASCII on purpose. The box-drawing set is not in the mono face
  // and falls back to a narrower one, so a rule drawn with it cannot line up with the text.
  const divider = (n, label, count) => {
    const name = `${n} · ${label.toUpperCase()}` + (count ? ` · ${count}` : '');
    at(CPS.frame, ['== ', FR], [n, KEY], [' · ', FR], [label.toUpperCase(), HI],
      count ? [' · ', FR] : null, count ? [count, MUT] : null,
      [' ' + '='.repeat(Math.max(2, W - name.length - 4)), FR]);
  };

  /* someone at the keyboard */
  at(CPS.cmd, ['bamops:~$ ', 'pr'], ['cat ./bamops.site', '']);
  hold(300);
  gap();

  /* masthead */
  const sub = $('.hero .lbl').textContent.toLowerCase();
  if (narrow) {
    at(CPS.head, ['BAMOPS', HI]);
    row([sub, MUT]);
  } else {
    const bw = Math.max(6, sub.length) + 4;
    const edge = ['+' + '-'.repeat(bw - 2) + '+', FR];
    at(CPS.frame, edge);
    at(CPS.head, ['| ', FR], ['BAMOPS'.padEnd(bw - 4), HI], [' |', FR]);
    at(CPS.body, ['| ', FR], [sub.padEnd(bw - 4), MUT], [' |', FR]);
    at(CPS.frame, edge);
  }
  gap();

  /* hero */
  at(CPS.head, ['> ', KEY], [PHRASES[0], HI]);
  gap();
  indent('  ', $('.hero p:last-of-type').textContent, '', W - 2);
  gap();
  row(['  stack', MUT]);
  indent('    ', stackItems().join(' · '), '', W - 4);
  gap();
  gap();

  /* case files */
  divider('01', 'case files', $('#case-count').textContent);
  gap();
  indent('  ', $('.cases-intro').textContent, MUT, W - 2);
  gap();
  CASES.forEach((c, i) => {
    const n = String(i + 1).padStart(2, '0');
    const head = [['  [', FR], [n, KEY], ['] ', FR], [c.name, HI]];
    if (narrow) {
      row(...head);
      row(['       ' + c.tag, MUT]);
    } else {
      row(...head, [spread(7 + c.name.length, c.tag.length), ''], [c.tag, MUT]);
    }
    row(['       ' + c.sector, MUT]);
    indent('       ', c.result, '', W - 7);
    gap();
  });
  gap();

  /* automation */
  divider('02', 'automation', $('#flow-count').textContent);
  gap();
  FLOWS.forEach((f, i) => {
    const n = String(i + 1).padStart(2, '0');
    const meta = `${f.nodes.length} nodes · ${f.edges.length} edges`;
    const head = [['  [', FR], [n, KEY], ['] ', FR], [f.id, HI]];
    if (narrow) { row(...head); row(['       ' + meta, MUT]); }
    else row(...head, [spread(7 + f.id.length, meta.length), ''], [meta, MUT]);
    // The path the canvas is currently animating, as a chain.
    const chain = activePath(f).map((id) => f.nodes.find((x) => x.id === id).nm).join(' -> ');
    indent('       ', chain, MUT, W - 7);
    gap();
  });
  gap();

  /* contact */
  divider('03', 'contact', '');
  gap();
  indent('  ', $('.contact p').textContent, HI, W - 2);
  gap();
  const mail = $('.contact a.mail').textContent;
  row(['  ', ''], [mail, KEY, 'mailto:' + mail]);
  gap();
  gap();

  /* footer */
  // Direct children only: mid-type spans and links each hold a .rest wrapper, which a
  // descendant selector would collect as a second copy of the same words.
  const notes = [...document.querySelectorAll('footer > span')].map((s) => s.textContent);
  at(CPS.frame, ['  ' + '-'.repeat(Math.max(4, W - 4)), FR]);
  row(['  ' + notes[0], MUT]);
  const links = [];
  document.querySelectorAll('footer a').forEach((a, k) => {
    if (k) links.push([' · ', FR]);
    links.push([a.textContent, KEY, a.href]);
  });
  row(['  ', ''], ...links);
  row(['  ' + notes.slice(1).join(' · '), MUT]);
  gap();
  row(['  [eof]', FR]);
  gap();
  // Soft wrapping would restart this at column zero and lose the indent, so it is split by
  // hand once the aside no longer fits beside it.
  const keys = ['open 1', 'run 1', 'replay', 'help', 'exit'];
  const aside = '— or just read.';
  const hint = [['  ', '']];
  keys.forEach((k, j) => { if (j) hint.push([' · ', FR]); hint.push([k, KEY]); });
  const used = 2 + keys.join(' · ').length;
  if (used + aside.length + 3 <= W) at(CPS.body, ...hint, ['   ' + aside, MUT]);
  else { at(CPS.body, ...hint); row(['  ' + aside, MUT]); }
  gap();

  return ops;
}

let docId = 0;
let docSkip = null; // set while a document is in flight

function playDoc(ops) {
  const id = ++docId;
  let i = 0, el = null, op = null, total = 0, shown = 0;

  const paint = (n) => {
    el.innerHTML = renderSegs(op.segs, n) + (n < total ? '<span class="cur"></span>' : '');
    termOut.scrollTop = termOut.scrollHeight;
  };

  const rest = () => {
    if (el && shown < total) el.innerHTML = renderSegs(op.segs, Infinity);
    for (; i < ops.length; i++) {
      if (!ops[i].ms) write(renderSegs(ops[i].segs, Infinity));
    }
    termOut.scrollTop = termOut.scrollHeight;
    docSkip = null;
  };

  // Anything on screen can be cut short; the prompt is never held hostage.
  docSkip = () => { docId++; rest(); termIn.focus(); };

  if (!MOTION) { rest(); return; }

  // Only typing is allowed to cost time. Starting a line and clearing a blank one happen in
  // the same pass, or every line would pay for two idle frames and the dump would crawl.
  const step = () => {
    if (id !== docId) return;
    for (;;) {
      if (el && shown < total) {
        // One chunk per frame rather than one character per timer: below ~16ms the clamping
        // makes the rate a fiction, so ask for the frame and reveal what belongs in it.
        const wait = Math.max(16, 1000 / op.cps);
        shown = Math.min(total, shown + Math.max(1, Math.round(op.cps * wait / 1000)));
        paint(shown);
        setTimeout(step, wait);
        return;
      }
      if (i >= ops.length) { docSkip = null; termIn.focus(); return; }
      op = ops[i++];
      if (op.ms) { el = null; setTimeout(step, op.ms); return; }
      el = write('');
      total = op.segs.reduce((n, s) => n + s[0].length, 0);
      shown = 0;
    }
  };
  step();
}

function replay() {
  termDoc.textContent = '';
  playDoc(buildDoc());
}

const CMDS = {
  help: { about: 'this list', run: cmdHelp },
  replay: { about: 'type the site out again', run: replay },
  cases: { about: 'what we\'ve built', run: cmdCases },
  open: { use: 'open <n|name>', about: 'peek at one (no links, sorry)', run: cmdOpen },
  flows: { about: 'the automations', run: cmdFlows },
  run: { use: 'run <n|id>', about: 'step one through', run: cmdRun },
  about: { about: 'the short version', run: cmdAbout },
  stack: { about: 'what we build with', run: cmdStack },
  contact: { about: 'how to reach us', run: cmdContact },
  clear: { about: 'wipe the scrollback', run: () => { termDoc.textContent = ''; } },
  exit: { about: 'back to the website', run: () => setTerm(false) },
};
const ALIAS = { ls: 'cases', systems: 'cases', cat: 'replay', whoami: 'about', mail: 'contact', q: 'exit', quit: 'exit' };

const hist = [];
let histI = 0;

function exec(raw) {
  write(`<span class="pr">bamops:~$</span> ${esc(raw)}`);
  const line = raw.trim();
  if (!line) return;
  hist.push(line);
  histI = hist.length;

  const [word, ...rest] = line.split(/\s+/);
  const key = word.toLowerCase();
  const cmd = CMDS[key] || CMDS[ALIAS[key]];
  if (!cmd) { write(`  <i>${esc(word)}: not a thing. try <em>help</em>.</i>`); return; }
  cmd.run(rest.join(' '));
}

let termOn = false, booted = false, wasPlaying = false, wasAt = 0;

function setTerm(on) {
  if (on === termOn) return;
  termOn = on;

  // Read the scroll position before main leaves, or the page has already collapsed to zero.
  if (on) wasAt = window.scrollY;

  document.body.classList.toggle('term-on', on);
  if (on && menuOn) setMenu(false);

  if (on) {
    // The canvas is hidden now, so stop it rather than animate where nobody is looking.
    wasPlaying = playing;
    if (playing) setPlaying(false);
    // The document only plays itself the first time. Coming back mid-session should return
    // you to your scrollback, not start the whole thing over. Waiting on the font matters
    // because every rule length is measured from the mono advance, and the fallback's is
    // different; this resolves immediately once the face is in.
    if (!booted) { booted = true; document.fonts.ready.then(() => playDoc(buildDoc())); }
    termIn.focus();
  } else {
    if (wasPlaying) setPlaying(true);
    // 'instant' on purpose: the page sets scroll-behavior:smooth, and returning should land.
    window.scrollTo({ top: wasAt, behavior: 'instant' });
    menuBtn.focus();
  }
}

modeBtn.addEventListener('click', () => setTerm(false));

// The terminal has no button on the page any more; it lives behind the console.
window.terminal = () => { setTerm(true); return 'bamops:~$ welcome in. type help, or exit to leave.'; };

$('#term-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const raw = termIn.value;
  termIn.value = '';
  exec(raw);
});

// Any key or click runs the rest of the document out at once, the way holding a key through a
// slow dump does. The keystroke itself still lands in the input.
termIn.addEventListener('keydown', () => { if (docSkip) docSkip(); });

termIn.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
  if (!hist.length) return;
  e.preventDefault();
  histI = Math.max(0, Math.min(hist.length, histI + (e.key === 'ArrowUp' ? -1 : 1)));
  termIn.value = hist[histI] || '';
});

window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && termOn) setTerm(false); });

// Clicking the scrollback returns you to the prompt, unless you were selecting or following.
termEl.addEventListener('click', (e) => {
  if (e.target.closest('a') || String(window.getSelection())) return;
  if (docSkip) docSkip();
  termIn.focus();
});

/* ---------- chrome ---------- */
const TITLE = document.title;
document.addEventListener('visibilitychange', () => {
  document.title = document.hidden ? 'BAMOPS — take your time' : TITLE;
});

const ACC = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim();
console.log('%cBAMOPS', `font:600 26px/1.4 system-ui;color:${ACC}`);
console.log('%cYou opened the console. Nosy. We approve.', 'color:#9b9da2;font:13px/1.6 ui-monospace,monospace');
console.log('%cNo framework, no build step. Terribly sorry about the JavaScript.', 'color:#64666c;font:13px/1.6 ui-monospace,monospace');
console.log('%cSince you\'re here: type %cterminal()%c and press enter.', 'color:#9b9da2;font:13px/1.6 ui-monospace,monospace', `color:${ACC};font:13px/1.6 ui-monospace,monospace;background:#222;padding:1px 5px;border-radius:3px`, 'color:#9b9da2;font:13px/1.6 ui-monospace,monospace');
console.log('%ccontact@bamops.co.uk — do mention you looked.', 'color:#9b9da2;font:13px/1.6 ui-monospace,monospace');

if (MOTION) {
  document.querySelectorAll('.rv').forEach((el) => {
    G.set(el, { opacity: 0, y: 14 });
    new IntersectionObserver((ents, obs) => {
      ents.forEach((en) => {
        if (!en.isIntersecting) return;
        G.to(en.target, { opacity: 1, y: 0, duration: .66, ease: 'power2.out' });
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' }).observe(el);
  });
  G.to('.hero .rv', { opacity: 1, y: 0, duration: .8, stagger: .07, ease: 'power2.out', delay: .1 });
} else {
  document.querySelectorAll('.rv').forEach((el) => (el.style.opacity = 1));
}
})();
