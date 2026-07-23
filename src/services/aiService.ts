import { generateJSON } from '@/lib/gemini';

export interface ResumeData {
  name: string;
  email: string;
  education: string;
  skills: string[];
  experience: { role: string; company: string; years: string; description: string }[];
  projects: { name: string; description: string }[];
  certifications: string[];
}

export interface JobDescriptionData {
  title: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  experience: string;
}

export interface SkillGapResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: { skill: string; priority: 'High' | 'Medium' | 'Low' }[];
  extraSkills: string[];
  scores: {
    overall: number;
    technical: number;
    resumeQuality: number;
    experience: number;
  };
}

export interface RoadmapWeek {
  week: number;
  title: string;
  tasks: { id: string; title: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced'; hours: number; completed: boolean }[];
}

export interface ProjectRecommendation {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  techStack: string[];
  skillsCovered: string[];
  estimatedWeeks: number;
}

export interface ResumeFeedback {
  id: string;
  category: 'Achievements' | 'Descriptions' | 'Links' | 'Keywords' | 'Skills';
  suggestion: string;
  priority: 'High' | 'Medium' | 'Low';
  applied: boolean;
}

// Dummy data constants
export const DUMMY_RESUME: ResumeData = {
  name: "Alex Mercer",
  email: "alex.mercer@example.com",
  education: "B.S. Computer Science, Tech University (2020)",
  skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "Tailwind CSS"],
  experience: [
    {
      role: "Frontend Developer",
      company: "WebSolutions Inc",
      years: "2021 - Present",
      description: "Developed responsive web applications using React and Redux."
    },
    {
      role: "Junior Web Developer",
      company: "Startup X",
      years: "2020 - 2021",
      description: "Maintained legacy codebases and fixed UI bugs."
    }
  ],
  projects: [
    { name: "Portfolio Website", description: "Personal portfolio built with Next.js and Framer Motion." },
    { name: "E-commerce Dashboard", description: "Admin dashboard for managing products and orders." }
  ],
  certifications: ["AWS Certified Cloud Practitioner"]
};

