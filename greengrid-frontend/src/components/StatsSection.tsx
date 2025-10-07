import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Truck, Users, Recycle, MapPin, TrendingUp, Clock, Award, Leaf } from "lucide-react";
import React from "react";

interface StatData {
  id: number;
  icon: typeof Truck;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  description: string;
  trend?: number;
}

const StatsSection = React.memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Record<number, number>>({});
  const sectionRef = useRef<HTMLElement>(null);

  const stats: StatData[] = useMemo(() => [
    {
      id: 1,
      icon: Truck,
      label: "Active Vehicles",
      value: 85,
      suffix: "",
      description: "Trucks operating across all zones",
      trend: 12
    },
    {
      id: 2,
      icon: Users,
      label: "Residents Served",
      value: 47500,
      suffix: "+",
      description: "People using our smart platform",
      trend: 23
    },
    {
      id: 3,
      icon: Recycle,
      label: "Materials Recycled",
      value: 2840,
      suffix: "T",
      description: "Tons diverted from landfills",
      trend: 18
    },
    {
      id: 4,
      icon: MapPin,
      label: "Coverage Zones",
      value: 34,
      suffix: "",
      description: "Districts with full service",
      trend: 8
    },
    {
      id: 5,
      icon: Clock,
      label: "Avg Response Time",
      value: 18,
      suffix: "min",
      description: "For emergency pickups",
      trend: -15
    },
    {
      id: 6,
      icon: Award,
      label: "Satisfaction Score",
      value: 96,
      suffix: "%",
      description: "Customer happiness rating",
      trend: 5
    },
    {
      id: 7,
      icon: Leaf,
      label: "Carbon Saved",
      value: 1250,
      suffix: "T CO₂",
      description: "Environmental impact reduction",
      trend: 31
    },
    {
      id: 8,
      icon: TrendingUp,
      label: "Efficiency Gain",
      value: 340,
      suffix: "%",
      description: "Route optimization improvement",
      trend: 67
    }
  ], []);

  const animateValue = useCallback((start: number, end: number, duration: number, callback: (value: number) => void) => {
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Advanced easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOutCubic);
      
      callback(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          
          // Stagger animations for better visual impact
          stats.forEach((stat, index) => {
            setTimeout(() => {
              animateValue(0, stat.value, 2000 + (index * 150), (value) => {
                setAnimatedValues(prev => ({ ...prev, [stat.id]: value }));
              });
            }, index * 100);
          });
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [animateValue, isVisible, stats]);

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-background to-accent/10 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 text-sm font-medium text-muted-foreground mb-6">
            <TrendingUp className="w-4 h-4" />
            Real-time Impact Data
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Transforming Communities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See how GreenGrid is creating measurable positive impact across communities 
            with data-driven waste management solutions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const currentValue = animatedValues[stat.id] || 0;
            const isNegativeTrend = stat.trend && stat.trend < 0;
            
            return (
              <Card 
                key={stat.id}
                className={`group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  isVisible ? 'animate-in slide-in-from-bottom-4' : 'opacity-0'
                }`}
                style={{ 
                  animationDelay: `${index * 75}ms`,
                  animationDuration: '600ms',
                  animationFillMode: 'both'
                }}
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="relative p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    
                    {stat.trend && (
                      <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${
                        isNegativeTrend 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        <TrendingUp className={`w-3 h-3 ${isNegativeTrend ? 'rotate-180' : ''}`} />
                        <span>{Math.abs(stat.trend)}%</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Value */}
                  <div className="space-y-2 mb-4">
                    <div className="text-3xl font-bold text-primary transition-colors duration-300 tabular-nums">
                      {stat.prefix}
                      <span>{currentValue.toLocaleString()}</span>
                      {stat.suffix}
                    </div>
                    
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {stat.label}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="relative h-1 bg-accent rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: isVisible ? '100%' : '0%',
                        transitionDelay: `${index * 150 + 800}ms`
                      }}
                    />
                  </div>
                </CardContent>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </Card>
            );
          })}
        </div>

        {/* Live Data Indicator */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-3 bg-card/80 backdrop-blur-sm border border-border rounded-full px-6 py-3 shadow-lg">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Data refreshes every 15 seconds
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});

StatsSection.displayName = 'StatsSection';

export { StatsSection };