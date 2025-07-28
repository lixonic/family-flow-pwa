import { useState } from 'react';

interface TransitionPrompt {
  type: 'encourage-consistency' | 'suggest-offline' | 'graduation-ready';
  title: string;
  message: string;
  actionText: string;
}

interface TransitionPromptProps {
  prompt: TransitionPrompt;
  onAction: (action: string) => void;
  onDismiss: () => void;
}

export function TransitionPrompt({ prompt, onAction, onDismiss }: TransitionPromptProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleAction = () => {
    setIsVisible(false);
    setTimeout(() => onAction(prompt.type), 200);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(), 200);
  };

  const getPromptIcon = () => {
    switch (prompt.type) {
      case 'encourage-consistency': return '💪';
      case 'suggest-offline': return '🗣️';
      case 'graduation-ready': return '🎓';
      default: return '💡';
    }
  };

  const getPromptColor = () => {
    switch (prompt.type) {
      case 'encourage-consistency': return 'from-green-500 to-emerald-600';
      case 'suggest-offline': return 'from-blue-500 to-cyan-600';
      case 'graduation-ready': return 'from-purple-500 to-pink-600';
      default: return 'from-orange-500 to-red-600';
    }
  };

  const getOfflineSuggestions = () => {
    return [
      "Try a 5-minute family check-in at dinner",
      "Share daily highlights during car rides",
      "Create a bedtime gratitude sharing ritual",
      "Use morning walks for family connections",
      "Establish device-free conversation time"
    ];
  };

  return (
    <div className={`fixed inset-0 z-40 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`relative mx-4 max-w-lg transform rounded-3xl bg-white shadow-2xl transition-all duration-200 ${isVisible ? 'scale-100' : 'scale-95'}`}>
        
        {/* Header */}
        <div className={`rounded-t-3xl bg-gradient-to-r ${getPromptColor()} px-6 py-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getPromptIcon()}</span>
              <h3 className="text-lg font-bold">{prompt.title}</h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="mb-4 text-gray-700 leading-relaxed">
            {prompt.message}
          </p>

          {/* Offline Suggestions */}
          {prompt.type === 'suggest-offline' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
              <h4 className="font-semibold text-blue-900 mb-2">From digital prompts to real conversations</h4>
              <p className="text-sm text-blue-800 mb-3 italic">Try these offline activities:</p>
              <ul className="space-y-2">
                {getOfflineSuggestions().slice(0, 3).map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-blue-800">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Graduation Ready Info */}
          {prompt.type === 'graduation-ready' && (
            <div className="mb-6 p-4 bg-purple-50 rounded-2xl">
              <h4 className="font-semibold text-purple-900 mb-2">Success means you won't need us forever</h4>
              <p className="text-sm text-purple-800 mb-3 italic">What graduation means:</p>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Your family has built lasting connection habits</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>You're ready for independent offline practices</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>The app becomes training wheels you happily leave behind</span>
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleAction}
              className={`flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r ${getPromptColor()} text-white font-semibold transition-all duration-300 hover:shadow-lg active:scale-95`}
            >
              {prompt.actionText}
            </button>
            
            <button
              onClick={handleDismiss}
              className="px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 active:scale-95"
            >
              Not Yet
            </button>
          </div>

          {/* Small print for settings */}
          <div className="mt-4 text-center">
            <button
              onClick={() => onAction('disable-prompts')}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Don't show transition prompts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}