import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";
import { 
  FileText, 
  Target, 
  TrendingUp, 
  Briefcase,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer,
  PolarAngleAxis
} from "recharts";

export default function DashboardHome() {
  const { resume, skillGap } = useAppContext();

  const scoreData = skillGap ? [
    { name: "Score", value: skillGap.scores.overall, fill: "hsl(var(--primary))" }
  ] : [{ name: "Score", value: 0, fill: "hsl(var(--primary))" }];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardShell>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {resume?.name?.split(' ')[0] || 'User'}! 👋</h1>
          <p className="text-muted-foreground">Here is your career intelligence overview.</p>
        </div>
        <Link href="/dashboard/resume" className="inline-flex items-center justify-center gap-2 bg-gradient-accent text-white px-5 py-2.5 rounded-xl font-medium shadow-lg glow-shadow hover:scale-105 transition-all duration-300 self-start">
          <FileText className="w-4 h-4" />
          Update Resume
        </Link>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Overall Score Card */}
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target className="w-24 h-24" />
          </div>
          <div className="text-sm font-medium text-muted-foreground mb-4">Overall Match</div>
          <div className="flex-1 flex items-center justify-between">
            <div className="text-4xl font-bold text-white">
              {skillGap?.scores.overall || 0}<span className="text-lg text-muted-foreground">%</span>
            </div>
            <div className="w-16 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="80%" 
                  outerRadius="100%" 
                  barSize={10} 
                  data={scoreData} 
                  startAngle={90} 
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Technical Score */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-muted-foreground">Tech Skills</div>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">{skillGap?.scores.technical || 0}%</div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 rounded-full" 
                style={{ width: `${skillGap?.scores.technical || 0}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Missing Skills Count */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-muted-foreground">Skill Gaps</div>
            <div className="w-8 h-8 rounded-lg bg-destructive/20 text-destructive flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">{skillGap?.missingSkills.length || 0}</div>
            <div className="text-sm text-muted-foreground">Critical missing skills</div>
          </div>
        </motion.div>

        {/* Suggested Projects */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-muted-foreground">Project Ideas</div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">3</div>
            <div className="text-sm text-muted-foreground">Ready to build</div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Next Steps</h3>
            <Link href="/dashboard/roadmap" className="text-sm text-primary hover:text-primary-foreground flex items-center gap-1">
              View Roadmap <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl glass border border-white/5 flex gap-4 items-start group hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="text-white font-medium mb-1 group-hover:text-primary transition-colors">Review Skill Gaps</h4>
                <p className="text-sm text-muted-foreground">See exactly what you're missing for a Full Stack Developer role.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl glass border border-white/5 flex gap-4 items-start group hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white/5 text-muted-foreground flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="text-white font-medium mb-1 group-hover:text-primary transition-colors">Start Learning Week 1</h4>
                <p className="text-sm text-muted-foreground">Begin your customized TypeScript and Postgres fundamentals.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl glass border border-white/5 flex gap-4 items-start group hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white/5 text-muted-foreground flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="text-white font-medium mb-1 group-hover:text-primary transition-colors">Build a Project</h4>
                <p className="text-sm text-muted-foreground">Put your new skills to use in a recommended portfolio piece.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-2xl flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Current Profile</h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {resume ? (
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Top Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.slice(0, 5).map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white border border-white/5">
                        {skill}
                      </span>
                    ))}
                    {resume.skills.length > 5 && (
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-muted-foreground border border-white/5">
                        +{resume.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Recent Experience</div>
                  {resume.experience.slice(0, 1).map((exp, i) => (
                    <div key={i} className="text-white">
                      <div className="font-medium">{exp.role}</div>
                      <div className="text-sm text-muted-foreground">{exp.company} • {exp.years}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No resume uploaded yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
