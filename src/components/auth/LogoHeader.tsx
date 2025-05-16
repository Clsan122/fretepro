
import React from "react";

export const LogoHeader = () => {
  return (
    <div className="text-center mb-8 lg:hidden">
      <img 
        src="/lovable-uploads/7a2e868d-b2ae-4a11-925f-49bcc1560c2a.png" 
        alt="FreteValor Logo" 
        className="h-20 mx-auto mb-4"
      />
      <h1 className="text-3xl font-bold text-freight-800 dark:text-white">FreteValor</h1>
      <p className="text-freight-600 dark:text-freight-300">Sistema de gestão de fretes e transportes</p>
    </div>
  );
};
