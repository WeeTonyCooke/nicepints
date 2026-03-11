import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Star } from 'lucide-react';

const AddPint = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  return (
    <div className="max-w-md mx-auto px-6 pt-8 pb-20">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Log a Pint</h1>
        <button onClick={() => navigate(-1)} className="text-[#F5F2EA]/40">Cancel</button>
      </header>

      <div className="space-y-8">
        <div className="aspect-[4/5] bg-[#1C1F26] rounded-3xl border-2 border-dashed border-[#F5F2EA]/10 flex flex-col items-center justify-center">
          <Camera className="w-10 h-10 text-[#D4AF37] mb-2" />
          <p className="text-sm font-bold text-[#F5F2EA]/40">Snap the pint</p>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] uppercase font-black tracking-widest text-[#F5F2EA]/40">Verified Pub</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-[#D4AF37]" />
            <input 
              type="text" 
              placeholder="Search Google Places..." 
              className="w-full bg-[#1C1F26] rounded-2xl py-3.5 pl-12 pr-4 text-[#F5F2EA] border border-[#F5F2EA]/5 focus:ring-2 focus:ring-[#D4AF37]/50 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 py-4">
          {[1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setRating(s)} className="active:scale-90 transition-transform">
              <Star className={`w-8 h-8 ${rating >= s ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#1C1F26] fill-[#1C1F26]'}`} strokeWidth={1} />
            </button>
          ))}
        </div>

        <button onClick={() => navigate('/')} className="w-full bg-[#F5F2EA] text-[#0B0D11] py-4 rounded-2xl font-black text-lg active:scale-95 transition-transform">
          Post Pint
        </button>
      </div>
    </div>
  );
};
export default AddPint;
