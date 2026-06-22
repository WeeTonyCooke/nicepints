import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional leading icon (e.g. Lucide <Search />). */
  icon?: React.ReactNode;
  /** Fill container width. Default true. */
  fullWidth?: boolean;
}

/** Text / search input — graphite fill, gold focus ring, 16px to avoid iOS zoom. */
export function Input(props: InputProps): JSX.Element;
