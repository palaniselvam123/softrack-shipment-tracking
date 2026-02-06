/*
  # Create Vessels Table

  1. New Tables
    - `vessels`
      - `id` (uuid, primary key)
      - `vessel_name` (text, unique, not null) - Name of the vessel
      - `imo_number` (text) - IMO identification number
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `vessels` table
    - Authenticated users can view vessels
*/

CREATE TABLE IF NOT EXISTS vessels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vessel_name text UNIQUE NOT NULL,
  imo_number text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view vessels"
  ON vessels
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert vessels"
  ON vessels
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
