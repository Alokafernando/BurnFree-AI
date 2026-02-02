interface IncomeEntry {
  id: string;
  client: string;
  amount: number;
  type: string;
  date: string;
}

export type IncomeError = {
  code: string;
  message: string;
};