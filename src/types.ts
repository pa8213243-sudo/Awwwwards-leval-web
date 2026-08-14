export interface Project {
  id: string;
  title: string;
  category: 'Financial Modeling' | 'Power BI & DAX' | 'Cost Management (CMA)' | 'Excel & Automation' | 'Corporate Presentation' | 'Web & Mobile Apps';
  year: string;
  tagline: string;
  client: string;
  impactMetric: string;
  summary: string;
  objective: string;
  problem: string;
  approach: string[];
  tools: string[];
  deliverables: string[];
  results: string[];
  externalUrl?: string;
  downloadUrl?: string;
  formulaOrCodeSnippet?: {
    language: string;
    code: string;
    description: string;
  };
  image: string;
  videoUrl?: string;
  posterUrl?: string;
  galleryImages?: string[];
  featured: boolean;
}

export interface AnalyticsDashboard {
  id: string;
  title: string;
  datasetSize: string;
  toolStack: string[];
  kpis: { label: string; value: string; delta: string }[];
  daxOrSqlSnippet: string;
  businessInsight: string;
  previewImage: string;
  externalUrl?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  skillsVerified: string[];
  verifiedUrl?: string;
  badgeImage: string;
}

export interface TimelineItem {
  id: string;
  period: string;
  roleOrDegree: string;
  organization: string;
  type: 'Education' | 'CMA Candidacy' | 'Project / Internship' | 'Certification';
  description: string;
  highlights: string[];
  image?: string;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: { name: string; proficiency: string; detail: string; iconName?: string; image?: string }[];
  image?: string;
}

export interface ProcessStage {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverable: string;
  tools: string[];
  timeframe?: string;
  ourPart?: string[];
  yourPart?: string[];
  image?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  thumbnailLink?: string;
  createdTime?: string;
  size?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface PricingPlan {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  startingPriceEur: number;
  startingPriceUsd: number;
  timeline: string;
  bestFor: string[];
  deliverables: string[];
  highlightColor?: string;
}
