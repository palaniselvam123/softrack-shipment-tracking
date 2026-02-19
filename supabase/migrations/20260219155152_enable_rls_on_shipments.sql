/*
  # Enable RLS on shipments table

  RLS was never enabled on the shipments table, causing all policies to be
  ignored and every authenticated user to see all rows.
  This migration enables RLS so the existing policies are enforced.
*/

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
