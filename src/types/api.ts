export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  images?: string[];
  stock?: number;
  rating?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  orderIndex?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteContent {
  id: string;
  page: string;
  section: string;
  contentType: string;
  contentData: any;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  shippingAddress: any;
  totalAmount: number;
  status?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  product?: Product;
}

export interface AdminUser {
  id: string;
  email: string;
  role?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  images?: string[];
  stock?: number;
  rating?: number;
  isActive?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface CreateCategoryData {
  name: string;
  description?: string;
  slug: string;
  image?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface CreateHeroSlideData {
  title: string;
  subtitle?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  orderIndex?: number;
}

export interface UpdateHeroSlideData extends Partial<CreateHeroSlideData> {
  isActive?: boolean;
}

export interface CreateSiteContentData {
  page: string;
  section: string;
  contentType: string;
  contentData: any;
}

export interface UpdateSiteContentData extends Partial<CreateSiteContentData> {
  isActive?: boolean;
}

export interface CreateOrderData {
  userEmail: string;
  userName: string;
  userPhone?: string;
  shippingAddress: any;
  totalAmount: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}