import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { createUser, updateUser, getUserById } from '@/services/userService';

interface UserFormData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'user';
  permissions: string[];
  isActive: boolean;
  phone?: string;
}

const allPermissions = [
  { id: 'products.read', label: 'View Products', category: 'Products' },
  { id: 'products.create', label: 'Create Products', category: 'Products' },
  { id: 'products.update', label: 'Update Products', category: 'Products' },
  { id: 'products.delete', label: 'Delete Products', category: 'Products' },
  { id: 'categories.read', label: 'View Categories', category: 'Categories' },
  { id: 'categories.create', label: 'Create Categories', category: 'Categories' },
  { id: 'categories.update', label: 'Update Categories', category: 'Categories' },
  { id: 'categories.delete', label: 'Delete Categories', category: 'Categories' },
  { id: 'orders.read', label: 'View Orders', category: 'Orders' },
  { id: 'orders.update', label: 'Update Orders', category: 'Orders' },
  { id: 'orders.delete', label: 'Delete Orders', category: 'Orders' },
  { id: 'content.read', label: 'View Content', category: 'Content' },
  { id: 'content.create', label: 'Create Content', category: 'Content' },
  { id: 'content.update', label: 'Update Content', category: 'Content' },
  { id: 'content.delete', label: 'Delete Content', category: 'Content' },
  { id: 'users.read', label: 'View Users', category: 'Users' },
  { id: 'users.create', label: 'Create Users', category: 'Users' },
  { id: 'users.update', label: 'Update Users', category: 'Users' },
  { id: 'users.delete', label: 'Delete Users', category: 'Users' },
  { id: 'analytics.read', label: 'View Analytics', category: 'Analytics' },
  { id: 'settings.read', label: 'View Settings', category: 'Settings' },
  { id: 'settings.update', label: 'Update Settings', category: 'Settings' },
];

const rolePermissions = {
  admin: allPermissions.map(p => p.id),
  manager: [
    'products.read', 'products.create', 'products.update',
    'categories.read', 'categories.create', 'categories.update',
    'orders.read', 'orders.update',
    'content.read', 'content.create', 'content.update',
    'analytics.read'
  ],
  user: ['products.read', 'categories.read', 'orders.read']
};

const AdminUserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user',
    permissions: [],
    isActive: true,
    phone: '',
  });

  const [showPasswordField, setShowPasswordField] = useState(!isEditing);

  // Fetch user data if editing
  const { data: user } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id!),
    enabled: isEditing,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User created successfully');
      navigate('/admin/users');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create user');
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserFormData> }) => 
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      toast.success('User updated successfully');
      navigate('/admin/users');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update user');
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: user.permissions || [],
        isActive: user.isActive,
        phone: user.phone || '',
      });
    }
  }, [user, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isEditing && !formData.password) {
      toast.error('Password is required when creating a new user');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const submitData = { ...formData };
    
    // Remove password field if not provided during editing
    if (isEditing && !formData.password) {
      delete submitData.password;
    }

    if (isEditing) {
      updateUserMutation.mutate({ id: id!, data: submitData });
    } else {
      createUserMutation.mutate(submitData);
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({
      ...prev,
      role: role as any,
      permissions: rolePermissions[role as keyof typeof rolePermissions] || []
    }));
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const permissionsByCategory = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof allPermissions>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit User' : 'Create User'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update user information and permissions' : 'Add a new user to the system'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              {/* Password Section */}
              {isEditing ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      id="changePassword"
                      checked={showPasswordField}
                      onCheckedChange={setShowPasswordField}
                    />
                    <Label htmlFor="changePassword">Change Password</Label>
                  </div>
                  {showPasswordField && (
                    <Input
                      type="password"
                      placeholder="New password (min. 6 characters)"
                      value={formData.password || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  )}
                </div>
              ) : (
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role and Status */}
          <Card>
            <CardHeader>
              <CardTitle>Role & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isActive: !!checked }))
                  }
                />
                <Label htmlFor="isActive">Active User</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Permissions are automatically set based on role, but can be customized.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-medium text-sm">{category}</h4>
                  <div className="space-y-2">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                        />
                        <Label htmlFor={permission.id} className="text-sm">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Permissions Summary */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">Selected Permissions ({formData.permissions.length})</h4>
              <div className="flex flex-wrap gap-1">
                {formData.permissions.map((permissionId) => {
                  const permission = allPermissions.find(p => p.id === permissionId);
                  return permission ? (
                    <Badge key={permissionId} variant="secondary" className="text-xs">
                      {permission.label}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button 
            type="submit" 
            disabled={createUserMutation.isPending || updateUserMutation.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isEditing ? 'Update User' : 'Create User'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/users')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserFormPage;