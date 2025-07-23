import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateHeroSlide, useUpdateHeroSlide } from '@/hooks/useApiData';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { uploadFile } from '@/services/apiService';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload, Image } from 'lucide-react';
import { toast } from 'sonner';
import { getHeroSlides } from '@/services/apiService';

interface HeroSlideFormData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  image: string;
  order: number;
  isActive: boolean;
}

const AdminHeroSlideFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState<HeroSlideFormData>({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonUrl: '',
    image: '',
    order: 1,
    isActive: true,
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutate: createHeroSlide, isPending: isCreating } = useCreateHeroSlide();
  const { mutate: updateHeroSlide, isPending: isUpdating } = useUpdateHeroSlide();
  const { isAdmin, loading: authLoading } = useAdminAuth();

  // Load existing hero slide for editing
  useEffect(() => {
    if (isEdit && id) {
      setIsLoading(true);
      getHeroSlides()
        .then(slides => {
          const slide = slides.find((s: any) => s._id === id);
          if (slide) {
            setFormData({
              title: slide.title || '',
              subtitle: slide.subtitle || '',
              buttonText: slide.buttonText || '',
              buttonUrl: slide.buttonUrl || '',
              image: slide.image || '',
              order: slide.order || 1,
              isActive: slide.isActive ?? true,
            });
          } else {
            toast.error('Hero slide not found');
            navigate('/admin/hero-slides');
          }
        })
        .catch(error => {
          console.error('Error loading hero slide:', error);
          toast.error('Failed to load hero slide');
        })
        .finally(() => setIsLoading(false));
    }
  }, [isEdit, id, navigate]);

  const handleInputChange = (field: keyof HeroSlideFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      const uploadResponse = await uploadFile(file, 'hero-slides');
      
      setFormData(prev => ({
        ...prev,
        image: uploadResponse.url
      }));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const slideData = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      buttonText: formData.buttonText.trim(),
      buttonUrl: formData.buttonUrl.trim(),
      image: formData.image,
      order: formData.order,
      isActive: formData.isActive,
    };

    if (isEdit && id) {
      updateHeroSlide({ id, data: slideData }, {
        onSuccess: () => {
          toast.success('Hero slide updated successfully');
          navigate('/admin/hero-slides');
        },
        onError: (error) => {
          toast.error(`Failed to update hero slide: ${error.message}`);
        },
      });
    } else {
      createHeroSlide(slideData, {
        onSuccess: () => {
          toast.success('Hero slide created successfully');
          navigate('/admin/hero-slides');
        },
        onError: (error) => {
          toast.error(`Failed to create hero slide: ${error.message}`);
        },
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <AdminLayout title={isEdit ? "Edit Hero Slide" : "Add New Hero Slide"}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? "Edit Hero Slide" : "Add New Hero Slide"}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/hero-slides')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hero Slides
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEdit ? 'Edit Hero Slide' : 'Add New Hero Slide'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Update hero slide information' : 'Create a new hero slide for the homepage'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Slide Information</CardTitle>
                  <CardDescription>
                    Enter the main content for your hero slide
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter slide title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Textarea
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      placeholder="Enter slide subtitle or description"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="buttonText">Button Text</Label>
                      <Input
                        id="buttonText"
                        value={formData.buttonText}
                        onChange={(e) => handleInputChange('buttonText', e.target.value)}
                        placeholder="e.g., Shop Now, Learn More"
                      />
                    </div>
                    <div>
                      <Label htmlFor="buttonUrl">Button URL</Label>
                      <Input
                        id="buttonUrl"
                        value={formData.buttonUrl}
                        onChange={(e) => handleInputChange('buttonUrl', e.target.value)}
                        placeholder="e.g., /products, https://example.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Slide Image</CardTitle>
                  <CardDescription>
                    Upload an image for your hero slide (recommended: 1200x600px)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="image">Upload Image</Label>
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file);
                            e.target.value = '';
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

                  {formData.image && (
                    <div className="space-y-2">
                      <Label>Image Preview</Label>
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="imageUrl">Or enter image URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive" className="text-sm font-medium">
                      Active
                    </Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Only active slides will be displayed on the homepage
                  </p>

                  <div>
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Lower numbers appear first in the carousel
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isCreating || isUpdating || isUploading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isCreating || isUpdating
                      ? (isEdit ? 'Updating...' : 'Creating...')
                      : (isEdit ? 'Update Slide' : 'Create Slide')
                    }
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/admin/hero-slides')}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminHeroSlideFormPage;