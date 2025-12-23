import React, { useState } from 'react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (amount: number, title: string, category: string) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('groceries');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && title) {
      onAdd(Number(amount), title, category);
      setAmount('');
      setTitle('');
      setCategory('groceries');
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
        <h2 className="text-xl font-bold text-white mb-4 text-center">إضافة معاملة جديدة</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="amount" className="text-xs text-text-secondary mb-1 block">المبلغ (ر.س)</label>
            <input 
              id="amount"
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/20 border border-surface-border rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-left ltr placeholder:text-right transition-all"
              placeholder="0.00"
              autoFocus
              required
              min="1"
              step="any"
            />
          </div>
          <div>
            <label htmlFor="title" className="text-xs text-text-secondary mb-1 block">الوصف</label>
            <input 
              id="title"
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/20 border border-surface-border rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="مثال: سوبرماركت، محطة وقود"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="text-xs text-text-secondary mb-1 block">الفئة</label>
            <div className="relative">
              <select 
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/20 border border-surface-border rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-all"
              >
                <option value="groceries">مقاضي المنزل (عائلة)</option>
                <option value="transport">مواصلات / وقود</option>
                <option value="food">مطاعم و كافيهات</option>
                <option value="entertainment">ترفيه واشتراكات</option>
                <option value="mother">مصروف الوالدة</option>
                <option value="savings">إيداع / ادخار</option>
                <option value="other">أخرى</option>
              </select>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-text-secondary">expand_more</span>
              </div>
            </div>
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
              إضافة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;