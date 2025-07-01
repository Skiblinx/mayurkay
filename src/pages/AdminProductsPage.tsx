
import { useState } from 'react';
import { useAdminProducts, useDeleteProduct } from '@/hooks/useSupabaseData';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const AdminProductsPage = () => {
  const { data: products, isLoading, error } = useAdminProducts();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { isAdmin, loading } = useAdminAuth();

  const handleDelete = async (productId: string, productName: string) => {
    try {
      deleteProduct(productId, {
        onSuccess: () => {
          toast.success(`Product "${productName}" deleted successfully`);
        },
        onError: (error) => {
          toast.error(`Failed to delete product: ${error.message}`);
        },
      });
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading || isLoading) {
    return (
      <AdminLayout title="Products">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout title="Products">
        <div className="text-center py-8">
          <p className="text-red-600">Access denied. Admin privileges required.</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Products">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading products: {error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Products">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Products</h2>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Link to="/admin/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {products?.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {product.name}
                      {product.is_active ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Eye className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Category: {product.categories?.name || 'Uncategorized'} | 
                      Price: ₦{(product.price / 100).toLocaleString()} | 
                      Stock: {product.stock || 0}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/products/edit/${product.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id, product.name)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Description:</p>
                    <p className="text-sm line-clamp-3">{product.description || 'No description available'}</p>
                  </div>
                  <div>
                    {product.images && product.images.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Images:</p>
                        <div className="flex gap-2">
                          {product.images.slice(0, 3).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${product.name} ${index + 1}`}
                              className="w-16 h-16 object-cover rounded border"
                            />
                          ))}
                          {product.images.length > 3 && (
                            <div className="w-16 h-16 rounded border bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                              +{product.images.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products found</p>
            <Link to="/admin/products/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;
