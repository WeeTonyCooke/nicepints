import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

type LegalSection = 'about' | 'privacy' | 'terms' | 'responsible';

const SECTIONS: { id: LegalSection; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'terms', label: 'Terms' },
  { id: 'responsible', label: 'Drink responsibly' },
];

const Legal = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const section = (searchParams.get('section') as LegalSection) || 'about';

  const setSection = (id: LegalSection) => {
    setSearchParams({ section: id });
  };

  return (
    <div className="max-w-md mx-auto text-cream pb-safe-feed">
      <header className="px-5 pt-safe-header pb-4 flex items-center gap-3">
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
          <h1 className="font-display font-black text-xl">Legal &amp; info</h1>
        </div>
      </header>

      <div className="px-5 mb-6 flex gap-2 overflow-x-auto pb-1">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSection(id)}
            className={`shrink-0 px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
              section === id
                ? 'bg-gold text-stout border-gold'
                : 'bg-graphite text-cream/40 border-cream/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <article className="px-5 prose-legal text-sm text-cream/70 leading-relaxed space-y-4">
        {section === 'about' && (
          <>
            <h2 className="font-display font-black text-2xl text-cream">About NicePints</h2>
            <p>
              NicePints helps you discover and log great pub pours — starting with Guinness and
              expanding to more products over time. Rate what you drink, share photos, and find
              highly rated pints near you.
            </p>
            <p>
              User-generated content (photos, ratings, comments) is posted by community members.
              We moderate reports of inappropriate content.
            </p>
            <p>
              <Link to="/request-pub" className="text-gold font-bold underline">
                Request a missing pub
              </Link>
            </p>
          </>
        )}

        {section === 'privacy' && (
          <>
            <h2 className="font-display font-black text-2xl text-cream">Privacy Policy</h2>
            <p className="text-cream/40 text-xs">Last updated: June 2025</p>
            <p>
              NicePints (&quot;we&quot;) collects information you provide when using the app:
              email address (for sign-in), display name, pint ratings, optional comments, photos
              you upload, and approximate location when you choose to use nearby features or post
              with location enabled.
            </p>
            <p>
              <strong className="text-cream">How we use data:</strong> to operate the app, show
              your ratings and feed, calculate nearby pubs, and improve the service. Aggregated,
              anonymous statistics (e.g. popular tags or trends) may be published without
              identifying individuals.
            </p>
            <p>
              <strong className="text-cream">Storage:</strong> data is stored using Supabase
              (hosting and database). Photos are stored in secure cloud storage with public URLs
              for display in the feed.
            </p>
            <p>
              <strong className="text-cream">Your rights:</strong> you may request deletion of
              your account and associated content by contacting us. You can sign out at any time
              from your profile.
            </p>
            <p>
              <strong className="text-cream">Children:</strong> NicePints is not intended for
              users below the legal drinking age in their jurisdiction.
            </p>
            <p>
              Contact: add your support email before App Store submission.
            </p>
          </>
        )}

        {section === 'terms' && (
          <>
            <h2 className="font-display font-black text-2xl text-cream">Terms of Service</h2>
            <p className="text-cream/40 text-xs">Last updated: June 2025</p>
            <p>
              By using NicePints you agree to these terms. If you do not agree, do not use the
              app.
            </p>
            <p>
              <strong className="text-cream">Your content:</strong> you retain ownership of photos
              and text you post. You grant us a licence to display, store, and distribute that
              content within the app and for promoting NicePints (e.g. shared links).
            </p>
            <p>
              <strong className="text-cream">Acceptable use:</strong> do not post illegal,
              offensive, or misleading content; do not harass others; do not spam fake ratings.
              We may remove content and suspend accounts that violate these rules.
            </p>
            <p>
              <strong className="text-cream">Reports:</strong> use the report button on any pint
              you believe violates these terms. We review reports and may remove content.
            </p>
            <p>
              <strong className="text-cream">Disclaimer:</strong> ratings reflect user opinions,
              not professional advice. Drink responsibly. We are not responsible for decisions
              you make based on ratings or pub listings.
            </p>
            <p>
              <strong className="text-cream">Changes:</strong> we may update these terms; continued
              use constitutes acceptance.
            </p>
          </>
        )}

        {section === 'responsible' && (
          <>
            <h2 className="font-display font-black text-2xl text-cream">Drink responsibly</h2>
            <p>
              NicePints celebrates quality pours — not excessive drinking. Please enjoy alcohol
              responsibly and in line with the law where you live.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Know your limits.</li>
              <li>Never drink and drive.</li>
              <li>Look out for yourself and others.</li>
              <li>If you are struggling with alcohol, seek support from a qualified service.</li>
            </ul>
            <p className="text-cream/50 text-xs">
              Ireland: HSE —{' '}
              <a
                href="https://www2.hse.ie/living-well/alcohol/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline"
              >
                hse.ie/alcohol
              </a>
            </p>
          </>
        )}
      </article>
    </div>
  );
};

export default Legal;
