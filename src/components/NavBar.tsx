import { NavLink } from 'react-router-dom';
import { Activity, Map, Plus, User, LayoutGrid } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-8 pt-4 bg-gradient-to-t from-stout via-stout to-transparent pointer-events-none">
      <div className="max-w-md mx-auto bg-graphite/80 backdrop-blur-xl rounded-[32px] border border-cream/5 px-4 h-16 flex items-center justify-between shadow-2xl pointer-events-auto">
        
        <NavLink to="/" className={({ isActive }) => `flex-1 flex justify-center transition-colors ${isActive ? 'text-gold' : 'text-cream/30'}`}>
          <Activity className="w-6 h-6" />
        </NavLink>

        <NavLink to="/map" className={({ isActive }) => `flex-1 flex justify-center transition-colors ${isActive ? 'text-gold' : 'text-cream/30'}`}>
          <Map className="w-6 h-6" />
        </NavLink>

        <div className="flex-1 flex justify-center -mt-12">
          <NavLink to="/add" className="w-16 h-16 bg-gold text-stout rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center border-4 border-stout active:scale-90 transition-transform">
            <Plus className="w-8 h-8 stroke-[3]" />
          </NavLink>
        </div>

        <NavLink to="/profile" className={({ isActive }) => `flex-1 flex justify-center transition-colors ${isActive ? 'text-gold' : 'text-cream/30'}`}>
          <User className="w-6 h-6" />
        </NavLink>

        <div className="flex-1 flex justify-center text-cream/30 opacity-50">
          <LayoutGrid className="w-6 h-6" />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;