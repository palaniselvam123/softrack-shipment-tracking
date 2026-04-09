/*
  # Normalize shipment statuses and seed 50 additional bookings

  1. Updates
    - Normalize 'delayed' (lowercase) to 'Delayed' for Title Case consistency
  2. New Data
    - 50 new bookings with fully populated fields
    - Realistic transport modes, service providers, job order numbers
    - Mix of statuses: pending, confirmed, cancelled
    - Varied cargo descriptions and complete address data
  3. Important Notes
    - Uses existing shipper/consignee names for customer mapping consistency
    - goods_description cast to jsonb
*/

UPDATE shipments SET shipment_status = 'Delayed' WHERE shipment_status = 'delayed';

DO $$
DECLARE
  shippers text[] := ARRAY['Tata Motors Ltd','Bharat Steel','Marico Ltd','Adani Exports','Godrej Agrovet','ITC Ltd','Larsen & Toubro','Mahindra Agritech','Max Pharma Ltd','Reliance Exports'];
  consignees text[] := ARRAY['ABC Imports Pvt Ltd','AmeriTech LLC','Bharat Pharma Exports','Euro Retail GmbH','Fresh Foods Inc','Global Traders LLP','Pacific Foods Ltd','Star Imports Ltd','Sun Drug Co Ltd','XYZ Automotives'];
  providers text[] := ARRAY['Maersk India Ltd','MSC India Pvt Ltd','CMA CGM India','Hapag-Lloyd India','Evergreen Shipping','OOCL India','ONE India','ZIM India','Yang Ming India','KLN India Pvt Ltd','DHL Global Forwarding','FedEx Logistics','DB Schenker India','Kuehne + Nagel India','DSV Air & Sea'];
  modes text[] := ARRAY['Sea Export','Sea Import','Air Export','Air Import','Road Domestic','Sea Export','Sea Import','Air Export','Sea Export','Sea Import'];
  origins text[] := ARRAY['Chennai, IN','Mumbai, IN','Nhava Sheva, IN','Kolkata, IN','Mundra, IN','Ennore, IN','Delhi, IN','Bangalore, IN','Cochin, IN','Tuticorin, IN','Hyderabad, IN','Vizag, IN','Ahmedabad, IN','Pune, IN','Jaipur, IN'];
  dests text[] := ARRAY['Dubai, UAE','Shanghai, CN','Singapore, SG','Rotterdam, NL','Hamburg, DE','New York, US','Los Angeles, US','London, UK','Tokyo, JP','Busan, KR','Colombo, LK','Jebel Ali, AE','Hong Kong, HK','Sydney, AU','Auckland, NZ'];
  cargo text[] := ARRAY['Textiles','Machinery','Pharmaceuticals','Auto Parts','Rice & Grains','Steel Coils','Chemicals','Electronics','Spices & Herbs','Cotton Bales','Leather Goods','Tea & Coffee','Garments','Rubber Products','Plastic Pellets','Wooden Furniture','Ceramic Tiles','Glass Products','Paper & Pulp','Agricultural Equipment'];
  ship_types text[] := ARRAY['FCL (Full Container Load)','LCL (Less than Container Load)','Air General','Air Express','FCL (Full Container Load)','Road FTL','Road LTL','Breakbulk','Reefer Container','Open Top Container'];
  booking_statuses text[] := ARRAY['pending','pending','pending','confirmed','confirmed','confirmed','confirmed','pending','confirmed','cancelled'];
  incoterms_arr text[] := ARRAY['FOB','CIF','CIP','DAP','DDP','EXW','FCA','CFR','CPT','DAT'];

  i integer;
  v_booking_no text;
  v_prefix text;
  v_shipper text;
  v_consignee text;
  v_status text;
  v_mode text;
  v_provider text;
  v_origin text;
  v_dest text;
  v_cargo text;
  v_ship_type text;
  v_pickup date;
  v_delivery date;
  v_job_order text;
  v_incoterm text;
