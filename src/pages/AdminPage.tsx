import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Users, Settings, BarChart3, Database, FileText } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

/**
 * Admin dashboard page with management tools
 */
export default function AdminPage() {
  const { isAuthenticated, isAdmin, userEmail, loading, logout } = useAuth();

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, isAdmin, loading]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Don't render content if not authenticated/authorized
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const adminFeatures = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      action: 'Manage Users',
    },
    {
      icon: FileText,
      title: 'Content Management',
      description: 'Oversee mind maps, subjects, and educational content',
      action: 'Manage Content',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'View usage statistics, user activity, and system metrics',
      action: 'View Analytics',
    },
    {
      icon: Database,
      title: 'System Management',
      description: 'Database management, backups, and system maintenance',
      action: 'System Settings',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="text-center text-white">
            {/* Admin Badge */}
            <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-6 py-2 text-sm font-medium mb-6 backdrop-blur-sm">
              <Shield className="mr-2 h-4 w-4 text-purple-400" />
              Administrator Dashboard
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
              Welcome Back,
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                Administrator
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Logged in as: <span className="font-semibold text-purple-300">{userEmail}</span>
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/mind-maps">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-glow transition-all">
                  View All Mind Maps
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={logout}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                Logout
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 mt-8 border-t border-purple-500/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">∞</div>
                <div className="text-sm text-gray-400">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">∞</div>
                <div className="text-sm text-gray-400">Mind Maps</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">100%</div>
                <div className="text-sm text-gray-400">System Health</div>
              </div>
            </div>
          </div>        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent opacity-20"></div>
      </section>

      {/* Admin Features Section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Admin Management Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to manage the AcadeMap Maker platform
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {adminFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col p-8 bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-purple-500/30 group"
              >
                <div className="flex items-center mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  {feature.description}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-colors"
                >
                  {feature.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Status Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-2xl p-12 shadow-lg border border-purple-200/50 dark:border-purple-800/50">
            <div className="flex justify-center mb-6">
              <Settings className="h-12 w-12 text-purple-500" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              System Status
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              All systems are operational. Last updated: {new Date().toLocaleString()}
            </p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="text-green-600 dark:text-green-400 font-semibold">API Server</div>
                <div className="text-sm text-green-600 dark:text-green-500">Online</div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="text-green-600 dark:text-green-400 font-semibold">Database</div>
                <div className="text-sm text-green-600 dark:text-green-500">Connected</div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="text-green-600 dark:text-green-400 font-semibold">Storage</div>
                <div className="text-sm text-green-600 dark:text-green-500">Available</div>
              </div>            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
