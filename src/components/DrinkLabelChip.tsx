import { formatPourLabel, type Pint } from '../data';
import { drinkAccentClasses } from '../utils/drinkAccent';

type DrinkLabelChipProps = {
  pint: Pick<Pint, 'pintType' | 'servingType' | 'productSlug' | 'productName'>;
  className?: string;
};

const DrinkLabelChip = ({ pint, className = '' }: DrinkLabelChipProps) => (
  <span
    className={`inline-block bg-graphite border border-line py-1 pl-[9px] pr-[9px] rounded-[var(--radius-chip)] text-[10px] font-semibold uppercase leading-none tracking-[0.08em] ${drinkAccentClasses(pint.productSlug)} ${className}`.trim()}
  >
    {formatPourLabel(pint)}
  </span>
);

export default DrinkLabelChip;
