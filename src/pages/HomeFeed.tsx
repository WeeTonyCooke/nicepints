import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchLivePints, formatPourLabel, isStockPhotoUrl, type Pint } from '../data';
import LoadError from '../components/LoadError';
import EmptyState from '../components/EmptyState';
import PostSuccessBanner from '../components/PostSuccessBanner';
import BrandWordmark from '../components/BrandWordmark';
import RatingScore from '../components/RatingScore';
import { useAuth } from '../Context/AuthContext';
import { formatAuthorName } from '../utils/user';

const FLAG: Record<string, string> = {
  Ireland: '🇮🇪',
  USA: '🇺🇸',
  UK: '🇬🇧',
  Germany: '🇩🇪',
  France: '🇫🇷',
};

function pickHeroPint(pints: Pint[]): Pint {
  const withRealPhotos = pints.filter((pint) => !isStockPhotoUrl(pint.photo));
  const pool = withRealPhotos.length > 0 ? withRealPhotos : pints;
  return [...pool].sort((a, b) => b.rating - a.rating)[0];
}

const Hero = ({ pint, onClick }: { pint: Pint; onClick: () => void }) => (
  <section
    className="noise relative w-full aspect-[4/5] overflow-hidden cursor-pointer active:opacity-95 transition-opacity"
    onClick={onClick}
  >
    <img
      src={pint.photo}
      className="w-full h-full object-cover"
      alt={pint.pubName}
    />

    <div className="absolute inset-0 photo-scrim-base" />
    <div className="absolute inset-0 photo-scrim-gradient" />

    <div className="absolute top-5 left-5">
      <span className="text-gold border border-gold bg-gold-soft/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md">
        Top pour
      </span>
    </div>

    <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">{FLAG[pint.country] ?? '🍺'}</span>
        <span className="text-xs text-muted font-medium tracking-wide">{pint.location}</span>
        <span className="text-line">·</span>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-muted">
          {formatPourLabel(pint)}
        </span>
      </div>

      <h2 className="font-display text-4xl font-black leading-[1.1] mb-3 text-cream">
        {pint.pubName}
      </h2>

      {pint.note && (
        <p className="text-cream/80 text-base leading-snug mb-4">
          "{pint.note}"
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-elevated border border-line flex items-center justify-center">
            <span className="text-[9px] font-bold text-cream">
              {pint.user.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-muted font-medium">{formatAuthorName(pint.user)}</span>
        </div>
        <RatingScore score={pint.rating} size="hero" showMax chip />
      </div>
    </div>
  </section>
);

const FeedCard = ({ pint, onClick }: { pint: Pint; onClick: () => void }) => (
  <article
    className="feed-card cursor-pointer active:scale-[0.985] transition-transform"
    onClick={onClick}
  >
    <div className="noise relative aspect-[4/5] rounded-2xl overflow-hidden bg-graphite border border-line mb-3">
      <img
        src={pint.photo}
        className="w-full h-full object-cover"
        alt={pint.pubName}
      />

      <div className="absolute inset-0 photo-scrim-base" />
      <div className="absolute inset-0 photo-scrim-gradient" />

      <div className="absolute top-3.5 right-3.5">
        <RatingScore score={pint.rating} size="sm" showMax chip />
      </div>

      <div className="absolute bottom-3.5 left-3.5 right-16 flex items-center gap-1.5">
        <span className="text-sm leading-none">{FLAG[pint.country] ?? '🍺'}</span>
        <span className="text-[10px] text-cream/70 font-medium truncate">
          {pint.location}
        </span>
      </div>
    </div>

    <div className="px-0.5">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-sans font-bold text-lg leading-tight text-cream">{pint.pubName}</h3>
        <span className="text-[10px] font-medium text-muted mt-1 shrink-0">
          {pint.time}
        </span>
      </div>

      <span className="inline-block bg-graphite border border-line text-muted px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-2">
        {formatPourLabel(pint)}
      </span>

      {pint.note && (
        <p className="text-muted text-sm leading-snug line-clamp-2 mb-2">
          "{pint.note}"
        </p>
      )}

      <p className="text-[10px] text-muted font-medium">{formatAuthorName(pint.user)}</p>
    </div>
  </article>
);

const AppHeader = () => {
  const navigate = useNavigate();
  const { displayName } = useAuth();
  const initials = (displayName ?? 'NP').slice(0, 2).toUpperCase();

  return (
    <div className="px-5 pt-safe-header pb-4 flex items-center justify-between gap-3">
      <BrandWordmark size="header" />
      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="w-7 h-7 shrink-0 rounded-full bg-elevated border border-line flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Open profile"
      >
        <span className="text-[10px] font-bold text-muted">{initials}</span>
      </button>
    </div>
  );
};

const HomeFeed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pints, setPints] = useState<Pint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showLoggedBanner, setShowLoggedBanner] = useState(
    () => (location.state as { pintLogged?: boolean } | null)?.pintLogged === true
  );

  useEffect(() => {
    if (!(location.state as { pintLogged?: boolean } | null)?.pintLogged) {
      return;
    }

    window.history.replaceState({}, document.title);
    setShowLoggedBanner(true);

    const timer = window.setTimeout(() => {
      setShowLoggedBanner(false);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [location.state]);

  const loadPints = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const livePints = await fetchLivePints();
      setPints(livePints);
    } catch (error) {
      console.error('Failed to load pints:', error);
      setPints([]);
      const message = error instanceof Error ? error.message : 'Could not load the feed.';
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPints();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center">
        <p className="text-muted text-base">Pouring pints...</p>
      </div>
    );
  }

  if (loadError) {
    return <LoadError message={loadError} onRetry={loadPints} />;
  }

  if (pints.length === 0) {
    return (
      <div className="max-w-md mx-auto">
        <AppHeader />
        <div className="px-5 pt-8 pb-safe-feed">
          <EmptyState
            title="No pints yet"
            description="Be the first to log a pour — or find one on the map."
            actionLabel="Log a pint"
            onAction={() => navigate('/add')}
            secondaryLabel="Find a pour"
            onSecondary={() => navigate('/map')}
          />
        </div>
      </div>
    );
  }

  const hero = pickHeroPint(pints);
  const feed = pints.filter((pint) => pint.id !== hero.id);

  return (
    <div className="max-w-md mx-auto">
      <AppHeader />
      <PostSuccessBanner
        visible={showLoggedBanner}
        onDismiss={() => setShowLoggedBanner(false)}
      />

      <Hero pint={hero} onClick={() => navigate(`/pint/${hero.id}`)} />

      <div className="px-5 pt-8 pb-5 flex items-center gap-3">
        <span className="text-[11px] uppercase font-semibold tracking-wider text-muted">
          Latest
        </span>
        <div className="flex-1 h-px bg-line" />
        <span className="text-[10px] text-muted font-medium">{feed.length} pints</span>
      </div>

      <div className="px-4 grid grid-cols-2 gap-x-3 gap-y-8 pb-safe-feed">
        {feed.map((pint) => (
          <FeedCard
            key={pint.id}
            pint={pint}
            onClick={() => navigate(`/pint/${pint.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeFeed;
