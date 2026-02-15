
// Advice category
export type AdviceType =
  | "burnout"
  | "income"
  | "productivity"
  | "wellness"
  | "general"

// Advice priority
export type AdvicePriority =
  | "low"
  | "medium"
  | "high"
  | "critical"

// AI Advice 
export interface AIAdvice {
  id: string
  title: string
  message: string

  type: AdviceType
  priority: AdvicePriority

  createdAt: Date
}
