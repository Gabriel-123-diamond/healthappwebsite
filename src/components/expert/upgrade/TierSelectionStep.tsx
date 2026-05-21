import React from 'react';
import { motion } from 'framer-motion';
import { TierCard } from './TierCard';

interface TierSelectionStepProps {
  role: string;
  onTierSelect: (tier: string) => void;
  currentTier?: string;
}

export const TierSelectionStep: React.FC<TierSelectionStepProps> = ({ role, onTierSelect, currentTier }) => {
  let tier1 = {
    id: 'professional',
    title: 'Professional Tier',
    price: '$25',
    description: 'Scale your professional clinical presence.',
    isCurrent: currentTier === 'professional',
    features: ['Verified Pro Badge', 'Enhanced Analytics', 'Standard Visibility', 'Priority Support Node']
  };

  let tier2 = {
    id: 'authority',
    title: 'Authority Tier',
    price: '$100',
    description: 'Dominant authority node in the health grid.',
    isCurrent: currentTier === 'authority',
    features: ['Top-of-Search Placement', 'Featured Expert Badge', 'Advanced AI Profile Insights', 'Reduced Service Commission']
  };

  if (role === 'hospital') {
    tier1 = {
      id: 'hospital',
      title: 'Hospital Listing',
      price: '$100',
      description: 'Establish your clinical presence.',
      isCurrent: currentTier === 'hospital' || currentTier === 'standard',
      features: ['Doctor Directory', 'Patient Reviews', 'Appointment Booking', 'Verified Badge']
    };
    tier2 = {
      id: 'network',
      title: 'Network Listing',
      price: '$400',
      description: 'Featured node with maximum promotional reach.',
      isCurrent: currentTier === 'network' || currentTier === 'premium',
      features: ['Featured Placement', 'Advertising Banner', 'Video Promotion', 'Health Campaigns']
    };
  } else if (role === 'wellness_practitioner') {
    tier1 = {
      id: 'vip1',
      title: 'VIP 1 - INSIGHTS',
      price: '$15',
      description: 'Expand your holistic wellness reach.',
      isCurrent: currentTier === 'vip1',
      features: ['Verified Badge', 'Up to 3 Active Products', 'Standard Visibility', 'Priority Support']
    };
    tier2 = {
      id: 'vip2',
      title: 'VIP 2 - DISPENSARY',
      price: '$75',
      description: 'Full-featured holistic dispensary and course access.',
      isCurrent: currentTier === 'vip2',
      features: ['Featured Placement', 'Unlimited Active Products', 'Digital Course Creator', 'Advanced AI profile suggestions']
    };
  }

  return (
    <motion.div
      key="tiers"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <TierCard
        id={tier1.id}
        title={tier1.title}
        price={tier1.price}
        description={tier1.description}
        isCurrent={tier1.isCurrent}
        features={tier1.features}
        onSelect={onTierSelect}
      />

      <TierCard
        id={tier2.id}
        title={tier2.title}
        price={tier2.price}
        description={tier2.description}
        isPremium
        isCurrent={tier2.isCurrent}
        features={tier2.features}
        onSelect={onTierSelect}
      />
    </motion.div>
  );
};
