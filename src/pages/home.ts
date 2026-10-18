import '../layout';
import { esc } from '../layout';
import { devotionalFor } from '../data/devotional';
import { wireForms } from '../lib/submit';

const dev = devotionalFor();
const set = (id: string, html: string) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
set('dev-feast', esc(dev.feast ?? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })));
set('dev-verse', esc(dev.verse.text));
set('dev-ref', esc(dev.verse.ref));
set('dev-prayer-title', esc(dev.prayer.title));
set('dev-prayer', esc(dev.prayer.text));
set('dev-quote', `“${esc(dev.quote.text)}” <span class="block mt-1 text-faith-gold not-italic text-sm">${esc(dev.quote.author)}</span>`);

// Live St. Louis conditions (no key required). Drives cold/heat outreach messaging.
const weatherEl = document.getElementById('weather-widget');
if (weatherEl) {
  fetch('https://api.open-meteo.com/v1/forecast?latitude=38.6273&longitude=-90.1979&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit')
    .then((r) => r.json())
    .then((d) => {
      const t = Math.round(d.current.temperature_2m), feels = Math.round(d.current.apparent_temperature);
      const alert = feels <= 32
        ? '<p class="mt-4 text-red-300 font-bold">❄️ Freezing conditions. Warming centers are open. Veterans with dogs: ask us about coats, insulated bedding, and pet-friendly shelter.</p>'
        : feels >= 90
          ? '<p class="mt-4 text-orange-300 font-bold">☀️ Dangerous heat. Water, shade, and cooling centers. Remember: if the pavement is too hot for your hand, it is too hot for paws.</p>'
          : '';
      weatherEl.innerHTML = `<p class="text-5xl font-bold text-faith-gold">${t}°F</p><p class="text-gray-300 uppercase tracking-widest text-xs font-bold mt-1">Feels like ${feels}°F in St. Louis</p>${alert}`;
    })
    .catch(() => { weatherEl.innerHTML = '<p class="text-gray-400">Weather temporarily unavailable.</p>'; });
}

wireForms();
