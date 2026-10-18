import './input.css';
import { ORG } from './config';

// Shared chrome for every public page. Each page provides
// <div id="site-header"></div> and <div id="site-footer"></div>.

export const BASE = import.meta.env.BASE_URL;
export const asset = (p: string) => `${BASE}${p.replace(/^\//, '')}`;

const NAV = [
  { href: 'about.html', label: 'Our Story' },
  { href: 'ministries.html', label: 'Ministries' },
  { href: 'k9.html', label: 'K9 Program' },
  { href: 'resources.html', label: 'Resources' },
  { href: 'news.html', label: 'News' },
  { href: 'prayer.html', label: 'Prayer' },
  { href: 'contact.html', label: 'Contact' },
];

function currentPage(): string {
  const file = location.pathname.split('/').pop() || 'index.html';
  return file === '' ? 'index.html' : file;
}

function header(): string {
  const here = currentPage();
  const links = NAV.map(
    (n) => `<a href="${asset(n.href)}" class="nav-link ${here === n.href ? 'active' : ''}">${n.label}</a>`,
  ).join('');
  const mobile = NAV.map((n) => `<a href="${asset(n.href)}" class="block py-2">${n.label}</a>`).join('');
  return `
  <div class="bg-faith-ink text-white text-xs md:text-sm py-2 px-4 text-center">
    <span class="font-bold text-faith-gold">Veteran in crisis?</span>
    Call <a class="underline font-bold" href="tel:988">988, then ${ORG.crisis.press}</a>
    &middot; Text <a class="underline font-bold" href="sms:${ORG.crisis.text}">${ORG.crisis.text}</a>
    &middot; Free, confidential, 24/7.
  </div>
  <header class="sticky top-0 w-full z-50 bg-white/95 backdrop-blur shadow-sm border-b border-gray-100">
    <nav class="container mx-auto px-4 py-3 flex justify-between items-center" aria-label="Main">
      <a href="${asset('index.html')}" class="flex items-center gap-3 group">
        <img src="${asset('faithforwardlogo.png')}" alt="Faith Forward crest" class="h-12 w-auto group-hover:scale-105 transition-transform">
        <span class="leading-tight">
          <span class="block text-xl font-serif font-bold text-faith-navy tracking-wide">FAITH FORWARD</span>
          <span class="block text-[10px] tracking-[0.3em] text-faith-gold-dark font-bold">SPIRITUS INVICTUS</span>
        </span>
      </a>
      <div class="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-faith-navy">
        ${links}
        <a href="${asset('donate.html')}" class="btn-gold !py-2 !px-5">Give</a>
      </div>
      <button id="mobile-menu-btn" class="lg:hidden text-3xl text-faith-navy" aria-label="Open menu" aria-expanded="false">☰</button>
    </nav>
    <div id="nav-links" class="hidden lg:hidden bg-white border-t border-gray-100 px-6 py-4 text-center font-bold text-faith-navy">
      ${mobile}
      <a href="${asset('donate.html')}" class="btn-gold w-full mt-2">Give</a>
    </div>
  </header>`;
}

function footer(): string {
  const year = new Date().getFullYear();
  return `
  <footer class="bg-faith-navy text-gray-300 pt-16 pb-8">
    <div class="container mx-auto px-4 grid md:grid-cols-4 gap-10">
      <div class="md:col-span-2">
        <div class="flex items-center gap-3 mb-4">
          <img src="${asset('faithforwardlogo.png')}" alt="" class="h-14 bg-white rounded-lg p-1">
          <div>
            <p class="text-2xl font-serif font-bold text-white">Faith Forward</p>
            <p class="text-xs tracking-[0.3em] text-faith-gold">SPIRITUS INVICTUS</p>
          </div>
        </div>
        <p class="max-w-md text-sm leading-relaxed">${ORG.mission}</p>
        <p class="text-sm mt-4">Founded by ${ORG.founder.formal}, ${ORG.founder.title}. Proudly associated with
          <a class="text-faith-gold underline" href="${ORG.partnerSite.url}" target="_blank" rel="noopener">${ORG.partnerSite.name}</a>.</p>
      </div>
      <div>
        <h4 class="font-bold text-white uppercase text-xs tracking-widest mb-4">Serve With Us</h4>
        <ul class="space-y-2 text-sm">
          <li><a class="hover:text-faith-gold" href="${asset('donate.html')}">Donate Supplies</a></li>
          <li><a class="hover:text-faith-gold" href="${asset('partners.html')}">Partner With Us</a></li>
          <li><a class="hover:text-faith-gold" href="${asset('events.html')}">Events & Drives</a></li>
          <li><a class="hover:text-faith-gold" href="${asset('k9-suite.html')}">K9 Handler Training Suite</a></li>
          <li><a class="hover:text-faith-gold" href="${asset('recovery-manual.html')}">Recovery Manual</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-white uppercase text-xs tracking-widest mb-4">Connect</h4>
        <ul class="space-y-2 text-sm">
          <li><a class="hover:text-faith-gold" href="${ORG.facebook}" target="_blank" rel="noopener">Facebook</a></li>
          <li><a class="hover:text-faith-gold" href="mailto:${ORG.contactEmail}">${ORG.contactEmail}</a></li>
          <li><a class="hover:text-faith-gold" href="${ORG.quotesSite}" target="_blank" rel="noopener">Daily Faith Quotes</a></li>
          <li>${ORG.region}</li>
        </ul>
      </div>
    </div>
    <div class="container mx-auto px-4 mt-12 pt-6 border-t border-white/10 text-xs text-gray-400 flex flex-col md:flex-row justify-between gap-2">
      <p>&copy; ${year} ${ORG.legalName}. ${ORG.taxExemptConfirmed ? `A 501(c)(3) nonprofit. EIN ${ORG.ein}.` : '501(c)(3) application in progress.'}</p>
      <p>Founded by veterans. Serving veterans. Blessed to serve.</p>
    </div>
  </footer>`;
}

export function mountLayout(): void {
  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if (h) h.outerHTML = header();
  if (f) f.outerHTML = footer();

  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('nav-links');
  btn?.addEventListener('click', () => {
    const open = nav?.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', String(open));
  });
}

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function dayOfYear(d = new Date()): number {
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86_400_000);
}

mountLayout();
