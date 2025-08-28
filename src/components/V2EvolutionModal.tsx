import React from 'react';
import { Button } from './ui/button';

interface V2EvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermanentDismiss: () => void;
}

export function V2EvolutionModal({ isOpen, onClose, onPermanentDismiss }: V2EvolutionModalProps) {
  if (!isOpen) return null;

  const handleExploreV2 = () => {
    window.open('https://www.familyflow.space/', '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-orange-200 relative overflow-hidden">
        {/* Celebrative decorations */}
        <div className="absolute -top-2 -left-2 text-4xl animate-bounce">🎉</div>
        <div className="absolute -top-1 -right-3 text-3xl animate-pulse">✨</div>
        <div className="absolute bottom-4 left-4 text-2xl animate-bounce delay-300">🌟</div>
        <div className="absolute bottom-6 right-6 text-3xl animate-pulse delay-500">🎊</div>
        
        {/* Main content */}
        <div className="text-center space-y-6 relative z-10">
          {/* Header with gradient text */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent font-title">
              Big News! 🚀
            </h2>
            <div className="text-xl text-orange-700 font-semibold">
              Family Flow has evolved!
            </div>
          </div>

          {/* Evolution message */}
          <div className="space-y-4 text-gray-700">
            <p className="text-lg leading-relaxed">
              We've created <span className="font-bold text-orange-600">Family Flow V2</span> - 
              a brand new experience built from everything we learned together!
            </p>
            
            <div className="bg-white/70 rounded-2xl p-4 border-2 border-orange-100">
              <p className="text-sm font-medium text-orange-800">
                ✨ New features, better experience, same family-first philosophy ✨
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Don't worry - this version stays exactly as you know and love it. 
              No changes, no pressure to switch!
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={handleExploreV2}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-lg py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🌟 Explore Family Flow V2 🌟
            </Button>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full border-2 border-orange-300 text-orange-700 hover:bg-orange-50 rounded-2xl py-3"
            >
              Stay with Legacy Version
            </Button>
          </div>

          {/* Footer note */}
          <div className="text-xs text-gray-500 bg-white/50 rounded-xl p-3 border border-orange-100">
            <p>
              🏠 Your current app will always be here when you need it
            </p>
          </div>

          {/* Subtle permanent dismiss option */}
          <div className="pt-2 border-t border-orange-100/50">
            <button
              onClick={onPermanentDismiss}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 underline"
            >
              Don't show this again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}