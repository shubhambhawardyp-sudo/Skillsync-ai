import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { 
  ResumeData, 
  JobDescriptionData, 
  SkillGapResult, 
  RoadmapWeek, 
  ProjectRecommendation, 
  ResumeFeedback,
  DUMMY_RESUME,
  DUMMY_JD,
  analyzeSkillGap,
  generateRoadmap,
  generateProjectRecommendations,
  generateResumeFeedback
} from '../services/aiService';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AppState {
  resume: ResumeData | null;
  targetRole: string;
  jobDescription: JobDescriptionData | null;
  skillGap: SkillGapResult | null;
  roadmap: RoadmapWeek[] | null;
  projects: ProjectRecommendation[] | null;
  feedback: ResumeFeedback[] | null;
  isSaving: boolean;

  setResume: (resume: ResumeData | null) => void;
  setTargetRole: (role: string) => void;
  setJobDescription: (jd: JobDescriptionData | null) => void;
  setSkillGap: (gap: SkillGapResult | null) => void;
  setRoadmap: (roadmap: RoadmapWeek[] | null) => void;
  setProjects: (projects: ProjectRecommendation[] | null) => void;
  setFeedback: (feedback: ResumeFeedback[] | null) => void;

  toggleRoadmapTask: (weekId: number, taskId: string) => void;
  applyFeedback: (feedbackId: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, isConfigured } = useAuth();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [targetRole, setTargetRole] = useState<string>('Full Stack Developer');
  const [jobDescription, setJobDescription] = useState<JobDescriptionData | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGapResult | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapWeek[] | null>(null);
  const [projects, setProjects] = useState<ProjectRecommendation[] | null>(null);
  const [feedback, setFeedback] = useState<ResumeFeedback[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const hasLoadedForUser = useRef<string | null>(null);

  // If Supabase is configured and a user is signed in, load their saved analysis.
  // Otherwise (demo mode / not configured), auto-populate dummy data so the UI looks good immediately.
  useEffect(() => {
    const loadDummyData = async () => {
      setResume(DUMMY_RESUME);
      setJobDescription(DUMMY_JD);

      const gap = await analyzeSkillGap(DUMMY_RESUME, DUMMY_JD);
      setSkillGap(gap);

      const missing = gap.missingSkills.map(m => m.skill);
      const rm = await generateRoadmap(missing);
      setRoadmap(rm);

      const prj = await generateProjectRecommendations(missing);
      setProjects(prj);

      const fb = await generateResumeFeedback(DUMMY_RESUME);
      setFeedback(fb);
    };

    const clearAllData = () => {
      setResume(null);
      setTargetRole('Full Stack Developer');
      setJobDescription(null);
      setSkillGap(null);
      setRoadmap(null);
      setProjects(null);
      setFeedback(null);
    };

    const loadUserData = async (userId: string) => {
      // Always start from a clean slate so a previous user's session data
      // can never bleed into the next signed-in user's view.
      clearAllData();

      const { data, error } = await supabase
        .from('user_analyses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[SkillSync] Failed to load saved analysis:', error.message);
      }

      if (data) {
        setResume((data.resume as ResumeData) ?? null);
        setTargetRole((data.target_role as string) ?? 'Full Stack Developer');
        setJobDescription((data.job_description as JobDescriptionData) ?? null);
        setSkillGap((data.skill_gap as SkillGapResult) ?? null);
        setRoadmap((data.roadmap as RoadmapWeek[]) ?? null);
        setProjects((data.projects as ProjectRecommendation[]) ?? null);
        setFeedback((data.feedback as ResumeFeedback[]) ?? null);
      }
      // If no saved row yet (data is null), clearAllData() above already
      // left everything empty — the user starts fresh.
    };

    if (!isConfigured) {
      loadDummyData();
      return;
    }

    if (user && hasLoadedForUser.current !== user.id) {
      hasLoadedForUser.current = user.id;
      loadUserData(user.id);
    } else if (!user) {
      // Signed out (or no session yet) — make sure nothing lingers from
      // a previous account.
      hasLoadedForUser.current = null;
      clearAllData();
    }
  }, [user, isConfigured]);

  // Auto-save to Supabase whenever data changes, debounced, only when signed in.
  useEffect(() => {
    if (!isConfigured || !user) return;
    if (!resume && !jobDescription && !skillGap && !roadmap && !projects && !feedback) return;

    const timeout = setTimeout(async () => {
      setIsSaving(true);
      const { error } = await supabase.from('user_analyses').upsert(
        {
          user_id: user.id,
          resume,
          target_role: targetRole,
          job_description: jobDescription,
          skill_gap: skillGap,
          roadmap,
          projects,
          feedback,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
      if (error) {
        console.warn('[SkillSync] Failed to save analysis:', error.message);
      }
      setIsSaving(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [user, isConfigured, resume, targetRole, jobDescription, skillGap, roadmap, projects, feedback]);

  const toggleRoadmapTask = (weekIndex: number, taskId: string) => {
    setRoadmap(prev => {
      if (!prev) return prev;
      return prev.map(week => {
        if (week.week === weekIndex) {
          return {
            ...week,
            tasks: week.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
          };
        }
        return week;
      });
    });
  };

  const applyFeedback = (feedbackId: string) => {
    setFeedback(prev => {
      if (!prev) return prev;
      return prev.map(f => f.id === feedbackId ? { ...f, applied: true } : f);
    });
  };

  return (
    <AppContext.Provider value={{
      resume,
      targetRole,
      jobDescription,
      skillGap,
      roadmap,
      projects,
      feedback,
      isSaving,
      setResume,
      setTargetRole,
      setJobDescription,
      setSkillGap,
      setRoadmap,
      setProjects,
      setFeedback,
      toggleRoadmapTask,
      applyFeedback
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
