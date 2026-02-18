import { Schedule, CargoDetails, QuotationCharge, ContainerType } from '../types/quotation';

const USD_TO_INR = 84;

interface SurchargeRule {
  code: string;
  name: string;
  getAmount: (schedule: Schedule, containerType: ContainerType) => number;
  currency: string;
  perUnit: 'PER_CONTAINER' | 'PER_BL' | 'PER_KG' | 'PER_CBM';
  isMandatory: boolean;
  appliesTo: (schedule: Schedule) => boolean;
}

const SURCHARGE_RULES: SurchargeRule[] = [
  {
    code: 'BAF', name: 'Bunker Adjustment Factor',
    getAmount: (s) => {
      const table: Record<string, number> = {
        NLRTM: 180, DEHAM: 190, GBFXT: 195, BEANR: 188, FRFOS: 192,
        AEDXB: 80, SAJED: 70, EGPSD: 95,
        SGSIN: 60, MYPKG: 65, CNSHA: 120, CNNBO: 120, KRPUS: 130,
        USLAX: 280, USNYC: 290, USHOU: 285,
        NLRTM_IMP: 185, DEHAM_IMP: 195,
      };
      const dest = s.direction === 'export' ? s.destinationPort : s.originPort;
      return table[dest] || 100;
    },
    currency: 'USD', perUnit: 'PER_CONTAINER', isMandatory: true,
    appliesTo: (s) => s.mode !== 'air',
  },
  {
    code: 'CAF', name: 'Currency Adjustment Factor',
    getAmount: () => 50,
    currency: 'USD', perUnit: 'PER_CONTAINER', isMandatory: true,
    appliesTo: (s) => s.mode !== 'air',
  },
  {
    code: 'EBS', name: 'Emergency Bunker Surcharge',
    getAmount: (_, ct) => ct === '20GP' ? 50 : ct === '40GP' ? 80 : 85,
    currency: 'USD', perUnit: 'PER_CONTAINER', isMandatory: true,
    appliesTo: (s) => s.mode !== 'air',
  },
  {
    code: 'ISPS', name: 'Port Security Charge',
    getAmount: (_, ct) => ct === '20GP' ? 25 : 35,
    currency: 'USD', perUnit: 'PER_CONTAINER', isMandatory: true,
    appliesTo: (s) => s.mode !== 'air',
  },
  {
    code: 'AMS', name: 'Automated Manifest System Fee',
    getAmount: () => 35,
    currency: 'USD', perUnit: 'PER_BL', isMandatory: true,
    appliesTo: (s) => {
      const usaPorts = ['USLAX', 'USNYC', 'USHOU'];
      return usaPorts.includes(s.destinationPort) || usaPorts.includes(s.originPort);
    },
  },
  {
    code: 'ENS', name: 'Entry Notification System Fee',
    getAmount: () => 25,
    currency: 'USD', perUnit: 'PER_BL', isMandatory: true,
    appliesTo: (s) => {
      const euPorts = ['NLRTM', 'DEHAM', 'GBFXT', 'BEANR', 'FRFOS', 'ITGOA'];
      return euPorts.includes(s.destinationPort) || euPorts.includes(s.originPort);
    },
  },
  {
    code: 'WRS', name: 'War Risk Surcharge',
    getAmount: (_, ct) => ct === '20GP' ? 40 : 60,
    currency: 'USD', perUnit: 'PER_CONTAINER', isMandatory: true,
    appliesTo: (s) => {
      const warRiskPorts = ['SAJED', 'EGPSD', 'AEDXB'];
      return warRiskPorts.includes(s.destinationPort) || warRiskPorts.includes(s.originPort);
    },
  },
  {
    code: 'FSC', name: 'Fuel Surcharge (Air)',
    getAmount: (_, __, ) => 0.85,
    currency: 'USD', perUnit: 'PER_KG', isMandatory: true,
    appliesTo: (s) => s.mode === 'air',
  },
  {
    code: 'SCC', name: 'Security Surcharge (Air)',
    getAmount: () => 0.30,
    currency: 'USD', perUnit: 'PER_KG', isMandatory: true,
    appliesTo: (s) => s.mode === 'air',
  },
  {
    code: 'AWB', name: 'Air Waybill Fee',
    getAmount: () => 50,
    currency: 'USD', perUnit: 'PER_BL', isMandatory: true,
    appliesTo: (s) => s.mode === 'air',
  },
];

interface LocalChargeRule {
  code: string;
  name: string;
  direction: 'origin' | 'destination';
  getAmount: (containerType: ContainerType) => number;
  currency: string;
  perUnit: 'PER_CONTAINER' | 'PER_BL' | 'PER_KG' | 'PER_CBM';
  isMandatory: boolean;
  appliesTo: (port: string) => boolean;
}

