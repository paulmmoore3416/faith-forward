#!/usr/bin/env python3
"""Render 182 days x 3 platforms (LinkedIn, TikTok, Instagram) of social posts.

Output: public/content/social/posts.json (read by the command center's Social Calendar)
        public/content/social/posts.csv  (spreadsheet / scheduler import)

Each post gets topic-specific hashtags first, then a small, rotating set of
platform and pillar tags, so no two days carry the same hashtag block.

Usage: python3 scripts/content/build_social.py
"""
import csv
import datetime as dt
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
from social_topics import WEEKS  # noqa: E402

ROOT = HERE.parent.parent
OUT = ROOT / 'public' / 'content' / 'social'
START = dt.date(2026, 11, 1)
SITE = 'paulmmoore3416.github.io/faith-forward'

PILLAR_TAGS = {
    'mission':   ['VeteranOutreach', 'StLouisVeterans', 'HomelessVeterans', 'FaithBasedNonprofit', 'VeteransHelpingVeterans', 'StLouis', 'STL'],
    'k9':        ['VeteransAndDogs', 'DogTraining', 'ServiceDog', 'PitBull', 'K9', 'DogLovers', 'WorkingDogs'],
    'faith':     ['Faith', 'Prayer', 'Catholic', 'Christian', 'BibleVerse', 'DailyPrayer', 'Scripture'],
    'resource':  ['VeteranResources', 'VABenefits', 'VeteranSupport', 'StLouisResources', 'KnowYourBenefits', 'VeteranHealth'],
    'donate':    ['Donate', 'GiveBack', 'CharityDrive', 'HelpTheHomeless', 'DonationDrive', 'StLouisGives'],
    'volunteer': ['Volunteer', 'VolunteerStLouis', 'ServeOthers', 'CommunityService', 'MakeADifference'],
    'mental':    ['MentalHealthAwareness', 'PTSD', 'VeteranMentalHealth', 'SuicidePrevention', 'MentalHealthMatters'],
    'partner':   ['Partnership', 'CommunityPartners', 'NonprofitPartners', 'CollectiveImpact', 'StLouisCommunity'],
    'story':     ['VeteranStory', 'Hope', 'Redemption', 'StoriesOfHope', 'Testimony'],
}
PLATFORM_TAGS = {
    'linkedin':  ['Nonprofit', 'SocialImpact', 'Leadership', 'VeteranAffairs', 'CommunityImpact', 'NonprofitLeadership', 'FaithAtWork'],
    'tiktok':    ['VeteranTok', 'FaithTok', 'ChristianTok', 'MilitaryTok', 'DogTok', 'CatholicTok', 'PitBullTok'],
    'instagram': ['VeteransOfInstagram', 'DogsOfInstagram', 'FaithOverFear', 'StLouisLove', 'PitBullsOfInstagram', 'ChristianQuotes', 'MilitaryLife'],
}
TIKTOK_PILLAR_FIT = {'k9': ['DogTok', 'PitBullTok'], 'faith': ['FaithTok', 'ChristianTok', 'CatholicTok'], 'mental': ['VeteranTok', 'MentalHealthTok'],
                     'resource': ['VeteranTok', 'MilitaryTok'], 'donate': ['VeteranTok', 'CharityTok'], 'volunteer': ['VolunteerTok', 'VeteranTok'],
                     'mission': ['VeteranTok', 'MilitaryTok'], 'partner': ['NonprofitTok', 'VeteranTok'], 'story': ['VeteranTok', 'StoryTime']}

PILLAR_KEYWORDS = {
    'mission':   ['veteran outreach St. Louis', 'faith-based nonprofit', 'homeless veterans'],
    'k9':        ['veteran dog training', 'emotional support dog', 'service dog training'],
    'faith':     ['daily prayer', 'Bible verse', 'Christian faith'],
    'resource':  ['veteran resources St. Louis', 'VA benefits help', 'veteran support'],
    'donate':    ['donate to veterans', 'homeless donations St. Louis', 'charity drive'],
    'volunteer': ['volunteer St. Louis', 'veteran volunteer opportunities', 'street outreach'],
    'mental':    ['veteran mental health', 'PTSD support', 'suicide prevention'],
    'partner':   ['nonprofit partnership', 'mental health partners', 'community partners St. Louis'],
    'story':     ['veteran story', 'hope and redemption', 'faith testimony'],
}

LINKEDIN_CLOSERS = {
    'mission':   'Faith Forward is building a faith-based model of veteran outreach in St. Louis, and we are looking for partners who share it.',
    'k9':        'Pet barriers are one of the most overlooked causes of chronic veteran homelessness. Our K9 program tackles that gap directly.',
    'faith':     'Faith-based organizations bring something unique to veteran care: presence, meaning, and community that lasts after the appointment ends.',
    'resource':  'Navigation is half the battle. Warm handoffs, not phone numbers on a napkin, change outcomes.',
    'donate':    'In-kind giving is one of the fastest ways a company or congregation can make a measurable difference this month.',
    'volunteer': 'Corporate and church volunteer teams are welcome. We provide orientation and safety training.',
    'mental':    'Mental-health outcomes improve when clinical care, peer support, and community work together.',
    'partner':   'We sign simple MOUs with clear referral and consent steps. Let us talk about how we can work together.',
    'story':     'Stories change policy and philanthropy. This is why we tell them, always with consent.',
}

