export interface TrackedShipment {
  id: string;
  reference_no: string;
  status: 'IN_TRANSIT' | 'DELAYED' | 'DELIVERED';
  origin: string;
  destination: string;
  current_lat: number;
  current_lng: number;
  last_updated: string;
  eta: string | null;
}
