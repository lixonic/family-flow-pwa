import React, { useState, useEffect } from 'react';

interface VisualRegulationBarProps {
  duration: number; // Total duration in seconds
  onComplete: () => void;
  isActive: boolean;
  onToggle: () => void;
}

export const VisualRegulationBar: React.FC<VisualRegulationBarProps> = ({
  duration,
  onComplete,
  isActive,
  onToggle
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);

  // Breathing cycle: 4s inhale, 2s hold, 6s exhale (12s total cycle)
  const cycleLength = 12;
  const inhaleLength = 4;
  const holdLength = 2; 
  const exhaleLength = 6;

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 0.1;
        if (newTime >= duration) {
          onComplete();
          return duration;
        }
        return newTime;
      });

      setPhaseTime(prev => {
        prev + 0.1;
        const currentCycleTime = (timeElapsed + 0.1) % cycleLength;

        if (currentCycleTime <= inhaleLength) {
          setBreathPhase('inhale');
          return currentCycleTime;
        } else if (currentCycleTime <= inhaleLength + holdLength) {
          setBreathPhase('hold');
          return currentCycleTime - inhaleLength;
        } else {
          setBreathPhase('exhale');
          return currentCycleTime - inhaleLength - holdLength;
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, duration, onComplete, timeElapsed]);

  const getBarGradient = () => {
    const cycleProgress = phaseTime / (breathPhase === 'inhale' ? inhaleLength : breathPhase === 'hold' ? holdLength : exhaleLength);
    
    if (breathPhase === 'inhale') {
      // Warm orange to soft pink during inhale
      const orangeIntensity = 80 + (cycleProgress * 20); // Increase warmth
      return `linear-gradient(90deg, 
        hsl(24, ${orangeIntensity}%, 60%), 
        hsl(330, ${60 + cycleProgress * 20}%, ${65 + cycleProgress * 10}%))`;
    } else if (breathPhase === 'hold') {
      // Hold at soft pink-purple
      return `linear-gradient(90deg, 
        hsl(330, 75%, 70%), 
        hsl(280, 70%, 75%))`;
    } else {
      // Gentle purple during exhale
      const purpleCalm = 70 + (cycleProgress * 15);
      return `linear-gradient(90deg, 
        hsl(280, ${purpleCalm}%, 75%), 
        hsl(260, ${60 + cycleProgress * 15}%, ${70 + cycleProgress * 10}%))`;
    }
  };

  const getBarScale = () => {
    const cycleProgress = phaseTime / (breathPhase === 'inhale' ? inhaleLength : breathPhase === 'hold' ? holdLength : exhaleLength);
    
    if (breathPhase === 'inhale') {
      return 0.3 + (cycleProgress * 0.7); // Scale from 30% to 100%
    } else if (breathPhase === 'hold') {
      return 1.0; // Stay at full scale
    } else {
      return 1.0 - (cycleProgress * 0.3); // Scale from 100% to 70%
    }
  };

  const progressPercentage = (timeElapsed / duration) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="text-center mb-6">
        <h2 className="font-title text-xl mb-2 text-gray-700">
          Take a moment to center yourself
        </h2>
        <p className="text-gray-500 text-sm">
          {breathPhase === 'inhale' ? 'Breathe in slowly...' : 
           breathPhase === 'hold' ? 'Hold gently...' : 'Breathe out completely...'}
        </p>
      </div>

      {/* Visual regulation bar */}
      <div className="relative mb-6">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-100 ease-in-out rounded-full"
            style={{ 
              width: `${progressPercentage}%`,
              background: getBarGradient(),
              transform: `scaleY(${getBarScale()})`,
              transformOrigin: 'center'
            }}
          />
        </div>
        
        {/* Breathing circle indicator */}
        <div className="flex justify-center mt-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out"
            style={{ 
              transform: `scale(${getBarScale()})`,
              background: getBarGradient(),
              boxShadow: `0 4px 20px ${breathPhase === 'exhale' ? 'rgba(147, 51, 234, 0.3)' : 'rgba(249, 115, 22, 0.3)'}`
            }}
          >
            <div className="text-2xl">
              {breathPhase === 'inhale' ? '🌱' : breathPhase === 'hold' ? '🌿' : '🌸'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onToggle}
          className="px-6 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white/90 transition-colors text-sm font-medium text-gray-700"
        >
          {isActive ? 'Pause' : 'Resume'}
        </button>
        
        <button
          onClick={onComplete}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
        >
          Continue
        </button>
      </div>

      {/* Time remaining */}
      <div className="text-center mt-4">
        <p className="text-gray-400 text-sm">
          {Math.ceil(duration - timeElapsed)}s remaining
        </p>
      </div>
    </div>
  );
};