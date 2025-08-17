import { useState, useEffect, useMemo } from 'react';
import { Product } from '../models/Product';

type Metrics = {
  total: number;
  active: number;
  inactive: number;
}

export const useProductMetrics = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const metrics = useMemo<Metrics>(() => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const inactive = products.filter(p => p.status === 'inactive').length;
    return { total, active, inactive };
  }, [products]);

  useEffect(() => {
    const handleProductAdded = (event: WindowEventMap['sx-product-manager:product-added']) => {
      const { product } = event.detail;
      if (product) {
        setProducts(prevProducts => [...prevProducts, product]);
      }
    };



    const handleProductStatusToggled = (event: WindowEventMap['sx-product-manager:product-status-toggled']) => {
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

    window.addEventListener('sx-product-manager:product-added', handleProductAdded);
    window.addEventListener('sx-product-manager:product-status-toggled', handleProductStatusToggled);

    return () => {
      window.removeEventListener('sx-product-manager:product-added', handleProductAdded);
      window.removeEventListener('sx-product-manager:product-status-toggled', handleProductStatusToggled);
    };
  }, []);

  return { metrics };
};
