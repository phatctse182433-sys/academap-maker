import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Package, CreditCard, Shield, Clock, Wallet } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import OrderAPI, { OrderData, handleAPIError, isNetworkError } from '@/service/orderAPI';
import TransactionAPI, { TransactionData } from '@/service/transactionAPI';
import { tokenUtils } from '@/service/api';

// Order response interfaces
interface OrderPackage {
  packageId: number;
  name: string;
  price: number;
  apiCallLimit: string;
  durationDays: string;
  createdAt: string;
  updatedAt: string;
  category: string | null;
  templates: any[];
  apiKeys: any[];
}

interface OrderUser {
  id: number;
  mail: string;
  fullName: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  userStatus: string;
  collections: any[];
  templates: any[];
  apiKeys: any[];
  wallet: {
    walletId: number;
    balance: number;
    createdAt: string;
    updatedAt: string;
  };
}

interface CheckoutState {
  packageData?: {
    packageId: number;
    name: string;
    price: number;
    apiCallLimit: string;
    durationDays: string;
  };
  orderData?: OrderData;
  orderComplete?: boolean;
}

/**
 * Checkout page for package purchase with complete payment processing
 */
export default function CheckoutPage() {
  const { isAuthenticated, userEmail, userId, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletId, setWalletId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Get data from navigation state
  const state = location.state as CheckoutState;  const packageData = state?.packageData;  const existingOrderData = state?.orderData;
  const isOrderAlreadyComplete = state?.orderComplete || false;
  
  // Function to fetch wallet data for current user
  const fetchWalletData = async () => {
    if (!userId) return;
    
    try {
      const token = tokenUtils.get();
      const response = await fetch(`http://localhost:8080/api/wallets/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch wallet: ${response.status}`);
      }

      const walletData = await response.json();
      setWalletBalance(walletData.balance);
      setWalletId(walletData.walletId);
      
      console.log('Fetched wallet data:', {
        walletId: walletData.walletId,
        balance: walletData.balance,
        userId
      });
    } catch (error) {
      console.error('Error fetching wallet:', error);
      toast.error('Failed to load wallet information');
    }
  };
    // Redirect if not authenticated or no data
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // If no package data and no existing order data, redirect to subscription
    if (!loading && !packageData && !existingOrderData) {
      navigate('/subscription');
      return;
    }
    
    // If order is already complete from subscription page
    if (isOrderAlreadyComplete && existingOrderData) {
      setOrderData(existingOrderData);
      setOrderComplete(true);
    }
  }, [isAuthenticated, loading, packageData, existingOrderData, isOrderAlreadyComplete, navigate]);
  
  // Fetch wallet data when component mounts or order completes
  useEffect(() => {
    if (userId && isAuthenticated) {
      fetchWalletData();
    }
  }, [userId, isAuthenticated, orderComplete]);  const handlePayment = async () => {
    if (!orderData) {
      toast.error('No order data found');
      return;
    }

    if (!walletId) {
      toast.error('No wallet found for user');
      return;
    }

    // Use wallet balance from state instead of order data
    const packagePrice = orderData.packages.price;
    
    console.log('Payment check:', {
      packagePrice,
      walletBalance,
      walletId,
      hasEnoughBalance: walletBalance >= packagePrice
    });

    if (walletBalance < packagePrice) {
      toast.error(`Insufficient wallet balance. You have $${walletBalance}, but need $${packagePrice}`);
      return;
    }

    setIsProcessing(true);
    
    try {
      const paymentRequest = {
        orderId: orderData.orderId,
        walletId: walletId
      };

      console.log('Processing payment with request:', paymentRequest);
      console.log('Order data:', orderData);

      const result = await TransactionAPI.processPayment(paymentRequest);
      
      console.log('Payment result:', result);
      
      if (result.success && result.data.code === 200) {
        setTransactionData(result.data.data);
        setPaymentComplete(true);
        // Refresh wallet balance after successful payment
        fetchWalletData();
        toast.success('Payment processed successfully! Package is now active.');
      } else {
        throw new Error(result.data.message || 'Failed to process payment');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Network error. Please check if the server is running on localhost:8080');
      } else {
        toast.error(handleAPIError(error));
      }
    } finally {
      setIsProcessing(false);
    }
  };const handlePurchase = async () => {
    if (!packageData) return;

    if (!userId) {
      toast.error('Unable to get user information. Please login again.');
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderRequest = {
        userId: userId,
        packageId: packageData.packageId,
        status: 'PENDING'
      };

      const result = await OrderAPI.createOrder(orderRequest);
      
      if (result.success && result.data.code === 200) {
        setOrderData(result.data.data);
        setOrderComplete(true);
        toast.success('Order created successfully! Proceed to payment.');
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
      setIsProcessing(false);
    }
  };

  const formatDurationDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  // Don't render if not authenticated or no data
  if (!isAuthenticated || (!packageData && !existingOrderData)) {
    return null;
  }
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="text-center text-white">
            {/* Back Button */}
            <div className="flex justify-center mb-6">
              <Link to="/subscription">
                <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Packages
                </Button>
              </Link>
            </div>

            {/* Checkout Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg">
              {paymentComplete ? (
                <CheckCircle className="h-10 w-10 text-white" />
              ) : orderComplete ? (
                <Wallet className="h-10 w-10 text-white" />
              ) : (
                <CreditCard className="h-10 w-10 text-white" />
              )}
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
              {paymentComplete ? 'Payment Complete!' : orderComplete ? 'Order Complete!' : 'Checkout'}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                {paymentComplete ? 'Package Activated!' : orderComplete ? 'Complete Payment' : 'Complete Your Purchase'}
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              {paymentComplete 
                ? 'Your payment has been processed successfully and your package is now active!'
                : orderComplete 
                ? 'Your order has been created successfully. Complete payment to activate your package.'
                : 'Review your package selection and complete your purchase'
              }
            </p>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent opacity-20"></div>
      </section>

      {/* Checkout Content */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {paymentComplete && transactionData ? (
              /* Payment Complete */
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Transaction Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Payment Successful
                    </CardTitle>
                    <CardDescription>
                      Transaction #{transactionData.transactionId} - {transactionData.status}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Transaction ID:</span>
                        <Badge variant="secondary">#{transactionData.transactionId}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {transactionData.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-bold text-lg">${transactionData.amount}</span>
                      </div>                      <div className="flex justify-between">
                        <span>Payment Date:</span>
                        <span className="font-medium">
                          {new Date(transactionData.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {orderData && (
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3">Package Activated:</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Package:</span>
                            <span className="font-medium">{orderData.packages.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>API Calls:</span>
                            <span>{orderData.packages.apiCallLimit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valid Until:</span>
                            <span>{formatDurationDate(orderData.packages.durationDays)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Your Package is Active
                    </CardTitle>
                    <CardDescription>
                      Start using your new package features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <div>
                          <p className="font-medium">Payment Complete</p>
                          <p className="text-sm text-muted-foreground">
                            Your payment has been processed successfully
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <div>
                          <p className="font-medium">Package Activated</p>
                          <p className="text-sm text-muted-foreground">
                            Your package is now active and ready to use
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <div>
                          <p className="font-medium">Full Access Granted</p>
                          <p className="text-sm text-muted-foreground">
                            You now have access to all package features
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <Link to="/profile">
                        <Button className="w-full">
                          <Wallet className="mr-2 h-4 w-4" />
                          View Profile & Wallet
                        </Button>
                      </Link>
                      <Link to="/subscription">
                        <Button variant="outline" className="w-full">
                          <Package className="mr-2 h-4 w-4" />
                          Browse More Packages
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : orderComplete && orderData ? (
              /* Order Complete - Payment Pending */
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Order Summary
                    </CardTitle>
                    <CardDescription>
                      Order #{orderData.orderId} - Ready for Payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Order ID:</span>
                        <Badge variant="secondary">#{orderData.orderId}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {orderData.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Order Date:</span>
                        <span className="font-medium">
                          {new Date(orderData.orderDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">Package Details:</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Package:</span>
                          <span className="font-medium">{orderData.packages.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-bold text-lg">${orderData.packages.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>API Calls:</span>
                          <span>{orderData.packages.apiCallLimit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Valid Until:</span>
                          <span>{formatDurationDate(orderData.packages.durationDays)}</span>
                        </div>
                      </div>
                    </div>                    {/* Wallet Balance Info */}
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">Wallet Information:</h4>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span>Current Balance:</span>
                          <Badge variant="outline" className="text-lg font-bold">
                            ${walletBalance}
                          </Badge>
                        </div>
                        {walletBalance < orderData.packages.price && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            Insufficient balance. Please add funds to your wallet first.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Processing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Complete Payment
                    </CardTitle>
                    <CardDescription>
                      Process payment to activate your package
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Payment Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Payment Details</h4>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                            ${orderData.packages.price}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Payment will be deducted from your wallet balance
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                            Secure Transaction
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-400">
                            Your payment will be processed securely through your wallet. The package will be activated immediately upon successful payment.
                          </p>
                        </div>
                      </div>
                    </div>                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {walletBalance >= orderData.packages.price ? (
                        <Button
                          onClick={handlePayment}
                          className="w-full h-12 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Processing Payment...
                            </div>
                          ) : (
                            <>
                              <CreditCard className="mr-2 h-5 w-5" />
                              Complete Purchase - ${orderData.packages.price}
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-center text-red-600 dark:text-red-400">
                            Insufficient wallet balance to complete this purchase.
                          </p>
                          <Link to="/deposit">
                            <Button variant="outline" className="w-full">
                              <Wallet className="mr-2 h-4 w-4" />
                              Add Funds to Wallet
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Initial Checkout Form */
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Package Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Package Summary
                    </CardTitle>
                    <CardDescription>
                      Review your selected package
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border">
                      <h3 className="text-2xl font-bold mb-2">{packageData?.name}</h3>
                      <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                        ${packageData?.price}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>API Calls Included:</span>
                        <span className="font-medium">{packageData?.apiCallLimit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valid Until:</span>
                        <span className="font-medium">
                          {packageData?.durationDays && formatDurationDate(packageData.durationDays)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Package ID:</span>
                        <Badge variant="secondary">#{packageData?.packageId}</Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${packageData?.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Purchase Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Complete Purchase
                    </CardTitle>
                    <CardDescription>
                      Confirm your order details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* User Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Account Information</h4>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span>Email:</span>
                          <Badge variant="secondary">{userEmail}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                            Secure Purchase
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-400">
                            Your order will be created securely. You can complete payment from your wallet balance.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <Button
                      onClick={handlePurchase}
                      className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating Order...
                        </div>
                      ) : (
                        <>
                          <Package className="mr-2 h-5 w-5" />
                          Create Order - ${packageData?.price}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
