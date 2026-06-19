import { NavLink } from 'react-router-dom';
import { Activity, MapPin, Plus, User } from 'lucide-react';

type NavItem = { to: string; icon: React.ComponentType<{ className?: string }>; label: string };

const LINKS: NavItem[] = [
  { to: '/',        icon: Activity, label: 'Feed'    },
  { to: '/map',     icon: MapPin,   label: 'Find'    },
  { to: '/profile', icon: User,     label: 'Profile' },
];

const NavBar = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-[100] px-5 pb-safe-nav pt-4 bg-gradient-to-t from-stout via-stout/90 to-transparent pointer-events-none">
    <div className="max-w-md mx-auto bg-graphite/80 backdrop-blur-xl rounded-[32px] border border-cream/5 h-16 flex items-center shadow-2xl pointer-events-auto overflow-hidden">

      {LINKS.map((link, i) => {
        // Insert the plus button between index 1 and 2
        const isMiddle = i === 1;
        return (
          <div key={link.to} className="contents">
            <NavLink
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${isActive ? 'text-gold' : 'text-cream/30'}`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon className="w-5 h-5" />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-gold' : 'text-cream/20'}`}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>

            {/* Central Add button — injected after Nearby */}
            {isMiddle && (
              <div className="flex-1 flex justify-center -mt-8">
                <NavLink
                  to="/add"
                  className="w-14 h-14 bg-gold rounded-full shadow-[0_0_24px_rgba(212,175,55,0.3)] flex items-center justify-center border-4 border-stout active:scale-90 transition-transform"
                >
                  <Plus className="w-7 h-7 stroke-[3] text-stout" />
                </NavLink>
              </div>
            )}
          </div>
        );
      })}

    </div>
  </nav>
);

export default NavBar;
