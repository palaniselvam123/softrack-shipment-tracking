import { Carrier } from '../types/quotation';

export const CARRIERS: Carrier[] = [
  { id: 'msc', name: 'MSC Mediterranean Shipping', code: 'MSC', type: 'shipping_line', color: '#1a1a1a', textColor: '#ffffff' },
  { id: 'maersk', name: 'Maersk Line', code: 'MAERSK', type: 'shipping_line', color: '#42B0D5', textColor: '#ffffff' },
  { id: 'cmacgm', name: 'CMA CGM', code: 'CMACGM', type: 'shipping_line', color: '#E31837', textColor: '#ffffff' },
  { id: 'hapag', name: 'Hapag-Lloyd', code: 'HAPAG', type: 'shipping_line', color: '#F37021', textColor: '#ffffff' },
  { id: 'evergreen', name: 'Evergreen Line', code: 'EVERGREEN', type: 'shipping_line', color: '#007A3D', textColor: '#ffffff' },
  { id: 'one', name: 'Ocean Network Express', code: 'ONE', type: 'shipping_line', color: '#E4007F', textColor: '#ffffff' },
  { id: 'pil', name: 'Pacific Int\'l Lines', code: 'PIL', type: 'shipping_line', color: '#003087', textColor: '#ffffff' },
  { id: 'cosco', name: 'COSCO Shipping', code: 'COSCO', type: 'shipping_line', color: '#1B4F72', textColor: '#ffffff' },
  { id: 'aicargo', name: 'Air India Cargo', code: 'AICARGO', type: 'airline', color: '#CC0000', textColor: '#ffffff' },
  { id: 'eksky', name: 'Emirates SkyCargo', code: 'EKSKY', type: 'airline', color: '#C71234', textColor: '#ffffff' },
  { id: 'lhcargo', name: 'Lufthansa Cargo', code: 'LHCARGO', type: 'airline', color: '#05164D', textColor: '#ffffff' },
  { id: 'sqcargo', name: 'Singapore Airlines Cargo', code: 'SQCARGO', type: 'airline', color: '#152F5F', textColor: '#ffffff' },
  { id: 'indigo', name: 'IndiGo CarGo', code: 'INDIGO', type: 'airline', color: '#1B3FA0', textColor: '#ffffff' },
];

export function getCarrierByCode(code: string): Carrier | undefined {
  return CARRIERS.find(c => c.code === code);
}
