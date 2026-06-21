import { formatPintScore, MAX_PINT_SCORE } from '../data';
import { ratingChipClass, ratingTextClass } from '../utils/ratingColor';

type RatingScoreProps = {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showMax?: boolean;
  chip?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: 'text-sm font-bold',
  md: 'text-lg font-bold',
  lg: 'text-2xl font-bold',
  hero: 'text-2xl font-bold',
};

const maxSizeClasses = {
  sm: 'text-[9px] font-medium',
  md: 'text-[10px] font-medium',
  lg: 'text-xs font-medium',
  hero: 'text-sm font-normal',
};

const RatingScore = ({
  score,
  size = 'md',
  showMax = false,
  chip = false,
  className = '',
}: RatingScoreProps) => {
  const toneClass = chip ? ratingChipClass(score) : ratingTextClass(score);
  const chipPadding = chip ? 'px-2 py-0.5 rounded-md' : '';

  return (
    <span className={`inline-flex items-baseline gap-0.5 ${toneClass} ${chipPadding} ${className}`.trim()}>
      <span className={sizeClasses[size]}>{formatPintScore(score)}</span>
      {showMax && (
        <span className={`${maxSizeClasses[size]} text-muted`}>/{MAX_PINT_SCORE}</span>
      )}
    </span>
  );
};

export default RatingScore;
