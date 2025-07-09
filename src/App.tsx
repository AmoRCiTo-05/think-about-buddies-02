
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import CreateThought from "./pages/CreateThought";
import ThoughtType from "./pages/ThoughtType";
import PrivacySettings from "./pages/PrivacySettings";
import Settings from "./pages/Settings";
import AddDetails from "./pages/AddDetails";
import WriteThoughts from "./pages/WriteThoughts";
import ThoughtComplete from "./pages/ThoughtComplete";
import LikedThoughts from "./pages/LikedThoughts";
import StarredProfiles from "./pages/StarredProfiles";
import Following from "./pages/Following";
import Followers from "./pages/Followers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/create" element={
              <ProtectedRoute>
                <CreateThought />
              </ProtectedRoute>
            } />
            <Route path="/type" element={
              <ProtectedRoute>
                <ThoughtType />
              </ProtectedRoute>
            } />
            <Route path="/privacy" element={
              <ProtectedRoute>
                <PrivacySettings />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/details" element={
              <ProtectedRoute>
                <AddDetails />
              </ProtectedRoute>
            } />
            <Route path="/write" element={
              <ProtectedRoute>
                <WriteThoughts />
              </ProtectedRoute>
            } />
            <Route path="/complete" element={
              <ProtectedRoute>
                <ThoughtComplete />
              </ProtectedRoute>
            } />
            <Route path="/liked-thoughts" element={
              <ProtectedRoute>
                <LikedThoughts />
              </ProtectedRoute>
            } />
            <Route path="/starred-profiles" element={
              <ProtectedRoute>
                <StarredProfiles />
              </ProtectedRoute>
            } />
            <Route path="/following" element={
              <ProtectedRoute>
                <Following />
              </ProtectedRoute>
            } />
            <Route path="/followers" element={
              <ProtectedRoute>
                <Followers />
              </ProtectedRoute>
            } />
            {/* Legacy route for old landing page */}
            <Route path="/landing" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
