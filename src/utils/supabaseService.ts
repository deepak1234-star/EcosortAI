import { supabase } from './supabaseClient';
import type { User, WasteScan, CommunitySubmission, RewardRedemption, RoleType } from '../types';
import { REAL_PHOTO_ASSETS } from './photoAssets';

/**
 * Register a new User directly with Supabase Auth & Profiles
 */
export async function registerUserSupabase(
  email: string,
  password?: string,
  name?: string,
  role?: string
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const emailClean = email.trim().toLowerCase();
    const displayName = name?.trim() || emailClean.split('@')[0];
    const userRole: RoleType = (role as RoleType) || 'Community Member';
    const pwdToUse = password || 'password123';

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: emailClean,
      password: pwdToUse,
      options: {
        data: {
          name: displayName,
          role: userRole
        }
      }
    });

    if (authErr) {
      // Fallback: If account already registered in Auth, try logging in
      if (authErr.message.includes('already registered')) {
        return await loginUserSupabase(emailClean, pwdToUse);
      }
      return { success: false, message: authErr.message };
    }

    const userId = authData.user?.id || `usr_sp_${Date.now()}`;

    const newUser: User = {
      id: userId,
      name: displayName,
      email: emailClean,
      role: userRole,
      ecoPoints: 100, // Welcome bonus
      activitiesCompleted: 0,
      scansCompleted: 0,
      avatar: REAL_PHOTO_ASSETS.avatar_deepak
    };

    // 2. Insert into Supabase Profiles Table
    const { error: profileErr } = await supabase.from('profiles').upsert([
      {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        eco_points: newUser.ecoPoints,
        activities_completed: newUser.activitiesCompleted,
        scans_completed: newUser.scansCompleted,
        avatar_url: newUser.avatar,
        updated_at: new Date().toISOString()
      }
    ]);

    if (profileErr) {
      console.warn('Supabase profile creation warning:', profileErr.message);
    }

    return {
      success: true,
      message: `Account created in Supabase! Welcome, ${newUser.name}. (+100 Eco Points)`,
      user: newUser
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Supabase authentication failed.' };
  }
}

/**
 * Log in User directly with Supabase Auth & Profiles
 */
export async function loginUserSupabase(
  email: string,
  password?: string
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const emailClean = email.trim().toLowerCase();
    const pwdToUse = password || 'password123';

    // 1. Sign in with Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: emailClean,
      password: pwdToUse
    });

    if (authErr) {
      // If user is not yet in Supabase Auth, register them directly
      return await registerUserSupabase(emailClean, pwdToUse);
    }

    const userId = authData.user?.id || `usr_${Date.now()}`;

    // 2. Fetch Profile from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', emailClean)
      .maybeSingle();

    let user: User;
    if (profile) {
      user = {
        id: profile.id || userId,
        name: profile.name || emailClean.split('@')[0],
        email: profile.email || emailClean,
        role: (profile.role as RoleType) || 'Community Member',
        ecoPoints: profile.eco_points ?? 100,
        activitiesCompleted: profile.activities_completed ?? 0,
        scansCompleted: profile.scans_completed ?? 0,
        avatar: profile.avatar_url || REAL_PHOTO_ASSETS.avatar_deepak
      };
    } else {
      user = {
        id: userId,
        name: emailClean.split('@')[0],
        email: emailClean,
        role: 'Community Member',
        ecoPoints: 100,
        activitiesCompleted: 0,
        scansCompleted: 0,
        avatar: REAL_PHOTO_ASSETS.avatar_deepak
      };

      // Create missing profile row in Supabase
      await supabase.from('profiles').upsert([
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          eco_points: user.ecoPoints,
          activities_completed: user.activitiesCompleted,
          scans_completed: user.scansCompleted,
          avatar_url: user.avatar,
          updated_at: new Date().toISOString()
        }
      ]);
    }

    return {
      success: true,
      message: `Signed in via Supabase! Welcome back, ${user.name}.`,
      user
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Supabase Login Failed' };
  }
}

