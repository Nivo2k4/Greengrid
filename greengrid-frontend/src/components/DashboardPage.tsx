import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Download,
  FileText,
  Calendar,
  Users,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface StatCardData {
  id: string;
  title: string;
  value: number;
  change: number;
  icon: typeof CheckCircle;
  color: string;
  description: string;
}

interface FeedbackData {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  area: string;
  status: 'new' | 'reviewed' | 'resolved';
}

interface ReportData {
  id: string;
  title: string;
  type: 'weekly' | 'monthly' | 'custom';
  date: string;
  status: 'generated' | 'pending' | 'scheduled';
}

const DashboardPage = React.memo(() => {
  const [timeFilter, setTimeFilter] = useState('week');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock data for statistics
  const statsData: StatCardData[] = useMemo(() => [
    {
      id: 'completed',
      title: 'Pickups Completed',
      value: timeFilter === 'week' ? 1247 : timeFilter === 'month' ? 5680 : 2890,
      change: 12.5,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
      description: 'Successfully completed collections'
    },
    {
      id: 'pending',
      title: 'Pending Pickups',
      value: timeFilter === 'week' ? 89 : timeFilter === 'month' ? 342 : 165,
      change: -8.2,
      icon: Clock,
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
      description: 'Scheduled for collection'
    },
    {
      id: 'emergency',
      title: 'Emergency Reports',
      value: timeFilter === 'week' ? 23 : timeFilter === 'month' ? 78 : 45,
      change: -15.3,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
      description: 'Urgent issues reported'
    },
    {
      id: 'rating',
      title: 'Average Rating',
      value: 4.7,
      change: 3.1,
      icon: Star,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
      description: 'Community satisfaction score'
    }
  ], [timeFilter]);

  // Mock data for daily pickups chart
  const pickupChartData = useMemo(() => {
    const baseData = [
      { day: 'Mon', pickups: 180, target: 200 },
      { day: 'Tue', pickups: 195, target: 200 },
      { day: 'Wed', pickups: 167, target: 200 },
      { day: 'Thu', pickups: 212, target: 200 },
      { day: 'Fri', pickups: 189, target: 200 },
      { day: 'Sat', pickups: 145, target: 150 },
      { day: 'Sun', pickups: 98, target: 100 }
    ];

    if (timeFilter === 'month') {
      return [
        { day: 'Week 1', pickups: 1234, target: 1400 },
        { day: 'Week 2', pickups: 1456, target: 1400 },
        { day: 'Week 3', pickups: 1289, target: 1400 },
        { day: 'Week 4', pickups: 1501, target: 1400 }
      ];
    }

    return baseData;
  }, [timeFilter]);

  // Mock data for feedback ratings pie chart
  const feedbackChartData = useMemo(() => [
    { name: 'Excellent (5★)', value: 45, color: '#22c55e' },
    { name: 'Good (4★)', value: 30, color: '#84cc16' },
    { name: 'Average (3★)', value: 15, color: '#eab308' },
    { name: 'Poor (2★)', value: 7, color: '#f97316' },
    { name: 'Very Poor (1★)', value: 3, color: '#ef4444' }
  ], []);

  // Mock feedback data
  const feedbackData: FeedbackData[] = useMemo(() => [
    {
      id: 'f1',
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent service! Truck arrived exactly on time and the crew was very professional.',
      date: '2025-01-20',
      area: 'Downtown District',
      status: 'new'
    },
    {
      id: 'f2',
      name: 'Mike Chen',
      rating: 4,
      comment: 'Good service overall, but would love to see more recycling options in our area.',
      date: '2025-01-19',
      area: 'Residential North',
      status: 'reviewed'
    },
    {
      id: 'f3',
      name: 'Emma Davis',
      rating: 5,
      comment: 'The mobile app tracking feature is fantastic! Always know when pickup is coming.',
      date: '2025-01-19',
      area: 'Suburban East',
      status: 'new'
    },
    {
      id: 'f4',
      name: 'Robert Wilson',
      rating: 3,
      comment: 'Service is okay but sometimes trucks are late. Communication could be improved.',
      date: '2025-01-18',
      area: 'Industrial Zone',
      status: 'resolved'
    },
    {
      id: 'f5',
      name: 'Lisa Martinez',
      rating: 5,
      comment: 'Outstanding! The emergency pickup request was handled within 2 hours.',
      date: '2025-01-18',
      area: 'City Center',
      status: 'reviewed'
    }
  ], []);

  // Mock reports data
  const reportsData: ReportData[] = useMemo(() => [
    {
      id: 'r1',
      title: 'Weekly Performance Report',
      type: 'weekly',
      date: '2025-01-20',
      status: 'generated'
    },
    {
      id: 'r2',
      title: 'Monthly Analytics Summary',
      type: 'monthly',
      date: '2025-01-15',
      status: 'generated'
    },
    {
      id: 'r3',
      title: 'Community Feedback Analysis',
      type: 'custom',
      date: '2025-01-22',
      status: 'scheduled'
    },
    {
      id: 'r4',
      title: 'Environmental Impact Report',
      type: 'monthly',
      date: '2025-01-25',
      status: 'pending'
    }
  ], []);

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = useCallback((status: string) => {
    const configs = {
      new: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: MessageSquare },
      reviewed: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
      resolved: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
      generated: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
      pending: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: Clock },
      scheduled: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Calendar }
    };
    return configs[status as keyof typeof configs] || configs.new;
  }, []);

  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ));
  }, []);

  const generateReport = useCallback(() => {
    // In a real app, this would trigger report generation
    console.log('Generating report for:', timeFilter);
  }, [timeFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Community Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Monitor and analyze waste collection performance across all communities
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Badge variant="outline" className="gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Updated: {lastUpdate.toLocaleTimeString()}
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setLastUpdate(new Date())}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => {
            const IconComponent = stat.icon;
            const isPositive = stat.change > 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;

            return (
              <Card key={stat.id} className="relative overflow-hidden border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      isPositive 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      <TrendIcon className="w-3 h-3" />
                      {Math.abs(stat.change)}%
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                    <div className="text-3xl font-bold text-foreground tabular-nums">
                      {stat.id === 'rating' ? stat.value.toFixed(1) : stat.value.toLocaleString()}
                      {stat.id === 'rating' && <span className="text-lg text-muted-foreground ml-1">/ 5</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>

                  {stat.id === 'rating' && (
                    <div className="mt-4">
                      <Progress value={stat.value * 20} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Bar Chart - Pickups per Day */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Daily Collection Performance
                </CardTitle>
                <Badge variant="outline">
                  {timeFilter === 'week' ? 'Last 7 Days' : timeFilter === 'month' ? 'Last 4 Weeks' : 'Custom'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pickupChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="day" 
                      className="text-muted-foreground"
                      fontSize={12}
                    />
                    <YAxis 
                      className="text-muted-foreground"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Bar dataKey="target" fill="hsl(var(--muted))" name="Target" radius={4} />
                    <Bar dataKey="pickups" fill="hsl(var(--primary))" name="Completed" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart - Feedback Ratings */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Community Satisfaction
                </CardTitle>
                <Badge variant="outline">
                  {feedbackData.length} Reviews
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={feedbackChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {feedbackChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Feedback & Reports */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Resident Feedback */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Recent Feedback
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    92% Positive
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <div className="space-y-4 p-6 pt-0">
                  {feedbackData.map((feedback) => {
                    const statusConfig = getStatusConfig(feedback.status);
                    
                    return (
                      <div key={feedback.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={feedback.avatar} />
                              <AvatarFallback className="text-xs">
                                {feedback.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm text-foreground">{feedback.name}</p>
                              <p className="text-xs text-muted-foreground">{feedback.area}</p>
                            </div>
                          </div>
                          <Badge className={statusConfig.color}>
                            {feedback.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(feedback.rating)}
                          <span className="text-sm text-muted-foreground ml-2">
                            {new Date(feedback.date).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feedback.comment}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Reports Panel */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Reports & Analytics
                </CardTitle>
                <Button onClick={generateReport} className="gap-2">
                  <Download className="w-4 h-4" />
                  Generate Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <span className="text-sm">Performance</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  <span className="text-sm">Community</span>
                </Button>
              </div>

              <Separator />

              {/* Recent Reports */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Recent Reports</h4>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {reportsData.map((report) => {
                      const statusConfig = getStatusConfig(report.status);
                      
                      return (
                        <div key={report.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">{report.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(report.date).toLocaleDateString()} • {report.type}
                            </p>
                          </div>
                          <Badge className={statusConfig.color}>
                            {report.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;