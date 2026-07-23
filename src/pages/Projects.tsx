import { Link } from "wouter";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAppContext } from "@/context/AppContext";
import { Briefcase, Code, Clock, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Projects() {
  const { projects } = useAppContext();

  if (!projects) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">No Projects Yet</h2>
          <p className="text-muted-foreground mb-6">Run a skill gap analysis first to get project recommendations.</p>
          <Link href="/dashboard/skill-gap" className="inline-block bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Go to Skill Gap Analysis
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Project Recommendations</h1>
        <p className="text-muted-foreground">Build these to cover your skill gaps and stand out to recruiters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl flex flex-col group hover:border-primary/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center text-white shrink-0 shadow-lg glow-shadow group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6" />
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                project.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                project.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                'bg-purple-500/10 text-purple-400 border-purple-500/20'
              }`}>
                {project.difficulty}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
              {project.description}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Tech Stack</div>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-2 py-1 rounded bg-white/5 text-white text-xs border border-white/5">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3 text-primary" /> Skills Covered
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.skillsCovered.map(skill => (
                    <span key={skill} className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Clock className="w-4 h-4" />
                ~{project.estimatedWeeks} weeks
              </div>
              <button className="text-sm font-medium text-white hover:text-primary transition-colors flex items-center gap-1 group-hover:gap-2">
                View Spec <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardShell>
  );
}
