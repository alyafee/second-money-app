import React from 'react';
import { BudgetCategory } from '../types';

interface BudgetGridProps {
  budgets: BudgetCategory[];
  onEditClick: () => void;
}

const BudgetGrid: React.FC<BudgetGridProps> = ({ budgets, onEditClick }) => {
  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">توزيع الميزانية</h3>
        <button 
          onClick={onEditClick}
          className="text-sm text-primary font-medium hover:text-primary/80 transition-colors cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">edit</span>
          تعديل
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {budgets.map((budget) => {
          const percentage = budget.allocated > 0 
            ? Math.min(100, (budget.spent / budget.allocated) * 100) 
            : 0;
          
          const isCompleted = budget.spent >= budget.allocated && budget.allocated > 0;
          const statusText = isCompleted ? 'تجاوز' : 'متبقي';
          
          // Determine status color: Red if over budget, Green/Blue otherwise
          const isOverBudget = budget.spent > budget.allocated;
          const statusBg = isOverBudget ? 'bg-red-500/10' : (isCompleted ? 'bg-blue-500/10' : 'bg-primary/10');
          const statusColor = isOverBudget ? 'text-red-400' : (isCompleted ? 'text-blue-400' : 'text-primary');
          const statusLabel = isOverBudget ? 'تجاوز' : (percentage >= 100 ? 'مكتمل' : 'متبقي');

          return (
            <div key={budget.id} className="flex flex-col gap-3 rounded-xl border border-surface-border bg-surface-dark p-4 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className={`rounded-full p-2 flex items-center justify-center transition-transform group-hover:scale-110 ${budget.colorBg} ${budget.colorText}`}>
                  <span className="material-symbols-outlined text-[20px]">{budget.icon}</span>
                </div>
                {budget.allocated > 0 && (
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBg} ${statusColor}`}>
                    {statusLabel}
                  </span>
                )}
              </div>
              
              <div>
                <p className="text-text-secondary text-xs mb-1">{budget.name}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-white text-base font-bold">{budget.allocated.toLocaleString()}</p>
                  <span className="text-[10px] text-text-secondary">ر.س</span>
                </div>
                <p className="text-[10px] text-text-secondary mt-0.5">تم صرف: {budget.spent.toLocaleString()}</p>
              </div>
              
              <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : budget.color}`} 
                  style={{ width: `${isOverBudget ? 100 : percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BudgetGrid;