import { auth } from "@/lib/firebase";

export const locationService = {
  async _getHeaders(): Promise<Record<string, string>> {
    const user = auth.currentUser;
    if (!user) return {};
    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`
    };
  },

  async getCountries() {
    try {
      const headers = await this._getHeaders();
      const response = await fetch('/api/location?type=countries', { headers });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [];
    }
  },

  async getStates(countryIso: string) {
    try {
      const headers = await this._getHeaders();
      const response = await fetch(`/api/location?type=states&countryIso=${countryIso}`, { headers });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching states for ${countryIso}:`, error);
      return [];
    }
  },

  async getCities(countryIso: string, stateIso: string) {
    try {
      const headers = await this._getHeaders();
      const response = await fetch(`/api/location?type=cities&countryIso=${countryIso}&stateIso=${stateIso}`, { headers });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching cities for ${countryIso}, ${stateIso}:`, error);
      return [];
    }
  }
};
