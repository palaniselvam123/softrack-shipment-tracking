export interface TrackedShipment {
  id: string;
  reference_no: string;
  status: 'IN_TRANSIT' | 'DELAYED' | 'DELIVERED';
  origin: string;
  destination: string;
  transport_mode: string | null;
  /* The shipments table stores no position, so these are null until a
     coordinate source exists. Markers are only drawn when both are set. */
  current_lat: number | null;
  current_lng: number | null;
  last_updated: string | null;
  eta: string | null;
}
