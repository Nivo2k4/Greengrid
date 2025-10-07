/// <reference types="vite/client" />

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker for PWA (only in production)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Service worker registration failed:', err);
    });
  });
}

// Lightweight performance metrics: LCP, CLS, first input delay
(() => {
  if (!('PerformanceObserver' in window)) return;

  // LCP
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const last = entries[entries.length - 1] as PerformanceEntry | undefined;
      if (last) {
        // eslint-disable-next-line no-console
        console.log('[perf] LCP ms', Math.round(last.startTime));
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true } as PerformanceObserverInit);
  } catch {}

  // CLS
  try {
    let cls = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any) {
        if (!entry.hadRecentInput) cls += entry.value;
      }
      // eslint-disable-next-line no-console
      console.log('[perf] CLS', Number(cls.toFixed(4)));
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true } as PerformanceObserverInit);
  } catch {}

  // First input delay approximation
  try {
    const onFirstInput = (event: Event) => {
      const delay = performance.now() - (event as any).timeStamp;
      // eslint-disable-next-line no-console
      console.log('[perf] First Input Delay ms', Math.max(0, Math.round(delay)));
      window.removeEventListener('pointerdown', onFirstInput, { capture: true } as any);
      window.removeEventListener('keydown', onFirstInput, { capture: true } as any);
    };
    window.addEventListener('pointerdown', onFirstInput, { once: true, capture: true } as any);
    window.addEventListener('keydown', onFirstInput, { once: true, capture: true } as any);
  } catch {}
})();