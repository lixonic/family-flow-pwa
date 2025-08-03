import { useState } from 'react';

interface ReadinessQuestion {
  id: string;
  question: string;
  options: string[];
  weight: number;
}

interface ReadinessAssessmentProps {
  onComplete: (score: number, recommendations: string[]) => void;
  onCancel: () => void;
}

export function ReadinessAssessment({ onComplete, onCancel }: ReadinessAssessmentProps) {
  const [currentReflection, setCurrentReflection] = useState(0);
  const [reflectionResponses, setReflectionResponses] = useState<string[]>([]);
  const [showConclusion, setShowConclusion] = useState(false);

  const reflectionPrompts = [
    {
      title: "Notice Your Natural Rhythm",
      prompt: "When your family connects best, what does that look like? Maybe it's during car rides, at dinner, or before bedtime. There's no right answer—just your family's unique style.",
      question: "What moments of connection feel most natural for your family?"
    },
    {
      title: "Trust What You've Learned",
      prompt: "You've been practicing connection together. Think about what you've discovered about each other, the rhythms that work, the conversations that flow naturally.",
      question: "What has your family learned about connecting with each other?"
    },
    {
      title: "Your Family's Connection Language",
      prompt: "Every family has their own way of showing care—through words, actions, time together, or quiet presence. Your way is exactly right for you.",
      question: "How does your family naturally show care for each other?"
    },
    {
      title: "Independence Feels Right",
      prompt: "Connection doesn't need an app to happen. When you feel ready to trust your own family wisdom, that's exactly when you are ready. Only you know when that is.",
      question: "What tells you that your family is ready to connect independently?"
    }
  ];

  const handleReflection = (response: string) => {
    const newResponses = [...reflectionResponses, response];
    setReflectionResponses(newResponses);

    if (currentReflection < reflectionPrompts.length - 1) {
      setCurrentReflection(currentReflection + 1);
    } else {
      showReflectionConclusion();
    }
  };

  const showReflectionConclusion = () => {
    setShowConclusion(true);
    
    setTimeout(() => {
      // No scoring - families trust their own readiness
      onComplete(100, ["You know your family best. Trust what feels right."]);
    }, 4000);
  };

  const getOfflineInspiration = (): string[] => {
    return [
      "🌅 Try morning check-ins over breakfast",
      "🚗 Use car rides for connection conversations",
      "📝 Keep a family gratitude jar",
      "🍽️ Create device-free dinner rituals",
      "🌙 End days with appreciation sharing",
      "🎯 Trust the connection patterns you've discovered"
    ];
  };

  if (showConclusion) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="mx-4 max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mb-6">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl font-bold text-gray-900 font-title mb-2">
              You Know Your Family Best
            </h2>
            <div className="inline-block px-4 py-2 rounded-full bg-purple-100">
              <span className="font-semibold text-purple-600">
                Trust What Feels Right
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              These reflections are yours to keep. Connection doesn't need an app to validate it—you've learned what works for your family.
            </p>
          </div>

          <div className="animate-pulse text-2xl mb-4">✨</div>
          <p className="text-gray-600">Gathering some gentle inspiration for your journey...</p>
        </div>
      </div>
    );
  }

  const prompt = reflectionPrompts[currentReflection];
  const progress = ((currentReflection + 1) / reflectionPrompts.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Family Connection Reflection</h2>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-white/90 mb-2">Trust what your family has learned together</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-white/80 mt-1">
            Reflection {currentReflection + 1} of {reflectionPrompts.length}
          </div>
        </div>

        {/* Reflection */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {prompt.title}
          </h3>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            {prompt.prompt}
          </p>

          <h4 className="text-lg font-medium text-gray-800 mb-4">
            {prompt.question}
          </h4>

          <div className="space-y-3">
            <button
              onClick={() => handleReflection('positive')}
              className="w-full p-4 text-left rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:border-green-300 hover:bg-green-50 active:scale-98"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">💚</span>
                <span className="text-gray-800">
                  Yes, this resonates with our family
                </span>
              </div>
            </button>
            
            <button
              onClick={() => handleReflection('growing')}
              className="w-full p-4 text-left rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:border-yellow-300 hover:bg-yellow-50 active:scale-98"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">🌱</span>
                <span className="text-gray-800">
                  We're still discovering this together
                </span>
              </div>
            </button>
            
            <button
              onClick={() => handleReflection('different')}
              className="w-full p-4 text-left rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 active:scale-98"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">🌈</span>
                <span className="text-gray-800">
                  Our family connection looks different
                </span>
              </div>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              All responses are valid. Your family's way is the right way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}