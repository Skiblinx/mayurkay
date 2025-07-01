
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Shield, UserPlus } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signIn } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Attempting login with email:', email);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        setError(`Login failed: ${error.message}`);
      } else {
        console.log('Login successful, navigating to admin dashboard');
        navigate('/admin');
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setError('An unexpected error occurred during login');
    }
    
    setIsLoading(false);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    console.log('Creating admin user with email:', email);

    try {
      // First, create the Supabase Auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        setError(`Failed to create user: ${signUpError.message}`);
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Failed to create user - no user data returned');
        setIsLoading(false);
        return;
      }

      console.log('Auth user created:', authData.user.id);

      // Then, add the user to the admin_users table
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert([
          {
            email: email,
            role: 'admin',
            is_active: true
          }
        ]);

      if (adminError) {
        console.error('Admin user insert error:', adminError);
        // If the admin user already exists, that's fine
        if (!adminError.message.includes('duplicate key')) {
          setError(`Failed to create admin record: ${adminError.message}`);
          setIsLoading(false);
          return;
        }
      }

      setSuccess('Admin user created successfully! You can now log in with your credentials.');
      console.log('Admin user creation completed successfully');
      
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
    } catch (err) {
      console.error('Unexpected error during admin creation:', err);
      setError('An unexpected error occurred while creating admin user');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard or create your first admin user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="create">Create Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="admin@mayurcollections.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="create">
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-email">Admin Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="admin@mayurcollections.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-password">Password</Label>
                  <Input
                    id="create-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Admin...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Admin User
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
            
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
