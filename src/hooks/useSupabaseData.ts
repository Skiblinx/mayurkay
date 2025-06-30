
import { useQuery } from '@tanstack/react-query';
import {
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategories,
  getHeroSlides,
  getSiteContent,
} from '@/services/supabaseService';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useProductsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['products', 'category', categorySlug],
    queryFn: () => getProductsByCategory(categorySlug),
    enabled: !!categorySlug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};

export const useHeroSlides = () => {
  return useQuery({
    queryKey: ['hero-slides'],
    queryFn: getHeroSlides,
  });
};

export const useSiteContent = (page: string, section?: string) => {
  return useQuery({
    queryKey: ['site-content', page, section],
    queryFn: () => getSiteContent(page, section),
    enabled: !!page,
  });
};
