import { Expert } from "@/types/expert";

const SPECIALTY_KEYWORDS: Record<string, string[]> = {
  'Cardiologist': ['heart', 'cardiac', 'pulse', 'blood pressure', 'chest pain', 'stroke', 'palpitations'],
  'Dermatologist': ['skin', 'rash', 'acne', 'eczema', 'hair', 'mole', 'dermatitis', 'itch'],
  'Neurologist': ['brain', 'headache', 'migraine', 'dizzy', 'seizure', 'nerve', 'neuropathy', 'concussion'],
  'Psychiatrist': ['mental', 'depression', 'anxiety', 'stress', 'mood', 'psychology', 'bipolar'],
  'Orthopedist': ['bone', 'joint', 'fracture', 'knee', 'back', 'spine', 'muscle', 'arthritis'],
  'Pediatrician': ['child', 'baby', 'infant', 'kid', 'fever', 'growth', 'vaccine'],
  'Dentist': ['tooth', 'teeth', 'gum', 'cavity', 'dental', 'mouth', 'ache'],
  'Ophthalmologist': ['eye', 'vision', 'sight', 'blind', 'glaucoma', 'cataract', 'blur'],
  'Herbalist': ['herb', 'natural', 'plant', 'root', 'tea', 'holistic', 'traditional', 'remedy', 'supplement'],
  'Traditional Chinese Medicine': ['chinese', 'acupuncture', 'qi', 'meridian', 'herbal', 'tea', 'pulse', 'tongue'],
  'Nutritionist': ['diet', 'food', 'weight', 'nutrition', 'vitamin', 'obesity', 'meal'],
  'General Practitioner': ['flu', 'cold', 'fever', 'cough', 'virus', 'infection', 'checkup', 'general', 'sick'],
  'Hospital': ['emergency', 'trauma', 'accident', 'urgent', 'surgery', 'hospital', 'ambulance', 'bleeding'],
  'Emergency': ['trauma', 'accident', 'urgent', 'hospital', 'bleeding', 'crisis'],
};

export function findMatchingExperts(query: string, experts: Expert[], mode: 'medical' | 'herbal' | 'both'): Expert[] {
  // Filter by Mode
  let filteredExperts = experts;
  if (mode === 'medical') {
    filteredExperts = experts.filter(e => ['doctor', 'specialist', 'hospital'].includes(e.type));
  } else if (mode === 'herbal') {
    filteredExperts = experts.filter(e => e.type === 'herbalist');
  }

  const lowerQuery = query.toLowerCase();
  const queryTerms = lowerQuery.split(/\s+/).filter(t => t.length > 2); 

  return filteredExperts.filter(e => {
    const expertName = e.name.toLowerCase();
    const expertSpecialty = e.specialty.toLowerCase();

    const nameMatch = expertName.includes(lowerQuery);
    const specialtyMatch = expertSpecialty.includes(lowerQuery);
    
    // Fuzzy match
    const fuzzyMatch = queryTerms.some(term => expertSpecialty.includes(term));

    // Semantic match using keywords
    let keywordMatch = false;
    for (const [specialtyKey, keywords] of Object.entries(SPECIALTY_KEYWORDS)) {
       if (expertSpecialty.includes(specialtyKey.toLowerCase()) || specialtyKey.toLowerCase().includes(expertSpecialty)) {
           if (queryTerms.some(term => keywords.some(k => k.includes(term) || term.includes(k)))) {
               keywordMatch = true;
               break;
           }
       }
    }

    return nameMatch || specialtyMatch || fuzzyMatch || keywordMatch;
  });
}
