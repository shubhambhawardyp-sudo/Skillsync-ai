import { Link } from "wouter";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAppContext } from "@/context/AppContext";
import { MessageSquare, AlertTriangle, Check, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function Feedback() {
  const { feedback, applyFeedback } = useAppContext();

  if (!feedback) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">No Feedback Yet</h2>
          <p className="text-muted-foreground mb-6">Run a skill gap analysis first to get resume feedback.</p>
          <Link href="/dashboard/skill-gap" className="inline-block bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Go to Skill Gap Analysis
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'Medium': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'Low': return <Info className="w-5 h-5 text-blue-400" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'border-destructive/30 bg-destructive/5';
      case 'Medium': return 'border-orange-500/30 bg-orange-500/5';
      case 'Low': return 'border-blue-500/30 bg-blue-500/5';
      default: return 'border-white/10';
    }
  };

  return (
    <DashboardShell>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Resume Feedback</h1>
        <p className="text-muted-foreground">ATS-friendly actionable suggestions to improve your document.</p>
      </div>

      <div className="space-y-4">
        {feedback.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-6 ${
              item.applied 
                ? 'bg-green-500/5 border-green-500/20 opacity-70' 
                : `glass ${getPriorityColor(item.priority)}`
            }`}
          >
            <div className="shrink-0">
              {item.applied ? (
                <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center shadow-inner border border-white/5">
                  {getPriorityIcon(item.priority)}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {item.category}
                </span>
                {!item.applied && (
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    item.priority === 'High' ? 'text-destructive bg-destructive/10' :
                    item.priority === 'Medium' ? 'text-orange-400 bg-orange-500/10' :
                    'text-blue-400 bg-blue-500/10'
                  }`}>
                    {item.priority} Impact
                  </span>
                )}
              </div>
              <p className={`text-lg font-medium ${item.applied ? 'text-white/60 line-through' : 'text-white'}`}>
                {item.suggestion}
              </p>
            </div>

            <div className="shrink-0 mt-4 sm:mt-0">
              <button 
                onClick={() => applyFeedback(item.id)}
                disabled={item.applied}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  item.applied 
                    ? 'bg-transparent text-green-400 cursor-default' 
                    : 'bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95 shadow-lg'
                }`}
              >
                {item.applied ? 'Applied' : 'Mark Applied'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardShell>
  );
}
