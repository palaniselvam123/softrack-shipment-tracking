import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FolderOpen,
  History,
  Package,
  PauseCircle,
  Plane,
  Plus,
  Search,
  Ship,
  SlidersHorizontal,
  Star,
  Truck
} from 'lucide-react';
import WorldMap from './WorldMap';
import { mockShipments } from '../data/mockData';

interface DashboardProps {
  onViewShipments: () => void;
  onNewBooking: () => void;
}

type Tile = {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  /* Icon tint only — the chip itself stays neutral so the grid reads as one block. */
  tone: string;
};

const dateUpdates: Tile[] = [
  { label: 'Incoming ETA Updates', value: 19, icon: ArrowDownLeft, tone: 'text-brand-600' },
  { label: 'Outgoing ETA Updates', value: 15, icon: ArrowUpRight, tone: 'text-navy-600' }
];

const bookingTiles: Tile[] = [
  { label: 'New Request', value: 14, icon: Plus, tone: 'text-brand-600' },
  { label: 'Open Request', value: 10, icon: FolderOpen, tone: 'text-navy-600' },
  { label: 'Pending Approval', value: 5, icon: History, tone: 'text-amber-600' },
  { label: 'Approved', value: 8, icon: ClipboardCheck, tone: 'text-green-600' },
  { label: 'On Hold', value: 2, icon: PauseCircle, tone: 'text-red-600' },
  { label: 'Confirmed', value: 12, icon: CheckCircle2, tone: 'text-green-600' }
];

const shipmentStages = [
  { label: 'Pickup', value: 10 },
  { label: 'At Origin Port', value: 18 },
  { label: 'In Progress', value: 25 },
  { label: 'At Destination Port', value: 30 },
  { label: 'Delivery In Progress', value: 22 },
  { label: 'Completed', value: 15 }
];

const activeShipmentCount = shipmentStages.reduce((total, stage) => total + stage.value, 0);
const busiestStage = Math.max(...shipmentStages.map((stage) => stage.value));

/* The reference dashboard shows a short "Favourites" list rather than the
   full grid — the first few shipments stand in for a starred selection. */
const favourites = mockShipments.slice(0, 5);

const lastEventFor = (status: string) => {
  switch (status) {
    case 'Delivered':
      return { label: 'Delivered', className: 'text-green-600' };
    case 'Delayed':
      return { label: 'Delayed', className: 'text-red-600' };
    case 'Pending':
      return { label: 'Awaiting Pickup', className: 'text-amber-600' };
    default:
      return { label: 'In Transit', className: 'text-brand-600' };
  }
};

const transportIcon = (mode: string) => {
  switch (mode.toLowerCase()) {
    case 'air':
      return Plane;
    case 'road':
      return Truck;
    default:
      return Ship;
  }
};

/** Card shell with the standard hairline header, so every panel lines up. */
const Panel: React.FC<{
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  bodyClassName?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ title, icon: Icon, action, bodyClassName = 'p-4', className = '', children }) => (
  <section className={`card flex flex-col ${className}`}>
    <header className="px-4 py-3 border-b border-surface-line flex items-center justify-between gap-3 flex-wrap">
      <h2 className="card-title">
        <Icon className="w-4 h-4 text-navy-600" />
        {title}
      </h2>
      {action}
    </header>
    <div className={`flex-1 ${bodyClassName}`}>{children}</div>
  </section>
);

const MetricTile: React.FC<{ tile: Tile }> = ({ tile }) => {
  const Icon = tile.icon;
  return (
    <div className="tile border border-transparent hover:border-surface-line transition-colors duration-150">
      <span className="tile-icon">
        <Icon className={`w-4 h-4 ${tile.tone}`} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="tile-label truncate">{tile.label}</p>
        <p className="tile-value">{tile.value}</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onViewShipments, onNewBooking }) => {
  return (
    <div className="page space-y-4">
      {/* Page header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-field text-gray-500 mt-0.5">
            {activeShipmentCount} shipments moving right now
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <CalendarDays className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select className="select-field w-[170px] pl-9" defaultValue="30">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <button onClick={onNewBooking} className="btn-primary">
            <Plus className="w-4 h-4" />
            New Booking
          </button>
        </div>
      </div>

      {/* Date updates + Booking — 4/8 split keeps both panels the same height */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <Panel title="Date Updates" icon={CalendarDays} className="lg:col-span-4">
          <div className="grid gap-3 h-full content-start">
            {dateUpdates.map((tile) => (
              <MetricTile key={tile.label} tile={tile} />
            ))}
          </div>
        </Panel>

        <Panel title="Booking" icon={Package} className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {bookingTiles.map((tile) => (
              <MetricTile key={tile.label} tile={tile} />
            ))}
          </div>
        </Panel>
      </div>

      {/* Active shipments */}
      <Panel
        title={`${activeShipmentCount} Active Shipments`}
        icon={Package}
        bodyClassName=""
        action={
          <button onClick={onViewShipments} className="btn-ghost">
            View all
          </button>
        }
      >
        {/* WorldMap sizes itself (own toolbar + h-80 canvas); pinning a height
            here made it overflow and cover the status strip below. */}
        <div className="[&>div]:rounded-none [&>div]:shadow-none">
          <WorldMap />
        </div>

        <div className="status-strip grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {shipmentStages.map((stage) => (
            <button
              key={stage.label}
              onClick={onViewShipments}
              className="status-cell items-stretch text-left hover:bg-surface-head transition-colors duration-150"
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="status-cell-label">{stage.label}</span>
                <span className="status-cell-value">{stage.value}</span>
              </span>
              {/* Share of the busiest stage — turns six numbers into a shape */}
              <span className="block h-1 rounded-full bg-surface-soft overflow-hidden mt-1.5">
                <span
                  className="block h-full rounded-full bg-navy-700"
                  style={{ width: `${Math.round((stage.value / busiestStage) * 100)}%` }}
                />
              </span>
            </button>
          ))}
        </div>
      </Panel>

      {/* Favourites */}
      <Panel
        title="Favourites"
        icon={Star}
        bodyClassName=""
        action={
          <div className="flex items-center gap-2">
            <select className="select-field w-[150px]" defaultValue="">
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
            <button className="btn-secondary">
              <SlidersHorizontal className="w-4 h-4" />
              Sort
            </button>
            <button className="btn-secondary">
              <Search className="w-4 h-4" />
              Filters
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-10" />
                <th>Shipment No.</th>
                <th>Shipper</th>
                <th>Consignee</th>
                <th>Transport Mode</th>
                <th>Last Event</th>
              </tr>
            </thead>
            <tbody>
              {favourites.map((shipment) => {
                const event = lastEventFor(shipment.status);
                const Mode = transportIcon(shipment.transport);
                return (
                  <tr key={shipment.shipmentNo} className="cursor-pointer" onClick={onViewShipments}>
                    <td className="text-center">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline" />
                    </td>
                    <td className="font-medium text-navy-900 whitespace-nowrap">{shipment.shipmentNo}</td>
                    <td className="max-w-[220px] truncate">{shipment.shipper}</td>
                    <td className="max-w-[220px] truncate">{shipment.consignee}</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <Mode className="w-3.5 h-3.5 text-gray-400" />
                        {shipment.transport}
                      </span>
                    </td>
                    <td className={`font-medium whitespace-nowrap ${event.className}`}>{event.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};

export default Dashboard;
