export interface GoodsItem {
  id: string;
  description: string;
  packages: number;
  weight: number;
  volume: number;
}

export interface DocumentItem {
  id: string;
  type: string;
  name: string;
  file?: File;
}

export interface BookingData {
  serviceProvider: string;
  transportMode: string;
  shipmentType: string;
  services: string[];
  movementType: string;
  consigneeId: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneeContact: string;
  consigneeEmail: string;
  originLocation: string;
  destinationLocation: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  pickupDate: string;
  deliveryDate: string;
  cargoType: string;
  goods: GoodsItem[];
  documents: DocumentItem[];
  remarks: string;
}

export const defaultBookingData: BookingData = {
  serviceProvider: '',
  transportMode: '',
  shipmentType: '',
  services: [],
  movementType: '',
  consigneeId: '',
  consigneeName: '',
  consigneeAddress: '',
  consigneeContact: '',
  consigneeEmail: '',
  originLocation: '',
  destinationLocation: '',
  pickupLocation: '',
  deliveryLocation: '',
  pickupDate: '',
  deliveryDate: '',
  cargoType: '',
  goods: [],
  documents: [],
  remarks: ''
};

export const serviceProviders = [
  'Maersk Line', 'MSC Mediterranean Shipping', 'CMA CGM', 'CMA CGM India',
  'COSCO Shipping', 'Hapag-Lloyd', 'Hapag Lloyd India', 'ONE (Ocean Network Express)',
  'Evergreen Line', 'UPS India Pvt Ltd', 'Maersk India Ltd', 'MSC India Pvt Ltd',
  'DHL Express India', 'FedEx India', 'Air India Cargo', 'Emirates SkyCargo',
  'VRL Logistics', 'TCI Freight', 'Blue Dart Express', 'Gati KWE', 'KLN India Pvt Ltd'
];

export const transportModes = [
  { value: 'sea', label: 'Sea Freight', desc: 'Ocean container shipping' },
  { value: 'air', label: 'Air Freight', desc: 'Express air cargo' },
  { value: 'road', label: 'Road Transport', desc: 'Overland trucking' },
  { value: 'rail', label: 'Rail Transport', desc: 'Railway freight' }
];

export const availableServices = [
  { id: 'Forwarding', label: 'Forwarding', desc: 'End-to-end freight forwarding' },
  { id: 'Warehousing', label: 'Warehousing', desc: 'Storage & inventory' },
  { id: 'Customs Clearance', label: 'Customs Clearance', desc: 'Import/export compliance' },
  { id: 'Transportation', label: 'Transportation', desc: 'Local pickup & delivery' },
  { id: 'Insurance', label: 'Insurance', desc: 'Cargo insurance coverage' },
  { id: 'Documentation', label: 'Documentation', desc: 'Trade documentation' }
];

export const cargoTypes = [
  'General Cargo', 'Perishable Goods', 'Dangerous Goods',
  'Fragile Items', 'Bulk Cargo', 'Containerized Cargo'
];

export const movementTypes = [
  'FCL (Full Container Load)', 'LCL (Less than Container Load)',
  'Door-to-Door', 'Port-to-Port', 'Direct Shipment', 'Transshipment'
];

export const documentTypes = [
  'Commercial Invoice', 'Packing List', 'Bill of Lading',
  'Certificate of Origin', 'Export License', 'Insurance Certificate', 'Customs Declaration'
];

export const preStoredConsignees = [
  { id: '1', name: 'ANL Industries Pvt Ltd', address: '123 Industrial Area, Sector 15, Mumbai, Maharashtra 400001, India', contact: '+91 98765 43210', email: 'logistics@anlindustries.com' },
  { id: '2', name: 'Kalpataru Logistics Solutions', address: '456 Export House, MIDC Area, Pune, Maharashtra 411019, India', contact: '+91 87654 32109', email: 'operations@kalpatarulogistics.com' },
  { id: '3', name: 'Global Trading Company', address: '789 Trade Center, Bandra Kurla Complex, Mumbai, Maharashtra 400051, India', contact: '+91 76543 21098', email: 'shipping@globaltradingco.in' },
  { id: '4', name: '3PL Logistics Hub', address: '321 Warehouse District, Gurgaon, Haryana 122001, India', contact: '+91 65432 10987', email: 'bookings@3pllogistics.com' },
  { id: '5', name: 'South Asia Trading Company', address: 'Plot 15, Industrial Zone, Mumbai, Maharashtra 400703, India', contact: '+91 22 3456 7890', email: 'imports@southasiatrading.in' },
  { id: '6', name: 'Australian Fine Wines', address: '88 Wine Valley Road, East Perth, WA 6004, Australia', contact: '+61 8 9876 5432', email: 'export@ausfinewines.com.au' },
];

