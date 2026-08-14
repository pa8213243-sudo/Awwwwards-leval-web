import { PricingPlan } from '../types';

export const PRICING_CONFIG: PricingPlan[] = [
  {
    id: 'excel-data-analysis',
    title: 'Excel & Financial Modeling',
    subtitle: 'Dynamic 3-Statement Models & Scenario Analysis',
    category: '01 EXCEL / FINANCIAL MODELING',
    startingPriceEur: 1500,
    startingPriceUsd: 1650,
    timeline: '1 – 2 WEEKS',
    bestFor: ['Startups', 'SMEs', 'Financial Valuation', 'Budgeting & Forecasts'],
    deliverables: [
      'Fully Dynamic 3-Statement Integrated Financial Model (.xlsx)',
      'DCF & WACC Sensitivity Valuation Framework',
      'Automated Power Query Data Cleaning & Reconciliation',
      'Scenario Analysis Manager (Bull, Base, Bear Cases)',
      'Executive Summary & Model Walkthrough'
    ],
    highlightColor: 'emerald'
  },
  {
    id: 'powerbi-telemetry',
    title: 'Power BI & Executive Telemetry',
    subtitle: 'Real-Time P&L, KPI & Variance Dashboards',
    category: '02 POWER BI / DASHBOARDS',
    startingPriceEur: 2500,
    startingPriceUsd: 2750,
    timeline: '2 – 3 WEEKS',
    bestFor: ['C-Suite Executives', 'Finance Teams', 'Cost Center Management', 'Operations'],
    deliverables: [
      'Custom Power BI Executive Dashboard Suite (.pbix)',
      'Star Schema Data Architecture & Automated ETL Pipeline',
      'Complex DAX Measures for YTD, YoY, and Time-Intelligence',
      'Row-Level Security (RLS) Configuration',
      'Live Executive Handover & DAX Measure Documentation'
    ],
    highlightColor: 'blue'
  },
  {
    id: 'business-cma-costing',
    title: 'Business & Strategic CMA Costing',
    subtitle: 'Activity-Based Costing & Profitability Audits',
    category: '03 BUSINESS / FINANCIAL ANALYSIS',
    startingPriceEur: 3200,
    startingPriceUsd: 3500,
    timeline: '3 – 4 WEEKS',
    bestFor: ['Manufacturing', 'E-Commerce', 'Multi-SKU Retail', 'Corporate Restructuring'],
    deliverables: [
      'Activity-Based Costing (ABC) Overhead Allocation Engine',
      'Product SKU & Customer Segment Profitability Heatmap',
      'CMA-Grade Variance Root-Cause Analysis',
      'Working Capital & Cash Conversion Optimization Plan',
      'Strategic Costing Advisory Deck'
    ],
    highlightColor: 'purple'
  },
  {
    id: 'presentation-storytelling',
    title: 'Executive Presentations & Decks',
    subtitle: 'M&A Decks, Board Pitching & Financial Storytelling',
    category: '04 PRESENTATIONS & STORYTELLING',
    startingPriceEur: 1200,
    startingPriceUsd: 1300,
    timeline: '1 WEEK',
    bestFor: ['Board Meetings', 'Investor Pitches', 'M&A Advisory', 'Strategic Review'],
    deliverables: [
      'Executive Pitch Deck & Financial Storytelling (.pptx)',
      'High-Impact Data Visualizations & Infographics',
      'Structured Executive Summary & Strategic Takeaways',
      'Custom Branded Typography & Financial Graphics'
    ],
    highlightColor: 'amber'
  }
];
