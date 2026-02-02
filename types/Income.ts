
import { Timestamp } from "firebase/firestore";

export type IncomeType =
  | "salary"
  | "freelance"
  | "business"
  | "investment"
  | "other";


export interface Income {
  id: string;
  userId: string;
  client: string;
  amount: number;
  type: IncomeType;
  date: string;
  createdAt: Timestamp;
}

export interface IncomeError {
  code: string;
  message: string;
}