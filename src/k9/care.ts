// Nutrition, medical, exercise and routine data for the K9 suite.
// Calculations follow standard veterinary energy formulas; all plans are
// starting points to be confirmed by the dog's veterinarian.

import type { Breed } from './breeds';

// ───────────────────────── NUTRITION

export type Activity = 'rest' | 'pet' | 'active' | 'working' | 'heavy';
export const ACTIVITY: Record<Activity, { label: string; factor: number; desc: string }> = {
  rest: { label: 'Weight loss / crate rest', factor: 1.0, desc: 'Vet-directed weight loss or injury recovery' },
  pet: { label: 'Spayed/neutered adult, light activity', factor: 1.6, desc: 'Walks, light play' },
  active: { label: 'Active adult in training', factor: 2.0, desc: '1-2 hrs daily exercise and training' },
  working: { label: 'Working dog', factor: 3.0, desc: 'Daily detection, protection or patrol work' },
  heavy: { label: 'Heavy work / cold weather outdoors', factor: 4.0, desc: 'Long working days, living outdoors in winter' },
};

export const lbToKg = (lb: number) => lb / 2.2046;
/** Resting energy requirement (kcal/day) = 70 × kg^0.75 */
export const rer = (kg: number) => 70 * Math.pow(kg, 0.75);

export interface FeedingPlan {
  rer: number; mer: number; cupsPerDay: number; meals: number; perMealCups: number;
  proteinG: number; fatG: number; waterOz: number; treatKcal: number; notes: string[];
}

export function feedingPlan(weightLb: number, activity: Activity, kcalPerCup: number, breed: Breed, intact = false): FeedingPlan {
  const kg = lbToKg(weightLb);
  const r = rer(kg);
  let factor = ACTIVITY[activity].factor;
  if (intact && activity === 'pet') factor = 1.8;
  const mer = r * factor;
  const meals = breed.id === 'gsd' || breed.id === 'malinois' ? 3 : 2;
  const cups = mer / kcalPerCup;
  const proteinG = (mer * ((breed.nutrition.proteinPct[0] + breed.nutrition.proteinPct[1]) / 2 / 100)) / 4;
  const fatG = (mer * ((breed.nutrition.fatPct[0] + breed.nutrition.fatPct[1]) / 2 / 100)) / 9;
  return {
    rer: Math.round(r), mer: Math.round(mer), cupsPerDay: +cups.toFixed(2), meals, perMealCups: +(cups / meals).toFixed(2),
    proteinG: Math.round(proteinG), fatG: Math.round(fatG),
    waterOz: Math.round(weightLb * 1 * (activity === 'working' || activity === 'heavy' ? 1.5 : 1)),
    treatKcal: Math.round(mer * 0.1),
    notes: breed.nutrition.notes,
  };
}

export const BCS = [
  { score: 1, label: 'Emaciated', desc: 'Ribs, spine, hip bones visible from a distance. No body fat. Seek vet care.' },
  { score: 3, label: 'Thin', desc: 'Ribs easily felt and may be visible; obvious waist; hip bones prominent.' },
  { score: 4, label: 'Ideal (lean working)', desc: 'Ribs easily felt with slight fat cover; clear waist from above; abdominal tuck. Target for working dogs.' },
  { score: 5, label: 'Ideal', desc: 'Ribs felt without excess fat; waist visible behind ribs; tuck from the side.' },
  { score: 6, label: 'Overweight', desc: 'Ribs felt with slight excess fat; waist visible but not prominent.' },
  { score: 7, label: 'Heavy', desc: 'Ribs hard to feel; fat deposits over lower back and tail base; waist absent.' },
  { score: 9, label: 'Obese', desc: 'Massive fat deposits; distended abdomen. Joint and heart disease risk. Vet weight-loss plan.' },
];

export const TOXIC_FOODS = [
  'Xylitol (sugar-free gum, some peanut butters): life-threatening at tiny doses',
  'Chocolate, coffee, caffeine',
  'Grapes and raisins (kidney failure)',
  'Onions, garlic, chives, leeks (anemia)',
  'Macadamia nuts',
  'Alcohol, marijuana/THC edibles',
  'Cooked bones (splinter)',
  'Fatty scraps (pancreatitis)',
  'Moldy food from trash (tremorgenic mycotoxins)',
  'Human medications: ibuprofen, naproxen, acetaminophen, ADHD meds, antidepressants',
];

export const STREET_FEEDING_TIPS = [
  'A 30-lb bag of quality kibble feeds a 50-lb dog about a month. Faith Forward stocks bags at outreach events.',
  'Store kibble in a sealed bucket with a lid to stop moisture, ants and rodents.',
  'Canned food: pop-top cans need no opener. Use within 2 hours unrefrigerated.',
  'Collapsible silicone bowls and a 1-gallon water jug per day in summer.',
  'Avoid feeding fast-food scraps: high salt and fat cause pancreatitis.',
  'Weigh the dog monthly at Faith Forward events or pet stores with free scales.',
];

