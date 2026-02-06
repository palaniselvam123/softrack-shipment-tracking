/*
  # Create Milestones Table

  1. New Tables
    - `milestones`
      - `id` (uuid, primary key) - unique identifier
      - `shipment_number` (text, not null) - links to the shipment
      - `lob` (text, not null) - line of business (Sea Export, Air Export, Air Import, Road Domestic)
      - `milestone_name` (text, not null) - name of the milestone step
      - `milestone_order` (integer, not null) - sequential order within the shipment
      - `status` (text, not null) - completed, skipped, or pending
      - `completed_date` (timestamptz, nullable) - when the milestone was completed
      - `notes` (text, nullable) - optional notes about the milestone
      - `created_at` (timestamptz) - record creation timestamp

  2. Security
    - Enable RLS on `milestones` table
    - Add policy for authenticated users to read milestones
    - Add policy for authenticated users to insert milestones
    - Add policy for authenticated users to update milestones

  3. Indexes
    - Index on `shipment_number` for fast lookups
    - Index on `lob` for filtering by line of business

  4. Notes
    - LOB values: Sea Export, Air Export, Air Import, Road Domestic
    - Status values: completed, skipped, pending
    - milestone_order determines the display sequence
*/

CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number text NOT NULL,
  lob text NOT NULL,
  milestone_name text NOT NULL,
  milestone_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  completed_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),

  CONSTRAINT milestones_status_check CHECK (status IN ('completed', 'skipped', 'pending')),
  CONSTRAINT milestones_lob_check CHECK (lob IN ('Sea Export', 'Air Export', 'Air Import', 'Road Domestic'))
);

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_milestones_shipment_number ON milestones (shipment_number);
CREATE INDEX IF NOT EXISTS idx_milestones_lob ON milestones (lob);

CREATE POLICY "Authenticated users can read milestones"
  ON milestones
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert milestones"
  ON milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update milestones"
  ON milestones
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
