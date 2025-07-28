import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ChevronRight, X } from 'lucide-react';

interface WelcomeCard {
  image?: string;
  emoji?: string;
  title: string;
  description: string;
  details: string;
}

const WELCOME_CARDS: WelcomeCard[] = [
  {
    image: '/images/app-hero.png',
    title: 'Welcome to Family Flow',
    description: 'Your family\'s graduation platform for digital wellness',
    details: 'This app is designed to help your family build lasting connection habits, then graduate to independent offline rituals. Success means you won\'t need us forever!'
  },
  {
    emoji: '🌱',
    title: 'Building Habits Together',
    description: 'Start with guided daily check-ins and reflections',
    details: 'Share moods, reflect on screen time, practice gratitude. Every interaction builds your family\'s connection muscle and moves you toward independence.'
  },
  {
    emoji: '🎓',
    title: 'Graduate to Independence',
    description: 'Track your progress toward app-free family rituals',
    details: 'After 45 days of consistent practice, you\'ll have the tools and confidence to maintain family connection without any app at all. That\'s true success!'
  },
  {
    emoji: '🦋',
    title: 'Your Journey Starts Now',
    description: 'Every check-in brings you closer to graduation',
    details: 'Watch your progress, celebrate milestones, and prepare for the day your family spreads its wings. Ready to begin this transformative journey?'
  }
];

interface WelcomeCardsProps {
  onComplete: () => void;
}

export function WelcomeCards({ onComplete }: WelcomeCardsProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  const handleNext = () => {
    if (currentCard < WELCOME_CARDS.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleComplete = () => {
    // Set localStorage flag to not show welcome again
    localStorage.setItem('familyFlowWelcomeShown', 'true');
    onComplete();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startX) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    // Swipe threshold (minimum distance)
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe left - next card
        handleNext();
      } else {
        // Swipe right - previous card
        handlePrevious();
      }
    }
    
    setStartX(null);
  };

  const card = WELCOME_CARDS[currentCard];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 flex flex-col justify-center px-6 py-8">
      {/* Skip button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleComplete}
          className="text-gray-500 hover:text-gray-700 p-2"
          title="Skip introduction"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-md mx-auto w-full">
        {/* Card container */}
        <div 
          className="mb-8"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Card className="overflow-hidden text-center bg-white/80 backdrop-blur-sm shadow-xl">
            {card.image ? (
              <>
                <div className="relative">
                  <img 
                    src={card.image} 
                    alt="Family using technology together"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-8">
                  <h2 className="font-title text-2xl sm:text-3xl mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    {card.title}
                  </h2>
                  <p className="text-xl text-gray-700 mb-6">
                    {card.description}
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {card.details}
                  </p>
                </div>
              </>
            ) : (
              <div className="p-8">
                <div className="text-8xl mb-6">{card.emoji}</div>
                <h2 className="font-title text-2xl sm:text-3xl mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  {card.title}
                </h2>
                <p className="text-xl text-gray-700 mb-6">
                  {card.description}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {card.details}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-3 mb-8">
          {WELCOME_CARDS.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentCard 
                  ? 'bg-orange-400' 
                  : index < currentCard 
                    ? 'bg-orange-200' 
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex space-x-4">
          {currentCard > 0 && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="flex-1 text-lg py-4 h-auto"
            >
              Previous
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            className={`${currentCard === 0 ? 'w-full' : 'flex-1'} bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg py-4 h-auto`}
          >
            {currentCard === WELCOME_CARDS.length - 1 ? (
              'Start Family Flow'
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Swipe hint */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          Swipe left/right or use buttons to navigate
        </div>
      </div>
    </div>
  );
}