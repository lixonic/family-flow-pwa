import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function BreatheTimer() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setIsActive(false);
    setTimeLeft(120);
    setBreathPhase('inhale');
    setPhaseTime(0);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    let interval: number;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        setPhaseTime(prev => prev + 1);
        
        // Breathing pattern: 4 seconds inhale, 2 seconds hold, 6 seconds exhale
        if (breathPhase === 'inhale' && phaseTime >= 4) {
          setBreathPhase('hold');
          setPhaseTime(0);
        } else if (breathPhase === 'hold' && phaseTime >= 2) {
          setBreathPhase('exhale');
          setPhaseTime(0);
        } else if (breathPhase === 'exhale' && phaseTime >= 6) {
          setBreathPhase('inhale');
          setPhaseTime(0);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play completion sound (gong effect)
      // Note: In a real app, you'd use audio API here
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, breathPhase, phaseTime]);

  const getCircleScale = () => {
    const progress = phaseTime / (breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 2 : 6);
    
    if (breathPhase === 'inhale') {
      return 0.5 + (progress * 0.5); // Scale from 0.5 to 1.0
    } else if (breathPhase === 'hold') {
      return 1.0; // Stay at full size
    } else {
      return 1.0 - (progress * 0.5); // Scale from 1.0 to 0.5
    }
  };

  const getInstructions = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe in...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe out...';
    }
  };

  const getCircleColor = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-400';
      case 'hold':
        return 'from-green-400 to-teal-400';
      case 'exhale':
        return 'from-purple-400 to-pink-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pb-28">
        <div className="text-center">
          <h1 className="text-4xl mb-10 text-white">
            Breathe Together
          </h1>
          
          {/* Breathing Circle - Fixed centering */}
          <div className="flex justify-center items-center mb-10">
            <div className="relative">
              <div 
                className={`w-80 h-80 rounded-full bg-gradient-to-br ${getCircleColor()} opacity-20 absolute inset-0 transition-transform duration-1000 ease-in-out`}
                style={{ 
                  transform: `scale(${getCircleScale() * 1.5})`,
                  filter: 'blur(20px)'
                }}
              />
              <div 
                className={`w-80 h-80 rounded-full bg-gradient-to-br ${getCircleColor()} transition-transform duration-1000 ease-in-out flex items-center justify-center relative z-10`}
                style={{ transform: `scale(${getCircleScale()})` }}
              >
                <div className="text-white text-center">
                  <div className="text-8xl mb-4">🌸</div>
                  {isActive && (
                    <div className="text-2xl">
                      {getInstructions()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-5xl text-white mb-4">
            {formatTime(timeLeft)}
          </div>
          
          {isActive && (
            <div className="text-2xl text-white/80 mb-10">
              {getInstructions()}
            </div>
          )}
          
          {!isActive && timeLeft === 120 && (
            <p className="text-white/80 mb-10 max-w-sm mx-auto text-xl">
              Take two minutes to breathe together. Watch the circle and follow its rhythm.
            </p>
          )}
          
          {timeLeft === 0 && (
            <div className="mb-10">
              <div className="text-8xl mb-6">✨</div>
              <p className="text-white text-3xl mb-4">Beautiful breathing!</p>
              <p className="text-white/80 text-xl">You've completed your 2-minute session</p>
            </div>
          )}

          {/* Controls with colored backgrounds */}
          <div className="flex justify-center space-x-6">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm p-6"
              disabled={timeLeft === 0}
            >
              {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
            
            <Button
              onClick={reset}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm p-6"
            >
              <RotateCcw className="w-8 h-8" />
            </Button>
          </div>
        </div>
      </div>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}