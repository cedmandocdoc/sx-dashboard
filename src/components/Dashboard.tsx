import React from 'react';
import { MetricCard } from './MetricCard';
import { useProductMetrics } from '../hooks/useProductMetrics';

export const Dashboard: React.FC = () => {
  const { metrics, isLoading, error } = useProductMetrics();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        margin: '24px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '18px', 
            color: '#6c757d',
            marginBottom: '8px'
          }}>
            Loading metrics...
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#868e96'
          }}>
            Connecting to Product Manager
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        backgroundColor: '#f8d7da',
        borderRadius: '12px',
        margin: '24px',
        border: '1px solid #f5c6cb',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '18px', 
            color: '#721c24',
            marginBottom: '8px'
          }}>
            {error}
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#856404'
          }}>
            Make sure the Product Manager microfrontend is loaded and responding
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      padding: '24px',
    }}>
      <MetricCard
        title="Total Products"
        value={metrics.total}
        color="#e3f2fd"
        icon="📦"
      />
      <MetricCard
        title="Active Products"
        value={metrics.active}
        color="#e8f5e8"
        icon="✅"
      />
      <MetricCard
        title="Inactive Products"
        value={metrics.inactive}
        color="#fff3e0"
        icon="⏸️"
      />
    </div>
  );
};
