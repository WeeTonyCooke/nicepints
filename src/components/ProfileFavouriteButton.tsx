import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { isProfileFavourited, toggleProfileFavourite } from '../data/trustSignal';
import { supabase } from '../supabaseClient';

type ProfileFavouriteButtonProps = {
  favouritedUserId: string;
  disabled?: boolean;
};

const ProfileFavouriteButton = ({ favouritedUserId, disabled = false }: ProfileFavouriteButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData.session?.user.id;

        if (!currentUserId || currentUserId === favouritedUserId) {
          if (isMounted) {
            setIsSaved(false);
          }
          return;
        }

        const saved = await isProfileFavourited(favouritedUserId, currentUserId);
        if (isMounted) {
          setIsSaved(saved);
        }
      } catch (loadError) {
        console.error('Failed to load favourite state:', loadError);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [favouritedUserId]);

  const handleToggle = async () => {
    setError(null);

    try {
      const saved = await toggleProfileFavourite(favouritedUserId);
      setIsSaved(saved);
    } catch (toggleError) {
      const message = toggleError instanceof Error ? toggleError.message : 'Could not update save.';
      setError(message);
    }
  };

  if (isLoading || disabled) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => void handleToggle()}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-colors active:scale-95 ${
          isSaved
            ? 'border-sage/40 bg-sage/10 text-sage'
            : 'border-line bg-graphite text-cream/80 hover:text-cream'
        }`}
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        {isSaved ? 'Saved' : 'Save profile'}
      </button>
      {error && <p className="text-xs text-ember/90 text-center max-w-xs">{error}</p>}
    </div>
  );
};

export default ProfileFavouriteButton;
