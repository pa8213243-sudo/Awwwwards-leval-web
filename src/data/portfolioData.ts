import { 
  Project, 
  AnalyticsDashboard, 
  Certification, 
  TimelineItem, 
  SkillCategory, 
  ProcessStage 
} from '../types';

export const PERSONAL_INFO = {
  name: 'Parvej Alam',
  fullName: 'Parvej Alam Sulemanali Ansari',
  role: 'Finance Specialist & Strategic Data Analyst',
  subRole: 'CMA USA — Part 1 Cleared (Merit Score: 380/500)',
  tagline: 'Bridging Financial Precision with Strategic Analytics',
  heroHeadline: 'I build decisions from numbers, strategy & data.',
  aboutBio: `I am a finance professional and CMA USA candidate (Part 1 cleared in 1st attempt with 380/500 score) dedicated to transforming complex financial data into high-stakes strategic intelligence. My expertise spans 3-statement financial modeling, corporate valuation, Activity-Based Costing (ABC), Power BI telemetry dashboards, and automated Excel data workflows.`,
  aboutBulletPoints: [
    'Cleared CMA USA Part 1 on 1st attempt with a merit score of 380/500',
    'Advanced expertise in 3-Statement Financial Modeling & Valuation',
    'Power BI & DAX Specialist: Building real-time corporate telemetry dashboards',
    'Excel Automation Expert: Power Query M, VBA macros & financial data pipelines'
  ],
  email: 'bhaiparwej70@gmail.com',
  secondaryEmail: 'bhaiparwej70@gmail.com',
  location: 'India / Global Remote & Strategy Consulting',
  status: 'Available for FP&A, Financial Modeling & Data Analytics Roles',
  stats: [
    { label: 'CMA Part 1 Score', value: '380/500' },
    { label: 'Financial Models Built', value: '25+' },
    { label: 'Interactive Dashboards', value: '15+' },
    { label: 'Reconciliation Precision', value: '99.4%' }
  ],
  socials: {
    linkedin: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928b/',
    github: 'https://github.com/pa8213243-sudo/ParvejPortfolio',
    linkedinCerts: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/',
    email: 'mailto:bhaiparwej70@gmail.com?subject=Strategic%20Finance%20%26%20Analytics%20Inquiry'
  }
};

