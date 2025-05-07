
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NetworkStatusProvider } from "@/context/NetworkStatusContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <NetworkStatusProvider>
          <Router>
            <AuthProvider>
              <AppRoutes />
              <Toaster />
            </AuthProvider>
          </Router>
        </NetworkStatusProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
