/* Single case page. Each case has its own file in /case/ (one <body data-case="slug">),
   which loads this script to fill the template from data.js and mount that case's workflow. */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const pad = (n) => String(n).padStart(2, '0');
  const caseUrl = (c) => '/case/' + c.slug;

  /* ---------- which case ---------- */
  const last = location.pathname.split('/').filter(Boolean).pop() || '';
  const slug = document.body.dataset.case || last.replace(/\.html$/, '');
  let i = CASES.findIndex((c) => c.slug === slug);
  const missing = i < 0;
  if (missing) i = 0;
  const c = CASES[i];

  /* ---------- menu (same drawer as the home page) ---------- */
  const menuBtn = $('#menu-btn');
  const menu = $('#menu');
  let menuOn = false;
  $('#menu-count').textContent = pad(CASES.length);
  $('#menu-list').innerHTML = CASES.map((x, n) => `<li><a href="${caseUrl(x)}"${n === i && !missing ? ' aria-current="page"' : ''}>
    <span class="i">${pad(n + 1)}</span>
    <span><b>${x.name}</b><small>${x.sector}</small></span>
  </a></li>`).join('');
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

  /* ---------- page copy ---------- */
  const title = `${c.name} — BAMOPS case file`;
  const desc = `${c.name}: ${c.problem} ${c.result}`;
  document.title = title;
  $('#meta-desc').setAttribute('content', desc);
  $('#og-title').setAttribute('content', title);
  $('#og-desc').setAttribute('content', desc);

  $('#cv-count').textContent = `${pad(i + 1)} / ${pad(CASES.length)}`;
  $('#cv-lbl').textContent = `case_${pad(i + 1)} · ${c.sector}`;
  $('#cv-name').textContent = c.name;
  $('#cv-note').textContent = c.note;
  $('#cv-sector').textContent = c.sector;

  const redact = (ch) => `<span class="redact" style="width:${ch}ch"></span>`;
  $('#cv-client').style.width = c.client + 'ch';
  $('#cv-tech').innerHTML = `<i class="ic" style="--i:url(assets/tech/${c.main.icon}.svg)"></i><span>${c.main.name}</span>`;
  $('#cv-rest').innerHTML = [6, 9, 5].map(redact).join('');

  $('#cv-problem').textContent = c.problem;
  $('#cv-fix').textContent = c.fix;
  $('#cv-result').textContent = c.result;
  $('#cv-quip').textContent = c.quip;

  /* ---------- previous / next ---------- */
  const prev = CASES[(i + CASES.length - 1) % CASES.length];
  const next = CASES[(i + 1) % CASES.length];
  const pager = (el, x, n, dir) => {
    el.href = caseUrl(x);
    el.innerHTML = `<span class="lbl">${dir === 'prev' ? '← previous' : 'next'} · ${pad(n + 1)}${dir === 'next' ? ' →' : ''}</span>
      <b>${x.name}</b><small>${x.sector}</small>`;
  };
  pager($('#cv-prev'), prev, (i + CASES.length - 1) % CASES.length, 'prev');
  pager($('#cv-next'), next, (i + 1) % CASES.length, 'next');

  /* ---------- this case's workflow ---------- */
  const flow = CASE_FLOWS.find((f) => f.id === c.flow) || CASE_FLOWS[0];
  mountFlow(flow, {
    svg: $('#flow'), idEl: $('#flow-id'), nodesEl: $('#flow-nodes'),
    stepEl: $('#run-step'), msEl: $('#run-ms'), toggleEl: $('#toggle'),
  });

  /* ---------- structured data ---------- */
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    publisher: { '@type': 'Organization', name: 'Bamops', url: 'https://bamops.co.uk/', logo: 'https://bamops.co.uk/assets/bamops-icon-512.png' },
  });
  document.head.appendChild(ld);
})();
