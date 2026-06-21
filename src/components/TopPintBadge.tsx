const TopPintBadge = ({ className = '' }: { className?: string }) => (
  <span
    className={`text-gold border border-gold/80 bg-black/45 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm shrink-0 shadow-sm ${className}`.trim()}
  >
    Top pint
  </span>
);

export default TopPintBadge;
