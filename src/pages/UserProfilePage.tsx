import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, MapPin, Settings, BookOpen, Brain, Trophy, Clock } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

/**
 * User profile page with personal information and statistics
 */
export default function UserProfilePage() {
  const { isAuthenticated, userEmail, loading, logout, isUser } = useAuth();

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      window.location.href = '/login';
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
      </section>

      {/* Profile Info Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2">
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
