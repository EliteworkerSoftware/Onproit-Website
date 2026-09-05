export interface LocationFaq {
  question: string;
  answer: string;
}

export interface LocationData {
  path: string;
  focus: "managed-it" | "cabling";
  heroImage?: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  intro: string;
  areasServed: string[];
  whyChoose: string[];
  faqs: LocationFaq[];
}

export const LOCATIONS_DATA: LocationData[] = [
  {
    path: "managed-it-services-new-jersey",
    focus: "managed-it",
    heroImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600",
    h1: "Managed IT Services in New Jersey | ONPRO IT",
    metaTitle: "Managed IT Services in New Jersey | ONPRO IT",
    metaDescription:
      "ONPRO IT provides managed IT services across New Jersey — proactive support, cybersecurity, and cabling for businesses in Camden, Burlington, Gloucester, and beyond.",
    keywords: "managed IT services NJ, IT support New Jersey, MSP NJ",
    intro:
      "Stop dealing with technology headaches. ONPRO IT provides comprehensive, proactive IT support and cybersecurity solutions tailored for New Jersey businesses — plus structured cabling, network installation, VoIP, AV, and security camera systems, all from the same team. We keep your systems running so you can focus on growing your company.",
    areasServed: [
      "Cherry Hill, NJ",
      "Mount Laurel, NJ",
      "Moorestown, NJ",
      "Voorhees, NJ",
      "Marlton, NJ",
      "Philadelphia, PA",
      "King of Prussia, PA",
      "Wilmington, DE",
      "Trenton, NJ",
      "Princeton, NJ",
    ],
    whyChoose: [
      "Local & accessible — we aren't a faceless national call center, we're your neighbors in South Jersey",
      "Security-first mindset — we build security into everything we do, not as an afterthought",
      "Strategic partners — we act as your Virtual CIO, helping you budget and plan for the future",
      "Predictable flat-rate monthly pricing — no surprise invoices",
    ],
    faqs: [
      {
        question: "What are Managed IT Services?",
        answer:
          "Managed IT Services involve outsourcing your business technology management to a dedicated provider like ONPRO IT. Instead of hiring internal staff, you get a full team of experts who proactively monitor your systems, handle cybersecurity, manage backups, and provide unlimited help desk support for a flat monthly fee.",
      },
      {
        question: "How much do Managed IT Services cost in New Jersey?",
        answer:
          "Costs vary based on the number of users, devices, and complexity of your network — we don't believe in one-size-fits-all pricing. Rather than quote a number that may not apply to your business, we provide a custom quote after a quick, free assessment.",
      },
      {
        question: "Do you support businesses outside of South Jersey?",
        answer:
          "Yes. While our primary onsite focus is Southern and Central New Jersey, Philadelphia, and Delaware, our remote support tools allow us to effectively manage users and devices anywhere in the United States.",
      },
      {
        question: "What is included in your cybersecurity package?",
        answer:
          "Our security stack includes next-generation antivirus (EDR), firewall management, email filtering, multi-factor authentication (MFA) setup, regular security patches, and 24/7 threat monitoring to protect against ransomware and data breaches.",
      },
      {
        question: "How fast is your response time?",
        answer:
          "We pride ourselves on rapid response. For critical issues, our team typically responds within 15 minutes, and our local help desk ensures you're never left waiting when you need assistance.",
      },
    ],
  },
  {
    path: "managed-it-services-cherry-hill-nj",
    focus: "managed-it",
    heroImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600",
    h1: "Managed IT Services in Cherry Hill, NJ | ONPRO IT",
    metaTitle: "Managed IT Services in Cherry Hill, NJ | ONPRO IT",
    metaDescription:
      "Local managed IT services for Cherry Hill, NJ businesses. Proactive support, cybersecurity, and IT consulting from ONPRO IT.",
    keywords: "managed IT services Cherry Hill NJ, IT support Cherry Hill",
    intro:
      "Empower your Cherry Hill business with proactive technology management. From rapid help desk support to advanced cybersecurity, cloud solutions, structured cabling, and security cameras, ONPRO IT is your dedicated local technology partner — headquartered just minutes away in Berlin Township.",
    areasServed: [
      "Cherry Hill (08002, 08003, 08034)",
      "Marlton (08053)",
      "Mount Laurel (08054)",
      "Voorhees (08043)",
      "Haddonfield (08033)",
      "Moorestown (08057)",
    ],
    whyChoose: [
      "Local expertise — deep understanding of the local business environment in Cherry Hill, Marlton, and Mount Laurel",
      "Rapid response — a truly local team that can be on-site fast when remote support isn't enough",
      "Proactive management — stopping problems before they impact your bottom line with 24/7 monitoring",
      "Rapid onsite response along Route 70, Haddonfield Road, and the Kings Highway corridor",
    ],
    faqs: [
      {
        question: "What makes your managed IT services different for Cherry Hill businesses?",
        answer:
          "We are a truly local partner based just minutes away in Berlin Township. Unlike national providers who treat you like a ticket number, our team understands the local Cherry Hill business landscape and provides rapid onsite response times along Route 70, Haddonfield Road, and the Kings Highway corridor.",
      },
      {
        question: "Why do Cherry Hill businesses need enhanced cybersecurity?",
        answer:
          "Cherry Hill is a major commercial hub in South Jersey, making local businesses prime targets for cyberattacks. We implement enterprise-grade security tailored for small to mid-sized businesses, including ransomware protection, firewall management, and 24/7 threat monitoring.",
      },
      {
        question: "Do you offer support for remote employees?",
        answer:
          "Absolutely. Whether your team is in the office in Cherry Hill or working remotely from home, our managed IT services include secure remote access solutions, VPN configuration, and cloud management to ensure productivity anywhere.",
      },
      {
        question: "How quickly can you respond to IT emergencies?",
        answer:
          "For critical issues, our average response time is under 15 minutes. Our local presence means we can dispatch a technician to your Cherry Hill office quickly if a problem cannot be resolved remotely.",
      },
      {
        question: "Can you help with office moves within Cherry Hill?",
        answer:
          "Yes — we specialize in office relocations, including structured cabling, server migration, and network setup, handling the entire technology transition so your team can get back to work immediately in your new location.",
      },
    ],
  },
  {
    path: "managed-it-services-west-berlin-nj",
    focus: "managed-it",
    heroImage:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1600",
    h1: "Managed IT Services in West Berlin, NJ | ONPRO IT",
    metaTitle: "Managed IT Services in West Berlin, NJ | ONPRO IT",
    metaDescription:
      "ONPRO IT is headquartered in Berlin Township, NJ, delivering managed IT services, cabling, and cybersecurity to local businesses.",
    keywords: "managed IT services West Berlin NJ, IT company West Berlin NJ",
    intro:
      "Enhance your business efficiency with proactive IT support right in your neighborhood — plus structured cabling, network installation, VoIP, and security cameras, all from one team. Located right on Haddon Avenue, ONPRO IT isn't just another vendor — we're your neighbors, and West Berlin and Camden County businesses are our home turf.",
    areasServed: [
      "West Berlin (08091)",
      "Berlin (08009)",
      "Voorhees (08043)",
      "Atco (08004)",
      "Marlton (08053)",
      "Cherry Hill (08003)",
    ],
    whyChoose: [
      "Local headquarters right here in Berlin Township, ensuring the fastest possible onsite response times",
      "Security first — advanced tools and continuous monitoring prioritizing the security of your data",
      "Business aligned — we act as your strategic partner, ensuring technology investments drive real value",
      "Hands-on approach — we get to know your business, not just your ticket queue",
    ],
    faqs: [
      {
        question: "Why choose a local West Berlin IT provider?",
        answer:
          "Choosing a local provider like ONPRO IT means faster onsite response times. We are headquartered right here in Berlin Township at 127 Haddon Ave. — unlike remote-only firms or national chains, we can be at your office in minutes, not hours.",
      },
      {
        question: "What exactly are managed IT services?",
        answer:
          "Managed IT services involve outsourcing your company's technology management to a specialized provider. We handle everything from 24/7 monitoring and cybersecurity to help desk support and vendor management for a predictable monthly fee.",
      },
      {
        question: "How do you protect West Berlin businesses from cyber threats?",
        answer:
          "We employ a multi-layered security strategy including next-generation firewalls, endpoint detection and response (EDR), email filtering, and regular security awareness training, proactively hunting for threats to keep your data safe.",
      },
      {
        question: "How much does managed IT cost?",
        answer:
          "Our pricing is based on the number of users and devices in your environment rather than a flat published rate, since every business's setup is different. We provide a custom quote after a free assessment.",
      },
    ],
  },
  {
    path: "managed-it-services-mount-laurel-nj",
    focus: "managed-it",
    heroImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600",
    h1: "Managed IT Services in Mount Laurel, NJ | ONPRO IT",
    metaTitle: "Managed IT Services in Mount Laurel, NJ | ONPRO IT",
    metaDescription:
      "Managed IT, cybersecurity, and structured cabling for Mount Laurel, NJ businesses along the Route 38 and Route 73 corridor, from ONPRO IT.",
    keywords: "managed IT services Mount Laurel NJ, IT support Mount Laurel, IT company Mount Laurel NJ",
    intro:
      "Mount Laurel's mix of corporate offices, warehouses, and professional services firms along Route 38 and Route 73 all depend on technology that just works. ONPRO IT provides proactive managed IT, cybersecurity, structured cabling, and network installation for Mount Laurel businesses — backed by a team headquartered just down the road in Berlin Township.",
    areasServed: [
      "Mount Laurel (08054)",
      "Moorestown (08057)",
      "Hainesport (08036)",
      "Lumberton (08048)",
      "Marlton (08053)",
      "Maple Shade (08052)",
    ],
    whyChoose: [
      "Close proximity — our Berlin Township headquarters is a short drive from the Route 38/Route 73 corridor",
      "Built for corporate parks — experience with the multi-suite office buildings common throughout Mount Laurel",
      "One team for everything — managed IT, cabling, and network installation without juggling separate vendors",
      "Proactive monitoring — we catch problems before they turn into a call to your help desk",
    ],
    faqs: [
      {
        question: "Do you support businesses in Mount Laurel's office parks and corporate centers?",
        answer:
          "Yes — we regularly work with multi-suite office buildings and corporate parks throughout Mount Laurel, including shared-infrastructure situations that require coordinating with building management or other tenants.",
      },
      {
        question: "How quickly can you respond to an IT issue in Mount Laurel?",
        answer:
          "Our headquarters in Berlin Township is a short drive from Mount Laurel, so when remote support isn't enough, we can typically have a technician on-site the same day.",
      },
      {
        question: "Do you handle cabling and network installation for new Mount Laurel offices?",
        answer:
          "Yes — structured cabling and network installation are part of the same service we provide alongside ongoing managed IT, so a new office buildout and its long-term support come from one team.",
      },
    ],
  },
  {
    path: "managed-it-services-voorhees-nj",
    focus: "managed-it",
    heroImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600",
    h1: "Managed IT Services in Voorhees, NJ | ONPRO IT",
    metaTitle: "Managed IT Services in Voorhees, NJ | ONPRO IT",
    metaDescription:
      "Managed IT, cybersecurity, and structured cabling for Voorhees, NJ businesses along the Route 73 corridor, from ONPRO IT.",
    keywords: "managed IT services Voorhees NJ, IT support Voorhees, IT company Voorhees NJ",
    intro:
      "Voorhees is home to a dense mix of medical offices, professional services firms, and retail businesses along the Route 73 corridor — all of which depend on technology that doesn't go down. ONPRO IT provides managed IT, cybersecurity, structured cabling, and network installation for Voorhees businesses, backed by a local team based just minutes away.",
    areasServed: [
      "Voorhees (08043)",
      "Echelon",
      "Kirkwood",
      "Berlin Township (08091)",
      "Lindenwold (08021)",
      "Gibbsboro (08026)",
    ],
    whyChoose: [
      "Local response — headquartered nearby in Berlin Township, not a call center hours away",
      "Experience with medical and professional offices common throughout the Voorhees business community",
      "One team for everything — managed IT, cabling, and network installation without juggling separate vendors",
      "Proactive monitoring that catches problems before they interrupt your day",
    ],
    faqs: [
      {
        question: "Do you support medical and professional offices in Voorhees?",
        answer:
          "Yes — we work with medical practices, professional services firms, and retail businesses throughout Voorhees, understanding the day-to-day demands each type of office places on its network and systems.",
      },
      {
        question: "How fast can you respond to an IT issue in Voorhees?",
        answer:
          "Our team is based just minutes away in Berlin Township, so when a problem can't be resolved remotely, we can typically get a technician to your Voorhees office quickly.",
      },
      {
        question: "Can you help with an office move or expansion in Voorhees?",
        answer:
          "Yes — we handle structured cabling, network setup, and IT relocation as part of the same service we provide for ongoing managed IT, so your move and your long-term support come from one team.",
      },
    ],
  },
  {
    path: "managed-it-services-marlton-nj",
    focus: "managed-it",
    heroImage:
      "https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80",
    h1: "Managed IT Services in Marlton, NJ | ONPRO IT",
    metaTitle: "Managed IT Services in Marlton, NJ | ONPRO IT",
    metaDescription:
      "Managed IT, cybersecurity, and structured cabling for Marlton, NJ businesses in Evesham Township, from ONPRO IT.",
    keywords: "managed IT services Marlton NJ, IT support Marlton, IT company Evesham Township",
    intro:
      "Marlton, in the heart of Evesham Township, is one of Burlington County's busiest business corridors — and ONPRO IT is right around the corner. We provide managed IT, cybersecurity, structured cabling, and network installation for Marlton businesses, backed by a team headquartered just down Route 73 in Berlin Township.",
    areasServed: [
      "Marlton / Evesham Township (08053)",
      "Medford (08055)",
      "Mount Laurel (08054)",
      "Voorhees (08043)",
      "Shamong",
      "Tabernacle",
    ],
    whyChoose: [
      "Down the road, not across the state — our Berlin Township headquarters is minutes from Marlton",
      "Familiar with the retail, medical, and office mix along Route 73 and Route 70",
      "One team for everything — managed IT, cabling, and network installation without juggling separate vendors",
      "Proactive monitoring that catches problems before they interrupt your day",
    ],
    faqs: [
      {
        question: "Do you support small businesses along Route 73 and Route 70 in Marlton?",
        answer:
          "Yes — we work with the mix of retail, medical, and professional office businesses common along the Route 73 and Route 70 corridors in Marlton and greater Evesham Township.",
      },
      {
        question: "How quickly can you respond to an IT issue in Marlton?",
        answer:
          "Our headquarters in Berlin Township is just down Route 73, so when remote support isn't enough, we can typically have a technician on-site quickly.",
      },
      {
        question: "Do you provide structured cabling for new or renovated Marlton offices?",
        answer:
          "Yes — cabling and network installation are part of the same service as our ongoing managed IT, so your buildout and its long-term support come from one team instead of two separate vendors.",
      },
    ],
  },
  {
    path: "managed-it-services-king-of-prussia-pa",
    focus: "managed-it",
    heroImage: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80",
    h1: "Managed IT Services in King of Prussia, PA | ONPRO IT",
    metaTitle: "Managed IT Services in King of Prussia, PA | ONPRO IT",
    metaDescription:
      "Managed IT, cybersecurity, and structured cabling for King of Prussia, PA businesses, from ONPRO IT — serving the Route 202 and I-76 corporate corridor.",
    keywords: "managed IT services King of Prussia PA, IT support King of Prussia, IT company King of Prussia",
    intro:
      "King of Prussia's corporate offices along Route 202 and the I-76 corridor need technology that keeps pace with a fast-moving business community. ONPRO IT provides managed IT, cybersecurity, structured cabling, and network installation for King of Prussia businesses, extending the same full-service approach we provide throughout our New Jersey home base into the Philadelphia suburbs.",
    areasServed: [
      "King of Prussia",
      "Wayne",
      "Conshohocken",
      "Plymouth Meeting",
      "Norristown",
      "Malvern",
    ],
    whyChoose: [
      "One team for everything — managed IT, cabling, and network installation without juggling separate vendors",
      "Experience with corporate office suites and multi-tenant buildings common in King of Prussia",
      "Security-first approach built into every system we manage, not added on afterward",
      "Direct access to your support team instead of a national call center queue",
    ],
    faqs: [
      {
        question: "Do you support corporate office suites in King of Prussia?",
        answer:
          "Yes — we work with businesses in multi-tenant office buildings and corporate suites throughout King of Prussia, including coordination with building management when needed.",
      },
      {
        question: "Do you handle both IT support and cabling for King of Prussia businesses?",
        answer:
          "Yes — structured cabling and network installation are part of the same service we provide alongside ongoing managed IT and cybersecurity, so one team handles the full picture.",
      },
      {
        question: "Can you support a King of Prussia office alongside our New Jersey locations?",
        answer:
          "Yes — we manage multi-location businesses across New Jersey, Pennsylvania, and Delaware under one consistent set of standards and one point of contact.",
      },
    ],
  },
  {
    path: "managed-it-services-wilmington-de",
    focus: "managed-it",
    heroImage: "https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80",
    h1: "Managed IT Services in Wilmington, DE | ONPRO IT",
    metaTitle: "Managed IT Services in Wilmington, DE | ONPRO IT",
    metaDescription:
      "Managed IT, cybersecurity, and structured cabling for Wilmington, DE businesses, from ONPRO IT — serving Delaware's financial and corporate hub.",
    keywords: "managed IT services Wilmington DE, IT support Wilmington Delaware, IT company Wilmington DE",
    intro:
      "Wilmington's mix of financial, legal, and corporate offices depends on technology and security that can't afford downtime. ONPRO IT provides managed IT, cybersecurity, structured cabling, and network installation for Wilmington businesses, bringing the same full-service approach we provide throughout New Jersey and Pennsylvania into Delaware's largest city.",
    areasServed: [
      "Wilmington",
      "Newark, DE",
      "New Castle",
      "Bear",
      "Claymont",
      "Hockessin",
    ],
    whyChoose: [
      "One team for everything — managed IT, cabling, and network installation without juggling separate vendors",
      "Security-first approach built into every system we manage, not added on afterward",
      "Experience with the office and corporate environments common throughout Wilmington",
      "Direct access to your support team instead of a national call center queue",
    ],
    faqs: [
      {
        question: "Does ONPRO IT provide ongoing managed IT support in Wilmington, or just cabling?",
        answer:
          "Both — in addition to structured cabling, we provide full managed IT services, cybersecurity, cloud, VoIP, and security camera installation for Wilmington businesses, all from one team.",
      },
      {
        question: "How does ONPRO IT support a Wilmington business remotely from New Jersey?",
        answer:
          "Our remote monitoring and help desk tools let us support Wilmington businesses day-to-day just as effectively as our New Jersey clients, with on-site visits scheduled as needed for hands-on work.",
      },
      {
        question: "Can you support our Wilmington office alongside other locations in NJ or PA?",
        answer:
          "Yes — we manage multi-location businesses across New Jersey, Pennsylvania, and Delaware under one consistent set of standards and one point of contact.",
      },
    ],
  },
  {
    path: "new-jersey-cabling",
    focus: "cabling",
    heroImage: "https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80",
    h1: "New Jersey Structured Cabling & Network Installation",
    metaTitle: "Structured Cabling Services in New Jersey | ONPRO IT",
    metaDescription:
      "Cat6 and fiber optic structured cabling installation for businesses across New Jersey. Certified and code-compliant. Get a quote from ONPRO IT.",
    keywords: "structured cabling NJ, network cabling New Jersey, Cat6 installation NJ",
    intro:
      "Your trusted local partner for low-voltage wiring, fiber optics, and network infrastructure throughout Southern and Central NJ. Based in Southern NJ, we understand the specific needs of New Jersey businesses, from historic buildings in Haddonfield to modern corporate centers in Mount Laurel. Cabling is just the start — we also provide full managed IT, cybersecurity, VoIP, AV, and security camera services throughout the same area.",
    areasServed: [
      "Cherry Hill",
      "Voorhees",
      "Mount Laurel",
      "Marlton",
      "Moorestown",
      "Camden County",
      "Burlington County",
      "Gloucester County",
      "Princeton",
      "Trenton",
      "Atlantic City",
    ],
    whyChoose: [
      "Structured cabling in Cat5e, Cat6, and Cat6a for businesses across New Jersey",
      "Fiber optic backbone cabling for industrial parks and campuses",
      "Data center & server room wiring with complete rack management",
      "Security & IP camera wiring, plus office move and relocation support",
    ],
    faqs: [
      {
        question: "What areas of New Jersey does ONPRO IT provide cabling services in?",
        answer:
          "We provide structured cabling installation throughout Southern and Central New Jersey, including Cherry Hill, Voorhees, Mount Laurel, Marlton, Moorestown, Camden, Burlington, and Gloucester counties, as well as Princeton, Trenton, and the Atlantic City area.",
      },
      {
        question: "Do you provide cabling for new office construction?",
        answer:
          "Yes, we frequently work with contractors and property managers on new construction and renovation projects to plan and install cabling before walls are closed, meeting all local New Jersey building codes and industry standards.",
      },
      {
        question: "Does ONPRO IT only handle cabling in New Jersey, or other IT services too?",
        answer:
          "Cabling is one part of what we do — ONPRO IT also provides managed IT services, cybersecurity, cloud, VoIP, AV, and security camera installation throughout the same New Jersey service area, all from one team.",
      },
    ],
  },
  {
    path: "pennsylvania-cabling",
    focus: "cabling",
    heroImage: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80",
    h1: "Pennsylvania Structured Cabling & Network Wiring",
    metaTitle: "Structured Cabling Services in Pennsylvania & Philadelphia | ONPRO IT",
    metaDescription:
      "Structured cabling installation for businesses in Philadelphia and the surrounding Pennsylvania region. Cat6, fiber optic, and network cabling from ONPRO IT.",
    keywords: "structured cabling Philadelphia, network cabling Pennsylvania, Cat6 installation PA",
    intro:
      "Serving the Greater Philadelphia area and Southeastern PA with professional low-voltage and data cabling solutions. From the high-rises of Center City Philadelphia to the corporate parks of King of Prussia and Malvern, we deliver reliable structured cabling across Pennsylvania — alongside the same managed IT, cybersecurity, VoIP, AV, and security camera services we provide throughout the region.",
    areasServed: [
      "Philadelphia",
      "King of Prussia",
      "Conshohocken",
      "West Chester",
      "Media",
      "Bensalem",
      "Langhorne",
      "Doylestown",
      "Exton",
      "Malvern",
      "Wayne",
      "Plymouth Meeting",
    ],
    whyChoose: [
      "Certified Cat5e, Cat6, and Cat6a installation for Philadelphia businesses and PA suburbs",
      "Reliable fiber optic backbone cabling for PA industrial zones and office parks",
      "Server room management, rack cleanup, and organization for data centers",
      "Security system wiring and IT relocation services throughout Southeastern PA",
    ],
    faqs: [
      {
        question: "Does ONPRO IT provide cabling services in Philadelphia?",
        answer:
          "Yes, ONPRO IT provides structured cabling installation throughout Philadelphia and the surrounding King of Prussia, Conshohocken, West Chester, Media, Bensalem, Langhorne, Doylestown, Exton, Malvern, Wayne, and Plymouth Meeting areas of Pennsylvania.",
      },
      {
        question: "Does ONPRO IT only handle cabling in Pennsylvania, or other IT services too?",
        answer:
          "Cabling is one part of what we do — ONPRO IT also provides managed IT services, cybersecurity, cloud, VoIP, AV, and security camera installation throughout the same Pennsylvania service area, all from one team.",
      },
    ],
  },
  {
    path: "delaware-cabling",
    focus: "cabling",
    heroImage: "https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80",
    h1: "Delaware Structured Cabling & Network Installation",
    metaTitle: "Structured Cabling Services in Delaware | ONPRO IT",
    metaDescription:
      "Cat6 and fiber optic structured cabling installation for businesses across Delaware, delivered by ONPRO IT's certified technicians.",
    keywords: "structured cabling Delaware, network cabling DE, Cat6 installation Delaware",
    intro:
      "Expert low-voltage wiring and network infrastructure services for businesses across Wilmington, Newark, and Northern Delaware — The First State. We provide the essential connectivity backbone that modern DE businesses rely on for daily operations, along with the same managed IT, cybersecurity, VoIP, AV, and security camera services we provide throughout our full coverage area.",
    areasServed: [
      "Wilmington",
      "Newark",
      "New Castle",
      "Bear",
      "Middletown",
      "Claymont",
      "Hockessin",
      "Elsmere",
      "Pike Creek",
      "Glasgow",
    ],
    whyChoose: [
      "Comprehensive Cat5e/Cat6 data cabling for businesses throughout New Castle County",
      "Expert fiber optic termination and testing for high-bandwidth applications",
      "Professional server room cleanup and cable management",
      "New construction wiring, partnering with DE contractors on pre-wiring new builds",
    ],
    faqs: [
      {
        question: "Does ONPRO IT serve businesses in Delaware?",
        answer:
          "Yes, ONPRO IT provides structured cabling installation for businesses throughout New Castle County and the greater Wilmington and Newark, DE area.",
      },
      {
        question: "Does ONPRO IT only handle cabling in Delaware, or other IT services too?",
        answer:
          "Cabling is one part of what we do — ONPRO IT also provides managed IT services, cybersecurity, cloud, VoIP, AV, and security camera installation throughout the same Delaware service area, all from one team.",
      },
    ],
  },
];

export function getLocationByPath(path: string) {
  return LOCATIONS_DATA.find((l) => l.path === path);
}
