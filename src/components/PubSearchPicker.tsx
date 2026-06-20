import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MapPin, Search } from 'lucide-react';
import {
  fetchPubById,
  isPlacesSearchEnabled,
  searchPubCandidates,
  type PubPlaceCandidate,
} from '../data/pubs';

export type PubSelection =
  | { status: 'resolved'; pubId: string; label: string }
  | { status: 'pending'; candidate: PubPlaceCandidate; label: string };

type PubSearchPickerProps = {
  onPubSelected: (selection: PubSelection) => void;
  initialPubId?: string | null;
  disabled?: boolean;
};

const PubSearchPicker = ({
  onPubSelected,
  initialPubId,
  disabled = false,
}: PubSearchPickerProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PubPlaceCandidate[]>([]);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [hasSelection, setHasSelection] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [placesWarning, setPlacesWarning] = useState<string | null>(null);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualCity, setManualCity] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!initialPubId) {
      return;
    }

    let cancelled = false;

    void fetchPubById(initialPubId).then((pub) => {
      if (!pub || cancelled) {
        return;
      }

      const label = `${pub.name}, ${pub.location}`;
      setSelectedLabel(label);
      setQuery(label);
      setHasSelection(true);
      onPubSelected({ status: 'resolved', pubId: pub.id, label });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once for deep link
  }, [initialPubId]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < 2 || (selectedLabel && trimmed === selectedLabel)) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setPlacesWarning(null);

    debounceRef.current = setTimeout(() => {
      void searchPubCandidates(trimmed)
        .then(({ candidates, placesWarning: warning }) => {
          setResults(candidates);
          setPlacesWarning(warning ?? null);
        })
        .catch((err) => {
          console.error('Pub search failed:', err);
          const message = err instanceof Error ? err.message : 'Search failed.';
          setSearchError(message);
          setResults([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 280);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, selectedLabel]);

  const showResults = useMemo(() => {
    return query.trim().length >= 2 && query.trim() !== selectedLabel;
  }, [query, selectedLabel]);

  const commitSelection = (selection: PubSelection) => {
    setSelectedLabel(selection.label);
    setQuery(selection.label);
    setResults([]);
    setHasSelection(true);
    setShowManualAdd(false);
    setSearchError(null);
    onPubSelected(selection);
  };

  const handleSelect = (candidate: PubPlaceCandidate) => {
    const label = `${candidate.name}, ${candidate.city}`;

    if (candidate.kind === 'existing' && candidate.id) {
      commitSelection({ status: 'resolved', pubId: candidate.id, label });
      return;
    }

    commitSelection({ status: 'pending', candidate, label });
  };

  const handleManualAdd = () => {
    const name = manualName.trim();
    const city = manualCity.trim();
    if (!name || !city) {
      return;
    }

    const candidate: PubPlaceCandidate = {
      kind: 'manual',
      name,
      city,
      country: 'Ireland',
    };

    commitSelection({
      status: 'pending',
      candidate,
      label: `${name}, ${city}`,
    });
  };

  return (
    <div>
      <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
        <span className="text-gold mr-1.5">3</span>Where did you get it?
      </label>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selectedLabel && e.target.value !== selectedLabel) {
              setSelectedLabel('');
              setHasSelection(false);
            }
          }}
          placeholder="Search pub or bar"
          disabled={disabled}
          className="w-full bg-graphite rounded-2xl py-4 pl-11 pr-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none"
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold animate-spin" />
        )}
      </div>

      {searchError && (
        <p className="text-xs text-ember mt-2">{searchError}</p>
      )}

      {placesWarning && !searchError && (
        <p className="text-xs text-cream/45 mt-2 leading-relaxed">{placesWarning}</p>
      )}

      {showResults && results.length > 0 && (
        <ul className="mt-2 bg-graphite border border-cream/10 rounded-2xl overflow-hidden shadow-2xl z-20 relative">
          {results.map((candidate) => {
            const key =
              candidate.id ??
              candidate.googlePlaceId ??
              `${candidate.name}-${candidate.city}`;

            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => handleSelect(candidate)}
                  className="w-full px-4 py-3.5 text-left border-b border-cream/5 last:border-0 active:bg-cream/5 disabled:opacity-50"
                >
                  <p className="text-sm font-bold text-cream">{candidate.name}</p>
                  <p className="text-xs text-cream/40 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold/70" />
                    {candidate.subtitle ?? `${candidate.city}, ${candidate.country}`}
                    {candidate.kind === 'google' && (
                      <span className="text-cream/25"> · Google</span>
                    )}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {showResults && !isSearching && results.length === 0 && (
        <p className="text-xs text-cream/40 mt-2">No matches — add it manually below.</p>
      )}

      {isPlacesSearchEnabled() && showResults && (
        <p className="text-[10px] text-cream/25 mt-2">Place data from Google</p>
      )}

      <div className="mt-3">
        {!showManualAdd ? (
          <button
            type="button"
            onClick={() => {
              setShowManualAdd(true);
              setManualName(query.trim() || '');
            }}
            className="text-xs text-gold font-bold underline"
          >
            Wrong place or not listed? Add manually
          </button>
        ) : (
          <div className="space-y-3 rounded-2xl border border-cream/10 bg-stout/40 p-4">
            <p className="text-xs text-cream/50">Add the pub name and town.</p>
            <input
              type="text"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="Pub name"
              className="w-full bg-graphite rounded-xl py-3 px-3 text-cream text-sm border border-cream/5 outline-none"
            />
            <input
              type="text"
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              placeholder="City / town"
              className="w-full bg-graphite rounded-xl py-3 px-3 text-cream text-sm border border-cream/5 outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleManualAdd}
                disabled={!manualName.trim() || !manualCity.trim()}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-cream text-stout disabled:opacity-40"
              >
                Add pub
              </button>
              <button
                type="button"
                onClick={() => setShowManualAdd(false)}
                className="px-4 py-2.5 rounded-xl text-sm text-cream/60 border border-cream/10"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-cream/25 mt-2">
        Spot a duplicate or wrong listing?{' '}
        <Link to="/request-pub" className="text-gold font-bold underline">
          Report it
        </Link>
      </p>

      {hasSelection && selectedLabel && (
        <p className="text-xs text-gold/80 mt-2 font-bold">Selected: {selectedLabel}</p>
      )}
    </div>
  );
};

export default PubSearchPicker;
