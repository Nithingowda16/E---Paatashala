import React from 'react';

export const EmptyState = ({ title, message, icon = 'inbox', actionText, onAction }) => {
  return (
    <div
      className="material-card"
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--text-muted)' }}>
        {icon}
      </span>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ color: 'var(--text-sub)', maxWidth: '400px', fontSize: '0.9rem' }}>{message}</p>
      {actionText && (
        <button className="btn btn-primary" onClick={onAction} style={{ marginTop: '8px' }}>
          {actionText}
        </button>
      )}
    </div>
  );
};
