export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  country: string;
  type: 'owned' | 'leased' | '3pl';
  status: 'active' | 'inactive' | 'maintenance';
  capacity_sqm: number;
  used_sqm: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
}

export interface WarehouseInventory {
  id: string;
  warehouse_id: string;
  sku: string;
  product_name: string;
  category: string;
  quantity: number;
  unit: string;
  location_code: string;
  lot_number: string;
  expiry_date: string | null;
  status: 'available' | 'reserved' | 'damaged' | 'quarantine';
  shipment_ref: string | null;
  created_at: string;
  updated_at: string;
}

export interface WarehouseMovement {
  id: string;
  warehouse_id: string;
  inventory_id: string | null;
  movement_type: 'inbound' | 'outbound' | 'transfer' | 'adjustment';
  reference_no: string;
  quantity: number;
  unit: string;
  from_location: string | null;
  to_location: string | null;
  shipment_ref: string | null;
  notes: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_at: string;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
}
