import { ThemeProvider } from "./components/ThemeProvider";
import { RouterProvider, useRouter } from "./components/RouterProvider";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navigation } from "./components/Navigation";
import { Breadcrumb } from "./components/Breadcrumb";
import { HeroSection } from "./components/HeroSection";
import { FeatureCards } from "./components/FeatureCards";
import { StatsSection } from "./components/StatsSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { NewsletterSection } from "./components/NewsletterSection";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { useEffect, Suspense } from "react";
import React from "react";
import { RealTimeTest } from './components/RealTimeTest';

// Code-split heavy pages
const TrackingPage = React.lazy(() => import("./components/TrackingPage").then(m => ({ default: m.TrackingPage })));
const DashboardPage = React.lazy(() => import("./components/DashboardPage").then(m => ({ default: m.DashboardPage })));
const ContactPage = React.lazy(() => import("./components/ContactPage").then(m => ({ default: m.ContactPage })));
const EmergencyReportPage = React.lazy(() => import("./components/EmergencyReportPage").then(m => ({ default: m.EmergencyReportPage })));
const CommunityHubPage = React.lazy(() => import("./components/CommunityHubPage").then(m => ({ default: m.CommunityHubPage })));
const RegisterPage = React.lazy(() => import('./components/RegisterPage').then(module => ({ default: module.RegisterPage })));
const AdminPanel = React.lazy(() => import('./components/AdminPanel').then(module => ({ default: module.AdminPanel })));
const LoginPage = React.lazy(() => import('./components/LoginPage').then(module => ({ default: module.default })));

// Home Page Component
const HomePage = React.memo(() => (
  <>
    <HeroSection />
    <FeatureCards />
    <StatsSection />
    <TestimonialsSection />
    <NewsletterSection />
  </>
));

HomePage.displayName = 'HomePage';

// Simple Error Boundary
class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, { hasError: boolean }> {
  state: { hasError: boolean } = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error('App runtime error:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-3xl p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">Please refresh the page. If the problem persists, contact support.</p>
        </div>
      );
    }
    return <>{this.props.children}</>;
  }
}

// Main App Content Component
const AppContent = React.memo(() => {
  const { currentRoute } = useRouter();

  useEffect(() => {
    // Set document meta information
    const titles: Record<string, string> = {
      home: "GreenGrid - Smart Waste Management Platform",
      tracking: "Tracking Map & Schedule - GreenGrid",
      dashboard: "Community Dashboard - GreenGrid",
      admin: "Admin Panel - GreenGrid",
      community: "Community Hub - GreenGrid",
      contact: "Feedback & Contact Us - GreenGrid",
      emergency: "Emergency Alert & Reporting - GreenGrid",
      realtime: "Real-time Test - GreenGrid",
      login: "Login - GreenGrid Waste Management",
      register: "Register - GreenGrid Waste Management"
    };

    document.title = titles[currentRoute] || titles.home;
  }, [currentRoute]);

  const renderPage = () => {
    switch (currentRoute) {
      case 'tracking':
        return <TrackingPage />;
      case 'dashboard':
        return (
          <ProtectedRoute requireAuth={true} allowedRoles={['community_leader']}>
            <DashboardPage />
          </ProtectedRoute>
        );
      case 'admin':
        return <AdminPanel />;
      case 'community':
        return <CommunityHubPage />;
      case 'contact':
        return <ContactPage />;
      case 'emergency':
        return <EmergencyReportPage />;
      case 'realtime':
        return <RealTimeTest />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  // Check if current route should show navigation
  const showNavigation = !['login', 'register'].includes(currentRoute);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Skip to main content for accessibility */}
      {showNavigation && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
      )}

      {showNavigation && <Navigation />}
      {showNavigation && <Breadcrumb />}

      <main id="main-content" role="main">
        <ErrorBoundary>
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            {renderPage()}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Only show footer on home page */}
      {currentRoute === 'home' && <Footer />}

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        className="toaster group"
        toastOptions={{
          classNames: {
            toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
      />
    </div>
  );
});

AppContent.displayName = 'AppContent';

export default function App() {
  useEffect(() => {
    // Performance optimization: Preload critical resources
    const criticalImages = [
      'https://images.unsplash.com/photo-1648538025147-c4e1db664c63',
      'https://images.unsplash.com/photo-1566707675151-2aa31b81060f'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Add meta tags for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Transform your community\'s waste management with GreenGrid\'s intelligent tracking, scheduling, and reporting platform. Join thousands making a sustainable impact.');
    }

    // Intersection Observer for performance monitoring
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      // Observe sections for progressive enhancement
      const sections = document.querySelectorAll('section');
      sections.forEach(section => observer.observe(section));

      return () => observer.disconnect();
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="greengrid-theme">
      <AuthProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}
