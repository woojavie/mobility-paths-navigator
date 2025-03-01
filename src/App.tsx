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

// We need to create routes for the About, Privacy, Terms, etc. pages
// For now, let's use the NotFound component as a placeholder

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/contribute" element={<ContributePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/about" element={<NotFound />} />
          <Route path="/blog" element={<NotFound />} />
          <Route path="/faq" element={<NotFound />} />
          <Route path="/contact" element={<NotFound />} />
          <Route path="/privacy" element={<NotFound />} />
          <Route path="/terms" element={<NotFound />} />
          <Route path="/accessibility" element={<NotFound />} />
          <Route path="/route-planning" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
