/* Contact form, dressed as an AI chat window. Shared by the home page and every case page:
   each has an empty <div class="ai" data-chat> that this fills. It only looks like an AI.
   Sending hands the message to the visitor's mail app, since a static site has nowhere
   else to put it. On a case page the greeting and subject mention that case. */
(() => {
  'use strict';
  const mount = document.querySelector('[data-chat]');
  if (!mount) return;

  const G = window.gsap;
  const MOTION = !!G && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAIL = 'contact@bamops.co.uk';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const SKILLS = [
    { id: 'automation', name: 'Automation', note: 'the boring bits, gone' },
    { id: 'ai', name: 'AI & agents', note: 'the actually useful kind' },
    { id: 'web', name: 'Web apps', note: 'front to back' },
    { id: 'internal', name: 'Internal tools', note: 'what the firm runs on' },
    { id: 'integrations', name: 'Integrations', note: 'make A talk to B' },
    { id: 'data', name: 'Data & dashboards', note: 'numbers, finally honest' },
    { id: 'ab', name: 'A/B testing', note: 'B, probably' },
    { id: 'rescue', name: 'Rescue mission', note: 'someone else\'s code' },
  ];

  const slug = document.body.dataset.case;
  const about = slug && typeof CASES !== 'undefined' ? CASES.find((c) => c.slug === slug) : null;
  const greeting = about
    ? `Liked ${esc(about.name)}? Tell us what you need built, fixed or quietly automated. Add the skills you're after and a real human gets back to you. Usually within a working day.`
    : 'Hi. What needs building, fixing or quietly automating? Add the skills you\'re after, describe the mess, and a real human gets back to you. Usually within a working day.';

  const AV = '<span class="ai-av" aria-hidden="true"><img src="/assets/bamops-mark-for-dark-bg.svg" alt="" width="13" height="17"></span>';

  mount.innerHTML = `<div class="case-top"><i></i><i></i><i></i><span>bamops — new chat</span><span>1 human online</span></div>
  <div class="ai-thread" role="log" aria-live="polite">
    <div class="ai-msg">${AV}<p>${greeting}</p></div>
  </div>
  <form class="ai-box" novalidate>
    <div class="ai-reply">
      <div class="ai-field">
        <label for="ai-name">name</label>
        <input id="ai-name" name="name" type="text" autocomplete="name" placeholder="who's asking?">
      </div>
      <div class="ai-field">
        <label for="ai-email">email</label>
        <input id="ai-email" name="email" type="email" autocomplete="email" placeholder="company email preferred">
      </div>
    </div>
    <div class="ai-chips"></div>
    <label class="sr" for="ai-text">Your message</label>
    <textarea id="ai-text" name="message" rows="2" placeholder="Describe the problem. The awkward ones especially."></textarea>
    <div class="ai-tools">
      <button type="button" class="ai-tool ai-plus" aria-label="Upload media">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg>
      </button>
      <div class="ai-skills">
        <button type="button" class="ai-tool" aria-expanded="false" aria-controls="ai-pop">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true"><path d="M8 2l1.5 4.5L14 8l-4.5 1.5L8 14l-1.5-4.5L2 8l4.5-1.5z"/></svg>
          <span>Skills</span>
        </button>
        <div class="ai-pop" id="ai-pop" role="group" aria-label="What do you need from us?" hidden>
          <p class="lbl">What do you need from us?</p>
          <div>${SKILLS.map((s) => `<label>
            <input type="checkbox" value="${s.id}"><span><b>${s.name}</b><small>${s.note}</small></span>
          </label>`).join('')}</div>
        </div>
      </div>
      <span class="ai-model">humans-1.0</span>
      <button type="submit" class="ai-send" aria-label="Send">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5"/></svg>
      </button>
    </div>
    <p class="ai-toast" role="status"></p>
  </form>
  <p class="ai-fine">Bamops can make mistakes. Never the same one twice.</p>`;

  const $ = (s) => mount.querySelector(s);
  const form = $('.ai-box');
  const text = $('#ai-text');
  const nameIn = $('#ai-name');
  const emailIn = $('#ai-email');
  const chips = $('.ai-chips');
  const thread = $('.ai-thread');
  const pop = $('.ai-pop');
  const skillsBtn = $('.ai-skills > button');
  const toastEl = $('.ai-toast');
  const send = $('.ai-send');
  const plus = $('.ai-plus');
  const picked = new Set();

  const chip = (s, removable) => `<span class="ai-chip">${s.name}${removable
    ? `<button type="button" data-id="${s.id}" aria-label="Remove ${s.name}">×</button>` : ''}</span>`;
  const pickedSkills = () => SKILLS.filter((s) => picked.has(s.id));

  function renderChips() {
    chips.innerHTML = pickedSkills().map((s) => chip(s, true)).join('');
    pop.querySelectorAll('input').forEach((i) => (i.checked = picked.has(i.value)));
  }

  function setPop(on) {
    pop.hidden = !on;
    skillsBtn.setAttribute('aria-expanded', String(on));
    if (on) pop.querySelector('input').focus();
  }

  skillsBtn.addEventListener('click', () => setPop(pop.hidden));
  pop.addEventListener('change', (e) => {
    if (e.target.checked) picked.add(e.target.value); else picked.delete(e.target.value);
    renderChips();
  });
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    picked.delete(b.dataset.id);
    renderChips();
    text.focus();
  });
  document.addEventListener('click', (e) => {
    if (!pop.hidden && !e.target.closest('.ai-skills')) setPop(false);
  });
  $('.ai-skills').addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !pop.hidden) { e.stopPropagation(); setPop(false); skillsBtn.focus(); }
  });

  let toastT;
  function toast(html, ms = 2800) {
    toastEl.innerHTML = html;
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => { toastEl.classList.remove('on'); plus.classList.remove('nope'); }, ms);
  }

  plus.addEventListener('click', () => {
    plus.classList.add('nope');
    toast('This is not a real AI screen. <b>Chill.</b>');
  });

  // Grows with the message, the way every chat box does, up to the cap in the stylesheet.
  const fit = () => { text.style.height = 'auto'; text.style.height = text.scrollHeight + 'px'; };
  const syncSend = () => send.classList.toggle('idle', !text.value.trim());
  text.addEventListener('input', () => { fit(); syncSend(); });
  text.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });
  syncSend();

  function say(html, cls) {
    const el = document.createElement('div');
    el.className = cls;
    el.innerHTML = html;
    thread.appendChild(el);
    thread.scrollTop = thread.scrollHeight;
    if (MOTION) G.fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .3, ease: 'power2.out' });
    return el;
  }
  const bot = (inner) => say(AV + inner, 'ai-msg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = text.value.trim();
    const name = nameIn.value.trim();
    const email = emailIn.value.trim();
    if (!name) { toast('A name, please. "Hey you" feels cold.'); nameIn.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast('We\'ll need an email to reply to. The pigeon retired.');
      emailIn.focus();
      return;
    }
    if (!msg) { toast('Type something first. We\'re good, not psychic.'); text.focus(); return; }

    const skills = pickedSkills();
    say(`${skills.length ? `<div class="ai-chips">${skills.map((s) => chip(s)).join('')}</div>` : ''}` +
      `<p>${esc(msg)}</p><small>${esc(name)} · ${esc(email)}</small>`, 'ai-me');

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      about ? `Came from: ${about.name} case file` : '',
      skills.length ? `Skills: ${skills.map((s) => s.name).join(', ')}` : '',
      '',
      msg,
    ].filter((l, i) => l || i > 3).join('\n');
    const subject = `New enquiry from ${name} via the Bamops site${about ? ` (re: ${about.name})` : ''}`;
    const href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    text.value = ''; fit(); syncSend();
    picked.clear(); renderChips();

    const thinking = bot('<div class="ai-dots" aria-label="Thinking"><i></i><i></i><i></i></div>');
    setTimeout(() => {
      thinking.remove();
      bot('<p>Thinking done. Opening your mail app with all of that filled in. Hit send there and a real human takes it from here.</p>');
      window.location.href = href;
    }, MOTION ? 1100 : 0);
  });
})();
