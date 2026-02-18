import { Port } from '../types/quotation';

export const INDIAN_SEA_PORTS: Port[] = [
  { code: 'INNSA', name: 'Nhava Sheva (JNPT)', fullName: 'Jawaharlal Nehru Port, Mumbai', country: 'India', countryCode: 'IN', type: 'sea', isIndian: true, region: 'West India' },
  { code: 'INMUN', name: 'Mundra', fullName: 'Mundra Port, Gujarat', country: 'India', countryCode: 'IN', type: 'sea', isIndian: true, region: 'West India' },
  { code: 'INPIP', name: 'Pipavav', fullName: 'Pipavav Port, Gujarat', country: 'India', countryCode: 'IN', type: 'sea', isIndian: true, region: 'West India' },
  { code: 'INHZD', name: 'Hazira', fullName: 'Hazira Port, Surat', country: 'India', countryCode: 'IN', type: 'sea', isIndian: true, region: 'West India' },
  { code: 'INBOM', name: 'Mumbai', fullName: 'Mumbai Port, Maharashtra', country: 'India', countryCode: 'IN', type: 'sea', isIndian: true, region: 'West India' },
  { code: 'INMAA', name: 'Chennai', fullName: 'Chennai Port, Tamil Nadu', country: 'India', countryCode: 'IN', type: 'sea', isIndian: true, region: 'South India' },
  { code: 'INCOK', name: 'Kochi', fullName: 'Kochi Port, Kerala', country: 'India', countryCode: 'IN', type: 'sea', isIndian: true, region: 'South India' },
  { code: 'INVTZ', name: 'Visakhapatnam', fullName: 'Vizag Port, Andhra Pradesh', country: 'India', countryCode: 'IN', type: 'sea', isIndian: true, region: 'East India' },
  { code: 'INKOL', name: 'Kolkata', fullName: 'Kolkata Port, West Bengal', country: 'India', countryCode: 'IN', type: 'sea', isIndian: true, region: 'East India' },
  { code: 'INHLD', name: 'Haldia', fullName: 'Haldia Port, West Bengal', country: 'India', countryCode: 'IN', type: 'sea', isIndian: true, region: 'East India' },
];

export const INDIAN_AIR_PORTS: Port[] = [
  { code: 'INBOM', name: 'Mumbai (BOM)', fullName: 'Chhatrapati Shivaji Maharaj International Airport', country: 'India', countryCode: 'IN', type: 'air', isIndian: true, region: 'West India' },
  { code: 'INDEL', name: 'Delhi (DEL)', fullName: 'Indira Gandhi International Airport', country: 'India', countryCode: 'IN', type: 'air', isIndian: true, region: 'North India' },
  { code: 'INBLR', name: 'Bangalore (BLR)', fullName: 'Kempegowda International Airport', country: 'India', countryCode: 'IN', type: 'air', isIndian: true, region: 'South India' },
  { code: 'INMAA', name: 'Chennai (MAA)', fullName: 'Chennai International Airport', country: 'India', countryCode: 'IN', type: 'air', isIndian: true, region: 'South India' },
  { code: 'INHYD', name: 'Hyderabad (HYD)', fullName: 'Rajiv Gandhi International Airport', country: 'India', countryCode: 'IN', type: 'air', isIndian: true, region: 'South India' },
  { code: 'INCCU', name: 'Kolkata (CCU)', fullName: 'Netaji Subhash Chandra Bose International Airport', country: 'India', countryCode: 'IN', type: 'air', isIndian: true, region: 'East India' },
  { code: 'INAMD', name: 'Ahmedabad (AMD)', fullName: 'Sardar Vallabhbhai Patel International Airport', country: 'India', countryCode: 'IN', type: 'air', isIndian: true, region: 'West India' },
  { code: 'INCOK', name: 'Kochi (COK)', fullName: 'Cochin International Airport', country: 'India', countryCode: 'IN', type: 'air', isIndian: true, region: 'South India' },
];

