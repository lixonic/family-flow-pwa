import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Heart, Shield, Users, ChevronDown, ChevronUp } from 'lucide-react';
// import familyImage from 'figma:asset/0bedd3acbca9325a13b7603663c4252390b47985.png';

interface AboutPageProps {
  onNavigate: (screen: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What is Family Flow?",
    answer: "Family Flow is a free, privacy-first collection of gentle digital rituals for families—short (≈2 minutes), calming check-ins that help households reconnect, reflect, and build better screen habits together. No account, no cloud, just simple shared moments—built to work even offline and on shared devices."
  },
  {
    question: "Why is it so simple? Don't habits need more features or gamification?",
    answer: "Simplicity is the core feature. Research and lived feedback show busy families drop complex apps quickly. A gentle, single-focus ritual—emoji mood, quick prompt, one-tap flow—is easy to start and sustain. This protects against both \"feature bloat\" and shame-driven drop-off."
  },
  {
    question: "Won't people just stop using it after a few days?",
    answer: "Our approach is to make Family Flow a gentle kickstart for real, lasting habits. If you stop using the app because you've started meaningful nightly check-ins on your own (verbal or on paper), that's success, not failure! We're designed to \"graduate\" families into better routines, not trap you for engagement stats."
  },
  {
    question: "Where's the incentive—what keeps people coming back?",
    answer: "Instead of prizes or comparison, Family Flow uses calming visual cues (confetti, streak dots), subtle new prompts, and shared progress. The real incentive is the emotional presence and gentle togetherness families experience—proven far stickier than individual competition or external rewards."
  },
  {
    question: "Does this app create social or status divides?",
    answer: "No. Family Flow never gives points, ranks, or privileged rewards. Every \"success\" is communal (\"We're on a streak!\"), not individual, and there's no way to compare or shame. Any richer/poorer/louder/quieter household can adopt the tool equally."
  },
  {
    question: "Is my data really private?",
    answer: "Absolutely. Nothing you enter leaves your device—ever. There are no accounts, no surveillance, no cloud sync in the core app, and you can delete everything with one tap. Even the premium/export features only process data locally (in the browser, not sent anywhere)."
  },
  {
    question: "Why not use existing, more powerful apps?",
    answer: "Apps like Moshi, Headspace, or built-in Screen Time often require accounts, sync to the cloud, or focus on monitoring and analytics—which can feel invasive, especially to privacy-sensitive households. Family Flow is the only app intentionally built to require no personal data or tracking, making honest participation easier for everyone."
  },
  {
    question: "What if kids fill in entries for parents (or vice versa)? Isn't that a problem?",
    answer: "We see this as a positive! Kid-for-parent entries spark curiosity, dialogue, and empathy (\"Why did you pick tired for me?\"). Mistakes or jokes are expected—use the one-tap edit tool to update any entry, no stress or blame."
  },
  {
    question: "Does it work for families who share a single device?",
    answer: "Yes—Family Flow is especially designed for multi-user, multi-gen, single-device homes (common in India and elsewhere). Avatars, simple pass-and-tap design, and communal logs make it natural to hand off the phone/tablet each night."
  },
  {
    question: "Can teens or privacy-sensitive members \"hide\" their logs?",
    answer: "Family Flow offers optional \"filter my view\" toggles, so families can, if desired, see only their own reflection streak. But by default, everything is open—just like a shared diary at the kitchen table. No forced passwords or pinwalls."
  },
  {
    question: "Is this just \"screen time policing\" by another name?",
    answer: "Not at all. The main ritual is about feeling and presence (\"How was your day?\")—not usage monitoring or punishment. Screen-reflection and digital wellness prompts are optional, gentle, and never punitive or tracked."
  },
  {
    question: "Do you address social media toxicity or digital wellness more broadly?",
    answer: "Yes. Weekly \"Check-the-Source\" reflection cards ask simple, open-ended questions about what you've seen or felt online—no lectures, just cues for self-awareness and safe offline resets."
  },
  {
    question: "How is Family Flow built?",
    answer: "The original MVP used plain HTML, CSS, and localStorage for bulletproof privacy. As families asked for better accessibility and cross-device support, Family Flow evolved to a Next.js/React PWA. But core values never changed: no backend, offline-first, all data local."
  },
  {
    question: "Can I export our collective ritual logs?",
    answer: "Yes—there's a one-tap export to CSV/JSON or printable PDF, all processed locally. You decide what to share or keep, as a family."
  },
  {
    question: "Does it matter if we stop using the app after forming the habit?",
    answer: "Not at all. If your family moves from digital to verbal or written rituals, that's our proudest outcome! Family Flow isn't meant to keep you locked in—it's here as long as you want the gentle structure, then step back once you find your own rhythm."
  },
  {
    question: "Will Family Flow nag us to return?",
    answer: "No reminders, no push notifications, no guilt. Pair the app with existing routines (bedtime, dinner) and use it or not as you please. The goal is to support—never intrude."
  },
  {
    question: "I have a suggestion or concern—how do I reach you?",
    answer: "We're always listening. Connect with Helen (creator) at [helenfrancisthonakkara@gmail.com], with full confidence that your feedback will shape our next improvements."
  }
];

