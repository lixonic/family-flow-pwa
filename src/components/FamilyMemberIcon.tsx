import React from 'react';
import { User, UserCheck, Baby, Heart, Crown, Users } from 'lucide-react';

interface FamilyMemberIconProps {
  avatar: string;
  className?: string;
}

export function FamilyMemberIcon({ avatar, className = "w-6 h-6" }: FamilyMemberIconProps) {
  const getIcon = () => {
    switch (avatar) {
      case 'mother':
        return <Heart className={`${className} text-pink-600`} />;
      case 'father':
        return <UserCheck className={`${className} text-blue-600`} />;
      case 'child':
        return <Baby className={`${className} text-green-600`} />;
      case 'child2':
        return <User className={`${className} text-purple-600`} />;
      case 'grandmother':
        return <Crown className={`${className} text-violet-600`} />;
      case 'grandfather':
        return <Users className={`${className} text-indigo-600`} />;
      default:
        return <User className={`${className} text-gray-600`} />;
    }
  };

  return getIcon();
}