
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { AuthProvider } from "./components/auth/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/Appointments";
import BloodBank from "./pages/BloodBank";
import Pharmacy from "./pages/Pharmacy";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={<RequireAuth><Dashboard /></RequireAuth>} 
              />
              <Route 
                path="/feed" 
                element={<RequireAuth><Feed /></RequireAuth>} 
              />
              <Route 
                path="/appointments" 
                element={<RequireAuth allowedRoles={["patient"]}><Appointments /></RequireAuth>} 
              />
              <Route 
                path="/bloodbank" 
                element={<RequireAuth allowedRoles={["patient"]}><BloodBank /></RequireAuth>} 
              />
              <Route 
                path="/pharmacy" 
                element={<RequireAuth allowedRoles={["patient"]}><Pharmacy /></RequireAuth>} 
              />
              <Route 
                path="/admin" 
                element={<RequireAuth adminOnly={true}><AdminDashboard /></RequireAuth>} 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
