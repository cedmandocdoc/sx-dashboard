import { useState, useEffect, useMemo } from 'react';
import { Metrics, Product, ProductManagerProductAddedEvent, ProductManagerProductStatusToggledEvent } from '../types';


export const useProductMetrics = () => {
  const [products, setProducts] = useState<Product[]>([]);

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
        setProducts(prevProducts => [...prevProducts, product]);
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

    window.addEventListener('sx-product-manager:product-added', handleProductAdded as EventListener);
    window.addEventListener('sx-product-manager:product-status-toggled', handleProductStatusToggled as EventListener);

    return () => {
      window.removeEventListener('sx-product-manager:product-added', handleProductAdded as EventListener);
      window.removeEventListener('sx-product-manager:product-status-toggled', handleProductStatusToggled as EventListener);
    };
  }, []);

  return { metrics };
};
