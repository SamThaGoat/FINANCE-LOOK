import { CurrencyConfig, ExpenseCategory, ExpenseItem, FinancialHealthSummary, IncomeCategory, IncomeItem, Language, MonthData } from '../types';

export const EURO_CURRENCY: CurrencyConfig = {
  code: 'EUR',
  symbol: '€',
  name: 'Euro (€)',
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Groceries',
  'Drugstore',
  'Healthcare',
  'Clothing / Footwear',
  'Stationery',
  'Car',
  'Extraordinary',
];

export const REGULAR_CATEGORIES: ExpenseCategory[] = EXPENSE_CATEGORIES;
export const IRREGULAR_CATEGORIES: ExpenseCategory[] = EXPENSE_CATEGORIES;

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary / Wage',
  'Freelance & Contract',
  'Side Business',
  'Investments & Dividends',
  'Rental Income',
  'Gifts & Reimbursements',
  'Other',
];

export function formatCurrency(amount: number, currency: CurrencyConfig = EURO_CURRENCY): string {
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  return `${amount < 0 ? '-' : ''}${formatted} ${currency.symbol}`;
}

export function formatPercent(rate: number): string {
  return `${rate >= 0 ? '+' : ''}${rate.toFixed(1)}%`;
}

export function calculateFinancialSummary(
  incomes: IncomeItem[],
  expenses: ExpenseItem[]
): FinancialHealthSummary {
  const totalIncome = incomes.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  
  const regularItems = expenses.filter((e) => e.type === 'regular');
  const irregularItems = expenses.filter((e) => e.type === 'irregular');

  const totalRegularExpenses = regularItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const totalIrregularExpenses = irregularItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const totalExpenses = totalRegularExpenses + totalIrregularExpenses;
  const netBalance = totalIncome - totalExpenses;

  const isBreakEven = Math.abs(netBalance) < 0.01;
  const isPositive = netBalance >= 0;

  const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : netBalance >= 0 ? 0 : -100;
  const regularExpenseRatio = totalIncome > 0 ? (totalRegularExpenses / totalIncome) * 100 : 0;
  const irregularExpenseRatio = totalIncome > 0 ? (totalIrregularExpenses / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalRegularExpenses,
    totalIrregularExpenses,
    totalExpenses,
    netBalance,
    isPositive,
    isBreakEven,
    savingsRate,
    regularExpenseRatio,
    irregularExpenseRatio,
  };
}

export function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    // 7 User-defined Expense Categories
    'Groceries': '#10b981', // Emerald green
    'Drugstore': '#06b6d4', // Cyan / Teal
    'Healthcare': '#3b82f6', // Bright Blue
    'Clothing / Footwear': '#ec4899', // Pink / Magenta
    'Stationery': '#f59e0b', // Amber / Warm yellow
    'Car': '#6366f1', // Indigo / Purple
    'Extraordinary': '#f43f5e', // Rose / Crimson
    
    // Incomes
    'Salary / Wage': '#10b981',
    'Freelance & Contract': '#3b82f6',
    'Side Business': '#8b5cf6',
    'Investments & Dividends': '#06b6d4',
    'Rental Income': '#f59e0b',
    'Gifts & Reimbursements': '#ec4899',
    'Other': '#94a3b8',
  };
  return colorMap[category] || '#64748b';
}

export function normalizeCategory(cat: string): ExpenseCategory {
  if (EXPENSE_CATEGORIES.includes(cat as ExpenseCategory)) {
    return cat as ExpenseCategory;
  }
  const lower = (cat || '').toLowerCase();
  if (lower.includes('groc') || lower.includes('food') || lower.includes('dining') || lower.includes('potrav')) return 'Groceries';
  if (lower.includes('drug') || lower.includes('pharm') || lower.includes('hygiene') || lower.includes('drog')) return 'Drugstore';
  if (lower.includes('health') || lower.includes('med') || lower.includes('doctor') || lower.includes('insur') || lower.includes('zdrav')) return 'Healthcare';
  if (lower.includes('cloth') || lower.includes('shoe') || lower.includes('foot') || lower.includes('wear') || lower.includes('obuv') || lower.includes('oblec')) return 'Clothing / Footwear';
  if (lower.includes('stat') || lower.includes('paper') || lower.includes('office') || lower.includes('book') || lower.includes('papier')) return 'Stationery';
  if (lower.includes('car') || lower.includes('auto') || lower.includes('gas') || lower.includes('fuel') || lower.includes('vozidl')) return 'Car';
  return 'Extraordinary';
}

export function createEmptyMonthData(customMonthKey?: string): MonthData {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const monthKey = customMonthKey || `${year}-${month}`;
  
  const [yStr, mStr] = monthKey.split('-');
  const y = parseInt(yStr, 10) || year;
  const m = parseInt(mStr, 10) || (now.getMonth() + 1);
  const dateObj = new Date(y, m - 1, 1);
  const monthName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });

  return {
    id: monthKey,
    monthName,
    incomes: [],
    expenses: [],
  };
}

const STORAGE_KEY = 'FINANCIAL_LOOK_DATA_EUR_V2';
const LANG_STORAGE_KEY = 'FINANCIAL_LOOK_LANG';

export function loadSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'sk' || saved === 'en') {
      return saved;
    }
  } catch (e) {
    console.error('Failed to load language:', e);
  }
  return 'en';
}

export function saveSelectedLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (e) {
    console.error('Failed to save language:', e);
  }
}

export function loadAllMonths(): Record<string, MonthData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        const normalized: Record<string, MonthData> = {};
        Object.keys(parsed).forEach((key) => {
          const m = parsed[key];
          normalized[key] = {
            ...m,
            incomes: Array.isArray(m.incomes) ? m.incomes : [],
            expenses: (m.expenses || []).map((e: any) => ({
              ...e,
              category: normalizeCategory(e.category),
            })),
          };
        });
        return normalized;
      }
    }
  } catch (e) {
    console.error('Failed to load storage:', e);
  }
  
  const empty = createEmptyMonthData();
  const initial = { [empty.id]: empty };
  saveAllMonths(initial);
  return initial;
}

export function saveAllMonths(data: Record<string, MonthData>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}
