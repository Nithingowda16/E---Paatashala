import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export const Logo = ({ size = 36, showOnlineBadge = true, className = '' }) => {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext ? themeContext.theme : 'light';

  // Toggle between transparent light mode logo and transparent dark mode logo
  const logoSrc = theme === 'dark' ? '/nxtwave-logo-dark.png' : '/nxtwave-logo-light.png';

  return (
    <div className={`nxtwave-logo-wrapper ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <img
        src={logoSrc}
        alt="NxtWave Online Logo"
        style={{
          height: typeof size === 'number' ? `${size}px` : size,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          transition: 'all 0.3s ease',
          filter: 'none',
        }}
      />
      {showOnlineBadge && (
        <span
          style={{
            fontSize: typeof size === 'number' ? `${Math.max(10, Math.round(size * 0.28))}px` : '0.75rem',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '2px 8px',
            borderRadius: '6px',
            background: '#007AFF',
            color: '#ffffff',
            boxShadow: 'none',
            userSelect: 'none',
            display: 'inline-block',
          }}
        >
          ONLINE
        </span>
      )}
    </div>
  );
};
