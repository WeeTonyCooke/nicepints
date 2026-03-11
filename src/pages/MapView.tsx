import { useState } from 'react';
import { Star, Navigation, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MapView = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto">
      <div className="h-40 bg-[#1C1F26] flex items-center justify-center relative grayscale opacity-40">
        <Navigation className="text-[#D4AF37] animate-pulse" />
      </div>

      <main className="px-6 -mt-6 relative z-10 space-y-6">
        <div className="flex bg-[#1C1F26] p-1.5 rounded-2xl border border-[#F5F2EA]/5 shadow-2xl">
          <button className="flex-1 py-2 text-[10px] font-black uppercase rounded-xl bg-[#D4AF37] text-[#0B0D11]">Nearest</button>
          <button className="flex-1 py-2 text-[10px] font-black uppercase rounded-xl text-[#F5F2EA]/40">Top Rated</button>
        </div>

        <div onClick={() => navigate('/pub/grogans')} className="bg-[#1C1F26] p-4 rounded-3xl flex items-center gap-4 border border-[#F5F2EA]/5 active:scale-95 transition-transform cursor-pointer">
          <div className="w-14 h-14 bg-[#0B0D11] rounded-2xl flex items-center justify-center font-black text-[#D4AF37] uppercase">G</div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Grogans</h3>
              <div className="flex items-center gap-1"><Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]"/> <span className="text-xs font-black">4.9</span></div>
            </div>
            <p className="text-[10px] font-black text-[#F5F2EA]/40 mt-1 uppercase tracking-tight">200m away • 1,240 ratings</p>
          </div>
        </div>
      </main>
    </div>
  );
};
export default MapView;
