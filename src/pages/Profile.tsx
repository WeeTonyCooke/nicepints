import { Settings, MapPin, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FEED_DATA } from '../data';

const PASSPORT = {
  totalPints: 124,
  avgRating: 4.2,
  pubsVisited: 34,
  countries: ['Ireland', 'USA', 'UK', 'Germany', 'France', 'Australia', 'Spain', 'Canada'],
};

const Profile = () => {
  const navigate = useNavigate();
  const myPints = FEED_DATA.filter(p => p.user === 'Sean_D').concat(FEED_DATA.slice(0, 6));

  return (
    <div className="max-w-md mx-auto pb-24 text-cream">
      {/* Header */}
      <header className="px-5 pt-12 pb-7 bg-gradient-to-b from-graphite to-stout">

        {/* Wordmark + settings */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-[9px] uppercase font-black tracking-[0.18em] text-cream/25">
            Nice<span className="text-gold/60">Pints</span>
          </p>
          <button className="p-2 bg-stout rounded-full border border-cream/5">
            <Settings className="w-4 h-4 text-cream/30" />
          </button>
        </div>

        {/* User identity */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-20 h-20 rounded-full border-2 border-gold p-0.5 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400"
              className="w-full h-full rounded-full object-cover"
              alt="User"
            />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-tight leading-tight">Sean_D</h1>
            <p className="text-sm text-cream/40 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-gold" /> Dublin, Ireland
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Total Pints',   value: PASSPORT.totalPints,               colour: 'text-cream' },
            { label: 'Avg Rating',    value: PASSPORT.avgRating.toFixed(1),      colour: 'text-gold' },
            { label: 'Pubs Visited',  value: PASSPORT.pubsVisited,               colour: 'text-cream' },
            { label: 'Countries',     value: PASSPORT.countries.length,          colour: 'text-cream' },
          ].map(({ label, value, colour }) => (
            <div key={label} className="bg-stout/70 p-4 rounded-2xl border border-cream/5">
              <p className="text-[9px] uppercase font-black tracking-[0.15em] text-cream/25 mb-1">{label}</p>
              <p className={`font-display font-black text-3xl leading-none ${colour}`}>{value}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Pint Passport */}
      <section className="px-5 pt-7 pb-7 border-b border-cream/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[9px] uppercase font-black tracking-[0.18em] text-cream/30">Pint Passport</h2>
          {/* Share button — the mechanic that drives organic spread */}
          <button className="flex items-center gap-1.5 bg-graphite border border-cream/10 px-3 py-1.5 rounded-full text-[10px] font-black text-cream/50 active:scale-95 transition-transform">
            <Share2 className="w-3 h-3" />
            Share
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {PASSPORT.countries.map((country) => (
            <span
              key={country}
              className="bg-graphite border border-cream/10 text-cream/60 px-3 py-1.5 rounded-full text-xs font-bold"
            >
              {country}
            </span>
          ))}
        </div>

        <p className="text-xs text-cream/25 font-medium">
          {PASSPORT.pubsVisited} pubs across {PASSPORT.countries.length} countries
        </p>
      </section>

      {/* Pint gallery */}
      <section className="px-5 pt-7">
        <h2 className="text-[9px] uppercase font-black tracking-[0.18em] text-cream/30 mb-4">My Pints</h2>
        <div className="grid grid-cols-3 gap-2">
          {myPints.map((pint, i) => (
            <div
              key={`${pint.id}-${i}`}
              onClick={() => navigate(`/pint/${pint.id}`)}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform bg-graphite"
            >
              <img src={pint.photo} className="w-full h-full object-cover" alt={pint.pubName} />
              <div className="absolute inset-0 bg-gradient-to-t from-stout/80 to-transparent" />
              <div className="absolute bottom-1.5 right-1.5">
                <span className="text-[10px] font-black text-gold">{pint.rating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
