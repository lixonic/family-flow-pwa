import React, { useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQPageProps {
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

export function FAQPage({ onNavigate }: FAQPageProps) {
  return (
    <div className="min-h-screen px-6 py-8 pb-28">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => onNavigate('day-glow')}
            className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <FAQAccordion />
        </div>

        {/* Contact Section */}
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-8">
          <h3 className="text-xl mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-4">
            Connect with Helen (creator) at{' '}
            <a href="mailto:helenfrancisthonakkara@gmail.com" className="text-blue-600 hover:text-blue-800">
              helenfrancisthonakkara@gmail.com
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Your feedback helps shape Family Flow's future improvements
          </p>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => onNavigate('day-glow')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-xl py-4 h-auto"
        >
          Back to Family Flow
        </Button>
      </div>
    </div>
  );
}