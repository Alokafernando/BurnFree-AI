import { Timestamp } from "firebase/firestore";

export type WorkError = {
  code: string;
  message: string;
};

export interface Work {
  id: string;
  userId: string;
  client: string;
  project: string;
  hours: number;
  date: string; 
  createdAt: Timestamp;
}
