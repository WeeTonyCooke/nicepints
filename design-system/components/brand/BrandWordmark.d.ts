import React from 'react';

export interface BrandWordmarkProps {
  /** Size preset. `compact` renders the uppercase muted eyebrow form. */
  size?: 'header' | 'page' | 'display' | 'compact';
  /** Force the pint mark on/off. Defaults on for `header`. */
  showIcon?: boolean;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

export interface PintMarkProps {
  /** Width in px (height scales to the 100:160 glass ratio). */
  size?: number;
  style?: React.CSSProperties;
}

/** The inlined pint-glass mark — cream head, warm-black body, white settle line. */
export function PintMark(props: PintMarkProps): JSX.Element;

/**
 * Nice Pints wordmark — Playfair black, "Pints" gold italic, optional pint mark.
 * @startingPoint section="Brand" subtitle="Wordmark + pint mark lockup" viewport="700x160"
 */
export function BrandWordmark(props: BrandWordmarkProps): JSX.Element;
