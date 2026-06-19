import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, MapPin } from 'lucide-react';
import { submitPubRequest } from '../data/moderation';
import { useAuth } from '../Context/AuthContext';

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
      const message = err instanceof Error ? err.message : 'Could not submit request.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-5 pt-safe-header text-cream text-center">
        <p className="text-5xl mb-4">🍺</p>
        <h1 className="font-display font-black text-2xl mb-3">Request received</h1>
        <p className="text-cream/60 text-sm mb-8 leading-relaxed">
          Thanks — we&apos;ll review <strong className="text-cream">{pubName}</strong> in{' '}
          {city} and add it when we can.
        </p>
        <button
          type="button"
          onClick={() => navigate('/add')}
          className="w-full py-4 rounded-2xl font-black bg-gold text-stout active:scale-95 transition-transform"
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
          <p className="text-[9px] uppercase font-black tracking-[0.18em] text-cream/25">
            Nice<span className="text-gold/60">Pints</span>
          </p>
          <h1 className="font-display font-black text-xl">Request a pub</h1>
        </div>
      </header>

      <p className="text-sm text-cream/50 mb-6 leading-relaxed">
        Can&apos;t find your local? Tell us the name and town — we&apos;ll add it to the list.
      </p>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
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
            Anything else? (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Serves Guinness 0.0 on draught, etc."
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
          {isSubmitting ? 'Sending...' : 'Submit request'}
        </button>
      </div>
    </div>
  );
};

export default RequestPub;
