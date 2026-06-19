import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, ChevronDown, Loader2, X } from 'lucide-react';
import {
  PINT_TYPES,
  type PintType,
  type ServingType,
  resolvePubIdFromCandidate,
  saveLivePint,
  type PubPlaceCandidate,
} from '../data';
import { useAuth } from '../Context/AuthContext';
import PostAuthSheet from '../components/PostAuthSheet';
import PubSearchPicker, { type PubSelection } from '../components/PubSearchPicker';
import { isNativePlatform, pickPhotoFromDevice } from '../utils/photoPicker';
import { validateAndPreparePintPhoto } from '../utils/photoUpload';

const RATING_LABELS = [
  '',
  'Undrinkable',
  'Brutal',
  'Poor',
  'Below Avg',
  'Decent',
  'Good',
  'Very Good',
  'Great',
  'Serious',
  'Exceptional',
];

const AddPint = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPubId = searchParams.get('pubId');
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingPostRef = useRef(false);

  const [rating, setRating] = useState(0);
  const [pintType, setPintType] = useState<PintType>('Guinness');
  const [servingType, setServingType] = useState<ServingType>('draught');
  const [comment, setComment] = useState('');
  const [selectedPubId, setSelectedPubId] = useState<string | null>(null);
  const [pendingPubCandidate, setPendingPubCandidate] = useState<PubPlaceCandidate | null>(null);

  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isPickingPhoto, setIsPickingPhoto] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const setPhoto = (file: File) => {
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotoFile(file);
    setPhotoPreviewUrl(previewUrl);
  };

  const applyPhoto = async (file: File) => {
    setPostError(null);

    try {
      const prepared = await validateAndPreparePintPhoto(file);
      setPhoto(prepared);
    } catch (err) {
      console.error('Invalid photo:', err);
      const message = err instanceof Error ? err.message : 'Invalid photo.';
      setPostError(message);
    }
  };

  const openCameraOrGallery = async () => {
    setPostError(null);

    if (isNativePlatform()) {
      setIsPickingPhoto(true);

      try {
        const file = await pickPhotoFromDevice();
        if (file) {
          await applyPhoto(file);
        }
      } catch (err) {
        console.error('Failed to pick photo:', err);
        const message = err instanceof Error ? err.message : 'Could not access camera or gallery.';
        setPostError(message);
      } finally {
        setIsPickingPhoto(false);
      }

      return;
    }

    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    await applyPhoto(file);
  };

  const clearPhoto = () => {
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    setPhotoFile(null);
    setPhotoPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const requiresServingType = pintType === 'Guinness 0.0';

  const resolvePubForPost = async (): Promise<string | null> => {
    if (selectedPubId) {
      return selectedPubId;
    }

    if (!pendingPubCandidate) {
      return null;
    }

    const pubId = await resolvePubIdFromCandidate(pendingPubCandidate);
    setSelectedPubId(pubId);
    setPendingPubCandidate(null);
    return pubId;
  };

  const doPost = async () => {
    if (!rating || !photoFile) {
      return;
    }

    if (!selectedPubId && !pendingPubCandidate) {
      return;
    }

    if (requiresServingType && servingType === 'unknown') {
      setPostError('Choose draught or can for Guinness 0.0.');
      return;
    }

    setIsPosting(true);
    setPostError(null);

    try {
      const pubId = await resolvePubForPost();
      if (!pubId) {
        throw new Error('Select a pub before posting.');
      }

      await saveLivePint({
        rating,
        pintType,
        servingType: requiresServingType ? servingType : servingType === 'unknown' ? 'draught' : servingType,
        comment,
        pubId,
        photoFile: photoFile as File,
      });

      navigate('/');
    } catch (err) {
      console.error('Failed to save pint:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setPostError(`Ah, something went wrong with the pour: ${message}`);
    } finally {
      setIsPosting(false);
    }
  };

  const handlePubSelected = (selection: PubSelection) => {
    if (selection.status === 'resolved') {
      setSelectedPubId(selection.pubId);
      setPendingPubCandidate(null);
      return;
    }

    setSelectedPubId(null);
    setPendingPubCandidate(selection.candidate);
  };

  const handlePost = async () => {
    if (!rating || (!selectedPubId && !pendingPubCandidate) || !photoFile) {
      return;
    }

    if (!user) {
      pendingPostRef.current = true;
      setShowAuthSheet(true);
      return;
    }

    await doPost();
  };

  useEffect(() => {
    if (user && pendingPostRef.current && !isPosting) {
      pendingPostRef.current = false;
      setShowAuthSheet(false);
      void doPost();
    }
  }, [user, isPosting]);

  const hasPub = selectedPubId !== null || pendingPubCandidate !== null;

  const canPost =
    rating > 0 &&
    hasPub &&
    !!photoFile &&
    !isPosting &&
    (!requiresServingType || servingType !== 'unknown');

  const postButtonLabel = () => {
    if (isPosting) return 'Posting...';
    if (!photoFile) return 'Add a photo to post';
    if (rating === 0) return 'Select a rating to post';
    if (!hasPub) return 'Select a pub to post';
    if (!user) return 'Sign in to post';
    return 'Post Pint';
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-safe-header">
      <header className="flex justify-between items-center mb-8">
        <div>
          <p className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-0.5">
            Nice<span className="text-gold">Pints</span>
          </p>
          <h1 className="font-display font-black text-2xl">Log a Pint</h1>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-cream/40 text-sm font-medium px-3 py-1.5 rounded-xl bg-graphite border border-cream/5 active:scale-95 transition-transform"
        >
          Cancel
        </button>
      </header>

      {postError && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {postError}
        </div>
      )}

      <div className="space-y-7">
        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-gold mr-1.5">1</span>Photo <span className="text-gold">*</span>
          </label>

          {!isNativePlatform() && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              onChange={handlePhotoChange}
              className="hidden"
            />
          )}

          {photoPreviewUrl ? (
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-cream/10 bg-graphite">
              <img
                src={photoPreviewUrl}
                alt={photoFile?.name ?? 'Selected pint photo'}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  type="button"
                  onClick={openCameraOrGallery}
                  disabled={isPickingPhoto}
                  className="w-10 h-10 rounded-full bg-stout/85 backdrop-blur border border-cream/10 flex items-center justify-center text-gold disabled:opacity-50"
                >
                  {isPickingPhoto ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={clearPhoto}
                  className="w-10 h-10 rounded-full bg-stout/85 backdrop-blur border border-cream/10 flex items-center justify-center text-cream/80"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-stout/90 to-transparent">
                <p className="text-xs text-cream/70 truncate">
                  {photoFile?.name ?? 'Photo selected'}
                </p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={openCameraOrGallery}
              disabled={isPickingPhoto}
              className="w-full aspect-[4/5] bg-graphite rounded-2xl border-2 border-dashed border-cream/10 flex flex-col items-center justify-center active:border-gold/40 transition-colors cursor-pointer group disabled:opacity-60"
            >
              <div className="w-16 h-16 rounded-2xl bg-stout flex items-center justify-center mb-3 group-active:bg-gold/10 transition-colors">
                {isPickingPhoto ? (
                  <Loader2 className="w-7 h-7 text-gold animate-spin" />
                ) : (
                  <Camera className="w-7 h-7 text-gold" />
                )}
              </div>
              <p className="text-sm font-bold text-cream/40">
                {isPickingPhoto ? 'Opening camera...' : 'Snap the pint'}
              </p>
              <p className="text-xs text-cream/20 mt-1">Required — tap to open camera or gallery</p>
            </button>
          )}
        </div>

        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-3 block">
            <span className="text-gold mr-1.5">2</span>How was it?
          </label>

          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => setRating(score)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all active:scale-90 ${
                  rating === score
                    ? 'bg-gold border-gold'
                    : score < rating
                    ? 'bg-gold/15 border-gold/25'
                    : 'bg-graphite border-cream/5'
                }`}
              >
                <span
                  className={`text-lg font-black leading-none ${
                    rating === score
                      ? 'text-stout'
                      : score < rating
                      ? 'text-gold'
                      : 'text-cream/25'
                  }`}
                >
                  {score}
                </span>
                <span
                  className={`text-[8px] font-black uppercase tracking-wide leading-none text-center px-1 ${
                    rating === score
                      ? 'text-stout/60'
                      : score < rating
                      ? 'text-gold/50'
                      : 'text-cream/15'
                  }`}
                >
                  {RATING_LABELS[score]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <PubSearchPicker
          initialPubId={preselectedPubId}
          onPubSelected={handlePubSelected}
        />

        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-gold mr-1.5">4</span>What are you drinking?
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTypeMenu((prev) => !prev)}
              className="w-full bg-graphite rounded-2xl py-4 px-4 text-left border border-cream/5 flex items-center justify-between transition-all"
            >
              <span className="text-cream text-sm font-bold">{pintType}</span>
              <ChevronDown
                className={`w-4 h-4 text-cream/30 transition-transform ${
                  showTypeMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showTypeMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-graphite border border-cream/10 rounded-2xl overflow-hidden shadow-2xl z-20">
                {PINT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setPintType(type);
                      if (type === 'Guinness 0.0') {
                        setServingType('draught');
                      } else if (type === 'Guinness') {
                        setServingType('draught');
                      } else {
                        setServingType('unknown');
                      }
                      setShowTypeMenu(false);
                    }}
                    className={`w-full px-4 py-3.5 text-left text-sm font-medium border-b border-cream/5 last:border-0 transition-colors ${
                      pintType === type
                        ? 'text-gold font-bold bg-gold/5'
                        : 'text-cream/70 active:bg-cream/5'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(requiresServingType || pintType === 'Guinness') && (
            <div className="mt-3">
              <p className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2">
                How was it served? {requiresServingType && <span className="text-gold">*</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {(requiresServingType
                  ? (['draught', 'can'] as ServingType[])
                  : (['draught', 'can', 'bottle'] as ServingType[])
                ).map((serve) => (
                  <button
                    key={serve}
                    type="button"
                    onClick={() => setServingType(serve)}
                    className={`px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                      servingType === serve
                        ? 'bg-gold text-stout border-gold'
                        : 'bg-stout text-cream/50 border-cream/10'
                    }`}
                  >
                    {serve === 'draught' ? 'On draught' : serve}
                  </button>
                ))}
              </div>
              {pintType === 'Guinness 0.0' && (
                <p className="text-[10px] text-cream/30 mt-2">
                  Draught 0.0 is what most people are searching for.
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-gold mr-1.5">5</span>Anything to add?
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was it, honestly?"
            maxLength={120}
            rows={3}
            className="w-full bg-graphite rounded-2xl py-4 px-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none resize-none transition-all font-display italic"
          />
        </div>

        <button
          type="button"
          onClick={handlePost}
          disabled={!canPost}
          className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
            canPost
              ? 'bg-cream text-stout shadow-lg shadow-cream/10'
              : 'bg-graphite text-cream/20 cursor-not-allowed border border-cream/5'
          }`}
        >
          {isPosting && <Loader2 className="w-5 h-5 animate-spin" />}
          {postButtonLabel()}
        </button>

        <p className="text-center text-[10px] text-cream/20 pb-4">
          Drink responsibly.{' '}
          <button
            type="button"
            onClick={() => navigate('/legal?section=responsible')}
            className="underline"
          >
            Learn more
          </button>
        </p>
      </div>

      <PostAuthSheet
        isOpen={showAuthSheet}
        onClose={() => {
          pendingPostRef.current = false;
          setShowAuthSheet(false);
        }}
        returnPath="/add"
      />
    </div>
  );
};

export default AddPint;
