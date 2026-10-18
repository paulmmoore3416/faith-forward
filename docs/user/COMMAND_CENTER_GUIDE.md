# Command Center: User Guide

**Open it:** https://paulmmoore3416.github.io/faith-forward/command-center.html

The command center is the founder's private operations dashboard. It isn't linked from the public menu and is hidden from search engines.

## First launch

- **Local mode** (before Firebase is set up): create a passphrase of 10+ characters. It is stored as a hash on this device. Each new device or browser needs its own passphrase, and data does not sync between devices. Use **Settings → Export** to move data.
- **Firebase mode** (after [Firebase setup](../technical/FIREBASE.md)): sign in with your Firebase email and password.

Click **Lock** (bottom of the sidebar) when you step away.

## Views

### ✝️ Daily Briefing
Opens every day with:
- **Today's scripture, quote, and prayer**, a new combination each day, with feast days and holidays (Veterans Day, St. Michael, St. Francis, Easter, Memorial Day, and more)
- **🔊 Read aloud** (ElevenLabs voice if configured, otherwise the device voice) and **Mark as prayed**
- Counters: open tasks, follow-ups due, donated items on hand, volunteers/partners, K9 sessions in the last 30 days
- **Today's posts** from the social calendar
- **Priority tasks**, with a checkbox to complete them
- **Outreach conditions**: live St. Louis weather with the cold or heat protocol
- **Gmail / Drive / Calendar** panels after Google is connected

### 📋 Operations
A three-column task board (To Do / In Progress / Done) by area: Legal, Governance, Finance, Ministry, Outreach, K9, Marketing, Partnerships, Technology, Security. Preloaded with your foundation start-up tasks.

### 🎒 Donations
Record items **received** and **distributed** in the six donation categories. Received batches have a **Blessed** checkbox: tick it after the priest's blessing, before distribution. Totals by category; CSV export.

### 🧭 Outreach Log
Every veteran contact: date, first/street name, location, needs, animal, follow-up date, open/closed. Follow-ups that are due show in red and on the Daily Briefing.

### 🤝 Volunteers & Partners
A simple CRM for partners (mental-health providers, outreach/housing programs, parishes, vets, businesses, veteran organizations) and volunteers, with status from *Prospect* to *MOU signed* to *Active*.

### 📣 Social Calendar
The **546-post, 6-month** campaign (Nov 1, 2026 – May 1, 2027) for **LinkedIn, TikTok, and Instagram**. Pick a date to see that day's three posts with text, post-specific hashtags, SEO keywords, and visual direction. **Copy** posts, **Mark posted**, and **Export full calendar (CSV)**.

### 📰 Blog Articles
All **52 weekly articles** (Nov 1, 2026 – Oct 24, 2027) with publish dates, **Copy HTML** for Blogger, **Copy text**, and **Preview**. Articles also appear automatically on the website's News page on their publish dates.

### 📥 Website Inbox
Form submissions from the website (requires Firebase). Without Firebase, submissions arrive by email.

### 🐕 K9 Program
Live summary from the K9 suite on this device.

### 📅 Events
The public events list (edit `src/data/events.ts` to change it).

### 📚 Documents
Links to technical and user docs and quick links (Facebook, STL Veterans Hub, GitHub, Blogger, Gmail, Drive, Calendar, Missouri SOS, IRS, Pay.gov).

### ⚙️ Settings
On-device keys (ElevenLabs, Google Client ID), Blogger URL, passphrase change, backup and restore. Keys are **never** exported or committed.

## Good habits

- Export a backup weekly (Settings → Export) and store it in your private foundation-office folder or Google Drive.
- Log outreach contacts the same day.
- Clear red items on the Briefing before planning new work.
