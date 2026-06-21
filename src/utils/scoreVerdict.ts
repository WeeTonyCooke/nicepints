export function splitEditorialScore(score: number): { whole: string; fraction: string } {
  const formatted = score.toFixed(1);
  const dotIndex = formatted.indexOf('.');

  return {
    whole: formatted.slice(0, dotIndex),
    fraction: formatted.slice(dotIndex),
  };
}

export function scoreVerdictLabel(score: number): string | null {
  if (score >= 9) return 'Exceptional';
  if (score >= 8.5) return 'Excellent';
  if (score >= 7.5) return 'Very Good';
  if (score >= 6.5) return 'Good';
  return null;
}
