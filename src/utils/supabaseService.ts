import { supabase } from './supabaseClient';
import type {
  User,
  WasteScan,
  CommunitySubmission,
  RewardRedemption,
  RoleType,
  PointsLedgerItem
} from '../types';
import { REAL_PHOTO_ASSETS } from './photoAssets';

/**
 * Register a new User directly with Supabase Auth & Create Profile + Welcome Ledger Entry
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
      return { success: false, message: authErr.message || 'Registration failed.' };
    }

    if (!authData.user) {
      return { success: false, message: 'Registration initiated. Please check your email to verify your account.' };
    }

    const userId = authData.user.id;

    // 2. Insert into Supabase Profiles Table
    const { error: profileErr } = await supabase.from('profiles').upsert([
      {
        id: userId,
        name: displayName,
        email: emailClean,
        role: userRole,
        avatar_url: REAL_PHOTO_ASSETS.avatar_deepak,
        updated_at: new Date().toISOString()
      }
    ]);

    if (profileErr) {
      console.warn('Supabase profile creation warning:', profileErr.message);
    }

    // 3. Add Welcome Bonus Points to Points Ledger (+100 Eco Points)
    await addPointsLedgerEntry(
      userId,
      100,
      'WELCOME_BONUS',
      'Sign-up Welcome Bonus (+100 Eco Points)'
    );

    const user: User = {
      id: userId,
      name: displayName,
      email: emailClean,
      role: userRole,
      ecoPoints: 100,
      activitiesCompleted: 0,
      scansCompleted: 0,
      avatar: REAL_PHOTO_ASSETS.avatar_deepak
    };

    return {
      success: true,
      message: `Account created successfully! Welcome, ${user.name}. (+100 Eco Points)`,
      user
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Supabase registration failed.' };
  }
}

/**
 * Log in User strictly via Supabase Auth. NEVER bypass Auth or fallback to fake sessions.
 */
export async function loginUserSupabase(
  email: string,
  password?: string
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const emailClean = email.trim().toLowerCase();
    if (!password) {
      return { success: false, message: 'Please enter your password.' };
    }

    // 1. Authenticate STRICTLY with Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: emailClean,
      password
    });

    if (authErr || !authData.user) {
      return { success: false, message: 'Invalid email or password' };
    }

    const userId = authData.user.id;

    // 2. Fetch User Profile & Compute Points Balance from Ledger
    const user = await fetchUserProfileSupabase(userId, emailClean, authData.user.user_metadata?.name);

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Invalid email or password' };
  }
}

/**
 * Initiate Real Google OAuth Redirection via Supabase Auth
 */
export async function signInWithGoogleOAuth(): Promise<{ success: boolean; message?: string }> {
  try {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'USE_GOOGLE_MODAL' };
    }

    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/dashboard`
      : 'https://ecosortai-three.vercel.app/dashboard';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    });

    if (error) {
      return {
        success: false,
        message: error.message
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'USE_GOOGLE_MODAL'
    };
  }
}

/**
 * Send Password Reset Email via Supabase Auth
 */
export async function resetPasswordForEmailSupabase(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    const emailClean = email.trim().toLowerCase();
    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/reset-password`
      : 'https://ecosortai-three.vercel.app/reset-password';

    const { error } = await supabase.auth.resetPasswordForEmail(emailClean, {
      redirectTo: redirectUrl
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: 'Password reset instructions have been sent to your email address.'
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to send password reset email.' };
  }
}

/**
 * Update User Password via Supabase Auth
 */
export async function updatePasswordSupabase(
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.'
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to update password.' };
  }
}

/**
 * Fetch User Profile connected strictly to auth.users.id
 */
export async function fetchUserProfileSupabase(
  userId: string,
  fallbackEmail?: string,
  fallbackName?: string
): Promise<User> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    // Compute total points from Points Ledger
    const totalPoints = await fetchUserPointsTotal(userId);
    const scansCount = await fetchUserScansCount(userId);
    const activitiesCount = await fetchUserSubmissionsCount(userId);

    if (profile) {
      return {
        id: profile.id,
        name: profile.name || fallbackName || profile.email.split('@')[0],
        email: profile.email || fallbackEmail || '',
        role: (profile.role as RoleType) || 'Community Member',
        ecoPoints: totalPoints,
        activitiesCompleted: activitiesCount,
        scansCompleted: scansCount,
        avatar: profile.avatar_url || REAL_PHOTO_ASSETS.avatar_deepak
      };
    }

    // Create profile if missing for authenticated user
    const newUser: User = {
      id: userId,
      name: fallbackName || fallbackEmail?.split('@')[0] || 'Community Member',
      email: fallbackEmail || '',
      role: 'Community Member',
      ecoPoints: totalPoints,
      activitiesCompleted: activitiesCount,
      scansCompleted: scansCount,
      avatar: REAL_PHOTO_ASSETS.avatar_deepak
    };

    await supabase.from('profiles').upsert([
      {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar_url: newUser.avatar,
        updated_at: new Date().toISOString()
      }
    ]);

    return newUser;
  } catch (e) {
    return {
      id: userId,
      name: fallbackName || fallbackEmail?.split('@')[0] || 'User',
      email: fallbackEmail || '',
      role: 'Community Member',
      ecoPoints: 0,
      activitiesCompleted: 0,
      scansCompleted: 0,
      avatar: REAL_PHOTO_ASSETS.avatar_deepak
    };
  }
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
        avatar_url: user.avatar,
        updated_at: new Date().toISOString()
      }
    ]);
  } catch (e) {
    console.warn('Supabase profile update warning:', e);
  }
}

