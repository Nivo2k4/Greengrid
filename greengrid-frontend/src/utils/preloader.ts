// Component preloader for better performance
export const preloadComponent = (componentImport: () => Promise<any>) => {
  const componentPromise = componentImport();
  return componentPromise;
};

// Preload critical components based on user behavior
export const preloadCriticalComponents = () => {
  // Preload most commonly accessed pages
  const criticalComponents = [
    () => import('../components/DashboardPage'),
    () => import('../components/TrackingPage'),
    () => import('../components/LoginPage')
  ];

  // Preload after initial page load
  setTimeout(() => {
    criticalComponents.forEach(componentImport => {
      preloadComponent(componentImport);
    });
  }, 2000);
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};
