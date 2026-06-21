import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, Check, Crop, Loader2, Search, X } from 'lucide-react';
import {
  fetchActiveProducts,
  fetchFeaturedProducts,
  fetchRecentProductsForUser,
  productRequiresServingType,
  productShowsServingType,
  resolvePubIdFromCandidate,
  saveLivePint,
  type Product,
  type PubPlaceCandidate,
  type ServingType,
} from '../data';
import { useAuth } from '../Context/AuthContext';
import PostAuthSheet from '../components/PostAuthSheet';
import BrandWordmark from '../components/BrandWordmark';
import PintPhotoCropper from '../components/PintPhotoCropper';
import PubSearchPicker, { type PubSelection } from '../components/PubSearchPicker';
import { isNativePlatform, pickPhotoFromDevice } from '../utils/photoPicker';
import { PINT_PHOTO_ACCEPT, validateAndPreparePintPhoto, validatePintPhotoInput } from '../utils/photoUpload';

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

function defaultServingType(product: Product): ServingType {
  if (productShowsServingType(product)) {
    return 'draught';
  }

  return 'unknown';
}

function ProductChip({
  product,
  selected,
  onSelect,
}: {
  product: Product;
  selected: boolean;
  onSelect: (product: Product) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className={`w-full rounded-2xl py-4 px-4 text-left border flex items-center justify-between gap-3 transition-all active:scale-[0.98] ${
        selected
          ? 'bg-gold/10 border-gold text-gold'
          : 'bg-graphite border-cream/5 text-cream'
      }`}
    >
      <span className="text-sm font-bold">{product.name}</span>
      {selected && <Check className="w-4 h-4 shrink-0" aria-hidden />}
    </button>
  );
}

