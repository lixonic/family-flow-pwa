import { ChoiceOption } from './ChoiceCard';

// Feel choices - How families experience their screen time together
export const FEEL_OPTIONS: ChoiceOption[] = [
  {
    id: 'calm-connected',
    emoji: '🌿',
    label: 'Calm & Connected',
    description: 'Our family time felt peaceful and present together'
  },
  {
    id: 'energized-playful', 
    emoji: '⚡',
    label: 'Energized & Playful',
    description: 'We had fun, laughter, and positive energy'
  },
  {
    id: 'scattered-busy',
    emoji: '🌪️', 
    label: 'Scattered & Busy',
    description: 'Everyone was doing their own thing separately'
  },
  {
    id: 'tired-drained',
    emoji: '😴',
    label: 'Tired & Drained', 
    description: 'Screen time left us feeling low energy or sluggish'
  },
  {
    id: 'frustrated-tense',
    emoji: '😤',
    label: 'Frustrated & Tense',
    description: 'Technology caused stress or conflict in our family'
  },
  {
    id: 'curious-learning',
    emoji: '🤔',
    label: 'Curious & Learning',
    description: 'We discovered or created something meaningful together'
  }
];

// Need choices mapped to Feel selections
export const NEED_MAPPINGS: Record<string, ChoiceOption[]> = {
  'calm-connected': [
    { 
      id: 'keep-rhythm', 
      emoji: '🔄', 
      label: 'Keep This Rhythm', 
      description: 'This balance is working well for our family' 
    },
    { 
      id: 'more-offline', 
      emoji: '🌳', 
      label: 'More Offline Time', 
      description: 'Add more screen-free family moments' 
    },
    { 
      id: 'deeper-talks', 
      emoji: '💬', 
      label: 'Deeper Conversations', 
      description: 'Create space for more meaningful discussions' 
    }
  ],
  
  'energized-playful': [
    { 
      id: 'channel-energy', 
      emoji: '🎯', 
      label: 'Channel This Energy', 
      description: 'Use this positive momentum for family activities' 
    },
    { 
      id: 'creative-time', 
      emoji: '🎨', 
      label: 'More Creative Time', 
      description: 'Build on this playfulness with hands-on projects' 
    },
    { 
      id: 'active-together', 
      emoji: '🏃‍♀️', 
      label: 'Active Time Together', 
      description: 'Move our bodies and play outside' 
    }
  ],
  
  'scattered-busy': [
    { 
      id: 'family-pause', 
      emoji: '⏸️', 
      label: 'Family Pause Moments', 
      description: 'Regular check-ins during busy times' 
    },
    { 
      id: 'connection-rituals', 
      emoji: '🕯️', 
      label: 'Connection Rituals', 
      description: 'Daily practices that bring us together' 
    },
    { 
      id: 'schedule-harmony', 
      emoji: '⚖️', 
      label: 'Schedule Harmony', 
      description: 'Better balance between individual and family time' 
    }
  ],
  
  'tired-drained': [
    { 
      id: 'energy-restore', 
      emoji: '🔋', 
      label: 'Restore Our Energy', 
      description: 'Find activities that energize rather than drain us' 
    },
    { 
      id: 'gentle-boundaries', 
      emoji: '🛡️', 
      label: 'Gentle Boundaries', 
      description: 'Protect our family energy with screen limits' 
    },
    { 
      id: 'refresh-together', 
      emoji: '🌊', 
      label: 'Refresh Together', 
      description: 'Do something that rejuvenates our whole family' 
    }
  ],
  
  'frustrated-tense': [
    { 
      id: 'calm-reset', 
      emoji: '🕊️', 
      label: 'Calm Reset', 
      description: 'Take a break and reconnect peacefully' 
    },
    { 
      id: 'tech-boundaries', 
      emoji: '📱', 
      label: 'Tech Boundaries', 
      description: 'Clear agreements about device use and timing' 
    },
    { 
      id: 'family-healing', 
      emoji: '🤝', 
      label: 'Family Healing', 
      description: 'Address what caused tension and reconnect' 
    }
  ],
  
  'curious-learning': [
    { 
      id: 'explore-more', 
      emoji: '🔍', 
      label: 'Explore More Together', 
      description: 'Build on this curiosity with new discoveries' 
    },
    { 
      id: 'create-together', 
      emoji: '🛠️', 
      label: 'Create Something', 
      description: 'Use our learning to make or build together' 
    },
    { 
      id: 'teach-others', 
      emoji: '🎓', 
      label: 'Share Our Learning', 
      description: 'Teach what we learned to others in our family' 
    }
  ]
};

