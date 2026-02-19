import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, ArrowRightLeft, SlidersHorizontal, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { WarehouseMovement } from '../types/warehouse';

interface MovementsLogProps {
  movements: WarehouseMovement[];
  loading?: boolean;
}

const typeConfig = {
  inbound: { label: 'Inbound', Icon: ArrowDownCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  outbound: { label: 'Outbound', Icon: ArrowUpCircle, color: 'text-red-500', bg: 'bg-red-50' },
  transfer: { label: 'Transfer', Icon: ArrowRightLeft, color: 'text-blue-600', bg: 'bg-blue-50' },
  adjustment: { label: 'Adjustment', Icon: SlidersHorizontal, color: 'text-amber-600', bg: 'bg-amber-50' },
};

const statusConfig = {
  pending: { label: 'Pending', Icon: Clock, color: 'text-gray-500' },
  in_progress: { label: 'In Progress', Icon: Clock, color: 'text-blue-600' },
  completed: { label: 'Completed', Icon: CheckCircle2, color: 'text-emerald-600' },
  cancelled: { label: 'Cancelled', Icon: XCircle, color: 'text-red-500' },
};

const MovementsLog: React.FC<MovementsLogProps> = ({ movements, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600" />
      </div>
    );
  }

  if (movements.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <ArrowRightLeft className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p>No movements recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {movements.map(mov => {
        const type = typeConfig[mov.movement_type] || typeConfig.inbound;
        const status = statusConfig[mov.status] || statusConfig.pending;
        const TypeIcon = type.Icon;
        const StatusIcon = status.Icon;

        return (
          <div key={mov.id} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
            <div className={`p-2.5 rounded-xl ${type.bg} flex-shrink-0`}>
              <TypeIcon className={`w-5 h-5 ${type.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${type.color}`}>{type.label}</span>
                    <span className="text-xs text-gray-400 font-mono">{mov.reference_no}</span>
                    {mov.shipment_ref && (
                      <span className="text-xs text-sky-600 font-medium">{mov.shipment_ref}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 mt-0.5">
                    <span className="font-semibold">{mov.quantity.toLocaleString()}</span>
                    <span className="text-gray-400 ml-1">{mov.unit}</span>
                    {mov.from_location && (
                      <span className="text-gray-500"> from <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{mov.from_location}</span></span>
                    )}
                    {mov.to_location && (
                      <span className="text-gray-500"> to <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{mov.to_location}</span></span>
                    )}
                  </div>
                  {mov.notes && (
                    <p className="text-xs text-gray-400 mt-1 truncate">{mov.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                  <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                {new Date(mov.scheduled_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MovementsLog;