BEGIN
  FOR i IN 1..50 LOOP
    v_prefix := CASE (i % 4)
      WHEN 0 THEN 'SE'
      WHEN 1 THEN 'SI'
      WHEN 2 THEN 'AE'
      ELSE 'AI'
    END;
    v_booking_no := v_prefix || '//' || LPAD((200 + i)::text, 4, '0') || '//' || ((i % 9) + 1)::text || '.' || ((i % 5) + 1)::text;
    v_shipper := shippers[1 + (i % 10)];
    v_consignee := consignees[1 + ((i + 2) % 10)];
    v_status := booking_statuses[1 + (i % 10)];
    v_mode := modes[1 + (i % 10)];
    v_provider := providers[1 + (i % 15)];
    v_origin := origins[1 + (i % 15)];
    v_dest := dests[1 + ((i + 3) % 15)];
    v_cargo := cargo[1 + (i % 20)];
    v_ship_type := ship_types[1 + (i % 10)];
    v_pickup := '2025-09-01'::date + (i * 3);
    v_delivery := v_pickup + (10 + (i % 20));
    v_job_order := (70000000 + i)::text;
    v_incoterm := incoterms_arr[1 + (i % 10)];

    INSERT INTO bookings_from_quotes (
      id, booking_no, user_id, shipper_name, shipper_address, shipper_contact, shipper_email,
      consignee_name, consignee_address, consignee_contact, consignee_email,
      notify_party, cargo_description, hs_code, marks_numbers, special_instructions,
      incoterm, status, created_at, updated_at,
      transport_mode, service_provider, job_order_no,
      shipment_type, movement_type, origin_location, destination_location,
      pickup_date, delivery_date, goods_description, services, remarks
    ) VALUES (
      gen_random_uuid(),
      v_booking_no,
      '1a7d2240-cd64-4ce3-8fde-b9f7694234d9',
      v_shipper,
      CASE (i % 5)
        WHEN 0 THEN '23 MG Road, Mumbai 400001'
        WHEN 1 THEN '45 Anna Salai, Chennai 600002'
        WHEN 2 THEN '12 Park Street, Kolkata 700016'
        WHEN 3 THEN '78 Brigade Road, Bangalore 560025'
        ELSE '56 Nehru Place, New Delhi 110019'
      END,
      '+91 ' || (9000000000 + (i * 1111))::text,
      LOWER(REPLACE(v_shipper, ' ', '.')) || '@example.com',
      v_consignee,
      CASE (i % 4)
        WHEN 0 THEN '100 Trade Center, Dubai'
        WHEN 1 THEN '55 Pudong Ave, Shanghai'
        WHEN 2 THEN '12 High Street, London'
        ELSE '789 Harbor Blvd, Los Angeles'
      END,
      '+' || (10000000000 + (i * 2222))::text,
      LOWER(REPLACE(v_consignee, ' ', '.')) || '@example.com',
      v_consignee,
      v_cargo || ' - Grade A commercial quality',
      (8400 + (i * 11))::text || '.' || LPAD((i % 100)::text, 2, '0'),
      'M&N-' || LPAD(i::text, 4, '0'),
      CASE WHEN i % 3 = 0 THEN 'Handle with care - fragile items' WHEN i % 3 = 1 THEN 'Temperature controlled storage required' ELSE '' END,
      v_incoterm,
      v_status,
      now() - ((50 - i) * interval '1 day'),
      now(),
      v_mode,
      v_provider,
      v_job_order,
      v_ship_type,
      CASE WHEN v_mode LIKE 'Sea%' THEN 'Port to Port' WHEN v_mode LIKE 'Air%' THEN 'Airport to Airport' ELSE 'Door to Door' END,
      v_origin,
      v_dest,
      v_pickup,
      v_delivery,
      to_jsonb(v_cargo),
      '[]'::jsonb,
      CASE WHEN i % 4 = 0 THEN 'Priority shipment' WHEN i % 4 = 1 THEN 'Regular handling' ELSE '' END
    );
  END LOOP;
END $$;
