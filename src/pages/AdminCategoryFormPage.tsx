
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories, useCreateCategory, useUpdateCategory } from '@/hooks/useSupabaseData';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const AdminCategoryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: categories } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { isAdmin, loading } = useAdminAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: ''
  });

  useEffect(() => {
    if (isEditing && categories && id) {
      const category = categories.find(c => c.id === id);
      if (category) {
        setFormData({
          name: category.name,
          description: category.description || '',
          slug: category.slug,
          image: category.image || ''
        });
      }
    }
  }, [isEditing, categories, id]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const categoryData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      slug: formData.slug.trim(),
      image: formData.image.trim() || undefined
    };

    if (isEditing && id) {
      updateCategory(
        { id, data: categoryData },
        {
          onSuccess: () => {
            toast.success('Category updated successfully');
            navigate('/admin/categories');
          },
          onError: (error) => {
            toast.error(`Failed to update category: ${error.message}`);
          },
        }
      );
    } else {
      createCategory(categoryData, {
        onSuccess: () => {
          toast.success('Category created successfully');
          navigate('/admin/categories');
        },
        onError: (error) => {
          toast.error(`Failed to create category: ${error.message}`);
        },
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditing ? 'Edit Category' : 'Add Category'}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout title={isEditing ? 'Edit Category' : 'Add Category'}>
        <div className="text-center py-8">
          <p className="text-red-600">Access denied. Admin privileges required.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? 'Edit Category' : 'Add Category'}>
      <div className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/categories')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
            <p className="text-gray-600">
              {isEditing ? 'Update category information' : 'Create a new product category'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>
              Fill in the details for your category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="category-url-slug"
                  required
                />
                <p className="text-xs text-gray-500">
                  This will be used in the URL: /products/category/{formData.slug || 'slug'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter category description"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Category Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/category-image.jpg"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Category preview"
                      className="w-32 h-32 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/categories')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCategoryFormPage;
