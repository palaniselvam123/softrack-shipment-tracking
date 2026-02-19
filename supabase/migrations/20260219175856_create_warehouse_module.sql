/*
  # Create Warehouse Module Tables

  ## Overview
  Creates a full warehouse management system with:

  1. New Tables
    - `warehouses` - Warehouse locations/facilities
      - `id` (uuid, primary key)
      - `name` (text) - Warehouse name
      - `code` (text, unique) - Short identifier like "WH-001"
      - `location` (text) - City/address
      - `country` (text)
      - `type` (text) - 'owned' | 'leased' | '3pl'
      - `status` (text) - 'active' | 'inactive' | 'maintenance'
      - `capacity_sqm` (numeric) - Total capacity in square meters
      - `used_sqm` (numeric) - Currently used space
      - `contact_name` (text)
      - `contact_email` (text)
      - `contact_phone` (text)
      - `created_at`, `updated_at`

    - `warehouse_inventory` - Stock/inventory records
      - `id` (uuid, primary key)
      - `warehouse_id` (uuid, FK to warehouses)
      - `sku` (text) - Stock keeping unit
      - `product_name` (text)
      - `category` (text)
      - `quantity` (integer)
      - `unit` (text) - 'pcs', 'kg', 'cbm', etc.
      - `location_code` (text) - Rack/shelf code like "A-12-3"
      - `lot_number` (text)
      - `expiry_date` (date, nullable)
      - `status` (text) - 'available' | 'reserved' | 'damaged' | 'quarantine'
      - `shipment_ref` (text, nullable) - linked shipment
      - `created_at`, `updated_at`

    - `warehouse_movements` - Inbound/outbound movements
      - `id` (uuid, primary key)
      - `warehouse_id` (uuid, FK to warehouses)
      - `inventory_id` (uuid, FK to warehouse_inventory, nullable)
      - `movement_type` (text) - 'inbound' | 'outbound' | 'transfer' | 'adjustment'
      - `reference_no` (text) - Movement reference
      - `quantity` (integer)
      - `unit` (text)
      - `from_location` (text, nullable)
      - `to_location` (text, nullable)
      - `shipment_ref` (text, nullable)
      - `notes` (text)
      - `status` (text) - 'pending' | 'in_progress' | 'completed' | 'cancelled'
      - `scheduled_at` (timestamptz)
      - `completed_at` (timestamptz, nullable)
      - `created_by` (uuid, FK to auth.users)
      - `created_at`

  2. Security
    - Enable RLS on all tables
    - Admins have full access
    - Authenticated users can view warehouse data
*/

-- Warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  location text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'owned' CHECK (type IN ('owned', 'leased', '3pl')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  capacity_sqm numeric NOT NULL DEFAULT 0,
  used_sqm numeric NOT NULL DEFAULT 0,
  contact_name text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view warehouses"
  ON warehouses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert warehouses"
  ON warehouses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update warehouses"
  ON warehouses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Warehouse inventory table
CREATE TABLE IF NOT EXISTS warehouse_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id uuid NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  sku text NOT NULL DEFAULT '',
  product_name text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  quantity integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pcs',
  location_code text NOT NULL DEFAULT '',
  lot_number text NOT NULL DEFAULT '',
  expiry_date date,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'damaged', 'quarantine')),
  shipment_ref text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE warehouse_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view inventory"
  ON warehouse_inventory FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert inventory"
  ON warehouse_inventory FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update inventory"
  ON warehouse_inventory FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Warehouse movements table
CREATE TABLE IF NOT EXISTS warehouse_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id uuid NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  inventory_id uuid REFERENCES warehouse_inventory(id) ON DELETE SET NULL,
  movement_type text NOT NULL DEFAULT 'inbound' CHECK (movement_type IN ('inbound', 'outbound', 'transfer', 'adjustment')),
  reference_no text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pcs',
  from_location text,
  to_location text,
  shipment_ref text,
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  scheduled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE warehouse_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view movements"
  ON warehouse_movements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert movements"
  ON warehouse_movements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update movements"
  ON warehouse_movements FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Seed sample warehouses
INSERT INTO warehouses (name, code, location, country, type, status, capacity_sqm, used_sqm, contact_name, contact_email, contact_phone)
VALUES
  ('Jakarta Main Warehouse', 'WH-JKT-01', 'Tanjung Priok, Jakarta', 'Indonesia', 'owned', 'active', 12000, 8400, 'Budi Santoso', 'budi.santoso@logitrack.id', '+62 21 4301 2345'),
  ('Surabaya Distribution Hub', 'WH-SBY-01', 'Tanjung Perak, Surabaya', 'Indonesia', 'leased', 'active', 8000, 5200, 'Dewi Rahayu', 'dewi.rahayu@logitrack.id', '+62 31 3291 6789'),
  ('Singapore Bonded Warehouse', 'WH-SGP-01', 'Jurong Port, Singapore', 'Singapore', '3pl', 'active', 5000, 2100, 'Wei Ming Tan', 'weiming.tan@logitrack.sg', '+65 6861 4455'),
  ('Batam Free Trade Zone', 'WH-BTM-01', 'Batu Ampar, Batam', 'Indonesia', 'leased', 'active', 6500, 3900, 'Ahmad Fauzi', 'ahmad.fauzi@logitrack.id', '+62 778 461 2222'),
  ('Medan Cold Storage', 'WH-MDN-01', 'Belawan, Medan', 'Indonesia', 'owned', 'maintenance', 3000, 1800, 'Siti Aisyah', 'siti.aisyah@logitrack.id', '+62 61 6942 1100')
ON CONFLICT (code) DO NOTHING;

-- Seed sample inventory
WITH wh AS (SELECT id, code FROM warehouses WHERE code = 'WH-JKT-01' LIMIT 1)
INSERT INTO warehouse_inventory (warehouse_id, sku, product_name, category, quantity, unit, location_code, lot_number, status, shipment_ref)
SELECT
  wh.id,
  v.sku, v.product_name, v.category, v.quantity, v.unit, v.location_code, v.lot_number, v.status, v.shipment_ref
FROM wh,
(VALUES
  ('SKU-001', 'Electronics Components Set A', 'Electronics', 450, 'pcs', 'A-01-1', 'LOT-2025-001', 'available', 'SHP-2025-001'),
  ('SKU-002', 'Industrial Machinery Parts', 'Machinery', 120, 'pcs', 'B-03-2', 'LOT-2025-002', 'reserved', 'SHP-2025-002'),
  ('SKU-003', 'Textile Raw Materials', 'Textiles', 2800, 'kg', 'C-05-1', 'LOT-2025-003', 'available', NULL),
  ('SKU-004', 'Chemical Drums Grade A', 'Chemicals', 75, 'drums', 'D-02-3', 'LOT-2025-004', 'quarantine', 'SHP-2025-003'),
  ('SKU-005', 'Consumer Goods Package', 'Consumer', 1200, 'pcs', 'A-04-2', 'LOT-2025-005', 'available', NULL),
  ('SKU-006', 'Auto Parts Assorted', 'Automotive', 340, 'pcs', 'B-06-1', 'LOT-2025-006', 'available', 'SHP-2025-004'),
  ('SKU-007', 'Damaged Goods - Write Off', 'Electronics', 18, 'pcs', 'F-01-1', 'LOT-2025-007', 'damaged', NULL)
) AS v(sku, product_name, category, quantity, unit, location_code, lot_number, status, shipment_ref)
ON CONFLICT DO NOTHING;
