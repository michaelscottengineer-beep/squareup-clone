import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import SettingSection from ".";

const data = [
  {
    label: "Left to Right",
    value: "LTR",
  },
  {
    label: "Right to Left",
    value: "RTL",
  },
  {
    label: "Top to Bottom",
    value: "TTB",
  },
  {
    label: "Bottom to Top",
    value: "BTT",
  },
];

interface FlexLayoutSettingProps {
  label?: string;
  value: "LTR" | "RTL" | "TTB" | "BTT";
  onValueChange?: (val: "LTR" | "RTL" | "TTB" | "BTT") => void;
}
const FlexLayoutSetting = ({
  label,
  value,
  onValueChange,
}: FlexLayoutSettingProps) => {
  const [curValue, setCurValue] = useState(value ?? "LTR");

  return (
    <SettingSection label={label}>
      <RadioGroup
        defaultValue={curValue}
        onValueChange={(val: "LTR" | "RTL" | "TTB" | "BTT") => {
          setCurValue(val);
          onValueChange?.(val);
        }}
      >
        {data.map((item) => {
          return (
            <Label>
              <RadioGroupItem
                value={item.value}
                checked={item.value === curValue}
              />
              <span>{item.label}</span>
            </Label>
          );
        })}
      </RadioGroup>
    </SettingSection>
  );
};

export default FlexLayoutSetting;
