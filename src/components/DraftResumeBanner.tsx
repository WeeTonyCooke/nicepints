type DraftResumeBannerProps = {
  onResume: () => void;
  onStartFresh: () => void;
};

const DraftResumeBanner = ({ onResume, onStartFresh }: DraftResumeBannerProps) => (
  <div
    className="mb-6 rounded-2xl border border-gold/25 bg-gold/10 px-4 py-4"
    role="region"
    aria-label="Draft pint in progress"
  >
    <p className="text-sm font-bold text-gold mb-1">Pint in progress</p>
    <p className="text-sm text-cream/70 leading-relaxed mb-4">
      Pick up where you left off, or start a fresh log.
    </p>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onResume}
        className="flex-1 py-3 rounded-xl font-bold text-sm bg-gold text-stout active:scale-95 transition-transform"
      >
        Continue logging
      </button>
      <button
        type="button"
        onClick={onStartFresh}
        className="flex-1 py-3 rounded-xl font-bold text-sm bg-graphite text-cream border border-line active:scale-95 transition-transform"
      >
        Start fresh
      </button>
    </div>
  </div>
);

export default DraftResumeBanner;
