"use client";

import type React from "react";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import type { SwitchProps } from "@radix-ui/react-switch";

interface CategoryChannelSelectionProps extends SwitchProps {
  aa?: string;
}

const CategoryChannelSelection = ({
  ...props
}: CategoryChannelSelectionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-6">Sales channels and hours</h2>

      {/* Points of Sale */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-1">
          <div className="text-foreground text-lg">📍</div>
          <div>
            <h3 className="font-semibold text-foreground">Points of sale</h3>
            <p className="text-sm text-muted-foreground">
              Categories appear on Standard mode and Retail mode only.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch {...props} />
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Info className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryChannelSelection;
