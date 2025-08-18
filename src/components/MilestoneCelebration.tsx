import { useState, useEffect } from 'react';
import { GraduationMilestone } from '../App';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  emoji: string;
  size: number;
}

interface MilestoneCelebrationProps {
  milestone: GraduationMilestone;
  onCelebrationComplete: (milestoneId: string) => void;
}

export function MilestoneCelebration({ milestone, onCelebrationComplete }: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [burstParticles, setBurstParticles] = useState<Particle[]>([]);

  // Generate celebration particles
  const createParticles = (count: number, centerX: number = 50, centerY: number = 50) => {
    const newParticles: Particle[] = [];
    const celebrationEmojis = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '🔥', '💖', '🎯', '🏆'];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const velocity = 3 + Math.random() * 4;
      const life = 80 + Math.random() * 40;
      
      newParticles.push({
        id: Date.now() + i,
        x: centerX + (Math.random() - 0.5) * 20,
        y: centerY + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: life,
        maxLife: life,
        emoji: celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)],
        size: 0.8 + Math.random() * 0.6
      });
    }
    
    return newParticles;
  };

  // Create burst effect
  const createBurst = () => {
    const burstCount = 15;
    const newBurst = createParticles(burstCount, 50, 40);
    setBurstParticles(newBurst);
    
    // Animate burst particles
    let animationId: number;
    const animateBurst = () => {
      setBurstParticles(prevParticles => {
        const updated = prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.3, // gravity
          vx: particle.vx * 0.98, // air resistance
          life: particle.life - 1
        })).filter(particle => particle.life > 0);
        
        if (updated.length > 0) {
          animationId = requestAnimationFrame(animateBurst);
        }
        
        return updated;
      });
    };
    
    animationId = requestAnimationFrame(animateBurst);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  };

  useEffect(() => {
    // Trigger celebration animation
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setShowContent(true), 600);
    
    // Create floating particles
    const timer3 = setTimeout(() => {
      setParticles(createParticles(20));
    }, 800);
    
    // Create burst effect
    const timer4 = setTimeout(() => {
      createBurst();
    }, 1000);

    // Start floating particle animation
    let floatingAnimationId: number;
    const animateFloatingParticles = () => {
      setParticles(prevParticles => {
        return prevParticles.map(particle => ({
          ...particle,
          x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.5,
          y: particle.y + Math.cos(Date.now() * 0.0008 + particle.id) * 0.3,
          life: Math.max(0, particle.life - 0.2)
        })).filter(particle => particle.life > 0);
      });
      
      floatingAnimationId = requestAnimationFrame(animateFloatingParticles);
    };
    
    const timer5 = setTimeout(() => {
      floatingAnimationId = requestAnimationFrame(animateFloatingParticles);
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      if (floatingAnimationId) {
        cancelAnimationFrame(floatingAnimationId);
      }
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
      {/* Premium Particle Systems */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating background particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute text-lg animate-float-gentle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.life / particle.maxLife,
              transform: `scale(${particle.size})`,
              animationDelay: `${particle.id % 1000}ms`,
              filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.3))'
            }}
          >
            {particle.emoji}
          </div>
        ))}
        
        {/* Burst particles */}
        {burstParticles.map(particle => (
          <div
            key={particle.id}
            className="absolute text-xl animate-spring-in"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: Math.max(0, particle.life / particle.maxLife),
              transform: `scale(${particle.size}) rotate(${particle.vx * 10}deg)`,
              filter: 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.4))'
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      <div className={`relative mx-4 max-w-md transform rounded-3xl glass-card bg-white/95 backdrop-blur-xl p-8 text-center shadow-glow-lg transition-all duration-500 ${showContent ? 'scale-100' : 'scale-75'}`}>
        {/* Celebration Background Effect */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${getCelebrationColor()} opacity-10`}></div>
        
        {/* Enhanced Animated Emoji */}
        <div className="relative mb-6">
          <div className={`text-7xl transition-all duration-700 ${showContent ? 'animate-breathe' : ''}`} 
               style={{
                 filter: 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.5))',
                 textShadow: '0 0 30px rgba(249, 115, 22, 0.3)'
               }}>
            {getCelebrationEmoji()}
          </div>
          
          {/* Enhanced Sparkle Effects with orbiting motion */}
          {showContent && (
            <>
              <div className="absolute -top-4 -right-4 text-3xl animate-glow-pulse" 
                   style={{ animationDelay: '0ms' }}>✨</div>
              <div className="absolute -bottom-4 -left-4 text-3xl animate-glow-pulse" 
                   style={{ animationDelay: '800ms' }}>🎉</div>
              <div className="absolute top-2 left-2 text-2xl animate-glow-pulse" 
                   style={{ animationDelay: '1200ms' }}>⭐</div>
              <div className="absolute top-2 right-2 text-2xl animate-glow-pulse" 
                   style={{ animationDelay: '400ms' }}>💫</div>
              <div className="absolute -bottom-2 right-0 text-xl animate-glow-pulse" 
                   style={{ animationDelay: '1600ms' }}>🌟</div>
            </>
          )}
          
          {/* Pulsing glow background */}
          {showContent && (
            <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-br from-primary/20 to-accent-pink-500/20 animate-glow-pulse blur-xl"></div>
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

          {/* Enhanced Connection Badge */}
          <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${getCelebrationColor()} text-white font-semibold mb-6 shadow-glow-lg animate-spring-in transform hover:scale-105 transition-transform`}>
            <span className="mr-2 text-xl animate-bounce">{getCelebrationEmoji()}</span>
            <span className="tracking-wide">{milestone.threshold} Days of Family Connection!</span>
            <div className="ml-2 text-lg animate-glow-pulse">✨</div>
          </div>

          {/* Motivational Message */}
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
            <div className="text-sm text-gray-700">
              {milestone.threshold === 15 && (
                <>
                  <p className="font-medium text-gray-800 mb-2">Connection is happening, no matter how it looks</p>
                  <p className="italic">You're building something beautiful together. Every honest moment, every shared feeling—it all matters. There's no "right" way to be a family.</p>
                </>
              )}
              {milestone.threshold === 30 && (
                <>
                  <p className="font-medium text-gray-800 mb-2">Your family rhythm is becoming clear</p>
                  <p className="italic">Notice how natural this is starting to feel? You're learning what authentic connection looks like for your unique family. Trust what you're discovering together.</p>
                </>
              )}
              {milestone.threshold === 45 && (
                <>
                  <p className="font-medium text-gray-800 mb-2">You know your family's connection language now</p>
                  <p className="italic">The patterns, the rhythms, the ways you care for each other—you've discovered what works for your family. This wisdom belongs to you now, with or without any app.</p>
                </>
              )}
            </div>
          </div>

          {/* Enhanced Continue Button */}
          <button
            onClick={handleContinue}
            className={`btn-primary w-full py-4 px-8 rounded-2xl bg-gradient-to-r ${getCelebrationColor()} text-white font-semibold transition-all duration-300 shadow-glow-lg hover:shadow-glow-xl active:scale-95 transform hover:scale-102 interactive-scale group relative overflow-hidden`}
          >
            <div className="relative z-10 flex items-center justify-center space-x-2">
              <span className="text-lg tracking-wide">Continue Growing Together</span>
              <div className="text-xl group-hover:animate-bounce">🚀</div>
            </div>
            
            {/* Button shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
          </button>
        </div>
      </div>
    </div>
  );
}