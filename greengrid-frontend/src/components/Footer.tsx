import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Leaf,
  Shield,
  Clock,
  Heart
} from "lucide-react";
import { useRouter } from "./RouterProvider";
import React from "react";

const Footer = React.memo(() => {
  const currentYear = new Date().getFullYear();
  const { navigate } = useRouter();

  const handleNavigation = (route: string) => {
    if (route && route !== '#') {
      navigate(route as any);
    }
  };

  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Waste Collection", route: "tracking" },
        { name: "Recycling Programs", route: "community" },
        { name: "Bulk Pickup", route: "tracking" },
        { name: "Commercial Services", route: "dashboard" },
        { name: "Emergency Response", route: "emergency" }
      ]
    },
    {
      title: "Platform",
      links: [
        { name: "Tracking Map", route: "tracking" },
        { name: "Dashboard", route: "dashboard" },
        { name: "Mobile App", route: "contact" },
        { name: "API Documentation", route: "contact" },
        { name: "System Status", route: "dashboard" }
      ]
    },
    {
      title: "Community",
      links: [
        { name: "Feedback Portal", route: "contact" },
        { name: "Community Forums", route: "community" },
        { name: "Environmental Impact", route: "community" },
        { name: "Success Stories", route: "community" },
        { name: "Local Partnerships", route: "community" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", route: "contact" },
        { name: "Contact Support", route: "contact" },
        { name: "Service Guidelines", route: "contact" },
        { name: "Report Issue", route: "emergency" },
        { name: "Training Materials", route: "contact" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  const features = [
    { icon: Leaf, text: "Carbon Neutral Operations" },
    { icon: Shield, text: "Data Security Certified" },
    { icon: Clock, text: "24/7 Support Available" }
  ];

  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-lg">G</span>
              </div>
              <span className="text-2xl font-bold text-foreground">GreenGrid</span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Revolutionizing waste management through smart technology, community engagement, 
              and sustainable practices. Building cleaner, greener communities together.
            </p>

            {/* Features */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <feature.icon className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">34/ Wellawatte,Colombo</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">+94777534286</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">hello@greengrid.com</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="font-semibold text-foreground">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <button 
                          onClick={() => handleNavigation(link.route)}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 text-left"
                        >
                          {link.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Stay Updated</h3>
            <p className="text-muted-foreground">
              Get the latest updates on service improvements, environmental initiatives, and community impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground group">
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© {currentYear} GreenGrid. All rights reserved.</span>
            <span className="hidden md:block">|</span>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for the environment</span>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-9 h-9 bg-accent hover:bg-primary rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-all duration-200 hover:scale-110"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export { Footer };