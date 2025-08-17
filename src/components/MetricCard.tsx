import React from 'react';

type MetricCardProps = {
  title: string;
  value: number;
  color: string;
  icon: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, color, icon }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e9ecef',
      transition: 'transform 0.2s ease-in-out',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}>
          {icon}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#212529',
            lineHeight: '1',
          }}>
            {value}
          </div>
        </div>
      </div>
      <div style={{
        fontSize: '16px',
        fontWeight: '500',
        color: '#495057',
      }}>
        {title}
      </div>
    </div>
  );
};
