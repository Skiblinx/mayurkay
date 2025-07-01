
-- Insert the first admin user into the admin_users table
-- Replace 'your-admin-email@example.com' with your actual admin email
INSERT INTO public.admin_users (email, role, is_active) 
VALUES ('admin@mayurcollections.com', 'admin', true);

-- Create a storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Create RLS policies for the product-images bucket
-- Allow public read access to product images
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated admin users to upload product images
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.is_active = true
    )
  );

-- Allow authenticated admin users to update product images
CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.is_active = true
    )
  );

-- Allow authenticated admin users to delete product images
CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.is_active = true
    )
  );
