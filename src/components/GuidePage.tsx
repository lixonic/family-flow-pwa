import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BookOpen, ArrowRight, Heart, Target, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface GuidePageProps {
  onNavigate?: (screen: string) => void;
}

export function GuidePage({ onNavigate }: GuidePageProps) {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  return (
    <div className="min-h-screen safe-area-content relative">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-title text-2xl sm:text-4xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Family Flow Guide
          </h1>
          <p className="text-gray-600 text-xl">Understanding and using this app effectively</p>
        </div>

        {/* Who is this app intended for section */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
          <div className="text-center mb-6">
             
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Who is Family Flow for?</h2>
            <p className="text-gray-600 text-lg">This app works best for specific family situations</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
            
              <div>
                <h4 className="font-semibold mb-1 text-green-700">Perfect for families with:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Parents concerned about screen time balance</li>
                  <li>• Families wanting deeper daily connections</li>
                  <li>• Households struggling with digital wellness</li>
                  <li>• Parents seeking structured family rituals</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
             
              <div>
                <h4 className="font-semibold mb-1 text-red-700">Not ideal for:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Parents looking for screen time controls/blocking</li>
                  <li>• Families preferring spontaneous interactions only</li>
                  <li>• Those uncomfortable with structured activities</li>
                  <li>• Families with severe communication issues</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Key insight:</strong> Family Flow is designed as temporary scaffolding. The goal is to help your family build independent connection habits, then "graduate" from needing the app.
            </p>
          </div>
        </Card>

        {/* Graduation Guide Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Your Graduation Roadmap</h2>
          <p className="text-gray-600">How to move from digital prompts to natural family connection</p>
        </div>

        <div className="space-y-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl mb-2">Step 1: Connect</h3>
                <p className="text-gray-600">Start with daily mood sharing and reflection</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl mb-2">Step 2: Practice</h3>
                <p className="text-gray-600">Build mindfulness and gratitude habits</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl mb-2">Step 3: Graduate</h3>
                <p className="text-gray-600">Transition to independent family rituals</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4 mb-8">
          <Button
            onClick={() => onNavigate?.('day-glow')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 max-[999px]:text-lg max-[999px]:py-3 text-xl py-4 h-auto"
          >
            Start Your Journey
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>

        <div className="mb-8 space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <button
              onClick={() => toggleTopic('2-minute-checkins')}
              className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-center flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-blue-800 leading-tight">Why 2-minute check-ins work</h2>
              </div>
              {expandedTopics.has('2-minute-checkins') ? (
                <ChevronUp className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              )}
            </button>
            
            {expandedTopics.has('2-minute-checkins') && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-6 text-gray-700">
                <p className="text-lg leading-relaxed">
                  <strong>Short, frequent connections beat long meetings.</strong> Why 2-minute check-ins work better:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <h4 className="font-semibold mb-1">Low Resistance</h4>
                      <p>2 minutes feels effortless. No one resists or postpones it.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h4 className="font-semibold mb-1">Present Moment Focus</h4>
                      <p>Captures today's feelings while they're fresh and authentic.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🔄</div>
                    <div>
                      <h4 className="font-semibold mb-1">Daily Rhythm</h4>
                      <p>Creates a sustainable habit that becomes part of your family culture.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">💫</div>
                    <div>
                      <h4 className="font-semibold mb-1">Everyone Participates</h4>
                      <p>No one dominates the conversation. Each voice matters equally.</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg leading-relaxed bg-blue-100 p-4 rounded-lg">
                  <strong>The goal:</strong> These micro-moments of connection will naturally evolve into deeper family conversations without needing the app as a prompt.
                </p>
              </div>
            )}
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <button
              onClick={() => toggleTopic('graduation-roadmap')}
              className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-center flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-blue-800 leading-tight">Your graduation roadmap</h2>
              </div>
              {expandedTopics.has('graduation-roadmap') ? (
                <ChevronUp className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              )}
            </button>
            
            {expandedTopics.has('graduation-roadmap') && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-6 text-gray-700">
                <p className="text-lg leading-relaxed">
                  <strong>Success means independence from this app.</strong> Your journey from digital prompts to natural family connection:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🏗️</div>
                    <div>
                      <h4 className="font-semibold mb-1">Digital Scaffolding (Weeks 1-4)</h4>
                      <p>Use the app daily to establish rhythm and discover what works.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🌱</div>
                    <div>
                      <h4 className="font-semibold mb-1">Hybrid Connection (Weeks 5-8)</h4>
                      <p>Start conversations without opening the app first.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h4 className="font-semibold mb-1">Independent Rituals (Week 9+)</h4>
                      <p>Family connection happens naturally without digital prompts.</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg leading-relaxed bg-blue-100 p-4 rounded-lg">
                  <strong>Graduation success:</strong> When your family naturally shares feelings, reflects together, and connects daily without needing the app to prompt you—you've graduated to independent family wellness.
                </p>
              </div>
            )}
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <button
              onClick={() => toggleTopic('emotional-intelligence')}
              className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-center flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-blue-800 leading-tight">Building emotional intelligence</h2>
              </div>
              {expandedTopics.has('emotional-intelligence') ? (
                <ChevronUp className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              )}
            </button>
            
            {expandedTopics.has('emotional-intelligence') && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-6 text-gray-700">
                <p className="text-lg leading-relaxed">
                  <strong>Emotional intelligence grows through daily practice.</strong> How small interactions build big skills:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🎭</div>
                    <div>
                      <h4 className="font-semibold mb-1">Naming Feelings</h4>
                      <p>Daily mood check-ins expand vocabulary beyond "good" and "bad."</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🔍</div>
                    <div>
                      <h4 className="font-semibold mb-1">Understanding Triggers</h4>
                      <p>Screen time reflection connects feelings to daily choices.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🧘</div>
                    <div>
                      <h4 className="font-semibold mb-1">Emotional Regulation</h4>
                      <p>Mindfulness and gratitude build resilience and positive focus.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">💝</div>
                    <div>
                      <h4 className="font-semibold mb-1">Natural Support</h4>
                      <p>Emotional check-ins become automatic family habits.</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg leading-relaxed bg-blue-100 p-4 rounded-lg">
                  <strong>The result:</strong> A family that navigates emotions skillfully and creates deeper bonds through understanding rather than avoidance.
                </p>
              </div>
            )}
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <button
              onClick={() => toggleTopic('custom-prompts')}
              className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-center flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-blue-800 leading-tight">Customizing for your family</h2>
              </div>
              {expandedTopics.has('custom-prompts') ? (
                <ChevronUp className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              )}
            </button>
            
            {expandedTopics.has('custom-prompts') && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-6 text-gray-700">
                <p className="text-lg leading-relaxed">
                  <strong>Every family is unique.</strong> Make prompts work for your specific needs:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🎨</div>
                    <div>
                      <h4 className="font-semibold mb-1">Age-Appropriate Language</h4>
                      <p>Adapt questions for different ages in your household.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🏠</div>
                    <div>
                      <h4 className="font-semibold mb-1">Family Values Focus</h4>
                      <p>Create prompts that reinforce what matters most to your family.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <h4 className="font-semibold mb-1">Current Challenges</h4>
                      <p>Focus on current issues like sibling conflicts or screen struggles.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🌟</div>
                    <div>
                      <h4 className="font-semibold mb-1">Celebration Moments</h4>
                      <p>Design gratitude prompts around achievements and family milestones.</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg leading-relaxed bg-blue-100 p-4 rounded-lg">
                  <strong>The goal:</strong> Prompts should feel natural to your family's voice, making conversations flow easier and creating deeper, more authentic connections.
                </p>
              </div>
            )}
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <button
              onClick={() => toggleTopic('graduation-readiness')}
              className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-center flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-blue-800 leading-tight">Recognizing graduation readiness</h2>
              </div>
              {expandedTopics.has('graduation-readiness') ? (
                <ChevronUp className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              )}
            </button>
            
            {expandedTopics.has('graduation-readiness') && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-6 text-gray-700">
                <p className="text-lg leading-relaxed">
                  <strong>Graduation is about independence, not perfection.</strong> Clear signs your family is ready:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🗣️</div>
                    <div>
                      <h4 className="font-semibold mb-1">Spontaneous Check-ins</h4>
                      <p>Family members naturally ask "How are you feeling?" without reminders.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">💭</div>
                    <div>
                      <h4 className="font-semibold mb-1">Self-Generated Questions</h4>
                      <p>Your family creates their own reflection topics based on current needs.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🤝</div>
                    <div>
                      <h4 className="font-semibold mb-1">Automatic Support</h4>
                      <p>When someone struggles, others offer help without being prompted.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🎭</div>
                    <div>
                      <h4 className="font-semibold mb-1">Comfortable with Difficult Emotions</h4>
                      <p>Family welcomes tough conversations as connection opportunities.</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg leading-relaxed bg-blue-100 p-4 rounded-lg">
                  <strong>Congratulations:</strong> When these behaviors happen naturally for 2+ weeks, you've successfully graduated to independent family emotional wellness. The app becomes an optional tool, not a necessity.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Common Questions Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Common Questions</h3>
          
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <button
              onClick={() => toggleTopic('graduation-philosophy')}
              className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-center flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-blue-800 leading-tight">What is Family Flow's graduation philosophy?</h2>
              </div>
              {expandedTopics.has('graduation-philosophy') ? (
                <ChevronUp className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              )}
            </button>
            
            {expandedTopics.has('graduation-philosophy') && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 text-gray-700">
                <p className="text-base leading-relaxed">
                  <strong>Success means you won't need us forever.</strong> Family Flow is designed as a "graduation platform" - our success isn't measured by how long you use the app, but by how confidently your family graduates to independent connection rituals.
                </p>
                <p className="text-base leading-relaxed">
                  We're here to build lasting habits, then set you free to flourish on your own. From digital prompts to real conversations - that's true success.
                </p>
              </div>
            )}
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 mt-4">
            <button
              onClick={() => toggleTopic('privacy-first')}
              className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-center flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-blue-800 leading-tight">Is my family's data really private?</h2>
              </div>
              {expandedTopics.has('privacy-first') ? (
                <ChevronUp className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              )}
            </button>
            
            {expandedTopics.has('privacy-first') && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 text-gray-700">
                <p className="text-base leading-relaxed">
                  <strong>Absolutely.</strong> Nothing you enter leaves your device—ever. There are no accounts, no surveillance, no cloud sync, and you can delete everything with one tap.
                </p>
                <p className="text-base leading-relaxed">
                  Even the export features only process data locally in your browser, not sent anywhere. Your family's journey stays with your family.
                </p>
              </div>
            )}
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 mt-4">
            <button
              onClick={() => toggleTopic('not-parental-controls')}
              className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-center flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-blue-800 leading-tight">How is this different from parental control apps?</h2>
              </div>
              {expandedTopics.has('not-parental-controls') ? (
                <ChevronUp className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              )}
            </button>
            
            {expandedTopics.has('not-parental-controls') && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 text-gray-700">
                <p className="text-base leading-relaxed">
                  <strong>Parental controls impose external limits.</strong> Family Flow builds internal awareness. Instead of "You can't," we ask "How did that feel?" and "What do you want to try next?"
                </p>
                <p className="text-base leading-relaxed">
                  We don't restrict screen time or block apps. Instead, we help families reflect on their digital choices and develop awareness together. You decide what works for your family.
                </p>
              </div>
            )}
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 mt-4">
            <button
              onClick={() => toggleTopic('no-ai-philosophy')}
              className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-center flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-blue-800 leading-tight">Why doesn't Family Flow use AI features?</h2>
              </div>
              {expandedTopics.has('no-ai-philosophy') ? (
                <ChevronUp className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
              )}
            </button>
            
            {expandedTopics.has('no-ai-philosophy') && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 text-gray-700">
                <p className="text-base leading-relaxed">
                  <strong>AI creates dependency, not independence.</strong> While other apps use AI for personalized responses or conversation suggestions, Family Flow deliberately avoids this to protect the authenticity of family connections.
                </p>
                <p className="text-base leading-relaxed">
                  <strong>Why we stay human-centered:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Intimacy matters:</strong> AI presence changes the nature of vulnerable family conversations</li>
                  <li><strong>Graduation conflicts:</strong> AI features encourage ongoing app dependency instead of family independence</li>
                  <li><strong>Authentic growth:</strong> Families develop better emotional intelligence by trusting their own insights</li>
                  <li><strong>Privacy protection:</strong> No AI analysis means your intimate family moments stay completely private</li>
                </ul>
                <p className="text-base leading-relaxed">
                  <strong>The result:</strong> Your family learns to connect authentically without digital assistance—preparing you for true graduation from any wellness app.
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Questions or feedback? Contact Helen at{' '}
            <a href="mailto:helenfrancisthonakkara@gmail.com" className="text-blue-600 hover:text-blue-800">
              helenfrancisthonakkara@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}