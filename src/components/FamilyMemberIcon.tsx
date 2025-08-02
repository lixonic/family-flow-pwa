interface FamilyMemberIconProps {
  avatar: string;
  className?: string;
  showBackground?: boolean; // New prop to show circular background for profile distinction
}

export function FamilyMemberIcon({ avatar, className = "w-6 h-6", showBackground = false }: FamilyMemberIconProps) {
  const getEmoji = () => {
    switch (avatar) {
      // Parent/Mother avatars - Blonde, Black, Grey hair
      case 'mother':
      case 'parent1':
        return '👱‍♀️';
      case 'mother2':
      case 'parent2':
        return '👩';
      case 'mother3':
      case 'parent3':
        return '👩‍🦳';
      
      // Parent/Father avatars - Blonde, Black, Grey hair
      case 'father':
      case 'parent4':
        return '👱‍♂️';
      case 'father2':
      case 'parent5':
        return '👨';
      case 'father3':
      case 'parent6':
        return '👨‍🦳';
      
      // Guardian avatars - Gender-neutral options
      case 'guardian1':
        return '🧑';
      case 'guardian2':
        return '🧑‍🦱';
      case 'guardian3':
        return '🧑‍🦳';
      
      // Teen avatars - Young adult representation
      case 'teen1':
        return '🧑‍🎓';
      case 'teen2':
        return '👨‍🎓';
      case 'teen3':
        return '👩‍🎓';
      
      // Child avatars - Baby, Boy, Girl
      case 'child':
      case 'child1':
        return '👶';
      case 'child2':
        return '👦';
      case 'child3':
        return '👧';
      
      // Extended Family avatars
      case 'grandmother':
      case 'extended1':
        return '👵';
      case 'grandfather':
      case 'extended2':
        return '👴';
      case 'extended3':
        return '🧓'; // Older adult gender-neutral
      
      default:
        return '👤';
    }
  };

  // Convert className to font size for emoji display
  const getFontSize = () => {
    if (className.includes('w-12') || className.includes('h-12')) return 'text-3xl';
    if (className.includes('w-8') || className.includes('h-8')) return 'text-2xl';
    if (className.includes('w-6') || className.includes('h-6')) return 'text-lg';
    if (className.includes('w-5') || className.includes('h-5')) return 'text-base';
    if (className.includes('w-4') || className.includes('h-4')) return 'text-sm';
    return 'text-lg'; // default
  };

  // Get background size based on className
  const getBackgroundClasses = () => {
    if (!showBackground) return '';
    
    if (className.includes('w-12') || className.includes('h-12')) 
      return 'w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center';
    if (className.includes('w-8') || className.includes('h-8')) 
      return 'w-8 h-8 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center';
    if (className.includes('w-6') || className.includes('h-6')) 
      return 'w-6 h-6 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center';
    if (className.includes('w-5') || className.includes('h-5')) 
      return 'w-5 h-5 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center';
    if (className.includes('w-4') || className.includes('h-4')) 
      return 'w-4 h-4 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center';
    
    return 'w-6 h-6 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center';
  };

  if (showBackground) {
    return (
      <div className={getBackgroundClasses()}>
        <span className={`${getFontSize()} leading-none`}>
          {getEmoji()}
        </span>
      </div>
    );
  }

  return (
    <span className={`${getFontSize()} inline-block leading-none`}>
      {getEmoji()}
    </span>
  );
}