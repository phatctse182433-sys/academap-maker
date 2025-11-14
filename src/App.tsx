import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "@/providers/ThemeProvider";
import HomePage from "./pages/HomePage";
import MindMapListPage from "./pages/MindMapListPage";
import AboutPage from "./pages/AboutPage";
import MindMapEditorPage from "./pages/MindMapEditorPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import UserProfilePage from "./pages/UserProfilePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import DepositPage from "./pages/DepositPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminTemplatesPage from "./pages/admin/AdminTemplatesPage";
import AdminTransactionsPage from "./pages/admin/AdminTransactionsPage";
import { AdminOnlyRoute } from "./components/AdminOnlyRoute";
import { UserOnlyRoute } from "./components/UserOnlyRoute";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <UserOnlyRoute>
                    <HomePage />
                  </UserOnlyRoute>
                }
              />

              <Route
                path="/mind-maps"
                element={
                  <UserOnlyRoute>
                    <MindMapListPage />
                  </UserOnlyRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <UserOnlyRoute>
                    <AboutPage />
                  </UserOnlyRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <UserOnlyRoute>
                    <UserProfilePage />
                  </UserOnlyRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <UserOnlyRoute>
                    <SubscriptionPage />
                  </UserOnlyRoute>
                }
              />
              <Route
                path="/deposit"
                element={
                  <UserOnlyRoute>
                    <DepositPage />
                  </UserOnlyRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <UserOnlyRoute>
                    <CheckoutPage />
                  </UserOnlyRoute>
                }
              />

              <Route
                path="/mind-map/editor/:id?"
                element={
                  <UserOnlyRoute>
                    <MindMapEditorPage />
                  </UserOnlyRoute>
                }
              />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              <Route
                path="/admin"
                element={
                  <AdminOnlyRoute>
                    <AdminLayout />
                  </AdminOnlyRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="templates" element={<AdminTemplatesPage />} />
                <Route path="transactions" element={<AdminTransactionsPage />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
