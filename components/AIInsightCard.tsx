import React, { useEffect, useState } from 'react';
import { getFinancialInsight } from '../services/geminiService';
import { Transaction, BudgetCategory } from '../types';

interface AIInsightCardProps {
  transactions: Transaction[];
  budgets: BudgetCategory[];
  totalBalance: number;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ transactions, budgets, totalBalance }) => {
  const [insight, setInsight] = useState<string>('جاري تحليل بياناتك المالية...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      // Simulate network delay for effect
      setLoading(true);
      const result = await getFinancialInsight(transactions, budgets, totalBalance);
      setInsight(result);
      setLoading(false);
    };

    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length, budgets, totalBalance]); // Re-run if transactions change significantly

  return (
    <section className="px-4 py-2">
      <div className="rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 p-1 shadow-lg">
        <div className="flex items-start gap-4 rounded-lg bg-background-dark/50 p-4 backdrop-blur-sm">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`material-symbols-outlined text-purple-400 ${loading ? 'animate-spin' : ''}`}>auto_awesome</span>
              <h3 className="text-base font-bold text-white">رؤية ذكية</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed font-normal">
              {loading ? (
                <span className="animate-pulse">الذكاء الاصطناعي يقرأ مصروفاتك...</span>
              ) : (
                insight
              )}
            </p>
          </div>
          <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative border border-white/10">
            <div 
              className="w-full h-full bg-cover bg-center" 
              style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD3iecZjL7PT8spMXQuFNugqISXaas1xKT8wg-TwNL-veru9KCBoDLV0ToyU5hq2JCR8VDWuDx5ZCnhITBhvbo52IduLDhdE7YmnFB-r9by9dFWs9AWgyTuGzvgC4Zo7X6q3iwEpYx2cyiX7nA8mtjMRw4zYUYB5AFHRtZJ2t5o6u-01Vso_YJXONlP6cQprOAzAwhJVD9-rVjoaD9FAHpJABMxmAHtZiXV-CemP27L0zsNWL3UO8e5js8sLIHPubPRIAAS8gL9rc2B")` }}
            ></div>
            <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIInsightCard;