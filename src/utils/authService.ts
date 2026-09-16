import type { User, UserAuthCredentials } from '../types';
import {
  registerUserSupabase,
  loginUserSupabase,
  loginWithGoogleSupabase,
  updateProfileSupabase,
  signOutSupabase
} from './supabaseService';

// Active Session Cache (in-memory for instant responsive UI)
let currentSessionUser: User | null = null;

/**
 * Initialize Auth: Clear legacy mock storage and connect directly to Supabase
 */
export const initAuthStorage = (): void => {
  // Clear legacy mock accounts from localStorage if present
  try {
    localStorage.removeItem('ecosort_users_db');
  } catch (e) {
    // Ignore
  }
};

/**
 * Get Current Active Session User
 */
export const getCurrentSessionUser = (): User | null => {
  if (currentSessionUser) return currentSessionUser;
  try {
    const data = localStorage.getItem('ecosort_current_session');
    if (data) {
      currentSessionUser = JSON.parse(data);
      return currentSessionUser;
    }
  } catch (e) {
    return null;
  }
  return null;
};

/**
 * Log In User via Supabase Auth & Profiles
 */
export const loginUser = async (
  credentials: UserAuthCredentials
): Promise<{ success: boolean; message: string; user?: User }> => {
  const res = await loginUserSupabase(credentials.email, credentials.password);
  if (res.success && res.user) {
    currentSessionUser = res.user;
    localStorage.setItem('ecosort_current_session', JSON.stringify(res.user));
  }
  return res;
};

/**
 * Register User via Supabase Auth & Profiles
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
    localStorage.setItem('ecosort_current_session', JSON.stringify(res.user));
  }
  return res;
};

/**
 * Sign In with Google Account via Supabase
 */
export const loginWithGoogleAccount = async (
  googleName: string,
  googleEmail: string,
  googleAvatar?: string
): Promise<{ success: boolean; message: string; user: User }> => {
  const res = await loginWithGoogleSupabase(googleName, googleEmail, googleAvatar);
  if (res.success && res.user) {
    currentSessionUser = res.user;
    localStorage.setItem('ecosort_current_session', JSON.stringify(res.user));
  }
  return res;
};

/**
 * Save Active User Profile to Supabase & Active Session
 */
export const saveSessionUser = (user: User): void => {
  currentSessionUser = user;
  localStorage.setItem('ecosort_current_session', JSON.stringify(user));
  updateProfileSupabase(user);
};

/**
 * Log Out Session from Supabase
 */
export const logoutSession = async (): Promise<void> => {
  currentSessionUser = null;
  localStorage.removeItem('ecosort_current_session');
  await signOutSupabase();
};
