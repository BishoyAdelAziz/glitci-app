export type CurrencyCode = "EGP" | "USD" | "AED" | "EUR" | "SAR";

export interface AnalyticsQueryParams {
  from?: string | undefined;
  to?: string | undefined;
  currency?: CurrencyCode;
}
export interface StatsQueryParams {
  currency?: CurrencyCode | undefined;
}
export interface GrowthTrendItem {
  year: number;
  month: number;
  value: number;
}

export interface IncomeDeptItem {
  quarter: string;
  software?: number;
  marketing?: number;
}

export interface AnalyticsCharts {
  growthTrend: GrowthTrendItem[];
  incomeByDepartment: IncomeDeptItem[];
}
export interface Project {
  id: string;
  name: string;
  client: string;
  department: string;
  status: "on_hold" | "active" | "planning" | "completed";
  startDate: string;
  endDate: string;
  budget: number;
}

export interface AnalyticsOverview {
  period: {
    from: string;
    to: string;
  };
  currency: string;
  financials: {
    totalRevenue: number;
    totalEarning: number;
    totalSpending: number;
    netProfit: number;
  };
  charts: AnalyticsCharts;
  recentProjects: Project[];
}

export interface AnalyticsResponse {
  data: AnalyticsOverview;
}
export interface StatsOverView {
  Currency: CurrencyCode;
  counts: {
    totalProjects: number;
    activeProjects: number;
    activeEmployees: number;
    avgCompletion: number;
  };
  departments: {
    id: string;
    name: string;
    spent: string;
    budget: string;
    percent: string;
  }[];
}
export interface StatsResponse {
  data: StatsOverView;
}