export const PROJECTS: Project[] = [
  // --- 2 EXCEL PROJECTS ---
  {
    id: 'h2-venture-excel',
    title: 'H2 Ventures — Venture Capital Excel Model',
    category: 'Excel & Automation',
    year: '2026',
    tagline: 'Venture Capital cash flow valuation model & portfolio investment analysis.',
    client: 'H2 Ventures Simulation',
    impactMetric: 'VC Portfolio Analytics',
    summary: 'Constructed an integrated Excel financial model for venture capital portfolio evaluation, fund deployment schedules, and cap table returns.',
    objective: 'Evaluate venture funding rounds, valuation sensitivities, and IRR equity distribution.',
    problem: 'Early-stage startup financials required standardized DCF and market multiple benchmarking under extreme uncertainty.',
    approach: [
      'Built dynamic 3-statement projections linked with venture funding milestones.',
      'Constructed scenario managers for Bull, Base, and Bear startup growth trajectories.',
      'Derived Cap Table equity dilution schedules across Seed to Series B rounds.'
    ],
    tools: ['Advanced Excel', 'Financial Modeling', 'VCA Valuation', 'Scenario Manager', 'Power Query'],
    deliverables: [
      'Integrated VC Valuation Model (.xlsx)',
      'Cap Table & Sensitivity Analysis',
      'Investment Memorandum Summary'
    ],
    results: [
      'Achieved dynamic sensitivity mapping for hurdle rates vs exit multiples.',
      'Standardized cash burn rate forecasting for portfolio startups.'
    ],
    externalUrl: 'https://1drv.ms/x/c/25C3AC5424753CC0/IQBgQIzkWjLnSo_uKB2ETmCeAZt4Jvwm7LfsGANFlXp7dKI?e=e3K0hz',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'huskie-motor-excel',
    title: 'Huskie Motor — Corporate Financial Model',
    category: 'Excel & Automation',
    year: '2026',
    tagline: 'Comprehensive automotive financial evaluation & capex sensitivity workbook.',
    client: 'Huskie Motor Analysis',
    impactMetric: 'Capex & Margin Audit',
    summary: 'Detailed financial modeling analyzing revenue drivers, working capital needs, and capital expenditure for Huskie Motor operations.',
    objective: 'Provide executive stakeholders with a clear 3-statement model and break-even analysis.',
    problem: 'Operating cost inflation threatened gross margins across production lines.',
    approach: [
      'Mapped cost of goods sold (COGS) into fixed vs variable components.',
      'Engineered break-even volume calculators and cash flow stress tests.'
    ],
    tools: ['Excel', 'Financial Accounting', 'Capex Modeling', 'Break-Even Analysis', 'VBA Macros'],
    deliverables: ['Huskie Motor Financial Model (.xlsx)', 'Variance Breakdown Sheet'],
    results: ['Identified key cost drivers reducing operational cash drain.'],
    externalUrl: 'https://1drv.ms/x/c/25C3AC5424753CC0/IQCBkr4p3sKyS56DqLOhEZuRAaA8pCvzItA3AiHdqcJgp7g?e=EpglaD',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    featured: true
  },

  // --- 2 POWERPOINT PROJECTS ---
  {
    id: 'bmw-presentation',
    title: 'BMW Group Strategic Strategy Presentation',
    category: 'Corporate Presentation',
    year: '2026',
    tagline: 'Strategic corporate evaluation, EV transition & financial performance deck.',
    client: 'Corporate Strategy Case Study',
    impactMetric: 'Strategy Presentation',
    summary: 'Executive presentation deck examining BMW Group strategic positioning, financial highlights, and electric vehicle market expansion.',
    objective: 'Deliver concise strategic storytelling for C-suite decision makers.',
    problem: 'Communicating complex automotive financial shifts requires clear visual narrative framing.',
    approach: [
      'Synthesized annual report data into crisp financial charts and strategic takeaways.',
      'Visualized EV capex allocations and regional revenue contributions.'
    ],
    tools: ['PowerPoint', 'Financial Storytelling', 'Strategic Analysis', 'Executive Formatting'],
    deliverables: ['BMW Group Strategic Presentation (.pptx)'],
    results: ['Commended for high-impact visual clarity and executive formatting.'],
    externalUrl: 'https://1drv.ms/p/c/25C3AC5424753CC0/IQAmourAEOwiQJUDHGf7qSZYAfVf4LEpxkwfXU9dB2pTGQo?e=UxTunX',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-road-41382-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'ma-presentation',
    title: 'Mergers & Acquisitions Strategic Valuation Deck',
    category: 'Corporate Presentation',
    year: '2026',
    tagline: 'M&A deal structuring, synergy valuation & board presentation.',
    client: 'M&A Advisory Simulation',
    impactMetric: 'Synergy & Valuation Deck',
    summary: 'Comprehensive M&A board presentation outlining target valuation, post-merger cost synergies, and debt payback schedules.',
    objective: 'Provide investment committee members with clear M&A deal rationale.',
    problem: 'Board members needed rapid clarity on leverage limits and synergy realization milestones.',
    approach: [
      'Modeled synergy realization timelines across SG&A and procurement.',
      'Designed executive slides summarizing DCF valuation ranges and LBO returns.'
    ],
    tools: ['PowerPoint', 'M&A Advisory', 'Synergy Valuation', 'Board Deck'],
    deliverables: ['M&A Strategic Valuation Presentation (.pptx)'],
    results: ['Framed M&A transaction parameters effectively.'],
    externalUrl: 'https://1drv.ms/p/c/25C3AC5424753CC0/IQB2hXrTbZwZQLNkoTf7Xn1YAe96XVWz1uEPRSrixTJE_Zs?e=1v6Ufo',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
    featured: true
  },

  // --- 3 POWER BI PROJECTS ---
  {
    id: 'powerbi-executive-pl',
    title: 'Multi-Entity Executive P&L Telemetry & Cash Flow Forecaster',
    category: 'Power BI & DAX',
    year: '2026',
    tagline: 'Interactive Power BI telemetry dashboard with 1.25M+ rows & Star Schema DAX.',
    client: 'Enterprise Financial Telemetry',
    impactMetric: '1.25M+ Rows Analyzed',
    summary: 'Executive Power BI dashboard processing multi-subsidiary ledger transactions with rolling 12M cash flow forecasting, EBITDA drill-throughs, and automated FX conversions.',
    objective: 'Provide C-suite leaders with sub-second financial visibility across global operating units.',
    problem: 'Disjointed subsidiary financial reporting caused 2-week delays in monthly consolidation.',
    approach: [
      'Architected a Star Schema data model in Power BI with 1:N relational links.',
      'Authored 85+ optimized DAX measures for Time Intelligence (YTD, YoY, Rolling 12M).',
      'Configured Row-Level Security (RLS) for departmental visibility governance.'
    ],
    tools: ['Power BI', 'Advanced DAX', 'Power Query M', 'SQL Server', 'Star Schema'],
    deliverables: [
      'Executive P&L Power BI Dashboard (.pbix)',
      'DAX Measure Library & Data Dictionary',
      'Row-Level Security Architecture Manual'
    ],
    results: [
      'Cut monthly consolidation time from 14 days to real-time interactive refreshes.',
      'Identified Q3 working capital cash gaps saving $45,000 in interest penalties.'
    ],
    externalUrl: 'https://1drv.ms/x/c/25C3AC5424753CC0/IQDSKxCnOaQ7T6XgwsAH7Q2dAco3sSdhusbJ1Go1YYQ9kg8?e=mU66Oo',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'powerbi-supply-chain',
    title: 'Supply Chain & Cost Center Variance Telemetry System',
    category: 'Power BI & DAX',
    year: '2026',
    tagline: 'Real-time Power BI freight variance, inventory holding cost & logistics telemetry.',
    client: 'Supply Chain & Operations Audit',
    impactMetric: '850K+ Inventory Logs',
    summary: 'Operational Power BI telemetry dashboard monitoring freight rate variances, inventory holding cost efficiency, and stockout risk indicators across distribution networks.',
    objective: 'Identify cost leakage in carrier freight contracts and warehouse inventory turnover.',
    problem: 'Freight inflation and unmonitored carrier surcharge variances eroded gross operating margins.',
    approach: [
      'Ingested 850,000+ logistics logs using automated Power Query M pipelines.',
      'Built custom DAX variance measures isolating standard vs actual cost deltas.',
      'Designed interactive visual heatmaps highlighting high-cost distribution routes.'
    ],
    tools: ['Power BI', 'DAX', 'Power Query M', 'Excel Data Models', 'Cost Variance Analysis'],
    deliverables: [
      'Supply Chain Telemetry Dashboard (.pbix)',
      'Freight Variance Matrix & Carrier Scorecard'
    ],
    results: [
      'Uncovered $82,400 in carrier rate overcharges for vendor invoice credit recovery.',
      'Reduced inventory holding costs by 8.5% QoQ via turnover optimization.'
    ],
    externalUrl: 'https://1drv.ms/x/c/25C3AC5424753CC0/IQCk8lYOyo5vRrSzyKrhqtLzAX2NQk7Tk2-iLaL2ufh_etA?e=EBPlxf',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'powerbi-fpa-dashboard',
    title: 'Enterprise FP&A Financial Control & Revenue Analytics Dashboard',
    category: 'Power BI & DAX',
    year: '2026',
    tagline: 'Sub-second DAX time intelligence dashboard for C-suite revenue & margin analysis.',
    client: 'Corporate FP&A Strategy',
    impactMetric: 'Real-Time Financial Control',
    summary: 'Comprehensive enterprise Power BI dashboard unifying revenue performance, product margin contribution, OPEX variance, and budget vs actual financial controls.',
    objective: 'Deliver interactive C-suite executive dashboard for rapid financial decision-making.',
    problem: 'Static quarterly PDF slide packs lacked drill-down depth and delayed strategic responses.',
    approach: [
      'Engineered dynamic DAX switch parameters allowing instant currency and metric toggling.',
      'Constructed Waterfall charts visualizing revenue bridge from budget targets to actuals.',
      'Implemented Microsoft Fabric Dataflows Gen2 for automated cloud ETL refresh.'
    ],
    tools: ['Power BI', 'Microsoft Fabric', 'Advanced DAX', 'Power Query', 'Financial Planning'],
    deliverables: [
      'Enterprise FP&A Power BI Suite (.pbix)',
      'C-Suite Executive Telemetry User Guide'
    ],
    results: [
      'Accelerated strategic leadership review cycles with real-time DAX drill-downs.',
      'Standardized variance reporting across 8 business divisions.'
    ],
    externalUrl: 'https://1drv.ms/x/c/25C3AC5424753CC0/IQDSKxCnOaQ7T6XgwsAH7Q2dAco3sSdhusbJ1Go1YYQ9kg8?e=mU66Oo',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop',
    featured: true
  }
];

