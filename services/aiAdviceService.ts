// aiAdviceService.ts
import OpenAI from "openai";
import { AIAdvice } from "@/types/aiAdvice";
import { BurnoutResult } from "@/types/burnout";

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your .env
});

interface AIAdviceRequest {
  burnout: BurnoutResult;
  totalIncome: number;
  avgMood: number;
  avgWorkHours: number;
}

export const generateAIAdvice = async ({
  burnout,
  totalIncome,
  avgMood,
  avgWorkHours,
}: AIAdviceRequest): Promise<AIAdvice[]> => {
  try {
    // Construct prompt for GPT
    const prompt = `
You are a personal wellness and productivity assistant.
Given the following user metrics, provide concise advice. Format each advice as a JSON object with fields: id, title, message, type, priority.

User Metrics:
- Burnout Score: ${burnout.score} (0-100)
- Average Mood: ${avgMood} (1-5)
- Average Work Hours: ${avgWorkHours} hours/day
- Total Income: $${totalIncome}

Return at least 4 pieces of advice covering:
1. Burnout/wellness
2. Mood
3. Workload/productivity
4. Income/financial stability

Example response format:
[
  {
    "id": "burnout_high",
    "title": "High Burnout Risk",
    "message": "Your workload and stress levels are high. Take breaks and rest.",
    "type": "burnout",
    "priority": "high"
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    const aiText = response.choices[0].message?.content;
    if (!aiText) return [];

    // Parse AI JSON safely
    let adviceList: AIAdvice[] = [];
    try {
      adviceList = JSON.parse(aiText);
    } catch (err) {
      console.error("Failed to parse AI advice JSON:", err);
    }

    return adviceList;
  } catch (error) {
    console.error("Error generating AI advice:", error);
    return [];
  }
};
