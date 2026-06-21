import {
  loadImageFromFile,
  PINT_PHOTO_ASPECT,
  PINT_PHOTO_OUTPUT_HEIGHT,
  PINT_PHOTO_OUTPUT_WIDTH,
} from './photoCrop';

const MAX_PINT_PHOTO_BYTES = 8 * 1024 * 1024;
export const PINT_PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif';
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

export function isPintPhotoAspect(width: number, height: number): boolean {
  if (width <= 0 || height <= 0) {
    return false;
  }

  return Math.abs(width / height - PINT_PHOTO_ASPECT) < 0.02;
}

export function validatePintPhotoInput(file: File): void {
  if (file.size > MAX_PINT_PHOTO_BYTES) {
    throw new Error('Photo must be under 8 MB.');
  }

  const normalizedType = file.type.toLowerCase();
  if (normalizedType && !ALLOWED_PHOTO_TYPES.has(normalizedType) && !isHeicFile(file)) {
    throw new Error('Use a JPG, PNG, or WebP photo.');
  }
}

/** Runs after the cropper — keep the 4:5 output intact; never re-scale or reshape. */
export async function validateAndPreparePintPhoto(file: File): Promise<File> {
  validatePintPhotoInput(file);

  try {
    const { image } = await loadImageFromFile(file);
    const width = image.naturalWidth;
    const height = image.naturalHeight;

    if (
      (width === PINT_PHOTO_OUTPUT_WIDTH && height === PINT_PHOTO_OUTPUT_HEIGHT) ||
      isPintPhotoAspect(width, height)
    ) {
      return file;
    }

    throw new Error('Photo must stay in the 4:5 pint frame. Reframe and try again.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('4:5')) {
      throw error;
    }

    if (isHeicFile(file)) {
      throw new Error('HEIC photos are not supported here. Choose JPG or PNG from your gallery.');
    }

    throw new Error('Could not read this photo. Try JPG or PNG.');
  }
}
