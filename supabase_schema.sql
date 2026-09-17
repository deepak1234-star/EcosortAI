-- ==============================================================================
-- EcoSort AI - Supabase Database Schema & Row Level Security (RLS) Setup
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create Profiles Table (Linked to auth.users.id)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'Community Member',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their profile on registration" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);


-- 2. Create Points Ledger Table (Immutable Log of Points Earned & Spent)
CREATE TABLE IF NOT EXISTS public.points_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- 'WELCOME_BONUS', 'WASTE_SCAN', 'COMMUNITY_WORK', 'REWARD_REDEMPTION'
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Points Ledger
ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;

-- Points Ledger Policies
CREATE POLICY "Users can view their own points ledger" 
  ON public.points_ledger FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert points transactions for themselves" 
  ON public.points_ledger FOR INSERT 
  WITH CHECK (auth.uid() = user_id);


-- 3. Create Waste Scans Table
CREATE TABLE IF NOT EXISTS public.waste_scans (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  confidence INTEGER NOT NULL,
  waste_type TEXT NOT NULL,
  recommended_actions TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Waste Scans
ALTER TABLE public.waste_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own waste scans" 
  ON public.waste_scans FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own waste scans" 
  ON public.waste_scans FOR INSERT 
  WITH CHECK (auth.uid() = user_id);


-- 4. Create Community Submissions Table
CREATE TABLE IF NOT EXISTS public.community_submissions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  before_image TEXT,
  after_image TEXT,
  status TEXT DEFAULT 'Approved', -- 'Pending Verification', 'Approved', 'Rejected'
  reward_points INTEGER DEFAULT 50,
  participant_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Community Submissions
ALTER TABLE public.community_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own submissions" 
  ON public.community_submissions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions" 
  ON public.community_submissions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);


-- 5. Create Reward Redemptions Table
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL,
  reward_name TEXT NOT NULL,
  points INTEGER NOT NULL,
  status TEXT DEFAULT 'Fulfilled',
  date TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Reward Redemptions
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own redemptions" 
  ON public.reward_redemptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own redemptions" 
  ON public.reward_redemptions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
