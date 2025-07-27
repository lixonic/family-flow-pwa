import React from 'react';
import { Heart, MessageSquare, BookHeart, Wind, Archive } from 'lucide-react';

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'day-glow', icon: Heart, label: 'Mood', color: 'text-orange-600' },
    { id: 'screen-time', icon: MessageSquare, label: 'Reflect', color: 'text-red-600' },
    { id: 'gratitude', icon: BookHeart, label: 'Gratitude', color: 'text-pink-600' },
    { id: 'breathe', icon: Wind, label: 'Breathe', color: 'text-purple-600' },
    { id: 'memory', icon: Archive, label: 'Export', color: 'text-gray-600' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-orange-200">
      <div className="max-w-md mx-auto px-2 sm:px-4">
        <div className="flex justify-around sm:justify-around py-2 sm:py-3 overflow-x-auto scrollbar-hide">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center py-2 px-2 sm:py-3 sm:px-4 rounded-lg transition-colors min-h-[50px] sm:min-h-[60px] flex-shrink-0 ${
                  isActive 
                    ? `${item.color} bg-orange-100` 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                <span className="text-xs sm:text-sm whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}