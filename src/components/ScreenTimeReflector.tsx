import { useState } from 'react';
import { FamilyMember, ReflectionEntry } from '../App';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { FamilyMemberIcon } from './FamilyMemberIcon';
import { formatDate } from './ui/utils';

const BASE_REFLECTION_PROMPTS = [
  "What was your best offline moment today?",
  "Something online you loved today?",
  "What digital experience didn't serve you well today?",
  "How did screen time make you feel?",
  "What other activities brought you joy today?",
  "Did you feel connected or disconnected?",
  "What made you smile away from screens?",
  "How long do you think you spent online?",
  "What did you learn today offline?",
  "What app did you use most today?",
  "When did you feel most present today?",
  "What would you tell your younger self about screens?",
  "What's one digital habit you're proud of?",
  "How did technology help you today?",
  "What's something you discovered offline?",
  "When did you choose to put your phone down?",
  "What made you laugh without a screen?",
  "How did you connect with someone today?",
  "What's a skill you practiced offline?",
  "What did you notice about your surroundings?",
  "What role did screens play in helping you today?",
  "Which digital tools supported your wellbeing?",
  "How did technology help you connect with others?",
  "What screen time felt most purposeful today?"
];

const SOCIAL_MEDIA_MICRO_ACTIONS = [
  "Unfollow an account that stresses you",
  "Turn off comments on one post",
  "Set a 10-minute timer before opening social media",
  "Delete one app you don't really need",
  "Put your phone in another room for an hour"
];

const CHECK_THE_SOURCE_PROMPTS = [
  "Did you see something online that made you feel upset or unsure? Pause—can you tell who posted it and why?",
  "What's one thing you saw online today that made you compare yourself to others? How did that feel?",
  "Did you notice any posts that seemed too good to be true? What made you think that?",
  "Can you spot the difference between news, opinions, and ads in your feed today?",
  "What's one account you follow that always makes you feel good? What makes it different?",
  "Did you see any content that tried to make you angry or scared? Why do you think it was made that way?",
  "How do you know if something you see online is real or edited? What clues do you look for?",
  "What's one thing you learned today—online or offline? Which source do you trust more and why?",
  "Did you feel pressured to like, share, or comment on something today? What was driving that feeling?",
  "If you could fact-check one thing you saw online today, what would it be and how would you do it?"
];

interface ScreenTimeReflectorProps {
  familyMembers: FamilyMember[];
  reflectionEntries: ReflectionEntry[];
  onAddReflectionEntry: (entry: Omit<ReflectionEntry, 'id'>) => void;
  onDeleteReflectionEntry?: (id: string) => void;
  onNavigate?: (screen: string) => void;
}

