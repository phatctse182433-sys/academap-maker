import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Users } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { toast } from 'sonner';
import { handleAPIError, isNetworkError, tokenUtils } from '@/service/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import OrderAPI from '@/service/orderAPI';

// Simple package interface for filtered data
interface SimplePackageData {
  packageId: number;
  name: string;
  price: number;
  apiCallLimit: string;
  durationDate: string | null; // Formatted duration date
}

interface PackagesResponse {
  code: number;
  message: string;
  data: any[]; // Raw API data
}

/**
 * Subscription packages page with pricing and features
 */
export default function SubscriptionPage() {
  const [packages, setPackages] = useState<SimplePackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPackageId, setProcessingPackageId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPackages();
  }, []);
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const token = tokenUtils.get();      const response = await fetch('http://localhost:8080/api/packages/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }      const result = await response.json();
      
      // Check if result has the expected structure
      let packagesData;
      if (result.code === 200 && Array.isArray(result.data)) {
        packagesData = result.data;
      } else if (Array.isArray(result)) {
        // Direct array response
        packagesData = result;
      } else {
        console.error('Unexpected response structure:', result);
        throw new Error(`Unexpected response format. Received: ${JSON.stringify(result)}`);
      }
      
      // Filter and format the data according to requirements
      const filteredPackages: SimplePackageData[] = packagesData.map((pkg: any) => ({
        packageId: pkg.packageId,
        name: pkg.name,
        price: pkg.price,
        apiCallLimit: pkg.apiCallLimit,
        durationDate: pkg.durationDays ? new Date(pkg.durationDays).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : null
      }));
      
      setPackages(filteredPackages);
    } catch (error) {
      console.error('Fetch packages error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Network error. Please check if the server is running on localhost:8080');
      } else {
        toast.error(handleAPIError(error));
      }
    } finally {
      setLoading(false);
    }
  };
  const getPackageIcon = (packageName: string) => {
    switch (packageName.toLowerCase()) {
      case 'basic':
        return <Users className="h-6 w-6" />;
      case 'premium':
        return <Zap className="h-6 w-6" />;
      case 'pro':
        return <Crown className="h-6 w-6" />;
      default:
        return <Check className="h-6 w-6" />;
    }
  };
  const getPackageColor = (packageName: string) => {
    switch (packageName.toLowerCase()) {
      case 'basic':
        return 'from-blue-500 to-cyan-500';
      case 'premium':
        return 'from-purple-500 to-pink-500';
      case 'pro':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };
  const handleChoosePackage = async (pkg: SimplePackageData) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to purchase a package');
      navigate('/login');
      return;
    }

    const userId = OrderAPI.getUserIdFromToken();
    if (!userId) {
      toast.error('Unable to get user information. Please login again.');
      return;
    }

    setProcessingPackageId(pkg.packageId);
    
    try {
      // Create order immediately
      const orderRequest = {
        userId: userId,
        packageId: pkg.packageId,
        status: 'PENDING'
      };

      const result = await OrderAPI.createOrder(orderRequest);
      
      if (result.success && result.data.code === 200) {
        toast.success(`Order for ${pkg.name} package created successfully!`);
          // Navigate to checkout with order data to show success
        navigate('/checkout', {
          state: {
            orderData: result.data.data,
            packageData: {
              packageId: pkg.packageId,
              name: pkg.name,
              price: pkg.price,
              apiCallLimit: pkg.apiCallLimit,
              durationDate: pkg.durationDate,
            },
            orderComplete: true
          }
        });
      } else {
        throw new Error(result.data.message || 'Failed to create order');
      }
      
    } catch (error) {
      console.error('Purchase error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Network error. Please check if the server is running on localhost:8080');
      } else {
        toast.error(handleAPIError(error));
      }
    } finally {
      setProcessingPackageId(null);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-6 py-2 text-sm font-medium mb-6 backdrop-blur-sm">
              <Crown className="mr-2 h-4 w-4 text-purple-400" />
              Subscription Plans
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Choose Your Perfect
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                Learning Plan
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Unlock the full potential of mind mapping with our flexible subscription plans. 
              Choose the package that best fits your learning journey and goals.
            </p>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent opacity-20"></div>
      </section>

      {/* Packages Section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Available Packages
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select from our range of subscription packages designed to enhance your mind mapping experience
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading packages...</p>
              </div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No packages available</h3>
              <p className="text-muted-foreground mb-6">Please check back later or contact support.</p>
              <Button onClick={fetchPackages} variant="outline">
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {packages.map((pkg) => (
                <Card 
                  key={pkg.packageId} 
                  className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-500/30 group"
                >
                  {/* Package Header */}
                  <CardHeader className="text-center pb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getPackageColor(pkg.name)} mb-4 mx-auto shadow-lg`}>
                      <div className="text-white">
                        {getPackageIcon(pkg.name)}
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                    <CardDescription className="text-sm">
                      Perfect for {pkg.name.toLowerCase()} users
                    </CardDescription>
                  </CardHeader>

                  {/* Package Content */}
                  <CardContent className="space-y-6">
                    {/* Price */}
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        ${pkg.price}
                        <span className="text-lg font-normal text-muted-foreground">/package</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm">
                          <span className="font-semibold">{pkg.apiCallLimit}</span> API calls included
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>                        <span className="text-sm">
                          Valid until <span className="font-semibold">{pkg.durationDate || 'No expiration'}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm">Mind mapping tools</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm">24/7 support</span>
                      </div>
                    </div>                    {/* CTA Button */}
                    <Button 
                      onClick={() => handleChoosePackage(pkg)}
                      disabled={processingPackageId === pkg.packageId}
                      className={`w-full bg-gradient-to-r ${getPackageColor(pkg.name)} hover:opacity-90 transition-all shadow-lg hover:shadow-glow`}
                    >
                      {processingPackageId === pkg.packageId ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        `Choose ${pkg.name}`
                      )}
                    </Button>
                  </CardContent>

                  {/* Popular Badge (for middle package if odd number, or specific conditions) */}
                  {pkg.name.toLowerCase() === 'premium' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Choose Our Subscription Plans?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get access to premium features and unlimited possibilities
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast API Responses</h3>
              <p className="text-sm text-muted-foreground">
                Lightning-fast API calls to enhance your mind mapping experience
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Features</h3>
              <p className="text-sm text-muted-foreground">
                Access to advanced mind mapping tools and collaboration features
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Round-the-clock customer support to help you succeed
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
