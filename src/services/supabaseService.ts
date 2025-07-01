
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type HeroSlide = Database['public']['Tables']['hero_slides']['Row'];
type SiteContent = Database['public']['Tables']['site_content']['Row'];

// Product services
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
};

export const getProductsByCategory = async (categorySlug: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories!inner (
        id,
        name,
        slug
      )
    `)
    .eq('categories.slug', categorySlug)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Category services
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

// Hero slides services
export const getHeroSlides = async () => {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) throw error;
  return data;
};

// Site content services
export const getSiteContent = async (page: string, section?: string) => {
  let query = supabase
    .from('site_content')
    .select('*')
    .eq('page', page)
    .eq('is_active', true);

  if (section) {
    query = query.eq('section', section);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

// Order services
export const createOrder = async (orderData: {
  user_email: string;
  user_name: string;
  user_phone?: string;
  shipping_address: any;
  total_amount: number;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
}) => {
  // First create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_email: orderData.user_email,
      user_name: orderData.user_name,
      user_phone: orderData.user_phone,
      shipping_address: orderData.shipping_address,
      total_amount: orderData.total_amount,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Then create the order items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
};

// Admin CMS Services
export const getAllProductsAdmin = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createProduct = async (productData: {
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  images?: string[];
  stock?: number;
  rating?: number;
}) => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      price: Math.round(productData.price * 100), // Convert to cents
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, productData: {
  name?: string;
  description?: string;
  price?: number;
  category_id?: string;
  images?: string[];
  stock?: number;
  rating?: number;
  is_active?: boolean;
}) => {
  const updateData = { ...productData };
  if (updateData.price) {
    updateData.price = Math.round(updateData.price * 100); // Convert to cents
  }

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const createCategory = async (categoryData: {
  name: string;
  description?: string;
  slug: string;
  image?: string;
}) => {
  const { data, error } = await supabase
    .from('categories')
    .insert(categoryData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, categoryData: {
  name?: string;
  description?: string;
  slug?: string;
  image?: string;
}) => {
  const { data, error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getAllHeroSlides = async () => {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('order_index');

  if (error) throw error;
  return data;
};

export const createHeroSlide = async (slideData: {
  title: string;
  subtitle?: string;
  image?: string;
  cta_text?: string;
  cta_link?: string;
  order_index?: number;
}) => {
  const { data, error } = await supabase
    .from('hero_slides')
    .insert(slideData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateHeroSlide = async (id: string, slideData: {
  title?: string;
  subtitle?: string;
  image?: string;
  cta_text?: string;
  cta_link?: string;
  order_index?: number;
  is_active?: boolean;
}) => {
  const { data, error } = await supabase
    .from('hero_slides')
    .update(slideData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteHeroSlide = async (id: string) => {
  const { error } = await supabase
    .from('hero_slides')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getAllSiteContent = async () => {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('page', { ascending: true });

  if (error) throw error;
  return data;
};

export const createSiteContent = async (contentData: {
  page: string;
  section: string;
  content_type: string;
  content_data: any;
}) => {
  const { data, error } = await supabase
    .from('site_content')
    .insert(contentData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSiteContent = async (id: string, contentData: {
  page?: string;
  section?: string;
  content_type?: string;
  content_data?: any;
  is_active?: boolean;
}) => {
  const { data, error } = await supabase
    .from('site_content')
    .update(contentData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSiteContent = async (id: string) => {
  const { error } = await supabase
    .from('site_content')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// File upload service
export const uploadFile = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;
  return data;
};

export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};
