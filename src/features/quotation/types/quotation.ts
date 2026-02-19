export interface Port {
  code: string;
  name: string;
  fullName: string;
  country: string;
  countryCode: string;
  type: 'sea' | 'air' | 'both';
  isIndian: boolean;
  region: string;
}

export interface Carrier {
  id: string;
  name: string;
  code: string;
  type: 'shipping_line' | 'airline';
  color: string;
  textColor: string;
}

export interface ScheduleLeg {
  legNo: number;
  fromPort: string;
  fromPortName: string;
  fromCountry: string;
  toPort: string;
  toPortName: string;
  toCountry: string;
  carrierCode: string;
  carrierName: string;
  vesselName: string;
  voyageNo: string;
  flightNo: string;
  etd: Date;
  eta: Date;
  transitDays: number;
}

export type ContainerType = '20GP' | '40GP' | '40HC' | '45HC' | 'LCL' | 'AIR';

export interface FreightRate {
  containerType: ContainerType;
  amount: number;
  currency: string;
  unit: string;
}

export interface Schedule {
  id: string;
  scheduleNo: string;
  carrierId: string;
  carrierName: string;
  carrierCode: string;
  carrierColor: string;
  mode: 'sea_fcl' | 'sea_lcl' | 'air';
  direction: 'export' | 'import';
  originPort: string;
  originPortName: string;
  originCountry: string;
  destinationPort: string;
  destinationPortName: string;
  destinationCountry: string;
  etd: Date;
  eta: Date;
  transitDays: number;
  isDirect: boolean;
  transitPort?: string;
  transitPortName?: string;
  legs: ScheduleLeg[];
  freightRates: FreightRate[];
  vesselName: string;
  voyageNo: string;
  flightNo: string;
  frequency: string;
  cutoffDate?: Date;
}

export interface SearchParams {
  direction: 'export' | 'import';
  mode: 'sea_fcl' | 'sea_lcl' | 'air';
  originPort: string;
  destinationPort: string;
  etd: string;
}

export interface CargoDetails {
  containerType: ContainerType;
  quantity: number;
  commodity: string;
  weightKg: number;
  volumeCbm: number;
  incoterm: string;
  hsCode: string;
  isDangerous: boolean;
  isRefrigerated: boolean;
}

export interface SurchargeData {
  code: string;
  name: string;
  amount: number;
  currency: string;
  perUnit: 'PER_CONTAINER' | 'PER_BL' | 'PER_CBM' | 'PER_KG' | 'FLAT';
  isMandatory: boolean;
  appliesTo?: string[];
}

export interface LocalChargeData {
  code: string;
  name: string;
  amount: number;
  currency: string;
  perUnit: 'PER_CONTAINER' | 'PER_BL' | 'PER_CBM' | 'PER_KG' | 'FLAT';
  direction: 'origin' | 'destination';
  isMandatory: boolean;
  appliesTo?: ContainerType[];
}

export interface QuotationCharge {
  type: 'freight' | 'surcharge' | 'local_origin' | 'local_destination';
  code: string;
  name: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  total: number;
  isMandatory: boolean;
}

export interface Quotation {
  id: string;
  quoteNo: string;
  schedule: Schedule;
  searchParams: SearchParams;
  cargoDetails: CargoDetails;
  charges: QuotationCharge[];
  totalFreight: number;
  totalSurcharges: number;
  totalLocalOrigin: number;
  totalLocalDestination: number;
  totalAmountUsd: number;
  totalAmountInr: number;
  currency: string;
  validUntil: Date;
  createdAt: Date;
}

export interface BookingFormData {
  shipperName: string;
  shipperAddress: string;
  shipperCity: string;
  shipperCountry: string;
  shipperContact: string;
  shipperEmail: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeCountry: string;
  consigneeContact: string;
  consigneeEmail: string;
  notifyParty: string;
  cargoDescription: string;
  hsCode: string;
  marksNumbers: string;
  specialInstructions: string;
  incoterm: string;
}

export type QuoteStep = 'search' | 'results' | 'cargo' | 'quote' | 'book' | 'confirmed';
