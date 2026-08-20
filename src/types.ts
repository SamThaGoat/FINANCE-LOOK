export type Language = 'en' | 'sk';

export type ExpenseType = 'regular' | 'irregular';

export type ExpenseCategory = 
  | 'Groceries'
  | 'Drugstore'
  | 'Healthcare'
  | 'Clothing / Footwear'
  | 'Stationery'
  | 'Car'
  | 'Extraordinary';

export type IncomeCategory =
  | 'Salary / Wage'
  | 'Freelance & Contract'
  | 'Side Business'
  | 'Investments & Dividends'
  | 'Rental Income'
  | 'Gifts & Reimbursements'
  | 'Other';

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  type: ExpenseType; // 'regular' vs 'irregular'
  category: ExpenseCategory;
  date?: string; // YYYY-MM-DD
  notes?: string;
  frequency?: 'Monthly' | 'Weekly' | 'Bi-Weekly' | 'Annual / 12'; // For regular items
}

export interface IncomeItem {
  id: string;
  name: string;
  amount: number;
  category: IncomeCategory;
  date?: string;
  notes?: string;
}

export interface MonthData {
  id: string; // YYYY-MM
  monthName: string; // e.g. "August 2026"
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  savingsGoal?: number;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
}

export interface FinancialHealthSummary {
  totalIncome: number;
  totalRegularExpenses: number;
  totalIrregularExpenses: number;
  totalExpenses: number;
  netBalance: number; // totalIncome - totalExpenses
  isPositive: boolean; // netBalance >= 0 (Saved money)
  isBreakEven: boolean; // Math.abs(netBalance) < 0.01
  savingsRate: number; // (netBalance / totalIncome) * 100
  regularExpenseRatio: number; // (regularExpenses / totalIncome) * 100
  irregularExpenseRatio: number; // (irregularExpenses / totalIncome) * 100
}
