import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Cable,
  Camera,
  Cloud,
  HardDrive,
  Headphones,
  KeyRound,
  Network,
  PhoneCall,
  Presentation,
  Server,
  ShieldCheck,
} from "lucide-react";

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceData {
  slug: string;
  navTitle: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  Icon: LucideIcon;
  heroImage: string;
  secondaryImage?: string;
  intro: string;
  whatIsIt: string[];
  whoItsFor: string[];
  risks: string[];
  howWeDeliver: string[];
  benefits: string[];
  areasServed: string[];
  faqs: ServiceFaq[];
}

// The three ecosystems we set up and support day to day — shown once on the
// homepage rather than repeated across every service page.
export const PLATFORM_ECOSYSTEMS = [
  { name: "Microsoft", logo: "/images/brands/windows.svg" },
  { name: "Google", logo: "/images/brands/google.svg" },
  { name: "Apple", logo: "/images/brands/apple.svg" },
];

// Single canonical list reused by every service page so "areas we serve" is
// consistent site-wide instead of each service inventing its own list/format.
export const SERVICE_AREA_LIST = [
  "Camden County, NJ (Cherry Hill, Voorhees, Haddonfield)",
  "Burlington County, NJ (Mount Laurel, Moorestown, Marlton, Medford)",
  "Gloucester County, NJ (Deptford, Glassboro, Washington Twp)",
  "Mercer County, NJ (Princeton, Trenton, Hamilton)",
  "Greater Philadelphia, PA (Montgomery, Bucks & Delaware Counties)",
  "New Castle County, DE (Wilmington, Newark)",
];

