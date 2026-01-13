export type Currency = 'USD' | 'VND';

export interface MoneyProfile {
  monthlyIncome: number;
  fixedExpenses: number;
  savingsGoal: number;
  isSetup: boolean;
  currency: Currency;
  lastUpdatedMonth?: number; // 0-11
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

export interface MonthlyRecord {
  month: number;
  year: number;
  income: number;
  saved: number;
  goal: number;
  spent: number;
  transactions?: Transaction[];
}
