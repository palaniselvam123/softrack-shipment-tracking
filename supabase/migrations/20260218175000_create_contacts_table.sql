/*
  # Create contacts table for shipper/consignee address book

  1. New Tables
    - `contacts` - Address book for shippers, consignees, and notify parties
      - `id` (uuid, primary key)
      - `type` (text) - shipper | consignee | both
      - `name` (text) - Company or person name
      - `address` (text) - Street address
      - `city` (text)
      - `country` (text)
      - `country_code` (text) - 2-letter ISO code
      - `contact` (text) - Phone number
      - `email` (text)
      - `is_indian` (boolean) - Whether this is an Indian party
      - `user_id` (uuid) - Owner user, null = system/shared contacts
  2. Security
    - Enable RLS
    - Authenticated users can read all contacts (shared address book)
    - Users can create/update their own contacts
  3. Seed Data
    - 20 contacts from existing mock shipments and BookingWizard data
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'both' CHECK (type IN ('shipper', 'consignee', 'both')),
  name text NOT NULL,
  address text DEFAULT '',
  city text DEFAULT '',
  country text DEFAULT '',
  country_code text DEFAULT '',
  contact text DEFAULT '',
  email text DEFAULT '',
  tax_id text DEFAULT '',
  is_indian boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create contacts"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Seed data: Indian shippers
INSERT INTO contacts (type, name, address, city, country, country_code, contact, email, is_indian) VALUES
  ('shipper', 'Textile Exports India Ltd', 'Plot 45, MIDC Industrial Area', 'Pune', 'India', 'IN', '+91 20 2765 4321', 'exports@textileindiaexports.com', true),
  ('shipper', 'Electronics Manufacturing Co', 'B-12, SEZ Phase 2', 'Chennai', 'India', 'IN', '+91 44 2678 9900', 'shipping@emcelectronics.in', true),
  ('shipper', 'Pharmaceutical Exports Ltd', 'Survey No 45, Andheri East', 'Mumbai', 'India', 'IN', '+91 22 4567 8901', 'exports@pharmaexportsltd.com', true),
  ('shipper', 'Spices & Condiments Export', 'Kerala Spice Park, NH-66', 'Kochi', 'India', 'IN', '+91 484 234 5678', 'trade@spicesexport.in', true),
  ('shipper', 'Steel Manufacturing Ltd', 'Industrial Zone, Sector 5', 'Mundra', 'India', 'IN', '+91 2838 255 000', 'exports@steelmfgltd.com', true),
  ('shipper', 'ANL Industries Pvt Ltd', '123 Industrial Area, Sector 15', 'Mumbai', 'India', 'IN', '+91 98765 43210', 'logistics@anlindustries.com', true),
  ('shipper', 'Kalpataru Logistics Solutions', '456 Export House, MIDC Area', 'Pune', 'India', 'IN', '+91 87654 32109', 'operations@kalpatarulogistics.com', true),
  ('shipper', 'Global Trading Company', '789 Trade Center, BKC', 'Mumbai', 'India', 'IN', '+91 76543 21098', 'shipping@globaltradingco.in', true),
  ('shipper', 'Leather Goods Manufacturer', 'Leather Complex, Dharavi', 'Mumbai', 'India', 'IN', '+91 22 2411 5566', 'export@leathermfg.in', true),
  ('shipper', 'Karnataka Agricultural Co-op', 'Agri Bhavan, KR Road', 'Bangalore', 'India', 'IN', '+91 80 2234 5678', 'trade@karagricoop.in', true),
  -- Foreign consignees
  ('consignee', 'European Fashion House', 'Große Bleichen 23', 'Hamburg', 'Germany', 'DE', '+49 40 3456 7890', 'imports@europefashion.de', false),
  ('consignee', 'South Asia Trading Company', 'Plot 15, Industrial Zone', 'Mumbai', 'India', 'IN', '+91 22 3456 7890', 'imports@southasiatrading.in', true),
  ('consignee', 'Tech Solutions Dubai', 'Dubai Silicon Oasis, Block A', 'Dubai', 'UAE', 'AE', '+971 4 567 8900', 'logistics@techsolutionsdxb.com', false),
  ('consignee', 'HealthCare International', 'Jebel Ali Free Zone, Unit 5A', 'Dubai', 'UAE', 'AE', '+971 4 890 1234', 'supply@healthcareintl.ae', false),
  ('consignee', 'Brazilian Steel Imports', 'Porto de Santos, Armazem 12', 'Santos', 'Brazil', 'BR', '+55 13 3456 7890', 'procurement@brasilsteel.com.br', false),
  ('consignee', 'Australian Fine Wines', '88 Wine Valley Road', 'East Perth', 'Australia', 'AU', '+61 8 9876 5432', 'export@ausfinewines.com.au', false),
  ('consignee', 'American Tech Solutions', '500 Fifth Avenue, Suite 800', 'New York', 'USA', 'US', '+1 212 456 7890', 'logistics@amtechsol.com', false),
  ('consignee', 'Industrial Equipment India', 'MIDC Plot 45, Ambernath', 'Thane', 'India', 'IN', '+91 251 234 5678', 'imports@indequipment.in', true),
  ('consignee', 'European Leather Imports', 'Rue du Commerce 45', 'Brussels', 'Belgium', 'BE', '+32 2 345 6789', 'procurement@euroleather.be', false),
  ('consignee', '3PL Logistics Hub', '321 Warehouse District', 'Gurgaon', 'India', 'IN', '+91 65432 10987', 'bookings@3pllogistics.com', true);
