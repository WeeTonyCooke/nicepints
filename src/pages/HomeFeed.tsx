import { Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEED_DATA = [
  {
    id: '1',
    user: 'Sean_D',
    pintType: 'Guinness',
    pubName: "Rosato's",
    location: 'Moville, Co. Donegal',
    rating: 5,
    photo: '/rosatos_moville.jpeg', 
    note: 'The lacing on the glass says it all. A top-tier pour.',
    time: 'Just now'
  },
  {
    id: '2',
    user: 'PintTracker',
    pintType: 'Guinness',
    pubName: "Keogh's",
    location: 'Dublin',
    rating: 4.9,
    photo: '/keoghs_dublin.jpeg',
    note: 'Classic Dublin pint, never lets you down.',
    time: '2h ago'
  },
  {
    id: '3',
    user: 'DonegalGal',
    pintType: 'Guinness',
    pubName: "Susie's Bar",
    location: 'Moville, Co. Donegal',
    rating: 4.8,
    photo: '/susies_moville.jpeg',
    note: 'Proper settling and perfect temperature.',
    time: '5h ago'
  },
  {
    id: '4',
    user: 'DublinPints',
    pintType: 'Guinness',
    pubName: "Sandymount House",
    location: 'Dublin',
    rating: 4.7,
    photo: '/sandymounthouse_dublin.jpeg',
    note: 'Great head, very creamy.',
    time: 'Yesterday'
  },
  {
    id: '5',
    user: 'CoastWalker',
    pintType: 'Guinness',
    pubName: "Joe May's",
    location: 'Skerries',
    rating: 4.9,
    photo: '/joymay_skerries.jpeg',
    note: 'Perfect pint after a walk on the pier.',
    time: 'Yesterday'
  }
];

const HomeFeed = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto">
      {/* HERO SECTION - Rosato's as the Local Institution */}
      <section className="relative w-full aspect-[4/5] mb-6 overflow-hidden">
        <img 
          src={FEED_DATA[0].photo} 
          className="w-full h-full object-cover brightness-90" 
          alt="Rosato's" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stout via-transparent to-transparent" />
        
        <div className="absolute bottom-8 left-6">
          <span className="bg-gold text-stout px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shadow-lg">
            Pint of the Day
          </span>
          <h2 className="text-3xl font-bold mt-2 leading-tight">Rosato's: Moville Local Institution</h2>
          <p className="text-cream/60 text-sm italic mt-1">"{FEED_DATA[0].note}"</p>
        </div>
      </section>

      {/* FEED LIST */}
      <div className="px-4 space-y-8 pb-10">
        {FEED_DATA.map((pint) => (
          <article key={pint.id} onClick={() => navigate(`/pint/${pint.id}`)} className="active:scale-[0.98] transition-transform cursor-pointer">
            <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 shadow-xl bg-graphite border border-cream/5">
              <img src={pint.photo} className="w-full h-full object-cover" alt={pint.pubName} />
              <div className="absolute top-4 right-4 bg-stout/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                <span className="text-sm font-bold tracking-tighter">{pint.rating}</span>
              </div>
            </div>
            <div className="px-1 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{pint.pubName}</h3>
                <p className="text-xs text-cream/40 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gold"/> {pint.location}
                </p>
              </div>
              <span className="text-[10px] uppercase font-black text-cream/20 mt-1">{pint.time}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HomeFeed;