TIKTOK_SCENES = {
    'mission':   'B-roll: packing blessed backpacks, team praying in a circle, St. Louis skyline at dawn.',
    'k9':        'Handler with Gypse on a walk or demonstrating the topic; slow-motion close-ups on her face and paws.',
    'faith':     'Slow pan across a Bible or rosary on a backpack; candle flame; text appears line by line.',
    'resource':  'Talking head with on-screen bullet list; finger points to each item as it appears.',
    'donate':    'Fast-cut unboxing of donation items into a backpack, ending with the priest\'s blessing.',
    'volunteer': 'POV walking with the outreach team (no faces of people served), handing water to a dog.',
    'mental':    'Calm talking head, soft light, captions on; end with 988 on screen.',
    'partner':   'Split screen: Faith Forward volunteer + partner logo/building; handshake.',
    'story':     'Voiceover over symbolic footage: worn boots, a leash, keys to a door.',
}
TIKTOK_SOUNDS = ['soft piano', 'acoustic worship instrumental', 'trending inspirational audio', 'ambient strings', 'original voiceover only']

IG_VISUALS = {
    'mission':   'Carousel (3 slides): crest → mission statement → "Link in bio" call to action. Navy/gold brand colors.',
    'k9':        'Reel: 15-30 s training clip with captions; cover image of Gypse. Alt: 4-slide how-to carousel.',
    'faith':     'Single image: scripture in Cinzel font over a dark slate background with a gold cross.',
    'resource':  'Carousel: one resource per slide with phone number in large text; final slide "Save this".',
    'donate':    'Flat-lay photo of a packed blessed backpack with each item labeled.',
    'volunteer': 'Reel: volunteer team prep and prayer (consented faces only).',
    'mental':    'Calm text graphic with 988 Press 1 prominently; soft gradient background.',
    'partner':   'Graphic: "Partner With Us" with partner categories as icons.',
    'story':     'Black-and-white portrait-style image (consented) or symbolic object photo with quote overlay.',
}


def rotate(pool, n, seed):
    return [pool[(seed + i) % len(pool)] for i in range(n)]


def dedupe(tags):
    seen, out = set(), []
    for t in tags:
        k = t.lower()
        if k not in seen:
            seen.add(k)
            out.append(t)
    return out


def build():
    posts = []
    day = 0
    for week_no, (theme, week_tags, days) in enumerate(WEEKS, start=1):
        for pillar, title, hook, message, cta, topic_tags in days:
            day += 1
            date = START + dt.timedelta(days=day - 1)
            kw = dedupe([title.lower()] + PILLAR_KEYWORDS[pillar] + [theme.lower()])

            li_tags = dedupe(topic_tags + week_tags + rotate(PLATFORM_TAGS['linkedin'], 2, day) + rotate(PILLAR_TAGS[pillar], 1, day) + ['FaithForward'])
            li_body = f"{title}\n\n{hook}\n\n{message}\n\n{LINKEDIN_CLOSERS[pillar]}\n\n👉 {cta}\n\nFaith Forward Foundation · {SITE}"

            tt_tags = dedupe(topic_tags[:2] + week_tags + TIKTOK_PILLAR_FIT[pillar] + rotate(PILLAR_TAGS[pillar], 1, day + 3) + ['FaithForward', 'StLouis'])
            tt_body = (f"🎬 HOOK (0-2s, on screen): {hook}\n"
                       f"🎥 SCENE: {TIKTOK_SCENES[pillar]}\n"
                       f"🗣 VOICEOVER: {message}\n"
                       f"📝 ON-SCREEN TEXT: {title}\n"
                       f"🎵 SOUND: {TIKTOK_SOUNDS[day % len(TIKTOK_SOUNDS)]}\n"
                       f"👉 END CARD: {cta}\n\n"
                       f"CAPTION: {hook} {cta}")

            ig_tags = dedupe(topic_tags + week_tags + rotate(PILLAR_TAGS[pillar], 4, day) + rotate(PLATFORM_TAGS['instagram'], 3, day) + ['FaithForward', 'SpiritusInvictus', 'StLouisVeterans'])
            ig_body = f"{hook}\n\n{message}\n\n{cta} 🔗 Link in bio.\n\n✝️ Spiritus Invictus · Faith Forward Foundation"

            base = {'day': day, 'date': date.isoformat(), 'week': week_no, 'theme': theme, 'pillar': pillar, 'title': title, 'keywords': kw}
            posts.append({**base, 'platform': 'linkedin', 'body': li_body, 'hashtags': li_tags[:7]})
            posts.append({**base, 'platform': 'tiktok', 'body': tt_body, 'hashtags': tt_tags[:8], 'visual': 'Vertical 9:16 video, 20-45 seconds, captions on.'})
            posts.append({**base, 'platform': 'instagram', 'body': ig_body, 'hashtags': ig_tags[:15], 'visual': IG_VISUALS[pillar]})
    return posts


def main():
    posts = build()
    OUT.mkdir(parents=True, exist_ok=True)
    meta = {'campaign': 'Faith Forward 6-Month Launch Campaign', 'start': posts[0]['date'], 'end': posts[-1]['date'],
            'days': posts[-1]['day'], 'platforms': ['linkedin', 'tiktok', 'instagram'], 'posts': posts}
    (OUT / 'posts.json').write_text(json.dumps(meta, indent=1, ensure_ascii=False))
    with open(OUT / 'posts.csv', 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['date', 'day', 'week', 'theme', 'platform', 'title', 'post_text', 'hashtags', 'seo_keywords', 'visual_direction'])
        for p in posts:
            w.writerow([p['date'], p['day'], p['week'], p['theme'], p['platform'], p['title'], p['body'],
                        ' '.join('#' + h for h in p['hashtags']), ', '.join(p['keywords']), p.get('visual', '')])
    print(f"{len(posts)} posts over {meta['days']} days ({meta['start']} to {meta['end']}) written to {OUT}")


if __name__ == '__main__':
    main()
