
import React from "react";
import { User } from "@/types";

interface DebugInfoProps {
  user: User | null;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ user }) => {
  return (
    <div className="bg-yellow-100 p-2 mb-4 rounded border border-yellow-400">
      Debug: Profile component is rendering. User data {user ? "is available" : "is NOT available"}
    </div>
  );
};

export default DebugInfo;
