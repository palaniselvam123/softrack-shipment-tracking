/*
  # Promote admin@freightportal.com to admin role

  1. Updates
    - Set profiles.role = 'admin' for admin@freightportal.com
    - Set auth.users.raw_app_meta_data.role = 'admin' for JWT-based admin checks
  2. Important Notes
    - Both profile role and JWT app_metadata must be set for RLS policies to work
    - This ensures the user can see all shipments and access the admin portal
*/

UPDATE profiles
SET role = 'admin', updated_at = now()
WHERE email = 'admin@freightportal.com';

UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@freightportal.com';
