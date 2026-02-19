/*
  # Seed 200 bookings into bookings_from_quotes

  ## Summary
  Inserts 200 realistic freight bookings covering Sea/Air/Land Import/Export
  with varied service providers, shippers, consignees, statuses, and dates.
  All bookings are assigned to the first existing user.
*/

DO $$
DECLARE
  v_user_id uuid;
  v_service_providers text[] := ARRAY[
    'UPS India Pvt Ltd','Maersk India Ltd','MSC India Pvt Ltd','KLN India Pvt Ltd',
    'CMA CGM India','Hapag Lloyd India','DHL Express India','FedEx India',
    'Emirates SkyCargo','Qatar Airways Cargo','VRL Logistics','TCI Freight',
    'Blue Dart Express','Gati KWE','OOCL India','Evergreen India',
    'Yang Ming India','PIL India','Wan Hai India','Sinotrans India'
  ];
  v_shippers text[] := ARRAY[
    'Stark Private Limited','Global Traders Inc','Continental Exports','Transhipper Private Limited',
    'Export Masters Ltd','Maritime Exports Pvt Ltd','European Electronics GmbH','American Auto Parts Inc',
    'Pharma Exports India Ltd','Fresh Foods Exports','Nepal Trading Co','Bangladesh Textiles Ltd',
    'Bangalore Tech Solutions','Chennai Manufacturing Ltd','Delhi Auto Components','Pune Engineering Works',
    'Hyderabad Pharma Ltd','Kolkata Jute Mills','Ahmedabad Textile Co','Surat Diamond Exporters',
    'Coimbatore Machinery Ltd','Nagpur Agro Exports','Kochi Spice Traders','Vizag Steel Exports',
    'Jaipur Handicrafts','Ludhiana Garments Ltd','Amritsar Silk House','Kanpur Leather Works'
  ];
  v_consignees text[] := ARRAY[
    '14square Private Limited','Mumbai Imports Ltd','Bangalore Trading Co','Stark Private Limited',
    'International Trading Co','Global Logistics Singapore','Tech Solutions India','Chennai Motors Ltd',
    'Healthcare Dubai LLC','Middle East Grocers','Delhi Distributors Pvt Ltd','Mumbai Fashion House',
    'Sri Lanka Electronics','Colombo Trading Co','Hong Kong Trade Ltd','Singapore Imports Co',
    'Dubai Logistics LLC','London Wholesale Ltd','Frankfurt Auto GmbH','Shanghai Trading Co',
    'New York Imports Inc','Tokyo Electronics Ltd','Sydney Commerce Pty','Toronto Goods Inc',
    'Paris Distribution SA','Amsterdam Traders BV','Seoul Electronics Co','Bangkok Commerce Ltd'
  ];
  v_modes text[] := ARRAY['Sea Import','Sea Export','Air Import','Air Export','Land Import','Land Export'];
  v_statuses text[] := ARRAY['pending','pending','pending','confirmed','cancelled'];
  v_origins text[] := ARRAY[
    'Mumbai, IN','Chennai, IN','Nhava Sheva, IN','Kolkata, IN','Bangalore, IN',
    'Delhi, IN','Hyderabad, IN','Kochi, IN','Ahmedabad, IN','Pune, IN'
  ];
  v_destinations text[] := ARRAY[
    'Singapore, SG','Dubai, UAE','Shanghai, CN','Los Angeles, US','Hamburg, DE',
    'Colombo, LK','Bangkok, TH','Hong Kong, HK','London, GB','Tokyo, JP',
    'Sydney, AU','New York, US','Jebel Ali, UAE','Rotterdam, NL','Busan, KR'
  ];
  v_cargo_types text[] := ARRAY[
    'Electronics','Textiles','Machinery','Pharmaceuticals','Food Products',
    'Auto Parts','Chemicals','Steel Products','Garments','Handicrafts',
    'Spices','Diamonds','Software Hardware','Agricultural Products','Consumer Goods'
  ];
  v_movement_types text[] := ARRAY['FCL','LCL','Door-to-Door','Door-to-Port','Port-to-Door','Port-to-Port'];

  i int;
  v_mode text;
  v_prefix text;
  v_booking_no text;
  v_status text;
  v_shipper text;
  v_consignee text;
  v_sp text;
  v_origin text;
  v_dest text;
  v_cargo text;
  v_movement text;
  v_pickup date;
  v_delivery date;
  v_created_at timestamptz;
  v_job_no text;
  v_seed int;
BEGIN
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  FOR i IN 1..200 LOOP
    v_seed := i * 7 + 13;
    v_mode    := v_modes[((i * 7 + 1) % array_length(v_modes, 1)) + 1];
    v_sp      := v_service_providers[((i * 19 + 7) % array_length(v_service_providers, 1)) + 1];
    v_shipper := v_shippers[((i * 29 + 9) % array_length(v_shippers, 1)) + 1];
    v_consignee := v_consignees[((i * 31 + 10) % array_length(v_consignees, 1)) + 1];
    v_status  := v_statuses[((i * 23 + 8) % array_length(v_statuses, 1)) + 1];
    v_origin  := v_origins[((i * 11 + 3) % array_length(v_origins, 1)) + 1];
    v_dest    := v_destinations[((i * 13 + 5) % array_length(v_destinations, 1)) + 1];
    v_cargo   := v_cargo_types[((i * 17 + 2) % array_length(v_cargo_types, 1)) + 1];
    v_movement := v_movement_types[((i * 3 + 1) % array_length(v_movement_types, 1)) + 1];

    v_prefix := CASE v_mode
      WHEN 'Sea Import'  THEN 'SE-S'
      WHEN 'Sea Export'  THEN 'SE-E'
      WHEN 'Air Import'  THEN 'AI'
      WHEN 'Air Export'  THEN 'AE'
      WHEN 'Land Import' THEN 'LI'
      WHEN 'Land Export' THEN 'LE'
      ELSE 'BK'
    END;

    v_booking_no := v_prefix || '//' || LPAD(TO_CHAR(49 + i, 'FM9999'), 4, '0') || '//' ||
                    TO_CHAR(((i * 3 + 2) % 20) + 1, 'FM99') || '.' ||
                    TO_CHAR(((i * 5 + 3) % 9) + 1, 'FM9');

    v_job_no := TO_CHAR(69595596 + i, 'FM99999999');

    v_created_at := NOW() - (((i * 3) % 365) || ' days')::interval;
    v_pickup  := v_created_at::date + ((i % 7) + 1);
    v_delivery := v_pickup + ((i % 14) + 7);

    INSERT INTO bookings_from_quotes (
      booking_no, user_id, service_provider, transport_mode, shipment_type,
      movement_type, job_order_no, shipper_name, consignee_name,
      origin_location, destination_location, pickup_date, delivery_date,
      cargo_description, status, created_at, updated_at
    ) VALUES (
      v_booking_no, v_user_id, v_sp, v_mode,
      CASE WHEN v_mode LIKE '%Import%' THEN 'Import' ELSE 'Export' END,
      v_movement, v_job_no, v_shipper, v_consignee,
      v_origin, v_dest, v_pickup, v_delivery,
      v_cargo, v_status, v_created_at, v_created_at
    )
    ON CONFLICT (booking_no) DO NOTHING;
  END LOOP;
END $$;
