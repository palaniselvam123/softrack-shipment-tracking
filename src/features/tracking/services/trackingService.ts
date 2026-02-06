import { supabase } from "../../../lib/supabase";
import { TrackedShipment } from '../types/tracking';

export const trackingService = {
  async listActive(): Promise<TrackedShipment[]> {
    const { data, error } = await supabase
      .from('shipments')
      .select(`
        id,
        reference_no,
        status,
        origin,
        destination,
        current_lat,
        current_lng,
        updated_at,
        eta
      `)
      .in('status', ['IN_TRANSIT', 'DELAYED']);

    if (error) throw error;

    return data.map((s: any) => ({
      ...s,
      last_updated: s.updated_at
    }));
  }
};
