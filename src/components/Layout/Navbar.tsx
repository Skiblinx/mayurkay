
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ShoppingBag, Menu, Sun, Moon } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useThemeStore } from '../../store/themeStore';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { useState } from 'react';

const Navbar = () => {
  const { getItemCount } = useCartStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const itemCount = getItemCount();

  const navigationItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'All Products' },
    { to: '/products?category=big-bags', label: 'Big Bags' },
    { to: '/products?category=medium-bags', label: 'Medium Bags' },
    { to: '/products?category=small-bags', label: 'Small Bags' },
    { to: '/products?category=clutch-bags', label: 'Clutch Bags' },
    { to: '/products?category=jewelry', label: 'Jewelry' },
    { to: '/products?category=scarfs', label: 'Scarfs' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center text-2xl font-bold text-primary dark:text-primary-foreground space-x-2">
            <ShoppingBag className="w-6 h-6" />
            <span>MAYUR COLLECTION</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6">
            {navigationItems.slice(0, 4).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-300"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <Link to="/wishlist" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors">
              <Heart className="w-6 h-6" />
            </Link>
            
            <Link to="/cart" className="relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-900">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                      <ShoppingBag className="w-6 h-6" />
                      <span>MAYUR COLLECTION</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <button
                          key={item.to}
                          onClick={() => handleNavigation(item.to)}
                          className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
