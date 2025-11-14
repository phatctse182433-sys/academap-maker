import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Menu, LogIn, Github, User, LogOut } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';

/**
 * Main application header with navigation inspired by React Bits design
 */
export default function Header() {
  const location = useLocation();
  const { isAuthenticated, userEmail, logout, loading } = useAuth();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Docs', path: '/about' },
    { name: 'Showcase', path: '/mind-maps' },
  ];

  const isActive = (path: string) => location.pathname === path;
  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl mx-auto px-4">
      <div className="flex h-14 items-center justify-between px-6 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-white/10 dark:border-white/10 shadow-lg shadow-black/5">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AcadeMap Maker
          </span>
        </Link>        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Navigation Links */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-full ${
                  isActive(item.path) 
                    ? 'text-white bg-white/10 backdrop-blur-sm' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
            {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Conditional Login/Profile Button */}
            {!loading && (
              isAuthenticated ? (
                // User Profile Dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden lg:flex items-center gap-2 h-9 px-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white hover:from-purple-500/30 hover:to-blue-500/30 hover:border-purple-400/50 transition-all duration-200 rounded-full backdrop-blur-sm"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">Signed in as</p>
                      <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>View Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/mind-maps" className="cursor-pointer">
                        <Brain className="mr-2 h-4 w-4" />
                        <span>My Mind Maps</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Login Button
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden lg:flex items-center gap-2 h-9 px-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white hover:from-purple-500/30 hover:to-blue-500/30 hover:border-purple-400/50 transition-all duration-200 rounded-full backdrop-blur-sm"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="text-sm font-medium">Login</span>
                  </Button>
                </Link>
              )
            )}
            
            {/* Create Mind Map Button */}
            <Link to="/mind-maps">
              <Button 
                size="sm"
                className="h-9 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-full"
              >
                Create Mind Map
              </Button>
            </Link>
          </div>
        </div>        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black/90 backdrop-blur-xl border-white/10">
              <div className="flex flex-col space-y-6 mt-6">
                {/* Mobile Navigation Links */}
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-lg font-medium transition-colors hover:text-purple-400 ${
                      isActive(item.path) ? 'text-purple-400' : 'text-gray-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}                  {/* Mobile Buttons */}
                <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                  {!loading && (
                    isAuthenticated ? (
                      // User Profile Section
                      <>
                        <div className="px-2 py-1.5 text-purple-300">
                          <p className="text-sm font-medium">Signed in as</p>
                          <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                        </div>
                        
                        <Link to="/profile">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2 bg-purple-600/20 border-purple-600/30 text-white hover:bg-purple-600/30 rounded-full"
                          >
                            <User className="h-4 w-4" />
                            <span>View Profile</span>
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={logout}
                          className="w-full justify-start gap-2 bg-red-600/20 border-red-600/30 text-red-300 hover:bg-red-600/30 rounded-full"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </Button>
                      </>
                    ) : (
                      // Login Button
                      <Link to="/login">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-center gap-2 bg-purple-600/20 border-purple-600/30 text-white hover:bg-purple-600/30 rounded-full"
                        >
                          <LogIn className="h-4 w-4" />
                          <span>Login</span>
                        </Button>
                      </Link>
                    )
                  )}
                  
                  <Link to="/mind-maps" className="w-full">
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full"
                    >
                      Create Mind Map
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
