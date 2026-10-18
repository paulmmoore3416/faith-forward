// Google Workspace integration for the command center using Google Identity
// Services (OAuth 2.0 token flow in the browser). Gmail, Drive and Calendar
// data are private, so they need an OAuth *Client ID*. A plain API key
// (AIza...) cannot read a user's mail or files. Setup: docs/technical/INTEGRATIONS.md

declare global {
  interface Window { google?: any }
}

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
].join(' ');

let token: string | null = null;

function loadGis(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Could not load Google Identity Services'));
    document.head.appendChild(s);
  });
}

export async function connectGoogle(clientId: string): Promise<void> {
  await loadGis();
  await new Promise<void>((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: (resp: { access_token?: string; error?: string }) => {
        if (resp.error || !resp.access_token) return reject(new Error(resp.error ?? 'No token'));
        token = resp.access_token;
        resolve();
      },
    });
    client.requestAccessToken();
  });
}

export const googleConnected = () => token !== null;

async function g<T>(url: string): Promise<T> {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`Google API ${r.status}`);
  return r.json() as Promise<T>;
}

export async function gmailUnread(): Promise<{ count: number; messages: { from: string; subject: string; id: string }[] }> {
  const list = await g<{ messages?: { id: string }[]; resultSizeEstimate: number }>(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread%20in:inbox&maxResults=8',
  );
  const messages = await Promise.all(
    (list.messages ?? []).map(async (m) => {
      const full = await g<{ payload: { headers: { name: string; value: string }[] } }>(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
      );
      const h = (n: string) => full.payload.headers.find((x) => x.name === n)?.value ?? '';
      return { id: m.id, from: h('From'), subject: h('Subject') };
    }),
  );
  return { count: list.resultSizeEstimate, messages };
}

export async function driveRecent(): Promise<{ name: string; webViewLink: string; modifiedTime: string }[]> {
  const r = await g<{ files: { name: string; webViewLink: string; modifiedTime: string }[] }>(
    'https://www.googleapis.com/drive/v3/files?orderBy=modifiedTime%20desc&pageSize=8&fields=files(name,webViewLink,modifiedTime)',
  );
  return r.files;
}

export async function calendarUpcoming(): Promise<{ summary: string; start: string; htmlLink: string }[]> {
  const now = new Date().toISOString();
  const r = await g<{ items: { summary: string; start: { dateTime?: string; date?: string }; htmlLink: string }[] }>(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=8&singleEvents=true&orderBy=startTime`,
  );
  return r.items.map((i) => ({ summary: i.summary, start: i.start.dateTime ?? i.start.date ?? '', htmlLink: i.htmlLink }));
}
