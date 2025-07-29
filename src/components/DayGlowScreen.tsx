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
  // Mother options - Blonde, Black, Grey hair
  { id: 'mother', emoji: '👱‍♀️', label: 'Mother', category: 'Mother' },
  { id: 'mother2', emoji: '👩', label: 'Mother', category: 'Mother' },
  { id: 'mother3', emoji: '👩‍🦳', label: 'Mother', category: 'Mother' },
  
  // Father options - Blonde, Black, Grey hair
  { id: 'father', emoji: '👱‍♂️', label: 'Father', category: 'Father' },
  { id: 'father2', emoji: '👨', label: 'Father', category: 'Father' },
  { id: 'father3', emoji: '👨‍🦳', label: 'Father', category: 'Father' },
  
  // Child options - Blonde, Black, Girl
  { id: 'child', emoji: '👶', label: 'Child', category: 'Child' },
  { id: 'child2', emoji: '👦', label: 'Child', category: 'Child' },
  { id: 'child3', emoji: '👧', label: 'Child', category: 'Child' },
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
    nextMilestone?: any;
    readyForGraduation: boolean;
    nearGraduation: boolean;
    achievedMilestones: any[];
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
  const [currentMoodResponse, setCurrentMoodResponse] = useState<{ title: string; message: string; icon: string } | null>(null);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState('mother');
  const [editingName, setEditingName] = useState('');
  const [showCooldownBanner, setShowCooldownBanner] = useState(false);
  const [showCooldownSuggestions, setShowCooldownSuggestions] = useState(false);
  const [cooldownSuggestions, setCooldownSuggestions] = useState<string[]>([]);

  const today = new Date().toDateString();
  
  // Check if member already has mood entry today
  const getMemberTodayMoodEntry = (memberId: string) => {
    return moodEntries.find(entry => 
      entry.memberId === memberId && 
      new Date(entry.date).toDateString() === today
    );
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
      
      // Hide success after 3 seconds to allow time for cooldown banner
      setTimeout(() => {
        setShowSuccess(false);
        if (showCooldownBanner) {
          // Keep banner visible for longer
          setTimeout(() => setShowCooldownBanner(false), 8000);
        }
      }, 2000);
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
    if (newMemberName.trim() && familyMembers.length < 6) {
      const colorIndex = familyMembers.length % MEMBER_COLORS.length;
      const success = onAddFamilyMember({
        name: newMemberName.trim(),
        avatar: newMemberAvatar,
        color: MEMBER_COLORS[colorIndex]
      });
      
      if (success) {
        setNewMemberName('');
        setNewMemberAvatar('mother');
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
  const getStyleLabel = (_id: string, _category: string) => {
    return '';
  };

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
        
        <div className="text-center z-10">
          <div className="text-8xl mb-6">{currentMoodResponse?.icon || '✨'}</div>
          <h2 className="text-3xl mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            {currentMoodResponse?.title || 'Thank you!'}
          </h2>
          <p className="text-gray-600 text-xl">{currentMoodResponse?.message || 'Your mood has been saved'}</p>
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
              <div className="mb-6 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-100">
                <div className="text-6xl mb-4">👋</div>
                <h3 className="text-xl font-medium mb-3 text-gray-800">Welcome to your 2-minute family ritual!</h3>
                <p className="text-gray-600 mb-4">
                  Let's set up your family members so everyone can share their daily check-ins.
                </p>
                <p className="text-sm text-gray-500">
                  Don't worry - you can always add or change these later.
                </p>
              </div>
              <button
                onClick={() => setShowManageMembers(true)}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-medium text-lg flex items-center mx-auto"
              >
                <User className="w-5 h-5 mr-2" />
                Add Your First Family Member
              </button>
            </div>
          </div>
        )}

        {/* Family member management - only show when family members exist */}
        {!selectedMember && !showManageMembers && familyMembers.length > 0 && (
          <div className="mb-10">
            <div className="mb-6">
              <h3 className="text-2xl">Who's checking in?</h3>
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
                  <span className="font-medium">Ready to check in?</span> Share how you're feeling today - your family will see your mood and you'll continue to screen time reflection and gratitude.
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {familyMembers.map(member => {
                const todayEntry = getMemberTodayMoodEntry(member.id);
                return (
                  <button
                    key={member.id}
                    onClick={() => todayEntry ? null : setSelectedMember(member)}
                    className={`p-6 rounded-3xl border-3 transition-colors min-h-[120px] flex flex-col items-center justify-center relative ${
                      todayEntry 
                        ? 'border-green-200 bg-green-50 cursor-not-allowed opacity-75'
                        : 'border-orange-200 hover:border-orange-400 cursor-pointer'
                    }`}
                    style={{ backgroundColor: todayEntry ? '#F0FDF4' : member.color }}
                    disabled={!!todayEntry}
                  >
                    <FamilyMemberIcon avatar={member.avatar} className="w-12 h-12 mb-3" />
                    <div className="text-lg font-medium">{member.name}</div>
                    {todayEntry && (
                      <>
                        <div className="absolute top-2 right-2 text-green-600">
                          <div className="text-2xl">{todayEntry.emoji}</div>
                        </div>
                        <div className="text-sm text-green-600 mt-1">Already checked in</div>
                      </>
                    )}
                  </button>
                );
              })}
              {familyMembers.length === 1 && (
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
                  className="p-6 rounded-3xl border-3 border-dashed border-orange-300 hover:border-orange-400 transition-colors min-h-[120px] flex flex-col items-center justify-center text-orange-600"
                >
                  <Plus className="w-12 h-12 mb-3" />
                  <div className="text-lg font-medium">Add/Edit Member</div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Manage members screen */}
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

            {/* Add new member */}
            {familyMembers.length < 6 && (
              <Card className="p-6 mb-6 bg-orange-50">
                <h4 className="text-lg mb-4">Add New Member</h4>
                <div className="space-y-4">
                  <Input
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Enter name"
                    className="text-lg"
                  />
                  {newMemberName.trim() && (
                    <div className="text-center py-2">
                      <p className="text-lg text-gray-600">Hello <span className="font-medium text-orange-600">{newMemberName.trim()}</span>!</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    {['Mother', 'Father', 'Child'].map(category => (
                      <div key={category}>
                        <h5 className="text-sm font-medium text-gray-600 mb-2">{category}</h5>
                        <div className="grid grid-cols-3 gap-2">
                          {getAvatarsByCategory(category).map(option => {
                            return (
                              <button
                                key={option.id}
                                onClick={() => setNewMemberAvatar(option.id)}
                                className={`p-3 rounded-xl border-2 transition-colors flex flex-col items-center ${
                                  newMemberAvatar === option.id 
                                    ? 'border-orange-400 bg-orange-100' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <span className="text-2xl mb-1">{option.emoji}</span>
                                <span className="text-xs">{getStyleLabel(option.id, option.category)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleAddMember}
                    disabled={!newMemberName.trim()}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg py-3"
                  >
                    Add Member
                  </Button>
                </div>
              </Card>
            )}

            {/* Existing members */}
            <div className="space-y-4" id="members-list-section">
              <h4 className="text-lg">Family Members ({familyMembers.length}/6)</h4>
              {familyMembers.map(member => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: member.color }}
                      >
                        <FamilyMemberIcon avatar={member.avatar} className="w-6 h-6" />
                      </div>
                      {editingMember?.id === member.id ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 text-lg"
                          autoFocus
                        />
                      ) : (
                        <span className="text-lg font-medium">{member.name}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {editingMember?.id === member.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-600 hover:text-green-700 p-2"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-500 hover:text-gray-700 p-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditMember(member)}
                            className="text-blue-600 hover:text-blue-700 p-2"
                            title="Edit name"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member)}
                            className="text-red-600 hover:text-red-700 p-2"
                            title="Delete member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
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
              <h3 className="text-2xl">How are you feeling, {selectedMember.name}?</h3>
            </div>
            
            {/* First mood entry guidance */}
            {moodEntries.filter(entry => entry.memberId === selectedMember.id).length === 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-medium">Step 1 of 3:</span> Choose how you're feeling right now. After this, you'll reflect on screen time and practice gratitude.
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
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-xl py-4 h-auto"
            >
              {moodEntries.filter(entry => entry.memberId === selectedMember.id).length === 0 
                ? 'Continue to Screen Time →' 
                : 'Save my mood'
              }
            </Button>
          </div>
        )}

        {/* Track Progress Button - only show with minimum 1 day of data */}
        {graduationProgress && !showManageMembers && !selectedMember && moodEntries.length > 0 && (
          <div className="mt-10">
            <Button
              onClick={() => _onNavigate?.('graduation')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-4 h-auto"
            >
              📊 Track Your Progress
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}