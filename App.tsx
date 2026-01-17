
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import GamesGrid from './components/GamesGrid';
import Dashboard from './components/Dashboard';
import FeedbackForm from './components/FeedbackForm';
import { ViewState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [points, setPoints] = useState<number>(2450); // Initial mocked points

  const handleGameComplete = (earnedPoints: number) => {
    setPoints(prev => prev + earnedPoints);
    setView('dashboard');
  };

  const renderView = () => {
    switch (view) {
      case 'home':
        return <Home onStart={() => setView('games')} />;
      case 'games':
        return <GamesGrid onGameComplete={handleGameComplete} />;
      case 'dashboard':
        return <Dashboard userPoints={points} />;
      case 'feedback':
        return <FeedbackForm />;
      default:
        return <Home onStart={() => setView('games')} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-deep selection:bg-brand-orange selection:text-brand-deep overflow-x-hidden">
      {/* Dynamic Background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-brand-lavender rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] left-[10%] w-80 h-80 bg-brand-orange rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <header className="fixed top-0 left-0 w-full z-40 bg-brand-deep/50 backdrop-blur-xl border-b border-brand-lavender/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView('home')}
          >
            <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-brand-deep font-black text-2xl group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(236,167,44,0.4)]">
              T
            </div>
            <span className="text-2xl font-black text-brand-cream tracking-tighter">
              TEKK<span className="text-brand-orange italic">Id</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
             <div className="bg-brand-lavender/20 px-4 py-2 rounded-xl flex items-center gap-3 border border-brand-lavender/20">
                <span className="text-brand-orange text-xl">✨</span>
                <span className="font-black text-brand-cream">{points} نقطة</span>
             </div>
             <button 
               onClick={() => setView('dashboard')}
               className="bg-brand-orange text-brand-deep px-5 py-2 rounded-xl font-black shadow-lg hover:scale-105 transition-all active:scale-95"
             >
               حسابي
             </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 min-h-[calc(100vh-80px)]">
        {renderView()}
      </main>

      <Navigation currentView={view} setView={setView} />
      
      <footer className="py-12 px-6 text-center border-t border-brand-lavender/10 opacity-60">
        <p className="font-bold">© 2024 تيكيد - منصة العلم والمرح للجيل الجديد</p>
      </footer>
    </div>
  );
};

export default App;
