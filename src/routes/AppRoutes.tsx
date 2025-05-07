import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import PrivateRoute from "@/components/auth/PrivateRoute";

// Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Freights from "@/pages/Freights";
import Clients from "@/pages/Clients";
import Drivers from "@/pages/Drivers";
import Profile from "@/pages/Profile";
import DriverEdit from "@/pages/DriverEdit";
import DriverRegister from "@/pages/DriverRegister";
import NotFound from "@/pages/NotFound";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import CollectionOrders from "@/pages/CollectionOrders";
import CollectionOrder from "@/pages/CollectionOrder";
import CollectionOrderView from "@/pages/CollectionOrderView";
import CollectionOrderEdit from "@/pages/CollectionOrderEdit";
import FreightSelection from "@/pages/FreightSelection";
import MultiFreightReceipt from "@/pages/MultiFreightReceipt";
import FreightReceipt from "@/pages/FreightReceipt";
import SharedContent from '@/pages/SharedContent';
import QuotationForm from "@/pages/QuotationForm";
import Quotations from "@/pages/Quotations";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Drivers Routes */}
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/driver/register" element={<DriverRegister />} />
        <Route path="/driver/:id/edit" element={<DriverEdit />} />
        
        {/* Clients Routes */}
        <Route path="/clients" element={<Clients />} />
        
        {/* Freights Routes */}
        <Route path="/freights" element={<Freights />} />
        <Route path="/freight/selection" element={<FreightSelection />} />
        <Route path="/freight/receipt/:id" element={<FreightReceipt />} />
        <Route path="/multi-freight/receipt" element={<MultiFreightReceipt />} />
        
        {/* Collection Orders Routes */}
        <Route path="/collection-orders" element={<CollectionOrders />} />
        <Route path="/collection-order/new" element={<CollectionOrder />} />
        <Route path="/collection-order/:id/edit" element={<CollectionOrderEdit />} />
        <Route path="/collection-order/:id/view" element={<CollectionOrderView />} />
        
        {/* Quotation Routes - NEW */}
        <Route path="/quotations" element={<Quotations />} />
        <Route path="/quotation/new" element={<QuotationForm />} />
      </Route>
      
      <Route path="/shared/:id" element={<SharedContent />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
