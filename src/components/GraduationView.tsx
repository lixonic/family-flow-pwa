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
          <h1 className="text-2xl font-bold text-gray-800 mb-3">From guided prompts to family wisdom</h1>
          <p className="text-gray-600 leading-relaxed">
            Watch your family discover your unique connection style. Every family's path to healthy technology use looks different, and that's exactly how it should be.
          </p>
        </div>

        {/* No progress guidance */}
        {totalCheckIns === 0 && (
          <div className="text-center mb-8">
            <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-medium mb-3 text-gray-800">Your family journey starts now!</h3>
              <p className="text-gray-600 mb-4">
                Begin your 2-minute daily family connection ritual to track progress toward confidence in your family's unique connection style.
              </p>
              <p className="text-sm text-gray-500">
                Complete daily check-ins to see your family's graduation progress and celebrate milestones together.
              </p>
            </div>
            <button
              onClick={() => onNavigate('day-glow')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-medium text-lg"
            >
              Start Your Family Journey
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



        {/* Action Button */}
        {readyForGraduation && (
          <div className="mt-6">
            <Button
              onClick={onStartReadinessAssessment}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 max-[999px]:text-base max-[999px]:py-3 text-lg py-4 h-auto"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Start Readiness Assessment
            </Button>
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