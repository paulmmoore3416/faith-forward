import '../layout';
import { BASE, esc } from '../layout';
import { ORG, DONATION_NEEDS } from '../config';
import { devotionalFor } from '../data/devotional';
import { EVENTS } from '../data/events';
import { connectGoogle, googleConnected, gmailUnread, driveRecent, calendarUpcoming } from './google';
import { firebaseEnabled, session, signIn, signOut, listSubmissions, type Submission } from './firebase';

// ───────────────────────── STATE

interface Task { id: string; title: string; due?: string; owner?: string; status: 'todo' | 'doing' | 'done'; area: string }
interface Donation { id: string; date: string; category: string; item: string; qty: number; direction: 'in' | 'out'; donor?: string; blessed: boolean; notes?: string }
interface Contact { id: string; date: string; name: string; location: string; needs: string; hasAnimal: boolean; animal?: string; followUp?: string; status: 'open' | 'closed'; notes?: string }
interface Person { id: string; kind: 'volunteer' | 'partner'; name: string; org?: string; type?: string; email?: string; phone?: string; status: string; since?: string; notes?: string }
interface Settings { elevenKey: string; elevenVoice: string; googleClientId: string; passHash: string; bloggerUrl: string }
interface CC { tasks: Task[]; donations: Donation[]; contacts: Contact[]; people: Person[]; posted: Record<string, string>; settings: Settings; prayerLog: Record<string, boolean> }

const KEY = 'ff-cc-v1';
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);

const SEED: CC = {
  tasks: [
    { id: uid(), title: 'Revoke the exposed GitHub token and API keys, then issue new ones', status: 'todo', area: 'Security', owner: 'Founder', due: today() },
    { id: uid(), title: 'File Missouri Articles of Incorporation (Nonprofit) with the Secretary of State', status: 'todo', area: 'Legal', owner: 'Founder' },
    { id: uid(), title: 'Obtain EIN from the IRS (after incorporation)', status: 'todo', area: 'Legal', owner: 'Founder' },
    { id: uid(), title: 'Recruit 3+ independent board members and hold the organizational meeting', status: 'todo', area: 'Governance', owner: 'Founder' },
    { id: uid(), title: 'Open a nonprofit bank account', status: 'todo', area: 'Finance', owner: 'Treasurer' },
    { id: uid(), title: 'File IRS Form 1023 (501(c)(3))', status: 'todo', area: 'Legal', owner: 'Founder' },
    { id: uid(), title: 'Set up Firebase project and paste config into src/firebase.config.ts', status: 'todo', area: 'Technology', owner: 'Founder' },
    { id: uid(), title: 'Confirm Gypse\'s weight, spay status and food kcal/cup in the K9 suite', status: 'todo', area: 'K9', owner: 'Founder' },
    { id: uid(), title: 'Arrange priest blessing schedule for donated items', status: 'todo', area: 'Ministry', owner: 'Founder' },
    { id: uid(), title: 'Contact 5 St. Louis mental-health providers about referral partnerships', status: 'todo', area: 'Partnerships', owner: 'Founder' },
  ],
  donations: [], contacts: [], people: [], posted: {}, prayerLog: {},
  settings: { elevenKey: '', elevenVoice: '21m00Tcm4TlvDq8ikWAM', googleClientId: '', passHash: '', bloggerUrl: 'https://www.blogger.com/' },
};

function load(): CC {
  try { const r = localStorage.getItem(KEY); if (r) return { ...SEED, ...JSON.parse(r) }; } catch { /* fallthrough */ }
  return structuredClone(SEED);
}
let D = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch { /* ignore */ } };
const commit = () => { save(); render(); };

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`faith-forward:${s}`));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ───────────────────────── CONTENT (lazy)

interface Post { day: number; date: string; platform: 'linkedin' | 'tiktok' | 'instagram'; title: string; body: string; hashtags: string[]; keywords: string[]; visual?: string }
interface ArticleMeta { week: number; slug: string; title: string; date: string; excerpt: string; tags: string[] }
let POSTS: Post[] | null = null;
let ARTICLES: ArticleMeta[] | null = null;
async function loadContent() {
  if (!POSTS) POSTS = await fetch(`${BASE}content/social/posts.json`).then((r) => r.json()).then((j) => j.posts).catch(() => []);
  if (!ARTICLES) ARTICLES = await fetch(`${BASE}content/articles/index.json`).then((r) => r.json()).catch(() => []);
}

// ───────────────────────── SHELL

