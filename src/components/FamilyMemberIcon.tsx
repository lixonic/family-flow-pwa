interface FamilyMemberIconProps {
  avatar: string;
  className?: string;
}

export function FamilyMemberIcon({ avatar, className = "w-6 h-6" }: FamilyMemberIconProps) {
  const getEmoji = () => {
    switch (avatar) {
      // Mother avatars - Blonde, Black, Grey hair
      case 'mother':
        return '👱‍♀️';
      case 'mother2':
        return '👩';
      case 'mother3':
        return '👩‍🦳';
      
      // Father avatars - Blonde, Black, Grey hair
      case 'father':
        return '👱‍♂️';
      case 'father2':
        return '👨';
      case 'father3':
        return '👨‍🦳';
      
      // Child avatars - Baby, Boy, Girl
      case 'child':
        return '👶';
      case 'child2':
        return '👦';
      case 'child3':
        return '👧';
      
      // Legacy support (for backwards compatibility)
      case 'grandmother':
        return '👵';
      case 'grandfather':
        return '👴';
      
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

  return (
    <span className={`${getFontSize()} inline-block leading-none`}>
      {getEmoji()}
    </span>
  );
}