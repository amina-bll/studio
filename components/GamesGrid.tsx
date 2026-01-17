
import React, { useState } from 'react';
import { GAMES, TRANSLATIONS } from '../constants';
import { Game } from '../types';
import GameInterface from './GameInterface';
import SpaceMission3D from './SpaceMission3D';

interface GamesGridProps {
  onGameComplete: (points: number) => void;
}

const GamesGrid: React.FC<GamesGridProps> = ({ onGameComplete }) => {
  const [filter, setFilter] = useState<string>('all');
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  const filteredGames = filter === 'all' 
    ? GAMES 
    : GAMES.filter(g => g.subject === filter);

  const categories = [
    { id: 'all', label: 'الكل', icon: '🌟' },
    { id: 'science', label: TRANSLATIONS.science, icon: '🔬' },
    { id: 'technology', label: TRANSLATIONS.technology, icon: '💻' },
    { id: 'engineering', label: TRANSLATIONS.engineering, icon: '⚙️' },
    { id: 'math', label: TRANSLATIONS.math, icon: '📐' },
  ];

  const handleComplete = (points: number) => {
    onGameComplete(points);
    setActiveGame(null);
  };

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-12">
      {activeGame && activeGame.is3D ? (
        <SpaceMission3D 
          game={activeGame}
          onComplete={handleComplete}
          onCancel={() => setActiveGame(null)}
        />
      ) : activeGame && (
        <GameInterface 
          game={activeGame} 
          onComplete={handleComplete} 
          onCancel={() => setActiveGame(null)} 
        />
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              filter === cat.id 
                ? 'bg-brand-orange text-brand-deep shadow-xl scale-105' 
                : 'bg-brand-dark/50 text-brand-cream border border-brand-lavender/20 hover:bg-brand-lavender/20'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGames.map((game) => (
          <div 
            key={game.id}
            onClick={() => setActiveGame(game)}
            className="group bg-brand-dark/40 rounded-[40px] overflow-hidden border border-brand-lavender/20 hover:border-brand-orange/50 transition-all hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col cursor-pointer"
          >
            <div className="h-64 relative overflow-hidden">
              <img 
                src={game.thumbnail} 
                alt={game.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent opacity-60" />
              <div className="absolute top-4 left-4 bg-brand-deep/80 backdrop-blur-md text-brand-orange text-xs px-5 py-2 rounded-2xl font-black border border-brand-orange/20 shadow-xl">
                {game.difficulty === 'easy' ? 'سهل' : game.difficulty === 'medium' ? 'متوسط' : 'صعب'}
              </div>
              {game.is3D && (
                <div className="absolute bottom-4 right-4 bg-brand-lavender px-4 py-1 rounded-xl text-xs font-black animate-pulse shadow-lg">
                  تجربة 3D كاملة 🚀
                </div>
              )}
            </div>
            <div className="p-8 space-y-4 flex-1 flex flex-col bg-gradient-to-b from-transparent to-brand-dark/20">
              <h3 className="text-2xl md:text-3xl font-black text-brand-cream group-hover:text-brand-orange transition-colors">
                {game.title}
              </h3>
              <p className="text-brand-cream/70 font-medium flex-1 text-sm leading-relaxed">
                {game.description}
              </p>
              <div className="pt-6 border-t border-brand-lavender/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-brand-lavender/20 w-12 h-12 flex items-center justify-center rounded-2xl border border-brand-lavender/20">
                    {game.subject === 'science' ? '🔬' : game.subject === 'technology' ? '💻' : game.subject === 'engineering' ? '⚙️' : '📐'}
                  </span>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-cream/30">المجال</div>
                    <div className="text-xs font-black text-brand-cream/60">{TRANSLATIONS[game.subject]}</div>
                  </div>
                </div>
                <button className="bg-brand-orange text-brand-deep px-8 py-3 rounded-2xl font-black group-hover:scale-105 transition-all shadow-[0_5px_15px_rgba(236,167,44,0.3)]">
                  ابدأ المغامرة
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesGrid;
