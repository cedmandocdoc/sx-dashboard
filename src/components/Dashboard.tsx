import React from 'react';
import { MetricCard } from './MetricCard';
import { useProductMetrics } from '../hooks/useProductMetrics';

export const Dashboard: React.FC = () => {
  const { metrics } = useProductMetrics();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 p-6">
      <MetricCard
        title="Total Products"
        value={metrics.total}
        color="bg-blue-50"
        icon="📦"
      />
      <MetricCard
        title="Active Products"
        value={metrics.active}
        color="bg-green-50"
        icon="✅"
      />
      <MetricCard
        title="Inactive Products"
        value={metrics.inactive}
        color="bg-orange-50"
        icon="⏸️"
      />
    </div>
  );
};
