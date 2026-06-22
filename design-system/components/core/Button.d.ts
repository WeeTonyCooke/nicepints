import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` is gold and reserved for the one primary action per screen. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Padding / font scale. */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
  /** Optional leading icon (e.g. a Lucide <Plus />). */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Pill action button. Gold = primary (one per screen); secondary/ghost for the rest.
 * @startingPoint section="Core" subtitle="Pill action button — primary/secondary/ghost" viewport="700x150"
 */
export function Button(props: ButtonProps): JSX.Element;
