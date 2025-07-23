import { useState } from 'react';
import { useAdminHeroSlides, useDeleteHeroSlide } from '@/hooks/useApiData';
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
import { Pencil, Trash2, Plus, Image, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const AdminHeroSlidesPage = () => {
  const { data: heroSlides, isLoading, error } = useAdminHeroSlides();
  const { mutate: deleteHeroSlide } = useDeleteHeroSlide();
  const { isAdmin, loading } = useAdminAuth();

  const handleDelete = async (slideId: string, slideTitle: string) => {
    try {
      deleteHeroSlide(slideId, {
        onSuccess: () => {
          toast.success(`Hero slide "${slideTitle}" deleted successfully`);
        },
        onError: (error) => {
          toast.error(`Failed to delete hero slide: ${error.message}`);
        },
      });
    } catch (error) {
      toast.error('Failed to delete hero slide');
    }
  };

  if (loading || isLoading) {
    return (
      <AdminLayout title="Hero Slides">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading hero slides...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Hero Slides">
        <div className="text-center py-8">
          <Image className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load hero slides. Please try again.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Hero Slides Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Hero Slides</h1>
            <p className="text-gray-600">Manage homepage carousel slides</p>
          </div>
          <Link to="/admin/hero-slides/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Slide
            </Button>
          </Link>
        </div>

        {/* Hero Slides Grid */}
        {heroSlides && heroSlides.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hero slides found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first hero slide</p>
              <Link to="/admin/hero-slides/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Hero Slide
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {heroSlides?.map((slide: any) => (
              <Card key={slide._id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge 
                      variant={slide.isActive ? "default" : "secondary"}
                      className={slide.isActive ? "bg-green-500" : ""}
                    >
                      {slide.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {slide.order && (
                      <Badge variant="outline">
                        Order: {slide.order}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="truncate">{slide.title}</CardTitle>
                  {slide.subtitle && (
                    <CardDescription className="line-clamp-2">
                      {slide.subtitle}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {slide.buttonText && (
                      <div className="text-sm text-gray-600">
                        <strong>Button:</strong> {slide.buttonText}
                      </div>
                    )}
                    {slide.buttonUrl && (
                      <div className="text-sm text-gray-600 truncate">
                        <strong>Link:</strong> {slide.buttonUrl}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex gap-2">
                      <Link to={`/admin/hero-slides/edit/${slide._id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      
                      {slide.buttonUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={slide.buttonUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </a>
                        </Button>
                      )}
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Hero Slide</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{slide.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(slide._id, slide.title)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {heroSlides && heroSlides.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {heroSlides.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Slides</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {heroSlides.filter((slide: any) => slide.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Slides</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {heroSlides.filter((slide: any) => !slide.isActive).length}
                  </div>
                  <div className="text-sm text-gray-600">Inactive Slides</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminHeroSlidesPage;