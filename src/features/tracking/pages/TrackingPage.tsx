import { ArrowLeft } from 'lucide-react';
import { useLiveTracking } from '../hooks/useLiveTracking';
import TrackingMap from '../components/TrackingMap';
import AIInsightsPanel from '../components/AIInsightsPanel';

interface TrackingPageProps {
  onBack: () => void;
}

export default function TrackingPage({ onBack }: TrackingPageProps) {
  const { shipments, loading } = useLiveTracking();

  if (loading) return (
    <div className="p-6">
      <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4">
        <ArrowLeft className="w-5 h-5" /><span>Back</span>
      </button>
      <p>Loading live tracking...</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-semibold">Live Shipment Tracking</h1>
      </div>

      <AIInsightsPanel shipments={shipments} />

      <TrackingMap shipments={shipments} />
    </div>
  );
}
