import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Import all page components
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegisterPage";
import ScrumMasterDashboardPage from "./pages/ScrumMasterDashboard";
import ADMDashboardPage from "./pages/ADMDashboard";
import RiskAlertsDashboard from "./pages/ADMTrackers/RiskAlertsDashboard";
import TeamSentimentDashboardPage from "./pages/ScrumTrackers/TeamSentimentDashboard";
import AgileDeliveryTracker from "./pages/ADMTrackers/AgileDeliveryTracker";
import TeamCapacityTracker from "./pages/ADMTrackers/TeamCapacityTracker"; 
import AgileDependencyHeatmap from "./pages/ADMTrackers/AgileDependencyHeatmap";
import ActionCenterPage from "./pages/ScrumTrackers/ActionCenterPage";
import AgileRitualTracker from "./pages/ScrumTrackers/AgileRitualTracker";
import KnowledgeKeeperChat from "./pages/ScrumTrackers/KnowledgeKeeperChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// NOTE: ProtectedRoleRoute is entirely removed to disable all role checks.
// The dashboards are now rendered directly, bypassing security for the demo.

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* 1. Root path redirects directly to the Login quick-access screen for the demo */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 2. Public Auth Routes (using the simplified/test versions) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />



            {/* 3. Dashboard Routes: Rendered directly without protection */}
            <Route
              path="/sm-dashboard"
              element={<ScrumMasterDashboardPage />}
            />
            <Route
              path="/adm-dashboard"
              element={<ADMDashboardPage />}
            />



            {/* 4. Scrum Tracker Route */}
            <Route
              path="/sm/sentiment"
              element={<TeamSentimentDashboardPage />}
            />
            <Route
              path="/sm/action-center"
              element={<ActionCenterPage />}
            />
            <Route
              path="/sm/rituals"
              element={<AgileRitualTracker />}
            />
            <Route
              path="/sm/ai-chat"
              element={<KnowledgeKeeperChat />}
            />



            {/* NEW: ADM Tracker Route */}
             <Route
              path="/adm/risks"
              element={<RiskAlertsDashboard />}
            />
            <Route
              path="/adm/tracker"
              element={<AgileDeliveryTracker />}
            />
            {/* NEW: ADM Tracker Route */}
            <Route
              path="/adm/capacity"
              element={<TeamCapacityTracker />}
            />
            {/* NEW: ADM Tracker Route */}
            <Route
              path="/adm/dependencies"
              element={<AgileDependencyHeatmap />}
            />

            
            {/* CATCH-ALL ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
