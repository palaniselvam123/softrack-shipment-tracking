import { useEffect, useState } from 'react';
import { supabase } from "../../../lib/supabase";
import { TrackedShipment } from '../types/tracking';
import { trackingService } from '../services/trackingService';

export function useLiveTracking() {
  const [shipments, setShipments] = useState<TrackedShipment[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setShipments(await trackingService.listActive());
      setError(null);
    } catch (err) {
      /* Without this the promise rejected unhandled, setLoading(false) never
         ran and the page sat on "Loading live tracking..." forever. */
      console.error('Live tracking load failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tracking data');
      setShipments([]);
    } finally {
      setLoading(false);
    }
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

  return { shipments, loading, error, reload: load };
}
