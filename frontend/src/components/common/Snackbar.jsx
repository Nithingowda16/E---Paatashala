import React, { useContext } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Snackbar = () => {
  const { toast } = useContext(NotificationContext);

  if (!toast) return null;

  const icon = toast.type === 'success' ? <CheckCircle2 size={18} color="#34a853" /> : toast.type === 'error' ? <AlertCircle size={18} color="#ea4335" /> : <Info size={18} color="#1a73e8" />;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--text-main)',
        color: 'var(--bg-card)',
        padding: '12px 24px',
        borderRadius: 'var(--radius-pill)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.9rem',
        fontWeight: 500,
        boxShadow: 'var(--shadow-md)',
        zIndex: 2000,
        animation: 'fadeInUp 0.3s ease-out',
      }}
    >
      {icon}
      <span>{toast.message}</span>
    </div>
  );
};
