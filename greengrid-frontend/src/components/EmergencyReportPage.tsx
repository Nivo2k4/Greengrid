import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Phone, 
  Mail, 
  Navigation,
  Upload,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  FileText,
  X,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportFormData {
  issueType: string;
  location: string;
  description: string;
  priority: string;
  contactName: string;
  contactPhone: string;
  photos: File[];
}

interface EmergencyContact {
  icon: typeof Phone;
  title: string;
  content: string;
  action: string;
  urgent?: boolean;
  color: string;
}

const EmergencyReportPage = React.memo(() => {
  const [formData, setFormData] = useState<ReportFormData>({
    issueType: '',
    location: '',
    description: '',
    priority: '',
    contactName: '',
    contactPhone: '',
    photos: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reportId, setReportId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Issue types with icons and descriptions
  const issueTypes = [
    { 
      value: 'illegal-dumping', 
      label: 'Illegal Dumping', 
      icon: AlertTriangle,
      description: 'Unauthorized waste disposal in public areas'
    },
    { 
      value: 'hazardous-waste', 
      label: 'Hazardous Waste', 
      icon: Shield,
      description: 'Chemical, medical, or dangerous materials'
    },
    { 
      value: 'missed-pickup', 
      label: 'Missed Pickup', 
      icon: Clock,
      description: 'Scheduled collection was not completed'
    },
    { 
      value: 'overflowing-bins', 
      label: 'Overflowing Bins', 
      icon: AlertTriangle,
      description: 'Public bins are full and overflowing'
    },
    { 
      value: 'blocked-access', 
      label: 'Blocked Access', 
      icon: Navigation,
      description: 'Vehicle access to collection points blocked'
    },
    { 
      value: 'other', 
      label: 'Other Emergency', 
      icon: Zap,
      description: 'Other urgent waste-related issues'
    }
  ];

  // Priority levels
  const priorityLevels = [
    { 
      value: 'critical', 
      label: 'Critical', 
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      description: 'Immediate danger to health/safety'
    },
    { 
      value: 'high', 
      label: 'High', 
      color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      description: 'Significant impact, needs urgent attention'
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      description: 'Important but not immediately dangerous'
    },
    { 
      value: 'low', 
      label: 'Low', 
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      description: 'Minor issue, can be addressed in normal timeframe'
    }
  ];

  // Emergency contacts
  const emergencyContacts: EmergencyContact[] = [
    {
      icon: Phone,
      title: '24/7 Emergency Hotline',
      content: '+94 11 911 9278',
      action: 'Call Now',
      urgent: true,
      color: 'bg-red-500 hover:bg-red-600 text-white'
    },
    {
      icon: Mail,
      title: 'Emergency Email',
      content: 'emergency@greengrid.com',
      action: 'Send Email',
      urgent: false,
      color: 'bg-orange-500 hover:bg-orange-600 text-white'
    },
    {
      icon: MapPin,
      title: 'Emergency Office',
      content: '123 Green Street, Eco City',
      action: 'Get Directions',
      urgent: false,
      color: 'bg-primary hover:bg-primary/90 text-primary-foreground'
    }
  ];

  // Form validation
  const validateForm = useCallback(() => {
    if (!formData.issueType) {
      toast.error('Please select an issue type');
      return false;
    }
    if (!formData.location.trim()) {
      toast.error('Please provide the location');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Please describe the issue');
      return false;
    }
    if (!formData.priority) {
      toast.error('Please select a priority level');
      return false;
    }
    if (!formData.contactName.trim()) {
      toast.error('Please provide your name');
      return false;
    }
    if (!formData.contactPhone.trim()) {
      toast.error('Please provide your phone number');
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
      // Upload images first if any
      let imageUrls = [];
      if (formData.photos.length > 0) {
        const formDataToUpload = new FormData();
        formData.photos.forEach((photo) => {
          formDataToUpload.append('images', photo);
        });

        const uploadResponse = await fetch('http://localhost:5000/api/upload/images', {
          method: 'POST',
          body: formDataToUpload,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrls = uploadData.images || [];
        }
      }

      // Submit the report
      const reportData = {
        title: `${formData.issueType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${formData.location}`,
        type: 'emergency',
        description: formData.description,
        location: formData.location,
        priority: formData.priority,
        images: imageUrls,
        imageUrls: imageUrls,
        reportedBy: formData.contactName,
        reportedById: 'current_user',
        contactInfo: {
          name: formData.contactName,
          phone: formData.contactPhone,
          email: 'user@example.com'
        }
      };

      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        const result = await response.json();
        const newReportId = result.report?.id || `EMR-${Date.now().toString().slice(-6)}`;
        setReportId(newReportId);
        setShowConfirmation(true);
        toast.success('Emergency report submitted successfully!');
        
        // Reset form
        setFormData({
          issueType: '',
          location: '',
          description: '',
          priority: '',
          contactName: '',
          contactPhone: '',
          photos: []
        });
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Emergency report submission error:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  // Handle input changes
  const handleInputChange = useCallback((field: keyof ReportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files].slice(0, 3) }));
  }, []);

  // Remove uploaded photo
  const removePhoto = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-orange-50 dark:from-red-950/20 dark:via-background dark:to-orange-950/20">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Emergency Warning Banner */}
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200 font-medium">
                <strong>IMPORTANT:</strong> For life-threatening emergencies, call emergency services (911) immediately. 
                This form is for waste management emergencies only.
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-full px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400">
                <Zap className="w-4 h-4" />
                Emergency Reporting System
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Emergency <span className="text-red-600 dark:text-red-400">Waste Alert</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Report urgent waste-related issues that require immediate attention. 
                Our emergency response team will be notified instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Report Form */}
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Emergency Report Form
              </CardTitle>
              <p className="text-muted-foreground">
                Please provide as much detail as possible to help our response team address the issue quickly.
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Issue Type */}
                <div className="space-y-3">
                  <Label className="text-foreground font-medium text-base">
                    Type of Emergency *
                  </Label>
                  <Select value={formData.issueType} onValueChange={(value) => handleInputChange('issueType', value)}>
                    <SelectTrigger className="h-14 border-border focus:border-red-500 focus:ring-red-500/20">
                      <SelectValue placeholder="Select the type of emergency..." />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value} className="py-3">
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-4 h-4 text-red-600" />
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-muted-foreground">{type.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactName" className="text-foreground font-medium">
                      Your Name *
                    </Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      placeholder="Enter your full name"
                      className="h-12 border-border focus:border-red-500 focus:ring-red-500/20"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="text-foreground font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="h-12 border-border focus:border-red-500 focus:ring-red-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <Label htmlFor="location" className="text-foreground font-medium">
                    Location *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600 w-5 h-5" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter the exact location or address"
                      className="h-12 pl-12 border-border focus:border-red-500 focus:ring-red-500/20"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Be as specific as possible (street address, landmarks, etc.)
                  </p>
                </div>

                {/* Priority Level */}
                <div className="space-y-3">
                  <Label className="text-foreground font-medium">
                    Priority Level *
                  </Label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {priorityLevels.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => handleInputChange('priority', priority.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          formData.priority === priority.value
                            ? 'border-red-500 ring-2 ring-red-500/20'
                            : 'border-border hover:border-red-300'
                        }`}
                      >
                        <Badge className={`${priority.color} mb-2`}>
                          {priority.label}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {priority.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-3">
                  <Label className="text-foreground font-medium">
                    Upload Photos (Optional)
                  </Label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-red-300 transition-colors">
                      <div className="text-center space-y-3">
                        <Camera className="w-10 h-10 text-muted-foreground mx-auto" />
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Choose Photos
                          </Button>
                          <p className="text-sm text-muted-foreground mt-2">
                            Max 3 photos, up to 5MB each
                          </p>
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Photo Preview */}
                    {formData.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-accent rounded-lg flex items-center justify-center">
                              <Camera className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {photo.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground font-medium">
                    Detailed Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the emergency in detail. Include any immediate risks, affected areas, and other relevant information..."
                    className="min-h-32 resize-none border-border focus:border-red-500 focus:ring-red-500/20"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 bg-red-600 hover:bg-red-700 text-white text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting Emergency Report...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Zap className="w-6 h-6" />
                        Submit Emergency Report
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Emergency Contact Panel */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl text-red-800 dark:text-red-200">
                <Phone className="w-6 h-6" />
                Emergency Contacts
              </CardTitle>
              <p className="text-red-700 dark:text-red-300">
                Need immediate assistance? Contact our emergency response team directly.
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {emergencyContacts.map((contact, index) => {
                  const IconComponent = contact.icon;
                  
                  return (
                    <div key={index} className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-white dark:bg-card rounded-2xl shadow-lg flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-red-600" />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">{contact.title}</h4>
                        <p className="text-muted-foreground font-mono text-sm">
                          {contact.content}
                        </p>
                      </div>
                      
                      <Button 
                        className={`${contact.color} shadow-lg hover:shadow-xl transition-all duration-200 gap-2`}
                        size="sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {contact.action}
                      </Button>
                      
                      {contact.urgent && (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Available 24/7
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-xl">Report Submitted Successfully!</DialogTitle>
            <DialogDescription className="space-y-4">
              <p>Your emergency report has been received and our response team has been notified.</p>
              
              <div className="bg-accent/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Report ID:</span>
                  <Badge variant="outline" className="font-mono">{reportId}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Status:</span>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    Under Review
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm">
                Keep this report ID for your records. You will receive updates via phone and email.
              </p>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowConfirmation(false)}
            >
              Close
            </Button>
            <Button className="flex-1 bg-primary">
              Track Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

EmergencyReportPage.displayName = 'EmergencyReportPage';

export default EmergencyReportPage;