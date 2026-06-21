export const PINT_PHOTO_ASPECT = 4 / 5;
export const PINT_PHOTO_OUTPUT_WIDTH = 1080;
export const PINT_PHOTO_OUTPUT_HEIGHT = 1350;

export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CropPosition = {
  x: number;
  y: number;
};

export function getCoverScale(
  mediaWidth: number,
  mediaHeight: number,
  cropWidth: number,
  cropHeight: number
): number {
  return Math.max(cropWidth / mediaWidth, cropHeight / mediaHeight);
}

/** Map on-screen pan/zoom to pixel crop in the source image. */
export function getCroppedArea(
  mediaWidth: number,
  mediaHeight: number,
  frameWidth: number,
  _frameHeight: number,
  zoom: number,
  position: CropPosition,
  targetAspect: number = PINT_PHOTO_ASPECT
): CropArea {
  // Frame border-box measurements can skew aspect ratio — always crop to the feed ratio.
  const cropWidth = frameWidth;
  const cropHeight = frameWidth / targetAspect;

  const scale = getCoverScale(mediaWidth, mediaHeight, cropWidth, cropHeight) * zoom;
  const scaledWidth = mediaWidth * scale;
  const scaledHeight = mediaHeight * scale;
  const offsetX = (cropWidth - scaledWidth) / 2 + position.x;
  const offsetY = (cropHeight - scaledHeight) / 2 + position.y;

  let x = Math.max(0, -offsetX / scale);
  let y = Math.max(0, -offsetY / scale);
  const width = cropWidth / scale;
  const height = cropHeight / scale;

  if (x + width > mediaWidth) {
    x = Math.max(0, mediaWidth - width);
  }
  if (y + height > mediaHeight) {
    y = Math.max(0, mediaHeight - height);
  }

  return { x, y, width, height };
}

function fitCropAreaToAspect(area: CropArea, targetAspect: number): CropArea {
  const currentAspect = area.width / area.height;
  if (Math.abs(currentAspect - targetAspect) < 0.0001) {
    return area;
  }

  if (currentAspect > targetAspect) {
    const nextWidth = area.height * targetAspect;
    return {
      ...area,
      x: area.x + (area.width - nextWidth) / 2,
      width: nextWidth,
    };
  }

  const nextHeight = area.width / targetAspect;
  return {
    ...area,
    y: area.y + (area.height - nextHeight) / 2,
    height: nextHeight,
  };
}

async function loadImageElement(objectUrl: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.decoding = 'async';

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Could not load this photo.'));
    image.src = objectUrl;
  });

  return image;
}

/** Apply EXIF orientation so crop matches what the user saw in the preview. */
async function normalizeImageOrientation(file: File): Promise<{ blob: Blob; objectUrl: string }> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;

      const context = canvas.getContext('2d');
      if (!context) {
        bitmap.close();
        throw new Error('Could not read this photo.');
      }

      context.drawImage(bitmap, 0, 0);
      bitmap.close();

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.92);
      });

      if (!blob) {
        throw new Error('Could not read this photo.');
      }

      return { blob, objectUrl: URL.createObjectURL(blob) };
    } catch {
      // Fall back to browser decode below.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  const image = await loadImageElement(objectUrl);

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('Could not read this photo.');
  }

  context.drawImage(image, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.92);
  });

  URL.revokeObjectURL(objectUrl);

  if (!blob) {
    throw new Error('Could not read this photo.');
  }

  return { blob, objectUrl: URL.createObjectURL(blob) };
}

export async function loadImageFromFile(file: File): Promise<{ image: HTMLImageElement; objectUrl: string }> {
  const { objectUrl } = await normalizeImageOrientation(file);
  const image = await loadImageElement(objectUrl);
  return { image, objectUrl };
}

export async function cropImageToFile(
  image: HTMLImageElement,
  area: CropArea,
  fileName: string
): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = PINT_PHOTO_OUTPUT_WIDTH;
  canvas.height = PINT_PHOTO_OUTPUT_HEIGHT;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not crop this photo.');
  }

  const targetAspect = PINT_PHOTO_OUTPUT_WIDTH / PINT_PHOTO_OUTPUT_HEIGHT;
  const fittedArea = fitCropAreaToAspect(area, targetAspect);

  context.drawImage(
    image,
    fittedArea.x,
    fittedArea.y,
    fittedArea.width,
    fittedArea.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.92);
  });

  if (!blob) {
    throw new Error('Could not crop this photo.');
  }

  const baseName = fileName.replace(/\.[^.]+$/, '') || 'pint-photo';
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
}
