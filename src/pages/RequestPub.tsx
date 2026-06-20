import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, MapPin } from 'lucide-react';
import { submitPubRequest } from '../data/moderation';
import { useAuth } from '../Context/AuthContext';
import BrandWordmark from '../components/BrandWordmark';

const RequestPub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pubName, setPubName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Ireland');
  const [note, setNote] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await submitPubRequest({
        pubName,
        city,
        country,
        note,
        contactEmail: user ? undefined : contactEmail,
      });
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not submit report.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-5 pt-safe-header text-cream text-center">
        <p className="text-5xl mb-4">🍺</p>
        <h1 className="font-display font-black text-2xl mb-3">Report received</h1>
        <p className="text-cream/60 text-sm mb-8 leading-relaxed">
          Thanks — we&apos;ll review the listing for <strong className="text-cream">{pubName}</strong>{' '}
          in {city}.
        </p>
        <button
          type="button"
          onClick={() => navigate('/add')}
          className="w-full py-4 rounded-2xl font-black bg-cream text-stout active:scale-95 transition-transform"
        >
          Back to log a pint
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-safe-header text-cream pb-safe-feed">
      <header className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2.5 bg-graphite rounded-full border border-cream/10 active:scale-90 transition-transform"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <BrandWordmark size="compact" className="mb-0.5" />
          <h1 className="font-display font-black text-xl text-cream">Report a listing</h1>
        </div>
      </header>

      <p className="text-sm text-cream/50 mb-6 leading-relaxed">
        Wrong pub name, duplicate entry, or closed venue? Tell us and we&apos;ll fix the listing.
        To log a pint at a new place, search for it on the add-pint screen — you don&apos;t need to
        wait for us.
      </p>

      {error && (
        <div className="mb-4 rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember/90">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            Pub name
          </label>
          <input
            type="text"
            value={pubName}
            onChange={(e) => setPubName(e.target.value)}
            placeholder="e.g. O'Donoghue's"
            className="w-full bg-graphite rounded-2xl py-4 px-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            City / town
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Dublin"
              className="w-full bg-graphite rounded-2xl py-4 pl-11 pr-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            Country
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-graphite rounded-2xl py-4 px-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            What&apos;s wrong? (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Duplicate of another pub, wrong location, permanently closed..."
            rows={3}
            maxLength={300}
            className="w-full bg-graphite rounded-2xl py-4 px-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none resize-none"
          />
        </div>

        {!user && (
          <div>
            <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
              Your email (so we can follow up)
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-graphite rounded-2xl py-4 px-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !pubName.trim() || !city.trim() || (!user && !contactEmail.trim())}
          className="w-full py-4 rounded-2xl font-black text-lg bg-cream text-stout disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
          {isSubmitting ? 'Sending...' : 'Submit report'}
        </button>
      </div>
    </div>
  );
};

export default RequestPub;
