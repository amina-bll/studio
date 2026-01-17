
import React from 'react';
import { ViewState } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems: { id: ViewState; label: string; icon: string }[] = [
    { id: 'home', label: TRANSLATIONS.home, icon: '🏠' },
    { id: 'games', label: TRANSLATIONS.games, icon: '🎮' },
    { id: 'dashboard', label: TRANSLATIONS.dashboard, icon: '🏆' },
    { id: 'feedback', label: TRANSLATIONS.feedback, icon: '💬' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-dark/80 backdrop-blur-xl border border-brand-lavender/30 rounded-full px-6 py-3 shadow-2xl z-50 flex items-center gap-2 md:gap-8">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-bold ${
            currentView === item.id
              ? 'bg-brand-orange text-brand-deep scale-110 shadow-lg'
              : 'text-brand-cream hover:bg-brand-lavender/20'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="hidden md:inline">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
