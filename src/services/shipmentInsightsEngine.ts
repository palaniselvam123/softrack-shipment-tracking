import { SupabaseShipment } from '../lib/supabase';

export interface RiskFactor {
  label: string;
  score: number;
  level: 'low' | 'moderate' | 'high' | 'critical';
  detail: string;
}

export interface ActionItem {
  priority: 'urgent' | 'high' | 'medium' | 'low';
  action: string;
  rationale: string;
  category: 'operations' | 'finance' | 'customer' | 'compliance';
}

export interface FinancialMetrics {
  estimatedExposure: string;
  demurrageRisk: string;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  insight: string;
}

export interface TradeLaneInsight {
  congestionLevel: 'low' | 'moderate' | 'high';
  seasonalRisk: 'low' | 'moderate' | 'high';
  complexity: 'direct' | 'moderate' | 'complex';
  points: string[];
}

export interface BriefItem {
  icon: string;
  label: string;
  value: string;
  accent?: 'green' | 'amber' | 'red' | 'blue' | 'cyan' | 'slate';
}

export interface CEOInsights {
  confidenceScore: number;
  confidenceTrend: 'improving' | 'stable' | 'declining';
  summary: string;
  briefItems: BriefItem[];
  origin: string;
  destination: string;
  riskFactors: RiskFactor[];
  financial: FinancialMetrics;
  tradeLane: TradeLaneInsight;
  actions: ActionItem[];
}

const CONGESTED_PORTS = [
  'nhava sheva', 'shanghai', 'los angeles', 'long beach', 'rotterdam',
  'singapore', 'felixstowe', 'savannah', 'yantian', 'ningbo'
];
const MODERATE_PORTS = [
  'hamburg', 'jebel ali', 'dubai', 'santos', 'colombo', 'antwerp',
  'busan', 'new york', 'chennai', 'kolkata', 'mundra', 'kandla'
];

function portCongestion(loc: string | null): 'low' | 'moderate' | 'high' {
  if (!loc) return 'low';
  const l = loc.toLowerCase();
  if (CONGESTED_PORTS.some(p => l.includes(p))) return 'high';
  if (MODERATE_PORTS.some(p => l.includes(p))) return 'moderate';
  return 'low';
}

function seasonalAnalysis(etd: string | null, origin: string | null, dest: string | null) {
  if (!etd) return { level: 'low' as const, reason: 'Departure date pending — seasonal risk unassessed' };
  const m = new Date(etd).getMonth();
  const locs = `${origin || ''} ${dest || ''}`.toLowerCase();

  if (m >= 8 && m <= 10)
    return { level: 'high' as const, reason: 'Q4 peak season drives container premiums and space constraints across major trade lanes' };
  if (m <= 1)
    return { level: 'high' as const, reason: 'Post-holiday restocking and Chinese New Year create booking surges and capacity tightening' };
  if (m >= 5 && m <= 8 && (locs.includes('india') || locs.includes('mh') || locs.includes('mumbai') || locs.includes('nhava') || locs.includes('chennai')))
    return { level: 'moderate' as const, reason: 'Southwest monsoon impacts South Asian port operations and inland connectivity' };
  if (m >= 5 && m <= 10 && (locs.includes('us') || locs.includes('ny') || locs.includes('houston')))
    return { level: 'moderate' as const, reason: 'Atlantic hurricane corridor active — potential route diversions on Gulf and East Coast' };
  return { level: 'low' as const, reason: 'Standard trading period with normal capacity availability' };
}

function parseDelay(s: SupabaseShipment): number {
  const n = parseInt(s['Delay Days'] || '0', 10);
  return isNaN(n) ? 0 : Math.abs(n);
}

function isLate(s: SupabaseShipment): boolean {
  return s['Late/Early']?.toLowerCase() === 'late';
}

function transitRatio(s: SupabaseShipment): number | null {
  const a = s['Total Transit Days'];
  const e = s['Total Estimated Transit Days'];
  if (!a || !e || e === 0) return null;
  return a / e;
}

