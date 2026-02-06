import { useLiveTracking } from '../hooks/useLiveTracking';
import TrackingMap from '../components/TrackingMap';
import AIInsightsPanel from '../components/AIInsightsPanel';

export default function TrackingPage() {
  const { shipments, loading } = useLiveTracking();

  if (loading) return <div className="p-6">Loading live tracking…</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Live Shipment Tracking</h1>

      <AIInsightsPanel shipments={shipments} />

      <TrackingMap shipments={shipments} />
    </div>
  );
}
