import '../layout';
import { esc } from '../layout';
import { DONATION_NEEDS, ORG } from '../config';
import { wireForms } from '../lib/submit';

const grid = document.getElementById('needs-grid');
if (grid) {
  grid.innerHTML = DONATION_NEEDS.map((n) => `
    <div class="card border-t-4 !border-t-faith-gold">
      <div class="text-4xl mb-3">${n.icon}</div>
      <h3 class="text-xl font-bold text-faith-navy mb-2">${esc(n.title)}</h3>
      <p class="text-gray-600 text-sm">${esc(n.detail)}</p>
    </div>`).join('');
}

const tax = document.getElementById('tax-status');
if (tax) {
  tax.textContent = ORG.taxExemptConfirmed
    ? `Faith Forward Foundation is a 501(c)(3) nonprofit (EIN ${ORG.ein}). Gifts are tax-deductible to the extent allowed by law.`
    : 'Faith Forward Foundation is completing its incorporation and IRS 501(c)(3) application. We will update this page as soon as gifts are tax-deductible.';
}

wireForms();
