# Security & Secrets

This repository and the GitHub Pages site are **public**. Anything committed here, or bundled into the site's JavaScript, can be read by anyone in the world, including automated bots that scan GitHub for credentials within minutes of a push.

## Rule 1: No secrets in the repository

Never commit:

- GitHub personal access tokens (`ghp_…`, `github_pat_…`)
- ElevenLabs, OpenAI, Anthropic, or similar API keys
- Google OAuth **client secrets** or service-account JSON files
- Passwords, `.env` files, bank or donor data
- Personal information such as a home address or personal phone number

`.gitignore` already excludes `.env*`, `foundation-office/`, and `*.private.*` files.

### What *is* safe to commit

| Item | Why it's safe |
|---|---|
| Firebase web config (`apiKey`, `projectId`, `authDomain`) | It's a public identifier shipped to every browser. Protection comes from `firestore.rules` and Authentication. |
| Google OAuth **Client ID** | Public by design; restricted to authorized JavaScript origins in Google Cloud. |
| Open-Meteo weather API calls | No key needed. |

## Rule 2: Private keys live on your device

The command center's **Settings** page stores the ElevenLabs key and Google Client ID in that browser's `localStorage` only. They are excluded from the command center's JSON export. On a shared or public computer, don't save keys; clear site data when finished.

> For keys that must never reach a browser (for example a server-to-server API key), use a Firebase Cloud Function or another server and store the key in its secret manager.

## Rule 3: Rotate anything that was exposed

If a key was ever pasted into a chat, email, document, issue, or commit, treat it as compromised:

1. **GitHub token**: GitHub → Settings → Developer settings → Personal access tokens → **Delete**. Use `gh auth login` (stored in your OS keyring) instead of pasting tokens.
2. **ElevenLabs key**: ElevenLabs → Profile → API Keys → revoke and create a new one.
3. **Google API keys**: Google Cloud Console → APIs & Services → Credentials → **Delete** or **Regenerate**. For any key you keep, add **API restrictions** (only the APIs it needs) and **application restrictions** (HTTP referrers = your site).
4. If a secret was committed, rotating it is mandatory. Deleting the file does not remove it from git history.

## Command center access

- **Local mode (default):** a passphrase (hashed with SHA-256, stored on the device) keeps casual visitors out. The page and its code are still public, and the data lives only on that device. It is a lock on a screen door, not a vault.
- **Firebase mode (recommended):** after Firebase is configured, the command center requires a Firebase Authentication sign-in, and Firestore rules only let accounts listed in the `staff` collection read submissions. See [FIREBASE.md](FIREBASE.md).
- The command center is marked `noindex, nofollow` so search engines don't list it.

## Privacy of veterans we serve

- Outreach logs use first names or street names only; never record Social Security numbers, medical details beyond what's needed, or exact camp locations.
- Never post photos, faces, tents, or identifiable dogs without a signed media release.
- Prayer requests are confidential to the prayer team.
- Use the CSV exports carefully: store them in the private foundation office, not in this repository.

## Reporting a vulnerability

Email the founder at the contact address on the website. Please don't open a public issue for security problems.
