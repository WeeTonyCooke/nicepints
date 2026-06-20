import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, X, ZoomIn, ZoomOut } from 'lucide-react';
import {
  cropImageToFile,
  getCoverScale,
  getCroppedArea,
  loadImageFromFile,
  PINT_PHOTO_ASPECT,
} from '../utils/photoCrop';

type PintPhotoCropperProps = {
  file: File;
  onConfirm: (cropped: File) => void;
  onCancel: () => void;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

const PintPhotoCropper = ({ file, onConfirm, onCancel }: PintPhotoCropperProps) => {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let active = true;
    let url: string | null = null;

    const load = async () => {
      setLoadError(null);

      try {
        const loaded = await loadImageFromFile(file);
        url = loaded.objectUrl;

        if (!active) {
          URL.revokeObjectURL(loaded.objectUrl);
          return;
        }

        setImage(loaded.image);
        setObjectUrl(loaded.objectUrl);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      } catch (error) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Could not load this photo.';
        setLoadError(message);
      }
    };

    void load();

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const updateSize = () => {
      const rect = frame.getBoundingClientRect();
      setFrameSize({ width: rect.width, height: rect.height });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(frame);

    return () => observer.disconnect();
  }, [image]);

  const clampPosition = useCallback(
    (next: { x: number; y: number }, nextZoom: number) => {
      if (!image || frameSize.width === 0 || frameSize.height === 0) {
        return next;
      }

      const scale = getCoverScale(image.naturalWidth, image.naturalHeight, frameSize.width, frameSize.height) * nextZoom;
      const scaledWidth = image.naturalWidth * scale;
      const scaledHeight = image.naturalHeight * scale;
      const maxX = Math.max(0, (scaledWidth - frameSize.width) / 2);
      const maxY = Math.max(0, (scaledHeight - frameSize.height) / 2);

      return {
        x: Math.min(maxX, Math.max(-maxX, next.x)),
        y: Math.min(maxY, Math.max(-maxY, next.y)),
      };
    },
    [frameSize.height, frameSize.width, image]
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!image) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      originX: position.x,
      originY: position.y,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }

    const deltaX = event.clientX - drag.x;
    const deltaY = event.clientY - drag.y;
    setPosition(
      clampPosition(
        {
          x: drag.originX + deltaX,
          y: drag.originY + deltaY,
        },
        zoom
      )
    );
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  const handleZoomChange = (nextZoom: number) => {
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
    setZoom(clamped);
    setPosition((current) => clampPosition(current, clamped));
  };

  const handleConfirm = async () => {
    if (!image || frameSize.width === 0 || frameSize.height === 0) {
      return;
    }

    setIsSaving(true);

    try {
      const area = getCroppedArea(
        image.naturalWidth,
        image.naturalHeight,
        frameSize.width,
        frameSize.height,
        zoom,
        position
      );
      const cropped = await cropImageToFile(image, area, file.name);
      onConfirm(cropped);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not crop this photo.';
      setLoadError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const imageScale =
    image && frameSize.width > 0
      ? getCoverScale(image.naturalWidth, image.naturalHeight, frameSize.width, frameSize.height) * zoom
      : 1;

  const imageWidth = image ? image.naturalWidth * imageScale : 0;
  const imageHeight = image ? image.naturalHeight * imageScale : 0;

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-stout text-cream">
      <header className="px-5 pt-safe-header-compact pb-4 flex items-center justify-between shrink-0">
        <div>
          <p className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30">Reframe pint</p>
          <h2 className="font-display font-black text-xl">Crop your photo</h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2.5 rounded-full bg-graphite border border-cream/10 text-cream/70"
          aria-label="Cancel crop"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 px-5 flex flex-col min-h-0">
        <p className="text-sm text-cream/50 mb-4 leading-relaxed">
          Drag to reposition. Pinch or use the slider to zoom. Feed cards use this 4:5 frame.
        </p>

        <div
          ref={frameRef}
          className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-cream/10 bg-black touch-none select-none"
          style={{ aspectRatio: `${PINT_PHOTO_ASPECT}` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {loadError ? (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-ember/90">
              {loadError}
            </div>
          ) : !image || !objectUrl ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : (
            <img
              src={objectUrl}
              alt="Crop preview"
              draggable={false}
              className="absolute top-1/2 left-1/2 max-w-none pointer-events-none"
              style={{
                width: imageWidth,
                height: imageHeight,
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
              }}
            />
          )}

          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-cream/10" />
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-stout/50 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-stout/50 to-transparent pointer-events-none" />
        </div>

        <div className="mt-5 flex items-center gap-3 max-w-sm mx-auto w-full">
          <button
            type="button"
            onClick={() => handleZoomChange(zoom - 0.15)}
            disabled={zoom <= MIN_ZOOM || isSaving}
            className="p-2.5 rounded-full bg-graphite border border-cream/10 text-cream/70 disabled:opacity-40"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(event) => handleZoomChange(Number(event.target.value))}
            className="flex-1 accent-gold"
            aria-label="Zoom"
          />

          <button
            type="button"
            onClick={() => handleZoomChange(zoom + 0.15)}
            disabled={zoom >= MAX_ZOOM || isSaving}
            className="p-2.5 rounded-full bg-graphite border border-cream/10 text-cream/70 disabled:opacity-40"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-5 pb-safe-nav pt-4 flex gap-3 shrink-0">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1 py-4 rounded-2xl font-bold text-sm bg-graphite border border-cream/10 text-cream/70 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void handleConfirm()}
          disabled={!image || isSaving || !!loadError}
          className="flex-1 py-4 rounded-2xl font-black text-sm bg-cream text-stout flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          Use photo
        </button>
      </div>
    </div>
  );
};

export default PintPhotoCropper;
