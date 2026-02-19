/*
  # Create quotations and bookings-from-quotes tables
*/

CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_no text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  direction text NOT NULL CHECK (direction IN ('export', 'import')),
  mode text NOT NULL,
  origin_port text NOT NULL,
  origin_port_name text DEFAULT '',
  destination_port text NOT NULL,
  destination_port_name text DEFAULT '',
  carrier_code text NOT NULL,
  carrier_name text NOT NULL,
  schedule_ref text DEFAULT '',
  vessel_name text DEFAULT '',
  voyage_no text DEFAULT '',
  etd date,
  eta date,
  transit_days integer DEFAULT 0,
  is_direct boolean DEFAULT true,
  incoterm text DEFAULT '',
  cargo_type text DEFAULT '',
  container_type text DEFAULT '',
  quantity integer DEFAULT 1,
  weight_kg numeric(10,2) DEFAULT 0,
  volume_cbm numeric(10,2) DEFAULT 0,
  commodity text DEFAULT '',
  total_freight numeric(12,2) DEFAULT 0,
  total_surcharges numeric(12,2) DEFAULT 0,
  total_local_origin numeric(12,2) DEFAULT 0,
  total_local_destination numeric(12,2) DEFAULT 0,
  total_amount_usd numeric(12,2) DEFAULT 0,
  total_amount_inr numeric(14,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  valid_until date DEFAULT (CURRENT_DATE + interval '30 days'),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quotations"
  ON quotations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create quotations"
  ON quotations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quotations"
  ON quotations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS quotation_charges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid REFERENCES quotations(id) ON DELETE CASCADE NOT NULL,
  charge_type text NOT NULL CHECK (charge_type IN ('freight', 'surcharge', 'local_origin', 'local_destination')),
  charge_code text DEFAULT '',
  charge_name text NOT NULL,
  quantity numeric(10,2) DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  total numeric(12,2) NOT NULL DEFAULT 0,
  is_mandatory boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quotation_charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quotation charges"
  ON quotation_charges FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quotations
      WHERE quotations.id = quotation_charges.quotation_id
      AND quotations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert quotation charges"
  ON quotation_charges FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotations
      WHERE quotations.id = quotation_charges.quotation_id
      AND quotations.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS bookings_from_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_no text NOT NULL UNIQUE,
  quotation_id uuid REFERENCES quotations(id),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  shipper_name text NOT NULL DEFAULT '',
  shipper_address text DEFAULT '',
  shipper_contact text DEFAULT '',
  shipper_email text DEFAULT '',
  consignee_name text NOT NULL DEFAULT '',
  consignee_address text DEFAULT '',
  consignee_contact text DEFAULT '',
  consignee_email text DEFAULT '',
  notify_party text DEFAULT '',
  cargo_description text DEFAULT '',
  hs_code text DEFAULT '',
  marks_numbers text DEFAULT '',
  special_instructions text DEFAULT '',
  incoterm text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings_from_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quote bookings"
  ON bookings_from_quotes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create quote bookings"
  ON bookings_from_quotes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quote bookings"
  ON bookings_from_quotes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
