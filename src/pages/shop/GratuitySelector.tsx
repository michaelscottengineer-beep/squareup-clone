import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Form } from "@/components/ui/form";



interface GratuitySelectorProps {
  onChange?: (val: string) => void;
}

const GratuitySelector = ({ onChange }: GratuitySelectorProps) => {
  const [selectedTip, setSelectedTip] = useState("10%");
  const [customTip, setCustomTip] = useState("");

  const tipOptions = ["30%", "20%", "15%", "10%"];

  useEffect(() => {
    onChange?.(selectedTip)
  }, [selectedTip]);

  
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Gratuity (Optional)</h3>
      <div className="h-0.5 bg-black w-16"></div>

      <div className="flex gap-2">
        {tipOptions.map((tip) => (
          <Button
            key={tip}
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedTip(tip);
              setCustomTip("");
            }}
            className={`flex-1 h-12 rounded-lg border-2 ${
              selectedTip === tip
                ? "border-orange-400 bg-orange-50 text-orange-600 font-semibold"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {tip}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => setSelectedTip("Other")}
          className={`flex-1 h-12 rounded-lg border-2 ${
            selectedTip === "Other"
              ? "border-orange-400 bg-orange-50 text-orange-600 font-semibold"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          Other
        </Button>
      </div>

      {selectedTip === "Other" && (
        <Input
          type="number"
          placeholder="Enter custom tip amount"
          value={customTip}
          onChange={(e) => setCustomTip(e.target.value)}
          className="border-2 border-orange-400 rounded-lg h-12"
        />
      )}
    </div>
  );
};


export default GratuitySelector;
