export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO string
  category: string;
  icon: string;
}

export interface BudgetCategory {
  id: string; // Acts as the category key (e.g., 'family', 'savings')
  name: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
  colorBg: string;
  colorText: string;
}

export interface DailySpending {
  day: string;
  amount: number;
  active?: boolean;
}

export interface CategorySpending {
  category: string;
  name: string; // Arabic label
  amount: number;
  color: string;
}

export type Tab = 'home' | 'budget' | 'analytics' | 'profile';