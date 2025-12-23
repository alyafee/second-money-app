import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import BudgetGrid from './components/BudgetGrid';
import AIInsightCard from './components/AIInsightCard';
import AnalyticsChart from './components/AnalyticsChart';
import TransactionList from './components/TransactionList';
import BottomNav from './components/BottomNav';
import AddTransactionModal from './components/AddTransactionModal';
import EditBudgetModal from './components/EditBudgetModal';
import EditIncomeModal from './components/EditIncomeModal';

import { BUDGET_CATEGORIES } from './constants';
import { Tab, Transaction, BudgetCategory, DailySpending, CategorySpending } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  
  // Initialize transactions from localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('transactions');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse transactions", e);
        }
      }
    }
    return []; // Start with empty list for real usage
  });

  // Initialize Budget Configuration from localStorage
  const [budgetConfig, setBudgetConfig] = useState<BudgetCategory[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('budgetConfig');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse budget config", e);
        }
      }
    }
    return BUDGET_CATEGORIES;
  });

  // Initialize Monthly Income (Capital) from localStorage
  const [monthlyIncome, setMonthlyIncome] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('monthlyIncome');
      if (saved) {
        return Number(saved);
      }
    }
    return 6500; // Default fallback
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);

  // Persist data
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgetConfig', JSON.stringify(budgetConfig));
  }, [budgetConfig]);

  useEffect(() => {
    localStorage.setItem('monthlyIncome', monthlyIncome.toString());
  }, [monthlyIncome]);

  // Dynamic Calculations
  const balance = useMemo(() => {
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    return monthlyIncome - totalSpent;
  }, [transactions, monthlyIncome]);

  const budgets = useMemo(() => {
    // Map transaction categories to budget IDs
    const categoryMapping: Record<string, string> = {
      'groceries': 'family',
      'family': 'family',
      'mother': 'mother',
      'savings': 'savings',
      'transport': 'other',
      'food': 'other',
      'entertainment': 'other',
      'other': 'other'
    };

    return budgetConfig.map(budget => {
      const spent = transactions
        .filter(t => categoryMapping[t.category] === budget.id)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return { ...budget, spent };
    });
  }, [transactions, budgetConfig]);

  const weeklyData = useMemo(() => {
    const daysMap = new Map<string, number>();
    const today = new Date();
    const days: DailySpending[] = [];

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = d.toLocaleDateString('ar-SA', { weekday: 'long' });
      const dateKey = d.toISOString().split('T')[0];
      daysMap.set(dateKey, 0);
      days.push({ day: dayName, amount: 0, active: i === 0 });
    }

    // Sum transactions per day
    transactions.forEach(t => {
      const tDate = t.date.split('T')[0];
      if (daysMap.has(tDate)) {
        daysMap.set(tDate, (daysMap.get(tDate) || 0) + t.amount);
      }
    });

    return days.map((d, index) => {
      const dateObj = new Date();
      dateObj.setDate(today.getDate() - (6 - index));
      const dateKey = dateObj.toISOString().split('T')[0];
      return {
        ...d,
        amount: daysMap.get(dateKey) || 0
      };
    });
  }, [transactions]);

  const monthlyBreakdown = useMemo<CategorySpending[]>(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const breakdownMap = new Map<string, number>();
    monthlyTransactions.forEach(t => {
      breakdownMap.set(t.category, (breakdownMap.get(t.category) || 0) + t.amount);
    });

    const labels: Record<string, string> = {
      'groceries': 'مقاضي',
      'transport': 'نقل',
      'food': 'طعام',
      'entertainment': 'ترفيه',
      'mother': 'الوالدة',
      'savings': 'ادخار',
      'family': 'أسرة',
      'other': 'أخرى'
    };

    const colors: Record<string, string> = {
      'groceries': '#13ec5b',
      'transport': '#eab308', 
      'food': '#f97316', 
      'entertainment': '#8b5cf6', 
      'mother': '#ec4899', 
      'savings': '#3b82f6', 
      'family': '#13ec5b',
      'other': '#64748b' 
    };

    return Array.from(breakdownMap.entries())
      .map(([category, amount]) => ({
        category,
        name: labels[category] || 'أخرى',
        amount,
        color: colors[category] || '#64748b'
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const handleAddTransaction = (amount: number, title: string, category: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title,
      amount,
      date: new Date().toISOString(),
      category,
      icon: getIconForCategory(category)
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleUpdateBudgets = (updatedBudgets: BudgetCategory[]) => {
    setBudgetConfig(updatedBudgets);
  };

  const handleUpdateIncome = (newIncome: number) => {
    setMonthlyIncome(newIncome);
  };

  const getIconForCategory = (cat: string) => {
    switch(cat) {
      case 'groceries': return 'shopping_cart';
      case 'transport': return 'local_gas_station';
      case 'food': return 'restaurant';
      case 'entertainment': return 'movie';
      case 'mother': return 'favorite';
      case 'savings': return 'savings';
      case 'family': return 'family_restroom';
      default: return 'payments';
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased selection:bg-primary selection:text-black">
      
      <Header />

      <main className="flex-1 pb-4">
        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-2">
            <BalanceCard 
              balance={balance} 
              onEditClick={() => setIsEditIncomeOpen(true)}
            />
            <BudgetGrid 
              budgets={budgets} 
              onEditClick={() => setIsEditBudgetOpen(true)}
            />
            <AIInsightCard 
              transactions={transactions} 
              budgets={budgets}
              totalBalance={balance}
            />
            <AnalyticsChart 
              weeklyData={weeklyData} 
              monthlyData={monthlyBreakdown}
            />
            <TransactionList transactions={transactions} />
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab !== 'home' && (
          <div className="p-4 flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
            <span className="material-symbols-outlined text-6xl text-surface-border mb-4 opacity-50">
              {activeTab === 'budget' ? 'pie_chart' : activeTab === 'analytics' ? 'analytics' : 'person'}
            </span>
            <h2 className="text-xl font-bold text-white mb-2">
              {activeTab === 'budget' ? 'الميزانية التفصيلية' : activeTab === 'analytics' ? 'التحليلات' : 'الملف الشخصي'}
            </h2>
            <p className="text-text-secondary text-sm max-w-xs">
              هذه الميزة قيد التطوير. ستتمكن قريباً من إدارة {activeTab === 'budget' ? 'ميزانياتك' : activeTab === 'analytics' ? 'تقاريرك المالية' : 'بياناتك'} بشكل أفضل.
            </p>
          </div>
        )}
      </main>

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddClick={() => setIsAddModalOpen(true)}
      />

      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddTransaction}
      />

      <EditBudgetModal 
        isOpen={isEditBudgetOpen}
        onClose={() => setIsEditBudgetOpen(false)}
        budgets={budgetConfig}
        onSave={handleUpdateBudgets}
      />

      <EditIncomeModal 
        isOpen={isEditIncomeOpen}
        onClose={() => setIsEditIncomeOpen(false)}
        currentIncome={monthlyIncome}
        onSave={handleUpdateIncome}
      />
    </div>
  );
};

export default App;