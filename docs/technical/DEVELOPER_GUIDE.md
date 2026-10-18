# Developer Guide

## Prerequisites

- Node.js 22+ and npm
- Python 3.10+ (only to regenerate content)
- Git; the GitHub CLI (`gh`) is optional

## Run locally

```bash
git clone https://github.com/paulmmoore3416/faith-forward.git
cd faith-forward
npm install
npm run dev          # http://localhost:5173/faith-forward/
```

Build and preview the production bundle:

```bash
npm run build        # type-checks (tsc) then builds to dist/
npm run preview      # http://localhost:4173/faith-forward/
```

To build for a custom domain served at the root (`https://www.example.org/`):

```bash
BASE_PATH=/ npm run build
```

## Common edits

### Organization details

Edit `src/config.ts`. Names, founder titles, mission, contact email, Facebook URL, donation needs, and 501(c)(3) status flow to every page. When the IRS determination letter arrives, set `taxExemptConfirmed: true` and fill in `ein`.

### Events

Edit `src/data/events.ts`. Past events hide themselves automatically.

### Daily devotional

Edit `src/data/devotional.ts`. The pools rotate independently (currently 106 verses, 70 quotes, 71 prayers), so the daily combination does not repeat for years. Add feast days to `FIXED` (MM-DD) or compute moveable ones in `moveable()`.

### Veteran resources

Edit `src/data.ts`. Each entry has `name`, `description`, `category`, and optional `address`, `phone`, `link`, `priority`.

### K9 content

- Breeds: `src/k9/breeds.ts`. Add a new breed object; it appears in the profile selector and Breed Library automatically. Set `breedKey()` in `curriculum.ts` if it needs its own breed tips.
- Lessons: `src/k9/curriculum.ts`. Each lesson needs a unique `id`. Lesson progress is keyed by id, so don't rename ids after people start logging.
- Nutrition, vaccines, routines: `src/k9/care.ts`.

### Articles and social posts

```bash
python3 scripts/content/build_articles.py   # writes public/content/articles/
python3 scripts/content/build_social.py     # writes public/content/social/
```

Article text lives in `scripts/content/articles_q1..q4.py`; social topics live in `scripts/content/social_topics.py`. Change the start dates in the builders' `START` constants to shift a campaign.

### Adding a page

1. Create `my-page.html` at the repo root, using an existing page as a template (keep `<div id="site-header">` and `<div id="site-footer">`).
2. Point its script tag to `/src/pages/basic.ts`, or to a new page script that imports `../layout`.
3. Add it to `NAV` in `src/layout.ts` if it belongs in the menu.

Vite picks up every top-level `.html` file automatically.

## Conventions

- TypeScript `strict` mode. `npm run build` fails on type errors.
- Escape any user or data-derived text with `esc()` before inserting it into HTML.
- Use relative links between pages (`about.html`), so the site works under `/faith-forward/` and at a domain root.
- Keep brand colors in `src/input.css` `@theme`; don't hard-code hex values in markup.
- Never commit secrets. See [SECURITY.md](SECURITY.md).

## Testing checklist before pushing

- [ ] `npm run build` passes
- [ ] `npm run preview`: click through every nav link
- [ ] Submit a form (falls back to email if Firebase isn't configured)
- [ ] K9 suite: switch breeds, save a lesson, add a log, print a report
- [ ] Command center: unlock, add a task, open the Social Calendar for a campaign date
- [ ] Check a phone-width layout (375px) in browser dev tools
