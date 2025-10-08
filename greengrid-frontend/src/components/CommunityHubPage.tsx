import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  MapPin,
  Leaf,
  Recycle,
  Trophy, 
  MessageCircle, 
  Share2,
  Target,
  Search,
  Plus,
  Eye,
  Globe,
  UserPlus,
  ThumbsUp
} from 'lucide-react';
import { ImageWithFallback } from './common/ImageWithFallback';

interface CommunityStats {
  icon: typeof Users;
  title: string;
  value: string;
  change: string;
  color: string;
}

interface Initiative {
  id: string;
  title: string;
  description: string;
  participants: number;
  goal: number;
  category: string;
  image: string;
  progress: number;
  status: string;
}

interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  likes: number;
  replies: number;
  time: string;
  category: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  image: string;
}

const CommunityHubPage = React.memo(() => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [_selectedCategory, _setSelectedCategory] = useState('all');

  // Community statistics
  const communityStats: CommunityStats[] = [
    {
      icon: Users,
      title: 'Active Members',
      value: '12,847',
      change: '+5.2%',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      icon: Leaf,
      title: 'CO₂ Saved This Month',
      value: '847 kg',
      change: '+12.8%',
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      icon: Recycle,
      title: 'Items Recycled',
      value: '156K',
      change: '+8.5%',
      color: 'text-primary bg-primary/10'
    },
    {
      icon: Trophy,
      title: 'Goals Achieved',
      value: '23/25',
      change: '92%',
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400'
    }
  ];

  // Community initiatives
  const initiatives: Initiative[] = [
    {
      id: '1',
      title: 'Zero Waste Challenge',
      description: 'Join our month-long challenge to minimize household waste and discover creative recycling solutions.',
      participants: 1247,
      goal: 2000,
      category: 'Challenge',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
      progress: 62,
      status: 'Active'
    },
    {
      id: '2',
      title: 'Community Garden Project',
      description: 'Help build sustainable community gardens using composted organic waste from our program.',
      participants: 523,
      goal: 800,
      category: 'Project',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
      progress: 65,
      status: 'Active'
    },
    {
      id: '3',
      title: 'E-Waste Collection Drive',
      description: 'Safely dispose of electronic waste while supporting local tech education programs.',
      participants: 856,
      goal: 1000,
      category: 'Event',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
      progress: 86,
      status: 'Ending Soon'
    }
  ];

  // Forum posts
  const forumPosts: ForumPost[] = [
    {
      id: '1',
      author: 'Sarah Chen',
      avatar: 'SC',
      title: 'Tips for reducing plastic waste in daily life',
      content: 'I\'ve been experimenting with different ways to cut down on single-use plastics. Here are some practical tips that have worked well for my family...',
      likes: 47,
      replies: 23,
      time: '2 hours ago',
      category: 'Tips & Tricks'
    },
    {
      id: '2',
      author: 'Mike Rodriguez',
      avatar: 'MR',
      title: 'Community composting success story',
      content: 'Our neighborhood composting initiative has been running for 6 months now, and the results are amazing! We\'ve diverted over 500kg of organic waste...',
      likes: 89,
      replies: 34,
      time: '5 hours ago',
      category: 'Success Stories'
    },
    {
      id: '3',
      author: 'Emma Thompson',
      avatar: 'ET',
      title: 'Question about hazardous waste disposal',
      content: 'Does anyone know the proper way to dispose of old paint cans and batteries? I want to make sure I\'m doing it safely and responsibly...',
      likes: 12,
      replies: 8,
      time: '1 day ago',
      category: 'Questions'
    }
  ];

  // Upcoming events
  const upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'Community Clean-up Day',
      date: 'March 15',
      time: '9:00 AM',
      location: 'Central Park',
      attendees: 156,
      category: 'Volunteer',
      image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec'
    },
    {
      id: '2',
      title: 'Sustainable Living Workshop',
      date: 'March 20',
      time: '2:00 PM',
      location: 'Community Center',
      attendees: 89,
      category: 'Workshop',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09'
    },
    {
      id: '3',
      title: 'Recycling Education Seminar',
      date: 'March 25',
      time: '6:00 PM',
      location: 'Online',
      attendees: 234,
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b'
    }
  ];

  const handleJoinInitiative = useCallback((initiativeId: string) => {
    // Handle joining initiative
    console.log('Joining initiative:', initiativeId);
  }, []);

  const handleLikePost = useCallback((postId: string) => {
    // Handle liking post
    console.log('Liking post:', postId);
  }, []);

  const handleAttendEvent = useCallback((eventId: string) => {
    // Handle attending event
    console.log('Attending event:', eventId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-blue-50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400">
                <Users className="w-4 h-4" />
                Join Our Growing Community
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
                Community <span className="text-primary">Hub</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Connect with neighbors, share eco-friendly tips, and work together towards a more sustainable future. 
                Every small action creates a big impact when we unite as a community.
              </p>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {communityStats.map((stat, index) => {
                const IconComponent = stat.icon;
                
                return (
                  <Card key={index} className="border-0 shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {stat.change}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            
            {/* Tab Navigation */}
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-2xl grid-cols-4 lg:grid-cols-4 h-12 bg-muted/50 backdrop-blur-sm">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="initiatives" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Initiatives</span>
                </TabsTrigger>
                <TabsTrigger value="forum" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Forum</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Events</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              
              {/* Featured Initiatives */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Featured Initiatives</h2>
                  <Button variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" />
                    View All
                  </Button>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  {initiatives.slice(0, 3).map((initiative) => (
                    <Card key={initiative.id} className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                      <div className="aspect-video relative overflow-hidden">
                        <ImageWithFallback
                          src={initiative.image}
                          alt={initiative.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary/90 text-primary-foreground">
                            {initiative.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-foreground">{initiative.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {initiative.description}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">
                              {initiative.participants}/{initiative.goal} participants
                            </span>
                          </div>
                          
                          <div className="w-full bg-accent rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all duration-500"
                              style={{ width: `${initiative.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full gap-2"
                          onClick={() => handleJoinInitiative(initiative.id)}
                        >
                          <UserPlus className="w-4 h-4" />
                          Join Initiative
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Activity & Achievements */}
              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Recent Forum Activity */}
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Recent Discussions
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {forumPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="space-y-3 p-4 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              {post.avatar}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-foreground">{post.author}</span>
                              <span className="text-xs text-muted-foreground">{post.time}</span>
                            </div>
                            <h4 className="font-medium text-foreground text-sm">{post.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                            
                            <div className="flex items-center gap-4 pt-2">
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{post.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{post.replies}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Community Achievements */}
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-orange-500" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">Carbon Neutral Milestone</h4>
                          <p className="text-sm text-muted-foreground">Community achieved 50% carbon reduction goal</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          New
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">10K Members Strong</h4>
                          <p className="text-sm text-muted-foreground">Our community reached 10,000 active members</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          2 days ago
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                          <Recycle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">Recycling Champion</h4>
                          <p className="text-sm text-muted-foreground">150K items successfully recycled this quarter</p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                          1 week ago
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Initiatives Tab */}
            <TabsContent value="initiatives" className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Community Initiatives</h2>
                  <p className="text-muted-foreground">Join ongoing projects and challenges to make a positive impact</p>
                </div>
                
                <Button className="gap-2 lg:w-auto">
                  <Plus className="w-4 h-4" />
                  Start New Initiative
                </Button>
              </div>
              
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {initiatives.map((initiative) => (
                  <Card key={initiative.id} className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="aspect-video relative overflow-hidden">
                      <ImageWithFallback
                        src={initiative.image}
                        alt={initiative.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary/90 text-primary-foreground">
                          {initiative.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {initiative.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {initiative.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{initiative.participants} joined</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>{initiative.progress}% complete</span>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full gap-2"
                          onClick={() => handleJoinInitiative(initiative.id)}
                        >
                          <UserPlus className="w-4 h-4" />
                          Join Initiative
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Forum Tab */}
            <TabsContent value="forum" className="space-y-6">
              
              {/* Forum Header */}
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Community Forum</h2>
                  <p className="text-muted-foreground">Share ideas, ask questions, and connect with neighbors</p>
                </div>
                
                <div className="flex gap-3">
                  <div className="relative flex-1 lg:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Post
                  </Button>
                </div>
              </div>

              {/* Forum Posts */}
              <div className="grid gap-6">
                {forumPosts.map((post) => (
                  <Card key={post.id} className="border-0 shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {post.avatar}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-foreground">{post.author}</h4>
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{post.time}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="font-medium text-foreground">{post.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                          </div>
                          
                          <div className="flex items-center gap-6 pt-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2 text-muted-foreground hover:text-foreground"
                              onClick={() => handleLikePost(post.id)}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                              <MessageCircle className="w-4 h-4" />
                              {post.replies} replies
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                              <Share2 className="w-4 h-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              
              {/* Events Header */}
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
                  <p className="text-muted-foreground">Join community events and volunteer opportunities</p>
                </div>
                
                <Button className="gap-2 lg:w-auto">
                  <Plus className="w-4 h-4" />
                  Create Event
                </Button>
              </div>

              {/* Events Grid */}
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="aspect-video relative overflow-hidden">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary/90 text-primary-foreground">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">{event.title}</h3>
                        
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date} at {event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full gap-2"
                        onClick={() => handleAttendEvent(event.id)}
                      >
                        <Calendar className="w-4 h-4" />
                        Attend Event
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
});

CommunityHubPage.displayName = 'CommunityHubPage';

export default CommunityHubPage;