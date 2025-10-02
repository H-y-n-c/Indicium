const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface MetricData {
  value: number;
  period?: string;
  referenceDate?: string;
}

export interface DashboardMetrics {
  caseRate: MetricData;
  mortalityRate: MetricData;
  icuRate: MetricData;
  vaccinationRate: MetricData;
}

export interface CaseData {
  date: string;
  count: number;
}

export interface CasesResponse {
  data: CaseData[];
  total: number;
}

export interface Region {
  estado: string;
  municipios: string[];
}

export const api = {
  async getMetrics(params?: {
    period?: string;
    estado?: string;
    municipio?: string;
  }): Promise<DashboardMetrics> {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);
    if (params?.estado) queryParams.append('estado', params.estado);
    if (params?.municipio) queryParams.append('municipio', params.municipio);

    const response = await fetch(`${API_URL}/api/metrics?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch metrics');
    return response.json();
  },

  async getCases(params?: {
    period?: string;
    groupBy?: string;
    estado?: string;
    municipio?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<CasesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);
    if (params?.groupBy) queryParams.append('groupBy', params.groupBy);
    if (params?.estado) queryParams.append('estado', params.estado);
    if (params?.municipio) queryParams.append('municipio', params.municipio);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_URL}/api/cases?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch cases');
    return response.json();
  },

  async getRegions(): Promise<Region[]> {
    const response = await fetch(`${API_URL}/api/regions`);
    if (!response.ok) throw new Error('Failed to fetch regions');
    return response.json();
  },
};
