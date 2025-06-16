
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, ShoppingBag, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const itemCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'All Bags' },
    { to: '/products?category=tote', label: 'Totes' },
    { to: '/products?category=handbag', label: 'Handbags' },
    { to: '/products?category=shoulder', label: 'Shoulder Bags' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center text-2xl font-bold text-primary space-x-2">
            <ShoppingBag className="w-6 h-6" />
            <span>MayurKay</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/wishlist" className="text-gray-700 hover:text-primary transition-colors">
              <Heart className="w-6 h-6" />
            </Link>
            
            <Link to="/cart" className="relative text-gray-700 hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Desktop Auth */}
            <div className="hidden md:flex">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                    Login
                  </Button>
                  <Button size="sm" onClick={() => navigate('/signup')}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <ShoppingBag className="w-6 h-6" />
                      <span>MayurKay</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {/* Navigation Links */}
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <button
                          key={item.to}
                          onClick={() => handleNavigation(item.to)}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-4"></div>

                    {/* Auth Section */}
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 px-4 py-2 text-gray-700">
                          <User className="w-5 h-5" />
                          <span>{user?.name}</span>
                        </div>
                        <button
                          onClick={() => handleNavigation('/profile')}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => handleNavigation('/orders')}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Orders
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleNavigation('/login')}
                        >
                          Login
                        </Button>
                        <Button
                          className="w-full justify-start"
                          onClick={() => handleNavigation('/signup')}
                        >
                          Sign Up
                        </Button>
                      </div>
                    )}
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
