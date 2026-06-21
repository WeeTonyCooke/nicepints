type FoundingTasterMarkProps = {
  className?: string;
};

const FoundingTasterMark = ({ className = '' }: FoundingTasterMarkProps) => (
  <span
    className={`inline-block w-1.5 h-1.5 rounded-full border border-cream shrink-0 ${className}`.trim()}
    aria-hidden="true"
  />
);

export default FoundingTasterMark;
