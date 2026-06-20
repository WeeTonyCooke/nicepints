import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { DATA_CONTROLLER_NAME, SUPPORT_EMAIL } from '../config/support';

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
                ? 'text-gold border-gold/40 bg-gold/10'
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
                Report a wrong or duplicate pub listing
              </Link>
            </p>
          </>
        )}

        {section === 'privacy' && (
          <>
            <h2 className="font-display font-black text-2xl text-cream">Privacy Policy</h2>
            <p className="text-cream/40 text-xs">Last updated: June 2025</p>

            <p>
              <strong className="text-cream">Who we are.</strong> {DATA_CONTROLLER_NAME} operates
              NicePints. For privacy questions or to exercise your rights, contact us at{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>

            <p>
              <strong className="text-cream">What we collect.</strong> When you use NicePints we
              may process: your email address (for sign-in), display name, pint ratings, optional
              comments, photos you upload, pub/place selections, and approximate location when you
              use map or nearby features. If you sign in with Google, we receive basic profile
              information from Google (such as your name and email) as permitted by your Google
              account settings.
            </p>

            <p>
              <strong className="text-cream">How we use data.</strong> We use your information to
              operate the app (show your ratings, the feed, pub search, and account features),
              prevent abuse, and improve the service. We may publish aggregated, anonymous
              statistics without identifying individuals.
            </p>

            <p>
              <strong className="text-cream">Legal bases (GDPR).</strong> We process personal data
              on these bases: <em>contract</em> — to provide the service you sign up for;{' '}
              <em>legitimate interests</em> — to keep the app secure, fix bugs, and understand
              usage; <em>consent</em> — where required (e.g. optional features). You may withdraw
              consent where it applies without affecting lawfulness of prior processing.
            </p>

            <p>
              <strong className="text-cream">Processors.</strong> We use trusted providers who
              process data on our behalf: Supabase (database, authentication, file storage), Netlify
              (website hosting), and Google (Places search for pub lookup, and Google Sign-In when
              you choose it). These providers are bound by contracts and process data only as we
              instruct.
            </p>

            <p>
              <strong className="text-cream">Storage &amp; photos.</strong> Data is stored in
              Supabase (EU/US regions depending on project configuration). Photos are stored in
              secure cloud storage with public URLs for display in the feed. Before upload, photos
              are resized in your browser; location metadata (EXIF) is not intentionally retained.
            </p>

            <p>
              <strong className="text-cream">International transfers.</strong> Some processors may
              store or process data outside the European Economic Area. Where this occurs, we rely
              on appropriate safeguards such as Standard Contractual Clauses or equivalent
              mechanisms offered by our providers.
            </p>

            <p>
              <strong className="text-cream">Retention.</strong> We keep your account and content
              while you use NicePints. If you delete your account, we remove your pints and log a
              deletion request; sign-in identifiers are removed from active use within 30 days.
            </p>

            <p>
              <strong className="text-cream">Your rights.</strong> If you are in the EEA/UK, you
              have the right to access, rectify, erase, restrict, object, and port your data, and to
              withdraw consent. You can delete your pints and request account deletion from Profile
              → Settings. You may also contact us at {SUPPORT_EMAIL}. You have the right to lodge a
              complaint with your supervisory authority — in Ireland, the Data Protection
              Commission:{' '}
              <a
                href="https://www.dataprotection.ie"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline"
              >
                dataprotection.ie
              </a>
              .
            </p>

            <p>
              <strong className="text-cream">Children.</strong> NicePints is not intended for users
              below the legal drinking age in their jurisdiction.
            </p>

            <p>
              <strong className="text-cream">Cookies.</strong> We do not use advertising or
              analytics cookies in the app today. Essential session storage is used for sign-in and
              age-gate preferences.
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
