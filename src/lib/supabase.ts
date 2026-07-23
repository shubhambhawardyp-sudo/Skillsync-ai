import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[SkillSync] Supabase env vars are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file. Auth and saving will be disabled until then.'
  );
}

// Fall back to placeholder values so createClient doesn't throw when env vars are absent.
// isSupabaseConfigured should be checked before relying on real auth/db behavior.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

export interface UserAnalysisRow {
  id: string;
  user_id: string;
  resume: unknown;
  target_role: string | null;
  job_description: unknown;
  skill_gap: unknown;
  roadmap: unknown;
  projects: unknown;
  feedback: unknown;
  updated_at: string;
}
