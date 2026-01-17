
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';

const FeedbackForm: React.FC = () => {
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  if (submitted) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-[60vh] px-6">
        <div className="bg-brand-dark/50 p-12 rounded-3xl border-4 border-brand-orange text-center animate-bounce shadow-2xl">
          <div className="text-7xl mb-4">🌟</div>
          <h2 className="text-3xl font-black text-brand-cream mb-2">شكراً لك يا بطل!</h2>
          <p className="text-lg font-bold text-brand-orange">لقد استلمنا رأيك وسنعمل به فوراً.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
      <div className="bg-brand-dark/50 p-10 rounded-3xl border border-brand-lavender/30 shadow-2xl space-y-8 backdrop-blur-md">
        <div className="text-center">
          <h2 className="text-4xl font-black text-brand-cream mb-2">{TRANSLATIONS.feedback}</h2>
          <p className="text-brand-cream/60 font-medium">أخبرنا كيف كانت تجربتك لنطور لك أفضل الألعاب!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-lg font-bold text-center">كيف تقيم تجربتك؟</label>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all shadow-lg ${
                    rating >= num 
                      ? 'bg-brand-orange text-brand-deep scale-110 shadow-orange-500/20' 
                      : 'bg-brand-deep text-brand-cream/30 border border-brand-lavender/20'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-bold">رسالتك:</label>
            <textarea 
              className="w-full bg-brand-deep border-2 border-brand-lavender/20 rounded-2xl p-4 h-32 focus:border-brand-orange outline-none transition-colors text-brand-cream font-bold placeholder:text-brand-cream/20"
              placeholder={TRANSLATIONS.comment}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-orange text-brand-deep py-4 rounded-2xl font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {TRANSLATIONS.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
