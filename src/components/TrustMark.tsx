type TrustMarkProps = {
  className?: string;
};

const TrustMark = ({ className = '' }: TrustMarkProps) => (
  <span
    className={`inline-block w-1.5 h-1.5 rounded-full bg-sage shrink-0 ${className}`.trim()}
    aria-hidden="true"
  />
);

export default TrustMark;
