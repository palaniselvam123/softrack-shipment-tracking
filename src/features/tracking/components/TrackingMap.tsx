import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { TrackedShipment } from '../types/tracking';

interface Props {
  shipments: TrackedShipment[];
}

export default function TrackingMap({ shipments }: Props) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={4}
      className="h-[400px] rounded"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {shipments.map(s => (
        <Marker key={s.id} position={[s.current_lat, s.current_lng]}>
          <Popup>
            <div>
              <strong>{s.reference_no}</strong><br />
              Status: {s.status}<br />
              ETA: {s.eta ?? 'N/A'}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
