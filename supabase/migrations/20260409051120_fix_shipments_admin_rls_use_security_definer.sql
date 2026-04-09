/*
  # Fix shipments admin RLS policy to use SECURITY DEFINER helper

  1. Changes
    - Create is_admin() SECURITY DEFINER function that checks profiles.role
      without being subject to profiles RLS (avoids potential recursion)
    - Replace "Admins see all shipments" policy to use JWT check OR is_admin()
    - Replace "Users see only their mapped shipments" policy accordingly
  2. Important Notes
    - SECURITY DEFINER runs as the function owner (superuser), bypassing RLS
    - This avoids the nested RLS issue where shipments policy queries profiles table
*/

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
  OR (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
$$;

DROP POLICY IF EXISTS "Admins see all shipments" ON shipments;
CREATE POLICY "Admins see all shipments"
  ON shipments FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Users see only their mapped shipments" ON shipments;
CREATE POLICY "Users see only their mapped shipments"
  ON shipments FOR SELECT
  TO authenticated
  USING (
    NOT is_admin()
    AND user_has_shipment_access("Shipper", "Consignee", "Sending Agent", "Receiving Agent")
  );
