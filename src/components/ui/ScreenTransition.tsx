import React, { useEffect, useState } from 'react';
import { cn } from './utils';

interface ScreenTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
  direction?: 'right' | 'left' | 'up' | 'fade' | 'morph';
  className?: string;
}

export const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  children,
  transitionKey,
  direction = 'morph',
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reset and trigger animation on key change
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5);

    return () => clearTimeout(timer);
  }, [transitionKey]);

  const getTransitionClass = () => {
    if (!isVisible) return 'opacity-0';
    
    switch (direction) {
      case 'right':
        return 'animate-slide-in-right';
      case 'left':
        return 'animate-slide-in-left';
      case 'up':
        return 'animate-slide-in-up';
      case 'fade':
        return 'animate-fade-in-scale';
      case 'morph':
      default:
        return 'animate-morph-transition';
    }
  };

  return (
    <div 
      key={transitionKey}
      className={cn('w-full h-full', getTransitionClass(), className)}
    >
      {children}
    </div>
  );
};

// Higher-order component for screen transitions
export const withScreenTransition = <T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  direction?: 'right' | 'left' | 'up' | 'fade' | 'morph'
) => {
  return (props: T & { screenKey?: string }) => (
    <ScreenTransition 
      transitionKey={props.screenKey || 'default'} 
      direction={direction}
    >
      <Component {...props} />
    </ScreenTransition>
  );
};