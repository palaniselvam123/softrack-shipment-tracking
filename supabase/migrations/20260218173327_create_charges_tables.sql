/*
  # Create freight charges, surcharges, and local charges tables

  1. New Tables
    - `freight_charges` - Base ocean/air freight rates by container/unit type
      - Per carrier, route, container type (20GP/40GP/40HC/LCL/AIR)
    - `surcharges` - Additional trade surcharges (BAF, CAF, PSS, EBS, AMS, etc.)
      - Can apply by carrier, route, or trade lane
    - `local_charges` - Origin/destination port local charges (THC, B/L fee, etc.)
      - Often in local currency (INR for Indian ports)
  2. Security
    - RLS enabled, authenticated read access for all three tables
  3. Notes
    - Charges are also maintained as static data in TypeScript for instant display
    - DB tables used for admin management and real-time rate updates
*/

CREATE TABLE IF NOT EXISTS freight_charges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_id uuid REFERENCES carriers(id),
  origin_port text NOT NULL,
  destination_port text NOT NULL,
  mode text NOT NULL,
  container_type text NOT NULL,
  charge_name text NOT NULL DEFAULT 'Ocean Freight',
  amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  valid_from date DEFAULT CURRENT_DATE,
  valid_to date DEFAULT (CURRENT_DATE + interval '90 days'),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE freight_charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read freight charges"
  ON freight_charges FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS surcharges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_id uuid REFERENCES carriers(id),
  origin_port text DEFAULT '',
  destination_port text DEFAULT '',
  mode text NOT NULL,
  trade_lane text DEFAULT '',
  charge_code text NOT NULL,
  charge_name text NOT NULL,
  container_type text DEFAULT 'ALL',
  amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  per_unit text DEFAULT 'PER_CONTAINER',
  is_mandatory boolean DEFAULT true,
  valid_from date DEFAULT CURRENT_DATE,
  valid_to date DEFAULT (CURRENT_DATE + interval '90 days'),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE surcharges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read surcharges"
  ON surcharges FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS local_charges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_id uuid REFERENCES carriers(id),
  port text NOT NULL,
  country_code text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('origin', 'destination')),
  mode text NOT NULL,
  charge_code text NOT NULL,
  charge_name text NOT NULL,
  container_type text DEFAULT 'ALL',
  amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'INR',
  per_unit text DEFAULT 'PER_CONTAINER',
  is_mandatory boolean DEFAULT false,
  valid_from date DEFAULT CURRENT_DATE,
  valid_to date DEFAULT (CURRENT_DATE + interval '90 days'),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE local_charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read local charges"
  ON local_charges FOR SELECT
  TO authenticated
  USING (true);
