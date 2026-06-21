export type AddPintStep = 'photo' | 'drink' | 'serving' | 'rating' | 'pub';

export type AddPintProgress = {
  hasPhoto: boolean;
  hasProduct: boolean;
  hasRating: boolean;
  hasPub: boolean;
  hasUser: boolean;
  isPosting: boolean;
  needsServingChoice: boolean;
};

function completedCoreSteps(progress: AddPintProgress): number {
  return [progress.hasPhoto, progress.hasProduct, progress.hasRating, progress.hasPub].filter(Boolean)
    .length;
}

export function isAddPintReadyToSubmit(progress: AddPintProgress): boolean {
  return (
    progress.hasPhoto &&
    progress.hasProduct &&
    progress.hasRating &&
    progress.hasPub &&
    !progress.needsServingChoice &&
    !progress.isPosting
  );
}

export function canContinueAddPint(progress: AddPintProgress): boolean {
  if (progress.isPosting) {
    return false;
  }

  if (isAddPintReadyToSubmit(progress)) {
    return true;
  }

  return completedCoreSteps(progress) >= 2;
}

export function getAddPintPostLabel(progress: AddPintProgress): string {
  if (progress.isPosting) {
    return 'Posting...';
  }

  if (isAddPintReadyToSubmit(progress) && progress.hasUser) {
    return 'Post Pint';
  }

  if (isAddPintReadyToSubmit(progress) && !progress.hasUser) {
    return 'Sign in to post';
  }

  if (progress.needsServingChoice) {
    return 'Choose draught or can';
  }

  const completed = completedCoreSteps(progress);

  if (completed >= 2) {
    return 'Continue logging';
  }

  if (!progress.hasPhoto) {
    return 'Add a photo to post';
  }

  if (!progress.hasProduct) {
    return 'Choose a drink to post';
  }

  if (!progress.hasRating) {
    return 'Select a rating to post';
  }

  return 'Select a pub to post';
}

export function getFirstIncompleteAddPintStep(
  progress: Pick<AddPintProgress, 'hasPhoto' | 'hasProduct' | 'hasRating' | 'hasPub' | 'needsServingChoice'>
): AddPintStep | null {
  if (!progress.hasPhoto) {
    return 'photo';
  }

  if (!progress.hasProduct) {
    return 'drink';
  }

  if (progress.needsServingChoice) {
    return 'serving';
  }

  if (!progress.hasRating) {
    return 'rating';
  }

  if (!progress.hasPub) {
    return 'pub';
  }

  return null;
}

export function formatPostError(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  const lower = message.toLowerCase();

  if (
    lower.includes('network') ||
    lower.includes('fetch') ||
    lower.includes('failed to fetch') ||
    lower.includes('connection')
  ) {
    return "Couldn't log your pint. Check your connection and try again.";
  }

  if (message === 'Select a pub before posting.') {
    return "Couldn't log your pint. Select a pub and try again.";
  }

  if (message) {
    return `Couldn't log your pint. ${message}`;
  }

  return "Couldn't log your pint. Please try again.";
}

export function formatPhotoError(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  const lower = message.toLowerCase();

  if (lower.includes('cancel') || lower.includes('dismiss')) {
    return '';
  }

  if (
    lower.includes('network') ||
    lower.includes('fetch') ||
    lower.includes('failed to fetch') ||
    lower.includes('connection')
  ) {
    return "Couldn't add your photo. Check your connection and try again.";
  }

  if (message) {
    return `Couldn't add your photo. ${message}`;
  }

  return "Couldn't add your photo. Please try again.";
}
