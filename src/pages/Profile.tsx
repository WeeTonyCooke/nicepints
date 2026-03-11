import { Settings, MapPin, Trophy } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-md mx-auto pb-24 text-[#F5F2EA]">
      <header className="px-6 pt-12 pb-8 bg-gradient-to-b from-[#1C1F26] to-[#0B0D11]">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37] p-1">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400" className="w-full h-full rounded-full object-cover" alt="User" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Sean_D</h1>
              <p className="text-sm text-[#F5F2EA]/40 flex items-center gap-1"><MapPin className="w-3 h-3" /> Dublin, IE</p>
            </div>
          </div>
          <button className="p-2 bg-[#1C1F26] rounded-full border border-[#F5F2EA]/5"><Settings className="w-5 h-5 opacity-40" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1C1F26] p-4 rounded-2xl border border-[#F5F2EA]/5">
            <p className="text-[10px] uppercase font-black tracking-widest text-[#F5F2EA]/30 mb-1">Total Pints</p>
            <p className="text-2xl font-black">124</p>
          </div>
          <div className="bg-[#1C1F26] p-4 rounded-2xl border border-[#F5F2EA]/5">
            <p className="text-[10px] uppercase font-black tracking-widest text-[#F5F2EA]/30 mb-1">Avg Rating</p>
            <p className="text-2xl font-black text-[#D4AF37]">4.2</p>
          </div>
        </div>
      </header>
    </div>
  );
};
export default Profile;