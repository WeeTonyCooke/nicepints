import { useState, useEffect } from 'react';
import { Star, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  fetchLivePubs,
  getPubRating,
  getPintsByPubId,
  type Pub,
} from '../data';

type SortMode = 'nearest' | 'top';

type PubWithStats = Pub & {
  rating: number;
  count: number;
};

const MapView = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SortMode>('nearest');
  const [pubs, setPubs] = useState<PubWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPubs = async () => {
      try {
        const livePubs = await fetchLivePubs();

        const pubsWithStats = await Promise.all(
          livePubs.map(async (pub) => {
            const [rating, pints] = await Promise.all([
              getPubRating(pub.id),
              getPintsByPubId(pub.id),
            ]);

            return {
              ...pub,
              rating,
              count: pints.length,
            };
          })
        );

        setPubs(pubsWithStats);
      } catch (error) {
        console.error('Failed to load map pubs:', error);
        setPubs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPubs();
  }, []);

  const sorted = [...pubs].sort((a, b) => {
    if (mode === 'top') {
      return b.rating - a.rating;
    }

    return a.name.localeCompare(b.name);
  });

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center">
        <p className="text-cream/50 text-sm font-bold uppercase tracking-widest">
          Finding pubs...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="px-5 pt-12 pb-4">
        <p className="text-[9px] uppercase font-black tracking-[0.18em] text-cream/25 mb-0.5">
          Nice<span className="text-gold/60">Pints</span>
        </p>
        <h1 className="font-display font-black text-2xl tracking-tight">Nearby</h1>
      </div>

      <div className="px-5 mb-5">
        <div className="flex bg-graphite p-1.5 rounded-2xl border border-cream/5">
          {(['nearest', 'top'] as SortMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                mode === m ? 'bg-gold text-stout shadow' : 'text-cream/40'
              }`}
            >
              {m === 'nearest' ? 'Nearest' : 'Top Rated'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mb-4 flex items-center gap-2 text-cream/25">
        <Navigation className="w-3 h-3 text-gold" />
        <span className="text-xs">Moville, Co. Donegal</span>
      </div>

      <div className="px-4 space-y-2.5 pb-32">
        {sorted.map((pub, index) => (
          <div
            key={pub.id}
            onClick={() => navigate(`/pub/${pub.id}`)}
            className="bg-graphite p-4 rounded-2xl flex items-center gap-4 border border-cream/5 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="w-12 h-12 bg-stout rounded-xl flex items-center justify-center font-black text-gold shrink-0 border border-cream/5">
              {mode === 'top' ? (
                <span className="text-xs text-cream/30 font-black">#{index + 1}</span>
              ) : (
                <span className="font-display text-lg">{pub.name[0]}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-base truncate">{pub.name}</h3>
              <p className="text-[9px] font-black text-cream/30 uppercase tracking-tight mt-0.5 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-gold" />
                {pub.location}
              </p>
              {pub.count > 0 && (
                <p className="text-[9px] text-cream/20 mt-0.5">
                  {pub.count} pint{pub.count !== 1 ? 's' : ''} rated
                </p>
              )}
            </div>

            <div className="text-right shrink-0">
              {pub.rating > 0 ? (
                <div className="flex items-center gap-1 justify-end mb-1">
                  <Star className="w-3 h-3 fill-gold text-gold" />
                  <span className="text-sm font-black">{pub.rating.toFixed(1)}</span>
                </div>
              ) : (
                <p className="text-[9px] text-cream/20 mb-1">—</p>
              )}
              <p className="text-[9px] text-cream/25 font-medium">{pub.distance}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;