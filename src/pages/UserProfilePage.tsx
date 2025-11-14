import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, MapPin, Settings, BookOpen, Brain, Trophy, Clock, Wallet, DollarSign, History, Package, CreditCard } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { handleAPIError, isNetworkError, tokenUtils } from '@/lib/api';
import TransactionAPI, { TransactionData } from '@/lib/transactionAPI';

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
  const { isAuthenticated, userEmail, loading, logout, isUser } = useAuth();  // Wallet state
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);

  // Transaction history state
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

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
        setShowTransactionHistory(true);
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
    if (!loading && isAuthenticated) {
      // For now, using userId = 2 as in your example
      // In production, you would get this from user info API or token
      fetchWalletData(2);
    }
  }, [isAuthenticated, loading]);

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

  // Mock user data - in real app, this would come from API
  const userStats = {
    mindMapsCreated: 12,
    totalStudyTime: '45h 30m',
    completedTopics: 28,
    achievements: 5,
    joinedDate: 'January 2024',
    lastActive: '2 hours ago'
  };

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

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Your Learning Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your progress and achievements in your learning journey
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold">{userStats.mindMapsCreated}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Mind Maps Created</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold">{userStats.totalStudyTime}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Total Study Time</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold">{userStats.completedTopics}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Completed Topics</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold">{userStats.achievements}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>      {/* Profile Info Section */}
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
                      <p className="text-sm text-muted-foreground">{userStats.joinedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Last Active</p>
                      <p className="text-sm text-muted-foreground">{userStats.lastActive}</p>
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
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchWalletData(2)}
                        className="mt-2"
                      >
                        Retry
                      </Button>
                    </div>                  )}
                </CardContent>
              </Card>

              {/* Transaction History */}
              {showTransactionHistory && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Transaction History
                    </CardTitle>
                    <CardDescription>
                      Your successful transactions and deposits
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {transactions.length === 0 ? (
                      <div className="text-center py-8">
                        <History className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No successful transactions found
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.map((transaction) => (
                          <div 
                            key={transaction.transactionId}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                transaction.type === 'DEPOSIT' 
                                  ? 'bg-green-100 dark:bg-green-900/20' 
                                  : 'bg-purple-100 dark:bg-purple-900/20'
                              }`}>
                                {transaction.type === 'DEPOSIT' ? (
                                  <DollarSign className={`h-5 w-5 ${
                                    transaction.type === 'DEPOSIT' 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : 'text-purple-600 dark:text-purple-400'
                                  }`} />
                                ) : (
                                  <Package className={`h-5 w-5 ${
                                    transaction.type === 'DEPOSIT' 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : 'text-purple-600 dark:text-purple-400'
                                  }`} />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">
                                    {transaction.type === 'DEPOSIT' ? 'Deposit' : 'Package Purchase'}
                                  </p>
                                  <Badge variant="secondary" className="text-xs">
                                    {transaction.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <span>ID: #{transaction.transactionId}</span>
                                  {transaction.orderId && (
                                    <>
                                      <span>•</span>
                                      <span>Order: #{transaction.orderId}</span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${
                                  transaction.type === 'DEPOSIT' 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-purple-600 dark:text-purple-400'
                                }`}>
                                  {transaction.type === 'DEPOSIT' ? '+' : '-'}${transaction.amount}
                                </span>
                              </div>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Close Button */}
                    <div className="pt-4 border-t">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowTransactionHistory(false)}
                        className="w-full"
                      >
                        Close History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

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
