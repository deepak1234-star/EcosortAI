import { supabase } from './supabaseClient';
import type { User, UserAuthCredentials } from '../types';
import {
  registerUserSupabase,
  loginUserSupabase,
  signInWithGoogleOAuth,
  fetchUserProfileSupabase,
  updateProfileSupabase,
  signOutSupabase,
  resetPasswordForEmailSupabase,
  updatePasswordSupabase
} from './supabaseService';

// Active Session User
let currentSessionUser: User | null = null;

/**
 * Clear legacy local storage keys
 */
export const initAuthStorage = (): void => {
  try {
    localStorage.removeItem('ecosort_users_db');
    localStorage.removeItem('ecosort_current_session');
  } catch (e) {
    // Ignore
  }
};

/**
 * Get Current Active Session User
 */
export const getCurrentSessionUser = (): User | null => {
  return currentSessionUser;
};

/**
 * Set Active Session User in Memory
 */
export const setCurrentSessionUser = (user: User | null): void => {
  currentSessionUser = user;
};

/**
 * Initialize and Subscribe to Supabase Auth State Changes
 */
export const subscribeAuthState = (
  onStateChange: (user: User | null, loading: boolean) => void
): (() => void) => {
  let isMounted = true;

  // 1. Fetch initial session from Supabase Auth
  supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (!isMounted) return;
    if (session?.user) {
      const user = await fetchUserProfileSupabase(
        session.user.id,
        session.user.email,
        session.user.user_metadata?.name
      );
      currentSessionUser = user;
      onStateChange(user, false);
    } else {
      currentSessionUser = null;
      onStateChange(null, false);
    }
  }).catch(() => {
    if (isMounted) {
      currentSessionUser = null;
      onStateChange(null, false);
    }
  });

  // 2. Subscribe to auth changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED)
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (!isMounted) return;
    if (session?.user) {
      const user = await fetchUserProfileSupabase(
        session.user.id,
        session.user.email,
        session.user.user_metadata?.name
      );
      currentSessionUser = user;
      onStateChange(user, false);
    } else {
      currentSessionUser = null;
      onStateChange(null, false);
    }
  });

  return () => {
    isMounted = false;
    subscription.unsubscribe();
  };
};

/**
 * Log In User via Supabase Auth
 */
export const loginUser = async (
  credentials: UserAuthCredentials
): Promise<{ success: boolean; message: string; user?: User }> => {
  const res = await loginUserSupabase(credentials.email, credentials.password);
  if (res.success && res.user) {
    currentSessionUser = res.user;
  }
  return res;
};

/**
 * Register User via Supabase Auth
 */
export const registerUser = async (
  credentials: UserAuthCredentials
): Promise<{ success: boolean; message: string; user?: User }> => {
  const res = await registerUserSupabase(
    credentials.email,
    credentials.password,
    credentials.name,
    credentials.role
  );
  if (res.success && res.user) {
    currentSessionUser = res.user;
  }
  return res;
};

/**
 * Trigger Real Google OAuth Redirection via Supabase Auth
 */
export const triggerGoogleOAuth = async (): Promise<{ success: boolean; message?: string }> => {
  return await signInWithGoogleOAuth();
};

/**
 * Send Password Reset Email via Supabase Auth
 */
export const requestPasswordReset = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  return await resetPasswordForEmailSupabase(email);
};

/**
 * Update Password via Supabase Auth
 */
export const resetUserPassword = async (
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  return await updatePasswordSupabase(newPassword);
};

/**
 * Save Active User Profile to Supabase
 */
export const saveSessionUser = (user: User): void => {
  currentSessionUser = user;
  updateProfileSupabase(user);
};

/**
 * Log Out Session from Supabase & Clear App State
 */
export const logoutSession = async (): Promise<void> => {
  currentSessionUser = null;
  initAuthStorage();
  await signOutSupabase();
};
