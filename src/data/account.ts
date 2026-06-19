import { supabase } from '../supabaseClient';

export async function purgeMyAccountData(): Promise<number> {
  const { data, error } = await supabase.rpc('purge_my_account_data');

  if (error) {
    if (error.message.includes('purge_my_account_data') || error.code === '42883') {
      throw new Error(
        'Account deletion is not set up yet. Run supabase/migrations/20250623000000_places_and_account_deletion.sql.'
      );
    }
    throw new Error(`Could not delete account data: ${error.message}`);
  }

  return typeof data === 'number' ? data : 0;
}
