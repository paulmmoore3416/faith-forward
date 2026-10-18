# Marketing & Content: User Guide

## What's ready

| Asset | Count | Dates | Where |
|---|---|---|---|
| Social posts: LinkedIn, TikTok, Instagram | 546 (182 days × 3) | Nov 1, 2026 – May 1, 2027 | Command Center → Social Calendar · `public/content/social/posts.csv` |
| Weekly Blogger articles | 52 | Nov 1, 2026 – Oct 24, 2027 (Sundays) | Command Center → Blog Articles · `public/content/articles/` · website News page |

Every post has **post-specific hashtags** (topic tags first, then a rotating set of platform and pillar tags), **SEO keywords**, and **visual direction**. TikTok posts are written as short video scripts (hook, scene, voiceover, on-screen text, sound, end card, caption).

Every article includes a KJV scripture, the main feature, **A Prayer for This Week**, a **Veteran Resource Spotlight**, a **K9 Corner**, **Take Action This Week**, an About section, crisis line information, keywords, and hashtags. Each has a Blogger-ready header (title, labels, search description).

## Daily posting routine (≈15 minutes)

1. Open the Command Center → **Daily Briefing** → *Today's Posts*, or go straight to **Social Calendar**.
2. For each platform, click **📋 Copy**, then paste into the app.
3. Follow the **Visual** suggestion (Gypse makes great content).
4. Click **Mark posted**.

Best times (Central): LinkedIn 7:30-8:30 AM weekdays · Instagram 11 AM-1 PM · TikTok 6-9 PM.

## Weekly article routine (≈10 minutes)

1. Command Center → **Blog Articles** → find this week's row (highlighted on its date).
2. **Copy HTML** → Blogger → **New Post** → switch to **HTML view** → paste.
3. Title: from the article. **Labels**: from the header's `labels`. **Search description**: from `search_description` (enable it once in Blogger Settings → Meta tags).
4. **Schedule** for the publish date, or publish.
5. Share the post link on Facebook.

The same article goes live on the website's News page automatically on its date.

## Tip: batch your work

Spend one hour on Sunday afternoon scheduling the week: the article in Blogger, LinkedIn posts in LinkedIn's scheduler, and Instagram/Facebook in Meta Business Suite. Import `posts.csv` into Buffer, Later, or Hootsuite to automate all three platforms.

## Consent and dignity (non-negotiable)

- No faces, names, tents, locations, or identifiable dogs of people we serve without a signed **Media Release** (in the foundation-office templates).
- Never use a veteran's story to shame or pity. Tell stories of dignity and hope.
- Always include crisis line information when posting about suicide or mental health.

## Regenerating or extending content

Developers can edit `scripts/content/social_topics.py` or the `articles_q*.py` files and run the build scripts (see the [Developer guide](../technical/DEVELOPER_GUIDE.md)). For the next six months, add new weeks to `social_topics.py` and change `START`.
