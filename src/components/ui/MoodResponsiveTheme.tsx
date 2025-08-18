import React, { useMemo } from 'react';
import { FamilyMember, MoodEntry } from '../../App';

interface MoodResponsiveThemeProps {
  familyMembers: FamilyMember[];
  moodEntries: MoodEntry[];
  children: React.ReactNode;
}

interface FamilyMoodContext {
  dominantMood: string;
  moodVariance: number;
  activityLevel: 'low' | 'medium' | 'high';
  overallSentiment: 'positive' | 'neutral' | 'challenging';
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
  };
}

export const MoodResponsiveTheme: React.FC<MoodResponsiveThemeProps> = ({
  familyMembers,
  moodEntries,
  children
}) => {
  const familyMoodContext = useMemo<FamilyMoodContext>(() => {
    // Analyze recent mood patterns (last 7 days)
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);
    
    const recentMoods = moodEntries.filter(entry => 
      new Date(entry.date) >= recentDate
    );
    
    if (recentMoods.length === 0) {
      return {
        dominantMood: '😊',
        moodVariance: 0,
        activityLevel: 'low',
        overallSentiment: 'neutral',
        themeColors: {
          primary: 'hsl(22, 93%, 60%)', // Default orange
          secondary: 'hsl(329, 73%, 70%)', // Default pink
          accent: 'hsl(270, 73%, 70%)', // Default purple
          gradient: 'from-orange-400 to-pink-400'
        }
      };
    }

    // Count mood frequencies
    const moodCounts: Record<string, number> = {};
    const moodSentiment: Record<string, number> = {
      '😊': 3, '🤗': 3, '🎉': 3, '😌': 2, // Positive
      '😢': -2, '😡': -2, '😤': -1, '😰': -2, // Challenging
      '😴': 1 // Neutral
    };

    recentMoods.forEach(mood => {
      moodCounts[mood.emoji] = (moodCounts[mood.emoji] || 0) + 1;
    });

    // Find dominant mood
    const dominantMood = Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || '😊';

    // Calculate mood variance (diversity of emotions)
    const uniqueMoods = Object.keys(moodCounts).length;
    const totalMoods = recentMoods.length;
    const moodVariance = uniqueMoods / Math.max(totalMoods, 1);

    // Calculate activity level
    const averageDaily = totalMoods / 7;
    const activityLevel: 'low' | 'medium' | 'high' = 
      averageDaily >= 2 ? 'high' : 
      averageDaily >= 1 ? 'medium' : 'low';

    // Calculate overall sentiment
    const sentimentScore = recentMoods.reduce((sum, mood) => {
      return sum + (moodSentiment[mood.emoji] || 0);
    }, 0) / totalMoods;

    const overallSentiment: 'positive' | 'neutral' | 'challenging' =
      sentimentScore > 1 ? 'positive' :
      sentimentScore < -0.5 ? 'challenging' : 'neutral';

    // Adapt theme colors based on mood context
    let themeColors;
    
    if (overallSentiment === 'positive') {
      themeColors = {
        primary: 'hsl(45, 93%, 60%)', // Warm yellow-orange
        secondary: 'hsl(329, 73%, 75%)', // Bright pink
        accent: 'hsl(160, 73%, 70%)', // Fresh green
        gradient: 'from-yellow-400 via-orange-400 to-pink-400'
      };
    } else if (overallSentiment === 'challenging') {
      themeColors = {
        primary: 'hsl(200, 70%, 60%)', // Calming blue
        secondary: 'hsl(270, 60%, 70%)', // Gentle purple
        accent: 'hsl(140, 50%, 60%)', // Soothing green
        gradient: 'from-blue-300 via-purple-300 to-green-300'
      };
    } else {
      themeColors = {
        primary: 'hsl(22, 93%, 60%)', // Default orange
        secondary: 'hsl(329, 73%, 70%)', // Default pink
        accent: 'hsl(270, 73%, 70%)', // Default purple
        gradient: 'from-orange-400 to-pink-400'
      };
    }

    return {
      dominantMood,
      moodVariance,
      activityLevel,
      overallSentiment,
      themeColors
    };
  }, [familyMembers, moodEntries]);

  const getContextualStyles = () => {
    const { overallSentiment, activityLevel, themeColors } = familyMoodContext;
    
    // Base styles that adapt to mood context
    const baseStyles = {
      '--dynamic-primary': themeColors.primary,
      '--dynamic-secondary': themeColors.secondary,
      '--dynamic-accent': themeColors.accent,
    } as React.CSSProperties;

    // Activity-based animation intensity
    const animationClass = 
      activityLevel === 'high' ? 'animate-fast' :
      activityLevel === 'medium' ? 'animate-normal' : 'animate-slow';

    // Sentiment-based visual adjustments
    const sentimentClass = 
      overallSentiment === 'positive' ? 'mood-positive' :
      overallSentiment === 'challenging' ? 'mood-gentle' : 'mood-neutral';

    return {
      style: baseStyles,
      className: `${animationClass} ${sentimentClass}`
    };
  };

  const contextualStyles = getContextualStyles();

  return (
    <div 
      className={`mood-responsive-theme ${contextualStyles.className}`}
      style={contextualStyles.style}
    >
      {/* Contextual background adaptation */}
      <div 
        className={`fixed inset-0 pointer-events-none opacity-5 bg-gradient-to-br ${familyMoodContext.themeColors.gradient} transition-all duration-1000`}
      />
      
      {/* Adaptive ambient particles for high activity families */}
      {familyMoodContext.activityLevel === 'high' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-gentle opacity-10"
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${20 + (i % 3) * 30}%`,
                animationDelay: `${i * 500}ms`,
                animationDuration: `${3 + (i % 2)}s`,
                fontSize: '2rem'
              }}
            >
              {familyMoodContext.dominantMood}
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
};