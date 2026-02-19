/*
  # Admin Portal Tables

  1. New Tables
    - `user_profiles_extended`
      - Extends profiles with full_name, company, phone, avatar_url, status, user_type
    - `user_permissions`
      - Granular per-module permissions per user
    - `customer_mappings`
      - Maps users to specific shipper/consignee/agent names in shipments data
    - `theme_settings`
      - Per-organisation theme/branding settings
    - `admin_audit_log`
      - Audit log of admin actions

  2. Security
    - RLS enabled on all tables
    - Only admins can manage users/permissions/themes
    - Users can read their own permissions
*/

-- Extend profiles with more user info
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name text DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company text DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_type text DEFAULT 'internal' CHECK (user_type IN ('internal', 'customer', 'shipper', 'consignee', 'agent'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invited_by uuid REFERENCES auth.users(id);

-- User permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module text NOT NULL,
  can_view boolean DEFAULT false,
  can_create boolean DEFAULT false,
  can_edit boolean DEFAULT false,
  can_delete boolean DEFAULT false,
  can_export boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module)
);

ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all permissions"
  ON user_permissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR user_id = auth.uid()
  );

CREATE POLICY "Admins can insert permissions"
  ON user_permissions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update permissions"
  ON user_permissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete permissions"
  ON user_permissions FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Customer mappings table
CREATE TABLE IF NOT EXISTS customer_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mapping_type text NOT NULL CHECK (mapping_type IN ('customer', 'shipper', 'consignee', 'agent')),
  entity_name text NOT NULL,
  entity_code text DEFAULT '',
  notes text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customer_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all mappings"
  ON customer_mappings FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR user_id = auth.uid()
  );

CREATE POLICY "Admins can insert mappings"
  ON customer_mappings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update mappings"
  ON customer_mappings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete mappings"
  ON customer_mappings FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Theme settings table (one row per org, or per user override)
CREATE TABLE IF NOT EXISTS theme_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL DEFAULT 'global' CHECK (scope IN ('global', 'user')),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_color text DEFAULT '#0284c7',
  secondary_color text DEFAULT '#0891b2',
  accent_color text DEFAULT '#0ea5e9',
  sidebar_color text DEFAULT '#1e293b',
  logo_url text DEFAULT '',
  company_name text DEFAULT 'LogiTRACK',
  font_family text DEFAULT 'Inter',
  border_radius text DEFAULT 'rounded-xl',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(scope, user_id)
);

ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view global theme"
  ON theme_settings FOR SELECT
  TO authenticated
  USING (scope = 'global' OR user_id = auth.uid());

CREATE POLICY "Admins can insert theme"
  ON theme_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR (scope = 'user' AND user_id = auth.uid())
  );

CREATE POLICY "Admins can update theme"
  ON theme_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR (scope = 'user' AND user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR (scope = 'user' AND user_id = auth.uid())
  );

-- Admin audit log
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id),
  action text NOT NULL,
  target_user_id uuid REFERENCES auth.users(id),
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
  ON admin_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert audit log"
  ON admin_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    AND admin_id = auth.uid()
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_mappings_user_id ON customer_mappings(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_mappings_type ON customer_mappings(mapping_type);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON admin_audit_log(admin_id);

-- Insert default global theme
INSERT INTO theme_settings (scope, primary_color, secondary_color, accent_color, sidebar_color, company_name)
VALUES ('global', '#0284c7', '#0891b2', '#0ea5e9', '#1e293b', 'LogiTRACK')
ON CONFLICT (scope, user_id) DO NOTHING;
