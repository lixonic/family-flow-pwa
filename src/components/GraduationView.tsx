import { Card } from './ui/card';
import { Button } from './ui/button';
import { GraduationProgress } from './GraduationProgress';
import { ArrowLeft, HelpCircle, Target, Award, BookOpen } from 'lucide-react';

interface GraduationViewProps {
  graduationProgress: {
    totalCheckIns: number;
    targetDays: number;
    progressPercentage: number;
    nextMilestone?: any;
    readyForGraduation: boolean;
    nearGraduation: boolean;
    achievedMilestones: any[];
  };
  onStartReadinessAssessment: () => void;
  onNavigate: (screen: string) => void;
}

export function GraduationView({ 
  graduationProgress, 
  onStartReadinessAssessment, 
  onNavigate 
}: GraduationViewProps) {
  const { 
    totalCheckIns, 
    targetDays, 
    progressPercentage, 
    nextMilestone, 
    readyForGraduation, 
    nearGraduation,
    achievedMilestones 
  } = graduationProgress;

  const daysRemaining = Math.max(0, targetDays - totalCheckIns);

  return (
    <div className="min-h-screen safe-area-content">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => onNavigate('day-glow')}
            className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>


        {/* Main Progress Section */}
        <div className="mb-6">
          <div className="text-center mb-6">
            {(readyForGraduation || nearGraduation) && (
              <>
                <div className="text-6xl mb-4">
                  {readyForGraduation ? '🎓' : '🚀'}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {readyForGraduation ? 'Ready to Graduate!' : 'Almost There!'}
                </h2>
                <p className="text-gray-600 mb-4">
                  {readyForGraduation 
                    ? 'Your family has built lasting connection habits and is ready for independence!'
                    : 'You\'re so close! Keep up the amazing consistency.'}
                </p>
              </>
            )}
            
            {!readyForGraduation && !nearGraduation && (
              <Button
                onClick={() => onNavigate('guide')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-lg py-3 px-6 h-auto shadow-lg"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                New to Family Flow? Start Here
              </Button>
            )}
          </div>

          <GraduationProgress
            totalCheckIns={totalCheckIns}
            targetDays={targetDays}
            progressPercentage={progressPercentage}
            nextMilestone={nextMilestone}
            achievedMilestones={achievedMilestones}
            readyForGraduation={readyForGraduation}
            onStartAssessment={onStartReadinessAssessment}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-purple-600">{totalCheckIns}</div>
            <div className="text-sm text-gray-600">Check-ins Complete</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-orange-600">{daysRemaining}</div>
            <div className="text-sm text-gray-600">Days to Graduation</div>
          </Card>
        </div>

        {/* Milestones Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center mb-4">
            <Award className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold">Milestones Achieved</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { threshold: 15, title: "Building the Habit!", emoji: "🌱" },
              { threshold: 30, title: "Training Wheels Ready!", emoji: "🚀" },
              { threshold: 45, title: "Graduation Time!", emoji: "🎓" }
            ].map(milestone => {
              const isAchieved = totalCheckIns >= milestone.threshold;
              const isCurrent = nextMilestone?.threshold === milestone.threshold;
              
              return (
                <div 
                  key={milestone.threshold}
                  className={`flex items-center p-3 rounded-lg ${
                    isAchieved 
                      ? 'bg-green-50 border border-green-200' 
                      : isCurrent 
                      ? 'bg-orange-50 border border-orange-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="text-2xl mr-3">
                    {isAchieved ? '✅' : milestone.emoji}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isAchieved ? 'text-green-700' : isCurrent ? 'text-orange-700' : 'text-gray-600'
                    }`}>
                      {milestone.threshold} Check-ins: {milestone.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {isAchieved 
                        ? 'Completed! 🎉' 
                        : `${milestone.threshold - totalCheckIns} check-ins to go`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Philosophy Section */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="text-center">
            <div className="text-4xl mb-3">🦋</div>
            <h3 className="text-lg font-semibold mb-3 text-blue-800">The Family Flow Philosophy</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Success isn't measured by how long you use this app, but by how confidently your family 
              graduates to independent connection rituals. We're here to help you build lasting habits, 
              then set you free to flourish on your own.
            </p>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold">What's Next?</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            {readyForGraduation ? (
              <>
                <div className="flex items-start space-x-3">
                  <div className="text-lg">🎯</div>
                  <div>
                    <strong>Take the Readiness Assessment</strong> - Evaluate your family's independence readiness
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-lg">🌟</div>
                  <div>
                    <strong>Plan Your Graduation</strong> - Design offline rituals that work for your family
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-lg">🦋</div>
                  <div>
                    <strong>Celebrate Your Journey</strong> - Acknowledge how far your family has come
                  </div>
                </div>
              </>
            ) : nearGraduation ? (
              <>
                <div className="flex items-start space-x-3">
                  <div className="text-lg">📅</div>
                  <div>
                    <strong>Keep the Consistency</strong> - You're almost at graduation!
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-lg">💭</div>
                  <div>
                    <strong>Start Planning</strong> - Think about offline activities your family enjoys
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start space-x-3">
                  <div className="text-lg">🔄</div>
                  <div>
                    <strong>Daily Check-ins</strong> - Build the habit of family connection
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-lg">🌱</div>
                  <div>
                    <strong>Be Patient</strong> - Lasting habits take time to develop
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Action Button */}
        {readyForGraduation && (
          <div className="mt-6">
            <Button
              onClick={onStartReadinessAssessment}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-4 h-auto"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Start Readiness Assessment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}