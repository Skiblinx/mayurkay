
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories, useCreateProduct, useUpdateProduct, useAdminProducts } from '@/hooks/useSupabaseData';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Upload, X } from 'lucide-react';

const AdminProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: categories } = useCategories();
  const { data: products } = useAdminProducts();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { isAdmin, loading } = useAdminAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock: '',
    rating: '',
    is_active: true,
    images: [] as string[]
  });

  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    if (isEditing && products && id) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description || '',
          price: (product.price / 100).toString(),
          category_id: product.category_id || '',
          stock: product.stock?.toString() || '',
          rating: product.rating?.toString() || '',
          is_active: product.is_active ?? true,
          images: product.images || []
        });
      }
    }
  }, [isEditing, products, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      price: parseFloat(formData.price),
      category_id: formData.category_id || undefined,
      stock: formData.stock ? parseInt(formData.stock) : undefined,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      is_active: formData.is_active,
      images: formData.images.length > 0 ? formData.images : undefined
    };

    if (isEditing && id) {
      updateProduct(
        { id, data: productData },
        {
          onSuccess: () => {
            toast.success('Product updated successfully');
            navigate('/admin/products');
          },
          onError: (error) => {
            toast.error(`Failed to update product: ${error.message}`);
          },
        }
      );
    } else {
      createProduct(productData, {
        onSuccess: () => {
          toast.success('Product created successfully');
          navigate('/admin/products');
        },
        onError: (error) => {
          toast.error(`Failed to create product: ${error.message}`);
        },
      });
    }
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <AdminLayout title={isEditing ? 'Edit Product' : 'Add Product'}>
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
      <AdminLayout title={isEditing ? 'Edit Product' : 'Add Product'}>
        <div className="text-center py-8">
          <p className="text-red-600">Access denied. Admin privileges required.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? 'Edit Product' : 'Add Product'}>
      <div className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/products')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-gray-600">
              {isEditing ? 'Update product information' : 'Create a new product in your catalog'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Fill in the details for your product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Product Images</Label>
                <div className="flex gap-2">
                  <Input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addImage} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_active: checked }))
                  }
                />
                <Label htmlFor="is_active">Product is active and visible to customers</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/products')}
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

export default AdminProductFormPage;
