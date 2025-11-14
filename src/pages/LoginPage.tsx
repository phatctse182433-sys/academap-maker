import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { toast } from 'sonner';
import { authAPI, handleAPIError, isNetworkError, tokenUtils } from '@/lib/api';

/**
 * Login page with email and password authentication
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await authAPI.login({
        mail: email,
        password: password,
      });      toast.success('Welcome back!');
      
      // Decode token and check role
      const token = result.data.accessToken;
      const userRole = tokenUtils.getUserRole(token);
      const userEmail = tokenUtils.getUserEmail(token);
      
      console.log('User role:', userRole);
      console.log('User email:', userEmail);
      
      // Redirect based on role
      if (userRole === 'ROLE_ADMIN') {
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1000);
      } else {
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1000);
      }
      
    } catch (error) {
      const errorMessage = handleAPIError(error);
      
      if (isNetworkError(error)) {
        toast.error('Network error. Please check if the server is running on localhost:8080');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue your learning journey
            </p>
          </div>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password below
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="px-0 text-sm">
                    Forgot password?
                  </Button>
                </div>
              </CardContent>              <CardFooter className="space-y-4 flex-col">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button><div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>          {/* API Info */}
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Connected to API:</strong> Login will be sent to localhost:8080
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Role-based routing: USER → Home | ADMIN → Admin Dashboard
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
