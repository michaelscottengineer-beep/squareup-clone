import React, { useEffect, useState, type CSSProperties } from "react";
import SettingSection from ".";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ColorSetting from "./ColorSetting";

type TData = {
  url: string;
  text?: string;
};
interface ButtonSettingProps {
  label?: string;
  initData: TData;
  onChangeCallback?: (data: TData) => void;
}
const ButtonSetting = ({
  label,
  initData,
  onChangeCallback,
}: ButtonSettingProps) => {
  const [data, setData] = useState(initData);

  useEffect(() => {
    onChangeCallback?.(data);
  }, [data]);

  return (
    <SettingSection label={label}>
      <div className="space-y-2">
        <Label>URL</Label>
        <Input
          value={data.url}
          onChange={(e) =>
            setData((prev) => ({ ...prev, url: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input
          value={data.text ?? ""}
          onChange={(e) =>
            setData((prev) => ({ ...prev, text: e.target.value }))
          }
        />
      </div>

    </SettingSection>
  );
};

export default ButtonSetting;
