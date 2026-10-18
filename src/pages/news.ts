import '../layout';
import { BASE, esc } from '../layout';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface ArticleMeta { week: number; slug: string; title: string; date: string; excerpt: string; tags: string[] }

const root = document.getElementById('news-root')!;
const params = new URLSearchParams(location.search);
const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

async function main() {
  const index: ArticleMeta[] = await fetch(`${BASE}content/articles/index.json`).then((r) => r.json());
  const today = new Date().toISOString().slice(0, 10);
  // Articles appear on the site on their scheduled publish date.
  const published = index.filter((a) => a.date <= today).sort((a, b) => b.date.localeCompare(a.date));
  const slug = params.get('a');
  const current = slug ? published.find((a) => a.slug === slug) : undefined;

  if (current) {
    const md = await fetch(`${BASE}content/articles/${current.slug}.md`).then((r) => r.text());
    // Strip the Blogger front matter block (title/labels/SEO) before rendering.
    const body = md.replace(/^---[\s\S]*?---\s*/, '');
    document.title = `${current.title} | Faith Forward`;
    root.innerHTML = `<a href="news.html" class="text-faith-gold-dark font-bold">← All articles</a>
      <article class="bg-white rounded-3xl shadow-xl p-8 md:p-14 mt-6">
        <p class="eyebrow">Week ${current.week} · ${esc(fmt(current.date))}</p>
        <div class="prose-faith mt-4">${DOMPurify.sanitize(await marked.parse(body))}</div>
        <div class="flex flex-wrap gap-2 mt-8">${current.tags.map((t) => `<span class="chip">#${esc(t)}</span>`).join('')}</div>
      </article>`;
    return;
  }

  if (!published.length) {
    const next = index.sort((a, b) => a.date.localeCompare(b.date))[0];
    root.innerHTML = `<p class="text-center text-gray-600">Our weekly series begins ${next ? esc(fmt(next.date)) : 'soon'}. Check back then.</p>`;
    return;
  }
  const [lead, ...rest] = published;
  root.innerHTML = `
    <a href="news.html?a=${lead.slug}" class="block bg-faith-navy text-white rounded-3xl p-10 mb-10 hover:shadow-2xl transition-shadow">
      <p class="eyebrow">Latest · Week ${lead.week} · ${esc(fmt(lead.date))}</p>
      <h2 class="text-3xl md:text-4xl font-serif font-bold mt-2 mb-4">${esc(lead.title)}</h2>
      <p class="text-gray-300">${esc(lead.excerpt)}</p>
      <p class="text-faith-gold font-bold mt-4">Read the article →</p>
    </a>
    <div class="grid md:grid-cols-2 gap-6">${rest.map((a) => `
      <a href="news.html?a=${a.slug}" class="card hover:shadow-lg transition-shadow block">
        <p class="eyebrow">Week ${a.week} · ${esc(fmt(a.date))}</p>
        <h3 class="text-xl font-serif font-bold text-faith-navy mt-1 mb-2">${esc(a.title)}</h3>
        <p class="text-sm text-gray-600">${esc(a.excerpt)}</p>
      </a>`).join('')}</div>`;
}

main().catch(() => { root.innerHTML = '<p class="text-center text-gray-600">Articles are temporarily unavailable.</p>'; });
