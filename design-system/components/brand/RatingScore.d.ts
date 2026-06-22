import React from 'react';

export interface RatingScoreProps {
  /** 0–10 score. */
  score: number;
  size?: 'sm' | 'md' | 'lg';
  /** Append "/10". Default true. */
  showMax?: boolean;
  style?: React.CSSProperties;
}

/** Score band → CSS colour var (gold ≥9, amber ≥8, copper ≥7, else stone). */
export function ratingTone(score: number): string;

/** Compact rating pill over photos. Large hero numeral → EditorialRatingBlock. */
export function RatingScore(props: RatingScoreProps): JSX.Element;
