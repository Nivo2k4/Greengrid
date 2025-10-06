import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Users,
  UserPlus,
  Shield,
  Settings,
  Plus,
  Calendar,
  RefreshCw,
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  FileText,
  Image,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useRouter } from './RouterProvider';
import { toast } from 'sonner';

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
  type: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  reportedBy: string;
  reportedById: string;
  contactInfo: {
    name: string;
    phone?: string;
    email?: string;
    rating?: number;
  };
  images: any[];
  aiAnalyzed: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    source: string;
    version: string;
    hasImages: boolean;
    imageCount: number;
  };
}

export const AdminPanel: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { navigate } = useRouter();
  // All hooks must be called before any return
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('Never');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  // All useEffect hooks must also be before any return
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('login');
    }
  }, [isLoading, user, navigate]);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  if (!user) {
    return null;
  }
  if (user.role !== 'community-leader' && user.role !== 'admin') {
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
              onClick={() => navigate('login')}
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
    setIsDashboardLoading(true);
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
      setIsDashboardLoading(false);
      setLastUpdate(new Date().toLocaleString());
    }
  };

  // 🔥 LOAD ALL REPORTS
  const loadAllReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports?limit=100');
      const result = await response.json();

      if (result.success) {
        setAllReports(result.reports);
        setRecentReports(result.reports.slice(0, 5));
        applyFilters(result.reports);
        console.log('📋 All reports loaded:', result.reports.length);
      }
    } catch (error) {
      console.error('❌ Failed to load reports:', error);
    }
  };

  // 🔍 APPLY FILTERS
  const applyFilters = (reports: Report[]) => {
    let filtered = reports;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(report => report.priority === priorityFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.type === typeFilter);
    }

    setFilteredReports(filtered);
  };

  // 🔄 UPDATE REPORT STATUS
  const updateReportStatus = async (reportId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      // For now, we'll just update locally since we don't have a backend endpoint for this
      // In a real app, you'd make an API call here
      setAllReports(prev => prev.map(report =>
        report.id === reportId ? { ...report, status: newStatus, updatedAt: new Date().toISOString() } : report
      ));
      setFilteredReports(prev => prev.map(report =>
        report.id === reportId ? { ...report, status: newStatus, updatedAt: new Date().toISOString() } : report
      ));
      setRecentReports(prev => prev.map(report =>
        report.id === reportId ? { ...report, status: newStatus, updatedAt: new Date().toISOString() } : report
      ));

      toast.success(`Report status updated to ${newStatus}`);
      console.log(`📝 Report ${reportId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('❌ Failed to update report status:', error);
      toast.error('Failed to update report status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // 📤 EXPORT REPORTS
  const exportReports = () => {
    const csvContent = [
      ['ID', 'Title', 'Type', 'Location', 'Priority', 'Status', 'Reported By', 'Created At', 'Description'],
      ...filteredReports.map(report => [
        report.id,
        report.title,
        report.type,
        report.location,
        report.priority,
        report.status,
        report.reportedBy,
        new Date(report.createdAt).toLocaleDateString(),
        report.description.replace(/,/g, ';') // Replace commas to avoid CSV issues
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `greengrid-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Reports exported successfully');
  };

  // 🔄 AUTO-REFRESH DATA EVERY 10 SECONDS
  useEffect(() => {
    // Load initial data
    loadDashboardData();
    loadAllReports();

    // Set up auto-refresh
    const interval = setInterval(() => {
      loadDashboardData();
      loadAllReports();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // 🔍 APPLY FILTERS WHEN FILTERS CHANGE
  useEffect(() => {
    applyFilters(allReports);
  }, [searchTerm, statusFilter, priorityFilter, typeFilter, allReports]);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // 🏷️ GET STATUS BADGE STYLES
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: 'Open', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      'in-progress': { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
      resolved: { label: 'Resolved', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      closed: { label: 'Closed', className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // 🚨 GET PRIORITY BADGE STYLES
  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      critical: { label: 'Critical', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      high: { label: 'High', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
      low: { label: 'Low', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // 📅 FORMAT DATE
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <Button
                onClick={() => {
                  loadDashboardData();
                  loadAllReports();
                }}
                variant="outline"
                size="sm"
                disabled={isDashboardLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isDashboardLoading ? 'animate-spin' : ''}`} />
                {isDashboardLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {lastUpdate}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="gap-2">
              <Activity className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="w-4 h-4" />
              Reports
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

          {/* 📋 Enhanced Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {/* Search and Filter Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Reports Management
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {filteredReports.length} of {allReports.length} reports
                    </Badge>
                    <Button
                      onClick={exportReports}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Priority Filter */}
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Type Filter */}
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <Card>
              <CardContent className="p-0">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No reports found</h3>
                    <p className="text-muted-foreground mb-4">
                      {allReports.length === 0
                        ? "No reports have been submitted yet."
                        : "Try adjusting your search or filter criteria."
                      }
                    </p>
                    <Button
                      onClick={() => window.location.hash = '#emergency'}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Emergency Report
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredReports.map((report) => (
                      <div
                        key={report.id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            {/* Header */}
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-lg">{report.title}</h3>
                                  {report.aiAnalyzed && (
                                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                      AI Analyzed
                                    </Badge>
                                  )}
                                  {report.images && report.images.length > 0 && (
                                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                      <Image className="w-3 h-3 mr-1" />
                                      {report.images.length} photo{report.images.length > 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground text-sm mb-2">
                                  {report.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {report.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {report.reportedBy}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(report.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Contact Info */}
                            {report.contactInfo && (
                              <div className="flex items-center gap-4 text-sm">
                                {report.contactInfo.phone && (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    {report.contactInfo.phone}
                                  </div>
                                )}
                                {report.contactInfo.email && (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    {report.contactInfo.email}
                                  </div>
                                )}
                                {report.contactInfo.rating && (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <span>Rating: {report.contactInfo.rating}/5</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(report.status)}
                              {getPriorityBadge(report.priority)}
                            </div>

                            <div className="flex items-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedReport(report)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>{selectedReport?.title}</DialogTitle>
                                    <DialogDescription>
                                      Report Details - {selectedReport?.id}
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedReport && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm font-medium">Status</Label>
                                          <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Priority</Label>
                                          <div className="mt-1">{getPriorityBadge(selectedReport.priority)}</div>
                                        </div>
                                      </div>

                                      <div>
                                        <Label className="text-sm font-medium">Description</Label>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                          {selectedReport.description}
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm font-medium">Location</Label>
                                          <p className="mt-1 text-sm">{selectedReport.location}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Reported By</Label>
                                          <p className="mt-1 text-sm">{selectedReport.reportedBy}</p>
                                        </div>
                                      </div>

                                      <div>
                                        <Label className="text-sm font-medium">Update Status</Label>
                                        <div className="flex gap-2 mt-2">
                                          <Select
                                            value={selectedReport.status}
                                            onValueChange={(value) => updateReportStatus(selectedReport.id, value)}
                                          >
                                            <SelectTrigger className="w-40">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="open">Open</SelectItem>
                                              <SelectItem value="in-progress">In Progress</SelectItem>
                                              <SelectItem value="resolved">Resolved</SelectItem>
                                              <SelectItem value="closed">Closed</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
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
