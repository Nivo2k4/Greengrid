import { Button } from "./ui/button";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, ChevronDown, Sun, Moon, Monitor, AlertTriangle, User, LogOut } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useRouter } from "./RouterProvider";
import { useAuth } from "./AuthProvider";
import React from "react";

interface NavigationItem {
  name: string;
  route: string;
  urgent?: boolean;
  dropdown?: { name: string; route: string }[];
}

const Navigation = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { currentRoute, navigate } = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleScroll = useCallback(() => {
    const offset = window.scrollY;
    setScrolled(offset > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const navigationItems: NavigationItem[] = [
    { name: 'Home', route: 'home' },
    {
      name: 'Services',
      route: '#',
      dropdown: [
        { name: 'Waste Collection', route: 'tracking' },
        { name: 'Recycling Programs', route: 'community' },
        { name: 'Bulk Pickup', route: 'tracking' },
        { name: 'Emergency Report', route: 'emergency' }
      ]
    },
    { name: 'Tracking Map', route: 'tracking' },
    { name: 'Dashboard', route: 'dashboard' },
    { name: 'Community', route: 'community' },
    { name: 'Contact', route: 'contact' }
  ];

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4" />;
    if (theme === 'dark') return <Moon className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const handleNavigation = useCallback((route: string) => {
    if (route !== '#' && route !== '') {
      navigate(route as any);
      setIsOpen(false);
      setActiveDropdown(null);
    }
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('login');
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
      ? 'bg-background/80 backdrop-blur-xl shadow-lg border-b border-border'
      : 'bg-background/95 backdrop-blur-sm border-b border-border/50'
      }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('home')}
              className="flex-shrink-0 flex items-center group cursor-pointer"
            >
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
                <span className="text-primary-foreground font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                GreenGrid
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <button
                    onClick={() => handleNavigation(item.route)}
                    className={`px-3 py-2 text-sm font-medium transition-all duration-200 relative flex items-center space-x-1 rounded-lg hover:bg-accent/50 ${(currentRoute === item.route ||
                      (item.dropdown && item.dropdown.some(d => d.route === currentRoute)))
                      ? 'text-primary bg-accent/30'
                      : 'text-muted-foreground hover:text-foreground'
                      }`}
                    onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                    onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
                  >
                    <span>{item.name}</span>
                    {item.dropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                    )}
                    {(currentRoute === item.route ||
                      (item.dropdown && item.dropdown.some(d => d.route === currentRoute))) && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                      )}
                  </button>

                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div
                      className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-xl shadow-xl py-2 animate-in slide-in-from-top-2 duration-200"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.dropdown.map((dropdownItem) => (
                        <button
                          key={dropdownItem.name}
                          onClick={() => handleNavigation(dropdownItem.route)}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-150 rounded-lg mx-2 ${dropdownItem.route === 'emergency'
                            ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                            }`}
                        >
                          {dropdownItem.route === 'emergency' && (
                            <AlertTriangle className="inline w-3 h-3 mr-2" />
                          )}
                          {dropdownItem.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Emergency Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigation('emergency')}
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <AlertTriangle className="w-4 h-4" />
              Emergency
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </Button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-accent/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{user?.fullName}</div>
                    <div className="text-xs text-muted-foreground capitalize">{user?.role?.replace('-', ' ')}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  onClick={() => handleNavigation('login')}
                >
                  Login
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  onClick={() => handleNavigation('register')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {getThemeIcon()}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-10 h-10 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                    }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                    }`}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border/50">
            {navigationItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => handleNavigation(item.route)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${(currentRoute === item.route ||
                    (item.dropdown && item.dropdown.some(d => d.route === currentRoute)))
                    ? 'text-primary bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                >
                  {item.name}
                </button>
                {/* Mobile dropdown items */}
                {item.dropdown && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.dropdown.map((dropdownItem) => (
                      <button
                        key={dropdownItem.name}
                        onClick={() => handleNavigation(dropdownItem.route)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${dropdownItem.route === 'emergency'
                          ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : currentRoute === dropdownItem.route
                            ? 'text-primary bg-accent/50'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                          }`}
                      >
                        {dropdownItem.route === 'emergency' && (
                          <AlertTriangle className="inline w-3 h-3 mr-2" />
                        )}
                        {dropdownItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Emergency Button */}
            <button
              onClick={() => handleNavigation('emergency')}
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <AlertTriangle className="inline w-4 h-4 mr-2" />
              Emergency Report
            </button>

            <div className="pt-4 pb-2 border-t border-border/50 mt-4">
              <div className="space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 px-3 py-2 bg-accent/50 rounded-lg mb-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-foreground">{user?.fullName}</div>
                        <div className="text-xs text-muted-foreground capitalize">{user?.role?.replace('-', ' ')}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        handleNavigation('login');
                        setIsOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => {
                        handleNavigation('register');
                        setIsOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export { Navigation };