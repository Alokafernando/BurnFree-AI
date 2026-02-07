
export type BurnoutLevel =
  | "Low"
  | "Moderate"
  | "High"
  | "Severe";

export interface BurnoutResult {
  score: number;         
  level: BurnoutLevel;   
  color: string;         
  description: string;  
}

export interface BurnoutMetrics {
  avgMood: number;
  avgStress: number;
  avgSleep: number;
  avgWorkHours: number;
}
