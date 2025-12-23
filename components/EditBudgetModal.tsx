import React, { useState, useEffect } from 'react';
import { BudgetCategory } from '../types';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgets: BudgetCategory[];
  onSave: (updatedBudgets: BudgetCategory[]) => void;
}

const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ isOpen, onClose, budgets, onSave }) => {
  const [localBudgets, setLocalBudgets] = useState<BudgetCategory[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLocalBudgets(JSON.parse(JSON.stringify(budgets)));
    }
  }, [isOpen, budgets]);

  if (!isOpen) return null;

  const handleAmountChange = (id: string, amount: string) => {
    setLocalBudgets(prev => prev.map(b => 
      b.id === id ? { ...b, allocated: Number(amount) } : b
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localBudgets);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-surface-dark border border-surface-border rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-white">تعديل الميزانية</h2>
          <p className="text-xs text-text-secondary mt-1">حدد المبلغ المخصص لكل فئة</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto no-scrollbar flex-1 px-1">
          {localBudgets.map((budget) => (
            <div key={budget.id} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${budget.colorBg} ${budget.colorText}`}>
                <span className="material-symbols-outlined text-xl">{budget.icon}</span>
              </div>
              <div className="flex-1">
                <label className="text-xs text-text-secondary font-medium block mb-1">{budget.name}</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={budget.allocated}
                    onChange={(e) => handleAmountChange(budget.id, e.target.value)}
                    className="w-full bg-transparent border-b border-surface-border py-1 text-white font-bold focus:border-primary outline-none transition-colors"
                  />
                  <span className="text-xs text-text-secondary">ر.س</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-4 mt-auto flex gap-3 sticky bottom-0 bg-surface-dark">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 rounded-xl bg-primary text-background-dark font-bold hover:bg-primary-dark transition-colors cursor-pointer shadow-lg shadow-primary/20"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBudgetModal;