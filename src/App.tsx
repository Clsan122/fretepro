
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import RedirectWrapper from "./components/auth/RedirectWrapper";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RedirectWrapper>
          <AppRoutes />
          <Toaster />
        </RedirectWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
