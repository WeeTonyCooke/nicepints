import React from 'react';

const SIZES = {
  sm: { padding: '8px 14px', fontSize: '12px' },
  md: { padding: '12px 20px', fontSize: '14px' },
  lg: { padding: '16px 24px', fontSize: '15px' },
};

/**
 * Nice Pints primary action button. Gold is reserved for the one primary
 * action per screen (Rams #1); use `secondary` / `ghost` for everything else.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon = null,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    lineHeight: 1,
    border: '1px solid transparent',
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    transition: 'transform var(--dur-fast) var(--ease-standard), background var(--dur-base), color var(--dur-base)',
    WebkitTapHighlightColor: 'transparent',
    ...SIZES[size],
  };

  const variants = {
    primary: {
      background: 'var(--gold)',
      color: 'var(--action-on)',
      borderColor: 'var(--gold)',
    },
    secondary: {
      background: 'var(--graphite)',
      color: 'var(--cream)',
      borderColor: 'var(--line)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--muted)',
      borderColor: 'transparent',
    },
    danger: {
      background: 'transparent',
      color: 'var(--rust)',
      borderColor: 'var(--line)',
    },
  };

  const opacity = disabled ? 0.45 : 1;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...variants[variant], opacity, ...style }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
