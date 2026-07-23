import React from 'react';

export const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid-3">
        {items.map((_, i) => (
          <div key={i} className="material-card" style={{ height: '180px' }}>
            <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '12px' }} />
            <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '20px' }} />
            <div className="skeleton" style={{ height: '60px', width: '100%' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map((_, i) => (
        <div key={i} className="skeleton" style={{ height: '64px', width: '100%' }} />
      ))}
    </div>
  );
};
