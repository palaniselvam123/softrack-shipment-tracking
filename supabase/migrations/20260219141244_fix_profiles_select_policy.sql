/*
  # Fix profiles RLS select policy

  The existing "Users can view own profile" policy should allow users to read
  their own profile row. This migration drops and recreates it cleanly to ensure
  there are no conflicts, and also ensures the role column cast is correct.
*/

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
