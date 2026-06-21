import { formatPintScoreWithMax } from '../data';
import { ratingPillClass } from '../utils/ratingColor';

export const RATING_PILL_CLASS = 'rounded-full';

type RatingScoreProps = {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'card' | 'dominant' | 'display';
  className?: string;
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px] font-bold',
  md: 'px-2.5 py-1 text-xs font-bold',
  lg: 'px-3 py-1.5 text-lg font-black',
  hero: 'px-3.5 py-1 text-sm font-black',
  card: 'px-2.5 py-1 text-xs font-black',
  dominant: 'px-3 py-1.5 text-sm font-black',
  display: 'px-4 py-2 text-4xl font-black',
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
