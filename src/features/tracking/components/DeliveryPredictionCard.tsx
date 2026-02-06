import { TrackedShipment } from '../types/tracking';
import { differenceInHours } from 'date-fns';

export default function DeliveryPredictionCard({ shipment }: { shipment: TrackedShipment }) {
  if (!shipment.eta) return null;

  const hoursLeft = differenceInHours(
    new Date(shipment.eta),
    new Date()
  );

  return (
    <div className="p-3 border rounded bg-gray-50">
      <h3 className="font-medium">Delivery Prediction</h3>
      <p className="text-sm text-gray-600">
        Expected delivery in approximately{' '}
        <strong>{Math.max(hoursLeft, 0)} hours</strong>
      </p>
    </div>
  );
}
