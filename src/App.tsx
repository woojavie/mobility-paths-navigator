import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import MapPage from '@/pages/MapPage';
import CommunityPage from '@/pages/CommunityPage';
import NotFound from '@/pages/NotFound';
import AboutPage from '@/pages/AboutPage';
import ContributePage from '@/pages/ContributePage';
import { SignIn } from '@/components/auth/SignIn';
import { SignUp } from '@/components/auth/SignUp';
import { ResetPassword } from '@/components/auth/ResetPassword';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/auth/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import ProfilePage from '@/pages/ProfilePage';

const queryClient = new QueryClient();

function App() {
  return (
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
                <Route path="/map" element={<MapPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/contribute" element={<ContributePage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              
              {/* Other routes */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<NotFound />} />
              <Route path="/faq" element={<NotFound />} />
              <Route path="/privacy" element={<NotFound />} />
              <Route path="/terms" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
