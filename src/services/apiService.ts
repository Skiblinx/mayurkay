import { apiClient } from './apiClient';
import type {
  Product,
  Category,
  HeroSlide,
  SiteContent,
  Order,
  CreateProductData,
  UpdateProductData,
  CreateCategoryData,
  UpdateCategoryData,
  CreateHeroSlideData,
  UpdateHeroSlideData,
  CreateSiteContentData,
  UpdateSiteContentData,
  CreateOrderData,
  ApiResponse,
} from '@/types/api';

// Product services
export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<Product[]>>('/products');
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<{ products: Product[] }>>(`/categories/${categorySlug}`);
  return response.data.products; // Extract products from the nested structure
};

// Category services
export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
  return response.data;
};

// Hero slides services
export const getHeroSlides = async (): Promise<HeroSlide[]> => {
  const response = await apiClient.get<ApiResponse<HeroSlide[]>>('/hero-slides');
  return response.data;
};

// Site content services
export const getSiteContent = async (page: string, section?: string): Promise<SiteContent[]> => {
  const params = new URLSearchParams({ page });
  if (section) params.append('section', section);
  
  const response = await apiClient.get<ApiResponse<SiteContent[]>>(`/site-content?${params}`);
  return response.data;
};

// Order services
export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  const response = await apiClient.post<ApiResponse<Order>>('/orders', orderData);
  return response.data;
};

export const getAllOrdersAdmin = async (params?: { 
  page?: number; 
  limit?: number; 
  status?: string; 
  search?: string; 
}): Promise<{ orders: Order[]; total: number; page: number; limit: number }> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.status) searchParams.append('status', params.status);
  if (params?.search) searchParams.append('search', params.search);
  
  const response = await apiClient.get<ApiResponse<{ orders: Order[]; total: number; page: number; limit: number }>>(`/orders?${searchParams}`);
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string, note?: string): Promise<Order> => {
  const response = await apiClient.put<ApiResponse<Order>>(`/orders/${id}/status`, { status, note });
  return response.data;
};

// Admin CMS Services
export const getAllProductsAdmin = async (): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<Product[]>>('/admin/products');
  return response.data;
};

export const createProduct = async (productData: CreateProductData | FormData): Promise<Product> => {
  console.log('createProduct called with:', productData);
  
  try {
    console.log('Making API request to create product...');
    
    // Check if it's FormData (multipart) or regular JSON
    if (productData instanceof FormData) {
      // Price is already in Naira, no conversion needed
      const price = productData.get('price');
      if (price) {
        productData.set('price', parseFloat(price as string).toString());
      }
      
      const response = await apiClient.post<ApiResponse<Product>>('/admin/products/with-files', productData);
      
      console.log('Product created successfully:', response.data);
      return response.data;
    } else {
      // Regular JSON request
      const response = await apiClient.post<ApiResponse<Product>>('/admin/products', {
        ...productData,
        price: Math.round(productData.price), // Price in Naira
      });
      
      console.log('Product created successfully:', response.data);
      return response.data;
    }
  } catch (err) {
    console.error('Error in createProduct:', err);
    throw err;
  }
};

export const updateProduct = async (id: string, productData: UpdateProductData | FormData): Promise<Product> => {
  try {
    // Check if it's FormData (multipart) or regular JSON
    if (productData instanceof FormData) {
      // Price is already in Naira, no conversion needed
      const price = productData.get('price');
      if (price) {
        productData.set('price', parseFloat(price as string).toString());
      }
      
      const response = await apiClient.put<ApiResponse<Product>>(`/admin/products/${id}/with-files`, productData);
      
      return response.data;
    } else {
      // Regular JSON request
      const updateData = { ...productData };
      if (updateData.price) {
        updateData.price = Math.round(updateData.price); // Price in Naira
      }

      const response = await apiClient.put<ApiResponse<Product>>(`/admin/products/${id}`, updateData);
      return response.data;
    }
  } catch (err) {
    console.error('Error in updateProduct:', err);
    throw err;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/products/${id}`);
};

export const createCategory = async (categoryData: CreateCategoryData | FormData): Promise<Category> => {
  console.log('createCategory called with:', categoryData);
  
  try {
    console.log('Making API request to create category...');
    
    // Regular JSON request
      const response = await apiClient.post<ApiResponse<Category>>('/admin/categories', categoryData);
      
      console.log('Category created successfully:', response.data);
      return response.data;
  } catch (err) {
    console.error('Error in createCategory:', err);
    throw err;
  }
};

export const updateCategory = async (id: string, categoryData: UpdateCategoryData | FormData): Promise<Category> => {
  try {
    // Check if it's FormData (multipart) or regular JSON
    const response = await apiClient.put<ApiResponse<Category>>(`/admin/categories/${id}`, categoryData); 
    return response.data;
   
  } catch (err) {
    console.error('Error in updateCategory:', err);
    throw err;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/categories/${id}`);
};

export const getAllHeroSlides = async (): Promise<HeroSlide[]> => {
  const response = await apiClient.get<ApiResponse<HeroSlide[]>>('/admin/hero-slides');
  return response.data;
};

export const createHeroSlide = async (slideData: CreateHeroSlideData): Promise<HeroSlide> => {
  const response = await apiClient.post<ApiResponse<HeroSlide>>('/admin/hero-slides', slideData);
  return response.data;
};

export const updateHeroSlide = async (id: string, slideData: UpdateHeroSlideData): Promise<HeroSlide> => {
  const response = await apiClient.put<ApiResponse<HeroSlide>>(`/admin/hero-slides/${id}`, slideData);
  return response.data;
};

export const deleteHeroSlide = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/hero-slides/${id}`);
};

export const getAllSiteContent = async (): Promise<SiteContent[]> => {
  const response = await apiClient.get<ApiResponse<SiteContent[]>>('/simple-content/admin/all');
  return response.data;
};

export const createSiteContent = async (contentData: CreateSiteContentData): Promise<SiteContent> => {
  const response = await apiClient.post<ApiResponse<SiteContent>>('/simple-content', contentData);
  return response.data;
};

export const updateSiteContent = async (id: string, contentData: UpdateSiteContentData): Promise<SiteContent> => {
  const response = await apiClient.put<ApiResponse<SiteContent>>(`/simple-content/${id}`, contentData);
  return response.data;
};

export const deleteSiteContent = async (id: string): Promise<void> => {
  await apiClient.delete(`/simple-content/${id}`);
};

// File upload service
interface UploadResponse {
  url: string;
}

export const uploadFile = async (file: File, path: string): Promise<{ url: string }> => {
  const response = await apiClient.uploadFile(`/upload/single?path=${encodeURIComponent(path)}`, file) as UploadResponse;
  // Adjust this if response structure is different
  return { url: response.url };
};

// Auth services
interface AdminUser {
  id: string;
  email: string;
  role?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const adminLogin = async (email: string, password: string): Promise<{ token: string; user: AdminUser }> => {
  const response = await apiClient.post<ApiResponse<{ token: string; user: AdminUser }>>('/auth/admin/login', {
    email,
    password,
  });
  return response.data;
};

export const verifyAdminToken = async (): Promise<{ user: AdminUser }> => {
  const response = await apiClient.get<ApiResponse<{ user: AdminUser }>>('/auth/admin/verify');
  return response.data;
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await apiClient.post<ApiResponse<null>>('/auth/admin/forgot-password', { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await apiClient.post<ApiResponse<null>>('/auth/admin/reset-password', { token, newPassword });
};