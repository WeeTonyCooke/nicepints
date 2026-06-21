import type { ServingType } from '../data/types';
import type { PubPlaceCandidate } from '../data/pubs';

const DRAFT_STORAGE_KEY = 'nicepints_add_pint_draft_v1';
const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const DRAFT_MAX_PHOTO_BYTES = 3_500_000;

export type AddPintDraft = {
  version: 1;
  savedAt: string;
  rating: number;
  productSlug: string | null;
  servingType: ServingType;
  comment: string;
  selectedPubId: string | null;
  pendingPubCandidate: PubPlaceCandidate | null;
  photoDataUrl: string | null;
  photoFileName: string | null;
};

export type AddPintDraftInput = Omit<AddPintDraft, 'version' | 'savedAt'>;

export function isAddPintDraftMeaningful(draft: AddPintDraft): boolean {
  return (
    draft.rating > 0 ||
    !!draft.productSlug ||
    !!draft.comment.trim() ||
    !!draft.selectedPubId ||
    !!draft.pendingPubCandidate ||
    !!draft.photoDataUrl
  );
}

export function loadAddPintDraft(): AddPintDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const draft = JSON.parse(raw) as AddPintDraft;
    if (draft.version !== 1 || !draft.savedAt) {
      clearAddPintDraft();
      return null;
    }

    const ageMs = Date.now() - Date.parse(draft.savedAt);
    if (Number.isNaN(ageMs) || ageMs > DRAFT_MAX_AGE_MS) {
      clearAddPintDraft();
      return null;
    }

    return draft;
  } catch {
    clearAddPintDraft();
    return null;
  }
}

export function clearAddPintDraft(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export async function saveAddPintDraft(input: AddPintDraftInput): Promise<void> {
  if (
    input.rating <= 0 &&
    !input.productSlug &&
    !input.comment.trim() &&
    !input.selectedPubId &&
    !input.pendingPubCandidate &&
    !input.photoDataUrl
  ) {
    clearAddPintDraft();
    return;
  }

  const draft: AddPintDraft = {
    version: 1,
    savedAt: new Date().toISOString(),
    ...input,
  };

  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    if (draft.photoDataUrl) {
      try {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            ...draft,
            photoDataUrl: null,
            photoFileName: null,
          })
        );
      } catch {
        // Ignore storage failures — draft won't persist this visit.
      }
    }
  }
}

export async function fileToDataUrl(file: File): Promise<string | null> {
  if (file.size > DRAFT_MAX_PHOTO_BYTES) {
    return null;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      if (result && result.length > DRAFT_MAX_PHOTO_BYTES) {
        resolve(null);
        return;
      }
      resolve(result);
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
}

export function addPintDraftStorageKey(): string {
  return DRAFT_STORAGE_KEY;
}
