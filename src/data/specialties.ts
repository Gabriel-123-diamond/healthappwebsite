/**
 * Comprehensive list of medical, surgical, traditional, and allied health specialties.
 * Sourced from ACGME, ABMS, specialty.txt, and global health databases.
 */

import { MEDICAL_SPECIALTIES } from './specialties_medical';
import { TRADITIONAL_SPECIALTIES } from './specialties_traditional';

export { MEDICAL_SPECIALTIES, TRADITIONAL_SPECIALTIES };

export const ALL_SPECIALTIES = Array.from(new Set([...MEDICAL_SPECIALTIES, ...TRADITIONAL_SPECIALTIES])).sort();
