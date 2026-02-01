export interface WorkEntry {
  id: string;
  userId: string;
  client: string;
  project: string;
  hours: number;
  date: string;
}

export interface CreateWorkPayload {
  client: string;
  project: string;
  hours: number;
}
