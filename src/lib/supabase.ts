import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseShipment {
  'Shipment Number': string;
  'Shipper': string | null;
  'Consignee': string | null;
  'Origin': string | null;
  'Destination': string | null;
  'Transhipments count': number | null;
  'Sending Agent': string | null;
  'Receiving Agent': string | null;
  'Sales Rep': string | null;
  'TEU': number | null;
  'Incitement': string | null;
  'Transport Mode': string | null;
  'Direction': string | null;
  'Shipment Type': string | null;
  'ETD': string | null;
  'ETA': string | null;
  'ATD': string | null;
  'ATA': string | null;
  'Total Transit Days': number | null;
  'Total Estimated Transit Days': number | null;
  'Delay Days': string | null;
  'Late/Early': string | null;
  id: string | null;
  created_at: string | null;
  job_ref: string | null;
  shipment_status: string | null;
  customer_id: string | null;
  route_id: string | null;
  _demo_marked: boolean | null;
}
