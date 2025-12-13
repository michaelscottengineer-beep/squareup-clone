import { Input } from "@/components/ui/input";
import SettingWrapper from "./SettingWrapper";
import { useState } from "react";

const ContentSetting = ({
  value,
  onValueChange,
  label,
}: {
  label?: string;
  value: string;
  onValueChange?: (value: string) => void;
}) => {
  const [curValue, setCurValue] = useState(value);

  return (
    <SettingWrapper label={label}>
      <Input
        className="rounded-lg"
        value={curValue}
        onChange={(e) => {
          const val = e.target.value;
          onValueChange?.(val);
          setCurValue(val);
        }}
      />
    </SettingWrapper>
  );
};

export default ContentSetting;
