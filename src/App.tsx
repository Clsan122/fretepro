
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Freights from "./pages/Freights";
import Clients from "./pages/Clients";
import Drivers from "./pages/Drivers";
import Profile from "./pages/Profile";
import DriverEdit from "./pages/DriverEdit";
import DriverRegister from "./pages/DriverRegister";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CollectionOrders from "./pages/CollectionOrders";
import CollectionOrder from "./pages/CollectionOrder";
import CollectionOrderView from "./pages/CollectionOrderView";
import CollectionOrderEdit from "./pages/CollectionOrderEdit";
import FreightSelection from "./pages/FreightSelection";
import MultiFreightReceipt from "./pages/MultiFreightReceipt";
import FreightReceipt from "./pages/FreightReceipt";

// Private Route Component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-freight-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/freights"
            element={
              <PrivateRoute>
                <Freights />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/freight-selection"
            element={
              <PrivateRoute>
                <FreightSelection />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/freight-receipt"
            element={
              <PrivateRoute>
                <FreightReceipt />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/multi-freight-receipt"
            element={
              <PrivateRoute>
                <MultiFreightReceipt />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/clients"
            element={
              <PrivateRoute>
                <Clients />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/drivers"
            element={
              <PrivateRoute>
                <Drivers />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/drivers/new"
            element={
              <PrivateRoute>
                <DriverRegister />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/drivers/edit/:id"
            element={
              <PrivateRoute>
                <DriverEdit />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/collection-orders"
            element={
              <PrivateRoute>
                <CollectionOrders />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/collection-order/new"
            element={
              <PrivateRoute>
                <CollectionOrder />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/collection-order/:id"
            element={
              <PrivateRoute>
                <CollectionOrderView />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/collection-order/edit/:id"
            element={
              <PrivateRoute>
                <CollectionOrderEdit />
              </PrivateRoute>
            }
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
