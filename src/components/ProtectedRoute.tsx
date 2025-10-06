import React from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from './RouterProvider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, Lock, Users, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('resident' | 'community-leader')[];
  fallbackMessage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  allowedRoles = ['resident', 'community-leader'],
  fallbackMessage
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { navigate } = useRouter();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {fallbackMessage || 'You need to be logged in to access the Community Dashboard'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                    Community Members Only
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    The Community Dashboard contains sensitive information and tools available only to registered community members.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('login')}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Sign In to Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('register')}
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold hover:underline"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>Join 10,000+ community members</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role-based access - Only allow community leaders for dashboard
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
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
