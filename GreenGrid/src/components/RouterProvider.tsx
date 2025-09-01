import React, { createContext, useContext, useState, useCallback } from 'react';

type Route = 'home' | 'tracking' | 'dashboard' | 'community' | 'contact' | 'emergency' | 'login' | 'register';

interface RouterContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
  history: Route[];
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [history, setHistory] = useState<Route[]>(['home']);

  // Sync with URL hash on mount and on changes
  React.useEffect(() => {
    const parseHash = (): Route => {
      const hash = (window.location.hash || '').replace('#', '') as Route;
      const allowed: Route[] = ['home', 'tracking', 'dashboard', 'community', 'contact', 'emergency', 'login', 'register'];
      return allowed.includes(hash) ? hash : 'home';
    };

    // initialize from hash
    const initial = parseHash();
    setCurrentRoute(initial);
    setHistory([initial]);

    const onHashChange = () => {
      const next = parseHash();
      setCurrentRoute(prev => (prev !== next ? next : prev));
      setHistory(prev => (prev[prev.length - 1] !== next ? [...prev, next] : prev));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((route: Route) => {
    if (route !== currentRoute) {
      // update hash (will also trigger hashchange handler)
      window.location.hash = route === 'home' ? '' : `#${route}`;
    }
  }, [currentRoute]);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousRoute = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentRoute(previousRoute);
      window.location.hash = previousRoute === 'home' ? '' : `#${previousRoute}`;
    }
  }, [history]);

  const value: RouterContextType = {
    currentRoute,
    navigate,
    goBack,
    history
  };

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
}

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};