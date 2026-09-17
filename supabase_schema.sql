-- ==============================================================================
-- EcoSort AI - Supabase Database Schema & RLS Setup (Clerk & Google OAuth Ready)
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create Profiles Table (Supports both Clerk user_xxx IDs and UUIDs)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'Community Member',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies if existing
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their profile on registration" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public update profiles" ON public.profiles;

-- Open Policies for Profiles
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update profiles" ON public.profiles FOR UPDATE USING (true);


-- 2. Create Points Ledger Table (Immutable Log of Points)
CREATE TABLE IF NOT EXISTS public.points_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  points INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- 'WELCOME_BONUS', 'WASTE_SCAN', 'COMMUNITY_WORK', 'REWARD_REDEMPTION'
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own points ledger" ON public.points_ledger;
DROP POLICY IF EXISTS "Users can insert points transactions for themselves" ON public.points_ledger;
DROP POLICY IF EXISTS "Allow public read points_ledger" ON public.points_ledger;
DROP POLICY IF EXISTS "Allow public insert points_ledger" ON public.points_ledger;

CREATE POLICY "Allow public read points_ledger" ON public.points_ledger FOR SELECT USING (true);
CREATE POLICY "Allow public insert points_ledger" ON public.points_ledger FOR INSERT WITH CHECK (true);


-- 3. Create Waste Scans Table
CREATE TABLE IF NOT EXISTS public.waste_scans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  confidence INTEGER NOT NULL,
  waste_type TEXT NOT NULL,
  recommended_actions TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.waste_scans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own waste scans" ON public.waste_scans;
DROP POLICY IF EXISTS "Users can insert their own waste scans" ON public.waste_scans;
DROP POLICY IF EXISTS "Allow public read waste_scans" ON public.waste_scans;
DROP POLICY IF EXISTS "Allow public insert waste_scans" ON public.waste_scans;

CREATE POLICY "Allow public read waste_scans" ON public.waste_scans FOR SELECT USING (true);
CREATE POLICY "Allow public insert waste_scans" ON public.waste_scans FOR INSERT WITH CHECK (true);


-- 4. Create Community Submissions Table
CREATE TABLE IF NOT EXISTS public.community_submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  before_image TEXT,
  after_image TEXT,
  status TEXT DEFAULT 'Approved',
  reward_points INTEGER DEFAULT 50,
  participant_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.community_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own submissions" ON public.community_submissions;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.community_submissions;
DROP POLICY IF EXISTS "Allow public read community_submissions" ON public.community_submissions;
DROP POLICY IF EXISTS "Allow public insert community_submissions" ON public.community_submissions;

CREATE POLICY "Allow public read community_submissions" ON public.community_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert community_submissions" ON public.community_submissions FOR INSERT WITH CHECK (true);


-- 5. Create Reward Redemptions Table
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  reward_id TEXT NOT NULL,
  reward_name TEXT NOT NULL,
  points INTEGER NOT NULL,
  status TEXT DEFAULT 'Fulfilled',
  date TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own redemptions" ON public.reward_redemptions;
DROP POLICY IF EXISTS "Users can insert their own redemptions" ON public.reward_redemptions;
DROP POLICY IF EXISTS "Allow public read reward_redemptions" ON public.reward_redemptions;
DROP POLICY IF EXISTS "Allow public insert reward_redemptions" ON public.reward_redemptions;

CREATE POLICY "Allow public read reward_redemptions" ON public.reward_redemptions FOR SELECT USING (true);
CREATE POLICY "Allow public insert reward_redemptions" ON public.reward_redemptions FOR INSERT WITH CHECK (true);
