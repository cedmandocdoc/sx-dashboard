import React from 'react';
import { MetricCard } from './MetricCard';
import { useProductMetrics } from '../hooks/useProductMetrics';

export const Dashboard: React.FC = () => {
  const { metrics } = useProductMetrics();

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