function estimateFreightValue(s: SupabaseShipment): number {
  const teu = s['TEU'] || 1;
  const mode = (s['Transport Mode'] || '').toLowerCase();
  if (mode === 'air') return teu * 15000;
  if (mode === 'road') return teu * 3000;
  const dest = (s['Destination'] || '').toLowerCase();
  const orig = (s['Origin'] || '').toLowerCase();
  if ((orig.includes('au') || orig.includes('perth')) && (dest.includes('india') || dest.includes('mh'))) return teu * 4200;
  if (dest.includes('us') || dest.includes('ny') || dest.includes('los angeles')) return teu * 4800;
  if (dest.includes('brazil') || dest.includes('santos')) return teu * 3800;
  if (dest.includes('europe') || dest.includes('germany') || dest.includes('hamburg') || dest.includes('rotterdam')) return teu * 4500;
  return teu * 3500;
}

function estimateDemurrage(delayD: number, mode: string | null): number {
  if (delayD <= 0) return 0;
  const m = (mode || '').toLowerCase();
  if (m === 'air') return delayD * 250;
  if (m === 'road') return delayD * 100;
  if (delayD <= 4) return delayD * 75;
  return 300 + (delayD - 4) * 150;
}

export function deriveOriginDestination(shipment: SupabaseShipment, routes: any[]): { origin: string; destination: string } {
  const sorted = [...routes].sort((a, b) => (a['LegNumber'] || 0) - (b['LegNumber'] || 0));
  const firstLeg = sorted[0];
  const lastLeg = sorted[sorted.length - 1];

  const origin = firstLeg?.['Load Port'] || shipment['Origin'] || null;
  const destination = lastLeg?.['Discharge Port'] || shipment['Destination'] || null;

  return { origin: origin || 'Unknown', destination: destination || 'Unknown' };
}