const LOCAL_CHARGE_RULES: LocalChargeRule[] = [
  {
    code: 'THC_O', name: 'Terminal Handling Charge (Origin)',
    direction: 'origin',
    getAmount: (ct) => {
      const rates: Record<ContainerType, number> = { '20GP': 9500, '40GP': 15000, '40HC': 16000, '45HC': 17000, LCL: 4500, AIR: 0 };
      return rates[ct] || 9500;
    },
    currency: 'INR', perUnit: 'PER_CONTAINER', isMandatory: true,
    appliesTo: (port) => ['INNSA', 'INMAA', 'INMUN', 'INKOL', 'INPIP', 'INHZD', 'INVTZ', 'INCOK', 'INBOM'].includes(port),
  },
  {
    code: 'BLF', name: 'Bill of Lading / Airway Bill Fee',
    direction: 'origin',
    getAmount: () => 3500,
    currency: 'INR', perUnit: 'PER_BL', isMandatory: true,
    appliesTo: (port) => ['INNSA', 'INMAA', 'INMUN', 'INKOL', 'INPIP', 'INHZD', 'INVTZ', 'INCOK', 'INBOM', 'INDEL', 'INBLR', 'INMAA', 'INHYD', 'INCCU', 'INAMD', 'INCOK'].includes(port),
  },
  {
    code: 'DOC', name: 'Documentation Fee',
    direction: 'origin',
    getAmount: () => 1200,
    currency: 'INR', perUnit: 'PER_BL', isMandatory: true,
    appliesTo: (port) => ['INNSA', 'INMAA', 'INMUN', 'INKOL', 'INPIP', 'INHZD', 'INVTZ', 'INCOK', 'INBOM', 'INDEL', 'INBLR', 'INMAA', 'INHYD', 'INCCU', 'INAMD', 'INCOK'].includes(port),
  },
  {
    code: 'VGM', name: 'VGM Weighing Fee',
    direction: 'origin',
    getAmount: () => 500,
    currency: 'INR', perUnit: 'PER_CONTAINER', isMandatory: false,
    appliesTo: (port) => ['INNSA', 'INMAA', 'INMUN', 'INKOL', 'INPIP', 'INHZD', 'INVTZ', 'INCOK', 'INBOM'].includes(port),
  },
  {
    code: 'SEAL', name: 'Seal Charges',
    direction: 'origin',
    getAmount: () => 200,
    currency: 'INR', perUnit: 'PER_CONTAINER', isMandatory: false,
    appliesTo: (port) => ['INNSA', 'INMAA', 'INMUN', 'INKOL', 'INPIP', 'INHZD', 'INVTZ', 'INCOK', 'INBOM'].includes(port),
  },
  {
    code: 'AHC_O', name: 'Airport Handling Charge (Origin)',
    direction: 'origin',
    getAmount: () => 0,
    currency: 'INR', perUnit: 'PER_KG', isMandatory: true,
    appliesTo: (port) => ['INBOM', 'INDEL', 'INBLR', 'INMAA', 'INHYD', 'INCCU', 'INAMD', 'INCOK'].includes(port),
  },
  {
    code: 'THC_D', name: 'Terminal Handling Charge (Destination)',
    direction: 'destination',
    getAmount: (ct) => {
      const rates: Record<ContainerType, number> = { '20GP': 150, '40GP': 250, '40HC': 270, '45HC': 290, LCL: 80, AIR: 0 };
      return rates[ct] || 150;
    },
    currency: 'USD', perUnit: 'PER_CONTAINER', isMandatory: true,
    appliesTo: () => true,
  },
  {
    code: 'AHC_D', name: 'Airport Handling Charge (Destination)',
    direction: 'destination',
    getAmount: () => 0,
    currency: 'USD', perUnit: 'PER_KG', isMandatory: true,
    appliesTo: () => true,
  },
];

function getInrEquivalent(amount: number, currency: string): number {
  if (currency === 'INR') return amount;
  return amount * USD_TO_INR;
}

