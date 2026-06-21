const TopPintBadge = ({ className = '' }: { className?: string }) => (
  <span
    className={`text-gold border border-gold bg-gold-soft/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shrink-0 ${className}`.trim()}
  >
    Top pint
  </span>
);

export default TopPintBadge;
