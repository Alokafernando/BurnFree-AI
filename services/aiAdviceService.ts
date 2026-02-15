import { AIAdvice } from "@/types/aiAdvice"
import { BurnoutResult } from "@/types/burnout"

export const generateAIAdvice = (
  burnout: BurnoutResult,
  totalIncome: number,
  avgMood: number,
  avgWorkHours: number
): AIAdvice[] => {
  const adviceList: AIAdvice[] = []

  // Burnout Advice
  if (burnout.score >= 75) {
    adviceList.push({
      id: "burnout_critical",
      title: "Severe Burnout Risk",
      message: "You are showing signs of severe burnout. Take immediate rest and reduce workload.",
      type: "burnout",
      priority: "critical",
      createdAt: new Date(),
    })
  } 
  else if (burnout.score >= 50) {
    adviceList.push({
      id: "burnout_high",
      title: "High Burnout Risk",
      message: "Your stress and work hours are high. Consider scheduling breaks.",
      type: "burnout",
      priority: "high",
      createdAt: new Date(),
    })
  } 
  else if (burnout.score >= 25) {
    adviceList.push({
      id: "burnout_moderate",
      title: "Moderate Burnout",
      message: "You’re doing okay, but monitor your stress levels.",
      type: "burnout",
      priority: "medium",
      createdAt: new Date(),
    })
  } 
  else {
    adviceList.push({
      id: "burnout_low",
      title: "Great Balance",
      message: "You’re maintaining a healthy work-life balance. Keep it up!",
      type: "wellness",
      priority: "low",
      createdAt: new Date(),
    })
  }

  // Income Advice
  if (totalIncome < 1000) {
    adviceList.push({
      id: "income_low",
      title: "Low Income Stability",
      message: "Your income is currently low. Consider adding new clients or projects.",
      type: "income",
      priority: "high",
      createdAt: new Date(),
    })
  } 
  else if (totalIncome < 3000) {
    adviceList.push({
      id: "income_mid",
      title: "Income Needs Growth",
      message: "Income is moderate. Scaling your work could improve stability.",
      type: "income",
      priority: "medium",
      createdAt: new Date(),
    })
  } 
  else {
    adviceList.push({
      id: "income_good",
      title: "Stable Income",
      message: "Your income level is stable and healthy.",
      type: "income",
      priority: "low",
      createdAt: new Date(),
    })
  }

  // Mood Advice
  if (avgMood <= 2) {
    adviceList.push({
      id: "mood_low",
      title: "Low Mood Detected",
      message: "Your mood levels are low. Consider rest or recreational activities.",
      type: "wellness",
      priority: "high",
      createdAt: new Date(),
    })
  }

  // Workload Advice
  if (avgWorkHours >= 10) {
    adviceList.push({
      id: "work_overload",
      title: "Work Overload",
      message: "You are working long hours. Reduce workload to avoid burnout.",
      type: "productivity",
      priority: "high",
      createdAt: new Date(),
    });
  }

  return adviceList
}
