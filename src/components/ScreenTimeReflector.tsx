import { useState } from 'react';
import { FamilyMember, ReflectionEntry } from '../App';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { FamilyMemberIcon } from './FamilyMemberIcon';
import { formatDate } from './ui/utils';

const REFLECTION_PROMPTS = [
  "What's the first thing you see when you look up right now?",
  "Name a sound you can hear that's not from a phone or TV",
  "What did you have for lunch today?",
  "Who made you laugh today?",
  "What's the weather like outside?",
  "What color are you wearing right now?",
  "What did you learn today that wasn't from a screen?",
  "How many steps did you take outside today?",
  "What's something you touched with your hands today?",
  "Who did you hug today?",
  "What made you smile without taking a photo?",
  "What game did you play offline today?",
  "What's your favorite smell in your house right now?",
  "How did you help someone today?",
  "What did you cook or eat that tasted really good?",
  "What animal did you see today (pet, bird, anything!)?",
  "How long did you go without checking your phone?",
  "What did you build, fix, or make with your hands?",
  "Who did you have a real conversation with today?",
  "What's something beautiful you noticed outside?",
  "How did you move your body today (walk, dance, stretch)?",
  "What made you curious about something today?",
  "What's the best part of your day so far?",
  "How did you take care of yourself today?",
  "What tradition or habit made you feel good today?",
  "What problem did you solve without googling it?",
  "How did you connect with nature today?",
  "What made you feel proud of yourself today?",
  "Who in your family made you feel loved today?",
  "What's something you're looking forward to tomorrow?",
  "How did you make someone else's day better?",
  "What's your favorite thing about where you live?",
  "What did you do that felt really 'you' today?",
  "How did you slow down and just breathe today?",
  "What skill did you practice today?",
  "How did you show kindness to yourself today?",
  "What surprised you about today?",
  "What's something you accomplished with patience?",
  "How did you connect with your family today?",
  "What made you feel calm and peaceful?",
  "What's something you love about your daily routine?",
  "How did you use your imagination today?",
  "What made you feel strong or capable today?",
  "What did you notice about your neighborhood today?",
  "How did you make an ordinary moment special?",
  "What's something you're getting better at?",
  "How did you practice being present with someone?",
  "What made you feel connected to your community?",
  "What's the most interesting thing you learned today?",
  "How did you take a break from being busy today?",
  "What made you appreciate your body today?",
  "What's something you created or made today?",
  "How did you show love to someone today?",
  "What made you feel really awake and alive?",
  "What's your favorite memory from today?",
  "How did you practice patience today?",
  "What made you feel like you belong somewhere?",
  "What's something you're proud you didn't need help with?",
  "How did you make time for fun today?",
  "What made you feel peaceful inside?",
  "What's something you noticed for the first time?",
  "How did you connect with your values today?",
  "What's the kindest thing someone did for you today?",
  "How did you turn off distractions and focus today?",
  "What made you feel confident in yourself?",
  "What's something simple that brought you joy?",
  "What's something you love about being you?",
  "How did you make today different from yesterday?",
  "What made you feel connected to something bigger?",
  "What's the best conversation you had today?",
  "How did you choose quality over quantity today?",
  "What made you feel at home and comfortable?",
  "How did you practice being kind to yourself?",
  "What made you feel like you have enough?",
  "What's something you want to remember about today?",
  "How did you make space for what matters most?",
  "What's something you appreciated without taking a picture?",
  "How did you choose connection over perfection today?",
  "What made you feel alive and present?",
  "What's the most meaningful moment of your day?",
  "What's something beautiful about this exact moment?",
  "How did you choose love over fear today?",
  "What's something you want to carry into tomorrow?",
  "How did you practice being fully here today?",
  "What made today feel special and worth remembering?"
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
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [response, setResponse] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const getRandomPrompt = () => {
    // Get random prompt from main collection
    const randomPrompt = REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
    return randomPrompt;
  };

  const handleMemberSelect = (member: FamilyMember) => {
    setSelectedMember(member);
    setCurrentPrompt(getRandomPrompt());
  };

  const handleSubmit = () => {
    if (response.trim()) {
      onAddReflectionEntry({
        memberId: selectedMember!.id,
        prompt: currentPrompt,
        response: response.trim(),
        date: new Date().toISOString()
      });
      
      // Show success celebration
      setShowSuccess(true);
      
      // Reset after celebration
      setTimeout(() => {
        setSelectedMember(null);
        setCurrentPrompt('');
        setResponse('');
        setShowSuccess(false);
      }, 3000);
    }
  };

  const handleSkip = () => {
    // Just reset without saving
    setSelectedMember(null);
    setCurrentPrompt('');
    setResponse('');
  };

  // All prompts are now simple reflection questions

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
            Daily Reflection
          </h1>
          <p className="text-gray-600 text-xl">A moment of mindful reflection</p>
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

        {selectedMember && currentPrompt && (
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ← Back
              </button>
            </div>

            <Card className="p-8 mb-8 border-0 bg-gradient-to-br from-blue-50 to-green-50">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🌿</div>
                <h3 className="text-2xl">
                  {currentPrompt}
                </h3>
              </div>
            </Card>

            <div className="mb-8">
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full text-lg p-4"
                rows={4}
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
                onClick={handleSubmit}
                className="flex-1 max-[999px]:text-base max-[999px]:py-3 text-lg py-4 h-auto bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                disabled={!response.trim()}
              >
                Save Reflection
              </Button>
            </div>
          </div>
        )}

        {!selectedMember && reflectionEntries.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl mb-6">Recent Reflections</h3>
            <div className="space-y-4">
              {reflectionEntries.slice(-3).map(entry => {
                const member = familyMembers.find(m => m.id === entry.memberId);
                
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