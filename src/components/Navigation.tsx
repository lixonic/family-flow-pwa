import React from 'react';
import { Heart, MessageSquare, BookOpen, Wind, Archive } from 'lucide-react';

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'day-glow', icon: Heart, label: 'Mood', color: 'text-orange-600' },
    { id: 'screen-time', icon: MessageSquare, label: 'Reflect', color: 'text-red-600' },
    { id: 'guide', icon: BookOpen, label: 'Guide', color: 'text-blue-600', highlight: true },
    { id: 'gratitude', icon: Wind, label: 'Mindful', color: 'text-purple-600' },
    { id: 'memory', icon: Archive, label: 'Export', color: 'text-gray-600' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-orange-200 safe-bottom-nav">
      <div className="max-w-md mx-auto safe-left safe-right">
        <div className="flex justify-around sm:justify-around py-2 sm:py-3 overflow-x-auto scrollbar-hide">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center py-2 px-2 sm:py-3 sm:px-4 rounded-lg transition-colors min-h-[50px] sm:min-h-[60px] flex-shrink-0 relative ${
                  isActive 
                    ? item.highlight 
                      ? 'text-blue-700 bg-white border-2 border-blue-200 shadow-inner' 
                      : `${item.color} bg-orange-100`
                    : item.highlight
                      ? 'text-white bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 shadow-lg'
                      : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                <span className="text-xs sm:text-sm whitespace-nowrap font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}