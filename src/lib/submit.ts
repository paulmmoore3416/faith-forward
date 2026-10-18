import { ORG } from '../config';
import { FIREBASE } from '../firebase.config';

// Public form submission. When Firebase is configured (src/firebase.config.ts),
// submissions are written to Firestore through the REST API, where Firestore
// security rules allow create-only access for these collections. Otherwise
// the form opens a pre-filled email so nothing is ever lost.

export type FormKind = 'contact' | 'prayer' | 'partner' | 'donation' | 'volunteer' | 'k9-help';

const SUBJECT: Record<FormKind, string> = {
  contact: 'Website message',
  prayer: 'Prayer request',
  partner: 'Partnership inquiry',
  donation: 'Donation drop-off / pickup',
  volunteer: 'Volunteer application',
  'k9-help': 'K9 program: help for a veteran\'s dog',
};

function toFirestoreFields(data: Record<string, string>) {
  const fields: Record<string, { stringValue: string } | { timestampValue: string }> = {};
  for (const [k, v] of Object.entries(data)) fields[k] = { stringValue: v };
  fields.createdAt = { timestampValue: new Date().toISOString() };
  fields.status = { stringValue: 'new' };
  return { fields };
}

export async function submitForm(kind: FormKind, data: Record<string, string>): Promise<'saved' | 'email'> {
  if (FIREBASE.projectId && FIREBASE.apiKey) {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE.projectId}/databases/(default)/documents/submissions_${kind}?key=${FIREBASE.apiKey}`;
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(toFirestoreFields(data)) });
    if (res.ok) return 'saved';
  }
  const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
  location.href = `mailto:${ORG.contactEmail}?subject=${encodeURIComponent(`[Faith Forward] ${SUBJECT[kind]}`)}&body=${encodeURIComponent(body)}`;
  return 'email';
}

/** Wire every <form data-form="kind"> on the page. */
export function wireForms(): void {
  document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const kind = form.dataset.form as FormKind;
      const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
      if (data.website) return; // honeypot field: bots fill it, people never see it
      delete data.website;
      const btn = form.querySelector<HTMLButtonElement>('button[type=submit]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      try {
        const how = await submitForm(kind, data);
        form.innerHTML = `<div class="text-center py-8"><p class="text-5xl mb-4">🙏</p><p class="text-2xl font-serif font-bold text-faith-navy mb-2">Thank you. We received it.</p><p class="text-gray-600">${how === 'saved' ? 'A member of our team will follow up soon.' : 'Your email app opened with your message. Press send to finish.'} ${kind === 'prayer' ? 'Our team will pray for you by name.' : ''}</p></div>`;
      } catch {
        if (btn) { btn.disabled = false; btn.textContent = 'Try again'; }
        alert(`We could not send that. Please email ${ORG.contactEmail} or message us on Facebook.`);
      }
    });
  });
}
