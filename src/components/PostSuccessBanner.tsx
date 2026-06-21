type PostSuccessBannerProps = {
  visible: boolean;
  onDismiss: () => void;
};

const PostSuccessBanner = ({ visible, onDismiss }: PostSuccessBannerProps) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="mx-5 mb-4 rounded-xl border border-line bg-graphite px-4 py-3 text-sm text-cream text-center flex items-center justify-between gap-3"
      role="status"
      aria-live="polite"
    >
      <span className="flex-1">Pint logged</span>
      <button
        type="button"
        onClick={onDismiss}
        className="text-muted text-xs font-semibold uppercase tracking-wider shrink-0"
      >
        Dismiss
      </button>
    </div>
  );
};

export default PostSuccessBanner;
