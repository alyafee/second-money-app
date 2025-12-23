import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './services/supabaseClient'; // Import Supabase
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
import SettingsTab from './components/SettingsTab'; // Import Settings Tab

import { BUDGET_CATEGORIES } from './constants';
import { Tab, Transaction, BudgetCategory, DailySpending, CategorySpending } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetConfig, setBudgetConfig] = useState<BudgetCategory[]>(BUDGET_CATEGORIES);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(6500);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);

  // --- Supabase Integration ---

  // 1. Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch Transactions
        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });
        
        if (txData) setTransactions(txData);
        if (txError) console.error('Error fetching transactions:', txError);

        // Fetch Budgets (Allocations)
        const { data: budgetData, error: budgetError } = await supabase
          .from('budgets')
          .select('*');

        if (budgetData && budgetData.length > 0) {
            setBudgetConfig(prev => prev.map(b => {
                const remote = budgetData.find((rb: any) => rb.category_id === b.id);
                return remote ? { ...b, allocated: remote.allocated } : b;
            }));
        }

        // Fetch Settings (Income)
        const { data: settingsData } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'monthly_income')
          .single();
        
        if (settingsData) {
            setMonthlyIncome(Number(settingsData.value));
        }

      } catch (error) {
        console.error('Supabase connection error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Real-time Subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('realtime-db')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        if (payload.eventType === 'INSERT') {
            setTransactions(prev => [payload.new as Transaction, ...prev]);
        } else if (payload.eventType === 'DELETE') {
            setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, (payload) => {
         if (payload.new && (payload.new as any).key === 'monthly_income') {
             setMonthlyIncome(Number((payload.new as any).value));
         }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. Actions (Write to Supabase)

  const handleAddTransaction = async (amount: number, title: string, category: string) => {
    const newTransaction = {
      id: crypto.randomUUID(), // Generate ID
      title,
      amount,
      date: new Date().toISOString(),
      category,
      icon: getIconForCategory(category)
    };

    // Optimistic Update (Immediate UI feedback)
    setTransactions(prev => [newTransaction, ...prev]);

    // Send to DB
    const { error } = await supabase.from('transactions').insert([newTransaction]);
    if (error) {
        console.error("Error adding transaction:", error);
        // Rollback if needed, but for now we keep it simple
    }
  };

  const handleUpdateBudgets = async (updatedBudgets: BudgetCategory[]) => {
    setBudgetConfig(updatedBudgets);
    
    // Upsert to DB
    const upsertData = updatedBudgets.map(b => ({
        category_id: b.id,
        allocated: b.allocated
    }));
    
    const { error } = await supabase.from('budgets').upsert(upsertData);
    if (error) console.error("Error updating budgets:", error);
  };

  const handleUpdateIncome = async (newIncome: number) => {
    setMonthlyIncome(newIncome);
    
    // Upsert to DB
    const { error } = await supabase.from('settings').upsert({
        key: 'monthly_income',
        value: newIncome.toString()
    });
    if (error) console.error("Error updating income:", error);
  };


  // --- Helper Logic ---

  const balance = useMemo(() => {
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    return monthlyIncome - totalSpent;
  }, [transactions, monthlyIncome]);

  const budgets = useMemo(() => {
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
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = d.toLocaleDateString('ar-SA', { weekday: 'long' });
      const dateKey = d.toISOString().split('T')[0];
      daysMap.set(dateKey, 0);
      days.push({ day: dayName, amount: 0, active: i === 0 });
    }
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
      return { ...d, amount: daysMap.get(dateKey) || 0 };
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
      'groceries': 'مقاضي', 'transport': 'نقل', 'food': 'طعام',
      'entertainment': 'ترفيه', 'mother': 'الوالدة', 'savings': 'ادخار',
      'family': 'أسرة', 'other': 'أخرى'
    };
    const colors: Record<string, string> = {
      'groceries': '#13ec5b', 'transport': '#eab308', 'food': '#f97316',
      'entertainment': '#8b5cf6', 'mother': '#ec4899', 'savings': '#3b82f6',
      'family': '#13ec5b', 'other': '#64748b'
    };
    return Array.from(breakdownMap.entries())
      .map(([category, amount]) => ({
        category,
        name: labels[category] || 'أخرى',
        amount,
        color: colors[category] || '#64748b'
      })).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

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
        
        {/* Settings / Profile Tab */}
        {activeTab === 'profile' && (
             <SettingsTab 
                currentIncome={monthlyIncome}
                onUpdateIncome={handleUpdateIncome}
                transactions={transactions}
                budgets={budgets}
             />
        )}

        {/* Placeholders for other tabs */}
        {(activeTab !== 'home' && activeTab !== 'profile') && (
          <div className="p-4 flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
            <span className="material-symbols-outlined text-6xl text-surface-border mb-4 opacity-50">
              {activeTab === 'budget' ? 'pie_chart' : 'analytics'}
            </span>
            <h2 className="text-xl font-bold text-white mb-2">
              {activeTab === 'budget' ? 'الميزانية التفصيلية' : 'التحليلات'}
            </h2>
            <p className="text-text-secondary text-sm max-w-xs">
              سيتم تفعيل هذه الميزة قريباً.
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
      
      {isLoading && transactions.length === 0 && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
         </div>
      )}
    </div>
  );
};

export default App;