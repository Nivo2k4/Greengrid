import { useNavigate } from "react-router-dom";
import React from "react";
import { MapPin, BarChart3, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
export default function FeatureCards(){
    const features = [
    {
      icon: MapPin,
      title: "Track Trucks in Real-Time",
      description:
        "Monitor waste collection vehicles and get live updates on pickup schedules in your area.",
      action: "View Tracking Map",
      route: "tracking",
      gradient: "from-blue-500/10 to-blue-600/10"
    },
    {
      icon: BarChart3,
      title: "Community Dashboard Reports",
      description:
        "Access detailed analytics and insights about waste management performance in your community.",
      action: "Open Dashboard",
      route: "dashboard",
      gradient: "from-green-500/10 to-green-600/10"
    },
    {
      icon: FileText,
      title: "Request Pickups Easily",
      description:
        "Submit pickup requests for bulky items or special waste with just a few clicks.",
      action: "Make Request",
      route: "community",
      gradient: "from-purple-500/10 to-purple-600/10"
    },
];
    const navigate = useNavigate();
    const handleFeatureClick = (route: string) => {
    navigate(route as any);
    };
      return(
      <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 text-sm font-medium text-muted-foreground mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Core Platform Features
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Everything You Need for Smart{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Waste Management
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform brings transparency, efficiency, and intelligence 
            to waste collection services across your entire community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <Card
                key={index}
                className="group cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden relative"
                onClick={() => handleFeatureClick(feature.route)}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardContent className="p-8 text-center space-y-6 relative z-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Action Button */}
                <div className="pt-4">
                <Button
                    variant="ghost"
                    className="group/btn text-white hover:text-white hover:bg-primary transition-all duration-300 font-medium"
                    onClick={(e) => {
                    e.stopPropagation();
                    handleFeatureClick(feature.route);
                    }}
                >
                    <span>{feature.action}</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Button>
                </div>

                  {/* Hover Indicator */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-card/80 backdrop-blur-sm border border-border rounded-full px-6 py-3 shadow-lg">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Trusted by 200+ communities worldwide
            </span>
          </div>
        </div>
      </div>
    </section>);
}