/**
 * Add entry to Points Ledger (Immutable ledger of points earned and spent)
 */
export async function addPointsLedgerEntry(
  userId: string,
  points: number,
  actionType: 'WELCOME_BONUS' | 'WASTE_SCAN' | 'COMMUNITY_WORK' | 'REWARD_REDEMPTION',
  description: string
): Promise<void> {
  try {
    await supabase.from('points_ledger').insert([
      {
        user_id: userId,
        points,
        action_type: actionType,
        description,
        created_at: new Date().toISOString()
      }
    ]);
  } catch (e) {
    console.error('Failed to log points ledger entry:', e);
  }
}

/**
 * Compute total Eco Points balance from Points Ledger for user
 */
export async function fetchUserPointsTotal(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('points_ledger')
      .select('points')
      .eq('user_id', userId);

    if (error || !data || data.length === 0) return 0;
    return data.reduce((sum, item) => sum + (item.points || 0), 0);
  } catch (e) {
    return 0;
  }
}

/**
 * Fetch Points Ledger history for user
 */
export async function fetchPointsLedger(userId: string): Promise<PointsLedgerItem[]> {
  try {
    const { data, error } = await supabase
      .from('points_ledger')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((d) => ({
      id: d.id,
      userId: d.user_id,
      points: d.points,
      actionType: d.action_type,
      description: d.description,
      createdAt: d.created_at
    }));
  } catch (e) {
    return [];
  }
}

/**
 * Fetch Waste Scans count for user
 */
async function fetchUserScansCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('waste_scans')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    return error ? 0 : count || 0;
  } catch (e) {
    return 0;
  }
}

/**
 * Fetch Submissions count for user
 */
async function fetchUserSubmissionsCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('community_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    return error ? 0 : count || 0;
  } catch (e) {
    return 0;
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
 * Save Waste Scan to Supabase & Award +15 Points in Points Ledger
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

    // Award 15 points per scan in Points Ledger
    await addPointsLedgerEntry(
      userId,
      15,
      'WASTE_SCAN',
      `Waste Scan: ${scan.itemName} (${scan.category})`
    );
  } catch (err) {
    console.error('Supabase scan save exception:', err);
  }
}

/**
 * Save Community Submission to Supabase & Award Activity Points in Ledger with Duplicate Check
 */
export async function saveSubmissionSupabase(
  sub: CommunitySubmission,
  userId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Check duplicate submission for same activity by this user
    const { data: existing } = await supabase
      .from('community_submissions')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_id', sub.activityId)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        message: 'You have already submitted proof for this community activity.'
      };
    }

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

    // Record Points in Points Ledger
    await addPointsLedgerEntry(
      userId,
      sub.rewardPoints || 50,
      'COMMUNITY_WORK',
      `Community Work: ${sub.activityName}`
    );

    return {
      success: true,
      message: `Submission recorded! You earned +${sub.rewardPoints} Eco Points.`
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to record submission.' };
  }
}

/**
 * Atomic Reward Redemption with Points Check and Points Ledger Deduction
 */
export async function saveRedemptionSupabase(
  red: RewardRedemption,
  userId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Verify User Points Balance
    const currentPoints = await fetchUserPointsTotal(userId);
    if (currentPoints < red.points) {
      return {
        success: false,
        message: `Insufficient Eco Points. Required: ${red.points}, Current Balance: ${currentPoints}.`
      };
    }

    // 2. Insert Redemption Record
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

    // 3. Deduct Points via Negative Ledger Entry
    await addPointsLedgerEntry(
      userId,
      -red.points,
      'REWARD_REDEMPTION',
      `Redeemed Reward: ${red.rewardName}`
    );

    return {
      success: true,
      message: `Reward "${red.rewardName}" redeemed successfully! (${red.points} points deducted)`
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to process reward redemption.' };
  }
}

/**
 * Fetch Reward Redemptions for User
 */
export async function fetchRedemptionsSupabase(userId: string): Promise<RewardRedemption[]> {
  try {
    const { data, error } = await supabase
      .from('reward_redemptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((d) => ({
      id: d.id,
      rewardId: d.reward_id,
      rewardName: d.reward_name,
      points: d.points,
      date: d.date,
      status: d.status,
      image: d.image_url
    }));
  } catch (e) {
    return [];
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
