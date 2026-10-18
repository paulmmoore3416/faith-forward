// Export the shared devotional data to JSON for the faith-forward-daily-quotes
// site, so both repositories show the same scripture, quote and prayer each day.
// Usage: npx tsx scripts/export-devotional.ts ../faith-forward-daily-quotes/data/devotional.json
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { VERSES, QUOTES, PRAYERS, devotionalFor } from '../src/data/devotional';

const out = process.argv[2] ?? 'public/content/devotional.json';
const days: Record<string, { v: number; q: number; p: number; f?: string; vx?: { text: string; ref: string } }> = {};
for (let d = new Date(2026, 0, 1); d < new Date(2031, 0, 1); d.setDate(d.getDate() + 1)) {
  const dev = devotionalFor(d);
  const v = VERSES.indexOf(dev.verse);
  days[dev.date] = { v, q: QUOTES.indexOf(dev.quote), p: PRAYERS.indexOf(dev.prayer), ...(dev.feast ? { f: dev.feast } : {}), ...(v < 0 ? { vx: { text: dev.verse.text, ref: dev.verse.ref } } : {}) };
}
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ generated: new Date().toISOString(), source: 'https://github.com/paulmmoore3416/faith-forward/blob/master/src/data/devotional.ts', verses: VERSES, quotes: QUOTES, prayers: PRAYERS, days }));
console.log(`wrote ${Object.keys(days).length} days to ${out}`);