export const DUMMY_JD: JobDescriptionData = {
  title: "Full Stack Developer",
  requiredSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
  preferredSkills: ["Docker", "GraphQL", "Redis"],
  responsibilities: [
    "Design and implement scalable REST APIs",
    "Build interactive user interfaces using React",
    "Optimize application for maximum speed and scalability",
    "Collaborate with cross-functional teams"
  ],
  experience: "3+ years of experience in full stack development"
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Parses raw resume text (pasted by the user) into structured ResumeData using Gemini.
 * Falls back to demo data if Gemini isn't configured or the call fails, so the app
 * still works during a live demo even without a key.
 */
export async function parseResumeText(resumeText: string): Promise<ResumeData> {
  try {
    const prompt = `You are a resume parser. Given the raw resume text below, extract structured data.
Return ONLY a JSON object matching exactly this shape (no markdown, no extra keys):
{
  "name": string,
  "email": string,
  "education": string,
  "skills": string[],
  "experience": [{ "role": string, "company": string, "years": string, "description": string }],
  "projects": [{ "name": string, "description": string }],
  "certifications": string[]
}

Resume text:
"""
${resumeText}
"""`;
    return await generateJSON<ResumeData>(prompt);
  } catch (err) {
    console.warn('[SkillSync] Falling back to demo resume data:', (err as Error).message);
    await delay(1000);
    return DUMMY_RESUME;
  }
}

// Kept for backward compatibility with any file-based upload UI.
export async function parseResume(file: File | null): Promise<ResumeData> {
  if (!file) {
    await delay(500);
    return DUMMY_RESUME;
  }
  const text = await file.text();
  return parseResumeText(text);
}

export async function parseJobDescription(text: string): Promise<JobDescriptionData> {
  try {
    const prompt = `You are a job description parser. Given the raw job description text below, extract structured data.
Return ONLY a JSON object matching exactly this shape (no markdown, no extra keys):
{
  "title": string,
  "requiredSkills": string[],
  "preferredSkills": string[],
  "responsibilities": string[],
  "experience": string
}

Job description text:
"""
${text}
"""`;
    return await generateJSON<JobDescriptionData>(prompt);
  } catch (err) {
    console.warn('[SkillSync] Falling back to demo job description data:', (err as Error).message);
    await delay(800);
    return DUMMY_JD;
  }
}

export async function analyzeSkillGap(resume: ResumeData, jd: JobDescriptionData): Promise<SkillGapResult> {
  try {
    const prompt = `You are a career coach AI. Compare this resume against this job description and produce a skill gap analysis.
Return ONLY a JSON object matching exactly this shape (no markdown, no extra keys):
{
  "matchPercentage": number (0-100),
  "matchedSkills": string[],
  "missingSkills": [{ "skill": string, "priority": "High" | "Medium" | "Low" }],
  "extraSkills": string[],
  "scores": { "overall": number, "technical": number, "resumeQuality": number, "experience": number }
}

Resume:
${JSON.stringify(resume)}

Job Description:
${JSON.stringify(jd)}`;
    return await generateJSON<SkillGapResult>(prompt);
  } catch (err) {
    console.warn('[SkillSync] Falling back to demo skill gap data:', (err as Error).message);
    await delay(1200);
    return {
      matchPercentage: 72,
      matchedSkills: ["React", "Node.js", "JavaScript"],
      missingSkills: [
        { skill: "TypeScript", priority: "High" },
        { skill: "PostgreSQL", priority: "High" },
        { skill: "AWS", priority: "Medium" },
        { skill: "Docker", priority: "Medium" },
        { skill: "GraphQL", priority: "Low" }
      ],
      extraSkills: ["Python", "Tailwind CSS", "Git"],
      scores: {
        overall: 72,
        technical: 65,
        resumeQuality: 78,
        experience: 80
      }
    };
  }
}

export async function generateRoadmap(missingSkills: string[], resume?: ResumeData, matchPercentage?: number): Promise<RoadmapWeek[]> {
  try {
    const currentSkills = resume?.skills?.length ? resume.skills.join(', ') : 'none listed';
    const levelContext = matchPercentage !== undefined
      ? `Their overall match with this target role is only ${matchPercentage}%.`
      : '';

    const prompt = `You are a learning coach AI. Create a week-by-week learning roadmap to close these skill gaps: ${missingSkills.join(', ')}.

IMPORTANT CONTEXT — assess the person's real starting point before planning:
- Their current listed skills are: ${currentSkills}.
${levelContext}
- Do NOT assume prior programming or web development experience just because a skill like "JavaScript" or "React" is missing. If their current skills show no programming/scripting background at all (e.g. a background in an unrelated field like mechanical design, marketing, etc.), the roadmap MUST start from true fundamentals for that domain (e.g. for web development: what is a variable, HTML structure, CSS basics, then basic JavaScript syntax) BEFORE any framework, backend, or database topics.
- Only mark a topic "Intermediate" or "Advanced" if the person's current skills reasonably support jumping in at that level. If they are a genuine beginner in the domain, the first 1-2 weeks should be "Beginner" difficulty covering absolute basics, not skipped.
- The roadmap should feel achievable given where they are actually starting from, not just a generic list of the missing skill names.

Return ONLY a JSON array matching exactly this shape (no markdown, no extra keys), 2-4 weeks:
[{
  "week": number,
  "title": string,
  "tasks": [{ "id": string, "title": string, "difficulty": "Beginner" | "Intermediate" | "Advanced", "hours": number, "completed": false }]
}]`;
    return await generateJSON<RoadmapWeek[]>(prompt);
  } catch (err) {
    console.warn('[SkillSync] Falling back to demo roadmap data:', (err as Error).message);
    await delay(1200);
    return [
      {
        week: 1,
        title: "TypeScript & Database Fundamentals",
        tasks: [
          { id: "t1", title: "Learn TypeScript basics & types", difficulty: "Beginner", hours: 10, completed: false },
          { id: "t2", title: "Migrate a small React project to TS", difficulty: "Intermediate", hours: 15, completed: false },
          { id: "t3", title: "PostgreSQL setup and basic queries", difficulty: "Beginner", hours: 8, completed: false }
        ]
      },
      {
        week: 2,
        title: "Cloud & Containerization",
        tasks: [
          { id: "t4", title: "Dockerize a Node.js application", difficulty: "Intermediate", hours: 12, completed: false },
          { id: "t5", title: "AWS Core Services (EC2, S3, RDS)", difficulty: "Beginner", hours: 15, completed: false }
        ]
      },
      {
        week: 3,
        title: "Advanced Data Fetching",
        tasks: [
          { id: "t6", title: "Learn GraphQL schemas and resolvers", difficulty: "Intermediate", hours: 10, completed: false },
          { id: "t7", title: "Build an Apollo Server connected to Postgres", difficulty: "Advanced", hours: 20, completed: false }
        ]
      }
    ];
  }
}

export async function generateProjectRecommendations(missingSkills: string[]): Promise<ProjectRecommendation[]> {
  try {
    const prompt = `You are a mentor AI. Recommend 3 hands-on portfolio projects to practice these skills: ${missingSkills.join(', ')}.
Return ONLY a JSON array matching exactly this shape (no markdown, no extra keys):
[{
  "id": string,
  "name": string,
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "description": string,
  "techStack": string[],
  "skillsCovered": string[],
  "estimatedWeeks": number
}]`;
    return await generateJSON<ProjectRecommendation[]>(prompt);
  } catch (err) {
    console.warn('[SkillSync] Falling back to demo project data:', (err as Error).message);
    await delay(1200);
    return [
      {
        id: "p1",
        name: "Full Stack Task Manager",
        difficulty: "Intermediate",
        description: "A comprehensive task management app with real-time updates and relational database.",
        techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
        skillsCovered: ["TypeScript", "PostgreSQL"],
        estimatedWeeks: 3
      },
      {
        id: "p2",
        name: "Dockerized E-commerce API",
        difficulty: "Advanced",
        description: "Build a scalable backend API for an e-commerce platform, packaged in Docker containers.",
        techStack: ["Node.js", "Express", "Docker", "AWS S3"],
        skillsCovered: ["Docker", "AWS"],
        estimatedWeeks: 4
      },
      {
        id: "p3",
        name: "GraphQL Blog Platform",
        difficulty: "Intermediate",
        description: "Create a blogging platform using GraphQL for flexible data querying.",
        techStack: ["React", "Apollo", "GraphQL", "Node.js"],
        skillsCovered: ["GraphQL", "React"],
        estimatedWeeks: 2
      }
    ];
  }
}

export async function generateResumeFeedback(resume: ResumeData): Promise<ResumeFeedback[]> {
  try {
    const prompt = `You are a resume reviewer AI. Give specific, actionable feedback on this resume.
Return ONLY a JSON array matching exactly this shape (no markdown, no extra keys), 3-5 items:
[{
  "id": string,
  "category": "Achievements" | "Descriptions" | "Links" | "Keywords" | "Skills",
  "suggestion": string,
  "priority": "High" | "Medium" | "Low",
  "applied": false
}]

Resume:
${JSON.stringify(resume)}`;
    return await generateJSON<ResumeFeedback[]>(prompt);
  } catch (err) {
    console.warn('[SkillSync] Falling back to demo feedback data:', (err as Error).message);
    await delay(1000);
    return [
      {
        id: "f1",
        category: "Achievements",
        suggestion: "Add more measurable achievements to 'Frontend Developer' role (e.g., improved performance by 40%).",
        priority: "High",
        applied: false
      },
      {
        id: "f2",
        category: "Keywords",
        suggestion: "Include missing technical skills like TypeScript, PostgreSQL, and Docker to pass ATS.",
        priority: "High",
        applied: false
      },
      {
        id: "f3",
        category: "Links",
        suggestion: "Include your GitHub profile link and link to your deployed Portfolio Website.",
        priority: "Medium",
        applied: false
      },
      {
        id: "f4",
        category: "Descriptions",
        suggestion: "Improve the 'Startup X' project description with impact metrics rather than just listing duties.",
        priority: "Low",
        applied: false
      }
    ];
  }
}
