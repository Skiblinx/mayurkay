
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Using integer for price in cents/kobo
  images TEXT[] DEFAULT '{}', -- Array of image URLs
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hero_slides table for carousel content
CREATE TABLE public.hero_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT,
  cta_text TEXT,
  cta_link TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_content table for flexible content management
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL, -- e.g., 'home', 'about', 'contact'
  section TEXT NOT NULL, -- e.g., 'hero', 'features', 'testimonials'
  content_type TEXT NOT NULL, -- e.g., 'text', 'html', 'json', 'image'
  content_data JSONB NOT NULL, -- Flexible JSON content
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table for e-commerce functionality
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT,
  shipping_address JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL, -- Price at time of order
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin users table (for CMS access)
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (categories, products, hero_slides, site_content)
CREATE POLICY "Allow public read access to categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to active hero slides" ON public.hero_slides
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to active site content" ON public.site_content
  FOR SELECT USING (is_active = true);

-- Create RLS policies for orders (users can only see their own orders)
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view order items for their orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Users can create order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Admin policies (allow all operations for admin users)
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can manage hero slides" ON public.hero_slides
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can manage site content" ON public.site_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.is_active = true
    )
  );

-- Only admins can manage admin_users table
CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND admin_users.is_active = true
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_hero_slides_order_index ON public.hero_slides(order_index);
CREATE INDEX idx_site_content_page_section ON public.site_content(page, section);
CREATE INDEX idx_orders_user_email ON public.orders(user_email);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- Insert sample data
INSERT INTO public.categories (name, description, image, slug) VALUES
('Big Bags', 'Spacious tote bags and large handbags', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop', 'big-bags'),
('Medium Bags', 'Perfect sized handbags for everyday use', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop', 'medium-bags'),
('Small Bags', 'Compact crossbody and mini bags', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', 'small-bags'),
('Clutch Bags', 'Elegant evening and occasion clutches', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', 'clutch-bags'),
('Jewelry', 'Beautiful necklaces, earrings, and accessories', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop', 'jewelry'),
('Scarfs', 'Luxurious silk and cashmere scarfs', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop', 'scarfs');

-- Insert sample hero slides
INSERT INTO public.hero_slides (title, subtitle, image, cta_text, cta_link, order_index) VALUES
('Premium Fashion Collection', 'Discover the latest in luxury bags and accessories', '/placeholder.svg?height=500&width=1200', 'Shop Now', '/products', 1),
('Handcrafted Excellence', 'Each piece is crafted with attention to detail', '/placeholder.svg?height=500&width=1200', 'Explore Collection', '/products', 2),
('Timeless Elegance', 'Style that transcends seasons and trends', '/placeholder.svg?height=500&width=1200', 'View Catalog', '/products', 3);

-- Insert sample site content
INSERT INTO public.site_content (page, section, content_type, content_data) VALUES
('home', 'welcome', 'json', '{"heading": "Welcome to Mayur Collections", "description": "Discover our curated collection of premium bags, jewelry, and accessories"}'),
('home', 'featured', 'json', '{"heading": "Featured Products", "description": "Hand-picked items from our latest collection"}'),
('about', 'company', 'json', '{"heading": "About Mayur Collections", "description": "We are passionate about bringing you the finest quality fashion accessories"}');
