import { Link } from "wouter";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAppContext } from "@/context/AppContext";
import { CheckCircle2, Circle, Clock, Map as MapIcon, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function Roadmap() {
  const { roadmap, toggleRoadmapTask } = useAppContext();

  if (!roadmap) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <MapIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">No Roadmap Yet</h2>
          <p className="text-muted-foreground mb-6">Run a skill gap analysis first to generate your roadmap.</p>
          <Link href="/dashboard/skill-gap" className="inline-block bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Go to Skill Gap Analysis
          </Link>
        </div>
      </DashboardShell>
    );
  }

  // Calculate overall progress
  let totalTasks = 0;
  let completedTasks = 0;
  
  roadmap.forEach(week => {
    week.tasks.forEach(task => {
      totalTasks++;
      if (task.completed) completedTasks++;
    });
  });

  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <DashboardShell>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Learning Roadmap</h1>
        <p className="text-muted-foreground">Your personalized week-by-week plan to bridge the skill gap.</p>
      </div>

      <div className="glass-card p-6 rounded-2xl mb-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 w-full">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-white">Overall Progress</span>
            <span className="text-2xl font-bold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-white/10" />
        </div>
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{completedTasks}</div>
            <div className="text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{totalTasks - completedTasks}</div>
            <div className="text-muted-foreground">Remaining</div>
          </div>
        </div>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-cyan-500/50 before:to-transparent">
        {roadmap.map((week, index) => (
          <motion.div 
            key={week.week}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-background bg-primary text-white shadow-lg z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <span className="font-bold text-sm">W{week.week}</span>
            </div>

            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] glass p-6 rounded-2xl hover:bg-white/5 transition-colors border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4">{week.title}</h3>
              
              <div className="space-y-3">
                {week.tasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => toggleRoadmapTask(week.week, task.id)}
                    className="flex items-start gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/40 cursor-pointer transition-colors border border-white/5"
                  >
                    <button className="mt-0.5 shrink-0 text-primary">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className={`font-medium mb-1 transition-colors ${task.completed ? 'text-muted-foreground line-through' : 'text-white'}`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-medium">
                        <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                          task.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                          task.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-purple-500/10 text-purple-400'
                        }`}>
                          {task.difficulty}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {task.hours}h
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardShell>
  );
}
