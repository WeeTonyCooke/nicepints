import { useNavigate } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, Plus, BarChart3 } from 'lucide-react';

const PubDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto pb-24">
      <header className="px-6 pt-12 pb-8 bg-gradient-to-b from-[#1C1F26] to-[#0B0D11] text-center border-b border-[#F5F2EA]/5">
        <button onClick={() => navigate(-1)} className="absolute top-8 left-6 text-[#F5F2EA]/40">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold mb-1 text-[#F5F2EA]">The Toucan</h1>
        <p className="text-sm text-[#F5F2EA]/40 flex items-center justify-center gap-1 mb-6">
          <MapPin className="w-3 h-3" /> Soho, London
        </p>
        <div className="flex flex-col items-center">
          <div className="text-6xl font-black text-[#D4AF37] tracking-tighter mb-2">4.6</div>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-5 h-5 ${s <= 4 ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#F5F2EA]/10'}`} />
            ))}
          </div>
          <p className="text-[10px] uppercase font-black tracking-widest text-[#F5F2EA]/30">842 ratings</p>
        </div>
        <button onClick={() => navigate('/add')} className="mt-6 w-full max-w-[240px] bg-[#D4AF37] text-[#0B0D11] py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 mx-auto">
          <Plus className="w-5 h-5" /> Rate Pint Here
        </button>
      </header>
    </div>
  );
};
export default PubDetail;