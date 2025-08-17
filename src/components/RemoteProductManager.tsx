import React, { Suspense } from 'react';

// @ts-ignore - Remote module
const ProductManager = React.lazy(() => import('productManager/ProductManager'));

export const RemoteProductManager: React.FC = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e9ecef',
      overflow: 'hidden',
    }}>
      <Suspense 
        fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            backgroundColor: '#f8f9fa',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '18px', 
                color: '#6c757d',
                marginBottom: '8px'
              }}>
                Loading Product Manager...
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#868e96'
              }}>
                Fetching remote module
              </div>
            </div>
          </div>
        }
      >
        <ProductManager />
      </Suspense>
    </div>
  );
};
