import PintSilhouetteIcon from './PintSilhouetteIcon';

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

const BrandWordmark = ({
  as: Tag = 'h1',
  size = 'header',
  className = '',
  showIcon,
}: BrandWordmarkProps) => {
  const withIcon = showIcon ?? size === 'header';

  return (
    <Tag
      className={`${sizeClasses[size]} ${withIcon ? 'inline-flex items-center gap-2.5' : ''} ${className}`.trim()}
    >
      {withIcon && <PintSilhouetteIcon className="w-[26px] h-[42px]" />}
      <span>
        Nice <span className="text-gold italic">Pints</span>
      </span>
    </Tag>
  );
};

export default BrandWordmark;
