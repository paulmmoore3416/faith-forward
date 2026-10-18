#!/usr/bin/env python3
"""Render the 52 weekly articles to Markdown for the website and Blogger.

Outputs:
  public/content/articles/<slug>.md    (front matter + article, read by news.html)
  public/content/articles/index.json   (schedule used by news.html and the command center)

Usage: python3 scripts/content/build_articles.py
"""
import datetime as dt
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
from articles_q1 import ARTICLES as A1  # noqa: E402
from articles_q2 import ARTICLES as A2  # noqa: E402
from articles_q3 import ARTICLES as A3  # noqa: E402
from articles_q4 import ARTICLES as A4  # noqa: E402

ROOT = HERE.parent.parent
OUT = ROOT / 'public' / 'content' / 'articles'
START = dt.date(2026, 11, 1)  # Week 1 publishes Sunday, November 1, 2026 (All Saints' Day)
SITE = 'https://paulmmoore3416.github.io/faith-forward/'

FOOTER = """---

### About Faith Forward Foundation

**Faith Forward Foundation** provides assistance, resources, supplies, and religious faith-based services to displaced and homeless veterans, their families, and the animals who walk beside them in the St. Louis, Missouri area. Founded by **The Reverend Deacon Paul Moore**, a disabled three-tour Iraq veteran, ordained deacon, and creator and founder of [STL Veterans Hub](https://www.stlveteranshub.com). *Spiritus Invictus*: the unconquered spirit.

- 🌐 Website: [{site}]({site})
- 🎒 Donate supplies: [{site}donate.html]({site}donate.html)
- 🙏 Prayer requests: [{site}prayer.html]({site}prayer.html)
- 🐕 K9 Program: [{site}k9.html]({site}k9.html)
- 👍 Facebook: [Faith Forward on Facebook](https://www.facebook.com/profile.php?id=61581209302246)

> **Veteran in crisis?** Call **988 and press 1**, text **838255**, or chat at VeteransCrisisLine.net. Free, confidential, 24/7.
"""


def render(a: dict, date: dt.date) -> str:
    verse_text, verse_ref = a['verse']
    hashtags = ' '.join(f'#{t}' for t in a['labels'])
    long_date = date.strftime('%B %-d, %Y')
    front = '\n'.join([
        '---',
        f'title: "{a["title"]}"',
        f'publish_date: {date.isoformat()}',
        f'week: {a["week"]}',
        f'labels: {", ".join(a["labels"])}',
        f'search_description: "{a["desc"]}"',
        f'keywords: {", ".join(a["keywords"])}',
        f'permalink_slug: {a["slug"]}',
        '---',
    ])
    return f"""{front}

# {a['title']}

*By The Reverend Deacon Paul Moore, Founder, Faith Forward Foundation · {long_date} · Week {a['week']}*

> **"{verse_text}"**
> {verse_ref} (KJV)

{a['body'].strip()}

## 🙏 A Prayer for This Week

*{a['prayer']}*

## 🧭 Veteran Resource Spotlight

{a['resource']}

## 🐕 K9 Corner

{a['k9']}

## ✅ Take Action This Week

{a['action']}

{FOOTER.format(site=SITE)}
**Keywords:** {', '.join(a['keywords'])}

{hashtags} #FaithForward #SpiritusInvictus
"""


def excerpt(body: str) -> str:
    first = next(p for p in body.strip().split('\n\n') if p and not p.startswith('#'))
    first = first.replace('**', '').replace('*', '')
    return first if len(first) <= 220 else first[:217].rsplit(' ', 1)[0] + '…'


def main() -> None:
    articles = sorted(A1 + A2 + A3 + A4, key=lambda a: a['week'])
    assert [a['week'] for a in articles] == list(range(1, 53)), 'weeks must be 1..52'
    assert len({a['slug'] for a in articles}) == 52, 'slugs must be unique'
    OUT.mkdir(parents=True, exist_ok=True)
    index = []
    for a in articles:
        assert len(a['desc']) <= 160, f"meta description too long: week {a['week']} ({len(a['desc'])})"
        date = START + dt.timedelta(weeks=a['week'] - 1)
        (OUT / f"{a['slug']}.md").write_text(render(a, date))
        index.append({'week': a['week'], 'slug': a['slug'], 'title': a['title'], 'date': date.isoformat(),
                      'excerpt': excerpt(a['body']), 'tags': a['labels'], 'keywords': a['keywords'], 'description': a['desc']})
    (OUT / 'index.json').write_text(json.dumps(index, indent=1, ensure_ascii=False))
    words = sum(len(render(a, START).split()) for a in articles)
    print(f'{len(index)} articles written to {OUT} ({words:,} words, {index[0]["date"]} to {index[-1]["date"]})')


if __name__ == '__main__':
    main()
