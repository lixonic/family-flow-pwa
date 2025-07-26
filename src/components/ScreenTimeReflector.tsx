import React, { useState, useEffect } from 'react';
import { FamilyMember, ReflectionEntry } from '../App';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { FamilyMemberIcon } from './FamilyMemberIcon';

const BASE_REFLECTION_PROMPTS = [
  "What was your best offline moment today?",
  "Something online you loved today?",
  "One thing you'll skip tomorrow?",
  "How did screen time make you feel?",
  "What would you rather do instead?",
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
  "What did you notice about your surroundings?"
];

const SOCIAL_MEDIA_MICRO_ACTIONS = [
  "Unfollow an account that stresses you",
  "Turn off comments on one post",
  "Set a 10-minute timer before opening social media",
  "Delete one app you don't really need",
  "Put your phone in another room for an hour"
];

const WEEKLY_REFLECTION_PROMPT = "Did you see something online that made you feel upset or unsure? Pause—can you tell who posted it and why?";

interface ScreenTimeReflectorProps {
  familyMembers: FamilyMember[];
  reflectionEntries: ReflectionEntry[];
  onAddReflectionEntry: (entry: Omit<ReflectionEntry, 'id'>) => void;
}

export function ScreenTimeReflector({ familyMembers, reflectionEntries, onAddReflectionEntry }: ScreenTimeReflectorProps) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [currentPrompts, setCurrentPrompts] = useState<string[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [completedResponses, setCompletedResponses] = useState<{ prompt: string; response: string }[]>([]);

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
    
    // Add weekly prompt if it's the 7th day
    if (isSeventhDay()) {
      allPrompts = [WEEKLY_REFLECTION_PROMPT, ...allPrompts];
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
      
      // Reset
      setSelectedMember(null);
      setCurrentPrompts([]);
      setCurrentPromptIndex(0);
      setResponse('');
      setCompletedResponses([]);
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
      
      // Reset
      setSelectedMember(null);
      setCurrentPrompts([]);
      setCurrentPromptIndex(0);
      setResponse('');
      setCompletedResponses([]);
    }
  };

  // Check if current prompt is the special weekly prompt
  const isWeeklyPrompt = currentPrompts[currentPromptIndex] === WEEKLY_REFLECTION_PROMPT;
  const isSocialMediaAction = SOCIAL_MEDIA_MICRO_ACTIONS.includes(currentPrompts[currentPromptIndex]);

  return (
    <div className="min-h-screen px-6 py-8 pb-28">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Screen Time Reflector
          </h1>
          <p className="text-gray-600 text-xl">Quick reflection on today's digital habits</p>
          {isSeventhDay() && !selectedMember && (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <p className="text-sm text-purple-700">✨ Weekly reflection available today</p>
            </div>
          )}
        </div>

        {!selectedMember && (
          <div className="mb-10">
            <h3 className="text-2xl mb-6">Who's reflecting?</h3>
            <div className="grid grid-cols-2 gap-4">
              {familyMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => handleMemberSelect(member)}
                  className="p-6 rounded-3xl border-3 border-blue-200 hover:border-blue-400 transition-colors min-h-[120px] flex flex-col items-center justify-center"
                  style={{ backgroundColor: member.color }}
                >
                  <FamilyMemberIcon avatar={member.avatar} className="w-12 h-12 mb-3" />
                  <div className="text-lg font-medium">{member.name}</div>
                </button>
              ))}
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
                  <div className="text-sm text-purple-600 mb-2 font-medium">Weekly Reflection</div>
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
                    ? "Take your time to reflect on this..."
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
                className="flex-1 text-lg py-4 h-auto"
              >
                Skip
              </Button>
              <Button
                onClick={handleNextPrompt}
                className={`flex-1 text-lg py-4 h-auto ${
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

        {!selectedMember && (
          <div className="mt-10">
            <h3 className="text-2xl mb-6">Recent Reflections</h3>
            <div className="space-y-4">
              {reflectionEntries.slice(-3).map(entry => {
                const member = familyMembers.find(m => m.id === entry.memberId);
                const isWeeklyEntry = entry.prompt === WEEKLY_REFLECTION_PROMPT;
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
                            {isWeeklyEntry ? '✨ Weekly Reflection' : '📱 Digital Action'}
                          </div>
                        )}
                        <div className="text-lg text-gray-600 mb-2">{entry.prompt}</div>
                        <div className="text-lg">{entry.response}</div>
                        <div className="text-sm text-gray-400 mt-2">
                          {member?.name} • {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
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