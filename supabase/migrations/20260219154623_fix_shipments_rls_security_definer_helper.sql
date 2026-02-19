/*
  # Fix shipments RLS - use SECURITY DEFINER helper to avoid RLS chain issues

  ## Problem
  The "Users see only their mapped shipments" policy uses a subquery into
  customer_mappings, which itself has RLS. This nested RLS evaluation can
  fail silently (returning 0 rows from the subquery), causing the policy
  to evaluate to FALSE and show no results — or in some Postgres versions
  the RLS on the referenced table is bypassed in subqueries within policies,
  causing all rows to show.

  ## Solution
  Create a SECURITY DEFINER function that safely checks if a user has a
  mapping for a given entity name. SECURITY DEFINER runs as the function
  owner (postgres) and bypasses RLS on customer_mappings, making the
  shipments RLS policy reliable.

  Also drop and recreate the shipments SELECT policies cleanly.
*/

CREATE OR REPLACE FUNCTION public.user_has_shipment_access(
  p_shipper text,
  p_consignee text,
  p_sending_agent text,
  p_receiving_agent text
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
        (cm.mapping_type = 'shipper'    AND cm.entity_name = p_shipper)
        OR (cm.mapping_type = 'consignee' AND cm.entity_name = p_consignee)
        OR (cm.mapping_type = 'agent'     AND cm.entity_name = p_sending_agent)
        OR (cm.mapping_type = 'agent'     AND cm.entity_name = p_receiving_agent)
        OR (cm.mapping_type = 'customer'  AND cm.entity_name = p_shipper)
        OR (cm.mapping_type = 'customer'  AND cm.entity_name = p_consignee)
      )
  );
$$;

DROP POLICY IF EXISTS "Admins see all shipments" ON shipments;
DROP POLICY IF EXISTS "Users see only their mapped shipments" ON shipments;

CREATE POLICY "Admins see all shipments"
  ON shipments
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Users see only their mapped shipments"
  ON shipments
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin'
    AND NOT EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    AND public.user_has_shipment_access(
      shipments."Shipper",
      shipments."Consignee",
      shipments."Sending Agent",
      shipments."Receiving Agent"
    )
  );
