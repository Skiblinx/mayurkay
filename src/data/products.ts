
import { Product } from '../store/cartStore';

export const products: Product[] = [
  {
    id: '1',
    name: 'Louis Vuitton Neverfull MM',
    price: 1690.00,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Iconic tote bag in Monogram canvas with leather trim. Perfect for everyday use.',
    category: 'tote',
    rating: 4.9,
    designer: 'Louis Vuitton'
  },
  {
    id: '2',
    name: 'Hermès Birkin 30',
    price: 12500.00,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Legendary luxury handbag crafted in premium Togo leather.',
    category: 'handbag',
    rating: 5.0,
    designer: 'Hermès'
  },
  {
    id: '3',
    name: 'Chanel Classic Flap',
    price: 8800.00,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Timeless quilted leather bag with signature chain strap.',
    category: 'shoulder',
    rating: 4.8,
    designer: 'Chanel'
  },
  {
    id: '4',
    name: 'Gucci GG Marmont Backpack',
    price: 1390.00,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Stylish quilted leather backpack with gold-toned hardware.',
    category: 'backpack',
    rating: 4.7,
    designer: 'Gucci'
  },
  {
    id: '5',
    name: 'Prada Re-Edition 2005',
    price: 1350.00,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Iconic nylon shoulder bag with signature triangular logo.',
    category: 'shoulder',
    rating: 4.6,
    designer: 'Prada'
  },
  {
    id: '6',
    name: 'Dior Lady Dior Medium',
    price: 5000.00,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Elegant cannage quilted leather handbag with charm.',
    category: 'handbag',
    rating: 4.9,
    designer: 'Dior'
  },
  {
    id: '7',
    name: 'Bottega Veneta Cassette',
    price: 2950.00,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Distinctive intrecciato woven leather crossbody bag.',
    category: 'crossbody',
    rating: 4.8,
    designer: 'Bottega Veneta'
  },
  {
    id: '8',
    name: 'Balenciaga City Bag',
    price: 1850.00,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Edgy distressed leather handbag with signature studs.',
    category: 'handbag',
    rating: 4.5,
    designer: 'Balenciaga'
  },
  {
    id: '9',
    name: 'YSL Loulou Puffer',
    price: 2290.00,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Quilted puffer shoulder bag in luxurious lambskin.',
    category: 'shoulder',
    rating: 4.7,
    designer: 'Saint Laurent'
  },
  {
    id: '10',
    name: 'Celine Luggage Micro',
    price: 3100.00,
    image: '/placeholder.svg?height=300&width=300',
    description: 'Distinctive structured tote with signature smile design.',
    category: 'tote',
    rating: 4.6,
    designer: 'Celine'
  }
];

export const categories = [
  'tote',
  'handbag',
  'shoulder',
  'crossbody',
  'backpack',
  'clutch'
];

export const designers = [
  'Louis Vuitton',
  'Hermès',
  'Chanel',
  'Gucci',
  'Prada',
  'Dior',
  'Bottega Veneta',
  'Balenciaga',
  'Saint Laurent',
  'Celine'
];
