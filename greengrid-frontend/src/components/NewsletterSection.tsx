import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { CheckCircle, Mail, ArrowRight, Loader2 } from "lucide-react";

interface FormState {
  email: string;
  firstName: string;
  interests: string[];
}

export function NewsletterSection() {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    firstName: '',
    interests: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const interests = [
    { id: 'updates', label: 'Service Updates', icon: '🔄' },
    { id: 'tips', label: 'Eco Tips', icon: '🌱' },
    { id: 'community', label: 'Community News', icon: '👥' },
    { id: 'events', label: 'Green Events', icon: '📅' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formState.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (formState.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleInterestToggle = (interestId: string) => {
    setFormState(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
    
    // Clear interests error when user selects an option
    if (errors.interests) {
      setErrors(prev => ({ ...prev, interests: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] relative overflow-hidden">
        {/* Success Animation Background */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div className="w-2 h-2 bg-white/20 rounded-full" />
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="animate-in zoom-in-50 duration-500">
            <CheckCircle className="w-20 h-20 text-white mx-auto mb-8" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Welcome to the GreenGrid Community!
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Thank you, {formState.firstName}! You'll receive updates about {formState.interests.join(', ')} 
              at {formState.email}. Get ready to make a positive environmental impact!
            </p>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setFormState({ email: '', firstName: '', interests: [] });
              }}
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#2E7D32] transition-all duration-300"
            >
              Subscribe Another Email
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-[#2E7D32]/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2E7D32] rounded-2xl mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Stay in the Green Loop
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get the latest updates on waste collection schedules, eco-friendly tips, and community initiatives 
            delivered straight to your inbox
          </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    value={formState.firstName}
                    onChange={(e) => {
                      setFormState(prev => ({ ...prev, firstName: e.target.value }));
                      if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
                    }}
                    placeholder="Enter your first name"
                    className={`h-12 ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'focus:border-[#2E7D32]'} transition-colors duration-200`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formState.email}
                    onChange={(e) => {
                      setFormState(prev => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    placeholder="your.email@example.com"
                    className={`h-12 ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-[#2E7D32]'} transition-colors duration-200`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  What interests you? *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {interests.map((interest) => (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-center hover:scale-105 ${
                        formState.interests.includes(interest.id)
                          ? 'border-[#2E7D32] bg-green-50 text-[#2E7D32]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-700'
                      }`}
                    >
                      <div className="text-2xl mb-2">{interest.icon}</div>
                      <div className="text-sm font-medium">{interest.label}</div>
                    </button>
                  ))}
                </div>
                {errors.interests && (
                  <p className="text-red-500 text-sm mt-2">{errors.interests}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-12 py-4 text-lg group transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Join the Community
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>

              {/* Privacy Note */}
              <p className="text-sm text-gray-500 text-center">
                We respect your privacy. Unsubscribe at any time. Read our{' '}
                <a href="#" className="text-[#2E7D32] hover:underline">Privacy Policy</a>.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}