/* Cursor spotlight: a soft lime glow that follows the pointer, plus a white "overlay" layer
   that pushes the text under it toward white. Two fixed, click-through layers; both are
   drawn in styles.css (.spot, .spot-lit) and only exist while the mouse is on the page.
   Skipped on touch screens and for visitors who ask for reduced motion. */
(() => {
  'use strict';
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = ['spot', 'spot-lit'].map((cls) => {
    const el = document.createElement('div');
    el.className = cls;
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
  });
  const root = document.documentElement;

  let x = innerWidth / 2, y = innerHeight / 3, tx = x, ty = y, raf = 0;

  // The glow eases toward the pointer, so it trails a little instead of snapping to it.
  function frame() {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    root.style.setProperty('--mx', x.toFixed(1) + 'px');
    root.style.setProperty('--my', y.toFixed(1) + 'px');
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(frame) : 0;
  }

  const show = (on) => layers.forEach((l) => l.classList.toggle('on', on));

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    tx = e.clientX; ty = e.clientY;
    show(true);
    if (!raf) raf = requestAnimationFrame(frame);
  }, { passive: true });

  root.addEventListener('pointerleave', () => show(false));
})();
