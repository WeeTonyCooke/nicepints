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
    <div className="max-w-md mx-auto bg-graphite/95 backdrop-blur-xl rounded-full border border-line h-16 flex items-center shadow-2xl pointer-events-auto overflow-hidden">

      {LINKS.map((link, i) => {
        const isMiddle = i === 1;
        return (
          <div key={link.to} className="contents">
            <NavLink
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${isActive ? 'text-gold' : 'text-muted'}`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon className="w-5 h-5" />
                  <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-gold' : 'text-muted'}`}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>

            {isMiddle && (
              <div className="flex-1 flex justify-center -mt-8">
                <NavLink
                  to="/add"
                  className="w-12 h-12 bg-gold rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform"
                >
                  <Plus className="w-6 h-6 stroke-[2.5] text-stout" />
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
