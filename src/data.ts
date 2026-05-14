export interface Resource {
    name: string;
    description: string;
    address?: string;
    phone?: string;
    link?: string;
    category: 'Employment' | 'Housing' | 'Food' | 'Medical' | 'Utilities';
}

export const veteranResources: Resource[] = [
    // Employment
    {
        name: "St. Louis VA Regional Benefit Office (VR&E)",
        description: "Veteran Readiness and Employment (Chapter 31) - One-on-one counseling and job placement for disabled veterans.",
        address: "9700 Page Ave, St. Louis, MO",
        category: "Employment",
        link: "https://www.va.gov"
    },
    {
        name: "Missouri Job Center - St. Louis City",
        description: "Priority of service for veterans. Includes MO Heroes Connect initiative for financial support.",
        address: "1520 Market St., Room 3050, St. Louis, MO",
        phone: "314-589-8000",
        category: "Employment"
    },
    {
        name: "Employment Connection",
        description: "Homeless Veterans Reintegration Program (HVRP) - Job readiness and placement for veterans facing housing instability.",
        address: "2838 Market St., St. Louis, MO",
        category: "Employment"
    },
    {
        name: "Veterans Community Project (VCP) Outreach",
        description: "Walk-in support for any veteran. Wraparound services including employment referrals.",
        address: "1535 N. 13th St., St. Louis, MO",
        phone: "314-501-2810",
        category: "Employment"
    },

    // Housing & Homelessness
    {
        name: "VA Hope Recovery Center",
        description: "Central hub for VA homeless programs, clinical treatment, and social work.",
        address: "515 N. Jefferson Ave, St. Louis, MO 63103",
        phone: "314-652-4100 Ext. 55500",
        category: "Housing"
    },
    {
        name: "St. Patrick Center",
        description: "Project HERO and SSVF program for rapid re-housing and homelessness prevention.",
        address: "800 N. Tucker Blvd, St. Louis, MO 63101",
        phone: "314-802-0700",
        link: "https://stpatrickcenter.org",
        category: "Housing"
    },
    {
        name: "The Salvation Army Veterans Residence (SAVR)",
        description: "Transitional housing with intensive case management.",
        address: "2933 Locust St, St. Louis, MO 63103",
        phone: "314-932-7794",
        category: "Housing"
    },
    {
        name: "Missouri Veterans Endeavor (MOVE-STL)",
        description: "Long-term supportive housing and therapy for veterans and families.",
        address: "1000 N. Lindbergh Blvd, St. Louis, MO 63132",
        phone: "314-427-3755",
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

    // Medical Assistance
    {
        name: "John Cochran VA Medical Center",
        description: "Primary provider for surgery, emergency care, and specialty medicine.",
        address: "915 North Grand Blvd, St. Louis, MO 63106",
        phone: "314-652-4100",
        category: "Medical"
    },
    {
        name: "Jefferson Barracks VA Medical Center",
        description: "Primary care, rehabilitation, and long-term care.",
        address: "1 Jefferson Barracks Dr, St. Louis, MO 63125",
        category: "Medical"
    },

    // Utility Assistance
    {
        name: "Ameren Veteran Line",
        description: "One-time utility assistance up to $600 for veterans (DD214 required).",
        phone: "1-800-427-4626",
        category: "Utilities"
    },
    {
        name: "Heat Up St. Louis",
        description: "Utility grants and counseling for at-risk households.",
        link: "https://heatupstlouis.org",
        category: "Utilities"
    }
];
