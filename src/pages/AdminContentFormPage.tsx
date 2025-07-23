import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateSiteContent, useUpdateSiteContent } from '@/hooks/useApiData';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { uploadFile } from '@/services/apiService';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { getAllSiteContent } from '@/services/apiService';

interface ContentFormData {
  key: string;
  value: string;
  type: 'text' | 'html' | 'image' | 'url' | 'json';
  page: string;
  section: string;
  description: string;
}

const AdminContentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState<ContentFormData>({
    key: '',
    value: '',
    type: 'text',
    page: 'none',
    section: 'none',
    description: '',
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutate: createContent, isPending: isCreating } = useCreateSiteContent();
  const { mutate: updateContent, isPending: isUpdating } = useUpdateSiteContent();
  const { isAdmin, loading: authLoading } = useAdminAuth();

  // Common page and section options
  const pageOptions = [
    'home',
    'products',
    'about',
    'contact',
    'checkout',
    'footer',
    'header',
    'global'
  ];

  const sectionOptions = [
    'hero',
    'features',
    'testimonials',
    'cta',
    'footer',
    'navigation',
    'meta',
    'social',
    'contact-info'
  ];

  // Load existing content for editing
  useEffect(() => {
    if (isEdit && id) {
      setIsLoading(true);
      getAllSiteContent()
        .then(content => {
          const item = content.find((c: any) => c._id === id);
          if (item) {
            setFormData({
              key: item.key || '',
              value: item.value || '',
              type: item.type || 'text',
              page: item.page || 'none',
              section: item.section || 'none',
              description: item.description || '',
            });
          } else {
            toast.error('Content item not found');
            navigate('/admin/content');
          }
        })
        .catch(error => {
          console.error('Error loading content:', error);
          toast.error('Failed to load content');
        })
        .finally(() => setIsLoading(false));
    }
  }, [isEdit, id, navigate]);

  const handleInputChange = (field: keyof ContentFormData, value: string) => {
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
      const uploadResponse = await uploadFile(file, 'content');
      
      setFormData(prev => ({
        ...prev,
        value: uploadResponse.url,
        type: 'image'
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
    
    if (!formData.key.trim()) {
      toast.error('Please enter a content key');
      return;
    }

    if (!formData.value.trim() && formData.type !== 'json') {
      toast.error('Please enter a content value');
      return;
    }

    // Validate JSON if type is json
    if (formData.type === 'json' && formData.value.trim()) {
      try {
        JSON.parse(formData.value);
      } catch (error) {
        toast.error('Please enter valid JSON');
        return;
      }
    }

    const contentData = {
      key: formData.key.trim(),
      value: formData.value.trim(),
      type: formData.type,
      page: formData.page && formData.page !== 'none' ? formData.page.trim() : undefined,
      section: formData.section && formData.section !== 'none' ? formData.section.trim() : undefined,
      description: formData.description.trim() || undefined,
    };

    if (isEdit && id) {
      updateContent({ id, data: contentData }, {
        onSuccess: () => {
          toast.success('Content updated successfully');
          navigate('/admin/content');
        },
        onError: (error) => {
          toast.error(`Failed to update content: ${error.message}`);
        },
      });
    } else {
      createContent(contentData, {
        onSuccess: () => {
          toast.success('Content created successfully');
          navigate('/admin/content');
        },
        onError: (error) => {
          toast.error(`Failed to create content: ${error.message}`);
        },
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <AdminLayout title={isEdit ? "Edit Content" : "Add New Content"}>
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
    <AdminLayout title={isEdit ? "Edit Content" : "Add New Content"}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/content')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Content
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEdit ? 'Edit Content' : 'Add New Content'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Update content information' : 'Create a new content item for your site'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Information</CardTitle>
                  <CardDescription>
                    Define the key-value pair for your content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="key">Content Key *</Label>
                    <Input
                      id="key"
                      value={formData.key}
                      onChange={(e) => handleInputChange('key', e.target.value)}
                      placeholder="e.g., hero-title, footer-copyright, contact-email"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Unique identifier for this content item (use kebab-case)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description of what this content is for"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="page">Page</Label>
                      <Select value={formData.page} onValueChange={(value) => handleInputChange('page', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select page (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No specific page</SelectItem>
                          {pageOptions.map((page) => (
                            <SelectItem key={page} value={page}>{page}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="section">Section</Label>
                      <Select value={formData.section} onValueChange={(value) => handleInputChange('section', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No specific section</SelectItem>
                          {sectionOptions.map((section) => (
                            <SelectItem key={section} value={section}>{section}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Value</CardTitle>
                  <CardDescription>
                    Enter the actual content based on the selected type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="type">Content Type</Label>
                    <Select value={formData.type} onValueChange={(value: any) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="image">Image URL</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.type === 'image' && (
                    <div>
                      <Label htmlFor="image">Upload Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                      {isUploading && (
                        <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                      )}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="value">
                      Content Value *
                      {formData.type === 'html' && ' (HTML allowed)'}
                      {formData.type === 'json' && ' (Valid JSON required)'}
                    </Label>
                    {formData.type === 'html' || formData.type === 'json' ? (
                      <Textarea
                        id="value"
                        value={formData.value}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        placeholder={
                          formData.type === 'html' 
                            ? 'Enter HTML content...'
                            : formData.type === 'json'
                            ? '{"key": "value"}'
                            : 'Enter content value...'
                        }
                        rows={6}
                        required={formData.type !== 'json'}
                      />
                    ) : (
                      <Input
                        id="value"
                        value={formData.value}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        placeholder={
                          formData.type === 'image' 
                            ? 'https://example.com/image.jpg' 
                            : formData.type === 'url'
                            ? 'https://example.com'
                            : 'Enter content value...'
                        }
                        type={formData.type === 'url' ? 'url' : 'text'}
                        required
                      />
                    )}
                    {formData.type === 'json' && (
                      <p className="text-xs text-gray-500 mt-1">
                        JSON content for structured data
                      </p>
                    )}
                  </div>

                  {formData.type === 'image' && formData.value && (
                    <div className="space-y-2">
                      <Label>Image Preview</Label>
                      <div className="max-w-sm">
                        <img
                          src={formData.value}
                          alt="Preview"
                          className="w-full h-auto rounded-lg border"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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
                      : (isEdit ? 'Update Content' : 'Create Content')
                    }
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/admin/content')}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Types</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div>
                    <strong>Text:</strong> Plain text content
                  </div>
                  <div>
                    <strong>HTML:</strong> Rich formatted content
                  </div>
                  <div>
                    <strong>Image:</strong> Image URLs or uploaded files
                  </div>
                  <div>
                    <strong>URL:</strong> Links to other pages
                  </div>
                  <div>
                    <strong>JSON:</strong> Structured data objects
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminContentFormPage;