import type {
  User,
  WasteScan,
  CommunitySubmission,
  Reward,
  RewardRedemption
} from '../types';
import {
  INITIAL_SCANS,
  INITIAL_SUBMISSIONS,
  INITIAL_REWARDS,
  INITIAL_REDEMPTIONS
} from '../data/mockData';
import {
  getCurrentSessionUser,
  saveSessionUser,
  initAuthStorage
} from './authService';
import {
  updateProfileSupabase,
  saveWasteScanSupabase,
  saveSubmissionSupabase,
  saveRedemptionSupabase
} from './supabaseService';

const KEYS = {
  SCANS: 'ecosort_scans',
  SUBMISSIONS: 'ecosort_submissions',
  REWARDS: 'ecosort_rewards',
  REDEMPTIONS: 'ecosort_redemptions'
};

export const initializeStorage = (): void => {
  initAuthStorage();
  if (!localStorage.getItem(KEYS.SCANS)) {
    localStorage.setItem(KEYS.SCANS, JSON.stringify(INITIAL_SCANS));
  }
  if (!localStorage.getItem(KEYS.SUBMISSIONS)) {
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
  }
  if (!localStorage.getItem(KEYS.REWARDS)) {
    localStorage.setItem(KEYS.REWARDS, JSON.stringify(INITIAL_REWARDS));
  }
  if (!localStorage.getItem(KEYS.REDEMPTIONS)) {
    localStorage.setItem(KEYS.REDEMPTIONS, JSON.stringify(INITIAL_REDEMPTIONS));
  }
};

export const resetStorage = (): void => {
  localStorage.setItem(KEYS.SCANS, JSON.stringify(INITIAL_SCANS));
  localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
  localStorage.setItem(KEYS.REWARDS, JSON.stringify(INITIAL_REWARDS));
  localStorage.setItem(KEYS.REDEMPTIONS, JSON.stringify(INITIAL_REDEMPTIONS));
};

export const getUser = (): User => {
  const current = getCurrentSessionUser();
  if (current) return current;
  return {
    id: 'usr_guest',
    name: 'Guest Member',
    email: 'guest@ecosort.org',
    role: 'Community Member',
    ecoPoints: 0,
    activitiesCompleted: 0,
    scansCompleted: 0,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
  };
};

export const saveUser = (user: User): void => {
  const sanitizedUser = {
    ...user,
    ecoPoints: Math.max(0, user.ecoPoints)
  };
  saveSessionUser(sanitizedUser);
  if (sanitizedUser.id && sanitizedUser.id !== 'usr_guest') {
    updateProfileSupabase(sanitizedUser);
  }
};

export const getScans = (): WasteScan[] => {
  initializeStorage();
  try {
    const data = localStorage.getItem(KEYS.SCANS);
    return data ? JSON.parse(data) : INITIAL_SCANS;
  } catch (e) {
    return INITIAL_SCANS;
  }
};

export const addScan = (scan: Omit<WasteScan, 'id'>): WasteScan => {
  const scans = getScans();
  const newScan: WasteScan = {
    ...scan,
    id: `scan_${Date.now()}`
  };
  const updatedScans = [newScan, ...scans];
  localStorage.setItem(KEYS.SCANS, JSON.stringify(updatedScans));

  const user = getUser();
  if (user.id !== 'usr_guest') {
    saveUser({
      ...user,
      scansCompleted: user.scansCompleted + 1
    });
    saveWasteScanSupabase(newScan, user.id);
  }

  return newScan;
};

export const getSubmissions = (): CommunitySubmission[] => {
  initializeStorage();
  try {
    const data = localStorage.getItem(KEYS.SUBMISSIONS);
    return data ? JSON.parse(data) : INITIAL_SUBMISSIONS;
  } catch (e) {
    return INITIAL_SUBMISSIONS;
  }
};

export const addSubmission = (
  submissionData: Omit<CommunitySubmission, 'id' | 'status' | 'submittedAt'>
): CommunitySubmission => {
  const submissions = getSubmissions();
  const newSubmission: CommunitySubmission = {
    ...submissionData,
    id: `sub_${Date.now()}`,
    status: 'Pending Verification',
    submittedAt: new Date().toISOString()
  };

  const updatedSubmissions = [newSubmission, ...submissions];
  localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(updatedSubmissions));

  const user = getUser();
  if (user.id !== 'usr_guest') {
    saveSubmissionSupabase(newSubmission, user.id);
  }

  return newSubmission;
};

export const verifySubmission = (
  submissionId: string,
  newStatus: 'Approved' | 'Rejected'
): { submission: CommunitySubmission | null; pointsAwarded: number } => {
  const submissions = getSubmissions();
  const submissionIndex = submissions.findIndex((s) => s.id === submissionId);

  if (submissionIndex === -1) {
    return { submission: null, pointsAwarded: 0 };
  }

  const currentSubmission = submissions[submissionIndex];

  if (currentSubmission.status !== 'Pending Verification') {
    return { submission: currentSubmission, pointsAwarded: 0 };
  }

  const updatedSubmission: CommunitySubmission = {
    ...currentSubmission,
    status: newStatus
  };

  submissions[submissionIndex] = updatedSubmission;
  localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(submissions));

  let pointsAwarded = 0;
  if (newStatus === 'Approved') {
    pointsAwarded = currentSubmission.rewardPoints;
    const user = getUser();
    saveUser({
      ...user,
      ecoPoints: user.ecoPoints + pointsAwarded,
      activitiesCompleted: user.activitiesCompleted + 1
    });
  }

  return { submission: updatedSubmission, pointsAwarded };
};

export const getRewards = (): Reward[] => {
  initializeStorage();
  try {
    const data = localStorage.getItem(KEYS.REWARDS);
    return data ? JSON.parse(data) : INITIAL_REWARDS;
  } catch (e) {
    return INITIAL_REWARDS;
  }
};

export const getRedemptions = (): RewardRedemption[] => {
  initializeStorage();
  try {
    const data = localStorage.getItem(KEYS.REDEMPTIONS);
    return data ? JSON.parse(data) : INITIAL_REDEMPTIONS;
  } catch (e) {
    return INITIAL_REDEMPTIONS;
  }
};

export const redeemReward = (reward: Reward): { success: boolean; message: string; redemption?: RewardRedemption } => {
  const user = getUser();

  if (user.ecoPoints < reward.points) {
    return {
      success: false,
      message: `Insufficient Eco Points. You have ${user.ecoPoints} points, but this reward costs ${reward.points} points.`
    };
  }

  const updatedUser: User = {
    ...user,
    ecoPoints: user.ecoPoints - reward.points
  };
  saveUser(updatedUser);

  const redemptions = getRedemptions();
  const newRedemption: RewardRedemption = {
    id: `red_${Date.now()}`,
    rewardId: reward.id,
    rewardName: reward.name,
    points: reward.points,
    date: new Date().toISOString().split('T')[0],
    status: 'Fulfilled',
    image: reward.image
  };

  const updatedRedemptions = [newRedemption, ...redemptions];
  localStorage.setItem(KEYS.REDEMPTIONS, JSON.stringify(updatedRedemptions));

  if (updatedUser.id && updatedUser.id !== 'usr_guest') {
    saveRedemptionSupabase(newRedemption, updatedUser.id);
  }

  return {
    success: true,
    message: `Successfully redeemed ${reward.name}!`,
    redemption: newRedemption
  };
};
