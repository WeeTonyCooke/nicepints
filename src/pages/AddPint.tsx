import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, ChevronDown, Loader2, X } from 'lucide-react';
import {
  PINT_TYPES,
  type PintType,
  fetchLivePubs,
  saveLivePint,
  type Pub,
} from '../data';

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [rating, setRating] = useState(0);
  const [pintType, setPintType] = useState<PintType>('Guinness');
  const [comment, setComment] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPubId, setSelectedPubId] = useState<string | null>(null);

  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [pubs, setPubs] = useState<Pub[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchLivePubs()
      .then((data) => {
        setPubs(data);

        if (data.length > 0) {
          const firstCity = data[0].location;
          setSelectedCity(firstCity);

          const firstPubInCity = data.find((pub) => pub.location === firstCity);
          setSelectedPubId(firstPubInCity?.id ?? null);
        }
      })
      .catch((err) => {
        console.error('Failed to load pubs:', err);
      });
  }, []);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const cities = useMemo(() => {
    return Array.from(new Set(pubs.map((pub) => pub.location))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [pubs]);

  const filteredPubs = useMemo(() => {
    if (!selectedCity) {
      return [];
    }

    return pubs.filter((pub) => pub.location === selectedCity);
  }, [pubs, selectedCity]);

  useEffect(() => {
    if (!selectedCity) {
      setSelectedPubId(null);
      return;
    }

    const pubStillValid = filteredPubs.some((pub) => pub.id === selectedPubId);

    if (!pubStillValid) {
      setSelectedPubId(filteredPubs[0]?.id ?? null);
    }
  }, [selectedCity, filteredPubs, selectedPubId]);

  const openCameraOrGallery = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotoFile(file);
    setPhotoPreviewUrl(previewUrl);
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

  const handlePost = async () => {
    if (!rating || !selectedPubId) {
      return;
    }

    setIsPosting(true);

    try {
      await saveLivePint({
        rating,
        pintType,
        comment,
        pubId: selectedPubId,
        photoFile,
      });

      navigate('/');
    } catch (err) {
      console.error('Failed to save pint:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(`Ah, something went wrong with the pour: ${message}`);
    } finally {
      setIsPosting(false);
    }
  };

  const canPost = rating > 0 && selectedPubId !== null && !isPosting;

  return (
    <div className="max-w-md mx-auto px-5 pt-12 pb-24">
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

      <div className="space-y-7">
        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-gold mr-1.5">1</span>Photo
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            className="hidden"
          />

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
                  className="w-10 h-10 rounded-full bg-stout/85 backdrop-blur border border-cream/10 flex items-center justify-center text-gold"
                >
                  <Camera className="w-5 h-5" />
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
              className="w-full aspect-[4/5] bg-graphite rounded-2xl border-2 border-dashed border-cream/10 flex flex-col items-center justify-center active:border-gold/40 transition-colors cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-2xl bg-stout flex items-center justify-center mb-3 group-active:bg-gold/10 transition-colors">
                <Camera className="w-7 h-7 text-gold" />
              </div>
              <p className="text-sm font-bold text-cream/40">Snap the pint</p>
              <p className="text-xs text-cream/20 mt-1">Tap to open camera or gallery</p>
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

        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-gold mr-1.5">3</span>City / Town
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedPubId(null);
              }}
              className="w-full bg-graphite rounded-2xl py-4 pl-11 pr-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none appearance-none transition-all"
            >
              {cities.length === 0 ? (
                <option value="" className="bg-graphite">
                  No locations available
                </option>
              ) : (
                cities.map((city) => (
                  <option key={city} value={city} className="bg-graphite">
                    {city}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-gold mr-1.5">4</span>Pub
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none" />
            <select
              value={selectedPubId ?? ''}
              onChange={(e) => setSelectedPubId(e.target.value || null)}
              className="w-full bg-graphite rounded-2xl py-4 pl-11 pr-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none appearance-none transition-all"
            >
              {filteredPubs.length === 0 ? (
                <option value="" className="bg-graphite">
                  No pubs available
                </option>
              ) : (
                filteredPubs.map((pub) => (
                  <option key={pub.id} value={pub.id} className="bg-graphite">
                    {pub.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-gold mr-1.5">5</span>What are you drinking?
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
        </div>

        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-gold mr-1.5">6</span>Anything to add?
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
          {isPosting ? 'Posting...' : canPost ? 'Post Pint' : 'Select a rating to post'}
        </button>
      </div>
    </div>
  );
};

export default AddPint;