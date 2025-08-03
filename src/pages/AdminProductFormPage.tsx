
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories, useCreateProduct, useUpdateProduct, useAdminProducts } from '@/hooks/useApiData';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { uploadFile } from '@/services/apiService';
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
import { ArrowLeft, Upload, X, AlertCircle } from 'lucide-react';

interface FormErrors {
  name?: string;
  price?: string;
  description?: string;
  stock?: string;
  rating?: string;
  images?: string;
}

const AdminProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: categories } = useCategories();
  const { data: products } = useAdminProducts();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { isAdmin, loading, user } = useAdminAuth();

  console.log('Admin auth status:', { isAdmin, loading, userEmail: user?.email });

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && products && id) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          category_id: product.categoryId || '',
          stock: product.stock?.toString() || '',
          rating: product.rating?.toString() || '',
          is_active: product.isActive ?? true,
          images: product.images || []
        });
      }
    }
  }, [isEditing, products, id]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Handle file selection for preview
  const handleFileSelect = (files: FileList) => {
    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    Array.from(files).forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }

      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  // Remove selected file
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }

    // Optional fields with validation
    if (formData.description.trim() && formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters if provided';
    }

    if (formData.stock) {
      const stock = parseInt(formData.stock);
      if (isNaN(stock) || stock < 0) {
        newErrors.stock = 'Stock must be a non-negative number';
      }
    }

    if (formData.rating) {
      const rating = parseFloat(formData.rating);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        newErrors.rating = 'Rating must be between 0 and 5';
      }
    }

    // Image validation
    // if (formData.images.length === 0) {
    //   newErrors.images = 'At least one product image is required';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submission started');
    console.log('Form data:', formData);
    console.log('Selected files:', selectedFiles);

    if (!validateForm()) {
      console.log('Form validation failed');
      toast.error('Please fix the errors in the form');
      return;
    }

    // Create FormData for multipart request
    const formDataToSend = new FormData();

    // Add form fields
    formDataToSend.append('name', formData.name.trim());
    if (formData.description.trim()) {
      formDataToSend.append('description', formData.description.trim());
    }
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category_id', formData.category_id);
    if (formData.stock) {
      formDataToSend.append('stock', formData.stock);
    }
    if (formData.rating) {
      formDataToSend.append('rating', formData.rating);
    }
    formDataToSend.append('is_active', formData.is_active.toString());

    // Add existing images (for updates)
    formData.images.forEach((imageUrl, index) => {
      formDataToSend.append(`existing_images[${index}]`, imageUrl);
    });

    // Add new image files
    selectedFiles.forEach((file) => {
      formDataToSend.append(`images`, file);
    });

    console.log('FormData prepared for submission');

    if (isEditing && id) {
      console.log('Updating existing product');
      updateProduct(
        { id, data: formDataToSend },
        {
          onSuccess: () => {
            console.log('Product updated successfully');
            toast.success('Product updated successfully');
            navigate('/admin/products');
          },
          onError: (error) => {
            console.error('Update product error:', error);
            toast.error(`Failed to update product: ${error.message}`);
          },
        }
      );
    } else {
      console.log('Creating new product');
      createProduct(formDataToSend, {
        onSuccess: () => {
          console.log('Product created successfully');
          toast.success('Product created successfully');
          navigate('/admin/products');
        },
        onError: (error) => {
          console.error('Create product error:', error);
          toast.error(`Failed to create product: ${error.message}`);
        },
      });
    }
  };

  const addImage = () => {
    const trimmedUrl = imageInput.trim();

    if (!trimmedUrl) {
      toast.error('Please enter an image URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(trimmedUrl);
    } catch {
      toast.error('Please enter a valid image URL');
      return;
    }

    if (formData.images.includes(trimmedUrl)) {
      toast.error('This image URL is already added');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, trimmedUrl]
    }));
    setImageInput('');

    // Clear image error if it exists
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: undefined }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImage();
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
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
              Fill in the details for your product. Fields marked with * are required.
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Enter product name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, price: e.target.value }));
                      if (errors.price) setErrors(prev => ({ ...prev, price: undefined }));
                    }}
                    placeholder="0.00"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, description: e.target.value }));
                    if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
                  }}
                  placeholder="Enter product description (optional, but recommended)"
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </p>
                )}
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, stock: e.target.value }));
                      if (errors.stock) setErrors(prev => ({ ...prev, stock: undefined }));
                    }}
                    placeholder="0"
                    className={errors.stock ? 'border-red-500' : ''}
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.stock}
                    </p>
                  )}
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, rating: e.target.value }));
                      if (errors.rating) setErrors(prev => ({ ...prev, rating: undefined }));
                    }}
                    placeholder="0.0"
                    className={errors.rating ? 'border-red-500' : ''}
                  />
                  {errors.rating && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.rating}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Product Images (Optional for testing)</Label>

                {/* URL Input */}
                <div className="flex gap-2">
                  <Input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addImage} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Add URL
                  </Button>
                </div>

                {/* File Upload */}
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        handleFileSelect(files);
                        e.target.value = ''; // Reset input
                      }
                    }}
                    multiple
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className="flex-1 p-2 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
                    Click "Choose File" to select an image from your device
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileUpload}
                    disabled={isUploading}
                    className="min-w-[120px]"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </>
                    )}
                  </Button>
                </div>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <Label>Selected Images ({selectedFiles.length})</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={previewUrls[index]}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0"
                            onClick={() => removeSelectedFile(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                          <p className="text-xs mt-1 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-blue-600">
                      These images will be uploaded when you submit the form.
                    </p>
                  </div>
                )}

                {errors.images && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.images}
                  </p>
                )}

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1SDY1VjY1SDM1VjM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K';
                          }}
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

                <p className="text-sm text-gray-500">
                  You can add images by entering a URL or uploading files from your device (max 5MB each). Images are optional.
                </p>
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
