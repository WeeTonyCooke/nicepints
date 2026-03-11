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
    note: "The lacing says it all. A Moville local institution.",
    time: 'Just now'
  },
  {
    id: '2',
    user: 'BostonPint',
    pintType: 'Guinness',
    pubName: "Emmet's",
    location: 'Boston, MA',
    rating: 4.9,
    photo: '/emmets_boston.jpeg',
    note: 'Best pour in Beacon Hill.',
    time: '1h ago'
  },
  {
    id: '3',
    user: 'PintTracker',
    pintType: 'Guinness',
    pubName: "Keogh's",
    location: 'Dublin, IE',
    rating: 4.9,
    photo: '/keoghs_dublin.jpeg',
    note: 'Classic Dublin pint.',
    time: '2h ago'
  },
  {
    id: '4',
    user: 'SkerriesLocal',
    pintType: 'Guinness',
    pubName: "Joe May's",
    location: 'Skerries, IE',
    rating: 4.8,
    photo: '/joymay_skerries.jpeg',
    note: 'Perfect after a walk on the pier.',
    time: '4h ago'
  },
  {
    id: '5',
    user: 'BostonTraveler',
    pintType: 'Guinness',
    pubName: "McGonagles",
    location: 'Boston, MA',
    rating: 4.7,
    photo: '/mcgonagles_boston.jpeg',
    note: 'Solid Irish pub vibes in Boston.',
    time: '6h ago'
  },
  {
    id: '6',
    user: 'DonegalGal',
    pintType: 'Guinness',
    pubName: "Susie's Bar",
    location: 'Moville, Co. Donegal',
    rating: 4.8,
    photo: '/susies_moville.jpeg',
    note: 'Proper settling and perfect temperature.',
    time: '8h ago'
  },
  {
    id: '7',
    user: 'SouthSide',
    pintType: 'Guinness',
    pubName: "Sandymount House",
    location: 'Dublin, IE',
    rating: 4.7,
    photo: '/sandymounthouse_dublin.jpeg',
    note: 'Very creamy head.',
    time: 'Yesterday'
  },
  {
    id: '8',
    user: 'CityPint',
    pintType: 'Guinness',
    pubName: "The Dubliner",
    location: 'Boston, MA',
    rating: 4.6,
    photo: '/thedubliner_boston.jpeg',
    note: 'Great spot near Government Center.',
    time: 'Yesterday'
  }
];

const HomeFeed = () => {
  const navigate = useNavigate();
  
  // 1. We pick the first one as our Hero
  const pintOfTheDay = FEED_DATA[0];
  
  // 2. We filter the rest of the list to exclude the Hero
  const scrollableFeed = FEED_DATA.filter(pint => pint.id !== pintOfTheDay.id);

  return (
    <div className="max-w-md mx-auto">
      {/* HERO SECTION - Pint of the Day */}
      <section className="relative w-full aspect-[4/5] mb-6 overflow-hidden">
        <img 
          src={pintOfTheDay.photo} 
          className="w-full h-full object-cover brightness-90" 
          alt="Featured Pint" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stout via-transparent to-transparent" />
        <div className="absolute bottom-8 left-6">
          <span className="bg-gold text-stout px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shadow-lg">
            Pint of the Day
          </span>
          <h2 className="text-3xl font-bold mt-2 leading-tight">{pintOfTheDay.pubName}: Local Institution</h2>
          <p className="text-cream/60 text-sm italic mt-1">"{pintOfTheDay.note}"</p>
        </div>
      </section>

      {/* FEED LIST - Excludes the hero pint */}
      <div className="px-4 space-y-8 pb-32">
        {scrollableFeed.map((pint) => (
          <article key={pint.id} onClick={() => navigate(`/pint/${pint.id}`)} className="active:scale-[0.98] transition-transform cursor-pointer">
            <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 shadow-xl bg-graphite border border-cream/5">
              <img src={pint.photo} className="w-full h-full object-cover" alt={pint.pubName} />
              <div className="absolute top-4 right-4 bg-stout/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                <span className="text-sm font-bold">{pint.rating}</span>
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