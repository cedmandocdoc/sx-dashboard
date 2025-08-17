import { useState, useEffect, useMemo } from 'react';
import { Metrics, Product, ProductManagerProductAddedEvent, ProductManagerProductStatusToggledEvent } from '../types';

// Load initial products from localStorage
const loadProductsFromStorage = (): Product[] => {
  try {
    const stored = localStorage.getItem('sx:products');
    if (stored) {
      const products = JSON.parse(stored);
      // Convert date strings back to Date objects
      return products.map((product: any) => ({
        ...product,
        createdAt: new Date(product.createdAt)
      }));
    }
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
  }
  return [];
};

export const useProductMetrics = () => {
  const [products, setProducts] = useState<Product[]>(loadProductsFromStorage());

  // Memoized metrics calculation from local products state
  const metrics = useMemo<Metrics>(() => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const inactive = products.filter(p => p.status === 'inactive').length;
    return { total, active, inactive };
  }, [products]);

  useEffect(() => {
    const handleProductAdded = (event: ProductManagerProductAddedEvent) => {
      const { product } = event.detail;
      if (product) {
        setProducts(prevProducts => [...prevProducts, {
          ...product,
          createdAt: new Date(product.createdAt)
        }]);
      }
    };



    const handleProductStatusToggled = (event: ProductManagerProductStatusToggledEvent) => {
      const { productId, newStatus } = event.detail;
      if (productId && newStatus) {
        setProducts(prevProducts => 
          prevProducts.map(product =>
            product.id === productId 
              ? { ...product, status: newStatus }
              : product
          )
        );
      }
    };

    // Listen for specific product events
    window.addEventListener('sx-product-manager:product-added', handleProductAdded as EventListener);
    window.addEventListener('sx-product-manager:product-status-toggled', handleProductStatusToggled as EventListener);

    // Cleanup function
    return () => {
      window.removeEventListener('sx-product-manager:product-added', handleProductAdded as EventListener);
      window.removeEventListener('sx-product-manager:product-status-toggled', handleProductStatusToggled as EventListener);
    };
  }, []);

  return { metrics };
};
