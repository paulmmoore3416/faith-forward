// Minimal Firebase REST client for the command center: email/password sign-in
// and reading website form submissions. No SDK needed. Activates only when
// src/firebase.config.ts is filled in.

import { FIREBASE } from '../firebase.config';

export const firebaseEnabled = () => Boolean(FIREBASE.projectId && FIREBASE.apiKey);

interface Session { idToken: string; email: string; expiresAt: number }
const KEY = 'ff-cc-fb-session';

export function session(): Session | null {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) ?? 'null') as Session | null;
    return s && s.expiresAt > Date.now() ? s : null;
  } catch { return null; }
}

export async function signIn(email: string, password: string): Promise<Session> {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE.apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message ?? 'Sign-in failed');
  const s: Session = { idToken: j.idToken, email: j.email, expiresAt: Date.now() + (+j.expiresIn - 60) * 1000 };
  try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
  return s;
}

export function signOut() { try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } }

export interface Submission { id: string; kind: string; createdAt: string; status: string; fields: Record<string, string> }

export async function listSubmissions(kind: string): Promise<Submission[]> {
  const s = session();
  if (!s) return [];
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE.projectId}/databases/(default)/documents/submissions_${kind}?pageSize=100`, {
    headers: { Authorization: `Bearer ${s.idToken}` },
  });
  if (!r.ok) return [];
  const j = await r.json();
  return (j.documents ?? []).map((d: { name: string; fields: Record<string, { stringValue?: string; timestampValue?: string }> }) => {
    const fields: Record<string, string> = {};
    for (const [k, v] of Object.entries(d.fields)) fields[k] = v.stringValue ?? v.timestampValue ?? '';
    return { id: d.name.split('/').pop()!, kind, createdAt: fields.createdAt, status: fields.status, fields };
  });
}
