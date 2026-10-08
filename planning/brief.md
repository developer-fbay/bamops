# Bamops — Project Brief

## What Bamops is

Bamops is our in-house dev team, going external. We've spent years building the
systems the firm (FBX Capital / Funding Bay / Cowork Cape Town) actually runs on.
Now we're offering that same team to other businesses.

## What the site has to do

1. **Tease, don't tell.** Show that we've built real, serious things — without
   handing over screenshots, URLs, architecture or "how it works". Blurred,
   redacted, schematic. Enough to make people curious, not enough to copy.
2. **Sell the problem, not the product.** Every project gets a short write-up:
   what was broken, what it was costing, what's different now. Outcomes over
   tech.
3. **Be cheeky.** Dry, confident, a bit smug, never try-hard. The tone of a team
   that has shipped on a Friday and lived.
4. **Get the enquiry.** The only real conversion is "talk to us". Everything
   funnels to contact.

## Audience

- Founders / ops leads at SMEs drowning in spreadsheets, manual admin, and
  duct-taped SaaS.
- Businesses that tried an agency once and got a pretty site that did nothing.
- Non-technical decision makers — they need to understand the *problem solved*
  in one read.

## Design direction

CEO's ask: **look similar to Codex** — black and grey, monochrome, developer
-flavoured, very clean. See `design.md`.

## What changes from the current `index.html`

The current site is a good starting point (dark, mono type, terminal mode,
animated automation flows) but it was written as an internal showcase:

| Current | Needed |
| --- | --- |
| Orange accent, slight warm tone | Pure black / grey monochrome, Codex feel |
| Project rows link straight to live products and show hostnames | No live links, no hostnames — redacted teasers |
| One-line notes per system | Short "problem → fix → result" write-ups |
| "We build what the firm runs on" | "We build what *your* firm will run on" — external pitch |
| No services section | Clear "what we do / how we work" |
| Contact is just an email | Contact as the main CTA, repeated through the page |

## Out of scope (for now)

- CMS / blog
- Pricing page
- Client logins
- Multi-page routing — stays a single static page unless we outgrow it

## Open questions

- [ ] Final domain? (`bamops.co.uk` assumed from the contact email)
- [ ] Are we allowed to name FBX / Funding Bay as past clients, or keep them
      anonymous ("a UK lender", "a coworking space")?
- [ ] Which projects are OK to mention at all? (see `content.md`)
- [ ] Do we keep the terminal mode easter egg? (Recommended: yes.)
- [ ] Who signs off copy — CEO, or us?
