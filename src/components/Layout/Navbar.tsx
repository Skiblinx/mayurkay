
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const navigate = useNavigate();
  
  const itemCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            EcoShop
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/category/electronics" className="text-gray-700 hover:text-primary transition-colors">
              Electronics
            </Link>
            <Link to="/category/clothing" className="text-gray-700 hover:text-primary transition-colors">
              Clothing
            </Link>
            <Link to="/category/accessories" className="text-gray-700 hover:text-primary transition-colors">
              Accessories
            </Link>
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

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span className="hidden md:block">{user?.name}</span>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
