export interface MilestoneTemplate {
  name: string;
  order: number;
}

export const SEA_EXPORT_MILESTONES: MilestoneTemplate[] = [
  { name: 'Booking Confirmed', order: 1 },
  { name: 'Cargo Received at CFS', order: 2 },
  { name: 'Container Stuffing Complete', order: 3 },
  { name: 'VGM Filed', order: 4 },
  { name: 'Customs Clearance (Origin)', order: 5 },
  { name: 'Loaded on Vessel', order: 6 },
  { name: 'Bill of Lading Issued', order: 7 },
  { name: 'Vessel Departed', order: 8 },
  { name: 'In Transit', order: 9 },
  { name: 'Arrived at Destination Port', order: 10 },
  { name: 'Customs Clearance (Destination)', order: 11 },
  { name: 'Delivered to Consignee', order: 12 },
];

export const AIR_EXPORT_MILESTONES: MilestoneTemplate[] = [
  { name: 'Booking Confirmed', order: 1 },
  { name: 'Cargo Received at Warehouse', order: 2 },
  { name: 'Documents Prepared', order: 3 },
  { name: 'Customs Clearance (Origin)', order: 4 },
  { name: 'Loaded on Aircraft', order: 5 },
  { name: 'AWB Issued', order: 6 },
  { name: 'Aircraft Departed', order: 7 },
  { name: 'In Transit', order: 8 },
  { name: 'Arrived at Destination Airport', order: 9 },
  { name: 'Customs Clearance (Destination)', order: 10 },
  { name: 'Delivered to Consignee', order: 11 },
];

export const AIR_IMPORT_MILESTONES: MilestoneTemplate[] = [
  { name: 'Purchase Order Confirmed', order: 1 },
  { name: 'Booking Confirmed by Origin', order: 2 },
  { name: 'Cargo Loaded at Origin', order: 3 },
  { name: 'AWB Received', order: 4 },
  { name: 'Aircraft Departed', order: 5 },
  { name: 'In Transit', order: 6 },
  { name: 'Arrived at Destination Airport', order: 7 },
  { name: 'Customs Documentation Filed', order: 8 },
  { name: 'Customs Clearance', order: 9 },
  { name: 'Cargo Released', order: 10 },
  { name: 'Delivered to Warehouse', order: 11 },
];

export const ROAD_DOMESTIC_MILESTONES: MilestoneTemplate[] = [
  { name: 'Order Received', order: 1 },
  { name: 'Vehicle Assigned', order: 2 },
  { name: 'Cargo Loaded', order: 3 },
  { name: 'Dispatch Confirmed', order: 4 },
  { name: 'In Transit', order: 5 },
  { name: 'Checkpoint Crossed', order: 6 },
  { name: 'Arrived at Destination Hub', order: 7 },
  { name: 'Out for Delivery', order: 8 },
  { name: 'Delivered', order: 9 },
];

export type LOB = 'Sea Export' | 'Air Export' | 'Air Import' | 'Road Domestic';

export function detectLOB(shipmentNumber: string): LOB {
  const parts = shipmentNumber.split('/');
  if (parts.length >= 2) {
    const code = parts[1].toUpperCase();
    if (code === 'SE') return 'Sea Export';
    if (code === 'AE') return 'Air Export';
    if (code === 'AI') return 'Air Import';
    if (code === 'LE') return 'Road Domestic';
  }
  return 'Sea Export';
}

export function getMilestonesForLOB(lob: LOB): MilestoneTemplate[] {
  switch (lob) {
    case 'Sea Export': return SEA_EXPORT_MILESTONES;
    case 'Air Export': return AIR_EXPORT_MILESTONES;
    case 'Air Import': return AIR_IMPORT_MILESTONES;
    case 'Road Domestic': return ROAD_DOMESTIC_MILESTONES;
    default: return SEA_EXPORT_MILESTONES;
  }
}

export interface GeneratedMilestone {
  id: string;
  shipment_number: string;
  lob: LOB;
  milestone_name: string;
  milestone_order: number;
  status: 'completed' | 'skipped' | 'pending';
  completed_date: string | null;
}

function randomDateBetween(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(d: Date): string {
  return d.toISOString();
}

export function generateMilestonesForShipment(
  shipmentNumber: string,
  shipmentStatus?: string | null,
  etd?: string | null,
  eta?: string | null
): GeneratedMilestone[] {
  const lob = detectLOB(shipmentNumber);
  const templates = getMilestonesForLOB(lob);

  const seed = shipmentNumber.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const seededRandom = (i: number) => {
    const x = Math.sin(seed + i * 9301) * 10000;
    return x - Math.floor(x);
  };

  const statusLower = (shipmentStatus || '').toLowerCase();
  let completedCount: number;

  if (statusLower.includes('delivered') || statusLower.includes('completed')) {
    completedCount = templates.length;
  } else if (statusLower.includes('billing')) {
    completedCount = templates.length - 1;
  } else if (statusLower.includes('vessel departed') || statusLower.includes('aircraft departed')) {
    completedCount = Math.ceil(templates.length * 0.65);
  } else if (statusLower.includes('loaded')) {
    completedCount = Math.ceil(templates.length * 0.5);
  } else if (statusLower.includes('transit')) {
    completedCount = Math.ceil(templates.length * 0.7);
  } else if (statusLower.includes('delayed')) {
    completedCount = Math.ceil(templates.length * 0.45);
  } else if (statusLower.includes('pending') || statusLower.includes('planning')) {
    completedCount = Math.ceil(templates.length * 0.15);
  } else if (statusLower.includes('ready') || statusLower.includes('dispatch') || statusLower.includes('export')) {
    completedCount = Math.ceil(templates.length * 0.3);
  } else {
    completedCount = Math.ceil(templates.length * 0.4);
  }

  const skippedIndex = seededRandom(42) > 0.5
    ? Math.floor(seededRandom(99) * Math.min(completedCount, templates.length - 2)) + 1
    : -1;

  const baseDate = etd ? new Date(etd) : new Date('2025-10-01');
  const endDate = eta ? new Date(eta) : new Date('2025-12-15');

  return templates.map((t, i) => {
    let status: 'completed' | 'skipped' | 'pending';
    let completed_date: string | null = null;

    if (i === skippedIndex && i < completedCount) {
      status = 'skipped';
    } else if (i < completedCount) {
      status = 'completed';
      const fraction = i / (templates.length - 1);
      const milestoneDate = new Date(
        baseDate.getTime() + fraction * (endDate.getTime() - baseDate.getTime())
      );
      const jitter = (seededRandom(i) - 0.5) * 2 * 24 * 60 * 60 * 1000;
      milestoneDate.setTime(milestoneDate.getTime() + jitter);
      completed_date = formatDate(milestoneDate);
    } else {
      status = 'pending';
    }

    return {
      id: `ms_${shipmentNumber}_${i}`,
      shipment_number: shipmentNumber,
      lob,
      milestone_name: t.name,
      milestone_order: t.order,
      status,
      completed_date,
    };
  });
}
