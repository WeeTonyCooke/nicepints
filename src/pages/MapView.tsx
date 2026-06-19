import { useState, useEffect, useMemo } from 'react';
import { MapPin, Navigation, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  describePourPreset,
  findPours,
  formatPourLabel,
  formatPourResultScore,
  formatServingLabel,
  RECENCY_OPTIONS,
  resolvePourFilter,
  type PourPresetId,
  type PourResult,
  type RecencyDays,
} from '../data';
import LoadError from '../components/LoadError';
import { getCurrentCoordinates } from '../utils/geolocation';

const PRESETS: Array<{ id: PourPresetId; label: string; highlight?: boolean }> = [
  { id: 'guinness-00-draught', label: '0.0 on Draught', highlight: true },
  { id: 'guinness', label: 'Guinness' },
  { id: 'all', label: 'All pours' },
];

const MapView = () => {
  const navigate = useNavigate();
  const [preset, setPreset] = useState<PourPresetId>('guinness-00-draught');
  const [recencyDays, setRecencyDays] = useState<RecencyDays>(30);
  const [minScore, setMinScore] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<PourResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState('Finding your location...');
  const [locationError, setLocationError] = useState<string | null>(null);

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
        minScore: minScore > 0 ? minScore : base.minScore,
        searchQuery,
        userCoords: coords,
      });

      setResults(pours);
    } catch (error) {
      console.error('Failed to load pours:', error);
      setResults([]);
      const message = error instanceof Error ? error.message : 'Could not load pours.';
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

  const subtitle = useMemo(() => describePourPreset(preset), [preset]);

  const resultCountLabel = useMemo(() => {
    if (results.length === 0) return 'No matching pours yet';
    return `${results.length} pub${results.length === 1 ? '' : 's'} with matching pours`;
  }, [results.length]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center">
        <p className="text-cream/50 text-sm font-bold uppercase tracking-widest">
          Finding pours...
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
        <p className="text-[9px] uppercase font-black tracking-[0.18em] text-cream/25 mb-0.5">
          Nice<span className="text-gold/60">Pints</span>
        </p>
        <h1 className="font-display font-black text-2xl tracking-tight">Find a Pour</h1>
        <p className="text-sm text-cream/50 mt-1 leading-relaxed">{subtitle}</p>
      </div>

      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPreset(item.id)}
              className={`shrink-0 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                preset === item.id
                  ? item.highlight
                    ? 'bg-gold text-stout border-gold'
                    : 'bg-cream text-stout border-cream'
                  : 'bg-graphite text-cream/50 border-cream/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none" />
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
            className="w-full bg-graphite rounded-2xl py-3.5 pl-11 pr-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none"
          />
        </div>
      </div>

      <div className="px-5 mb-4 flex gap-2">
        <div className="flex flex-1 bg-graphite p-1 rounded-2xl border border-cream/5 overflow-x-auto">
          {RECENCY_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setRecencyDays(option.days)}
              className={`flex-1 min-w-[5.5rem] py-2 text-[9px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap ${
                recencyDays === option.days ? 'bg-stout text-gold' : 'text-cream/35'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMinScore((current) => (current >= 8 ? 0 : 8))}
          className={`shrink-0 px-3 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border ${
            minScore >= 8
              ? 'bg-gold/15 text-gold border-gold/30'
              : 'bg-graphite text-cream/35 border-cream/5'
          }`}
        >
          8+
        </button>
      </div>

      <div className="px-5 mb-4">
        <div className="flex items-center gap-2 text-cream/40">
          <Navigation className="w-3 h-3 text-gold shrink-0" />
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
          <div className="rounded-2xl border border-cream/10 bg-graphite p-6 text-center">
            <p className="text-4xl mb-3">🍺</p>
            <p className="font-display font-bold text-cream/80 mb-2">Nothing poured here yet</p>
            <p className="text-sm text-cream/45 leading-relaxed mb-4">
              Be the first to log a {preset === 'guinness-00-draught' ? 'Guinness 0.0 on draught' : 'pint'} near you.
            </p>
            <button
              type="button"
              onClick={() => navigate('/add')}
              className="text-gold font-black text-sm"
            >
              Log a pint →
            </button>
          </div>
        ) : (
          results.map((result) => (
            <div
              key={result.pub.id}
              onClick={() => navigate(`/pub/${result.pub.id}`)}
              className="bg-graphite rounded-2xl border border-cream/5 overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="relative h-36">
                <img
                  src={result.bestPint.photo}
                  alt={`Pint at ${result.pub.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stout via-stout/20 to-transparent" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-gold text-stout px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {formatPourLabel(result.bestPint)}
                  </span>
                  {result.bestPint.servingType === 'draught' && (
                    <span className="bg-stout/80 text-cream px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-cream/10">
                      {formatServingLabel('draught')}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 bg-gold text-stout px-3 py-1.5 rounded-xl">
                  <span className="font-black text-lg leading-none">
                    {formatPourResultScore(result)}
                  </span>
                </div>
              </div>

              <div className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-lg truncate">{result.pub.name}</h3>
                  <p className="text-[10px] font-black text-cream/35 uppercase tracking-tight mt-0.5 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-gold" />
                    {result.pub.location}
                  </p>
                  <p className="text-[10px] text-cream/30 mt-1">
                    {result.matchingCount} pour{result.matchingCount !== 1 ? 's' : ''} logged
                    {result.bestPint.time ? ` · latest ${result.bestPint.time}` : ''}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  {result.distance && (
                    <p className="text-xs font-bold text-cream/60">{result.distance}</p>
                  )}
                  <div className="flex items-center gap-1 justify-end mt-1 text-gold">
                    <Star className="w-3 h-3 fill-gold" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Avg</span>
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