export const bookingTemplates = [
  { id: 1, name: 'Standard Export - Sea Freight', description: 'Common export shipment via sea freight', data: { serviceProvider: 'Maersk Line', transportMode: 'sea', shipmentType: 'Export', services: ['Forwarding', 'Customs Clearance', 'Transportation'], cargoType: 'General Cargo', movementType: 'FCL (Full Container Load)' } },
  { id: 2, name: 'Air Freight Import', description: 'Fast air freight import shipment', data: { serviceProvider: 'CMA CGM', transportMode: 'air', shipmentType: 'Import', services: ['Forwarding', 'Customs Clearance', 'Warehousing'], cargoType: 'General Cargo', movementType: 'Direct Shipment' } },
  { id: 3, name: 'Dangerous Goods Export', description: 'Special handling for dangerous goods', data: { serviceProvider: 'Hapag-Lloyd', transportMode: 'sea', shipmentType: 'Export', services: ['Forwarding', 'Customs Clearance', 'Transportation', 'Insurance'], cargoType: 'Dangerous Goods', movementType: 'FCL (Full Container Load)' } },
];

export const recentBookings = [
  { id: 'MUM/SE/SHP/0024', consignee: 'Global Trading Company', route: 'Mumbai - New York', date: '2025-11-15', data: { serviceProvider: 'Maersk Line', transportMode: 'sea', shipmentType: 'Export', services: ['Forwarding', 'Customs Clearance'], consigneeId: '3', consigneeName: 'Global Trading Company', consigneeAddress: '789 Trade Center, Bandra Kurla Complex, Mumbai, Maharashtra 400051, India', consigneeContact: '+91 76543 21098', consigneeEmail: 'shipping@globaltradingco.in', originLocation: 'Mumbai, India', destinationLocation: 'New York, USA', cargoType: 'General Cargo', movementType: 'FCL (Full Container Load)' } },
  { id: 'MUM/AE/SHP/0013', consignee: 'ANL Industries', route: 'Chennai - Hanoi', date: '2025-11-10', data: { serviceProvider: 'MSC Mediterranean Shipping', transportMode: 'air', shipmentType: 'Export', services: ['Forwarding', 'Transportation'], consigneeId: '1', consigneeName: 'ANL Industries Pvt Ltd', consigneeAddress: '123 Industrial Area, Sector 15, Mumbai, Maharashtra 400001, India', consigneeContact: '+91 98765 43210', consigneeEmail: 'logistics@anlindustries.com', originLocation: 'Chennai, India', destinationLocation: 'Hanoi, Vietnam', cargoType: 'General Cargo', movementType: 'Direct Shipment' } },
];

export const mockBookingLookup: Record<string, Partial<BookingData>> = {
  'BKG/2025/001': { serviceProvider: 'Maersk Line', transportMode: 'sea', shipmentType: 'Export', services: ['Forwarding', 'Customs Clearance', 'Transportation'], consigneeId: '6', consigneeName: 'Australian Fine Wines', consigneeAddress: '88 Wine Valley Road, East Perth, WA 6004, Australia', consigneeContact: '+61 8 9876 5432', consigneeEmail: 'export@ausfinewines.com.au', originLocation: 'East Perth, AU', destinationLocation: 'Mumbai, IN', pickupDate: '2025-10-10', deliveryDate: '2025-10-29', cargoType: 'General Cargo', movementType: 'FCL (Full Container Load)', goods: [{ id: '1', description: 'Non-Alcoholic Wine', packages: 260, weight: 500, volume: 0.5 }], documents: [{ id: '1', type: 'Commercial Invoice', name: 'Commercial_Invoice_AWF_001.pdf' }, { id: '2', type: 'Packing List', name: 'Packing_List_AWF_001.pdf' }], remarks: 'Temperature-sensitive cargo. Handle with care.' },
};

export const steps = [
  { id: 1, title: 'Service', description: 'Select services' },
  { id: 2, title: 'Consignee', description: 'Party details' },
  { id: 3, title: 'Route', description: 'Locations & dates' },
  { id: 4, title: 'Cargo', description: 'Goods details' },
  { id: 5, title: 'Documents', description: 'Upload files' },
  { id: 6, title: 'Review', description: 'Confirm booking' }
];
