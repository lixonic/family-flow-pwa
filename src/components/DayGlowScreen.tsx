import { useState } from 'react';
import { FamilyMember, MoodEntry } from '../App';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { FamilyMemberIcon } from './FamilyMemberIcon';
import { formatDate } from './ui/utils';
import { Plus, Edit2, Trash2, Check, X, User, ChevronRight } from 'lucide-react';

const MOOD_OPTIONS = [
  { emoji: '😊', color: '#FFF0E5', name: 'Happy' },
  { emoji: '😢', color: '#E5F0FF', name: 'Sad' },
  { emoji: '😴', color: '#F0E5FF', name: 'Tired' },
  { emoji: '😡', color: '#FFE0E0', name: 'Angry' },
  { emoji: '😤', color: '#FFE5E5', name: 'Frustrated' },
  { emoji: '🤗', color: '#FFF8E5', name: 'Loved' },
  { emoji: '😰', color: '#F8E5FF', name: 'Anxious' },
  { emoji: '🎉', color: '#E5FFF0', name: 'Excited' },
  { emoji: '😌', color: '#F5F8FF', name: 'Peaceful' }
];

const getMoodResponse = (emoji: string) => {
  const responses: Record<string, { title: string; message: string; icon: string }> = {
    '😊': {
      title: 'Wonderful!',
      message: 'Your happiness brightens the whole family',
      icon: '✨'
    },
    '😢': {
      title: 'It\'s okay to feel sad',
      message: 'Your feelings are valid and you\'re not alone',
      icon: '🤗'
    },
    '😴': {
      title: 'Rest is important',
      message: 'Take care of yourself and get the rest you need',
      icon: '💤'
    },
    '😡': {
      title: 'Strong feelings',
      message: 'It takes courage to share when you\'re angry',
      icon: '💪'
    },
    '😤': {
      title: 'Frustration is natural',
      message: 'Thanks for letting your family know how you feel',
      icon: '🌬️'
    },
    '🤗': {
      title: 'Love surrounds you',
      message: 'Your family loves you too',
      icon: '❤️'
    },
    '😰': {
      title: 'You\'re brave for sharing',
      message: 'Anxiety is tough, but you\'re tougher',
      icon: '🦋'
    },
    '🎉': {
      title: 'Celebrate with you!',
      message: 'Your excitement is contagious',
      icon: '🎊'
    },
    '😌': {
      title: 'Peace is beautiful',
      message: 'Your calm energy helps the whole family',
      icon: '🕊️'
    }
  };

  return responses[emoji] || {
    title: 'Thank you!',
    message: 'Your mood has been saved',
    icon: '✨'
  };
};

const AVATAR_OPTIONS = [
  // Parent options - Inclusive terminology
  { id: 'parent1', emoji: '👱‍♀️', label: 'Parent', category: 'Parent' },
  { id: 'parent2', emoji: '👩', label: 'Parent', category: 'Parent' },
  { id: 'parent3', emoji: '👩‍🦳', label: 'Parent', category: 'Parent' },
  { id: 'parent4', emoji: '👱‍♂️', label: 'Parent', category: 'Parent' },
  { id: 'parent5', emoji: '👨', label: 'Parent', category: 'Parent' },
  { id: 'parent6', emoji: '👨‍🦳', label: 'Parent', category: 'Parent' },
  
  // Guardian options - Gender-neutral
  { id: 'guardian1', emoji: '🧑', label: 'Guardian', category: 'Guardian' },
  { id: 'guardian2', emoji: '🧑‍🦱', label: 'Guardian', category: 'Guardian' },
  { id: 'guardian3', emoji: '🧑‍🦳', label: 'Guardian', category: 'Guardian' },
  
  // Teen options - Young adults
  { id: 'teen1', emoji: '🧑‍🎓', label: 'Teen', category: 'Teen' },
  { id: 'teen2', emoji: '👨‍🎓', label: 'Teen', category: 'Teen' },
  { id: 'teen3', emoji: '👩‍🎓', label: 'Teen', category: 'Teen' },
  
  // Child options - Various ages
  { id: 'child1', emoji: '👶', label: 'Child', category: 'Child' },
  { id: 'child2', emoji: '👦', label: 'Child', category: 'Child' },
  { id: 'child3', emoji: '👧', label: 'Child', category: 'Child' },
  
  // Extended Family options
  { id: 'extended1', emoji: '👵', label: 'Extended Family', category: 'Extended Family' },
  { id: 'extended2', emoji: '👴', label: 'Extended Family', category: 'Extended Family' },
  { id: 'extended3', emoji: '🧓', label: 'Extended Family', category: 'Extended Family' },
];

