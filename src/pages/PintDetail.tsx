import { useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, MapPin } from 'lucide-react';

const PintDetail = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto pb-32 text-[#F5F2EA]">
      <section className="relative w-full aspect-[4/5]">
        <img src="https://images.unsplash.com/photo-1597075416743-43f14068f69e?w=800" className="w-full h-full object-cover" alt="Pint" />
        <button onClick={() => navigate(-1)} className="absolute top-12 left-6 p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="absolute bottom-6 right-6 bg-[#D4AF37] text-[#0B0D11] px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
          <Star className="w-5 h-5 fill-current" />
          <span className="text-xl font-black">5.0</span>
        </div>
      </section>
      <main className="px-6 py-8">
        <h2 className="text-2xl font-bold mb-1">Grogans</h2>
        <p className="text-sm text-[#F5F2EA]/40 mb-4 flex items-center gap-1"><MapPin className="w-3 h-3" /> Dublin, IE • Guinness</p>
        <p className="text-lg italic leading-relaxed text-[#F5F2EA]/80">"The settling process was a work of art. Temperature is pinpoint."</p>
      </main>
    </div>
  );
};
export default PintDetail;