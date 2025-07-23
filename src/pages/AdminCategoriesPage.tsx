
import { useState } from 'react';
import { useCategories, useDeleteCategory } from '@/hooks/useApiData';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
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
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const AdminCategoriesPage = () => {
  const { data: categories, isLoading, error } = useCategories();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { isAdmin, loading } = useAdminAuth();

  const handleDelete = async (categoryId: string, categoryName: string) => {
    try {
      deleteCategory(categoryId, {
        onSuccess: () => {
          toast.success(`Category "${categoryName}" deleted successfully`);
        },
        onError: (error) => {
          toast.error(`Failed to delete category: ${error.message}`);
        },
      });
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  if (loading || isLoading) {
    return (
      <AdminLayout title="Categories">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout title="Categories">
        <div className="text-center py-8">
          <p className="text-red-600">Access denied. Admin privileges required.</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Categories">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading categories: {error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Categories">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Categories</h2>
            <p className="text-gray-600">Organize your products into categories</p>
          </div>
          <Link to="/admin/categories/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>Slug: {category.slug}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/categories/edit/${category.id}`}>
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
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"? This action cannot be undone.
                            Products in this category will be uncategorized.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id, category.name)}
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
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
                <p className="text-sm text-gray-600">
                  {category.description || 'No description available'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {categories?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No categories found</p>
            <Link to="/admin/categories/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Category
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