export const POWER_BI_SHOWCASE: AnalyticsDashboard[] = [
  {
    id: 'pb-1',
    title: 'Multi-Entity Executive P&L Telemetry & Cash Flow Forecaster',
    datasetSize: '1,250,000+ Transactions',
    toolStack: ['Power BI', 'DAX', 'Power Query M', 'SQL Server'],
    kpis: [
      { label: 'Operating EBITDA', value: '$4.82M', delta: '+14.2% YoY' },
      { label: 'Working Capital Ratio', value: '1.85x', delta: 'Optimal Range' },
      { label: 'Cash Conversion Cycle', value: '34 Days', delta: '-6 Days improvement' }
    ],
    daxOrSqlSnippet: `Rolling 12M Revenue = 
CALCULATE(
    SUM(Sales[NetAmount]),
    DATESINPERIOD('Calendar'[Date], MAX('Calendar'[Date]), -12, MONTH)
)`,
    businessInsight: 'Identified seasonal cash flow gaps in Q3, enabling proactive working capital credit line positioning that saved $45,000 in short-term interest penalties.',
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'pb-2',
    title: 'Supply Chain & Cost Center Variance Telemetry System',
    datasetSize: '850,000+ Inventory Logs',
    toolStack: ['Power BI', 'Advanced DAX', 'Excel Data Models', 'Python Data Cleaning'],
    kpis: [
      { label: 'Freight Expense Variance', value: '-$82,400', delta: 'Favorable' },
      { label: 'Inventory Holding Cost', value: '$1.12M', delta: '-8.5% QoQ' },
      { label: 'Stockout Frequency', value: '0.4%', delta: '-2.1% Reduction' }
    ],
    daxOrSqlSnippet: `Freight Variance = 
SUM(Freight[ActualCost]) - SUM(Freight[StandardCost])`,
    businessInsight: 'Uncovered carrier rate overcharges across 12 regional distribution routes, facilitating immediate vendor invoice credits and contract re-negotiations.',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'cma-part-1-cleared',
    title: 'CMA USA — Part 1 Cleared (Merit Score: 380/500)',
    issuer: 'Institute of Management Accountants (IMA), USA',
    date: 'Sep 2025 — Present',
    credentialId: 'IMA Candidate — Cleared Part 1 on 1st Attempt',
    skillsVerified: [
      'Financial Planning, Performance & Analytics',
      'Strategic Cost Management & Variance Analysis',
      'Internal Controls, Cost Accounting & Technology'
    ],
    verifiedUrl: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/',
    badgeImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'bcom-honors-degree',
    title: 'Bachelor of Commerce (Honors) — Accounting & Finance',
    issuer: 'Gujarat University',
    date: '2023 — 2027',
    credentialId: 'GU-BCOM-HONS-2327',
    skillsVerified: [
      'Advanced Corporate Accounting & Auditing',
      'Financial Management & Quantitative Techniques',
      'Direct & Indirect Taxation Law & Practice'
    ],
    verifiedUrl: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/',
    badgeImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'latham-watkins-ma',
    title: 'Mergers & Acquisitions Job Simulation',
    issuer: 'Latham & Watkins (Forage)',
    date: 'Issued Jul 2026',
    credentialId: '2oCruZ9wzeQpp2eJK',
    skillsVerified: [
      'M&A Transaction Structuring & Shareholder Advisory',
      'Board Presentation & Earn-Out Analysis',
      'Legal & Financial Due Diligence'
    ],
    verifiedUrl: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/',
    badgeImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'bcg-data-decision',
    title: 'Introduction to Data for Decision Makers Job Simulation',
    issuer: 'BCG (Forage)',
    date: 'Issued Jul 2026',
    credentialId: 'b63ZPAnMA7wAyC5J',
    skillsVerified: [
      'Data Storytelling & Executive Interpretation',
      'Strategic Decision Making with Data',
      'Quantitative Problem Solving'
    ],
    verifiedUrl: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/',
    badgeImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'h2-ventures-vc',
    title: 'Venture Capital Job Simulation',
    issuer: 'H2 Ventures (Forage)',
    date: 'Issued Jun 2026',
    credentialId: 'mwg2YHDmf2XAQ3JQe',
    skillsVerified: [
      'Venture Financing & Cap Table Modeling',
      'Early-Stage Startup Valuation',
      'Investment Memorandum Analysis'
    ],
    verifiedUrl: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/',
    badgeImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ms-fabric-dataflows',
    title: 'Ingest Data with Dataflows Gen2 in Microsoft Fabric',
    issuer: 'Microsoft',
    date: 'Issued Jun 2026',
    credentialId: 'MS-FABRIC-DF2-884219',
    skillsVerified: [
      'Microsoft Fabric Lakehouse Ingestion',
      'Dataflows Gen2 Transformation',
      'Cloud Data Pipeline Engineering'
    ],
    verifiedUrl: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/',
    badgeImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'miles-powerbi',
    title: 'Business Intelligence with Power BI',
    issuer: 'Miles Education',
    date: 'Issued Jun 2026',
    credentialId: 'MILES-PBI-2026-90412',
    skillsVerified: [
      'Power BI Dashboard Design',
      'Data Modeling & DAX Calculation',
      'Interactive Visual Analytics'
    ],
    verifiedUrl: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/',
    badgeImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'miles-power-automate',
    title: 'Getting started with Microsoft Power Automate',
    issuer: 'Miles Education',
    date: 'Issued May 2026',
    credentialId: 'MILES-PA-2026-78103',
    skillsVerified: [
      'Robotic Process Automation (RPA)',
      'Automated Workflow Logic',
      'Business Process Optimization'
    ],
    verifiedUrl: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/',
    badgeImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ima-ai-ethics',
    title: 'Ethics of AI in Firms: Navigating Bias in Prediction Models',
    issuer: 'Institute of Management Accountants (IMA)',
    date: 'Issued Apr 2026',
    credentialId: 'IMA-ETH-2026-55912',
    skillsVerified: [
      'AI Ethics & Prediction Model Audit',
      'Mitigating Algorithmic Bias in Finance',
      'Responsible AI Governance'
    ],
    verifiedUrl: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/',
    badgeImage: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'miles-sql-accountants',
    title: 'SQL for Accountants: Introduction to Databases',
    issuer: 'Miles Education',
    date: 'Issued Apr 2026',
    credentialId: 'MILES-SQL-2026-33918',
    skillsVerified: [
      'SQL Querying for Financial Ledgers',
      'Relational Database JOINs & Aggregations',
      'Financial Data Extraction'
    ],
    verifiedUrl: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/',
    badgeImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ms-powerbi-transform',
    title: 'Clean, transform, and load data in Power BI',
    issuer: 'Microsoft',
    date: 'Issued Apr 2026',
    credentialId: 'MS-PBI-CTL-2026-11849',
    skillsVerified: [
      'Power Query M Transformation',
      'Data Quality & Schema Cleaning',
      'ETL Pipeline Optimization'
    ],
    verifiedUrl: 'https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/',
    badgeImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'
  }
];

