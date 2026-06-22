import React from 'react';

/**
 * Surface card — graphite on stout with a 1px line border so it lifts off
 * the page. `photo` mode is the feed card: 4:5 image with light scrim,
 * children render over the bottom of the image.
 */
export function Card({
  children,
  as: Tag = 'div',
  interactive = false,
  noise = false,
  padding = '16px',
  radius = 'var(--radius-lg)',
  style = {},
  onClick,
  ...rest
}) {
  const base = {
    background: 'var(--graphite)',
    border: '1px solid var(--line)',
    borderRadius: radius,
    padding,
    color: 'var(--cream)',
    boxShadow: 'var(--shadow-card)',
    transition: 'transform var(--dur-fast) var(--ease-standard)',
    cursor: interactive ? 'pointer' : 'default',
    ...style,
  };

  const press = interactive
    ? {
        onMouseDown: (e) => { e.currentTarget.style.transform = 'scale(0.985)'; },
        onMouseUp: (e) => { e.currentTarget.style.transform = 'scale(1)'; },
        onMouseLeave: (e) => { e.currentTarget.style.transform = 'scale(1)'; },
      }
    : {};

  return (
    <Tag
      className={noise ? 'np-noise' : undefined}
      style={base}
      onClick={onClick}
      {...press}
      {...rest}
    >
      {children}
    </Tag>
  );
}
