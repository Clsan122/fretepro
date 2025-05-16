
import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginHero } from "@/components/auth/LoginHero";
import { LogoHeader } from "@/components/auth/LogoHeader";

const Login = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-freight-100 to-freight-200 dark:from-freight-900 dark:to-freight-950">
      <LoginHero />
      
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-md">
          <LogoHeader />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
