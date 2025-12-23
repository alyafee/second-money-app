import React from 'react';

interface BalanceCardProps {
  balance: number;
  onEditClick: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, onEditClick }) => {
  return (
    <section className="px-4 py-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A29] to-[#112217] border border-surface-border p-6 shadow-lg group">
        {/* Decorative background blur */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20"></div>
        
        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm font-medium">رأس المال المتبقي</span>
            <button 
              onClick={onEditClick}
              className="text-primary hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
              aria-label="Edit Capital"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
            </button>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold tracking-tight text-white">
              {balance.toLocaleString('en-US')}
            </span>
            <span className="text-xl font-bold text-text-secondary">ر.س</span>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full bg-primary/20 px-2 py-1 text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              <span>نشط</span>
            </div>
            <span className="text-xs text-text-secondary">يتم تحديثه تلقائياً</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BalanceCard;