import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import ContributePage from "./pages/ContributePage";
import CommunityPage from "./pages/CommunityPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "@/contexts/AuthContext";
import { SignIn } from "@/components/auth/SignIn";
import { SignUp } from "@/components/auth/SignUp";
import { ResetPassword } from "@/components/auth/ResetPassword";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/auth/ProtectedRoute";

// We need to create routes for the About, Privacy, Terms, etc. pages
// For now, let's use the NotFound component as a placeholder

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            
            {/* Auth routes - only accessible when not logged in */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            
            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/contribute" element={<ContributePage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            
            {/* Mixed routes - accessible to all but may show different content when logged in */}
            <Route path="/map" element={<MapPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/about" element={<NotFound />} />
            <Route path="/blog" element={<NotFound />} />
            <Route path="/faq" element={<NotFound />} />
            <Route path="/contact" element={<NotFound />} />
            <Route path="/privacy" element={<NotFound />} />
            <Route path="/terms" element={<NotFound />} />
            <Route path="/accessibility" element={<NotFound />} />
            <Route path="/route-planning" element={<NotFound />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
