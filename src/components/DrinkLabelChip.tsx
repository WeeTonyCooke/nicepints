import { formatPourLabel, type Pint } from '../data';
import { drinkAccentClasses } from '../utils/drinkAccent';

type DrinkLabelChipProps = {
  pint: Pick<Pint, 'pintType' | 'servingType' | 'productSlug' | 'productName'>;
  className?: string;
};

const DrinkLabelChip = ({ pint, className = '' }: DrinkLabelChipProps) => (
  <span
    className={`inline-block bg-graphite border border-line pl-2 pr-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${drinkAccentClasses(pint.productSlug)} ${className}`.trim()}
  >
    {formatPourLabel(pint)}
  </span>
);

export default DrinkLabelChip;
