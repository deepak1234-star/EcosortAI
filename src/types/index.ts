export type RoleType = 'Community Member' | 'Volunteer' | 'Educator' | 'Community Leader';

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  ecoPoints: number;
  activitiesCompleted: number;
  scansCompleted: number;
  avatar: string;
}

export interface UserAuthCredentials {
  name?: string;
  email: string;
  password?: string;
  role?: RoleType;
}

export type WasteCategoryType =
  | 'Organic'
  | 'Paper'
  | 'Plastic'
  | 'Metal'
  | 'Glass'
  | 'E-Waste'
  | 'Hazardous';

export interface WasteScan {
  id: string;
  itemName: string;
  category: WasteCategoryType;
  confidence: number;
  type: string;
  recommendedActions: string[];
  date: string;
  imageUrl?: string;
}

export interface CommunityActivity {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  iconName: string;
  categoryTag: string;
}

export interface CommunitySubmission {
  id: string;
  activityId: string;
  activityName: string;
  date: string;
  location: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  status: 'Pending Verification' | 'Approved' | 'Rejected';
  rewardPoints: number;
  submittedAt: string;
  participantName: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  rewardName: string;
  points: number;
  date: string;
  status: 'Fulfilled' | 'Processing';
  image?: string;
}

export interface DemoClassification {
  id: string;
  name: string;
  confidence: number;
  category: WasteCategoryType;
  type: string;
  recommendedActions: string[];
  sampleImage?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
