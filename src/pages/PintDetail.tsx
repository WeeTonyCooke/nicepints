import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin } from 'lucide-react';
import { getPintById, type Pint } from '../data';
import LoadError from '../components/LoadError';
import DrinkLabelChip from '../components/DrinkLabelChip';
import RatingScore from '../components/RatingScore';
import ReportPintDialog from '../components/ReportPintDialog';
import AuthorAttribution from '../components/AuthorAttribution';

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
        <p className="text-muted text-base">Pouring pint...</p>
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
        <p className="text-muted text-sm">Pint not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-gold text-sm font-semibold">← Back to feed</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-safe-feed text-cream">
      <section className="relative w-full aspect-[4/5]">
        <img
          src={pint.photo}
          className="w-full h-full object-cover"
          alt={`Pint at ${pint.pubName}`}
        />
        <div className="absolute inset-0 photo-scrim-base" />
        <div className="absolute inset-0 photo-scrim-gradient" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-safe-back left-5 p-2.5 bg-stout/70 backdrop-blur-md rounded-full text-cream active:scale-90 transition-transform border border-line"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="absolute top-safe-back right-5 drop-shadow-sm">
          <RatingScore score={pint.rating} size="display" />
        </div>
      </section>

      <main className="px-5 py-7">
        <DrinkLabelChip pint={pint} className="mb-4" />

        <h2 className="font-display font-black text-4xl leading-tight mb-2">{pint.pubName}</h2>

        <p className="text-sm text-muted mb-7 flex items-center gap-1.5">
          <span>{FLAG[pint.country] ?? '🍺'}</span>
          <MapPin className="w-3 h-3" />
          <span>{pint.location}</span>
        </p>

        {pint.note && (
          <p className="text-xl leading-relaxed text-cream/90 mb-8">
            "{pint.note}"
          </p>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-line">
          <div>
            <p className="text-[11px] uppercase font-medium tracking-wider text-muted mb-1">Logged by</p>
            <AuthorAttribution
              name={pint.user}
              userId={pint.userId}
              isRecognized={pint.authorIsRecognized}
              className="text-sm font-semibold"
              nameClassName="text-sm font-semibold"
              linkToProfile
            />
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase font-medium tracking-wider text-muted mb-1">When</p>
            <p className="text-sm font-semibold">{pint.time}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <ReportPintDialog pintId={pint.id} />
        </div>

        <button
          onClick={() => navigate(`/pub/${pint.pubId}`)}
          className="mt-7 w-full bg-graphite border border-line py-4 rounded-2xl font-semibold text-sm active:scale-95 transition-transform text-cream/80 hover:text-cream transition-colors"
        >
          See all pints at {pint.pubName} →
        </button>
      </main>
    </div>
  );
};

export default PintDetail;
