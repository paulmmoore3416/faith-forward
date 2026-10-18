# Deployment (GitHub Pages)

The site deploys automatically with GitHub Actions (`.github/workflows/deploy.yml`):

- on every push to `master`
- manually (Actions → *Deploy to GitHub Pages* → *Run workflow*)
- daily at 11:15 UTC, so date-scheduled articles appear on the News page without a manual push

## One-time setup

1. GitHub → repository **Settings → Pages**.
2. **Build and deployment → Source: GitHub Actions**.
3. Push to `master` (or run the workflow manually). The first deploy takes 1-2 minutes.

**Live URL:** https://paulmmoore3416.github.io/faith-forward/

| Area | URL |
|---|---|
| Website | https://paulmmoore3416.github.io/faith-forward/ |
| K9 Handler Training Suite | https://paulmmoore3416.github.io/faith-forward/k9-suite.html |
| Command Center | https://paulmmoore3416.github.io/faith-forward/command-center.html |
| Daily Quotes (companion repo) | https://paulmmoore3416.github.io/faith-forward-daily-quotes/ |

## Custom domain

When you register a domain (for example `faithforwardstl.org`):

1. Add a `public/CNAME` file containing just the domain, e.g. `www.faithforwardstl.org`.
2. In the repository, **Settings → Secrets and variables → Actions → Variables**, add `BASE_PATH` = `/`.
3. At your domain registrar, add DNS records:
   - `www` → **CNAME** → `paulmmoore3416.github.io`
   - apex (`@`) → **A** records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. **Settings → Pages → Custom domain**: enter the domain, then tick **Enforce HTTPS** once the certificate is issued.
5. Update `SITE` in `scripts/content/build_articles.py` and `build_social.py`, the canonical URL in the page `<head>`s, and `ORG.quotesSite` if needed. Then rebuild the content.

## Docker (optional self-hosting)

The included `Dockerfile` builds the site and serves it with nginx:

```bash
docker compose up -d --build   # http://localhost:8080 (see docker-compose.yml)
```

For Docker or any root-served host, build with `BASE_PATH=/`.

## Rollback

Every deploy is tied to a commit. To roll back, revert the commit on `master` (`git revert <sha>` and push), or re-run an earlier successful workflow run from the Actions tab.
