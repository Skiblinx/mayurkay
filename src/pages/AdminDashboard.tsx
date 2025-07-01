
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Tags, 
  FileText, 
  Image, 
  Users, 
  ShoppingCart, 
  LogOut,
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Welcome back, {user.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Products
              </CardTitle>
              <CardDescription>
                Manage your product catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/admin/products">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    View All Products
                  </Button>
                </Link>
                <Link to="/admin/products/new">
                  <Button className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Categories Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tags className="w-5 h-5 mr-2" />
                Categories
              </CardTitle>
              <CardDescription>
                Organize your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/admin/categories">
                  <Button variant="outline" className="w-full justify-start">
                    <Tags className="w-4 h-4 mr-2" />
                    View All Categories
                  </Button>
                </Link>
                <Link to="/admin/categories/new">
                  <Button className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Category
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Content Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Content
              </CardTitle>
              <CardDescription>
                Manage site content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/admin/content">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Site Content
                  </Button>
                </Link>
                <Link to="/admin/hero-slides">
                  <Button variant="outline" className="w-full justify-start">
                    <Image className="w-4 h-4 mr-2" />
                    Hero Slides
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Orders Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Orders
              </CardTitle>
              <CardDescription>
                Manage customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/orders">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View All Orders
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Users */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Admin Users
              </CardTitle>
              <CardDescription>
                Manage admin accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Admins
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/">
                  <Button variant="ghost" className="w-full justify-start">
                    View Live Site
                  </Button>
                </Link>
                <Link to="/admin/settings">
                  <Button variant="ghost" className="w-full justify-start">
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
