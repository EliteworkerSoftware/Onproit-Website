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
      "Stop dealing with technology headaches. ONPRO IT provides comprehensive, proactive IT support and cybersecurity solutions tailored for New Jersey businesses. We keep your systems running so you can focus on growing your company.",
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
      "Predictable flat-rate monthly pricing, generally $100–$250 per user per month",
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
          "Costs vary based on the number of users, devices, and complexity of your network. Generally, businesses in NJ can expect to pay between $100 to $250 per user per month — often significantly more cost-effective than hiring full-time IT staff or paying for emergency break-fix repairs.",
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
      "Empower your Cherry Hill business with proactive technology management. From rapid help desk support to advanced cybersecurity and cloud solutions, ONPRO IT is your dedicated local technology partner — headquartered just minutes away in Berlin Township.",
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
      "Compliance ready — helping medical, legal, and financial firms meet strict compliance standards (HIPAA, PCI)",
      "Proactive management — stopping problems before they impact your bottom line with 24/7 monitoring",
      "Rapid onsite response along Route 70, Haddonfield Road, and the Kings Highway corridor",
    ],
    faqs: [
      {
        question: "What makes your managed IT services different for Cherry Hill businesses?",
        answer:
          "We are a truly local partner based just minutes away in West Berlin. Unlike national providers who treat you like a ticket number, our team understands the local Cherry Hill business landscape and provides rapid onsite response times along Route 70, Haddonfield Road, and the Kings Highway corridor.",
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
      "Enhance your business efficiency with proactive IT support right in your neighborhood. Located right on Haddon Avenue, ONPRO IT isn't just another vendor — we're your neighbors, and West Berlin and Camden County businesses are our home turf.",
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
      "Industries served include healthcare, legal, manufacturing, finance, and professional services",
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
        question: "What industries do you serve in Camden County?",
        answer:
          "We work with a diverse range of industries including healthcare, legal, manufacturing, finance, and professional services, and understand the specific compliance and operational requirements of businesses in the South Jersey region.",
      },
      {
        question: "How much does managed IT cost?",
        answer:
          "Our pricing is transparent and based on the number of users and devices in your environment. Most plans range from $100 to $250 per user per month, with a custom quote provided after a free assessment.",
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
      "Cat6 and fiber optic structured cabling installation for businesses across New Jersey. Licensed, certified, and code-compliant. Get a quote from ONPRO IT.",
    keywords: "structured cabling NJ, network cabling New Jersey, Cat6 installation NJ",
    intro:
      "Your trusted local partner for low-voltage wiring, fiber optics, and network infrastructure throughout Southern and Central NJ. Based in Southern NJ, we understand the specific needs of New Jersey businesses, from historic buildings in Haddonfield to modern corporate centers in Mount Laurel.",
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
      "Serving the Greater Philadelphia area and Southeastern PA with professional low-voltage and data cabling solutions. From the high-rises of Center City Philadelphia to the corporate parks of King of Prussia and Malvern, we deliver reliable structured cabling across Pennsylvania.",
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
      "Expert low-voltage wiring and network infrastructure services for businesses across Wilmington, Newark, and Northern Delaware — The First State. We provide the essential connectivity backbone that modern DE businesses rely on for daily operations.",
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
    ],
  },
];

export function getLocationByPath(path: string) {
  return LOCATIONS_DATA.find((l) => l.path === path);
}
