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
  cropWidth: number,
  cropHeight: number,
  zoom: number,
  position: CropPosition
): CropArea {
  const scale = getCoverScale(mediaWidth, mediaHeight, cropWidth, cropHeight) * zoom;
  const scaledWidth = mediaWidth * scale;
  const scaledHeight = mediaHeight * scale;
  const offsetX = (cropWidth - scaledWidth) / 2 + position.x;
  const offsetY = (cropHeight - scaledHeight) / 2 + position.y;

  const x = Math.max(0, -offsetX / scale);
  const y = Math.max(0, -offsetY / scale);
  const width = Math.min(mediaWidth - x, cropWidth / scale);
  const height = Math.min(mediaHeight - y, cropHeight / scale);

  return { x, y, width, height };
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

  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
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
