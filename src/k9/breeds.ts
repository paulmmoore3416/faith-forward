// Breed library for the Faith Forward K9 Handler Training Suite.
// Selecting a breed pre-populates nutrition targets, exercise plans, medical
// screening, training adjustments and discipline suitability across the suite.
//
// Figures are typical ranges from breed standards (UKC/AKC/ABKC) and general
// veterinary literature. Individual dogs vary; a veterinarian sets the final plan.

export type Discipline = 'companion' | 'esa' | 'psd' | 'obedience' | 'detection' | 'tracking' | 'protection';
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Breed {
  id: string;
  group: 'Pit Bull Family' | 'German Shepherd' | 'Belgian Malinois' | 'Labrador Retriever';
  name: string;
  aka?: string;
  summary: string;
  heightIn: { female: [number, number]; male: [number, number] };
  weightLb: { female: [number, number]; male: [number, number] };
  lifespanYrs: [number, number];
  coat: string;
  colors: string;
  temperament: string[];
  drives: { food: Rating; prey: Rating; play: Rating; defense: Rating; fight: Rating; hunt: Rating; handlerSoftness: Rating };
  suitability: Record<Discipline, { rating: Rating; note: string }>;
  health: { condition: string; note: string; screening?: string }[];
  nutrition: { activityFactor: number; proteinPct: [number, number]; fatPct: [number, number]; notes: string[] };
  exercise: { dailyMinutes: [number, number]; heatTolerance: 'low' | 'moderate' | 'good'; coldTolerance: 'low' | 'moderate' | 'good'; notes: string[] };
  grooming: string;
  trainingNotes: string[];
  legal: string[];
}

const PIT_LEGAL = [
  'Breed-specific legislation (BSL): Missouri has moved to limit municipal breed bans (Kansas City repealed its ban in 2023, and the state legislature took up statewide limits after that). Confirm the current law and any local ordinance before moving or housing a veteran with the dog. HOA rules, landlords and insurers can still restrict "pit bull type" dogs either way.',
  'Many homeowner/renter insurers exclude pit bull types. Shelters and transitional housing may refuse them. Faith Forward caseworkers should confirm pet policy before every housing referral.',
  'Missouri dog-bite liability (RSMo 273.036) is strict liability for owners. Protection-trained dogs raise exposure. Document all training and keep the dog under control at all times.',
  'Outside the U.S., several countries restrict APBT, American Bully XL and related types (e.g., UK Dangerous Dogs Act). Check before any travel.',
];

const PIT_HEALTH_COMMON = [
  { condition: 'Hip & elbow dysplasia', note: 'Moderate risk. Keep lean; avoid forced jumping before 18 months.', screening: 'OFA hips/elbows at 24 months' },
  { condition: 'Skin allergies (atopy) & food sensitivities', note: 'Very common in bully breeds: itching, paw licking, hot spots, ear infections. Omega-3s and a consistent single-protein diet help.', screening: 'Vet dermatology work-up if chronic' },
  { condition: 'Hypothyroidism', note: 'Weight gain, lethargy, coat loss.', screening: 'Annual T4 panel after age 4' },
  { condition: 'Cruciate ligament (CCL) tears', note: 'Powerful, explosive dogs; common in overweight or poorly conditioned pits. Warm up before sprint/bite work.', screening: 'Orthopedic exam if lameness' },
  { condition: 'Heart disease (subaortic stenosis)', note: 'Murmur on exam is a red flag before strenuous work.', screening: 'Cardiac auscultation; echo if murmur' },
  { condition: 'Mast cell tumors & skin masses', note: 'Bully breeds are over-represented. Have any new lump aspirated.', screening: 'Monthly lump check during grooming' },
];

const BLUE_NOTE = {
  condition: 'Color dilution alopecia (blue / "blue nose" dogs)',
  note: 'The dilute gene behind the blue coat is linked to thinning coat, flaky skin and recurring skin infection. Use gentle shampoo, omega-3s, sun protection on thin-coated areas, and watch for bacterial folliculitis.',
  screening: 'Skin and coat check at every vet visit',
};

