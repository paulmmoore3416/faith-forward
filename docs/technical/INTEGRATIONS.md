# Integrations

| Service | What it does in Faith Forward | Credential type | Where it's stored |
|---|---|---|---|
| Open-Meteo | Live St. Louis weather plus cold/heat outreach protocol | None | n/a |
| Firebase | Form submissions and command-center sign-in | Public web config | `src/firebase.config.ts` |
| Google Gmail / Drive / Calendar | Unread mail, recent files, and upcoming events on the Daily Briefing | **OAuth Client ID** | Command center → Settings (on device) |
| ElevenLabs | Reads the daily scripture and prayer aloud | Secret API key | Command center → Settings (on device) |
| Blogger | Destination for the 52 weekly articles | Your Google login | n/a (copy/paste workflow) |
| Facebook / LinkedIn / TikTok / Instagram | Destinations for the 546-post social calendar | Your accounts | n/a (copy/paste or a scheduler) |

## Google (Gmail, Drive, Calendar)

**Why an API key isn't enough:** a Google API key (`AIza…`) identifies a project for public data. Reading *your* Gmail, Drive, or Calendar requires your consent through OAuth 2.0. The command center uses Google Identity Services in the browser with **read-only** scopes.

Setup (about 10 minutes):

1. Google Cloud Console → create or select a project → **APIs & Services → Library** → enable **Gmail API**, **Google Drive API**, **Google Calendar API**.
2. **OAuth consent screen** → External → app name *Faith Forward Command Center* → add your Gmail as a **test user** (while the app is in "Testing", only test users can sign in, which is what you want).
3. **Credentials → Create credentials → OAuth client ID** → *Web application*.
   - Authorized JavaScript origins: `https://paulmmoore3416.github.io` (plus `http://localhost:5173` for development, and your custom domain later).
4. Copy the **Client ID** (`…apps.googleusercontent.com`) into **Command Center → Settings**.
5. On the Daily Briefing, click **Connect Google**. Access tokens last about an hour and are kept in memory only.

**Google Keep:** the Keep API is only available to Google Workspace (business/enterprise) accounts through admin-approved access. It doesn't work with a personal Gmail account, so it isn't integrated. Use Google Drive or Calendar for notes and reminders instead.

**Old API keys:** delete any Google API keys that were shared in chat or email (see [SECURITY.md](SECURITY.md)). The integration above does not need them.

## ElevenLabs (read the prayer aloud)

1. ElevenLabs → Profile → **API Keys** → create a new key (revoke any key that was shared in chat).
2. Command Center → Settings → paste the key; optionally change the **voice ID** (default `21m00Tcm4TlvDq8ikWAM`).
3. Daily Briefing → **🔊 Read aloud**. Without a key, the browser's built-in voice is used instead.

Each read uses ElevenLabs characters from your plan (roughly 400-900 characters per day).

## Blogger

Each article in `public/content/articles/` has a header with `title`, `labels`, `search_description`, and `publish_date`. In the command center's **Blog Articles** view, use **Copy HTML**, then in Blogger: **New Post → HTML view → paste**, add the labels, paste the search description under *Search description*, and **Schedule** for the publish date. See the [Marketing guide](../user/MARKETING_GUIDE.md).

## Social scheduling tools

`public/content/social/posts.csv` (also downloadable from the command center) has one row per post with date, platform, text, hashtags, keywords, and visual direction. You can import it into Meta Business Suite (Facebook/Instagram), LinkedIn's native scheduler, TikTok's scheduler, or tools like Buffer, Later, or Hootsuite.
