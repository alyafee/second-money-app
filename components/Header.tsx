import React from 'react';
import { MOCK_USER } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 pb-2 sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md transition-all">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div 
            className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 border-2 border-primary" 
            style={{ backgroundImage: `url("${MOCK_USER.avatar}")` }}
            aria-label="User profile picture"
          >
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background-dark"></div>
        </div>
        <div>
          <h2 className="text-sm text-text-secondary font-medium">مرحباً بعودتك</h2>
          <h1 className="text-lg font-bold leading-tight text-white">{MOCK_USER.name}</h1>
        </div>
      </div>
      <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer">
        <span className="material-symbols-outlined text-white">notifications</span>
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
      </button>
    </header>
  );
};

export default Header;