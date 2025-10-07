import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useRouter } from './RouterProvider';

interface BreadcrumbItem {
  label: string;
  route?: string;
}

const Breadcrumb = React.memo(() => {
  const { currentRoute, navigate } = useRouter();

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const routeMap: Record<string, BreadcrumbItem[]> = {
      home: [{ label: 'Home' }],
      tracking: [
        { label: 'Home', route: 'home' },
        { label: 'Tracking & Schedule' }
      ],
      dashboard: [
        { label: 'Home', route: 'home' },
        { label: 'Community Dashboard' }
      ],
      community: [
        { label: 'Home', route: 'home' },
        { label: 'Community Hub' }
      ],
      contact: [
        { label: 'Home', route: 'home' },
        { label: 'Contact & Feedback' }
      ],
      emergency: [
        { label: 'Home', route: 'home' },
        { label: 'Emergency Report' }
      ],
      login: [{ label: 'Login' }],
      register: [{ label: 'Register' }]
    };

    return routeMap[currentRoute] || [{ label: 'Home', route: 'home' }];
  };

  const items = getBreadcrumbItems();

  // Don't show breadcrumb on home, login, or register pages
  if (['home', 'login', 'register'].includes(currentRoute)) {
    return null;
  }

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-16 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
              )}
              
              {item.route ? (
                <button
                  onClick={() => navigate(item.route as any)}
                  className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {index === 0 && <Home className="w-4 h-4" />}
                  <span>{item.label}</span>
                </button>
              ) : (
                <span className="flex items-center gap-1 text-foreground font-medium">
                  {index === 0 && <Home className="w-4 h-4" />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb };
