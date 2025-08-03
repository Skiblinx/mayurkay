
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories, useCreateCategory, useUpdateCategory } from '@/hooks/useApiData';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { uploadFile } from '@/services/apiService';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Upload } from 'lucide-react';

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

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));
  };

  // Handle file selection for preview
  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Handle manual upload after preview (for URL-based approach)
  const handleManualUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Upload file to backend
      const uploadResponse = await uploadFile(selectedFile, 'categories');

      setFormData(prev => ({
        ...prev,
        image: uploadResponse.url
      }));

      // Clear preview
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }

      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel file selection
  const handleCancelUpload = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submission started');
    console.log('Form data:', formData);
    console.log('Selected file:', selectedFile);

    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create FormData for multipart request if there's a file, otherwise use JSON
    if (selectedFile) {
      const formDataToSend = new FormData();

      // Add form fields
      formDataToSend.append('name', formData.name.trim());
      if (formData.description.trim()) {
        formDataToSend.append('description', formData.description.trim());
      }
      formDataToSend.append('slug', formData.slug.trim());

      // Add the image file
      formDataToSend.append('image', selectedFile);

      console.log('FormData prepared for submission with file');

      if (isEditing && id) {
        updateCategory(
          { id, data: formDataToSend },
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
        createCategory(formDataToSend, {
          onSuccess: () => {
            toast.success('Category created successfully');
            navigate('/admin/categories');
          },
          onError: (error) => {
            toast.error(`Failed to create category: ${error.message}`);
          },
        });
      }
    } else {
      // Use JSON for text-only data
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        slug: formData.slug.trim(),
        image: formData.image.trim() || undefined
      };

      console.log('JSON data prepared for submission');

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

              <div className="space-y-4">
                <Label>Category Image</Label>

                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/category-image.jpg"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Or Upload Image</Label>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileSelect(file);
                          e.target.value = ''; // Reset input
                        }
                      }}
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
                </div>

                {/* File Preview Before Upload */}
                {selectedFile && previewUrl && (
                  <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <Label>Image Preview</Label>
                    <div className="flex gap-4 items-start">
                      <img
                        src={previewUrl}
                        alt="Category preview"
                        className="w-32 h-32 object-cover rounded border"
                      />
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleCancelUpload}
                            disabled={isUploading}
                          >
                            Remove File
                          </Button>
                        </div>
                        <p className="text-sm text-blue-600">
                          This image will be uploaded when you save the category.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Uploaded Image Preview */}
                {formData.image && !selectedFile && (
                  <div className="space-y-2">
                    <Label>Current Image</Label>
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

                <p className="text-sm text-gray-500">
                  You can add an image by entering a URL or uploading a file from your device (max 5MB).
                  If you upload a file, it will be processed when you save the category. Images are optional.
                </p>
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
