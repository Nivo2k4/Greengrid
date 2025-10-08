import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  MapPin, 
  Truck, 
  Search, 
  Filter, 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Navigation,
  Zap,
  MoreVertical,
  Calendar,
  Users,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download
} from 'lucide-react';
import { ImageWithFallback } from './common/ImageWithFallback';

interface TruckData {
  id: string;
  name: string;
  driver: string;
  status: 'active' | 'completed' | 'delayed' | 'emergency';
  location: { x: number; y: number };
  route: string;
  capacity: number;
  currentLoad: number;
  estimatedTime: string;
  lastUpdate: Date;
}

interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  area: string;
  truckId: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'missed';
  residents: number;
  bins: number;
  priority: 'high' | 'medium' | 'low';
}

const TrackingPage = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock data for trucks
  const trucks: TruckData[] = useMemo(() => [
    {
      id: 'T001',
      name: 'Green Collector 1',
      driver: 'Mike Johnson',
      status: 'active',
      location: { x: 45, y: 30 },
      route: 'Downtown Circuit',
      capacity: 100,
      currentLoad: 65,
      estimatedTime: '2h 15m',
      lastUpdate: new Date()
    },
    {
      id: 'T002',
      name: 'Eco Truck 2',
      driver: 'Sarah Chen',
      status: 'completed',
      location: { x: 70, y: 55 },
      route: 'Residential North',
      capacity: 120,
      currentLoad: 98,
      estimatedTime: 'Completed',
      lastUpdate: new Date()
    },
    {
      id: 'T003',
      name: 'Clean City 3',
      driver: 'Robert Davis',
      status: 'delayed',
      location: { x: 25, y: 75 },
      route: 'Industrial Zone',
      capacity: 150,
      currentLoad: 42,
      estimatedTime: '3h 45m',
      lastUpdate: new Date()
    },
    {
      id: 'T004',
      name: 'Green Fleet 4',
      driver: 'Emma Wilson',
      status: 'active',
      location: { x: 80, y: 20 },
      route: 'Suburban East',
      capacity: 110,
      currentLoad: 78,
      estimatedTime: '1h 30m',
      lastUpdate: new Date()
    }
  ], []);

  // Mock schedule data
  const scheduleItems: ScheduleItem[] = useMemo(() => [
    {
      id: 'S001',
      date: '2025-01-21',
      time: '08:00',
      area: 'Downtown District',
      truckId: 'T001',
      status: 'in-progress',
      residents: 450,
      bins: 89,
      priority: 'high'
    },
    {
      id: 'S002',
      date: '2025-01-21',
      time: '09:30',
      area: 'Residential North',
      truckId: 'T002',
      status: 'completed',
      residents: 320,
      bins: 64,
      priority: 'medium'
    },
    {
      id: 'S003',
      date: '2025-01-21',
      time: '10:15',
      area: 'Industrial Zone',
      truckId: 'T003',
      status: 'missed',
      residents: 120,
      bins: 25,
      priority: 'low'
    },
    {
      id: 'S004',
      date: '2025-01-21',
      time: '14:00',
      area: 'Suburban East',
      truckId: 'T004',
      status: 'upcoming',
      residents: 380,
      bins: 76,
      priority: 'high'
    },
    {
      id: 'S005',
      date: '2025-01-22',
      time: '08:30',
      area: 'City Center',
      truckId: 'T001',
      status: 'upcoming',
      residents: 290,
      bins: 58,
      priority: 'medium'
    }
  ], []);

  // Filter logic
  const filteredSchedule = useMemo(() => {
    return scheduleItems.filter(item => {
      const matchesSearch = item.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trucks.find(t => t.id === item.truckId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesArea = areaFilter === 'all' || item.area === areaFilter;
      
      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [scheduleItems, searchTerm, statusFilter, areaFilter, trucks]);

  // Status styling
  const getStatusConfig = useCallback((status: string) => {
    const configs = {
      active: { 
        color: 'bg-primary text-primary-foreground', 
        icon: Zap, 
        pulse: true 
      },
      completed: { 
        color: 'bg-green-500 text-white', 
        icon: CheckCircle, 
        pulse: false 
      },
      delayed: { 
        color: 'bg-destructive text-destructive-foreground', 
        icon: AlertTriangle, 
        pulse: true 
      },
      emergency: { 
        color: 'bg-orange-500 text-white', 
        icon: AlertTriangle, 
        pulse: true 
      },
      'in-progress': { 
        color: 'bg-blue-500 text-white', 
        icon: Navigation, 
        pulse: true 
      },
      upcoming: { 
        color: 'bg-secondary text-secondary-foreground', 
        icon: Clock, 
        pulse: false 
      },
      missed: { 
        color: 'bg-destructive text-destructive-foreground', 
        icon: AlertTriangle, 
        pulse: false 
      }
    };
    return configs[status as keyof typeof configs] || configs.upcoming;
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleTruckClick = useCallback((truckId: string) => {
    setSelectedTruck(prev => prev === truckId ? null : truckId);
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Tracking & Schedule Dashboard
              </h1>
              <p className="text-muted-foreground">
                Real-time waste collection monitoring and schedule management
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Last updated: {lastUpdate.toLocaleTimeString()}
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
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 transition-all duration-300 ${
          isFullscreen ? 'grid-cols-1' : 'lg:grid-cols-12'
        }`}>
          
          {/* Interactive Map Section */}
          <div className={`${isFullscreen ? 'col-span-1' : 'lg:col-span-7'}`}>
            <Card className="h-[600px] lg:h-[700px] overflow-hidden border-0 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Live Tracking Map
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {trucks.filter(t => t.status === 'active').length} Active
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFullscreenToggle}
                      className="w-9 h-9 p-0"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 h-[calc(100%-80px)]">
                <div 
                  ref={mapRef}
                  className="relative w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 overflow-hidden"
                >
                  {/* Map Background */}
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1648538025147-c4e1db664c63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMG1hbmFnZW1lbnQlMjB0cnVjayUyMG1hcHxlbnwxfHx8fDE3NTU1ODQ0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="City waste management map"
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />

                  {/* Grid Overlay */}
                  <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
                      backgroundSize: '40px 40px'
                    }}
                  />

                  {/* Truck Markers */}
                  {filteredSchedule.map((item, index) => {
                    const config = getStatusConfig(item.status);
                    const isSelected = selectedTruck === item.truckId;

                    return (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleTruckClick(item.truckId)}
                              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                                isSelected ? 'scale-125 z-20' : 'z-10'
                              }`}
                              style={{
                                left: `${Math.random() * 80 + 10}%`,
                                top: `${Math.random() * 80 + 10}%`,
                              }}
                            >
                              <div className={`
                                relative w-12 h-12 rounded-xl shadow-lg border-2 border-background
                                ${config.color} flex items-center justify-center
                                ${config.pulse ? 'animate-pulse' : ''}
                                ${isSelected ? 'ring-4 ring-primary/30' : ''}
                              `}>
                                <Truck className="w-6 h-6" />
                                {config.pulse && (
                                  <div className="absolute inset-0 rounded-xl bg-current opacity-20 animate-ping" />
                                )}
                              </div>
                              
                              {/* Route line preview */}
                              <div className="absolute top-6 left-6 w-16 h-1 bg-primary/30 rounded-full">
                                <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: `50%` }} />
                              </div>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white dark:bg-gray-800 border shadow-lg">
                            <div className="text-sm">
                              <div className="font-medium">{item.area}</div>
                              <div className="text-gray-600 dark:text-gray-400">Time: {item.time}</div>
                              <div className="text-gray-600 dark:text-gray-400">Status: {item.status}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}

                  {/* Selected Truck Details Overlay */}
                  {selectedTruck && (
                    <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-xl animate-in slide-in-from-bottom-2">
                      {(() => {
                        const truck = trucks.find(t => t.id === selectedTruck);
                        if (!truck) return null;
                        const config = getStatusConfig(truck.status);
                        
                        return (
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-foreground">{truck.name}</h3>
                                <Badge className={config.color}>
                                  {truck.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div>Driver: {truck.driver}</div>
                                <div>Route: {truck.route}</div>
                                <div>Load: {truck.currentLoad}%</div>
                                <div>ETA: {truck.estimatedTime}</div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTruck(null)}
                            >
                              Close
                            </Button>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Map Legend */}
                  <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg">
                    <h4 className="font-medium text-foreground mb-3">Status Legend</h4>
                    <div className="space-y-2">
                      {['active', 'completed', 'delayed', 'emergency'].map((status) => {
                        const config = getStatusConfig(status);
                        return (
                          <div key={status} className="flex items-center gap-2 text-sm">
                            <div className={`w-3 h-3 rounded-full ${config.color}`} />
                            <span className="capitalize text-muted-foreground">{status}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule & Controls Section */}
          <div className={`${isFullscreen ? 'hidden' : 'lg:col-span-5'} space-y-6`}>
            
            {/* Controls & Filters */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search areas or trucks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="missed">Missed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={areaFilter} onValueChange={setAreaFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      <SelectItem value="Downtown District">Downtown</SelectItem>
                      <SelectItem value="Residential North">North</SelectItem>
                      <SelectItem value="Industrial Zone">Industrial</SelectItem>
                      <SelectItem value="Suburban East">East</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Showing {filteredSchedule.length} of {scheduleItems.length} schedules</span>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Bell className="w-4 h-4" />
                    Set Reminders
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Table */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Collection Schedule
                  </CardTitle>
                  <div className="flex gap-2">
                    {['upcoming', 'in-progress', 'completed', 'missed'].map((status) => {
                      const count = filteredSchedule.filter(item => item.status === status).length;
                      const config = getStatusConfig(status);
                      return (
                        <Badge key={status} className={`${config.color} text-xs`}>
                          {count}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm">
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Area</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSchedule.map((item) => {
                        const truck = trucks.find(t => t.id === item.truckId);
                        const config = getStatusConfig(item.status);
                        const IconComponent = config.icon;

                        return (
                          <TableRow 
                            key={item.id} 
                            className="group hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => handleTruckClick(item.truckId)}
                          >
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-foreground">
                                  {new Date(item.date).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {item.time}
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-foreground">{item.area}</div>
                                <div className="text-xs text-muted-foreground">
                                  {truck?.name}
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <Badge className={`${config.color} gap-1`}>
                                <IconComponent className="w-3 h-3" />
                                {item.status.replace('-', ' ')}
                              </Badge>
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Users className="w-3 h-3" />
                                  {item.residents} residents
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <div className="w-3 h-3 bg-primary rounded-full" />
                                  {item.bins} bins
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

TrackingPage.displayName = 'TrackingPage';

export default TrackingPage;