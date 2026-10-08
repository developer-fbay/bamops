# Design — "Codex-ish"

Reference: OpenAI Codex marketing / product pages. Near-black canvas, layered
greys, crisp white type, monospace details, terminal and diff motifs, almost no
colour. Calm, expensive, engineered.

## Principles

1. **Monochrome first, one green.** Black, greys, white, plus a single lime
   green accent (`#c6f135`) for anything active, live or selected. Never for
   large fills or body text.
2. **Depth through greys, not shadows.** Panels sit on the background by being
   a shade lighter with a 1px hairline border.
3. **Type does the work.** Big, tight, sans-serif headlines. Monospace for
   labels, metadata, and anything "system-y".
4. **Show the machine, hide the parts.** Terminals, diff views, task lists,
   logs — but with the specifics blurred or `████`'d out.
5. **Slow, smooth motion.** Fades, typing, subtle reveals. Nothing bouncy.

## Palette (draft tokens)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#000000` | Page background |
| `--bg-2` | `#0a0a0a` | Section bands |
| `--panel` | `#111111` | Cards, terminals |
| `--panel-2` | `#181818` | Hover / nested panels |
| `--line` | `rgba(255,255,255,.08)` | Hairline borders |
| `--line-2` | `rgba(255,255,255,.14)` | Emphasised borders |
| `--fg` | `#f5f5f5` | Headlines, primary text |
| `--fg-2` | `#a1a1a1` | Body copy |
| `--fg-3` | `#6b6b6b` | Labels, metadata |
| `--acc` | `#c6f135` | The single accent: active states, carets, live flow lines, terminal prompt |
| `--ok` | `var(--acc)` | Status text |
| `--redact` | `#2a2a2a` | Redaction bars |

Primary button: white pill, black text. Secondary: transparent pill, hairline
border, white text.

## Type

- **Sans:** Inter (already loaded). Headlines 500 weight, tight tracking
  (`-0.04em`), large (`clamp(40px, 7vw, 88px)`).
- **Mono:** JetBrains Mono (already loaded). 11–13px, uppercase labels with
  wide tracking.

## Signature components

- **Hero terminal / agent panel** — a Codex-style task panel: prompt at the
  top, streamed "agent" output beneath, lines partly redacted. Types itself on
  load.
- **Project card ("case file")** — dark panel, mono header (`case_03 · fintech`),
  blurred/schematic preview, then *Problem / Fix / Result* in three short lines.
  Hover reveals a cheeky footnote.
- **Redaction bars** — `████` blocks over names, numbers and screenshots, with
  a tooltip like "nice try".
- **Diff block** — before/after in red/green-grey diff style for the
  "result" stat (`- 3 days of admin` / `+ 4 minutes`).
- **Section header** — mono index `01`, title, right-aligned mono meta.

## Keep from current site

- GSAP + reduced-motion handling
- Background grid (tone it down, pure grey)
- Terminal mode easter egg
- Automation flow canvas (recolour to monochrome)
- Scroll rail navigation

## Change from current site

- Drop the orange accent (`--acc`) entirely → white / grey
- Replace phosphor-green terminal palette with grey-on-black
- Replace the "systems list + preview" with case-file cards
- Remove live product links and hostnames

## Responsive / accessibility

- Mobile first; cards stack, terminal panel shrinks to a short loop.
- Respect `prefers-reduced-motion` (already in place).
- Contrast: `--fg-2` on `--bg` must stay ≥ 4.5:1.
- Redacted content must still have sensible accessible text (e.g.
  `aria-label="Client name redacted"`).
