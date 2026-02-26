export const locationService = {
  async getCountries() {
    try {
      const response = await fetch('/api/location?type=countries');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [];
    }
  },

  async getStates(countryIso: string) {
    try {
      const response = await fetch(`/api/location?type=states&countryIso=${countryIso}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching states for ${countryIso}:`, error);
      return [];
    }
  },

  async getCities(countryIso: string, stateIso: string) {
    try {
      const response = await fetch(`/api/location?type=cities&countryIso=${countryIso}&stateIso=${stateIso}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching cities for ${countryIso}, ${stateIso}:`, error);
      return [];
    }
  }
};
