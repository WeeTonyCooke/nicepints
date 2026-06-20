type BrandWordmarkProps = {
  as?: 'h1' | 'h2' | 'p' | 'span';
  size?: 'header' | 'page' | 'compact' | 'display';
  className?: string;
};

const sizeClasses: Record<NonNullable<BrandWordmarkProps['size']>, string> = {
  header: 'font-display font-black text-xl tracking-tight leading-none text-cream',
  page: 'font-display font-black text-2xl tracking-tight text-cream',
  compact:
    'font-display font-black text-[9px] uppercase tracking-[0.18em] text-cream/30 leading-none',
  display: 'font-display font-black text-3xl tracking-tight text-cream',
};

const BrandWordmark = ({
  as: Tag = 'h1',
  size = 'header',
  className = '',
}: BrandWordmarkProps) => (
  <Tag className={`${sizeClasses[size]} ${className}`.trim()}>
    Nice <span className="text-gold/50">Pints</span>
  </Tag>
);

export default BrandWordmark;