export const SERVICES_DATA: ServiceData[] = [
  {
    slug: "managed-it",
    navTitle: "Managed IT Services",
    h1: "Managed IT Services, Backed by the Team That Built Your Network",
    metaTitle: "Managed IT Services NJ | ONPRO IT",
    metaDescription:
      "ONPRO IT delivers fully managed IT services for businesses in Southern NJ, Philadelphia, and Delaware — proactive monitoring, help desk support, and strategic IT planning for one flat monthly rate.",
    keywords: "managed IT services NJ, MSP Southern NJ, managed service provider New Jersey",
    Icon: Server,
    heroImage: "/images/hero-managed-it.png",
    secondaryImage: "/images/about-team.png",
    intro:
      "Stop worrying about technology and focus on your business. We provide proactive, flat-rate IT management for companies in South Jersey, Delaware, and the Philadelphia Metro area.",
    whatIsIt: [
      "Managed IT Services represent a strategic shift from the traditional \"break-fix\" model — where you only call an IT guy when something breaks — to a proactive, holistic approach. When you partner with ONPRO IT, we take full responsibility for your entire technology environment.",
      "This means we monitor your systems 24/7, apply security patches automatically, back up your critical data, and resolve issues often before you even know they exist. Our approach integrates seamlessly with our cybersecurity services to ensure your infrastructure is not just running, but running securely.",
      "For small and mid-sized businesses in New Jersey and Pennsylvania, hiring a full internal IT department is often cost-prohibitive. Managed services bridge this gap by providing you with a team of certified experts and enterprise-grade tools for a predictable monthly fee.",
    ],
    whoItsFor: [
      "You are a business with 10 to 200 employees",
      "You are frustrated by recurring computer problems and downtime",
      "You are concerned about cybersecurity threats like ransomware",
      "You handle sensitive client data or financial information",
      "You want to budget your IT expenses without surprise repair bills",
      "You need your remote workforce to be secure and productive",
    ],
    risks: [
      "Costly downtime — every minute your server or internet is down, you're losing money in lost productivity and frustrated customers",
      "Security breaches — cybercriminals actively target small businesses as \"soft targets,\" and a single breach can cost hundreds of thousands in fines and remediation",
      "Unpredictable spending — paying for IT support by the hour means costs spike exactly when you can least afford it",
      "Employee frustration — slow computers and constant glitches kill morale and are a leading cause of staff turnover",
    ],
    howWeDeliver: [
      "24/7 Remote Monitoring & Management — lightweight agents on every device feed health data back to our operations center, so we know if a hard drive is failing before it crashes",
      "Unlimited Help Desk Support — your team gets direct access to our local support desk for anything from a password reset to a software error, with technicians dispatched on-site for complex problems",
      "Strategic IT Planning (vCIO) — we meet with you regularly to review your technology roadmap, plan upgrades, and align technology with your long-term business goals",
    ],
    benefits: [
      "Increased operational efficiency through streamlined workflows and reliable systems",
      "Reduced risk with comprehensive security layers protecting your data",
      "Scalability — add new users, locations, or applications effortlessly",
      "Peace of mind knowing a team of professionals is watching over your business 24/7/365",
    ],
    areasServed: SERVICE_AREA_LIST,
    faqs: [
      {
        question: "What does a managed IT services plan typically include?",
        answer:
          "Most ONPRO IT plans include 24/7 network monitoring, unlimited help desk support, patch management, endpoint security, backup monitoring, and a dedicated account manager — all billed at a flat monthly rate per user or device.",
      },
      {
        question: "How is managed IT different from a break-fix IT company?",
        answer:
          "A break-fix provider only gets paid when something is broken, which creates an incentive to react rather than prevent. Managed IT flips that model — we're paid to keep your systems running, so our incentive is to stop problems before they start.",
      },
      {
        question: "Can ONPRO IT work alongside our existing internal IT staff?",
        answer:
          "Yes. Many of our managed IT clients have an internal IT person or small team, and we act as an extension of that team — handling after-hours monitoring, specialized projects, and overflow support.",
      },
    ],
  },
  {
    slug: "it-support",
    navTitle: "IT Help Desk",
    h1: "IT Support & Help Desk Services in NJ, PA & DE",
    metaTitle: "IT Help Desk & Support NJ | ONPRO IT",
    metaDescription:
      "Fast, local IT help desk support for Southern NJ, Philadelphia, and Delaware businesses. Remote and on-site technicians who actually answer the phone.",
    keywords: "IT help desk NJ, IT support Southern NJ, computer support New Jersey",
    Icon: Headphones,
    heroImage: "/images/hero-it-support.png",
    secondaryImage: "/images/about-team.png",
    intro:
      "Fast, reliable, and local tech support for your business. From rapid remote fixes to hands-on onsite troubleshooting, we keep your team productive.",
    whatIsIt: [
      "When technology fails, your business stops. Employees can't work, customers can't be served, and frustration mounts. Our IT Support & Help Desk Services provide you with a dedicated team of technical experts ready to resolve issues the moment they arise.",
      "Unlike generic call centers, our help desk is staffed by local, certified technicians based in the Philadelphia and South Jersey area who understand your specific business environment. We handle everything from simple password resets to complex server outages with a focus on first-call resolution.",
    ],
    whoItsFor: [
      "You need faster response times than your current provider offers",
      "Your employees are wasting time trying to fix computer issues themselves",
      "You want a friendly, local team that speaks plain English, not \"geek speak\"",
      "You have a mix of remote and in-office staff needing support",
    ],
    risks: [
      "Lost productivity — every hour an employee spends fighting with a slow computer is an hour of lost work",
      "Security vulnerabilities — unresolved glitches often mask deeper security issues that hackers can exploit",
      "Employee burnout — constant technical frustration is a leading cause of job dissatisfaction",
      "Missed deadlines — system outages can cause you to miss critical client deliverables",
    ],
    howWeDeliver: [
      "Phone & Chat Support — immediate access to live technicians for quick questions and issues",
      "Secure Remote Access — we can securely view your screen to diagnose and fix 90% of issues instantly",
      "Onsite Dispatch — if a hardware issue requires hands-on attention, we dispatch a technician to your office fast",
    ],
    benefits: [
      "Fast response times — we answer calls quickly and start working on tickets immediately",
      "Local presence — we're neighbors, serving NJ, PA, and DE with boots-on-the-ground support",
      "Accountability — we own the problem until it's solved and don't point fingers at other vendors",
      "Proactive fixes — we often spot and fix issues in the background before they disrupt your day",
    ],
    areasServed: SERVICE_AREA_LIST,
    faqs: [
      {
        question: "How fast does ONPRO IT respond to help desk tickets?",
        answer:
          "Most tickets are acknowledged within minutes and critical issues are prioritized immediately. Our local team means we can also be on-site same-day when remote support isn't enough.",
      },
      {
        question: "Do you support remote and hybrid employees?",
        answer:
          "Yes — our help desk supports employees wherever they're working, with remote access tools that let us troubleshoot laptops and home office setups just as easily as in-office workstations.",
      },
    ],
  },
  {
    slug: "cybersecurity",
    navTitle: "Cybersecurity",
    h1: "Cybersecurity Services for NJ Small Businesses",
    metaTitle: "Cybersecurity Services NJ | ONPRO IT",
    metaDescription:
      "Protect your business from ransomware, phishing, and data breaches with layered cybersecurity from ONPRO IT — serving Southern NJ, Philadelphia, and Delaware.",
    keywords: "cybersecurity NJ, cyber security Southern NJ, ransomware protection New Jersey",
    Icon: ShieldCheck,
    heroImage: "/images/hero-cybersecurity.png",
    secondaryImage: "/images/about-team.png",
    intro:
      "Defend your organization against evolving digital threats. We provide enterprise-level security tailored for small and mid-sized businesses in the Tri-State area.",
    whatIsIt: [
      "Many small business owners believe they are \"too small\" to be targeted by hackers. The reality is the opposite. Cybercriminals actively target small and mid-sized businesses because they typically have valuable data but lack the sophisticated defenses of large corporations.",
      "A single ransomware attack or data breach can be devastating. Beyond the financial cost of the ransom, the downtime and reputational damage can force a company out of business. ONPRO IT implements a multi-layered \"Defense in Depth\" strategy to protect your assets 24/7.",
    ],
    whoItsFor: [
      "You handle important business information, internal systems, or critical operational data",
      "You are concerned about ransomware shutting down your operations",
      "You want to ensure your internal data policies are robust and effective",
      "You have employees working remotely on personal or company devices",
    ],
    risks: [
      "Financial loss — ransom payments, remediation costs, and lost revenue from downtime can cripple cash flow",
      "Reputational damage — losing client trust is often harder to recover from than the financial loss itself",
      "Data liability — data breaches often trigger notification requirements and can lead to customer lawsuits",
      "Operational paralysis — ransomware can lock your files for weeks, making it impossible to conduct business",
    ],
    howWeDeliver: [
      "Prevention (EDR & Firewalls) — AI-driven Endpoint Detection & Response tools and next-gen firewalls block threats before they enter",
      "Detection (24/7 Monitoring) — our team monitors your network around the clock to spot suspicious activity immediately",
      "Training (Human Firewall) — we train your employees to recognize phishing emails and social engineering attacks",
    ],
    benefits: [
      "Data privacy standards — strong security controls to protect sensitive information",
      "Reduced insurance premiums — robust security controls can often help lower your cyber liability insurance costs",
      "Business continuity — protection that minimizes the risk of downtime from cyber events",
      "Client trust — demonstrate to your clients that you take their data privacy seriously",
    ],
    areasServed: SERVICE_AREA_LIST,
    faqs: [
      {
        question: "Is cybersecurity really necessary for a small business?",
        answer:
          "Yes — small and mid-sized businesses are targeted precisely because they tend to have valuable data but weaker defenses than large enterprises. A single incident can be financially devastating.",
      },
      {
        question: "What's included in your cybersecurity package?",
        answer:
          "Our security stack includes next-generation antivirus (EDR), firewall management, email filtering, multi-factor authentication setup, regular security patches, and 24/7 threat monitoring.",
      },
    ],
  },
  {
    slug: "network-wifi",
    navTitle: "Network & WiFi",
    h1: "Network & WiFi Design Services",
    metaTitle: "Network & WiFi Installation NJ | ONPRO IT",
    metaDescription:
      "Enterprise-grade network design, installation, and WiFi solutions for offices, warehouses, and retail locations across Southern NJ, Philadelphia, and Delaware.",
    keywords: "network installation NJ, WiFi setup Southern NJ, business network New Jersey",
    Icon: Network,
    heroImage: "/images/hero-network-wifi.png",
    secondaryImage: "/images/hero-cabling.png",
    intro:
      "Build a foundation for success with robust, high-speed network infrastructure. We eliminate dead zones and ensure secure, seamless connectivity for your team.",
    whatIsIt: [
      "In an era of cloud computing and mobile workforces, your network is the single most critical component of your infrastructure. If your WiFi is spotty or your network is slow, productivity plummets. ONPRO IT provides comprehensive network design, installation, and management services to keep your business connected at lightning speeds.",
      "We specialize in solving complex connectivity challenges for offices, warehouses, schools, and large facilities throughout New Jersey and Pennsylvania — engineering solutions that are scalable, secure, and reliable.",
    ],
    whoItsFor: [
      "Offices experiencing slow internet or dropped connections",
      "Warehouses needing wall-to-wall WiFi for scanners and inventory systems",
      "Schools requiring secure separate networks for students and staff",
      "Businesses moving to a new location needing a fresh network design",
    ],
    risks: [
      "Reduced productivity — waiting for files to load or reconnecting to WiFi wastes hours of employee time",
      "Security gaps — improperly configured routers can leave your internal network exposed to guests or hackers",
      "Poor VoIP quality — network congestion causes choppy phone calls and dropped video conferences",
      "Inventory errors — in warehouses, WiFi dead zones lead to scanning failures and shipping mistakes",
    ],
    howWeDeliver: [
      "Site Survey & Heat Mapping — we analyze your physical space to identify interference and optimal access point placement",
      "Custom Hardware Selection — we select enterprise-grade equipment (Ubiquiti, Aruba) tailored to your needs",
      "Professional Installation — our team runs cabling, mounts hardware, and configures VLANs for security and performance",
    ],
    benefits: [
      "100% coverage — eliminate dead zones in offices and large industrial spaces",
      "Guest security — safely offer WiFi to visitors without exposing internal business data",
      "High speed — support bandwidth-heavy applications like video streaming and large file transfers",
      "Seamless roaming — walk from one end of the building to the other without dropping your connection",
    ],
    areasServed: SERVICE_AREA_LIST,
    faqs: [
      {
        question: "Why is my office WiFi so unreliable?",
        answer:
          "Most WiFi problems come from underpowered consumer-grade routers, poor access point placement, or too many devices competing for bandwidth. A proper site survey identifies the root cause and fixes it permanently.",
      },
      {
        question: "Do you provide guest WiFi separate from our business network?",
        answer:
          "Yes — we configure VLANs and segmented guest networks so visitors get internet access without any path into your internal business systems.",
      },
    ],
  },
  {
    slug: "cloud",
    navTitle: "Cloud Solutions",
    h1: "Cloud Services & Microsoft 365 Migration",
    metaTitle: "Cloud Services & Microsoft 365 NJ | ONPRO IT",
    metaDescription:
      "Migrate to the cloud with confidence. ONPRO IT manages Microsoft 365, cloud backup, and secure remote access for businesses across Southern NJ, Philadelphia, and Delaware.",
    keywords: "cloud services NJ, Microsoft 365 NJ, cloud migration New Jersey",
    Icon: Cloud,
    heroImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    secondaryImage: "/images/about-team.png",
    intro:
      "Modernize your business with secure, scalable cloud solutions. We simplify your transition to the cloud so you can work securely from anywhere.",
    whatIsIt: [
      "The cloud has revolutionized how businesses operate, eliminating the need for expensive on-premise servers and enabling seamless collaboration. ONPRO IT is your trusted partner for cloud adoption in New Jersey and Pennsylvania.",
      "We specialize in migrating small and mid-sized businesses to modern platforms like Microsoft 365 and Azure. Whether you need to move email off a legacy server, set up secure file-sharing in SharePoint, or virtualize your desktop environment, we handle the planning, licensing, migration, and ongoing support.",
    ],
    whoItsFor: [
      "You have a remote or hybrid workforce needing access to files from anywhere",
      "You want to stop buying expensive physical servers every 5 years",
      "You need better collaboration tools like Teams and real-time document editing",
      "You are concerned about data backup and disaster recovery",
    ],
    risks: [
      "Hardware failure — physical servers have a 100% failure rate eventually, leading to sudden downtime",
      "Limited access — VPNs can be slow and clunky, frustrating remote employees",
      "High upfront costs — capital expenditures for new servers hit your cash flow hard",
      "Missed security patches — manual maintenance of local servers often leads to gaps in updates",
    ],
    howWeDeliver: [
      "Assessment & Planning — we inventory your current data and applications to design the right cloud architecture",
      "Seamless Migration — we move your email, files, and settings to the cloud with minimal disruption to your team",
      "Training & Support — we help your staff master new tools like Microsoft Teams and OneDrive",
    ],
    benefits: [
      "Scalability — add or remove users and storage instantly as your business changes",
      "Cost predictability — move from capital expenses to predictable monthly subscription pricing",
      "Enhanced security — benefit from Microsoft and Google's multi-billion dollar security investments",
      "Automatic updates — always have the latest versions of software without manual upgrades",
    ],
    areasServed: SERVICE_AREA_LIST,
    faqs: [
      {
        question: "Is it safe to move our email and files to the cloud?",
        answer:
          "Yes, when configured correctly. ONPRO IT sets up multi-factor authentication, proper permission structures, and backup policies so your cloud environment is more secure than most on-premise setups.",
      },
      {
        question: "Do we still need backups if we use Microsoft 365?",
        answer:
          "Yes. Microsoft's built-in retention is not a full backup solution — we back up Microsoft 365 email and OneDrive data separately, since Microsoft does not protect it for you.",
      },
    ],
  },
  {
    slug: "backup-recovery",
    navTitle: "Data Backup & Recovery",
    h1: "Backup & Disaster Recovery Services",
    metaTitle: "Data Backup & Disaster Recovery NJ | ONPRO IT",
    metaDescription:
      "Protect your business from data loss with automated backup and disaster recovery from ONPRO IT — serving Southern NJ, Philadelphia, and Delaware.",
    keywords: "data backup NJ, disaster recovery Southern NJ, business continuity New Jersey",
    Icon: HardDrive,
    heroImage: "/images/hero-backup-recovery.png",
    secondaryImage: "/images/about-team.png",
    intro:
      "Protect your business data from ransomware, hardware failure, and human error. We ensure you can recover fast and keep working no matter what happens.",
    whatIsIt: [
      "Imagine walking into your office tomorrow and all your data was gone. Could your business survive? Traditional file backups are no longer enough in an age of sophisticated ransomware and immediate operational demands.",
      "ONPRO IT provides robust Business Continuity and Disaster Recovery (BCDR) solutions for businesses in New Jersey and Pennsylvania. We ensure not only that your data is safe, but that your operations can get back up and running in minutes, not days.",
    ],
    whoItsFor: [
      "You cannot afford to be offline for more than an hour",
      "You are still using rotating external hard drives or tapes",
      "You are concerned about ransomware locking your files",
      "You have not tested a restore in the last 6 months",
    ],
    risks: [
      "Ransomware payments — hackers demand thousands to unlock data, with no guarantee they will actually do it",
      "Operational downtime — the cost of idle employees and halted production often exceeds the value of the data itself",
      "Client trust — losing client records or project data can severely damage your professional reputation",
      "Lost intellectual property — years of work can be wiped out in an instant by a server crash or fire",
    ],
    howWeDeliver: [
      "Automated Hourly Backups — we take snapshots of your entire server every hour, not just once a night",
      "Daily Verification — our team manually checks backup logs and screens to ensure successful completion",
      "Rapid Virtualization — if a server dies, we can boot your backup as a virtual machine instantly, keeping you online",
    ],
    benefits: [
      "Ransomware defense — our backups are immutable, meaning hackers cannot delete or encrypt them",
      "Hybrid protection — local appliances for speed, cloud storage for disaster redundancy",
      "SaaS protection — we also back up Microsoft 365 email and OneDrive, which Microsoft does not protect for you",
      "Regular testing — we perform test restores to prove your data is recoverable before you need it",
    ],
    areasServed: SERVICE_AREA_LIST,
    faqs: [
      {
        question: "How often should our business data be backed up?",
        answer:
          "We take automated snapshots of your entire server every hour, not just once a night, with daily manual verification of backup logs to confirm every job completed successfully.",
      },
      {
        question: "What's the difference between backup and disaster recovery?",
        answer:
          "Backup is having a copy of your data. Disaster recovery is the full plan and process for getting your business back up and running after an outage — including rapid virtualization of a failed server, not just whether the files exist.",
      },
    ],
  },
  {
    slug: "cabling",
    navTitle: "Structured Cabling",
    h1: "Structured Cabling & Low Voltage Wiring",
    metaTitle: "Structured Cabling Installation NJ | ONPRO IT",
    metaDescription:
      "Cat6, fiber optic, and structured cabling installation for businesses across New Jersey, Philadelphia, and Delaware. Certified and code-compliant.",
    keywords: "structured cabling NJ, Cat6 cabling NJ, fiber optic NJ, network cabling installation",
    Icon: Cable,
    heroImage: "/images/hero-cabling.png",
    secondaryImage: "/images/hero-network-wifi.png",
    intro:
      "The physical backbone of your business network. We provide professional Cat6 and fiber optic installation, testing, and certification for offices and new construction in NJ, PA, and DE.",
    whatIsIt: [
      "Your network is only as strong as its weakest link. Often, that weak link is poor-quality cabling buried in your walls or ceilings. Structured cabling is the critical infrastructure that supports all your voice, data, and video traffic. At ONPRO IT, we deliver neat, code-compliant, and high-performance low-voltage wiring solutions.",
      "Whether you are moving into a new office, constructing a building, or expanding your current facility, our team of experienced installers ensures your cabling is organized, labeled, and certified.",
    ],
    whoItsFor: [
      "Companies moving to a new office space",
      "General contractors managing new construction projects",
      "Businesses upgrading their network for higher speeds",
      "Warehouses needing fiber backbones for long distances",
    ],
    risks: [
      "Intermittent connectivity — poor terminations cause random network drops that are hard to diagnose",
      "Slow speeds — substandard cable or interference can severely limit your network bandwidth",
      "Messy server rooms — \"spaghetti\" cabling makes it impossible to troubleshoot or trace connections",
      "Code violations — improperly hung cable can violate fire codes and fail building inspections",
    ],
    howWeDeliver: [
      "Site Survey & Design — we walk your site to plan cable paths, drop locations, and IDF/MDF placement",
      "Rough-In & Installation — our team runs cable through ceilings, walls, and conduit using industry-standard support structures",
      "Termination & Testing — we terminate jacks and panels, then test every run with professional Fluke meters for certification",
    ],
    benefits: [
      "Certified performance — we guarantee our cabling meets TIA/EIA performance standards",
      "Neat & organized — velcro, cable management arms, and proper labeling for a professional finish",
      "Quality materials — only high-quality, plenum-rated cable and reliable connectors",
      "Project management — we coordinate with your general contractor and other trades to stay on schedule",
    ],
    areasServed: SERVICE_AREA_LIST,
    faqs: [
      {
        question: "What's the difference between Cat6 and Cat6A cabling?",
        answer:
          "Cat6A supports higher bandwidth over longer distances than standard Cat6, making it a better choice for businesses planning for 10-gigabit network speeds or larger facilities.",
      },
      {
        question: "Do you handle cabling for new construction and office renovations?",
        answer:
          "Yes, we work directly with general contractors on new builds and renovations to plan cable pathways, and every run is tested and certified to TIA/EIA standards with a Fluke meter before we close out the project.",
      },
    ],
  },
  {
    slug: "av-integration",
    navTitle: "AV & Conference Room Systems",
    h1: "Audio-Visual Integration for Conference Rooms & Workspaces",
    metaTitle: "AV Installation & Conference Room Systems NJ | ONPRO IT",
    metaDescription:
      "Conference room displays, video conferencing, digital signage, and sound system installation for businesses in Southern NJ, Philadelphia, and Delaware — designed and installed by ONPRO IT.",
    keywords: "AV installation NJ, conference room technology, video conferencing setup, digital signage NJ",
    Icon: Presentation,
    heroImage: "/images/about-conference-room.jpg",
    secondaryImage: "/images/about-team.png",
    intro:
      "Meetings shouldn't start with ten minutes of someone fumbling with an HDMI cable. We design and install the audio-visual systems that make your conference rooms, huddle spaces, and lobbies actually work — and because we're already your network and IT provider, everything talks to everything else on day one.",
    whatIsIt: [
      "Most AV vendors show up once, mount a TV, plug in a soundbar, and leave — and if the video call drops or the display won't wake up six months later, you're on your own trying to figure out whether it's the display, the network, or the software. Because ONPRO IT designs your network, your WiFi, and your AV together as one system, that failure mode mostly disappears.",
      "We handle conference room video conferencing (Teams Rooms, Zoom Rooms), display and projector mounting, ceiling and soundbar audio, digital signage for lobbies and break rooms, and the low-voltage cabling and network configuration that ties it all together — one crew, one invoice, one company to call when something's wrong.",
    ],
    whoItsFor: [
      "You're outfitting a new office or renovating existing conference rooms",
      "Video calls in your conference room are a constant struggle with cables, adapters, or dropped connections",
      "You want digital signage in your lobby, break room, or retail space",
      "You're standardizing multiple rooms so every space works the same way for every employee",
    ],
    risks: [
      "Wasted meeting time — every minute spent troubleshooting a display or dial-in is a room full of people getting paid to wait",
      "Inconsistent rooms — when every conference room is configured differently, employees never know what to expect walking in",
      "Vendor finger-pointing — a separate AV vendor and IT provider can each blame the other when a system stops working",
      "Outdated technology — legacy projectors and wired-only rooms make hybrid meetings frustrating for remote participants",
    ],
    howWeDeliver: [
      "Room Design — we plan camera placement, display size, and audio coverage based on the actual room dimensions and how your team meets",
      "Professional Installation — in-wall and in-ceiling cabling, display mounting, and equipment rack setup, all consistent across every room",
      "Network Integration — because we manage your network too, we configure VLANs and bandwidth priority so video calls stay clear even when the office WiFi is busy",
    ],
    benefits: [
      "Walk-in-and-go simplicity — one-touch meeting start on Teams or Zoom Rooms, no adapters or guesswork",
      "Consistency — every conference room configured and labeled the same way, so training is a non-issue",
      "One point of accountability — the same company that installed your AV also manages your network, so there's no vendor to point fingers at",
      "Scalable — add new rooms or locations using the same standardized design",
    ],
    areasServed: SERVICE_AREA_LIST,
    faqs: [
      {
        question: "Do you install video conferencing systems for Microsoft Teams or Zoom Rooms?",
        answer:
          "Yes — we design and install certified Teams Rooms and Zoom Rooms setups, including cameras, microphones, displays, and the room controller, configured for one-touch meeting joins.",
      },
      {
        question: "Can you fix our existing conference room instead of a full replacement?",
        answer:
          "Often, yes. Many conference room problems come down to network configuration or an underpowered device rather than the hardware itself — we start with an assessment before recommending a full teardown.",
      },
      {
        question: "Do you handle digital signage as well as conference rooms?",
        answer:
          "Yes — lobby displays, break room signage, and retail digital menus are all part of our AV integration work, managed through the same network infrastructure we already support for you.",
      },
    ],
  },
  {
    slug: "security-cameras",
    navTitle: "Network AI Security Cameras",
    h1: "Network AI Security Cameras for Business",
    metaTitle: "Security Camera Installation NJ | ONPRO IT",
    metaDescription:
      "AI-powered network security cameras, designed, installed, and managed by ONPRO IT for businesses in Southern NJ, Philadelphia, and Delaware.",
    keywords: "security camera installation NJ, business surveillance cameras, AI security cameras, video surveillance NJ",
    Icon: Camera,
    heroImage: "/images/hero-cybersecurity.png",
    secondaryImage: "/images/about-team.png",
    intro:
      "See what's happening at your business from anywhere, without hiring a separate security vendor. We design, install, and manage AI-powered network security cameras as part of the same network we already build and support.",
    whatIsIt: [
      "Modern security cameras aren't standalone boxes anymore — they're network devices, which means they belong on the same network your IT provider is already responsible for. When your camera system and your IT provider are two different companies, nobody owns the whole picture: is the camera down because of the camera, the network switch, or the internet connection? We remove that ambiguity by designing, installing, and managing both as one system.",
      "Our camera systems use AI-based analytics — motion and person detection, vehicle recognition, and smart alerts — instead of just recording footage nobody watches until after something happens.",
    ],
    whoItsFor: [
      "You want to see what's happening at your business remotely, from a phone or laptop",
      "You've had theft, vandalism, or unauthorized access and want a real deterrent and record",
      "You want smart alerts instead of scrubbing through hours of raw footage after an incident",
      "You're opening a new location and want cameras designed in from day one",
    ],
    risks: [
      "Blind spots — outdated or poorly placed cameras leave gaps that only become obvious after an incident",
      "Vendor confusion — a security camera vendor who doesn't manage your network can't diagnose whether an outage is the camera, the switch, or the internet",
      "Footage you can't use — cameras that only record locally, with no remote access or smart alerts, are of little help after the fact",
      "Missed incidents — without smart alerts, footage often goes unwatched until it's too late to matter",
    ],
    howWeDeliver: [
      "Site Survey & Camera Placement — we plan coverage based on your building's actual layout and risk areas",
      "Professional Installation — cabling, mounting, and configuration completed by our own technicians, integrated with the network we already manage",
      "AI Configuration & Ongoing Management — smart alerts and analytics set up and monitored for the life of your business",
    ],
    benefits: [
      "Remote visibility — check in on your business from anywhere with an internet connection",
      "AI-based alerts — get notified of relevant activity instead of scrubbing through hours of footage",
      "One point of accountability — the same team that manages your network also manages your cameras",
      "Scalable — add new locations using the same standardized design",
    ],
    areasServed: SERVICE_AREA_LIST,
    faqs: [
      {
        question: "Do your security cameras use AI?",
        answer:
          "Yes — our camera systems include AI-based analytics like person and vehicle detection and smart motion alerts, so you're notified about activity that actually matters instead of every passing car or shadow.",
      },
      {
        question: "What happens if my camera system goes offline?",
        answer:
          "Because we also manage the network your cameras run on, we can immediately tell whether an outage is the camera, the switch, or the internet connection — instead of leaving you stuck between two vendors pointing fingers.",
      },
      {
        question: "Do you install cameras for new construction or office moves?",
        answer:
          "Yes — we plan camera placement and cabling as part of the same design process we use for your network, so coverage is built in from day one instead of added as an afterthought.",
      },
    ],
  },
  {
    slug: "entry-access-control",
    navTitle: "Entry Access Control Systems",
    h1: "Entry Access Control Systems for Business",
    metaTitle: "Entry Access Control Installation NJ | ONPRO IT",
    metaDescription:
      "Keyless entry and access control systems, designed, installed, and managed by ONPRO IT for businesses in Southern NJ, Philadelphia, and Delaware.",
    keywords: "entry access control NJ, keyless entry systems, commercial door access control, key fob access control",
    Icon: KeyRound,
    heroImage: "/images/about-conference-room.jpg",
    secondaryImage: "/images/about-team.png",
    intro:
      "Control who can get into your building and when, without a drawer full of spare keys or a locksmith bill every time someone leaves. We design, install, and manage entry access control as part of the same network we already build and support.",
    whatIsIt: [
      "Traditional keys have a fundamental problem: they can't tell you who used them or when, and a lost or copied key means re-keying every affected lock. Entry access control replaces that with key fobs, keypads, and remote-managed door locks tied to a system you actually control.",
      "Because we also manage the network these systems run on, access control isn't a standalone silo — credentials, access logs, and door hardware are integrated with the same infrastructure we already support, not a separate vendor's app you have to check independently.",
    ],
    whoItsFor: [
      "You're tired of managing physical keys and re-keying locks every time an employee leaves",
      "You need to restrict certain areas to certain employees or specific hours",
      "You want a log of who entered your building and when",
      "You're managing access across multiple doors or multiple locations and want it centralized",
    ],
    risks: [
      "Lost or copied keys — traditional locks can't tell you who actually used them or when",
      "Former employees with keys — physical keys don't get automatically revoked when someone leaves",
      "No record of access — without logs, you have no way to know who entered a space or when",
      "Inconsistent rules — managing access door-by-door or location-by-location gets unmanageable as you grow",
    ],
    howWeDeliver: [
      "Access Plan Design — we map which doors and areas need control and who needs access to each",
      "Professional Installation — door hardware, controllers, and credential readers installed and wired into the network we already manage",
      "Ongoing Management — grant or revoke credentials remotely, monitor system health, and pull access logs whenever you need them",
    ],
    benefits: [
      "Keyless entry — grant or revoke building access instantly without re-keying a single lock",
      "Access logs — know who entered your building and when",
      "Centralized control — manage every door across every location from one system",
      "One point of accountability — the same team that manages your network also manages your access control",
    ],
    areasServed: SERVICE_AREA_LIST,
    faqs: [
      {
        question: "Can I control building access without traditional keys?",
        answer:
          "Yes — our entry access control systems support key fobs, keypads, and remote-managed door locks, so you can grant or revoke access instantly instead of re-keying locks.",
      },
      {
        question: "Can I see who entered our building and when?",
        answer:
          "Yes — every credential use is logged, so you can pull a record of who accessed a door and when, rather than relying on physical keys with no audit trail.",
      },
      {
        question: "Do you handle access control across multiple locations?",
        answer:
          "Yes — we design centralized systems so you can manage credentials and view access logs across every location from a single system, instead of managing each site separately.",
      },
    ],
  },
  {
    slug: "consulting",
    navTitle: "IT Consulting",
    h1: "IT Consulting & vCIO Services",
    metaTitle: "IT Consulting Services NJ | ONPRO IT",
    metaDescription:
      "Strategic IT consulting and technology planning for businesses in Southern NJ, Philadelphia, and Delaware. Align your technology budget with your business goals.",
    keywords: "IT consulting NJ, IT strategy Southern NJ, technology consulting New Jersey",
    Icon: Briefcase,
    heroImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    secondaryImage: "/images/about-team.png",
    intro:
      "Technology leadership without the C-suite salary. Strategic planning to help you make informed decisions, control costs, and align your IT roadmap with your business goals.",
    whatIsIt: [
      "Many small business owners make technology decisions in a vacuum — buying hardware when it breaks or subscribing to software without a long-term plan. This reactive approach leads to wasted budget, disjointed systems, and missed opportunities.",
      "Our IT Consulting & Virtual CIO (vCIO) services bridge the gap between business strategy and technical execution. We act as your high-level technology partner, providing the same strategic guidance a Chief Information Officer would provide to a large enterprise, but at a fraction of the cost.",
    ],
    whoItsFor: [
      "You feel your IT spending is a black hole with no clear ROI",
      "You are planning a major move, expansion, or acquisition",
      "You are worried about security gaps and operational risks",
      "You want technology to drive growth, not just support operations",
    ],
    risks: [
      "Buying incompatible software or hardware without a plan",
      "Overspending on unnecessary licenses",
      "Falling behind competitors who use technology more effectively",
      "Security gaps due to ad-hoc policy implementation",
    ],
    howWeDeliver: [
      "Tech Assessment — we evaluate your current maturity level and identify gaps",
      "Roadmap Creation — we build a 1-3 year plan for upgrades, budgeting, and projects",
      "Quarterly Business Reviews (QBR) — we meet regularly to review progress, budget, and new business needs",
    ],
    benefits: [
      "Predictable budgeting — move from surprise bills to planned investments",
      "Vendor management — we handle your ISPs and software vendors so you don't have to",
      "Digital transformation — identify workflows that can be automated or digitized",
      "Competitive edge — leverage new technology to serve your customers better",
    ],
    areasServed: SERVICE_AREA_LIST,
    faqs: [
      {
        question: "Do we need a full IT department to benefit from consulting?",
        answer:
          "No. Many of our consulting clients have little or no internal IT staff. ONPRO IT provides the strategic guidance typically offered by a CIO, sized to fit a small or mid-sized business.",
      },
      {
        question: "Can IT consulting work alongside our current managed IT provider?",
        answer:
          "Yes, consulting engagements can run independently as an unbiased second opinion, or be combined with ONPRO IT's managed services for a fully integrated approach.",
      },
    ],
  },
  {
    slug: "voip",
    navTitle: "VoIP Phone Systems",
    h1: "VoIP Phone Systems for Modern Businesses",
    metaTitle: "VoIP Phone Systems NJ | ONPRO IT",
    metaDescription:
      "Reliable, feature-rich VoIP business phone systems for companies across Southern NJ, Philadelphia, and Delaware. Lower costs, more features, easy to scale.",
    keywords: "VoIP NJ, business phone systems Southern NJ, VoIP installation New Jersey",
    Icon: PhoneCall,
    heroImage: "/images/hero-voip.jpg",
    secondaryImage: "/images/voip-team.png",
    intro:
      "Replace your outdated phone lines with a flexible, cloud-based communication platform that travels with you everywhere.",
    whatIsIt: [
      "Your phone system is the lifeline of your business. In today's hybrid work environment, being tied to a desk phone is no longer an option. Our VoIP (Voice over IP) solutions provide crystal-clear voice quality, robust features, and the flexibility to work from anywhere — all while lowering your monthly telecommunications costs.",
      "We don't just sell you phones; we deliver a fully managed communication platform that integrates perfectly with your existing IT infrastructure. Because we also manage your network, we can guarantee Quality of Service settings are correct, preventing choppy calls and eliminating \"vendor ping-pong\" between your phone company and IT provider.",
    ],
    whoItsFor: [
      "Businesses paying high monthly costs for traditional phone lines (PRI/POTS)",
      "Companies with remote or multi-location teams needing unified calling",
      "Organizations that have outgrown a basic phone system's features",
      "Businesses opening a new location and needing phones installed quickly",
    ],
    risks: [
      "Limited features like call routing, voicemail-to-email, or mobile apps",
      "Difficulty scaling phone service as the business adds staff or locations",
      "Choppy calls and dropped video conferences when phone and IT vendors don't coordinate",
    ],
    howWeDeliver: [
      "Cloud-hosted PBX setup with auto-attendant and IVR menus configured for your business",
      "Mobile app and desktop softphone deployment for iOS, Android, and desktop",
      "Local installation, number porting, and staff training so the switch is seamless",
    ],
    benefits: [
      "Lower, more predictable monthly phone bills compared to traditional lines",
      "HD voice quality with call recording and analytics included standard",
      "Keep your existing phone numbers — no disruption to your business",
      "No long-term contracts — we earn your business every month",
    ],
    areasServed: SERVICE_AREA_LIST,
    faqs: [
      {
        question: "Will VoIP call quality be as good as a traditional phone line?",
        answer:
          "With a properly configured network — which we assess and optimize for Quality of Service before installation — VoIP call quality matches or exceeds traditional phone lines, with far more features.",
      },
      {
        question: "Can employees use VoIP phones when working remotely?",
        answer:
          "Yes — our mobile app and desktop softphone let remote employees make and receive calls on their business number from anywhere with internet access, while keeping their personal number private.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return SERVICES_DATA.find((s) => s.slug === slug);
}
