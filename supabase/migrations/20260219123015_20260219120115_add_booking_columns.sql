/*
  # Add missing columns to bookings_from_quotes table
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings_from_quotes' AND column_name = 'transport_mode') THEN
    ALTER TABLE bookings_from_quotes ADD COLUMN transport_mode text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings_from_quotes' AND column_name = 'service_provider') THEN
    ALTER TABLE bookings_from_quotes ADD COLUMN service_provider text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings_from_quotes' AND column_name = 'job_order_no') THEN
    ALTER TABLE bookings_from_quotes ADD COLUMN job_order_no text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings_from_quotes' AND column_name = 'shipment_type') THEN
    ALTER TABLE bookings_from_quotes ADD COLUMN shipment_type text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings_from_quotes' AND column_name = 'movement_type') THEN
    ALTER TABLE bookings_from_quotes ADD COLUMN movement_type text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings_from_quotes' AND column_name = 'origin_location') THEN
    ALTER TABLE bookings_from_quotes ADD COLUMN origin_location text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings_from_quotes' AND column_name = 'destination_location') THEN
    ALTER TABLE bookings_from_quotes ADD COLUMN destination_location text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings_from_quotes' AND column_name = 'pickup_date') THEN
    ALTER TABLE bookings_from_quotes ADD COLUMN pickup_date date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings_from_quotes' AND column_name = 'delivery_date') THEN
    ALTER TABLE bookings_from_quotes ADD COLUMN delivery_date date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings_from_quotes' AND column_name = 'goods_description') THEN
    ALTER TABLE bookings_from_quotes ADD COLUMN goods_description jsonb DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings_from_quotes' AND column_name = 'services') THEN
    ALTER TABLE bookings_from_quotes ADD COLUMN services jsonb DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings_from_quotes' AND column_name = 'remarks') THEN
    ALTER TABLE bookings_from_quotes ADD COLUMN remarks text DEFAULT '';
  END IF;
END $$;

CREATE SEQUENCE IF NOT EXISTS booking_job_order_seq START 69595600;
