
import React from "react";
import { User } from "@/types";

interface DebugInfoProps {
  user: User | null;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ user }) => {
  // Only show debug info in development mode
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="bg-yellow-100 p-2 mb-4 rounded border border-yellow-400 text-xs">
      <details>
        <summary className="cursor-pointer font-semibold">Debug Information</summary>
        <div className="mt-2">
          <p>Profile component is rendering</p>
          <p>User data: {user ? "Available" : "NOT available"}</p>
          {user && (
            <pre className="mt-2 overflow-auto max-h-40">
              {JSON.stringify(user, null, 2)}
            </pre>
          )}
        </div>
      </details>
    </div>
  );
};

export default DebugInfo;
