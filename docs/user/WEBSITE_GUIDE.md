# Website: User Guide

**Live site:** https://paulmmoore3416.github.io/faith-forward/

## Pages

| Page | Purpose |
|---|---|
| Home (`index.html`) | Crest and mission, **Daily Word** (scripture, prayer, quote), live St. Louis conditions, ministries, K9 feature, donation categories, founder, Facebook. |
| Our Story (`about.html`) | Founder biography (The Reverend Deacon Paul Moore), mission, vision, values, meaning of the crest, STL Veterans Hub. |
| Ministries (`ministries.html`) | Street outreach, spiritual care, K9, resource navigation, mental-health partnerships, family support. |
| K9 Program (`k9.html`) | Why dogs matter, Gypse, the training pathway, **request help for a veteran's dog** form. |
| K9 Training Suite (`k9-suite.html`) | The full training app (see [K9 Suite guide](K9_SUITE_GUIDE.md)). |
| Resources (`resources.html`) | Filterable St. Louis veteran resource directory with crisis numbers. |
| Recovery Manual (`recovery-manual.html`) | The *Warrior to Warrior* manual. |
| News (`news.html`) | Weekly articles, published automatically on their dates. |
| Prayer (`prayer.html`) | Prayer request form and today's devotional. |
| Donate (`donate.html`) | The six donation categories, blessing statement, drop-off/pickup form, guidelines. |
| Partners (`partners.html`) | Partner categories, referral process, partnership inquiry form. |
| Events (`events.html`) | Upcoming drives, clinics, and services. |
| Contact (`contact.html`) | Contact form, volunteer sign-up, crisis numbers. |
| Command Center (`command-center.html`) | Private admin (not in the menu). |

Every page shows the **Veterans Crisis Line** bar at the top.

## Updating content without coding knowledge

You can edit files directly on GitHub: open the file → pencil icon → edit → **Commit changes**. The site redeploys in about two minutes.

| To change… | Edit this file |
|---|---|
| Contact email, Facebook link, mission text, founder titles, donation list, tax status | `src/config.ts` |
| Events | `src/data/events.ts` |
| Veteran resources | `src/data.ts` |
| Page text | the page's `.html` file |
| Logo | replace `public/faithforwardlogo.png` (keep the same name) |

## Forms

Until Firebase is connected, forms open the visitor's email app with a pre-filled message to the contact email. After Firebase is connected, submissions save directly to the database and appear in the command center's Website Inbox.

## When the 501(c)(3) is approved

In `src/config.ts`, set `taxExemptConfirmed: true` and add the EIN. The footer and Donate page update automatically. Then add an online giving link (for example a Stripe, PayPal Giving Fund, or Givebutter page) to the Donate page.
