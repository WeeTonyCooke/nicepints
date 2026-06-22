import React from 'react';

export interface SectionLabelProps {
  /** Label text (rendered uppercase). */
  children: React.ReactNode;
  /** Optional right-aligned count, e.g. "12 pints". */
  count?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Uppercase tracked section divider with hairline rule + optional count. */
export function SectionLabel(props: SectionLabelProps): JSX.Element;
