import { supabase } from "../../../lib/supabase";
import { TrackedShipment } from '../types/tracking';
import { getPortCoordinates } from '../../../data/portCoordinates';

export const trackingService = {
  async listActive(): Promise<TrackedShipment[]> {
    const { data, error } = await supabase
      .from('shipments')
      .select(`
        id,
        "Shipment Number",
        "Origin",
        "Destination",
        shipment_status,
        "Transport Mode",
        "ETD",
        "ETA",
        "ATD",
        "ATA",
        "Delay Days"
      `)
      .not('shipment_status', 'eq', 'DELIVERED');

    if (error) throw error;

    return (data || []).map((s: any) => {
      const originCoords = getPortCoordinates(s['Origin'] || '');
      const destCoords = getPortCoordinates(s['Destination'] || '');

      return {
        id: s.id,
        shipment_number: s['Shipment Number'],
        origin: s['Origin'] || 'Unknown',
        destination: s['Destination'] || 'Unknown',
        shipment_status: s.shipment_status,
        transport_mode: s['Transport Mode'],
        etd: s['ETD'],
        eta: s['ETA'],
        atd: s['ATD'],
        ata: s['ATA'],
        delay_days: s['Delay Days'],
        origin_lat: originCoords?.lat ?? null,
        origin_lng: originCoords?.lon ?? null,
        dest_lat: destCoords?.lat ?? null,
        dest_lng: destCoords?.lon ?? null,
      };
    });
  }
};
