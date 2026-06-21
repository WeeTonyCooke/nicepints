import { supabase } from '../supabaseClient';

export type UserTrustSignal = {
  userId: string;
  isRecognized: boolean;
  favouriteCount: number;
};

type TrustSignalRow = {
  user_id: string;
  is_recognized: boolean;
  favourite_count: number;
};

export async function fetchTrustSignalsByUserIds(
  userIds: string[]
): Promise<Map<string, UserTrustSignal>> {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  const result = new Map<string, UserTrustSignal>();

  if (uniqueIds.length === 0) {
    return result;
  }

  const { data, error } = await supabase
    .from('user_trust_signal')
    .select('user_id, is_recognized, favourite_count')
    .in('user_id', uniqueIds);

  if (error) {
    console.error('Failed to load trust signals:', error);
    return result;
  }

  for (const row of (data ?? []) as TrustSignalRow[]) {
    result.set(row.user_id, {
      userId: row.user_id,
      isRecognized: row.is_recognized,
      favouriteCount: row.favourite_count,
    });
  }

  return result;
}

export async function fetchOwnTrustSignal(userId: string): Promise<UserTrustSignal | null> {
  const map = await fetchTrustSignalsByUserIds([userId]);
  return map.get(userId) ?? null;
}

export async function fetchUserDisplayName(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('pints')
    .select('user_name')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Failed to load user display name:', error);
    return null;
  }

  const name = data?.user_name?.trim();
  return name || null;
}

export async function isProfileFavourited(
  favouritedUserId: string,
  favouritedByUserId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('profile_favourites')
    .select('id')
    .eq('favourited_user_id', favouritedUserId)
    .eq('favourited_by', favouritedByUserId)
    .maybeSingle();

  if (error) {
    console.error('Failed to check profile favourite:', error);
    return false;
  }

  return Boolean(data);
}

export async function toggleProfileFavourite(favouritedUserId: string): Promise<boolean> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  const currentUserId = sessionData.session?.user.id;
  if (!currentUserId) {
    throw new Error('Sign in to save a profile.');
  }

  if (currentUserId === favouritedUserId) {
    throw new Error('You cannot save your own profile.');
  }

  const alreadyFavourited = await isProfileFavourited(favouritedUserId, currentUserId);

  if (alreadyFavourited) {
    const { error } = await supabase
      .from('profile_favourites')
      .delete()
      .eq('favourited_user_id', favouritedUserId)
      .eq('favourited_by', currentUserId);

    if (error) {
      throw error;
    }

    return false;
  }

  const { error } = await supabase.from('profile_favourites').insert({
    favourited_by: currentUserId,
    favourited_user_id: favouritedUserId,
  });

  if (error) {
    throw error;
  }

  return true;
}

export async function enrichPintsWithTrustSignals<T extends { userId?: string | null; authorIsRecognized?: boolean }>(
  pints: T[]
): Promise<void> {
  const userIds = pints
    .map((pint) => pint.userId)
    .filter((id): id is string => typeof id === 'string' && id.length > 0);

  const trustMap = await fetchTrustSignalsByUserIds(userIds);

  for (const pint of pints) {
    if (!pint.userId) {
      pint.authorIsRecognized = false;
      continue;
    }

    pint.authorIsRecognized = trustMap.get(pint.userId)?.isRecognized ?? false;
  }
}
