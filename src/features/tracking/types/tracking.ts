export interface TrackedShipment {
  id: string;
  shipment_number: string;
  origin: string;
  destination: string;
  shipment_status: string | null;
  transport_mode: string | null;
  etd: string | null;
  eta: string | null;
  atd: string | null;
  ata: string | null;
  delay_days: string | null;
  origin_lat: number | null;
  origin_lng: number | null;
  dest_lat: number | null;
  dest_lng: number | null;
}
