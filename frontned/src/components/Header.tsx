import { useState, useEffect, forwardRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, GraduationCap, BookOpen, School, User, Bell, LogOut, ChevronDown, Search, Home, Building } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Convert to forwardRef to accept refs from parent components
const Header = forwardRef((props, ref) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll detection for header appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Get username with indication of demo mode
  const getDisplayName = () => {
    if (!user) return 'Guest';
    return `${user.username} (${user.userType})`;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch (user.userType) {
      case 'student':
        return '/dashboard/student';
      case 'institute':
        return '/dashboard/institute';
      case 'faculty':
        return '/dashboard/faculty';
      default:
        return '/';
    }
  };

  // Get initials for avatar
  const getUserInitials = () => {
    if (!user?.username) return 'U';
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <header 
      ref={ref}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-2" 
          : "bg-white/80 backdrop-blur-sm py-3"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center font-bold text-xl mr-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-sm opacity-30 rounded-full"></div>
                <School className="h-6 w-6 mr-2 text-primary relative z-10" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">UniPortal</span>
            </Link>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex md:space-x-2">
              <Link 
                to="/" 
                className={cn(
                  "flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  isActive('/') && !isActive('/colleges') && !isActive('/courses') && !isActive('/alumni')
                    ? "text-primary bg-primary/5 font-semibold"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                )}
              >
                <Home className="h-4 w-4 mr-1.5" />
                Home
              </Link>
              <Link 
                to="/colleges" 
                className={cn(
                  "flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  isActive('/colleges')
                    ? "text-primary bg-primary/5 font-semibold"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                )}
              >
                <Building className="h-4 w-4 mr-1.5" />
                Colleges
              </Link>
              <Link 
                to="/courses" 
                className={cn(
                  "flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  isActive('/courses')
                    ? "text-primary bg-primary/5 font-semibold"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                )}
              >
                <BookOpen className="h-4 w-4 mr-1.5" />
                Courses
              </Link>
              <Link 
                to="/alumni" 
                className={cn(
                  "flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  isActive('/alumni')
                    ? "text-primary bg-primary/5 font-semibold"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                )}
              >
                <GraduationCap className="h-4 w-4 mr-1.5" />
                Alumni
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search button */}
            <Button 
              variant="outline" 
              size="icon" 
              className="hidden md:flex rounded-full h-8 w-8 text-gray-600 hover:text-primary hover:bg-gray-50 border-gray-200"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Desktop Auth buttons */}
            <div className="hidden md:flex md:items-center md:space-x-3">
              {user ? (
                <div className="flex items-center gap-2">
                  {/* Dashboard button */}
                  <Button 
                    asChild 
                    variant={isActive(getDashboardLink()) ? "default" : "outline"} 
                    size="sm"
                    className={cn(
                      "flex items-center gap-1 px-3 rounded-full transition-all duration-200",
                      isActive(getDashboardLink())
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <Link to={getDashboardLink()}>
                      <School className="h-4 w-4 mr-1.5" />
                      Dashboard
                    </Link>
                  </Button>

                  {/* User dropdown menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center gap-2 rounded-full pl-1.5 pr-0.5 py-0.5 cursor-pointer hover:bg-gray-100 border border-gray-200 transition-all duration-200">
                        <Avatar className="h-7 w-7 border border-white shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-primary/90 to-accent/90 text-primary-foreground text-sm font-semibold">
                            {getUserInitials()}
                          </AvatarFallback>
                          {user.profilePicture && <AvatarImage src={user.profilePicture} alt={user.username} />}
                        </Avatar>
                        <ChevronDown className="h-3.5 w-3.5 text-gray-500 mr-0.5" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 shadow-lg rounded-xl border-gray-100">
                      <div className="flex items-center gap-3 p-2 mb-1">
                        <Avatar className="h-10 w-10 border border-gray-100">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                            {getUserInitials()}
                          </AvatarFallback>
                          {user.profilePicture && <AvatarImage src={user.profilePicture} alt={user.username} />}
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.username}</span>
                          <span className="text-xs text-gray-500 capitalize">{user.userType}</span>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/5 rounded-lg transition-all duration-200 my-0.5">
                        <Link to={getDashboardLink()} className="flex items-center">
                          <School className="h-4 w-4 mr-2" />
                          My Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/5 rounded-lg transition-all duration-200 my-0.5">
                        <Link to="/profile" className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Profile Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuItem 
                        onClick={handleLogout} 
                        className="text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-all duration-200 my-0.5"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm"
                    className="rounded-full border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button 
                    asChild 
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity border-none"
                  >
                    <Link to="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-2xl animate-in slide-in-from-top duration-300 absolute left-0 right-0">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              to="/"
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all duration-200",
                isActive('/') && !isActive('/colleges') && !isActive('/courses') && !isActive('/alumni')
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </Link>
            <Link
              to="/colleges"
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all duration-200",
                isActive('/colleges')
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Building className="h-5 w-5 mr-2" />
              Colleges
            </Link>
            <Link
              to="/courses"
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all duration-200",
                isActive('/courses')
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Courses
            </Link>
            <Link
              to="/alumni"
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all duration-200",
                isActive('/alumni')
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              Alumni
            </Link>
            
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all duration-200",
                    isActive(getDashboardLink())
                      ? "text-primary bg-primary/5"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <School className="h-5 w-5 mr-2" />
                  Dashboard
                </Link>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="flex items-center px-3 py-2">
                    <Avatar className="h-8 w-8 mr-3 border border-gray-100">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                      {user.profilePicture && <AvatarImage src={user.profilePicture} alt={user.username} />}
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.username}</span>
                      <span className="text-xs text-gray-500 capitalize">{user.userType}</span>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="px-3 py-3 flex flex-col space-y-2 border-t border-gray-200 mt-2 pt-2">
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full w-full"
                >
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-primary to-accent w-full"
                >
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
});

// Add display name for better debugging
Header.displayName = 'Header';

export default Header;
