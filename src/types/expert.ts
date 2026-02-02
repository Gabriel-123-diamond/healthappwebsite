export interface Expert {
  id: string;
  name: string;
  type: 'doctor' | 'herbalist' | 'hospital';
  specialty: string;
  location: string;
  rating: number;
  verified: boolean;
  imageUrl?: string;
  lat: number;
  lng: number;
  geohash: string;
}
