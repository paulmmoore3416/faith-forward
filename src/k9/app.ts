import '../layout';
import { esc } from '../layout';
import { BREEDS, breedById, DISCIPLINE_LABEL, type Breed, type Discipline } from './breeds';
import { PROGRAMS, ALL_LESSONS, breedKey, type Lesson, type Program } from './curriculum';
import {
  ACTIVITY, BCS, DAILY_HEALTH_CHECK, EMERGENCY_SIGNS, FIRST_AID_KIT, PREVENTIVES, ROUTINES, STL_ANIMAL_RESOURCES,
  STREET_FEEDING_TIPS, TOXIC_FOODS, VACCINES, VITALS, WEATHER_RULES, exercisePlan, feedingPlan, type Activity,
} from './care';
import { download, load, reset, save, toCsv, today, uid, type Dog, type LessonStatus, type LogEntry, type LogType, type SuiteState } from './store';
import { devotionalFor } from '../data/devotional';

let S: SuiteState = load();
let tab = (location.hash.slice(1) || 'dashboard') as Tab;

type Tab = 'dashboard' | 'profile' | 'breeds' | 'curriculum' | 'nutrition' | 'medical' | 'exercise' | 'routines' | 'logs' | 'reports' | 'certification' | 'data';
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'profile', label: 'Dog Profile', icon: '🐕' },
  { id: 'curriculum', label: 'Training', icon: '🎯' },
  { id: 'nutrition', label: 'Nutrition', icon: '🥩' },
  { id: 'medical', label: 'Medical', icon: '🩺' },
  { id: 'exercise', label: 'Exercise', icon: '🏃' },
  { id: 'routines', label: 'Routines', icon: '🗓️' },
  { id: 'logs', label: 'Logs', icon: '📒' },
  { id: 'reports', label: 'Reports', icon: '📄' },
  { id: 'certification', label: 'Certification', icon: '🎖️' },
  { id: 'breeds', label: 'Breed Library', icon: '📚' },
  { id: 'data', label: 'Data', icon: '💾' },
];

const dog = (): Dog => S.dogs.find((d) => d.id === S.activeDogId) ?? S.dogs[0];
const breed = (): Breed => breedById(dog().breedId);
const ageYears = (d: Dog) => (Date.now() - new Date(d.dob).getTime()) / (365.25 * 86_400_000);
const prog = (lessonId: string) => S.progress[dog().id]?.[lessonId] ?? { status: 'not-started' as LessonStatus };
const commit = () => { save(S); render(); };

function programPct(p: Program, dogId = dog().id): number {
  const done = p.lessons.filter((l) => S.progress[dogId]?.[l.id]?.status === 'passed').length;
  return Math.round((done / p.lessons.length) * 100);
}
function programDone(id: string) { const p = PROGRAMS.find((x) => x.id === id)!; return programPct(p) === 100; }

const bar = (pct: number, color = 'bg-faith-gold') =>
  `<div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div class="${color} h-2" style="width:${pct}%"></div></div>`;