// ───────────────────────── MEDICAL

export const VACCINES = [
  { name: 'Rabies', type: 'Core (required by law)', schedule: 'Puppy at 12-16 weeks; booster at 1 year; then every 1 or 3 years per product and local law.' },
  { name: 'DAPP / DHPP (Distemper, Adenovirus, Parvovirus, Parainfluenza)', type: 'Core', schedule: 'Puppy series every 3-4 weeks from 6-8 weeks to 16+ weeks; booster at 1 year; then every 3 years.' },
  { name: 'Leptospirosis', type: 'Lifestyle (strongly recommended outdoors / Missouri)', schedule: '2-dose initial series 2-4 weeks apart; annually. Spread by wildlife urine and standing water. Essential for dogs living outdoors.' },
  { name: 'Bordetella (kennel cough)', type: 'Lifestyle', schedule: 'Annually (or every 6 months for shelter/boarding/group class dogs).' },
  { name: 'Canine Influenza (H3N2/H3N8)', type: 'Lifestyle', schedule: '2-dose series then annually; recommended for shelter, boarding and group settings.' },
  { name: 'Lyme disease', type: 'Lifestyle', schedule: 'For dogs in tick-heavy areas; 2-dose series then annual. Discuss with your vet.' },
];

export const PREVENTIVES = [
  { name: 'Heartworm prevention', note: 'Monthly, year-round in Missouri. Annual heartworm test. Mosquito exposure is constant for dogs living outdoors.' },
  { name: 'Flea & tick prevention', note: 'Monthly oral or topical, year-round. Ticks in Missouri carry ehrlichia, anaplasma and Rocky Mountain spotted fever.' },
  { name: 'Intestinal deworming', note: 'Fecal test at least annually (every 6 months for outdoor dogs). Most heartworm preventives cover common worms.' },
  { name: 'Dental care', note: 'Daily brushing ideal; dental chews; professional cleaning as needed.' },
  { name: 'Spay/neuter', note: 'Discuss timing for large breeds (orthopedic considerations). Many St. Louis clinics offer low-cost spay/neuter for those in need.' },
  { name: 'Microchip', note: 'Register to the handler and update the contact. Faith Forward can serve as the secondary contact for unhoused veterans.' },
];

export const FIRST_AID_KIT = [
  'Basket muzzle + gauze roll (improvised muzzle)', 'Slip lead', 'Digital rectal thermometer + lubricant',
  'Gauze pads, roll gauze, self-adhesive wrap (Vetwrap)', 'Hemostatic gauze', 'Saline eyewash', 'Chlorhexidine wound wash',
  'Tweezers & tick key', 'Blunt-tip scissors', 'Booties (paw injuries)', 'Emergency foil blanket', 'Instant cold pack',
  'Collapsible water bowl + water', 'Styptic powder (nails)', 'Vet records & emergency numbers card',
  'Hydrogen peroxide 3% ONLY under direct vet/poison-control instruction',
];

export const EMERGENCY_SIGNS = [
  { sign: 'Unproductive retching, swollen belly, restlessness', action: 'Possible BLOAT (GDV). Go to an emergency vet NOW. Fatal within hours.' },
  { sign: 'Heavy panting, thick saliva, collapse, temperature over 104°F', action: 'HEAT STROKE. Cool with room-temp water + fan, stop at 103°F, transport immediately.' },
  { sign: 'Pale/white or blue gums', action: 'Shock, internal bleeding or no oxygen. Emergency.' },
  { sign: 'Seizure over 3 minutes or clusters', action: 'Emergency. Keep the dog away from stairs/water; do not put hands in its mouth.' },
  { sign: 'Ate a toxin (xylitol, chocolate, rat poison, drugs)', action: 'Call ASPCA Animal Poison Control (888) 426-4435 or Pet Poison Helpline (855) 764-7661 (fees may apply), and go to the vet.' },
  { sign: 'Hit by a car or deep wound', action: 'Muzzle, control bleeding, keep warm, transport on a flat board.' },
  { sign: 'Straining to urinate with nothing coming out', action: 'Urinary obstruction. Emergency.' },
  { sign: 'Difficulty breathing', action: 'Emergency.' },
];

export const VITALS = { heartRate: '60-140 bpm (larger/fit dogs lower)', respiration: '10-35 breaths/min at rest', temperature: '101.0-102.5°F', gums: 'Pink and moist; capillary refill under 2 seconds' };

