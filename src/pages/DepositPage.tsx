import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { handleAPIError, isNetworkError, tokenUtils } from '@/service/api';

// Deposit request interface
interface DepositRequest {
  userId: number;
  amount: number;
}

// Wallet response interface
interface WalletResponse {
  walletId: number;
  userId: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Deposit page for adding funds to user wallet
 */
export default function DepositPage() {
  const { isAuthenticated, userEmail, userId, loading } = useAuth();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);
  // Quick amount options
  const quickAmounts = [10, 25, 50, 100, 200, 500];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const depositAmount = parseFloat(amount);
    
    // Validation
    if (!depositAmount || depositAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
      if (depositAmount > 10000) {
      toast.error('Maximum deposit amount is $10,000');
      return;
    }

    if (!userId) {
      toast.error('Unable to get user information. Please login again.');
      return;
    }

    setIsDepositing(true);
    
    try {
      const token = tokenUtils.get();
      const depositData: DepositRequest = {
        userId: userId,
        amount: depositAmount
      };

      const response = await fetch('http://localhost:8080/api/wallets/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(depositData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result: WalletResponse = await response.json();
      
      toast.success(`Successfully deposited $${depositAmount.toFixed(2)}!`);
      setDepositSuccess(true);
      setAmount('');
      
      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (error) {
      console.error('Deposit error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Network error. Please check if the server is running on localhost:8080');
      } else {
        toast.error(handleAPIError(error));
      }
    } finally {
      setIsDepositing(false);
    }
  };

  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    navigate('/login');
    return null;
  }

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

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="text-center text-white">
            {/* Back Button */}
            <div className="flex justify-center mb-6">
              <Link to="/profile">
                <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Profile
                </Button>
              </Link>
            </div>

            {/* Deposit Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-lg">
              <DollarSign className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
              Add Funds
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent block">
                to Your Wallet
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Securely deposit funds to your account and unlock premium features
            </p>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-500/5 to-transparent opacity-20"></div>
      </section>

      {/* Deposit Form Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {depositSuccess ? (
              /* Success Message */
              <Card className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                <CardContent className="space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                      Deposit Successful!
                    </h2>
                    <p className="text-muted-foreground">
                      Your funds have been added to your wallet. Redirecting you back to your profile...
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Deposit Form */
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                    <CreditCard className="h-6 w-6" />
                    Deposit Funds
                  </CardTitle>
                  <CardDescription>
                    Add money to your wallet securely and instantly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleDeposit} className="space-y-6">
                    {/* Amount Input */}
                    <div className="space-y-2">
                      <Label htmlFor="amount">Deposit Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-10 text-lg h-12"
                          min="1"
                          max="10000"
                          step="0.01"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Minimum: $1.00 | Maximum: $10,000.00
                      </p>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="space-y-2">
                      <Label>Quick Amounts</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {quickAmounts.map((quickAmount) => (
                          <Button
                            key={quickAmount}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAmount(quickAmount)}
                            className="h-10"
                          >
                            ${quickAmount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Security Info */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                            Secure Transaction
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-400">
                            All transactions are encrypted and processed securely. Your funds will be available instantly.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      disabled={isDepositing || !amount || parseFloat(amount) <= 0}
                    >
                      {isDepositing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing Deposit...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Deposit ${amount || '0.00'}
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* User Info */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Depositing to:</span>
                      <Badge variant="secondary">{userEmail}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Why Add Funds?
              </h2>
              <p className="text-lg text-muted-foreground">
                Unlock premium features and enhance your mind mapping experience
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto">
                    <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Premium Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Access to exclusive mind map templates and advanced layouts
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Enhanced Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced backup and security features for your content
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto">
                    <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Priority Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Get faster response times and dedicated customer support
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