type View = 'briefing' | 'operations' | 'donations' | 'outreach' | 'people' | 'marketing' | 'articles' | 'inbox' | 'k9' | 'events' | 'documents' | 'settings';
const NAV: { id: View; label: string; icon: string }[] = [
  { id: 'briefing', label: 'Daily Briefing', icon: '✝️' },
  { id: 'operations', label: 'Operations', icon: '📋' },
  { id: 'donations', label: 'Donations', icon: '🎒' },
  { id: 'outreach', label: 'Outreach Log', icon: '🧭' },
  { id: 'people', label: 'Volunteers & Partners', icon: '🤝' },
  { id: 'marketing', label: 'Social Calendar', icon: '📣' },
  { id: 'articles', label: 'Blog Articles', icon: '📰' },
  { id: 'inbox', label: 'Website Inbox', icon: '📥' },
  { id: 'k9', label: 'K9 Program', icon: '🐕' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'documents', label: 'Documents', icon: '📚' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];
let view = (location.hash.slice(1) || 'briefing') as View;

function shell(inner: string): string {
  return `<div class="flex min-h-screen bg-gray-100">
    <aside class="w-64 bg-faith-ink text-gray-300 hidden md:flex flex-col no-print">
      <div class="p-6 border-b border-white/10 flex items-center gap-3"><img src="${BASE}faithforwardlogo.png" class="h-12 bg-white rounded-lg p-1" alt=""><div><p class="font-serif font-bold text-white">Command Center</p><p class="text-[10px] tracking-[0.3em] text-faith-gold">FAITH FORWARD</p></div></div>
      <nav class="flex-1 p-3 space-y-1">${NAV.map((n) => `<a href="#${n.id}" class="block px-3 py-2 rounded-lg text-sm font-bold ${n.id === view ? 'bg-faith-gold text-faith-ink' : 'hover:bg-white/10'}">${n.icon} ${n.label}</a>`).join('')}</nav>
      <div class="p-4 text-xs border-t border-white/10">${firebaseEnabled() && session() ? `Signed in: ${esc(session()!.email)}<br>` : 'Local mode (this device)<br>'}<button data-act="lock" class="underline mt-1">Lock</button></div>
    </aside>
    <div class="flex-1 min-w-0">
      <div class="md:hidden bg-faith-ink p-3 flex gap-2 overflow-x-auto no-print">${NAV.map((n) => `<a href="#${n.id}" class="whitespace-nowrap text-xs font-bold px-3 py-2 rounded ${n.id === view ? 'bg-faith-gold text-faith-ink' : 'text-gray-300'}">${n.icon} ${n.label}</a>`).join('')}</div>
      <div class="p-4 md:p-8" id="cc-main">${inner}</div>
    </div>
  </div>`;
}

const kpi = (label: string, value: string | number, sub = '') => `<div class="card"><p class="text-xs uppercase font-bold text-gray-500 tracking-wider">${label}</p><p class="text-3xl font-bold text-faith-navy mt-1">${value}</p>${sub ? `<p class="text-xs text-gray-500 mt-1">${sub}</p>` : ''}</div>`;
const h2 = (t: string, sub = '') => `<h1 class="text-3xl font-serif font-bold text-faith-navy">${t}</h1>${sub ? `<p class="text-gray-600 mt-1 mb-6">${sub}</p>` : '<div class="mb-6"></div>'}`;

// ───────────────────────── BRIEFING

function briefing(): string {
  const dev = devotionalFor();
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const openTasks = D.tasks.filter((t) => t.status !== 'done');
  const dueFollow = D.contacts.filter((c) => c.status === 'open' && c.followUp && c.followUp <= today());
  const todaysPosts = (POSTS ?? []).filter((p) => p.date === today());
  const nextEvent = EVENTS.filter((e) => e.date >= today()).sort((a, b) => a.date.localeCompare(b.date))[0];
  const k9 = k9Summary();
  const prayed = D.prayerLog[today()];
  return `
  <div class="bg-faith-navy text-white rounded-3xl p-8 md:p-10 mb-6 relative overflow-hidden">
    <img src="${BASE}faithforwardlogo.png" class="absolute -right-10 -bottom-10 h-72 opacity-10" alt="">
    <p class="eyebrow">${esc(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }))}${dev.feast ? ` · ${esc(dev.feast)}` : ''}</p>
    <h1 class="text-3xl md:text-4xl font-serif font-bold mt-2">${greet}, ${esc(ORG.founder.short)}.</h1>
    <div class="grid lg:grid-cols-2 gap-8 mt-6 relative">
      <div>
        <p class="text-faith-gold text-xs uppercase font-bold tracking-widest mb-2">Today's Scripture</p>
        <p class="font-display italic text-xl leading-relaxed">“${esc(dev.verse.text)}”</p>
        <p class="text-faith-gold font-bold mt-2">${esc(dev.verse.ref)}</p>
        <p class="text-faith-gold text-xs uppercase font-bold tracking-widest mt-6 mb-2">Today's Quote</p>
        <p class="italic text-gray-200">“${esc(dev.quote.text)}”</p><p class="text-sm text-gray-400 mt-1">${esc(dev.quote.author)}</p>
      </div>
      <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
        <p class="text-faith-gold text-xs uppercase font-bold tracking-widest mb-2">Daily Prayer · ${esc(dev.prayer.title)}</p>
        <p class="text-gray-100 leading-relaxed">${esc(dev.prayer.text)}</p>
        <div class="flex flex-wrap gap-3 mt-5 no-print">
          <button data-act="speak" class="btn-gold !py-2 text-sm">🔊 Read aloud</button>
          <button data-act="prayed" class="btn-ghost !py-2 text-sm">${prayed ? '✅ Prayed today' : '🙏 Mark as prayed'}</button>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
    ${kpi('Open tasks', openTasks.length, `${openTasks.filter((t) => t.due && t.due <= today()).length} due today/overdue`)}
    ${kpi('Follow-ups due', dueFollow.length, 'Outreach contacts')}
    ${kpi('Items in stock', inventoryTotal(), 'Donations on hand')}
    ${kpi('Volunteers', D.people.filter((p) => p.kind === 'volunteer').length, `${D.people.filter((p) => p.kind === 'partner').length} partners`)}
    ${kpi('K9 sessions (30d)', k9.sessions30, `${k9.dogs} dog(s) in program`)}
  </div>

  <div class="grid lg:grid-cols-3 gap-6">
    <div class="card"><h2 class="font-bold text-faith-navy text-lg mb-3">📣 Today's Posts</h2>
      ${todaysPosts.length ? todaysPosts.map((p) => `<div class="py-2 border-b last:border-0"><p class="text-xs font-bold uppercase text-faith-gold-dark">${p.platform} ${D.posted[`${p.date}-${p.platform}`] ? '✅' : ''}</p><p class="text-sm font-bold">${esc(p.title)}</p></div>`).join('') : '<p class="text-sm text-gray-600">No scheduled posts today (campaign runs Nov 1, 2026 to May 1, 2027).</p>'}
      <a href="#marketing" class="text-faith-gold-dark font-bold text-sm mt-3 inline-block">Open social calendar →</a></div>
    <div class="card"><h2 class="font-bold text-faith-navy text-lg mb-3">📋 Priority Tasks</h2>
      ${openTasks.slice(0, 6).map((t) => `<label class="flex gap-2 text-sm py-1"><input type="checkbox" data-task-done="${t.id}"> <span><strong>${esc(t.title)}</strong>${t.due ? ` <span class="text-xs ${t.due < today() ? 'text-red-600' : 'text-gray-500'}">due ${esc(t.due)}</span>` : ''}</span></label>`).join('') || '<p class="text-sm">All clear.</p>'}
      <a href="#operations" class="text-faith-gold-dark font-bold text-sm mt-3 inline-block">All tasks →</a></div>
    <div class="card"><h2 class="font-bold text-faith-navy text-lg mb-3">🌤 Outreach Conditions</h2><div id="cc-weather" class="text-sm">Loading…</div>
      ${nextEvent ? `<h3 class="font-bold text-faith-navy mt-4">Next event</h3><p class="text-sm">${esc(nextEvent.date)}: ${esc(nextEvent.title)}</p>` : ''}</div>
  </div>

  <div class="grid lg:grid-cols-3 gap-6 mt-6" id="google-panels">
    ${googlePanels()}
  </div>`;
}

function googlePanels(): string {
  if (!D.settings.googleClientId) return `<div class="card lg:col-span-3 text-sm text-gray-600">Connect Gmail, Google Drive and Google Calendar to see your unread mail, recent files and upcoming events here. Add your Google OAuth Client ID in <a href="#settings" class="underline font-bold">Settings</a>.</div>`;
  if (!googleConnected()) return `<div class="card lg:col-span-3"><button data-act="google" class="btn-navy">Connect Google (Gmail · Drive · Calendar)</button></div>`;
  return `<div class="card"><h2 class="font-bold text-faith-navy mb-2">📧 Gmail</h2><div id="g-mail" class="text-sm">Loading…</div></div>
    <div class="card"><h2 class="font-bold text-faith-navy mb-2">📁 Drive</h2><div id="g-drive" class="text-sm">Loading…</div></div>
    <div class="card"><h2 class="font-bold text-faith-navy mb-2">📅 Calendar</h2><div id="g-cal" class="text-sm">Loading…</div></div>`;
}

async function hydrateBriefing() {
  const w = document.getElementById('cc-weather');
  if (w) {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=38.6273&longitude=-90.1979&current=temperature_2m,apparent_temperature&daily=temperature_2m_min,temperature_2m_max&temperature_unit=fahrenheit&timezone=America%2FChicago&forecast_days=1')
      .then((r) => r.json()).then((d) => {
        const feels = Math.round(d.current.apparent_temperature), lo = Math.round(d.daily.temperature_2m_min[0]), hi = Math.round(d.daily.temperature_2m_max[0]);
        const plan = lo <= 32 ? '❄️ <strong>Cold-weather protocol:</strong> prioritize coats, blankets, hand warmers, dog coats and insulated bedding. Share warming-center locations.'
          : hi >= 90 ? '☀️ <strong>Heat protocol:</strong> water, electrolytes, sunscreen, shade; check dogs\' paws and hydration.'
            : '✅ Normal outreach conditions.';
        w.innerHTML = `<p class="text-2xl font-bold text-faith-navy">${Math.round(d.current.temperature_2m)}°F <span class="text-sm font-normal text-gray-500">feels ${feels}°F · ${lo}°/${hi}°</span></p><p class="mt-2">${plan}</p>`;
      }).catch(() => { w.textContent = 'Weather unavailable.'; });
  }
  if (googleConnected()) {
    const set = (id: string, html: string) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    gmailUnread().then((m) => set('g-mail', `<p class="font-bold">${m.count} unread</p>${m.messages.map((x) => `<p class="py-1 border-b truncate"><strong>${esc(x.from.replace(/<.*>/, ''))}</strong> ${esc(x.subject)}</p>`).join('')}<a class="underline text-xs" href="https://mail.google.com" target="_blank" rel="noopener">Open Gmail</a>`)).catch(() => set('g-mail', 'Could not load Gmail.'));
    driveRecent().then((f) => set('g-drive', f.map((x) => `<p class="py-1 border-b truncate"><a class="underline" href="${x.webViewLink}" target="_blank" rel="noopener">${esc(x.name)}</a></p>`).join(''))).catch(() => set('g-drive', 'Could not load Drive.'));
    calendarUpcoming().then((c) => set('g-cal', c.map((x) => `<p class="py-1 border-b"><a class="underline" href="${x.htmlLink}" target="_blank" rel="noopener">${esc(x.summary ?? '(no title)')}</a><br><span class="text-xs text-gray-500">${esc(new Date(x.start).toLocaleString())}</span></p>`).join('') || 'No upcoming events.')).catch(() => set('g-cal', 'Could not load Calendar.'));
  }
}

async function speak() {
  const dev = devotionalFor();
  const text = `Today's scripture. ${dev.verse.text} ${dev.verse.ref}. Let us pray. ${dev.prayer.text}`;
  if (D.settings.elevenKey) {
    try {
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${D.settings.elevenVoice}`, {
        method: 'POST',
        headers: { 'xi-api-key': D.settings.elevenKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }),
      });
      if (!r.ok) throw new Error(String(r.status));
      new Audio(URL.createObjectURL(await r.blob())).play();
      return;
    } catch (e) { alert(`ElevenLabs could not read the prayer (${(e as Error).message}). Using the device voice instead.`); }
  }
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.92;
  speechSynthesis.speak(u);
}

// ───────────────────────── OPERATIONS

function operations(): string {
  const cols: Task['status'][] = ['todo', 'doing', 'done'];
  const label = { todo: 'To Do', doing: 'In Progress', done: 'Done' };
  return `${h2('Operations', 'Foundation tasks across legal, governance, ministry, K9, marketing and technology.')}
  <form id="task-form" class="card mb-6 grid md:grid-cols-5 gap-2 items-end">
    <div class="md:col-span-2"><label class="label">Task</label><input class="input" name="title" required></div>
    <div><label class="label">Area</label><input class="input" name="area" list="areas" value="Ministry"><datalist id="areas">${['Legal', 'Governance', 'Finance', 'Ministry', 'Outreach', 'K9', 'Marketing', 'Partnerships', 'Technology', 'Security'].map((a) => `<option value="${a}">`).join('')}</datalist></div>
    <div><label class="label">Due</label><input class="input" type="date" name="due"></div>
    <button class="btn-gold">Add</button>
  </form>
  <div class="grid md:grid-cols-3 gap-4">${cols.map((c) => `<div class="bg-gray-200/60 rounded-2xl p-3"><h2 class="font-bold text-faith-navy px-2 mb-2">${label[c]} (${D.tasks.filter((t) => t.status === c).length})</h2>
    ${D.tasks.filter((t) => t.status === c).map((t) => `<div class="card !p-4 mb-2"><p class="text-xs text-faith-gold-dark font-bold uppercase">${esc(t.area)}</p><p class="font-bold text-sm">${esc(t.title)}</p>${t.due ? `<p class="text-xs ${t.due < today() && c !== 'done' ? 'text-red-600 font-bold' : 'text-gray-500'}">Due ${esc(t.due)}</p>` : ''}
      <div class="flex gap-2 mt-2 text-xs">${cols.filter((x) => x !== c).map((x) => `<button data-task-move="${t.id}" data-to="${x}" class="underline">${label[x]}</button>`).join('')}<button data-task-del="${t.id}" class="text-red-600 underline ml-auto">Delete</button></div></div>`).join('')}</div>`).join('')}</div>`;
}

// ───────────────────────── DONATIONS

function inventoryTotal(): number {
  return D.donations.reduce((s, d) => s + (d.direction === 'in' ? d.qty : -d.qty), 0);
}

function donations(): string {
  const cats = DONATION_NEEDS.map((n) => n.title);
  const by = cats.map((c) => ({ c, n: D.donations.filter((d) => d.category === c).reduce((s, d) => s + (d.direction === 'in' ? d.qty : -d.qty), 0) }));
  const unblessed = D.donations.filter((d) => d.direction === 'in' && !d.blessed).length;
  return `${h2('Donations Inventory', 'Record every item received and distributed. Track blessing status before items go out.')}
  <div class="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">${by.map((x) => kpi(x.c, x.n)).join('')}</div>
  ${unblessed ? `<div class="card mb-6 border-2 !border-faith-gold"><strong>⛪ ${unblessed} received batch(es) awaiting blessing.</strong> Mark them blessed after the priest's blessing and before distribution.</div>` : ''}
  <form id="don-form" class="card mb-6 grid md:grid-cols-7 gap-2 items-end">
    <div><label class="label">Date</label><input class="input" type="date" name="date" value="${today()}"></div>
    <div><label class="label">Direction</label><select class="input" name="direction"><option value="in">Received</option><option value="out">Distributed</option></select></div>
    <div><label class="label">Category</label><select class="input" name="category">${cats.map((c) => `<option>${esc(c)}</option>`).join('')}</select></div>
    <div><label class="label">Item</label><input class="input" name="item" required></div>
    <div><label class="label">Qty</label><input class="input" type="number" name="qty" value="1" min="1"></div>
    <div><label class="label">Donor / recipient</label><input class="input" name="donor"></div>
    <button class="btn-gold">Record</button>
  </form>
  <div class="card overflow-x-auto"><table class="w-full text-sm"><thead><tr class="bg-faith-navy text-white"><th class="p-2 text-left">Date</th><th class="p-2 text-left">In/Out</th><th class="p-2 text-left">Category</th><th class="p-2 text-left">Item</th><th class="p-2">Qty</th><th class="p-2 text-left">Donor/Recipient</th><th class="p-2">Blessed</th><th></th></tr></thead><tbody>
  ${[...D.donations].sort((a, b) => b.date.localeCompare(a.date)).map((d) => `<tr class="border-b"><td class="p-2">${esc(d.date)}</td><td class="p-2">${d.direction === 'in' ? '⬇️ In' : '⬆️ Out'}</td><td class="p-2">${esc(d.category)}</td><td class="p-2">${esc(d.item)}</td><td class="p-2 text-center">${d.qty}</td><td class="p-2">${esc(d.donor ?? '')}</td>
    <td class="p-2 text-center">${d.direction === 'in' ? `<input type="checkbox" data-bless="${d.id}" ${d.blessed ? 'checked' : ''}>` : ''}</td><td class="p-2"><button data-don-del="${d.id}" class="text-red-600 text-xs">Delete</button></td></tr>`).join('') || '<tr><td colspan="8" class="p-4 text-gray-500">No donations recorded yet.</td></tr>'}
  </tbody></table></div>
  <button data-act="csv-donations" class="btn-navy mt-4">Export CSV</button>`;
}

// ───────────────────────── OUTREACH

function outreach(): string {
  const open = D.contacts.filter((c) => c.status === 'open');
  const month = D.contacts.filter((c) => c.date.startsWith(today().slice(0, 7)));
  return `${h2('Outreach Log', 'Every veteran contact, their needs, their animal, and the follow-up. Use first names or street names only. Keep it dignified and confidential.')}
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">${kpi('Contacts this month', month.length)}${kpi('Open cases', open.length)}${kpi('With animals', D.contacts.filter((c) => c.hasAnimal).length)}${kpi('Follow-ups due', open.filter((c) => c.followUp && c.followUp <= today()).length)}</div>
  <form id="contact-form" class="card mb-6 grid md:grid-cols-4 gap-2 items-end">
    <div><label class="label">Date</label><input class="input" type="date" name="date" value="${today()}"></div>
    <div><label class="label">Name / alias</label><input class="input" name="name" required></div>
    <div><label class="label">Location</label><input class="input" name="location"></div>
    <div><label class="label">Follow-up date</label><input class="input" type="date" name="followUp"></div>
    <div class="md:col-span-2"><label class="label">Needs / services provided</label><input class="input" name="needs"></div>
    <div><label class="label">Animal (if any)</label><input class="input" name="animal" placeholder="e.g., brindle pit, 'Rocky'"></div>
    <button class="btn-gold">Log contact</button>
  </form>
  <div class="card overflow-x-auto"><table class="w-full text-sm"><thead><tr class="bg-faith-navy text-white"><th class="p-2 text-left">Date</th><th class="p-2 text-left">Name</th><th class="p-2 text-left">Location</th><th class="p-2 text-left">Needs</th><th class="p-2 text-left">Animal</th><th class="p-2 text-left">Follow-up</th><th class="p-2">Status</th></tr></thead><tbody>
  ${[...D.contacts].sort((a, b) => b.date.localeCompare(a.date)).map((c) => `<tr class="border-b"><td class="p-2">${esc(c.date)}</td><td class="p-2 font-bold">${esc(c.name)}</td><td class="p-2">${esc(c.location)}</td><td class="p-2">${esc(c.needs)}</td><td class="p-2">${c.hasAnimal ? `🐕 ${esc(c.animal ?? '')}` : ''}</td>
    <td class="p-2 ${c.status === 'open' && c.followUp && c.followUp <= today() ? 'text-red-600 font-bold' : ''}">${esc(c.followUp ?? '')}</td><td class="p-2 text-center"><button data-contact-toggle="${c.id}" class="chip">${c.status}</button></td></tr>`).join('') || '<tr><td colspan="7" class="p-4 text-gray-500">No contacts logged yet.</td></tr>'}
  </tbody></table></div>
  <button data-act="csv-contacts" class="btn-navy mt-4">Export CSV</button>`;
}

// ───────────────────────── PEOPLE

function people(): string {
  const row = (p: Person) => `<tr class="border-b"><td class="p-2 font-bold">${esc(p.name)}</td><td class="p-2">${esc(p.org ?? '')}</td><td class="p-2">${esc(p.type ?? '')}</td><td class="p-2">${esc(p.email ?? '')}<br>${esc(p.phone ?? '')}</td><td class="p-2"><span class="chip">${esc(p.status)}</span></td><td class="p-2">${esc(p.notes ?? '')}</td><td class="p-2"><button data-person-del="${p.id}" class="text-red-600 text-xs">Delete</button></td></tr>`;
  const table = (kind: Person['kind']) => `<div class="card overflow-x-auto mb-6"><table class="w-full text-sm"><thead><tr class="bg-faith-navy text-white"><th class="p-2 text-left">Name</th><th class="p-2 text-left">Organization</th><th class="p-2 text-left">Type/Role</th><th class="p-2 text-left">Contact</th><th class="p-2 text-left">Status</th><th class="p-2 text-left">Notes</th><th></th></tr></thead><tbody>${D.people.filter((p) => p.kind === kind).map(row).join('') || '<tr><td colspan="7" class="p-4 text-gray-500">None yet.</td></tr>'}</tbody></table></div>`;
  return `${h2('Volunteers & Partners', 'Your people: volunteers, mental-health providers, outreach programs, parishes, vets and sponsors.')}
  <form id="person-form" class="card mb-6 grid md:grid-cols-4 gap-2 items-end">
    <div><label class="label">Kind</label><select class="input" name="kind"><option value="partner">Partner</option><option value="volunteer">Volunteer</option></select></div>
    <div><label class="label">Name</label><input class="input" name="name" required></div>
    <div><label class="label">Organization</label><input class="input" name="org"></div>
    <div><label class="label">Type / role</label><input class="input" name="type" list="ptypes"><datalist id="ptypes">${['Mental health provider', 'Outreach / housing', 'Parish / church', 'Veterinary', 'Business sponsor', 'Veteran org', 'Outreach team', 'K9 handler', 'Driver', 'Sorting & packing', 'Prayer team'].map((x) => `<option value="${x}">`).join('')}</datalist></div>
    <div><label class="label">Email</label><input class="input" name="email"></div>
    <div><label class="label">Phone</label><input class="input" name="phone"></div>
    <div><label class="label">Status</label><select class="input" name="status"><option>Prospect</option><option>Contacted</option><option>Meeting set</option><option>MOU signed</option><option>Active</option><option>Inactive</option></select></div>
    <button class="btn-gold">Add</button>
    <div class="md:col-span-4"><label class="label">Notes</label><input class="input" name="notes"></div>
  </form>
  <h2 class="text-xl font-bold text-faith-navy mb-2">Partners</h2>${table('partner')}
  <h2 class="text-xl font-bold text-faith-navy mb-2">Volunteers</h2>${table('volunteer')}`;
}

// ───────────────────────── MARKETING

let mDate = today() < '2026-11-01' ? '2026-11-01' : today();
let mPlatform: 'all' | Post['platform'] = 'all';

function marketing(): string {
  if (!POSTS) return '<p>Loading campaign…</p>';
  const dayPosts = POSTS.filter((p) => p.date === mDate && (mPlatform === 'all' || p.platform === mPlatform));
  const total = POSTS.length, done = Object.keys(D.posted).length;
  const icon = { linkedin: '💼 LinkedIn', tiktok: '🎵 TikTok', instagram: '📸 Instagram' };
  return `${h2('Social Media Calendar', `Six-month daily campaign for LinkedIn, TikTok and Instagram: ${total} posts. ${done} marked posted.`)}
  <div class="card mb-6 flex flex-wrap gap-3 items-end">
    <div><label class="label">Date</label><input type="date" id="m-date" class="input" value="${mDate}" min="2026-11-01" max="2027-05-01"></div>
    <div><label class="label">Platform</label><select id="m-platform" class="input">${['all', 'linkedin', 'tiktok', 'instagram'].map((p) => `<option ${p === mPlatform ? 'selected' : ''}>${p}</option>`).join('')}</select></div>
    <button data-act="m-prev" class="btn-navy !py-2">← Prev day</button><button data-act="m-next" class="btn-navy !py-2">Next day →</button>
    <button data-act="csv-posts" class="btn-gold !py-2 ml-auto">Export full calendar (CSV)</button>
  </div>
  <div class="grid lg:grid-cols-3 gap-6">
  ${dayPosts.map((p) => { const key = `${p.date}-${p.platform}`; const full = `${p.body}\n\n${p.hashtags.map((h) => `#${h}`).join(' ')}`;
    return `<div class="card flex flex-col"><div class="flex justify-between items-center mb-2"><span class="font-bold text-faith-navy">${icon[p.platform]}</span><span class="text-xs text-gray-500">Day ${p.day}</span></div>
    <p class="font-bold mb-2">${esc(p.title)}</p>
    ${p.visual ? `<p class="text-xs bg-gray-50 p-2 rounded mb-2"><strong>Visual:</strong> ${esc(p.visual)}</p>` : ''}
    <pre class="whitespace-pre-wrap text-sm font-sans text-gray-700 flex-1">${esc(full)}</pre>
    <p class="text-xs text-gray-500 mt-2"><strong>SEO keywords:</strong> ${p.keywords.map(esc).join(', ')}</p>
    <div class="flex gap-2 mt-3"><button data-copy="${encodeURIComponent(full)}" class="btn-navy !py-1 !px-3 text-sm">📋 Copy</button>
    <button data-posted="${key}" class="${D.posted[key] ? 'btn-gold' : 'btn-navy'} !py-1 !px-3 text-sm">${D.posted[key] ? '✅ Posted' : 'Mark posted'}</button></div></div>`; }).join('') || '<p class="text-gray-600">No posts for this date.</p>'}
  </div>
  <div class="card mt-6 text-sm"><h2 class="font-bold text-faith-navy mb-2">Posting playbook</h2>
    <ul class="list-disc pl-5 space-y-1"><li><strong>LinkedIn</strong>: post 7:30-8:30 AM CT on weekdays; tag partner organizations; reply to every comment within 24 hours.</li><li><strong>TikTok</strong>: film vertical 9:16, 20-45 seconds; hook in the first 2 seconds; post 6-9 PM CT; use on-screen captions.</li><li><strong>Instagram</strong>: post 11 AM-1 PM CT; carousel or Reel; put the first line hook before "more"; share to Stories with a link sticker to the website.</li><li>Never show a veteran's face, location, or dog without written consent (Media Release in the Documents section).</li></ul></div>`;
}

// ───────────────────────── ARTICLES

function articles(): string {
  if (!ARTICLES) return '<p>Loading…</p>';
  return `${h2('Weekly Blog Articles', '52 SEO-optimized weekly articles for Blogger, one per week from Nov 1, 2026. Each includes scripture, prayer, resources and a K9 corner.')}
  <div class="card mb-6 text-sm"><strong>How to publish on Blogger:</strong> open the article, copy it, then in Blogger choose New Post → switch to "HTML view" and paste the HTML (or "Compose view" and paste the text). Add the labels listed in the article header, set the search description to the meta description, and schedule for the date shown. The same article publishes automatically on the website's News page on its date. <a class="underline font-bold" href="${esc(D.settings.bloggerUrl)}" target="_blank" rel="noopener">Open Blogger →</a></div>
  <div class="card overflow-x-auto"><table class="w-full text-sm"><thead><tr class="bg-faith-navy text-white"><th class="p-2">Wk</th><th class="p-2 text-left">Publish date</th><th class="p-2 text-left">Title</th><th class="p-2 text-left">Tags</th><th class="p-2"></th></tr></thead><tbody>
  ${ARTICLES.map((a) => `<tr class="border-b ${a.date === today() ? 'bg-faith-gold/10' : ''}"><td class="p-2 text-center">${a.week}</td><td class="p-2 whitespace-nowrap">${esc(a.date)}</td><td class="p-2 font-bold">${esc(a.title)}</td><td class="p-2 text-xs">${a.tags.slice(0, 5).map((t) => `#${esc(t)}`).join(' ')}</td>
    <td class="p-2 whitespace-nowrap"><button data-art-copy="${a.slug}" data-fmt="html" class="btn-navy !py-1 !px-2 text-xs">Copy HTML</button> <button data-art-copy="${a.slug}" data-fmt="md" class="btn-navy !py-1 !px-2 text-xs">Copy text</button> <a href="${BASE}news.html?a=${a.slug}" target="_blank" class="underline text-xs">Preview</a></td></tr>`).join('')}
  </tbody></table></div>`;
}

// ───────────────────────── INBOX

let inbox: Submission[] | null = null;
function inboxView(): string {
  if (!firebaseEnabled()) return `${h2('Website Inbox')}<div class="card"><p>Website forms currently send by email to <strong>${esc(ORG.contactEmail)}</strong>.</p><p class="mt-2">To collect prayer requests, donations, partner inquiries, volunteers and K9 help requests here, set up Firebase (free tier) and fill in <code>src/firebase.config.ts</code>. Step-by-step: <code>docs/technical/FIREBASE.md</code>.</p></div>`;
  if (!session()) return `${h2('Website Inbox')}<p>Sign in (lock and unlock the command center with your Firebase account).</p>`;
  if (!inbox) return `${h2('Website Inbox')}<p>Loading submissions…</p>`;
  return `${h2('Website Inbox', `${inbox.length} submissions`)}${inbox.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((s) => `<div class="card mb-3"><p class="text-xs font-bold uppercase text-faith-gold-dark">${esc(s.kind)} · ${esc(new Date(s.createdAt).toLocaleString())}</p>
    ${Object.entries(s.fields).filter(([k]) => !['createdAt', 'status'].includes(k)).map(([k, v]) => `<p class="text-sm"><strong>${esc(k)}:</strong> ${esc(v)}</p>`).join('')}</div>`).join('')}`;
}

// ───────────────────────── K9

function k9Summary() {
  try {
    const s = JSON.parse(localStorage.getItem('ff-k9-suite-v1') ?? 'null');
    if (!s) return { dogs: 1, sessions30: 0, names: ['Gypse'], logs: [] as { date: string; type: string; skills?: string; dogId: string }[] };
    const since = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
    return { dogs: s.dogs.length, sessions30: s.logs.filter((l: { type: string; date: string }) => l.type === 'training' && l.date >= since).length, names: s.dogs.map((d: { name: string }) => d.name), logs: s.logs };
  } catch { return { dogs: 0, sessions30: 0, names: [], logs: [] }; }
}

function k9(): string {
  const s = k9Summary();
  return `${h2('K9 Program', 'Live summary from the K9 Handler Training Suite on this device.')}
  <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">${kpi('Dogs in program', s.dogs, s.names.join(', '))}${kpi('Training sessions (30 days)', s.sessions30)}${kpi('Total log entries', s.logs.length)}</div>
  <div class="card mb-6"><h2 class="font-bold text-faith-navy mb-2">Recent K9 activity</h2>${s.logs.slice(-10).reverse().map((l: { date: string; type: string; skills?: string }) => `<p class="text-sm py-1 border-b">${esc(l.date)} · <span class="chip">${esc(l.type)}</span> ${esc(l.skills ?? '')}</p>`).join('') || '<p class="text-sm text-gray-600">No logs yet.</p>'}</div>
  <a href="${BASE}k9-suite.html" class="btn-gold">Open K9 Handler Training Suite</a>`;
}

// ───────────────────────── EVENTS

function events(): string {
  return `${h2('Events', 'Public events shown on the website. To change them, edit src/data/events.ts (instructions in docs/technical/DEVELOPER_GUIDE.md).')}
  ${EVENTS.map((e) => `<div class="card mb-3 ${e.date < today() ? 'opacity-50' : ''}"><p class="text-xs font-bold uppercase text-faith-gold-dark">${esc(e.kind)} · ${esc(e.date)}</p><p class="font-bold text-faith-navy">${esc(e.title)}</p><p class="text-sm text-gray-600">${esc(e.detail)}</p><p class="text-xs text-gray-500">📍 ${esc(e.where)}</p></div>`).join('')}`;
}

// ───────────────────────── DOCUMENTS

function documents(): string {
  const repo = 'https://github.com/paulmmoore3416/faith-forward/blob/master/docs';
  const groups: [string, [string, string][]][] = [
    ['User Guides', [['Website user guide', 'user/WEBSITE_GUIDE.md'], ['Command Center guide', 'user/COMMAND_CENTER_GUIDE.md'], ['K9 Training Suite guide', 'user/K9_SUITE_GUIDE.md'], ['Marketing & content guide', 'user/MARKETING_GUIDE.md']]],
    ['Technical', [['Architecture', 'technical/ARCHITECTURE.md'], ['Developer guide', 'technical/DEVELOPER_GUIDE.md'], ['Deployment (GitHub Pages)', 'technical/DEPLOYMENT.md'], ['Firebase setup', 'technical/FIREBASE.md'], ['Integrations (Google, ElevenLabs)', 'technical/INTEGRATIONS.md'], ['Security & secrets', 'technical/SECURITY.md']]],
  ];
  return `${h2('Documents', 'Public technical and user documentation lives in the GitHub repository. Your private foundation office (formation filings, bylaws, SOPs, leadership, marketing strategy) is in the "foundation-office" folder on your computer and is never published.')}
  <div class="grid md:grid-cols-2 gap-6">${groups.map(([g, items]) => `<div class="card"><h2 class="font-bold text-faith-navy mb-3">${g}</h2>${items.map(([t, p]) => `<p class="py-1"><a class="underline text-faith-gold-dark font-bold" target="_blank" rel="noopener" href="${repo}/${p}">${t}</a></p>`).join('')}</div>`).join('')}
  <div class="card md:col-span-2"><h2 class="font-bold text-faith-navy mb-3">Quick Links</h2><div class="flex flex-wrap gap-3 text-sm">
    ${[['Facebook page', ORG.facebook], ['STL Veterans Hub', ORG.partnerSite.url], ['Daily Quotes site', ORG.quotesSite], ['GitHub: website', 'https://github.com/paulmmoore3416/faith-forward'], ['GitHub: daily quotes', 'https://github.com/paulmmoore3416/faith-forward-daily-quotes'], ['Blogger', D.settings.bloggerUrl], ['Gmail', 'https://mail.google.com'], ['Google Drive', 'https://drive.google.com'], ['Google Calendar', 'https://calendar.google.com'], ['Missouri SOS Business Services', 'https://www.sos.mo.gov/business'], ['IRS: Charities & Nonprofits', 'https://www.irs.gov/charities-non-profits'], ['Pay.gov (Form 1023)', 'https://www.pay.gov']].map(([t, u]) => `<a class="btn-navy !py-2 !px-3" target="_blank" rel="noopener" href="${esc(u)}">${t}</a>`).join('')}
  </div></div></div>`;
}

// ───────────────────────── SETTINGS

function settings(): string {
  const s = D.settings;
  return `${h2('Settings', 'Keys entered here are stored only in this browser on this device. They are never written to the website code or GitHub.')}
  <form id="settings-form" class="card max-w-3xl space-y-4">
    <div><label class="label">ElevenLabs API key (for reading the daily prayer aloud)</label><input class="input" type="password" name="elevenKey" value="${esc(s.elevenKey)}" autocomplete="off" placeholder="Paste a NEW key; revoke the one shared in chat"></div>
    <div><label class="label">ElevenLabs voice ID</label><input class="input" name="elevenVoice" value="${esc(s.elevenVoice)}"></div>
    <div><label class="label">Google OAuth Client ID (Gmail, Drive, Calendar)</label><input class="input" name="googleClientId" value="${esc(s.googleClientId)}" placeholder="xxxxxxxx.apps.googleusercontent.com"><p class="text-xs text-gray-500 mt-1">An API key (AIza...) cannot read your mail or files; Google requires an OAuth Client ID. Setup: docs/technical/INTEGRATIONS.md</p></div>
    <div><label class="label">Blogger dashboard URL</label><input class="input" name="bloggerUrl" value="${esc(s.bloggerUrl)}"></div>
    <div><label class="label">Change local passphrase</label><input class="input" type="password" name="newPass" autocomplete="new-password" placeholder="Leave blank to keep"></div>
    <button class="btn-gold">Save settings</button>
  </form>
  <div class="card max-w-3xl mt-6"><h2 class="font-bold text-faith-navy mb-2">Backup & Restore</h2>
    <p class="text-sm text-gray-600 mb-3">Export all command center data (tasks, donations, outreach, people, posting status). API keys are excluded from exports.</p>
    <div class="flex flex-wrap gap-3"><button data-act="export" class="btn-navy">Export</button><label class="btn-navy cursor-pointer">Import<input type="file" id="cc-import" accept="application/json" class="hidden"></label></div></div>
  <div class="card max-w-3xl mt-6 text-sm"><h2 class="font-bold text-faith-navy mb-2">Security status</h2>
    <p>${firebaseEnabled() ? '✅ Firebase Authentication is configured. Access requires your Firebase account.' : '⚠️ Local mode. The passphrase keeps casual visitors out on this device, but the page itself is public. Configure Firebase Authentication for real access control (docs/technical/FIREBASE.md).'}</p></div>`;
}

// ───────────────────────── GATE

async function gate(): Promise<boolean> {
  if (firebaseEnabled()) {
    if (session()) return true;
    renderGate('firebase');
    return false;
  }
  if (sessionStorage.getItem('ff-cc-unlocked') === '1') return true;
  renderGate(D.settings.passHash ? 'unlock' : 'create');
  return false;
}

function renderGate(mode: 'firebase' | 'unlock' | 'create') {
  const root = document.getElementById('cc-root')!;
  root.innerHTML = `<div class="min-h-[80vh] flex items-center justify-center bg-faith-ink p-4"><form id="gate-form" class="bg-white rounded-3xl p-10 max-w-md w-full text-center">
    <img src="${BASE}faithforwardlogo.png" class="h-28 mx-auto mb-4" alt="Faith Forward">
    <h1 class="text-2xl font-serif font-bold text-faith-navy mb-1">Command Center</h1>
    <p class="text-sm text-gray-600 mb-6">${mode === 'create' ? 'Create a passphrase for this device.' : mode === 'firebase' ? 'Sign in with your Faith Forward account.' : 'Enter your passphrase.'}</p>
    ${mode === 'firebase' ? '<input class="input mb-3" type="email" name="email" placeholder="Email" required autocomplete="username">' : ''}
    <input class="input mb-3" type="password" name="pass" placeholder="${mode === 'firebase' ? 'Password' : 'Passphrase'}" required minlength="${mode === 'create' ? 10 : 1}" autocomplete="${mode === 'create' ? 'new-password' : 'current-password'}">
    ${mode === 'create' ? '<input class="input mb-3" type="password" name="confirm" placeholder="Confirm passphrase" required autocomplete="new-password">' : ''}
    <button class="btn-gold w-full">${mode === 'create' ? 'Create & Enter' : 'Enter'}</button>
    <p id="gate-err" class="text-red-600 text-sm mt-3"></p>
    <p class="text-xs text-gray-400 mt-6">Spiritus Invictus</p></form></div>`;
  document.getElementById('gate-form')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as Record<string, string>;
    const err = document.getElementById('gate-err')!;
    try {
      if (mode === 'firebase') { await signIn(f.email, f.pass); }
      else if (mode === 'create') {
        if (f.pass !== f.confirm) { err.textContent = 'Passphrases do not match.'; return; }
        D.settings.passHash = await sha256(f.pass); save();
        sessionStorage.setItem('ff-cc-unlocked', '1');
      } else {
        if ((await sha256(f.pass)) !== D.settings.passHash) { err.textContent = 'Incorrect passphrase.'; return; }
        sessionStorage.setItem('ff-cc-unlocked', '1');
      }
      render();
    } catch (x) { err.textContent = (x as Error).message; }
  });
}

// ───────────────────────── RENDER

const VIEWS: Record<View, () => string> = { briefing, operations, donations, outreach, people, marketing, articles, inbox: inboxView, k9, events, documents, settings };

async function render() {
  if (!(await gate())) return;
  const root = document.getElementById('cc-root')!;
  root.innerHTML = shell((VIEWS[view] ?? briefing)());
  if (view === 'briefing') hydrateBriefing();
  if ((view === 'marketing' || view === 'articles' || view === 'briefing') && (!POSTS || !ARTICLES)) { await loadContent(); render(); }
  if (view === 'inbox' && firebaseEnabled() && session() && !inbox) {
    inbox = (await Promise.all(['contact', 'prayer', 'partner', 'donation', 'volunteer', 'k9-help'].map(listSubmissions))).flat();
    render();
  }
}

function download(name: string, content: string, type = 'application/json') {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click();
}
function csv(rows: object[]): string {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  return [cols.join(','), ...rows.map((r) => cols.map((c) => `"${String((r as Record<string, unknown>)[c] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
}

window.addEventListener('hashchange', () => { view = (location.hash.slice(1) || 'briefing') as View; render(); });

document.addEventListener('click', async (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('button, input[type=checkbox]');
  if (!el) return;
  const ds = el.dataset;
  if (ds.taskDone) { const t = D.tasks.find((x) => x.id === ds.taskDone); if (t) t.status = 'done'; commit(); }
  if (ds.taskMove) { const t = D.tasks.find((x) => x.id === ds.taskMove); if (t) t.status = ds.to as Task['status']; commit(); }
  if (ds.taskDel) { D.tasks = D.tasks.filter((x) => x.id !== ds.taskDel); commit(); }
  if (ds.bless) { const d = D.donations.find((x) => x.id === ds.bless); if (d) d.blessed = (el as HTMLInputElement).checked; commit(); }
  if (ds.donDel && confirm('Delete this record?')) { D.donations = D.donations.filter((x) => x.id !== ds.donDel); commit(); }
  if (ds.contactToggle) { const c = D.contacts.find((x) => x.id === ds.contactToggle); if (c) c.status = c.status === 'open' ? 'closed' : 'open'; commit(); }
  if (ds.personDel && confirm('Delete?')) { D.people = D.people.filter((x) => x.id !== ds.personDel); commit(); }
  if (ds.copy) { await navigator.clipboard.writeText(decodeURIComponent(ds.copy)); el.textContent = '✅ Copied'; }
  if (ds.posted) { if (D.posted[ds.posted]) delete D.posted[ds.posted]; else D.posted[ds.posted] = today(); commit(); }
  if (ds.artCopy) {
    const md = await fetch(`${BASE}content/articles/${ds.artCopy}.md`).then((r) => r.text());
    if (ds.fmt === 'html') { const { marked } = await import('marked'); await navigator.clipboard.writeText(await marked.parse(md.replace(/^---[\s\S]*?---\s*/, ''))); }
    else await navigator.clipboard.writeText(md);
    el.textContent = '✅ Copied';
  }
  switch (ds.act) {
    case 'lock': sessionStorage.removeItem('ff-cc-unlocked'); signOut(); render(); break;
    case 'speak': speak(); break;
    case 'prayed': D.prayerLog[today()] = !D.prayerLog[today()]; commit(); break;
    case 'google': try { await connectGoogle(D.settings.googleClientId); render(); } catch (x) { alert(`Google sign-in failed: ${(x as Error).message}`); } break;
    case 'm-prev': case 'm-next': { const d = new Date(`${mDate}T12:00:00`); d.setDate(d.getDate() + (ds.act === 'm-next' ? 1 : -1)); mDate = d.toISOString().slice(0, 10); render(); break; }
    case 'csv-posts': download('faith-forward-social-calendar.csv', csv((POSTS ?? []).map((p) => ({ ...p, hashtags: p.hashtags.map((h) => `#${h}`).join(' '), keywords: p.keywords.join(', '), posted: D.posted[`${p.date}-${p.platform}`] ?? '' }))), 'text/csv'); break;
    case 'csv-donations': download('donations.csv', csv(D.donations), 'text/csv'); break;
    case 'csv-contacts': download('outreach-contacts.csv', csv(D.contacts), 'text/csv'); break;
    case 'export': { const { settings: _s, ...rest } = D; download(`command-center-backup-${today()}.json`, JSON.stringify(rest, null, 2)); break; }
  }
});

document.addEventListener('change', (e) => {
  const t = e.target as HTMLInputElement;
  if (t.id === 'm-date') { mDate = t.value; render(); }
  if (t.id === 'm-platform') { mPlatform = t.value as typeof mPlatform; render(); }
  if (t.id === 'cc-import') t.files?.[0]?.text().then((txt) => { try { D = { ...D, ...JSON.parse(txt), settings: D.settings }; commit(); alert('Imported.'); } catch { alert('Invalid backup file.'); } });
});

document.addEventListener('submit', async (e) => {
  const form = e.target as HTMLFormElement;
  if (form.id === 'gate-form') return;
  e.preventDefault();
  const f = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
  if (form.id === 'task-form') D.tasks.unshift({ id: uid(), title: f.title, area: f.area || 'General', due: f.due || undefined, status: 'todo' });
  if (form.id === 'don-form') D.donations.push({ id: uid(), date: f.date, direction: f.direction as 'in' | 'out', category: f.category, item: f.item, qty: +f.qty || 1, donor: f.donor, blessed: false });
  if (form.id === 'contact-form') D.contacts.push({ id: uid(), date: f.date, name: f.name, location: f.location, needs: f.needs, hasAnimal: Boolean(f.animal), animal: f.animal, followUp: f.followUp || undefined, status: 'open' });
  if (form.id === 'person-form') D.people.push({ id: uid(), kind: f.kind as Person['kind'], name: f.name, org: f.org, type: f.type, email: f.email, phone: f.phone, status: f.status, since: today(), notes: f.notes });
  if (form.id === 'settings-form') {
    D.settings = { ...D.settings, elevenKey: f.elevenKey.trim(), elevenVoice: f.elevenVoice.trim() || D.settings.elevenVoice, googleClientId: f.googleClientId.trim(), bloggerUrl: f.bloggerUrl.trim() };
    if (f.newPass) { if (f.newPass.length < 10) { alert('Passphrase must be at least 10 characters.'); return; } D.settings.passHash = await sha256(f.newPass); }
    alert('Settings saved on this device.');
  }
  commit();
});

render();
