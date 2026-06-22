import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Element tag to render. Default `div`. */
  as?: keyof JSX.IntrinsicElements;
  /** Adds press-scale feedback + pointer cursor. */
  interactive?: boolean;
  /** Overlay the subtle grain texture (use on dark surfaces / photos). */
  noise?: boolean;
  /** CSS padding. Default `16px`. */
  padding?: string;
  /** CSS border-radius. Default `var(--radius-lg)`. */
  radius?: string;
  children?: React.ReactNode;
}

/**
 * Graphite surface card with 1px line border and soft shadow.
 * @startingPoint section="Core" subtitle="Graphite surface card on stout" viewport="700x200"
 */
export function Card(props: CardProps): JSX.Element;
