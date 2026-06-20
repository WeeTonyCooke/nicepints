type LoadErrorProps = {
  message: string;
  onRetry?: () => void;
};

const LoadError = ({ message, onRetry }: LoadErrorProps) => (
  <div className="max-w-md mx-auto px-6 pt-20 text-center text-cream">
    <p className="text-5xl mb-4">🍺</p>
    <p className="text-cream/60 text-sm mb-2">{message}</p>
    <p className="text-cream/30 text-xs mb-6">Check your connection and try again.</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="bg-cream text-stout px-5 py-3 rounded-2xl text-sm font-black active:scale-95 transition-transform"
      >
        Retry
      </button>
    )}
  </div>
);

export default LoadError;
