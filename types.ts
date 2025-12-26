
export enum Page {
  MarketIntelligence = 'Market Intelligence',
  CompetitiveIntelligence = 'Competitive Intelligence',
  Sources = 'Sources',
  SharePriceIndex = 'Share Price Index',
  IndiaNews = 'India News',
  InternationalNews = 'International News',
}

export enum Geography {
  India = 'India (Pan-India)',
  Gurgaon = 'Gurgaon',
  Delhi = 'Delhi',
  Mumbai = 'Mumbai',
  Panchkula = 'Panchkula',
  Chennai = 'Chennai',
  Kerala = 'Kerala',
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface KPI {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
}

export interface TrendDataPoint {
    quarter: string;
    averagePrice: number;
    unitsSold: number;
}

export interface DemandProfileItem {
    category: string;
    percentage: number;
}

export interface DemandProfile {
    byConfiguration: DemandProfileItem[];
    byTicketSize: DemandProfileItem[];
}

export interface MarketData {
  marketOverview: string;
  swot: SWOTAnalysis;
  kpis: KPI[];
  trends: TrendDataPoint[];
  demandProfile: DemandProfile;
}

export interface ProjectLaunch {
  developerName: string;
  projectName: string;
  location: string;
  priceBracket: string;
  configuration: string;
  usp: string;
  launchDate: string;
}

export interface GroundingSource {
  web: {
    uri: string;
    title: string;
  };
}

export interface SharePrice {
  companyName: string;
  stockSymbol: string;
  currentPrice: string;
  dayChange: string;
  dayChangePercent: string;
  changeType: 'increase' | 'decrease' | 'neutral';
}

export interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishedDate: string;
  snippet: string;
}