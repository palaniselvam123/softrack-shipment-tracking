/*
  # Shipments Row Level Security - Scoped Access for Non-Admin Users

  ## Overview
  Replaces the open "all authenticated users see all shipments" policy with
  a two-tier policy:
    - Admins (app_metadata.role = 'admin') see ALL shipments
    - Non-admin authenticated users see ONLY shipments where their
      customer_mappings (is_active = true) match the shipment's
      Shipper, Consignee, Sending Agent, or Receiving Agent fields

  ## Tables Modified
  - shipments: SELECT policy replaced

  ## Security
  - Admins retain full unrestricted access
  - Non-admins are scoped to their assigned entities via customer_mappings
  - Uses app_metadata.role for admin check (no recursive profiles query)
*/

DROP POLICY IF EXISTS "Authenticated users can view all shipments" ON shipments;

CREATE POLICY "Admins see all shipments"
  ON shipments
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Users see only their mapped shipments"
  ON shipments
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin'
    AND (
      EXISTS (
        SELECT 1 FROM customer_mappings cm
        WHERE cm.user_id = auth.uid()
          AND cm.is_active = true
          AND (
            (cm.mapping_type = 'shipper'    AND cm.entity_name = shipments."Shipper")
            OR (cm.mapping_type = 'consignee' AND cm.entity_name = shipments."Consignee")
            OR (cm.mapping_type = 'agent'     AND cm.entity_name = shipments."Sending Agent")
            OR (cm.mapping_type = 'agent'     AND cm.entity_name = shipments."Receiving Agent")
            OR (cm.mapping_type = 'customer'  AND cm.entity_name = shipments."Shipper")
            OR (cm.mapping_type = 'customer'  AND cm.entity_name = shipments."Consignee")
          )
      )
    )
  );
