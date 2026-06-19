import { supabase } from '../supabaseClient';

/**
 * Handles Supabase magic-link redirects (#access_token=...) when the user
 * clicks the email link instead of entering the 6-digit OTP in the app.
 */
export async function recoverSessionFromRedirect(): Promise<boolean> {
  const hash = window.location.hash;
  const search = window.location.search;

  const hasHashToken = hash.includes('access_token') || hash.includes('error=');
  const hasPkceCode = search.includes('code=');

  if (!hasHashToken && !hasPkceCode) {
    return false;
  }

  if (hasPkceCode) {
    const params = new URLSearchParams(search);
    const code = params.get('code');

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        throw new Error(`Sign-in link failed: ${error.message}`);
      }
    }
  } else {
    const { error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(`Sign-in link failed: ${error.message}`);
    }
  }

  const returnPath = `${window.location.pathname}${window.location.search}` || '/profile';
  window.history.replaceState({}, document.title, returnPath);
  return true;
}

export function getAuthRedirectUrl(returnPath = '/profile'): string {
  const path = returnPath.startsWith('/') ? returnPath : `/${returnPath}`;

  if (typeof window === 'undefined') {
    return `http://localhost:3000${path}`;
  }
  return `${window.location.origin}${path}`;
}
