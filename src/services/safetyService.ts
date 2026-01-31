export interface SafetyCheckResult {
  isSafe: boolean;
  hasRedFlag: boolean;
  redFlagType?: string;
  message?: string;
  action?: string;
}

const RED_FLAGS = [
  {
    keywords: ['chest pain', 'heart attack', 'cardiac arrest', 'crushing chest'],
    type: 'Cardiovascular Emergency',
    message: 'Your query indicates a potential heart-related emergency.',
    action: 'Call emergency services (911) immediately.'
  },
  {
    keywords: ['stroke', 'facial drooping', 'arm weakness', 'slurred speech'],
    type: 'Stroke Symptoms',
    message: 'These symptoms could indicate a stroke.',
    action: 'Call emergency services immediately. Time is critical.'
  },
  {
    keywords: ['difficulty breathing', 'shortness of breath', 'can\'t breathe', 'gasping'],
    type: 'Respiratory Emergency',
    message: 'Severe breathing difficulties require immediate medical attention.',
    action: 'Call emergency services or go to the nearest ER.'
  },
  {
    keywords: ['heavy bleeding', 'uncontrolled bleeding', 'deep wound'],
    type: 'Trauma/Bleeding',
    message: 'Uncontrolled bleeding is a life-threatening emergency.',
    action: 'Apply pressure and call emergency services immediately.'
  },
  {
    keywords: ['suicide', 'kill myself', 'end my life', 'want to die'],
    type: 'Mental Health Crisis',
    message: 'You are not alone. Help is available.',
    action: 'Call or text 988 (Suicide & Crisis Lifeline) or go to the nearest ER.'
  }
];

export const checkSafety = (query: string): SafetyCheckResult => {
  const normalizedQuery = query.toLowerCase();

  for (const flag of RED_FLAGS) {
    if (flag.keywords.some(keyword => normalizedQuery.includes(keyword))) {
      return {
        isSafe: false,
        hasRedFlag: true,
        redFlagType: flag.type,
        message: flag.message,
        action: flag.action
      };
    }
  }

  return {
    isSafe: true,
    hasRedFlag: false
  };
};
