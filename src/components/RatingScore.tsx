import { formatPintScoreWithMax } from '../data';
import { ratingPillClass } from '../utils/ratingColor';

/** Matches Top pint badge padding in HomeFeed hero overlay. */
export const RATING_PILL_CLASS = 'px-2.5 py-1 rounded-md';

type RatingScoreProps = {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'dominant' | 'display';
  className?: string;
};

const sizeClasses = {
  sm: 'text-[10px] font-bold',
  md: 'text-sm font-bold',
  lg: 'text-2xl font-black',
  hero: 'text-base font-black min-w-[6.25rem] justify-center',
  dominant: 'text-4xl font-black',
  display: 'text-5xl font-black',
};

const RatingScore = ({ score, size = 'md', className = '' }: RatingScoreProps) => {
  return (
    <span
      className={`inline-flex items-center tabular-nums leading-none ${ratingPillClass(score)} ${RATING_PILL_CLASS} ${sizeClasses[size]} ${className}`.trim()}
    >
      {formatPintScoreWithMax(score)}
    </span>
  );
};

export default RatingScore;