const AddPint = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPubId = searchParams.get('pubId');
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingPostRef = useRef(false);

  const [rating, setRating] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [servingType, setServingType] = useState<ServingType>('draught');
  const [comment, setComment] = useState('');
  const [selectedPubId, setSelectedPubId] = useState<string | null>(null);
  const [pendingPubCandidate, setPendingPubCandidate] = useState<PubPlaceCandidate | null>(null);

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isPickingPhoto, setIsPickingPhoto] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [cropSourceFile, setCropSourceFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setProductsLoading(true);
      setProductsError(null);

      try {
        const [featured, all] = await Promise.all([
          fetchFeaturedProducts(),
          fetchActiveProducts(),
        ]);
        if (cancelled) return;

        setFeaturedProducts(featured);
        setAllProducts(all);
        setSelectedProduct((current) => current ?? featured[0] ?? all[0] ?? null);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Could not load drinks.';
        setProductsError(message);
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setRecentProducts([]);
      return;
    }

    let cancelled = false;

    async function loadRecent() {
      const userId = user?.id;
      if (!userId) {
        return;
      }

      try {
        const recent = await fetchRecentProductsForUser(userId);
        if (cancelled) return;

        setRecentProducts(recent);

        if (recent.length > 0) {
          setSelectedProduct((current) => current ?? recent[0]);
        }
      } catch {
        if (!cancelled) {
          setRecentProducts([]);
        }
      }
    }

    void loadRecent();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!showSearch || allProducts.length > 0) {
      return;
    }

    let cancelled = false;

    async function loadAll() {
      try {
        const products = await fetchActiveProducts();
        if (!cancelled) {
          setAllProducts(products);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Could not load drink search.';
          setProductsError(message);
        }
      }
    }

    void loadAll();

    return () => {
      cancelled = true;
    };
  }, [showSearch, allProducts.length]);

  const featuredOnly = useMemo(() => {
    const recentIds = new Set(recentProducts.map((product) => product.id));
    return featuredProducts.filter((product) => !recentIds.has(product.id));
  }, [featuredProducts, recentProducts]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setServingType(defaultServingType(product));
    setShowSearch(false);
    setSearchQuery('');
  };

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const source = allProducts.length > 0 ? allProducts : featuredProducts;

    if (!query) {
      return source;
    }

    return source.filter((product) => {
      const haystack = [product.name, product.brand, product.slug].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [allProducts, featuredProducts, searchQuery]);

  const requiresServingType = selectedProduct ? productRequiresServingType(selectedProduct) : false;
  const showServingType = selectedProduct ? productShowsServingType(selectedProduct) : false;

  const setPhoto = (file: File) => {
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotoFile(file);
    setPhotoPreviewUrl(previewUrl);
  };

  const queuePhotoForCrop = (file: File) => {
    setPostError(null);

    try {
      validatePintPhotoInput(file);
      setCropSourceFile(file);
    } catch (err) {
      console.error('Invalid photo:', err);
      const message = err instanceof Error ? err.message : 'Invalid photo.';
      setPostError(message);
    }
  };

  const handleCropConfirm = async (cropped: File) => {
    setPostError(null);

    try {
      const prepared = await validateAndPreparePintPhoto(cropped);
      setPhoto(prepared);
      setCropSourceFile(null);
    } catch (err) {
      console.error('Invalid photo:', err);
      const message = err instanceof Error ? err.message : 'Invalid photo.';
      setPostError(message);
    }
  };

  const handleCropCancel = () => {
    setCropSourceFile(null);
  };

  const openReframe = () => {
    if (photoFile) {
      setCropSourceFile(photoFile);
    }
  };

  const extractDroppedImage = (dataTransfer: DataTransfer): File | null => {
    const items = Array.from(dataTransfer.items);
    const imageItem = items.find((item) => item.kind === 'file' && item.type.startsWith('image/'));
    if (imageItem) {
      return imageItem.getAsFile();
    }

    const file = dataTransfer.files[0];
    return file?.type.startsWith('image/') ? file : null;
  };

  const handleDragEnter = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isNativePlatform()) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    if (isNativePlatform()) {
      return;
    }

    const file = extractDroppedImage(event.dataTransfer);
    if (file) {
      queuePhotoForCrop(file);
    } else {
      setPostError('Drop a JPG, PNG, or WebP photo.');
    }
  };

  const openCameraOrGallery = async () => {
    setPostError(null);

    if (isNativePlatform()) {
      setIsPickingPhoto(true);

      try {
        const file = await pickPhotoFromDevice();
        if (file) {
          queuePhotoForCrop(file);
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

    queuePhotoForCrop(file);
    event.target.value = '';
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
    if (!rating || !photoFile || !selectedProduct) {
      return;
    }

    if (!selectedPubId && !pendingPubCandidate) {
      return;
    }

    if (requiresServingType && servingType === 'unknown') {
      setPostError(`Choose draught or can for ${selectedProduct.name}.`);
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
        product: selectedProduct,
        servingType: requiresServingType
          ? servingType
          : servingType === 'unknown'
          ? 'draught'
          : servingType,
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
    if (!rating || (!selectedPubId && !pendingPubCandidate) || !photoFile || !selectedProduct) {
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
    !!selectedProduct &&
    !isPosting &&
    (!requiresServingType || servingType !== 'unknown');

  const isNative = isNativePlatform();

  const emptyPhotoZoneClass = (active: boolean) =>
    `w-full aspect-[4/5] bg-graphite rounded-2xl border-2 border-dashed flex flex-col items-center justify-center active:border-gold/40 transition-colors cursor-pointer group disabled:opacity-60 ${
      active ? 'border-gold bg-gold/5' : 'border-cream/10'
    }`;

  const emptyPhotoZoneContent = (
    <>
      <div className="w-16 h-16 rounded-2xl bg-stout flex items-center justify-center mb-3 group-active:bg-gold/10 transition-colors">
        {isPickingPhoto ? (
          <Loader2 className="w-7 h-7 text-gold animate-spin" />
        ) : (
          <Camera className="w-7 h-7 text-gold" />
        )}
      </div>
      <p className="text-sm font-bold text-cream/40">
        {isDragOver
          ? 'Drop to add photo'
          : isPickingPhoto
          ? 'Opening camera...'
          : 'Add a photo'}
      </p>
      <p className="text-xs text-cream/20 mt-1 px-6 text-center leading-relaxed">
        {isNative
          ? 'Required — tap to open camera or gallery'
          : 'Required — click to choose, or drop a photo here'}
      </p>
    </>
  );

  const postButtonLabel = () => {
    if (isPosting) return 'Posting...';
    if (!photoFile) return 'Add a photo to post';
    if (rating === 0) return 'Select a rating to post';
    if (!hasPub) return 'Select a pub to post';
    if (!selectedProduct) return 'Select a drink to post';
    if (!user) return 'Sign in to post';
    return 'Post Pint';
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-safe-header">
      <header className="flex justify-between items-center mb-8">
        <div>
          <BrandWordmark size="compact" className="mb-0.5" />
          <h1 className="font-display font-black text-2xl text-cream">Log a Pint</h1>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-cream/40 text-sm font-medium px-3 py-1.5 rounded-xl bg-graphite border border-cream/5 active:scale-95 transition-transform"
        >
          Cancel
        </button>
      </header>

      {(postError || productsError) && (
        <div className="mb-6 rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember/90">
          {postError ?? productsError}
        </div>
      )}

      <div className="space-y-7">
        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-muted mr-1.5">1</span>Photo <span className="text-rust">*</span>
          </label>

          {!isNative && (
            <input
              id="pint-photo-input"
              ref={fileInputRef}
              type="file"
              accept={PINT_PHOTO_ACCEPT}
              onChange={handlePhotoChange}
              className="sr-only"
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
                  onClick={openReframe}
                  className="w-10 h-10 rounded-full bg-stout/85 backdrop-blur border border-cream/10 flex items-center justify-center text-gold"
                  aria-label="Reframe photo"
                >
                  <Crop className="w-5 h-5" />
                </button>

                {isNative ? (
                  <button
                    type="button"
                    onClick={openCameraOrGallery}
                    disabled={isPickingPhoto}
                    className="w-10 h-10 rounded-full bg-stout/85 backdrop-blur border border-cream/10 flex items-center justify-center text-gold disabled:opacity-50"
                    aria-label="Replace photo"
                  >
                    {isPickingPhoto ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                  </button>
                ) : (
                  <label
                    htmlFor="pint-photo-input"
                    className="w-10 h-10 rounded-full bg-stout/85 backdrop-blur border border-cream/10 flex items-center justify-center text-gold cursor-pointer"
                    aria-label="Replace photo"
                  >
                    <Camera className="w-5 h-5" />
                  </label>
                )}

                <button
                  type="button"
                  onClick={clearPhoto}
                  className="w-10 h-10 rounded-full bg-stout/85 backdrop-blur border border-cream/10 flex items-center justify-center text-cream/80"
                  aria-label="Remove photo"
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
          ) : isNative ? (
            <button
              type="button"
              onClick={openCameraOrGallery}
              disabled={isPickingPhoto}
              className={emptyPhotoZoneClass(isDragOver)}
            >
              {emptyPhotoZoneContent}
            </button>
          ) : (
            <label
              htmlFor="pint-photo-input"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={emptyPhotoZoneClass(isDragOver)}
            >
              {emptyPhotoZoneContent}
            </label>
          )}
        </div>

        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-3 block">
            <span className="text-muted mr-1.5">2</span>How was it?
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
            <span className="text-muted mr-1.5">4</span>What are you drinking?
          </label>

          {productsLoading ? (
            <div className="flex items-center gap-2 py-6 text-cream/40 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading drinks...
            </div>
          ) : (
            <div className="space-y-4">
              {recentProducts.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2">
                    Recently logged
                  </p>
                  <div className="space-y-2">
                    {recentProducts.map((product) => (
                      <ProductChip
                        key={`recent-${product.id}`}
                        product={product}
                        selected={selectedProduct?.id === product.id}
                        onSelect={handleProductSelect}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                {recentProducts.length > 0 && (
                  <p className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2">
                    Featured
                  </p>
                )}
                <div className="space-y-2">
                  {featuredOnly.map((product) => (
                    <ProductChip
                      key={product.id}
                      product={product}
                      selected={selectedProduct?.id === product.id}
                      onSelect={handleProductSelect}
                    />
                  ))}
                </div>
              </div>

              {!showSearch ? (
                <button
                  type="button"
                  onClick={() => setShowSearch(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-cream/40 active:text-gold transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search all drinks
                  {allProducts.length > 0 && (
                    <span className="text-cream/25">({allProducts.length})</span>
                  )}
                </button>
              ) : (
                <div className="rounded-2xl border border-cream/10 bg-graphite p-4 space-y-3">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by name or brand"
                    className="w-full rounded-xl bg-stout py-3 px-4 text-sm text-cream border border-cream/5 outline-none focus:ring-2 focus:ring-gold/40"
                    autoFocus
                  />
                  <div className="max-h-56 overflow-y-auto space-y-2">
                    {searchResults.length === 0 ? (
                      <p className="text-sm text-cream/40 py-2 text-center">No drinks found.</p>
                    ) : (
                      searchResults.map((product) => (
                        <ProductChip
                          key={`search-${product.id}`}
                          product={product}
                          selected={selectedProduct?.id === product.id}
                          onSelect={handleProductSelect}
                        />
                      ))
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchQuery('');
                    }}
                    className="text-xs text-cream/40 underline"
                  >
                    Back to featured
                  </button>
                </div>
              )}
            </div>
          )}

          {showServingType && selectedProduct && (
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
                        ? 'text-gold border-gold/40 bg-gold/10'
                        : 'bg-stout text-cream/50 border-cream/10'
                    }`}
                  >
                    {serve === 'draught' ? 'On draught' : serve}
                  </button>
                ))}
              </div>
              {requiresServingType && selectedProduct?.slug === 'guinness-00' && (
                <p className="text-[10px] text-cream/30 mt-2">
                  Guinness 0.0 on draught is what most people are searching for.
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-muted mr-1.5">5</span>Anything to add?
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
              ? 'bg-gold text-stout shadow-lg shadow-gold/10'
              : 'bg-graphite text-muted cursor-not-allowed border border-line'
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

      {cropSourceFile && (
        <PintPhotoCropper
          file={cropSourceFile}
          onConfirm={(cropped) => void handleCropConfirm(cropped)}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default AddPint;
