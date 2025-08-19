interface InitialAvatarProps {
  name: string;
  backgroundColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AVATAR_COLORS = [
  '#FF6B35', // Orange
  '#4ECDC4', // Teal  
  '#45B7D1', // Blue
  '#96CEB4', // Mint
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Seafoam
  '#F7DC6F'  // Gold
];

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-xl'
};

function getInitials(name: string): string {
  return name.trim().substring(0, 2).toUpperCase();
}

export function InitialAvatar({ 
  name, 
  backgroundColor, 
  size = 'md',
  className = '' 
}: InitialAvatarProps) {
  const initials = getInitials(name);
  const bgColor = backgroundColor || AVATAR_COLORS[0];
  
  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
}

export { AVATAR_COLORS };