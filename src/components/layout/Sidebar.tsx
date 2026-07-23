import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Target, 
  Map, 
  Briefcase, 
  MessageSquare,
  Sparkles,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume Analyzer", href: "/dashboard/resume", icon: FileText },
  { name: "Skill Gap", href: "/dashboard/skill-gap", icon: Target },
  { name: "Roadmap", href: "/dashboard/roadmap", icon: Map },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
];

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user, signOut, isConfigured } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setLocation("/login");
  };

  return (
    <div className="w-64 border-r border-border/50 bg-sidebar/50 backdrop-blur-xl h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center text-white shadow-lg glow-shadow group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            SkillSync <span className="text-gradient">AI</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group cursor-pointer",
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary-foreground")} />
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 m-4 rounded-xl glass border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-accent" />
        {isConfigured && user ? (
          <>
            <h4 className="text-sm font-semibold mb-1 text-white truncate">{user.email}</h4>
            <p className="text-xs text-muted-foreground mb-3">Signed in</p>
            <button
              onClick={handleSignOut}
              className="text-xs font-medium text-primary hover:text-primary-foreground cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </>
        ) : (
          <>
            <h4 className="text-sm font-semibold mb-1 text-white">Demo Mode</h4>
            <p className="text-xs text-muted-foreground mb-3">Connect Supabase to enable accounts.</p>
          </>
        )}
      </div>
    </div>
  );
}
