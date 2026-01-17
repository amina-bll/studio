
import React, { useState } from 'react';
import { Game } from '../types';
import { TRANSLATIONS } from '../constants';

interface GameInterfaceProps {
  game: Game;
  onComplete: (points: number) => void;
  onCancel: () => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ game, onComplete, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = game.quiz.questions[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    const isCorrect = index === currentQuestion.correctAnswer;
    setShowResult(isCorrect);
    if (isCorrect) setScore(s => s + 100);
  };

  const handleNext = () => {
    if (currentQuestionIndex < game.quiz.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setShowResult(null);
    } else {
      onComplete(score);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 bg-brand-deep overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(128,75,152,0.4)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-4xl w-full h-full md:h-[95vh] bg-brand-dark/60 md:rounded-[60px] p-4 md:p-8 flex flex-col justify-between border-brand-lavender/20 md:border-8 shadow-[0_0_150px_rgba(0,0,0,0.9)] backdrop-blur-3xl relative overflow-hidden">
        
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-lavender/10">
           <div 
             className="h-full bg-brand-orange shadow-[0_0_20px_rgba(236,167,44,0.8)] transition-all duration-700 ease-out"
             style={{ width: `${((currentQuestionIndex + 1) / game.quiz.questions.length) * 100}%` }}
           />
        </div>

        {/* Top Header */}
        <div className="flex justify-between items-center z-10 px-4 mt-2">
          <button 
            onClick={onCancel}
            className="text-brand-cream/40 hover:text-brand-orange transition-all font-black text-sm flex items-center gap-2 group"
          >
            <span className="bg-brand-lavender/20 w-8 h-8 flex items-center justify-center rounded-full border border-brand-lavender/30">✕</span>
            <span>توقف</span>
          </button>
          
          <div className="flex gap-2">
             <div className="bg-brand-deep/90 px-4 py-1 rounded-xl border border-brand-orange/40 flex flex-col items-center min-w-[70px]">
                <span className="text-[8px] uppercase font-black opacity-60 text-brand-orange">النقاط</span>
                <span className="text-lg font-black text-brand-cream">{score}</span>
             </div>
             <div className="bg-brand-deep/90 px-4 py-1 rounded-xl border border-brand-lavender/40 flex flex-col items-center min-w-[70px]">
                <span className="text-[8px] uppercase font-black opacity-60 text-brand-lavender">السؤال</span>
                <span className="text-lg font-black text-brand-cream">{currentQuestionIndex + 1}/{game.quiz.questions.length}</span>
             </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 space-y-4 z-10 overflow-y-auto">
          {currentQuestion.imageUrl && (
            <div className="w-full max-w-lg max-h-[35vh] aspect-video rounded-3xl overflow-hidden border-2 border-brand-orange/40 shadow-xl relative group flex-shrink-0 bg-brand-deep">
              <img 
                src={currentQuestion.imageUrl} 
                alt="Question visual" 
                className="w-full h-full object-contain md:object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/50 to-transparent pointer-events-none" />
            </div>
          )}

          <h2 className="text-xl md:text-3xl font-black text-brand-cream text-center leading-tight max-w-3xl px-6">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full max-w-4xl px-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleOptionSelect(idx)}
                className={`p-4 md:p-6 rounded-2xl text-center font-black text-lg md:text-xl transition-all border-b-4 active:border-b-0 active:translate-y-1 relative overflow-hidden group shadow-md ${
                  selectedOption === null 
                    ? 'bg-brand-lavender/10 border-brand-lavender/30 hover:bg-brand-lavender/30 text-brand-cream'
                    : idx === currentQuestion.correctAnswer
                      ? 'bg-green-500 border-green-700 text-white scale-[1.02]'
                      : selectedOption === idx
                        ? 'bg-red-500 border-red-700 text-white'
                        : 'bg-brand-lavender/5 text-brand-cream/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-4 z-10 pb-2">
          {showResult !== null && (
            <div className={`px-8 py-3 rounded-2xl font-black text-xl animate-bounce shadow-lg border-2 ${showResult ? 'bg-green-500 border-green-300 text-white' : 'bg-red-500 border-red-300 text-white'}`}>
               {showResult ? '🌟 إجابة صحيحة!' : '💡 حاول مرة أخرى!'}
            </div>
          )}

          {selectedOption !== null && (
            <button
              onClick={handleNext}
              className="w-full max-w-xs bg-brand-orange text-brand-deep py-4 rounded-2xl font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all mb-2 border-b-4 border-brand-dark active:border-b-0"
            >
              {currentQuestionIndex < game.quiz.questions.length - 1 ? 'المحطة التالية' : 'إنهاء المهمة'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameInterface;
