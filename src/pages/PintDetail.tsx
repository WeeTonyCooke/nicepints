import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Share2 } from 'lucide-react';
// Import the same data so we can find the specific pint
import { FEED_DATA } from './HomeFeed'; 

const PintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pint = FEED_DATA.find(p => p.id === id);

  if (!pint) return <div className="p-10 text-center text-gold">Pint not found...</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-stout">
      {/* HEADER PHOTO */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-6 z-50 p-3 bg-stout/40 backdrop-blur-md rounded-full border border-white/10"
        >
          <ArrowLeft className="w-6 h-6 text-cream" />
        </button>
        
        <img src={pint.photo || '/rosatos_moville.jpeg'} className="w-full h-full object-cover" alt="Pint" />
        <div className="absolute inset-0 bg-gradient-to-t from-stout via-transparent to-transparent" />
      </div>

      {/* PINT INFO */}
      <div className="px-6 -mt-20 relative z-10 pb-20">
        <div className="bg-graphite/90 backdrop-blur-xl p-6 rounded-[2.5rem] border border-cream/10 shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-cream leading-tight">{pint.pubName}</h1>
              <p className="text-gold flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-4 h-4" /> {pint.location}
              </p>
            </div>
            <div className="bg-gold text-stout px-3 py-1 rounded-xl flex items-center gap-1 font-black">
              <Star className="w-4 h-4 fill-stout" />
              {pint.rating}.0
            </div>
          </div>

          <p className="text-xl text-cream/90 italic leading-relaxed mb-6">
            "{pint.comment}"
          </p>

          <div className="flex gap-3">
            <button className="flex-1 bg-cream text-stout font-bold py-4 rounded-2xl active:scale-95 transition-transform">
              Get Directions
            </button>
            <button className="p-4 bg-graphite border border-cream/10 rounded-2xl active:scale-95 transition-transform text-cream">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] text-cream/20 uppercase font-black tracking-[0.3em]">
          Log Entry: {pint.time} • Posted by {pint.user}
        </p>
      </div>
    </div>
  );
};

export default PintDetail;