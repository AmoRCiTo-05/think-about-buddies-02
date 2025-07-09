
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, User, Sun, Moon, Heart, Star, UserPlus, Users, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-glow"></div>
            <span className="text-xl font-bold text-gradient">Think@Friend</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link 
              to="/features" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center gap-2"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === 'light' ? 'Dark' : 'Light'}
            </Button>

            {!loading && (
              user ? (
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/liked-thoughts')}>
                        <Heart className="mr-2 h-4 w-4" />
                        Liked Thoughts
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/starred-profiles')}>
                        <Star className="mr-2 h-4 w-4" />
                        Starred Profiles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/following')}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Following
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/followers')}>
                        <Users className="mr-2 h-4 w-4" />
                        Followers
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    onClick={() => navigate('/create')}
                    className="bg-gradient-primary hover:opacity-90 transition-opacity"
                  >
                    Create Thought
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Button>
              )
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4 animate-slide-up">
            <Link 
              to="/" 
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/features" 
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center gap-2 w-full justify-start"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
            
            {!loading && (
              user ? (
                <div className="space-y-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigate('/liked-thoughts');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Liked Thoughts</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigate('/starred-profiles');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Star className="h-4 w-4" />
                    <span>Starred Profiles</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigate('/following');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Following</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigate('/followers');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Followers</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigate('/settings');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/create');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  >
                    Create Thought
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Button>
              )
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
