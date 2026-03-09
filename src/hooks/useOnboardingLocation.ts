'use client';

import { useState, useEffect } from 'react';
import { locationService } from '@/services/locationService';

export interface LocationItem {
  id: number;
  name: string;
  iso2: string;
  emoji?: string;
}

export const useOnboardingLocation = (countryIso?: string, stateIso?: string) => {
  const [allCountries, setAllCountries] = useState<LocationItem[]>([]);
  const [allStates, setAllStates] = useState<LocationItem[]>([]);
  const [allCities, setAllCities] = useState<LocationItem[]>([]);

  // Fetch initial countries
  useEffect(() => {
    locationService.getCountries()
      .then(setAllCountries)
      .catch(console.error);
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (countryIso) {
      locationService.getStates(countryIso)
        .then(setAllStates)
        .catch(console.error);
    } else {
      setAllStates([]);
    }
    setAllCities([]);
  }, [countryIso]);

  // Fetch cities when state changes
  useEffect(() => {
    if (countryIso && stateIso) {
      locationService.getCities(countryIso, stateIso)
        .then(setAllCities)
        .catch(console.error);
    } else {
      setAllCities([]);
    }
  }, [countryIso, stateIso]);

  return {
    allCountries,
    allStates,
    allCities
  };
};
