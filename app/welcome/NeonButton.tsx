// NeonButton.tsx
import React from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  size = 'large'
}) => {
  const sizeStyles = {
    small: { padding: '8px 16px', fontSize: '12px' },
    medium: { padding: '12px 24px', fontSize: '14px' },
    large: { padding: '16px 32px', fontSize: '16px' }
  };

  const buttonStyle: React.CSSProperties = {
    background: '#1a1a2e',
    border: '2px solid #8a2be2',
    color: disabled ? '#666' : '#ffffff',
    ...sizeStyles[size],
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    boxShadow: disabled 
      ? 'none' 
      : '0 0 10px #00f5ff, inset 0 0 10px rgba(0, 245, 255, 0.1)',
    transition: 'all 0.1s',
    imageRendering: 'pixelated',
    opacity: disabled ? 0.5 : 1,
    ...(!disabled && {
      ':hover': {
        background: 'rgba(0, 245, 255, 0.1)',
        boxShadow: '0 0 20px #8a2be2, inset 0 0 20px rgba(0, 245, 255, 0.2)',
        textShadow: '0 0 10px #8a2be2'
      },
      ':active': {
        transform: 'scale(0.98)'
      }
    })
  };

  return (
    <button 
      style={buttonStyle}
      className={`neon-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = 'rgba(0, 245, 255, 0.1)';
          e.currentTarget.style.boxShadow = '0 0 20px #8a2be2, inset 0 0 20px rgba(0, 245, 255, 0.2)';
          e.currentTarget.style.textShadow = '0 0 10px #8a2be2';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = '#1a1a2e';
          e.currentTarget.style.boxShadow = '0 0 10px #8a2be2, inset 0 0 10px rgba(0, 245, 255, 0.1)';
          e.currentTarget.style.textShadow = 'none';
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      {children}
    </button>
  );
};

export default NeonButton;