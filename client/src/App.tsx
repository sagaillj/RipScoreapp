import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Helmet } from "react-helmet";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/types";
import { AuthProvider } from "@/hooks/use-auth";

// Pages
import Home from "@/pages/index";
import Pricing from "@/pages/pricing";
import Judge from "@/pages/judge";
import JudgeMeet from "@/pages/judge/[meetId]";
import Contact from "@/pages/contact";
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import Team from "@/pages/team";
// Temporary components to fix compile errors
const Teams = () => <Team />;
const Divers = () => <Team />;
import Meets from "@/pages/meets";
import Schedule from "@/pages/schedule";
import MeetRunner from "@/pages/coach/meet-runner";
import CreateMeet from "@/pages/coach/create-meet-new";
import MeetDetail from "@/pages/meet/[id]";
import Analytics from "@/pages/analytics";
import DiveProgressDemo from "@/pages/dive-progress-demo";
import DiveMatrixDemo from "@/pages/dive-matrix-demo";
import DiveConstellationDemo from "@/pages/dive-constellation-demo";
import DiverDashboard from "@/pages/diver-dashboard";
import TeamAchievements from "@/pages/team-achievements";
import FancyWizardTest from "@/pages/fancy-wizard-test";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      
      {/* Demo routes */}
      <Route path="/dive-progress-demo" component={DiveProgressDemo} />
      <Route path="/dive-matrix-demo" component={DiveMatrixDemo} />
      <Route path="/dive-constellation-demo" component={DiveConstellationDemo} />
      <Route path="/fancy-wizard-test" component={FancyWizardTest} />
      
      {/* Judge portal */}
      <Route path="/judge" component={Judge} />
      <Route path="/judge/:meetId" component={JudgeMeet} />
      
      {/* Coach portal */}
      <Route path="/coach/dashboard">
        <ProtectedRoute component={Dashboard} roleRequired={"coach" as UserRole} />
      </Route>
      <Route path="/coach/team">
        <ProtectedRoute component={Team} roleRequired={"coach" as UserRole} />
      </Route>
      <Route path="/coach/meets">
        <ProtectedRoute component={Meets} roleRequired={"coach" as UserRole} />
      </Route>
      <Route path="/coach/team-achievements">
        <ProtectedRoute component={TeamAchievements} roleRequired={"coach" as UserRole} />
      </Route>
      <Route path="/coach/schedule">
        <ProtectedRoute component={Schedule} roleRequired={"coach" as UserRole} />
      </Route>
      <Route path="/coach/meet-runner">
        <ProtectedRoute component={MeetRunner} roleRequired={"coach" as UserRole} />
      </Route>
      <Route path="/coach/create-meet">
        <ProtectedRoute component={CreateMeet} roleRequired={"coach" as UserRole} />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute component={Analytics} roleRequired={"coach" as UserRole} />
      </Route>
      
      {/* Diver portal */}
      <Route path="/diver/dashboard">
        <ProtectedRoute component={DiverDashboard} roleRequired={"diver" as UserRole} />
      </Route>
      
      {/* Legacy routes (for backward compatibility) */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/team">
        <ProtectedRoute component={Team} />
      </Route>
      <Route path="/meets">
        <ProtectedRoute component={Meets} />
      </Route>
      <Route path="/team-achievements">
        <ProtectedRoute component={TeamAchievements} />
      </Route>
      
      {/* Meet detail page */}
      <Route path="/meet/:id">
        <ProtectedRoute component={MeetDetail} />
      </Route>
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
