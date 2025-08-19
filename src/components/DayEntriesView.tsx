import { FamilyMember, MoodEntry, ReflectionEntry, GratitudeEntry } from '../App';
import { Card } from './ui/card';
import { FamilyMemberIcon } from './FamilyMemberIcon';
import { InitialAvatar } from './ui/InitialAvatar';
import { formatDate, formatDateWithWeekday } from './ui/utils';
import { Trash2, ArrowLeft, Calendar, MessageSquare, Heart, Clock } from 'lucide-react';

interface DayEntriesViewProps {
  selectedDate: Date;
  familyMembers: FamilyMember[];
  moodEntries: MoodEntry[];
  reflectionEntries: ReflectionEntry[];
  gratitudeEntries: GratitudeEntry[];
  onDeleteMoodEntry: (id: string) => void;
  onDeleteReflectionEntry: (id: string) => void;
  onDeleteGratitudeEntry: (id: string) => void;
  onNavigateBack: () => void;
}

export function DayEntriesView({
  selectedDate,
  familyMembers,
  moodEntries,
  reflectionEntries,
  gratitudeEntries,
  onDeleteMoodEntry,
  onDeleteReflectionEntry,
  onDeleteGratitudeEntry,
  onNavigateBack
}: DayEntriesViewProps) {
  const dateString = selectedDate.toDateString();
  
  // Filter entries for the selected date
  const dayMoodEntries = moodEntries.filter(entry => 
    new Date(entry.date).toDateString() === dateString
  );
  const dayReflectionEntries = reflectionEntries.filter(entry => 
    new Date(entry.date).toDateString() === dateString
  );
  const dayGratitudeEntries = gratitudeEntries.filter(entry => 
    new Date(entry.date).toDateString() === dateString
  );


  // Check if it's today
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  
  // Calculate total entries
  const totalEntries = dayMoodEntries.length + dayReflectionEntries.length + dayGratitudeEntries.length;

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleDeleteWithConfirm = (type: 'mood' | 'reflection' | 'gratitude', id: string, memberName: string) => {
    const typeMap = {
      mood: 'mood entry',
      reflection: 'daily reflection',
      gratitude: 'gratitude entry'
    };
    
    if (confirm(`Are you sure you want to delete this ${typeMap[type]} from ${memberName}?`)) {
      switch (type) {
        case 'mood':
          onDeleteMoodEntry(id);
          break;
        case 'reflection':
          onDeleteReflectionEntry(id);
          break;
        case 'gratitude':
          onDeleteGratitudeEntry(id);
          break;
      }
    }
  };

  return (
    <div className="min-h-screen safe-area-content">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onNavigateBack}
            className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              {isToday ? 'Today' : formatDateWithWeekday(selectedDate)}
            </h1>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(selectedDate)}
              <span className="mx-2">•</span>
              {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'}
            </div>
          </div>
        </div>

        {/* No entries state */}
        {totalEntries === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl text-gray-600 mb-2">No entries yet</h3>
            <p className="text-gray-500">
              {isToday 
                ? 'Start your day by checking in with your family!' 
                : 'Your family didn\'t log any activities on this day.'
              }
            </p>
          </div>
        )}

        {/* Entries by family member */}
        {familyMembers.map(member => {
          const memberMoodEntries = dayMoodEntries.filter(entry => entry.memberId === member.id);
          const memberReflectionEntries = dayReflectionEntries.filter(entry => entry.memberId === member.id);
          const memberGratitudeEntries = dayGratitudeEntries.filter(entry => entry.memberId === member.id);
          
          const memberTotalEntries = memberMoodEntries.length + memberReflectionEntries.length + memberGratitudeEntries.length;
          
          if (memberTotalEntries === 0) return null;

          return (
            <div key={member.id} className="mb-8">
              {/* Member header */}
              <div className="flex items-center mb-4">
                {member.avatarColor ? (
                  <div className="mr-3">
                    <InitialAvatar name={member.name} backgroundColor={member.avatarColor} size="md" />
                  </div>
                ) : (
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: member.color }}
                  >
                    <FamilyMemberIcon avatar={member.avatar} name={member.name} avatarColor={member.avatarColor} className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium">{member.name}</h3>
                  <p className="text-sm text-gray-500">
                    {memberTotalEntries} {memberTotalEntries === 1 ? 'entry' : 'entries'}
                  </p>
                </div>
              </div>

              {/* Mood entries */}
              {memberMoodEntries.map(entry => (
                <Card key={entry.id} className="mb-3 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="text-2xl mr-3">{entry.emoji}</div>
                        <div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Heart className="w-3 h-3 mr-1" />
                            Mood Check-in
                            <span className="mx-2">•</span>
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(entry.date)}
                          </div>
                        </div>
                      </div>
                      {entry.note && (
                        <p className="text-gray-700 mt-2 pl-11">{entry.note}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteWithConfirm('mood', entry.id, member.name)}
                      className="text-red-500 hover:text-red-700 p-2 ml-2"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}

              {/* Reflection entries */}
              {memberReflectionEntries.map(entry => (
                <Card key={entry.id} className="mb-3 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="text-2xl mr-3">📱</div>
                        <div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Daily Reflection
                            <span className="mx-2">•</span>
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(entry.date)}
                          </div>
                        </div>
                      </div>
                      <div className="pl-11">
                        <p className="text-sm text-gray-600 mb-1 font-medium">{entry.prompt}</p>
                        <p className="text-gray-700">{entry.response}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteWithConfirm('reflection', entry.id, member.name)}
                      className="text-red-500 hover:text-red-700 p-2 ml-2"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}

              {/* Gratitude entries */}
              {memberGratitudeEntries.map(entry => (
                <Card key={entry.id} className="mb-3 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="text-2xl mr-3">🙏</div>
                        <div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Heart className="w-3 h-3 mr-1" />
                            Gratitude Entry
                            <span className="mx-2">•</span>
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(entry.date)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 pl-11">{entry.text}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteWithConfirm('gratitude', entry.id, member.name)}
                      className="text-red-500 hover:text-red-700 p-2 ml-2"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          );
        })}

        {/* Summary if there are entries */}
        {totalEntries > 0 && (
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200">
            <div className="text-center">
              <div className="text-2xl mb-2">✨</div>
              <p className="text-gray-600">
                {isToday 
                  ? `Your family has shared ${totalEntries} ${totalEntries === 1 ? 'moment' : 'moments'} today!`
                  : `Your family shared ${totalEntries} ${totalEntries === 1 ? 'moment' : 'moments'} on this day.`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}