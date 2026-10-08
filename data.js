/* Shared data for the home page (main.js) and the single case pages (case.js).
   Loaded as a plain script before either, so these top-level consts are visible to both. */

/* ---------- case files ---------- */
// No client names, URLs or screenshots in here. `client` is only the width of the
// redaction bar in characters, so the real name never reaches the page source.
// `main` is the one technology a case page names; everything else stays redacted.
// TODO: confirm the `main` pick for each case (only The Brain and Room Booking are certain).
// `flow` is the id of the workflow drawn on that case's page (see CASE_FLOWS below).
const CASES = [
  { slug: 'the-brain', name: 'The Brain', sector: 'finance · deal management', note: 'deal os. it thinks.', tag: 'vue · supabase', sch: 'app', client: 11,
    main: { name: 'supabase', icon: 'supabase' }, flow: 'enquiry.intake',
    problem: 'Deals lived in inboxes, spreadsheets and one person\'s memory. When that person went on holiday, so did the pipeline.',
    fix: 'One operating system for every deal, intake to payout. It remembers everything and nags people politely.',
    result: 'One source of truth. Holidays are allowed again.',
    quip: 'Named accurately.' },
  { slug: 'comparison-engine', name: 'Comparison Engine', sector: 'fintech · lead gen', note: '95% right, 100% certain.', tag: '30+ sources', sch: 'form', client: 9,
    main: { name: 'postgres', icon: 'postgres' }, flow: 'lender.match',
    problem: 'Matching a business to the right funder meant hours of phone calls and a lot of gut feel.',
    fix: 'An engine that cross-checks 30+ sources and returns a shortlist in seconds.',
    result: '95% right, 100% certain.',
    quip: 'The other 5% are character-building.' },
  { slug: 'partner-portal', name: 'Partner Portal', sector: 'b2b · introducers', note: 'CSV is an API.', tag: 'vue · supabase', sch: 'portal', client: 8,
    main: { name: 'vue', icon: 'vue' }, flow: 'partner.payout',
    problem: 'Referrals arrived by email, WhatsApp and occasionally carrier pigeon. Nobody knew who was owed what.',
    fix: 'A portal where partners submit, track and get paid without chasing anyone.',
    result: 'Fewer "just following up" emails. Possibly zero.',
    quip: 'CSV is an API. Everyone insisted.' },
  // TODO: placeholder copy until the real A/B testing project details arrive.
  { slug: 'ab-testing', name: 'A/B Testing', sector: 'growth · experimentation', note: 'B won. B usually wins.', tag: 'experiments', sch: 'ab', client: 10,
    main: { name: 'typescript', icon: 'typescript' }, flow: 'experiment.run',
    problem: 'Decisions were made by whoever spoke loudest in the meeting.',
    fix: 'A testing setup that splits traffic, tracks what matters and calls a winner.',
    result: 'Opinions are now optional.',
    quip: 'Variant B. It\'s always variant B.' },
  { slug: 'room-booking', name: 'Room Booking', sector: 'property · coworking', note: 'the 3pm slot is gone.', tag: 'n8n · calendar', sch: 'cal', client: 12,
    main: { name: 'n8n', icon: 'n8n' }, flow: 'booking.ops',
    problem: 'Meeting rooms double-booked, invoices forgotten, doors locked on the wrong people.',
    fix: 'Booking, confirmations, door access and invoicing in one flow.',
    result: 'Nobody fights over the 3pm slot any more. It\'s just gone.',
    quip: 'It was gone before you read this.' },
];

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

// One workflow per case, drawn on that case's own page. Three reuse the flows above;
// the Partner Portal and A/B Testing ones are new, and are not shown on the home page.
// TODO: placeholder steps for those two until the real projects are described.
const CASE_FLOWS = [
  ...FLOWS.filter((f) => f.id !== 'friday.deploy'),
  { id: 'partner.payout', nodes: [
      { id: 'ref', c: 0, r: 0, k: 'trigger', nm: 'Referral', sb: 'portal' },
      { id: 'dedupe', c: 1, r: 0, k: 'code', nm: 'Dedupe', sb: 'rules' },
      { id: 'status', c: 2, r: 0, k: 'http', nm: 'Check', sb: 'status' },
      { id: 'done', c: 3, r: 0, k: 'branch', nm: 'Complete', sb: 'if' },
      { id: 'pay', c: 4, r: -.62, k: 'db', nm: 'Payout', sb: 'ledger' },
      { id: 'chase', c: 4, r: .62, k: 'mail', nm: 'Nudge', sb: 'politely' },
    ], edges: [['ref', 'dedupe'], ['dedupe', 'status'], ['status', 'done'], ['done', 'pay', 'true'], ['done', 'chase', 'false']] },
  { id: 'experiment.run', nodes: [
      { id: 'visit', c: 0, r: 0, k: 'trigger', nm: 'Visit', sb: 'traffic' },
      { id: 'split', c: 1, r: 0, k: 'code', nm: 'Split', sb: 'variants' },
      { id: 'track', c: 2, r: 0, k: 'db', nm: 'Track', sb: 'events' },
      { id: 'win', c: 3, r: 0, k: 'branch', nm: 'Winner', sb: 'if' },
      { id: 'ship', c: 4, r: -.62, k: 'http', nm: 'Roll out', sb: 'variant b' },
      { id: 'wait', c: 4, r: .62, k: 'timer', nm: 'Wait', sb: 'more data' },
    ], edges: [['visit', 'split'], ['split', 'track'], ['track', 'win'], ['win', 'ship', 'true'], ['win', 'wait', 'false']] },
];
