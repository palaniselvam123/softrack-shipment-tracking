/*
  # Create carriers table

  1. New Tables
    - `carriers` - Shipping lines, airlines, and freight carriers
      - `id` (uuid, primary key)
      - `name` (text) - Full carrier name
      - `code` (text, unique) - Short code like MSC, MAERSK
      - `type` (text) - shipping_line | airline | road | multimodal
      - `country` (text) - Carrier's home country
      - `scac_code` (text) - SCAC code for shipping lines
      - `color` (text) - Brand hex color for UI
      - `is_active` (boolean) - Whether carrier is active
  2. Security
    - Enable RLS, authenticated users can read all carriers
  3. Seed Data
    - 12 major carriers (MSC, Maersk, CMA CGM, Hapag-Lloyd, Evergreen, ONE, PIL, COSCO, Air India Cargo, Emirates, Lufthansa, Singapore Airlines)
*/

CREATE TABLE IF NOT EXISTS carriers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('shipping_line', 'airline', 'road', 'multimodal')),
  country text NOT NULL DEFAULT '',
  scac_code text DEFAULT '',
  color text DEFAULT '#1e40af',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read carriers"
  ON carriers FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO carriers (name, code, type, country, scac_code, color) VALUES
  ('MSC Mediterranean Shipping', 'MSC', 'shipping_line', 'Switzerland', 'MSCU', '#1a1a1a'),
  ('Maersk Line', 'MAERSK', 'shipping_line', 'Denmark', 'MAEU', '#42B0D5'),
  ('CMA CGM', 'CMACGM', 'shipping_line', 'France', 'CMAU', '#E31837'),
  ('Hapag-Lloyd', 'HAPAG', 'shipping_line', 'Germany', 'HLCU', '#F37021'),
  ('Evergreen Line', 'EVERGREEN', 'shipping_line', 'Taiwan', 'EGLV', '#007A3D'),
  ('ONE (Ocean Network Express)', 'ONE', 'shipping_line', 'Japan', 'ONEY', '#E4007F'),
  ('PIL (Pacific Int''l Lines)', 'PIL', 'shipping_line', 'Singapore', 'PABV', '#003087'),
  ('COSCO Shipping', 'COSCO', 'shipping_line', 'China', 'COSU', '#1B4F72'),
  ('Air India Cargo', 'AICARGO', 'airline', 'India', '', '#CC0000'),
  ('Emirates SkyCargo', 'EKSKY', 'airline', 'UAE', 'EK', '#C71234'),
  ('Lufthansa Cargo', 'LHCARGO', 'airline', 'Germany', 'LH', '#05164D'),
  ('Singapore Airlines Cargo', 'SQCARGO', 'airline', 'Singapore', 'SQ', '#152F5F'),
  ('IndiGo CarGo', 'INDIGO', 'airline', 'India', '6E', '#1B3FA0'),
  ('FedEx International', 'FEDEX', 'airline', 'USA', 'FX', '#FF6200')
ON CONFLICT (code) DO NOTHING;
