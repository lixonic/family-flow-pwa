import { useState } from 'react';
import { FamilyMember, ReflectionEntry } from '../App';
import { Card } from './ui/card';
import { FamilyMemberIcon } from './FamilyMemberIcon';
import { InitialAvatar } from './ui/InitialAvatar';
import { formatDate } from './ui/utils';
import { VisualRegulationBar } from './reflection/VisualRegulationBar';
import { ChoiceCard } from './reflection/ChoiceCard';
import { FEEL_OPTIONS, getNeedOptions, getNextOptions } from './reflection/ReflectionChoices';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScreenTimeReflectorProps {
  familyMembers: FamilyMember[];
  reflectionEntries: ReflectionEntry[];
  onAddReflectionEntry: (entry: Omit<ReflectionEntry, 'id'>) => void;
  onDeleteReflectionEntry?: (id: string) => void;
  onNavigate?: (screen: string) => void;
}

type ReflectionStep = 'member-select' | 'regulate' | 'feel' | 'need' | 'next' | 'success';

interface ReflectionListProps {
  reflectionEntries: ReflectionEntry[];
  familyMembers: FamilyMember[];
  onDeleteReflectionEntry?: (id: string) => void;
}

function ReflectionList({ reflectionEntries, familyMembers, onDeleteReflectionEntry }: ReflectionListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 10;
  
  // Sort entries by date (newest first)
  const sortedEntries = [...reflectionEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const totalPages = Math.ceil(sortedEntries.length / entriesPerPage);
  const startIndex = currentPage * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = sortedEntries.slice(startIndex, endIndex);

  return (
    <div>
      <div className="space-y-4">
        {currentEntries.map(entry => {
          const member = familyMembers.find(m => m.id === entry.memberId);
          
          return (
            <Card key={entry.id} className="p-6">
              <div className="flex items-start space-x-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: member?.color || '#F3F4F6' }}
                >
                  <FamilyMemberIcon avatar={member?.avatar || 'mother'} name={member?.name || 'Family Member'} avatarColor={member?.avatarColor} className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  {/* New format for Feel→Need→Next */}
                  {entry.feelChoice ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Family felt: <span className="text-gray-700 font-medium">{entry.feelChoice.replace('-', ' ')}</span></div>
                      <div className="text-sm text-gray-500">Needed: <span className="text-gray-700 font-medium">{entry.needChoice.replace('-', ' ')}</span></div>
                      <div className="text-sm text-gray-500">Next step: <span className="text-gray-700 font-medium">{entry.nextChoice.replace('-', ' ')}</span></div>
                    </div>
                  ) : (
                    /* Legacy format */
                    <div>
                      <div className="text-sm text-gray-600 mb-1">{entry.prompt}</div>
                      <div className="text-base">{entry.response}</div>
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    {member?.name} • {formatDate(entry.date)}
                  </div>
                </div>
                {onDeleteReflectionEntry && (
                  <button
                    onClick={() => onDeleteReflectionEntry(entry.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    title="Delete reflection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <span className="text-sm text-gray-500">
            Page {currentPage + 1} of {totalPages} ({sortedEntries.length} total)
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function ScreenTimeReflector({ 
  familyMembers, 
  reflectionEntries, 
  onAddReflectionEntry, 
  onDeleteReflectionEntry, 
  onNavigate 
}: ScreenTimeReflectorProps) {
  const [currentStep, setCurrentStep] = useState<ReflectionStep>('member-select');
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [regulationActive, setRegulationActive] = useState(true);
  const [selections, setSelections] = useState({
    feel: '',
    need: '',
    next: ''
  });
  
  const today = new Date().toDateString();
  
  // Check if member already has reflection entry today
  const getMemberTodayReflectionEntry = (memberId: string) => {
    return reflectionEntries.find(entry => 
      entry.memberId === memberId && 
      new Date(entry.date).toDateString() === today
    );
  };

  const handleMemberSelect = (member: FamilyMember) => {
    setSelectedMember(member);
    setCurrentStep('regulate');
    setRegulationActive(true);
  };

  const handleRegulationComplete = () => {
    setCurrentStep('feel');
  };

  const handleFeelSelect = (feelChoice: string) => {
    setSelections(prev => ({ ...prev, feel: feelChoice, need: '', next: '' }));
    setCurrentStep('need');
  };

  const handleNeedSelect = (needChoice: string) => {
    setSelections(prev => ({ ...prev, need: needChoice, next: '' }));
    setCurrentStep('next');
  };

  const handleNextSelect = (nextChoice: string) => {
    setSelections(prev => ({ ...prev, next: nextChoice }));
    
    // Save the reflection
    onAddReflectionEntry({
      memberId: selectedMember!.id,
      feelChoice: selections.feel,
      needChoice: selections.need,
      nextChoice: nextChoice,
      date: new Date().toISOString()
    });
    
    setCurrentStep('success');
    
    // Reset after celebration
    setTimeout(() => {
      setCurrentStep('member-select');
      setSelectedMember(null);
      setSelections({ feel: '', need: '', next: '' });
    }, 3000);
  };


  const getStepTitle = () => {
    switch (currentStep) {
      case 'regulate':
        return 'Center Yourself';
      case 'feel':
        return 'How did our family\'s screen time feel today?';
      case 'need':
        return 'What does our family need more of?';
      case 'next':
        return 'What\'s one small step we can try?';
      default:
        return 'Daily Reflection';
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'regulate': return '1 of 4';
      case 'feel': return '2 of 4';
      case 'need': return '3 of 4';
      case 'next': return '4 of 4';
      default: return '';
    }
  };

  // Success celebration screen
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Gentle celebration glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-pink-100/20 via-transparent to-transparent animate-pulse-gentle opacity-50" />
        </div>
        
        <div className="text-center z-10">
          <div className="text-8xl mb-6">🌸</div>
          <h2 className="text-3xl mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Beautiful Reflection!
          </h2>
          <p className="text-gray-600 text-xl">Your family awareness is growing stronger</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-area-content relative">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-title text-2xl sm:text-4xl mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            {currentStep === 'member-select' ? 'Family Reflection' : getStepTitle()}
          </h1>
          {currentStep !== 'member-select' && (
            <p className="text-gray-500 text-sm mb-2">Step {getStepNumber()}</p>
          )}
          <p className="text-gray-600 text-lg">
            {currentStep === 'member-select' 
              ? 'A moment of mindful family awareness' 
              : `Reflecting for ${selectedMember?.name}`}
          </p>
        </div>

        {/* No family members guidance */}
        {currentStep === 'member-select' && familyMembers.length === 0 && (
          <div className="text-center mb-8">
            <div className="mb-6 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-100">
              <div className="text-6xl mb-4">🌸</div>
              <h3 className="text-xl font-medium mb-3 text-gray-800">Time for family reflection!</h3>
              <p className="text-gray-600 mb-4">
                First, you'll need to add family members so everyone can share their daily digital wellness reflections.
              </p>
              <p className="text-sm text-gray-500">
                Once you have family members set up, you can return here for gentle family reflection on screen time.
              </p>
            </div>
            <button
              onClick={() => onNavigate?.('day-glow')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-medium text-lg"
            >
              Go to Day Glow → Add Family Members
            </button>
          </div>
        )}

        {/* Family member selection */}
        {currentStep === 'member-select' && familyMembers.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl mb-6">Who's reflecting today?</h3>
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
                        : 'border-orange-200 hover:border-orange-400 cursor-pointer'
                    }`}
                    style={{ backgroundColor: todayEntry ? '#F0FDF4' : member.color }}
                    disabled={!!todayEntry}
                  >
                    {member.avatarColor ? (
                      <InitialAvatar name={member.name} backgroundColor={member.avatarColor} size="lg" className="mb-3" />
                    ) : (
                      <FamilyMemberIcon avatar={member.avatar} name={member.name} avatarColor={member.avatarColor} className="w-12 h-12 mb-3" />
                    )}
                    <div className="text-lg font-medium">{member.name}</div>
                    {todayEntry && (
                      <>
                        <div className="absolute top-2 right-2 text-green-600">
                          <div className="text-lg">🌸</div>
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

        {/* Visual regulation step */}
        {currentStep === 'regulate' && (
          <div className="mb-10">
            <VisualRegulationBar
              duration={40} // 40 seconds for regulation
              onComplete={handleRegulationComplete}
              isActive={regulationActive}
              onToggle={() => setRegulationActive(!regulationActive)}
            />
          </div>
        )}

        {/* Feel step */}
        {currentStep === 'feel' && (
          <div className="mb-10">
            <div className="space-y-4">
              {FEEL_OPTIONS.map(option => (
                <ChoiceCard
                  key={option.id}
                  option={option}
                  isSelected={selections.feel === option.id}
                  onSelect={() => handleFeelSelect(option.id)}
                  familyMember={selectedMember || undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Need step */}
        {currentStep === 'need' && (
          <div className="mb-10">
            <div className="space-y-4">
              {getNeedOptions(selections.feel).map(option => (
                <ChoiceCard
                  key={option.id}
                  option={option}
                  isSelected={selections.need === option.id}
                  onSelect={() => handleNeedSelect(option.id)}
                  familyMember={selectedMember || undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Next step */}
        {currentStep === 'next' && (
          <div className="mb-10">
            <div className="space-y-4">
              {getNextOptions(selections.need).map(option => (
                <ChoiceCard
                  key={option.id}
                  option={option}
                  isSelected={selections.next === option.id}
                  onSelect={() => handleNextSelect(option.id)}
                  familyMember={selectedMember || undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent reflections - only show on member select screen */}
        {currentStep === 'member-select' && reflectionEntries.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl mb-6">Recent Family Reflections</h3>
            <ReflectionList 
              reflectionEntries={reflectionEntries}
              familyMembers={familyMembers}
              onDeleteReflectionEntry={onDeleteReflectionEntry}
            />
          </div>
        )}
      </div>
    </div>
  );
}