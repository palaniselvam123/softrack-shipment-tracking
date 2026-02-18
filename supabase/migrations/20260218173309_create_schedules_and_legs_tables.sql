/*
  # Create schedules and schedule_legs tables

  1. New Tables
    - `schedules` - Master sailing/flight schedule records
      - `id`, `schedule_no`, `carrier_id`, `mode` (sea_fcl/sea_lcl/air/road)
      - `direction` (export/import), `origin_port`, `destination_port`
      - `etd`, `eta`, `transit_days`, vessel/flight info
      - `is_direct`, `legs_count`, `frequency`
    - `schedule_legs` - Individual legs for multi-leg (transshipment) schedules
      - `id`, `schedule_id`, `leg_no`, `from_port`, `to_port`
      - `carrier_id`, vessel/flight info, `etd`, `eta`, `transit_days`
  2. Security
    - RLS enabled on both tables
    - Authenticated users can read all schedules
  3. Notes
    - Schedules are dynamically generated in the frontend
    - This table is for user-saved/confirmed schedules only
*/

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_no text NOT NULL,
  carrier_id uuid REFERENCES carriers(id),
  mode text NOT NULL CHECK (mode IN ('sea_fcl', 'sea_lcl', 'air', 'road')),
  direction text NOT NULL CHECK (direction IN ('export', 'import')),
  origin_port text NOT NULL,
  destination_port text NOT NULL,
  etd date NOT NULL,
  eta date NOT NULL,
  transit_days integer NOT NULL DEFAULT 0,
  vessel_name text DEFAULT '',
  voyage_no text DEFAULT '',
  flight_no text DEFAULT '',
  is_direct boolean DEFAULT true,
  legs_count integer DEFAULT 1,
  frequency text DEFAULT 'weekly',
  is_active boolean DEFAULT true,
  valid_from date DEFAULT CURRENT_DATE,
  valid_to date DEFAULT (CURRENT_DATE + interval '180 days'),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read schedules"
  ON schedules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert schedules"
  ON schedules FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS schedule_legs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid REFERENCES schedules(id) ON DELETE CASCADE,
  leg_no integer NOT NULL,
  from_port text NOT NULL,
  to_port text NOT NULL,
  carrier_id uuid REFERENCES carriers(id),
  vessel_name text DEFAULT '',
  voyage_no text DEFAULT '',
  flight_no text DEFAULT '',
  etd timestamptz,
  eta timestamptz,
  transit_days integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedule_legs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read schedule legs"
  ON schedule_legs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert schedule legs"
  ON schedule_legs FOR INSERT
  TO authenticated
  WITH CHECK (true);
