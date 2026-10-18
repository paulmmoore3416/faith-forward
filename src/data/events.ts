// Public event calendar. Edit this list (or manage it from the command center
// and paste the export here) to update events.html.

export interface FFEvent { date: string; title: string; kind: string; where: string; detail: string; priority?: boolean }

export const EVENTS: FFEvent[] = [
  { date: '2026-11-01', title: 'Winter Survival Backpack Drive', kind: 'Donation Drive', where: 'Drop-off locations across St. Louis (contact us)', detail: 'Collecting backpacks, thermal socks, beanies, gloves, hand warmers, hygiene kits, and dog coats. Every pack is blessed before distribution to unhoused veterans.', priority: true },
  { date: '2026-11-11', title: 'Veterans Day Prayer Service & Outreach', kind: 'Prayer & Outreach', where: 'St. Louis (location announced on Facebook)', detail: 'On the Feast of St. Martin of Tours, the soldier-saint, we pray for every veteran and then take blessed backpacks to the street.' },
  { date: '2026-11-21', title: 'K9 Community Clinic', kind: 'K9 Program', where: 'St. Louis (location announced on Facebook)', detail: 'Free dog food, flea/tick prevention, basic training help, muzzle fitting, and a blessing for veterans and their dogs.' },
  { date: '2026-12-07', title: 'Pearl Harbor Remembrance Rosary', kind: 'Prayer', where: 'St. Louis', detail: 'A rosary for the fallen and for veterans still fighting today.' },
  { date: '2026-12-19', title: 'Christmas for Veterans: Supply Distribution', kind: 'Outreach', where: 'St. Louis', detail: 'Warm clothing, hygiene, food, gifts for veteran families, and toys and treats for their animals.' },
  { date: '2027-01-17', title: 'Point-in-Time Count Support', kind: 'Outreach', where: 'St. Louis City & County', detail: 'Volunteers support the annual count of people experiencing homelessness, with backpacks and dog supplies for every veteran contact.' },
];
