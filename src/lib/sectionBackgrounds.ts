/**
 * Curated high-resolution contextual background imagery for all portfolio sections.
 * Selected specifically for Parvej's CMA & Financial Analytics domain.
 */

export interface SectionBackgroundConfig {
  imageUrl: string;
  alt: string;
  accentColor: string;
  theme: 'dark' | 'light';
  overlayGradient: string;
}

export const SECTION_BACKGROUNDS: Record<string, SectionBackgroundConfig> = {
  home: {
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1600&auto=format&fit=crop',
    alt: 'High-frequency financial trading and market terminal display',
    accentColor: '#E0533C',
    theme: 'dark',
    overlayGradient: 'radial-gradient(circle at 50% 30%, rgba(10,10,14,0.7) 0%, rgba(10,10,14,0.94) 80%)',
  },
  chapters: {
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    alt: 'Modern corporate architectural skyscraper and institutional headquarters',
    accentColor: '#E0533C',
    theme: 'dark',
    overlayGradient: 'linear-gradient(180deg, rgba(10,10,14,0.88) 0%, rgba(10,10,14,0.95) 100%)',
  },
  work: {
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    alt: 'Enterprise executive financial dashboards, Power BI charts, and multi-screen models',
    accentColor: '#E0533C',
    theme: 'dark',
    overlayGradient: 'radial-gradient(circle at 60% 40%, rgba(10,10,14,0.72) 0%, rgba(10,10,14,0.92) 85%)',
  },
  sandbox: {
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600&auto=format&fit=crop',
    alt: 'Quantitative finance candlestick graphs, valuation charts, and sensitivity analysis',
    accentColor: '#E0533C',
    theme: 'dark',
    overlayGradient: 'linear-gradient(180deg, rgba(10,10,14,0.8) 0%, rgba(10,10,14,0.94) 100%)',
  },
  pricing: {
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
    alt: 'Executive boardroom and strategic corporate advisory conference room',
    accentColor: '#E0533C',
    theme: 'dark',
    overlayGradient: 'radial-gradient(circle at 50% 50%, rgba(10,10,14,0.75) 0%, rgba(10,10,14,0.93) 90%)',
  },
  dashboards: {
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
    alt: 'Power BI dynamic telemetry data visualization and business intelligence metrics',
    accentColor: '#3B82F6',
    theme: 'dark',
    overlayGradient: 'radial-gradient(circle at 50% 40%, rgba(10,10,14,0.7) 0%, rgba(10,10,14,0.92) 85%)',
  },
  about: {
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop',
    alt: 'Strategic corporate planning, financial ledger, and consulting review',
    accentColor: '#E0533C',
    theme: 'dark',
    overlayGradient: 'linear-gradient(180deg, rgba(10,10,14,0.8) 0%, rgba(10,10,14,0.93) 100%)',
  },
  experience: {
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
    alt: 'Executive corporate management and financial advisory career chronology',
    accentColor: '#10B981',
    theme: 'dark',
    overlayGradient: 'radial-gradient(circle at 50% 30%, rgba(10,10,14,0.75) 0%, rgba(10,10,14,0.94) 85%)',
  },
  skills: {
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop',
    alt: 'Quantitative algorithmic computation, advanced data matrices, and DAX modeling',
    accentColor: '#10B981',
    theme: 'dark',
    overlayGradient: 'linear-gradient(180deg, rgba(10,10,14,0.82) 0%, rgba(10,10,14,0.95) 100%)',
  },
  certs: {
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop',
    alt: 'Global institutional credentials, academic honors, and certified financial management',
    accentColor: '#10B981',
    theme: 'dark',
    overlayGradient: 'radial-gradient(circle at 50% 40%, rgba(10,10,14,0.72) 0%, rgba(10,10,14,0.93) 85%)',
  },
  process: {
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1600&auto=format&fit=crop',
    alt: 'Structured financial blueprinting, workflow staging, and audit methodologies',
    accentColor: '#E0533C',
    theme: 'dark',
    overlayGradient: 'linear-gradient(180deg, rgba(10,10,14,0.8) 0%, rgba(10,10,14,0.93) 100%)',
  },
  contact: {
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop',
    alt: 'Executive communication desk and strategic financial advisory initiation',
    accentColor: '#10B981',
    theme: 'dark',
    overlayGradient: 'radial-gradient(circle at 50% 50%, rgba(10,10,14,0.72) 0%, rgba(10,10,14,0.94) 90%)',
  },
};
