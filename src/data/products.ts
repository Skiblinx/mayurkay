
import { Product } from '../store/cartStore';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    image: '/placeholder.svg?height=300&width=300',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    category: 'electronics',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 199.99,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
    category: 'electronics',
    rating: 4.6
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Comfortable and sustainable organic cotton t-shirt.',
    category: 'clothing',
    rating: 4.4
  },
  {
    id: '4',
    name: 'Professional Camera Lens',
    price: 899.99,
    image: '/placeholder.svg?height=300&width=300',
    description: 'High-performance camera lens for professional photography.',
    category: 'electronics',
    rating: 4.9
  },
  {
    id: '5',
    name: 'Luxury Leather Handbag',
    price: 249.99,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Elegant leather handbag crafted with premium materials.',
    category: 'accessories',
    rating: 4.7
  },
  {
    id: '6',
    name: 'Gaming Mechanical Keyboard',
    price: 159.99,
    image: '/placeholder.svg?height=300&width=300',
    description: 'High-performance mechanical keyboard with RGB lighting.',
    category: 'electronics',
    rating: 4.5
  }
];

export const categories = [
  'electronics',
  'clothing',
  'accessories',
  'home',
  'sports'
];
