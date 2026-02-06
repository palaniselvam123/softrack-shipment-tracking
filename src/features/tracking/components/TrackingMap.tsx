import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { TrackedShipment } from '../types/tracking';

interface Props {
  shipments: TrackedShipment[];
}

export default function TrackingMap({ shipments }: Props) {
  const markers = shipments.flatMap((s) => {
    const items: { key: string; lat: number; lng: number; label: string; type: 'origin' | 'destination'; shipment: TrackedShipment }[] = [];
    if (s.origin_lat && s.origin_lng) {
      items.push({ key: `${s.id}-o`, lat: s.origin_lat, lng: s.origin_lng, label: s.origin, type: 'origin', shipment: s });
    }
    if (s.dest_lat && s.dest_lng) {
      items.push({ key: `${s.id}-d`, lat: s.dest_lat, lng: s.dest_lng, label: s.destination, type: 'destination', shipment: s });
    }
    return items;
  });

  const routes = shipments
    .filter(s => s.origin_lat && s.origin_lng && s.dest_lat && s.dest_lng)
    .map(s => ({
      id: s.id,
      positions: [[s.origin_lat!, s.origin_lng!], [s.dest_lat!, s.dest_lng!]] as [number, number][],
    }));

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={3}
      className="h-[450px] rounded-xl border border-slate-200"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {routes.map(r => (
        <Polyline
          key={r.id}
          positions={r.positions}
          pathOptions={{ color: '#0d9488', weight: 2, dashArray: '6 4', opacity: 0.7 }}
        />
      ))}

      {markers.map(m => (
        <Marker key={m.key} position={[m.lat, m.lng]}>
          <Popup>
            <div className="text-xs">
              <strong>{m.shipment.shipment_number}</strong><br />
              {m.type === 'origin' ? 'Origin' : 'Destination'}: {m.label}<br />
              Status: {m.shipment.shipment_status || 'N/A'}<br />
              ETA: {m.shipment.eta ? new Date(m.shipment.eta).toLocaleDateString() : 'N/A'}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
