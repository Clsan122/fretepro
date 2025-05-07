
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "@/components/auth/PrivateRoute";

// Public Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import SharedContent from "@/pages/SharedContent";

// Protected Pages
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Drivers from "@/pages/Drivers";
import DriverRegister from "@/pages/DriverRegister";
import DriverEdit from "@/pages/DriverEdit";
import Clients from "@/pages/Clients";
import Freights from "@/pages/Freights";
import CollectionOrders from "@/pages/CollectionOrders";
import CollectionOrder from "@/pages/CollectionOrder";
import CollectionOrderView from "@/pages/CollectionOrderView";
import CollectionOrderEdit from "@/pages/CollectionOrderEdit";
import FreightReceipt from "@/pages/FreightReceipt";
import MultiFreightReceipt from "@/pages/MultiFreightReceipt";
import Quotations from "@/pages/Quotations";
import QuotationForm from "@/pages/QuotationForm";
import QuotationView from "@/pages/QuotationView";
import QuotationEdit from "@/pages/QuotationEdit";
import FreightSelection from "@/pages/FreightSelection";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/shared/:type/:id" element={<SharedContent />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      
      {/* Driver Routes */}
      <Route path="/drivers" element={<PrivateRoute><Drivers /></PrivateRoute>} />
      <Route path="/driver/new" element={<PrivateRoute><DriverRegister /></PrivateRoute>} />
      <Route path="/driver/:id" element={<PrivateRoute><DriverEdit /></PrivateRoute>} />
      
      {/* Client Routes */}
      <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
      
      {/* Freight Routes */}
      <Route path="/freights" element={<PrivateRoute><Freights /></PrivateRoute>} />
      <Route path="/freight/:id/receipt" element={<PrivateRoute><FreightReceipt /></PrivateRoute>} />
      <Route path="/multi-freight-receipt" element={<PrivateRoute><MultiFreightReceipt /></PrivateRoute>} />
      <Route path="/freight-selection" element={<PrivateRoute><FreightSelection /></PrivateRoute>} />
      
      {/* Collection Order Routes */}
      <Route path="/collection-orders" element={<PrivateRoute><CollectionOrders /></PrivateRoute>} />
      <Route path="/collection-order/new" element={<PrivateRoute><CollectionOrder /></PrivateRoute>} />
      <Route path="/collection-order/:id" element={<PrivateRoute><CollectionOrderView /></PrivateRoute>} />
      <Route path="/collection-order/edit/:id" element={<PrivateRoute><CollectionOrderEdit /></PrivateRoute>} />
      
      {/* Quotation Routes */}
      <Route path="/quotations" element={<PrivateRoute><Quotations /></PrivateRoute>} />
      <Route path="/quotation/new" element={<PrivateRoute><QuotationForm /></PrivateRoute>} />
      <Route path="/quotation/view/:id" element={<PrivateRoute><QuotationView /></PrivateRoute>} />
      <Route path="/quotation/edit/:id" element={<PrivateRoute><QuotationEdit /></PrivateRoute>} />
      
      {/* 404 and Redirect */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};

export default AppRoutes;
