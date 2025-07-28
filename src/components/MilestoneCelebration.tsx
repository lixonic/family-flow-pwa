import { useState, useEffect } from 'react';
import { GraduationMilestone } from '../App';

interface MilestoneCelebrationProps {
  milestone: GraduationMilestone;
  onCelebrationComplete: (milestoneId: string) => void;
}

export function MilestoneCelebration({ milestone, onCelebrationComplete }: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger celebration animation
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setShowContent(true), 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCelebrationComplete(milestone.id);
    }, 300);
  };

  const getCelebrationEmoji = () => {
    switch (milestone.threshold) {
      case 15: return '🌱';
      case 30: return '🚀';
      case 45: return '🎓';
      default: return '⭐';
    }
  };

  const getCelebrationColor = () => {
    switch (milestone.threshold) {
      case 15: return 'from-green-400 to-emerald-500';
      case 30: return 'from-blue-400 to-cyan-500';
      case 45: return 'from-purple-400 to-pink-500';
      default: return 'from-orange-400 to-red-500';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`relative mx-4 max-w-md transform rounded-3xl bg-white p-8 text-center shadow-2xl transition-all duration-500 ${showContent ? 'scale-100' : 'scale-75'}`}>
        {/* Celebration Background Effect */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${getCelebrationColor()} opacity-10`}></div>
        
        {/* Animated Emoji */}
        <div className="relative mb-6">
          <div className={`text-6xl transition-all duration-700 ${showContent ? 'animate-bounce' : ''}`}>
            {getCelebrationEmoji()}
          </div>
          
          {/* Sparkle Effects */}
          {showContent && (
            <>
              <div className="absolute -top-2 -right-2 text-2xl animate-ping">✨</div>
              <div className="absolute -bottom-2 -left-2 text-2xl animate-ping delay-300">🎉</div>
              <div className="absolute top-0 left-0 text-xl animate-ping delay-500">⭐</div>
            </>
          )}
        </div>

        {/* Milestone Content */}
        <div className={`relative transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900 font-title">
            {milestone.title}
          </h2>
          
          <p className="mb-6 text-gray-600 leading-relaxed">
            {milestone.description}
          </p>

          {/* Progress Badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${getCelebrationColor()} text-white font-semibold mb-6`}>
            <span className="mr-2">{getCelebrationEmoji()}</span>
            {milestone.threshold} Days Milestone Reached!
          </div>

          {/* Motivational Message */}
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
            <div className="text-sm text-gray-700">
              {milestone.threshold === 15 && (
                <>
                  <p className="font-medium text-gray-800 mb-2">What if connection took just 2 minutes?</p>
                  <p className="italic">No lectures. No screen time battles. Just a gentle daily ritual that brings your family's hearts back together, one check-in at a time.</p>
                </>
              )}
              {milestone.threshold === 30 && (
                <>
                  <p className="font-medium text-gray-800 mb-2">From digital prompts to real conversations</p>
                  <p className="italic">Watch your family rediscover each other. First through gentle app prompts, then naturally around the dinner table. Real connection, lasting change.</p>
                </>
              )}
              {milestone.threshold === 45 && (
                <>
                  <p className="font-medium text-gray-800 mb-2">Success means you won't need us forever</p>
                  <p className="italic">In 30-45 days, you'll have built the habit of truly seeing each other. The app becomes training wheels you happily leave behind.</p>
                </>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className={`w-full py-3 px-6 rounded-2xl bg-gradient-to-r ${getCelebrationColor()} text-white font-semibold transition-all duration-300 hover:shadow-lg active:scale-95`}
          >
            Continue Growing Together
          </button>
        </div>
      </div>
    </div>
  );
}