import { BudgetCategory, Transaction } from "./types";

export const MOCK_USER = {
  name: "محمد أحمد",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUYDzF6Uu0AYnkU1_5Bm-2r1Cpr5eLZNbeIU1fRJEsnyNdortfJbqGO1OKeaNuG6HR0_hZI7Ljd7Tx66J9PPvqT1kjqgxDVfNwrg5MwCGsp1mmeeoG0DzNmdXMX2UhcKNeoawx9hVhB63z1vItX2CR9r_oGaxJX1KTignpa2Dv36TUK9JdVWBmZxIKHfo9F8eeuyYae7QiMmJwLsXT3ys7En9LVgh8xDoI765BAqyPAFRZjzjhivoMBbJ3RELGoeR_LJbxaFUBnLJY"
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'سوبرماركت التميمي',
    amount: 350,
    date: new Date().toISOString(),
    category: 'groceries',
    icon: 'shopping_cart'
  },
  {
    id: '2',
    title: 'محطة وقود',
    amount: 85,
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    category: 'transport',
    icon: 'local_gas_station'
  },
  {
    id: '3',
    title: 'مطعم البيك',
    amount: 45,
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    category: 'food',
    icon: 'restaurant'
  },
  {
    id: '4',
    title: 'اشتراك نتفليكس',
    amount: 60,
    date: new Date(Date.now() - 259200000).toISOString(), 
    category: 'entertainment',
    icon: 'movie'
  }
];

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: 'savings',
    name: 'إيداع شهري',
    allocated: 1000,
    spent: 0, // Calculated dynamically in App.tsx
    icon: 'savings',
    color: 'bg-blue-500',
    colorBg: 'bg-blue-500/20',
    colorText: 'text-blue-400'
  },
  {
    id: 'family',
    name: 'التزامات الأسرة',
    allocated: 1500,
    spent: 0, // Calculated dynamically in App.tsx
    icon: 'family_restroom',
    color: 'bg-primary',
    colorBg: 'bg-primary/20',
    colorText: 'text-primary'
  },
  {
    id: 'mother',
    name: 'الوالدة',
    allocated: 500,
    spent: 0, // Calculated dynamically in App.tsx
    icon: 'favorite',
    color: 'bg-pink-500',
    colorBg: 'bg-pink-500/20',
    colorText: 'text-pink-400'
  },
  {
    id: 'other',
    name: 'جهات أخرى',
    allocated: 1000,
    spent: 0, // Calculated dynamically in App.tsx
    icon: 'payments',
    color: 'bg-orange-500',
    colorBg: 'bg-orange-500/20',
    colorText: 'text-orange-400'
  }
];

// Helper to get day name
export const getDayName = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ar-SA', { weekday: 'long' });
};