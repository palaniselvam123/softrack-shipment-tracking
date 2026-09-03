import { Loader2, MapPin } from 'lucide-react';
import { useLiveTracking } from '../hooks/useLiveTracking';
import TrackingMap from '../components/TrackingMap';

const statusLabel: Record<string, { text: string; className: string }> = {
  IN_TRANSIT: { text: 'In Transit', className: 'badge-info' },
  DELAYED: { text: 'Delayed', className: 'badge-danger' },
  DELIVERED: { text: 'Delivered', className: 'badge-success' }
};

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : 'N/A';

export default function TrackingPage() {
  const { shipments, loading, error, reload } = useLiveTracking();

  const plotted = shipments.filter(
    (s) => s.current_lat != null && s.current_lng != null
  );

  return (
    <div className="page space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="page-title">Live Shipment Tracking</h1>
          <p className="text-field text-gray-500 mt-0.5">
            {loading ? 'Loading…' : `${shipments.length} active shipments`}
          </p>
        </div>
        <button onClick={reload} className="btn-secondary" disabled={loading}>
          Refresh
        </button>
      </div>

      {loading && (
        <div className="card">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 className="w-7 h-7 text-navy-600 animate-spin mx-auto mb-3" />
              <p className="text-field text-gray-500">Loading live tracking…</p>
            </div>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="card">
          <div className="text-center py-16 px-4">
            <p className="text-navy-900 font-semibold mb-1">Could not load tracking data</p>
            <p className="text-field text-gray-500 mb-4 max-w-md mx-auto">{error}</p>
            <button onClick={reload} className="btn-primary">Retry</button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="card overflow-hidden">
            <header className="px-4 py-3 border-b border-surface-line">
              <h2 className="card-title">
                <MapPin className="w-4 h-4 text-navy-600" />
                Map
              </h2>
            </header>
            <TrackingMap shipments={plotted} />
            {plotted.length === 0 && (
              <p className="px-4 py-2.5 text-label text-gray-500 border-t border-surface-line">
                No positions to plot — the shipments table stores no coordinates yet.
              </p>
            )}
          </section>

          <section className="card">
            <header className="px-4 py-3 border-b border-surface-line">
              <h2 className="card-title">Active shipments</h2>
            </header>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Shipment No.</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Mode</th>
                    <th>ETA</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-10">
                        No active shipments.
                      </td>
                    </tr>
                  )}
                  {shipments.map((s) => {
                    const badge = statusLabel[s.status] ?? statusLabel.IN_TRANSIT;
                    return (
                      <tr key={s.id}>
                        <td className="font-medium text-navy-900 whitespace-nowrap">
                          {s.reference_no}
                        </td>
                        <td>{s.origin}</td>
                        <td>{s.destination}</td>
                        <td>{s.transport_mode ?? 'N/A'}</td>
                        <td className="whitespace-nowrap">{formatDate(s.eta)}</td>
                        <td>
                          <span className={`badge ${badge.className}`}>{badge.text}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