function FAQAccordion() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="space-y-2">
      {FAQ_DATA.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <h4 className="text-base font-medium text-gray-900 pr-4">{item.question}</h4>
            {openItems.has(index) ? (
              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
            )}
          </button>
          {openItems.has(index) && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen px-6 py-8 pb-28">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => onNavigate('memory')}
            className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            About Family Flow
          </h1>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl shadow-lg overflow-hidden">
            <img 
              src="/images/app-hero.png" 
              alt="Family using technology together"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <h2 className="text-2xl mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Creating meaningful technology that honors privacy while rebuilding the authentic conversations that screens often fragment.
            </p>
          </div>
        </Card>

        {/* Core Values */}
        <div className="mb-8">
          <h3 className="text-2xl mb-6 text-center">Our Values</h3>
          <div className="space-y-4">
            <Card className="p-6 text-center">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Privacy First</h4>
              <p className="text-gray-600">No accounts, no cloud storage, no tracking. Your family's data stays with your family.</p>
            </Card>
            
            <Card className="p-6 text-center">
              <Heart className="w-8 h-8 text-pink-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Connection</h4>
              <p className="text-gray-600">A gentle two-minute ritual that brings families closer together.</p>
            </Card>
            
            <Card className="p-6 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Simplicity</h4>
              <p className="text-gray-600">Stripped of every unnecessary feature, distilled down to what matters most.</p>
            </Card>
          </div>
        </div>

        {/* Creator Story */}
        <Card className="p-6 mb-8">
          <h3 className="text-2xl mb-6 text-center">Meet the Creator</h3>
          <div className="text-center text-gray-700 leading-relaxed">
            <p>
              <strong className="text-gray-900">Helen Francis</strong> created Family Flow during her final-year BBA project, combining business insight with her nursing background. She built this privacy-first app in one focused weekend, proving that meaningful technology can honor family trust while rebuilding authentic conversations that screens often fragment.
            </p>
          </div>
        </Card>

        {/* FAQ Section */}
        <div className="mb-8">
          <h3 className="text-2xl mb-6 text-center">Frequently Asked Questions</h3>
          <FAQAccordion />
        </div>

        {/* Technical Details */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-gray-50 to-blue-50">
          <h3 className="text-2xl mb-4 text-center">How It Works</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
              <span>100% offline after first load</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
              <span>All data stored locally on your device</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
              <span>Installs like a native app</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
              <span>No servers, no accounts, no tracking</span>
            </div>
          </div>
        </Card>

        {/* Version Info */}
        <div className="text-center text-gray-500 mb-8">
          <p className="text-lg">Family Flow v1.0</p>
          <p>Built with ❤️ for families everywhere</p>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => onNavigate('memory')}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-xl py-4 h-auto"
        >
          Back to Export
        </Button>
      </div>
    </div>
  );
}