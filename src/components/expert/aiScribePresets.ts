export interface ConsultationPreset {
  id: string;
  label: string;
  transcript: string[];
}

export const CONSULTATION_PRESETS: ConsultationPreset[] = [
  {
    id: 'hypertension',
    label: 'Hypertension Follow-up',
    transcript: [
      'Patient reports feeling well overall.',
      'Blood pressure at home has been around 135/85.',
      'No chest pain or shortness of breath.',
      'Taking Amlodipine 5mg daily as prescribed.',
      'Encouraged reduced salt intake and continued exercise.',
    ],
  },
  {
    id: 'migraine',
    label: 'Migraine Diagnostic',
    transcript: [
      'Patient presents with throbbing headache on left side.',
      'Nausea and sensitivity to light reported during episodes.',
      'Headaches occur 2-3 times per month.',
      'Lasts about 6 hours if untreated.',
      'Family history of migraines in mother.',
    ],
  },
  {
    id: 'wellness',
    label: 'Wellness Check-up',
    transcript: [
      'Routine physical exam.',
      'Patient is active, exercises 4 times a week.',
      'Diet is balanced, mostly plant-based.',
      'Sleeping 7-8 hours per night.',
      'No current health concerns reported.',
    ],
  },
];