// Next choices mapped to Need selections  
export const NEXT_MAPPINGS: Record<string, ChoiceOption[]> = {
  'keep-rhythm': [
    { 
      id: 'gratitude-moment', 
      emoji: '🙏', 
      label: 'Gratitude Moment', 
      description: 'Share what we appreciate about our family balance' 
    },
    { 
      id: 'rhythm-check', 
      emoji: '📅', 
      label: 'Weekly Rhythm Check', 
      description: 'Plan to discuss our family flow again next week' 
    },
    { 
      id: 'celebrate-balance', 
      emoji: '🎉', 
      label: 'Celebrate This Balance', 
      description: 'Acknowledge our family is doing something right' 
    }
  ],
  
  'family-pause': [
    { 
      id: 'dinner-phones-away', 
      emoji: '🍽️', 
      label: 'Phone-Free Dinners', 
      description: 'Starting tonight, phones stay in another room' 
    },
    { 
      id: 'morning-checkin', 
      emoji: '☀️', 
      label: 'Morning Family Check-in', 
      description: '5 minutes together before screens turn on' 
    },
    { 
      id: 'bedtime-boundaries', 
      emoji: '🌙', 
      label: 'Screen Bedtime', 
      description: 'All devices off 1 hour before actual bedtime' 
    }
  ],
  
  'energy-restore': [
    { 
      id: 'nature-walk', 
      emoji: '🚶‍♀️', 
      label: 'Family Nature Walk', 
      description: 'Go outside together for 15 minutes today' 
    },
    { 
      id: 'stretching-together', 
      emoji: '🧘‍♀️', 
      label: 'Stretch Together', 
      description: 'Do simple stretches as a family for 5 minutes' 
    },
    { 
      id: 'early-screen-stop', 
      emoji: '⏰', 
      label: 'Earlier Screen Stop', 
      description: 'End screen time 30 minutes earlier tonight' 
    }
  ],
  
  'calm-reset': [
    { 
      id: 'family-breathing', 
      emoji: '🌸', 
      label: 'Family Breathing', 
      description: 'Take 3 deep breaths together right now' 
    },
    { 
      id: 'apology-circle', 
      emoji: '💝', 
      label: 'Apology & Forgiveness', 
      description: 'Share sorry and forgiveness if needed' 
    },
    { 
      id: 'hug-time', 
      emoji: '🤗', 
      label: 'Family Hug Time', 
      description: 'Give each other hugs and kind words' 
    }
  ],
  
  'channel-energy': [
    { 
      id: 'dance-party', 
      emoji: '💃', 
      label: 'Family Dance Party', 
      description: 'Put on music and dance together for 10 minutes' 
    },
    { 
      id: 'outdoor-play', 
      emoji: '⚽', 
      label: 'Outdoor Play Time', 
      description: 'Go outside and play together right now' 
    },
    { 
      id: 'active-project', 
      emoji: '🔨', 
      label: 'Start Active Project', 
      description: 'Begin building or making something together' 
    }
  ],
  
  'explore-more': [
    { 
      id: 'research-together', 
      emoji: '📚', 
      label: 'Research More Together', 
      description: 'Look up more information about what we discovered' 
    },
    { 
      id: 'experiment-time', 
      emoji: '🧪', 
      label: 'Try An Experiment', 
      description: 'Test what we learned with hands-on exploration' 
    },
    { 
      id: 'document-learning', 
      emoji: '📝', 
      label: 'Document Our Learning', 
      description: 'Write or draw about what we discovered today' 
    }
  ],
  
  // Add default mappings for other Need choices
  'more-offline': [
    { 
      id: 'screen-free-hour', 
      emoji: '🕐', 
      label: 'Screen-Free Hour', 
      description: 'One hour tonight with no screens for anyone' 
    },
    { 
      id: 'analog-activity', 
      emoji: '🎲', 
      label: 'Analog Activity', 
      description: 'Do something hands-on together - board game, puzzle, craft' 
    },
    { 
      id: 'conversation-time', 
      emoji: '💬', 
      label: 'Talk Time', 
      description: 'Have a real conversation without any devices' 
    }
  ],
  
  'tech-boundaries': [
    { 
      id: 'family-tech-agreement', 
      emoji: '📋', 
      label: 'Family Tech Agreement', 
      description: 'Create clear rules together about device use' 
    },
    { 
      id: 'device-parking', 
      emoji: '📱', 
      label: 'Device Parking Zone', 
      description: 'Designate a spot where all devices go during family time' 
    },
    { 
      id: 'tech-free-meals', 
      emoji: '🍽️', 
      label: 'Tech-Free Meals', 
      description: 'All meals become device-free family time' 
    }
  ],
  
  // Add mappings for missing Need options
  'deeper-talks': [
    { 
      id: 'question-time', 
      emoji: '❓', 
      label: 'Question Time', 
      description: 'Ask each other meaningful questions tonight' 
    },
    { 
      id: 'story-sharing', 
      emoji: '📖', 
      label: 'Share Stories', 
      description: 'Tell each other stories from your day or past' 
    },
    { 
      id: 'listening-circle', 
      emoji: '👂', 
      label: 'Listening Circle', 
      description: 'Each person shares while others just listen' 
    }
  ],
  
  'creative-time': [
    { 
      id: 'art-project', 
      emoji: '🎨', 
      label: 'Family Art Project', 
      description: 'Start a creative project together today' 
    },
    { 
      id: 'music-time', 
      emoji: '🎵', 
      label: 'Make Music Together', 
      description: 'Sing, dance, or play instruments as a family' 
    },
    { 
      id: 'storytelling', 
      emoji: '📚', 
      label: 'Create Stories', 
      description: 'Make up stories together or write them down' 
    }
  ],
  
  'active-together': [
    { 
      id: 'family-walk', 
      emoji: '🚶‍♀️', 
      label: 'Family Walk', 
      description: 'Take a walk around the neighborhood together' 
    },
    { 
      id: 'backyard-play', 
      emoji: '🏃‍♂️', 
      label: 'Backyard Play', 
      description: 'Play actively in the yard or nearest outdoor space' 
    },
    { 
      id: 'indoor-movement', 
      emoji: '🤸‍♀️', 
      label: 'Indoor Movement', 
      description: 'Do yoga, stretches, or dance indoors together' 
    }
  ],
  
  'connection-rituals': [
    { 
      id: 'daily-huddle', 
      emoji: '👥', 
      label: 'Daily Family Huddle', 
      description: 'Start a 5-minute daily check-in routine' 
    },
    { 
      id: 'bedtime-ritual', 
      emoji: '🌙', 
      label: 'New Bedtime Ritual', 
      description: 'Create a special way to end each day together' 
    },
    { 
      id: 'morning-tradition', 
      emoji: '☀️', 
      label: 'Morning Tradition', 
      description: 'Start each day with a special family moment' 
    }
  ],
  
  'schedule-harmony': [
    { 
      id: 'family-calendar', 
      emoji: '📅', 
      label: 'Family Calendar Review', 
      description: 'Look at the week ahead together and plan family time' 
    },
    { 
      id: 'priority-talk', 
      emoji: '⭐', 
      label: 'Priority Discussion', 
      description: 'Talk about what matters most to our family this week' 
    },
    { 
      id: 'balance-check', 
      emoji: '⚖️', 
      label: 'Weekly Balance Check', 
      description: 'Discuss if everyone feels heard and included' 
    }
  ],
  
  'gentle-boundaries': [
    { 
      id: 'quiet-time', 
      emoji: '🤫', 
      label: 'Quiet Time Together', 
      description: 'Have 30 minutes of peaceful, low-stimulation family time' 
    },
    { 
      id: 'energy-break', 
      emoji: '🔋', 
      label: 'Family Energy Break', 
      description: 'Everyone takes a short break to recharge' 
    },
    { 
      id: 'gentle-limits', 
      emoji: '🛡️', 
      label: 'Set Gentle Limits', 
      description: 'Agree on one small boundary to protect family energy' 
    }
  ],
  
  'refresh-together': [
    { 
      id: 'fresh-air', 
      emoji: '🌬️', 
      label: 'Fresh Air Break', 
      description: 'Go outside together for fresh air and a change of scenery' 
    },
    { 
      id: 'hydrate-snack', 
      emoji: '💧', 
      label: 'Hydrate & Healthy Snack', 
      description: 'Drink water and eat something nourishing together' 
    },
    { 
      id: 'reset-space', 
      emoji: '🏠', 
      label: 'Reset Our Space', 
      description: 'Tidy up and organize our family space together' 
    }
  ],
  
  'family-healing': [
    { 
      id: 'healing-conversation', 
      emoji: '💭', 
      label: 'Healing Conversation', 
      description: 'Talk openly about what happened and how everyone feels' 
    },
    { 
      id: 'repair-ritual', 
      emoji: '🔧', 
      label: 'Family Repair Ritual', 
      description: 'Do something together to reconnect after conflict' 
    },
    { 
      id: 'forgiveness-circle', 
      emoji: '💕', 
      label: 'Forgiveness Circle', 
      description: 'Share apologies and forgiveness as needed' 
    }
  ],
  
  'create-together': [
    { 
      id: 'build-project', 
      emoji: '🔨', 
      label: 'Build Something', 
      description: 'Start a hands-on building or making project together' 
    },
    { 
      id: 'cook-together', 
      emoji: '👨‍🍳', 
      label: 'Cook or Bake Together', 
      description: 'Make something delicious as a family' 
    },
    { 
      id: 'garden-plant', 
      emoji: '🌱', 
      label: 'Plant or Garden', 
      description: 'Work with plants or start a small garden project' 
    }
  ],
  
  'teach-others': [
    { 
      id: 'skill-share', 
      emoji: '🎯', 
      label: 'Skill Sharing Time', 
      description: 'Each person teaches something they know to the family' 
    },
    { 
      id: 'show-and-tell', 
      emoji: '🎪', 
      label: 'Family Show & Tell', 
      description: 'Present what you learned to the family' 
    },
    { 
      id: 'teach-neighbor', 
      emoji: '🏘️', 
      label: 'Teach Someone Outside Family', 
      description: 'Share your learning with friends or neighbors' 
    }
  ]
};

// Helper function to get Need options based on Feel choice
export const getNeedOptions = (feelChoice: string): ChoiceOption[] => {
  return NEED_MAPPINGS[feelChoice] || [];
};

// Helper function to get Next options based on Need choice
export const getNextOptions = (needChoice: string): ChoiceOption[] => {
  const options = NEXT_MAPPINGS[needChoice];
  
  // If no specific mapping found, provide default options
  if (!options || options.length === 0) {
    return [
      { 
        id: 'family-checkin', 
        emoji: '💬', 
        label: 'Family Check-In', 
        description: 'Talk about this together as a family' 
      },
      { 
        id: 'try-tomorrow', 
        emoji: '🌅', 
        label: 'Try Tomorrow', 
        description: 'Make a plan to try something different tomorrow' 
      },
      { 
        id: 'small-step', 
        emoji: '👣', 
        label: 'One Small Step', 
        description: 'Take one tiny action toward what our family needs' 
      }
    ];
  }
  
  return options;
};