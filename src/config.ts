// Single source of truth for organization details used across the site,
// the K9 suite and the command center. Change values here, not in pages.

export const ORG = {
  name: 'Faith Forward',
  legalName: 'Faith Forward Foundation',
  motto: 'Spiritus Invictus',
  mottoTranslation: 'The Unconquered Spirit',
  tagline: 'Faith-based outreach for displaced and homeless veterans, their families, and their animals.',
  mission:
    'Faith Forward Foundation provides assistance, resources, supplies, and religious faith-based services to displaced veterans, their families, and veterans in need in the St. Louis, Missouri area.',
  vision:
    'A St. Louis where no veteran sleeps unseen, unfed, or unprayed-for, and where every veteran and the animal that walks beside them has a path home.',
  region: 'St. Louis, Missouri',
  founder: {
    formal: 'The Reverend Paul Moore',
    short: 'Rev. Paul Moore',
    title: 'Creator & Founder',
    bio:
      'A disabled veteran of three combat tours in Iraq, ordained minister, and creator and founder of both Faith Forward Foundation and STL Veterans Hub (stlveteranshub.com).',
  },
  contactEmail: 'paulmmoore3416@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61581209302246',
  partnerSite: { name: 'STL Veterans Hub', url: 'https://www.stlveteranshub.com' },
  quotesSite: 'https://paulmmoore3416.github.io/faith-forward-daily-quotes/',
  crisis: { label: 'Veterans Crisis Line', phone: '988', press: 'Press 1', text: '838255' },
  // 501(c)(3) status is pending: keep false until the IRS determination letter arrives.
  taxExemptConfirmed: false,
  ein: '',
} as const;

export const DONATION_NEEDS = [
  { icon: '🎒', title: 'Backpacks & Packs', detail: 'New or lightly used. Sturdy, weather-resistant, with good zippers.' },
  { icon: '🧥', title: 'Clothing for Men & Women', detail: 'Coats, thermal layers, socks, underwear (new), gloves, hats, boots.' },
  { icon: '🧼', title: 'Hygiene Supplies', detail: 'For men and women: soap, deodorant, toothbrushes, razors, feminine products, wipes.' },
  { icon: '🥫', title: 'Non-Perishable Food', detail: 'Pop-top cans, protein bars, peanut butter, jerky, shelf-stable milk, bottled water.' },
  { icon: '🐾', title: 'Animal Supplies, Clothing & Toys', detail: 'Dog food, leashes, collars, harnesses, coats, bowls, durable toys, flea/tick prevention.' },
  { icon: '📿', title: 'Religious Reading & Prayer Items', detail: 'Bibles, devotionals, rosaries, and prayer items of every denomination.' },
] as const;
