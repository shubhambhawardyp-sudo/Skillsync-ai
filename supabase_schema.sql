-- Run this in Supabase: Dashboard -> SQL Editor -> New Query -> paste -> Run

create table if not exists public.user_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  resume jsonb,
  target_role text,
  job_description jsonb,
  skill_gap jsonb,
  roadmap jsonb,
  projects jsonb,
  feedback jsonb,
  updated_at timestamptz default now()
);

alter table public.user_analyses enable row level security;

create policy "Users can view their own analysis"
  on public.user_analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own analysis"
  on public.user_analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own analysis"
  on public.user_analyses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own analysis"
  on public.user_analyses for delete
  using (auth.uid() = user_id);
