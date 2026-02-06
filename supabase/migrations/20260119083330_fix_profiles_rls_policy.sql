/*
  # Fix Profiles RLS Policy

  1. Changes
    - Drop the problematic "Admins can view all profiles" policy that causes infinite recursion
    - Keep only the policy for users to view their own profile
    - Admins will use service role key for administrative operations if needed

  2. Security
    - Users can only view and update their own profile
    - Role changes are prevented by the update policy
*/

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