// St. Louis animal-welfare resources. Verify hours and services before referring.
export const STL_ANIMAL_RESOURCES = [
  { name: 'Humane Society of Missouri: Macklind Ave Headquarters', detail: 'Adoption, veterinary services, low-cost spay/neuter, Animal Cruelty Task Force.', where: '1201 Macklind Ave, St. Louis, MO 63110', url: 'https://www.hsmo.org' },
  { name: 'Stray Rescue of St. Louis', detail: 'Rescue and adoption; community pet support.', where: 'St. Louis, MO', url: 'https://www.strayrescue.org' },
  { name: 'APA Adoption Center', detail: 'Adoption and pet-assistance programs.', where: 'Ellisville, MO', url: 'https://www.apamo.org' },
  { name: 'Five Acres Animal Shelter', detail: 'No-kill shelter; community resources.', where: 'St. Charles, MO', url: 'https://www.fiveacresshelter.org' },
  { name: 'ASPCA Animal Poison Control', detail: '24/7 poison hotline (fee may apply).', where: '(888) 426-4435', url: 'https://www.aspca.org/pet-care/animal-poison-control' },
];

// ───────────────────────── EXERCISE

export interface ExerciseDay { day: string; focus: string; blocks: string[] }

export function exercisePlan(breed: Breed, ageYears: number): ExerciseDay[] {
  const young = ageYears < 1.5, senior = ageYears >= 8;
  const [lo, hi] = breed.exercise.dailyMinutes;
  const mins = senior ? Math.round(lo * 0.6) : young ? Math.round(lo * 0.75) : Math.round((lo + hi) / 2);
  const lowHeat = breed.exercise.heatTolerance === 'low';
  const sprint = young || senior || lowHeat ? 'Controlled fetch on grass (5 min, short throws)' : 'Flirt pole / sprint recalls (8-10 min, 30-sec rest between reps)';
  const strength = young ? 'Puppy confidence: wobble board, low cavaletti (5 min)' : senior ? 'Gentle hill walk + sit-to-stand x10 (8 min)' : 'Strength: hill sprints or stairs x6, sit-to-stands x10, tug x5 rounds (12 min)';
  const warm = 'Warm-up: 5-min brisk walk + 2 min dynamic stretching (spins left/right, play bows, cookie stretches)';
  const cool = 'Cool-down: 5-min slow walk, water, check paws and body';
  return [
    { day: 'Monday', focus: 'Endurance + Obedience', blocks: [warm, `Structured walk ${Math.round(mins * 0.5)} min (heel portions)`, 'Obedience session 10 min', cool] },
    { day: 'Tuesday', focus: 'Strength + Scent', blocks: [warm, strength, 'Scent games / nose work 10 min', cool] },
    { day: 'Wednesday', focus: 'Cardio + Engagement', blocks: [warm, sprint, `Sniff walk ${Math.round(mins * 0.4)} min (decompression)`, cool] },
    { day: 'Thursday', focus: 'Balance & Body Awareness', blocks: [warm, 'Cavaletti poles, paws-up on stable objects, backing up, pivots (10 min)', 'Public proofing outing 20 min', cool] },
    { day: 'Friday', focus: 'Specialty Training', blocks: [warm, 'Program phase work (service tasks / detection / tracking / protection with helper) 15-20 min', `Walk ${Math.round(mins * 0.3)} min`, cool] },
    { day: 'Saturday', focus: 'Adventure', blocks: [warm, `Hike, swim or long trail walk ${Math.round(mins * 0.8)} min`, 'Play with a known friendly dog (if dog-social)', cool] },
    { day: 'Sunday', focus: 'Sabbath Rest & Recovery', blocks: ['Easy sniff walk 20-30 min', 'Grooming & body check', 'Enrichment: lick mat, frozen Kong, chew', 'Bless your dog and give thanks for the week'] },
  ];
}

export const WEATHER_RULES = [
  'Above 85°F or heat index over 90: train only early morning or after dark; shorten sessions 50%; water every 10 min.',
  'Pavement test: back of your hand on asphalt for 5 seconds. Too hot for you = too hot for paws. Use booties or grass.',
  'Below 32°F: short-coated breeds (pit bulls, bullies, some Malinois) need a coat; check paws for ice balls and de-icer salt; wipe paws after walks.',
  'Below 20°F: limit outdoor time for short-coated dogs; provide insulated bedding (straw, not blankets, for outdoor shelters: blankets hold moisture).',
  'Thunderstorms: no outdoor training with lightning.',
];

// ───────────────────────── ROUTINES

export interface Routine { id: string; name: string; for: string; schedule: { time: string; task: string }[] }