export function computeCharges(schedule: Schedule, cargo: CargoDetails): QuotationCharge[] {
  const charges: QuotationCharge[] = [];
  const { containerType, quantity, weightKg } = cargo;
  const mode = schedule.mode;

  const freightRate = schedule.freightRates.find(r => r.containerType === containerType);
  if (freightRate) {
    let freightQty = quantity;
    let freightUnit = freightRate.amount;
    let chargeName = mode === 'air' ? 'Air Freight' : 'Ocean Freight';

    if (mode === 'air') {
      freightQty = weightKg;
      chargeName = 'Air Freight';
    } else if (containerType === 'LCL') {
      freightQty = cargo.volumeCbm;
      chargeName = 'LCL Freight';
    }

    charges.push({
      type: 'freight',
      code: mode === 'air' ? 'AF' : 'OF',
      name: chargeName,
      quantity: freightQty,
      unitPrice: freightUnit,
      currency: freightRate.currency,
      total: freightUnit * freightQty,
      isMandatory: true,
    });
  }

  for (const rule of SURCHARGE_RULES) {
    if (!rule.appliesTo(schedule)) continue;

    let qty = 1;
    let unitPrice = 0;

    if (rule.perUnit === 'PER_CONTAINER') {
      unitPrice = rule.getAmount(schedule, containerType);
      qty = containerType === 'AIR' ? 1 : containerType === 'LCL' ? 1 : quantity;
    } else if (rule.perUnit === 'PER_BL') {
      unitPrice = rule.getAmount(schedule, containerType);
      qty = 1;
    } else if (rule.perUnit === 'PER_KG') {
      unitPrice = rule.getAmount(schedule, containerType);
      qty = weightKg;
    } else if (rule.perUnit === 'PER_CBM') {
      unitPrice = rule.getAmount(schedule, containerType);
      qty = cargo.volumeCbm;
    }

    if (unitPrice > 0 || qty > 0) {
      charges.push({
        type: 'surcharge',
        code: rule.code,
        name: rule.name,
        quantity: qty,
        unitPrice,
        currency: rule.currency,
        total: unitPrice * qty,
        isMandatory: rule.isMandatory,
      });
    }
  }

  const originPort = schedule.direction === 'export' ? schedule.originPort : schedule.destinationPort;
  const destPort = schedule.direction === 'export' ? schedule.destinationPort : schedule.originPort;

  for (const rule of LOCAL_CHARGE_RULES) {
    const port = rule.direction === 'origin' ? originPort : destPort;
    if (!rule.appliesTo(port)) continue;

    if (mode === 'air' && rule.code === 'THC_O') continue;
    if (mode === 'air' && rule.code === 'THC_D') continue;
    if (mode !== 'air' && rule.code === 'AHC_O') continue;
    if (mode !== 'air' && rule.code === 'AHC_D') continue;
    if (mode !== 'sea_fcl' && rule.code === 'VGM') continue;
    if (mode !== 'sea_fcl' && rule.code === 'SEAL') continue;

    let qty = 1;
    let unitPrice = rule.getAmount(containerType);

    if (rule.code === 'AHC_O') {
      unitPrice = 35;
      qty = weightKg;
    } else if (rule.code === 'AHC_D') {
      unitPrice = 0.12;
      qty = weightKg;
    } else if (rule.perUnit === 'PER_CONTAINER') {
      qty = containerType === 'AIR' ? 1 : containerType === 'LCL' ? 1 : quantity;
    }

    const chargeType = rule.direction === 'origin' ? 'local_origin' : 'local_destination';

    charges.push({
      type: chargeType,
      code: rule.code,
      name: rule.name,
      quantity: qty,
      unitPrice,
      currency: rule.currency,
      total: unitPrice * qty,
      isMandatory: rule.isMandatory,
    });
  }

  return charges;
}

export function computeTotals(charges: QuotationCharge[]) {
  let totalFreight = 0;
  let totalSurcharges = 0;
  let totalLocalOrigin = 0;
  let totalLocalDestination = 0;

  for (const c of charges) {
    const amountUsd = c.currency === 'INR' ? c.total / USD_TO_INR : c.total;
    if (c.type === 'freight') totalFreight += amountUsd;
    else if (c.type === 'surcharge') totalSurcharges += amountUsd;
    else if (c.type === 'local_origin') totalLocalOrigin += c.total / (c.currency === 'INR' ? USD_TO_INR : 1);
    else if (c.type === 'local_destination') totalLocalDestination += amountUsd;
  }

  const totalAmountUsd = totalFreight + totalSurcharges + totalLocalOrigin + totalLocalDestination;
  const totalAmountInr = totalAmountUsd * USD_TO_INR;

  return {
    totalFreight,
    totalSurcharges,
    totalLocalOrigin,
    totalLocalDestination,
    totalAmountUsd,
    totalAmountInr,
  };
}

export function getMinRate(schedule: Schedule): { amount: number; currency: string; containerType: string } {
  if (schedule.freightRates.length === 0) return { amount: 0, currency: 'USD', containerType: '' };
  const sorted = [...schedule.freightRates].sort((a, b) => a.amount - b.amount);
  return { amount: sorted[0].amount, currency: sorted[0].currency, containerType: sorted[0].containerType };
}

export { USD_TO_INR };
