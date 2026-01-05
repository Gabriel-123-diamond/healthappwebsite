export interface DirectoryItem {
  id: string;
  name: string;
  type: "doctor" | "herbalist" | "hospital";
  specialty: string;
  address: string;
  region?: string;
  location: { lat: number; lng: number };
  phone: string;
  verified: boolean;
  rating?: number;
  isEmergency?: boolean;
}
