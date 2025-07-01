
import { ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Tags, 
  FileText, 
  Image, 
  Users, 
  ShoppingCart, 
  LogOut,
  Home,
  Settings
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Hero Slides', href: '/admin/hero-slides', icon: Image },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Admin Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-lg font-medium text-gray-700 dark:text-gray-300">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