const stars = (n: number) => '★'.repeat(n) + '<span class="text-gray-300">' + '★'.repeat(5 - n) + '</span>';
const list = (items: readonly string[]) => `<ul class="list-disc pl-5 space-y-1 text-sm text-gray-700">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

// ───────────────────────── SHELL

function shell(): string {
  const d = dog();
  return `
  <div class="bg-faith-navy text-white">
    <div class="container mx-auto px-4 py-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="eyebrow">Faith Forward K9 Program</p>
        <h1 class="text-3xl md:text-4xl font-serif font-bold">K9 Handler Training Suite</h1>
        <p class="text-gray-300 text-sm mt-1">Obedience · Emotional Support · Service · Detection · Tracking · Protection · Trainer Development</p>
      </div>
      <div class="flex items-center gap-2 no-print">
        <label for="dog-switch" class="text-xs uppercase tracking-widest text-gray-400">Active dog</label>
        <select id="dog-switch" class="input !w-auto !py-1 text-sm">
          ${S.dogs.map((x) => `<option value="${x.id}" ${x.id === d.id ? 'selected' : ''}>${esc(x.name)} · ${esc(breedById(x.breedId).name)}</option>`).join('')}
        </select>
        <button data-act="add-dog" class="btn-gold !py-1 !px-3 text-sm">+ Dog</button>
      </div>
    </div>
    <nav class="container mx-auto px-4 flex gap-1 overflow-x-auto no-print" aria-label="Suite sections">
      ${TABS.map((t) => `<a href="#${t.id}" class="whitespace-nowrap px-4 py-3 text-sm font-bold rounded-t-lg ${t.id === tab ? 'bg-faith-cream text-faith-navy' : 'text-gray-300 hover:text-white'}">${t.icon} ${t.label}</a>`).join('')}
    </nav>
  </div>
  <div id="k9-main" class="container mx-auto px-4 py-8"></div>`;
}

// ───────────────────────── DASHBOARD

function dashboard(): string {
  const d = dog(), b = breed(), dev = devotionalFor();
  const plan = feedingPlan(d.weightLb, d.activity, d.kcalPerCup, b, !d.altered);
  const nextLessons = PROGRAMS.flatMap((p) => p.lessons.map((l) => ({ p, l }))).filter(({ l }) => prog(l.id).status !== 'passed').slice(0, 4);
  const recent = S.logs.filter((l) => l.dogId === d.id).sort((a, c) => c.date.localeCompare(a.date)).slice(0, 5);
  const due = S.medical.filter((m) => m.dogId === d.id && m.due).sort((a, c) => a.due!.localeCompare(c.due!)).slice(0, 4);
  const routine = ROUTINES[d.goals.includes('protection') || d.goals.includes('detection') ? 0 : 1];
  return `
  <div class="grid lg:grid-cols-3 gap-6">
    <div class="card lg:col-span-2">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="eyebrow">${esc(b.group)}</p>
          <h2 class="text-3xl font-serif font-bold text-faith-navy">${esc(d.name)}</h2>
          <p class="text-gray-600">${esc(b.name)} · ${d.sex === 'F' ? 'Female' : 'Male'} · ${ageYears(d).toFixed(1)} yrs · ${d.weightLb} lb · ${esc(d.color)}</p>
          <p class="text-sm text-gray-500 mt-1">Handler: ${esc(d.handler)}</p>
        </div>
        <div class="text-6xl" aria-hidden="true">🐕</div>
      </div>
      <div class="flex flex-wrap gap-2 mt-4">${d.goals.map((g) => `<span class="chip">${DISCIPLINE_LABEL[g]}</span>`).join('')}</div>
      ${d.notes ? `<p class="mt-4 text-sm bg-faith-gold/10 border-l-4 border-faith-gold p-3 rounded">${esc(d.notes)}</p>` : ''}
    </div>
    <div class="card bg-faith-navy text-white">
      <p class="eyebrow">Handler's Prayer · ${esc(dev.feast ?? 'Today')}</p>
      <p class="font-display italic mt-2">"${esc(dev.verse.text)}"</p>
      <p class="text-faith-gold text-sm font-bold mt-1">${esc(dev.verse.ref)}</p>
      <p class="text-sm text-gray-300 mt-3"><strong class="text-white">${esc(dev.prayer.title)}:</strong> ${esc(dev.prayer.text)}</p>
    </div>
  </div>

  <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
    ${PROGRAMS.slice(0, 8).map((p) => `
      <a href="#curriculum" data-prog="${p.id}" class="card hover:shadow-md transition-shadow block">
        <p class="text-xs text-gray-500 font-bold uppercase">${esc(p.level)}</p>
        <p class="font-bold text-faith-navy mb-2">${esc(p.name)}</p>
        ${bar(programPct(p))}
        <p class="text-xs text-gray-500 mt-1">${programPct(p)}% · ${p.lessons.length} lessons</p>
      </a>`).join('')}
  </div>

  <div class="grid lg:grid-cols-3 gap-6 mt-6">
    <div class="card">
      <h3 class="font-bold text-faith-navy text-lg mb-3">Next Training Objectives</h3>
      ${nextLessons.map(({ p, l }) => `<div class="py-2 border-b last:border-0"><p class="text-xs text-gray-500">${esc(p.name)}</p><p class="font-bold text-sm">${esc(l.title)}</p></div>`).join('') || '<p class="text-sm">All lessons passed. Outstanding!</p>'}
      <a href="#curriculum" class="text-faith-gold-dark font-bold text-sm mt-3 inline-block">Open curriculum →</a>
    </div>
    <div class="card">
      <h3 class="font-bold text-faith-navy text-lg mb-3">Daily Ration</h3>
      <p class="text-4xl font-bold text-faith-navy">${plan.mer} <span class="text-base font-normal text-gray-500">kcal/day</span></p>
      <p class="text-sm text-gray-600">${plan.cupsPerDay} cups/day in ${plan.meals} meals (${plan.perMealCups} cups each) · ~${plan.waterOz} oz water</p>
      <p class="text-xs text-gray-500 mt-2">Based on ${d.weightLb} lb, ${ACTIVITY[d.activity].label.toLowerCase()}, ${d.kcalPerCup} kcal/cup.</p>
      <a href="#nutrition" class="text-faith-gold-dark font-bold text-sm mt-3 inline-block">Nutrition plan →</a>
    </div>
    <div class="card">
      <h3 class="font-bold text-faith-navy text-lg mb-3">Medical Due</h3>
      ${due.length ? due.map((m) => `<p class="text-sm py-1 border-b last:border-0"><strong>${esc(m.item)}</strong> · due ${esc(m.due!)} ${m.due! < today() ? '<span class="text-red-600 font-bold">OVERDUE</span>' : ''}</p>`).join('') : '<p class="text-sm text-gray-600">No records yet. Add vaccines and preventives in the Medical tab to get due-date alerts.</p>'}
      <a href="#medical" class="text-faith-gold-dark font-bold text-sm mt-3 inline-block">Medical →</a>
    </div>
  </div>

  <div class="grid lg:grid-cols-2 gap-6 mt-6">
    <div class="card">
      <div class="flex justify-between items-center mb-3"><h3 class="font-bold text-faith-navy text-lg">Today's Routine: ${esc(routine.name)}</h3><a href="#routines" class="text-sm text-faith-gold-dark font-bold">All routines</a></div>
      <ul class="text-sm space-y-1">${routine.schedule.slice(0, 8).map((s) => `<li><span class="font-mono font-bold text-faith-gold-dark w-16 inline-block">${esc(s.time)}</span>${esc(s.task)}</li>`).join('')}</ul>
    </div>
    <div class="card">
      <div class="flex justify-between items-center mb-3"><h3 class="font-bold text-faith-navy text-lg">Recent Logs</h3><a href="#logs" class="btn-navy !py-1 !px-3 text-sm">+ New Log</a></div>
      ${recent.length ? recent.map((l) => `<p class="text-sm py-1 border-b last:border-0"><span class="chip mr-2">${l.type}</span>${esc(l.date)} · ${esc(l.skills || l.notes.slice(0, 60))}</p>`).join('') : '<p class="text-sm text-gray-600">No logs yet. Log every session, because consistency builds great dogs.</p>'}
    </div>
  </div>`;
}

// ───────────────────────── PROFILE

function profile(): string {
  const d = dog();
  const goals = Object.entries(DISCIPLINE_LABEL) as [Discipline, string][];
  return `
  <form id="dog-form" class="card max-w-4xl">
    <h2 class="text-2xl font-serif font-bold text-faith-navy mb-1">Dog Profile</h2>
    <p class="text-sm text-gray-600 mb-6">Changing the breed instantly re-populates nutrition, exercise, medical screening, breed tips and suitability across the whole suite.</p>
    <div class="grid md:grid-cols-3 gap-4">
      <div><label class="label">Name</label><input class="input" name="name" value="${esc(d.name)}" required></div>
      <div class="md:col-span-2"><label class="label">Breed</label><select class="input" name="breedId">
        ${['Pit Bull Family', 'German Shepherd', 'Belgian Malinois', 'Labrador Retriever'].map((g) => `<optgroup label="${g}">${BREEDS.filter((b) => b.group === g).map((b) => `<option value="${b.id}" ${b.id === d.breedId ? 'selected' : ''}>${esc(b.name)}${b.aka ? ` (${esc(b.aka)})` : ''}</option>`).join('')}</optgroup>`).join('')}
      </select></div>
      <div><label class="label">Sex</label><select class="input" name="sex"><option value="F" ${d.sex === 'F' ? 'selected' : ''}>Female</option><option value="M" ${d.sex === 'M' ? 'selected' : ''}>Male</option></select></div>
      <div><label class="label">Date of birth (approx. OK)</label><input class="input" type="date" name="dob" value="${esc(d.dob)}"></div>
      <div><label class="label">Weight (lb)</label><input class="input" type="number" step="0.1" name="weightLb" value="${d.weightLb}"></div>
      <div><label class="label">Color / markings</label><input class="input" name="color" value="${esc(d.color)}"></div>
      <div><label class="label">Spayed / neutered</label><select class="input" name="altered"><option value="1" ${d.altered ? 'selected' : ''}>Yes</option><option value="0" ${!d.altered ? 'selected' : ''}>No (intact)</option></select></div>
      <div><label class="label">Microchip #</label><input class="input" name="microchip" value="${esc(d.microchip)}"></div>
      <div><label class="label">Handler</label><input class="input" name="handler" value="${esc(d.handler)}"></div>
      <div><label class="label">Veterinarian</label><input class="input" name="vet" value="${esc(d.vet)}"></div>
      <div><label class="label">Activity level</label><select class="input" name="activity">${(Object.keys(ACTIVITY) as Activity[]).map((a) => `<option value="${a}" ${a === d.activity ? 'selected' : ''}>${ACTIVITY[a].label}</option>`).join('')}</select></div>
      <div><label class="label">Food kcal per cup (on the bag)</label><input class="input" type="number" name="kcalPerCup" value="${d.kcalPerCup}"></div>
    </div>
    <fieldset class="mt-6"><legend class="label">Training goals</legend>
      <div class="flex flex-wrap gap-3">${goals.map(([k, v]) => `<label class="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg"><input type="checkbox" name="goals" value="${k}" ${d.goals.includes(k) ? 'checked' : ''}> ${v}</label>`).join('')}</div>
    </fieldset>
    <div class="mt-4"><label class="label">Notes</label><textarea class="input" name="notes" rows="3">${esc(d.notes)}</textarea></div>
    <div class="flex flex-wrap gap-3 mt-6">
      <button class="btn-gold" type="submit">Save Profile</button>
      ${S.dogs.length > 1 ? '<button type="button" data-act="delete-dog" class="btn-navy !bg-red-700">Remove this dog</button>' : ''}
    </div>
  </form>
  ${breedPanel(breed(), true)}`;
}

// ───────────────────────── BREEDS

function breedPanel(b: Breed, compact = false): string {
  const d = b.drives;
  const drives: [string, number][] = [['Food', d.food], ['Prey', d.prey], ['Play', d.play], ['Defense', d.defense], ['Fight', d.fight], ['Hunt', d.hunt], ['Handler sensitivity', d.handlerSoftness]];
  return `
  <article class="card mt-6">
    <p class="eyebrow">${esc(b.group)}</p>
    <h3 class="text-2xl font-serif font-bold text-faith-navy">${esc(b.name)}</h3>
    ${b.aka ? `<p class="text-sm text-gray-500">${esc(b.aka)}</p>` : ''}
    <p class="mt-3 text-gray-700">${esc(b.summary)}</p>
    <div class="grid md:grid-cols-4 gap-4 mt-4 text-sm">
      <div class="bg-gray-50 p-3 rounded-lg"><p class="font-bold">Height</p>F ${b.heightIn.female.join('-')}" · M ${b.heightIn.male.join('-')}"</div>
      <div class="bg-gray-50 p-3 rounded-lg"><p class="font-bold">Weight</p>F ${b.weightLb.female.join('-')} lb · M ${b.weightLb.male.join('-')} lb</div>
      <div class="bg-gray-50 p-3 rounded-lg"><p class="font-bold">Lifespan</p>${b.lifespanYrs.join('-')} years</div>
      <div class="bg-gray-50 p-3 rounded-lg"><p class="font-bold">Exercise</p>${b.exercise.dailyMinutes.join('-')} min/day · heat: ${b.exercise.heatTolerance} · cold: ${b.exercise.coldTolerance}</div>
    </div>
    <div class="grid md:grid-cols-2 gap-6 mt-6">
      <div>
        <h4 class="font-bold text-faith-navy mb-2">Discipline Suitability</h4>
        ${(Object.keys(b.suitability) as Discipline[]).map((k) => `<div class="mb-2"><p class="text-sm"><strong>${DISCIPLINE_LABEL[k]}</strong> <span class="text-faith-gold">${stars(b.suitability[k].rating)}</span></p><p class="text-xs text-gray-600">${esc(b.suitability[k].note)}</p></div>`).join('')}
      </div>
      <div>
        <h4 class="font-bold text-faith-navy mb-2">Drive Profile</h4>
        ${drives.map(([n, v]) => `<div class="flex items-center gap-2 mb-1 text-sm"><span class="w-36">${n}</span>${bar(v * 20, 'bg-faith-navy')}</div>`).join('')}
        <h4 class="font-bold text-faith-navy mt-4 mb-2">Temperament</h4>
        <div class="flex flex-wrap gap-2">${b.temperament.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
      </div>
    </div>
    ${compact ? '' : `
    <div class="grid md:grid-cols-2 gap-6 mt-6">
      <div><h4 class="font-bold text-faith-navy mb-2">Health Screening</h4>
        ${b.health.map((h) => `<div class="mb-2 text-sm"><p class="font-bold">${esc(h.condition)}</p><p class="text-gray-600">${esc(h.note)}</p>${h.screening ? `<p class="text-xs text-faith-gold-dark">Screening: ${esc(h.screening)}</p>` : ''}</div>`).join('')}</div>
      <div><h4 class="font-bold text-faith-navy mb-2">Training Notes</h4>${list(b.trainingNotes)}
        <h4 class="font-bold text-faith-navy mt-4 mb-2">Nutrition</h4>${list(b.nutrition.notes)}
        <h4 class="font-bold text-faith-navy mt-4 mb-2">Exercise</h4>${list(b.exercise.notes)}
        <h4 class="font-bold text-faith-navy mt-4 mb-2">Grooming</h4><p class="text-sm text-gray-700">${esc(b.grooming)}</p>
        <h4 class="font-bold text-faith-navy mt-4 mb-2">Legal & Housing</h4>${list(b.legal)}</div>
    </div>`}
  </article>`;
}

function breeds(): string {
  return `<h2 class="section-title !text-3xl">Breed Library</h2>
  <p class="text-gray-600 mt-2">Every breed's data is preloaded and drives the rest of the suite when it is selected on a dog's profile.</p>
  <div class="flex flex-wrap gap-2 mt-4 no-print">${BREEDS.map((b) => `<a href="#breed-${b.id}" class="chip !text-sm hover:bg-faith-gold hover:text-white">${esc(b.name)}</a>`).join('')}</div>
  ${BREEDS.map((b) => `<div id="breed-${b.id}">${breedPanel(b)}</div>`).join('')}`;
}

// ───────────────────────── CURRICULUM

let openProgram = PROGRAMS[0].id;

function gateStatus(p: Program): { ok: boolean; reasons: string[] } {
  const d = dog(), reasons: string[] = [];
  if (p.id === 'advanced' && !programDone('obedience')) reasons.push('Foundation Obedience not yet complete.');
  if (p.id === 'protection') {
    if (ageYears(d) < 1.5) reasons.push(`${d.name} is under 18 months.`);
    if (!programDone('advanced')) reasons.push('Advanced Obedience (Phase 2) not complete.');
    if (!S.handler.directorSignoffProtection[d.id]) reasons.push('No K9 Program Director sign-off recorded (Certification tab).');
  }
  if ((p.id === 'detection' || p.id === 'tracking') && !['a1', 'a2', 'a3', 'a4'].every((id) => prog(id).status === 'passed')) reasons.push('Advanced Obedience A1-A4 not passed.');
  return { ok: reasons.length === 0, reasons };
}

function lessonCard(l: Lesson): string {
  const p = prog(l.id), bk = breedKey(dog().breedId), tip = l.breedTips?.[bk];
  const statusColor = p.status === 'passed' ? 'bg-green-600' : p.status === 'in-progress' ? 'bg-faith-gold' : 'bg-gray-300';
  return `
  <details class="card !p-0 mb-3 group" ${p.status === 'in-progress' ? 'open' : ''}>
    <summary class="cursor-pointer p-5 flex items-center gap-3 list-none">
      <span class="w-3 h-3 rounded-full ${statusColor} shrink-0"></span>
      <span class="font-mono text-xs text-gray-400 w-8">${l.id.toUpperCase()}</span>
      <span class="font-bold text-faith-navy flex-1">${esc(l.title)}</span>
      <span class="text-xs text-gray-500 hidden md:inline">${esc(l.sessionMin)} min</span>
      <span class="text-gray-400 group-open:rotate-90 transition-transform">▶</span>
    </summary>
    <div class="px-5 pb-5 border-t pt-4">
      <p class="mb-3"><strong>Objective:</strong> ${esc(l.objective)}</p>
      ${l.equipment.length ? `<p class="text-sm mb-3"><strong>Equipment:</strong> ${l.equipment.map(esc).join(' · ')}</p>` : ''}
      <h4 class="font-bold text-faith-navy mb-1">Steps</h4>
      <ol class="list-decimal pl-5 space-y-1 text-sm text-gray-700 mb-3">${l.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
      <p class="text-sm bg-green-50 border-l-4 border-green-600 p-3 rounded mb-3"><strong>Pass criteria:</strong> ${esc(l.criteria)}</p>
      ${tip ? `<p class="text-sm bg-faith-gold/10 border-l-4 border-faith-gold p-3 rounded mb-3"><strong>Tip for ${esc(dog().name)} (${esc(breed().name)}):</strong> ${esc(tip)}</p>` : ''}
      ${l.problems.length ? `<h4 class="font-bold text-faith-navy mb-1">Troubleshooting</h4><ul class="text-sm space-y-1 mb-3">${l.problems.map((x) => `<li><strong>${esc(x.issue)}:</strong> ${esc(x.fix)}</li>`).join('')}</ul>` : ''}
      ${l.safety?.length ? `<div class="text-sm bg-red-50 border-l-4 border-red-600 p-3 rounded mb-3"><strong>Safety:</strong>${list(l.safety)}</div>` : ''}
      ${l.reflection ? `<p class="text-sm italic text-faith-navy bg-faith-cream p-3 rounded mb-3">✝ ${esc(l.reflection)}</p>` : ''}
      <div class="grid md:grid-cols-4 gap-2 items-end no-print bg-gray-50 p-3 rounded-lg" data-lesson="${l.id}">
        <div><label class="label">Status</label><select class="input lesson-status">
          ${(['not-started', 'in-progress', 'passed'] as LessonStatus[]).map((s) => `<option value="${s}" ${p.status === s ? 'selected' : ''}>${s.replace('-', ' ')}</option>`).join('')}</select></div>
        <div><label class="label">Date</label><input type="date" class="input lesson-date" value="${esc(p.date ?? '')}"></div>
        <div><label class="label">Signed off by</label><input class="input lesson-sign" value="${esc(p.signedBy ?? '')}" placeholder="Instructor"></div>
        <div><label class="label">Notes</label><input class="input lesson-notes" value="${esc(p.notes ?? '')}"></div>
        <button class="btn-navy !py-2 text-sm md:col-span-4" data-act="save-lesson">Save progress</button>
      </div>
    </div>
  </details>`;
}

function curriculum(): string {
  const p = PROGRAMS.find((x) => x.id === openProgram)!;
  const gate = gateStatus(p);
  return `
  <div class="grid lg:grid-cols-4 gap-6">
    <aside class="lg:col-span-1 space-y-2 no-print">
      ${PROGRAMS.map((x) => `<button data-prog="${x.id}" class="w-full text-left card !p-4 ${x.id === openProgram ? 'ring-2 ring-faith-gold' : ''}">
        <p class="text-xs text-gray-500 font-bold uppercase">${esc(x.level)}</p><p class="font-bold text-faith-navy text-sm mb-2">${esc(x.name)}</p>${bar(programPct(x))}</button>`).join('')}
    </aside>
    <section class="lg:col-span-3">
      <p class="eyebrow">${esc(p.level)}</p>
      <h2 class="text-3xl font-serif font-bold text-faith-navy">${esc(p.name)}</h2>
      <p class="text-gray-700 mt-2 mb-4">${esc(p.description)}</p>
      ${p.id === 'protection' ? protectionAdvisory() : ''}
      ${p.gate ? `<div class="card mb-4 ${gate.ok ? 'border-green-500' : 'border-red-400'} border-2">
        <h3 class="font-bold text-faith-navy mb-2">${gate.ok ? '✅ Prerequisites met' : '⛔ Prerequisites (complete before starting)'}</h3>
        ${list(p.gate)}
        ${gate.reasons.length ? `<p class="text-sm text-red-700 font-bold mt-3">Not yet met for ${esc(dog().name)}: ${gate.reasons.map(esc).join(' ')}</p>` : ''}
      </div>` : ''}
      ${p.lessons.map(lessonCard).join('')}
    </section>
  </div>`;
}

function protectionAdvisory(): string {
  const b = breed();
  const s = b.suitability.protection;
  return `<div class="card mb-4 bg-faith-navy text-white">
    <h3 class="font-bold text-faith-gold mb-2">Protection suitability for ${esc(dog().name)}: ${esc(b.name)} ${stars(s.rating)}</h3>
    <p class="text-sm text-gray-200">${esc(s.note)}</p>
    <p class="text-sm text-gray-300 mt-3">Faith Forward standard: <strong class="text-white">control before power</strong>. The Out (X4) and the Call-Off (X12) are the two skills that make a protection dog safe. No dog progresses without them.</p>
  </div>`;
}

// ───────────────────────── NUTRITION

function nutrition(): string {
  const d = dog(), b = breed();
  const plan = feedingPlan(d.weightLb, d.activity, d.kcalPerCup, b, !d.altered);
  const [wLo, wHi] = d.sex === 'F' ? b.weightLb.female : b.weightLb.male;
  return `
  <div class="grid lg:grid-cols-3 gap-6">
    <form id="nutri-form" class="card">
      <h2 class="text-2xl font-serif font-bold text-faith-navy mb-4">Ration Calculator</h2>
      <label class="label">Weight (lb)</label><input class="input mb-3" type="number" step="0.1" name="weightLb" value="${d.weightLb}">
      <label class="label">Activity</label><select class="input mb-3" name="activity">${(Object.keys(ACTIVITY) as Activity[]).map((a) => `<option value="${a}" ${a === d.activity ? 'selected' : ''}>${ACTIVITY[a].label}</option>`).join('')}</select>
      <label class="label">Food kcal/cup</label><input class="input mb-3" type="number" name="kcalPerCup" value="${d.kcalPerCup}">
      <button class="btn-gold w-full">Update & save to profile</button>
      <p class="text-xs text-gray-500 mt-3">Breed standard weight for a ${d.sex === 'F' ? 'female' : 'male'} ${esc(b.name)}: ${wLo}-${wHi} lb.</p>
    </form>
    <div class="card lg:col-span-2">
      <h3 class="font-bold text-faith-navy text-lg mb-4">${esc(d.name)}'s Daily Plan</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        ${[['RER', `${plan.rer} kcal`], ['Daily energy', `${plan.mer} kcal`], ['Food', `${plan.cupsPerDay} cups`], ['Per meal', `${plan.perMealCups} cups × ${plan.meals}`], ['Protein', `~${plan.proteinG} g`], ['Fat', `~${plan.fatG} g`], ['Water', `~${plan.waterOz} oz+`], ['Treat budget', `${plan.treatKcal} kcal`]]
          .map(([k, v]) => `<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 uppercase font-bold">${k}</p><p class="text-xl font-bold text-faith-navy">${v}</p></div>`).join('')}
      </div>
      <p class="text-xs text-gray-500 mt-3">RER = 70 × (kg)^0.75. Daily energy = RER × activity factor (${ACTIVITY[d.activity].factor}${!d.altered && d.activity === 'pet' ? ', intact adjustment 1.8' : ''}). Re-weigh every 2 weeks and adjust 10% up or down to hold body condition 4-5/9. Your veterinarian has the final say.</p>
      <h4 class="font-bold text-faith-navy mt-4 mb-2">Breed-specific guidance: ${esc(b.name)}</h4>${list(plan.notes)}
      <p class="text-sm mt-3">Target macros for this breed: protein ${b.nutrition.proteinPct.join('-')}% · fat ${b.nutrition.fatPct.join('-')}% (dry-matter basis on the label).</p>
    </div>
  </div>
  <div class="grid lg:grid-cols-3 gap-6 mt-6">
    <div class="card"><h3 class="font-bold text-faith-navy mb-3">Body Condition Score (1-9)</h3>${BCS.map((x) => `<p class="text-sm mb-2"><strong>${x.score} · ${x.label}:</strong> ${esc(x.desc)}</p>`).join('')}</div>
    <div class="card"><h3 class="font-bold text-red-700 mb-3">Toxic Foods: Never Feed</h3>${list(TOXIC_FOODS)}</div>
    <div class="card"><h3 class="font-bold text-faith-navy mb-3">Feeding on the Street</h3>${list(STREET_FEEDING_TIPS)}</div>
  </div>
  <div class="card mt-6"><h3 class="font-bold text-faith-navy mb-3">Feeding Schedule Template</h3>
    <table class="w-full text-sm"><thead><tr class="bg-faith-navy text-white"><th class="p-2 text-left">Time</th><th class="p-2 text-left">Meal</th><th class="p-2 text-left">Amount</th><th class="p-2 text-left">Notes</th></tr></thead><tbody>
    ${(plan.meals === 3 ? ['0700', '1200', '1800'] : ['0730', '1730']).map((t, i) => `<tr class="border-b"><td class="p-2 font-mono">${t}</td><td class="p-2">Meal ${i + 1}</td><td class="p-2">${plan.perMealCups} cups</td><td class="p-2">${b.id === 'gsd' || b.id === 'malinois' ? 'Slow feeder; no exercise 1 hr before / 2 hrs after' : 'Part may be used as training rewards'}</td></tr>`).join('')}
    </tbody></table></div>`;
}

// ───────────────────────── MEDICAL

function medical(): string {
  const d = dog(), b = breed();
  const recs = S.medical.filter((m) => m.dogId === d.id).sort((a, c) => c.given.localeCompare(a.given));
  return `
  <div class="card mb-6 bg-red-50 border-red-200">
    <h2 class="text-xl font-bold text-red-800 mb-3">🚨 Emergency Signs: Go to an Emergency Vet</h2>
    <div class="grid md:grid-cols-2 gap-3">${EMERGENCY_SIGNS.map((e) => `<p class="text-sm"><strong>${esc(e.sign)}</strong><br>${esc(e.action)}</p>`).join('')}</div>
    <p class="text-sm mt-3"><strong>Normal vitals:</strong> HR ${VITALS.heartRate} · RR ${VITALS.respiration} · Temp ${VITALS.temperature} · ${VITALS.gums}</p>
  </div>
  <div class="grid lg:grid-cols-3 gap-6">
    <form id="med-form" class="card">
      <h3 class="font-bold text-faith-navy text-lg mb-3">Add Medical Record</h3>
      <label class="label">Item</label><input class="input mb-2" name="item" list="med-items" required placeholder="e.g., Rabies (3-yr)">
      <datalist id="med-items">${[...VACCINES.map((v) => v.name), ...PREVENTIVES.map((p) => p.name), 'Vet exam', 'Heartworm test', 'Fecal test', 'OFA hips/elbows', 'Dental cleaning', 'Spay/neuter'].map((x) => `<option value="${esc(x)}">`).join('')}</datalist>
      <label class="label">Date given</label><input class="input mb-2" type="date" name="given" value="${today()}" required>
      <label class="label">Next due</label><input class="input mb-2" type="date" name="due">
      <label class="label">Provider</label><input class="input mb-2" name="provider" value="${esc(d.vet)}">
      <label class="label">Notes</label><input class="input mb-3" name="notes">
      <button class="btn-gold w-full">Add record</button>
    </form>
    <div class="card lg:col-span-2">
      <h3 class="font-bold text-faith-navy text-lg mb-3">${esc(d.name)}'s Medical Record</h3>
      ${recs.length ? `<table class="w-full text-sm"><thead><tr class="bg-faith-navy text-white"><th class="p-2 text-left">Item</th><th class="p-2 text-left">Given</th><th class="p-2 text-left">Due</th><th class="p-2 text-left">Provider</th><th class="p-2"></th></tr></thead><tbody>
        ${recs.map((m) => `<tr class="border-b"><td class="p-2">${esc(m.item)}${m.notes ? `<br><span class="text-xs text-gray-500">${esc(m.notes)}</span>` : ''}</td><td class="p-2">${esc(m.given)}</td><td class="p-2 ${m.due && m.due < today() ? 'text-red-600 font-bold' : ''}">${esc(m.due ?? '')}</td><td class="p-2">${esc(m.provider ?? '')}</td><td class="p-2"><button data-act="del-med" data-id="${m.id}" class="text-red-600 text-xs no-print">Delete</button></td></tr>`).join('')}
      </tbody></table>` : '<p class="text-sm text-gray-600">No records yet.</p>'}
    </div>
  </div>
  <div class="grid lg:grid-cols-2 gap-6 mt-6">
    <div class="card"><h3 class="font-bold text-faith-navy mb-3">Vaccination Schedule</h3>${VACCINES.map((v) => `<div class="mb-3 text-sm"><p class="font-bold">${esc(v.name)} <span class="chip">${esc(v.type)}</span></p><p class="text-gray-600">${esc(v.schedule)}</p></div>`).join('')}</div>
    <div class="card"><h3 class="font-bold text-faith-navy mb-3">Prevention</h3>${PREVENTIVES.map((v) => `<div class="mb-3 text-sm"><p class="font-bold">${esc(v.name)}</p><p class="text-gray-600">${esc(v.note)}</p></div>`).join('')}</div>
    <div class="card"><h3 class="font-bold text-faith-navy mb-3">${esc(b.name)}: Breed Health Screening</h3>${b.health.map((h) => `<div class="mb-2 text-sm"><p class="font-bold">${esc(h.condition)}</p><p class="text-gray-600">${esc(h.note)}</p>${h.screening ? `<p class="text-xs text-faith-gold-dark">Screening: ${esc(h.screening)}</p>` : ''}</div>`).join('')}</div>
    <div class="card"><h3 class="font-bold text-faith-navy mb-3">K9 First-Aid Kit Checklist</h3>${FIRST_AID_KIT.map((i) => `<label class="flex gap-2 text-sm py-0.5"><input type="checkbox"> ${esc(i)}</label>`).join('')}
      <h3 class="font-bold text-faith-navy mt-5 mb-3">Daily Health Check</h3><p class="text-sm text-gray-600">${DAILY_HEALTH_CHECK.map(esc).join(' · ')}</p></div>
  </div>
  <div class="card mt-6"><h3 class="font-bold text-faith-navy mb-3">St. Louis Animal Welfare Resources</h3>
    <div class="grid md:grid-cols-2 gap-3">${STL_ANIMAL_RESOURCES.map((r) => `<p class="text-sm"><a class="font-bold text-faith-gold-dark underline" href="${r.url}" target="_blank" rel="noopener">${esc(r.name)}</a><br>${esc(r.detail)}<br><span class="text-gray-500">${esc(r.where)}</span></p>`).join('')}</div>
    <p class="text-xs text-gray-500 mt-3">Call ahead to confirm hours and services before referring a veteran.</p></div>`;
}

// ───────────────────────── EXERCISE

function exercise(): string {
  const d = dog(), b = breed(), plan = exercisePlan(b, ageYears(d));
  return `
  <h2 class="section-title !text-3xl">Weekly Conditioning Plan: ${esc(d.name)}</h2>
  <p class="text-gray-600 mt-2 mb-6">Built for a ${ageYears(d).toFixed(1)}-year-old ${esc(b.name)}. Breed target: ${b.exercise.dailyMinutes.join('-')} minutes/day. Heat tolerance ${b.exercise.heatTolerance}, cold tolerance ${b.exercise.coldTolerance}.</p>
  <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
    ${plan.map((p) => `<div class="card"><p class="eyebrow">${p.day}</p><p class="font-bold text-faith-navy mb-2">${esc(p.focus)}</p>${list(p.blocks)}</div>`).join('')}
  </div>
  <div class="grid lg:grid-cols-2 gap-6 mt-6">
    <div class="card"><h3 class="font-bold text-faith-navy mb-3">${esc(b.name)} Exercise Notes</h3>${list(b.exercise.notes)}</div>
    <div class="card"><h3 class="font-bold text-faith-navy mb-3">Weather Rules (St. Louis)</h3>${list(WEATHER_RULES)}</div>
  </div>`;
}

// ───────────────────────── ROUTINES

function routines(): string {
  return `<h2 class="section-title !text-3xl">Premade Daily Routines</h2>
  <p class="text-gray-600 mt-2 mb-6">Print any routine as a daily checklist. Use the routine that fits the handler's living situation and the dog's phase.</p>
  <div class="grid lg:grid-cols-2 gap-6">
  ${ROUTINES.map((r) => `<div class="card"><p class="eyebrow">${esc(r.for)}</p><h3 class="font-bold text-faith-navy text-xl mb-3">${esc(r.name)}</h3>
    <table class="w-full text-sm">${r.schedule.map((s) => `<tr class="border-b"><td class="p-2 w-6"><input type="checkbox" aria-label="done"></td><td class="p-2 font-mono font-bold text-faith-gold-dark whitespace-nowrap">${esc(s.time)}</td><td class="p-2">${esc(s.task)}</td></tr>`).join('')}</table></div>`).join('')}
  </div>
  <button data-act="print" class="btn-navy mt-6 no-print">🖨️ Print routines</button>`;
}

// ───────────────────────── LOGS

const LOG_TYPES: Record<LogType, { label: string; fields: string[] }> = {
  training: { label: 'Training Session', fields: ['durationMin', 'location', 'skills', 'reps', 'successPct', 'rating'] },
  health: { label: 'Daily Health Check', fields: ['rating'] },
  feeding: { label: 'Feeding', fields: ['skills'] },
  exercise: { label: 'Exercise / PT', fields: ['durationMin', 'location', 'skills'] },
  outreach: { label: 'Outreach Contact', fields: ['location', 'skills'] },
  bite: { label: 'Bite Work Session (Protection)', fields: ['durationMin', 'location', 'skills', 'reps', 'rating', 'helper', 'outQuality', 'calloffs'] },
  incident: { label: 'Incident Report', fields: ['location', 'witnesses', 'injuries', 'actions'] },
  vet: { label: 'Vet Visit', fields: ['location', 'skills'] },
};
const FIELD_LABEL: Record<string, string> = {
  durationMin: 'Duration (min)', location: 'Location', skills: 'Skills / items / summary', reps: 'Reps', successPct: 'Success %',
  rating: 'Dog energy/focus (1-5)', helper: 'Helper/decoy name', outQuality: 'Out quality (1-5)', calloffs: 'Call-offs (success/attempts)',
  witnesses: 'Witnesses', injuries: 'Injuries (person/dog)', actions: 'Actions taken / notifications',
};
let logType: LogType = 'training';
let logFilter: LogType | 'all' = 'all';

function logs(): string {
  const d = dog();
  const rows = S.logs.filter((l) => l.dogId === d.id && (logFilter === 'all' || l.type === logFilter)).sort((a, c) => c.date.localeCompare(a.date));
  const f = LOG_TYPES[logType].fields;
  const numeric = ['durationMin', 'reps', 'successPct', 'rating'];
  return `
  <div class="grid lg:grid-cols-3 gap-6">
    <form id="log-form" class="card">
      <h2 class="text-xl font-serif font-bold text-faith-navy mb-3">New Log Entry</h2>
      <label class="label">Type</label><select class="input mb-2" id="log-type">${(Object.keys(LOG_TYPES) as LogType[]).map((t) => `<option value="${t}" ${t === logType ? 'selected' : ''}>${LOG_TYPES[t].label}</option>`).join('')}</select>
      <label class="label">Date</label><input class="input mb-2" type="date" name="date" value="${today()}">
      ${f.map((k) => `<label class="label">${FIELD_LABEL[k]}</label><input class="input mb-2" name="${k}" ${numeric.includes(k) ? 'type="number"' : ''} ${k === 'skills' && logType === 'training' ? 'list="lesson-list"' : ''}>`).join('')}
      <datalist id="lesson-list">${ALL_LESSONS.map((l) => `<option value="${l.id.toUpperCase()} ${esc(l.title)}">`).join('')}</datalist>
      ${logType === 'health' ? `<fieldset class="mb-2"><legend class="label">Checks OK</legend>${DAILY_HEALTH_CHECK.map((c) => `<label class="flex gap-2 text-sm"><input type="checkbox" name="check" value="${esc(c)}" checked> ${esc(c)}</label>`).join('')}</fieldset>` : ''}
      <label class="label">Notes</label><textarea class="input mb-3" name="notes" rows="3" ${logType === 'incident' ? 'required placeholder="Who, what, when, where, how. Facts only."' : ''}></textarea>
      <button class="btn-gold w-full">Save log</button>
      ${logType === 'incident' ? '<p class="text-xs text-red-700 mt-2">Notify the K9 Program Director within 24 hours of any incident. If a bite broke skin, Missouri requires reporting to local animal control/health department and rabies observation.</p>' : ''}
    </form>
    <div class="card lg:col-span-2">
      <div class="flex flex-wrap justify-between items-center gap-2 mb-3">
        <h3 class="font-bold text-faith-navy text-lg">${esc(d.name)}'s Logs (${rows.length})</h3>
        <div class="flex gap-2 no-print">
          <select id="log-filter" class="input !w-auto !py-1 text-sm"><option value="all">All types</option>${(Object.keys(LOG_TYPES) as LogType[]).map((t) => `<option value="${t}" ${t === logFilter ? 'selected' : ''}>${LOG_TYPES[t].label}</option>`).join('')}</select>
          <button data-act="csv" class="btn-navy !py-1 !px-3 text-sm">CSV</button>
        </div>
      </div>
      <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="bg-faith-navy text-white"><th class="p-2 text-left">Date</th><th class="p-2 text-left">Type</th><th class="p-2 text-left">Summary</th><th class="p-2 text-left">Metrics</th><th></th></tr></thead><tbody>
      ${rows.map((l) => `<tr class="border-b align-top"><td class="p-2 whitespace-nowrap">${esc(l.date)}</td><td class="p-2"><span class="chip">${esc(LOG_TYPES[l.type].label)}</span></td>
        <td class="p-2">${esc(l.skills ?? '')}${l.location ? ` <span class="text-gray-500">@ ${esc(l.location)}</span>` : ''}<br><span class="text-gray-600">${esc(l.notes)}</span>${l.extra ? `<br><span class="text-xs text-gray-500">${Object.entries(l.extra).map(([k, v]) => `${esc(FIELD_LABEL[k] ?? k)}: ${esc(v)}`).join(' · ')}</span>` : ''}</td>
        <td class="p-2 whitespace-nowrap text-xs">${l.durationMin ? `${l.durationMin} min<br>` : ''}${l.reps ? `${l.reps} reps<br>` : ''}${l.successPct != null ? `${l.successPct}%<br>` : ''}${l.rating ? `★${l.rating}` : ''}</td>
        <td class="p-2"><button data-act="del-log" data-id="${l.id}" class="text-red-600 text-xs no-print">Delete</button></td></tr>`).join('') || '<tr><td colspan="5" class="p-4 text-gray-500">No entries.</td></tr>'}
      </tbody></table></div>
    </div>
  </div>`;
}

// ───────────────────────── REPORTS

let reportKind: 'progress' | 'intake' | 'incident' | 'certificate' = 'progress';
let reportMonth = today().slice(0, 7);

function reports(): string {
  const d = dog(), b = breed();
  const header = `<div class="flex items-center gap-4 border-b-2 border-faith-gold pb-4 mb-6"><img src="${import.meta.env.BASE_URL}faithforwardlogo.png" class="h-20" alt=""><div><p class="font-serif text-2xl font-bold text-faith-navy">Faith Forward Foundation</p><p class="text-sm text-gray-600">K9 Program · Spiritus Invictus</p></div></div>`;
  let body = '';
  if (reportKind === 'progress') {
    const ml = S.logs.filter((l) => l.dogId === d.id && l.date.startsWith(reportMonth));
    const tr = ml.filter((l) => l.type === 'training');
    const mins = ml.reduce((s, l) => s + (l.durationMin ?? 0), 0);
    const avg = tr.filter((l) => l.successPct != null).reduce((s, l, _, a) => s + l.successPct! / a.length, 0);
    const passed = ALL_LESSONS.filter((l) => S.progress[d.id]?.[l.id]?.status === 'passed' && S.progress[d.id]?.[l.id]?.date?.startsWith(reportMonth));
    body = `${header}<h2 class="text-2xl font-serif font-bold text-faith-navy">Monthly Progress Report: ${esc(reportMonth)}</h2>
      <p class="mb-4">${esc(d.name)} · ${esc(b.name)} · Handler ${esc(d.handler)}</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">${[['Sessions', tr.length], ['Total minutes', mins], ['Avg success', `${Math.round(avg)}%`], ['Lessons passed', passed.length]].map(([k, v]) => `<div class="bg-gray-50 p-3 rounded text-center"><p class="text-xs uppercase text-gray-500 font-bold">${k}</p><p class="text-2xl font-bold text-faith-navy">${v}</p></div>`).join('')}</div>
      <h3 class="font-bold text-faith-navy mb-2">Program Progress</h3>${PROGRAMS.map((p) => `<div class="flex items-center gap-3 mb-1 text-sm"><span class="w-72">${esc(p.name)}</span>${bar(programPct(p))}<span class="w-10 text-right">${programPct(p)}%</span></div>`).join('')}
      <h3 class="font-bold text-faith-navy mt-6 mb-2">Lessons Passed This Month</h3>${passed.length ? list(passed.map((l) => `${l.id.toUpperCase()} ${l.title}`)) : '<p class="text-sm">None this month.</p>'}
      <h3 class="font-bold text-faith-navy mt-6 mb-2">Session Log</h3><table class="w-full text-sm">${ml.map((l) => `<tr class="border-b"><td class="p-1">${esc(l.date)}</td><td class="p-1">${esc(LOG_TYPES[l.type].label)}</td><td class="p-1">${esc(l.skills ?? '')}</td><td class="p-1">${esc(l.notes)}</td></tr>`).join('') || '<tr><td>No logs.</td></tr>'}</table>
      <div class="grid grid-cols-2 gap-12 mt-12 text-sm"><p class="border-t pt-2">Handler signature / date</p><p class="border-t pt-2">Instructor signature / date</p></div>`;
  } else if (reportKind === 'intake') {
    const line = (l: string) => `<div class="mb-4"><p class="text-sm font-bold">${l}</p><div class="border-b border-gray-400 h-6"></div></div>`;
    body = `${header}<h2 class="text-2xl font-serif font-bold text-faith-navy mb-4">K9 Intake Evaluation</h2>
      <div class="grid md:grid-cols-2 gap-x-8">${['Veteran name', 'Date', 'Phone / contact method', 'Living situation', 'Dog name', 'Breed / mix', 'Age', 'Sex / altered', 'Weight', 'Body condition (1-9)', 'Vaccinations current?', 'Microchip?', 'Medical concerns', 'Handler goals'].map(line).join('')}</div>
      <h3 class="font-bold text-faith-navy mt-4 mb-2">Temperament (circle 1-5)</h3>
      ${['Friendly with strangers', 'Neutral with other dogs', 'Accepts handling (paws, ears, mouth)', 'Recovers from startle', 'Leash manners', 'Food/toy guarding (5 = none)', 'Energy level'].map((t) => `<p class="text-sm mb-1">${t}: 1 · 2 · 3 · 4 · 5</p>`).join('')}
      <h3 class="font-bold text-faith-navy mt-4 mb-2">Recommended Track</h3><p class="text-sm">☐ Companion ☐ ESA ☐ Psychiatric Service ☐ Detection/Tracking ☐ Protection (evaluation required) ☐ Refer to vet/behaviorist</p>
      <h3 class="font-bold text-faith-navy mt-4 mb-2">Services Provided Today</h3><p class="text-sm">☐ Food ☐ Leash/collar/harness ☐ Flea/tick ☐ Vaccine referral ☐ Spay/neuter voucher ☐ Training session ☐ Blessing ☐ Other: ________</p>
      <div class="grid grid-cols-2 gap-12 mt-12 text-sm"><p class="border-t pt-2">Veteran signature / date</p><p class="border-t pt-2">Faith Forward evaluator / date</p></div>`;
  } else if (reportKind === 'incident') {
    const line = (l: string, h = 6) => `<div class="mb-4"><p class="text-sm font-bold">${l}</p><div class="border-b border-gray-400" style="height:${h * 4}px"></div></div>`;
    body = `${header}<h2 class="text-2xl font-serif font-bold text-faith-navy mb-4">K9 Incident Report</h2>
      <p class="text-sm mb-4">Complete within 24 hours. Facts only. Submit to the K9 Program Director.</p>
      <div class="grid md:grid-cols-2 gap-x-8">${['Date & time', 'Location', 'Dog', 'Handler', 'Persons involved', 'Witnesses (name & contact)', 'Equipment on dog', 'Was dog under command?'].map((l) => line(l)).join('')}</div>
      ${line('Description of events (what happened before, during, after)', 24)}${line('Injuries (person/animal) and treatment', 12)}${line('Notifications (Director, animal control, police, vet)', 12)}${line('Corrective actions / training plan', 12)}
      <div class="grid grid-cols-2 gap-12 mt-12 text-sm"><p class="border-t pt-2">Handler signature / date</p><p class="border-t pt-2">Director signature / date</p></div>`;
  } else {
    const passedPrograms = PROGRAMS.filter((p) => programPct(p) === 100);
    body = `<div class="border-8 border-double border-faith-gold p-10 text-center bg-white">
      <img src="${import.meta.env.BASE_URL}faithforwardlogo.png" class="h-32 mx-auto" alt="">
      <p class="eyebrow mt-4">Faith Forward Foundation · K9 Program</p>
      <h2 class="text-4xl font-serif font-bold text-faith-navy mt-2">Certificate of Achievement</h2>
      <p class="mt-6">This certifies that</p>
      <p class="text-3xl font-display italic text-faith-navy my-2">${esc(d.name)} &amp; ${esc(d.handler)}</p>
      <p>have successfully completed</p>
      <p class="text-xl font-bold text-faith-navy my-2">${passedPrograms.length ? passedPrograms.map((p) => esc(p.name)).join(' · ') : '<em>(no complete programs yet)</em>'}</p>
      <p class="italic text-sm mt-6 text-gray-600">"Well done, thou good and faithful servant." (Matthew 25:21)</p>
      <div class="grid grid-cols-2 gap-12 mt-12 text-sm"><p class="border-t pt-2">The Reverend Paul Moore<br>Founder, Faith Forward Foundation</p><p class="border-t pt-2">Date: ${today()}</p></div>
    </div>`;
  }
  return `<div class="flex flex-wrap gap-2 mb-6 no-print">
    ${(['progress', 'intake', 'incident', 'certificate'] as const).map((k) => `<button data-report="${k}" class="${k === reportKind ? 'btn-gold' : 'btn-navy'} !py-2 text-sm">${{ progress: 'Monthly Progress', intake: 'Intake Evaluation', incident: 'Incident Report', certificate: 'Certificate' }[k]}</button>`).join('')}
    ${reportKind === 'progress' ? `<input type="month" id="report-month" class="input !w-auto" value="${reportMonth}">` : ''}
    <button data-act="print" class="btn-navy !py-2 text-sm">🖨️ Print / Save PDF</button>
  </div><div class="card max-w-4xl mx-auto">${body}</div>`;
}

// ───────────────────────── CERTIFICATION

function certification(): string {
  const d = dog();
  const levels = [
    { level: 'Level 1: Faith Forward Handler', req: [['handler', 'Handler Foundations'], ['obedience', 'Foundation Obedience']] },
    { level: 'Level 2: Faith Forward Trainer', req: [['handler', 'Handler Foundations'], ['obedience', 'Foundation Obedience'], ['advanced', 'Advanced Obedience'], ['service', 'Support & Service Tasks'], ['trainer', 'Train-the-Trainer']] },
    { level: 'Level 3: Master Trainer / Instructor', req: [['handler', 'Handler Foundations'], ['obedience', 'Foundation Obedience'], ['advanced', 'Advanced Obedience'], ['service', 'Support & Service Tasks'], ['detection', 'Detection'], ['tracking', 'Tracking'], ['trainer', 'Train-the-Trainer']] },
  ];
  return `<h2 class="section-title !text-3xl">Handler & Trainer Certification</h2>
  <p class="text-gray-600 mt-2 mb-6">Certification path for ${esc(S.handler.name)}. Requirements are tracked against ${esc(d.name)}'s training record. Level 3 also requires 2 years in the program, 200 logged instructing hours and Director endorsement; protection instructors need outside certification (IGP/PSA helper or police K9 instructor).</p>
  <div class="grid lg:grid-cols-3 gap-6">
  ${levels.map((L) => { const ok = L.req.every(([id]) => programDone(id)); const awarded = S.handler.certifications.find((c) => c.level === L.level);
    return `<div class="card ${ok ? 'border-green-500 border-2' : ''}"><h3 class="font-bold text-faith-navy text-lg mb-3">🎖️ ${L.level}</h3>
      ${L.req.map(([id, n]) => `<p class="text-sm">${programDone(id) ? '✅' : '⬜'} ${n} (${programPct(PROGRAMS.find((p) => p.id === id)!)}%)</p>`).join('')}
      ${awarded ? `<p class="mt-3 text-green-700 font-bold text-sm">Awarded ${esc(awarded.date)} by ${esc(awarded.by)}</p>` : `<button data-act="award" data-level="${esc(L.level)}" class="btn-gold !py-2 text-sm mt-3 ${ok ? '' : 'opacity-50'}" ${ok ? '' : 'disabled'}>Record certification</button>`}</div>`; }).join('')}
  </div>
  <div class="card mt-6">
    <h3 class="font-bold text-faith-navy text-lg mb-2">Protection Program: Director Sign-Off for ${esc(d.name)}</h3>
    <p class="text-sm text-gray-600 mb-3">Record the date and name of the K9 Program Director (and outside evaluator) who approved this dog after the temperament evaluation (X1) and all gate requirements.</p>
    ${S.handler.directorSignoffProtection[d.id] ? `<p class="text-green-700 font-bold">Signed: ${esc(S.handler.directorSignoffProtection[d.id])}</p><button data-act="revoke-signoff" class="text-red-600 text-sm mt-2">Revoke</button>`
      : `<form id="signoff-form" class="flex flex-wrap gap-2"><input class="input !w-auto" name="by" placeholder="Director / evaluator name" required><input class="input !w-auto" type="date" name="date" value="${today()}" required><button class="btn-navy !py-2">Record sign-off</button></form>`}
  </div>`;
}

// ───────────────────────── DATA

function data(): string {
  return `<div class="card max-w-2xl">
    <h2 class="text-2xl font-serif font-bold text-faith-navy mb-2">Your Data</h2>
    <p class="text-sm text-gray-600 mb-4">Everything in the suite is stored privately in this browser on this device. Nothing is sent to a server. Export a backup regularly, and import it on another device. When the Faith Forward Firebase backend is connected, this data can be synced (see the developer docs).</p>
    <div class="flex flex-wrap gap-3">
      <button data-act="export" class="btn-gold">⬇️ Export backup (JSON)</button>
      <label class="btn-navy cursor-pointer">⬆️ Import backup<input type="file" id="import-file" accept="application/json" class="hidden"></label>
      <button data-act="reset" class="btn-navy !bg-red-700">Reset to defaults</button>
    </div>
    <p class="text-xs text-gray-500 mt-4">Dogs: ${S.dogs.length} · Logs: ${S.logs.length} · Medical records: ${S.medical.length}</p>
  </div>`;
}

// ───────────────────────── RENDER & EVENTS

const VIEWS: Record<Tab, () => string> = { dashboard, profile, breeds, curriculum, nutrition, medical, exercise, routines, logs, reports, certification, data };

function render(): void {
  const root = document.getElementById('k9-app')!;
  root.innerHTML = shell();
  document.getElementById('k9-main')!.innerHTML = (VIEWS[tab] ?? dashboard)();
}

function formData(form: HTMLFormElement): Record<string, string> {
  return Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
}

window.addEventListener('hashchange', () => {
  const h = location.hash.slice(1);
  if (h.startsWith('breed-')) return;
  tab = (h || 'dashboard') as Tab;
  render();
  window.scrollTo({ top: 0 });
});

document.addEventListener('change', (e) => {
  const t = e.target as HTMLElement;
  if (t.id === 'dog-switch') { S.activeDogId = (t as HTMLSelectElement).value; commit(); }
  if (t.id === 'log-type') { logType = (t as HTMLSelectElement).value as LogType; render(); }
  if (t.id === 'log-filter') { logFilter = (t as HTMLSelectElement).value as LogType | 'all'; render(); }
  if (t.id === 'report-month') { reportMonth = (t as HTMLInputElement).value; render(); }
  if (t.id === 'import-file') {
    const file = (t as HTMLInputElement).files?.[0];
    file?.text().then((txt) => {
      try { const next = JSON.parse(txt) as SuiteState; if (!next.dogs?.length) throw new Error(); S = next; commit(); alert('Backup imported.'); }
      catch { alert('That file is not a valid K9 suite backup.'); }
    });
  }
});

document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-act],[data-prog],[data-report]');
  if (!el) return;
  if (el.dataset.prog) { openProgram = el.dataset.prog; if (tab !== 'curriculum') { location.hash = 'curriculum'; } else render(); return; }
  if (el.dataset.report) { reportKind = el.dataset.report as typeof reportKind; render(); return; }
  const d = dog();
  switch (el.dataset.act) {
    case 'add-dog': {
      const name = prompt('New dog\'s name?');
      if (!name) return;
      const nd: Dog = { ...d, id: uid(), name, notes: '', microchip: '', goals: ['companion', 'obedience'] };
      S.dogs.push(nd); S.activeDogId = nd.id; location.hash = 'profile'; commit(); break;
    }
    case 'delete-dog':
      if (confirm(`Remove ${d.name} and all of ${d.sex === 'F' ? 'her' : 'his'} records?`)) {
        S.dogs = S.dogs.filter((x) => x.id !== d.id); S.logs = S.logs.filter((l) => l.dogId !== d.id); S.medical = S.medical.filter((m) => m.dogId !== d.id);
        S.activeDogId = S.dogs[0].id; commit();
      }
      break;
    case 'save-lesson': {
      e.preventDefault();
      const box = el.closest<HTMLElement>('[data-lesson]')!;
      const id = box.dataset.lesson!;
      S.progress[d.id] ??= {};
      S.progress[d.id][id] = {
        status: box.querySelector<HTMLSelectElement>('.lesson-status')!.value as LessonStatus,
        date: box.querySelector<HTMLInputElement>('.lesson-date')!.value || today(),
        signedBy: box.querySelector<HTMLInputElement>('.lesson-sign')!.value,
        notes: box.querySelector<HTMLInputElement>('.lesson-notes')!.value,
      };
      commit(); break;
    }
    case 'del-med': S.medical = S.medical.filter((m) => m.id !== el.dataset.id); commit(); break;
    case 'del-log': if (confirm('Delete this log entry?')) { S.logs = S.logs.filter((l) => l.id !== el.dataset.id); commit(); } break;
    case 'csv': download(`${d.name}-logs.csv`, toCsv(S.logs.filter((l) => l.dogId === d.id).map(({ extra, ...r }) => ({ ...r, ...extra }))), 'text/csv'); break;
    case 'print': window.print(); break;
    case 'export': download(`faith-forward-k9-backup-${today()}.json`, JSON.stringify(S, null, 2)); break;
    case 'reset': if (confirm('Erase all suite data on this device and restore defaults? Export a backup first.')) { S = reset(); render(); } break;
    case 'award': {
      const by = prompt('Certified by (name)?', 'The Reverend Paul Moore');
      if (by) { S.handler.certifications.push({ level: el.dataset.level!, date: today(), by }); commit(); }
      break;
    }
    case 'revoke-signoff': delete S.handler.directorSignoffProtection[d.id]; commit(); break;
  }
});

document.addEventListener('submit', (e) => {
  const form = e.target as HTMLFormElement;
  e.preventDefault();
  const f = formData(form), d = dog();
  if (form.id === 'dog-form') {
    Object.assign(d, {
      name: f.name, breedId: f.breedId, sex: f.sex as Dog['sex'], dob: f.dob, weightLb: +f.weightLb, color: f.color,
      altered: f.altered === '1', microchip: f.microchip, handler: f.handler, vet: f.vet, activity: f.activity as Activity,
      kcalPerCup: +f.kcalPerCup || 380, notes: f.notes,
      goals: new FormData(form).getAll('goals') as Discipline[],
    });
    commit();
  } else if (form.id === 'nutri-form') {
    Object.assign(d, { weightLb: +f.weightLb, activity: f.activity as Activity, kcalPerCup: +f.kcalPerCup || d.kcalPerCup });
    commit();
  } else if (form.id === 'med-form') {
    S.medical.push({ id: uid(), dogId: d.id, item: f.item, given: f.given, due: f.due || undefined, provider: f.provider, notes: f.notes });
    commit();
  } else if (form.id === 'log-form') {
    const base = ['date', 'notes', 'durationMin', 'location', 'skills', 'reps', 'successPct', 'rating'];
    const extra: Record<string, string> = {};
    for (const [k, v] of Object.entries(f)) if (!base.includes(k) && k !== 'check' && v) extra[k] = v;
    if (logType === 'health') {
      const ok = new FormData(form).getAll('check') as string[];
      const missed = DAILY_HEALTH_CHECK.filter((c) => !ok.includes(c));
      extra.flags = missed.length ? `ATTENTION: ${missed.join(', ')}` : 'All normal';
    }
    const n = (k: string) => (f[k] ? +f[k] : undefined);
    const entry: LogEntry = { id: uid(), dogId: d.id, type: logType, date: f.date || today(), durationMin: n('durationMin'), location: f.location, skills: f.skills, reps: n('reps'), successPct: n('successPct'), rating: n('rating'), notes: f.notes ?? '', extra: Object.keys(extra).length ? extra : undefined };
    S.logs.push(entry);
    commit();
  } else if (form.id === 'signoff-form') {
    S.handler.directorSignoffProtection[d.id] = `${f.by} on ${f.date}`;
    commit();
  }
});

render();
