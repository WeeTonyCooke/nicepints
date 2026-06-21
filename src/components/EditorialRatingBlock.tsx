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
  feed: 'w-[86%]',
  hero: 'w-[88%]',
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
      <div className="inline-block max-w-full">
        <div
          className={`font-display font-bold leading-none tracking-[-0.03em] text-np-cream [text-shadow:0_2px_12px_rgba(0,0,0,0.72)] ${mainSizeClasses[size]}`}
          aria-label={`${score.toFixed(1)} out of 10`}
        >
          <span className="whitespace-nowrap">
            {whole}
            <span className="text-[0.34em] font-bold [vertical-align:0.2em] -ml-[0.03em]">
              {fraction}
            </span>
          </span>
        </div>

        <span
          className={`block h-px bg-np-gold mt-1.5 ml-auto ${ruleWidthClasses[size]}`}
          aria-hidden="true"
        />
      </div>

      {verdict && (
        <p className="font-ui text-[13px] font-medium text-np-cream mt-4 tracking-[0.01em] [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">
          {verdict}
        </p>
      )}
    </div>
  );
};

export default EditorialRatingBlock;
