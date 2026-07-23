import React from 'react';

export const Logo = ({ size = 34 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(26,115,232,0.25))' }}
    >
      <defs>
        <linearGradient id="epaataGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a73e8" />
          <stop offset="100%" stopColor="#34a853" />
        </linearGradient>
        <linearGradient id="epaataGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a142f4" />
          <stop offset="100%" stopColor="#1a73e8" />
        </linearGradient>
      </defs>

      {/* Outer Rounded Shield / Frame */}
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#epaataGrad1)" />

      {/* Inner Card Background */}
      <rect x="5" y="5" width="38" height="38" rx="9" fill="#ffffff" fillOpacity="0.15" />

      {/* Graduation Cap / Book Symbol */}
      <path
        d="M24 12L38 19L24 26L10 19L24 12Z"
        fill="#ffffff"
      />
      <path
        d="M14 22.5V30C14 32.5 18.5 35 24 35C29.5 35 34 32.5 34 30V22.5"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M37 20.5V29.5"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="37" cy="30.5" r="1.5" fill="#fbbc04" />

      {/* Smart Sparkle Badge */}
      <path
        d="M24 6L25.5 9.5L29 11L25.5 12.5L24 16L22.5 12.5L19 11L22.5 9.5L24 6Z"
        fill="#fbbc04"
      />
    </svg>
  );
};
