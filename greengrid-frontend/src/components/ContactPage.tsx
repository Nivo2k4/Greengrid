import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Send, 
  MessageSquare, 
  Clock,
  Facebook,
  Twitter,
  MessageCircle,
  CheckCircle,
  Heart,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackFormData {
  fullName: string;
  email: string;
  message: string;
  rating: number;
}

interface ContactInfo {
  icon: typeof MapPin;
  title: string;
  content: string;
  action?: string;
}

const ContactPage = React.memo(() => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    fullName: '',
    email: '',
    message: '',
    rating: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  // Contact information data
  const contactInfo: ContactInfo[] = [
    {
      icon: MapPin,
      title: 'Visit Our Office',
      content: '123 Green Street, Eco City, EC 12345',
      action: 'Get Directions'
    },
    {
      icon: Phone,
      title: '24/7 Emergency Hotline',
      content: '+94 11 911 9278',
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Support',
      content: 'support@greengrid.com',
      action: 'Send Email'
    }
  ];

  // Social media links
  const socialLinks = [
    { 
      icon: Facebook, 
      name: 'Facebook', 
      href: '#',
      color: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    { 
      icon: MessageCircle, 
      name: 'WhatsApp', 
      href: '#',
      color: 'hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
    },
    { 
      icon: Twitter, 
      name: 'Twitter', 
      href: '#',
      color: 'hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
    }
  ];

  // Form validation
  const validateForm = useCallback(() => {
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your feedback message');
      return false;
    }
    if (formData.rating === 0) {
      toast.error('Please provide a rating');
      return false;
    }
    return true;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Submit feedback to backend
      const feedbackData = {
        title: `Feedback from ${formData.fullName}`,
        type: 'feedback',
        description: formData.message,
        location: 'Contact Form',
        priority: formData.rating >= 4 ? 'low' : formData.rating >= 3 ? 'medium' : 'high',
        images: [],
        imageUrls: [],
        reportedBy: formData.fullName,
        reportedById: 'feedback_user',
        contactInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: '',
          rating: formData.rating
        }
      };

      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        toast.success('Thank you for your feedback! We\'ll get back to you soon.');
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          message: '',
          rating: 0
        });
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  // Handle input changes
  const handleInputChange = useCallback((field: keyof FeedbackFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Handle star rating
  const handleStarClick = useCallback((rating: number) => {
    handleInputChange('rating', rating);
  }, [handleInputChange]);

  // Render star rating component
  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="p-1 rounded-lg hover:bg-accent/50 transition-colors duration-200"
          >
            <Star
              className={`w-8 h-8 transition-all duration-200 ${
                star <= (hoveredStar || formData.rating)
                  ? 'text-yellow-500 fill-current'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
        <span className="ml-3 text-sm text-muted-foreground">
          {formData.rating > 0 && `${formData.rating} out of 5 stars`}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 text-sm font-medium text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              We'd love to hear from you
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
              Feedback & Contact Us
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Share your experience with our waste management services. Your feedback helps us 
              improve and serve your community better.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>Community Focused</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
          
          {/* Left Side - Feedback Form (60%) */}
          <div className="lg:col-span-3 space-y-8">
            <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Share Your Feedback
                </CardTitle>
                <p className="text-muted-foreground">
                  Help us improve our services by sharing your experience. All feedback is valuable to us.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className="h-12 border-border focus:border-primary focus:ring-primary/20"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        className="h-12 border-border focus:border-primary focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Rating Section */}
                  <div className="space-y-3">
                    <Label className="text-foreground font-medium">
                      Rate Our Service *
                    </Label>
                    <div className="bg-accent/30 rounded-xl p-4">
                      {renderStarRating()}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground font-medium">
                      Your Feedback *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Share your experience with our waste management services..."
                      className="min-h-32 resize-none border-border focus:border-primary focus:ring-primary/20"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.message.length}/500 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending Feedback...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Feedback
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Contact Info (40%) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Contact Information Card */}
            <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary-foreground" />
                  </div>
                  Get in Touch
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  
                  return (
                    <div key={index} className="group">
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent/50 transition-colors duration-200">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {info.title}
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {info.content}
                          </p>
                          {info.action && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
                            >
                              {info.action}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {index < contactInfo.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  );
                })}

                {/* Map Illustration */}
                <div className="mt-8 p-6 bg-gradient-to-br from-accent/20 to-primary/5 rounded-xl">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Located in the heart of Eco City, serving communities with pride
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mx-auto">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Why Choose GreenGrid?</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Trusted by 50,000+ residents with 98% satisfaction rate
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">24/7</div>
                      <div className="text-xs text-muted-foreground">Support</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">98%</div>
                      <div className="text-xs text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Social Media Links */}
            <div className="text-center space-y-6">
              <h3 className="text-lg font-semibold text-foreground">
                Connect With Us
              </h3>
              
              <div className="flex justify-center gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground transition-all duration-200 hover:scale-110 hover:shadow-lg ${social.color}`}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>

              <Separator className="my-8" />

              {/* Copyright */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>© 2025 GreenGrid. All rights reserved.</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for the environment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ContactPage.displayName = 'ContactPage';

export default ContactPage;