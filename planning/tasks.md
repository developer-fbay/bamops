# Tasks

Work happens on the `Jesse` branch. One task ≈ one commit (or a small PR).
Tick off as we go.

## Phase 0 — Planning
- [x] Create `Jesse` branch
- [x] Brief, design, content and task docs (`planning/`)
- [ ] Answer open questions in `brief.md` with the CEO

## Phase 1 — Foundation
- [x] **T1. Codex palette swap** — replace colour tokens with the monochrome
      set in `design.md`, drop orange accent, regrey the grid and terminal mode.
      Quick, visible win; everything after builds on it.
- [x] **T2. Split the file** — move CSS and JS out of `index.html` into
      `styles.css` / `main.js`. Easier to work on as the site grows.
- [x] **T3. Remove live links & hostnames** from the systems list (the
      "tease, don't tell" rule). Footer links to fbxcapital.co.uk /
      fundingbay.co.uk kept until the "can we name clients?" question is
      answered.

## Phase 2 — New sections
- [ ] **T4. New hero** — external pitch copy, primary/secondary pill CTAs,
      Codex-style agent/terminal panel with redacted output.
- [x] **T5. Case files** — replace the systems list + preview with case-file
      cards (Problem / Fix / Result, redacted preview, cheeky footnote).
      Terminal `systems` is now `cases` (old name kept as an alias).
      Layout: project list on the left, write-up card on the side (hover to
      preview, click to pin). On narrow screens the write-ups sit inline.
- [x] **T5c. Hamburger menu** — side drawer (desktop + mobile) listing the
      case files. Terminal button removed; terminal now opened by typing
      `terminal()` in the browser console (hinted in an HTML comment and a
      console message).
- [ ] **T5b. A/B testing project** — replace placeholder copy with real
      details (GTM project removed).
- [x] **T6. Redaction component** — `redact(width, label)` in `main.js`: an
      empty bar sized in `ch`, `title="nice try"`, `aria-label` for screen
      readers. Used for client names; reuse it for anything else.
- [ ] **T7. What we do** — services grid.
- [ ] **T8. How we work** — 4-step process.
- [x] **T9. Contact upgrade** — contact form dressed as an AI chat window: message box, "reply to"
      email, a Skills picker (chips go into the email), and a "+" upload that just says
      "This is not a real AI screen. Chill." Send opens the visitor's mail app pre-filled
      (static site, no backend yet).
  - [ ] T9b. Swap mailto for a real form endpoint (Formspree / Supabase / n8n webhook).
  - [ ] T9c. Repeat the CTA in the nav/hero.

## Phase 3 — Polish
- [ ] **T10. Recolour automation canvas** to monochrome.
- [ ] **T11. Update terminal mode** commands/copy for the new content.
- [ ] **T12. Motion pass** — GSAP reveals consistent across new sections.
- [ ] **T13. Mobile pass** — check every section at 375px.
- [ ] **T14. Accessibility pass** — contrast, focus states, reduced motion,
      redaction labels.
- [ ] **T15. Meta / SEO** — title, description, Open Graph image, favicon.

## Phase 4 — Launch
- [ ] **T16. Copy sign-off** with CEO
- [ ] **T17. Hosting + domain** (`bamops.co.uk`?)
- [ ] **T18. Merge `Jesse` → `main`**