const MEMBER_COLORS = [
  '#FFE5E5', '#E5F3FF', '#FFF5E5', '#E5FFE5', '#F5E5FF', '#FFE5F5'
];

const COOLDOWN_SUGGESTIONS = [
  "Take 5 deep breaths slowly",
  "Stretch your arms above your head",
  "Pet your dog or cat",
  "Look out the window for 30 seconds",
  "Drink a glass of water mindfully",
  "Do 10 jumping jacks",
  "Write down 3 things you can see"
];

interface DayGlowScreenProps {
  familyMembers: FamilyMember[];
  moodEntries: MoodEntry[];
  onAddMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  onAddFamilyMember: (member: Omit<FamilyMember, 'id'>) => boolean;
  onUpdateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  onDeleteFamilyMember: (id: string) => boolean;
  getStreakData: () => { currentStreak: number; totalActiveDays: number; activityDates: string[] };
  getDayActivityLevel: (date: Date) => 'none' | 'low' | 'medium' | 'high';
  onDaySelect: (date: Date) => void;
  onNavigate?: (screen: string) => void;
  graduationProgress?: {
    totalCheckIns: number;
    targetDays: number;
    progressPercentage: number;
    nextMilestone?: {days: number, title: string};
    readyForGraduation: boolean;
    nearGraduation: boolean;
    achievedMilestones: {days: number, title: string}[];
  };
}

