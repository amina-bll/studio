
import React from 'react';
import { BADGES, LEADERBOARD, TRANSLATIONS } from '../constants';

interface DashboardProps {
  userPoints: number;
}

const Dashboard: React.FC<DashboardProps> = ({ userPoints }) => {
  const stats = {
    name: 'أحمد البطل',
    level: Math.floor(userPoints / 500) + 1,
    xp: userPoints,
    completed: Math.floor(userPoints / 300),
    rank: userPoints > 1000 ? 'مستكشف فضائي محترف' : 'مستكشف ناشئ'
  };

  const nextLevelXp = stats.level * 500;
  const progressPercent = (stats.xp % 500) / 5;

  return (
    <div className="pt-24 pb-32 px-6 max-w-6xl mx-auto space-y-12">
      {/* Profile Header */}
      <div className="bg-brand-dark/50 p-10 rounded-[40px] border-2 border-brand-lavender/30 flex flex-col md:flex-row items-center gap-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="w-40 h-40 bg-brand-orange rounded-full flex items-center justify-center text-8xl shadow-[0_0_40px_rgba(236,167,44,0.3)] border-8 border-brand-cream/10 relative z-10">
          👦
        </div>
        
        <div className="flex-1 space-y-6 text-center md:text-right relative z-10 w-full">
          <div>
            <h2 className="text-4xl font-black text-brand-cream mb-2">{stats.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="bg-brand-lavender px-6 py-2 rounded-2xl font-black text-lg">
                {TRANSLATIONS.level} {stats.level}
              </span>
              <span className="bg-brand-orange/20 text-brand-orange px-6 py-2 rounded-2xl font-black text-lg border border-brand-orange/30">
                {stats.rank}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between font-black text-brand-cream/60 px-2">
              <span>{stats.xp} / {nextLevelXp} {TRANSLATIONS.xp}</span>
              <span>المستوى القادم</span>
            </div>
            <div className="w-full bg-brand-deep h-6 rounded-full overflow-hidden border-2 border-brand-lavender/20 p-1">
              <div 
                className="bg-brand-orange h-full rounded-full shadow-[0_0_20px_rgba(236,167,44,0.6)] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Badges */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-brand-dark/30 p-8 rounded-[32px] border border-brand-lavender/20 space-y-4 hover:border-brand-orange/30 transition-all">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <span className="bg-brand-orange/20 p-2 rounded-xl">📊</span> {TRANSLATIONS.completedGames}
              </h3>
              <div className="text-7xl font-black text-brand-orange">{stats.completed}</div>
              <p className="text-brand-cream/60 font-bold">كلما لعبت أكثر، زاد ذكاؤك! 🧠</p>
            </div>

            <div className="bg-brand-dark/30 p-8 rounded-[32px] border border-brand-lavender/20 space-y-4 hover:border-brand-orange/30 transition-all">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <span className="bg-brand-lavender/20 p-2 rounded-xl">🏅</span> {TRANSLATIONS.badges}
              </h3>
              <div className="flex gap-4 flex-wrap">
                {BADGES.map(badge => (
                  <div key={badge.id} className="group relative">
                    <div className="w-20 h-20 bg-brand-lavender/30 rounded-3xl flex items-center justify-center text-4xl hover:scale-110 hover:bg-brand-orange transition-all cursor-help shadow-xl border-2 border-brand-lavender/20">
                      {badge.icon}
                    </div>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-cream text-brand-deep text-sm font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-2xl z-50">
                      {badge.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-brand-dark/30 p-10 rounded-[40px] border border-brand-lavender/20">
            <div className="flex items-center gap-4 mb-8">
               <span className="text-4xl">🚀</span>
               <h3 className="text-3xl font-black">مهمتك القادمة</h3>
            </div>
            <div className="bg-brand-deep/50 p-6 rounded-3xl border-r-8 border-brand-orange space-y-2">
              <p className="text-xl font-black text-brand-cream">أكمل 3 تحديات في قسم "الهندسة"</p>
              <p className="text-brand-orange font-bold">المكافأة: وسام المهندس البارع + 500 نقطة</p>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="bg-brand-dark/50 rounded-[40px] border-2 border-brand-lavender/20 overflow-hidden shadow-2xl flex flex-col h-fit">
          <div className="bg-brand-lavender/20 p-8 border-b border-brand-lavender/20">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <span>🏆</span> {TRANSLATIONS.leaderboard}
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {LEADERBOARD.map((entry, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-4 p-5 rounded-3xl transition-all ${
                  entry.name === stats.name 
                    ? 'bg-brand-orange text-brand-deep shadow-lg scale-[1.02]' 
                    : 'bg-brand-deep/30 text-brand-cream'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xl ${
                  idx === 0 ? 'bg-yellow-400 text-brand-deep' : 
                  idx === 1 ? 'bg-gray-300 text-brand-deep' : 
                  idx === 2 ? 'bg-orange-400 text-brand-deep' : 'bg-brand-lavender/30'
                }`}>
                  {idx + 1}
                </div>
                <div className="text-3xl">{entry.avatar}</div>
                <div className="flex-1 font-black text-lg">{entry.name}</div>
                <div className={`font-black text-lg ${entry.name === stats.name ? 'text-brand-deep' : 'text-brand-orange'}`}>
                  {entry.name === stats.name ? stats.xp : entry.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
