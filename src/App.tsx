
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/auth";
import { SyncProvider } from "@/context/SyncProvider";
import { UpdateProvider } from "@/context/UpdateContext";
import AppRoutes from "@/routes/AppRoutes";
import { usePwaAutoInstall } from "@/hooks/usePwaAutoInstall";

const queryClient = new QueryClient();

const App = () => {
  usePwaAutoInstall();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SyncProvider>
              <UpdateProvider>
                <AppRoutes />
              </UpdateProvider>
            </SyncProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
