import React, { useMemo } from 'react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  return (
    <section className="px-4 py-2 mb-24">
      <h3 className="text-lg font-bold text-white mb-3">النشاط الأخير</h3>
      <div className="flex flex-col gap-2">
        {sortedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-surface-border rounded-xl bg-surface-dark/30">
            <span className="material-symbols-outlined text-4xl text-surface-border mb-2">receipt_long</span>
            <p className="text-text-secondary text-sm">لا توجد معاملات مسجلة</p>
            <p className="text-xs text-gray-500 mt-1">اضغط على زر + لإضافة مصروفاتك</p>
          </div>
        ) : (
          sortedTransactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-dark border border-surface-border/50 hover:bg-surface-dark/80 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="bg-white/5 p-2 rounded-full flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-white group-hover:text-primary text-sm transition-colors">{t.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.title}</p>
                  <p className="text-[10px] text-text-secondary font-medium">
                    {new Date(t.date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-white dir-ltr">-{t.amount.toLocaleString()} ر.س</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default TransactionList;