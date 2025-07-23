
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Heart, ShoppingCart, ArrowLeft, Share2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import { Badge } from '../components/ui/badge';
import { useProduct } from '@/hooks/useApiData';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const { data: product, isLoading, error } = useProduct(id || '');
  const [isWishlisted, setIsWishlisted] = useState(product ? isInWishlist(product.id) : false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/products')}>Browse our Collection</Button>
        </div>
      </div>
    );
  }

  const productForCart = {
    id: product.id,
    name: product.name,
    price: product.price / 100, // Convert from cents
    image: product.images?.[0] || '/placeholder.svg?height=400&width=400',
    description: product.description || '',
    category: product.categories?.slug || 'general',
    rating: product.rating || 0,
  };

  const handleAddToCart = () => {
    addToCart(productForCart);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(productForCart);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
    setIsWishlisted(!isWishlisted);
  };

  const mainImage = product.images?.[0] || '/placeholder.svg?height=400&width=400';
  const additionalImages = product.images?.slice(1, 4) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="grid grid-cols-4 gap-2">
            <img
              src={mainImage}
              alt={`${product.name} main view`}
              className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity border-2 border-primary"
            />
            {additionalImages.map((image, i) => (
              <img
                key={i}
                src={image}
                alt={`${product.name} view ${i + 2}`}
                className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
              />
            ))}
            {/* Fill remaining slots with placeholder if needed */}
            {Array.from({ length: Math.max(0, 3 - additionalImages.length) }, (_, i) => (
              <img
                key={`placeholder-${i}`}
                src={mainImage}
                alt={`${product.name} view`}
                className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity opacity-50"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <Badge variant="outline" className="text-xs font-normal capitalize mb-4">
              {product.categories?.name || 'General'}
            </Badge>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-gray-600 ml-2">({product.rating || 0}) Reviews</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-primary mb-6">₦{(product.price / 100).toLocaleString()}</p>
          </div>

          {product.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleWishlistToggle}
              className="flex items-center space-x-2"
            >
              <Heart 
                className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} 
              />
              <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
            </Button>
            
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="capitalize">{product.categories?.name || 'General'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className="text-green-600">{product.stock || 0} available</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span>#{product.id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability:</span>
                  <span className={product.stock && product.stock > 0 ? "text-green-600" : "text-red-600"}>
                    {product.stock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
