import React from 'react';
import { MetricCard } from './MetricCard';
import { useProductMetrics } from '../hooks/useProductMetrics';
import { TestId } from '../lib/TestId';

export const Dashboard: React.FC = () => {
  const { metrics } = useProductMetrics();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 p-6" data-testid={TestId.DASHBOARD}>
      <MetricCard
        title="Total Products"
        value={metrics.total}
        color="bg-blue-50"
        icon="📦"
        data-testid={TestId.TOTAL_PRODUCTS_METRIC}
      />
      <MetricCard
        title="Active Products"
        value={metrics.active}
        color="bg-green-50"
        icon="✅"
        data-testid={TestId.ACTIVE_PRODUCTS_METRIC}
      />
      <MetricCard
        title="Inactive Products"
        value={metrics.inactive}
        color="bg-orange-50"
        icon="⏸️"
        data-testid={TestId.INACTIVE_PRODUCTS_METRIC}
      />
    </div>
  );
};