export const FOREIGN_SEA_PORTS: Port[] = [
  { code: 'NLRTM', name: 'Rotterdam', fullName: 'Port of Rotterdam', country: 'Netherlands', countryCode: 'NL', type: 'sea', isIndian: false, region: 'North Europe' },
  { code: 'DEHAM', name: 'Hamburg', fullName: 'Port of Hamburg', country: 'Germany', countryCode: 'DE', type: 'sea', isIndian: false, region: 'North Europe' },
  { code: 'GBFXT', name: 'Felixstowe', fullName: 'Port of Felixstowe', country: 'United Kingdom', countryCode: 'GB', type: 'sea', isIndian: false, region: 'North Europe' },
  { code: 'BEANR', name: 'Antwerp', fullName: 'Port of Antwerp-Bruges', country: 'Belgium', countryCode: 'BE', type: 'sea', isIndian: false, region: 'North Europe' },
  { code: 'FRFOS', name: 'Fos-sur-Mer', fullName: 'Port of Marseille-Fos', country: 'France', countryCode: 'FR', type: 'sea', isIndian: false, region: 'South Europe' },
  { code: 'ITGOA', name: 'Genoa', fullName: 'Port of Genoa', country: 'Italy', countryCode: 'IT', type: 'sea', isIndian: false, region: 'South Europe' },
  { code: 'AEDXB', name: 'Dubai (Jebel Ali)', fullName: 'Jebel Ali Port, Dubai', country: 'UAE', countryCode: 'AE', type: 'sea', isIndian: false, region: 'Middle East' },
  { code: 'SAJED', name: 'Jeddah', fullName: 'Jeddah Islamic Port', country: 'Saudi Arabia', countryCode: 'SA', type: 'sea', isIndian: false, region: 'Middle East' },
  { code: 'EGPSD', name: 'Port Said', fullName: 'Port Said East, Egypt', country: 'Egypt', countryCode: 'EG', type: 'sea', isIndian: false, region: 'Middle East' },
  { code: 'SGSIN', name: 'Singapore', fullName: 'Port of Singapore', country: 'Singapore', countryCode: 'SG', type: 'sea', isIndian: false, region: 'South East Asia' },
  { code: 'MYPKG', name: 'Port Klang', fullName: 'Port Klang, Malaysia', country: 'Malaysia', countryCode: 'MY', type: 'sea', isIndian: false, region: 'South East Asia' },
  { code: 'LKCMB', name: 'Colombo', fullName: 'Port of Colombo, Sri Lanka', country: 'Sri Lanka', countryCode: 'LK', type: 'sea', isIndian: false, region: 'South Asia' },
  { code: 'CNSHA', name: 'Shanghai', fullName: 'Port of Shanghai', country: 'China', countryCode: 'CN', type: 'sea', isIndian: false, region: 'East Asia' },
  { code: 'CNNBO', name: 'Ningbo', fullName: 'Ningbo-Zhoushan Port', country: 'China', countryCode: 'CN', type: 'sea', isIndian: false, region: 'East Asia' },
  { code: 'CNQIN', name: 'Qingdao', fullName: 'Port of Qingdao', country: 'China', countryCode: 'CN', type: 'sea', isIndian: false, region: 'East Asia' },
  { code: 'KRPUS', name: 'Busan', fullName: 'Port of Busan, South Korea', country: 'South Korea', countryCode: 'KR', type: 'sea', isIndian: false, region: 'East Asia' },
  { code: 'JPTYO', name: 'Tokyo', fullName: 'Port of Tokyo, Japan', country: 'Japan', countryCode: 'JP', type: 'sea', isIndian: false, region: 'East Asia' },
  { code: 'JPOSA', name: 'Osaka', fullName: 'Port of Osaka, Japan', country: 'Japan', countryCode: 'JP', type: 'sea', isIndian: false, region: 'East Asia' },
  { code: 'USLAX', name: 'Los Angeles', fullName: 'Port of Los Angeles', country: 'USA', countryCode: 'US', type: 'sea', isIndian: false, region: 'North America' },
  { code: 'USNYC', name: 'New York', fullName: 'Port of New York & New Jersey', country: 'USA', countryCode: 'US', type: 'sea', isIndian: false, region: 'North America' },
  { code: 'USHOU', name: 'Houston', fullName: 'Port of Houston', country: 'USA', countryCode: 'US', type: 'sea', isIndian: false, region: 'North America' },
  { code: 'AUSYD', name: 'Sydney', fullName: 'Port of Sydney', country: 'Australia', countryCode: 'AU', type: 'sea', isIndian: false, region: 'Oceania' },
  { code: 'AUMEL', name: 'Melbourne', fullName: 'Port of Melbourne', country: 'Australia', countryCode: 'AU', type: 'sea', isIndian: false, region: 'Oceania' },
  { code: 'ZADRB', name: 'Durban', fullName: 'Port of Durban', country: 'South Africa', countryCode: 'ZA', type: 'sea', isIndian: false, region: 'Africa' },
];

