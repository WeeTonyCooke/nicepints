import React from 'react';

export interface EditorialRatingBlockProps {
  /** 0–10 score. */
  score: number;
  /** `feed` (3rem) or `hero` (3.5rem). */
  size?: 'feed' | 'hero';
  style?: React.CSSProperties;
}

/**
 * Dominant editorial score — big Playfair numeral, gold rule, verdict word.
 * @startingPoint section="Brand" subtitle="Hero / feed editorial score" viewport="700x210"
 */
export function EditorialRatingBlock(props: EditorialRatingBlockProps): JSX.Element;
