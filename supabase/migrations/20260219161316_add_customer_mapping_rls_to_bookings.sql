/*
  # Add customer-mapping based RLS for non-admin users on bookings_from_quotes

  ## Problem
  Non-admin users see no bookings because the only SELECT policy is
  `auth.uid() = user_id`, which only matches bookings they personally created
  through the quotation flow. Customer users need to see bookings where they
  appear as shipper or consignee — just like shipments.

  ## Solution
  1. Create a SECURITY DEFINER helper `user_has_booking_access()` that checks
     customer_mappings without triggering nested RLS issues.
  2. Add a new SELECT policy for non-admins: show bookings where shipper_name
     or consignee_name matches one of their active customer mappings.

  ## New policies
  - `Non-admins see mapped bookings` — customers see bookings where their
    entity mapping matches the booking's shipper_name or consignee_name.

  ## Security
  - SECURITY DEFINER runs as postgres, safely reading customer_mappings
  - Non-admin gate prevents admins from hitting this path (they already have
    a broader admin policy)
*/

CREATE OR REPLACE FUNCTION public.user_has_booking_access(
  p_shipper_name text,
  p_consignee_name text
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM customer_mappings cm
    WHERE cm.user_id = auth.uid()
      AND cm.is_active = true
      AND (
        (cm.mapping_type = 'shipper'   AND cm.entity_name = p_shipper_name)
        OR (cm.mapping_type = 'consignee' AND cm.entity_name = p_consignee_name)
        OR (cm.mapping_type = 'customer'  AND cm.entity_name = p_shipper_name)
        OR (cm.mapping_type = 'customer'  AND cm.entity_name = p_consignee_name)
        OR (cm.mapping_type = 'agent'     AND cm.entity_name = p_shipper_name)
        OR (cm.mapping_type = 'agent'     AND cm.entity_name = p_consignee_name)
      )
  );
$$;

CREATE POLICY "Non-admins see mapped bookings"
  ON bookings_from_quotes
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin'
    AND NOT EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    AND public.user_has_booking_access(
      bookings_from_quotes.shipper_name,
      bookings_from_quotes.consignee_name
    )
  );
