/*
  # Create Routes Table

  1. New Tables
    - `routes`
      - `id` (uuid, primary key)
      - `shipment_number` (text, not null) - Links to shipments table
      - `Route No` (text) - Route identifier
      - `LegNumber` (integer) - Leg sequence number
      - `vessel_name` (text) - Name of vessel
      - `Load Port` (text) - Port where cargo is loaded (origin for this leg)
      - `Discharge Port` (text) - Port where cargo is discharged (destination for this leg)
      - `ETD` (timestamptz) - Estimated departure for this leg
      - `ETA` (timestamptz) - Estimated arrival for this leg
      - `Transit Days` (integer) - Transit days for this leg
      - `Estimated Transit Days` (integer) - Estimated transit days for this leg
      - `Delay Days` (integer) - Delay days for this leg
      - `WasRolled` (boolean) - Whether this leg was rolled
      - `PaymentStatus` (text) - Payment status
      - `DocumentSubmitted` (boolean) - Whether documents are submitted
      - `WeatherSeverity` (integer) - Weather severity score 0-10
      - `PortCongestion` (integer) - Port congestion score 0-10
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `routes` table
    - Add policies for authenticated users to perform CRUD operations
*/

CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number text NOT NULL,
  "Route No" text,
  "LegNumber" integer DEFAULT 1,
  vessel_name text,
  "Load Port" text,
  "Discharge Port" text,
  "ETD" timestamptz,
  "ETA" timestamptz,
  "Transit Days" integer,
  "Estimated Transit Days" integer,
  "Delay Days" integer DEFAULT 0,
  "WasRolled" boolean DEFAULT false,
  "PaymentStatus" text DEFAULT 'Pending',
  "DocumentSubmitted" boolean DEFAULT false,
  "WeatherSeverity" integer DEFAULT 0,
  "PortCongestion" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view routes"
  ON routes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shipments s
      WHERE s."Shipment Number" = routes.shipment_number
    )
  );

CREATE POLICY "Authenticated users can insert routes"
  ON routes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shipments s
      WHERE s."Shipment Number" = routes.shipment_number
    )
  );

CREATE POLICY "Authenticated users can update routes"
  ON routes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shipments s
      WHERE s."Shipment Number" = routes.shipment_number
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shipments s
      WHERE s."Shipment Number" = routes.shipment_number
    )
  );

CREATE POLICY "Authenticated users can delete routes"
  ON routes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shipments s
      WHERE s."Shipment Number" = routes.shipment_number
    )
  );

CREATE INDEX IF NOT EXISTS idx_routes_shipment_number ON routes (shipment_number);
CREATE INDEX IF NOT EXISTS idx_routes_leg_number ON routes (shipment_number, "LegNumber");
