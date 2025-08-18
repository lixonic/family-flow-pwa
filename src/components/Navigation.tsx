import { Heart, MessageSquare, BookOpen, Wind, Archive } from 'lucide-react';

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'day-glow', icon: Heart, label: 'Mood', color: 'text-orange-600', tooltip: 'What if connection took just 2 minutes?' },
    { id: 'screen-time', icon: MessageSquare, label: 'Reflect', color: 'text-red-600', tooltip: 'Building habits together' },
    { id: 'guide', icon: BookOpen, label: 'How To', color: 'text-blue-600', highlight: true, tooltip: 'Your journey starts here' },
    { id: 'gratitude', icon: Wind, label: 'Grateful', color: 'text-purple-600', tooltip: 'From digital prompts to real conversations' },
    { id: 'memory', icon: Archive, label: 'Export', color: 'text-gray-600', tooltip: 'Your family memories and connection foundation' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 nav-floating glass-nav mx-2 sm:mx-4 mb-4 safe-bottom-nav">
      <div className="max-w-md mx-auto px-2 sm:px-4">
        <div className="flex justify-between py-3 gap-1 sm:gap-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={item.tooltip}
                className={`flex flex-col items-center py-2 sm:py-3 px-2 sm:px-4 rounded-xl transition-all duration-300 ease-spring-bounce min-h-[60px] flex-1 max-w-[20%] relative interactive-scale group ${
                  isActive 
                    ? item.highlight 
                      ? 'text-blue-700' 
                      : `${item.color}`
                    : item.highlight
                      ? 'text-blue-600 hover:text-blue-700'
                      : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                <span className="text-[10px] sm:text-xs whitespace-nowrap font-medium leading-tight">{item.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 sm:w-8 h-1 bg-current rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}