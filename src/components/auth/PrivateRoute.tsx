
import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [redirectAttempted, setRedirectAttempted] = React.useState(false);
  
  // Adicionar log para depuração
  React.useEffect(() => {
    console.log("PrivateRoute - Auth state:", { 
      isAuthenticated: !!user, 
      loading, 
      path: location.pathname,
      redirectAttempted 
    });
    
    // Atualizar o status de redirecionamento após verificação de autenticação
    if (!loading && !redirectAttempted) {
      setRedirectAttempted(true);
    }
  }, [user, loading, location, redirectAttempted]);
  
  // Mostrar loading state enquanto a autenticação está sendo verificada
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-freight-600"></div>
      </div>
    );
  }
  
  // Redirecionar para login se não estiver autenticado
  if (!user) {
    console.log("PrivateRoute - Not authenticated, redirecting to login");
    // Salvar a localização atual para redirecionar de volta após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Se estiver autenticado, renderizar os componentes filhos
  console.log("PrivateRoute - Authenticated, rendering children");
  return <>{children}</>;
};

export default PrivateRoute;
