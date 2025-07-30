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
    question: "Does Family Flow restrict screen time or block apps?",
    answer: "No. We don't set limits or block content. Instead, we help families reflect on their digital choices and develop awareness together. You decide what works for your family."
  },
  {
    question: "What about kids who need screens for regulation or learning differences?",
    answer: "Family Flow respects that every family's digital needs are different. Some kids thrive with more screen time, others with less. We help you understand what works for YOUR family without judgment."
  },
  {
    question: "What about kids with autism or ADHD who use screens for self-regulation?",
    answer: "Family Flow supports all families, including those where screens serve important regulatory functions. Our reflection prompts help you understand what digital experiences truly support each family member's wellbeing."
  },
  {
    question: "How is this different from parental control apps?",
    answer: "Parental controls impose external limits. Family Flow builds internal awareness. Instead of 'You can't,' we ask 'How did that feel?' and 'What do you want to try next?'"
  },
  {
    question: "Are you trying to eliminate technology from family life?",
    answer: "Not at all. We believe in conscious technology use, not elimination. The goal is helping families make intentional choices about when and how they use devices together."
  },
  {
    question: "What if our family's \"healthy\" digital habits look different from other families?",
    answer: "Perfect. Family Flow helps you discover and strengthen what works for YOUR unique situation. There's no one-size-fits-all approach to family digital wellness."
  },
  {
    question: "Do you believe screens are harmful to kids?",
    answer: "We don't take a position on whether screens are inherently good or bad. We believe families should have tools to understand their own patterns and make informed decisions based on their actual experience."
  },
  {
    question: "Will using Family Flow make us more restrictive with technology?",
    answer: "Not necessarily. Some families discover they want more boundaries, others realize they're already in a good place. The app helps you figure out what's right for you, not what's 'right' in general."
  },
  {
    question: "What is Family Flow's graduation philosophy?",
    answer: "Success means you won't need us forever. Family Flow is designed as a \"graduation platform\" - our success isn't measured by how long you use the app, but by how confidently your family graduates to independent connection rituals. We're here to build lasting habits, then set you free to flourish on your own."
  },
  {
    question: "How does the graduation system work?",
    answer: "After 45 days of consistent family check-ins, you'll have built strong connection habits. The app tracks your progress, celebrates milestones at 15 and 30 days, and prepares you for independence. When you're ready, you'll take a readiness assessment and transition to offline family rituals."
  },
  {
    question: "What happens after I graduate?",
    answer: "From digital prompts to real conversations. Graduation means your family has developed the confidence and skills to maintain connection rituals without any app. You might do verbal check-ins at dinner, write gratitude notes, or create your own family traditions. That's true success - you won't need us anymore!"
  },
  {
    question: "Where's the incentive—what keeps people coming back?",
    answer: "What if connection took just 2 minutes? Instead of prizes or comparison, Family Flow uses calming visual cues (confetti, streak dots), subtle new prompts, and shared progress. The real incentive is the emotional presence and gentle togetherness families experience—proven far stickier than individual competition or external rewards."
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
    answer: "Not at all. The main ritual is about feeling and presence (\"How was your day?\")—not usage monitoring or punishment. Screen-reflection and digital wellness prompts are optional, gentle, and never punitive or tracked. Family Flow helps families develop digital wisdom, not digital rules."
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
    question: "What if we're ready to graduate before 45 days?",
    answer: "Perfect! Some families develop strong habits faster than others. If you feel confident in your connection rituals and want to try going app-free, you can access the readiness assessment at any time from your progress page. The 45-day target is a guideline, not a requirement."
  },
  {
    question: "Can we continue using the app after graduation?",
    answer: "Absolutely! Graduation is about having the option to be independent, not being forced out. Some families prefer to keep using the app as a backup or occasional check-in tool. Use it as long as it serves your family's needs."
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
    <div className="min-h-screen safe-area-content">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => onNavigate('day-glow')}
            className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-title text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FAQ
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
          <p className="text-sm text-gray-500 mb-2">
            Your feedback helps shape Family Flow's future improvements
          </p>
          <p className="text-xs text-gray-400 italic">
            Family Flow helps families develop digital wisdom, not digital rules. Every family's path to healthy technology use looks different, and that's exactly how it should be.
          </p>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => onNavigate('day-glow')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 max-[999px]:text-lg max-[999px]:py-3 text-xl py-4 h-auto"
        >
          Back to Family Flow
        </Button>
      </div>
    </div>
  );
}