import { scoreVerdictLabel, splitEditorialScore } from '../utils/scoreVerdict';

type EditorialRatingBlockProps = {
  score: number;
  size?: 'feed' | 'hero';
  className?: string;
};

const mainSizeClasses = {
  feed: 'text-[3rem]',
  hero: 'text-[3.5rem]',
};

const fractionSizeClasses = {
  feed: 'text-[1.75rem]',
  hero: 'text-[2rem]',
};

const EditorialRatingBlock = ({
  score,
  size = 'feed',
  className = '',
}: EditorialRatingBlockProps) => {
  const { whole, fraction } = splitEditorialScore(score);
  const verdict = scoreVerdictLabel(score);

  return (
    <div className={`flex flex-col items-end text-right ${className}`.trim()}>
      <div
        className={`inline-flex items-baseline font-display font-bold leading-none tracking-[-0.04em] text-cream [text-shadow:0_2px_12px_rgba(0,0,0,0.72)] ${mainSizeClasses[size]}`}
        aria-label={`${score.toFixed(1)} out of 10`}
      >
        <span>{whole}</span>
        <span className={`${fractionSizeClasses[size]} leading-none`}>{fraction}</span>
      </div>

      <span className="block w-20 h-px bg-gold mt-1.5" aria-hidden="true" />

      {verdict && (
        <p className="font-sans text-base font-medium text-cream mt-2.5 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">
          {verdict}
        </p>
      )}
    </div>
  );
};

export default EditorialRatingBlock;
