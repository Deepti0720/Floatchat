export type Variable = 'temperature' | 'salinity' | 'both';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface DepthPoint {
  pressure: number; // dbar
  temperature: number; // °C
  salinity: number; // PSU
}

export interface FloatObservation {
  date: string;
  latitude: number;
  longitude: number;
  pressure: number;
  temperature: number;
  salinity: number;
}

export interface FloatInfo {
  id: string;
  lat: number;
  lon: number;
  region: string;
  cycle: number;
}

export interface QueryParams {
  lat: number;
  lon: number;
  depth: number;
  dateRange: string;
  variable: Variable;
  region: string;
}

export interface PipelineStep {
  label: string;
  detail: string;
  status: 'pending' | 'running' | 'done';
  timing?: string;
}

export interface OceanDataset {
  profile: DepthPoint[];
  floats: FloatInfo[];
  observations: FloatObservation[];
  summary: string;
  params: QueryParams;
}