export function computeCEOInsights(shipment: SupabaseShipment, routes: any[] = []): CEOInsights {
  const delay = parseDelay(shipment);
  const late = isLate(shipment);
  const ratio = transitRatio(shipment);
  const transhipments = shipment['Transhipments count'] || 0;
  const mode = shipment['Transport Mode'];

  const derived = deriveOriginDestination(shipment, routes);
  const origin = derived.origin;
  const dest = derived.destination;

  const status = shipment.shipment_status?.toLowerCase() || '';

  let confidence = 82;
  if (late && delay > 0) { confidence -= delay >= 7 ? 25 : delay >= 3 ? 15 : 8; }
  else if (!late && delay > 0) { confidence += 5; }
  if (ratio !== null) { confidence += ratio > 1.3 ? -12 : ratio > 1.1 ? -6 : ratio <= 1.0 ? 4 : 0; }
  if (transhipments >= 3) confidence -= 10; else if (transhipments >= 2) confidence -= 5;

  const origCong = portCongestion(origin);
  const destCong = portCongestion(dest);
  if (origCong === 'high') confidence -= 6; else if (origCong === 'moderate') confidence -= 3;
  if (destCong === 'high') confidence -= 6; else if (destCong === 'moderate') confidence -= 3;

  const season = seasonalAnalysis(shipment['ETD'], origin, dest);
  if (season.level === 'high') confidence -= 7; else if (season.level === 'moderate') confidence -= 3;

  if (status.includes('delivered') || status.includes('completed')) confidence = 100;
  else if (status.includes('billing')) confidence = Math.max(confidence, 90);
  else if (status.includes('loaded') || status.includes('vessel')) confidence += 5;

  const rolledLegs = routes.filter(r => r.WasRolled).length;
  if (rolledLegs > 0) confidence -= rolledLegs * 5;
  const highWeather = routes.filter(r => (r.WeatherSeverity || 0) >= 7).length;
  if (highWeather > 0) confidence -= highWeather * 4;
  const highCong = routes.filter(r => (r.PortCongestion || 0) >= 7).length;
  if (highCong > 0) confidence -= highCong * 3;

  confidence = Math.max(15, Math.min(100, Math.round(confidence)));

  let trend: CEOInsights['confidenceTrend'] = 'stable';
  if (late && delay >= 3) trend = 'declining';
  else if (!late && delay > 0) trend = 'improving';
  else if (status.includes('billing') || status.includes('delivered')) trend = 'improving';

  const risks: RiskFactor[] = [];
  if (late && delay > 0) {
    const s = Math.min(10, delay);
    risks.push({
      label: 'Transit Delay',
      score: s,
      level: s >= 7 ? 'critical' : s >= 4 ? 'high' : 'moderate',
      detail: `${delay}-day delay on ${mode || 'this'} shipment — ${delay >= 5 ? 'service commitment at risk' : 'recoverable with proactive management'}`
    });
  }

  const worstCong = destCong === 'high' || origCong === 'high' ? 'high' : destCong === 'moderate' || origCong === 'moderate' ? 'moderate' : 'low';
  if (worstCong !== 'low') {
    const congPort = destCong !== 'low' ? dest : origin;
    risks.push({
      label: 'Port Congestion',
      score: worstCong === 'high' ? 7 : 4,
      level: worstCong === 'high' ? 'high' : 'moderate',
      detail: `${congPort} experiencing ${worstCong} vessel queuing — expect ${worstCong === 'high' ? '2-4 day' : '1-2 day'} berthing delays`
    });
  }

  if (season.level !== 'low') {
    risks.push({
      label: 'Seasonal Pressure',
      score: season.level === 'high' ? 7 : 4,
      level: season.level === 'high' ? 'high' : 'moderate',
      detail: season.reason
    });
  }

  if (transhipments >= 2) {
    risks.push({
      label: 'Route Complexity',
      score: transhipments >= 3 ? 7 : 4,
      level: transhipments >= 3 ? 'high' : 'moderate',
      detail: `${transhipments} transhipments increase connection risk — each hub adds 12-24hr potential variance`
    });
  }

  if (rolledLegs > 0) {
    risks.push({
      label: 'Rolled Booking',
      score: 6,
      level: 'high',
      detail: `${rolledLegs} leg${rolledLegs > 1 ? 's' : ''} rolled by carrier — capacity constraints on this corridor`
    });
  }

  if (risks.length === 0) {
    risks.push({ label: 'On Schedule', score: 2, level: 'low', detail: 'Shipment progressing within expected parameters — no significant risk indicators' });
  }
  risks.sort((a, b) => b.score - a.score);

  const freightValue = estimateFreightValue(shipment);
  const demurrage = estimateDemurrage(delay, mode);
  const totalExposure = freightValue + demurrage;

  let impactLevel: FinancialMetrics['impactLevel'] = 'low';
  if (demurrage > 1000 || (late && delay >= 7)) impactLevel = 'critical';
  else if (demurrage > 500 || (late && delay >= 3)) impactLevel = 'high';
  else if (demurrage > 0) impactLevel = 'medium';

  const financial: FinancialMetrics = {
    estimatedExposure: `$${totalExposure.toLocaleString()}`,
    demurrageRisk: demurrage > 0 ? `$${demurrage.toLocaleString()}` : 'Minimal',
    impactLevel,
    insight: demurrage > 500
      ? `Detention charges accruing. Recommend carrier negotiation for free-time extension at ${dest}.`
      : delay > 0 && late
        ? `Moderate cost pressure from ${delay}-day delay. Free-time allocation should absorb if resolved within ${Math.max(1, 4 - delay)} days.`
        : `Freight economics healthy. ${mode === 'Air' ? 'Premium' : 'Standard'} rate structure on this corridor.`
  };

  const complexity: TradeLaneInsight['complexity'] = transhipments >= 3 ? 'complex' : transhipments >= 1 ? 'moderate' : 'direct';
  const lanePoints: string[] = [];
  const origL = (origin || '').toLowerCase();
  const destL = (dest || '').toLowerCase();

  if (origL.includes('india') || origL.includes('mh') || origL.includes('nhava') || destL.includes('india') || destL.includes('mh') || destL.includes('nhava'))
    lanePoints.push('Indian port infrastructure upgrades improving throughput, but peak-season backlogs persist at Nhava Sheva and Mundra');
  if (destL.includes('us') || destL.includes('ny') || destL.includes('los angeles') || origL.includes('us'))
    lanePoints.push('US port labor conditions stable — no major disruption signals on West or East Coast terminals');
  if (destL.includes('europe') || destL.includes('germany') || destL.includes('hamburg') || destL.includes('rotterdam') || destL.includes('netherlands'))
    lanePoints.push('European gateway ports at near-capacity — consider Mediterranean hub routing for faster turnaround');
  if (origL.includes('au') || origL.includes('perth') || origL.includes('australia'))
    lanePoints.push('Australian export volumes trending up — booking lead times extended to 10-14 days on key corridors');
  if (destL.includes('brazil') || destL.includes('santos'))
    lanePoints.push('Brazilian customs clearance averaging 3-5 business days — pre-clearance documentation critical');
  if (destL.includes('dubai') || destL.includes('jebel ali') || origL.includes('dubai'))
    lanePoints.push('Jebel Ali free zone operations efficient — typical dwell time 24-48hrs with proper documentation');
  if (destL.includes('singapore') || origL.includes('singapore'))
    lanePoints.push('Singapore transhipment hub maintaining sub-24hr relay — premium Southeast Asian feeder connectivity');

  const modeL = (mode || '').toLowerCase();
  if (modeL === 'sea') {
    const est = shipment['Total Estimated Transit Days'];
    if (est) lanePoints.push(`Benchmark transit: ${est} days — ${delay > 0 && late ? 'currently above' : 'tracking within'} standard deviation`);
  } else if (modeL === 'air') {
    lanePoints.push('Air cargo capacity adequate — spot rates stable within +/-5% of contracted levels');
  } else if (modeL === 'road') {
    lanePoints.push('Domestic road network conditions normal — toll plazas operating without significant queues');
  }

  if (lanePoints.length === 0) lanePoints.push(`${origin || 'Origin'} to ${dest || 'Destination'} corridor operating within normal parameters`);

  const tradeLane: TradeLaneInsight = {
    congestionLevel: worstCong === 'high' ? 'high' : worstCong === 'moderate' ? 'moderate' : 'low',
    seasonalRisk: season.level,
    complexity,
    points: lanePoints.slice(0, 4)
  };

  const actions: ActionItem[] = [];
  if (late && delay >= 5) {
    actions.push({ priority: 'urgent', action: `Escalate to carrier ops for recovery plan on ${shipment['Shipment Number']}`, rationale: `${delay}-day delay breaching service threshold. Carrier accountability needed for root cause and corrective timeline.`, category: 'operations' });
  }
  if (late && delay >= 3) {
    actions.push({ priority: 'high', action: `Issue proactive advisory to ${shipment['Consignee'] || 'consignee'} with revised delivery window`, rationale: 'Customer expects transparency. Early communication preserves relationship and allows downstream planning.', category: 'customer' });
  }
  if (demurrage > 0 && late) {
    actions.push({ priority: 'high', action: 'Negotiate demurrage waiver or free-time extension with terminal', rationale: `Estimated detention exposure of ${financial.demurrageRisk}. Proactive negotiation typically recovers 40-60% of charges.`, category: 'finance' });
  }
  if (destCong === 'high') {
    actions.push({ priority: 'medium', action: `Pre-book haulage and CFS slot at ${dest} to minimize port dwell`, rationale: 'High congestion at destination. Pre-arranged logistics prevent cascading delays post-discharge.', category: 'operations' });
  }
  if (transhipments >= 2) {
    actions.push({ priority: 'medium', action: 'Monitor transhipment connections and set milestone alerts', rationale: `${transhipments} relay points create connection risk. Automated alerts enable early intervention.`, category: 'operations' });
  }
  if (season.level === 'high') {
    actions.push({ priority: 'medium', action: 'Confirm space allocation for follow-on shipments in this corridor', rationale: 'Peak season capacity tightening. Forward booking protects against rate spikes and rollover.', category: 'operations' });
  }
  const direction = (shipment['Direction'] || shipment['Shipment Type'] || '').toLowerCase();
  if (direction.includes('export') || direction.includes('import')) {
    actions.push({ priority: 'medium', action: `Verify customs documentation for ${direction.includes('export') ? 'export' : 'import'} clearance at ${direction.includes('export') ? dest : origin}`, rationale: 'Documentation gaps are the leading cause of clearance delays — pre-validation saves 2-3 days.', category: 'compliance' });
  }
  if (actions.length === 0) {
    actions.push({ priority: 'low', action: 'Standard monitoring — no intervention required', rationale: 'Shipment tracking within normal parameters. Next checkpoint at departure/arrival milestone.', category: 'operations' });
  }
  const pOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  actions.sort((a, b) => pOrder[a.priority] - pOrder[b.priority]);

  let summary = `${shipment['Shipment Number']} — ${(mode || 'freight').toLowerCase()} movement from ${origin || 'origin'} to ${dest || 'destination'}`;
  if (shipment['Shipper']) summary += ` for ${shipment['Shipper']}`;
  summary += `. Delivery confidence at ${confidence}%`;
  if (late && delay > 0) summary += `, with a ${delay}-day delay ${delay >= 5 ? 'requiring immediate attention' : 'that remains recoverable'}`;
  else if (!late && delay > 0) summary += `, tracking ${delay} day${delay > 1 ? 's' : ''} ahead of schedule`;
  else summary += `, tracking on schedule`;
  if (shipment['TEU']) summary += `. ${shipment['TEU']} TEU cargo valued at approximately ${financial.estimatedExposure}`;
  if (season.level === 'high') summary += `. Note: ${season.reason.split(' — ')[0].toLowerCase()}`;
  summary += '.';
  if (confidence >= 80) summary += ' No critical interventions needed — maintain standard monitoring cadence.';
  else if (confidence >= 60) summary += ` Recommend heightened monitoring with ${actions.filter(a => a.priority === 'urgent' || a.priority === 'high').length} priority action(s) flagged.`;
  else summary += ' This shipment requires executive attention — multiple risk factors converging.';

  const briefItems: BriefItem[] = [];

  briefItems.push({
    icon: 'route',
    label: 'Trade Route',
    value: `${origin || 'Origin'} → ${dest || 'Destination'}`,
    accent: 'cyan'
  });

  briefItems.push({
    icon: 'ship',
    label: 'Transport',
    value: `${(mode || 'Freight').charAt(0).toUpperCase() + (mode || 'freight').slice(1)} ${shipment['Direction'] ? `(${shipment['Direction']})` : ''}`.trim(),
    accent: 'blue'
  });

  if (shipment['Shipper']) {
    briefItems.push({
      icon: 'building',
      label: 'Shipper',
      value: shipment['Shipper'],
      accent: 'slate'
    });
  }

  briefItems.push({
    icon: 'gauge',
    label: 'Delivery Confidence',
    value: `${confidence}% — ${trend === 'improving' ? 'Trending upward' : trend === 'declining' ? 'Trending downward' : 'Holding steady'}`,
    accent: confidence >= 80 ? 'green' : confidence >= 60 ? 'amber' : 'red'
  });

  if (late && delay > 0) {
    briefItems.push({
      icon: 'clock',
      label: 'Schedule Status',
      value: `${delay}-day delay ${delay >= 5 ? '— requires immediate attention' : '— recoverable with proactive management'}`,
      accent: delay >= 5 ? 'red' : 'amber'
    });
  } else if (!late && delay > 0) {
    briefItems.push({
      icon: 'clock',
      label: 'Schedule Status',
      value: `${delay} day${delay > 1 ? 's' : ''} ahead of schedule`,
      accent: 'green'
    });
  } else {
    briefItems.push({
      icon: 'clock',
      label: 'Schedule Status',
      value: 'On schedule — tracking within expected parameters',
      accent: 'green'
    });
  }

  if (shipment['TEU']) {
    briefItems.push({
      icon: 'package',
      label: 'Cargo',
      value: `${shipment['TEU']} TEU valued at approximately ${financial.estimatedExposure}`,
      accent: 'slate'
    });
  }

  if (season.level !== 'low') {
    briefItems.push({
      icon: 'calendar',
      label: 'Seasonal Alert',
      value: season.reason,
      accent: season.level === 'high' ? 'red' : 'amber'
    });
  }

  if (worstCong !== 'low') {
    const congPort = destCong !== 'low' ? dest : origin;
    briefItems.push({
      icon: 'anchor',
      label: 'Port Congestion',
      value: `${congPort} experiencing ${worstCong} vessel queuing — expect berthing delays`,
      accent: worstCong === 'high' ? 'red' : 'amber'
    });
  }

  if (confidence >= 80) {
    briefItems.push({
      icon: 'check',
      label: 'Assessment',
      value: 'No critical interventions needed — maintain standard monitoring cadence',
      accent: 'green'
    });
  } else if (confidence >= 60) {
    const urgentCount = actions.filter(a => a.priority === 'urgent' || a.priority === 'high').length;
    briefItems.push({
      icon: 'alert',
      label: 'Assessment',
      value: `Heightened monitoring recommended — ${urgentCount} priority action(s) flagged`,
      accent: 'amber'
    });
  } else {
    briefItems.push({
      icon: 'alert',
      label: 'Assessment',
      value: 'Executive attention required — multiple risk factors converging',
      accent: 'red'
    });
  }

  return {
    confidenceScore: confidence,
    confidenceTrend: trend,
    summary,
    briefItems,
    origin: origin || 'Unknown',
    destination: dest || 'Unknown',
    riskFactors: risks,
    financial,
    tradeLane,
    actions
  };
}
