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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions: ReadinessQuestion[] = [
    {
      id: 'consistency',
      question: 'How consistent has your family been with daily check-ins?',
      options: [
        'We rarely miss a day (4 points)',
        'We check in most days (3 points)',
        'We check in a few times a week (2 points)',
        'We check in occasionally (1 point)'
      ],
      weight: 2
    },
    {
      id: 'engagement',
      question: 'How engaged is everyone during family check-ins?',
      options: [
        'Everyone actively participates and shares openly (4 points)',
        'Most family members engage well (3 points)',
        'Some members are more engaged than others (2 points)',
        'Engagement varies significantly (1 point)'
      ],
      weight: 2
    },
    {
      id: 'natural_flow',
      question: 'Do your check-ins feel natural and comfortable?',
      options: [
        'Yes, they feel like a natural part of our routine (4 points)',
        'Mostly, with occasional awkward moments (3 points)',
        'Sometimes natural, sometimes forced (2 points)',
        'They still feel somewhat artificial (1 point)'
      ],
      weight: 1
    },
    {
      id: 'offline_attempts',
      question: 'Have you tried connecting without the app?',
      options: [
        'Yes, and it went really well (4 points)',
        'Yes, with mixed results (3 points)',
        'We tried once or twice (2 points)',
        'We haven\'t tried yet (1 point)'
      ],
      weight: 1
    },
    {
      id: 'motivation',
      question: 'What motivates your family to continue check-ins?',
      options: [
        'We genuinely enjoy the connection time (4 points)',
        'It feels good to stay connected (3 points)',
        'We want to maintain the habit (2 points)',
        'The app reminders keep us going (1 point)'
      ],
      weight: 2
    }
  ];

  const handleAnswer = (points: number) => {
    const question = questions[currentQuestion];
    setAnswers({ ...answers, [question.id]: points * question.weight });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.reduce((sum, q) => sum + (4 * q.weight), 0);
    const percentage = (totalScore / maxScore) * 100;

    const recommendations = getRecommendations(percentage, answers);
    setShowResults(true);
    
    setTimeout(() => {
      onComplete(percentage, recommendations);
    }, 3000);
  };

  const getRecommendations = (score: number, answers: Record<string, number>): string[] => {
    const recommendations = [];

    if (score >= 80) {
      recommendations.push("🎉 Your family is ready for graduation!");
      recommendations.push("🗣️ Try weekly offline check-ins");
      recommendations.push("📝 Keep a family connection journal");
      recommendations.push("🎯 Set monthly family goals together");
    } else if (score >= 60) {
      recommendations.push("🌱 You're on the right track!");
      recommendations.push("💪 Focus on consistency for another 1-2 weeks");
      recommendations.push("🗣️ Practice occasional offline check-ins");
      recommendations.push("🎯 Work on engaging all family members");
    } else {
      recommendations.push("⏰ Take more time to build habits");
      recommendations.push("💡 Try different check-in times or formats");
      recommendations.push("🎮 Make check-ins more fun and engaging");
      recommendations.push("📚 Review the Family Flow guide for tips");
    }

    // Specific recommendations based on weak areas
    if (answers.consistency < 6) {
      recommendations.push("⏰ Set consistent daily reminder times");
    }
    if (answers.engagement < 6) {
      recommendations.push("🎲 Try new conversation starters");
    }
    if (answers.offline_attempts < 4) {
      recommendations.push("🗣️ Practice one offline check-in this week");
    }

    return recommendations.slice(0, 6);
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return { level: 'Ready to Graduate!', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { level: 'Almost Ready', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Keep Building', color: 'text-orange-600', bg: 'bg-orange-100' };
  };

  if (showResults) {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.reduce((sum, q) => sum + (4 * q.weight), 0);
    const percentage = (totalScore / maxScore) * 100;
    const readiness = getReadinessLevel(percentage);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="mx-4 max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mb-6">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 font-title mb-2">
              Assessment Complete!
            </h2>
            <div className={`inline-block px-4 py-2 rounded-full ${readiness.bg}`}>
              <span className={`font-semibold ${readiness.color}`}>
                {readiness.level}
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {Math.round(percentage)}%
            </div>
            <p className="text-gray-600">Family Readiness Score</p>
          </div>

          <div className="animate-spin text-2xl mb-4">⏳</div>
          <p className="text-gray-600">Generating your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Family Readiness Assessment</h2>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-white/80 mt-1">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const points = 4 - index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(points)}
                  className="w-full p-4 text-left rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 active:scale-98"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">
                      {option.replace(/ \(\d+ points?\)/, '')}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {points} pt{points !== 1 ? 's' : ''}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              This assessment helps determine if your family is ready to graduate to more independent connection practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}