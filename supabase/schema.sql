-- BoxingWiki Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ══════════════════════════════════════════════════════════════
-- 1. Fighter Profiles — core user data synced from localStorage
-- ══════════════════════════════════════════════════════════════

create table if not exists fighter_profiles (
  id uuid default gen_random_uuid() primary key,
  clerk_user_id text unique not null,
  display_name text not null default 'Fighter',
  xp integer not null default 0,
  workouts_completed integer not null default 0,
  articles_read text[] not null default '{}',
  techniques_studied text[] not null default '{}',
  quizzes_completed text[] not null default '{}',
  timer_sessions integer not null default 0,
  program_days_completed integer not null default 0,
  longest_streak integer not null default 0,
  seen_badges text[] not null default '{}',
  daily_awards jsonb not null default '{}',
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- v0.9.2: Cloud-synced user preferences & progress
  stance text not null default 'orthodox',
  program_progress jsonb not null default '{}',
  workout_log jsonb not null default '[]',
  current_streak integer not null default 0,
  last_visit text,
  browsing_history jsonb not null default '[]'
);

-- Index for fast lookups by Clerk user ID
create index if not exists idx_fighter_profiles_clerk_user_id on fighter_profiles(clerk_user_id);

-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on fighter_profiles
  for each row execute function update_updated_at_column();


-- ══════════════════════════════════════════════════════════════
-- 2. Saved Workouts — generated workout plans
-- ══════════════════════════════════════════════════════════════

create table if not exists saved_workouts (
  id uuid default gen_random_uuid() primary key,
  clerk_user_id text not null references fighter_profiles(clerk_user_id) on delete cascade,
  title text not null,
  duration text not null,
  goal text not null,
  level text not null,
  equipment text not null,
  drills jsonb not null default '[]',
  gym_exercises jsonb not null default '[]',
  warmup text[] not null default '{}',
  cooldown text[] not null default '{}',
  saved_at timestamptz not null default now()
);

create index if not exists idx_saved_workouts_clerk_user_id on saved_workouts(clerk_user_id);


-- ══════════════════════════════════════════════════════════════
-- 3. Favorites — saved technique IDs
-- ══════════════════════════════════════════════════════════════

create table if not exists favorites (
  id uuid default gen_random_uuid() primary key,
  clerk_user_id text not null references fighter_profiles(clerk_user_id) on delete cascade,
  technique_id text not null,
  saved_at timestamptz not null default now(),
  unique(clerk_user_id, technique_id)
);

create index if not exists idx_favorites_clerk_user_id on favorites(clerk_user_id);


-- ══════════════════════════════════════════════════════════════
-- 4. Training Stats — timer/shadowbox analytics
-- ══════════════════════════════════════════════════════════════

create table if not exists training_stats (
  id uuid default gen_random_uuid() primary key,
  clerk_user_id text unique not null references fighter_profiles(clerk_user_id) on delete cascade,
  total_rounds integer not null default 0,
  total_training_time integer not null default 0,
  total_sessions integer not null default 0,
  weekly_log jsonb not null default '{}',
  updated_at timestamptz not null default now()
);


-- ══════════════════════════════════════════════════════════════
-- 5. Row Level Security — users can only access their own data
-- ══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
alter table fighter_profiles enable row level security;
alter table saved_workouts enable row level security;
alter table favorites enable row level security;
alter table training_stats enable row level security;

-- Policy: users can read/write their own rows
-- We pass clerk_user_id via the JWT or as a request header

-- Fighter Profiles
create policy "Users can view own profile"
  on fighter_profiles for select
  using (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');

create policy "Users can insert own profile"
  on fighter_profiles for insert
  with check (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');

create policy "Users can update own profile"
  on fighter_profiles for update
  using (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');

-- Saved Workouts
create policy "Users can view own workouts"
  on saved_workouts for select
  using (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');

create policy "Users can insert own workouts"
  on saved_workouts for insert
  with check (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');

create policy "Users can delete own workouts"
  on saved_workouts for delete
  using (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');

-- Favorites
create policy "Users can view own favorites"
  on favorites for select
  using (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');

create policy "Users can insert own favorites"
  on favorites for insert
  with check (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');

create policy "Users can delete own favorites"
  on favorites for delete
  using (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');

-- Training Stats
create policy "Users can view own stats"
  on training_stats for select
  using (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');

create policy "Users can upsert own stats"
  on training_stats for insert
  with check (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');

create policy "Users can update own stats"
  on training_stats for update
  using (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');
