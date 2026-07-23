import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';

import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import DashboardHome from '@/pages/DashboardHome';
import ResumeAnalyzer from '@/pages/ResumeAnalyzer';
import SkillGap from '@/pages/SkillGap';
import Roadmap from '@/pages/Roadmap';
import Projects from '@/pages/Projects';
import Feedback from '@/pages/Feedback';

const queryClient = new QueryClient();

// If Supabase isn't configured, dashboard routes stay open (demo mode).
// Once configured, a user must be signed in to reach them.
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading, isConfigured } = useAuth();

  if (!isConfigured) return <>{children}</>;
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <ProtectedRoute><DashboardHome /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/resume">
        <ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/skill-gap">
        <ProtectedRoute><SkillGap /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/roadmap">
        <ProtectedRoute><Roadmap /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/projects">
        <ProtectedRoute><Projects /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/feedback">
        <ProtectedRoute><Feedback /></ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
