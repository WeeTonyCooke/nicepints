import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchOwnTrustSignal, fetchUserDisplayName } from '../data';
import { useAuth } from '../Context/AuthContext';
import AuthorAttribution from '../components/AuthorAttribution';
import ProfileFavouriteButton from '../components/ProfileFavouriteButton';
import LoadError from '../components/LoadError';

const PublicUserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isRecognized, setIsRecognized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!userId) {
      setLoadError('Profile not found.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const [name, trustSignal] = await Promise.all([
        fetchUserDisplayName(userId),
        fetchOwnTrustSignal(userId),
      ]);

      if (!name) {
        setLoadError('Profile not found.');
        return;
      }

      setDisplayName(name);
      setIsRecognized(trustSignal?.isRecognized ?? false);
    } catch (error) {
      console.error('Failed to load public profile:', error);
      setLoadError(error instanceof Error ? error.message : 'Could not load profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center">
        <p className="text-muted text-base">Loading profile...</p>
      </div>
    );
  }

  if (loadError || !displayName || !userId) {
    return <LoadError message={loadError ?? 'Profile not found.'} onRetry={loadProfile} />;
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="max-w-md mx-auto px-5 pt-safe-header-compact pb-safe-feed text-cream">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 p-2.5 bg-graphite rounded-full border border-line active:scale-90 transition-transform"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="text-center">
        <AuthorAttribution
          name={displayName}
          isRecognized={isRecognized}
          className="justify-center mb-3"
          nameClassName="font-display font-black text-3xl tracking-tight"
        />

        {!isOwnProfile && currentUser && (
          <ProfileFavouriteButton favouritedUserId={userId} />
        )}
      </div>
    </div>
  );
};

export default PublicUserProfile;