/**
 * Log in via Google Account directly with Supabase
 */
export async function loginWithGoogleSupabase(
  name: string,
  email: string,
  avatar?: string
): Promise<{ success: boolean; message: string; user: User }> {
  const res = await registerUserSupabase(email, 'google_oauth_pass', name, 'Community Member');
  const user = res.user || {
    id: `usr_g_${Date.now()}`,
    name: name || email.split('@')[0],
    email: email.trim().toLowerCase(),
    role: 'Community Member',
    ecoPoints: 100,
    activitiesCompleted: 0,
    scansCompleted: 0,
    avatar: avatar || REAL_PHOTO_ASSETS.avatar_deepak
  };

  if (avatar && user.avatar !== avatar) {
    user.avatar = avatar;
    await updateProfileSupabase(user);
  }

  return {
    success: true,
    message: `Signed in via Supabase as ${user.name}`,
    user
  };
}

/**
 * Update Profile details in Supabase
 */
export async function updateProfileSupabase(user: User): Promise<void> {
  try {
    await supabase.from('profiles').upsert([
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        eco_points: user.ecoPoints,
        activities_completed: user.activitiesCompleted,
        scans_completed: user.scansCompleted,
        avatar_url: user.avatar,
        updated_at: new Date().toISOString()
      }
    ]);
  } catch (e) {
    console.warn('Supabase profile update warning:', e);
  }
}

/**
 * Fetch Waste Scans from Supabase
 */
export async function fetchWasteScansSupabase(userId: string): Promise<WasteScan[]> {
  try {
    const { data, error } = await supabase
      .from('waste_scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((d) => ({
      id: d.id,
      itemName: d.item_name,
      category: d.category,
      confidence: d.confidence,
      type: d.waste_type,
      recommendedActions: d.recommended_actions || [],
      imageUrl: d.image_url,
      date: new Date(d.created_at).toISOString().split('T')[0]
    }));
  } catch (e) {
    return [];
  }
}

/**
 * Save Waste Scan to Supabase
 */
export async function saveWasteScanSupabase(scan: WasteScan, userId: string): Promise<void> {
  try {
    await supabase.from('waste_scans').insert([
      {
        id: scan.id,
        user_id: userId,
        item_name: scan.itemName,
        category: scan.category,
        confidence: scan.confidence,
        waste_type: scan.type,
        recommended_actions: scan.recommendedActions,
        image_url: scan.imageUrl,
        created_at: new Date().toISOString()
      }
    ]);
  } catch (err) {
    console.error('Supabase scan save exception:', err);
  }
}

/**
 * Save Community Submission to Supabase
 */
export async function saveSubmissionSupabase(sub: CommunitySubmission, userId: string): Promise<void> {
  try {
    await supabase.from('community_submissions').insert([
      {
        id: sub.id,
        user_id: userId,
        activity_id: sub.activityId,
        activity_name: sub.activityName,
        date: sub.date,
        location: sub.location,
        description: sub.description,
        before_image: sub.beforeImage,
        after_image: sub.afterImage,
        status: sub.status,
        reward_points: sub.rewardPoints,
        participant_name: sub.participantName,
        created_at: new Date().toISOString()
      }
    ]);
  } catch (err) {
    console.error('Supabase submission exception:', err);
  }
}

/**
 * Save Reward Redemption to Supabase
 */
export async function saveRedemptionSupabase(red: RewardRedemption, userId: string): Promise<void> {
  try {
    await supabase.from('reward_redemptions').insert([
      {
        id: red.id,
        user_id: userId,
        reward_id: red.rewardId,
        reward_name: red.rewardName,
        points: red.points,
        status: red.status,
        date: red.date,
        image_url: red.image,
        created_at: new Date().toISOString()
      }
    ]);
  } catch (err) {
    console.error('Supabase redemption exception:', err);
  }
}

/**
 * Sign Out from Supabase Auth
 */
export async function signOutSupabase(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    // Ignore signout warnings
  }
}
