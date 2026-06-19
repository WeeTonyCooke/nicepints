const MAX_PINT_PHOTO_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const ALLOWED_PHOTO_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return type.includes('heic') || type.includes('heif') || name.endsWith('.heic') || name.endsWith('.heif');
}

async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.decoding = 'async';

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Could not read this photo. Try JPG or PNG.'));
      image.src = objectUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function resizeImageFile(file: File): Promise<File> {
  const image = await loadImageFromFile(file);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    return file;
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.85);
  });

  if (!blob) {
    return file;
  }

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'pint-photo';
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
}

export async function validateAndPreparePintPhoto(file: File): Promise<File> {
  if (file.size > MAX_PINT_PHOTO_BYTES) {
    throw new Error('Photo must be under 8 MB.');
  }

  const normalizedType = file.type.toLowerCase();
  if (normalizedType && !ALLOWED_PHOTO_TYPES.has(normalizedType) && !isHeicFile(file)) {
    throw new Error('Use a JPG, PNG, or WebP photo.');
  }

  if (isHeicFile(file) && !normalizedType.includes('jpeg') && !normalizedType.includes('jpg')) {
    try {
      return await resizeImageFile(file);
    } catch {
      throw new Error('HEIC photos are not supported here. Choose JPG or PNG from your gallery.');
    }
  }

  if (file.size > 1_500_000 || normalizedType.includes('png')) {
    return resizeImageFile(file);
  }

  return file;
}
