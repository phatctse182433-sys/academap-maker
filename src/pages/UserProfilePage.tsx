import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, MapPin, Settings, BookOpen, Brain, Clock, Wallet, DollarSign, History, Package, CreditCard, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { handleAPIError, isNetworkError, tokenUtils } from '@/service/api';
import TransactionAPI, { TransactionData } from '@/service/transactionAPI';

// Wallet data interface
interface WalletData {
  walletId?: number;
  userId: number;
  balance: number;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * User profile page with personal information and statistics
 */
export default function UserProfilePage() {
  const { isAuthenticated, userEmail, userId, loading, logout, isUser } = useAuth();// Wallet state
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  // Transaction history state
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // Function to fetch wallet data
  const fetchWalletData = async (userId: number) => {
    setWalletLoading(true);
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
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const walletData: WalletData = await response.json();
      setWallet(walletData);
    } catch (error) {
      console.error('Fetch wallet error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Network error. Please check if the server is running on localhost:8080');
      } else {
        toast.error(handleAPIError(error));
      }
    } finally {
      setWalletLoading(false);
    }
  };
  // Function to fetch transaction history
  const fetchTransactionHistory = async (walletId: number) => {
    setTransactionsLoading(true);
    try {
      const result = await TransactionAPI.getWalletTransactions(walletId);
      
      if (result.success && result.data.code === 200) {
        // Filter only SUCCESS transactions as requested
        const successfulTransactions = result.data.data.filter(
          (transaction: TransactionData) => transaction.status === 'SUCCESS'
        );
        setTransactions(successfulTransactions);
        setIsTransactionModalOpen(true); // Open modal instead of inline display
      } else {
        throw new Error(result.data.message || 'Failed to fetch transaction history');
      }
    } catch (error) {
      console.error('Fetch transaction history error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Network error. Please check if the server is running on localhost:8080');
      } else {
        toast.error(handleAPIError(error));
      }
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      window.location.href = '/login';
    }
      // Fetch wallet data when authenticated
    if (!loading && isAuthenticated && userId) {
      fetchWalletData(userId);
    }
  }, [isAuthenticated, loading, userId]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="text-center text-white">
            {/* User Avatar */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-6 shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
              Welcome Back!
            </h1>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              <Mail className="inline h-5 w-5 mr-2" />
              {userEmail}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/mind-map/editor">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-glow transition-all">
                  <Brain className="mr-2 h-5 w-5" />
                  Create New Mind Map
                </Button>
              </Link>
              <Link to="/mind-maps">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  View My Mind Maps
                </Button>
              </Link>
            </div>
          </div>
        </div>
          {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent opacity-20"></div>
      </section>

      {/* Profile Info Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{userEmail}</p>
                    </div>
                  </div>
                    <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">January 2024</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Last Active</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {isUser ? 'User' : 'Member'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="mr-2 h-4 w-4" />
                    Privacy Settings
                  </Button>
                    <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Learning Preferences
                  </Button>

                  <div className="pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      onClick={logout}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* My Wallet */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    My Wallet
                  </CardTitle>
                  <CardDescription>
                    Your account balance and transaction history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {walletLoading ? (
                    <div className="text-center py-8">
                      <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading wallet...</p>
                    </div>
                  ) : wallet ? (
                    <>
                      {/* Balance Display */}
                      <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                        <div className="flex items-center justify-center mb-2">
                          <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          ${wallet.balance.toFixed(2)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Current Balance
                        </p>
                      </div>

                      {/* Wallet Info */}
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span className="font-medium">
                            {new Date(wallet.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Link to="/deposit">
                          <Button variant="outline" className="w-full justify-start">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Add Funds
                          </Button>
                        </Link>                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => wallet && fetchTransactionHistory(wallet.walletId || wallet.userId)}
                          disabled={transactionsLoading}
                        >
                          {transactionsLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2"></div>
                              Loading...
                            </>
                          ) : (
                            <>
                              <History className="mr-2 h-4 w-4" />
                              Transaction History
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Unable to load wallet information
                      </p>                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => userId && fetchWalletData(userId)}
                        className="mt-2"
                      >
                        Retry
                      </Button>
                    </div>                  )}
                </CardContent>
              </Card>            </div>
          </div>
        </div>
      </section>

      {/* Transaction History Modal */}
      <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </DialogTitle>
            <DialogDescription>
              Your successful transactions and deposits
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            {transactionsLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Transactions Found</h3>
                <p className="text-muted-foreground">
                  You haven't made any successful transactions yet.
                </p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-muted-foreground uppercase tracking-wider bg-muted/50 rounded-t-lg border-b">
                  <div className="col-span-1">Type</div>
                  <div className="col-span-5">Transaction Details</div>
                  <div className="col-span-3 text-center">Date</div>
                  <div className="col-span-3 text-right">Amount</div>
                </div>

                {/* Transaction List */}
                <div className="border rounded-b-lg divide-y">
                  {transactions.map((transaction) => (
                    <div 
                      key={transaction.transactionId}
                      className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors items-center"
                    >
                      {/* Type Icon */}
                      <div className="col-span-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'DEPOSIT' 
                            ? 'bg-green-100 dark:bg-green-900/20' 
                            : 'bg-purple-100 dark:bg-purple-900/20'
                        }`}>
                          {transaction.type === 'DEPOSIT' ? (
                            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                      </div>

                      {/* Transaction Details */}
                      <div className="col-span-5">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">
                            {transaction.type === 'DEPOSIT' ? 'Account Deposit' : 'Package Purchase'}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {transaction.type}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Transaction ID: #{transaction.transactionId}
                          </p>
                          {transaction.orderId && (
                            <p className="text-xs text-muted-foreground">
                              Order ID: #{transaction.orderId}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="col-span-3 text-center">
                        <div className="text-sm font-medium">
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>

                      {/* Amount & Status */}
                      <div className="col-span-3 text-right">
                        <div className="mb-1">
                          <span className={`font-bold text-lg ${
                            transaction.type === 'DEPOSIT' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'DEPOSIT' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
                          ✓ {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transaction Summary */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {transactions.filter(t => t.type === 'DEPOSIT').length}
                      </div>
                      <div className="text-muted-foreground">Deposits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {transactions.filter(t => t.type === 'PURCHASE').length}
                      </div>
                      <div className="text-muted-foreground">Purchases</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Recent Activity Section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-8 text-center">
              Recent Activity
            </h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Latest Mind Maps</CardTitle>
                <CardDescription>Your most recently created or edited mind maps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Sample Mind Map {item}</p>
                          <p className="text-sm text-muted-foreground">
                            {item === 1 ? '2 hours ago' : item === 2 ? '1 day ago' : '3 days ago'}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/mind-maps">
                    <Button variant="outline">
                      View All Mind Maps
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
