import { GraduationMilestone } from '../App';

interface GraduationProgressProps {
  totalCheckIns: number;
  targetDays: number;
  progressPercentage: number;
  nextMilestone?: GraduationMilestone;
  achievedMilestones: GraduationMilestone[];
  readyForGraduation: boolean;
  onStartAssessment?: () => void;
}

export function GraduationProgress({
  totalCheckIns,
  targetDays,
  progressPercentage,
  nextMilestone,
  achievedMilestones: _achievedMilestones,
  readyForGraduation,
  onStartAssessment
}: GraduationProgressProps) {
  const milestonePoints = [15, 30, 45];

  const getMilestoneStatus = (threshold: number) => {
    if (totalCheckIns >= threshold) return 'completed';
    if (nextMilestone && threshold === nextMilestone.threshold) return 'next';
    return 'pending';
  };

  const getMilestoneIcon = (threshold: number) => {
    const status = getMilestoneStatus(threshold);
    switch (threshold) {
      case 15:
        return status === 'completed' ? '🌱' : status === 'next' ? '🌿' : '🌰';
      case 30:
        return status === 'completed' ? '🚀' : status === 'next' ? '✈️' : '🛫';
      case 45:
        return status === 'completed' ? '🎓' : status === 'next' ? '👨‍🎓' : '📚';
      default:
        return '⭐';
    }
  };

  const getMilestoneColor = (threshold: number) => {
    const status = getMilestoneStatus(threshold);
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'next': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-400 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 font-title mb-2">
          Graduation Journey
        </h3>
        <p className="text-gray-600 text-sm">
          Building habits that last beyond the app
        </p>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress to Graduation
          </span>
          <span className="text-sm font-bold text-gray-900">
            {totalCheckIns} / {targetDays} days
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              readyForGraduation 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'bg-gradient-to-r from-orange-400 to-red-500'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="text-center">
          <span className={`text-sm font-semibold ${
            readyForGraduation ? 'text-purple-600' : 'text-orange-600'
          }`}>
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Milestones</h4>
        
        <div className="space-y-3">
          {milestonePoints.map((threshold) => {
            const status = getMilestoneStatus(threshold);
            const isNext = status === 'next';
            const isCompleted = status === 'completed';
            
            return (
              <div 
                key={threshold}
                className={`flex items-center p-3 rounded-2xl border-2 transition-all duration-300 ${
                  isNext 
                    ? 'border-blue-200 bg-blue-50' 
                    : isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getMilestoneColor(threshold)}`}>
                  {getMilestoneIcon(threshold)}
                </div>
                
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      isCompleted ? 'text-green-800' : isNext ? 'text-blue-800' : 'text-gray-600'
                    }`}>
                      {threshold} Days
                    </span>
                    
                    {isCompleted && (
                      <span className="text-xs text-green-600 font-semibold">✓ ACHIEVED</span>
                    )}
                    {isNext && (
                      <span className="text-xs text-blue-600 font-semibold">
                        {threshold - totalCheckIns} to go
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-1">
                    {threshold === 15 && "Building the habit"}
                    {threshold === 30 && "Training wheels off"}
                    {threshold === 45 && "Ready to graduate"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div className="text-center">
        {readyForGraduation ? (
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
              <p className="text-purple-800 font-semibold text-sm mb-2">
                🎓 Congratulations! You're ready to graduate!
              </p>
              <p className="text-purple-700 text-xs">
                Take the readiness assessment to get your personalized transition plan.
              </p>
            </div>
            
            {onStartAssessment && (
              <button
                onClick={onStartAssessment}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                Start Readiness Assessment
              </button>
            )}
          </div>
        ) : nextMilestone ? (
          <div className="p-4 bg-blue-50 rounded-2xl">
            <p className="text-blue-800 font-semibold text-sm mb-1">
              Next: {nextMilestone.title.split(' - ')[1] || nextMilestone.title}
            </p>
            <p className="text-blue-700 text-xs">
              {nextMilestone.threshold - totalCheckIns} more check-ins to reach this milestone
            </p>
          </div>
        ) : (
          <div className="p-4 bg-orange-50 rounded-2xl">
            <p className="text-orange-800 font-semibold text-sm mb-1">
              Keep Going!
            </p>
            <p className="text-orange-700 text-xs">
              You're building something beautiful. Every check-in matters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}