export const BREEDS: Breed[] = [
  {
    id: 'pitbull-apbt',
    group: 'Pit Bull Family',
    name: 'American Pit Bull Terrier',
    aka: 'APBT, "pit bull", blue nose / red nose pit',
    summary:
      'A medium, athletic terrier bred for tenacity and an intense bond with people. Eager, people-focused and resilient. Excellent emotional-support and psychiatric-service candidates. Blue nose and red nose are color varieties of this breed, not separate breeds.',
    heightIn: { female: [17, 20], male: [18, 21] },
    weightLb: { female: [30, 50], male: [35, 60] },
    lifespanYrs: [12, 14],
    coat: 'Short, single, stiff; minimal grooming.',
    colors: 'Any color except merle. Blue (dilute black) with grey/blue nose; red/copper with red nose; brindle, fawn, black, white and pied.',
    temperament: ['Highly people-oriented', 'Tenacious and persistent', 'Confident', 'Playful, clownish', 'Sensitive to handler emotion', 'May show dog-selectivity or dog aggression in adulthood'],
    drives: { food: 4, prey: 4, play: 5, defense: 2, fight: 4, hunt: 3, handlerSoftness: 3 },
    suitability: {
      companion: { rating: 5, note: 'Devoted, affectionate and loyal.' },
      esa: { rating: 5, note: 'Strong human bond and tactile affection make APBTs natural emotional-support dogs.' },
      psd: { rating: 4, note: 'Excellent for deep-pressure therapy, interruption and grounding tasks. Must pass public-access temperament; some public places will still react to the breed.' },
      obedience: { rating: 4, note: 'Very trainable with food and toy rewards; responds poorly to heavy compulsion.' },
      detection: { rating: 3, note: 'Good nose and hunt drive; some are excellent scent-work dogs.' },
      tracking: { rating: 3, note: 'Capable; often prefers fast work over methodical tracking.' },
      protection: {
        rating: 2,
        note: 'Most APBTs are bred for LOW human aggression and see bite work as a game. They can learn grip, out and bark-and-hold on equipment, but genuine civil defense is uncommon and the legal exposure is high. Use them for visible deterrence and handler protection, not apprehension work. Full apprehension (offensive) training only after professional temperament evaluation.',
      },
    },
    health: [...PIT_HEALTH_COMMON, BLUE_NOTE, { condition: 'Cerebellar ataxia (NCL-A)', note: 'Inherited neurological disease in AmStaff/APBT lines: wobbling and incoordination by ages 3-5.', screening: 'DNA test (NCL-A) for breeding stock' }],
    nutrition: {
      activityFactor: 1.8,
      proteinPct: [26, 32],
      fatPct: [14, 18],
      notes: [
        'Pits gain weight easily. Aim for body condition score 4-5/9: waist visible from above, ribs felt but not seen.',
        'If skin allergies, try a limited-ingredient diet with one novel protein (salmon, lamb or turkey) for 8-12 weeks.',
        'Fish oil (EPA+DHA) for skin and joints. A vet sets the dose by weight.',
        'Split into 2 meals. Never feed within 60 minutes before hard exercise or bite work.',
      ],
    },
    exercise: {
      dailyMinutes: [60, 90],
      heatTolerance: 'moderate',
      coldTolerance: 'low',
      notes: [
        'Short single coat: needs a coat below 40°F and shade/water above 80°F. Pavement over 125°F burns paws (5-second hand test).',
        'They love tug, flirt pole, spring pole and weight pull. Build strength progressively; no spring pole before 12 months.',
        'Mental work (scent games, puzzle feeders) prevents destructive boredom.',
      ],
    },
    grooming: 'Weekly rubber-curry brush; bathe monthly with gentle oatmeal shampoo (more often for blue dogs with skin issues only per vet); nails every 2-3 weeks; check ears weekly.',
    trainingNotes: [
      'Reward-driven. Use marker training (YES/GOOD) with food and tug.',
      'Teach a rock-solid "out" (release) and "leave it" before ANY tug or bite-related play.',
      'Socialize neutrally with dogs: calm parallel walks, not dog-park free-for-alls. Many pits become dog-selective at 18-36 months.',
      'Their pain tolerance is high, so watch for subtle injury signs after training.',
      'Grit and stubbornness are not defiance. Shorten sessions, raise rewards and end on success.',
    ],
    legal: PIT_LEGAL,
  },
  {
    id: 'pitbull-amstaff',
    group: 'Pit Bull Family',
    name: 'American Staffordshire Terrier',
    aka: 'AmStaff',
    summary:
      'AKC-registered cousin of the APBT. Slightly heavier and more uniform, with the same people-loving temperament. Calm in the house, athletic outside.',
    heightIn: { female: [17, 18], male: [18, 19] },
    weightLb: { female: [40, 55], male: [55, 70] },
    lifespanYrs: [12, 16],
    coat: 'Short, close, stiff and glossy.',
    colors: 'Any solid, parti or patched color; blue, brindle, fawn, black, red common. Not more than 80% white preferred.',
    temperament: ['Courageous', 'Good-natured', 'Loyal', 'Keenly aware of surroundings', 'Can be dog-selective'],
    drives: { food: 4, prey: 4, play: 4, defense: 2, fight: 4, hunt: 3, handlerSoftness: 3 },
    suitability: {
      companion: { rating: 5, note: 'Stable, affectionate family dog.' },
      esa: { rating: 5, note: 'Very well suited.' },
      psd: { rating: 4, note: 'Sturdy and steady for DPT, bracing (with vet clearance) and interruption tasks.' },
      obedience: { rating: 4, note: 'Competes successfully in AKC obedience and rally.' },
      detection: { rating: 3, note: 'Good for scent-work sport.' },
      tracking: { rating: 3, note: 'Capable.' },
      protection: { rating: 2, note: 'Same limits as the APBT: deterrence and handler protection, with apprehension only after professional evaluation.' },
    },
    health: [...PIT_HEALTH_COMMON, BLUE_NOTE, { condition: 'Cerebellar ataxia (NCL-A)', note: 'Recognized AmStaff inherited disease.', screening: 'DNA test' }],
    nutrition: { activityFactor: 1.7, proteinPct: [26, 30], fatPct: [14, 18], notes: ['Heavier bone than APBT; joint support (omega-3s) from age 2.', 'Same allergy and weight guidance as APBT.'] },
    exercise: { dailyMinutes: [60, 90], heatTolerance: 'moderate', coldTolerance: 'low', notes: ['Two structured walks plus one play/training session daily.', 'Coat in cold weather; avoid midday heat.'] },
    grooming: 'Weekly brushing, monthly bath, nails every 2-3 weeks.',
    trainingNotes: ['Same marker-based approach as APBT.', 'Responds very well to structure (place, crate, thresholds).'],
    legal: PIT_LEGAL,
  },
  {
    id: 'pitbull-sbt',
    group: 'Pit Bull Family',
    name: 'Staffordshire Bull Terrier',
    aka: 'Staffy, SBT',
    summary:
      'Smallest of the pit bull family: compact, muscular and famously affectionate with people ("nanny dog" reputation in the UK). Ideal size for veterans in small apartments or vehicles.',
    heightIn: { female: [14, 15], male: [14, 16] },
    weightLb: { female: [24, 34], male: [28, 38] },
    lifespanYrs: [12, 14],
    coat: 'Short, smooth, close.',
    colors: 'Red, fawn, white, black, blue, brindle; any of these with white.',
    temperament: ['Extremely affectionate', 'Bold', 'Playful', 'Reliable with people', 'Can be dog-reactive'],
    drives: { food: 4, prey: 4, play: 5, defense: 2, fight: 4, hunt: 3, handlerSoftness: 3 },
    suitability: {
      companion: { rating: 5, note: 'Portable, affectionate.' },
      esa: { rating: 5, note: 'Outstanding emotional-support size and temperament.' },
      psd: { rating: 4, note: 'Excellent for lap DPT, interruption, alerting. Too small for mobility/bracing.' },
      obedience: { rating: 4, note: 'Bright and willing.' },
      detection: { rating: 3, note: 'Good scent-work sport dog.' },
      tracking: { rating: 2, note: 'Possible but not typical.' },
      protection: { rating: 1, note: 'Too small and too friendly for real protection work. Train alert barking only.' },
    },
    health: [
      { condition: 'L-2-hydroxyglutaric aciduria (L-2-HGA)', note: 'Inherited metabolic/neurologic disease.', screening: 'DNA test' },
      { condition: 'Hereditary cataracts (HSF4)', note: 'Can cause early blindness.', screening: 'DNA test + annual eye exam' },
      { condition: 'Skin allergies', note: 'Common.', screening: 'As needed' },
      { condition: 'Hip dysplasia & luxating patella', note: 'Keep lean.', screening: 'OFA' },
      BLUE_NOTE,
    ],
    nutrition: { activityFactor: 1.7, proteinPct: [26, 30], fatPct: [14, 18], notes: ['Small but dense; weigh food, do not scoop by eye.', 'Prone to obesity on free feeding.'] },
    exercise: { dailyMinutes: [45, 75], heatTolerance: 'moderate', coldTolerance: 'low', notes: ['Short muzzle compared with APBT: rest more often in heat.'] },
    grooming: 'Minimal: weekly brush, nails, ears.',
    trainingNotes: ['Very food-motivated; keep treats tiny.', 'Teach calm greetings early; Staffies jump with joy.'],
    legal: PIT_LEGAL,
  },
  {
    id: 'pitbull-bully',
    group: 'Pit Bull Family',
    name: 'American Bully',
    aka: 'Pocket, Standard, Classic, XL (ABKC/UKC)',
    summary:
      'A companion breed developed from APBT/AmStaff lines with heavier bone and a broad head. Usually calmer and lower-drive than the APBT. Size varies widely from Pocket (under 17") to XL (up to 23").',
    heightIn: { female: [13, 22], male: [14, 23] },
    weightLb: { female: [40, 100], male: [50, 120] },
    lifespanYrs: [10, 12],
    coat: 'Short, smooth, glossy.',
    colors: 'All colors; blue and tri-color are popular.',
    temperament: ['Laid-back', 'Gentle with family', 'Confident', 'Lower energy than APBT', 'Can be dog-selective'],
    drives: { food: 4, prey: 2, play: 3, defense: 2, fight: 3, hunt: 2, handlerSoftness: 3 },
    suitability: {
      companion: { rating: 5, note: 'Bred specifically as a companion.' },
      esa: { rating: 5, note: 'Calm, heavy and comforting. Excellent for DPT.' },
      psd: { rating: 3, note: 'Good for DPT and interruption; limited stamina for long public outings in heat.' },
      obedience: { rating: 3, note: 'Trainable; lower drive means slower, food-heavy sessions.' },
      detection: { rating: 2, note: 'Not typically suited.' },
      tracking: { rating: 2, note: 'Not typically suited.' },
      protection: { rating: 1, note: 'Usually low drive and heat-limited. Imposing look gives visible deterrence; do not pursue bite work in exaggerated or heavy types.' },
    },
    health: [
      { condition: 'Brachycephalic airway (heavy/short-muzzle types)', note: 'Heat stroke risk; noisy breathing; exercise intolerance.', screening: 'Airway exam' },
      { condition: 'Hip/elbow dysplasia & CCL tears', note: 'Heavy bone + excess weight = joint strain.', screening: 'OFA' },
      { condition: 'Cherry eye / entropion', note: 'Common eyelid problems.', screening: 'Eye exam' },
      { condition: 'Skin fold dermatitis & allergies', note: 'Clean folds weekly.', screening: 'As needed' },
      BLUE_NOTE,
    ],
    nutrition: { activityFactor: 1.5, proteinPct: [24, 28], fatPct: [12, 16], notes: ['Lowest activity factor of the family: obesity is the #1 health threat.', 'Joint support from early adulthood.'] },
    exercise: { dailyMinutes: [40, 60], heatTolerance: 'low', coldTolerance: 'low', notes: ['Walks and swimming over sprinting. Stop exercise above 80°F.', 'No forced running beside bikes.'] },
    grooming: 'Weekly brush; clean facial folds; nails.',
    trainingNotes: ['Short sessions (5-10 min); high-value food.', 'Prioritize leash manners. These dogs are strong and heavy.'],
    legal: [...PIT_LEGAL, 'The XL Bully type is banned or restricted in the UK and some other jurisdictions.'],
  },
  {
    id: 'gsd',
    group: 'German Shepherd',
    name: 'German Shepherd Dog',
    aka: 'GSD, Alsatian; working (West German/DDR/Czech) and show lines',
    summary:
      'The original all-purpose working dog: police, military, search and rescue, guide and service work. Intelligent, loyal and naturally protective of handler and territory. Working lines have higher drive and harder nerves than show/American lines.',
    heightIn: { female: [22, 24], male: [24, 26] },
    weightLb: { female: [50, 70], male: [65, 90] },
    lifespanYrs: [9, 13],
    coat: 'Double coat, medium (or long-stock). Heavy seasonal shedding.',
    colors: 'Black and tan/red, sable, bi-color, solid black; white and blue are faults in the standard.',
    temperament: ['Confident', 'Courageous', 'Loyal', 'Aloof with strangers', 'Naturally protective', 'Highly trainable'],
    drives: { food: 3, prey: 4, play: 4, defense: 4, fight: 4, hunt: 4, handlerSoftness: 3 },
    suitability: {
      companion: { rating: 4, note: 'Needs a job and structure.' },
      esa: { rating: 4, note: 'Deeply bonded and intuitive; may be protective in crowds.' },
      psd: { rating: 4, note: 'Excellent task dog. Must be socialized to remain neutral in public.' },
      obedience: { rating: 5, note: 'Classic obedience champion.' },
      detection: { rating: 4, note: 'Proven narcotics/explosives/SAR dog (handler certification required for real odors).' },
      tracking: { rating: 5, note: 'Superb, methodical tracker.' },
      protection: { rating: 5, note: 'Natural civil defense and fight drive. Benchmark for IGP and police work. Requires strong obedience and control first.' },
    },
    health: [
      { condition: 'Hip & elbow dysplasia', note: 'High risk. Keep lean; build up exercise gradually.', screening: 'OFA/PennHIP at 24 months' },
      { condition: 'Gastric dilatation-volvulus (bloat/GDV)', note: 'LIFE-THREATENING. Retching without producing anything, swollen belly, restlessness: go to an emergency vet immediately. Consider preventive gastropexy.', screening: 'Discuss prophylactic gastropexy at spay/neuter' },
      { condition: 'Degenerative myelopathy (DM)', note: 'Progressive hind-limb weakness in older dogs.', screening: 'DNA test (SOD1)' },
      { condition: 'Exocrine pancreatic insufficiency (EPI)', note: 'Weight loss despite appetite, greasy stool.', screening: 'TLI blood test' },
      { condition: 'Pannus & perianal fistula', note: 'Immune-mediated; worse with UV exposure.', screening: 'Eye exam' },
      { condition: 'Panosteitis', note: 'Shifting-leg lameness in growing dogs (5-18 months).', screening: 'Vet exam' },
    ],
    nutrition: { activityFactor: 2.0, proteinPct: [26, 32], fatPct: [15, 20], notes: ['Large-breed puppy food until 12-18 months (controlled calcium).', 'BLOAT PREVENTION: 2-3 smaller meals, no exercise 1 hour before or 2 hours after meals, slow-feeder bowl, calm feeding.', 'Sensitive stomachs common; change food gradually over 7-10 days.'] },
    exercise: { dailyMinutes: [90, 120], heatTolerance: 'moderate', coldTolerance: 'good', notes: ['Trotting endurance breed: structured walks, hikes, tracking.', 'No forced repetitive jumping or long runs on pavement before 18 months.'] },
    grooming: 'Brush 2-3x weekly, daily during coat blow; bathe sparingly; nails, ears, teeth.',
    trainingNotes: ['Balanced motivation: food for precision, tug for drive.', 'Early, structured socialization is critical so protectiveness does not become fear aggression.', 'Thrives on clear leadership and consistency. Inconsistent handling creates anxiety.'],
    legal: ['Some insurers list GSDs as restricted.', 'Missouri strict liability (RSMo 273.036) applies to all bites.'],
  },
  {
    id: 'malinois',
    group: 'Belgian Malinois',
    name: 'Belgian Malinois',
    aka: 'Mal, "maligator"',
    summary:
      'The premier modern military working dog (U.S. MWD program, SEAL teams, police K9). Extreme drive, speed and agility. Not a beginner dog. Without daily work they become destructive or neurotic. In a skilled handler\'s hands they are the most capable working dog alive.',
    heightIn: { female: [22, 24], male: [24, 26] },
    weightLb: { female: [40, 60], male: [60, 80] },
    lifespanYrs: [14, 16],
    coat: 'Short, straight, weather-resistant double coat.',
    colors: 'Fawn to mahogany with black mask and ears; black overlay.',
    temperament: ['Intense', 'Tireless', 'Highly sensitive', 'Quick learner', 'Protective', 'Can be reactive and mouthy'],
    drives: { food: 4, prey: 5, play: 5, defense: 4, fight: 5, hunt: 5, handlerSoftness: 4 },
    suitability: {
      companion: { rating: 2, note: 'Only for experienced, active owners.' },
      esa: { rating: 2, note: 'Can absorb handler anxiety and amplify it. Not recommended as an ESA for veterans in unstable housing.' },
      psd: { rating: 3, note: 'Highly capable task dog but hard to keep calm in public. Choose a calm-tempered individual.' },
      obedience: { rating: 5, note: 'Precise, fast and enthusiastic.' },
      detection: { rating: 5, note: 'Military/police detection standard.' },
      tracking: { rating: 5, note: 'Elite.' },
      protection: { rating: 5, note: 'The global standard for bite work, apprehension and patrol. Requires an experienced handler and certified helper.' },
    },
    health: [
      { condition: 'Hip & elbow dysplasia', note: 'Lower than GSD but present.', screening: 'OFA' },
      { condition: 'Progressive retinal atrophy (PRA)', note: 'Night blindness progressing to blindness.', screening: 'Annual eye exam' },
      { condition: 'Epilepsy', note: 'Seizures; anticonvulsant management.', screening: 'Neuro work-up if seizure' },
      { condition: 'Hemangiosarcoma', note: 'Aggressive cancer of older dogs; sudden collapse, pale gums.', screening: 'Senior abdominal ultrasound' },
      { condition: 'Kennel stress / spinning / flank sucking', note: 'Compulsive behaviors from under-stimulation.', screening: 'Behavior observation' },
      { condition: 'Bloat (GDV)', note: 'Deep-chested; same precautions as GSD.', screening: 'Consider gastropexy' },
    ],
    nutrition: { activityFactor: 2.5, proteinPct: [28, 34], fatPct: [18, 22], notes: ['Working Malinois may need 2,000-3,000+ kcal/day. Use a performance diet (30/20).', 'Feed the larger meal after the workday to aid recovery.', 'Lean is the standard: BCS 4/9, ribs easily felt.'] },
    exercise: { dailyMinutes: [120, 180], heatTolerance: 'good', coldTolerance: 'good', notes: ['Requires daily physical AND mental work: obedience, scent, agility, bite sport.', 'Teach an "off switch" (place/settle) from day one.'] },
    grooming: 'Weekly brush; minimal bathing.',
    trainingNotes: ['Keep sessions short and sharp; end before the dog does.', 'Prioritize impulse control and calmness as much as drive.', 'Never let a Mal self-reward on bite work; "out" and calm control are mandatory.'],
    legal: ['Protection-trained Malinois carry high liability. Keep training records and insurance.', 'Missouri strict liability applies.'],
  },
  {
    id: 'lab',
    group: 'Labrador Retriever',
    name: 'Labrador Retriever',
    aka: 'Lab; English (bench/show) and American (field) lines',
    summary:
      'America\'s most popular breed and the most common guide and service dog. Friendly, food-driven, stable and forgiving. Field lines are leaner and higher-drive (excellent detection dogs); English lines are blockier and calmer (excellent service and ESA dogs).',
    heightIn: { female: [21.5, 23.5], male: [22.5, 24.5] },
    weightLb: { female: [55, 70], male: [65, 80] },
    lifespanYrs: [10, 12],
    coat: 'Short, dense, water-resistant double coat. Sheds heavily.',
    colors: 'Black, yellow, chocolate.',
    temperament: ['Friendly to everyone', 'Eager to please', 'Even-tempered', 'Gentle mouth', 'Highly food-motivated'],
    drives: { food: 5, prey: 3, play: 4, defense: 1, fight: 1, hunt: 4, handlerSoftness: 2 },
    suitability: {
      companion: { rating: 5, note: 'Ideal family dog.' },
      esa: { rating: 5, note: 'Gold standard.' },
      psd: { rating: 5, note: 'Most common breed in service-dog programs. Superb for retrieval, DPT and mobility (with vet clearance).' },
      obedience: { rating: 5, note: 'Highly trainable.' },
      detection: { rating: 5, note: 'TSA, ATF and military detection standard (especially field lines).' },
      tracking: { rating: 4, note: 'Strong nose; trails well.' },
      protection: { rating: 1, note: 'Not suited. Labs lack the defense/fight drive for protection work. Training alert barking is the realistic limit.' },
    },
    health: [
      { condition: 'Obesity', note: 'Many Labs carry a POMC gene mutation that increases hunger. Measure every meal; count training treats.', screening: 'Monthly weigh-in' },
      { condition: 'Hip & elbow dysplasia', note: 'High risk.', screening: 'OFA' },
      { condition: 'Exercise-induced collapse (EIC)', note: 'Hind-end weakness/collapse after intense exercise, in field lines.', screening: 'DNA test (DNM1)' },
      { condition: 'Centronuclear myopathy (CNM)', note: 'Inherited muscle weakness.', screening: 'DNA test' },
      { condition: 'Progressive retinal atrophy (prcd-PRA)', note: 'Inherited blindness.', screening: 'DNA test + eye exam' },
      { condition: 'Ear infections', note: 'Floppy ears + love of water. Dry ears after swimming.', screening: 'Weekly ear check' },
      { condition: 'Lipomas', note: 'Fatty lumps common in seniors; aspirate new lumps.', screening: 'Monthly lump check' },
    ],
    nutrition: { activityFactor: 1.6, proteinPct: [24, 30], fatPct: [12, 16], notes: ['Large-breed puppy formula to 12 months.', 'Use part of daily ration as training rewards to avoid weight gain.', 'Green beans or carrots as low-calorie fillers for constant hunger.'] },
    exercise: { dailyMinutes: [60, 120], heatTolerance: 'moderate', coldTolerance: 'good', notes: ['Swimming is ideal joint-friendly exercise.', 'Retrieve games are built-in motivation.'] },
    grooming: 'Brush 1-2x weekly (daily in shedding season); dry ears after water; nails.',
    trainingNotes: ['Food is the master key; use it.', 'Teach calm greetings: Labs love everyone and will pull to say hi.', 'Field-line Labs need more mental work than show lines.'],
    legal: ['Generally no breed restrictions.'],
  },
];

export const breedById = (id: string) => BREEDS.find((b) => b.id === id) ?? BREEDS[0];

export const DISCIPLINE_LABEL: Record<Discipline, string> = {
  companion: 'Companion',
  esa: 'Emotional Support (ESA)',
  psd: 'Psychiatric Service Dog',
  obedience: 'Obedience',
  detection: 'Detection / Scent',
  tracking: 'Tracking',
  protection: 'Protection',
};
