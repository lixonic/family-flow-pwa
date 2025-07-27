import React, { useState } from 'react';
import { FamilyMember, GratitudeEntry } from '../App';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { FamilyMemberIcon } from './FamilyMemberIcon';
import { Plus, Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';

interface GratitudeFlipbookProps {
  familyMembers: FamilyMember[];
  gratitudeEntries: GratitudeEntry[];
  onAddGratitudeEntry: (entry: Omit<GratitudeEntry, 'id'>) => void;
}

export function GratitudeFlipbook({ familyMembers, gratitudeEntries, onAddGratitudeEntry }: GratitudeFlipbookProps) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [gratitudeText, setGratitudeText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [slideshowMode, setSlideshowMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const thisWeekEntries = gratitudeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  });

  const handleAddGratitude = () => {
    if (selectedMember && gratitudeText.trim()) {
      onAddGratitudeEntry({
        memberId: selectedMember.id,
        text: gratitudeText.trim(),
        date: new Date().toISOString()
      });
      
      setShowSuccess(true);
      
      // Reset form and hide success after 3 seconds
      setTimeout(() => {
        setGratitudeText('');
        setShowAddForm(false);
        setSelectedMember(null);
        setShowSuccess(false);
      }, 3000);
    }
  };

  const startSlideshow = () => {
    if (thisWeekEntries.length > 0) {
      setSlideshowMode(true);
      setCurrentSlideIndex(0);
      setIsPlaying(true);
    }
  };

  const exitSlideshow = () => {
    setSlideshowMode(false);
    setIsPlaying(false);
    setCurrentSlideIndex(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => 
      prev < thisWeekEntries.length - 1 ? prev + 1 : 0
    );
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => 
      prev > 0 ? prev - 1 : thisWeekEntries.length - 1
    );
  };

  // Auto-advance slideshow
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && slideshowMode) {
      interval = setInterval(nextSlide, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slideshowMode, currentSlideIndex]);

  // Confetti celebration screen
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Confetti animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
                fontSize: `${20 + Math.random() * 20}px`,
              }}
            >
              {['🌟', '✨', '🎉', '💫', '🌸', '🎊', '💝', '🦋'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
        
        <div className="text-center z-10">
          <div className="text-8xl mb-6">🙏</div>
          <h2 className="text-3xl mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Gratitude Saved!
          </h2>
          <p className="text-gray-600 text-xl">Thank you for sharing what you're grateful for</p>
        </div>
      </div>
    );
  }

  if (slideshowMode) {
    const currentEntry = thisWeekEntries[currentSlideIndex];
    const member = familyMembers.find(m => m.id === currentEntry?.memberId);

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex flex-col relative">
        {/* Exit Button */}
        <button
          onClick={exitSlideshow}
          className="absolute top-6 right-6 z-10 bg-white/80 backdrop-blur-sm rounded-full p-3 hover:bg-white/90 transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex-1 flex items-center justify-center px-6">
          {currentEntry ? (
            <Card className="w-full max-w-md p-10 text-center bg-white/80 backdrop-blur-sm">
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: member?.color || '#F3F4F6' }}
              >
                <FamilyMemberIcon avatar={member?.avatar || 'mother'} className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-6 text-gray-600">
                {member?.name} is grateful for...
              </h3>
              <p className="text-2xl mb-8">{currentEntry.text}</p>
              <div className="text-lg text-gray-400">
                {new Date(currentEntry.date).toLocaleDateString()}
              </div>
            </Card>
          ) : (
            <div className="text-center">
              <div className="text-8xl mb-6">✨</div>
              <p className="text-2xl text-gray-600">No gratitude entries this week</p>
            </div>
          )}
        </div>

        <div className="p-8 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-6">
            <Button
              onClick={prevSlide}
              variant="outline"
              size="lg"
              disabled={thisWeekEntries.length === 0}
              className="p-4"
            >
              <SkipBack className="w-6 h-6" />
            </Button>
            
            <Button
              onClick={togglePlayPause}
              variant="outline"
              size="lg"
              disabled={thisWeekEntries.length === 0}
              className="p-4"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            
            <Button
              onClick={nextSlide}
              variant="outline"
              size="lg"
              disabled={thisWeekEntries.length === 0}
              className="p-4"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <span className="text-lg text-gray-500">
              {thisWeekEntries.length > 0 ? `${currentSlideIndex + 1} of ${thisWeekEntries.length}` : '0 of 0'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 pb-28">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Gratitude Flipbook
          </h1>
          <p className="text-gray-600 text-xl">Capture daily moments of gratitude</p>
        </div>

        {!showAddForm && (
          <>
            <div className="flex space-x-4 mb-10">
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-xl py-4 h-auto"
              >
                <Plus className="w-6 h-6 mr-3" />
                Add Gratitude
              </Button>
              
              <Button
                onClick={startSlideshow}
                variant="outline"
                className="flex-1 text-xl py-4 h-auto"
                disabled={thisWeekEntries.length === 0}
              >
                <Play className="w-6 h-6 mr-3" />
                Play Week
              </Button>
            </div>

            <div className="mb-10">
              <h3 className="text-2xl mb-6">This Week's Gratitude</h3>
              {thisWeekEntries.length === 0 ? (
                <Card className="p-8 text-center text-gray-500">
                  <div className="text-6xl mb-4">🌟</div>
                  <p className="text-xl">No gratitude entries yet this week</p>
                  <p className="text-lg mt-2">Start by adding something you're grateful for!</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {thisWeekEntries.slice(-5).map(entry => {
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
                            <div className="text-lg mb-2">{entry.text}</div>
                            <div className="text-sm text-gray-400">
                              {member?.name} • {new Date(entry.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {showAddForm && (
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedMember(null);
                  setGratitudeText('');
                }}
                className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
              >
                ← Back
              </button>
              <h3 className="text-2xl">Add Gratitude</h3>
            </div>

            {!selectedMember ? (
              <div className="mb-8">
                <h4 className="text-xl mb-6">Who's adding gratitude?</h4>
                <div className="grid grid-cols-2 gap-4">
                  {familyMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className="p-6 rounded-3xl border-3 border-yellow-200 hover:border-yellow-400 transition-colors min-h-[120px] flex flex-col items-center justify-center"
                      style={{ backgroundColor: member.color }}
                    >
                      <FamilyMemberIcon avatar={member.avatar} className="w-12 h-12 mb-3" />
                      <div className="text-lg font-medium">{member.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
                  >
                    ←
                  </button>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: selectedMember.color }}
                  >
                    <FamilyMemberIcon avatar={selectedMember.avatar} className="w-4 h-4" />
                  </div>
                  <span className="text-2xl">{selectedMember.name}</span>
                </div>
                
                <div className="mb-8">
                  <label className="block text-lg text-gray-600 mb-3">
                    What are you grateful for today?
                  </label>
                  <Textarea
                    value={gratitudeText}
                    onChange={(e) => setGratitudeText(e.target.value)}
                    placeholder="I'm grateful for..."
                    className="w-full text-lg p-4"
                    rows={5}
                  />
                </div>

                <Button
                  onClick={handleAddGratitude}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-xl py-4 h-auto"
                  disabled={!gratitudeText.trim()}
                >
                  Save Gratitude
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}