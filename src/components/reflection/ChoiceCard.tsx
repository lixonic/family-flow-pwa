import React from 'react';
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

export const ChoiceCard: React.FC<ChoiceCardProps> = ({
  option,
  isSelected,
  onSelect,
  familyMember
}) => {
  const getBorderColor = () => {
    if (isSelected && familyMember) {
      return familyMember.color;
    }
    return isSelected ? '#F97316' : '#E5E7EB'; // Orange or gray
  };

  const getBackgroundColor = () => {
    if (isSelected) {
      return 'rgba(249, 115, 22, 0.05)'; // Light orange background when selected
    }
    return 'white';
  };

  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ease-in-out
        hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
        ${isSelected ? 'shadow-md' : 'shadow-sm hover:shadow-md'}
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
      `}
      style={{
        borderColor: getBorderColor(),
        backgroundColor: getBackgroundColor()
      }}
    >
      <div className="flex items-start space-x-3">
        {/* Emoji */}
        <div className="flex-shrink-0">
          <span className="text-3xl">{option.emoji}</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`
            font-medium text-lg mb-1 transition-colors
            ${isSelected ? 'text-orange-700' : 'text-gray-900'}
          `}>
            {option.label}
          </h3>
          <p className={`
            text-sm leading-relaxed transition-colors
            ${isSelected ? 'text-orange-600' : 'text-gray-600'}
          `}>
            {option.description}
          </p>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="flex-shrink-0">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: familyMember?.color || '#F97316' }}
            >
              <svg 
                className="w-4 h-4 text-white" 
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
    </button>
  );
};

export type { ChoiceOption };