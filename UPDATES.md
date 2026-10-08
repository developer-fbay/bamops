# Bamops site — updates

Everything that has changed on the site so far, oldest first. Work lives on the `Jesse` branch.

---

## 6 Oct 2026

### Starting point
- Original single-file site uploaded (`index.html` with inline CSS and JS), written as the internal team page.

---

## 8 Oct 2026

### Planning
- Added `planning/` with `brief.md`, `design.md`, `content.md` and `tasks.md`: the pitch, the Codex-style design rules, the cheeky copy, and a task list for the rebuild.

### Structure
- Split the inline CSS and JS out into `styles.css` and `main.js`. No build step, no framework.
- Added `package.json` with `npm run dev` (serves the site locally on port 5173, or the next free port).

### Look and feel
- Switched to a Codex-like palette: black background, grey panels, thin grey lines.
- Added a single accent colour, first mint green, then lime `#c6f135`. Every accent tint (highlights, the redacted preview images, the terminal cursor) is worked out from that one value, so changing it in one place changes it everywhere.
- Cut text down to exactly three greys: white for headings and key text, light grey for anything people need to read, dark grey for labels, numbers and hints. Five stray near-whites were folded into the main white.
- Brightened the tech stack line and the line under each case name so they're easier to read.

### Case files (the projects)
- Removed all live project links and website names. Projects are teased by sector and case number only.
- Each project got a short "case file" write-up: Problem, Fix, Result, plus a one-line joke.
- Client names are blacked out with redaction bars. The real names are never in the page source.
- Preview images are blurred, stamped "REDACTED" wireframes rather than screenshots.
- Kept the original list-on-the-left layout, with the write-up card sitting on the right and following whichever project you hover or click. On phones the write-up shows under each project instead.
- Removed the GTM project and added an **A/B Testing** project (placeholder copy, real details to come).
- The case cards have Mac-style red, yellow and green window dots.

### Navigation
- Added a hamburger button (top right) that slides out a side menu listing the 5 projects, on desktop and mobile. Picking one scrolls to it. Esc or clicking outside closes it.
- The terminal is now hidden: there's no button on the page any more. Open the browser console and type `terminal()` to get in. A hint is left in the page source and in the console for the curious.

### Logo
- Added the logo files in `assets/`: favicon, Apple touch icon, and the mark for dark backgrounds.
- The logo appears in the browser tab, top-left of the page (in a small pill linking back to the top), in the footer, in the terminal, and as the avatar in the contact chat.
- Logo files were swapped for corrected versions.
- Made the logos bigger: the top-left mark is now 23×29, and its pill and the hamburger button are both 42px tall so they line up.
- Added share-preview tags so links show a title, description and logo in WhatsApp, Slack, LinkedIn and X. These assume the domain is `bamops.co.uk`.

### Contact
- Rebuilt the contact section as a fake AI chat window:
  - A Bamops "assistant" asks what needs building, fixing or automating.
  - The message box works like an AI prompt box: it grows as you type, Enter sends and Shift+Enter starts a new line, with a "reply to" email line underneath.
  - **Skills** button: pick what you need from us (Automation, AI & agents, Web apps, Internal tools, Integrations, Data & dashboards, A/B testing, Rescue mission). Picks show as chips in the box.
  - **+ upload** button: doesn't upload anything, just says "This is not a real AI screen. Chill."
  - Cheeky checks for an empty message or missing email.
  - Sending shows your message as a chat bubble, then opens your mail app with the message, skills and email filled in, addressed to `contact@bamops.co.uk`.
  - Fine print: "Bamops can make mistakes. Never the same one twice."
- Adjusted the space above the contact section, and tightened it on phones (it was about 250px, now about 116px).

### Hero and tech stack (in progress, not yet committed)
- New hero layout: the headline and copy on the left, with two buttons, **Start a conversation** (to contact) and **Case files**.
- Added a blueprint-style drawing of the logo on the right, labelled "stem · load-bearing", "bowl · holds", "the code that powers it" and "Fig. 01 — so far, it has held."
- The tech stack is now a scrolling logo carousel with an icon for each tool (icons in `assets/tech/`, duct tape included). The list is duplicated so it loops without a gap. Screen readers only hear it once, and the terminal still lists the stack correctly.

### Mobile fixes (in progress, not yet committed)
- The blueprint drawing is now centred. Its contents sat off to the right of the drawing's frame, which pushed it right on phones and cut off the edge of the lime square.
- On phones, each case write-up now sits in its own small window, like the desktop card: red, yellow and green dots, the case number, a lime "solved" marker, and the Result picked out with a lime label and side bar.

### Contact form: name and email (in progress, not yet committed)
- The "reply to" line is now two fields at the top of the box, above the message: **name** ("who's asking?") and **email** ("company email preferred"). Side by side on wider screens, stacked on phones.
- Name is required, with its own nudge: "A name, please. "Hey you" feels cold."
- The email that opens includes the name and email at the top, and the subject reads "New enquiry from [name] via the Bamops site".

### Search and accessibility (in progress, not yet committed)
- The blueprint drawing has a proper title and description, so screen readers announce it and hovering shows a tooltip.
- Added structured data telling Google the organisation's name, website, email and logo (the 512px PNG), so search results can show the right logo. Assumes `bamops.co.uk`.
- The page no longer stays blank without JavaScript. Sections only start hidden (for the fade-in) when script is running to reveal them.

---

## Still to do
- Real details for the A/B Testing project.
- Questions for the CEO:
  - Can FBX Capital and Funding Bay be named? (Footer links are still there.)
  - Which projects are OK to show?
  - Is the copy signed off?
  - Is the domain `bamops.co.uk`?
- Contact form: send messages straight to us (e.g. Formspree, Supabase or an n8n webhook) instead of opening the visitor's mail app.
- A proper 1200×630 share image for link previews.
- Remaining planned sections: What we do, How we work, plus the polish and launch tasks in `planning/tasks.md`.
