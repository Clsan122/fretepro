
import React from "react";
import { Label } from "@/components/ui/label";

export const createHighlightedLabel = (text: string) => (
  <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1 rounded-none">
    {text}
  </Label>
);
