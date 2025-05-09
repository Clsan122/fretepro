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
import FreightFormPdfView from "@/pages/FreightFormPdfView";

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
import ClientRegister from "@/pages/ClientRegister";
import ClientEdit from "@/pages/ClientEdit";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/content/:contentId" element={<SharedContent />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/client/new" element={<ClientRegister />} />
        <Route path="/client/edit/:id" element={<ClientEdit />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/drivers/new" element={<DriverRegister />} />
        <Route path="/drivers/edit/:id" element={<DriverEdit />} />
        <Route path="/freights" element={<Freights />} />
        <Route path="/freight/selection" element={<FreightSelection />} />
        <Route path="/freight/receipt" element={<FreightReceipt />} />
        <Route path="/freight/:id/receipt" element={<FreightReceipt />} />
        <Route path="/freight-form/pdf" element={<FreightFormPdfView />} />
        <Route path="/multi-freight/receipt" element={<MultiFreightReceipt />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/collection-orders" element={<CollectionOrders />} />
        <Route path="/collection-orders/new" element={<CollectionOrder />} />
        <Route path="/collection-orders/edit/:id" element={<CollectionOrderEdit />} />
        <Route path="/collection-orders/view/:id" element={<CollectionOrderView />} />
        <Route path="/quotations" element={<Quotations />} />
        <Route path="/quotations/new" element={<QuotationForm />} />
        <Route path="/quotations/edit/:id" element={<QuotationEdit />} />
        <Route path="/quotations/view/:id" element={<QuotationView />} />
      </Route>

      {/* 404 and Redirect */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};

export default AppRoutes;
