
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import CategoryCardSkeleton from '../components/CategoryCardSkeleton';
import { Button } from '../components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useProducts, useCategories, useSiteContent } from '@/hooks/useSupabaseData';

const HomePage = () => {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: siteContent = [] } = useSiteContent('home');
  
  const featuredProducts = products.slice(0, 4);

  // Get site content
  const welcomeContent = siteContent.find(content => content.section === 'welcome');
  const featuredContent = siteContent.find(content => content.section === 'featured');

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <HeroCarousel />
      
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Style, class, and sparkle — redefining fashion one piece at a time</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categoriesLoading ? (
              Array.from({ length: 6 }, (_, i) => (
                <CategoryCardSkeleton key={i} />
              ))
            ) : (
              categories.map((category) => (
                <CategoryCard 
                  key={category.id} 
                  category={{
                    id: category.slug,
                    name: category.name,
                    image: category.image || '/placeholder.svg?height=400&width=400'
                  }} 
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {featuredContent?.content_data?.heading || 'Featured Products'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {featuredContent?.content_data?.description || 'Discover our most exclusive fashion pieces'}
            </p>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="w-full h-64 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price / 100, // Convert from cents
                    image: product.images?.[0] || '/placeholder.svg?height=400&width=400',
                    description: product.description || '',
                    category: product.categories?.slug || 'general',
                    rating: product.rating || 0,
                  }} 
                />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span>View All Products</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛍️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">All our products are carefully selected for quality and style</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-300">Quick delivery across Nigeria</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Luxury Fashion</h3>
              <p className="text-gray-600 dark:text-gray-300">Curated collection of premium fashion items</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
