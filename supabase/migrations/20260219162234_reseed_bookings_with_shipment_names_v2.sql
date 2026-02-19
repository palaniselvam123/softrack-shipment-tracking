/*
  # Reseed bookings_from_quotes with shipper/consignee names matching shipments (v2)

  ## Summary
  Clears all existing bookings and reseeds 200 with shipper/consignee names
  that exactly match those in the shipments table, ensuring RLS scoping works
  consistently across bookings and shipments for the same customer mappings.
*/

DELETE FROM bookings_from_quotes;

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
    'Adani Exports','Bharat Steel','Godrej Agrovet','ITC Ltd',
    'Larsen & Toubro','Mahindra Agritech','Marico Ltd','Max Pharma Ltd',
    'Reliance Exports','Tata Motors Ltd'
  ];
  v_consignees text[] := ARRAY[
    'ABC Imports Pvt Ltd','AmeriTech LLC','Bharat Pharma Exports','Euro Retail GmbH',
    'Fresh Foods Inc','Global Traders LLP','Pacific Foods Ltd','Star Imports Ltd',
    'Sun Drug Co Ltd','XYZ Automotives'
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
    'Automotive Parts','Steel','Chemicals','Garments','Agro Products'
  ];
  v_movement_types text[] := ARRAY[
    'FCL (Full Container Load)','LCL (Less than Container Load)',
    'Air Express','Air General','Door-to-Door','Port-to-Door'
  ];
  v_mode_prefixes text[] := ARRAY['SI','SE','AI','AE','LI','LE'];
  i int;
  v_mode text;
  v_mode_idx int;
  v_prefix text;
  v_booking_no text;
  v_date timestamptz;
  v_shipper text;
  v_consignee text;
  v_status text;
  v_job int;
BEGIN
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  v_job := 69595500;

  FOR i IN 1..200 LOOP
    v_mode_idx := (i % 6) + 1;
    v_mode := v_modes[v_mode_idx];
    v_prefix := v_mode_prefixes[v_mode_idx];
    v_booking_no := v_prefix || '//' || LPAD(i::text, 4, '0') || '//' || (5 + (i % 15))::text || '.' || (i % 9 + 1)::text;
    v_date := now() - ((200 - i) * interval '1 day') - ((i % 12) * interval '1 hour');
    v_shipper := v_shippers[(i % array_length(v_shippers, 1)) + 1];
    v_consignee := v_consignees[(i % array_length(v_consignees, 1)) + 1];
    v_status := v_statuses[(i % array_length(v_statuses, 1)) + 1];
    v_job := v_job + 1;

    INSERT INTO bookings_from_quotes (
      booking_no, user_id, shipper_name, consignee_name,
      transport_mode, service_provider, status, job_order_no,
      origin_location, destination_location,
      pickup_date, delivery_date,
      goods_description, shipment_type,
      created_at, updated_at
    ) VALUES (
      v_booking_no,
      v_user_id,
      v_shipper,
      v_consignee,
      v_mode,
      v_service_providers[(i % array_length(v_service_providers, 1)) + 1],
      v_status,
      v_job::text,
      v_origins[(i % array_length(v_origins, 1)) + 1],
      v_destinations[(i % array_length(v_destinations, 1)) + 1],
      (v_date + interval '2 days')::date,
      (v_date + interval '15 days')::date,
      to_jsonb(v_cargo_types[(i % array_length(v_cargo_types, 1)) + 1]),
      v_movement_types[(i % array_length(v_movement_types, 1)) + 1],
      v_date,
      v_date
    )
    ON CONFLICT (booking_no) DO NOTHING;
  END LOOP;
END $$;
