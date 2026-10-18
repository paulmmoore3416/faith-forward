import '../layout';
import { esc } from '../layout';
import { EVENTS } from '../data/events';

const root = document.getElementById('events-list');
if (root) {
  const now = new Date().toISOString().slice(0, 10);
  const upcoming = EVENTS.filter((e) => e.date >= now).sort((a, b) => a.date.localeCompare(b.date));
  const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
  root.innerHTML = upcoming.length
    ? upcoming.map((e) => `
      <article class="card !p-8 flex flex-col md:flex-row gap-6 ${e.priority ? 'border-2 !border-faith-gold' : ''}">
        <div class="md:w-48 shrink-0"><p class="eyebrow">${esc(e.kind)}</p><p class="font-bold text-faith-navy text-lg">${esc(fmt(e.date))}</p>${e.priority ? '<span class="chip mt-2">Priority</span>' : ''}</div>
        <div><h2 class="text-2xl font-serif font-bold text-faith-navy mb-2">${esc(e.title)}</h2><p class="text-gray-700 mb-2">${esc(e.detail)}</p><p class="text-sm text-gray-500">📍 ${esc(e.where)}</p></div>
      </article>`).join('')
    : '<p class="text-center text-gray-600">New events are being scheduled. Follow us on Facebook for announcements.</p>';
}
