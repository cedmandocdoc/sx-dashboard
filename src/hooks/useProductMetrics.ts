import { useState, useEffect } from 'react';
import { Metrics } from '../types';

export const useProductMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics>({ total: 0, active: 0, inactive: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let hasReceivedInitialData = false;

    const handleProductEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.metrics) {
        setMetrics(event.detail.metrics);
        setError(null);
        
        if (!hasReceivedInitialData) {
          setIsLoading(false);
          hasReceivedInitialData = true;
        }
      }
    };

    // Listen for all product-related events
    const eventTypes = [
      'sx-product-manager:product-added',
      'sx-product-manager:product-updated',
      'sx-product-manager:product-removed',
      'sx-product-manager:product-status-toggled',
      'sx-product-manager:metrics-response'
    ];

    eventTypes.forEach(eventType => {
      window.addEventListener(eventType, handleProductEvent as EventListener);
    });

    // Set a timeout to show error if no events are received
    const timeoutId = setTimeout(() => {
      if (!hasReceivedInitialData) {
        setIsLoading(false);
        setError('Product Manager not responding');
      }
    }, 3000);

    // Request initial data by dispatching a custom event
    // This is a way to "ping" the product manager for current state
    const requestInitialData = () => {
      const event = new CustomEvent('sx-dashboard:request-metrics', {
        bubbles: true
      });
      window.dispatchEvent(event);
    };

    // Try to request initial data
    requestInitialData();

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      eventTypes.forEach(eventType => {
        window.removeEventListener(eventType, handleProductEvent as EventListener);
      });
    };
  }, []);

  return { metrics, isLoading, error };
};
