import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLivePints, formatPintScore, formatPourLabel, isStockPhotoUrl, MAX_PINT_SCORE, type Pint } from '../data';
import LoadError from '../components/LoadError';
import BrandWordmark from '../components/BrandWordmark';
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

    <div className="absolute inset-0 bg-gradient-to-t from-stout via-stout/30 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-br from-stout/40 via-transparent to-transparent" />

    <div className="absolute top-5 left-5">
      <span className="text-gold border border-gold/35 bg-stout/70 backdrop-blur-sm px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em]">
        Top Pour
      </span>
    </div>

    <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">{FLAG[pint.country] ?? '🍺'}</span>
        <span className="text-xs text-cream/50 font-medium tracking-wide">{pint.location}</span>
        <span className="text-cream/20">·</span>
        <span className="text-[10px] uppercase font-black tracking-widest text-gold/70">
          {formatPourLabel(pint)}
        </span>
      </div>

      <h2 className="font-display text-4xl font-black leading-[1.1] mb-3">
        {pint.pubName}
      </h2>

      {pint.note && (
        <p className="font-display italic text-cream/70 text-base leading-snug mb-4">
          "{pint.note}"
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-graphite border border-cream/10 flex items-center justify-center">
            <span className="text-[9px] font-black text-gold">
              {pint.user.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-cream/40 font-medium">{formatAuthorName(pint.user)}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-black text-gold text-2xl leading-none">
            {formatPintScore(pint.rating)}
          </span>
          <span className="text-gold/40 text-xs font-bold">/{MAX_PINT_SCORE}</span>
        </div>
      </div>
    </div>
  </section>
);

const FeedCard = ({ pint, onClick }: { pint: Pint; onClick: () => void }) => (
  <article
    className="feed-card cursor-pointer active:scale-[0.985] transition-transform"
    onClick={onClick}
  >
    <div className="noise relative aspect-[4/5] rounded-2xl overflow-hidden bg-graphite border border-cream/5 shadow-xl mb-3">
      <img
        src={pint.photo}
        className="w-full h-full object-cover"
        alt={pint.pubName}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-stout/70 via-transparent to-transparent" />

      <div className="absolute top-3.5 right-3.5 bg-stout/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/8">
        <div className="flex items-baseline gap-0.5">
          <span className="text-gold font-black text-sm leading-none">
            {formatPintScore(pint.rating)}
          </span>
          <span className="text-gold/40 text-[9px] font-bold">/{MAX_PINT_SCORE}</span>
        </div>
      </div>

      <div className="absolute bottom-3.5 left-3.5 right-16 flex items-center gap-1.5">
        <span className="text-sm leading-none">{FLAG[pint.country] ?? '🍺'}</span>
        <span className="text-[10px] text-cream/60 font-medium truncate">
          {pint.location}
        </span>
      </div>
    </div>

    <div className="px-0.5">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-display font-bold text-xl leading-tight">{pint.pubName}</h3>
        <span className="text-[10px] uppercase font-black text-cream/20 mt-1.5 shrink-0">
          {pint.time}
        </span>
      </div>

      <span className="inline-block bg-graphite border border-cream/8 text-cream/40 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest mb-2">
        {formatPourLabel(pint)}
      </span>

      {pint.note && (
        <p className="font-display italic text-cream/60 text-sm leading-snug line-clamp-2 mb-2">
          "{pint.note}"
        </p>
      )}

      <p className="text-[10px] text-cream/25 font-medium">{formatAuthorName(pint.user)}</p>
    </div>
  </article>
);

const AppHeader = () => {
  const navigate = useNavigate();
  const { displayName } = useAuth();
  const initials = (displayName ?? 'NP').slice(0, 2).toUpperCase();

  return (
    <div className="px-5 pt-safe-header pb-4 flex items-center justify-between">
      <BrandWordmark size="header" />
      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="w-9 h-9 rounded-full bg-graphite border border-cream/10 flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Open profile"
      >
        <span className="text-xs font-black text-cream/70 font-display">{initials}</span>
      </button>
    </div>
  );
};

const HomeFeed = () => {
  const navigate = useNavigate();
  const [pints, setPints] = useState<Pint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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
        <p className="font-display italic text-cream/50 text-base">
          Pouring pints...
        </p>
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
        <div className="px-5 pt-10 text-center text-cream/50">
          <p>No pints have been poured yet.</p>
        </div>
      </div>
    );
  }

  const hero = pickHeroPint(pints);
  const feed = pints.filter((pint) => pint.id !== hero.id);

  return (
    <div className="max-w-md mx-auto">
      <AppHeader />

      <Hero pint={hero} onClick={() => navigate(`/pint/${hero.id}`)} />

      <div className="px-5 pt-8 pb-5 flex items-center gap-3">
        <span className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30">
          Latest
        </span>
        <div className="flex-1 h-px bg-cream/5" />
        <span className="text-[10px] text-cream/20 font-medium">{feed.length} pints</span>
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