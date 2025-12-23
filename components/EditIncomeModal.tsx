import React, { useState, useEffect } from 'react';

interface EditIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIncome: number;
  onSave: (newIncome: number) => void;
}

const EditIncomeModal: React.FC<EditIncomeModalProps> = ({ isOpen, onClose, currentIncome, onSave }) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount(currentIncome.toString());
    }
  }, [isOpen, currentIncome]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount) {
      onSave(Number(amount));
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-surface-dark border border-surface-border rounded-2xl p-6 shadow-2xl scale-100 transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4 text-center">تعديل رأس المال</h2>
        <p className="text-xs text-text-secondary text-center mb-6">أدخل قيمة الدخل الشهري أو الميزانية الكلية لهذا الشهر</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="income" className="text-xs text-text-secondary mb-1 block">المبلغ (ر.س)</label>
            <input 
              id="income"
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/20 border border-surface-border rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-left ltr placeholder:text-right text-lg font-bold"
              placeholder="0.00"
              autoFocus
              required
              min="0"
            />
          </div>
          
          <div className="flex gap-3 mt-4">
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
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncomeModal;