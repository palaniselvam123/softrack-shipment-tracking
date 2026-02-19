/*
  # Add admin bypass RLS policy for bookings_from_quotes

  Admins (role = 'admin' in profiles) should be able to view all bookings.
  This adds a SELECT policy that allows admin users to read all rows.
*/

CREATE POLICY "Admins can view all quote bookings"
  ON bookings_from_quotes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
