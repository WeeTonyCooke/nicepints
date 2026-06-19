import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export async function pickPhotoFromDevice(): Promise<File | null> {
  if (!isNativePlatform()) {
    return null;
  }

  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      correctOrientation: true,
    });

    if (!photo.webPath) {
      return null;
    }

    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    const format = photo.format ?? 'jpeg';
    const mimeType = blob.type || `image/${format}`;

    return new File([blob], `pint-${Date.now()}.${format}`, { type: mimeType });
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    if (message.includes('cancel') || message.includes('dismiss')) {
      return null;
    }

    throw error;
  }
}
