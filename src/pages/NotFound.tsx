
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-6">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Página não encontrada</h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          A página que você está procurando não existe ou foi movida.
          <br />
          <span className="block mt-2 text-sm">
            Caminho: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{location.pathname}</span>
          </span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline"
            onClick={handleGoBack}
            className="w-full gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <Button 
            onClick={handleGoHome}
            className="w-full gap-2"
          >
            <Home className="h-4 w-4" />
            Ir para o Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
