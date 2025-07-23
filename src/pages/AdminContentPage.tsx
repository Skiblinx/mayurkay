import { useState } from 'react';
import { useAdminSiteContent, useDeleteSiteContent } from '@/hooks/useApiData';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus, FileText, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';

const AdminContentPage = () => {
  const [search, setSearch] = useState('');
  const [pageFilter, setPageFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  
  const { data: content, isLoading, error } = useAdminSiteContent();
  const { mutate: deleteContent } = useDeleteSiteContent();
  const { isAdmin, loading } = useAdminAuth();

  const handleDelete = async (contentId: string, contentKey: string) => {
    try {
      deleteContent(contentId, {
        onSuccess: () => {
          toast.success(`Content "${contentKey}" deleted successfully`);
        },
        onError: (error) => {
          toast.error(`Failed to delete content: ${error.message}`);
        },
      });
    } catch (error) {
      toast.error('Failed to delete content');
    }
  };

  // Filter content based on search and filters
  const filteredContent = content?.filter((item: any) => {
    const matchesSearch = !search || 
      item.key?.toLowerCase().includes(search.toLowerCase()) ||
      item.value?.toLowerCase().includes(search.toLowerCase()) ||
      item.page?.toLowerCase().includes(search.toLowerCase()) ||
      item.section?.toLowerCase().includes(search.toLowerCase());
    
    const matchesPage = pageFilter === 'all' || item.page === pageFilter;
    const matchesSection = sectionFilter === 'all' || item.section === sectionFilter;
    
    return matchesSearch && matchesPage && matchesSection;
  }) || [];

  // Get unique pages and sections for filters
  const pages = [...new Set(content?.map((item: any) => item.page).filter(Boolean))];
  const sections = [...new Set(content?.map((item: any) => item.section).filter(Boolean))];

  if (loading || isLoading) {
    return (
      <AdminLayout title="Content Management">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Content Management">
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load content. Please try again.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Content Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Site Content</h1>
            <p className="text-gray-600">Manage text, images, and other content throughout the site</p>
          </div>
          <Link to="/admin/content/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Content
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="search">Search Content</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by key, value, page..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="page">Page</Label>
                <Select value={pageFilter} onValueChange={setPageFilter}>
                  <SelectTrigger id="page">
                    <SelectValue placeholder="All pages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All pages</SelectItem>
                    {pages.map((page) => (
                      <SelectItem key={page} value={page}>{page}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="section">Section</Label>
                <Select value={sectionFilter} onValueChange={setSectionFilter}>
                  <SelectTrigger id="section">
                    <SelectValue placeholder="All sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sections</SelectItem>
                    {sections.map((section) => (
                      <SelectItem key={section} value={section}>{section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch('');
                    setPageFilter('all');
                    setSectionFilter('all');
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Site Content ({filteredContent.length})</CardTitle>
                <CardDescription>
                  Manage text content, images, and settings for different pages
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredContent.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No content found</h3>
                <p className="text-gray-600 mb-4">
                  {content?.length === 0 ? 'Get started by creating your first content item' : 'No content matches your search criteria'}
                </p>
                {content?.length === 0 && (
                  <Link to="/admin/content/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Content
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">
                          {item.key}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.page || 'Global'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.section && (
                            <Badge variant="secondary">
                              {item.section}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.type === 'image' ? 'default' : 'outline'}>
                            {item.type || 'text'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {item.type === 'image' ? (
                            <div className="flex items-center gap-2">
                              {item.value && (
                                <img 
                                  src={item.value} 
                                  alt={item.key} 
                                  className="w-10 h-10 object-cover rounded"
                                />
                              )}
                              <span className="text-sm text-gray-500 truncate">
                                {item.value || 'No image'}
                              </span>
                            </div>
                          ) : (
                            <div className="truncate" title={item.value}>
                              {item.value || '-'}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {item.updatedAt ? format(new Date(item.updatedAt), 'MMM dd, yyyy') : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link to={`/admin/content/edit/${item._id}`}>
                              <Button variant="outline" size="sm">
                                <Pencil className="w-4 h-4 mr-1" />
                                Edit
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
                                  <AlertDialogTitle>Delete Content</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the content item "{item.key}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(item._id, item.key)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {content && content.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Content Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {content.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {pages.length}
                  </div>
                  <div className="text-sm text-gray-600">Pages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {sections.length}
                  </div>
                  <div className="text-sm text-gray-600">Sections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {content.filter((item: any) => item.type === 'image').length}
                  </div>
                  <div className="text-sm text-gray-600">Images</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContentPage;