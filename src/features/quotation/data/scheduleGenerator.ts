import { Schedule, ScheduleLeg, SearchParams } from '../types/quotation';
import { ROUTE_TEMPLATES, RouteTemplate } from './routeTemplates';
import { getPortByCode } from './ports';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getNextDepartureDates(fromDate: Date, template: RouteTemplate, weeksAhead: number): Date[] {
  const dates: Date[] = [];
  const endDate = addDays(fromDate, weeksAhead * 7);

  let current = new Date(fromDate);
  current.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    const dow = current.getDay();
    if (template.departureDOW.includes(dow)) {
      if (current >= fromDate) {
        dates.push(new Date(current));
      }
    }
    current = addDays(current, 1);
  }

  return dates.slice(0, 20);
}

function generateVoyageNo(template: RouteTemplate, etd: Date): string {
  if (template.mode === 'air' && template.flightNos && template.flightNos.length > 0) {
    const idx = Math.floor(etd.getDate() / 3) % template.flightNos.length;
    return template.flightNos[idx];
  }
  const weekNum = Math.floor((etd.getTime() - new Date(etd.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  return `${template.voyagePrefix}${String(weekNum % 100).padStart(2, '0')}W`;
}

function getVessel(template: RouteTemplate, etd: Date): string {
  if (template.vessels.length === 0) return '';
  const idx = Math.floor(etd.getTime() / (7 * 24 * 60 * 60 * 1000)) % template.vessels.length;
  return template.vessels[idx];
}

function buildLegs(template: RouteTemplate, etd: Date): ScheduleLeg[] {
  const legs: ScheduleLeg[] = [];
  let currentDate = new Date(etd);
  const voyageNo = generateVoyageNo(template, etd);
  const vessel = getVessel(template, etd);

  for (let i = 0; i < template.legs.length; i++) {
    const legConfig = template.legs[i];
    const legEtd = new Date(currentDate);
    const legEta = addDays(legEtd, legConfig.transitDays);

    const fromPort = getPortByCode(legConfig.fromPort);
    const toPort = getPortByCode(legConfig.toPort);

    legs.push({
      legNo: i + 1,
      fromPort: legConfig.fromPort,
      fromPortName: fromPort?.name || legConfig.fromPortName,
      fromCountry: legConfig.fromCountry,
      toPort: legConfig.toPort,
      toPortName: toPort?.name || legConfig.toPortName,
      toCountry: legConfig.toCountry,
      carrierCode: template.carrierCode,
      carrierName: template.carrierName,
      vesselName: template.mode === 'air' ? '' : vessel,
      voyageNo: template.mode === 'air' ? voyageNo : `${voyageNo}${String(i + 1).padStart(2, '0')}`,
      flightNo: template.mode === 'air' ? voyageNo : '',
      etd: legEtd,
      eta: legEta,
      transitDays: legConfig.transitDays,
    });

    currentDate = addDays(legEta, legConfig.stayDays);
  }

  return legs;
}

function formatScheduleNo(template: RouteTemplate, etd: Date): string {
  const dateStr = etd.toISOString().slice(2, 10).replace(/-/g, '');
  const origin = template.originPort.slice(-3);
  const dest = template.destinationPort.slice(-3);
  return `${template.carrierCode}/${origin}/${dest}/${dateStr}`;
}

function templateToSchedule(template: RouteTemplate, etd: Date): Schedule {
  const originPort = getPortByCode(template.originPort);
  const destPort = getPortByCode(template.destinationPort);
  const eta = addDays(etd, template.totalTransitDays);
  const legs = buildLegs(template, etd);
  const voyageNo = generateVoyageNo(template, etd);
  const vessel = getVessel(template, etd);

  let transitPort: string | undefined;
  let transitPortName: string | undefined;
  if (!template.isDirect && template.legs.length > 1) {
    transitPort = template.legs[0].toPort;
    transitPortName = getPortByCode(template.legs[0].toPort)?.name || template.legs[0].toPortName;
  }

  const cutoffDate = addDays(etd, -3);

  return {
    id: `${template.id}-${etd.toISOString().slice(0, 10)}`,
    scheduleNo: formatScheduleNo(template, etd),
    carrierId: template.carrierId,
    carrierName: template.carrierName,
    carrierCode: template.carrierCode,
    carrierColor: getCarrierColor(template.carrierCode),
    mode: template.mode,
    direction: template.direction,
    originPort: template.originPort,
    originPortName: originPort?.name || template.legs[0]?.fromPortName || '',
    originCountry: originPort?.country || template.legs[0]?.fromCountry || '',
    destinationPort: template.destinationPort,
    destinationPortName: destPort?.name || template.legs[template.legs.length - 1]?.toPortName || '',
    destinationCountry: destPort?.country || template.legs[template.legs.length - 1]?.toCountry || '',
    etd,
    eta,
    transitDays: template.totalTransitDays,
    isDirect: template.isDirect,
    transitPort,
    transitPortName,
    legs,
    freightRates: template.freightRates,
    vesselName: template.mode === 'air' ? '' : vessel,
    voyageNo: template.mode === 'air' ? '' : voyageNo,
    flightNo: template.mode === 'air' ? voyageNo : '',
    frequency: template.frequencyDays === 1 ? 'Daily' : template.frequencyDays === 7 ? 'Weekly' : template.frequencyDays === 14 ? 'Bi-Weekly' : 'Every 3-4 Days',
    cutoffDate,
  };
}

function getCarrierColor(code: string): string {
  const colors: Record<string, string> = {
    MSC: '#1a1a1a', MAERSK: '#42B0D5', CMACGM: '#E31837',
    HAPAG: '#F37021', EVERGREEN: '#007A3D', ONE: '#E4007F',
    PIL: '#003087', COSCO: '#1B4F72', AICARGO: '#CC0000',
    EKSKY: '#C71234', LHCARGO: '#05164D', SQCARGO: '#152F5F', INDIGO: '#1B3FA0',
  };
  return colors[code] || '#374151';
}

export function generateSchedules(params: SearchParams): Schedule[] {
  const fromDate = new Date(params.etd);
  fromDate.setHours(0, 0, 0, 0);

  const matchingTemplates = ROUTE_TEMPLATES.filter(rt =>
    rt.originPort === params.originPort &&
    rt.destinationPort === params.destinationPort &&
    rt.mode === params.mode &&
    rt.direction === params.direction
  );

  const schedules: Schedule[] = [];

  for (const template of matchingTemplates) {
    const departureDates = getNextDepartureDates(fromDate, template, 16);
    for (const etd of departureDates) {
      schedules.push(templateToSchedule(template, etd));
    }
  }

  schedules.sort((a, b) => a.etd.getTime() - b.etd.getTime());

  return schedules;
}

export function getAvailableRoutes(mode: 'sea_fcl' | 'sea_lcl' | 'air', direction: 'export' | 'import'): Array<{ origin: string; destination: string }> {
  const routes = new Map<string, { origin: string; destination: string }>();

  ROUTE_TEMPLATES
    .filter(rt => rt.direction === direction && rt.mode === mode)
    .forEach(rt => {
      const key = `${rt.originPort}-${rt.destinationPort}`;
      if (!routes.has(key)) {
        routes.set(key, { origin: rt.originPort, destination: rt.destinationPort });
      }
    });

  return Array.from(routes.values());
}
