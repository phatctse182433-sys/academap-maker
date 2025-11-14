import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MindMapProvider } from "@/store/MindMapContext";
import ThemeProvider from "@/providers/ThemeProvider";
import HomePage from "./pages/HomePage";
import MindMapListPage from "./pages/MindMapListPage";
import AboutPage from "./pages/AboutPage";
import MindMapEditorPage from "./pages/MindMapEditorPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <MindMapProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/mind-maps" element={<MindMapListPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/mind-map/editor/:id?" element={<MindMapEditorPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MindMapProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
