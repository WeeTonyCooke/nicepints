type BrandWordmarkProps = {
  as?: 'h1' | 'h2' | 'p' | 'span';
  size?: 'header' | 'page' | 'compact' | 'display';
  className?: string;
  showIcon?: boolean;
};

const sizeClasses: Record<NonNullable<BrandWordmarkProps['size']>, string> = {
  header: 'font-display font-black text-xl tracking-tight leading-none text-cream',
  page: 'font-display font-black text-2xl tracking-tight text-cream',
  compact:
    'font-sans font-semibold text-[11px] uppercase tracking-[0.18em] text-muted leading-none',
  display: 'font-display font-black text-3xl tracking-tight text-cream',
};

const BrandAppIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
    aria-hidden
  >
    <rect width="32" height="32" rx="6" fill="#13110F" />
    <path
      d="M10.5 12.25 L12.25 26.75 Q16 28.25 19.75 26.75 L21.5 12.25 Q16 10.5 10.5 12.25 Z"
      fill="#1E1B17"
    />
    <ellipse cx="16" cy="10.5" rx="5.75" ry="3.25" fill="#F3EFE6" />
  </svg>
);

const BrandWordmark = ({
  as: Tag = 'h1',
  size = 'header',
  className = '',
  showIcon,
}: BrandWordmarkProps) => {
  const withIcon = showIcon ?? size === 'header';

  return (
    <Tag
      className={`${sizeClasses[size]} ${withIcon ? 'inline-flex items-center gap-2' : ''} ${className}`.trim()}
    >
      {withIcon && <BrandAppIcon className="w-6 h-6" />}
      <span>
        Nice <span className="text-gold italic">Pints</span>
      </span>
    </Tag>
  );
};

export default BrandWordmark;