export function DayGlowScreen({ 
  familyMembers, 
  moodEntries, 
  onAddMoodEntry,
  onAddFamilyMember,
  onUpdateFamilyMember,
  onDeleteFamilyMember,
  getStreakData,
  getDayActivityLevel,
  onDaySelect,
  onNavigate: _onNavigate,
  graduationProgress
}: DayGlowScreenProps) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [selectedMood, setSelectedMood] = useState<{ emoji: string; color: string; name: string } | null>(null);
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFamilyView, setShowFamilyView] = useState(false);
  const [currentMoodResponse, setCurrentMoodResponse] = useState<{ title: string; message: string; icon: string } | null>(null);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState('parent1');
  const [editingName, setEditingName] = useState('');
  const [showCooldownBanner, setShowCooldownBanner] = useState(false);
  const [showCooldownSuggestions, setShowCooldownSuggestions] = useState(false);
  const [cooldownSuggestions, setCooldownSuggestions] = useState<string[]>([]);
  const [showProfileAdded, setShowProfileAdded] = useState(false);
  const [addedMemberName, setAddedMemberName] = useState('');

  const today = new Date().toDateString();
  
  // Check if member already has mood entry today
  const getMemberTodayMoodEntry = (memberId: string) => {
    return moodEntries.find(entry => 
      entry.memberId === memberId && 
      new Date(entry.date).toDateString() === today
    );
  };
  
  // Get today's family entries for witnessing
  const getTodayFamilyEntries = () => {
    return familyMembers.map(member => {
      const todayEntry = getMemberTodayMoodEntry(member.id);
      return {
        member,
        entry: todayEntry
      };
    });
  };
  const streakData = getStreakData();


  const getActivityLevelColor = (level: 'none' | 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'none': return 'bg-gray-200';
      case 'low': return 'bg-orange-200';
      case 'medium': return 'bg-orange-400';
      case 'high': return 'bg-gradient-to-br from-orange-400 to-pink-400';
    }
  };

  const isChildMember = (member: FamilyMember) => {
    return member.avatar === 'child' || member.avatar === 'child2';
  };

  const checkForCooldownTrigger = (member: FamilyMember, mood: { emoji: string; name: string }, noteText: string) => {
    const isChild = isChildMember(member);
    const isNegativeMood = mood.emoji === '😢' || mood.emoji === '😡';
    const mentionsOnline = noteText.toLowerCase().includes('online') || 
                          noteText.toLowerCase().includes('internet') || 
                          noteText.toLowerCase().includes('social media') ||
                          noteText.toLowerCase().includes('screen');
    
    if (isChild && isNegativeMood && mentionsOnline) {
      // Get 3 random suggestions
      const shuffled = [...COOLDOWN_SUGGESTIONS].sort(() => Math.random() - 0.5);
      setCooldownSuggestions(shuffled.slice(0, 3));
      setShowCooldownBanner(true);
    }
  };

  const handleSubmit = () => {
    if (selectedMember && selectedMood) {
      // Check for cooldown trigger before saving
      checkForCooldownTrigger(selectedMember, selectedMood, note);
      
      // Get mood-specific response
      const moodResponse = getMoodResponse(selectedMood.emoji);
      setCurrentMoodResponse(moodResponse);
      
      onAddMoodEntry({
        memberId: selectedMember.id,
        emoji: selectedMood.emoji,
        color: selectedMood.color,
        note: note.trim() || undefined,
        date: new Date().toISOString()
      });
      
      setSelectedMember(null);
      setSelectedMood(null);
      setNote('');
      setShowSuccess(true);
      
      // Don't auto-hide success screen - let user choose next action
    }
  };

  const getRecentDays = () => {
    const days = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const getDayMoods = (date: Date) => {
    return moodEntries.filter(entry => 
      new Date(entry.date).toDateString() === date.toDateString()
    );
  };


  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const colorIndex = familyMembers.length % MEMBER_COLORS.length;
      const memberName = newMemberName.trim();
      const memberData = {
        name: memberName,
        avatar: newMemberAvatar,
        color: MEMBER_COLORS[colorIndex]
      };
      
      const success = onAddFamilyMember(memberData);
      
      if (success) {
        // Store the added member data for later selection
        setAddedMemberName(memberName);
        
        // Clear form
        setNewMemberName('');
        setNewMemberAvatar('mother');
        
        // Show success message
        setShowProfileAdded(true);
        
        // Hide manage members screen and redirect after 2 seconds
        setTimeout(() => {
          setShowManageMembers(false);
          setShowProfileAdded(false);
          
          // Find and auto-select the newly added member for mood entry
          // Use setTimeout to ensure the member has been added to the state
          setTimeout(() => {
            const newMember = familyMembers.find(m => m.name === memberName);
            if (newMember) {
              setSelectedMember(newMember);
            }
          }, 100);
        }, 2000);
      }
    }
  };

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member);
    setEditingName(member.name);
  };

  const handleSaveEdit = () => {
    if (editingMember && editingName.trim()) {
      onUpdateFamilyMember(editingMember.id, { name: editingName.trim() });
      setEditingMember(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setEditingName('');
  };

  const handleDeleteMember = (member: FamilyMember) => {
    if (confirm(`Are you sure you want to delete ${member.name}? This will also remove all their entries.`)) {
      onDeleteFamilyMember(member.id);
    }
  };


  // Group avatar options by category
  const getAvatarsByCategory = (category: string) => {
    return AVATAR_OPTIONS.filter(option => option.category === category);
  };

  // Get descriptive label for avatar styles

  // Cooldown Banner Component
  const CooldownBanner = () => (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-teal-500 text-white z-40 animate-in slide-in-from-top duration-500">
      <div className="px-4 py-3">
        {!showCooldownSuggestions ? (
          <button
            onClick={() => setShowCooldownSuggestions(true)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌿</span>
              <span className="text-lg">Feeling heated? 1-minute cool-down ideas</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌿</span>
                <span className="text-lg">Try one of these:</span>
              </div>
              <button
                onClick={() => setShowCooldownBanner(false)}
                className="text-white/80 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {cooldownSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/20 rounded-lg p-3">
                  <span className="text-yellow-200 text-lg">•</span>
                  <span className="text-base">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {showCooldownBanner && <CooldownBanner />}
        
        {/* Confetti animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => {
            const isTopHalf = i < 8;
            const leftPos = Math.random() * 100;
            const topPos = isTopHalf 
              ? Math.random() * 30  // Top 30% of screen
              : 70 + Math.random() * 30; // Bottom 30% of screen
            
            return (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                  fontSize: `${16 + Math.random() * 24}px`,
                }}
              >
                {['😊', '❤️', '✨', '🌟', '🎉', '💖', '🌈', '☀️', '🦋', '🌸'][Math.floor(Math.random() * 10)]}
              </div>
            );
          })}
        </div>
        
        <div className="text-center z-10 max-w-md mx-auto">
          <div className="text-8xl mb-6">{currentMoodResponse?.icon || '✨'}</div>
          <h2 className="text-3xl mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            {currentMoodResponse?.title || 'Thank you!'}
          </h2>
          <p className="text-gray-600 text-xl mb-8">{currentMoodResponse?.message || 'Your mood has been saved'}</p>
          
          {/* Family connection options */}
          <div className="space-y-3">
            {familyMembers.length > 1 && (
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setShowFamilyView(true);
                  setSelectedMember(null);
                  setSelectedMood(null);
                  setNote('');
                }}
                className="w-full py-3 px-6 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl font-medium transition-colors"
              >
                See How Everyone's Doing
              </button>
            )}
            
            <button
              onClick={() => {
                setShowSuccess(false);
                setSelectedMember(null);
                setSelectedMood(null);
                setNote('');
              }}
              className="w-full py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl font-medium transition-colors"
            >
              Continue to Reflection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile added success screen
  if (showProfileAdded) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Success confetti animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => {
            const leftPos = Math.random() * 100;
            const topPos = Math.random() * 100;
            
            return (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  animationDuration: `${1 + Math.random() * 0.5}s`,
                  fontSize: `${18 + Math.random() * 16}px`,
                }}
              >
                {['👤', '✨', '🎉', '💫', '🌟', '🎊', '👥', '💖'][Math.floor(Math.random() * 8)]}
              </div>
            );
          })}
        </div>
        
        <div className="text-center z-10">
          <div className="text-8xl mb-6">👤</div>
          <h2 className="text-3xl mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Profile Added!
          </h2>
          <p className="text-gray-600 text-xl mb-2">
            Welcome <span className="font-semibold text-orange-600">{addedMemberName}</span>!
          </p>
          <p className="text-gray-500">
            Redirecting to mood selection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-area-content relative">
      {showCooldownBanner && <CooldownBanner />}
      
      <div className={`max-w-md mx-auto ${showCooldownBanner ? 'mt-32' : ''}`}>
        {!showManageMembers && (
          <div className="text-center mb-10">
            <h1 className="font-title text-2xl sm:text-4xl mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Day Glow
            </h1>
            <p className="text-gray-600 text-xl">How was your day?</p>
          </div>
        )}


        {/* Enhanced Week view with activity levels */}
        {!showManageMembers && (
          <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-500">Last 5 days</h3>
            <div className="text-sm text-gray-400">
              {streakData.totalActiveDays} active days total
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 justify-items-center">
            {getRecentDays().map((date, index) => {
              const dayMoods = getDayMoods(date);
              const isToday = date.toDateString() === today;
              const activityLevel = getDayActivityLevel(date);
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`text-sm mb-2 ${isToday ? 'font-medium text-orange-600' : 'text-gray-500'}`}>
                    {date.toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                  <button
                    onClick={() => onDaySelect(date)}
                    className={`w-12 h-12 rounded-full border-2 ${isToday ? 'border-orange-400' : 'border-orange-200'} flex items-center justify-center relative ${getActivityLevelColor(activityLevel)} hover:scale-105 transition-transform cursor-pointer ${dayMoods.length > 0 ? 'hover:border-orange-500' : ''}`}
                    title={`View entries for ${formatDate(date)}`}
                  >
                    {dayMoods.length > 0 ? (
                      <div className="text-xl">
                        {dayMoods[dayMoods.length - 1].emoji}
                      </div>
                    ) : activityLevel !== 'none' ? (
                      <div className="text-xl">📝</div>
                    ) : (
                      <div className={`w-3 h-3 rounded-full ${isToday ? 'bg-orange-400' : 'bg-gray-300'}`}></div>
                    )}
                    {dayMoods.length > 1 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                        {dayMoods.length}
                      </div>
                    )}
                    {activityLevel === 'high' && (
                      <div className="absolute -bottom-1 -right-1 text-xs">⭐</div>
                    )}
                  </button>
                  <div className="text-xs text-gray-400 mt-1">
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Activity level legend */}
          <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <span>No activity</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-orange-200"></div>
              <span>Light</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-pink-400"></div>
              <span>High ⭐</span>
            </div>
          </div>
        </div>
        )}

        {/* First-time user guidance - only show when no family members */}
        {!selectedMember && !showManageMembers && familyMembers.length === 0 && (
          <div className="mb-10">
            <div className="text-center mb-8">
              <div className="mb-8 p-8 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 rounded-3xl border-2 border-orange-100 shadow-sm">
                <div className="text-8xl mb-6">🏠</div>
                <h3 className="text-2xl font-medium mb-4 text-gray-800">Welcome to Family Flow!</h3>
                <div className="space-y-3 mb-6">
                  <p className="text-gray-700 text-lg">
                    Your daily 2-minute family wellness ritual starts here
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <span className="text-lg">😊</span>
                      <span>Mood Check</span>
                    </div>
                    <span className="text-gray-300 hidden sm:inline">→</span>
                    <span className="text-gray-300 sm:hidden">↓</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg">📱</span>
                      <span>Screen Reflection</span>
                    </div>
                    <span className="text-gray-300 hidden sm:inline">→</span>
                    <span className="text-gray-300 sm:hidden">↓</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg">🙏</span>
                      <span>Gratitude</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/70 rounded-2xl p-4 mb-6">
                  <p className="text-gray-600 text-base">
                    Let's create profiles for everyone in your family. Each person gets their own space to share how they're feeling.
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Privacy first: All data stays on your device
                </p>
              </div>
              
              <button
                onClick={() => setShowManageMembers(true)}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-5 rounded-2xl font-medium text-xl flex items-center mx-auto shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <User className="w-6 h-6 mr-3" />
                Set Up Your Family
              </button>
              
              <p className="text-xs text-gray-400 mt-4">
                You can always add, edit, or remove family members later
              </p>
            </div>
          </div>
        )}

        {/* Family member management - only show when family members exist */}
        {!selectedMember && !showManageMembers && familyMembers.length > 0 && !showFamilyView && (
          <div className="mb-10">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-bold">Who's checking in?</h3>
              </div>
              
              {/* Mobile-friendly family view toggle */}
              <button
                onClick={() => setShowFamilyView(true)}
                className="w-full sm:w-auto px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-2xl font-medium transition-colors flex items-center justify-center touch-target"
              >
                <span>See Everyone's Day</span>
              </button>
            </div>
            
            {/* Progressive contextual messaging */}
            {familyMembers.length > 0 && familyMembers.length <= 2 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-100">
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-medium">Your 2-minute family ritual:</span> Daily mood check-ins → Screen time reflection → Gratitude practice. Simple steps that build lasting connection.
                </p>
              </div>
            )}
            
            {familyMembers.filter(member => !getMemberTodayMoodEntry(member.id)).length === familyMembers.length && familyMembers.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl border border-blue-100">
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-medium">Ready to check in?</span> Tap your profile below to start sharing how you're feeling today.
                </p>
                <div className="flex items-center justify-center mt-2 text-blue-600">
                  <ChevronRight className="w-4 h-4 animate-bounce" />
                  <span className="text-xs ml-1">Choose your profile</span>
                  <ChevronRight className="w-4 h-4 animate-bounce" />
                </div>
              </div>
            )}
            {/* Mobile-optimized family member selection */}
            <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
              {familyMembers.map(member => {
                const todayEntry = getMemberTodayMoodEntry(member.id);
                return (
                  <button
                    key={member.id}
                    onClick={() => todayEntry ? setShowFamilyView(true) : setSelectedMember(member)}
                    className={`w-full p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-3 transition-all duration-200 min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center relative ${
                      todayEntry 
                        ? 'border-green-200 bg-green-50 cursor-pointer hover:shadow-lg active:scale-[0.98] sm:hover:scale-105 sm:active:scale-100'
                        : 'border-orange-200 hover:border-orange-400 hover:shadow-lg active:scale-[0.98] sm:hover:scale-105 cursor-pointer sm:active:scale-100 profile-card-clickable focus:ring-4 focus:ring-orange-200 focus:outline-none'
                    }`}
                    style={{ backgroundColor: todayEntry ? '#F0FDF4' : member.color }}
                    aria-label={todayEntry ? `See ${member.name}'s feelings and family updates` : `Check in as ${member.name}`}
                    title={todayEntry ? `Tap to see how ${member.name} is doing` : `Tap to check in as ${member.name}`}
                  >
                    {/* Uniform vertical layout for all screen sizes */}
                    <FamilyMemberIcon avatar={member.avatar} className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" showBackground={true} />
                    <div className="text-base sm:text-lg font-medium text-center">{member.name}</div>
                    {!todayEntry && (
                      <div className="text-xs sm:text-xs text-gray-600 mt-1 opacity-70">
                        👆 Tap to check in
                      </div>
                    )}
                    {todayEntry && (
                      <>
                        <div className="absolute top-2 right-2 text-green-600">
                          <div className="text-xl sm:text-2xl">{todayEntry.emoji}</div>
                        </div>
                        <div className="text-xs sm:text-sm text-green-600 mt-1">Tap to see details</div>
                      </>
                    )}
                  </button>
                );
              })}
              <button
                  onClick={() => {
                    setShowManageMembers(true);
                    // Scroll to add member form after a brief delay to ensure DOM is updated
                    setTimeout(() => {
                      const addMemberSection = document.getElementById('manage-members-section');
                      if (addMemberSection) {
                        addMemberSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="w-full p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-3 border-dashed border-orange-300 hover:border-orange-400 transition-colors min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center text-orange-600 active:scale-[0.98] sm:hover:scale-105"
                >
                  {/* Uniform vertical layout */}
                  <Plus className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
                  <div className="text-base sm:text-lg font-medium text-center">Add Family Member</div>
                </button>
            </div>
          </div>
        )}

        {/* Redesigned Family Management Interface */}
        {showManageMembers && (
          <div className="mb-10" id="manage-members-section">
            <div className="flex items-center mb-8">
              <button
                onClick={() => setShowManageMembers(false)}
                className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
              >
                ← Back
              </button>
              <h3 className="text-2xl">Manage Family</h3>
            </div>

            {/* Add new member - Redesigned Progressive Flow */}
            <Card className="p-6 mb-6 bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-100">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">👋</div>
                  <h4 className="text-xl font-medium mb-2">Add a Family Member</h4>
                  <p className="text-gray-600">Let's create a profile for your daily check-ins</p>
                </div>
                
                <div className="space-y-6">
                  {/* Step 1: Name Input with Gentle Prompt */}
                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-700">
                      What should we call them?
                    </label>
                    <Input
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="Enter their name"
                      className="text-lg p-4 border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                    />
                    {newMemberName.trim() && (
                      <div className="text-center py-3 bg-white/60 rounded-lg">
                        <p className="text-lg text-gray-700">
                          Hello <span className="font-semibold text-orange-600">{newMemberName.trim()}</span>! 👋
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Avatar Selection - Progressive Disclosure */}
                  {newMemberName.trim() && (
                    <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
                      <label className="block text-base font-medium text-gray-700">
                        Choose {newMemberName.trim()}'s avatar
                      </label>
                      
                      {/* Large Avatar Preview */}
                      <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mb-3">
                          <FamilyMemberIcon avatar={newMemberAvatar} className="w-12 h-12" />
                        </div>
                        <p className="text-sm text-gray-600">Current selection</p>
                      </div>

                      {/* Category-Based Progressive Selection */}
                      <div className="space-y-4">
                        {['Parent', 'Guardian', 'Teen', 'Child', 'Extended Family'].map(category => {
                          const categoryAvatars = getAvatarsByCategory(category);
                          const isCurrentCategory = categoryAvatars.some(avatar => avatar.id === newMemberAvatar);
                          
                          return (
                            <div key={category} className=" hover:border-orange-300 transition-colors">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-base font-medium text-gray-700 flex items-center">
                                  <span className="mr-2">
                                    {category === 'Parent' && '👨‍👩‍👧‍👦'}
                                    {category === 'Guardian' && '🧑‍🤝‍🧑'}
                                    {category === 'Teen' && '🎓'}
                                    {category === 'Child' && '🧒'}
                                    {category === 'Extended Family' && '👴👵'}
                                  </span>
                                  {category}
                                </h5>
                                {isCurrentCategory && (
                                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                                    Selected
                                  </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-3 gap-3">
                                {categoryAvatars.map(option => (
                                  <button
                                    key={option.id}
                                    onClick={() => setNewMemberAvatar(option.id)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center hover:scale-105 ${
                                      newMemberAvatar === option.id 
                                        ? 'border-orange-400 bg-orange-100 shadow-md' 
                                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                                    }`}
                                  >
                                    <FamilyMemberIcon avatar={option.id} className="w-10 h-10 mb-2" showBackground={false} />
                                    <span className="text-xs text-gray-600 text-center leading-tight">
                                      Style {categoryAvatars.indexOf(option) + 1}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirmation Button */}
                  <Button
                    onClick={handleAddMember}
                    disabled={!newMemberName.trim()}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {newMemberName.trim() ? `Add ${newMemberName.trim()} to Family` : 'Enter a name to continue'}
                  </Button>
                </div>
              </Card>

            {/* Existing members - Enhanced Design */}
            <div className="space-y-4" id="members-list-section">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-medium text-gray-800">Your Family</h4>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {familyMembers.length} members
                </div>
              </div>
              
              {familyMembers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
                  <p className="text-lg">No family members yet</p>
                  <p className="text-sm">Add your first family member above</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {familyMembers.map(member => (
                    <Card key={member.id} className="p-5 hover:shadow-md transition-shadow border-2 border-gray-100 hover:border-orange-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm border-2 border-white"
                            style={{ backgroundColor: member.color }}
                          >
                            <FamilyMemberIcon avatar={member.avatar} className="w-8 h-8" showBackground={false} />
                          </div>
                          <div className="flex-1">
                            {editingMember?.id === member.id ? (
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="text-lg font-medium border-2 border-orange-300 focus:border-orange-500"
                                autoFocus
                              />
                            ) : (
                              <div>
                                <span className="text-lg font-medium text-gray-800">{member.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {editingMember?.id === member.id ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                className="text-green-600 hover:text-green-700 p-3 hover:bg-green-50 rounded-lg transition-colors"
                                title="Save changes"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-500 hover:text-gray-700 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                title="Cancel editing"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditMember(member)}
                                className="text-blue-600 hover:text-blue-700 p-3 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit name"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMember(member)}
                                className="text-red-600 hover:text-red-700 p-3 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove from family"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Go back button at bottom of members list */}
              <div className="pt-6">
                <Button
                  onClick={() => setShowManageMembers(false)}
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700"
                >
                  ← Back to Day Glow
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Family Witnessing View - mobile-optimized */}
        {!selectedMember && !showManageMembers && familyMembers.length > 0 && showFamilyView && (
          <div className="mb-10">
            {/* Mobile-friendly header */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-bold">Today's Family</h3>
              <button
                onClick={() => setShowFamilyView(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl p-2 -mr-2 touch-target"
                aria-label="Close family view"
              >
                ×
              </button>
            </div>
            
            {/* Mobile-optimized family entries */}
            <div className="space-y-3">
              {getTodayFamilyEntries().map(({ member, entry }) => (
                <div 
                  key={member.id}
                  className={`p-4 rounded-2xl border-2 transition-all touch-target ${
                    entry 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {/* Main content - always visible */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FamilyMemberIcon avatar={member.avatar} className="w-8 h-8 flex-shrink-0" showBackground={true} />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-800 text-lg block truncate">{member.name}</span>
                        {entry ? (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-600 hidden sm:inline">
                              Feeling {MOOD_OPTIONS.find(mood => mood.emoji === entry.emoji)?.name || 'good'}
                            </span>
                            <span className="text-sm text-gray-600 sm:hidden">
                              {MOOD_OPTIONS.find(mood => mood.emoji === entry.emoji)?.name || 'Good'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 block">
                            <span className="hidden sm:inline">Haven't checked in yet</span>
                            <span className="sm:hidden">Not yet</span>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action button */}
                    {!entry && (
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowFamilyView(false);
                        }}
                        className="px-4 py-2 bg-purple-500 text-white text-sm rounded-full hover:bg-purple-600 transition-colors flex-shrink-0 touch-target"
                      >
                        <span className="hidden sm:inline">Help check in</span>
                        <span className="sm:hidden">Check in</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Note - mobile-friendly display */}
                  {entry && entry.note && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-700 italic leading-relaxed">
                        "{entry.note}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Mobile-friendly inspiration message */}
            <div className="mt-6 p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <p className="text-sm text-gray-700 text-center leading-relaxed">
                💜 <span className="hidden sm:inline">Family connection happens when we witness each other's experiences with care and curiosity.</span>
                <span className="sm:hidden">Connection through caring witness.</span>
              </p>
            </div>
            
            {/* Mobile-friendly back button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowFamilyView(false)}
                className="px-6 py-3 text-purple-600 hover:text-purple-700 text-base font-medium touch-target rounded-2xl hover:bg-purple-50 transition-colors"
              >
                ← Back to check-ins
              </button>
            </div>
          </div>
        )}

        {/* Mood selection */}
        {selectedMember && !selectedMood && (
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
              >
                ←
              </button>
              <h3 className="text-2xl">{selectedMember.name}, how are you feeling today?</h3>
            </div>
            
            {/* First mood entry guidance */}
            {moodEntries.filter(entry => entry.memberId === selectedMember.id).length === 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-medium">Sharing with your family:</span> Your feelings matter and help everyone understand how to support each other today.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {MOOD_OPTIONS.map((mood, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMood(mood)}
                  className="p-6 rounded-3xl border-3 border-orange-200 hover:border-orange-400 transition-colors flex flex-col items-center min-h-[120px] justify-center"
                  style={{ backgroundColor: mood.color }}
                >
                  <div className="text-4xl mb-3">{mood.emoji}</div>
                  <div className="text-lg text-gray-700">{mood.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Note and submit */}
        {selectedMember && selectedMood && (
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setSelectedMood(null)}
                className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
              >
                ←
              </button>
              <div className="flex items-center">
                <span className="text-4xl mr-4">{selectedMood.emoji}</span>
                <span className="text-2xl">{selectedMood.name}</span>
              </div>
            </div>
            
            {/* First mood entry additional guidance */}
            {moodEntries.filter(entry => entry.memberId === selectedMember.id).length === 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border border-green-100">
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-medium">Next up:</span> After saving your mood, you'll continue to screen time reflection and gratitude practice. Your full 2-minute ritual! 🌟
                </p>
              </div>
            )}
            
            <div className="mb-8">
              <label className="block text-lg text-gray-600 mb-3">
                Want to add a note? (optional)
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What made you feel this way?"
                className="w-full text-lg p-4"
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 max-[999px]:text-lg max-[999px]:py-3 text-xl py-4 h-auto"
            >
              Save my mood
            </Button>
          </div>
        )}

        {/* Family Connection Journey Button - only show with minimum 1 day of data */}
        {graduationProgress && !showManageMembers && !selectedMember && moodEntries.length > 0 && (
          <div className="mt-10">
            <Button
              onClick={() => _onNavigate?.('graduation')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 max-[999px]:text-base max-[999px]:py-3 text-lg py-4 h-auto"
            >
              💝 See Your Family's Connection Journey
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}