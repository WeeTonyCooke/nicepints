import React from 'react';

/** Form text input / search field — graphite fill, line border, gold focus ring. */
export function Input({
  type = 'text',
  icon = null,
  fullWidth = true,
  style = {},
  ...rest
}) {
  const wrap = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: fullWidth ? '100%' : 'auto',
  };
  const field = {
    width: '100%',
    fontFamily: 'var(--font-sans)',
    fontSize: '16px', // 16px min prevents iOS zoom-on-focus
    color: 'var(--cream)',
    background: 'var(--graphite)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius-lg)',
    padding: icon ? '14px 16px 14px 42px' : '14px 16px',
    outline: 'none',
    transition: 'box-shadow var(--dur-base), border-color var(--dur-base)',
    ...style,
  };
  return (
    <span style={wrap}>
      {icon && (
        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex', pointerEvents: 'none' }}>
          {icon}
        </span>
      )}
      <input
        type={type}
        style={field}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,162,39,0.18)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}
        {...rest}
      />
    </span>
  );
}
