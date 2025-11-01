import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MindMapProvider } from "@/store/MindMapContext";
import HomePage from "./pages/HomePage";
import MindMapListPage from "./pages/MindMapListPage";
import AboutPage from "./pages/AboutPage";
import MindMapEditorPage from "./pages/MindMapEditorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MindMapProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mind-maps" element={<MindMapListPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/mind-map/editor/:id?" element={<MindMapEditorPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MindMapProvider>
  </QueryClientProvider>
);

export default App;
