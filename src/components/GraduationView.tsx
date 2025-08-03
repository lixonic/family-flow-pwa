import { Button } from './ui/button';
import { GraduationProgress } from './GraduationProgress';
import { ArrowLeft, HelpCircle, BookOpen } from 'lucide-react';

interface GraduationViewProps {
  graduationProgress: {
    totalCheckIns: number;
    targetDays: number;
    progressPercentage: number;
    nextMilestone?: {days: number, title: string};
    readyForGraduation: boolean;
    nearGraduation: boolean;
    achievedMilestones: {days: number, title: string}[];
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

        {/* Vision Context */}
        <div className="text-center mb-8 px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Your Family's Connection Journey</h1>
          <p className="text-gray-600 leading-relaxed">
            Every family finds their own rhythm for connection. This isn't about perfect consistency or hitting targets—it's about discovering what authentic family time looks like for you.
          </p>
        </div>

        {/* No progress guidance */}
        {totalCheckIns === 0 && (
          <div className="text-center mb-8">
            <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-medium mb-3 text-gray-800">Your family connection starts here!</h3>
              <p className="text-gray-600 mb-4">
                Begin your 2-minute daily family connection ritual. There's no pressure to be perfect—just authentic moments together.
              </p>
              <p className="text-sm text-gray-500">
                Share how you're feeling, reflect together, and discover what connection means for your unique family.
              </p>
            </div>
            <button
              onClick={() => onNavigate('day-glow')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-medium text-lg"
            >
              Begin Your Family Connection
            </button>
          </div>
        )}

        {/* Main Progress Section - only show when there's progress */}
        {totalCheckIns > 0 && (
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



        {/* Gentle Wisdom */}
        {readyForGraduation && (
          <div className="mt-6">
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="text-center">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Trust Your Family Wisdom
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your family has learned what connection looks like for you. When it feels right to trust your own rhythm and create your own rituals, that's exactly when you're ready.
                </p>
                <p className="text-sm text-gray-600 italic">
                  There's no test to pass, no score to achieve. You already know.
                </p>
              </div>
            </div>
          </div>
        )}
          </div>
        )}

        {/* Help button for confused users - always at bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <Button
              onClick={() => onNavigate('guide')}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white max-[999px]:text-base max-[999px]:py-3 max-[999px]:px-6 text-lg py-4 px-8 h-auto shadow-lg"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              Learn more about this app
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}