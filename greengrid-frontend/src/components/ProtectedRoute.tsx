import React, { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from './RouterProvider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, Lock, Users, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('resident' | 'community_leader')[];
  fallbackMessage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  allowedRoles = ['resident', 'community_leader'],
  fallbackMessage
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      navigate('login');
    }
  }, [isLoading, requireAuth, isAuthenticated, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Check role-based access - Only allow community leaders for dashboard
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role as 'community_leader' | 'resident')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Restricted
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Community Dashboard is only available to Community Leaders
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <div className="text-center">
                <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                  <strong>Current Role:</strong> {user.role === 'resident' ? 'Resident' : 'Community Leader'}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  <strong>Required:</strong> Community Leader Access
                </p>
                <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                  Only verified community leaders can access the dashboard with sensitive community data and management tools.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('home')}
                variant="outline"
                className="w-full h-12 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Return to Home
              </Button>

              <Button
                onClick={() => navigate('contact')}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and has proper role
  return <>{children}</>;
};

export { ProtectedRoute };
