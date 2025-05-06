
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "@/components/auth/PrivateRoute";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Clients from "@/pages/Clients";
import Freights from "@/pages/Freights";
import Drivers from "@/pages/Drivers";
import DriverRegister from "@/pages/DriverRegister";
import DriverEdit from "@/pages/DriverEdit";
import FreightReceipt from "@/pages/FreightReceipt";
import MultiFreightReceipt from "@/pages/MultiFreightReceipt";
import FreightSelection from "@/pages/FreightSelection";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import SharedContent from "@/pages/SharedContent";
import NotFound from "@/pages/NotFound";
import CollectionOrders from "@/pages/CollectionOrders";
import CollectionOrder from "@/pages/CollectionOrder";
import CollectionOrderEdit from "@/pages/CollectionOrderEdit";
import CollectionOrderView from "@/pages/CollectionOrderView";
import Quotations from "@/pages/Quotations";
import Quotation from "@/pages/Quotation";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/shared/:id" element={<SharedContent />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        
        {/* Clientes */}
        <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
        
        {/* Fretes */}
        <Route path="/freights" element={<PrivateRoute><Freights /></PrivateRoute>} />
        <Route path="/freight/:id/receipt" element={<PrivateRoute><FreightReceipt /></PrivateRoute>} />
        <Route path="/freight/receipts" element={<PrivateRoute><FreightSelection /></PrivateRoute>} />
        <Route path="/freight/multi-receipt" element={<PrivateRoute><MultiFreightReceipt /></PrivateRoute>} />
        
        {/* Motoristas */}
        <Route path="/drivers" element={<PrivateRoute><Drivers /></PrivateRoute>} />
        <Route path="/driver" element={<PrivateRoute><DriverRegister /></PrivateRoute>} />
        <Route path="/driver/:id" element={<PrivateRoute><DriverEdit /></PrivateRoute>} />
        
        {/* Ordens de Coleta */}
        <Route path="/collection-orders" element={<PrivateRoute><CollectionOrders /></PrivateRoute>} />
        <Route path="/collection-order" element={<PrivateRoute><CollectionOrder /></PrivateRoute>} />
        <Route path="/collection-order/:id" element={<PrivateRoute><CollectionOrderEdit /></PrivateRoute>} />
        <Route path="/collection-order/:id/view" element={<PrivateRoute><CollectionOrderView /></PrivateRoute>} />
        
        {/* Cotações */}
        <Route path="/quotations" element={<PrivateRoute><Quotations /></PrivateRoute>} />
        <Route path="/quotation" element={<PrivateRoute><Quotation /></PrivateRoute>} />

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
