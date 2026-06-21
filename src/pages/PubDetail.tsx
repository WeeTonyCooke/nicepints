import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, ChevronLeft, Plus } from 'lucide-react';
import {
  fetchLivePubs,
  fetchLivePints,
  formatPourLabel,
  MAX_PINT_SCORE,
  type Pub,
  type Pint,
} from '../data';
import LoadError from '../components/LoadError';
import BrandWordmark from '../components/BrandWordmark';
import RatingScore from '../components/RatingScore';
import { ratingTextClass } from '../utils/ratingColor';
import AuthorAttribution from '../components/AuthorAttribution';

const FLAG: Record<string, string> = {
  Ireland: '🇮🇪', USA: '🇺🇸', UK: '🇬🇧', Germany: '🇩🇪', France: '🇫🇷',
};

function qualityLabel(r: number): string {
  if (r >= 9) return 'Exceptional';
  if (r >= 8) return 'Excellent';
  if (r >= 7) return 'Very Good';
  if (r >= 5) return 'Decent';
  return 'Mixed';
}

type PourBreakdown = {
  key: string;
  label: string;
  count: number;
  avgRating: number;
};

function buildPourBreakdown(pints: Pint[]): PourBreakdown[] {
  const groups = new Map<string, PourBreakdown>();

  for (const pint of pints) {
    const groupKey =
      pint.productSlug ??
      pint.productId ??
      pint.pintType ??
      'unknown';
    const existing = groups.get(groupKey);

    if (existing) {
      existing.count += 1;
      existing.avgRating =
        (existing.avgRating * (existing.count - 1) + pint.rating) / existing.count;
      continue;
    }

    groups.set(groupKey, {
      key: groupKey,
      label: formatPourLabel(pint),
      count: 1,
      avgRating: pint.rating,
    });
  }

  return Array.from(groups.values()).sort((a, b) => b.avgRating - a.avgRating);
}

const PubDetail = () => {
  const navigate = useNavigate();
  const { placeId } = useParams<{ placeId: string }>();

  const [pub, setPub] = useState<Pub | null>(null);
  const [pints, setPints] = useState<Pint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadPubDetails = async () => {
    if (!placeId) {
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const [allPubs, allPints] = await Promise.all([
        fetchLivePubs(),
        fetchLivePints(),
      ]);

      const currentPub = allPubs.find((p) => p.id === placeId) || null;
      setPub(currentPub);
      setPints(allPints.filter((p) => p.pubId === placeId));
    } catch (error) {
      console.error('Failed to load pub details:', error);
      setPub(null);
      setPints([]);
      const message = error instanceof Error ? error.message : 'Could not load this pub.';
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPubDetails();
  }, [placeId]);

  const pourBreakdown = useMemo(() => buildPourBreakdown(pints), [pints]);

  // Calculate the average rating dynamically
  const avgRating = pints.length > 0
    ? pints.reduce((sum, p) => sum + p.rating, 0) / pints.length
    : 0;

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center">
        <p className="font-sans text-muted text-base">Loading pub...</p>
      </div>
    );
  }

  if (loadError) {
    return <LoadError message={loadError} onRetry={loadPubDetails} />;
  }

  const name = pub?.name ?? 'Unknown Pub';
  const location = pub?.location ?? '';
  const country = pub?.country ?? '';

  return (
    <div className="max-w-md mx-auto text-cream">
      {/* Header */}
      <header className="px-5 pt-safe-header-lg pb-8 border-b border-line relative text-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-safe-back left-5 p-2.5 bg-stout/60 backdrop-blur-md rounded-full border border-cream/10 active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* App wordmark — consistent across all screens */}
        <BrandWordmark size="compact" className="mb-6" />

        {/* Pub identity */}
        <div className="w-14 h-14 rounded-2xl bg-elevated border border-line flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-bold text-cream">{name[0]}</span>
        </div>
        <h1 className="font-display font-black text-3xl mb-1">{name}</h1>
        <p className="text-sm text-muted flex items-center justify-center gap-1.5">
          <span>{FLAG[country] ?? '🍺'}</span>
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </p>

        <div className="mt-7">
          {avgRating > 0 ? (
            <div className="inline-flex flex-col items-center bg-graphite rounded-3xl px-10 py-5 border border-line">
              <span className={`font-display font-black text-5xl tracking-tight leading-none ${ratingTextClass(avgRating)}`}>
                {avgRating.toFixed(1)}
              </span>
              <span className="text-[11px] uppercase font-medium tracking-wider text-muted mt-2">{qualityLabel(avgRating)}</span>
              <span className="text-xs text-muted mt-1">{pints.length} pint{pints.length !== 1 ? 's' : ''} rated · /{MAX_PINT_SCORE}</span>
            </div>
          ) : (
            <div className="inline-flex flex-col items-center bg-graphite rounded-3xl px-10 py-5 border border-line">
              <span className="text-xl font-bold text-muted">No ratings yet</span>
              <span className="text-xs text-muted mt-1">Be the first</span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`/add?pubId=${placeId}`)}
          className="mt-6 w-full max-w-[220px] bg-gold text-stout py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mx-auto active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" /> Rate a Pint Here
        </button>
      </header>

      {pourBreakdown.length > 0 && (
        <section className="px-5 pt-8">
          <h2 className="text-[9px] uppercase font-black tracking-[0.18em] text-cream/30 mb-4">
            By pint
          </h2>
          <div className="space-y-2">
            {pourBreakdown.map((group) => (
              <div
                key={group.key}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-graphite px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-cream truncate">{group.label}</p>
                  <p className="text-[10px] text-muted mt-0.5">
                    {group.count} pint{group.count !== 1 ? 's' : ''} logged
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <RatingScore score={group.avgRating} size="md" />
                  <p className="text-[10px] uppercase font-medium tracking-wider text-muted mt-1">
                    Avg /{MAX_PINT_SCORE}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pint gallery */}
      {pints.length > 0 && (
        <section className="px-5 pt-8">
          <h2 className="text-[9px] uppercase font-black tracking-[0.18em] text-cream/30 mb-4">Recent Pints</h2>
          <div className="grid grid-cols-2 gap-3">
            {pints.map(pint => (
              <div
                key={pint.id}
                onClick={() => navigate(`/pint/${pint.id}`)}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform bg-graphite border border-line"
              >
                <img src={pint.photo} className="w-full h-full object-cover" alt={pint.pubName} />
                <div className="absolute inset-0 photo-scrim-base" />
                <div className="absolute inset-0 photo-scrim-gradient" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between items-end">
                  <AuthorAttribution
                    name={pint.user}
                    userId={pint.userId}
                    isFoundingTaster={pint.authorIsFoundingTaster}
                    isRecognized={pint.authorIsRecognized}
                    className="text-[9px] text-cream/80"
                    nameClassName="text-[9px] text-cream/80"
                  />
                  <RatingScore score={pint.rating} size="sm" chip />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state — with visual weight */}
      {pints.length === 0 && (
        <div className="px-6 pt-16 text-center">
          <div className="text-6xl mb-4 opacity-20">🍺</div>
          <p className="text-muted text-lg mb-1">No pints logged here yet.</p>
          <p className="text-muted text-xs">The pint doesn't rate itself.</p>
        </div>
      )}
    </div>
  );
};

export default PubDetail;