
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface RedirectWrapperProps {
  children: React.ReactNode;
}

const RedirectWrapper: React.FC<RedirectWrapperProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Executa apenas na montagem inicial do componente
    if (location.pathname !== "/" && !location.pathname.startsWith("/login") && 
        !location.pathname.startsWith("/register") && 
        !location.pathname.startsWith("/forgot-password") && 
        !location.pathname.startsWith("/reset-password")) {
      navigate("/", { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default RedirectWrapper;
