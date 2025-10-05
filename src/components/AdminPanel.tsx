import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Users,
  UserPlus,
  Shield,
  Settings,
  Plus,
  Calendar,
  RefreshCw,
  Activity
} from 'lucide-react';
import { useAuth } from './AuthProvider';

interface DashboardData {
  totalUsers: number;
  activeReports: number;
  completedReports: number;
  totalReports: number;
  systemStatus: string;
  serverUptime: number;
  lastUpdated: string;
}

interface Report {
  id: string;
  title: string;
  location: string;
  priority: string;
  status: string;
  createdAt: string;
}

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('Never');

  // 🧪 TESTING MODE: Allow access for everyone
  const isTestingMode = true;

  if (!isTestingMode && (!user || user.role !== 'community-leader')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You need admin privileges to access this panel.
            </p>
            <Button
              onClick={() => window.location.hash = '#login'}
              className="mt-4"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🔥 LOAD REAL-TIME DATA FROM YOUR BACKEND
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard');
      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
        console.log('📊 Dashboard data loaded:', result.data);
      }
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
      setLastUpdate(new Date().toLocaleString());
    }
  };

  // 🔥 LOAD RECENT REPORTS
  const loadRecentReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports');
      const result = await response.json();

      if (result.success) {
        // Get most recent 5 reports
        setRecentReports(result.reports.slice(0, 5));
        console.log('📋 Recent reports loaded:', result.reports.length);
      }
    } catch (error) {
      console.error('❌ Failed to load recent reports:', error);
    }
  };

  // 🔄 AUTO-REFRESH DATA EVERY 10 SECONDS
  useEffect(() => {
    // Load initial data
    loadDashboardData();
    loadRecentReports();

    // Set up auto-refresh
    const interval = setInterval(() => {
      loadDashboardData();
      loadRecentReports();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">🎯 Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Live monitoring and system management
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isTestingMode && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  🧪 Testing Mode
                </Badge>
              )}
              <Button
                onClick={() => {
                  loadDashboardData();
                  loadRecentReports();
                }}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {lastUpdate}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="gap-2">
              <Activity className="w-4 h-4" />
              Live Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* 🔥 LIVE Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">

            {/* 📊 LIVE STATISTICS FROM YOUR BACKEND */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  📊 Live Statistics
                  <Badge variant={dashboardData ? 'default' : 'secondary'}>
                    {dashboardData ? '🔴 LIVE' : '⚫ Loading...'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData ? (
                  <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {dashboardData.totalReports}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Reports</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">
                        {dashboardData.activeReports}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Reports</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {dashboardData.completedReports}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        {dashboardData.totalUsers}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Users</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Loading live statistics...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <div className="grid md:grid-cols-3 gap-6">

              {/* Backend Status */}
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant="outline" className="text-green-600">
                        {dashboardData?.systemStatus?.toUpperCase() || 'ONLINE'}
                      </Badge>
                    </p>
                    <p className="flex justify-between">
                      <span>Database:</span>
                      <Badge variant="outline" className="text-blue-600">Firebase</Badge>
                    </p>
                    <p className="flex justify-between">
                      <span>Uptime:</span>
                      <Badge variant="outline" className="text-purple-600">
                        {dashboardData ? formatUptime(dashboardData.serverUptime) : 'Loading...'}
                      </Badge>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => window.location.hash = '#emergency'}
                  >
                    🚨 Emergency Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.hash = '#realtime'}
                  >
                    🔥 Test Real-time
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open('http://localhost:5000/api/health', '_blank')}
                  >
                    🏥 Backend Health
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Version:</strong> 3.0.0</p>
                    <p><strong>Environment:</strong> Development</p>
                    <p><strong>Real-time:</strong>
                      <Badge variant="outline" className="ml-2 text-green-600">Socket.io</Badge>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 🔥 RECENT ACTIVITY - LIVE DATA */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  📋 Recent Reports Activity
                  <Badge variant="outline" className="text-green-600">
                    Live Data
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentReports.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No recent reports</p>
                    <Button
                      onClick={() => window.location.hash = '#realtime'}
                      className="mt-2"
                      size="sm"
                    >
                      Create Test Report
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{report.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            📍 {report.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              report.priority === 'critical' ? 'destructive' :
                                report.priority === 'high' ? 'secondary' :
                                  'outline'
                            }
                            className={
                              report.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                report.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                  report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                            }
                          >
                            {report.priority?.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(report.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>👥 User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardData?.totalUsers || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {dashboardData?.totalUsers || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {dashboardData?.totalReports || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">User Reports</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">User Activity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Test User</p>
                        <p className="text-sm text-muted-foreground">user123@example.com</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🔧 Real-time Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Auto-refresh Settings</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Auto-refresh every 10 seconds</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Real-time notifications</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Admin urgent alerts</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📡 API Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-mono">
                    <p className="p-2 bg-green-100 rounded">✅ GET /api/health</p>
                    <p className="p-2 bg-green-100 rounded">✅ GET /api/reports</p>
                    <p className="p-2 bg-green-100 rounded">✅ POST /api/reports</p>
                    <p className="p-2 bg-green-100 rounded">✅ GET /api/admin/dashboard</p>
                    <p className="p-2 bg-blue-100 rounded">🔥 Socket.io WebSocket</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
