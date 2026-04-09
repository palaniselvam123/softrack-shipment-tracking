/*
  # Fix bookings admin RLS policy to use is_admin() SECURITY DEFINER helper

  1. Changes
    - Replace "Admins can view all quote bookings" policy to use is_admin() helper
    - Replace "Non-admins see mapped bookings" policy to use is_admin() helper
  2. Important Notes
    - is_admin() was created in the previous migration as SECURITY DEFINER
    - This avoids nested RLS recursion when checking profiles.role from within bookings policies
*/

DROP POLICY IF EXISTS "Admins can view all quote bookings" ON bookings_from_quotes;
CREATE POLICY "Admins can view all quote bookings"
  ON bookings_from_quotes FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Non-admins see mapped bookings" ON bookings_from_quotes;
CREATE POLICY "Non-admins see mapped bookings"
  ON bookings_from_quotes FOR SELECT
  TO authenticated
  USING (
    NOT is_admin()
    AND user_has_booking_access(shipper_name, consignee_name)
  );
