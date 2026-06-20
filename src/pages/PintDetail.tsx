import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin } from 'lucide-react';
import { getPintById, formatPintScore, formatPourLabel, MAX_PINT_SCORE, type Pint } from '../data';
import LoadError from '../components/LoadError';
import ReportPintDialog from '../components/ReportPintDialog';
import { formatAuthorName } from '../utils/user';

const FLAG: Record<string, string> = {
  Ireland: '🇮🇪', USA: '🇺🇸', UK: '🇬🇧', Germany: '🇩🇪', France: '🇫🇷',
};

const PintDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [pint, setPint] = useState<Pint | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadPint = async () => {
    if (!id) {
      setPint(undefined);
      setLoadError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getPintById(id);
      setPint(data);
    } catch (error) {
      console.error('Failed to load pint:', error);
      setPint(undefined);
      const message = error instanceof Error ? error.message : 'Could not load this pint.';
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPint();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center">
        <p className="text-cream/50 text-sm font-bold uppercase tracking-widest">
          Pouring pint...
        </p>
      </div>
    );
  }

  if (loadError) {
    return <LoadError message={loadError} onRetry={loadPint} />;
  }

  if (!pint) {
    return (
      <div className="max-w-md mx-auto px-6 pt-20 text-center">
        <p className="text-5xl mb-4">🍺</p>
        <p className="text-cream/40 text-sm font-display italic">Pint not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-gold text-sm font-bold">← Back to feed</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-safe-feed text-cream">
      {/* Full-bleed photo */}
      <section className="relative w-full aspect-[4/5]">
        <img
          src={pint.photo}
          className="w-full h-full object-cover"
          alt={`Pint at ${pint.pubName}`}
        />
        {/* Layered gradients — dark base to cream tones, echoing the Guinness pour */}
        <div className="absolute inset-0 bg-gradient-to-t from-stout via-stout/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-stout/30 via-transparent to-transparent" />

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-safe-back left-5 p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white active:scale-90 transition-transform border border-white/10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Rating badge — simplified: just the number */}
        <div className="absolute bottom-6 right-5 bg-stout/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-gold/25 shadow-xl">
          <span className="font-black text-2xl leading-none text-gold">{formatPintScore(pint.rating)}</span>
          <span className="text-gold/40 text-xs font-bold ml-0.5">/{MAX_PINT_SCORE}</span>
        </div>
      </section>

      {/* Detail */}
      <main className="px-5 py-7">
        {/* Pint type chip */}
        <span className="inline-block bg-graphite border border-cream/10 text-cream/50 px-3 py-1 rounded text-[9px] font-black uppercase tracking-[0.15em] mb-4">
          {formatPourLabel(pint)}
        </span>

        {/* Pub name */}
        <h2 className="font-display font-black text-4xl leading-tight mb-2">{pint.pubName}</h2>

        {/* Location */}
        <p className="text-sm text-cream/40 mb-7 flex items-center gap-1.5">
          <span>{FLAG[pint.country] ?? '🍺'}</span>
          <MapPin className="w-3 h-3 text-gold" />
          <span>{pint.location}</span>
        </p>

        {/* Note */}
        {pint.note && (
          <p className="font-display italic text-xl leading-relaxed text-cream/80 mb-8">
            "{pint.note}"
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between pt-6 border-t border-cream/5">
          <div>
            <p className="text-[9px] uppercase font-black tracking-[0.15em] text-cream/25 mb-1">Logged by</p>
            <p className="text-sm font-bold">{formatAuthorName(pint.user)}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase font-black tracking-[0.15em] text-cream/25 mb-1">When</p>
            <p className="text-sm font-bold">{pint.time}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <ReportPintDialog pintId={pint.id} />
        </div>

        {/* Pub CTA */}
        <button
          onClick={() => navigate(`/pub/${pint.pubId}`)}
          className="mt-7 w-full bg-graphite border border-cream/10 py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform text-cream/70 hover:text-cream transition-colors"
        >
          See all pints at {pint.pubName} →
        </button>
      </main>
    </div>
  );
};

export default PintDetail;
