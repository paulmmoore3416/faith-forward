export interface Resource {
    name: string;
    description: string;
    address?: string;
    phone?: string;
    link?: string;
    category: 'Employment' | 'Housing' | 'Food' | 'Medical' | 'Utilities' | 'Mental Health' | 'Benefits' | 'Substance Abuse' | 'Family' | 'Community';
    priority?: boolean;
}

export const veteranResources: Resource[] = [
    // Crisis & Priority
    {
        name: "Veterans Crisis Line",
        description: "Confidential crisis support for veterans and their families. Available 24/7.",
        phone: "988 (Press 1)",
        link: "https://www.veteranscrisisline.net",
        category: "Mental Health",
        priority: true
    },
    {
        name: "St. Louis VA Homeless Program (Hope House)",
        description: "Walk-in clinic and comprehensive support for veterans experiencing homelessness.",
        address: "1 Jefferson Barracks Rd, St. Louis, MO 63125",
        phone: "314-894-6000",
        category: "Housing",
        priority: true
    },

    // Employment
    {
        name: "St. Louis VA Regional Benefit Office (VR&E)",
        description: "Veteran Readiness and Employment (Chapter 31) - One-on-one counseling and job placement.",
        address: "9700 Page Ave, St. Louis, MO 63132",
        phone: "800-827-1000",
        category: "Employment",
        link: "https://www.va.gov"
    },
    {
        name: "SLATE Missouri Job Center - St. Louis City",
        description: "Priority career guidance, resume workshops, and job fairs for veterans.",
        address: "1520 Market St., St. Louis, MO 63103",
        phone: "314-589-8000",
        link: "https://www.stlworks.com",
        category: "Employment"
    },
    {
        name: "Employment Connection",
        description: "Homeless Veterans Reintegration Program (HVRP) - Job readiness and placement.",
        address: "2838 Market St., St. Louis, MO 63103",
        phone: "314-333-5627",
        category: "Employment"
    },
    {
        name: "Veterans Community Project (VCP) Outreach",
        description: "Wraparound services including employment referrals and tiny home stability.",
        address: "1535 N. 13th St., St. Louis, MO 63106",
        phone: "314-501-2810",
        link: "https://www.veteranscommunityproject.org/stlouis",
        category: "Employment"
    },

    // Housing & Homelessness
    {
        name: "MOVE (Missouri Veterans Endeavor)",
        description: "Long-term supportive housing and barrier-free therapy for veterans and families.",
        address: "8410 Engler Park Ct, St. John, MO 63114",
        phone: "314-449-0200",
        link: "https://www.move-stl.org",
        category: "Housing"
    },
    {
        name: "St. Patrick Center - SSVF",
        description: "Supportive Services for Veteran Families - Rapid re-housing and homelessness prevention.",
        address: "800 N. Tucker Blvd, St. Louis, MO 63101",
        phone: "314-802-0700",
        link: "https://stpatrickcenter.org",
        category: "Housing"
    },
    {
        name: "Salvation Army Veterans Residence (SAVR)",
        description: "Transitional housing with 48 single apartments and intensive case management.",
        address: "3740 Marine Ave, St. Louis, MO 63118",
        phone: "314-241-7704",
        category: "Housing"
    },
    {
        name: "HUD-VASH Program",
        description: "Housing Choice Vouchers combined with VA clinical services.",
        phone: "314-652-4100",
        category: "Housing"
    },

    // Food Support
    {
        name: "The Kaufman Fund - Food for Vets",
        description: "Direct food assistance and basic necessities for veterans.",
        link: "https://thekaufmanfund.org",
        phone: "314-455-9415",
        category: "Food"
    },
    {
        name: "St. Louis Area Foodbank",
        description: "Mobile markets and specific veteran distribution events.",
        phone: "314-292-6262",
        link: "https://stlfoodbank.org",
        category: "Food"
    },

    // Medical & Mental Health
    {
        name: "John Cochran VA Medical Center",
        description: "Full-service hospital, surgery, and 24-hour emergency care.",
        address: "915 North Grand Blvd, St. Louis, MO 63106",
        phone: "314-289-6300",
        category: "Medical"
    },
    {
        name: "Jefferson Barracks VA Medical Center",
        description: "Primary care, rehabilitation, and long-term care.",
        address: "1 Jefferson Barracks Dr, St. Louis, MO 63125",
        phone: "314-652-4100",
        category: "Medical"
    },
    {
        name: "VA St. Louis PTSD Clinic",
        description: "Specialized treatment including CPT, PE, and EMDR.",
        phone: "314-652-4100 (Ext. 65090)",
        category: "Mental Health"
    },
    {
        name: "St. Louis Vet Center",
        description: "Confidential readjustment counseling for combat veterans.",
        address: "4735 Fyler Ave, St. Louis, MO 63109",
        phone: "314-845-8580",
        category: "Mental Health"
    },

    // Substance Abuse
    {
        name: "VA SARRTP - Jefferson Barracks",
        description: "Residential and outpatient intensive substance abuse treatment.",
        address: "1 Jefferson Barracks Dr, St. Louis, MO 63125",
        phone: "314-652-4100 (Ext. 66598)",
        category: "Substance Abuse"
    },
    {
        name: "SAMHSA National Helpline",
        description: "24/7 treatment referral and information service.",
        phone: "800-662-4357",
        category: "Substance Abuse"
    },

    // Benefits
    {
        name: "Missouri Veterans Commission",
        description: "State benefits, claims assistance, and skilled nursing access.",
        phone: "573-751-3779",
        link: "https://veteranbenefits.mo.gov",
        category: "Benefits"
    },
    {
        name: "Disabled American Veterans (DAV)",
        description: "Professional assistance with VA claims and appeals.",
        link: "https://dav.org",
        category: "Benefits"
    },

    // Family
    {
        name: "H.E.R.O.E.S. Care",
        description: "Emergency financial and health support for military families.",
        phone: "636-600-0096",
        link: "https://www.heroescare.org",
        category: "Family"
    },
    {
        name: "Coaching Into Care",
        description: "Helping family members support veterans in connecting to care.",
        phone: "888-823-7458",
        category: "Family"
    },

    // Community
    {
        name: "Team Rubicon",
        description: "Disaster relief missions that provide purpose and brotherhood.",
        link: "https://teamrubiconusa.org",
        category: "Community"
    },
    {
        name: "The Mission Continues",
        description: "Community service projects led by veterans in St. Louis.",
        address: "1141 S. 7th St, St. Louis, MO 63104",
        link: "https://missioncontinues.org",
        category: "Community"
    },
    {
        name: "American Legion Post 312",
        description: "Local veteran advocacy and community events.",
        address: "201 N. 2nd St, Suite 203, St. Charles, MO",
        phone: "636-947-7666",
        category: "Community"
    }
];
