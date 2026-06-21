type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
};

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  className = '',
}: EmptyStateProps) => (
  <div className={`rounded-2xl border border-line bg-graphite p-8 text-center ${className}`}>
    <p className="text-4xl mb-4 opacity-40" aria-hidden="true">
      🍺
    </p>
    <p className="font-display font-bold text-lg text-cream mb-2">{title}</p>
    {description && (
      <p className="text-sm text-muted leading-relaxed mb-6 max-w-[18rem] mx-auto">{description}</p>
    )}
    <button
      type="button"
      onClick={onAction}
      className="w-full max-w-[220px] bg-gold text-stout py-3.5 rounded-2xl font-bold text-sm active:scale-95 transition-transform mx-auto block"
    >
      {actionLabel}
    </button>
    {secondaryLabel && onSecondary && (
      <button
        type="button"
        onClick={onSecondary}
        className="mt-3 text-sm font-semibold text-gold active:opacity-80"
      >
        {secondaryLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