export const ROUTINES: Routine[] = [
  {
    id: 'mwd', name: 'MWD Kennel Day (Working Standard)', for: 'Dogs in Advanced, Specialist or Protection phases',
    schedule: [
      { time: '0600', task: 'Kennel check: health inspection (eyes, ears, gums, paws, stool), relieve, water' },
      { time: '0615', task: 'Morning prayer & handler warm-up; dog warm-up walk 10 min' },
      { time: '0630', task: 'PT / conditioning per exercise plan (20-30 min)' },
      { time: '0715', task: 'Cool-down, water. Wait 60+ min before feeding' },
      { time: '0815', task: 'Breakfast (1/3 to 1/2 of daily ration; rest of ration used in training)' },
      { time: '0830', task: 'Rest / crate (digestion: no work for 2 hrs after meals for deep-chested breeds)' },
      { time: '1030', task: 'Training block 1: obedience + specialty (15-20 min), log session' },
      { time: '1100', task: 'Relieve; kennel rest; enrichment chew' },
      { time: '1300', task: 'Public proofing / outreach ride-along (30-60 min)' },
      { time: '1500', task: 'Training block 2: specialty (detection/tracking/protection with helper), log session' },
      { time: '1600', task: 'Grooming, body check, nail check; kennel cleaning' },
      { time: '1700', task: 'Dinner (remaining ration), slow feeder' },
      { time: '1900', task: 'Calm walk & relief; settle/place practice' },
      { time: '2100', task: 'Final relief, water, bed. Evening prayer: hand over the watch' },
    ],
  },
  {
    id: 'home', name: 'Home Handler Day (Foundation)', for: 'Dogs in Foundation Obedience living with the handler',
    schedule: [
      { time: '0630', task: 'Relieve; morning prayer with your dog at your side' },
      { time: '0645', task: 'Structured walk 30 min (loose-leash + heel practice)' },
      { time: '0730', task: 'Breakfast: hand-feed part of the meal during a 5-min training session' },
      { time: '0800', task: 'Crate/place rest' },
      { time: '1200', task: 'Relieve; 10-min training session; enrichment toy' },
      { time: '1700', task: 'Play session (tug with outs, flirt pole) 15 min' },
      { time: '1730', task: 'Dinner' },
      { time: '1900', task: '10-min training session + 20-min sniff walk' },
      { time: '2100', task: 'Relieve; settle; log the day in the suite' },
    ],
  },
  {
    id: 'street', name: 'Street-Ready Routine (Unhoused / Transitional Housing)', for: 'Veterans living outdoors, in vehicles, or in shelters',
    schedule: [
      { time: 'Wake', task: 'Water first. Check paws and body. Relieve away from sleeping area; pick up waste' },
      { time: 'Morning', task: 'Feed measured breakfast from a sealed container. 5-min training: sit, down, place on a mat, leave it' },
      { time: 'Mid-morning', task: 'Walk to resources together (meal sites, VA, Faith Forward events). Practice heel and waits at curbs' },
      { time: 'Midday', task: 'Shade and water. In heat: rest. In cold: coat on, out of wind, insulated mat' },
      { time: 'Afternoon', task: 'Muzzle wear practice 10 min (helps with shelters/transit). Crate or settle practice if available' },
      { time: 'Evening', task: 'Dinner. Calm sniff walk. Brush and check for ticks' },
      { time: 'Night', task: 'Secure leash/tie-out on a HARNESS (never a choke/prong). Dog sleeps on an insulated surface. Evening prayer' },
      { time: 'Weekly', task: 'Attend a Faith Forward K9 clinic: free food, prevention meds, training, and a blessing for you and your dog' },
    ],
  },
  {
    id: 'esa', name: 'Emotional Support / Psychiatric Service Day', for: 'Dogs in Phase 3',
    schedule: [
      { time: 'Wake', task: 'Dog performs "Wake" or "Lights" task if trained; relieve; water' },
      { time: 'Morning', task: 'Medication retrieve practice (S8) at the same time meds are due' },
      { time: 'Morning', task: 'Walk 30 min; 5 min DPT practice afterward' },
      { time: 'Midday', task: 'Public outing with tuck practice (S2), block/cover in lines' },
      { time: 'Afternoon', task: 'Rest; enrichment' },
      { time: 'Evening', task: 'Anxiety interrupt practice (S4) 5 min; play' },
      { time: 'Night', task: 'Nightmare interruption ready: dog sleeps in the room; log any night events' },
    ],
  },
];

export const DAILY_HEALTH_CHECK = ['Appetite normal', 'Water intake normal', 'Stool normal', 'Urine normal', 'Energy normal', 'Eyes clear', 'Ears clean/no odor', 'Gums pink', 'No limping', 'Skin/coat OK (no hot spots, ticks, lumps)', 'Paws/nails OK'];
