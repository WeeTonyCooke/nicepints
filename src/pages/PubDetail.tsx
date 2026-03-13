import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, ChevronLeft, Plus } from 'lucide-react';
import { NEARBY_PUBS, getPintsByPubId, getPubRating } from '../data';

const FLAG: Record<string, string> = {
  Ireland: '🇮🇪', USA: '🇺🇸', UK: '🇬🇧', Germany: '🇩🇪', France: '🇫🇷',
};

function qualityLabel(r: number): string {
  if (r >= 4.8) return 'Exceptional';
  if (r >= 4.5) return 'Excellent';
  if (r >= 4.0) return 'Very Good';
  if (r >= 3.0) return 'Decent';
  return 'Mixed';
}

const PubDetail = () => {
  const navigate = useNavigate();
  const { placeId } = useParams<{ placeId: string }>();

  const pub = NEARBY_PUBS.find(p => p.id === placeId);
  const pints = getPintsByPubId(placeId ?? '');
  const avgRating = getPubRating(placeId ?? '');

  const name = pub?.name ?? 'Unknown Pub';
  const location = pub?.location ?? '';
  const country = pub?.country ?? '';

  return (
    <div className="max-w-md mx-auto pb-24 text-cream">
      {/* Header */}
      <header className="px-5 pt-14 pb-8 bg-gradient-to-b from-graphite to-stout border-b border-cream/5 relative text-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-5 p-2.5 bg-stout/60 backdrop-blur-md rounded-full border border-cream/10 active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* App wordmark — consistent across all screens */}
        <p className="text-[9px] uppercase font-black tracking-[0.18em] text-cream/20 mb-6">
          Nice<span className="text-gold/60">Pints</span>
        </p>

        {/* Pub identity */}
        <div className="w-14 h-14 rounded-2xl bg-stout border border-gold/20 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-black text-gold font-display">{name[0]}</span>
        </div>
        <h1 className="font-display font-black text-3xl mb-1">{name}</h1>
        <p className="text-sm text-cream/40 flex items-center justify-center gap-1.5">
          <span>{FLAG[country] ?? '🍺'}</span>
          <MapPin className="w-3 h-3 text-gold" />
          <span>{location}</span>
        </p>

        {/* Rating block */}
        <div className="mt-7">
          {avgRating > 0 ? (
            <div className="inline-flex flex-col items-center bg-stout/70 rounded-3xl px-10 py-5 border border-cream/5">
              <span className="font-display font-black text-5xl text-gold tracking-tight leading-none">{avgRating.toFixed(1)}</span>
              <span className="text-[9px] uppercase font-black tracking-[0.15em] text-cream/40 mt-2">{qualityLabel(avgRating)}</span>
              <span className="text-xs text-cream/25 mt-1">{pints.length} pint{pints.length !== 1 ? 's' : ''} rated</span>
            </div>
          ) : (
            <div className="inline-flex flex-col items-center bg-stout/70 rounded-3xl px-10 py-5 border border-cream/5">
              <span className="text-xl font-bold text-cream/30">No ratings yet</span>
              <span className="text-xs text-cream/20 mt-1">Be the first</span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/add')}
          className="mt-6 w-full max-w-[220px] bg-gold text-stout py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 mx-auto active:scale-95 transition-transform shadow-lg shadow-gold/10"
        >
          <Plus className="w-4 h-4" /> Rate a Pint Here
        </button>
      </header>

      {/* Pint gallery */}
      {pints.length > 0 && (
        <section className="px-5 pt-8">
          <h2 className="text-[9px] uppercase font-black tracking-[0.18em] text-cream/30 mb-4">Recent Pints</h2>
          <div className="grid grid-cols-2 gap-3">
            {pints.map(pint => (
              <div
                key={pint.id}
                onClick={() => navigate(`/pint/${pint.id}`)}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform bg-graphite"
              >
                <img src={pint.photo} className="w-full h-full object-cover" alt={pint.pubName} />
                <div className="absolute inset-0 bg-gradient-to-t from-stout/80 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between items-end">
                  <span className="text-[9px] text-cream/60">@{pint.user}</span>
                  <span className="text-xs font-black text-gold">{pint.rating.toFixed(1)}</span>
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
          <p className="font-display italic text-cream/40 text-lg mb-1">No pints logged here yet.</p>
          <p className="text-cream/20 text-xs">The pint doesn't rate itself.</p>
        </div>
      )}
    </div>
  );
};

export default PubDetail;
