
import React from 'react';
import { TRANSLATIONS } from '../constants';
import ThreeScene from './ThreeScene';

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const handlePlanetClick = (name: string) => {
    alert(`لقد اكتشفت كوكب ${name}! استعد للمغامرة في ألعابنا.`);
  };

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
      <div className="lg:w-1/2 space-y-8 animate-fade-in text-center lg:text-right">
        <div className="inline-flex items-center gap-2 bg-brand-orange/20 text-brand-orange px-4 py-1 rounded-full font-bold text-sm">
          <span className="animate-pulse">✨</span>
          <span>تيكيد: مستقبل التعلم</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-brand-cream leading-tight">
          {TRANSLATIONS.heroTitle}
        </h1>
        <p className="text-xl text-brand-cream/80 leading-relaxed font-medium">
          {TRANSLATIONS.heroSubtitle}
        </p>
        <button
          onClick={onStart}
          className="group relative bg-brand-orange text-brand-deep px-10 py-5 rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-all active:scale-95 overflow-hidden"
        >
          <span className="relative z-10">{TRANSLATIONS.startLearning}</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>

      <div className="lg:w-1/2 w-full h-[400px] md:h-[600px] relative">
        <ThreeScene onInteract={handlePlanetClick} />
        <div className="absolute -bottom-4 -right-4 bg-brand-lavender p-4 rounded-2xl shadow-lg border-2 border-brand-cream animate-bounce">
          <p className="text-sm font-bold">اضغط على الكواكب للاستكشاف! 🛸</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
