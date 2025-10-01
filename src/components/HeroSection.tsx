import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { MapPin, Package, AlertTriangle, ArrowRight, Play } from "lucide-react";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { useState, useEffect } from "react";
import { useRouter } from "./RouterProvider";
import React from "react";

const HeroSection = React.memo(() => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const { navigate } = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: MapPin,
      text: "Real-time truck tracking",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Package,
      text: "Smart pickup scheduling",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: AlertTriangle,
      text: "Instant issue reporting",
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  const handleTrackingClick = () => {
    navigate('tracking');
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 relative overflow-hidden flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl transition-all duration-1000"
          style={{
            left: mousePosition.x * 0.02,
            top: mousePosition.y * 0.02,
          }}
        />
        <div 
          className="absolute w-72 h-72 bg-accent/20 rounded-full blur-2xl transition-all duration-700"
          style={{
            right: -mousePosition.x * 0.01,
            bottom: -mousePosition.y * 0.01,
          }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="lg:col-span-5 space-y-8">
            <div className={`space-y-6 transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-accent/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 text-sm font-medium text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Now serving 50,000+ residents
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Smart Waste Management for a{" "}
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Cleaner Future
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Transform your community's waste management with real-time tracking, 
                intelligent scheduling, and transparent reporting. Join thousands making 
                a sustainable impact.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className={`space-y-4 transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center space-x-4 group cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-foreground font-medium group-hover:text-primary transition-colors duration-300">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Button 
                size="lg" 
                onClick={handleTrackingClick}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg group transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span>Start Tracking Now</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-border text-foreground hover:bg-accent px-8 py-6 text-lg transition-all duration-300 group"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className={`flex items-center space-x-6 text-sm text-muted-foreground transition-all duration-1000 delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-foreground">4.9/5</span>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="h-4 w-px bg-border" />
              <span>Trusted by 200+ communities</span>
            </div>
          </div>

          {/* Right Side - Interactive Map Preview */}
          <div className="lg:col-span-7">
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Card 
                className="relative overflow-hidden shadow-2xl border-0 bg-card/50 backdrop-blur-sm cursor-pointer group transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl"
                onClick={handleTrackingClick}
              >
                <div className="relative h-96 lg:h-[600px]">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1648538025147-c4e1db664c63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMG1hbmFnZW1lbnQlMjB0cnVjayUyMG1hcHxlbnwxfHx8fDE3NTU1ODQ0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Interactive waste management tracking interface"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  
                  {/* Floating UI Elements */}
                  <div className="absolute top-6 left-6 bg-background/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-foreground">12 trucks active</span>
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">98%</div>
                      <div className="text-sm text-muted-foreground">On-time rate</div>
                    </div>
                  </div>

                  {/* Animated Truck Indicators */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl animate-pulse">
                        <svg className="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                        </svg>
                      </div>
                      
                      {/* Route Lines */}
                      <div className="absolute top-8 -left-16 w-32 h-1 bg-primary/30 rounded-full">
                        <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                      <div className="absolute -top-8 left-8 w-1 h-32 bg-primary/30 rounded-full">
                        <div className="w-full bg-primary rounded-full animate-pulse" style={{ height: '40%' }} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Interactive Hint */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-background/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <span className="text-sm font-medium">
                        Click to explore the full tracking interface
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export { HeroSection };