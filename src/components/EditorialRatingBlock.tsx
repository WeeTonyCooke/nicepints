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

const ruleWidthClasses = {
  feed: 'w-14',
  hero: 'w-16',
};

const EditorialRatingBlock = ({
  score,
  size = 'feed',
  className = '',
}: EditorialRatingBlockProps) => {
  const { whole, fraction } = splitEditorialScore(score);
  const verdict = scoreVerdictLabel(score);

  return (
    <div className={`inline-flex flex-col items-end text-right ${className}`.trim()}>
      <div
        className={`inline-flex items-start font-display font-bold leading-none tracking-[-0.04em] text-cream [text-shadow:0_2px_12px_rgba(0,0,0,0.72)] ${mainSizeClasses[size]}`}
        aria-label={`${score.toFixed(1)} out of 10`}
      >
        <span>{whole}</span>
        <span className="text-[0.38em] leading-none -ml-[0.08em] mt-[0.14em]">{fraction}</span>
      </div>

      <span
        className={`block h-px bg-gold mt-1.5 ${ruleWidthClasses[size]}`}
        aria-hidden="true"
      />

      {verdict && (
        <p className="font-sans text-sm font-medium text-cream mt-3.5 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">
          {verdict}
        </p>
      )}
    </div>
  );
};

export default EditorialRatingBlock;
