
import { Product } from '../store/cartStore';

export const products: Product[] = [
  {
    id: '1',
    name: 'Executive Large Tote',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    description: 'Spacious and elegant tote bag perfect for work and travel.',
    category: 'big-bags',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Premium Leather Handbag',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop',
    description: 'Luxury leather handbag crafted with attention to detail.',
    category: 'medium-bags',
    rating: 5.0,
  },
  {
    id: '3',
    name: 'Evening Clutch Bag',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    description: 'Elegant clutch perfect for special occasions.',
    category: 'clutch-bags',
    rating: 4.8,
  },
  {
    id: '4',
    name: 'Mini Crossbody Bag',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    description: 'Compact and stylish crossbody bag for everyday use.',
    category: 'small-bags',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Statement Necklace',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    description: 'Bold statement necklace to elevate any outfit.',
    category: 'jewelry',
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Diamond Earrings',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
    description: 'Elegant diamond earrings for special occasions.',
    category: 'jewelry',
    rating: 4.9,
  },
  {
    id: '7',
    name: 'Silk Designer Scarf',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
    description: 'Luxurious silk scarf with unique patterns.',
    category: 'scarfs',
    rating: 4.8,
  },
  {
    id: '8',
    name: 'Travel Tote Bag',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    description: 'Large capacity tote perfect for travel and shopping.',
    category: 'big-bags',
    rating: 4.5,
  },
  {
    id: '9',
    name: 'Gold Bracelet Set',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    description: 'Elegant gold bracelet set for everyday elegance.',
    category: 'jewelry',
    rating: 4.7,
  },
  {
    id: '10',
    name: 'Cashmere Winter Scarf',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop',
    description: 'Premium cashmere scarf for warmth and style.',
    category: 'scarfs',
    rating: 4.6,
  }
];

export const categories = [
  { id: 'big-bags', name: 'Big Bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop' },
  { id: 'medium-bags', name: 'Medium Bags', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop' },
  { id: 'small-bags', name: 'Small Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
  { id: 'clutch-bags', name: 'Clutch Bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
  { id: 'jewelry', name: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
  { id: 'scarfs', name: 'Scarfs', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop' }
];

export const nigerianStates = [
  { name: 'Lagos', fee: 1500 },
  { name: 'Abuja', fee: 2000 },
  { name: 'Kano', fee: 2500 },
  { name: 'Rivers', fee: 2500 },
  { name: 'Oyo', fee: 2500 },
  { name: 'Delta', fee: 2500 },
  { name: 'Imo', fee: 2500 },
  { name: 'Anambra', fee: 2500 },
  { name: 'Edo', fee: 2500 },
  { name: 'Cross River', fee: 2500 },
  { name: 'Others', fee: 2500 }
];
