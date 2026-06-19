import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { purgeMyAccountData } from '../data/account';
import { getDisplayName, getPendingDisplayName, clearPendingDisplayName } from '../utils/user';
import { getAuthRedirectUrl, recoverSessionFromRedirect } from '../utils/authCallback';

type AuthContextValue = {
  user: User | null;
  displayName: string | null;
  isLoading: boolean;
  sendLoginCode: (email: string) => Promise<void>;
  verifyLoginCode: (email: string, token: string, displayName?: string) => Promise<void>;
  signInWithGoogle: (returnPath?: string) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
  deleteMyAccount: () => Promise<{ pintsDeleted: number }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        await recoverSessionFromRedirect();
      } catch (error) {
        console.error('Auth redirect failed:', error);
      }

      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        setUser(data.session?.user ?? null);
        setIsLoading(false);
      }
    };

    void loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        const pendingName = getPendingDisplayName();
        const hasMetadataName =
          typeof session.user.user_metadata?.display_name === 'string' &&
          session.user.user_metadata.display_name.trim();

        if (pendingName && !hasMetadataName) {
          const { data: updated, error } = await supabase.auth.updateUser({
            data: { display_name: pendingName },
          });

          if (!error && updated.user) {
            clearPendingDisplayName();
            setUser(updated.user);
          }
        }
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const sendLoginCode = async (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      throw new Error('Enter your email address.');
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: getAuthRedirectUrl(),
      },
    });

    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes('rate limit')) {
        throw new Error(
          'Too many sign-in emails sent. Wait about an hour, or use the last Log in link from your inbox if it is still fresh.'
        );
      }
      throw new Error(error.message);
    }
  };

  const verifyLoginCode = async (email: string, token: string, displayName?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedToken = token.trim();

    if (!trimmedEmail || !trimmedToken) {
      throw new Error('Enter the email and verification code.');
    }

    const { data: emailVerify, error: emailError } = await supabase.auth.verifyOtp({
      email: trimmedEmail,
      token: trimmedToken,
      type: 'email',
    });

    let data = emailVerify;
    let error = emailError;

    if (error) {
      const { data: signupVerify, error: signupError } = await supabase.auth.verifyOtp({
        email: trimmedEmail,
        token: trimmedToken,
        type: 'signup',
      });

      data = signupVerify;
      error = signupError;
    }

    if (error) {
      throw new Error(
        'Invalid or expired code. Request a new one — use the 6-digit code, not the email link.'
      );
    }

    const trimmedDisplayName = displayName?.trim();
    if (trimmedDisplayName && data.user) {
      const { data: updated, error: updateError } = await supabase.auth.updateUser({
        data: { display_name: trimmedDisplayName },
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      if (updated.user) {
        setUser(updated.user);
      }
    } else if (data.user) {
      setUser(data.user);
    }
  };

  const signInWithGoogle = async (returnPath = '/profile') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAuthRedirectUrl(returnPath),
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const deleteMyAccount = async () => {
    const pintsDeleted = await purgeMyAccountData();
    await signOut();
    return { pintsDeleted };
  };

  const updateDisplayName = async (displayName: string) => {
    const trimmedDisplayName = displayName.trim();
    if (!trimmedDisplayName) {
      throw new Error('Enter a display name.');
    }

    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: trimmedDisplayName },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      setUser(data.user);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      displayName: getDisplayName(user),
      isLoading,
      sendLoginCode,
      verifyLoginCode,
      signInWithGoogle,
      updateDisplayName,
      deleteMyAccount,
      signOut,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