export function ScreenTimeReflector({ familyMembers, reflectionEntries, onAddReflectionEntry, onDeleteReflectionEntry, onNavigate }: ScreenTimeReflectorProps) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  
  const today = new Date().toDateString();
  
  // Check if member already has reflection entry today
  const getMemberTodayReflectionEntry = (memberId: string) => {
    return reflectionEntries.find(entry => 
      entry.memberId === memberId && 
      new Date(entry.date).toDateString() === today
    );
  };
  const [currentPrompts, setCurrentPrompts] = useState<string[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [completedResponses, setCompletedResponses] = useState<{ prompt: string; response: string }[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Get the app start date from localStorage or set it
  const getAppStartDate = () => {
    const startDate = localStorage.getItem('familyFlowStartDate');
    if (startDate) {
      return new Date(startDate);
    } else {
      const today = new Date();
      localStorage.setItem('familyFlowStartDate', today.toISOString());
      return today;
    }
  };

  // Check if it's the 7th day (or multiple of 7)
  const isSeventhDay = () => {
    const startDate = getAppStartDate();
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 0 && daysDiff % 7 === 0;
  };

  const getReflectionPrompts = () => {
    let allPrompts = [...BASE_REFLECTION_PROMPTS, ...SOCIAL_MEDIA_MICRO_ACTIONS];
    
    // Add Check-the-Source prompt if it's the 7th day
    if (isSeventhDay()) {
      const randomSourcePrompt = CHECK_THE_SOURCE_PROMPTS[Math.floor(Math.random() * CHECK_THE_SOURCE_PROMPTS.length)];
      allPrompts = [randomSourcePrompt, ...allPrompts];
    }
    
    return allPrompts;
  };

  const shufflePrompts = () => {
    const allPrompts = getReflectionPrompts();
    const shuffled = [...allPrompts].sort(() => Math.random() - 0.5);
    setCurrentPrompts(shuffled.slice(0, 3));
    setCurrentPromptIndex(0);
    setCompletedResponses([]);
  };

  const handleMemberSelect = (member: FamilyMember) => {
    setSelectedMember(member);
    shufflePrompts();
  };

  const handleNextPrompt = () => {
    if (response.trim()) {
      const newResponse = {
        prompt: currentPrompts[currentPromptIndex],
        response: response.trim()
      };
      setCompletedResponses([...completedResponses, newResponse]);
    }

    if (currentPromptIndex < currentPrompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
      setResponse('');
    } else {
      // Save all responses
      completedResponses.forEach(cr => {
        onAddReflectionEntry({
          memberId: selectedMember!.id,
          prompt: cr.prompt,
          response: cr.response,
          date: new Date().toISOString()
        });
      });
      if (response.trim()) {
        onAddReflectionEntry({
          memberId: selectedMember!.id,
          prompt: currentPrompts[currentPromptIndex],
          response: response.trim(),
          date: new Date().toISOString()
        });
      }
      
      // Show success celebration
      setShowSuccess(true);
      
      // Reset after celebration
      setTimeout(() => {
        setSelectedMember(null);
        setCurrentPrompts([]);
        setCurrentPromptIndex(0);
        setResponse('');
        setCompletedResponses([]);
        setShowSuccess(false);
      }, 3000);
    }
  };

  const handleSkip = () => {
    if (currentPromptIndex < currentPrompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
      setResponse('');
    } else {
      // Save completed responses only
      completedResponses.forEach(cr => {
        onAddReflectionEntry({
          memberId: selectedMember!.id,
          prompt: cr.prompt,
          response: cr.response,
          date: new Date().toISOString()
        });
      });
      
      // Show success celebration
      setShowSuccess(true);
      
      // Reset after celebration
      setTimeout(() => {
        setSelectedMember(null);
        setCurrentPrompts([]);
        setCurrentPromptIndex(0);
        setResponse('');
        setCompletedResponses([]);
        setShowSuccess(false);
      }, 3000);
    }
  };

  // Check if current prompt is a Check-the-Source weekly prompt
  const isWeeklyPrompt = CHECK_THE_SOURCE_PROMPTS.includes(currentPrompts[currentPromptIndex]);
  const isSocialMediaAction = SOCIAL_MEDIA_MICRO_ACTIONS.includes(currentPrompts[currentPromptIndex]);

  // Confetti celebration screen
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Confetti animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => {
            const isTopHalf = i < 10;
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
                  fontSize: `${18 + Math.random() * 22}px`,
                }}
              >
                {['🧠', '💭', '✨', '🌟', '💡', '🎯', '📱', '🌿', '🎉', '💫'][Math.floor(Math.random() * 10)]}
              </div>
            );
          })}
        </div>
        
        <div className="text-center z-10">
          <div className="text-8xl mb-6">🧘</div>
          <h2 className="text-3xl mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Reflection Complete!
          </h2>
          <p className="text-gray-600 text-xl">Thank you for taking time to reflect mindfully</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-area-content relative">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-title text-2xl sm:text-4xl mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Screen Reflector
          </h1>
          <p className="text-gray-600 text-xl">Quick reflection on today's digital habits</p>
          {isSeventhDay() && !selectedMember && (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <p className="text-sm text-purple-700">🔍 Check-the-Source reflection available today</p>
            </div>
          )}
        </div>

        {/* No family members guidance */}
        {!selectedMember && familyMembers.length === 0 && (
          <div className="text-center mb-8">
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl border border-blue-100">
              <div className="text-6xl mb-4">💭</div>
              <h3 className="text-xl font-medium mb-3 text-gray-800">Time to reflect on screen time!</h3>
              <p className="text-gray-600 mb-4">
                First, you'll need to add family members so everyone can share their daily screen time reflections.
              </p>
              <p className="text-sm text-gray-500">
                Once you have family members set up, you can return here for gentle daily reflection on digital habits.
              </p>
            </div>
            <button
              onClick={() => onNavigate?.('day-glow')}
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-8 py-4 rounded-2xl font-medium text-lg"
            >
              Go to Day Glow → Add Family Members
            </button>
          </div>
        )}

        {/* Family member selection - only show when family members exist */}
        {!selectedMember && familyMembers.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl mb-6">Who's reflecting?</h3>
            <div className="grid grid-cols-2 gap-4">
              {familyMembers.map(member => {
                const todayEntry = getMemberTodayReflectionEntry(member.id);
                return (
                  <button
                    key={member.id}
                    onClick={() => todayEntry ? null : handleMemberSelect(member)}
                    className={`p-6 rounded-3xl border-3 transition-colors min-h-[120px] flex flex-col items-center justify-center relative ${
                      todayEntry 
                        ? 'border-green-200 bg-green-50 cursor-not-allowed opacity-75'
                        : 'border-blue-200 hover:border-blue-400 cursor-pointer'
                    }`}
                    style={{ backgroundColor: todayEntry ? '#F0FDF4' : member.color }}
                    disabled={!!todayEntry}
                  >
                    <FamilyMemberIcon avatar={member.avatar} className="w-12 h-12 mb-3" />
                    <div className="text-lg font-medium">{member.name}</div>
                    {todayEntry && (
                      <>
                        <div className="absolute top-2 right-2 text-green-600">
                          <div className="text-lg">💭</div>
                        </div>
                        <div className="text-sm text-green-600 mt-1">Already reflected</div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedMember && currentPrompts.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ← Back
              </button>
              <div className="text-lg text-gray-500">
                {currentPromptIndex + 1} of {currentPrompts.length}
              </div>
            </div>

            <Card className={`p-8 mb-8 border-0 ${
              isWeeklyPrompt 
                ? 'bg-gradient-to-br from-purple-50 to-pink-50' 
                : isSocialMediaAction
                ? 'bg-gradient-to-br from-teal-50 to-cyan-50'
                : 'bg-gradient-to-br from-blue-50 to-green-50'
            }`}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">
                  {isWeeklyPrompt ? '🔍' : isSocialMediaAction ? '📱' : '💭'}
                </div>
                {isWeeklyPrompt && (
                  <div className="text-sm text-purple-600 mb-2 font-medium">🔍 Check-the-Source</div>
                )}
                {isSocialMediaAction && (
                  <div className="text-sm text-teal-600 mb-2 font-medium">Digital Wellness Action</div>
                )}
                <h3 className="text-2xl">
                  {currentPrompts[currentPromptIndex]}
                </h3>
              </div>
            </Card>

            <div className="mb-8">
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder={
                  isWeeklyPrompt 
                    ? "Think critically about what you saw and felt..."
                    : isSocialMediaAction
                    ? "How did this action feel? What did you notice?"
                    : "Share your thoughts..."
                }
                className="w-full text-lg p-4"
                rows={5}
              />
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1 max-[999px]:text-base max-[999px]:py-3 text-lg py-4 h-auto"
              >
                Skip
              </Button>
              <Button
                onClick={handleNextPrompt}
                className={`flex-1 max-[999px]:text-base max-[999px]:py-3 text-lg py-4 h-auto ${
                  isWeeklyPrompt
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    : isSocialMediaAction
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
                    : 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600'
                }`}
                disabled={!response.trim() && currentPromptIndex === currentPrompts.length - 1}
              >
                {currentPromptIndex === currentPrompts.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="mt-8">
              <div className="flex space-x-3 justify-center">
                {currentPrompts.map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full ${
                      index <= currentPromptIndex 
                        ? isWeeklyPrompt
                          ? 'bg-purple-400'
                          : isSocialMediaAction
                          ? 'bg-teal-400'
                          : 'bg-blue-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {!selectedMember && reflectionEntries.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl mb-6">Recent Reflections</h3>
            <div className="space-y-4">
              {reflectionEntries.slice(-3).map(entry => {
                const member = familyMembers.find(m => m.id === entry.memberId);
                const isWeeklyEntry = CHECK_THE_SOURCE_PROMPTS.includes(entry.prompt);
                const isSocialMediaEntry = SOCIAL_MEDIA_MICRO_ACTIONS.includes(entry.prompt);
                
                return (
                  <Card key={entry.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: member?.color || '#F3F4F6' }}
                      >
                        <FamilyMemberIcon avatar={member?.avatar || 'mother'} className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        {(isWeeklyEntry || isSocialMediaEntry) && (
                          <div className={`text-xs font-medium mb-1 ${
                            isWeeklyEntry 
                              ? 'text-purple-600' 
                              : 'text-teal-600'
                          }`}>
                            {isWeeklyEntry ? '🔍 Check-the-Source' : '📱 Digital Action'}
                          </div>
                        )}
                        <div className="text-lg text-gray-600 mb-2">{entry.prompt}</div>
                        <div className="text-lg">{entry.response}</div>
                        <div className="text-sm text-gray-400 mt-2">
                          {member?.name} • {formatDate(entry.date)}
                        </div>
                      </div>
                      {onDeleteReflectionEntry && (
                        <button
                          onClick={() => onDeleteReflectionEntry(entry.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          title="Delete reflection"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}