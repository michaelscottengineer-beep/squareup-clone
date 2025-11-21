import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import SettingSection from ".";

interface ColorSettingProps {
  value?: string;
  label?: string;
  onValueChange?: (val: string) => void;
}
const ColorSetting = ({ value, label, onValueChange }: ColorSettingProps) => {
  const [color, setColor] = useState(value);

  return (
    <SettingSection label={label ?? ""}>
      <div className="flex gap-2 items-center">
        <Input
          type="color"
          value={color}
          onChange={(e) => {
            const val = e.target.value;
            setColor(val);
            onValueChange?.(val);
          }}
        />
        <Input
          value={color}
          onChange={(e) => {
            const val = e.target.value;
            setColor(val);
            onValueChange?.(val);
          }}
        />
      </div>
    </SettingSection>
  );
};

export default ColorSetting;
