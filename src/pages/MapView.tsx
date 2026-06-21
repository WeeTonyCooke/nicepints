import { useState, useEffect, useMemo } from 'react';
import { MapPin, Navigation, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  findPours,
  formatPourLabel,
  formatServingLabel,
  RECENCY_OPTIONS,
  resolvePourFilter,
  type PourPresetId,
  type PourResult,
  type RecencyDays,
} from '../data';
import LoadError from '../components/LoadError';
import EmptyState from '../components/EmptyState';
import ContextualTip from '../components/ContextualTip';
import BrandWordmark from '../components/BrandWordmark';
import RatingScore from '../components/RatingScore';
import { getCurrentCoordinates } from '../utils/geolocation';

const PRESETS: Array<{ id: PourPresetId; label: string; highlight?: boolean }> = [
  { id: 'guinness-00-draught', label: 'Guinness 0.0 on Draught', highlight: true },
  { id: 'guinness', label: 'Guinness' },
  { id: 'all', label: 'All pints' },
];

const DEFAULT_PRESET_FILTER = resolvePourFilter('guinness-00-draught');

const MapView = () => {
  const navigate = useNavigate();
  const [preset, setPreset] = useState<PourPresetId>('guinness-00-draught');
  const [recencyDays, setRecencyDays] = useState<RecencyDays>(
    DEFAULT_PRESET_FILTER.recencyDays ?? 30
  );
  const [minScore, setMinScore] = useState(DEFAULT_PRESET_FILTER.minScore ?? 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<PourResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState('Finding your location...');
  const [locationError, setLocationError] = useState<string | null>(null);

  const selectPreset = (nextPreset: PourPresetId) => {
    const base = resolvePourFilter(nextPreset);
    setPreset(nextPreset);
    setRecencyDays(base.recencyDays ?? 30);
    setMinScore(base.minScore ?? 0);
  };

  const loadResults = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const coords = await getCurrentCoordinates().catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Location unavailable';
        setLocationError(message);
        return null;
      });

      setLocationLabel(coords ? 'Sorted by distance from you' : 'Sorted by rating');

      const base = resolvePourFilter(preset);
      const pours = await findPours({
        ...base,
        recencyDays: preset === 'all' ? recencyDays : base.recencyDays ?? recencyDays,
        minScore,
        maxDistanceKm: base.maxDistanceKm ?? null,
        searchQuery,
        userCoords: coords,
      });

      setResults(pours);
    } catch (error) {
      console.error('Failed to load pours:', error);
      setResults([]);
      const message = error instanceof Error ? error.message : 'Could not load pints.';
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadResults();
    }, searchQuery ? 300 : 0);

    return () => window.clearTimeout(timer);
  }, [preset, recencyDays, minScore, searchQuery]);

  const resultCountLabel = useMemo(() => {
    if (results.length === 0) return 'No matching pints yet';
    return `${results.length} pub${results.length === 1 ? '' : 's'} with matching pints`;
  }, [results.length]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center">
        <p className="font-sans text-muted text-base">
          Finding pints...
        </p>
      </div>
    );
  }

  if (loadError) {
    return <LoadError message={loadError} onRetry={loadResults} />;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="px-5 pt-safe-header pb-4">
        <BrandWordmark size="compact" className="mb-0.5" />
        <h1 className="font-display font-black text-2xl tracking-tight text-cream">Find a Pint</h1>
        <p className="text-sm text-cream/50 mt-1 leading-relaxed">
          Choose a drink and we&apos;ll show you the best-rated places nearby.
        </p>
        <ContextualTip tipId="map-first-visit" className="mt-4">
          Presets filter by drink and recency. The photo on each result is the evidence.
        </ContextualTip>
      </div>

      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectPreset(item.id)}
              className={`shrink-0 px-4 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition-all ${
                preset === item.id
                  ? 'text-gold border-gold bg-gold-soft'
                  : 'bg-graphite text-muted border-line'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                void loadResults();
              }
            }}
            placeholder="Search pub or town"
            className="w-full bg-graphite rounded-2xl py-3.5 pl-11 pr-4 text-cream text-sm border border-line focus:ring-2 focus:ring-gold/30 outline-none"
          />
        </div>
      </div>

      <div className="px-5 mb-4 flex gap-2">
        <div className="flex flex-1 bg-graphite p-1 rounded-2xl border border-line overflow-x-auto">
          {RECENCY_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setRecencyDays(option.days)}
              className={`flex-1 min-w-[5.5rem] py-2 text-[10px] font-semibold uppercase tracking-wider rounded-xl whitespace-nowrap ${
                recencyDays === option.days ? 'bg-gold-soft text-gold' : 'text-muted'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMinScore((current) => (current >= 8 ? 0 : 8))}
          className={`shrink-0 px-3 py-2 rounded-2xl text-[10px] font-semibold uppercase tracking-wider border ${
            minScore >= 8
              ? 'bg-gold-soft text-gold border-gold'
              : 'bg-graphite text-muted border-line'
          }`}
        >
          8+
        </button>
      </div>

      <div className="px-5 mb-4">
        <div className="flex items-center gap-2 text-muted">
          <Navigation className="w-3 h-3 shrink-0" />
          <span className="text-xs">{locationLabel}</span>
          <span className="text-cream/20">·</span>
          <span className="text-xs">{resultCountLabel}</span>
        </div>
        {locationError && (
          <p className="text-[10px] text-cream/30 mt-1">{locationError}</p>
        )}
      </div>

      <div className="px-4 space-y-3 pb-safe-feed">
        {results.length === 0 ? (
          <EmptyState
            title="No pints found yet"
            description="Try another drink or widen your search."
            actionLabel="Log a pint"
            onAction={() => navigate('/add')}
            secondaryLabel={preset === 'all' ? 'Request a pub' : 'Try all pints'}
            onSecondary={() =>
              preset === 'all' ? navigate('/request-pub') : selectPreset('all')
            }
          />
        ) : (
          results.map((result) => (
            <div
              key={result.pub.id}
              onClick={() => navigate(`/pub/${result.pub.id}`)}
              className="bg-graphite rounded-2xl border border-line overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="relative h-36">
                <img
                  src={result.bestPint.photo}
                  alt={`Pint at ${result.pub.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 photo-scrim-base" />
                <div className="absolute inset-0 photo-scrim-gradient" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-stout/80 text-muted px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-line">
                    {formatPourLabel(result.bestPint)}
                  </span>
                  {result.bestPint.servingType === 'draught' && (
                    <span className="bg-stout/80 text-cream px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-line">
                      {formatServingLabel('draught')}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3">
                  <RatingScore score={result.bestPint.rating} size="md" chip />
                </div>
              </div>

              <div className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-sans font-bold text-lg truncate">{result.pub.name}</h3>
                  <p className="text-[10px] font-medium text-muted uppercase tracking-tight mt-0.5 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {result.pub.location}
                  </p>
                  <p className="text-[10px] text-muted mt-1">
                    {result.matchingCount} pint{result.matchingCount !== 1 ? 's' : ''} logged
                    {result.bestPint.time ? ` · latest ${result.bestPint.time}` : ''}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  {result.distance && (
                    <p className="text-xs font-medium text-cream">{result.distance}</p>
                  )}
                  <div className="flex items-center gap-1 justify-end mt-1 text-muted">
                    <Star className="w-3 h-3" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Avg</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MapView;
