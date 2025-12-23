import React from 'react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onAddClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onAddClick }) => {
  const getTabClass = (tab: Tab) => 
    `flex flex-col items-center justify-center gap-1 w-full h-full cursor-pointer hover:bg-white/5 transition-colors ${activeTab === tab ? 'text-primary' : 'text-text-secondary hover:text-white'}`;

  return (
    <nav className="fixed bottom-0 w-full bg-background-dark/95 backdrop-blur-lg border-t border-surface-border z-40 pb-safe safe-bottom">
      <div className="flex justify-around items-center h-16">
        <button onClick={() => setActiveTab('home')} className={getTabClass('home')}>
          <span className={`material-symbols-outlined text-2xl ${activeTab === 'home' ? 'fill-current' : ''}`}>dashboard</span>
          <span className="text-[10px] font-medium">الرئيسية</span>
        </button>
        
        <button onClick={() => setActiveTab('budget')} className={getTabClass('budget')}>
          <span className={`material-symbols-outlined text-2xl ${activeTab === 'budget' ? 'fill-current' : ''}`}>pie_chart</span>
          <span className="text-[10px] font-medium">الميزانية</span>
        </button>
        
        <div className="relative -top-5">
          <button 
            onClick={onAddClick}
            className="flex items-center justify-center w-14 h-14 bg-primary text-background-dark rounded-full shadow-[0_0_20px_rgba(19,236,91,0.4)] hover:scale-105 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>
        
        <button onClick={() => setActiveTab('analytics')} className={getTabClass('analytics')}>
          <span className={`material-symbols-outlined text-2xl ${activeTab === 'analytics' ? 'fill-current' : ''}`}>analytics</span>
          <span className="text-[10px] font-medium">تحليل</span>
        </button>
        
        <button onClick={() => setActiveTab('profile')} className={getTabClass('profile')}>
          <span className={`material-symbols-outlined text-2xl ${activeTab === 'profile' ? 'fill-current' : ''}`}>person</span>
          <span className="text-[10px] font-medium">حسابي</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;