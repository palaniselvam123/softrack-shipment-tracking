export type UserStatus = 'active' | 'inactive' | 'suspended';
export type UserType = 'internal' | 'customer' | 'shipper' | 'consignee' | 'agent';
export type MappingType = 'customer' | 'shipper' | 'consignee' | 'agent';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  full_name: string;
  company: string;
  phone: string;
  status: UserStatus;
  user_type: UserType;
  avatar_url: string;
  last_login: string | null;
  invited_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_export: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerMapping {
  id: string;
  user_id: string;
  mapping_type: MappingType;
  entity_name: string;
  entity_code: string;
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThemeSettings {
  id: string;
  scope: 'global' | 'user';
  user_id: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  sidebar_color: string;
  logo_url: string;
  company_name: string;
  font_family: string;
  border_radius: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_user_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export const MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'shipments', label: 'Shipments' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'quotation', label: 'Quote & Book' },
  { id: 'tracking', label: 'Tracking' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'customs', label: 'Customs' },
  { id: 'communication', label: 'Communication' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'leads', label: 'Leads' },
  { id: 'inquiry', label: 'Inquiry' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'admin', label: 'Admin Portal' },
];

export const USER_TYPE_LABELS: Record<UserType, string> = {
  internal: 'Internal Staff',
  customer: 'Customer',
  shipper: 'Shipper',
  consignee: 'Consignee',
  agent: 'Agent',
};

export const MAPPING_TYPE_LABELS: Record<MappingType, string> = {
  customer: 'Customer',
  shipper: 'Shipper',
  consignee: 'Consignee',
  agent: 'Agent',
};