export const FOREIGN_AIR_PORTS: Port[] = [
  { code: 'AEDXB', name: 'Dubai (DXB)', fullName: 'Dubai International Airport', country: 'UAE', countryCode: 'AE', type: 'air', isIndian: false, region: 'Middle East' },
  { code: 'DEFRA', name: 'Frankfurt (FRA)', fullName: 'Frankfurt Airport', country: 'Germany', countryCode: 'DE', type: 'air', isIndian: false, region: 'Europe' },
  { code: 'GBLON', name: 'London (LHR)', fullName: 'Heathrow Airport', country: 'United Kingdom', countryCode: 'GB', type: 'air', isIndian: false, region: 'Europe' },
  { code: 'FRCGD', name: 'Paris (CDG)', fullName: 'Charles de Gaulle Airport', country: 'France', countryCode: 'FR', type: 'air', isIndian: false, region: 'Europe' },
  { code: 'NLAMS', name: 'Amsterdam (AMS)', fullName: 'Amsterdam Schiphol Airport', country: 'Netherlands', countryCode: 'NL', type: 'air', isIndian: false, region: 'Europe' },
  { code: 'SGSIN', name: 'Singapore (SIN)', fullName: 'Changi Airport', country: 'Singapore', countryCode: 'SG', type: 'air', isIndian: false, region: 'South East Asia' },
  { code: 'HKHKG', name: 'Hong Kong (HKG)', fullName: 'Hong Kong International Airport', country: 'Hong Kong', countryCode: 'HK', type: 'air', isIndian: false, region: 'East Asia' },
  { code: 'CNSHA', name: 'Shanghai (PVG)', fullName: 'Pudong International Airport', country: 'China', countryCode: 'CN', type: 'air', isIndian: false, region: 'East Asia' },
  { code: 'JPTYO', name: 'Tokyo (NRT)', fullName: 'Narita International Airport', country: 'Japan', countryCode: 'JP', type: 'air', isIndian: false, region: 'East Asia' },
  { code: 'USNYC', name: 'New York (JFK)', fullName: 'John F. Kennedy International Airport', country: 'USA', countryCode: 'US', type: 'air', isIndian: false, region: 'North America' },
  { code: 'USORD', name: 'Chicago (ORD)', fullName: "O'Hare International Airport", country: 'USA', countryCode: 'US', type: 'air', isIndian: false, region: 'North America' },
  { code: 'USLAX', name: 'Los Angeles (LAX)', fullName: 'Los Angeles International Airport', country: 'USA', countryCode: 'US', type: 'air', isIndian: false, region: 'North America' },
  { code: 'MYKUL', name: 'Kuala Lumpur (KUL)', fullName: 'Kuala Lumpur International Airport', country: 'Malaysia', countryCode: 'MY', type: 'air', isIndian: false, region: 'South East Asia' },
  { code: 'AUSYD', name: 'Sydney (SYD)', fullName: 'Sydney Airport', country: 'Australia', countryCode: 'AU', type: 'air', isIndian: false, region: 'Oceania' },
];

export function getPortsByMode(mode: 'sea_fcl' | 'sea_lcl' | 'air', isIndian: boolean): Port[] {
  if (mode === 'air') {
    return isIndian ? INDIAN_AIR_PORTS : FOREIGN_AIR_PORTS;
  }
  return isIndian ? INDIAN_SEA_PORTS : FOREIGN_SEA_PORTS;
}

export function getPortByCode(code: string): Port | undefined {
  return [
    ...INDIAN_SEA_PORTS, ...INDIAN_AIR_PORTS,
    ...FOREIGN_SEA_PORTS, ...FOREIGN_AIR_PORTS
  ].find(p => p.code === code);
}
