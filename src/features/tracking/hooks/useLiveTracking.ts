import { useEffect, useState } from 'react';
import { supabase } from "../../../lib/supabase";
import { TrackedShipment } from '../types/tracking';
import { trackingService } from '../services/trackingService';

export function useLiveTracking() {
  const [shipments, setShipments] = useState<TrackedShipment[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setShipments(await trackingService.listActive());
    setLoading(false);
  }

  useEffect(() => {
    load();

    const channel = supabase
      .channel('live-shipments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shipments' },
        load
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { shipments, loading };
}
