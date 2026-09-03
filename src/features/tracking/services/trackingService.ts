import { supabase } from "../../../lib/supabase";
import { TrackedShipment } from '../types/tracking';

/* The shipments table uses the quoted, human-readable column names created in
   20260119091008_create_shipments_table.sql ("Shipment Number", "Origin", …).
   An earlier version of this service selected reference_no/current_lat/eta,
   none of which exist, so every load failed and the tracking page stayed
   empty. Positions are not stored at all, hence the optional coordinates. */

const ACTIVE_STATUSES = ['In Transit', 'Delayed', 'IN_TRANSIT', 'DELAYED'];

const toStatus = (raw: string | null): TrackedShipment['status'] => {
  const s = (raw || '').toLowerCase();
  if (s.includes('deliver')) return 'DELIVERED';
  if (s.includes('delay')) return 'DELAYED';
  return 'IN_TRANSIT';
};

export const trackingService = {
  async listActive(): Promise<TrackedShipment[]> {
    const { data, error } = await supabase
      .from('shipments')
      .select(
        'id, "Shipment Number", "Origin", "Destination", "ETA", "Transport Mode", shipment_status, updated_at'
      )
      .in('shipment_status', ACTIVE_STATUSES);

    if (error) throw error;

    return (data || []).map((s: any) => ({
      id: s.id ?? s['Shipment Number'],
      reference_no: s['Shipment Number'],
      status: toStatus(s.shipment_status),
      origin: s['Origin'] ?? 'N/A',
      destination: s['Destination'] ?? 'N/A',
      transport_mode: s['Transport Mode'] ?? null,
      current_lat: null,
      current_lng: null,
      last_updated: s.updated_at ?? null,
      eta: s['ETA'] ?? null
    }));
  }
};
