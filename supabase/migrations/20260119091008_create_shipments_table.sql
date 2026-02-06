/*
  # Create Shipments Table

  1. New Tables
    - `shipments`
      - `id` (uuid, primary key) - Unique identifier for each shipment
      - `Shipment Number` (text, unique, not null) - Business identifier for the shipment
      - `Shipper` (text) - Name of the shipping company
      - `Consignee` (text) - Name of the receiving party
      - `Origin` (text) - Origin location
      - `Destination` (text) - Destination location
      - `Transhipments count` (integer) - Number of transhipments
      - `Sending Agent` (text) - Agent sending the shipment
      - `Receiving Agent` (text) - Agent receiving the shipment
      - `Sales Rep` (text) - Sales representative
      - `TEU` (numeric) - Twenty-foot Equivalent Unit
      - `Incitement` (text) - Shipment incentive information
      - `Transport Mode` (text) - Mode of transport (Sea, Air, Road)
      - `Direction` (text) - Direction of shipment
      - `Shipment Type` (text) - Type of shipment
      - `ETD` (timestamptz) - Estimated Time of Departure
      - `ETA` (timestamptz) - Estimated Time of Arrival
      - `ATD` (timestamptz) - Actual Time of Departure
      - `ATA` (timestamptz) - Actual Time of Arrival
      - `Total Transit Days` (integer) - Total days in transit
      - `Total Estimated Transit Days` (integer) - Estimated total transit days
      - `Delay Days` (text) - Number of delay days
      - `Late/Early` (text) - Whether shipment is late or early
      - `job_ref` (text) - Job reference number
      - `shipment_status` (text) - Current status of shipment
      - `customer_id` (uuid) - Foreign key to customer/user
      - `route_id` (uuid) - Foreign key to route
      - `_demo_marked` (boolean) - Flag for demo data
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `shipments` table
    - Add policy for authenticated users to view all shipments
    - Add policy for authenticated users to create shipments
    - Add policy for authenticated users to update shipments
    - Add policy for authenticated users to delete shipments
*/

CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "Shipment Number" text UNIQUE NOT NULL,
  "Shipper" text,
  "Consignee" text,
  "Origin" text,
  "Destination" text,
  "Transhipments count" integer DEFAULT 0,
  "Sending Agent" text,
  "Receiving Agent" text,
  "Sales Rep" text,
  "TEU" numeric,
  "Incitement" text,
  "Transport Mode" text,
  "Direction" text,
  "Shipment Type" text,
  "ETD" timestamptz,
  "ETA" timestamptz,
  "ATD" timestamptz,
  "ATA" timestamptz,
  "Total Transit Days" integer,
  "Total Estimated Transit Days" integer,
  "Delay Days" text,
  "Late/Early" text,
  job_ref text,
  shipment_status text DEFAULT 'In Transit',
  customer_id uuid,
  route_id uuid,
  _demo_marked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all shipments"
  ON shipments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create shipments"
  ON shipments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update shipments"
  ON shipments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete shipments"
  ON shipments
  FOR DELETE
  TO authenticated
  USING (true);
