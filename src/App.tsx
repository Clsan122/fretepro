
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Freights from "./pages/Freights";
import Drivers from "./pages/Drivers";
import DriverRegister from "./pages/DriverRegister";
import DriverEdit from "./pages/DriverEdit";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CollectionOrders from "./pages/CollectionOrders";
import CollectionOrderPage from "./pages/CollectionOrder";
import CollectionOrderView from "./pages/CollectionOrderView";
import CollectionOrderEdit from "./pages/CollectionOrderEdit";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import FreightSelection from "./pages/FreightSelection";
import MultiFreightReceipt from "./pages/MultiFreightReceipt";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/freights" element={<ProtectedRoute><Freights /></ProtectedRoute>} />
      <Route path="/freight-selection" element={<ProtectedRoute><FreightSelection /></ProtectedRoute>} />
      <Route path="/multi-freight-receipt" element={<ProtectedRoute><MultiFreightReceipt /></ProtectedRoute>} />
      <Route path="/drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
      <Route path="/drivers/new" element={<ProtectedRoute><DriverRegister /></ProtectedRoute>} />
      <Route path="/drivers/edit/:id" element={<ProtectedRoute><DriverEdit /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      
      <Route path="/collection-orders" element={<ProtectedRoute><CollectionOrders /></ProtectedRoute>} />
      <Route path="/collection-order/new" element={<ProtectedRoute><CollectionOrderPage /></ProtectedRoute>} />
      <Route path="/collection-order/:id" element={<ProtectedRoute><CollectionOrderView /></ProtectedRoute>} />
      <Route path="/collection-order/edit/:id" element={<ProtectedRoute><CollectionOrderEdit /></ProtectedRoute>} />
      
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
