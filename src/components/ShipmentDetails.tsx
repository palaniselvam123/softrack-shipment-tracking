interface RouteLeg {
  load_port?: string;
  discharge_port?: string;
  origin?: string;
  destination?: string;
  ["Load Port"]?: string;
  ["Discharge Port"]?: string;
}

interface Props {
  shipment: any;
  routes: RouteLeg[];
}

function getRouteSummary(routes: RouteLeg[]) {
  if (!routes || routes.length === 0) {
    return "N/A → N/A";
  }

  const first = routes[0];
  const last = routes[routes.length - 1];

  const origin =
    first.load_port ||
    first.origin ||
    first["Load Port"] ||
    "N/A";

  const destination =
    last.discharge_port ||
    last.destination ||
    last["Discharge Port"] ||
    "N/A";

  return `${origin} → ${destination}`;
}

export default function ShipmentDetails({ shipment, routes }: Props) {
  const routeText = getRouteSummary(routes);

  return (
    <div className="border rounded-lg bg-white p-4">
      <h3 className="font-semibold mb-3">Shipment Details</h3>

      <div className="grid grid-cols-2 gap-y-3 text-sm">
        <div className="text-slate-500">Route</div>
        <div className="font-medium">{routeText}</div>

        <div className="text-slate-500">Type</div>
        <div>{shipment?.type ?? "N/A"}</div>

        <div className="text-slate-500">Shipper</div>
        <div>{shipment?.shipper ?? "N/A"}</div>

        <div className="text-slate-500">Consignee</div>
        <div>{shipment?.consignee ?? "N/A"}</div>

        <div className="text-slate-500">Primary Mode</div>
        <div>{shipment?.primary_mode ?? "N/A"}</div>
      </div>
    </div>
  );
}
