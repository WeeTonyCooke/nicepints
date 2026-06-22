import React from 'react';

export interface TagProps {
  children: React.ReactNode;
  /** Colour tone. Default `neutral`. */
  tone?: 'neutral' | 'cream' | 'gold' | 'sage' | 'rust';
  /** Pill (true) vs chip radius (false). Default true. */
  pill?: boolean;
  style?: React.CSSProperties;
}

/** Small uppercase status / meta tag. For drink categories use DrinkChip. */
export function Tag(props: TagProps): JSX.Element;
