import { BurnoutMetrics, BurnoutResult } from "@/types/burnout";

// Calculate Burnout Score
export const calculateBurnoutScore = (
  metrics: BurnoutMetrics
): BurnoutResult => {
  const { avgMood, avgStress, avgSleep, avgWorkHours } = metrics;

  // Score calculation
  let score =
    avgWorkHours * 5 +      // Work impact
    avgStress * 8 -         // Stress impact
    avgMood * 6 -           // Mood reduces burnout
    avgSleep * 4;           // Sleep reduces burnout

  // Normalize score 0–100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Determine Level
  let level: BurnoutResult["level"];
  let color = "";
  let description = "";

  if (score < 25) {
    level = "Low";
    color = "#22C55E";
    description = "You’re balanced and managing work well.";
  } 
  else if (score < 50) {
    level = "Moderate";
    color = "#F59E0B";
    description = "Some stress detected. Monitor workload.";
  } 
  else if (score < 75) {
    level = "High";
    color = "#F97316";
    description = "Burnout risk rising. Take recovery breaks.";
  } 
  else {
    level = "Severe";
    color = "#EF4444";
    description = "Critical burnout risk. Immediate rest advised.";
  }

  return {
    score,
    level,
    color,
    description,
  };
};
export { BurnoutResult };

