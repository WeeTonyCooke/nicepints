import React from 'react';

export interface DrinkChipProps {
  /** Product slug — drives the accent colour. */
  slug?: 'guinness' | 'guinness-00' | 'beamish' | 'murphys' | 'other';
  /** Chip label, e.g. "Guinness 0.0 · Draught". */
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/** Drink-category chip — the only home of the drink-type accent system. */
export function DrinkChip(props: DrinkChipProps): JSX.Element;
