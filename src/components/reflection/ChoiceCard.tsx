import { useState } from 'react';
import { FamilyMember } from '../../App';

interface ChoiceOption {
  id: string;
  emoji: string;
  label: string;
  description: string;
}

interface ChoiceCardProps {
  option: ChoiceOption;
  isSelected: boolean;
  onSelect: () => void;
  familyMember?: FamilyMember;
}

export const ChoiceCard = ({
  option,
  isSelected,
  onSelect,
  familyMember: _familyMember
}: ChoiceCardProps) => {
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = () => {
    onSelect();
    
    // Create floating bubbles on selection
    if (!isSelected) {
      const newBubbles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setBubbles(newBubbles);
      
      // Remove bubbles after animation
      setTimeout(() => setBubbles([]), 2000);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        mood-card glass-card relative overflow-hidden
        w-full p-6 rounded-2xl text-left transition-all duration-400 ease-spring-bounce
        border-2 backdrop-blur-md
        ${isSelected 
          ? 'bg-gradient-to-br from-primary-50/80 to-accent-pink-50/80 border-primary-300/60 shadow-glow-sm transform scale-102' 
          : 'bg-white/60 border-white/40 hover:bg-white/80 hover:border-white/60 hover:shadow-glass'
        }
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
        group
      `}
    >
      {/* Floating bubbles */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="mood-bubble"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
          }}
        />
      ))}

      <div className="flex items-start space-x-4 relative z-10">
        {/* Emoji */}
        <div className="flex-shrink-0">
          <span className={`text-4xl transition-transform duration-300 ${
            isSelected ? 'animate-breathe' : 'group-hover:scale-110'
          }`}>
            {option.emoji}
          </span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`
            font-semibold text-xl mb-2 transition-colors duration-300 tracking-tight
            ${isSelected ? 'text-primary-700' : 'text-neutral-800 group-hover:text-neutral-900'}
          `}>
            {option.label}
          </h3>
          <p className={`
            text-sm leading-relaxed transition-colors duration-300 font-medium
            ${isSelected ? 'text-primary-600' : 'text-neutral-600 group-hover:text-neutral-700'}
          `}>
            {option.description}
          </p>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="flex-shrink-0 animate-spring-in">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-accent-pink-500 shadow-glow-sm">
              <svg 
                className="w-5 h-5 text-white animate-spring-in" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>
    </button>
  );
};

export type { ChoiceOption };