export const TIMELINE: TimelineItem[] = [
  {
    id: 't-1',
    period: '2025 — Present',
    roleOrDegree: 'CMA USA Candidate (Part 1 Cleared: 380/500)',
    organization: 'Institute of Management Accountants (IMA) / Miles Education',
    type: 'CMA Candidacy',
    description: 'Cleared CMA USA Part 1 on the 1st attempt with a merit score of 380/500. Developing advanced expertise in management accounting, strategic FP&A, variance analysis, and internal controls.',
    highlights: [
      'Cleared CMA USA Part 1 on 1st attempt with a merit score of 380/500.',
      'Active member of IMA Global Community & Miles Education network.',
      'Constructed 3-statement models, DCF valuations, and ABC cost allocations.'
    ],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 't-2',
    period: '2023 — 2027',
    roleOrDegree: 'Bachelor of Commerce (Honors), Accounting & Finance',
    organization: 'Gujarat University',
    type: 'Education',
    description: 'Rigorous academic training in Financial Accounting, Corporate Finance, Cost Accounting, Management Audit, and Business Analysis.',
    highlights: [
      'Enrolled in B.Com (Honors) specializing in Accounting & Finance.',
      'Gained deep foundations in financial analysis, taxation, and quantitative methods.'
    ],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 't-3',
    period: '2025 — Present',
    roleOrDegree: 'Senior FP&A & Strategic Valuation Specialist',
    organization: 'Independent Corporate Advisory & Executive Consulting',
    type: 'Project / Internship',
    description: 'Constructing 3-statement financial models, M&A DCF valuation decks, and automated Power BI telemetry dashboards for executive leadership teams.',
    highlights: [
      'Delivered 16+ financial models and automated Power Query ETL pipelines.',
      'Pioneered AI ethics auditing frameworks for corporate prediction models.'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'FINANCE & VALUATION',
    description: 'Quantitative corporate finance frameworks, valuation methods, and management accounting standards.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    skills: [
      { name: '3-Statement Financial Modeling', proficiency: 'Expert', detail: 'Fully integrated Balance Sheet, Income Statement & Cash Flow Statement models.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop' },
      { name: 'Discounted Cash Flow (DCF)', proficiency: 'Expert', detail: 'WACC derivation, CAPM, 2D sensitivity matrices & terminal value mechanics.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop' },
      { name: 'Activity-Based Costing (ABC)', proficiency: 'Expert (CMA)', detail: 'Cost pool identification, activity driver allocation & margin optimization.', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop' },
      { name: 'M&A & LBO Valuation Decks', proficiency: 'Advanced', detail: 'Deal structuring, synergy realization, and board level storytelling.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop' },
      { name: 'Budgeting & FP&A Variance', proficiency: 'Expert', detail: 'Flexible budgeting, variance root-cause analysis & rolling forecasts.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop' }
    ]
  },
  {
    category: 'DATA & ANALYTICS',
    description: 'Modern data stack tools for transforming raw ERP databases into executive decision telemetry.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    skills: [
      { name: 'Power BI & Advanced DAX', proficiency: 'Expert', detail: 'Star schema modeling, complex measures, time intelligence & RLS.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop' },
      { name: 'Advanced Excel & Power Query', proficiency: 'Master', detail: 'M Query ETL, dynamic array formulas, Solver optimization & VBA automation.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop' },
      { name: 'SQL for Accountants', proficiency: 'Proficient', detail: 'Multi-table JOINs, CTEs, aggregation pipelines & database extraction.', image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop' },
      { name: 'Microsoft Fabric & Power Automate', proficiency: 'Proficient', detail: 'Dataflows Gen2 lakehouse ingestion and automated workflow logic.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop' }
    ]
  },
  {
    category: 'STRATEGY & GOVERNANCE',
    description: 'Executive decision framework alignment and ethical AI governance.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    skills: [
      { name: 'CMA USA Framework Alignment', proficiency: 'Part 1 Cleared (380/500)', detail: 'IMA Ethical Standards, Strategic Cost Accounting & Performance Metrics.', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop' },
      { name: 'AI Ethics in Finance', proficiency: 'Certified (IMA)', detail: 'Navigating bias in prediction models and responsible algorithmic governance.', image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=600&auto=format&fit=crop' },
      { name: 'Executive Presentation Decks', proficiency: 'Expert', detail: 'Translating quantitative model outputs into C-suite strategic recommendations.', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=600&auto=format&fit=crop' }
    ]
  }
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    number: '01',
    timeframe: 'WEEK 00',
    title: 'DISCOVER',
    subtitle: 'Strategic Scope & Objective Alignment',
    description: 'Every financial analysis begins with identifying the core business problem, regulatory framework, capital constraints, and decision thresholds expected by executive stakeholders.',
    deliverable: 'Project Scope Brief & Key KPI Metrics Matrix',
    tools: ['Executive Discovery Brief', 'Goal Mapping', 'Notion/Drive Folder'],
    ourPart: ['Discovery Call ↗', 'Scope Brief & Alignment', 'Shared Project Folder', 'KPI Mapping Matrix'],
    yourPart: ['Discovery Questionnaire', 'Signing Advisory Contract', 'First Deposit ↗', 'GL / ERP Access Credentials'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop'
  },
  {
    number: '02',
    timeframe: 'WEEK 01',
    title: 'ANALYZE',
    subtitle: 'Data Ingestion & Integrity Audit',
    description: 'Ingest raw GL data, ERP transaction logs, and external market benchmark feeds. Apply Power Query M & SQL cleaning scripts to enforce 99%+ reconciliation integrity.',
    deliverable: 'Normalized Star-Schema Data Model & Audit Log',
    tools: ['Power Query M', 'SQL Databases', 'Excel Ingestion', 'M Code'],
    ourPart: ['Data Ingestion Audit', 'Power Query M Pipeline', 'Star Schema Architecture', 'Reconciliation Script'],
    yourPart: ['Raw Transaction Log Export', 'Chart of Accounts (COA)', 'Cost Center Mapping', 'Historical Financial Statements'],
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop'
  },
  {
    number: '03',
    timeframe: 'WEEK 02-04',
    title: 'BUILD',
    subtitle: 'Quantitative Modeling & Risk Stress-Testing',
    description: 'Construct 3-statement models, DCF cash flow schedules, or ABC cost allocations. Run multi-scenario sensitivity matrices and Monte Carlo simulations to quantify downside risk.',
    deliverable: 'Dynamic Financial Model (.xlsx) & Valuation Matrix',
    tools: ['Financial Modeling', 'WACC Derivation', 'Sensitivity Matrices', 'Python'],
    ourPart: ['3-Statement DCF Model', 'DAX Time Intelligence', 'WACC & Sensitivity Matrix', 'Monte Carlo Stress Test'],
    yourPart: ['Draft Model Review', 'Scenario Assumption Inputs', 'Hurdle Rate Sign-off', 'Interim Progress Sync'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
  },
  {
    number: '04',
    timeframe: 'WEEK 05-06',
    title: 'REFINE',
    subtitle: 'Executive Telemetry & Narrative Dashboarding',
    description: 'Translate complex mathematical models into clean, intuitive Power BI dashboards with DAX time-intelligence visuals, allowing C-suite leaders to explore insights effortlessly.',
    deliverable: 'Interactive Power BI Telemetry Suite (.pbix) & C-Suite Brief',
    tools: ['Power BI', 'Advanced DAX', 'Data Storytelling', 'RLS Security'],
    ourPart: ['Power BI Telemetry Suite', 'RLS Security Roles', 'Automated Refresh Pipeline', 'C-Suite Brief Deck'],
    yourPart: ['Feedback & Revisions', 'User Acceptance Testing (UAT)', 'Brand Color Guidelines', 'Final Model Deposit ↗'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
  },
  {
    number: '05',
    timeframe: 'WEEK 07-08',
    title: 'DELIVER',
    subtitle: 'Strategic Implementation & Executive Handover',
    description: 'Present actionable recommendations to board members and operational managers. Establish automated variance tracking and rolling forecast mechanisms for long-term value creation.',
    deliverable: 'Implementation Roadmap, Pitch Deck & Live Handover',
    tools: ['Pitch Decks', 'Rolling Forecast Tracker', 'Executive SOP', 'Power Automate'],
    ourPart: ['Executive Pitch Deck', 'Board Presentation', 'Automated Forecast SOP', 'Live Team Handover'],
    yourPart: ['Board Meeting Presentation', 'System Sign-off', 'Rolling Forecast Adoption', 'Client Case Study Review'],
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop'
  }
];
